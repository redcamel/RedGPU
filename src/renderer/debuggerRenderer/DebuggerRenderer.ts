import View3D from "../../display/view/View3D";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import updateViewportAndScissor from "../helperFunc/updateViewportAndScissor";

/**
 * [KO] 후처리(`PostEffectManager`)가 완료된 LDR 화면 위에 모든 3D 디버거(`DrawDebuggerGrid`, `DrawDebuggerAxis`, `DrawDebuggerMesh`, `ADrawDebuggerLight`)를 단일 렌더 패스로 오버레이 렌더링하는 전담 클래스입니다.
 * [EN] Dedicated class that renders all 3D debuggers (`DrawDebuggerGrid`, `DrawDebuggerAxis`, `DrawDebuggerMesh`, `ADrawDebuggerLight`) as a single overlay render pass onto the LDR screen after `PostEffectManager` completes.
 *
 * [KO] 디버거 렌더링을 메인 HDR G-Buffer 패스 및 후처리 파이프라인에서 완전히 격리하여 `AutoExposure` 휘도 왜곡과 `Fog`/`DOF`/`SSR`/`ToneMapping` 간섭을 원천 차단합니다.
 * [EN] Completely isolates debugger rendering from the main HDR G-Buffer pass and post-processing pipeline, preventing `AutoExposure` luminance distortion and interference with `Fog`/`DOF`/`SSR`/`ToneMapping`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Renderer
 */
class DebuggerRenderer {
    #colorAttachment: GPURenderPassColorAttachment;
    #depthStencilAttachment: GPURenderPassDepthStencilAttachment;
    #renderPassDescriptor: GPURenderPassDescriptor;
    #currentView: View3D = null;

    /**
     * [KO] `DebuggerRenderer` 인스턴스를 생성합니다.
     * [EN] Creates a `DebuggerRenderer` instance.
     */
    constructor() {
        this.#colorAttachment = {
            view: null as any,
            loadOp: GPU_LOAD_OP.LOAD,
            storeOp: GPU_STORE_OP.STORE,
        };
        this.#depthStencilAttachment = {
            view: null as any,
            depthLoadOp: GPU_LOAD_OP.LOAD,
            depthStoreOp: GPU_STORE_OP.STORE,
        };
        this.#renderPassDescriptor = {
            label: 'DebuggerRenderer Overlay Render Pass',
            colorAttachments: [this.#colorAttachment],
            depthStencilAttachment: this.#depthStencilAttachment,
        };
    }

    /**
     * [KO] 현재 프레임에서 뷰에 렌더링할 활성 디버거 번들이 존재하는지 여부를 반환합니다.
     * [EN] Returns whether there are active debugger bundles to render in the view for the current frame.
     *
     * @param view -
     * [KO] 확인할 `View3D` 인스턴스
     * [EN] `View3D` instance to check
     * @returns
     * [KO] 활성 디버거 번들 존재 여부
     * [EN] Whether active debugger bundles exist
     */
    hasActiveDebuggers(view: View3D): boolean {
        return view.renderViewStateData.renderBundleResults.bundleListDebuggerLayer.length > 0;
    }

    /**
     * [KO] 수집된 모든 디버거 렌더 번들(`bundleListDebuggerLayer`)을 단일 LDR 오버레이 렌더 패스로 일괄 실행합니다.
     * [EN] Executes all collected debugger render bundles (`bundleListDebuggerLayer`) in a single LDR overlay render pass.
     *
     * @param view -
     * [KO] 렌더링할 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance to render
     * @param targetTextureView -
     * [KO] 후처리가 완료된 LDR 컬러 타겟 텍스처 뷰 (`rgba8unorm`)
     * [EN] Post-processed LDR color target texture view (`rgba8unorm`)
     */
    render(view: View3D, targetTextureView: GPUTextureView): void {
        const {bundleListDebuggerLayer} = view.renderViewStateData.renderBundleResults;
        if (bundleListDebuggerLayer.length) {
            const {redGPUContext, viewRenderTextureManager} = view;
            const {useMSAA} = redGPUContext.antialiasingManager;
            const {depthTextureView, renderPath1DepthResultTextureView} = viewRenderTextureManager;
            const singleSampleDepthView = useMSAA ? renderPath1DepthResultTextureView : depthTextureView;

            this.#colorAttachment.view = targetTextureView;
            this.#depthStencilAttachment.view = singleSampleDepthView;
            this.#currentView = view;

            redGPUContext.commandEncoderManager.addPostProcessRenderPass(
                this.#renderPassDescriptor,
                this.#executeRenderPass
            );
            this.#currentView = null;
        }

        const {builtInEffectManager, rawCamera} = view;
        if (
            rawCamera.useAutoExposure &&
            builtInEffectManager.hasAutoExposure &&
            builtInEffectManager.autoExposure.useDebugOverlay
        ) {
            builtInEffectManager.autoExposure.renderDebugOverlay(targetTextureView);
        }
    }

    #executeRenderPass = (passEncoder: GPURenderPassEncoder): void => {
        const view = this.#currentView;
        updateViewportAndScissor(view, passEncoder, 'DEFAULT');
        passEncoder.executeBundles(view.renderViewStateData.renderBundleResults.bundleListDebuggerLayer);
    };
}

Object.freeze(DebuggerRenderer);
export default DebuggerRenderer;
