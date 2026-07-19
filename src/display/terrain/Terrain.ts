import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../mesh/Mesh";
import TerrainGeometry from "./TerrainGeometry";
import TerrainMaterial from "./TerrainMaterial";
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
}

class Terrain extends Mesh {
    public quadtree: TerrainQuadtree;
    public instanceBuffer: GPUBuffer;
    public customVertexBindGroupLayout: GPUBindGroupLayout;
    #prevWorldSize: number = 0;
    #prevMaxLOD: number = 0;

    /**
     * [KO] Terrain 인스턴스를 생성합니다.
     * [EN] Creates a Terrain instance.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param heightmapUrl - [KO] 지형 높이맵 이미지의 자원 경로 (선택) [EN] Resource URL of the terrain heightmap image (optional)
     * @param name - [KO] 지형 객체 이름 [EN] Terrain object name
     */
    constructor(redGPUContext: RedGPUContext, heightmapUrl?: string, name?: string) {
        const geometry = new TerrainGeometry(redGPUContext);
        const material = new TerrainMaterial(redGPUContext); // 머티리얼은 지형 변위에 직접 관여하지 않고 독립 껍데기 유지

        super(redGPUContext, geometry, material, name);

        // 초기 기본 유니폼 파라미터 값 매핑
        this.minHeight = 0;
        this.maxHeight = 0.5; // 입체 높이 설정
        this.worldOffset = [0, 0];
        this.worldSize = [1, 1];
        this.maxLOD = 4; // 기본 최대 LOD 레벨
        this.baseSlotIndex = 0; // 셸이더에 전달할 baseSlotIndex (매 프레임 동기화)

        // 💡 중요: CDLOD 쿼드트리 자체 컬링을 신뢰하므로, Mesh 레벨의 프러스텀 컬링은 무시합니다.
        this.ignoreFrustumCulling = true;

        // 💡 지형 전용 고유의 Sampler 인스턴스를 실제로 생성하여 주입
        // 이음새(Seam) 부근에서 반대편 픽셀 높이가 끌려와 찢어지는 현상을 방지하기 위해 'clamp-to-edge' 사용이 수학적으로 타당합니다.
        this.heightTextureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });

        // 💡 1번 버텍스 바인드 그룹의 레이아웃을 Storage Buffer(인스턴스용)를 포함하는 커스텀 레이아웃으로 정의
        this.customVertexBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
            label: 'TERRAIN_VERTEX_GPUBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                {binding: 2, visibility: GPUShaderStage.VERTEX, texture: {}},
                {binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}}, // 쿼드 노드 인스턴스들
            ]
        });

        // 💡 인스턴스 전용 GPU Storage Buffer 생성 (최대 4096개 노드 지원)
        const maxInstances = 4096;
        this.instanceBuffer = redGPUContext.gpuDevice.createBuffer({
            size: maxInstances * 16, // 각 노드당 vec4<f32> (16바이트: worldXOffset, worldZOffset, scale, lodLevel)
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            label: 'TerrainInstanceBuffer'
        });

        if (heightmapUrl) {
            this.heightTexture = new BitmapTexture(redGPUContext, heightmapUrl);
        }
    }

    /**
     * [KO] 지형 전용 커스텀 버텍스 셰이더 모듈을 생성 및 반환합니다.
     * [EN] Creates and returns the custom vertex shader module for the terrain.
     */
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TERRAIN_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('TERRAIN_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);

        // 💡 1번 버텍스 바인드 그룹을 Terrain 고유의 직접 바인딩 디스크립터로 강제 재생성하여 덮어씁니다.
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
        }


        // 💡 baseSlotIndex를 매 프레임 동기화하여 셰이더에서 SSBO 슬롯 접근에 사용
        this.baseSlotIndex = this.globalVertexSlotIndex;

        const camera = renderViewStateData.view.rawCamera;

        // 💡 카메라 월드 좌표를 쿼드트리 로컬 공간으로 변환
        // 쿼드트리는 [0,0] ~ [worldSize,worldSize] 공간을 사용하므로
        // worldOffset만큼 빼서 로컬 좌표로 맞춰줍니다.
        const localCamX = camera.x - this.worldOffset[0];
        const localCamY = camera.y;                       // 높이 축은 변환 없음
        const localCamZ = camera.z - this.worldOffset[1]; // worldOffset[1] = Z 오프셋
        const cameraPos: [number, number, number] = [localCamX, localCamY, localCamZ];

        const planes = renderViewStateData.frustumPlanes;

        // 쿼드트리 순회 및 컬링 수행
        // - cameraPos: 쿼드트리 로컬 공간 (worldOffset 뺀 값)
        // - worldOffset[0/1]: 프러스텀 테스트를 위한 월드 공간 복원용
        this.quadtree.update(
            cameraPos,
            planes,
            this.minHeight,
            this.maxHeight,
            this.worldOffset[0],  // worldOffsetX: 프러스텀 테스트 시 로컬→월드 변환
            this.worldOffset[1],  // worldOffsetZ
            1.5                   // lodThreshold: 노드 크기의 1.5배 이내 시 분할
        );

        const leafNodes = this.quadtree.leafNodes;
        const count = leafNodes.length;

        if (count > 0) {
            const arrayBuffer = new Float32Array(count * 4);
            for (let i = 0; i < count; i++) {
                const node = leafNodes[i];
                // worldXOffset, worldZOffset, scale, lodLevel
                // 지 지형 자체의 worldOffset 누적 계산
                arrayBuffer[i * 4 + 0] = this.worldOffset[0] + node.offset[0];
                arrayBuffer[i * 4 + 1] = this.worldOffset[1] + node.offset[1];
                arrayBuffer[i * 4 + 2] = node.scale;
                arrayBuffer[i * 4 + 3] = node.lod;
            }
            this.redGPUContext.gpuDevice.queue.writeBuffer(this.instanceBuffer, 0, arrayBuffer, 0, count * 4);
        }

        // 💡 GPU 간접 드로우 인스턴스 개수 실시간 갱신
        if (this.gpuRenderInfo && this.drawCommandSlot && this.drawBufferManager) {
            this.drawBufferManager.setInstanceNum(this.drawCommandSlot, count);
        }

    }

    /**
     * [KO] 매 프레임 카메라 위치와 Frustum에 따라 쿼드트리를 갱신하고 GPU 인스턴스 버퍼를 갱신합니다.
     * [EN] Updates the quadtree and GPU instance buffer every frame according to the camera position and frustum.
     */
    render(renderViewStateData: any) {


        super.render(renderViewStateData);
    }

    /**
     * [KO] defineTexture 데코레이터 세터 작동 시 버텍스 셰이더 바인딩을 직접 갱신합니다.
     */
    updateTexture(prevTexture: any, texture: any) {
        if (prevTexture) {
            prevTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (texture) {
            texture.__addDirtyPipelineListener(this.#dirtyPipelineListener);
        }
    }

    /**
     * [KO] defineSampler 데코레이터 세터 작동 시 버텍스 샘플러 바인딩을 직접 갱신합니다.
     */
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
}

/**
 * [KO] Terrain 고유의 직접 바인딩 버텍스 바인드 그룹 디스크립터를 빌드합니다. (재질 및 공통코드 우회)
 */
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

// 버텍스 셰이더용 유니폼 속성 정의
defineNumber(Terrain, [
    {key: "minHeight", value: 0},
    {key: "maxHeight", value: 1},
    {key: "maxLOD", value: 4},
    {key: "baseSlotIndex", value: 0}
]);
defineVector2(Terrain, [
    {key: "worldOffset", value: [0, 0]},
    {key: "worldSize", value: [1, 1]}
]);

// 지형(Terrain) 메시 자체에 반응형 높이맵 텍스처 및 샘플러 속성 직접 주입
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
