import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import {getBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import DrawBufferManager, {DrawCommandSlot} from "../../../renderer/core/DrawBufferManager";
import BlendState from "../../../renderState/BlendState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import shaderSource from './shader.wgsl';
import BaseObject from "../../../base/BaseObject";

const SHADER_MODULE_NAME = 'VERTEX_MODULE_GRID';
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_GRID';
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_GRID';

/**
 * 3D 씬(Scene)의 기준 바닥면을 절차적 안티앨리어싱(Procedural Anti-Aliased) 격자로 렌더링하여 구조와 위치를 가늠하게 돕는 디버깅용 그리드 클래스입니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @remarks
 * **[KO]**
 * - 화면 공간 편미분(`fwidth`)과 `smoothstep`을 결합한 절차적 렌더링을 사용하여 모아레(Moiré) 간섭 무늬와 지글거림이 전혀 없는 극도로 선명한 그리드를 제공합니다.
 * - 단일 평면 쿼드(Quad) 메쉬 기반으로 동작하여 수천 개의 라인 정점 버퍼 할당 오버헤드를 원천 제거합니다.
 * - 기본 보조선(Minor, $1\text{m}$)과 주선(Major, $10\text{m}$) 다중 계층 렌더링을 지원하며, X축(빨강)과 Z축(파랑) 중심축을 선명하게 강조합니다.
 * - 카메라 거리에 따른 부드러운 페이드아웃 및 픽셀 단위 라인 두께 조절을 지원합니다.
 *
 * **[EN]**
 * - Renders a crystal-clear, moiré-free procedural anti-aliased grid on the base ground plane using screen-space derivatives (`fwidth`) and `smoothstep`.
 * - Operates on a single plane quad mesh, eliminating vertex buffer allocation overhead for thousands of line segments.
 * - Supports multi-level grid rendering with minor ($1\text{m}$) and major ($10\text{m}$) lines, distinctly highlighting X-axis (Red) and Z-axis (Blue).
 * - Features distance-based smooth fadeout and pixel-accurate line width control.
 *
 * @category Debugger
 */
class DrawDebuggerGrid extends BaseObject {
    #vertexBuffer: VertexBuffer;
    #indexBuffer: IndexBuffer;
    #uniformBuffer: UniformBuffer;
    readonly #fragmentBindGroup: GPUBindGroup;
    readonly #pipeline: GPURenderPipeline;
    readonly #pipelineMSAA: GPURenderPipeline;
    #blendColorState: BlendState;
    #blendAlphaState: BlendState;

    readonly #lineColor: ColorRGBA;
    readonly #majorLineColor: ColorRGBA;
    readonly #xAxisColor: ColorRGBA;
    readonly #zAxisColor: ColorRGBA;

    #size: number = 100;
    #gridSize: number = 1.0;
    #majorStep: number = 10.0;
    #lineWidth: number = 1.0;
    #majorLineWidth: number = 1.5;
    #axisLineWidth: number = 2.0;
    #fadeStart: number = 25.0;
    #fadeEnd: number = 60.0;

    readonly #uniformData: Float32Array = new Float32Array(24);

    #drawBufferManager: DrawBufferManager;
    #drawCommandSlot: DrawCommandSlot;
    #bundleEncoder: GPURenderBundleEncoder;
    #renderBundle: GPURenderBundle;
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup;
    #lastUpdateMSAAID: string;
    #SHADER_INFO: any;

    constructor(redGPUContext: RedGPUContext) {
        super();
        validateRedGPUContext(redGPUContext);
        this.#drawBufferManager = redGPUContext.drawBufferManager;
        const {resourceManager, gpuDevice} = redGPUContext;
        const moduleDescriptor: GPUShaderModuleDescriptor = {code: shaderSource};
        const shaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(SHADER_MODULE_NAME, moduleDescriptor);
        this.#blendColorState = new BlendState(this);
        this.#blendAlphaState = new BlendState(this);

        // 색상 변경 시 즉시 유니폼 버퍼를 갱신하도록 콜백 등록
        this.#lineColor = new ColorRGBA(128, 128, 128, 0.25, () => this.#updateUniformBuffer());
        this.#majorLineColor = new ColorRGBA(180, 180, 180, 0.5, () => this.#updateUniformBuffer());
        this.#xAxisColor = new ColorRGBA(255, 60, 60, 0.8, () => this.#updateUniformBuffer());
        this.#zAxisColor = new ColorRGBA(60, 120, 255, 0.8, () => this.#updateUniformBuffer());

        const vertexBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const layoutName = 'GRID_BIND_GROUP_LAYOUT';

        this.#SHADER_INFO = resourceManager.wgslParser.parse('DRAW_DEBUGGER_GRID', shaderSource);

        const gridBindGroupLayout = resourceManager.getGPUBindGroupLayout(layoutName) || resourceManager.createBindGroupLayout(
            layoutName,
            getBindGroupLayoutDescriptorFromShaderInfo(
                this.#SHADER_INFO,
                1,
                GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT
            )
        );

        this.#setBuffers(redGPUContext);

        this.#fragmentBindGroup = gpuDevice.createBindGroup({
            label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
            layout: gridBindGroupLayout,
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
                    gridBindGroupLayout,
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
                topology: 'triangle-list',
                cullMode: 'none',
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
                depthWriteEnabled: false,
                depthCompare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
            }
        };

        this.#pipeline = gpuDevice.createRenderPipeline(basePipelineDescriptor);
        this.#pipelineMSAA = gpuDevice.createRenderPipeline({
            ...basePipelineDescriptor,
            multisample: {
                count: 4
            }
        });

        const drawBufferManager = this.#drawBufferManager;
        if (!this.#drawCommandSlot) {
            this.#drawCommandSlot = drawBufferManager.allocateDrawCommand(this.name);
            drawBufferManager.setIndexedIndirectCommand(this.#drawCommandSlot, this.#indexBuffer.indexCount, 1, 0, 0, 0);
        }
    }

    /**
     * [KO] 그리드 평면의 가로/세로 크기(단위: m)를 반환합니다.
     * [EN] Returns the width/length of the grid plane (unit: m).
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 그리드 평면의 가로/세로 크기(단위: m)를 설정합니다.
     * [EN] Sets the width/length of the grid plane (unit: m).
     */
    set size(value: number) {
        if (this.#size !== value) {
            this.#size = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 반환합니다.
     * [EN] Returns the minor grid spacing (unit: m, default: 1.0).
     */
    get gridSize(): number {
        return this.#gridSize;
    }

    /**
     * [KO] 기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 설정합니다.
     * [EN] Sets the minor grid spacing (unit: m, default: 1.0).
     */
    set gridSize(value: number) {
        if (this.#gridSize !== value) {
            this.#gridSize = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 반환합니다.
     * [EN] Returns the major grid spacing (unit: m, default: 10.0).
     */
    get majorStep(): number {
        return this.#majorStep;
    }

    /**
     * [KO] 주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 설정합니다.
     * [EN] Sets the major grid spacing (unit: m, default: 10.0).
     */
    set majorStep(value: number) {
        if (this.#majorStep !== value) {
            this.#majorStep = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 보조선(Minor)의 화면 픽셀 두께(기본값: 1.0)를 반환합니다.
     * [EN] Returns the screen pixel line width for minor grid lines (default: 1.0).
     */
    get lineWidth(): number {
        return this.#lineWidth;
    }

    /**
     * [KO] 보조선(Minor)의 화면 픽셀 두께(기본값: 1.0)를 설정합니다.
     * [EN] Sets the screen pixel line width for minor grid lines (default: 1.0).
     */
    set lineWidth(value: number) {
        if (this.#lineWidth !== value) {
            this.#lineWidth = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 주선(Major)의 화면 픽셀 두께(기본값: 1.5)를 반환합니다.
     * [EN] Returns the screen pixel line width for major grid lines (default: 1.5).
     */
    get majorLineWidth(): number {
        return this.#majorLineWidth;
    }

    /**
     * [KO] 주선(Major)의 화면 픽셀 두께(기본값: 1.5)를 설정합니다.
     * [EN] Sets the screen pixel line width for major grid lines (default: 1.5).
     */
    set majorLineWidth(value: number) {
        if (this.#majorLineWidth !== value) {
            this.#majorLineWidth = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 반환합니다.
     * [EN] Returns the screen pixel line width for X/Z axis lines (default: 2.0).
     */
    get axisLineWidth(): number {
        return this.#axisLineWidth;
    }

    /**
     * [KO] X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 설정합니다.
     * [EN] Sets the screen pixel line width for X/Z axis lines (default: 2.0).
     */
    set axisLineWidth(value: number) {
        if (this.#axisLineWidth !== value) {
            this.#axisLineWidth = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 20.0)를 반환합니다.
     * [EN] Returns the camera distance where distance fade starts (unit: m, default: 20.0).
     */
    get fadeStart(): number {
        return this.#fadeStart;
    }

    /**
     * [KO] 거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 20.0)를 설정합니다.
     * [EN] Sets the camera distance where distance fade starts (unit: m, default: 20.0).
     */
    set fadeStart(value: number) {
        if (this.#fadeStart !== value) {
            this.#fadeStart = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 거리 기반 페이드가 완료되어 완전 투명해지는 카메라 거리(단위: m, 기본값: 80.0)를 반환합니다.
     * [EN] Returns the camera distance where distance fade ends (unit: m, default: 80.0).
     */
    get fadeEnd(): number {
        return this.#fadeEnd;
    }

    /**
     * [KO] 거리 기반 페이드가 완료되어 완전 투명해지는 카메라 거리(단위: m, 기본값: 80.0)를 설정합니다.
     * [EN] Sets the camera distance where distance fade ends (unit: m, default: 80.0).
     */
    set fadeEnd(value: number) {
        if (this.#fadeEnd !== value) {
            this.#fadeEnd = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 기본 보조 그리드 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the minor grid line color (ColorRGBA).
     */
    get lineColor(): ColorRGBA {
        return this.#lineColor;
    }

    /**
     * [KO] 주 그리드(Major Grid) 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the major grid line color (ColorRGBA).
     */
    get majorLineColor(): ColorRGBA {
        return this.#majorLineColor;
    }

    /**
     * [KO] X축(빨강) 중심선 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the X-axis line color (ColorRGBA).
     */
    get xAxisColor(): ColorRGBA {
        return this.#xAxisColor;
    }

    /**
     * [KO] Z축(파랑) 중심선 색상(ColorRGBA)을 반환합니다.
     * [EN] Returns the Z-axis line color (ColorRGBA).
     */
    get zAxisColor(): ColorRGBA {
        return this.#zAxisColor;
    }

    render(renderViewStateData: RenderViewStateData) {
        const {view, currentRenderPassEncoder, renderResults} = renderViewStateData;
        const {redGPUContext} = view;
        const {gpuDevice, antialiasingManager} = redGPUContext;
        const {msaaID} = antialiasingManager;

        renderResults.num3DObjects++;
        renderResults.numDrawCalls++;
        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID;
        const changedSystemBindGroup = view.systemUniform_Vertex_UniformBindGroup !== this.#prevSystemUniform_Vertex_UniformBindGroup;

        if (this.#pipeline) {
            if (!this.#bundleEncoder || dirtyMSAA || changedSystemBindGroup) {
                this.#lastUpdateMSAAID = msaaID;
                this.#bundleEncoder = gpuDevice.createRenderBundleEncoder({
                    ...view.basicRenderBundleEncoderDescriptor,
                    label: this.name
                });
                this.#bundleEncoder.setPipeline(view.redGPUContext.antialiasingManager.useMSAA ? this.#pipelineMSAA : this.#pipeline);
                this.#bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
                this.#bundleEncoder.setBindGroup(1, this.#fragmentBindGroup);
                this.#bundleEncoder.setVertexBuffer(0, this.#vertexBuffer.gpuBuffer);
                this.#bundleEncoder.setIndexBuffer(this.#indexBuffer.gpuBuffer, this.#indexBuffer.format);
                this.#bundleEncoder.drawIndexedIndirect(this.#drawCommandSlot.buffer, this.#drawCommandSlot.commandOffset * 4);
                this.#renderBundle = this.#bundleEncoder.finish();
            }
            renderResults.numTriangles += 2;
            renderResults.numPoints += 0;
            currentRenderPassEncoder.executeBundles([this.#renderBundle]);
        }
        this.#prevSystemUniform_Vertex_UniformBindGroup = view.systemUniform_Vertex_UniformBindGroup;
    }

    /**
     * [KO] DrawDebuggerGrid를 파기하고 드로우 커맨드 슬롯과 자원 참조를 해제합니다.
     * [EN] Destroys the DrawDebuggerGrid and releases the draw command slot and resource references.
     */
    destroy() {
        if (this.#drawCommandSlot) {
            this.#drawBufferManager.setInstanceNum(this.#drawCommandSlot, 0);
            this.#drawCommandSlot = null;
        }
        this.#SHADER_INFO = null;
        this.#vertexBuffer = null;
        this.#indexBuffer = null;
        if (this.#uniformBuffer) {
            this.#uniformBuffer.destroy();
            this.#uniformBuffer = null;
        }
        this.#renderBundle = null;
        this.#bundleEncoder = null;
        this.#prevSystemUniform_Vertex_UniformBindGroup = null;
        this.#drawBufferManager = null;
        console.log("🧹 DrawDebuggerGrid destroy 완료");
    }

    #updateUniformBuffer(): void {
        if (!this.#uniformBuffer) return;
        const d = this.#uniformData;

        // 0 ~ 3: lineColor (RGBA)
        const lc = this.#lineColor.rgbaNormalLinear;
        d[0] = lc[0];
        d[1] = lc[1];
        d[2] = lc[2];
        d[3] = lc[3];

        // 4 ~ 7: majorLineColor (RGBA)
        const mc = this.#majorLineColor.rgbaNormalLinear;
        d[4] = mc[0];
        d[5] = mc[1];
        d[6] = mc[2];
        d[7] = mc[3];

        // 8 ~ 11: xAxisColor (RGBA)
        const xc = this.#xAxisColor.rgbaNormalLinear;
        d[8] = xc[0];
        d[9] = xc[1];
        d[10] = xc[2];
        d[11] = xc[3];

        // 12 ~ 15: zAxisColor (RGBA)
        const zc = this.#zAxisColor.rgbaNormalLinear;
        d[12] = zc[0];
        d[13] = zc[1];
        d[14] = zc[2];
        d[15] = zc[3];

        // 16 ~ 19: size, gridSize, majorStep, lineWidth
        d[16] = this.#size;
        d[17] = this.#gridSize;
        d[18] = this.#majorStep;
        d[19] = this.#lineWidth;

        // 20 ~ 23: majorLineWidth, axisLineWidth, fadeStart, fadeEnd
        d[20] = this.#majorLineWidth;
        d[21] = this.#axisLineWidth;
        d[22] = this.#fadeStart;
        d[23] = this.#fadeEnd;

        this.#uniformBuffer.redGPUContext.gpuDevice.queue.writeBuffer(
            this.#uniformBuffer.gpuBuffer,
            0,
            d as BufferSource
        );
    }

    #setBuffers(redGPUContext: RedGPUContext) {
        const {resourceManager} = redGPUContext;
        const {cachedBufferState} = resourceManager;

        // 1. 단일 평면 단위 쿼드 버텍스 버퍼 (정점 4개: -0.5 ~ +0.5)
        {
            const uniqueKey = `VertexBuffer_GridQuad_Unit`;
            let vertexBuffer = cachedBufferState[uniqueKey];
            if (!vertexBuffer) {
                const interleaveData = new Float32Array([
                    -0.5, 0.0, -0.5,
                    0.5, 0.0, -0.5,
                    0.5, 0.0, 0.5,
                    -0.5, 0.0, 0.5,
                ]);
                vertexBuffer = new VertexBuffer(
                    redGPUContext,
                    interleaveData,
                    new VertexInterleavedStruct({
                        position: VertexInterleaveType.float32x3,
                    }),
                    undefined,
                    uniqueKey
                );
                cachedBufferState[uniqueKey] = vertexBuffer;
            }
            this.#vertexBuffer = vertexBuffer;
        }

        // 2. 단일 평면 단위 쿼드 인덱스 버퍼 (삼각형 2개, 인덱스 6개)
        {
            const uniqueKey = `IndexBuffer_GridQuad_Unit`;
            let indexBuffer = cachedBufferState[uniqueKey];
            if (!indexBuffer) {
                const indexData = new Uint32Array([
                    0, 1, 2,
                    0, 2, 3
                ]);
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

        // 3. 인스턴스 전용 유니폼 버퍼 (96바이트: Float32 24개)
        {
            const uniformByteLength = 96;
            const uniformData = new ArrayBuffer(uniformByteLength);
            this.#uniformBuffer = new UniformBuffer(
                redGPUContext,
                uniformData,
                `UniformBuffer_Grid_${this.name}`
            );
        }

        this.#updateUniformBuffer();
    }
}

Object.freeze(DrawDebuggerGrid);
export default DrawDebuggerGrid;
