import ShaderVariantGenerator from "./core/ShaderVariantGenerator";
/**
 * [KO] WGSL 셰이더의 조건부 블록(`#redgpu_if`) 파싱 정보를 담는 인터페이스입니다.
 * [EN] Interface representing parsed conditional block (`#redgpu_if`) information in a WGSL shader.
 *
 * @category WGSL
 */
export interface ConditionalBlock {
    /**
     * [KO] 조건부 활성화 기준 유니폼 이름
     * [EN] Uniform name used as the conditional activation key
     */
    uniformName: string;
    /**
     * [KO] 조건이 참일 때 포함될 코드 블록
     * [EN] Code block included when the condition is true
     */
    ifBlock: string;
    /**
     * [KO] 조건이 거짓일 때 포함될 코드 블록
     * [EN] Code block included when the condition is false
     */
    elseBlock?: string;
    /**
     * [KO] 원본 코드에서 매칭된 전체 조건부 구문 문자열
     * [EN] Full matched conditional statement string from the original code
     */
    fullMatch: string;
    /**
     * [KO] 조건부 블록의 순번 인덱스
     * [EN] Sequential index of the conditional block
     */
    blockIndex: number;
}
/**
 * [KO] WGSL 전처리 결과 데이터를 담는 인터페이스입니다.
 * [EN] Interface representing preprocessed WGSL result data.
 *
 * @category WGSL
 */
export interface PreprocessedWGSLResult {
    /**
     * [KO] 전처리 캐시 식별 키
     * [EN] Preprocessing cache identification key
     */
    cacheKey: string;
    /**
     * [KO] 기본 조건('none')으로 생성된 WGSL 셰이더 소스 코드
     * [EN] WGSL shader source code generated with the default condition ('none')
     */
    defaultSource: string;
    /**
     * [KO] 셰이더 변형(Variant) 생성기 인스턴스
     * [EN] Shader variant generator instance
     */
    shaderSourceVariant: ShaderVariantGenerator;
    /**
     * [KO] 추출된 고유 조건부 키 배열
     * [EN] Array of extracted unique conditional keys
     */
    conditionalBlocks: string[];
    /**
     * [KO] 파싱된 조건부 블록 상세 정보 배열
     * [EN] Array of parsed conditional block details
     */
    conditionalBlockInfos: ConditionalBlock[];
}
/**
 * [KO] WGSL 셰이더 코드를 전처리하고 리플렉션 데이터를 파싱 및 캐싱하는 클래스입니다.
 * [EN] Class that preprocesses WGSL shader code and parses and caches reflection data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category WGSL
 */
declare class WGSLParser {
    #private;
    /**
     * [KO] 특정 네임스페이스에 서브시스템 또는 확장 WGSL 셰이더 라이브러리를 등록합니다.
     * [EN] Registers a subsystem or extension WGSL shader library under a specific namespace.
     *
     * @param namespace -
     * [KO] 네임스페이스 키 (예: 'landscape')
     * [EN] Namespace key (e.g., 'landscape')
     * @param library -
     * [KO] WGSL 셰이더 조각 컬렉션 객체
     * [EN] WGSL shader snippet collection object
     */
    static registerLibrary(namespace: string, library: any): void;
    /**
     * [KO] 파서 내부 캐시 맵의 모든 자원을 명시적으로 해제합니다.
     * [EN] Explicitly releases all resources in the parser's internal cache maps.
     */
    destroy(): void;
    /**
     * [KO] WGSL 코드를 전처리하고 유니폼, 스토리지, 구조체, 텍스처 및 엔트리 포인트 리플렉션 정보를 반환합니다.
     * [EN] Preprocesses WGSL code and returns reflection information for uniforms, storages, structs, textures, and entry points.
     *
     * @param sourceName -
     * [KO] 셰이더 소스 식별 이름
     * [EN] Shader source identification name
     * @param code -
     * [KO] 원본 WGSL 셰이더 코드 문자열
     * [EN] Raw WGSL shader code string
     * @returns
     * [KO] 파싱된 리플렉션 데이터 및 변형 생성기 객체
     * [EN] Parsed reflection data and variant generator object
     * @throws
     * [KO] `sourceName`이 누락되었거나 전처리 구문이 잘못된 경우 Error 발생
     * [EN] Throws Error if `sourceName` is missing or preprocessing syntax is invalid
     */
    parse(sourceName: string, code: string): {
        uniforms: any;
        storage: any;
        structs: any;
        samplers: any;
        textures: any;
        vertexEntries: string[];
        fragmentEntries: string[];
        computeEntries: string[];
        defaultSource: string;
        shaderSourceVariant: any;
        conditionalBlocks: string[];
    };
}
export default WGSLParser;
