import {vec3} from "gl-matrix";
import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import DrawBufferManager, {DrawCommandSlot} from "../../../renderer/core/DrawBufferManager";
import BlendState from "../../../renderState/BlendState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import shaderSource from './shader.wgsl'
import BaseObject from "../../../base/BaseObject";

const SHADER_INFO = parseWGSL('DRAW_DEBUGGER_GRID', shaderSource);
const FRAGMENT_UNIFORM_STRUCT = SHADER_INFO.uniforms.gridArgs;
console.log(SHADER_INFO)
const SHADER_MODULE_NAME = 'VERTEX_MODULE_GRID'
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_GRID'
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_GRID'

//TODO - autoExposure시 이놈떄문에 문제가 생김
/**
 * 3D 씬(Scene)의 기준 바닥면을 바둑판 형태의 격자로 렌더링하여 구조와 위치를 가늠하게 돕는 디버깅용 그리드 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 그리드 크기(`size`)에 상응하는 1단위 간격의 격자선을 그리며, Z축(파란색)과 X축(빨간색) 방향 중심선을 다르게 채색하여 방위 인지를 도모합니다.
 * - 투명 블렌딩 상태 조절 및 안티앨리어싱(MSAA) 설정 변경 등 렌더 상태에 동적으로 대처하며, 성능 최적화를 위해 GPU 렌더 번들(Render Bundle)로 드로우를 제어합니다.
 *
 * **[EN]**
 * - Visualizes the base ground plane as a grid mesh in the 3D scene.
 * - Spans line elements at 1-unit intervals matching `size`, and highlights coordinate directions: Z-center line in Blue and X-center line in Red.
 * - Adapts to blending and antialiasing parameters using optimized GPU Render Bundles.
 *
 * @category Debugger
 */
class DrawDebuggerGrid extends BaseObject {
    #vertexBuffer: VertexBuffer
    #indexBuffer: IndexBuffer
    #uniformBuffer: UniformBuffer
    readonly #fragmentBindGroup: GPUBindGroup
    readonly #pipeline: GPURenderPipeline
    readonly #pipelineMSAA: GPURenderPipeline
    #blendColorState: BlendState
    #blendAlphaState: BlendState
    readonly #lineColor: ColorRGBA
    #size: number = 100
    #drawBufferManager: DrawBufferManager
    #drawCommandSlot: DrawCommandSlot
    #bundleEncoder: GPURenderBundleEncoder
    #renderBundle: GPURenderBundle
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup
    #lastUpdateMSAAID: string

    constructor(redGPUContext: RedGPUContext) {
        super();
        validateRedGPUContext(redGPUContext)
        this.#drawBufferManager = DrawBufferManager.getInstance(redGPUContext)
        const {resourceManager, gpuDevice} = redGPUContext
        const moduleDescriptor: GPUShaderModuleDescriptor = {code: shaderSource}
        // const moduleDescriptor: GPUShaderModuleDescriptor = {code: SHADER_INFO.defaultSource}
        const shaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(SHADER_MODULE_NAME, moduleDescriptor)
        this.#blendColorState = new BlendState(this)
        this.#blendAlphaState = new BlendState(this)

        this.#lineColor = new ColorRGBA(128, 128, 128, 0.25)
        const vertexBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System)
        const layoutName = 'GRID_MATERIAL_BIND_GROUP_LAYOUT'
        const fragmentBindGroupLayout = resourceManager.getGPUBindGroupLayout(layoutName) || resourceManager.createBindGroupLayout(
            layoutName,
            getFragmentBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1)
        )
        this.#setBuffers(redGPUContext)
        this.#fragmentBindGroup = gpuDevice.createBindGroup({
            label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
            layout: fragmentBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                }
            }]
        });
        const basePipelineDescriptor: GPURenderPipelineDescriptor = {
            label: PIPELINE_DESCRIPTOR_LABEL,
            layout: gpuDevice.createPipelineLayout({
                label: 'DRAW_DEBUGGER_GRID_PIPELINE_LAYOUT',
                bindGroupLayouts: [
                    vertexBindGroupLayout,
                    fragmentBindGroupLayout,
                ]
            }),
            vertex: {
                module: shaderModule,
                entryPoint: 'vertexMain',
                buffers: [{
                    arrayStride: this.#vertexBuffer.interleavedStruct.arrayStride,
                    attributes: this.#vertexBuffer.interleavedStruct.attributes
                }],
            },
            primitive: {
                topology: 'line-list',
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fragmentMain',
                targets: [
                    {
                        format: 'rgba16float',
                        blend: {
                            color: this.#blendColorState.state,
                            alpha: this.#blendAlphaState.state
                        },
                    },
                    {
                        format: navigator.gpu.getPreferredCanvasFormat(),
                        blend: undefined,
                    },
                    {
                        format: 'rgba16float',
                        blend: undefined,
                    },
                ],
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
            }
        }
        this.#pipeline = gpuDevice.createRenderPipeline(basePipelineDescriptor)
        this.#pipelineMSAA = gpuDevice.createRenderPipeline({
            ...basePipelineDescriptor,
            multisample: {
                count: 4
            }
        })
        const drawBufferManager = this.#drawBufferManager
        if (!this.#drawCommandSlot) {
            this.#drawCommandSlot = drawBufferManager.allocateDrawCommand(this.name)
            drawBufferManager.setIndexedIndirectCommand(this.#drawCommandSlot, this.#indexBuffer.indexCount, 1, 0, 0, 0)
        }
    }

    get size(): number {
        return this.#size;
    }

    set size(value: number) {
        this.#size = value;
    }

    get lineColor(): ColorRGBA {
        return this.#lineColor;
    }

    render(renderViewStateData: RenderViewStateData) {
        const {view, currentRenderPassEncoder, renderResults} = renderViewStateData
        const {redGPUContext} = view
        const {gpuDevice, antialiasingManager} = redGPUContext
        const {msaaID} = antialiasingManager
        const position = vec3.create()
        vec3.set(position, view.rawCamera.x, view.rawCamera.y, view.rawCamera.z)
        renderResults.num3DObjects++
        renderResults.numDrawCalls++
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID
        const changedSystemBindGroup = view.systemUniform_Vertex_UniformBindGroup !== this.#prevSystemUniform_Vertex_UniformBindGroup
        if (this.#pipeline) {
            const lineCount = (this.#size + 1) * 2; // 세로 + 가로 라인 수
            const indexCount = lineCount * 2; // 각 라인마다 2개 인덱스
            if (!this.#bundleEncoder || dirtyMSAA || changedSystemBindGroup) {
                this.#lastUpdateMSAAID = msaaID
                // keepLog('렌더번들갱신', this.name, useMSAA,dirtyMSAA)
                this.#bundleEncoder = gpuDevice.createRenderBundleEncoder({
                    ...view.basicRenderBundleEncoderDescriptor,
                    label: this.name
                })
                this.#bundleEncoder.setPipeline(view.redGPUContext.antialiasingManager.useMSAA ? this.#pipelineMSAA : this.#pipeline);
                this.#bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
                this.#bundleEncoder.setBindGroup(1, this.#fragmentBindGroup);
                this.#bundleEncoder.setVertexBuffer(0, this.#vertexBuffer.gpuBuffer);
                this.#bundleEncoder.setIndexBuffer(this.#indexBuffer.gpuBuffer, this.#indexBuffer.format);
                this.#bundleEncoder.drawIndexedIndirect(this.#drawCommandSlot.buffer, this.#drawCommandSlot.commandOffset * 4)
                this.#renderBundle = this.#bundleEncoder.finish();
            }
            renderResults.numTriangles += 0; // 라인이므로 삼각형 수는 0
            renderResults.numPoints += indexCount
            currentRenderPassEncoder.executeBundles([this.#renderBundle])
        }
        this.#prevSystemUniform_Vertex_UniformBindGroup = view.systemUniform_Vertex_UniformBindGroup
    }

    #makeGridLineData(size: number) {
        const interleaveData = [];
        const indexData = [];
        const halfSize = size / 2;
        let vertexIndex = 0;
        // 세로 라인들 (X축 방향) - 1단위 간격
        for (let i = -halfSize; i <= halfSize; i += 1) {
            // 축 라인인지 확인 (중앙)
            const isAxisLine = (i === 0);
            const color = isAxisLine ? [0.0, 0.0, 1.0, 1.0] : [0.5, 0.5, 0.5, 1.0]; // Z축은 파란색
            // 라인의 시작점과 끝점
            interleaveData.push(
                i, 0, -halfSize, ...color, // 시작점
                i, 0, halfSize, ...color   // 끝점
            );
            // 인덱스 추가
            indexData.push(vertexIndex, vertexIndex + 1);
            vertexIndex += 2;
        }
        // 가로 라인들 (Z축 방향) - 1단위 간격
        for (let i = -halfSize; i <= halfSize; i += 1) {
            // 축 라인인지 확인 (중앙)
            const isAxisLine = (i === 0);
            const color = isAxisLine ? [1.0, 0.0, 0.0, 1.0] : [0.5, 0.5, 0.5, 1.0]; // X축은 빨간색
            // 라인의 시작점과 끝점
            interleaveData.push(
                -halfSize, 0, i, ...color, // 시작점
                halfSize, 0, i, ...color   // 끝점
            );
            // 인덱스 추가
            indexData.push(vertexIndex, vertexIndex + 1);
            vertexIndex += 2;
        }
        return {interleaveData, indexData};
    }

    #setBuffers(redGPUContext: RedGPUContext) {
        const size = this.#size;
        const {resourceManager} = redGPUContext
        const {cachedBufferState} = resourceManager
        {
            const uniqueKey = `VertexBuffer_Grid_${size}`;
            let vertexBuffer = cachedBufferState[uniqueKey];
            if (!vertexBuffer) {
                const {interleaveData} = this.#makeGridLineData(size);
                vertexBuffer = new VertexBuffer(
                    redGPUContext,
                    interleaveData,
                    new VertexInterleavedStruct({
                        position: VertexInterleaveType.float32x3,
                        color: VertexInterleaveType.float32x4,
                    }),
                    undefined,
                    uniqueKey
                );
                cachedBufferState[uniqueKey] = vertexBuffer;
            }
            this.#vertexBuffer = vertexBuffer;
        }
        {
            const uniqueKey = `IndexBuffer_Grid_${size}`;
            let indexBuffer = cachedBufferState[uniqueKey];
            if (!indexBuffer) {
                const {indexData} = this.#makeGridLineData(size);
                indexBuffer = new IndexBuffer(
                    redGPUContext,
                    indexData,
                    undefined,
                    uniqueKey
                );
                cachedBufferState[uniqueKey] = indexBuffer;
            }
            this.#indexBuffer = indexBuffer;
        }
        {
            const uniqueKey = `UniformBuffer_Grid`;
            let uniformBuffer = cachedBufferState[uniqueKey];
            if (!uniformBuffer) {
                const uniformData = new ArrayBuffer(FRAGMENT_UNIFORM_STRUCT.arrayBufferByteLength);
                uniformBuffer = new UniformBuffer(redGPUContext, uniformData, uniqueKey, uniqueKey);
                cachedBufferState[uniqueKey] = uniformBuffer;
            }
            this.#uniformBuffer = uniformBuffer;
        }
        this.#uniformBuffer.writeOnlyBuffer(FRAGMENT_UNIFORM_STRUCT.members.lineColor, this.#lineColor.rgbaNormalLinear)
    }
}

Object.freeze(DrawDebuggerGrid)
export default DrawDebuggerGrid
