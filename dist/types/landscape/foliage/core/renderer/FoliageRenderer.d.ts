import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterRenderer from "../../../core/scatter/AScatterRenderer";
import View3D from "../../../../display/view/View3D";
import Foliage from "../Foliage";
import FoliagePipelineRegistry from "../pipeline/FoliagePipelineRegistry";
interface FoliageMainBundleCacheEntry {
    bundle: GPURenderBundle;
    systemBG: GPUBindGroup | null;
    sampleCount: number;
    validTypeCount: number;
}
/**
 * [KO] GPU 인다이렉트 드로우(`drawIndexedIndirect`)와 렌더 번들(`GPURenderBundle`) 캐싱을 활용하여 대량 폴리지 인스턴스의 Depth Prepass, 메인 패스, 그림자 패스 렌더링을 수행하는 클래스입니다.
 * [EN] Renderer class that performs Depth Prepass, main pass, and shadow pass rendering for massive foliage instances using GPU indirect drawing (`drawIndexedIndirect`) and render bundle (`GPURenderBundle`) caching.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class FoliageRenderer extends AScatterRenderer<FoliageMainBundleCacheEntry> {
    #private;
    /**
     * [KO] `FoliageRenderer` 인스턴스를 초기화합니다.
     * [EN] Initializes a `FoliageRenderer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param pipelineRegistry -
     * [KO] 폴리지 파이프라인 레지스트리
     * [EN] Foliage pipeline registry
     * @param renderUnitVertexBindGroupLayout -
     * [KO] 렌더 유닛 정점 바인드 그룹 레이아웃 (선택)
     * [EN] Render unit vertex bind group layout (optional)
     * @param renderUnitDynamicBindGroup -
     * [KO] 공유 렌더 유닛 다이내믹 바인드 그룹 (선택)
     * [EN] Shared render unit dynamic bind group (optional)
     */
    constructor(redGPUContext: RedGPUContext, pipelineRegistry: FoliagePipelineRegistry, renderUnitVertexBindGroupLayout?: GPUBindGroupLayout | null, renderUnitDynamicBindGroup?: GPUBindGroup | null);
    /**
     * [KO] 그림자, Depth Prepass, 메인 패스의 모든 캐싱된 렌더 번들을 무효화합니다.
     * [EN] Invalidates all cached render bundles for shadow, Depth Prepass, and main passes.
     */
    markAllBundlesDirty(): void;
    /**
     * [KO] 렌더러가 보유한 캐시 및 내부 참조를 모두 정리하고 파기합니다.
     * [EN] Cleans up and destroys all caches and internal references held by the renderer.
     */
    destroy(): void;
    /**
     * [KO] 지정된 뷰와 렌더 패스 인코더에 활성화된 폴리지 타입 목록을 메인 렌더링(Depth Prepass 포함)합니다.
     * [EN] Renders the active foliage type list into the specified view and render pass encoder (including Depth Prepass).
     *
     * @param view -
     * [KO] 렌더링할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to render
     * @param passEncoder -
     * [KO] 대상 렌더 패스 인코더
     * [EN] Target render pass encoder
     * @param typeList -
     * [KO] 렌더링할 `Foliage` 타입 배열
     * [EN] Array of `Foliage` types to render
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void;
    /**
     * [KO] 방향성 조명 그림자(Directional Shadow / CSM) 패스에 폴리지 인스턴스들을 렌더링합니다.
     * [EN] Renders foliage instances into the directional shadow (CSM) pass.
     *
     * @param view -
     * [KO] 렌더링할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to render
     * @param passEncoder -
     * [KO] 그림자 렌더 패스 인코더
     * [EN] Shadow render pass encoder
     * @param typeList -
     * [KO] 렌더링할 `Foliage` 타입 배열
     * [EN] Array of `Foliage` types to render
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder, typeList: Foliage[]): void;
}
export default FoliageRenderer;
