import { Accessor, GLTF } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] GLTF Accessor의 희소(Sparse) 데이터를 파싱하여 대상 속성 배열에 직접 적용합니다.
 * [EN] Parses sparse data of a GLTF Accessor and applies it directly to the target attribute array.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param propertyKey -
 * [KO] 정점 속성 키 (예: `'POSITION'`, `'NORMAL'`, `'TANGENT'`, `'TEXCOORD_0'`, `'COLOR_0'`)
 * [EN] Vertex attribute key (e.g., `'POSITION'`, `'NORMAL'`, `'TANGENT'`, `'TEXCOORD_0'`, `'COLOR_0'`)
 * @param targetAccessor -
 * [KO] 대상 GLTF Accessor 객체
 * [EN] Target GLTF Accessor object
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param targetData -
 * [KO] 희소 데이터가 적용될 대상 속성 배열 (`Float32Array` 또는 `number[]`)
 * [EN] Target attribute array (`Float32Array` or `number[]`) to which sparse data will be applied
 * @category GLTF
 */
declare const parseSparse_GLTF: (gltfLoader: GLTFLoader, propertyKey: string, targetAccessor: Accessor, gltfData: GLTF, targetData: Float32Array | number[]) => void;
export default parseSparse_GLTF;
