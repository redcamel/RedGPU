import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import BlendState from "../../renderState/BlendState";
import ResourceBase from "../../resources/core/ResourceBase";
import Sampler from "../../resources/sampler/Sampler";
import TINT_BLEND_MODE from "../TINT_BLEND_MODE";
import FragmentGPURenderInfo from "./FragmentGPURenderInfo";
/**
 * [KO] ABaseMaterial의 동적 공통 속성 인터페이스입니다.
 * [EN] Dynamic common property interface for ABaseMaterial.
 * @category Material
 */
interface ABaseMaterial {
    /**
     * [KO] 머티리얼의 불투명도 (0.0 ~ 1.0)
     * [EN] Opacity of the material (0.0 to 1.0)
     */
    opacity: number;
    /**
     * [KO] 머티리얼의 틴트 컬러 (ColorRGBA)
     * [EN] Tint color of the material (ColorRGBA)
     */
    tint: ColorRGBA;
    /**
     * [KO] 틴트 컬러 적용 여부
     * [EN] Whether to apply tint color
     */
    useTint: boolean;
    /**
     * [KO] 머티리얼 인스턴스 여부 플래그
     * [EN] Flag indicating whether it is a material instance
     */
    isInstanceofMaterial: boolean;
}
/**
 * [KO] 모든 머티리얼의 공통 기반이 되는 추상 클래스입니다.
 * [EN] Abstract class that serves as the common base for all materials.
 *
 * [KO] 프래그먼트 셰이더 모듈, 바인드 그룹 레이아웃, 블렌드 상태 및 공통 유니폼(투명도, 틴트)을 관리합니다.
 * [EN] Manages fragment shader modules, bind group layouts, blend states, and common uniforms (opacity, tint).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Material
 */
declare abstract class ABaseMaterial extends ResourceBase {
    #private;
    /**
     * [KO] 2패스 렌더링 사용 여부
     * [EN] Whether to use 2-pass rendering
     */
    use2PathRender: boolean;
    /**
     * [KO] 프래그먼트 GPU 렌더 파이프라인 정보 객체
     * [EN] Fragment GPU render pipeline information object
     */
    gpuRenderInfo: FragmentGPURenderInfo;
    /**
     * [KO] 파이프라인 갱신 필요 여부 플래그
     * [EN] Flag indicating whether the pipeline needs updating
     */
    dirtyPipeline: boolean;
    /**
     * [KO] 머티리얼 투명 렌더링 활성화 여부
     * [EN] Whether transparent rendering is enabled for the material
     */
    transparent: boolean;
    /**
     * [KO] ABaseMaterial 인스턴스를 초기화합니다.
     * [EN] Initializes an ABaseMaterial instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param moduleName -
     * [KO] 머티리얼 모듈 고유 이름
     * [EN] Unique name of the material module
     * @param fragmentSource -
     * [KO] 프래그먼트 셰이더 WGSL 소스 코드
     * [EN] Fragment shader WGSL source code
     * @param targetGroupIndex -
     * [KO] 바인드 그룹 타겟 인덱스
     * [EN] Bind group target index
     */
    protected constructor(redGPUContext: RedGPUContext, moduleName: string, fragmentSource: string, targetGroupIndex: number);
    /**
     * [KO] 현재 설정된 틴트 블렌드 모드의 키 이름을 반환하거나 새로운 모드를 설정합니다.
     * [EN] Returns the key name of the currently set tint blend mode or sets a new mode.
     *
     * @returns
     * [KO] 틴트 블렌드 모드 키 문자열 (예: `'MULTIPLY'`)
     * [EN] Tint blend mode key string (e.g., `'MULTIPLY'`)
     * @throws
     * [KO] 유효하지 않은 틴트 블렌드 모드 값 또는 키가 지정된 경우 Error 발생
     * [EN] Throws an Error if an invalid tint blend mode value or key is specified
     */
    get tintBlendMode(): string;
    set tintBlendMode(value: TINT_BLEND_MODE | keyof typeof TINT_BLEND_MODE);
    /**
     * [KO] 머티리얼 모듈 이름을 반환합니다.
     * [EN] Returns the material module name.
     *
     * @returns
     * [KO] 모듈 이름
     * [EN] Module name
     */
    get MODULE_NAME(): string;
    /**
     * [KO] 프래그먼트 셰이더 모듈 이름을 반환합니다.
     * [EN] Returns the fragment shader module name.
     *
     * @returns
     * [KO] 프래그먼트 셰이더 모듈 이름
     * [EN] Fragment shader module name
     */
    get FRAGMENT_SHADER_MODULE_NAME(): string;
    /**
     * [KO] 프래그먼트 바인드 그룹 디스크립터 이름을 반환합니다.
     * [EN] Returns the fragment bind group descriptor name.
     *
     * @returns
     * [KO] 바인드 그룹 디스크립터 이름
     * [EN] Bind group descriptor name
     */
    get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string;
    /**
     * [KO] 파싱된 셰이더 스토리지 구조체 정보를 반환합니다.
     * [EN] Returns the parsed shader storage structure information.
     *
     * @returns
     * [KO] 스토리지 구조체 정보
     * [EN] Storage structure information
     */
    get STORAGE_STRUCT(): any;
    /**
     * [KO] 파싱된 WGSL 셰이더 전체 정보를 반환합니다.
     * [EN] Returns the complete parsed WGSL shader information.
     *
     * @returns
     * [KO] 파싱된 셰이더 정보 객체
     * [EN] Parsed shader information object
     */
    get SHADER_INFO(): any;
    /**
     * [KO] 파싱된 셰이더 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the parsed shader uniform structure information.
     *
     * @returns
     * [KO] 유니폼 구조체 정보
     * [EN] Uniform structure information
     */
    get UNIFORM_STRUCT(): any;
    /**
     * [KO] 컬러 블렌드 상태 객체를 반환합니다.
     * [EN] Returns the color blend state object.
     *
     * @returns
     * [KO] 컬러 BlendState 인스턴스
     * [EN] Color BlendState instance
     */
    get blendColorState(): BlendState;
    /**
     * [KO] 알파 블렌드 상태 객체를 반환합니다.
     * [EN] Returns the alpha blend state object.
     *
     * @returns
     * [KO] 알파 BlendState 인스턴스
     * [EN] Alpha BlendState instance
     */
    get blendAlphaState(): BlendState;
    /**
     * [KO] 컬러 쓰기 마스크(GPUColorWrite) 상태를 반환하거나 설정합니다.
     * [EN] Returns or sets the color write mask (GPUColorWrite) state.
     *
     * @returns
     * [KO] GPUFlagsConstant 값
     * [EN] GPUFlagsConstant value
     */
    get writeMaskState(): GPUFlagsConstant;
    set writeMaskState(value: GPUFlagsConstant);
    /**
     * [KO] 글로벌 프래그먼트 SSBO 내 할당된 슬롯 인덱스를 반환합니다.
     * [EN] Returns the allocated slot index within the global fragment SSBO.
     *
     * @returns
     * [KO] 할당된 슬롯 인덱스 (미할당 시 `-1`)
     * [EN] Allocated slot index (`-1` if unallocated)
     */
    get globalFragmentSlotIndex(): number;
    /**
     * [KO] GPU 프래그먼트 렌더 파이프라인 정보와 유니폼 버퍼를 초기화합니다.
     * [EN] Initializes GPU fragment render pipeline information and uniform buffers.
     */
    initGPURenderInfos(): void;
    /**
     * [KO] 셰이더 바리안트를 점검하고 프래그먼트 바인드 그룹 및 렌더 상태를 갱신합니다.
     * [EN] Checks shader variants and updates the fragment bind group and render state.
     */
    _updateFragmentState(): void;
    /**
     * [KO] GPU 프래그먼트 렌더 상태(GPUFragmentState) 객체를 생성하여 반환합니다.
     * [EN] Creates and returns a GPU fragment render state (GPUFragmentState) object.
     *
     * @param entryPoint -
     * [KO] 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`)
     * [EN] Fragment shader entry point function name (default: `'main'`)
     * @returns
     * [KO] 구성된 GPUFragmentState 객체
     * [EN] Configured GPUFragmentState object
     */
    getFragmentRenderState(entryPoint?: string): GPUFragmentState;
    /**
     * [KO] 머티리얼의 기본 속성(유니폼, 컬러, 틴트 등)을 유니폼 버퍼 및 글로벌 SSBO에 동기화합니다.
     * [EN] Synchronizes basic material properties (uniforms, colors, tint, etc.) to the uniform buffer and global SSBO.
     */
    _updateBaseProperty(): void;
    /**
     * [KO] Sampler 인스턴스로부터 GPUSampler를 반환하며, 없을 경우 기본 GPUSampler를 반환합니다.
     * [EN] Returns the GPUSampler from a Sampler instance, or the default GPUSampler if not provided.
     *
     * @param sampler -
     * [KO] Sampler 인스턴스
     * [EN] Sampler instance
     * @returns
     * [KO] GPUSampler 인스턴스
     * [EN] GPUSampler instance
     */
    getGPUResourceSampler(sampler: Sampler): GPUSampler;
    /**
     * [KO] 머티리얼 인스턴스를 파기하고 할당된 유니폼 버퍼 및 글로벌 프래그먼트 슬롯을 해제합니다.
     * [EN] Destroys the material instance and releases allocated uniform buffers and global fragment slots.
     */
    destroy(): void;
}
export default ABaseMaterial;
