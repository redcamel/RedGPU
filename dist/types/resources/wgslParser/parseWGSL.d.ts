/**
 * [KO] WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.
 * [EN] Parses WGSL code and returns reflection information.
 *
 * [KO] 이 함수는 WGSL 소스 코드를 분석하여 유니폼, 스토리지, 샘플러, 텍스처 등의 정보를 추출하고, 조건부 컴파일(variant) 처리를 지원합니다.
 * [EN] This function analyzes WGSL source code to extract information about uniforms, storage, samplers, and textures, and supports conditional compilation (variant) processing.
 *
 * @param sourceName -
 * [KO] 셰이더 소스 식별 이름 (경고 출력용)
 * [EN] Shader source identifier name (for warnings)
 * @param code -
 * [KO] 파싱할 WGSL 셰이더 코드 문자열
 * [EN] WGSL shader code string to parse
 * @param injectLibrary -
 * [KO] 주입된 로컬 라이브러리 객체 (선택)
 * [EN] Injected local library object (optional)
 * @returns
 * [KO] 리플렉션 정보 및 전처리된 소스 코드를 포함하는 객체
 * [EN] An object containing reflection information and preprocessed source code
 * @category WGSL
 */
declare const parseWGSL: (sourceName: string, code: string, injectLibrary?: Record<string, string>) => {
    uniforms: any;
    storage: any;
    samplers: any;
    textures: any;
    vertexEntries: string[];
    fragmentEntries: string[];
    computeEntries: string[];
    defaultSource: string;
    shaderSourceVariant: any;
    conditionalBlocks: string[];
};
export default parseWGSL;
