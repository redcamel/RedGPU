import { Buffer, BufferView, GLTF } from "../GLTF";
export type MeshoptCompressionMode = 'ATTRIBUTES' | 'TRIANGLES' | 'INDICES';
export type MeshoptCompressionFilter = 'NONE' | 'OCTAHEDRAL' | 'QUATERNION' | 'EXPONENTIAL' | 'COLOR';
export interface MeshoptBufferViewExtension {
    buffer: number;
    byteOffset?: number;
    byteLength: number;
    byteStride: number;
    count: number;
    mode: MeshoptCompressionMode;
    filter?: MeshoptCompressionFilter;
}
export interface MeshoptDecoderLike {
    ready: Promise<void>;
    decodeGltfBuffer: (target: Uint8Array, count: number, size: number, source: Uint8Array, mode: MeshoptCompressionMode, filter?: MeshoptCompressionFilter) => void;
}
/**
 * [KO] glTF 데이터에서 `KHR_meshopt_compression` 또는 `EXT_meshopt_compression` 확장 사용 여부를 확인합니다.
 * [EN] Checks whether the glTF data uses `KHR_meshopt_compression` or `EXT_meshopt_compression`.
 */
export declare const hasMeshoptCompression: (gltfData: GLTF) => boolean;
/**
 * [KO] 버퍼가 Meshopt 압축용 `fallback: true` 더미 버퍼인지 확인합니다.
 * [EN] Checks whether a buffer is a `fallback: true` placeholder buffer for Meshopt compression.
 */
export declare const isMeshoptFallbackBuffer: (buffer: Buffer) => boolean;
/**
 * [KO] `bufferView`에서 `KHR_meshopt_compression` 또는 `EXT_meshopt_compression` 확장 객체를 추출합니다.
 * [EN] Extracts the `KHR_meshopt_compression` or `EXT_meshopt_compression` extension from a `bufferView`.
 */
export declare const getMeshoptExtension: (bufferView: BufferView) => MeshoptBufferViewExtension | null;
/**
 * [KO] 전달받은 `MeshoptDecoder` 인스턴스를 사용해 압축된 모든 `bufferView`를 복원하고 `bufferDataViews`에 매핑합니다.
 * [EN] Decodes all compressed `bufferView` entries using the provided `MeshoptDecoder` instance and maps them into `bufferDataViews`.
 */
export declare const applyDecodedMeshoptBufferViews: (gltfData: GLTF, bufferDataViews: DataView[], decoder: MeshoptDecoderLike) => number;
/**
 * [KO] `KHR_meshopt_compression` / `EXT_meshopt_compression`이 사용된 glTF의 `bufferView`를 온디맨드 WASM으로 일괄 복원합니다.
 * [EN] Decodes `KHR_meshopt_compression` / `EXT_meshopt_compression` `bufferView` entries on demand using WASM.
 *
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param bufferDataViews -
 * [KO] 로드된 버퍼 `DataView` 배열
 * [EN] Loaded buffer `DataView` array
 * @returns
 * [KO] 복원된 `bufferView` 개수
 * [EN] Number of decoded `bufferView` entries
 * @category GLTF
 */
declare const decodeMeshoptBufferViews: (gltfData: GLTF, bufferDataViews: DataView[]) => Promise<number>;
export default decodeMeshoptBufferViews;
