import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
/**
 * [KO] 식생 렌더 파이프라인의 깊이 테스트 및 컬러 쓰기 동작 모드입니다.
 * [EN] Depth test and color write operation mode for foliage render pipelines.
 * @category Landscape
 */
export type FoliageDepthPassMode = 'normal' | 'depthPrepass' | 'mainShadingAfterDepth';
/**
 * [KO] 식생(Foliage)의 메인 패스, 깊이 프리패스, 그림자 패스용 인스턴싱 `GPURenderPipeline`을 생성하고 캐싱하는 레지스트리 클래스입니다.
 * [EN] Registry class that creates and caches instanced `GPURenderPipeline` objects for foliage main, depth prepass, and shadow passes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class FoliagePipelineRegistry extends RedGPUObject {
    #private;
    /**
     * [KO] `FoliagePipelineRegistry` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliagePipelineRegistry` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 메인 패스 또는 깊이 프리패스용 식생 렌더 파이프라인을 조회하거나 새로 생성하여 반환합니다.
     * [EN] Retrieves or creates a foliage render pipeline for the main pass or depth prepass.
     *
     * @param material -
     * [KO] 대상 머티리얼 인스턴스
     * [EN] Target material instance
     * @param sampleCount -
     * [KO] MSAA 샘플 수
     * [EN] MSAA sample count
     * @param msaaID -
     * [KO] MSAA 식별자 문자열
     * [EN] MSAA identifier string
     * @param strideBytes -
     * [KO] 정점 버퍼 스트라이드 바이트 수 (기본값: `72`)
     * [EN] Vertex buffer stride in bytes (default: `72`)
     * @param cullMode -
     * [KO] 폴리곤 컬링 모드 (기본값: `'none'`)
     * [EN] Polygon cull mode (default: `'none'`)
     * @param depthPassMode -
     * [KO] 깊이 패스 동작 모드 (기본값: `'normal'`)
     * [EN] Depth pass operation mode (default: `'normal'`)
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit dynamic uniform bind group layout (optional)
     * @param isMasked -
     * [KO] 알파 마스크 렌더링 여부 (기본값: `false`)
     * [EN] Whether alpha mask rendering is used (default: `false`)
     * @returns
     * [KO] 생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (유효하지 않은 경우 `null`)
     * [EN] Created or cached `GPURenderPipeline` instance (`null` if invalid)
     */
    getOrCreatePipeline(material: any, sampleCount: number, msaaID: string, strideBytes?: number, cullMode?: GPUCullMode, depthPassMode?: FoliageDepthPassMode, renderUnitBindGroupLayout?: GPUBindGroupLayout | null, isMasked?: boolean): GPURenderPipeline | null;
    /**
     * [KO] 불투명 병합 지오메트리 전용 그림자 패스 렌더 파이프라인을 조회하거나 새로 생성하여 반환합니다.
     * [EN] Retrieves or creates a shadow pass render pipeline dedicated to opaque merged geometry.
     *
     * @param strideBytes -
     * [KO] 위치 전용 정점 버퍼 스트라이드 바이트 수 (기본값: `12`)
     * [EN] Position-only vertex buffer stride in bytes (default: `12`)
     * @param cullMode -
     * [KO] 폴리곤 컬링 모드 (기본값: `'back'`)
     * [EN] Polygon cull mode (default: `'back'`)
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit dynamic uniform bind group layout (optional)
     * @returns
     * [KO] 생성 또는 캐시된 그림자 렌더 파이프라인(`GPURenderPipeline`)
     * [EN] Created or cached shadow render pipeline (`GPURenderPipeline`)
     */
    getOrCreateShadowMergedPipeline(strideBytes?: number, cullMode?: GPUCullMode, renderUnitBindGroupLayout?: GPUBindGroupLayout | null): GPURenderPipeline;
    /**
     * [KO] 알파 마스크(컷오프)가 적용된 식생 또는 임포스터용 그림자 패스 렌더 파이프라인을 조회하거나 생성하여 반환합니다.
     * [EN] Retrieves or creates a shadow pass render pipeline for alpha-masked (cutoff) foliage or impostors.
     *
     * @param material -
     * [KO] 대상 머티리얼 인스턴스
     * [EN] Target material instance
     * @param strideBytes -
     * [KO] 정점 버퍼 스트라이드 바이트 수 (기본값: `72`)
     * [EN] Vertex buffer stride in bytes (default: `72`)
     * @param cullMode -
     * [KO] 폴리곤 컬링 모드 (기본값: `'none'`)
     * [EN] Polygon cull mode (default: `'none'`)
     * @param renderUnitBindGroupLayout -
     * [KO] 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit dynamic uniform bind group layout (optional)
     * @returns
     * [KO] 생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (머티리얼 부재 시 `null`)
     * [EN] Created or cached `GPURenderPipeline` instance (`null` if material is absent)
     */
    getOrCreateShadowMaskedPipeline(material: any, strideBytes?: number, cullMode?: GPUCullMode, renderUnitBindGroupLayout?: GPUBindGroupLayout | null): GPURenderPipeline | null;
    /**
     * [KO] 캐싱된 모든 렌더 파이프라인을 초기화합니다.
     * [EN] Clears all cached render pipelines.
     */
    clearCache(): void;
}
export default FoliagePipelineRegistry;
