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
export declare const resolveWebGPUTopology: (mode: number | undefined, hasIndices: boolean) => GPUPrimitiveTopology;
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
export declare const normalizePrimitiveTopology: (mode: number | undefined, indices: Uint32Array, vertexCount: number) => NormalizedPrimitiveTopologyResult;
