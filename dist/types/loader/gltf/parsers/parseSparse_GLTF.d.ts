import { Accessor, GLTF } from "../GLTF";
import GLTFLoader from "../GLTFLoader";
/**
 * [KO] GLTF Accessor의 희소(Sparse) 데이터를 파싱하여 정점 배열에 적용합니다.
 * [EN] Parses sparse data of a GLTF Accessor and applies it to the vertex array.
 *
 * @param gltfLoader -
 * [KO] GLTFLoader 인스턴스
 * [EN] GLTFLoader instance
 * @param propertyKey -
 * [KO] 정점 속성 키 (예: 'POSITION', 'NORMAL', 'TEXCOORD_0')
 * [EN] Vertex attribute key (e.g., 'POSITION', 'NORMAL', 'TEXCOORD_0')
 * @param targetAccessor -
 * [KO] 대상 GLTF Accessor 객체
 * [EN] Target GLTF Accessor object
 * @param gltfData -
 * [KO] GLTF 데이터 객체
 * [EN] GLTF data object
 * @param vertices -
 * [KO] 희소 데이터가 적용될 대상 정점 배열
 * [EN] Target vertex array to which sparse data will be applied
 * @category Loader
 */
declare const parseSparse_GLTF: (gltfLoader: GLTFLoader, propertyKey: string, targetAccessor: Accessor, gltfData: GLTF, vertices: any) => void;
export default parseSparse_GLTF;
