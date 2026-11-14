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


const UNIFORM_BUFFER_SIZE = 48
const UNIFORM_FLOAT_COUNT = 12
const AA_MODE_COUNT = 3

const AA_MODE = {
    NONE: 0,
    FXAA: 1,
    CAS: 2,
} as const
Object.freeze(AA_MODE)

const FRAGMENT_ENTRY_POINTS = Object.freeze([
    'mainNone',
    'mainFXAA',
    'mainCAS',
])

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
    #fragmentShader: GPUShaderModule = null
    #bindGroupLayout: GPUBindGroupLayout = null
    #bindGroupCache: WeakMap<GPUTextureView, GPUBindGroup>[] = []
    #pipelines: GPURenderPipeline[] = []
    #sampler: Sampler = null
    #uniformBuffers: GPUBuffer[] = []
    #uniformDataList: Float32Array[] = []
    #prevUniformDataList: Float64Array[] = []
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

        this.#uniformBuffers.forEach(buffer => {
            if (buffer) buffer.destroy();
        });
        this.#uniformBuffers = [];
        this.#uniformDataList = [];
        this.#prevUniformDataList = [];

        this.#vertexShader = null;
        this.#fragmentShader = null;
        this.#pipelines = [];
        this.#vertexState = null;

        this.#bindGroupLayout = null;
        this.#sampler = null;
        this.#lastUpdateMSAAID = null;

        this.#bindGroupCache = [];
        this.#colorAttachment.view = null;
        this.#currentRedGPUContext = null;
        this.#currentRenderPassDescriptorList = null;


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

        finalRenderPassEnc.setViewport(0, 0, canvasW, canvasH, 0, 1);
        finalRenderPassEnc.setScissorRect(0, 0, canvasW, canvasH);
        if (!this.#bindGroupLayout || dirtyMSAA) {
            this.#initGPUDetails(redGPUContext);
            this.#bindGroupCache.length = 0;
            this.#pipelines.length = 0;
        }
        this.#renderViewList(
            redGPUContext,
            finalRenderPassEnc,
            viewList_renderPassDescriptorList,
            canvasW,
            canvasH
        )
    }

    #renderViewList(
        redGPUContext: RedGPUContext,
        finalRenderPassEnc: GPURenderPassEncoder,
        viewList_renderPassDescriptorList: GPURenderPassDescriptor[],
        canvasW: number,
        canvasH: number
    ) {
        const len = viewList_renderPassDescriptorList.length
        if (len === 0) return

        const {viewList} = redGPUContext
        let currentPipeline: GPURenderPipeline = null

        for (let index = 0; index < len; index++) {
            const renderPassDesc = viewList_renderPassDescriptorList[index]
            const attachment = renderPassDesc.colorAttachments[0] as FinalRenderPassColorAttachment
            const gpuTextureView = (attachment?.postEffectView || attachment?.pickingView || attachment?.resolveTarget || attachment?.view) as GPUTextureView
            const hasPostEffectView = Boolean(attachment?.postEffectView) && !attachment?.pickingView
            const targetView = viewList[index]

            this.#validateViewGpuDetails(redGPUContext, index)

            const pipelineKey = this.#updateViewUniforms(targetView, index, hasPostEffectView, canvasW, canvasH)
            const pipeline = this.#getPipeline(redGPUContext, pipelineKey)
            if (currentPipeline !== pipeline) {
                finalRenderPassEnc.setPipeline(pipeline)
                currentPipeline = pipeline
            }

            const bindGroup = this.#getBindGroup(redGPUContext, index, gpuTextureView)
            finalRenderPassEnc.setBindGroup(0, bindGroup)
            finalRenderPassEnc.draw(6, 1, 0, 0)
        }
    }

    #updateViewUniforms(
        view: View3D,
        index: number,
        hasPostEffectView: boolean,
        canvasW: number,
        canvasH: number
    ): number {
        const {scene, redGPUContext, pixelRectArray} = view
        const {gpuDevice, antialiasingManager} = redGPUContext
        const viewX = pixelRectArray[0]
        const viewY = pixelRectArray[1]
        const viewW = pixelRectArray[2]
        const viewH = pixelRectArray[3]

        // 1. NDC Scale & Offset (mat4 직교 투영과 0 ULP 동치)
        const invCanvasW2 = 2.0 / canvasW
        const invCanvasH2 = 2.0 / canvasH
        const halfViewW = viewW * 0.5
        const halfViewH = viewH * 0.5
        const ndcScaleX = invCanvasW2 * halfViewW
        const ndcScaleY = invCanvasH2 * halfViewH
        const ndcOffsetX = invCanvasW2 * (halfViewW + viewX) - 1.0
        const ndcOffsetY = invCanvasH2 * (canvasH - halfViewH - viewY) - 1.0

        // 2. 프리멀티플라이드 배경색 알파 합성 (Scene over Context)
        const {backgroundColor, useBackgroundColor} = scene
        const contextRGBA = redGPUContext.backgroundColor.rgbaNormal
        const cA = contextRGBA[3]
        const cR = contextRGBA[0] * cA
        const cG = contextRGBA[1] * cA
        const cB = contextRGBA[2] * cA

        let outR = cR
        let outG = cG
        let outB = cB
        let outA = cA
        if (useBackgroundColor) {
            const sceneRGBA = backgroundColor.rgbaNormal
            const sA = sceneRGBA[3]
            const invSA = 1.0 - sA
            outR = sceneRGBA[0] * sA + cR * invSA
            outG = sceneRGBA[1] * sA + cG * invSA
            outB = sceneRGBA[2] * sA + cB * invSA
            outA = sA + cA * invSA
        }

        // 3. AA 모드 및 샤프닝/서브픽셀 파라미터 결정
        let aaMode: number = AA_MODE.NONE
        let casPeak = 0
        let subpix = 0
        let edgeThreshold = 0
        let edgeThresholdMin = 0
        if (hasPostEffectView) {
            const {useFXAA, useTAA} = antialiasingManager
            const isView3D = view instanceof View3D
            if (useFXAA || (useTAA && !isView3D)) {
                const {fxaa} = view
                aaMode = AA_MODE.FXAA
                subpix = fxaa.subpix
                edgeThreshold = fxaa.edgeThreshold
                edgeThresholdMin = fxaa.edgeThresholdMin
            } else if (useTAA && isView3D) {
                const {sharpness} = view.taa
                if (sharpness > 0) {
                    aaMode = AA_MODE.CAS
                    casPeak = -1.0 / (8.0 - 3.0 * sharpness)
                }
            }
        }

        const isOpaque = outA >= 1.0
        const pipelineKey = isOpaque ? aaMode : aaMode + AA_MODE_COUNT

        // 4. Dirty-Only Uniform Buffer 업로드 (16B × 3 = 48B)
        const prev = this.#prevUniformDataList[index]
        if (
            prev[0] === ndcScaleX && prev[1] === ndcScaleY && prev[2] === ndcOffsetX && prev[3] === ndcOffsetY &&
            prev[4] === outR && prev[5] === outG && prev[6] === outB && prev[7] === outA &&
            prev[8] === casPeak && prev[9] === subpix && prev[10] === edgeThreshold && prev[11] === edgeThresholdMin
        ) {
            return pipelineKey
        }

        prev[0] = ndcScaleX;
        prev[1] = ndcScaleY;
        prev[2] = ndcOffsetX;
        prev[3] = ndcOffsetY
        prev[4] = outR;
        prev[5] = outG;
        prev[6] = outB;
        prev[7] = outA
        prev[8] = casPeak;
        prev[9] = subpix;
        prev[10] = edgeThreshold;
        prev[11] = edgeThresholdMin

        const f32 = this.#uniformDataList[index]
        f32[0] = ndcScaleX;
        f32[1] = ndcScaleY;
        f32[2] = ndcOffsetX;
        f32[3] = ndcOffsetY
        f32[4] = outR;
        f32[5] = outG;
        f32[6] = outB;
        f32[7] = outA
        f32[8] = casPeak;
        f32[9] = subpix;
        f32[10] = edgeThreshold;
        f32[11] = edgeThresholdMin

        gpuDevice.queue.writeBuffer(this.#uniformBuffers[index], 0, f32 as BufferSource)
        return pipelineKey
    }

    #getBindGroup(redGPUContext: RedGPUContext, index: number, gpuTextureView: GPUTextureView): GPUBindGroup {
        let cache = this.#bindGroupCache[index]
        if (!cache) {
            cache = new WeakMap()
            this.#bindGroupCache[index] = cache
        }
        let bindGroup = cache.get(gpuTextureView)
        if (!bindGroup) {
            const uniformBuffer = this.#uniformBuffers[index]
            bindGroup = redGPUContext.gpuDevice.createBindGroup({
                layout: this.#bindGroupLayout,
                label: 'FINAL_RENDER_BIND_GROUP_DESCRIPTOR',
                entries: [
                    {binding: 0, resource: this.#sampler.gpuSampler},
                    {binding: 1, resource: gpuTextureView},
                    {
                        binding: 2,
                        resource: {
                            buffer: uniformBuffer,
                            offset: 0,
                            size: uniformBuffer.size
                        }
                    }
                ]
            })
            cache.set(gpuTextureView, bindGroup)
        }
        return bindGroup
    }

    #initGPUDetails(redGPUContext: RedGPUContext) {
        const {resourceManager} = redGPUContext
        this.#VERTEX_SHADER_INFO = resourceManager.wgslParser.parse('FINAL_RENDER_VERTEX', vertexModuleSource)
        this.#FRAGMENT_SHADER_INFO = resourceManager.wgslParser.parse('FINAL_RENDER_FRAGMENT', fragmentModuleSource)
        this.#vertexShader = resourceManager.createGPUShaderModule('VERTEX_MODULE_FINAL_RENDER', {code: vertexModuleSource})
        this.#vertexState = {module: this.#vertexShader, entryPoint: 'main'}
        this.#fragmentShader = resourceManager.createGPUShaderModule('FRAGMENT_MODULE_FINAL_RENDER', {code: fragmentModuleSource})
        this.#bindGroupLayout = resourceManager.createBindGroupLayout(
            'FINAL_RENDER_BIND_GROUP_LAYOUT',
            getUnionBindGroupLayoutDescriptorFromShaderInfos(
                [
                    {shaderInfo: this.#VERTEX_SHADER_INFO, visibility: GPUShaderStage.VERTEX},
                    {shaderInfo: this.#FRAGMENT_SHADER_INFO, visibility: GPUShaderStage.FRAGMENT}
                ],
                0
            )
        )
        if (!this.#sampler) {
            this.#sampler = new Sampler(redGPUContext, {minFilter: 'linear'})
        }
    }

    #validateViewGpuDetails(redGPUContext: RedGPUContext, index: number) {
        if (!this.#uniformBuffers[index]) {
            this.#uniformBuffers[index] = redGPUContext.gpuDevice.createBuffer({
                label: `FINAL_RENDER_UNIFORM_BUFFER_${index}`,
                size: UNIFORM_BUFFER_SIZE,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            })
            const uniformData = new Float32Array(UNIFORM_FLOAT_COUNT)
            uniformData[4] = 1
            uniformData[7] = 1
            this.#uniformDataList[index] = uniformData

            const prevData = new Float64Array(UNIFORM_FLOAT_COUNT)
            prevData.fill(NaN)
            this.#prevUniformDataList[index] = prevData
        }
    }

    #getFinalRenderPassDesc(redGPUContext: RedGPUContext): GPURenderPassDescriptor {
        const {gpuContext} = redGPUContext
        this.#colorAttachment.view = gpuContext.getCurrentTexture().createView(FINAL_RENDER_TEXTURE_VIEW_DESCRIPTOR)
        return this.#renderPassDescriptor
    }

    #getPipeline(redGPUContext: RedGPUContext, pipelineKey: number): GPURenderPipeline {
        let pipeline = this.#pipelines[pipelineKey]
        if (!pipeline) {
            const {gpuDevice, resourceManager} = redGPUContext
            const isOpaque = pipelineKey < AA_MODE_COUNT
            const aaMode = isOpaque ? pipelineKey : pipelineKey - AA_MODE_COUNT
            const entryPoint = FRAGMENT_ENTRY_POINTS[aaMode]
            const pipelineLayout: GPUPipelineLayout = resourceManager.createGPUPipelineLayout(
                'FINAL_RENDER_PIPELINE_LAYOUT',
                {
                    bindGroupLayouts: [
                        this.#bindGroupLayout
                    ]
                }
            );
            const targetFormat = navigator.gpu.getPreferredCanvasFormat()
            const targetState: GPUColorTargetState = isOpaque
                ? {format: targetFormat}
                : {
                    format: targetFormat,
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
            const pipelineDesc: GPURenderPipelineDescriptor = {
                label: `PIPELINE_DESCRIPTOR_FINAL_RENDER_${entryPoint}_${isOpaque ? 'OPAQUE' : 'BLEND'}`,
                layout: pipelineLayout,
                vertex: this.#vertexState,
                fragment: {
                    module: this.#fragmentShader,
                    entryPoint,
                    targets: [targetState]
                }
            }
            pipeline = gpuDevice.createRenderPipeline(pipelineDesc)
            this.#pipelines[pipelineKey] = pipeline
        }
        return pipeline
    }
}

Object.freeze(FinalRender)
export default FinalRender
