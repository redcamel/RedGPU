import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import GPU_BLEND_FACTOR from "../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../gpuConst/GPU_BLEND_OPERATION";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import {getUnionBindGroupLayoutDescriptorFromShaderInfos} from "../../material/core";
import Sampler from "../../resources/sampler/Sampler";

import fragmentModuleSource from './fragment.wgsl'
import vertexModuleSource from './vertex.wgsl'


const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_FINAL_RENDER'
const FRAGMENT_SHADER_MODULE_NAME = 'FRAGMENT_MODULE_FINAL_RENDER'
const BIND_GROUP_LAYOUT_NAME = 'FINAL_RENDER_BIND_GROUP_LAYOUT'
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_FINAL_RENDER'
const PIPELINE_LAYOUT_LABEL = 'FINAL_RENDER_PIPELINE_LAYOUT'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_FINAL_RENDER'

const FRAGMENT_UNIFORM_BUFFER_BYTE_SIZE = 64
const UNIFORM_PREV_DATA_COUNT = 13
const UNIFORM_INDEX_NDC_SCALE_X = 0
const UNIFORM_INDEX_NDC_SCALE_Y = 1
const UNIFORM_INDEX_NDC_OFFSET_X = 2
const UNIFORM_INDEX_NDC_OFFSET_Y = 3
const UNIFORM_INDEX_BG_R = 4
const UNIFORM_INDEX_BG_G = 5
const UNIFORM_INDEX_BG_B = 6
const UNIFORM_INDEX_BG_A = 7
const UNIFORM_INDEX_AA_MODE = 8
const UNIFORM_INDEX_CAS_PEAK = 9
const UNIFORM_INDEX_FXAA_SUBPIX = 10
const UNIFORM_INDEX_FXAA_EDGE_THRESHOLD = 11
const UNIFORM_INDEX_FXAA_EDGE_THRESHOLD_MIN = 12

const BIND_GROUP_INDEX = 0
const BINDING_SAMPLER = 0
const BINDING_TEXTURE = 1
const BINDING_UNIFORMS = 2

const QUAD_VERTEX_COUNT = 6
const INSTANCE_COUNT = 1
const FIRST_VERTEX = 0
const FIRST_INSTANCE = 0
const VIEWPORT_ORIGIN_X = 0
const VIEWPORT_ORIGIN_Y = 0
const VIEWPORT_MIN_DEPTH = 0
const VIEWPORT_MAX_DEPTH = 1

const NDC_FULL_SPAN = 2.0
const NDC_HALF_SCALE = 0.5
const NDC_ORIGIN_OFFSET = 1.0

const AA_MODE_NONE = 0
const AA_MODE_FXAA = 1
const AA_MODE_CAS = 2
const CAS_PEAK_BASE = 8.0
const CAS_PEAK_SHARPNESS_SCALE = 3.0

const FINAL_RENDER_TEXTURE_VIEW_DESCRIPTOR: GPUTextureViewDescriptor = Object.freeze({
    label: 'FINAL_RENDER',
})
const CLEAR_COLOR_TRANSPARENT: GPUColorDict = Object.freeze({
    r: 0,
    g: 0,
    b: 0,
    a: 0,
})

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
    #vertexShader: GPUShaderModule = null
    #vertexState: GPUVertexState = null
    #fragmentBindGroupLayout: GPUBindGroupLayout = null
    #fragmentShader: GPUShaderModule = null
    #fragmentBindGroupCache: WeakMap<GPUTextureView, GPUBindGroup>[] = []
    #pipeline: GPURenderPipeline = null
    #sampler: Sampler = null
    #fragmentBuffer: GPUBuffer[] = []
    #fragmentBufferData: Float32Array[] = []
    #fragmentBufferUintData: Uint32Array[] = []
    #fragmentBufferPrevData: Float64Array[] = []
    #lastUpdateMSAAID: string = null
    #VERTEX_SHADER_INFO: any = null
    #FRAGMENT_SHADER_INFO: any = null
    #colorAttachment: GPURenderPassColorAttachment = {
        view: null,
        clearValue: CLEAR_COLOR_TRANSPARENT,
        loadOp: GPU_LOAD_OP.CLEAR,
        storeOp: GPU_STORE_OP.STORE
    }
    #renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            this.#colorAttachment
        ],
    }
    #currentRedGPUContext: RedGPUContext = null
    #currentRenderPassDescriptorList: GPURenderPassDescriptor[] = null
    #currentCanvasW: number = 0
    #currentCanvasH: number = 0
    #currentDirtyMSAA: boolean = false

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

        this.#fragmentBuffer.forEach(buffer => {
            if (buffer) buffer.destroy();
        });
        this.#fragmentBuffer = [];
        this.#fragmentBufferData = [];
        this.#fragmentBufferUintData = [];
        this.#fragmentBufferPrevData = [];

        this.#vertexShader = null;
        this.#fragmentShader = null;
        this.#pipeline = null;
        this.#vertexState = null;

        this.#fragmentBindGroupLayout = null;
        this.#sampler = null;
        this.#lastUpdateMSAAID = null;

        this.#fragmentBindGroupCache = [];
        this.#colorAttachment.view = null;
        this.#currentRedGPUContext = null;
        this.#currentRenderPassDescriptorList = null;

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
        const canvasPixelRectArray = sizeManager.pixelRectArray
        const canvasW = canvasPixelRectArray[2]
        const canvasH = canvasPixelRectArray[3]

        if (canvasW === 0 || canvasH === 0) return
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID
        const finalRenderPassDesc: GPURenderPassDescriptor = this.#getFinalRenderPassDesc(redGPUContext)
        this.#currentRedGPUContext = redGPUContext
        this.#currentRenderPassDescriptorList = viewList_renderPassDescriptorList
        this.#currentCanvasW = canvasW
        this.#currentCanvasH = canvasH
        this.#currentDirtyMSAA = dirtyMSAA
        try {
            commandEncoderManager.addMainRenderPass(finalRenderPassDesc, this.#executeRenderPass)
        } finally {
            this.#colorAttachment.view = null
            this.#currentRedGPUContext = null
            this.#currentRenderPassDescriptorList = null
        }
        this.#lastUpdateMSAAID = msaaID
    }

    #executeRenderPass = (finalRenderPassEnc: GPURenderPassEncoder): void => {
        const redGPUContext = this.#currentRedGPUContext
        const viewList_renderPassDescriptorList = this.#currentRenderPassDescriptorList
        const canvasW = this.#currentCanvasW
        const canvasH = this.#currentCanvasH
        const dirtyMSAA = this.#currentDirtyMSAA

        finalRenderPassEnc.setViewport(VIEWPORT_ORIGIN_X, VIEWPORT_ORIGIN_Y, canvasW, canvasH, VIEWPORT_MIN_DEPTH, VIEWPORT_MAX_DEPTH);
        finalRenderPassEnc.setScissorRect(VIEWPORT_ORIGIN_X, VIEWPORT_ORIGIN_Y, canvasW, canvasH);
        if (!this.#fragmentBindGroupLayout || dirtyMSAA) {
            this.#initGPUDetails(redGPUContext);
            this.#fragmentBindGroupCache.length = 0;
        }
        this.#renderViewList(
            redGPUContext,
            finalRenderPassEnc,
            viewList_renderPassDescriptorList,
            canvasW, canvasH,
            dirtyMSAA
        )
    }

    #updateFinalViewUniforms(
        view: View3D,
        index: number,
        hasPostEffectView: boolean,
        viewX: number,
        viewY: number,
        viewW: number,
        viewH: number,
        invCanvasW2: number,
        invCanvasH2: number,
        canvasH: number
    ) {
        const halfViewW = viewW * NDC_HALF_SCALE
        const halfViewH = viewH * NDC_HALF_SCALE
        const ndcScaleX = invCanvasW2 * halfViewW
        const ndcScaleY = invCanvasH2 * halfViewH
        const ndcOffsetX = invCanvasW2 * (halfViewW + viewX) - NDC_ORIGIN_OFFSET
        const ndcOffsetY = invCanvasH2 * (canvasH - halfViewH - viewY) - NDC_ORIGIN_OFFSET

        const {scene, redGPUContext} = view
        const {gpuDevice, antialiasingManager} = redGPUContext
        const {backgroundColor, useBackgroundColor} = scene
        const redGPUContextRGBANormal = redGPUContext.backgroundColor.rgbaNormal
        const cA = redGPUContextRGBANormal[3]
        const cR = redGPUContextRGBANormal[0] * cA
        const cG = redGPUContextRGBANormal[1] * cA
        const cB = redGPUContextRGBANormal[2] * cA

        let outR = cR
        let outG = cG
        let outB = cB
        let outA = cA
        if (useBackgroundColor) {
            const sceneRGBANormal = backgroundColor.rgbaNormal
            const sA = sceneRGBANormal[3]
            const invSA = 1 - sA
            outR = sceneRGBANormal[0] * sA + cR * invSA
            outG = sceneRGBANormal[1] * sA + cG * invSA
            outB = sceneRGBANormal[2] * sA + cB * invSA
            outA = sA + cA * invSA
        }

        let aaMode = AA_MODE_NONE
        let casPeak = 0
        let subpix = 0
        let edgeThreshold = 0
        let edgeThresholdMin = 0
        if (hasPostEffectView) {
            const {useFXAA, useTAA} = antialiasingManager
            const isView3D = view instanceof View3D
            if (useFXAA || (useTAA && !isView3D)) {
                const {fxaa} = view
                aaMode = AA_MODE_FXAA
                subpix = fxaa.subpix
                edgeThreshold = fxaa.edgeThreshold
                edgeThresholdMin = fxaa.edgeThresholdMin
            } else if (useTAA && isView3D) {
                const {sharpness} = view.taa
                if (sharpness > 0) {
                    aaMode = AA_MODE_CAS
                    casPeak = -1.0 / (CAS_PEAK_BASE - CAS_PEAK_SHARPNESS_SCALE * sharpness)
                }
            }
        }

        const prevData = this.#fragmentBufferPrevData[index]
        if (
            prevData[UNIFORM_INDEX_NDC_SCALE_X] === ndcScaleX &&
            prevData[UNIFORM_INDEX_NDC_SCALE_Y] === ndcScaleY &&
            prevData[UNIFORM_INDEX_NDC_OFFSET_X] === ndcOffsetX &&
            prevData[UNIFORM_INDEX_NDC_OFFSET_Y] === ndcOffsetY &&
            prevData[UNIFORM_INDEX_BG_R] === outR &&
            prevData[UNIFORM_INDEX_BG_G] === outG &&
            prevData[UNIFORM_INDEX_BG_B] === outB &&
            prevData[UNIFORM_INDEX_BG_A] === outA &&
            prevData[UNIFORM_INDEX_AA_MODE] === aaMode &&
            prevData[UNIFORM_INDEX_CAS_PEAK] === casPeak &&
            prevData[UNIFORM_INDEX_FXAA_SUBPIX] === subpix &&
            prevData[UNIFORM_INDEX_FXAA_EDGE_THRESHOLD] === edgeThreshold &&
            prevData[UNIFORM_INDEX_FXAA_EDGE_THRESHOLD_MIN] === edgeThresholdMin
        ) {
            return
        }

        prevData[UNIFORM_INDEX_NDC_SCALE_X] = ndcScaleX
        prevData[UNIFORM_INDEX_NDC_SCALE_Y] = ndcScaleY
        prevData[UNIFORM_INDEX_NDC_OFFSET_X] = ndcOffsetX
        prevData[UNIFORM_INDEX_NDC_OFFSET_Y] = ndcOffsetY
        prevData[UNIFORM_INDEX_BG_R] = outR
        prevData[UNIFORM_INDEX_BG_G] = outG
        prevData[UNIFORM_INDEX_BG_B] = outB
        prevData[UNIFORM_INDEX_BG_A] = outA
        prevData[UNIFORM_INDEX_AA_MODE] = aaMode
        prevData[UNIFORM_INDEX_CAS_PEAK] = casPeak
        prevData[UNIFORM_INDEX_FXAA_SUBPIX] = subpix
        prevData[UNIFORM_INDEX_FXAA_EDGE_THRESHOLD] = edgeThreshold
        prevData[UNIFORM_INDEX_FXAA_EDGE_THRESHOLD_MIN] = edgeThresholdMin

        const f32 = this.#fragmentBufferData[index]
        const u32 = this.#fragmentBufferUintData[index]
        f32[UNIFORM_INDEX_NDC_SCALE_X] = ndcScaleX
        f32[UNIFORM_INDEX_NDC_SCALE_Y] = ndcScaleY
        f32[UNIFORM_INDEX_NDC_OFFSET_X] = ndcOffsetX
        f32[UNIFORM_INDEX_NDC_OFFSET_Y] = ndcOffsetY
        f32[UNIFORM_INDEX_BG_R] = outR
        f32[UNIFORM_INDEX_BG_G] = outG
        f32[UNIFORM_INDEX_BG_B] = outB
        f32[UNIFORM_INDEX_BG_A] = outA
        u32[UNIFORM_INDEX_AA_MODE] = aaMode
        f32[UNIFORM_INDEX_CAS_PEAK] = casPeak
        f32[UNIFORM_INDEX_FXAA_SUBPIX] = subpix
        f32[UNIFORM_INDEX_FXAA_EDGE_THRESHOLD] = edgeThreshold
        f32[UNIFORM_INDEX_FXAA_EDGE_THRESHOLD_MIN] = edgeThresholdMin

        gpuDevice.queue.writeBuffer(this.#fragmentBuffer[index], 0, f32 as BufferSource)
    }

    #renderViewList(
        redGPUContext: RedGPUContext,
        finalRenderPassEnc: GPURenderPassEncoder,
        viewList_renderPassDescriptorList: GPURenderPassDescriptor[],
        canvasW: number, canvasH: number,
        dirtyMSAA: boolean
    ) {
        const len = viewList_renderPassDescriptorList.length
        if (len === 0) return

        const {gpuDevice, viewList} = redGPUContext
        const invCanvasW2 = NDC_FULL_SPAN / canvasW
        const invCanvasH2 = NDC_FULL_SPAN / canvasH

        finalRenderPassEnc.setPipeline(this.#getPipeline(redGPUContext, dirtyMSAA))

        for (let index = 0; index < len; index++) {
            const renderPassDesc = viewList_renderPassDescriptorList[index]
            const temp = renderPassDesc.colorAttachments[0] as FinalRenderPassColorAttachment
            const gpuTextureView = (temp?.postEffectView || temp?.pickingView || temp?.resolveTarget || temp?.view) as GPUTextureView
            const hasPostEffectView = Boolean(temp?.postEffectView) && !temp?.pickingView
            const targetView = viewList[index]
            const viewPixelRectArray = targetView.pixelRectArray
            const viewX = viewPixelRectArray[0]
            const viewY = viewPixelRectArray[1]
            const viewW = viewPixelRectArray[2]
            const viewH = viewPixelRectArray[3]

            this.#validateViewGpuDetails(redGPUContext, index)

            if (!this.#fragmentBindGroupCache[index]) {
                this.#fragmentBindGroupCache[index] = new WeakMap();
            }

            let fragmentBindGroup = this.#fragmentBindGroupCache[index].get(gpuTextureView);
            if (!fragmentBindGroup) {
                const fragmentBindGroupDesc: GPUBindGroupDescriptor = {
                    layout: this.#fragmentBindGroupLayout,
                    label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
                    entries: [
                        {binding: BINDING_SAMPLER, resource: this.#sampler.gpuSampler},
                        {binding: BINDING_TEXTURE, resource: gpuTextureView},
                        {
                            binding: BINDING_UNIFORMS, resource: {
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

            this.#updateFinalViewUniforms(
                targetView,
                index,
                hasPostEffectView,
                viewX,
                viewY,
                viewW,
                viewH,
                invCanvasW2,
                invCanvasH2,
                canvasH
            )
            finalRenderPassEnc.setBindGroup(BIND_GROUP_INDEX, fragmentBindGroup)
            finalRenderPassEnc.draw(QUAD_VERTEX_COUNT, INSTANCE_COUNT, FIRST_VERTEX, FIRST_INSTANCE);
        }
    }

    #initGPUDetails(redGPUContext: RedGPUContext) {
        const {resourceManager} = redGPUContext
        this.#VERTEX_SHADER_INFO = resourceManager.wgslParser.parse('FINAL_RENDER_VERTEX', vertexModuleSource)
        this.#FRAGMENT_SHADER_INFO = resourceManager.wgslParser.parse('FINAL_RENDER_FRAGMENT', fragmentModuleSource)
        this.#vertexShader = resourceManager.createGPUShaderModule(VERTEX_SHADER_MODULE_NAME, {code: vertexModuleSource})
        this.#vertexState = {module: this.#vertexShader, entryPoint: 'main'}
        this.#fragmentShader = resourceManager.createGPUShaderModule(FRAGMENT_SHADER_MODULE_NAME, {code: fragmentModuleSource})
        this.#fragmentBindGroupLayout = resourceManager.createBindGroupLayout(
            BIND_GROUP_LAYOUT_NAME,
            getUnionBindGroupLayoutDescriptorFromShaderInfos(
                [
                    {shaderInfo: this.#VERTEX_SHADER_INFO, visibility: GPUShaderStage.VERTEX},
                    {shaderInfo: this.#FRAGMENT_SHADER_INFO, visibility: GPUShaderStage.FRAGMENT}
                ],
                BIND_GROUP_INDEX
            )
        )
        if (!this.#sampler) {
            this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'})
        }
    }

    #validateViewGpuDetails(redGPUContext: RedGPUContext, index: number) {
        const {gpuDevice} = redGPUContext
        if (!this.#fragmentBuffer[index]) {
            this.#fragmentBuffer[index] = gpuDevice.createBuffer({
                label: `FINAL_RENDER_FRAGMENT_BUFFER_${index}`,
                size: FRAGMENT_UNIFORM_BUFFER_BYTE_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            })
            const buffer = new ArrayBuffer(FRAGMENT_UNIFORM_BUFFER_BYTE_SIZE)
            this.#fragmentBufferData[index] = new Float32Array(buffer)
            this.#fragmentBufferUintData[index] = new Uint32Array(buffer)
            this.#fragmentBufferData[index][UNIFORM_INDEX_BG_R] = 1
            this.#fragmentBufferData[index][UNIFORM_INDEX_BG_A] = 1
            const prevData = new Float64Array(UNIFORM_PREV_DATA_COUNT)
            prevData.fill(NaN)
            this.#fragmentBufferPrevData[index] = prevData
        }
    }

    #getFinalRenderPassDesc(redGPUContext: RedGPUContext): GPURenderPassDescriptor {
        const {gpuContext} = redGPUContext
        this.#colorAttachment.view = gpuContext.getCurrentTexture().createView(FINAL_RENDER_TEXTURE_VIEW_DESCRIPTOR)
        return this.#renderPassDescriptor
    }

    #getPipeline(redGPUContext: RedGPUContext, dirtyMSAA: boolean) {
        if (!this.#pipeline || dirtyMSAA) {
            const {gpuDevice, resourceManager} = redGPUContext
            const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout(
                PIPELINE_LAYOUT_LABEL,
                {
                    bindGroupLayouts: [
                        this.#fragmentBindGroupLayout
                    ]
                }
            );
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

Object.freeze(FinalRender)
export default FinalRender
