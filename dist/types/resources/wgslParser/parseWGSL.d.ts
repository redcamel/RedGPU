/**
 * [KO] WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.
 * [EN] Parses WGSL code and returns reflection information.
 *
 * [KO] 이 함수는 WGSL 소스 코드를 분석하여 유니폼, 스토리지, 샘플러, 텍스처 등의 정보를 추출하고, 조건부 컴파일(variant) 처리를 지원합니다.
 * [EN] This function analyzes WGSL source code to extract information about uniforms, storage, samplers, and textures, and supports conditional compilation (variant) processing.
 *
 * @param code -
 * [KO] 파싱할 WGSL 셰이더 코드 문자열
 * [EN] WGSL shader code string to parse
 * @returns
 * [KO] 리플렉션 정보 및 전처리된 소스 코드를 포함하는 객체
 * [EN] An object containing reflection information and preprocessed source code
 * @category WGSL
 */
declare const parseWGSL: (code: string) => any;
export default parseWGSL;
