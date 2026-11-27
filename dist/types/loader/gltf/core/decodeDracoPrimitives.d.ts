import { GLTF, MeshPrimitive } from "../GLTF";
/**
 * [KO] `KHR_draco_mesh_compression` 프리미티브 확장 스키마 인터페이스입니다.
 * [EN] Schema interface for the `KHR_draco_mesh_compression` primitive extension.
 *
 * @category GLTF
 */
export interface DracoPrimitiveExtension {
    bufferView: number;
    attributes: Record<string, number>;
}
/**
 * [KO] glTF 데이터에서 `KHR_draco_mesh_compression` 확장 사용 여부를 확인합니다.
 * [EN] Checks whether the glTF data uses `KHR_draco_mesh_compression`.
 *
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @returns
 * [KO] Draco 압축 사용 여부
 * [EN] Whether Draco compression is used
 * @category GLTF
 */
export declare const hasDracoCompression: (gltfData: GLTF) => boolean;
/**
 * [KO] `primitive`에서 `KHR_draco_mesh_compression` 확장 객체를 추출합니다.
 * [EN] Extracts the `KHR_draco_mesh_compression` extension from a mesh primitive.
 */
export declare const getDracoExtension: (primitive: MeshPrimitive) => DracoPrimitiveExtension | null;
/**
 * [KO] 전달받은 `DracoDecoderModule` 인스턴스를 사용해 모든 Draco 압축 `primitive`를 디코딩하고 표준 `bufferView`/`accessor`로 주입합니다.
 * [EN] Decodes all Draco-compressed primitives using the provided `DracoDecoderModule` and binds decoded data into standard `bufferView`/`accessor` entries.
 */
export declare const applyDecodedDracoPrimitives: (gltfData: GLTF, bufferDataViews: DataView[], draco: any) => number;
/**
 * [KO] `KHR_draco_mesh_compression`이 사용된 glTF의 모든 압축 프리미티브를 온디맨드 WASM으로 일괄 복원합니다.
 * [EN] Decodes all `KHR_draco_mesh_compression` primitives on demand using WASM.
 *
 * @param gltfData -
 * [KO] 파싱된 glTF 데이터 객체
 * [EN] Parsed glTF data object
 * @param bufferDataViews -
 * [KO] 로드된 버퍼 `DataView` 배열
 * [EN] Loaded buffer `DataView` array
 * @returns
 * [KO] 디코딩된 프리미티브 개수
 * [EN] Number of decoded primitives
 * @category GLTF
 */
declare const decodeDracoPrimitives: (gltfData: GLTF, bufferDataViews: DataView[]) => Promise<number>;
export default decodeDracoPrimitives;
