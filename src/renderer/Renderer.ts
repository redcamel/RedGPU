import {mat4} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
import View3D from "../display/view/View3D";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import GltfAnimationLooperManager from "../loader/gltf/animationLooper/GltfAnimationLooperManager";
import ParsedSkinInfo_GLTF from "../loader/gltf/cls/ParsedSkinInfo_GLTF";
import DrawBufferManager from "./core/DrawBufferManager";
import FinalRender from "./finalRender/FinalRender";
import {COMMAND_ENCODER_TYPE} from "./commandEncoder/COMMAND_ENCODER_TYPE";
import renderAlphaLayer from "./renderLayers/renderAlphaLayer";
import renderBasicLayer from "./renderLayers/renderBasicLayer";
import renderPickingLayer from "./renderLayers/renderPickingLayer";
import renderShadowLayer from "./renderLayers/renderShadowLayer";
import processAnimationsAndSkinning from "./helperFunc/processAnimationsAndSkinning";
import updateJitter from "./helperFunc/updateJitter";

/**
 * [KO] RedGPU의 핵심 렌더러 클래스입니다.
 * [EN] The core renderer class of RedGPU.
 *
 * [KO] 렌더링 루프를 관리하고, 각 뷰(View3D)의 렌더링 패스를 실행하며, 최종적으로 화면에 결과를 표시합니다. 디버그 렌더링 및 애니메이션 업데이트도 담당합니다.
 * [EN] Manages the rendering loop, executes rendering passes for each View3D, and finally displays the result on the screen. It also handles debug rendering and animation updates.
 *
 * * ### Example
 * ```typescript
 * const renderer = new RedGPU.Renderer();
 * renderer.start(redGPUContext, (time) => {
 *     // 사용자 정의 렌더링 로직 (User custom rendering logic)
 * });
 * ```
 *
 * @category Renderer
 */
class Renderer {
    #prevViewportSize: { width: number, height: number };
    #finalRender: FinalRender
    #gltfAnimationLooperManager: GltfAnimationLooperManager = new GltfAnimationLooperManager()

    constructor() {
    }

    /**
     * [KO] 렌더링 루프를 시작합니다.
     * [EN] Starts the rendering loop.
     *
     * * ### Example
     * ```typescript
     * renderer.start(redGPUContext, (time) => {
     *     // 매 프레임 호출되는 콜백 (Callback called every frame)
     * });
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param render -
     * [KO] 매 프레임 실행될 사용자 정의 콜백 함수
     * [EN] User-defined callback function to be executed every frame
     */
    start(redGPUContext: RedGPUContext, render: Function) {
        cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
        const HD_render = (time: number) => {
            render?.(time)
            redGPUContext.currentTime = time
            this.renderFrame(redGPUContext, time)
            redGPUContext.currentRequestAnimationFrame = requestAnimationFrame(HD_render)
        }
        redGPUContext.currentRequestAnimationFrame = requestAnimationFrame(HD_render)
    }

    /**
     * [KO] 렌더링 루프를 정지합니다.
     * [EN] Stops the rendering loop.
     *
     * * ### Example
     * ```typescript
     * renderer.stop(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    stop(redGPUContext: RedGPUContext) {
        cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
        redGPUContext.currentRequestAnimationFrame = null
    }

    /**
     * [KO] 단일 프레임을 렌더링합니다. (내부적으로 호출됨)
     * [EN] Renders a single frame. (Called internally)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param time -
     * [KO] 현재 시간 (ms)
     * [EN] Current time (ms)
     */
    renderFrame(redGPUContext: RedGPUContext, time: number) {
        if (!this.#finalRender) this.#finalRender = new FinalRender()


        const viewList_renderPassDescriptorList: GPURenderPassDescriptor[] = []
        {
            let i = 0
            const len = redGPUContext.viewList.length
            for (i; i < len; i++) {
                const targetView = redGPUContext.viewList[i];
                const {renderPassDescriptor} = this.renderView(targetView);
                viewList_renderPassDescriptorList.push(renderPassDescriptor);

                const {commandEncoderManager} = redGPUContext;
                // [KO] 뷰별 1~4단계 일괄 제출 (RESOURCE, PRE_PROCESS, MAIN, POST_PROCESS)
                // [EN] Batch submission of phases 1-4 per view
                commandEncoderManager.submitAll();
            }
        }

        const {commandEncoderManager} = redGPUContext;
        // [KO] 5단계: 최종 렌더링 (화면 출력)
        // [EN] Phase 5: Final rendering (Screen output)
        this.#finalRender.render(redGPUContext, viewList_renderPassDescriptorList);
        commandEncoderManager.submit(COMMAND_ENCODER_TYPE.MAIN);

        redGPUContext.antialiasingManager.changedMSAA = false
        viewList_renderPassDescriptorList.forEach((v, index) => {
            const targetView = redGPUContext.viewList[index];
            targetView.pickingManager?.checkEvents(targetView, time);
            targetView.postEffectManager.autoExposure.resolveReadback();
        });
        // console.log('/////////////////// end renderFrame ///////////////////')
    }

    /**
     * [KO] 특정 View3D를 렌더링합니다.
     * [EN] Renders a specific View3D.
     *
     * @param view -
     * [KO] 렌더링할 View3D 인스턴스
     * [EN] View3D instance to render
     * @returns
     * [KO] 생성된 렌더 패스 디스크립터
     * [EN] Generated render pass descriptor
     */
    renderView(view: View3D): {
        renderPassDescriptor: GPURenderPassDescriptor
    } {
        const {
            redGPUContext,
            camera,
            pickingManager,
            pixelRectObject,
            renderViewStateData
        } = view
        const {
            colorAttachment,
            depthStencilAttachment,
            gBufferNormalTextureAttachment,
            gBufferMotionVectorTextureAttachment
        } = this.#createAttachmentsForView(view)

        const renderPassDescriptor: GPURenderPassDescriptor = {
            label: `${view.name} Basic Render Pass`,
            colorAttachments: [colorAttachment, gBufferNormalTextureAttachment, gBufferMotionVectorTextureAttachment],
            depthStencilAttachment,
        }

        // [KO] 상태 초기화 (인코더 의존성 제거됨)
        // [EN] Reset state (encoder dependency removed)
        view.renderViewStateData.reset()

        if (pixelRectObject.width && pixelRectObject.height) {

            {
                const {scene} = view
                const {shadowManager} = scene
                shadowManager.update(redGPUContext)
            }
            {
                const drawBufferManager = DrawBufferManager.getInstance(redGPUContext)
                drawBufferManager.flushAllCommands(renderViewStateData)
            }
            {
                if (renderViewStateData.numFixedSteps > 0) {
                    const {scene} = view
                    if (scene.physicsEngine) {
                        // [KO] 고정 타임스텝 수만큼 물리 시뮬레이션 반복 (제 속도 유지)
                        // [EN] Repeat physics simulation for the number of fixed steps (maintain real-time speed)
                        let i = renderViewStateData.numFixedSteps;
                        while (i--) {
                            scene.physicsEngine.step(renderViewStateData.fixedStepDeltaTime);
                        }
                    }
                }
                // @ts-ignore
                camera.update?.(view, redGPUContext.currentTime)
            }

            updateJitter(view)

            // [KO] 쉐도우 패스용 업데이트 및 렌더링
            // [EN] Update and render for shadow pass
            view.update(true, false, null)
            this.#renderPassViewShadow(view);

            // [KO] 기본 패스용 업데이트 및 렌더링
            // [EN] Update and render for basic pass
            const renderPath1ResultTextureView = view.viewRenderTextureManager.renderPath1ResultTextureView
            view.update(false, true, renderPath1ResultTextureView)

            this.#renderPassViewBasicLayer(view, renderPassDescriptor)
            this.#renderPassView2PathLayer(view, renderPassDescriptor, depthStencilAttachment)
            this.#renderPassViewPickingLayer(view)
            pickingManager?.prepareRead(view);
        }

        {
            renderPassDescriptor.colorAttachments[0].postEffectView = view.postEffectManager.render().textureView
        }

        processAnimationsAndSkinning(redGPUContext, renderViewStateData, this.#gltfAnimationLooperManager);

        view.renderViewStateData.viewRenderCPURecordingTime = (performance.now() - view.renderViewStateData.viewRenderStartTime);
        return {
            renderPassDescriptor
        }
    }

    #renderPassViewShadow(view: View3D) {
        //TODO - 이것도 ShadowManager가 책임지도록 변경
        const {scene, redGPUContext} = view
        const {shadowManager} = scene
        const {directionalShadowManager} = shadowManager
        const shadowPassDescriptor: GPURenderPassDescriptor = {
            label: `${view.name} Shadow Render Pass`,
            colorAttachments: [],
            depthStencilAttachment: {
                view: directionalShadowManager.shadowDepthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: GPU_LOAD_OP.CLEAR,
                depthStoreOp: GPU_STORE_OP.STORE,
            },
        };

        redGPUContext.commandEncoderManager.addMainRenderPass(shadowPassDescriptor, (viewShadowRenderPassEncoder) => {
            this.#updateViewportAndScissor(view, viewShadowRenderPassEncoder, true)
            this.#updateViewSystemUniforms(view, viewShadowRenderPassEncoder, true, false)

            if (directionalShadowManager.castingList.length) {
                renderShadowLayer(view, viewShadowRenderPassEncoder)
            }
        });

        directionalShadowManager.resetCastingList()
    }

    #renderPassViewBasicLayer(view: View3D, renderPassDescriptor: GPURenderPassDescriptor) {
        const {renderViewStateData, skybox, skyAtmosphere, grid, axis, redGPUContext} = view
        if (skyAtmosphere) {
            skyAtmosphere.update(view)
        }

        redGPUContext.commandEncoderManager.addMainRenderPass(renderPassDescriptor, (viewRenderPassEncoder) => {
            const renderPath1ResultTextureView = view.viewRenderTextureManager.renderPath1ResultTextureView
            this.#updateViewportAndScissor(view, viewRenderPassEncoder)
            this.#updateViewSystemUniforms(view, viewRenderPassEncoder, false, true, renderPath1ResultTextureView)

            renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
            viewRenderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
            if (skybox) skybox.render(renderViewStateData)
            if (skyAtmosphere) skyAtmosphere.renderBackground(renderViewStateData)
            if (axis) axis.render(renderViewStateData)
            renderBasicLayer(view, viewRenderPassEncoder)
            if (grid) grid.render(renderViewStateData)
            renderAlphaLayer(view, viewRenderPassEncoder)
        });
    }

    #renderPassView2PathLayer(view: View3D, renderPassDescriptor: GPURenderPassDescriptor, depthStencilAttachment: GPURenderPassDepthStencilAttachment) {
        const {redGPUContext, renderViewStateData} = view
        const {antialiasingManager, commandEncoderManager} = redGPUContext
        const {useMSAA} = antialiasingManager

        if (view.renderViewStateData.bundleListRender2PathLayer.length) {
            const {mipmapGenerator} = redGPUContext.resourceManager
            let renderPath1ResultTexture = view.viewRenderTextureManager.renderPath1ResultTexture

            // useMSAA 설정에 따라 소스 텍스처 선택
            let sourceTexture = useMSAA
                ? view.viewRenderTextureManager.gBufferColorResolveTexture
                : view.viewRenderTextureManager.gBufferColorTexture;

            if (!sourceTexture) {
                if (useMSAA) {
                    console.error('MSAA가 활성화되어 있지만 gBufferColorResolveTexture가 정의되지 않았습니다');
                } else {
                    console.error('gBufferColorTexture가 정의되지 않았습니다');
                }
            }

            commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.MAIN, encoder => {
                encoder.copyTextureToTexture(
                    {texture: sourceTexture,},
                    {texture: renderPath1ResultTexture,},
                    {width: view.pixelRectObject.width, height: view.pixelRectObject.height, depthOrArrayLayers: 1},
                );
            });
            mipmapGenerator.generateMipmap(renderPath1ResultTexture, view.viewRenderTextureManager.renderPath1ResultTextureDescriptor, true, COMMAND_ENCODER_TYPE.MAIN)

            commandEncoderManager.addMainRenderPass({
                label: `${view.name} 2Path Render Pass`,
                colorAttachments: [...renderPassDescriptor.colorAttachments].map(v => ({
                    ...v,
                    loadOp: GPU_LOAD_OP.LOAD
                })),
                depthStencilAttachment: {
                    ...depthStencilAttachment,
                    depthLoadOp: GPU_LOAD_OP.LOAD,
                },
            }, (renderPassEncoder) => {
                this.#updateViewSystemUniforms(view, renderPassEncoder, false, false)
                renderPassEncoder.executeBundles(renderViewStateData.bundleListRender2PathLayer);
            });
        }
    }

    #renderPassViewPickingLayer(view: View3D) {
        const {pickingManager, redGPUContext} = view
        if (pickingManager && pickingManager.castingList.length) {
            pickingManager.prepareRender(view)
            redGPUContext.commandEncoderManager.addMainRenderPass(pickingManager.pickingPassDescriptor, (viewPickingRenderPassEncoder) => {
                this.#updateViewportAndScissor(view, viewPickingRenderPassEncoder)
                this.#updateViewSystemUniforms(view, viewPickingRenderPassEncoder, false, false)
                renderPickingLayer(view, viewPickingRenderPassEncoder)
            });
        }
    }


    #createAttachmentsForView(view: View3D) {
        const {scene, redGPUContext, viewRenderTextureManager} = view
        const {
            depthTextureView,
            gBufferColorTextureView, gBufferColorResolveTextureView,
            gBufferNormalTextureView, gBufferNormalResolveTextureView,
            gBufferMotionVectorTextureView, gBufferMotionVectorResolveTextureView,
        } = viewRenderTextureManager
        const {antialiasingManager} = redGPUContext
        const {useMSAA} = antialiasingManager
        const colorAttachment: GPURenderPassColorAttachment = {
            view: gBufferColorTextureView,
            clearValue: {r: 0, g: 0, b: 0, a: 0},
            loadOp: GPU_LOAD_OP.CLEAR,
            storeOp: GPU_STORE_OP.STORE
        }
        const depthStencilAttachment: GPURenderPassDepthStencilAttachment = {
            view: depthTextureView,
            depthClearValue: 1.0,
            depthLoadOp: GPU_LOAD_OP.CLEAR,
            depthStoreOp: GPU_STORE_OP.STORE,
        }
        const gBufferNormalTextureAttachment: GPURenderPassColorAttachment = {
            view: gBufferNormalTextureView,
            clearValue: {r: 0, g: 0, b: 0, a: 0},
            loadOp: GPU_LOAD_OP.CLEAR,
            storeOp: GPU_STORE_OP.STORE
        }
        const gBufferMotionVectorTextureAttachment: GPURenderPassColorAttachment = {
            view: gBufferMotionVectorTextureView,
            clearValue: {r: 0, g: 0, b: 0, a: 0},
            loadOp: GPU_LOAD_OP.CLEAR,
            storeOp: GPU_STORE_OP.STORE
        }
        if (useMSAA) {
            colorAttachment.resolveTarget = gBufferColorResolveTextureView
            gBufferNormalTextureAttachment.resolveTarget = gBufferNormalResolveTextureView
            gBufferMotionVectorTextureAttachment.resolveTarget = gBufferMotionVectorResolveTextureView
        }
        return {
            colorAttachment,
            depthStencilAttachment,
            gBufferNormalTextureAttachment,
            gBufferMotionVectorTextureAttachment
        };
    }

    #updateViewportAndScissor(
        view: View3D,
        viewRenderPassEncoder: GPURenderPassEncoder,
        shadowRender: boolean = false,
    ) {
        const {scene, pixelRectObject} = view
        const {shadowManager} = scene
        const {directionalShadowManager} = shadowManager
        if (shadowRender) {
            // pixelRectObject 해당하는 크기로 뷰포트를 만들고짜른다.
            const width = directionalShadowManager.shadowDepthTextureSize
            const height = directionalShadowManager.shadowDepthTextureSize
            viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
            viewRenderPassEncoder.setScissorRect(0, 0, width, height);
        } else {
            // pixelRectObject 해당하는 크기로 뷰포트를 만들고짜른다.
            const {width, height} = pixelRectObject
            if (!this.#prevViewportSize || this.#prevViewportSize.width !== width || this.#prevViewportSize.height !== height) {
                viewRenderPassEncoder.setViewport(0, 0, width, height, 0, 1);
                viewRenderPassEncoder.setScissorRect(0, 0, width, height);
                this.#prevViewportSize = {width, height};
            }
        }
    }

    #updateViewSystemUniforms(
        view: View3D,
        viewRenderPassEncoder: GPURenderPassEncoder,
        shadowRender: boolean = false,
        calcPointLightCluster: boolean = true,
        renderPath1ResultTextureView: GPUTextureView = null
    ) {
        // [KO] 바인드 그룹만 설정 (업데이트는 renderView 시작 시 이미 수행됨)
        // [EN] Only set bind group (update already performed at start of renderView)
        viewRenderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
    }
}

let temp3 = mat4.create()
export default Renderer