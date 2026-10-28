import BaseObject from "../../../base/BaseObject";
import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import GPU_LOAD_OP from "../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../gpuConst/GPU_STORE_OP";
import {getBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import DrawBufferManager, {DrawCommandSlot} from "../../../renderer/core/DrawBufferManager";
import updateViewportAndScissor from "../../../renderer/helperFunc/updateViewportAndScissor";
import BlendState from "../../../renderState/BlendState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import View3D from "../../view/View3D";
import shaderSource from './shader.wgsl';

const SHADER_MODULE_NAME = 'VERTEX_MODULE_GRID';
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_GRID';
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_GRID';

/**
 * [KO] 3D 씬(Scene)의 기준 바닥면(XZ 평면)에 절차적 안티앨리어싱 격자를 렌더링하는 디버거 클래스입니다.
 * [EN] Debugger class that renders a procedural anti-aliased grid on the base ground plane (XZ plane) of a 3D scene.
 *
 * [KO] 보조선(Minor Grid), 주선(Major Grid), X축(빨강) 및 Z축(파랑) 중심선을 표시하며 카메라 거리에 따른 페이드아웃을 지원합니다.
 * [EN] Displays minor grid lines, major grid lines, X-axis (Red) and Z-axis (Blue) center lines, and supports distance-based fadeout.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] View3D의 grid 프로퍼티를 통해 활성화합니다.
 * // [EN] Enable via the grid property of View3D.
 * view.grid = true;
 * ```
 *
 * @see [DrawDebugger basic example](/RedGPU/examples/3d/drawDebugger/basic/)
 * @category Debugger
 */
class DrawDebuggerGrid extends BaseObject {
    #vertexBuffer: VertexBuffer;
    #indexBuffer: IndexBuffer;
    #uniformBuffer: UniformBuffer;
    #fragmentBindGroup: GPUBindGroup;
    #pipeline: GPURenderPipeline;
    #blendColorState: BlendState;
    #blendAlphaState: BlendState;

    #lineColor: ColorRGBA;
    #majorLineColor: ColorRGBA;
    #xAxisColor: ColorRGBA;
    #zAxisColor: ColorRGBA;

    #size: number = 100;
    #gridSize: number = 1.0;
    #majorStep: number = 10.0;
    #lineWidth: number = 1.0;
    #majorLineWidth: number = 1.5;
    #axisLineWidth: number = 2.0;
    #fadeStart: number = 25.0;
    #fadeEnd: number = 60.0;

    #uniformData: Float32Array = new Float32Array(24);

    #drawBufferManager: DrawBufferManager;
    #drawCommandSlot: DrawCommandSlot;
    #bundleEncoder: GPURenderBundleEncoder;
    #renderBundle: GPURenderBundle;
    #prevSystemUniform_Vertex_UniformBindGroup: GPUBindGroup;
    #SHADER_INFO: any;

    #bundleEncoderDescriptor: GPURenderBundleEncoderDescriptor;
    #colorAttachment: GPURenderPassColorAttachment;
    #depthStencilAttachment: GPURenderPassDepthStencilAttachment;
    #renderPassDescriptor: GPURenderPassDescriptor;
    #singleBundleArray: [GPURenderBundle] = [null as any];
    #currentView: View3D = null;

    /**
     * [KO] `DrawDebuggerGrid` 인스턴스를 생성합니다.
     * [EN] Creates a `DrawDebuggerGrid` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super();
        validateRedGPUContext(redGPUContext);
        const {resourceManager, gpuDevice, drawBufferManager} = redGPUContext;
        this.#drawBufferManager = drawBufferManager;
        const moduleDescriptor: GPUShaderModuleDescriptor = {code: shaderSource};
        const shaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(SHADER_MODULE_NAME, moduleDescriptor);
        this.#blendColorState = new BlendState(this);
        this.#blendAlphaState = new BlendState(
            this,
            GPU_BLEND_FACTOR.ONE,
            GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
            GPU_BLEND_OPERATION.ADD
        );

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
                        format: 'rgba8unorm',
                        blend: {
                            color: this.#blendColorState.state,
                            alpha: this.#blendAlphaState.state
                        },
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

        this.#bundleEncoderDescriptor = {
            label: this.name,
            colorFormats: ['rgba8unorm'],
            depthStencilFormat: 'depth32float',
            sampleCount: 1,
            depthReadOnly: true,
        };
        this.#colorAttachment = {
            view: null as any,
            loadOp: GPU_LOAD_OP.LOAD,
            storeOp: GPU_STORE_OP.STORE,
        };
        this.#depthStencilAttachment = {
            view: null as any,
            depthReadOnly: true,
        };
        this.#renderPassDescriptor = {
            label: 'DrawDebuggerGrid Overlay Render Pass',
            colorAttachments: [this.#colorAttachment],
            depthStencilAttachment: this.#depthStencilAttachment,
        };

        if (!this.#drawCommandSlot) {
            this.#drawCommandSlot = drawBufferManager.allocateDrawCommand(this.name);
            drawBufferManager.setIndexedIndirectCommand(this.#drawCommandSlot, this.#indexBuffer.indexCount, 1, 0, 0, 0);
        }
    }

    /**
     * [KO] 그리드 평면의 가로/세로 크기(단위: m, 기본값: 100)를 가져오거나 설정합니다.
     * [EN] Gets or sets the width and length of the grid plane (unit: m, default: 100).
     *
     * @returns
     * [KO] 그리드 평면 크기
     * [EN] Grid plane size
     */
    get size(): number {
        return this.#size;
    }

    /**
     * [KO] 기본 보조 그리드(Minor Grid) 간격(단위: m, 기본값: 1.0)을 가져오거나 설정합니다.
     * [EN] Gets or sets the minor grid spacing (unit: m, default: 1.0).
     *
     * @returns
     * [KO] 보조 그리드 간격
     * [EN] Minor grid spacing
     */
    get gridSize(): number {
        return this.#gridSize;
    }

    set size(value: number) {
        if (this.#size !== value) {
            this.#size = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 주 그리드(Major Grid) 간격(단위: m, 기본값: 10.0)을 가져오거나 설정합니다.
     * [EN] Gets or sets the major grid spacing (unit: m, default: 10.0).
     *
     * @returns
     * [KO] 주 그리드 간격
     * [EN] Major grid spacing
     */
    get majorStep(): number {
        return this.#majorStep;
    }

    set gridSize(value: number) {
        if (this.#gridSize !== value) {
            this.#gridSize = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 보조선(Minor Grid)의 화면 픽셀 두께(기본값: 1.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen pixel line width for minor grid lines (default: 1.0).
     *
     * @returns
     * [KO] 보조선 두께
     * [EN] Minor grid line width
     */
    get lineWidth(): number {
        return this.#lineWidth;
    }

    set majorStep(value: number) {
        if (this.#majorStep !== value) {
            this.#majorStep = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 주선(Major Grid)의 화면 픽셀 두께(기본값: 1.5)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen pixel line width for major grid lines (default: 1.5).
     *
     * @returns
     * [KO] 주선 두께
     * [EN] Major grid line width
     */
    get majorLineWidth(): number {
        return this.#majorLineWidth;
    }

    set lineWidth(value: number) {
        if (this.#lineWidth !== value) {
            this.#lineWidth = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] X축 및 Z축 중심선의 화면 픽셀 두께(기본값: 2.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the screen pixel line width for X/Z axis lines (default: 2.0).
     *
     * @returns
     * [KO] 축 중심선 두께
     * [EN] Axis line width
     */
    get axisLineWidth(): number {
        return this.#axisLineWidth;
    }

    set majorLineWidth(value: number) {
        if (this.#majorLineWidth !== value) {
            this.#majorLineWidth = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 거리 기반 페이드가 시작되는 카메라 거리(단위: m, 기본값: 25.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera distance where distance fade starts (unit: m, default: 25.0).
     *
     * @returns
     * [KO] 페이드 시작 거리
     * [EN] Fade start distance
     */
    get fadeStart(): number {
        return this.#fadeStart;
    }

    set axisLineWidth(value: number) {
        if (this.#axisLineWidth !== value) {
            this.#axisLineWidth = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 거리 기반 페이드가 완료되어 투명해지는 카메라 거리(단위: m, 기본값: 60.0)를 가져오거나 설정합니다.
     * [EN] Gets or sets the camera distance where distance fade ends (unit: m, default: 60.0).
     *
     * @returns
     * [KO] 페이드 종료 거리
     * [EN] Fade end distance
     */
    get fadeEnd(): number {
        return this.#fadeEnd;
    }

    set fadeStart(value: number) {
        if (this.#fadeStart !== value) {
            this.#fadeStart = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 기본 보조 그리드(Minor Grid) 색상을 반환합니다.
     * [EN] Returns the minor grid line color.
     *
     * @returns
     * [KO] 보조 그리드 색상 인스턴스
     * [EN] Minor grid color instance
     */
    get lineColor(): ColorRGBA {
        return this.#lineColor;
    }

    set fadeEnd(value: number) {
        if (this.#fadeEnd !== value) {
            this.#fadeEnd = value;
            this.#updateUniformBuffer();
        }
    }

    /**
     * [KO] 주 그리드(Major Grid) 색상을 반환합니다.
     * [EN] Returns the major grid line color.
     *
     * @returns
     * [KO] 주 그리드 색상 인스턴스
     * [EN] Major grid color instance
     */
    get majorLineColor(): ColorRGBA {
        return this.#majorLineColor;
    }

    /**
     * [KO] X축(빨강) 중심선 색상을 반환합니다.
     * [EN] Returns the X-axis (Red) center line color.
     *
     * @returns
     * [KO] X축 중심선 색상 인스턴스
     * [EN] X-axis center line color instance
     */
    get xAxisColor(): ColorRGBA {
        return this.#xAxisColor;
    }

    /**
     * [KO] Z축(파랑) 중심선 색상을 반환합니다.
     * [EN] Returns the Z-axis (Blue) center line color.
     *
     * @returns
     * [KO] Z축 중심선 색상 인스턴스
     * [EN] Z-axis center line color instance
     */
    get zAxisColor(): ColorRGBA {
        return this.#zAxisColor;
    }

    /**
     * [KO] 디버그 그리드를 렌더링합니다.
     * [EN] Renders the debug grid.
     *
     * @param view -
     * [KO] 렌더링할 View3D 인스턴스
     * [EN] View3D instance to render
     * @param targetTextureView -
     * [KO] 컬러 렌더 타겟 텍스처 뷰
     * [EN] Color render target texture view
     * @param depthTextureView -
     * [KO] 깊이 렌더 타겟 텍스처 뷰
     * [EN] Depth render target texture view
     */
    render(view: View3D, targetTextureView: GPUTextureView, depthTextureView: GPUTextureView): void {
        const renderResults = view.renderViewStateData.renderResults;
        const redGPUContext = view.redGPUContext;
        const systemBindGroup = view.systemUniform_Vertex_UniformBindGroup;

        renderResults.num3DObjects++;
        renderResults.numDrawCalls++;
        const changedSystemBindGroup = systemBindGroup !== this.#prevSystemUniform_Vertex_UniformBindGroup;

        if (this.#pipeline) {
            if (!this.#bundleEncoder || changedSystemBindGroup) {
                this.#bundleEncoder = redGPUContext.gpuDevice.createRenderBundleEncoder(this.#bundleEncoderDescriptor);
                this.#bundleEncoder.setPipeline(this.#pipeline);
                this.#bundleEncoder.setBindGroup(0, systemBindGroup);
                this.#bundleEncoder.setBindGroup(1, this.#fragmentBindGroup);
                this.#bundleEncoder.setVertexBuffer(0, this.#vertexBuffer.gpuBuffer);
                this.#bundleEncoder.setIndexBuffer(this.#indexBuffer.gpuBuffer, this.#indexBuffer.format);
                this.#bundleEncoder.drawIndexedIndirect(this.#drawCommandSlot.buffer, this.#drawCommandSlot.commandOffset * 4);
                this.#renderBundle = this.#bundleEncoder.finish();
            }
            renderResults.numTriangles += 2;
            renderResults.numPoints += 0;

            this.#colorAttachment.view = targetTextureView;
            this.#depthStencilAttachment.view = depthTextureView;
            this.#singleBundleArray[0] = this.#renderBundle;
            this.#currentView = view;

            redGPUContext.commandEncoderManager.addPostProcessRenderPass(
                this.#renderPassDescriptor,
                this.#executeRenderPass
            );
            this.#currentView = null;
        }
        this.#prevSystemUniform_Vertex_UniformBindGroup = systemBindGroup;
    }

    /**
     * [KO] `DrawDebuggerGrid` 인스턴스를 파기하고 할당된 GPU 리소스와 드로우 커맨드 슬롯을 해제합니다.
     * [EN] Destroys the `DrawDebuggerGrid` instance and releases allocated GPU resources and draw command slots.
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
        this.#currentView = null;
        console.log("🧹 DrawDebuggerGrid destroy 완료");
    }

    #executeRenderPass = (passEncoder: GPURenderPassEncoder): void => {
        updateViewportAndScissor(this.#currentView, passEncoder, 'DEFAULT');
        passEncoder.executeBundles(this.#singleBundleArray);
    };

    #updateUniformBuffer(): void {
        if (!this.#uniformBuffer) return;
        const d = this.#uniformData;

        const lc = this.#lineColor.rgbaNormal;
        d[0] = lc[0];
        d[1] = lc[1];
        d[2] = lc[2];
        d[3] = lc[3];

        const mc = this.#majorLineColor.rgbaNormal;
        d[4] = mc[0];
        d[5] = mc[1];
        d[6] = mc[2];
        d[7] = mc[3];

        const xc = this.#xAxisColor.rgbaNormal;
        d[8] = xc[0];
        d[9] = xc[1];
        d[10] = xc[2];
        d[11] = xc[3];

        const zc = this.#zAxisColor.rgbaNormal;
        d[12] = zc[0];
        d[13] = zc[1];
        d[14] = zc[2];
        d[15] = zc[3];

        d[16] = this.#size;
        d[17] = this.#gridSize;
        d[18] = this.#majorStep;
        d[19] = this.#lineWidth;

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
