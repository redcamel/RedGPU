/**
 * [KO] 복합 계층 3D 메쉬(GLTF 노드 트리 등)를 재귀 순회하여 부모-자식 로컬 트랜스폼을 적용하고, 동일 재질 서브메쉬를 단일 지오메트리로 자동 결합하는 스캐터 코어 함수 모듈입니다.
 * [EN] Scatter core function module that recursively traverses composite hierarchical 3D meshes (e.g. GLTF node trees), applies parent-child local transforms, and automatically merges same-material sub-meshes into unified geometries.
 *
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import {
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE,
    POSITION_ONLY_INTERLEAVED_STRUCT,
    POSITION_ONLY_STRIDE
} from "./ScatterVertexFormats";

const tempLocalMatrix: mat4 = mat4.create();
const identityMatrix: mat4 = mat4.create();

/**
 * [KO] 결합 대상 개별 서브메쉬 노드의 원시 메타데이터 인터페이스입니다.
 * [EN] Raw metadata interface for an individual sub-mesh node to be combined.
 */
export interface RawSubMeshNode {
    node: Mesh;
    geometry: Geometry | Primitive;
    material: any;
    currentRelativeMatrix: mat4;
    normalMatrix: mat4;
    rawStride: number;
}

/**
 * [KO] 동일한 재질을 공유하여 하나의 버퍼로 결합된 서브메쉬 그룹 결과입니다.
 * [EN] Result of a sub-mesh group combined into a single buffer sharing the same material.
 */
export interface CombinedSubMeshGroup {
    material: any;
    geometry: Geometry;
    vertexCount: number;
    indexCount: number;
    firstIndex: number;
    rawNodes: RawSubMeshNode[];
}

/**
 * [KO] 메쉬 결합 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface for mesh combining.
 */
export interface ScatterMeshCombineOptions {
    /**
     * [KO] 원래 모델의 피벗 기준점을 유지할지 여부 (기본값: true). false일 경우 모델의 최하단(minY)을 Y=0으로 정렬합니다.
     * [EN] Whether to preserve the original model pivot (default: true). If false, aligns the lowest vertex (minY) to Y=0.
     */
    preservePivot?: boolean;

    /**
     * [KO] XZ 평면 상에서 기하학적 중심((minX+maxX)*0.5, (minZ+maxZ)*0.5)을 원점으로 정렬할지 여부 (기본값: false, Foliage처럼 수목 중심 정렬 시 true).
     * [EN] Whether to center vertices on the XZ plane to geometric center (default: false, true for Foliage tree centering).
     */
    centerXZ?: boolean;

    /**
     * [KO] 뎁스 프리패스나 그림자 패스에 최적화된 포지션 전용(Position-Only 3 floats) 지오메트리를 추가로 생성할지 여부 (기본값: false)
     * [EN] Whether to also generate a position-only (3 floats) geometry optimized for depth/shadow passes (default: false)
     */
    generateShadowMergedGeometry?: boolean;
}

/**
 * [KO] combineScatterMeshes의 최종 지오메트리 결합 결과 객체입니다.
 * [EN] Final geometry combination result object of combineScatterMeshes.
 */
export interface ScatterMeshCombineResult {
    groups: CombinedSubMeshGroup[];
    unifiedGeometry: Geometry | null;
    totalVertexCount: number;
    totalIndexCount: number;
    boundingRadius: number;
    boundingHeight: number;
    bottomOffset: number;
    shadowMergedGeometry?: Geometry | null;
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
}

/**
 * [KO] RedGPU Mesh 인스턴스의 위치, 오일러 회전각(Degree), 스케일을 기반으로 로컬 4x4 행렬을 계산합니다.
 * [EN] Computes the local 4x4 matrix based on position, Euler rotation angles (degrees), and scale of a RedGPU Mesh instance.
 */
function computeMeshLocalMatrix(mesh: Mesh, out: mat4): mat4 {
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
}

/**
 * [KO] 단일 메쉬 노드 및 그 자식 노드(`children`)를 재귀 순회하여 유효한 지오메트리를 가진 서브메쉬 목록을 추출합니다.
 *      루트 노드인 경우 부모 체인(GLTF 상위 노드의 회전/스케일)을 역추적하여 누적 계산합니다.
 * [EN] Recursively traverses a mesh node and its children to extract sub-mesh nodes with valid geometries.
 *      For root nodes, traces up the parent chain to accumulate GLTF parent transforms.
 */
function traverseHierarchy(
    node: Mesh,
    parentRelativeMatrix: mat4,
    isRoot: boolean,
    rawList: RawSubMeshNode[]
): void {
    if (!node) return;

    const currentRelativeMatrix = mat4.create();
    if (isRoot) {
        const parentChain: Mesh[] = [];
        let p: any = node.parent;
        while (p && p.isInstanceofMesh) {
            parentChain.unshift(p);
            p = p.parent;
        }
        for (let c = 0; c < parentChain.length; c++) {
            computeMeshLocalMatrix(parentChain[c], tempLocalMatrix);
            mat4.multiply(currentRelativeMatrix, currentRelativeMatrix, tempLocalMatrix);
        }
        computeMeshLocalMatrix(node, tempLocalMatrix);
        mat4.multiply(currentRelativeMatrix, currentRelativeMatrix, tempLocalMatrix);
    } else {
        computeMeshLocalMatrix(node, tempLocalMatrix);
        mat4.multiply(currentRelativeMatrix, parentRelativeMatrix, tempLocalMatrix);
    }

    if (node.geometry) {
        const mat = node.material as any;
        if (mat?.dirtyPipeline || (mat && !mat.gpuRenderInfo?.fragmentShaderModule)) {
            mat._updateFragmentState?.();
            mat.dirtyPipeline = false;
        }

        const geom = node.geometry;
        const rawStride = geom.vertexBuffer?.stride || (geom.vertexBuffer?.interleavedStruct?.arrayStride ? geom.vertexBuffer.interleavedStruct.arrayStride / 4 : 18);

        const normalMatrix = mat4.create();
        mat4.invert(normalMatrix, currentRelativeMatrix);
        mat4.transpose(normalMatrix, normalMatrix);

        rawList.push({
            node,
            geometry: geom,
            material: mat,
            currentRelativeMatrix,
            normalMatrix,
            rawStride,
        });
    }

    const children = node.children;
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            traverseHierarchy(
                children[i] as Mesh,
                currentRelativeMatrix,
                false,
                rawList
            );
        }
    }
}

/**
 * [KO] 하나 이상의 루트 메쉬를 입력받아 계층 구조를 순회하고, 동일 재질 서브메쉬를 단일 버퍼로 병합한 결합 결과 객체를 반환합니다.
 * [EN] Accepts one or more root meshes, traverses their hierarchies, and returns a combination result object with merged sub-meshes per material.
 *
 * **[KO] 알고리즘 및 렌더링 최적화:**
 * - **계층 구조 평탄화 (Hierarchy Flattening)**: GLTF 노드 트리의 복잡한 부모-자식 트랜스폼(위치, 오일러 회전, 스케일)을 누적 계산하여 모든 정점과 법선, 탄젠트를 전역 모델 공간으로 사전 베이킹합니다.
 * - **재질별 드로우콜 병합 (Material Grouping)**: 동일한 텍스처와 재질 파라미터를 공유하는 여러 메쉬 노드를 단일 Vertex/Index 버퍼로 결합하여 드로우콜 횟수를 최소화합니다.
 * - **스캐터 정렬 옵션**:
 *   - `preservePivot`: 원본 3D 모델의 원점(피벗)을 그대로 보존하거나, 지형 표면에 정확히 맞닿도록 최하단 정점(minY)을 Y=0으로 스냅합니다.
 *   - `centerXZ`: 나무나 풀과 같은 식생 모델을 회전/배치할 때 비틀림이 없도록 XZ 평면 중심을 원점으로 재정렬합니다.
 * - **그림자 패스 최적화 (`generateShadowMergedGeometry`)**: 불필요한 노멀/UV/탄젠트를 제외하고 오직 위치값(Position-only, 3 floats)만으로 구성된 단일 섀도우 지오메트리를 생성하여 캐스케이드 그림자 맵 렌더링 대역폭을 획기적으로 절감합니다.
 *
 * **[EN] Algorithm & Rendering Optimizations:**
 * - **Hierarchy Flattening**: Accumulates nested parent-child transforms (position, Euler rotation, scale) across GLTF node trees to pre-bake all vertices, normals, and tangents into unified model space.
 * - **Material-based Draw Call Batching**: Merges multiple mesh nodes sharing the same textures and material properties into single Vertex/Index buffers to minimize draw calls.
 * - **Scatter Alignment Options**:
 *   - `preservePivot`: Preserves the original model pivot or aligns the lowest vertex (minY) to Y=0 for accurate terrain snapping.
 *   - `centerXZ`: Re-centers the XZ plane geometry to eliminate rotation wobble when instancing trees or vegetation.
 * - **Shadow Pass Optimization (`generateShadowMergedGeometry`)**: Produces a unified position-only (3 floats) geometry stripped of normals, UVs, and tangents to dramatically cut memory bandwidth during shadow map passes.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param roots -
 * [KO] 결합할 단일 루트 메쉬 또는 메쉬 배열
 * [EN] Single root mesh or array of root meshes to combine
 * @param options -
 * [KO] 피벗 보존, XZ 평면 중심 정렬, 그림자용 지오메트리 생성 등 결합 옵션
 * [EN] Combination options including pivot preservation, XZ plane centering, and shadow geometry generation
 * @returns
 * [KO] 머티리얼별 결합 그룹 및 통합 바운딩 정보가 포함된 결합 결과 객체
 * [EN] Combination result object containing merged groups per material and unified bounding data
 */
export default function combineScatterMeshes(
    redGPUContext: RedGPUContext,
    roots: Mesh | Mesh[],
    options?: ScatterMeshCombineOptions
): ScatterMeshCombineResult {
    const rootList = Array.isArray(roots) ? roots : [roots];
    const rawList: RawSubMeshNode[] = [];

    for (let r = 0; r < rootList.length; r++) {
        traverseHierarchy(
            rootList[r],
            identityMatrix,
            true,
            rawList
        );
    }

    if (rawList.length === 0) {
        return {
            groups: [],
            unifiedGeometry: null,
            totalVertexCount: 0,
            totalIndexCount: 0,
            boundingRadius: 0,
            boundingHeight: 0,
            bottomOffset: 0,
            shadowMergedGeometry: null,
            minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0
        };
    }

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    let lodTotalVertices = 0;
    let lodTotalIndices = 0;

    for (let i = 0; i < rawList.length; i++) {
        const raw = rawList[i];
        const geom = raw.geometry;
        const srcVB = geom.vertexBuffer;
        const srcIB = geom.indexBuffer;
        const srcVData = srcVB?.data;
        const vCount = srcVB?.vertexCount ?? 0;
        const rawStride = raw.rawStride;
        const m = raw.currentRelativeMatrix;

        lodTotalVertices += vCount;
        lodTotalIndices += srcIB?.indexCount ?? vCount;

        if (srcVData && vCount > 0) {
            for (let v = 0; v < vCount; v++) {
                const srcIdx = v * rawStride;
                const x = srcVData[srcIdx + 0];
                const y = srcVData[srcIdx + 1];
                const z = srcVData[srcIdx + 2];
                const wx = m[0] * x + m[4] * y + m[8] * z + m[12];
                const wy = m[1] * x + m[5] * y + m[9] * z + m[13];
                const wz = m[2] * x + m[6] * y + m[10] * z + m[14];

                if (wx < minX) minX = wx;
                if (wx > maxX) maxX = wx;
                if (wy < minY) minY = wy;
                if (wy > maxY) maxY = wy;
                if (wz < minZ) minZ = wz;
                if (wz > maxZ) maxZ = wz;
            }
        }
    }

    const preservePivot = options?.preservePivot ?? true;
    const centerXZ = options?.centerXZ ?? false;
    const offsetX = centerXZ ? ((isFinite(minX) && isFinite(maxX)) ? (minX + maxX) * 0.5 : 0) : 0;
    const offsetY = preservePivot ? 0 : (isFinite(minY) ? minY : 0);
    const offsetZ = centerXZ ? ((isFinite(minZ) && isFinite(maxZ)) ? (minZ + maxZ) * 0.5 : 0) : 0;

    const materialGroups = new Map<string, { material: any; raws: RawSubMeshNode[] }>();
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

    const groups: CombinedSubMeshGroup[] = [];

    const generateShadow = options?.generateShadowMergedGeometry ?? false;
    let shadowMergedPositions: Float32Array | null = null;
    let shadowMergedIndices: Uint32Array | null = null;
    let shadowVertexOffset = 0;
    let shadowIndexOffset = 0;

    if (generateShadow && lodTotalVertices > 0) {
        shadowMergedPositions = new Float32Array(lodTotalVertices * POSITION_ONLY_STRIDE);
        shadowMergedIndices = new Uint32Array(lodTotalIndices);
    }

    let unifiedVertexData: Float32Array | null = null;
    let unifiedIndexData: Uint32Array | null = null;
    let unifiedVertexOffset = 0;
    let unifiedIndexOffset = 0;

    if (lodTotalVertices > 0) {
        unifiedVertexData = new Float32Array(lodTotalVertices * PBR_STRIDE);
        unifiedIndexData = new Uint32Array(lodTotalIndices);
    }

    for (const entry of materialGroups.values()) {
        const group = entry.raws;
        const mat = entry.material;

        let totalVertexCount = 0;
        let totalIndexCount = 0;

        for (let g = 0; g < group.length; g++) {
            const geom = group[g].geometry;
            totalVertexCount += geom.vertexBuffer?.vertexCount ?? 0;
            totalIndexCount += geom.indexBuffer?.indexCount ?? (geom.vertexBuffer?.vertexCount ?? 0);
        }

        const combinedVertexData = new Float32Array(totalVertexCount * PBR_STRIDE);
        const combinedIndexData = new Uint32Array(totalIndexCount);

        let vertexOffset = 0;
        let indexOffset = 0;
        const groupFirstIndex = unifiedIndexOffset;
        const groupStartVertexOffset = unifiedVertexOffset;

        for (let g = 0; g < group.length; g++) {
            const raw = group[g];
            const geom = raw.geometry;
            const srcVB = geom.vertexBuffer;
            const srcIB = geom.indexBuffer;
            const srcVData = srcVB?.data;
            const srcIData = srcIB?.data;
            const vCount = srcVB?.vertexCount ?? 0;
            const rawStride = raw.rawStride;

            if (srcVData && vCount > 0) {
                const m = raw.currentRelativeMatrix;
                const n = raw.normalMatrix;

                for (let v = 0; v < vCount; v++) {
                    const srcIdx = v * rawStride;
                    const dstIdx = (vertexOffset + v) * PBR_STRIDE;

                    const x = srcVData[srcIdx + 0];
                    const y = srcVData[srcIdx + 1];
                    const z = srcVData[srcIdx + 2];
                    const vx = (m[0] * x + m[4] * y + m[8] * z + m[12]) - offsetX;
                    const vy = (m[1] * x + m[5] * y + m[9] * z + m[13]) - offsetY;
                    const vz = (m[2] * x + m[6] * y + m[10] * z + m[14]) - offsetZ;

                    combinedVertexData[dstIdx + 0] = vx;
                    combinedVertexData[dstIdx + 1] = vy;
                    combinedVertexData[dstIdx + 2] = vz;

                    if (shadowMergedPositions) {
                        const dstShadowIdx = (shadowVertexOffset + v) * POSITION_ONLY_STRIDE;
                        shadowMergedPositions[dstShadowIdx + 0] = vx;
                        shadowMergedPositions[dstShadowIdx + 1] = vy;
                        shadowMergedPositions[dstShadowIdx + 2] = vz;
                    }

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
                    } else {
                        combinedVertexData[dstIdx + 3] = 0;
                        combinedVertexData[dstIdx + 4] = 1;
                        combinedVertexData[dstIdx + 5] = 0;
                    }

                    if (rawStride >= 8) {
                        combinedVertexData[dstIdx + 6] = srcVData[srcIdx + 6];
                        combinedVertexData[dstIdx + 7] = srcVData[srcIdx + 7];
                    }

                    if (rawStride >= 10) {
                        combinedVertexData[dstIdx + 8] = srcVData[srcIdx + 8];
                        combinedVertexData[dstIdx + 9] = srcVData[srcIdx + 9];
                    } else {
                        combinedVertexData[dstIdx + 8] = combinedVertexData[dstIdx + 6];
                        combinedVertexData[dstIdx + 9] = combinedVertexData[dstIdx + 7];
                    }

                    let vc0 = 1.0, vc1 = 1.0, vc2 = 1.0, vc3 = 1.0;
                    if (rawStride >= 14) {
                        vc0 = srcVData[srcIdx + 10];
                        vc1 = srcVData[srcIdx + 11];
                        vc2 = srcVData[srcIdx + 12];
                        vc3 = srcVData[srcIdx + 13] !== 0 ? srcVData[srcIdx + 13] : 1.0;
                    }
                    combinedVertexData[dstIdx + 10] = vc0;
                    combinedVertexData[dstIdx + 11] = vc1;
                    combinedVertexData[dstIdx + 12] = vc2;
                    combinedVertexData[dstIdx + 13] = vc3;

                    let tanX = 0, tanY = 0, tanZ = 0, tanW = 1.0;
                    let hasTangent = false;

                    if (rawStride >= 18) {
                        tanX = srcVData[srcIdx + 14];
                        tanY = srcVData[srcIdx + 15];
                        tanZ = srcVData[srcIdx + 16];
                        tanW = srcVData[srcIdx + 17] !== 0 ? srcVData[srcIdx + 17] : 1.0;
                        hasTangent = true;
                    } else if (rawStride >= 16) {
                        tanX = srcVData[srcIdx + 12];
                        tanY = srcVData[srcIdx + 13];
                        tanZ = srcVData[srcIdx + 14];
                        tanW = srcVData[srcIdx + 15] !== 0 ? srcVData[srcIdx + 15] : 1.0;
                        hasTangent = true;
                    } else if (rawStride === 12) {
                        tanX = srcVData[srcIdx + 8];
                        tanY = srcVData[srcIdx + 9];
                        tanZ = srcVData[srcIdx + 10];
                        tanW = srcVData[srcIdx + 11] !== 0 ? srcVData[srcIdx + 11] : 1.0;
                        hasTangent = true;
                    }

                    if (hasTangent) {
                        let rtx = m[0] * tanX + m[4] * tanY + m[8] * tanZ;
                        let rty = m[1] * tanX + m[5] * tanY + m[9] * tanZ;
                        let rtz = m[2] * tanX + m[6] * tanY + m[10] * tanZ;
                        const tlen = Math.sqrt(rtx * rtx + rty * rty + rtz * rtz);
                        if (tlen > 0.000001) {
                            rtx /= tlen;
                            rty /= tlen;
                            rtz /= tlen;
                        }
                        combinedVertexData[dstIdx + 14] = rtx;
                        combinedVertexData[dstIdx + 15] = rty;
                        combinedVertexData[dstIdx + 16] = rtz;
                        combinedVertexData[dstIdx + 17] = tanW;
                    } else {
                        combinedVertexData[dstIdx + 14] = 1.0;
                        combinedVertexData[dstIdx + 15] = 0.0;
                        combinedVertexData[dstIdx + 16] = 0.0;
                        combinedVertexData[dstIdx + 17] = 1.0;
                    }
                }

                if (srcIData && geom.indexBuffer?.indexCount) {
                    const iCount = geom.indexBuffer.indexCount;
                    for (let idx = 0; idx < iCount; idx++) {
                        const sVal = srcIData[idx];
                        combinedIndexData[indexOffset + idx] = vertexOffset + sVal;
                        if (unifiedIndexData) {
                            unifiedIndexData[unifiedIndexOffset + idx] = unifiedVertexOffset + sVal;
                        }
                        if (shadowMergedIndices) {
                            shadowMergedIndices[shadowIndexOffset + idx] = shadowVertexOffset + sVal;
                        }
                    }
                    indexOffset += iCount;
                    if (unifiedIndexData) unifiedIndexOffset += iCount;
                    if (shadowMergedIndices) shadowIndexOffset += iCount;
                } else {
                    for (let idx = 0; idx < vCount; idx++) {
                        combinedIndexData[indexOffset + idx] = vertexOffset + idx;
                        if (unifiedIndexData) {
                            unifiedIndexData[unifiedIndexOffset + idx] = unifiedVertexOffset + idx;
                        }
                        if (shadowMergedIndices) {
                            shadowMergedIndices[shadowIndexOffset + idx] = shadowVertexOffset + idx;
                        }
                    }
                    indexOffset += vCount;
                    if (unifiedIndexData) unifiedIndexOffset += vCount;
                    if (shadowMergedIndices) shadowIndexOffset += vCount;
                }

                vertexOffset += vCount;
                if (unifiedVertexData) unifiedVertexOffset += vCount;
                if (shadowMergedPositions) shadowVertexOffset += vCount;
            }
        }

        if (unifiedVertexData) {
            unifiedVertexData.set(combinedVertexData, groupStartVertexOffset * PBR_STRIDE);
        }

        const combinedVB = new VertexBuffer(redGPUContext, combinedVertexData, PBR_INTERLEAVED_STRUCT);
        const combinedIB = new IndexBuffer(redGPUContext, combinedIndexData);
        const combinedGeom = new Geometry(redGPUContext, combinedVB, combinedIB);

        groups.push({
            material: mat,
            geometry: combinedGeom,
            vertexCount: totalVertexCount,
            indexCount: totalIndexCount,
            firstIndex: groupFirstIndex,
            rawNodes: group
        });
    }

    let unifiedGeometry: Geometry | null = null;
    if (lodTotalVertices > 0) {
        if (groups.length === 1) {
            unifiedGeometry = groups[0].geometry;
        } else if (unifiedVertexData && unifiedIndexData) {
            const unifiedVB = new VertexBuffer(redGPUContext, unifiedVertexData, PBR_INTERLEAVED_STRUCT);
            const unifiedIB = new IndexBuffer(redGPUContext, unifiedIndexData);
            unifiedGeometry = new Geometry(redGPUContext, unifiedVB, unifiedIB);
        }
    }

    let shadowMergedGeometry: Geometry | null = null;
    if (shadowMergedPositions && shadowMergedIndices) {
        const shadowVB = new VertexBuffer(redGPUContext, shadowMergedPositions, POSITION_ONLY_INTERLEAVED_STRUCT);
        const shadowIB = new IndexBuffer(redGPUContext, shadowMergedIndices);
        shadowMergedGeometry = new Geometry(redGPUContext, shadowVB, shadowIB);
    }

    let maxDistSq = 0;
    for (let i = 0; i < rawList.length; i++) {
        const raw = rawList[i];
        const geom = raw.geometry;
        const srcVB = geom.vertexBuffer;
        const srcVData = srcVB?.data;
        const vCount = srcVB?.vertexCount ?? 0;
        const rawStride = raw.rawStride;
        const m = raw.currentRelativeMatrix;

        if (srcVData && vCount > 0) {
            for (let v = 0; v < vCount; v++) {
                const srcIdx = v * rawStride;
                const x = srcVData[srcIdx + 0];
                const y = srcVData[srcIdx + 1];
                const z = srcVData[srcIdx + 2];
                const vx = (m[0] * x + m[4] * y + m[8] * z + m[12]) - offsetX;
                const vy = (m[1] * x + m[5] * y + m[9] * z + m[13]) - offsetY;
                const vz = (m[2] * x + m[6] * y + m[10] * z + m[14]) - offsetZ;
                const dSq = vx * vx + vy * vy + vz * vz;
                if (dSq > maxDistSq) maxDistSq = dSq;
            }
        }
    }

    const boundingRadius = Math.sqrt(maxDistSq);
    const boundingHeight = (isFinite(minY) && isFinite(maxY) && maxY > minY) ? (maxY - minY) : (boundingRadius > 0 ? boundingRadius * 2.0 : 1.0);
    const bottomOffset = preservePivot ? (isFinite(minY) ? -minY : 0) : 0;

    const finalMinX = isFinite(minX) ? minX - offsetX : 0;
    const finalMaxX = isFinite(maxX) ? maxX - offsetX : 0;
    const finalMinY = isFinite(minY) ? minY - offsetY : 0;
    const finalMaxY = isFinite(maxY) ? maxY - offsetY : 0;
    const finalMinZ = isFinite(minZ) ? minZ - offsetZ : 0;
    const finalMaxZ = isFinite(maxZ) ? maxZ - offsetZ : 0;

    return {
        groups,
        unifiedGeometry,
        totalVertexCount: lodTotalVertices,
        totalIndexCount: lodTotalIndices,
        boundingRadius,
        boundingHeight,
        bottomOffset,
        shadowMergedGeometry,
        minX: finalMinX,
        maxX: finalMaxX,
        minY: finalMinY,
        maxY: finalMaxY,
        minZ: finalMinZ,
        maxZ: finalMaxZ
    };
}

/**
 * [KO] 재질 객체로부터 동일 머티리얼 판별을 위한 고유 해시 키를 생성합니다.
 * [EN] Generates a unique hash key from a material object to identify identical materials.
 */
function getMaterialKey(mat: any): string {
    if (!mat) return 'default_mat';
    const matType = mat.constructor?.name || 'Material';
    const diffuseKey = mat.baseColorTexture?.src || mat.diffuseTexture?.src || mat.baseColorTexture?.url || mat.diffuseTexture?.url || (mat.baseColorTexture ? mat.baseColorTexture.uuid : '');
    const normalKey = mat.normalTexture?.src || mat.normalTexture?.url || (mat.normalTexture ? mat.normalTexture.uuid : '');
    const ormKey = mat.ormTexture?.src || mat.ormTexture?.url || (mat.ormTexture ? mat.ormTexture.uuid : '');
    return `${matType}_${diffuseKey}_${normalKey}_${ormKey}`;
}
