import {mat4} from 'gl-matrix';
import RedGPUContext from '../../../context/RedGPUContext';
import Mesh from '../../mesh/Mesh';
import {FoliageInstanceBuffer} from './FoliageInstanceBuffer';

export interface FoliageSubMesh {
    readonly mesh: Mesh;
    readonly geometry: any;
    readonly material: any;
    readonly indexCount: number;
    readonly vertexCount: number;
    readonly isIndexed: boolean;
    readonly indexFormat: GPUIndexFormat;
    readonly strideBytes: number;
    readonly bottomOffset: number;
    readonly relativeModelMatrix: mat4;
    readonly relativeNormalMatrix: mat4;
    readonly vertexUniformBuffer: GPUBuffer;
    readonly vertexUniformBindGroup: GPUBindGroup;
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
     * [KO] 반투명(BLEND) 머티리얼을 언리얼 엔진 표준인 알파 컷오프(MASK)로 자동 변환할지 여부 (기본: true)
     * [EN] Whether to automatically convert BLEND materials to Unreal Engine standard MASK (alpha cutoff) (default: true)
     */
    convertBlendToMasked?: boolean;
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
    #activeInstanceCount: number = 0;
    #bottomOffset: number | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

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
            convertBlendToMasked: options.convertBlendToMasked ?? true,
        };


        this.#initSubMeshBindGroupLayout();
        this.#collectSubMeshes(options.mesh);
        this.instanceBuffer = new FoliageInstanceBuffer(redGPUContext, this.options.maxInstances, this.subMeshes);
        this.updateIndirectBuffer();
    }

    get mesh(): Mesh | Mesh[] {
        return this.options.mesh;
    }

    get activeInstanceCount(): number {
        return this.#activeInstanceCount;
    }

    #loadedTileKeys: Set<string> = new Set();

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

        // 해당 타일 영역 식생 인스턴스 데이터만 GPU 버퍼 부분 위치로 업로드
        this.instanceBuffer.uploadRangeToGPU(startIdx, actualCount);
        this.updateIndirectBuffer();
    }

    /**
     * [KO] 식생 서브메시 인덱스/버텍스 카운트 정보를 바탕으로 Multi-Indirect Draw Command Buffer 갱신
     */
    updateIndirectBuffer(): void {
        this.instanceBuffer.resetMultiIndirectCount(this.subMeshes);
    }

    /**
     * 지오메트리 버텍스 버퍼 및 하이라키 상대 행렬을 분석하여 메시 전체의 바닥(Bottom Y Base) 피봇 오프셋을 산출합니다.
     */
    getGeometryBottomOffset(): number {
        if (this.#bottomOffset !== null) return this.#bottomOffset;

        const subMeshes = this.subMeshes;
        const count = subMeshes.length;
        if (count === 0) {
            this.#bottomOffset = 0.0;
            return 0.0;
        }

        let globalMinY = Infinity;

        for (let s = 0; s < count; s++) {
            const sub = subMeshes[s];
            const geometry = sub.geometry;
            const vertexBuffer = geometry?.vertexBuffer;
            if (!vertexBuffer) continue;

            const data = (vertexBuffer as any).data || (vertexBuffer as any).typedArray || (vertexBuffer as any).dataBuffer;
            const strideFloats = (vertexBuffer as any).stride || 12;

            if (!data || data.length === 0) continue;

            const vertexCount = vertexBuffer.vertexCount || Math.floor(data.length / strideFloats);
            const m = sub.relativeModelMatrix;

            for (let i = 0; i < vertexCount; i++) {
                const base = i * strideFloats;
                const lx = data[base];
                const ly = data[base + 1];
                const lz = data[base + 2];

                // 상대 변환 행렬 적용한 Y 좌표
                const transformedY = m[1] * lx + m[5] * ly + m[9] * lz + m[13];
                if (transformedY < globalMinY) {
                    globalMinY = transformedY;
                }
            }
        }

        const calculated = (globalMinY !== Infinity && !isNaN(globalMinY)) ? -globalMinY : 0.0;
        this.#bottomOffset = calculated;
        return calculated;
    }


    #initSubMeshBindGroupLayout(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#subMeshVertexBindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'FoliageSubMesh_VertexBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {type: 'uniform'}
                }
            ]
        });
    }

    destroy(): void {
        const subList = this.subMeshes;
        for (let i = 0; i < subList.length; i++) {
            subList[i].vertexUniformBuffer.destroy();
        }
        this.subMeshes.length = 0;
        this.instanceBuffer.destroy();
    }

    /**
     * [KO] 루트 메시(glTF 노드 트리 또는 Mesh 배열)를 재귀 순회하여 유효 서브메시 및 누적 하이라키 행렬을 자동 추출합니다.
     */
    #collectSubMeshes(root: Mesh | Mesh[]): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        const bindGroupLayout = this.#subMeshVertexBindGroupLayout;
        if (!gpuDevice || !bindGroupLayout) return;

        const subList = this.subMeshes;

        /**
         * RedGPU Mesh의 TRS(Translation, Rotation, Scale)로부터 정밀 로컬 변환 행렬을 산출합니다.
         */
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

            // 1. 현재 노드의 상대 트랜스폼 행렬 계산 (루트는 원점 Identity 기준)
            const currentRelativeMatrix = mat4.create();
            if (isRoot) {
                mat4.identity(currentRelativeMatrix);
            } else {
                const nodeLocalMatrix = computeMeshLocalMatrix(node);
                mat4.multiply(currentRelativeMatrix, parentRelativeMatrix, nodeLocalMatrix);
            }

            // 2. geometry와 material이 모두 존재하는 실제 렌더 객체인 경우 서브메시로 등록
            if (node.geometry && node.material) {
                const mat = node.material;

                // 🌲 UE5 표준 식생 최적화: BLEND/반투명 머티리얼을 MASK(알파 컷오프)로 자동 승격
                if (this.options.convertBlendToMasked) {
                    if (mat.alphaBlend === 2 || mat.transparent || mat.alphaMode === 'BLEND' || mat.alphaMode === 'MASK') {
                        mat.useCutOff = true;
                        if (!mat.cutOff || mat.cutOff === 0) {
                            mat.cutOff = 0.5;
                        }
                        mat.transparent = false;
                        mat.alphaBlend = 1;
                    }
                }


                // 머티리얼 셰이더(#redgpu_if useCutOff) 및 글로벌 SSBO 슬롯 최신화
                if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
                    mat._updateFragmentState();
                    mat.dirtyPipeline = false;
                }

                const geom = node.geometry;


                const isIndexed = !!geom.indexBuffer;
                const indexCount = geom.indexBuffer?.indexCount ?? 0;
                const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;
                const rawStride = (geom.vertexBuffer as any)?.stride || 12;
                const strideBytes = rawStride * 4;


                // 법선 역전치 행렬 계산
                const normalMatrix = mat4.create();
                mat4.invert(normalMatrix, currentRelativeMatrix);
                mat4.transpose(normalMatrix, normalMatrix);

                // Uniform Buffer (36 floats / ints = 144 bytes: relativeModelMatrix 16 + relativeNormalMatrix 16 + globalFragmentSlotIndex 1 + pad 3)
                const uniformBuffer = gpuDevice.createBuffer({
                    label: `FoliageSubMesh_UniformBuffer_${node.name || subList.length}`,
                    size: 144,
                    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                });

                const uniformArrayBuffer = new ArrayBuffer(144);
                const floatView = new Float32Array(uniformArrayBuffer);
                const uintView = new Uint32Array(uniformArrayBuffer);

                floatView.set(currentRelativeMatrix, 0);
                floatView.set(normalMatrix, 16);
                uintView[32] = (node.material as any)?.globalFragmentSlotIndex ?? 0;
                uintView[33] = 0;
                uintView[34] = 0;
                uintView[35] = 0;

                gpuDevice.queue.writeBuffer(uniformBuffer, 0, uniformArrayBuffer, 0, 144);

                const vertexBindGroup = gpuDevice.createBindGroup({
                    label: `FoliageSubMesh_VertexBindGroup_${node.name || subList.length}`,
                    layout: bindGroupLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: {buffer: uniformBuffer}
                        }
                    ]
                });


                subList.push({
                    mesh: node,
                    geometry: geom,
                    material: node.material,
                    indexCount: indexCount,
                    vertexCount: vertexCount,
                    isIndexed: isIndexed,
                    indexFormat: (geom.indexBuffer as any)?.indexFormat || 'uint32',
                    strideBytes: strideBytes,
                    bottomOffset: 0.0,
                    relativeModelMatrix: currentRelativeMatrix,
                    relativeNormalMatrix: normalMatrix,
                    vertexUniformBuffer: uniformBuffer,
                    vertexUniformBindGroup: vertexBindGroup
                });
            }

            // 3. 자식 노드(children)가 있다면 누적 상대 행렬을 전달하며 하위 트리 계속 탐색
            if (node.children && node.children.length > 0) {
                const childCount = node.children.length;
                for (let i = 0; i < childCount; i++) {
                    traverse(node.children[i] as Mesh, currentRelativeMatrix, false);
                }
            }
        };

        const identity = mat4.create();
        if (Array.isArray(root)) {
            for (let i = 0; i < root.length; i++) traverse(root[i], identity, true);
        } else {
            traverse(root, identity, true);
        }
    }
}
