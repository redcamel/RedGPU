import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import TerrainGeometry from "./TerrainGeometry";
import TerrainMaterial, {TerrainLayerConfig} from "./material/TerrainMaterial";
import BitmapTexture from "../../resources/texture/BitmapTexture";
import Sampler from "../../resources/sampler/Sampler";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import vertexModuleSource from "./vertex.wgsl";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import defineVector2 from "../../defineProperty/funcs/vector/defineVector2";
import defineTexture from "../../defineProperty/funcs/texture/defineTexture";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import {TerrainQuadtree} from "./TerrainQuadtree";
import {SpatialTileInfo, TerrainSpatialGrid} from "./TerrainSpatialGrid";
import updateTargetUniform from "../../defineProperty/core/updateTargetUniform";
import defineBoolean from "../../defineProperty/funcs/defineBoolean";

export type {TerrainLayerConfig};

/**
 * [KO] CDLOD 기반 지형 시스템을 총괄하는 디스플레이 메시 객체 클래스입니다.
 * [EN] Display mesh object class that manages the CDLOD-based terrain system.
 */
interface Terrain {
    minHeight: number;
    maxHeight: number;
    worldOffset: [number, number];
    worldSize: [number, number];
    heightTexture: BitmapTexture;
    heightTextureSampler: any;

    maxLOD: number;
    baseSlotIndex: number;
    gridSize: number;
    useMorph: boolean;
    enableStreaming: boolean;
}

class Terrain extends Mesh {
    quadtree: TerrainQuadtree;
    spatialGrid: TerrainSpatialGrid;
    instanceBuffer: GPUBuffer;
    customVertexBindGroupLayout: GPUBindGroupLayout;
    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;
    #lodRanges: Float32Array = new Float32Array(32);
    #onTileLoadCallback?: (tile: SpatialTileInfo) => void;
    #onTileUnloadCallback?: (tile: SpatialTileInfo) => void;

    constructor(redGPUContext: RedGPUContext, heightmapUrl?: string, name?: string) {
        const geometry = new TerrainGeometry(redGPUContext);
        const material = new TerrainMaterial(redGPUContext);

        super(redGPUContext, geometry, material, name);

        this.spatialGrid = new TerrainSpatialGrid(512, 2500);
        this.enableStreaming = false;

        this.minHeight = 0;
        this.maxHeight = 0.5;
        this.worldOffset = [-0.5, -0.5];
        this.worldSize = [1, 1];
        this.maxLOD = 4;
        this.baseSlotIndex = 0;
        this.gridSize = 64;
        this.useMorph = true;

        this.ignoreFrustumCulling = true;

        this.heightTextureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });

        this.customVertexBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
            label: 'TERRAIN_VERTEX_GPUBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX,
                    texture: {sampleType: 'float', viewDimension: '2d', multisampled: false}
                },
                {binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
            ]
        });

        const maxInstances = 4096;
        this.instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: maxInstances * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

        if (heightmapUrl) {
            this.heightTexture = new BitmapTexture(redGPUContext, heightmapUrl);
        }
    }

    /**
     * [KO] Terrain 텍스처를 URL 문자열만으로 간편하게 일괄 설정합니다.
     * 각 텍스처 타입에 맞는 GPU 포맷·밉맵 옵션을 내부에서 자동으로 적용합니다.
     *
     * [EN] Convenience method to set all terrain textures by URL.
     * Correct GPU format and mipmap options are applied internally for each texture type.
     *
     * @example
     * ```js
     * terrain.setup({
     *     height:    'path/to/height.jpg',
     *     baseColor: 'path/to/diffuse.jpg',
     *     orm:       'path/to/orm.jpg',
     *     splat:     'path/to/splatMap.jpg',
     * });
     * ```
     */
    setup(options: {
        /** [KO] 높이맵 URL — 밉맵 없음, r16float 포맷으로 자동 로딩 */
        height?: string;
        /** [KO] 글로벌 베이스 컬러(Diffuse) URL — sRGB 포맷으로 자동 로딩 */
        baseColor?: string;
        /** [KO] 글로벌 ORM 텍스처 URL — Linear(rgba8unorm) 포맷으로 자동 로딩 */
        orm?: string;
        /** [KO] 스플랫 맵 URL — Linear(rgba8unorm) 포맷으로 자동 로딩 */
        splat?: string;
    }): this {
        const ctx = this.redGPUContext;

        if (options.height) {
            // 💡 높이맵: 밉맵 불필요(CDLOD Morph가 LOD 처리), r16float 정밀도 포맷
            this.heightTexture = new BitmapTexture(ctx, options.height, false, null, null, 'r16float');
        }

        if (options.baseColor) {
            // 💡 베이스 컬러: sRGB 감마 정정 포맷 (BitmapTexture 기본값 = srgb, 명시 생략)
            this.material.baseColorTexture = new BitmapTexture(ctx, options.baseColor);
        }

        if (options.orm) {
            // 💡 ORM: Linear 포맷 필수 (감마 보정 없이 R=AO, G=Roughness, B=Metallic 수치 그대로)
            this.material.ormTexture = new BitmapTexture(ctx, options.orm, true, null, null, 'rgba8unorm');
        }

        if (options.splat) {
            // 💡 스플랫 맵: Linear 포맷 필수 (R,G,B,A 채널을 가중치 수치 그대로 샘플링)
            this.material.splatTexture = new BitmapTexture(ctx, options.splat, true, null, null, 'rgba8unorm');
        }

        return this;
    }

    override get material(): TerrainMaterial {
        return super.material as TerrainMaterial;
    }

    override set material(val: any) {
        throw new Error('Terrain.material is read-only and cannot be reassigned.');
    }

    get baseColorTexture(): BitmapTexture {
        return this.material.baseColorTexture;
    }

    set baseColorTexture(texture: BitmapTexture) {
        this.material.baseColorTexture = texture;
    }

    get ormTexture(): BitmapTexture {
        return this.material.ormTexture;
    }

    set ormTexture(texture: BitmapTexture) {
        this.material.ormTexture = texture;
    }

    get splatTexture(): BitmapTexture {
        return this.material.splatTexture;
    }

    set splatTexture(texture: BitmapTexture) {
        this.material.splatTexture = texture;
    }

    get tileScale(): number {
        return this.material.tileScale;
    }

    set tileScale(value: number) {
        this.material.tileScale = value;
    }

    get macroScale(): number {
        return this.material.macroScale;
    }

    set macroScale(value: number) {
        this.material.macroScale = value;
    }

    get metallicFactor(): number {
        return this.material.metallicFactor;
    }

    set metallicFactor(value: number) {
        this.material.metallicFactor = value;
    }

    get roughnessFactor(): number {
        return this.material.roughnessFactor;
    }

    set roughnessFactor(value: number) {
        this.material.roughnessFactor = value;
    }

    get normalScale(): number {
        return this.material.normalScale;
    }

    set normalScale(value: number) {
        this.material.normalScale = value;
    }

    get occlusionStrength(): number {
        return this.material.occlusionStrength;
    }

    set occlusionStrength(value: number) {
        this.material.occlusionStrength = value;
    }

    get blendContrast(): number {
        return this.material.blendContrast;
    }

    set blendContrast(value: number) {
        this.material.blendContrast = value;
    }

    get baseColorWeight(): number {
        return this.material.baseColorWeight;
    }

    set baseColorWeight(value: number) {
        this.material.baseColorWeight = value;
    }

    get baseColorBlendMode(): 'mix' | 'multiply' {
        return this.material.baseColorBlendMode;
    }

    set baseColorBlendMode(value: 'mix' | 'multiply') {
        this.material.baseColorBlendMode = value;
    }

    get layers(): TerrainLayerConfig[] {
        return this.material.layers || [];
    }

    /**
     * [KO] 단일 지형 디테일 레이어를 추가합니다. (최대 4개)
     * [EN] Adds a single terrain detail layer. (Maximum 4)
     */
    addLayer(config: TerrainLayerConfig): number {
        return this.material.addLayer(config);
    }

    /**
     * [KO] 인덱스 또는 이름을 기준으로 특정 레이어를 제거합니다.
     * [EN] Removes a specific layer by index or name.
     */
    removeLayer(indexOrName: number | string): boolean {
        return this.material.removeLayer(indexOrName);
    }

    /**
     * [KO] 인덱스 또는 이름을 기준으로 특정 레이어의 속성을 부분 수정합니다.
     * [EN] Partially updates properties of a specific layer by index or name.
     */
    updateLayer(indexOrName: number | string, partialConfig: Partial<TerrainLayerConfig>): boolean {
        return this.material.updateLayer(indexOrName, partialConfig);
    }

    get lodRanges(): Float32Array {
        return this.#lodRanges;
    }

    set lodRanges(value: Float32Array) {
        this.#lodRanges = value;
        updateTargetUniform(this, 'lodRanges', value);
    }

    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TERRAIN_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('TERRAIN_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);

        this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
            getTerrainVertexBindGroupDescriptor(this)
        );

        return shaderModule;
    }

    checkQuadtree(renderViewStateData: any) {
        const currentWorldSize = this.worldSize[0];
        if (!this.quadtree || this.#prevWorldSize !== currentWorldSize || this.#prevMaxLOD !== this.maxLOD) {
            this.quadtree = new TerrainQuadtree(currentWorldSize, this.maxLOD);
            this.#prevWorldSize = currentWorldSize;
            this.#prevMaxLOD = this.maxLOD;

            // LOD별 모핑 범위 계산 (vec4 8개 크기)
            const lodRanges = new Float32Array(32);
            const lodThreshold = 1.5; // TerrainQuadtree update 시 사용하는 임계값 배율
            const morphConstant = 0.5; // 자식 노드 크기 대비 모핑 구간 비율

            for (let i = 0; i <= this.maxLOD; i++) {
                const worldScale = currentWorldSize / Math.pow(2, i);

                // 분할 임계 거리 (Morph가 완전히 끝나는 부모 매칭 거리)
                const morphEnd = worldScale * lodThreshold;

                // 모핑이 시작되는 거리
                const morphStart = morphEnd - (worldScale * morphConstant);

                lodRanges[i * 4 + 0] = morphStart;
                lodRanges[i * 4 + 1] = morphEnd;
                lodRanges[i * 4 + 2] = 0;
                lodRanges[i * 4 + 3] = 0;
            }
            this.lodRanges = lodRanges;
        }

        this.baseSlotIndex = this.globalVertexSlotIndex;

        const camera = renderViewStateData.view.rawCamera;
        const localCamX = camera.x - this.worldOffset[0];
        const localCamY = camera.y;
        const localCamZ = camera.z - this.worldOffset[1];
        const cameraPos: [number, number, number] = [localCamX, localCamY, localCamZ];

        // 스트리밍 옵션이 활성화된 경우 카메라 위치에 따라 동적 그리드 타일 갱신
        if (this.enableStreaming && this.spatialGrid) {
            const minX = this.worldOffset[0];
            const minZ = this.worldOffset[1];
            const maxX = minX + this.worldSize[0];
            const maxZ = minZ + this.worldSize[1];
            this.spatialGrid.setTerrainBounds(minX, minZ, maxX, maxZ);

            const camFwd = camera.cameraVector ? camera.cameraVector.forward : undefined;
            const camDir: [number, number, number] | undefined = camFwd ? [camFwd[0], camFwd[1], camFwd[2]] : undefined;

            const {toLoad, toUnload} = this.spatialGrid.update([camera.x, camera.y, camera.z], camDir);
            if (toLoad.length > 0 && this.#onTileLoadCallback) {
                toLoad.forEach(tile => this.#onTileLoadCallback!(tile));
            }
            if (toUnload.length > 0 && this.#onTileUnloadCallback) {
                toUnload.forEach(tile => this.#onTileUnloadCallback!(tile));
            }
        }

        const planes = renderViewStateData.frustumPlanes;

        this.quadtree.update(
            cameraPos,
            planes,
            this.minHeight,
            this.maxHeight,
            this.worldOffset[0],
            this.worldOffset[1],
            1.5
        );

        const leafNodes = this.quadtree.leafNodes;
        const count = leafNodes.length;

        if (count > 0) {
            const arrayBuffer = new Float32Array(count * 4);
            for (let i = 0; i < count; i++) {
                const node = leafNodes[i];
                // 💡 중요: Geometry가 중앙 정렬(-0.5 ~ 0.5)로 변경되었으므로,
                // 노드의 렌더링 원점을 좌상단(offset)이 아닌 노드의 '중앙(Center)'으로 맞춥니다.
                const centerX = node.offset[0] + (node.scale * 0.5);
                const centerZ = node.offset[1] + (node.scale * 0.5);

                arrayBuffer[i * 4 + 0] = this.worldOffset[0] + centerX;
                arrayBuffer[i * 4 + 1] = this.worldOffset[1] + centerZ;
                arrayBuffer[i * 4 + 2] = node.scale;
                arrayBuffer[i * 4 + 3] = node.lod;
            }
            this.redGPUContext.gpuDevice.queue.writeBuffer(this.instanceBuffer, 0, arrayBuffer, 0, count * 4);
        }

        if (this.gpuRenderInfo && this.drawCommandSlot && this.drawBufferManager) {
            this.drawBufferManager.setInstanceNum(this.drawCommandSlot, count);
        }
    }

    render(renderViewStateData: any) {
        // RVT 자동 베이킹: 더티 새로울 때마다 실행되지 않고 isDirty일 때만 실행
        // this.#rvt.checkAndBake(this.material)

        super.render(renderViewStateData);
    }


    updateTexture(prevTexture: any, texture: any) {
        if (prevTexture) {
            prevTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (texture) {
            texture.__addDirtyPipelineListener(this.#dirtyPipelineListener);
        }
    }

    updateSampler(prevSampler: any, sampler: any) {
        this.#dirtyPipelineListener()
    }

    destroy() {
        if (this.heightTexture) {
            this.heightTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (this.instanceBuffer) {
            this.instanceBuffer.destroy();
            this.instanceBuffer = null;
        }
        super.destroy();
    }

    #dirtyPipelineListener = () => {
        if (this.gpuRenderInfo && this.redGPUContext) {
            this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
                getTerrainVertexBindGroupDescriptor(this)
            );
            this.dirtyPipeline = true
        }
    }

    setOnTileLoad(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileLoadCallback = callback;
    }

    setOnTileUnload(callback: (tile: SpatialTileInfo) => void) {
        this.#onTileUnloadCallback = callback;
    }
}

const getTerrainVertexBindGroupDescriptor = (mesh: Terrain) => {
    const {redGPUContext} = mesh;
    const {resourceManager} = redGPUContext;
    const layout = mesh.customVertexBindGroupLayout;

    return {
        label: `TERRAIN_VERTEX_GPUBindGroup`,
        layout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mesh.gpuRenderInfo.vertexUniformBuffer.gpuBuffer
                }
            },
            {
                binding: 1,
                resource: mesh.heightTextureSampler?.gpuSampler || resourceManager.basicDisplacementSampler.gpuSampler
            },
            {
                binding: 2,
                resource: resourceManager.getGPUResourceBitmapTextureView(mesh.heightTexture) || resourceManager.emptyBitmapTextureView
            },
            {
                binding: 3,
                resource: {
                    buffer: mesh.instanceBuffer
                }
            }
        ]
    };
};

defineNumber(Terrain, [
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1},
    {key: "maxLOD", value: 4},
    {key: "baseSlotIndex", value: 0},
    {key: "gridSize", value: 64}
]);
defineVector2(Terrain, [
    {key: "worldOffset", value: [0, 0]},
    {key: "worldSize", value: [1, 1]}
]);

defineBoolean(Terrain, [
    {key: "useMorph", value: true},
    {key: "enableStreaming", value: false}
]);

defineTexture(Terrain, [
    {key: "heightTexture"}
]);
defineSampler(Terrain, [
    {key: "heightTextureSampler"}
]);
Object.defineProperty(Terrain.prototype, 'isTerrain', {
    value: true,
    writable: false
});
Object.freeze(Terrain);
export default Terrain;