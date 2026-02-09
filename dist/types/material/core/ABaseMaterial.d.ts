import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import BlendState from "../../renderState/BlendState";
import ResourceBase from "../../resources/core/ResourceBase";
import Sampler from "../../resources/sampler/Sampler";
import TINT_BLEND_MODE from "../TINT_BLEND_MODE";
import FragmentGPURenderInfo from "./FragmentGPURenderInfo";
interface ABaseMaterial {
    /**
     * [KO] 머티리얼의 불투명도(0~1)
     * [EN] Material opacity (0~1)
     */
    opacity: number;
    /**
     * [KO] 머티리얼의 틴트 컬러(RGBA)
     * [EN] Material tint color (RGBA)
     */
    tint: ColorRGBA;
    /**
     * [KO] 틴트 컬러 사용 여부
     * [EN] Whether to use tint color
     */
    useTint: boolean;
}
/**
 * [KO] 다양한 머티리얼의 공통 기반이 되는 추상 클래스입니다.
 * [EN] Abstract class serving as a common base for various materials.
 *
 * [KO] 셰이더 정보, 유니폼/텍스처/샘플러 구조, 블렌드 상태 등 렌더 파이프라인의 핵심 속성을 관리합니다.
 * [EN] It manages core attributes of the render pipeline such as shader information, uniform/texture/sampler structures, and blend states.
 *
 * [KO] 머티리얼별로 GPU 파이프라인의 셰이더, 바인드 그룹, 블렌딩, 컬러/알파, 틴트, 투명도 등 다양한 렌더링 속성을 일관성 있게 제어할 수 있습니다.
 * [EN] It allows consistent control of various rendering attributes such as shader, bind group, blending, color/alpha, tint, and transparency of the GPU pipeline for each material.
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
     * [KO] 프래그먼트 GPU 렌더 정보 객체
     * [EN] Fragment GPU render info object
     */
    gpuRenderInfo: FragmentGPURenderInfo;
    /**
     * [KO] 파이프라인 dirty 상태 플래그
     * [EN] Pipeline dirty status flag
     */
    dirtyPipeline: boolean;
    /**
     * [KO] 머티리얼 투명도 여부
     * [EN] Whether the material is transparent
     */
    transparent: boolean;
    /**
     * [KO] ABaseMaterial 생성자
     * [EN] ABaseMaterial constructor
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param moduleName -
     * [KO] 머티리얼 모듈명
     * [EN] Material module name
     * @param SHADER_INFO -
     * [KO] 파싱된 WGSL 셰이더 정보
     * [EN] Parsed WGSL shader info
     * @param targetGroupIndex -
     * [KO] 바인드 그룹 인덱스
     * [EN] Bind group index
     */
    constructor(redGPUContext: RedGPUContext, moduleName: string, SHADER_INFO: any, targetGroupIndex: number);
    /**
     * [KO] 틴트 블렌드 모드 이름을 반환합니다.
     * [EN] Returns the tint blend mode name.
     * @returns
     * [KO] 틴트 블렌드 모드 이름
     * [EN] Tint blend mode name
     */
    get tintBlendMode(): string;
    /**
     * [KO] 틴트 블렌드 모드를 설정합니다.
     * [EN] Sets the tint blend mode.
     * @param value -
     * [KO] 틴트 블렌드 모드 값 또는 키
     * [EN] Tint blend mode value or key
     */
    set tintBlendMode(value: TINT_BLEND_MODE | keyof typeof TINT_BLEND_MODE);
    /**
     * [KO] 머티리얼 모듈명을 반환합니다.
     * [EN] Returns the material module name.
     */
    get MODULE_NAME(): string;
    /**
     * [KO] 프래그먼트 셰이더 모듈명을 반환합니다.
     * [EN] Returns the fragment shader module name.
     */
    get FRAGMENT_SHADER_MODULE_NAME(): string;
    /**
     * [KO] 프래그먼트 바인드 그룹 디스크립터명을 반환합니다.
     * [EN] Returns the fragment bind group descriptor name.
     */
    get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string;
    /**
     * [KO] 셰이더 storage 구조 정보를 반환합니다.
     * [EN] Returns the shader storage structure information.
     */
    get STORAGE_STRUCT(): any;
    /**
     * [KO] 셰이더 uniforms 구조 정보를 반환합니다.
     * [EN] Returns the shader uniforms structure information.
     */
    get UNIFORM_STRUCT(): any;
    /**
     * [KO] 머티리얼의 컬러 블렌드 상태 객체 반환
     * [EN] Returns the material's color blend state object
     */
    get blendColorState(): BlendState;
    /**
     * [KO] 머티리얼의 알파 블렌드 상태 객체 반환
     * [EN] Returns the material's alpha blend state object
     */
    get blendAlphaState(): BlendState;
    /**
     * [KO] 머티리얼의 writeMask 상태 반환
     * [EN] Returns the material's writeMask state
     */
    get writeMaskState(): GPUFlagsConstant;
    /**
     * [KO] 머티리얼의 writeMask 상태 설정
     * [EN] Sets the material's writeMask state
     * @param value -
     * [KO] GPUFlagsConstant 값
     * [EN] GPUFlagsConstant value
     */
    set writeMaskState(value: GPUFlagsConstant);
    /**
     * [KO] GPU 렌더 파이프라인 정보 및 유니폼 버퍼를 초기화합니다.
     * [EN] Initializes GPU render pipeline info and uniform buffer.
     */
    initGPURenderInfos(): void;
    /**
     * [KO] 프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등의 상태를 갱신합니다.
     * [EN] Updates fragment shader bind group/uniform/texture/sampler states.
     * @protected
     */
    _updateFragmentState(): void;
    /**
     * [KO] GPU 프래그먼트 렌더 상태 객체를 반환합니다.
     * [EN] Returns the GPU fragment render state object.
     * @param entryPoint -
     * [KO] 셰이더 엔트리포인트 (기본값: 'main')
     * [EN] Shader entry point (default: 'main')
     * @returns
     * [KO] GPU 프래그먼트 상태
     * [EN] GPU fragment state
     */
    getFragmentRenderState(entryPoint?: string): GPUFragmentState;
    /**
     * [KO] 머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영합니다.
     * [EN] Reflects basic material properties such as uniforms/color/tint to the uniform buffer.
     * @protected
     */
    _updateBaseProperty(): void;
    /**
     * [KO] 샘플러 객체에서 GPU 샘플러를 반환합니다.
     * [EN] Returns the GPU sampler from the Sampler object.
     * @param sampler -
     * [KO] Sampler 객체
     * [EN] Sampler object
     * @returns
     * [KO] GPUSampler 인스턴스
     * [EN] GPUSampler instance
     */
    getGPUResourceSampler(sampler: Sampler): GPUSampler;
}
export default ABaseMaterial;
