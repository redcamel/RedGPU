import RedGPUObject from "../../../base/RedGPUObject";
import type Landscape from "../../Landscape";
/**
 * [KO] `Landscape` 지형 객체의 렌더 파이프라인 캐싱과 LOD별 간접 드로우(`drawIndexedIndirect`) 호출을 수행하는 렌더러 클래스입니다.
 * [EN] Renderer class that manages render pipeline caching and executes per-LOD indirect draw (`drawIndexedIndirect`) calls for a `Landscape` terrain object.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class LandscapeRenderer extends RedGPUObject {
    #private;
    /**
     * [KO] `LandscapeRenderer` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeRenderer` instance.
     *
     * @param landscape -
     * [KO] 렌더링할 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance to render
     */
    constructor(landscape: Landscape);
    /**
     * [KO] 현재 렌더 패스 인코더에 지형 파이프라인 및 바인드 그룹을 설정하고 모든 LOD 레벨에 대해 간접 드로우를 수행합니다.
     * [EN] Binds the terrain pipeline and bind groups to the current render pass encoder and executes indirect draws for all LOD levels.
     *
     * @param view -
     * [KO] 현재 렌더링 뷰 또는 `RenderViewStateData` 객체
     * [EN] Current render view or `RenderViewStateData` object
     * @param passEncoder -
     * [KO] 사용할 `GPURenderPassEncoder` (생략 시 `view`에서 추출)
     * [EN] `GPURenderPassEncoder` to use (extracted from `view` if omitted)
     */
    render(view: any, passEncoder?: GPURenderPassEncoder): void;
    /**
     * [KO] 캐싱된 모든 지형 렌더 파이프라인 상태를 초기화합니다.
     * [EN] Clears all cached terrain render pipeline states.
     */
    clearPipelineCaches(): void;
    /**
     * [KO] 렌더러의 파이프라인 캐시 및 지형 참조를 해제합니다.
     * [EN] Releases the renderer's pipeline cache and terrain references.
     */
    destroy(): void;
}
export default LandscapeRenderer;
