import ColorRGBA from "../../color/ColorRGBA";
import RedGPUContext from "../../context/RedGPUContext";
import FragmentGPURenderInfo from "./FragmentGPURenderInfo";
import BlendState from "../../renderState/BlendState";
import ResourceBase from "../../resources/core/ResourceBase";
import Sampler from "../../resources/sampler/Sampler";
import TINT_BLEND_MODE from "../TINT_BLEND_MODE";
interface ABaseMaterial {
    /**
     * 머티리얼의 불투명도(0~1)
     */
    opacity: number;
    /**
     * 머티리얼의 틴트 컬러(RGBA)
     */
    tint: ColorRGBA;
    /**
     * 틴트 컬러 사용 여부
     */
    useTint: boolean;
}
/**
 *
 * 다양한 머티리얼의 공통 기반이 되는 추상 클래스입니다. 셰이더 정보, 유니폼/텍스처/샘플러 구조, 블렌드 상태 등 렌더 파이프라인의 핵심 속성을 관리합니다.
 *
 * 머티리얼별로 GPU 파이프라인의 셰이더, 바인드 그룹, 블렌딩, 컬러/알파, 틴트, 투명도 등 다양한 렌더링 속성을 일관성 있게 제어할 수 있습니다.
 *
 * @extends ResourceBase
 */
declare abstract class ABaseMaterial extends ResourceBase {
    #private;
    /**
     * 2패스 렌더링 사용 여부
     */
    use2PathRender: boolean;
    /**
     * 프래그먼트 GPU 렌더 정보 객체
     */
    gpuRenderInfo: FragmentGPURenderInfo;
    /**
     * 파이프라인 dirty 상태 플래그
     */
    dirtyPipeline: boolean;
    /**
     * 머티리얼 투명도 여부
     */
    transparent: boolean;
    /**
     * ABaseMaterial 생성자
     * @param redGPUContext - RedGPUContext 인스턴스
     * @param moduleName - 머티리얼 모듈명
     * @param SHADER_INFO - 파싱된 WGSL 셰이더 정보
     * @param targetGroupIndex - 바인드 그룹 인덱스

     */
    constructor(redGPUContext: RedGPUContext, moduleName: string, SHADER_INFO: any, targetGroupIndex: number);
    get tintBlendMode(): string;
    set tintBlendMode(value: TINT_BLEND_MODE | keyof typeof TINT_BLEND_MODE);
    get MODULE_NAME(): string;
    get FRAGMENT_SHADER_MODULE_NAME(): string;
    get FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME(): string;
    get STORAGE_STRUCT(): any;
    get UNIFORM_STRUCT(): any;
    /**
     * 머티리얼의 컬러 블렌드 상태 객체 반환

     */
    get blendColorState(): BlendState;
    /**
     * 머티리얼의 알파 블렌드 상태 객체 반환

     */
    get blendAlphaState(): BlendState;
    /**
     * 머티리얼의 writeMask 상태 반환

     */
    get writeMaskState(): GPUFlagsConstant;
    /**
     * 머티리얼의 writeMask 상태 설정
     * @param value - GPUFlagsConstant 값

     */
    set writeMaskState(value: GPUFlagsConstant);
    /**
     * GPU 렌더 파이프라인 정보 및 유니폼 버퍼 초기화

     */
    initGPURenderInfos(): void;
    /**
     * 프래그먼트 셰이더 바인드 그룹/유니폼/텍스처/샘플러 등 상태 갱신

     */
    _updateFragmentState(): void;
    /**
     * GPU 프래그먼트 렌더 상태 객체 반환
     * @param entryPoint - 셰이더 엔트리포인트(기본값: 'main')

     */
    getFragmentRenderState(entryPoint?: string): GPUFragmentState;
    /**
     * 머티리얼의 유니폼/컬러/틴트 등 기본 속성값을 유니폼 버퍼에 반영

     */
    _updateBaseProperty(): void;
    /**
     * 샘플러 객체에서 GPU 샘플러 반환
     * @param sampler - Sampler 객체

     */
    getGPUResourceSampler(sampler: Sampler): GPUSampler;
}
export default ABaseMaterial;
