import AccessorInfo_GLTF from "../cls/AccessorInfo_GLTF";
/**
 * [KO] glTF 접근자(`AccessorInfo_GLTF`)로부터 스칼라 인덱스 데이터를 읽어 사전 할당된 `Uint32Array`로 반환합니다.
 * [EN] Reads scalar index data from a glTF accessor (`AccessorInfo_GLTF`) and returns a pre-allocated `Uint32Array`.
 *
 * @param accessorInfo -
 * [KO] 파싱할 glTF 접근자 정보 인스턴스
 * [EN] glTF accessor information instance to parse
 * @returns
 * [KO] 파싱된 인덱스 `Uint32Array`
 * [EN] Parsed index `Uint32Array`
 * @category GLTF
 */
declare const parseIndicesInfo_GLTF: (accessorInfo: AccessorInfo_GLTF) => Uint32Array;
export default parseIndicesInfo_GLTF;
