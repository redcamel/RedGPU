/**
 * WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.
 *
 * @category WGSL
 *
 * @param code - 파싱할 WGSL 셰이더 코드 문자열
 * @returns {
 *   uniforms: Uniform 변수 정보,
 *   storage: Storage 변수 정보,
 *   samplers: 샘플러 정보,
 *   textures: 텍스처 정보,
 *   vertexEntries: 버텍스 엔트리 포인트 이름 배열,
 *   fragmentEntries: 프래그먼트 엔트리 포인트 이름 배열,
 *   computeEntries: 컴퓨트 엔트리 포인트 이름 배열,
 *   defaultSource: 전처리된 WGSL 소스,
 *   shaderSourceVariant: 조건부 분기별 WGSL 소스,
 *   conditionalBlocks: 조건부 분기 정보
 * }
 */
declare const parseWGSL: (code: string) => any;
export default parseWGSL;
