import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";

const EMPTY_UINT32_ARRAY = new Uint32Array(0);

/**
 * [KO] WebGPU 네이티브 토폴로지와 정규화된 인덱스 배열을 담는 결과 인터페이스입니다.
 * [EN] Result interface holding a WebGPU-native topology and normalized index array.
 *
 * @category GLTF
 */
export interface NormalizedPrimitiveTopologyResult {
    topology: GPUPrimitiveTopology;
    indices: Uint32Array;
}

/**
 * [KO] glTF 프리미티브 모드(`mode`)와 인덱스 유무만으로 최종 WebGPU 토폴로지를 결정합니다.
 * [EN] Resolves the final WebGPU primitive topology from glTF `mode` and index presence.
 *
 * @param mode -
 * [KO] glTF `primitive.mode` 값 (기본값 `4` = `TRIANGLES`)
 * [EN] glTF `primitive.mode` value (default `4` = `TRIANGLES`)
 * @param hasIndices -
 * [KO] 프리미티브에 `indices` 속성이 존재하는지 여부
 * [EN] Whether the primitive defines an `indices` accessor
 * @returns
 * [KO] WebGPU 토폴로지 상수
 * [EN] WebGPU topology constant
 * @category GLTF
 */
export const resolveWebGPUTopology = (mode: number | undefined, hasIndices: boolean): GPUPrimitiveTopology => {
    switch (mode) {
        case 0:
            return GPU_PRIMITIVE_TOPOLOGY.POINT_LIST;
        case 1:
        case 2:
            return GPU_PRIMITIVE_TOPOLOGY.LINE_LIST;
        case 3:
            return hasIndices ? GPU_PRIMITIVE_TOPOLOGY.LINE_LIST : GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
        case 4:
        case 5:
        case 6:
        default:
            return GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
    }
};

/**
 * [KO] glTF 7종 프리미티브 모드를 WebGPU 네이티브 토폴로지와 호환되는 인덱스 배열로 정규화합니다.
 * [EN] Normalizes all 7 glTF primitive modes into WebGPU-native topologies and compatible index arrays.
 *
 * @param mode -
 * [KO] glTF `primitive.mode` 값 (0~6, 기본값 4)
 * [EN] glTF `primitive.mode` value (0-6, default 4)
 * @param indices -
 * [KO] 원본 인덱스 배열 (비인덱스 프리미티브는 길이 0)
 * [EN] Source index array (length 0 for non-indexed primitives)
 * @param vertexCount -
 * [KO] 정점 개수
 * [EN] Vertex count
 * @returns
 * [KO] 정규화된 WebGPU 토폴로지 및 인덱스 배열
 * [EN] Normalized WebGPU topology and index array
 * @category GLTF
 */
export const normalizePrimitiveTopology = (
    mode: number | undefined,
    indices: Uint32Array,
    vertexCount: number
): NormalizedPrimitiveTopologyResult => {
    const hasIndices = indices.length > 0;
    const count = hasIndices ? indices.length : vertexCount;

    switch (mode) {
        case 0:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.POINT_LIST, indices};
        case 1:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, indices};
        case 2: {
            // LINE_LOOP -> LINE_LIST: (v0, v1), (v1, v2), ..., (v_{n-1}, v0)
            if (count < 2) {
                return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, indices: EMPTY_UINT32_ARRAY};
            }
            const out = new Uint32Array(count * 2);
            for (let i = 0; i < count; i++) {
                const next = (i + 1) % count;
                out[i * 2] = hasIndices ? indices[i] : i;
                out[i * 2 + 1] = hasIndices ? indices[next] : next;
            }
            return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, indices: out};
        }
        case 3: {
            // LINE_STRIP: 비인덱스는 네이티브 유지, 인덱스 기반은 LINE_LIST로 변환
            if (!hasIndices) {
                return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP, indices};
            }
            if (count < 2) {
                return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, indices: EMPTY_UINT32_ARRAY};
            }
            const out = new Uint32Array((count - 1) * 2);
            for (let i = 0; i < count - 1; i++) {
                out[i * 2] = indices[i];
                out[i * 2 + 1] = indices[i + 1];
            }
            return {topology: GPU_PRIMITIVE_TOPOLOGY.LINE_LIST, indices: out};
        }
        case 5: {
            // TRIANGLE_STRIP -> TRIANGLE_LIST (홀수 삼각형 와인딩 교대)
            if (count < 3) {
                return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST, indices: EMPTY_UINT32_ARRAY};
            }
            const triCount = count - 2;
            const out = new Uint32Array(triCount * 3);
            for (let i = 0; i < triCount; i++) {
                const v0 = hasIndices ? indices[i] : i;
                const v1 = hasIndices ? indices[i + 1] : i + 1;
                const v2 = hasIndices ? indices[i + 2] : i + 2;
                const dst = i * 3;
                if ((i & 1) === 0) {
                    out[dst] = v0;
                    out[dst + 1] = v1;
                    out[dst + 2] = v2;
                } else {
                    out[dst] = v1;
                    out[dst + 1] = v0;
                    out[dst + 2] = v2;
                }
            }
            return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST, indices: out};
        }
        case 6: {
            // TRIANGLE_FAN -> TRIANGLE_LIST: (v0, v1, v2), (v0, v2, v3), ...
            if (count < 3) {
                return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST, indices: EMPTY_UINT32_ARRAY};
            }
            const triCount = count - 2;
            const out = new Uint32Array(triCount * 3);
            const v0 = hasIndices ? indices[0] : 0;
            for (let i = 0; i < triCount; i++) {
                const dst = i * 3;
                out[dst] = v0;
                out[dst + 1] = hasIndices ? indices[i + 1] : i + 1;
                out[dst + 2] = hasIndices ? indices[i + 2] : i + 2;
            }
            return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST, indices: out};
        }
        case 4:
        default:
            return {topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST, indices};
    }
};
