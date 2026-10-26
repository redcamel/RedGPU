import RedGPUContext from "../../../../context/RedGPUContext";
import AScatterRenderer from "../../../core/scatter/AScatterRenderer";
import View3D from "../../../../display/view/View3D";
import Grass from "../Grass";
import GrassMegaBuffer from "../buffer/GrassMegaBuffer";
import GrassSlotPooler from "../buffer/GrassSlotPooler";
interface MainBundleCacheEntry {
    bundle: GPURenderBundle;
    systemBG: GPUBindGroup;
    sampleCount: number;
    grassCount: number;
    megaBufferInstance: GrassMegaBuffer;
}
/**
 * [KO] 컬링된 잔디 인스턴스를 `GPURenderBundle` 및 간접 드로우(Indirect Draw) 방식으로 메인 패스와 그림자 패스에 렌더링하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that renders culled grass instances in main and shadow passes using `GPURenderBundle` and indirect draw calls.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
declare class GrassRenderer extends AScatterRenderer<MainBundleCacheEntry> {
    #private;
    /**
     * [KO] `GrassRenderer` 인스턴스를 생성합니다.
     * [EN] Creates a `GrassRenderer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 메인 및 그림자 렌더 번들과 바인드 그룹 캐시를 모두 더티 상태로 표시합니다.
     * [EN] Marks all main and shadow render bundles and bind group caches as dirty.
     */
    markAllBundlesDirty(): void;
    /**
     * [KO] 그림자 렌더 번들이 더티 상태가 될 때 내부 캐시 상태를 초기화합니다.
     * [EN] Resets internal cache states when the shadow render bundle becomes dirty.
     */
    onShadowBundleDirty(): void;
    /**
     * [KO] 렌더러가 점유한 파이프라인, 셰이더 모듈, 바인드 그룹 및 렌더 번들 캐시를 모두 해제합니다.
     * [EN] Releases all pipelines, shader modules, bind groups, and render bundle caches occupied by the renderer.
     */
    destroy(): void;
    /**
     * [KO] 메인 렌더 패스에서 근거리 및 원거리 잔디 인스턴스를 렌더링합니다.
     * [EN] Renders near and far grass instances in the main render pass.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param passEncoder -
     * [KO] 현재 `GPURenderPassEncoder` 인스턴스
     * [EN] Current `GPURenderPassEncoder` instance
     * @param grassList -
     * [KO] 렌더링할 `Grass` 타입 배열
     * [EN] Array of `Grass` types to render
     * @param megaBuffer -
     * [KO] 잔디 메가 버퍼 인스턴스
     * [EN] Grass mega buffer instance
     * @param slotPooler -
     * [KO] 잔디 유니폼 슬롯 풀러 인스턴스
     * [EN] Grass uniform slot pooler instance
     */
    render(view: View3D, passEncoder: GPURenderPassEncoder, grassList: Grass[], megaBuffer: GrassMegaBuffer, slotPooler: GrassSlotPooler): void;
    /**
     * [KO] 디렉셔널 섀도우 맵(CSM) 렌더 패스에서 잔디 그림자를 렌더링합니다.
     * [EN] Renders grass shadows in the directional shadow map (CSM) render pass.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param passEncoder -
     * [KO] 그림자 패스용 `GPURenderPassEncoder` 인스턴스
     * [EN] `GPURenderPassEncoder` instance for the shadow pass
     * @param grassList -
     * [KO] 렌더링할 `Grass` 타입 배열
     * [EN] Array of `Grass` types to render
     * @param megaBuffer -
     * [KO] 잔디 메가 버퍼 인스턴스
     * [EN] Grass mega buffer instance
     * @param slotPooler -
     * [KO] 잔디 유니폼 슬롯 풀러 인스턴스
     * [EN] Grass uniform slot pooler instance
     */
    renderShadow(view: View3D, passEncoder: GPURenderPassEncoder, grassList: Grass[], megaBuffer: GrassMegaBuffer, slotPooler: GrassSlotPooler): void;
}
export default GrassRenderer;
