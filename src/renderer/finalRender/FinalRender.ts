import {mat4} from "gl-matrix";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import GPU_BLEND_FACTOR from "../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../gpuConst/GPU_BLEND_OPERATION";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import {
    getFragmentBindGroupLayoutDescriptorFromShaderInfo,
    getVertexBindGroupLayoutDescriptorFromShaderInfo
} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import Sampler from "../../resources/sampler/Sampler";

import fragmentModuleSource from './fragment.wgsl'
import vertexModuleSource from './vertex.wgsl'


const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_FINAL_RENDER'
const FRAGMENT_SHADER_MODULE_NAME = 'FRAGMENT_MODULE_FINAL_RENDER'
const VERTEX_BIND_GROUP_DESCRIPTOR_NAME = 'VERTEX_BIND_GROUP_DESCRIPTOR_FINAL_RENDER'
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_FINAL_RENDER'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_FINAL_RENDER'

/**
 * [KO] 최종 렌더 패스에서 사용되는 컬러 어태치먼트 확장 인터페이스입니다.
 * [EN] Extended color attachment interface used in the final render pass.
 * @category Renderer
 */
export interface FinalRenderPassColorAttachment extends GPURenderPassColorAttachment {
    /**
     * [KO] 후처리 효과가 적용된 결과 텍스처 뷰
     * [EN] Result texture view with post-effects applied
     */
    postEffectView?: GPUTextureView;
    /**
     * [KO] 피킹 결과 텍스처 뷰
     * [EN] Picking result texture view
     */
    pickingView?: GPUTextureView;
}

/**
 * [KO] 개별 뷰(`View3D`)의 렌더링 결과 텍스처들을 최종 캔버스 화면에 합성하여 출력하는 클래스입니다.
 * [EN] Class that composites and outputs rendering result textures of individual views (`View3D`) onto the final canvas screen.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Renderer
 */
class FinalRender {
    #vertexUniformBuffers: UniformBuffer[] = []
    #vertexUniformBindGroups: GPUBindGroup[] = []
    #vertexBindGroupLayout: GPUBindGroupLayout
    #vertexShader: GPUShaderModule
    #vertexState: GPUVertexState
    #fragmentBindGroupLayout: GPUBindGroupLayout
    #fragmentShader: GPUShaderModule
    #fragmentBindGroupCache: WeakMap<GPUTextureView, GPUBindGroup>[] = []
    #pipeline: GPURenderPipeline
    #sampler: Sampler
    #fragmentBuffer: GPUBuffer[] = []
    #fragmentBufferData: Float32Array[] = []
    #fragmentBufferUintData: Uint32Array[] = []
    #projectionMatrix: mat4 = mat4.create()
    #tempScaleVec: [number, number, number] = [0, 0, 1]
    #tempTranslateVec: [number, number, number] = [0, 0, 0]
    #lastUpdateMSAAID: string
    #VERTEX_SHADER_INFO: any
    #FRAGMENT_SHADER_INFO: any
    #VERTEX_UNIFORM_STRUCT: any

    /**
     * [KO] `FinalRender` 인스턴스를 생성합니다.
     * [EN] Creates a `FinalRender` instance.
     */
    constructor() {
    }

    /**
     * [KO] `FinalRender` 내부에서 생성된 WebGPU 버퍼, 셰이더 모듈, 파이프라인 및 바인드 그룹 캐시 자원을 모두 해제합니다.
     * [EN] Releases all WebGPU buffers, shader modules, pipelines, and bind group cache resources created within `FinalRender`.
     */
    destroy(): void {
        this.#FRAGMENT_SHADER_INFO = null
        this.#VERTEX_SHADER_INFO = null
        this.#VERTEX_UNIFORM_STRUCT = null
        this.#vertexUniformBuffers.forEach(buffer => {
            if (buffer) {
                if (typeof buffer.destroy === 'function') buffer.destroy();
                else if (buffer.gpuBuffer) buffer.gpuBuffer.destroy();
            }
        });
        this.#vertexUniformBuffers = [];
        this.#vertexUniformBindGroups = [];

        this.#fragmentBuffer.forEach(buffer => {
            if (buffer) buffer.destroy();
        });
        this.#fragmentBuffer = [];
        this.#fragmentBufferData = [];
        this.#fragmentBufferUintData = [];

        this.#vertexShader = null;
        this.#fragmentShader = null;
        this.#pipeline = null;
        this.#vertexState = null;

        this.#vertexBindGroupLayout = null;
        this.#fragmentBindGroupLayout = null;

        this.#fragmentBindGroupCache = [];

        console.log('✅ FinalRender 인스턴스 자원 해제 완료');
    }

    /**
     * [KO] 전달된 뷰별 렌더 패스 디스크립터 목록의 결과물들을 최종 캔버스에 렌더링합니다.
     * [EN] Renders the outputs of the given per-view render pass descriptor list onto the final canvas.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param viewList_renderPassDescriptorList -
     * [KO] 렌더링할 뷰별 렌더 패스 디스크립터 배열
     * [EN] Array of per-view render pass descriptors to render
     */
    render(redGPUContext: RedGPUContext, viewList_renderPassDescriptorList: GPURenderPassDescriptor[]): void {
        const {sizeManager, antialiasingManager, commandEncoderManager} = redGPUContext
        const {msaaID} = antialiasingManager
        const {pixelRectObject: canvasPixelRectObject} = sizeManager
        const {width: canvasW, height: canvasH} = canvasPixelRectObject


        if (canvasW === 0 || canvasH === 0) return
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID
        const finalRenderPassDesc: GPURenderPassDescriptor = this.#getFinalRenderPassDesc(redGPUContext)
        commandEncoderManager.addMainRenderPass(finalRenderPassDesc, (finalRenderPassEnc) => {
            finalRenderPassEnc.setViewport(0, 0, canvasW, canvasH, 0, 1);
            finalRenderPassEnc.setScissorRect(0, 0, canvasW, canvasH);
            if (!this.#vertexBindGroupLayout || dirtyMSAA) {
                this.#initGPUDetails(redGPUContext);
                this.#fragmentBindGroupCache = [];
            }
            this.#renderViewList(
                redGPUContext,
                finalRenderPassEnc,
                viewList_renderPassDescriptorList,
                canvasW, canvasH,
                dirtyMSAA
            )
        })
        this.#lastUpdateMSAAID = msaaID
    }

    #updateFinalViewBackgroundColor(view: View3D, index: number, hasPostEffectView: boolean) {
        const {scene, redGPUContext} = view
        const {gpuDevice, antialiasingManager} = redGPUContext
        const {backgroundColor, useBackgroundColor} = scene
        const redGPUContextRGBANormal = redGPUContext.backgroundColor.rgbaNormal
        const cA = redGPUContextRGBANormal[3]
        const cR = redGPUContextRGBANormal[0] * cA
        const cG = redGPUContextRGBANormal[1] * cA
        const cB = redGPUContextRGBANormal[2] * cA

        const f32 = this.#fragmentBufferData[index]
        const u32 = this.#fragmentBufferUintData[index]

        if (useBackgroundColor) {
            const sceneRGBANormal = backgroundColor.rgbaNormal
            const sA = sceneRGBANormal[3]
            const invSA = 1 - sA
            f32[0] = sceneRGBANormal[0] * sA + cR * invSA
            f32[1] = sceneRGBANormal[1] * sA + cG * invSA
            f32[2] = sceneRGBANormal[2] * sA + cB * invSA
            f32[3] = sA + cA * invSA
        } else {
            f32[0] = cR
            f32[1] = cG
            f32[2] = cB
            f32[3] = cA
        }

        let aaMode = 0
        if (hasPostEffectView) {
            const {useFXAA, useTAA} = antialiasingManager
            const isView3D = view.constructor.name === 'View3D'
            if (useFXAA || (useTAA && !isView3D)) {
                const {fxaa} = view
                aaMode = 1
                f32[6] = fxaa.subpix
                f32[7] = fxaa.edgeThreshold
                f32[8] = fxaa.edgeThresholdMin
            } else if (useTAA && isView3D) {
                const {sharpness} = view.taa
                if (sharpness > 0) {
                    aaMode = 2
                    f32[5] = -1.0 / (8.0 - 3.0 * sharpness)
                }
            }
        }
        u32[4] = aaMode

        gpuDevice.queue.writeBuffer(this.#fragmentBuffer[index], 0, f32 as BufferSource)
    }

    #renderViewList(
        redGPUContext: RedGPUContext,
        finalRenderPassEnc: GPURenderPassEncoder,
        viewList_renderPassDescriptorList: GPURenderPassDescriptor[],
        canvasW: number, canvasH: number,
        dirtyMSAA: boolean
    ) {
        const {gpuDevice, viewList} = redGPUContext
        const projectionMatrix = this.#projectionMatrix
        const scaleVec = this.#tempScaleVec
        const translateVec = this.#tempTranslateVec

        for (let index = 0, len = viewList_renderPassDescriptorList.length; index < len; index++) {
            const renderPassDesc = viewList_renderPassDescriptorList[index]
            const temp = renderPassDesc.colorAttachments[0] as FinalRenderPassColorAttachment
            const gpuTextureView = (temp?.postEffectView || temp?.pickingView || temp?.resolveTarget || temp?.view) as GPUTextureView
            const hasPostEffectView = Boolean(temp?.postEffectView) && !temp?.pickingView
            const targetView = viewList[index]
            const {x: viewX, y: viewY, width: viewW, height: viewH} = targetView.pixelRectObject
            {
                mat4.ortho(projectionMatrix, 0., 1., 0., 1., -1000, 1000);
                scaleVec[0] = 1 / canvasW
                scaleVec[1] = 1 / canvasH
                mat4.scale(projectionMatrix, projectionMatrix, scaleVec);
                translateVec[0] = viewW / 2 + viewX
                translateVec[1] = canvasH - viewH / 2 - viewY
                mat4.translate(projectionMatrix, projectionMatrix, translateVec);
                scaleVec[0] = viewW / 2
                scaleVec[1] = viewH / 2
                mat4.scale(projectionMatrix, projectionMatrix, scaleVec);
            }
            this.#validateViewGpuDetails(redGPUContext, index)
            const vertexUniformBuffer: UniformBuffer = this.#vertexUniformBuffers[index]
            const vertexUniformBindGroup: GPUBindGroup = this.#vertexUniformBindGroups[index]
            gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                this.#VERTEX_UNIFORM_STRUCT.members.modelMatrix.uniformOffset,
                projectionMatrix as Float32Array as BufferSource
            )
            if (!this.#fragmentBindGroupCache[index] || dirtyMSAA) {
                this.#fragmentBindGroupCache[index] = null
                this.#fragmentBindGroupCache[index] = new WeakMap();
            }

            let fragmentBindGroup = this.#fragmentBindGroupCache[index].get(gpuTextureView);
            if (!fragmentBindGroup) {
                const fragmentBindGroupDesc: GPUBindGroupDescriptor = {
                    layout: this.#fragmentBindGroupLayout,
                    label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
                    entries: [
                        {binding: 0, resource: this.#sampler.gpuSampler},
                        {binding: 1, resource: gpuTextureView},
                        {
                            binding: 2, resource: {
                                buffer: this.#fragmentBuffer[index],
                                offset: 0,
                                size: this.#fragmentBuffer[index].size
                            }
                        }
                    ]
                }
                fragmentBindGroup = gpuDevice.createBindGroup(fragmentBindGroupDesc)
                this.#fragmentBindGroupCache[index].set(gpuTextureView, fragmentBindGroup);

            }

            this.#updateFinalViewBackgroundColor(targetView, index, hasPostEffectView)
            finalRenderPassEnc.setPipeline(this.#getPipeline(redGPUContext, dirtyMSAA))
            finalRenderPassEnc.setBindGroup(0, vertexUniformBindGroup);
            finalRenderPassEnc.setBindGroup(1, fragmentBindGroup)
            finalRenderPassEnc.draw(6, 1, 0, 0);
        }
    }

    #initGPUDetails(redGPUContext: RedGPUContext) {
        const {resourceManager,} = redGPUContext
        this.#VERTEX_SHADER_INFO = resourceManager.wgslParser.parse('FINAL_RENDER_VERTEX', vertexModuleSource)
        this.#FRAGMENT_SHADER_INFO = resourceManager.wgslParser.parse('FINAL_RENDER_FRAGMENT', fragmentModuleSource)
        this.#VERTEX_UNIFORM_STRUCT = this.#VERTEX_SHADER_INFO.uniforms.vertexUniforms
        this.#vertexBindGroupLayout = resourceManager.createBindGroupLayout(
            'FINAL_RENDER_VERTEX_BIND_GROUP_LAYOUT',
            getVertexBindGroupLayoutDescriptorFromShaderInfo(this.#VERTEX_SHADER_INFO, 0)
        )
        this.#vertexShader = resourceManager.createGPUShaderModule(VERTEX_SHADER_MODULE_NAME, {code: vertexModuleSource})
        this.#vertexState = {module: this.#vertexShader, entryPoint: 'main'}
        this.#fragmentShader = resourceManager.createGPUShaderModule(FRAGMENT_SHADER_MODULE_NAME, {code: fragmentModuleSource})
        this.#fragmentBindGroupLayout = resourceManager.createBindGroupLayout(
            'FINAL_RENDER_BIND_GROUP_LAYOUT',
            getFragmentBindGroupLayoutDescriptorFromShaderInfo(this.#FRAGMENT_SHADER_INFO, 1)
        )
        this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'})
    }

    #validateViewGpuDetails(redGPUContext: RedGPUContext, index: number) {
        const {gpuDevice} = redGPUContext
        if (!this.#vertexUniformBuffers[index]) {
            const vertexUniformData = new ArrayBuffer(this.#VERTEX_UNIFORM_STRUCT.arrayBufferByteLength)
            const tVUniformBuffer: UniformBuffer = this.#vertexUniformBuffers[index] = new UniformBuffer(
                redGPUContext,
                vertexUniformData,
                `FinalRender_View(${index})_VertexUniform`
            )
            const vertexBindGroupDesc: GPUBindGroupDescriptor = {
                layout: this.#vertexBindGroupLayout,
                label: VERTEX_BIND_GROUP_DESCRIPTOR_NAME,
                entries: [{
                    binding: 0,
                    resource: {
                        buffer: tVUniformBuffer.gpuBuffer,
                        offset: 0,
                        size: tVUniformBuffer.size
                    },
                }]
            }
            this.#vertexUniformBindGroups[index] = gpuDevice.createBindGroup(vertexBindGroupDesc)
        }
        if (!this.#fragmentBuffer[index]) {
            this.#fragmentBuffer[index] = redGPUContext.gpuDevice.createBuffer({
                label: `FINAL_RENDER_FRAGMENT_BUFFER_${index}`,
                size: 48,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            })
            const buffer = new ArrayBuffer(48)
            this.#fragmentBufferData[index] = new Float32Array(buffer)
            this.#fragmentBufferUintData[index] = new Uint32Array(buffer)
            this.#fragmentBufferData[index][0] = 1
            this.#fragmentBufferData[index][3] = 1
        }
    }

    #getFinalRenderPassDesc(redGPUContext: RedGPUContext): GPURenderPassDescriptor {
        const {gpuContext} = redGPUContext
        const finalRenderTextureView = gpuContext.getCurrentTexture().createView({label: 'FINAL_RENDER'})
        const colorAttachment: GPURenderPassColorAttachment = {
            view: finalRenderTextureView,
            clearValue: {r: 0, g: 0, b: 0, a: 0},
            loadOp: GPU_LOAD_OP.CLEAR,
            storeOp: GPU_STORE_OP.STORE
        }
        return {
            colorAttachments: [
                colorAttachment
            ],
        }
    }

    #getPipeline(redGPUContext: RedGPUContext, dirtyMSAA: boolean) {
        if (!this.#pipeline || dirtyMSAA) {
            const {gpuDevice} = redGPUContext
            const pipelineLayout: GPUPipelineLayout = gpuDevice.createPipelineLayout({
                label: "FINAL_RENDER_PIPELINE_LAYOUT",
                bindGroupLayouts: [
                    this.#vertexBindGroupLayout,
                    this.#fragmentBindGroupLayout
                ]
            });
            const pipelineDesc: GPURenderPipelineDescriptor = {
                label: PIPELINE_DESCRIPTOR_LABEL,
                layout: pipelineLayout,
                vertex: this.#vertexState,
                fragment: {
                    module: this.#fragmentShader,
                    entryPoint: 'main',
                    targets: [
                        {
                            format: navigator.gpu.getPreferredCanvasFormat(),
                            blend: {
                                color: {
                                    srcFactor: GPU_BLEND_FACTOR.SRC_ALPHA,
                                    dstFactor: GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
                                    operation: GPU_BLEND_OPERATION.ADD
                                },
                                alpha: {
                                    srcFactor: GPU_BLEND_FACTOR.SRC_ALPHA,
                                    dstFactor: GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
                                    operation: GPU_BLEND_OPERATION.ADD
                                }
                            }
                        }
                    ]
                }
            }
            this.#pipeline = gpuDevice.createRenderPipeline(pipelineDesc)
        }
        return this.#pipeline
    }
}

export default FinalRender
