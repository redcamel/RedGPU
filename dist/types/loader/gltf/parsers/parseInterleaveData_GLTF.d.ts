/**
 * [KO] glTF 정점 속성 배열들을 단일 인터리브(`interleaveData`) 배열로 병합합니다.
 * [EN] Merges glTF vertex attribute arrays into a single interleaved (`interleaveData`) array.
 *
 * @param interleaveData -
 * [KO] 인터리브 데이터를 기록할 출력 배열
 * [EN] Output array to write interleaved data into
 * @param vertices -
 * [KO] 정점 위치 좌표 배열
 * [EN] Vertex position coordinate array
 * @param verticesColor_0 -
 * [KO] 정점 색상 배열
 * [EN] Vertex color array
 * @param normalData -
 * [KO] 정점 법선 벡터 배열
 * [EN] Vertex normal vector array
 * @param uvs -
 * [KO] 기본 텍스처 좌표(`TEXCOORD_0`) 배열
 * [EN] Primary texture coordinate (`TEXCOORD_0`) array
 * @param uvs1 -
 * [KO] 보조 텍스처 좌표(`TEXCOORD_1`) 배열
 * [EN] Secondary texture coordinate (`TEXCOORD_1`) array
 * @param uvs2 -
 * [KO] 추가 텍스처 좌표(`TEXCOORD_2`) 배열
 * [EN] Additional texture coordinate (`TEXCOORD_2`) array
 * @param jointWeights -
 * [KO] 스키닝 조인트 가중치 배열
 * [EN] Skinning joint weight array
 * @param joints -
 * [KO] 스키닝 조인트 인덱스 배열
 * [EN] Skinning joint index array
 * @param tangents -
 * [KO] 정점 탄젠트 벡터 배열
 * [EN] Vertex tangent vector array
 * @param onlyWeights -
 * [KO] 조인트 가중치만 단독 추출할지 여부 (기본값: `false`)
 * [EN] Whether to extract only joint weights (default: `false`)
 * @param onlyJoints -
 * [KO] 조인트 인덱스만 단독 추출할지 여부 (기본값: `false`)
 * [EN] Whether to extract only joint indices (default: `false`)
 * @category GLTF
 */
declare const parseInterleaveData_GLTF: (interleaveData: number[], vertices: number[], verticesColor_0: number[], normalData: number[], uvs: number[], uvs1: number[], uvs2: number[], jointWeights: number[], joints: number[], tangents: number[], onlyWeights?: boolean, onlyJoints?: boolean) => void;
export default parseInterleaveData_GLTF;
