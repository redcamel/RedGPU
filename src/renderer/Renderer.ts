import {mat4} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
import View3D from "../display/view/View3D";
import GPU_LOAD_OP from "../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../gpuConst/GPU_STORE_OP";
import GltfAnimationLooperManager from "../loader/gltf/animationLooper/GltfAnimationLooperManager";
import ParsedSkinInfo_GLTF from "../loader/gltf/cls/ParsedSkinInfo_GLTF";
import DrawBufferManager from "./core/DrawBufferManager";
import DebugRender from "./debugRender/DebugRender";
import FinalRender from "./finalRender/FinalRender";
import renderAlphaLayer from "./renderLayers/renderAlphaLayer";
import renderBasicLayer from "./renderLayers/renderBasicLayer";
import renderPickingLayer from "./renderLayers/renderPickingLayer";
import renderShadowLayer from "./renderLayers/renderShadowLayer";

class Renderer {
    #prevViewportSize: { width: number, height: number };
    #finalRender: FinalRender
    #debugRender: DebugRender
    #gltfAnimationLooperManager: GltfAnimationLooperManager = new GltfAnimationLooperManager()

    constructor() {
    }

    start(redGPUContext: RedGPUContext, render: Function) {
        cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
        const HD_render = (time: number) => {
            render?.(time)
            redGPUContext.currentTime = time
            this.renderFrame(redGPUContext, time)
            this.#debugRender.render(redGPUContext, time)
            redGPUContext.currentRequestAnimationFrame = requestAnimationFrame(HD_render)
        }
        redGPUContext.currentRequestAnimationFrame = requestAnimationFrame(HD_render)
    }

    stop(redGPUContext: RedGPUContext) {
        cancelAnimationFrame(redGPUContext.currentRequestAnimationFrame)
        redGPUContext.currentRequestAnimationFrame = null
    }

    renderFrame(redGPUContext: RedGPUContext, time: number) {
        if (!this.#finalRender) this.#finalRender = new FinalRender()
        if (!this.#debugRender) this.#debugRender = new DebugRender(redGPUContext)


        // 오브젝트 렌더시작
        const viewList_renderPassDescriptorList: GPURenderPassDescriptor[] = []
        {
            let i = 0
            const len = redGPUContext.viewList.length
            for (i; i < len; i++) {
                const targetView = redGPUContext.viewList[i];
                viewList_renderPassDescriptorList.push(this.renderView(targetView, time));
            }
        }
        this.#finalRender.render(redGPUContext, viewList_renderPassDescriptorList)
        redGPUContext.antialiasingManager.changedMSAA = false
        console.log('/////////////////// end renderFrame ///////////////////')
    }

    renderView(view: View3D, time: number) {
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
        const commandEncoder: GPUCommandEncoder = redGPUContext.gpuDevice.createCommandEncoder({
            label: 'ViewRender_MainCommandEncoder'
        })
        const renderPassDescriptor: GPURenderPassDescriptor = {
            label: `${view.name} Basic Render Pass`,
            colorAttachments: [colorAttachment, gBufferNormalTextureAttachment, gBufferMotionVectorTextureAttachment],
            depthStencilAttachment,
        }
        view.renderViewStateData.reset(null, time)
        if (pixelRectObject.width && pixelRectObject.height) {

            this.#updateJitter(view)
            {
                const {scene} = view
                const {shadowManager} = scene
                shadowManager.update(redGPUContext)
            }
            {
                const drawBufferManager = DrawBufferManager.getInstance(redGPUContext)
                drawBufferManager.flushAllCommands(renderViewStateData)
            }

            this.#renderPassViewShadow(view, commandEncoder)
            // @ts-ignore
            camera.update?.(view, time)
            this.#renderPassViewBasicLayer(view, commandEncoder, renderPassDescriptor)
            this.#renderPassView2PathLayer(view, commandEncoder, renderPassDescriptor, depthStencilAttachment)
            this.#renderPassViewPickingLayer(view, commandEncoder)
        }
        {
            //TODO 포스트이펙트를 실행을 완전히 안해도 될 조것 같은걸 체크해야함
            renderPassDescriptor.colorAttachments[0].postEffectView = view.postEffectManager.render().textureView
        }
        redGPUContext.gpuDevice.queue.submit(
            [
                commandEncoder.finish(),
                this.#batchUpdateSkinMatrices(redGPUContext, renderViewStateData)
            ]
        )
        view.renderViewStateData.viewRenderTime = (performance.now() - view.renderViewStateData.startTime);
        pickingManager?.checkEvents(view, time);
        return renderPassDescriptor
    }

    #renderPassViewShadow(view: View3D, commandEncoder: GPUCommandEncoder) {
        //TODO - 이것도 ShadowManager가 책임지도록 변경
        const {scene} = view
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
        const viewShadowRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(shadowPassDescriptor)
        {
            this.#updateViewportAndScissor(view, viewShadowRenderPassEncoder, true)
            this.#updateViewSystemUniforms(view, viewShadowRenderPassEncoder, true, false)
        }
        if (directionalShadowManager.castingList.length) {
            renderShadowLayer(view, viewShadowRenderPassEncoder)
        }
        viewShadowRenderPassEncoder.end()
        directionalShadowManager.resetCastingList()
    }

    #renderPassViewBasicLayer(view: View3D, commandEncoder: GPUCommandEncoder, renderPassDescriptor: GPURenderPassDescriptor) {
        const {renderViewStateData, skybox, grid, axis} = view
        const viewRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
        {
            const renderPath1ResultTextureView = view.viewRenderTextureManager.renderPath1ResultTextureView
            this.#updateViewportAndScissor(view, viewRenderPassEncoder)
            this.#updateViewSystemUniforms(view, viewRenderPassEncoder, false, true, renderPath1ResultTextureView)
        }
        renderViewStateData.currentRenderPassEncoder = viewRenderPassEncoder
        viewRenderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
        if (skybox) skybox.render(renderViewStateData)
        if (axis) axis.render(renderViewStateData)
        renderBasicLayer(view, viewRenderPassEncoder)
        if (grid) grid.render(renderViewStateData)
        renderAlphaLayer(view, viewRenderPassEncoder)
        viewRenderPassEncoder.end()
    }

    #renderPassView2PathLayer(view: View3D, commandEncoder: GPUCommandEncoder, renderPassDescriptor: GPURenderPassDescriptor, depthStencilAttachment: GPURenderPassDepthStencilAttachment) {
        const {redGPUContext, renderViewStateData} = view
        const {antialiasingManager} = redGPUContext
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
                console.log('view.redGPUContext.useMSAA:', useMSAA);
                console.log('viewRenderTextureManager:', view.viewRenderTextureManager);
            }
            if (!renderPath1ResultTexture) {
                console.error('renderPath1ResultTexture가 정의되지 않았습니다');
            }
            commandEncoder.copyTextureToTexture(
                {texture: sourceTexture,},
                {texture: renderPath1ResultTexture,},
                {width: view.pixelRectObject.width, height: view.pixelRectObject.height, depthOrArrayLayers: 1},
            );
            mipmapGenerator.generateMipmap(renderPath1ResultTexture, view.viewRenderTextureManager.renderPath1ResultTextureDescriptor, true)
            const renderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass({
                label: `${view.name} 2Path Render Pass`,
                colorAttachments: [...renderPassDescriptor.colorAttachments].map(v => ({
                    ...v,
                    loadOp: GPU_LOAD_OP.LOAD
                })),
                depthStencilAttachment: {
                    ...depthStencilAttachment,
                    depthLoadOp: GPU_LOAD_OP.LOAD,
                },
            });
            renderPassEncoder.executeBundles(renderViewStateData.bundleListRender2PathLayer);
            renderPassEncoder.end();
        }
    }

    #renderPassViewPickingLayer(view: View3D, commandEncoder: GPUCommandEncoder,) {
        //TODO - 이건  pickingManager가 권한을 가지도록 변경
        const {pickingManager} = view
        if (pickingManager && pickingManager.castingList.length) {
            pickingManager.checkTexture(view)
            const pickingPassDescriptor: GPURenderPassDescriptor = {
                label: `${view.name} Picking Render Pass`,
                colorAttachments: [
                    {
                        view: pickingManager.pickingGPUTextureView,
                        clearValue: {r: 0.0, g: 0.0, b: 0.0, a: 0.0},
                        loadOp: GPU_LOAD_OP.CLEAR,
                        storeOp: GPU_STORE_OP.STORE
                    }
                ],
                depthStencilAttachment: {
                    view: pickingManager.pickingDepthGPUTextureView,
                    depthClearValue: 1.0,
                    depthLoadOp: GPU_LOAD_OP.CLEAR,
                    depthStoreOp: GPU_STORE_OP.STORE,
                },
            };
            const viewPickingRenderPassEncoder: GPURenderPassEncoder = commandEncoder.beginRenderPass(pickingPassDescriptor)
            {
                this.#updateViewportAndScissor(view, viewPickingRenderPassEncoder)
                this.#updateViewSystemUniforms(view, viewPickingRenderPassEncoder, false, false)
            }
            renderPickingLayer(view, viewPickingRenderPassEncoder)
            viewPickingRenderPassEncoder.end()
        }
    }

    #updateJitter(view: View3D,) {
        const {taa} = view
        const frameIndex = taa.frameIndex || 0;
        const jitterScale = taa.jitterStrength;
        const sampleCount = 32;
        const currentSample = frameIndex % sampleCount;
        // Halton 시퀀스 계산
        const haltonX = this.#haltonSequence(currentSample + 1, 2);
        const haltonY = this.#haltonSequence(currentSample + 1, 3);
        // 픽셀 단위 지터
        const jitterX = (haltonX - 0.5) * jitterScale;
        const jitterY = (haltonY - 0.5) * jitterScale;
        view.setJitterOffset(jitterX/view.pixelRectObject.width, jitterY/view.pixelRectObject.height);
    }

    #haltonSequence(index: number, base: number): number {
        let result = 0;
        let f = 1;
        let i = index;
        while (i > 0) {
            f = f / base;
            result = result + f * (i % base);
            i = Math.floor(i / base);
        }
        return result;
    }

    #batchUpdateSkinMatrices(redGPUContext: RedGPUContext, renderViewStateData: RenderViewStateData) {
        const {animationList, skinList} = renderViewStateData;
        const skinListNum = skinList.length
        const animationListNum = animationList.length
        const {gpuDevice} = redGPUContext;
        const commandEncoder = gpuDevice.createCommandEncoder({
            label: 'BatchUpdateSkinMatrices_CommandEncoder'
        });
        const passEncoder = commandEncoder.beginComputePass();
        if (animationListNum) {
            this.#gltfAnimationLooperManager.render(
                redGPUContext,
                renderViewStateData.timestamp,
                passEncoder,
                animationList.flat()
            )
        }
        for (let i = 0; i < skinListNum; i++) {
            const mesh = skinList[i];
            const skinInfo = mesh.animationInfo.skinInfo as ParsedSkinInfo_GLTF;
            // 사용된 조인트 인덱스 초기화
            if (!skinInfo.usedJoints) {
                skinInfo.usedJoints = skinInfo.getUsedJointIndices(mesh);
            }
            // 조인트 행렬 저장 버퍼 크기 확인 및 초기화
            const neededSize = (1 + skinInfo.usedJoints.length) * 16;
            if (!skinInfo.jointData || skinInfo.jointData.length !== neededSize) {
                skinInfo.jointData = new Float32Array(neededSize);
                skinInfo.computeShader = null
            }
            // 모델 행렬의 역행렬 계산
            skinInfo.invertNodeGlobalTransform = skinInfo.invertNodeGlobalTransform || new Float32Array(mesh.modelMatrix.length);
            // mat4.invert(skinInfo.invertNodeGlobalTransform, mesh.modelMatrix);
            {
                {
                    const sourceMatrix = mesh.modelMatrix;
                    const resultMatrix = skinInfo.invertNodeGlobalTransform;
                    const m00 = sourceMatrix[0], m01 = sourceMatrix[1], m02 = sourceMatrix[2], m03 = sourceMatrix[3];
                    const m10 = sourceMatrix[4], m11 = sourceMatrix[5], m12 = sourceMatrix[6], m13 = sourceMatrix[7];
                    const m20 = sourceMatrix[8], m21 = sourceMatrix[9], m22 = sourceMatrix[10], m23 = sourceMatrix[11];
                    const m30 = sourceMatrix[12], m31 = sourceMatrix[13], m32 = sourceMatrix[14],
                        m33 = sourceMatrix[15];
                    const c00 = m11 * (m22 * m33 - m23 * m32) - m12 * (m21 * m33 - m23 * m31) + m13 * (m21 * m32 - m22 * m31);
                    const c01 = -(m10 * (m22 * m33 - m23 * m32) - m12 * (m20 * m33 - m23 * m30) + m13 * (m20 * m32 - m22 * m30));
                    const c02 = m10 * (m21 * m33 - m23 * m31) - m11 * (m20 * m33 - m23 * m30) + m13 * (m20 * m31 - m21 * m30);
                    const c03 = -(m10 * (m21 * m32 - m22 * m31) - m11 * (m20 * m32 - m22 * m30) + m12 * (m20 * m31 - m21 * m30));
                    const c10 = -(m01 * (m22 * m33 - m23 * m32) - m02 * (m21 * m33 - m23 * m31) + m03 * (m21 * m32 - m22 * m31));
                    const c11 = m00 * (m22 * m33 - m23 * m32) - m02 * (m20 * m33 - m23 * m30) + m03 * (m20 * m32 - m22 * m30);
                    const c12 = -(m00 * (m21 * m33 - m23 * m31) - m01 * (m20 * m33 - m23 * m30) + m03 * (m20 * m31 - m21 * m30));
                    const c13 = m00 * (m21 * m32 - m22 * m31) - m01 * (m20 * m32 - m22 * m30) + m02 * (m20 * m31 - m21 * m30);
                    const c20 = m01 * (m12 * m33 - m13 * m32) - m02 * (m11 * m33 - m13 * m31) + m03 * (m11 * m32 - m12 * m31);
                    const c21 = -(m00 * (m12 * m33 - m13 * m32) - m02 * (m10 * m33 - m13 * m30) + m03 * (m10 * m32 - m12 * m30));
                    const c22 = m00 * (m11 * m33 - m13 * m31) - m01 * (m10 * m33 - m13 * m30) + m03 * (m10 * m31 - m11 * m30);
                    const c23 = -(m00 * (m11 * m32 - m12 * m31) - m01 * (m10 * m32 - m12 * m30) + m02 * (m10 * m31 - m11 * m30));
                    const c30 = -(m01 * (m12 * m23 - m13 * m22) - m02 * (m11 * m23 - m13 * m21) + m03 * (m11 * m22 - m12 * m21));
                    const c31 = m00 * (m12 * m23 - m13 * m22) - m02 * (m10 * m23 - m13 * m20) + m03 * (m10 * m22 - m12 * m20);
                    const c32 = -(m00 * (m11 * m23 - m13 * m21) - m01 * (m10 * m23 - m13 * m20) + m03 * (m10 * m21 - m11 * m20));
                    const c33 = m00 * (m11 * m22 - m12 * m21) - m01 * (m10 * m22 - m12 * m20) + m02 * (m10 * m21 - m11 * m20);
                    const determinant = m00 * c00 + m01 * c01 + m02 * c02 + m03 * c03;
                    if (Math.abs(determinant) < 1e-10) {
                        console.error('Matrix is not invertible (determinant is zero or near zero)');
                        resultMatrix[0] = 1;
                        resultMatrix[1] = 0;
                        resultMatrix[2] = 0;
                        resultMatrix[3] = 0;
                        resultMatrix[4] = 0;
                        resultMatrix[5] = 1;
                        resultMatrix[6] = 0;
                        resultMatrix[7] = 0;
                        resultMatrix[8] = 0;
                        resultMatrix[9] = 0;
                        resultMatrix[10] = 1;
                        resultMatrix[11] = 0;
                        resultMatrix[12] = 0;
                        resultMatrix[13] = 0;
                        resultMatrix[14] = 0;
                        resultMatrix[15] = 1;
                    } else {
                        const invDet = 1.0 / determinant;
                        resultMatrix[0] = c00 * invDet;
                        resultMatrix[1] = c10 * invDet;
                        resultMatrix[2] = c20 * invDet;
                        resultMatrix[3] = c30 * invDet;
                        resultMatrix[4] = c01 * invDet;
                        resultMatrix[5] = c11 * invDet;
                        resultMatrix[6] = c21 * invDet;
                        resultMatrix[7] = c31 * invDet;
                        resultMatrix[8] = c02 * invDet;
                        resultMatrix[9] = c12 * invDet;
                        resultMatrix[10] = c22 * invDet;
                        resultMatrix[11] = c32 * invDet;
                        resultMatrix[12] = c03 * invDet;
                        resultMatrix[13] = c13 * invDet;
                        resultMatrix[14] = c23 * invDet;
                        resultMatrix[15] = c33 * invDet;
                    }
                }
            }
            // Compute Shader 초기화 (최초 1회)
            if (!skinInfo.computeShader) {
                skinInfo.createCompute(
                    redGPUContext,
                    gpuDevice,
                    mesh.animationInfo.skinInfo.vertexStorageBuffer,
                    mesh.animationInfo.weightBuffer,
                    mesh.animationInfo.jointBuffer,
                );
            }
            {
                const usedJoints = skinInfo.usedJoints
                let i = usedJoints.length;
                const jointData = skinInfo.jointData;
                while (i--) {
                    jointData.set(skinInfo.joints[usedJoints[i]].modelMatrix, (i + 1) * 16);
                }
                jointData.set(skinInfo.invertNodeGlobalTransform, 0)
                gpuDevice.queue.writeBuffer(skinInfo.uniformBuffer, 0, jointData)
            }
            // Compute Pass 설정 및 Dispatch
            passEncoder.setPipeline(skinInfo.computePipeline);
            passEncoder.setBindGroup(0, skinInfo.bindGroup);
            passEncoder.dispatchWorkgroups(Math.ceil(mesh.geometry.vertexBuffer.vertexCount / skinInfo.WORK_SIZE));
        }
        passEncoder.end();
        return commandEncoder.finish()
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
        //TODO - 업데이트 한번만 하도록 분리
        view.update(shadowRender, calcPointLightCluster, renderPath1ResultTextureView)
        viewRenderPassEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
    }
}

let temp3 = mat4.create()
export default Renderer
