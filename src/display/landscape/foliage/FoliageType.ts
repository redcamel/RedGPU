import {mat4} from 'gl-matrix';
import RedGPUContext from '../../../context/RedGPUContext';
import Mesh from '../../mesh/Mesh';
import Geometry from '../../../geometry/Geometry';
import VertexBuffer from '../../../resources/buffer/vertexBuffer/VertexBuffer';
import IndexBuffer from '../../../resources/buffer/indexBuffer/IndexBuffer';
import {FoliageInstanceBuffer} from './FoliageInstanceBuffer';
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import {createCrossBillboardGeometry} from "./geometry/createCrossBillboardGeometry";
import {FoliageImpostorBaker} from "./baker/FoliageImpostorBaker";
import CrossBillboardMaterial from "./material/CrossBillboardMaterial";


export interface FoliageSubMesh {
    readonly mesh: Mesh;
    geometry: any;
    readonly material: any;
    indexCount: number;
    vertexCount: number;
    isIndexed: boolean;
    readonly indexFormat: GPUIndexFormat;
    readonly strideBytes: number;
    readonly bottomOffset: number;
    readonly relativeModelMatrix: mat4;
    readonly relativeNormalMatrix: mat4;
    readonly vertexUniformBuffer: GPUBuffer;
    readonly vertexUniformBindGroup: GPUBindGroup;
    readonly lodIndex?: number; // 0: LOD0 (3D 풀 지오메트리), 1: LOD1 (십자 빌보드)

    // 🌟 렌더 루프 CPU 조건문 중복 순회 제거용 불변 사전 태깅 플래그
    readonly isDepthPrepass: boolean;
    readonly isMainOpaqueOrMasked: boolean;
    readonly mainDepthMode: 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';
    readonly isAlpha: boolean;
    readonly isTransparent: boolean;
}

export interface FoliageBillboardOptions {
    /**
     * [KO] 십자 빌보드(Cross Billboard Impostor) 활성화 여부 (기본: false)
     * [EN] Whether to enable Cross Billboard Impostor (default: false)
     */
    enabled?: boolean;
    /**
     * [KO] 빌보드 텍스처
     * [EN] Billboard texture
     */
    texture?: any;
    /**
     * [KO] 빌보드 머티리얼 (지정하지 않으면 FoliageMaterial 기본 생성)
     * [EN] Billboard material (creates FoliageMaterial by default if not specified)
     */
    material?: any;
    /**
     * [KO] 빌보드 가로 폭 (기본값: 수목 폭 또는 6.0)
     * [EN] Billboard width (default: tree width or 6.0)
     */
    width?: number;
    /**
     * [KO] 빌보드 세로 높이 (기본값: 수목 높이 또는 8.0)
     * [EN] Billboard height (default: tree height or 8.0)
     */
    height?: number;
    /**
     * [KO] 3D 모델에서 빌보드로 전환되는 거리 (m, 기본: 80.0)
     * [EN] Transition distance from 3D model to billboard (m, default: 80.0)
     */
    lodDistance?: number;
    /**
     * [KO] LOD 전환 시 디더링 크로스페이드 구간 범위 (m, 기본: 30.0)
     * [EN] Dithered crossfade transition range in meters (default: 30.0)
     */
    fadeRange?: number;
}


export interface FoliageTypeOptions {
    name: string;
    /**
     * 단일 Mesh, Mesh 배열, 또는 glTF 루트 계층 Mesh(자식 노드 포함) 모두 수용
     */
    mesh: Mesh | Mesh[];
    maxInstances?: number;

    // Culling & Fade Out
    cullingDistance?: number;               // 시선 최장 표시 거리 (m, 기본: 2000)
    fadeStartDistance?: number;             // 소멸 축소 시작 거리 (m, 기본: 1500)

    minScale?: [number, number, number];
    maxScale?: [number, number, number];
    randomRotationY?: boolean;

    /**
     * [KO] 3D 모델에서 빌보드로 전환되는 LOD 거리 (m, 기본: 80.0)
     * [EN] LOD transition distance from 3D model to billboard (m, default: 80.0)
     */
    lodDistance?: number;

    /**
     * [KO] 언리얼 엔진 스타일 십자 빌보드(Cross-Billboard Impostor) 옵션
     * [EN] Unreal Engine style Cross-Billboard Impostor options
     */
    billboard?: FoliageBillboardOptions;

    /**
     * [KO] 반투명(BLEND) 머티리얼을 언리얼 엔진 표준인 알파 컷오프(MASK)로 자동 변환할지 여부 (기본: true)
     * [EN] Whether to automatically convert BLEND materials to Unreal Engine standard MASK (alpha cutoff) (default: true)
     */
    convertBlendToMasked?: boolean;

    /**
     * [KO] 언리얼 엔진 스타일: 동일 머티리얼을 공유하는 서브메시들을 1개의 지오메트리로 자동 병합할지 여부 (기본: true)
     * [EN] Unreal Engine style: Whether to automatically combine submeshes sharing the same material into a single geometry (default: true)
     */
    combineSubMeshesByMaterial?: boolean;
}


/**
 * FoliageType
 * 개별 식생 종(Species)의 지오메트리 계층(Multi-Submesh), 머티리얼, 인스턴싱 버퍼 및 파퓰레이션 관리
 */
export class FoliageType {
    readonly redGPUContext: RedGPUContext;
    readonly options: Required<FoliageTypeOptions>;
    readonly instanceBuffer: FoliageInstanceBuffer;
    readonly subMeshes: FoliageSubMesh[] = [];

    foliageManager?: any;
    lod0SubMeshCount: number = 1;
    hasBillboard: boolean = false;
    lodDistance: number = 80.0;
    lodFadeRange: number = 30.0;

    #activeInstanceCount: number = 0;
    #bottomOffset: number | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #loadedTileKeys: Set<string> = new Set();

    constructor(redGPUContext: RedGPUContext, options: FoliageTypeOptions) {
        this.redGPUContext = redGPUContext;
        this.options = {
            name: options.name,
            mesh: options.mesh,
            maxInstances: options.maxInstances ?? 50000,
            cullingDistance: options.cullingDistance ?? 2000.0,
            fadeStartDistance: options.fadeStartDistance ?? 1500.0,
            minScale: options.minScale ?? [1.0, 1.0, 1.0],
            maxScale: options.maxScale ?? [1.0, 1.0, 1.0],
            randomRotationY: options.randomRotationY ?? true,
            lodDistance: options.lodDistance ?? (options.billboard?.lodDistance ?? 80.0),
            billboard: options.billboard ?? {enabled: false},
            convertBlendToMasked: options.convertBlendToMasked ?? true,
            combineSubMeshesByMaterial: options.combineSubMeshesByMaterial ?? true,
        };

        this.hasBillboard = !!this.options.billboard?.enabled;
        this.lodDistance = this.options.lodDistance;
        this.lodFadeRange = this.options.billboard?.fadeRange ?? 30.0;

        this.#initSubMeshBindGroupLayout();

        this.#collectSubMeshes(options.mesh);
        this.instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.options.maxInstances, this.subMeshes);
        this.updateIndirectBuffer();
    }


    get activeInstanceCount(): number {
        return this.#activeInstanceCount;
    }

    get name(): string {
        return this.options.name;
    }

    get maxInstances(): number {
        return this.options.maxInstances;
    }

    get bottomOffset(): number {
        if (this.#bottomOffset !== null) return this.#bottomOffset;
        if (this.subMeshes.length > 0) {
            let minOffset = 0;
            for (let i = 0; i < this.subMeshes.length; i++) {
                minOffset = Math.min(minOffset, this.subMeshes[i].bottomOffset);
            }
            this.#bottomOffset = minOffset;
            return minOffset;
        }
        return 0;
    }

    getGeometryBottomOffset(): number {
        return this.bottomOffset;
    }

    /**
     * 식생 인스턴스를 대량 배치 (Float32Array 12 floats: pos.xyz, rotQuat.xyzw, scale.xyz, extra.xy)
     */
    setInstancesData(data: Float32Array, count?: number) {
        const instanceCount = count !== undefined ? count : Math.floor(data.length / 12);
        this.#activeInstanceCount = Math.min(instanceCount, this.options.maxInstances);
        this.instanceBuffer.dataBuffer.set(data.subarray(0, this.#activeInstanceCount * 12));
        this.instanceBuffer.uploadToGPU(this.#activeInstanceCount);
        this.updateIndirectBuffer();

    }

    /**
     * 식생 다중 서브메시 인다이렉트 버퍼의 파라미터를 최신 지오메트리 정보로 갱신
     */
    updateIndirectBuffer() {
        if (!this.instanceBuffer || this.subMeshes.length === 0) return;
        this.instanceBuffer.resetMultiIndirectCount(this.subMeshes);
    }

    /**
     * [KO] 지형 타일(LandscapeComponent) 1개가 로딩 완수되었을 때 해당 타일 영역 식생만 부분 업로드합니다.
     */
    populateTile(comp: any, targetCountPerTile?: number): void {
        const key = `${comp.componentZ}_${comp.componentX}`;
        if (this.#loadedTileKeys.has(key)) return;
        this.#loadedTileKeys.add(key);

        const landscape = this.foliageManager?.landscape;
        const compCountX = landscape?.componentCount?.[0] ?? 8;
        const totalTiles = compCountX * compCountX;

        // 타일별 배치 인스턴스 수
        const countForThisTile = targetCountPerTile ?? Math.floor(this.options.maxInstances / totalTiles);
        if (countForThisTile <= 0) return;

        const tileSizeMeters = comp.componentSizeQuads || ((landscape && landscape.worldSize) ? landscape.worldSize[0] / compCountX : 1000);
        const halfTile = tileSizeMeters * 0.5;

        const minX = comp.worldX - halfTile;
        const maxX = comp.worldX + halfTile;
        const minZ = comp.worldZ - halfTile;
        const maxZ = comp.worldZ + halfTile;

        const startIdx = this.#activeInstanceCount;
        const endIdx = Math.min(startIdx + countForThisTile, this.options.maxInstances);
        const actualCount = endIdx - startIdx;
        if (actualCount <= 0) return;

        const {minScale, maxScale, randomRotationY} = this.options;
        const rangeX = maxX - minX;
        const rangeZ = maxZ - minZ;

        const scaleDiffX = maxScale[0] - minScale[0];
        const scaleDiffY = maxScale[1] - minScale[1];
        const scaleDiffZ = maxScale[2] - minScale[2];

        for (let i = 0; i < actualCount; i++) {
            const idx = startIdx + i;
            const posX = minX + Math.random() * rangeX;
            const posZ = minZ + Math.random() * rangeZ;

            const scaleX = minScale[0] + Math.random() * scaleDiffX;
            const scaleY = minScale[1] + Math.random() * scaleDiffY;
            const scaleZ = minScale[2] + Math.random() * scaleDiffZ;

            const posY = 0.0;

            let rotX = 0, rotY = 0, rotZ = 0, rotW = 1;
            if (randomRotationY) {
                const angle = Math.random() * Math.PI * 2;
                rotY = Math.sin(angle * 0.5);
                rotW = Math.cos(angle * 0.5);
            }

            this.instanceBuffer.setInstanceData(idx, posX, posY, posZ, rotX, rotY, rotZ, rotW, scaleX, scaleY, scaleZ, 1.0, 0);
        }

        this.#activeInstanceCount += actualCount;

        // 해당 타일 영역 식생 인스턴스 데이터만 GPU 버퍼 부분 패치 업로드
        this.instanceBuffer.uploadRangeToGPU(startIdx, actualCount);
        this.updateIndirectBuffer();
    }

    populateFromLandscape(): void {
        const landscape = this.foliageManager?.landscape;
        const tileStreamer = landscape?.tileStreamer;
        if (!tileStreamer) return;
        const activeTiles = tileStreamer.loadedComponents;
        if (Array.isArray(activeTiles)) {
            for (let i = 0; i < activeTiles.length; i++) {
                this.populateTile(activeTiles[i]);
            }
        }
    }


    destroy() {
        this.instanceBuffer.destroy();
        for (let i = 0; i < this.subMeshes.length; i++) {
            const sub = this.subMeshes[i];
            if (sub.vertexUniformBuffer) {
                sub.vertexUniformBuffer.destroy();
            }
        }
        this.subMeshes.length = 0;
    }

    #initSubMeshBindGroupLayout() {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#subMeshVertexBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: `FoliageSubMesh_VertexBindGroupLayout_${this.name}`,
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });
    }

    /**
     * [KO] 빌보드(LOD1)의 라인 모드(와이어프레임) 표시 여부를 실시간으로 전환합니다.
     */
    setBillboardWireframe(wireframe: boolean): void {
        const billboardSub = this.subMeshes.find(s => s.lodIndex === 1);
        if (!billboardSub) return;

        const bbWidth = (billboardSub as any)._bakedWidth ?? 6.0;
        const bbHeight = (billboardSub as any)._bakedHeight ?? 8.0;

        const newGeom = createCrossBillboardGeometry(this.redGPUContext, bbWidth, bbHeight, 0.6, wireframe);
        billboardSub.geometry = newGeom;
        billboardSub.mesh.geometry = newGeom;
        billboardSub.indexCount = newGeom.indexBuffer?.indexCount || 0;
        billboardSub.vertexCount = newGeom.vertexBuffer?.vertexCount || 0;
        billboardSub.isIndexed = !!newGeom.indexBuffer;

        if (billboardSub.material) {
            billboardSub.material.wireframe = wireframe;
            billboardSub.material.useCutOff = !wireframe;
            if (billboardSub.material._updateFragmentState) {
                billboardSub.material._updateFragmentState();
            }
        }
        this.updateIndirectBuffer();
    }

    /**
     * 루트 메시로부터 DFS로 자식들을 탐색하고, 동일 머티리얼별로 지오메트리를 자동 병합(Combine)하여 서브메시 생성
     */
    #collectSubMeshes(rootInput: Mesh | Mesh[]) {
        const subList = this.subMeshes;
        subList.length = 0;

        const bindGroupLayout = this.#subMeshVertexBindGroupLayout;
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!bindGroupLayout || !gpuDevice) return;

        const roots = Array.isArray(rootInput) ? rootInput : [rootInput];

        interface RawSubMesh {
            node: Mesh;
            geometry: any;
            material: any;
            currentRelativeMatrix: mat4;
            normalMatrix: mat4;
            strideBytes: number;
            rawStride: number;
        }

        const rawList: RawSubMesh[] = [];

        const computeMeshLocalMatrix = (mesh: Mesh): mat4 => {
            const out = mat4.create();
            const x = mesh.x ?? 0;
            const y = mesh.y ?? 0;
            const z = mesh.z ?? 0;
            const radX = (mesh.rotationX ?? 0) * (Math.PI / 180);
            const radY = (mesh.rotationY ?? 0) * (Math.PI / 180);
            const radZ = (mesh.rotationZ ?? 0) * (Math.PI / 180);
            const sX = mesh.scaleX ?? 1;
            const sY = mesh.scaleY ?? 1;
            const sZ = mesh.scaleZ ?? 1;

            out[12] = x;
            out[13] = y;
            out[14] = z;
            out[15] = 1;

            const aSx = Math.sin(radX), aCx = Math.cos(radX);
            const aSy = Math.sin(radY), aCy = Math.cos(radY);
            const aSz = Math.sin(radZ), aCz = Math.cos(radZ);

            const b00 = aCy * aCz;
            const b01 = aCx * aSz + aSx * aSy * aCz;
            const b02 = aSx * aSz - aCx * aSy * aCz;

            const b10 = -aCy * aSz;
            const b11 = aCx * aCz - aSx * aSy * aSz;
            const b12 = aSx * aCz + aCx * aSy * aSz;

            const b20 = aSy;
            const b21 = -aSx * aCy;
            const b22 = aCx * aCy;

            out[0] = b00 * sX;
            out[1] = b01 * sX;
            out[2] = b02 * sX;
            out[3] = 0;

            out[4] = b10 * sY;
            out[5] = b11 * sY;
            out[6] = b12 * sY;
            out[7] = 0;

            out[8] = b20 * sZ;
            out[9] = b21 * sZ;
            out[10] = b22 * sZ;
            out[11] = 0;

            return out;
        };

        const traverse = (node: Mesh, parentRelativeMatrix: mat4, isRoot: boolean) => {
            if (!node) return;

            const currentRelativeMatrix = mat4.create();
            if (isRoot) {
                mat4.identity(currentRelativeMatrix);
            } else {
                const nodeLocalMatrix = computeMeshLocalMatrix(node);
                mat4.multiply(currentRelativeMatrix, parentRelativeMatrix, nodeLocalMatrix);
            }

            if (node.geometry && node.material) {
                const mat = node.material;

                // 🌲 UE5 표준 식생 최적화: BLEND/반투명 머티리얼을 MASK(알파 컷오프)로 자동 승격
                if (this.options.convertBlendToMasked) {
                    if (mat.alphaBlend === 2 || mat.transparent || mat.alphaMode === 'BLEND' || mat.alphaMode === 'MASK') {
                        mat.useCutOff = true;
                        if (!mat.cutOff || mat.cutOff === 0) {
                            mat.cutOff = 0.5;
                        }
                        const {blendColorState, blendAlphaState} = mat
                        blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE
                        blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO
                        blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE
                        blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO
                        mat.transparent = false;
                        mat.alphaBlend = 1;
                    }
                }

                if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
                    mat._updateFragmentState();
                    mat.dirtyPipeline = false;
                }

                const geom = node.geometry;
                const rawStride = (geom.vertexBuffer as any)?.stride || 12;
                const strideBytes = rawStride * 4;

                const normalMatrix = mat4.create();
                mat4.invert(normalMatrix, currentRelativeMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                rawList.push({
                    node,
                    geometry: geom,
                    material: mat,
                    currentRelativeMatrix,
                    normalMatrix,
                    strideBytes,
                    rawStride,
                });
            }

            const children = node.children;
            if (children && children.length > 0) {
                for (let i = 0; i < children.length; i++) {
                    traverse(children[i] as Mesh, currentRelativeMatrix, false);
                }
            }
        };

        const identityParentMatrix = mat4.create();
        mat4.identity(identityParentMatrix);

        for (let r = 0; r < roots.length; r++) {
            traverse(roots[r], identityParentMatrix, true);
        }

        // 🌟 3단계: 언리얼 엔진 스타일 "머티리얼별 서브메시 자동 병합(Combine Meshes by Material)"
        const getMaterialKey = (mat: any): string => {
            if (!mat) return 'default_mat';
            const matType = mat.constructor?.name || 'Material';
            const diffuseKey = mat.baseColorTexture?.src || mat.diffuseTexture?.src || mat.baseColorTexture?.url || mat.diffuseTexture?.url || (mat.baseColorTexture ? mat.baseColorTexture.uuid : '');
            const normalKey = mat.normalTexture?.src || mat.normalTexture?.url || (mat.normalTexture ? mat.normalTexture.uuid : '');
            const ormKey = mat.ormTexture?.src || mat.ormTexture?.url || (mat.ormTexture ? mat.ormTexture.uuid : '');
            return `${matType}_${diffuseKey}_${normalKey}_${ormKey}`;
        };

        const materialGroups = new Map<string, { material: any; raws: RawSubMesh[] }>();
        for (let i = 0; i < rawList.length; i++) {
            const raw = rawList[i];
            const matKey = getMaterialKey(raw.material);
            let entry = materialGroups.get(matKey);
            if (!entry) {
                entry = {material: raw.material, raws: []};
                materialGroups.set(matKey, entry);
            }
            entry.raws.push(raw);
        }


        const createSubMeshInstance = (
            meshNode: Mesh,
            geom: any,
            mat: any,
            relMatrix: mat4,
            normMatrix: mat4,
            strideBytes: number,
            lodIndex: number = 0
        ): FoliageSubMesh => {
            const isIndexed = !!geom.indexBuffer;
            const indexCount = geom.indexBuffer?.indexCount ?? 0;
            const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;

            const uniformBuffer = gpuDevice.createBuffer({
                label: `FoliageSubMesh_UniformBuffer_${meshNode.name || subList.length}`,
                size: 144,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const uniformArrayBuffer = new ArrayBuffer(144);
            const floatView = new Float32Array(uniformArrayBuffer);
            const uintView = new Uint32Array(uniformArrayBuffer);

            floatView.set(relMatrix, 0);
            floatView.set(normMatrix, 16);
            uintView[32] = (mat as any)?.globalFragmentSlotIndex ?? 0;

            // 🌟 relMatrix가 항등 행렬(Identity)인지 고속 검사 (병합 메시 및 빌보드는 행렬 곱셈 100% 스킵)
            const isIdentity = (
                relMatrix[0] === 1 && relMatrix[1] === 0 && relMatrix[2] === 0 && relMatrix[3] === 0 &&
                relMatrix[4] === 0 && relMatrix[5] === 1 && relMatrix[6] === 0 && relMatrix[7] === 0 &&
                relMatrix[8] === 0 && relMatrix[9] === 0 && relMatrix[10] === 1 && relMatrix[11] === 0 &&
                relMatrix[12] === 0 && relMatrix[13] === 0 && relMatrix[14] === 0 && relMatrix[15] === 1
            );
            uintView[33] = isIdentity ? 0 : 1; // hasHierarchyTransform
            uintView[34] = 0;
            uintView[35] = 0;

            gpuDevice.queue.writeBuffer(uniformBuffer, 0, uniformArrayBuffer, 0, 144);

            const vertexBindGroup = gpuDevice.createBindGroup({
                label: `FoliageSubMesh_VertexBindGroup_${meshNode.name || subList.length}`,
                layout: bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {buffer: uniformBuffer}
                    }
                ]
            });

            const isTransparent = !!mat.transparent || !!mat.use2PathRender;
            const isAlpha = (mat.alphaBlend === 2 || (mat.opacity !== undefined && mat.opacity < 1.0)) && !isTransparent;
            const isLOD0 = lodIndex === 0 || lodIndex === undefined;
            const isMasked = !!mat.useCutOff || (mat.cutOff !== undefined && mat.cutOff > 0);

            const isDepthPrepass = !isTransparent && !isAlpha && isLOD0 && isMasked;
            const isMainOpaqueOrMasked = !isTransparent && !isAlpha;
            const mainDepthMode = (isLOD0 && isMasked) ? 'mainShadingAfterDepth' : 'normal';

            return {
                mesh: meshNode,
                geometry: geom,
                material: mat,
                indexCount,
                vertexCount,
                isIndexed,
                indexFormat: geom.indexBuffer?.format || 'uint32',
                strideBytes,
                bottomOffset: 0,
                relativeModelMatrix: relMatrix,
                relativeNormalMatrix: normMatrix,
                vertexUniformBuffer: uniformBuffer,
                vertexUniformBindGroup: vertexBindGroup,
                lodIndex,
                isDepthPrepass,
                isMainOpaqueOrMasked,
                mainDepthMode,
                isAlpha,
                isTransparent,
            };
        };

        materialGroups.forEach((entry) => {
            const group = entry.raws;
            const mat = entry.material;
            if (!this.options.combineSubMeshesByMaterial || group.length === 1) {

                // 단일 서브메시: 그대로 등록 (LOD 0)
                for (let g = 0; g < group.length; g++) {
                    const raw = group[g];
                    subList.push(createSubMeshInstance(
                        raw.node,
                        raw.geometry,
                        raw.material,
                        raw.currentRelativeMatrix,
                        raw.normalMatrix,
                        raw.strideBytes,
                        0
                    ));
                }
            } else {
                // 🌟 복수 서브메시 병합 (Combine SubMeshes by Material - LOD 0)
                let totalVertexCount = 0;
                let totalIndexCount = 0;
                const rawStride = group[0].rawStride;
                const interleavedStruct = group[0].geometry.vertexBuffer?.interleavedStruct;

                for (let g = 0; g < group.length; g++) {
                    const geom = group[g].geometry;
                    totalVertexCount += geom.vertexBuffer?.vertexCount ?? 0;
                    totalIndexCount += geom.indexBuffer?.indexCount ?? (geom.vertexBuffer?.vertexCount ?? 0);
                }

                const combinedVertexData = new Float32Array(totalVertexCount * rawStride);
                const combinedIndexData = new Uint32Array(totalIndexCount);

                let vertexOffset = 0;
                let indexOffset = 0;

                for (let g = 0; g < group.length; g++) {
                    const raw = group[g];
                    const geom = raw.geometry;
                    const srcVB = geom.vertexBuffer;
                    const srcIB = geom.indexBuffer;
                    const srcVData = srcVB?.data;
                    const srcIData = srcIB?.data;
                    const vCount = srcVB?.vertexCount ?? 0;


                    if (srcVData && vCount > 0) {
                        const m = raw.currentRelativeMatrix;
                        const n = raw.normalMatrix;

                        for (let v = 0; v < vCount; v++) {
                            const srcIdx = v * rawStride;
                            const dstIdx = (vertexOffset + v) * rawStride;

                            // 1. 포지션 변환 (x, y, z * relativeModelMatrix)
                            const x = srcVData[srcIdx + 0];
                            const y = srcVData[srcIdx + 1];
                            const z = srcVData[srcIdx + 2];

                            combinedVertexData[dstIdx + 0] = m[0] * x + m[4] * y + m[8] * z + m[12];
                            combinedVertexData[dstIdx + 1] = m[1] * x + m[5] * y + m[9] * z + m[13];
                            combinedVertexData[dstIdx + 2] = m[2] * x + m[6] * y + m[10] * z + m[14];

                            // 2. 노멀 변환 (nx, ny, nz * normalMatrix 및 정규화)
                            if (rawStride >= 6) {
                                const nx = srcVData[srcIdx + 3];
                                const ny = srcVData[srcIdx + 4];
                                const nz = srcVData[srcIdx + 5];

                                let tx = n[0] * nx + n[4] * ny + n[8] * nz;
                                let ty = n[1] * nx + n[5] * ny + n[9] * nz;
                                let tz = n[2] * nx + n[6] * ny + n[10] * nz;
                                const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
                                if (len > 0.000001) {
                                    tx /= len;
                                    ty /= len;
                                    tz /= len;
                                }

                                combinedVertexData[dstIdx + 3] = tx;
                                combinedVertexData[dstIdx + 4] = ty;
                                combinedVertexData[dstIdx + 5] = tz;
                            }

                            // 3. 나머지 속성(UV 6~7 등) 복사
                            if (rawStride > 6) {
                                for (let k = 6; k < rawStride; k++) {
                                    combinedVertexData[dstIdx + k] = srcVData[srcIdx + k];
                                }
                            }
                        }
                    }

                    // 4. 인덱스 데이터 병합
                    if (srcIData) {
                        const iCount = srcIB.indexCount;
                        for (let i = 0; i < iCount; i++) {
                            combinedIndexData[indexOffset + i] = srcIData[i] + vertexOffset;
                        }
                        indexOffset += iCount;
                    } else {
                        // 인덱스가 없는 비인덱스 버텍스인 경우 순차 인덱스 생성
                        for (let i = 0; i < vCount; i++) {
                            combinedIndexData[indexOffset + i] = vertexOffset + i;
                        }
                        indexOffset += vCount;
                    }

                    vertexOffset += vCount;
                }

                // 5. 병합된 통합 VertexBuffer, IndexBuffer, Geometry 생성 (고유 cacheKey 부여로 캐시 충돌 방지)
                const vKey = `FoliageCombinedVB_${this.name}_${mat.name || 'mat'}_${Math.random()}`;
                const iKey = `FoliageCombinedIB_${this.name}_${mat.name || 'mat'}_${Math.random()}`;
                const combinedVB = new VertexBuffer(this.redGPUContext, combinedVertexData, interleavedStruct, undefined, vKey);
                const combinedIB = new IndexBuffer(this.redGPUContext, combinedIndexData, undefined, iKey);
                const combinedGeom = new Geometry(this.redGPUContext, combinedVB, combinedIB);


                const identityMatrix = mat4.create();
                mat4.identity(identityMatrix);

                const combinedSubMesh = createSubMeshInstance(
                    group[0].node,
                    combinedGeom,
                    mat,
                    identityMatrix,
                    identityMatrix,
                    group[0].strideBytes,
                    0
                );

                subList.push(combinedSubMesh);
                console.log(`[FoliageType 🌲] Combined ${group.length} submeshes for material '${mat.name || mat.constructor.name}' into 1 optimized mesh (${totalVertexCount} verts, ${totalIndexCount} indices). Sample verts:`, combinedVertexData.subarray(0, 18));

            }
        });

        // 🌟 LOD 0 서브메시 개수 기록
        this.lod0SubMeshCount = subList.length;

        // 🌟 4단계: 언리얼 엔진 스타일 Cross-Billboard Impostor (LOD 1) 서브메시 등록
        if (this.options.billboard?.enabled) {
            const bbOptions = this.options.billboard;
            const rootMeshNode = Array.isArray(this.options.mesh) ? this.options.mesh[0] : this.options.mesh;
            const bakeResult = FoliageImpostorBaker.bakeSubMeshes(this.redGPUContext, subList, rootMeshNode, 512, this.name);

            const bbWidth = bbOptions.width ?? bakeResult.width;
            const bbHeight = bbOptions.height ?? bakeResult.height;

            const bbGeom = createCrossBillboardGeometry(this.redGPUContext, bbWidth, bbHeight);
            let bbMat = bbOptions.material;
            if (!bbMat) {
                // 🌟 언리얼 엔진 스타일 Cross-Billboard 전용 초경량 볼륨 셰이딩 재질 자동 생성!
                bbMat = new CrossBillboardMaterial(this.redGPUContext, bakeResult.texture, `${this.name}_CrossBillboardMat`);
            }


            const identityMatrix = mat4.create();
            mat4.identity(identityMatrix);

            const dummyMesh = new Mesh(this.redGPUContext, bbGeom, bbMat);
            dummyMesh.name = `${this.name}_Billboard_LOD1`;

            const bbSubMesh = createSubMeshInstance(
                dummyMesh,
                bbGeom,
                bbMat,
                identityMatrix,
                identityMatrix,
                12 * 4,
                1 // lodIndex: 1
            );

            (bbSubMesh as any)._bakedWidth = bbWidth;
            (bbSubMesh as any)._bakedHeight = bbHeight;

            subList.push(bbSubMesh);
            console.log(`[FoliageType 🌲] '${this.name}' added UE5 Cross-Billboard Impostor SubMesh (LOD1, ${bbWidth.toFixed(2)}x${bbHeight.toFixed(2)}m, transition @ ${this.lodDistance}m)`);
        }

        console.log(`[FoliageType 🌲] '${this.name}' collected ${subList.length} final submesh draw call(s) (LOD0: ${this.lod0SubMeshCount}, Billboard LOD1: ${this.hasBillboard ? 1 : 0}).`);
    }
}


