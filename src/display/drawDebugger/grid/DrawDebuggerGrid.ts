import BaseObject from "../../../base/BaseObject";
import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import GPU_LOAD_OP from "../../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../../gpuConst/GPU_STORE_OP";
import updateViewportAndScissor from "../../../renderer/helperFunc/updateViewportAndScissor";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import View3D from "../../view/View3D";
import shaderSource from './shader.wgsl';

const SHADER_MODULE_NAME = 'VERTEX_MODULE_GRID';
const GRID_BIND_GROUP_LAYOUT_NAME = 'GRID_BIND_GROUP_LAYOUT';
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_GRID';
const GRID_PIPELINE_LAYOUT_NAME = 'DRAW_DEBUGGER_GRID_PIPELINE_LAYOUT';
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_GRID';
const VERTEX_BUFFER_UNIQUE_KEY = 'VertexBuffer_GridQuad_Unit';
const INDEX_BUFFER_UNIQUE_KEY = 'IndexBuffer_GridQuad_Unit';

const DEFAULT_GRID_SIZE = 100;
const DEFAULT_MINOR_GRID_STEP = 1.0;
const DEFAULT_MAJOR_GRID_STEP = 10.0;
const DEFAULT_MINOR_LINE_WIDTH = 1.0;
const DEFAULT_MAJOR_LINE_WIDTH = 1.5;
const DEFAULT_AXIS_LINE_WIDTH = 2.0;
const DEFAULT_FADE_START = 25.0;
const DEFAULT_FADE_END = 60.0;

const MIN_GRID_STEP = 0.001;
const HALF_LINE_WIDTH_SCALE = 0.5;
const GRID_QUAD_HALF_EXTENT = 0.5;
const GRID_QUAD_Y = 0.0;
const GRID_QUAD_TRIANGLE_COUNT = 2;
const GRID_DRAW_INSTANCE_COUNT = 1;
const GRID_UNIFORM_FLOAT_COUNT = 24;
const GRID_UNIFORM_BYTE_LENGTH = 96;

const DEFAULT_MINOR_LINE_COLOR = Object.freeze({r: 128, g: 128, b: 128, a: 0.25});
const DEFAULT_MAJOR_LINE_COLOR = Object.freeze({r: 180, g: 180, b: 180, a: 0.5});
const DEFAULT_X_AXIS_COLOR = Object.freeze({r: 255, g: 60, b: 60, a: 0.8});
const DEFAULT_Z_AXIS_COLOR = Object.freeze({r: 60, g: 120, b: 255, a: 0.8});

const GRID_BLEND_STATE: GPUBlendState = Object.freeze({
    color: Object.freeze({
        srcFactor: GPU_BLEND_FACTOR.SRC_ALPHA,
        dstFactor: GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
        operation: GPU_BLEND_OPERATION.ADD,
    }),
    alpha: Object.freeze({
        srcFactor: GPU_BLEND_FACTOR.ONE,
        dstFactor: GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA,
        operation: GPU_BLEND_OPERATION.ADD,
    }),
});

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
    #vertexBuffer: VertexBuffer = null;
    #indexBuffer: IndexBuffer = null;
    #uniformBuffer: UniformBuffer = null;
    #bindGroupLayout: GPUBindGroupLayout = null;
    #pipeline: GPURenderPipeline = null;

    #lineColor: ColorRGBA;
    #majorLineColor: ColorRGBA;
    #xAxisColor: ColorRGBA;
    #zAxisColor: ColorRGBA;

    #size: number = DEFAULT_GRID_SIZE;
    #gridSize: number = DEFAULT_MINOR_GRID_STEP;
    #majorStep: number = DEFAULT_MAJOR_GRID_STEP;
    #lineWidth: number = DEFAULT_MINOR_LINE_WIDTH;
    #majorLineWidth: number = DEFAULT_MAJOR_LINE_WIDTH;
    #axisLineWidth: number = DEFAULT_AXIS_LINE_WIDTH;
    #fadeStart: number = DEFAULT_FADE_START;
    #fadeEnd: number = DEFAULT_FADE_END;

    #uniformData: Float32Array = new Float32Array(GRID_UNIFORM_FLOAT_COUNT);

    #renderBundle: GPURenderBundle = null;
    #prevSystemUniformGpuBuffer: GPUBuffer = null;
    #renderBundleCache: WeakMap<GPUBuffer, GPURenderBundle> = new WeakMap();

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
        const {resourceManager, gpuDevice} = redGPUContext;
        const shaderModule: GPUShaderModule = resourceManager.createGPUShaderModule(
            SHADER_MODULE_NAME,
            {code: shaderSource}
        );

        this.#lineColor = new ColorRGBA(
            DEFAULT_MINOR_LINE_COLOR.r,
            DEFAULT_MINOR_LINE_COLOR.g,
            DEFAULT_MINOR_LINE_COLOR.b,
            DEFAULT_MINOR_LINE_COLOR.a,
            () => this.#updateUniformBuffer()
        );
        this.#majorLineColor = new ColorRGBA(
            DEFAULT_MAJOR_LINE_COLOR.r,
            DEFAULT_MAJOR_LINE_COLOR.g,
            DEFAULT_MAJOR_LINE_COLOR.b,
            DEFAULT_MAJOR_LINE_COLOR.a,
            () => this.#updateUniformBuffer()
        );
        this.#xAxisColor = new ColorRGBA(
            DEFAULT_X_AXIS_COLOR.r,
            DEFAULT_X_AXIS_COLOR.g,
            DEFAULT_X_AXIS_COLOR.b,
            DEFAULT_X_AXIS_COLOR.a,
            () => this.#updateUniformBuffer()
        );
        this.#zAxisColor = new ColorRGBA(
            DEFAULT_Z_AXIS_COLOR.r,
            DEFAULT_Z_AXIS_COLOR.g,
            DEFAULT_Z_AXIS_COLOR.b,
            DEFAULT_Z_AXIS_COLOR.a,
            () => this.#updateUniformBuffer()
        );

        const gridBindGroupLayout = resourceManager.getGPUBindGroupLayout(GRID_BIND_GROUP_LAYOUT_NAME) || resourceManager.createBindGroupLayout(
            GRID_BIND_GROUP_LAYOUT_NAME,
            {
                label: GRID_BIND_GROUP_LAYOUT_NAME,
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {type: 'uniform'},
                    },
                    {
                        binding: 1,
                        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                        buffer: {type: 'uniform'},
                    },
                ],
            }
        );
        this.#bindGroupLayout = gridBindGroupLayout;

        this.#setBuffers(redGPUContext);

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            GRID_PIPELINE_LAYOUT_NAME,
            {
                label: GRID_PIPELINE_LAYOUT_NAME,
                bindGroupLayouts: [gridBindGroupLayout],
            }
        );
        const {interleavedStruct} = this.#vertexBuffer;

        const basePipelineDescriptor: GPURenderPipelineDescriptor = {
            label: PIPELINE_DESCRIPTOR_LABEL,
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vertexMain',
                buffers: [{
                    arrayStride: interleavedStruct.arrayStride,
                    attributes: interleavedStruct.attributes,
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
                        blend: GRID_BLEND_STATE,
                    },
                ],
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: false,
                depthCompare: GPU_COMPARE_FUNCTION.LESS_EQUAL,
            },
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

    set size(value: number) {
        if (this.#size !== value) {
            this.#size = value;
            this.#updateUniformBuffer();
        }
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

    set gridSize(value: number) {
        if (this.#gridSize !== value) {
            this.#gridSize = value;
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

    set majorStep(value: number) {
        if (this.#majorStep !== value) {
            this.#majorStep = value;
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

    set lineWidth(value: number) {
        if (this.#lineWidth !== value) {
            this.#lineWidth = value;
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

    set majorLineWidth(value: number) {
        if (this.#majorLineWidth !== value) {
            this.#majorLineWidth = value;
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

    set axisLineWidth(value: number) {
        if (this.#axisLineWidth !== value) {
            this.#axisLineWidth = value;
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

    set fadeStart(value: number) {
        if (this.#fadeStart !== value) {
            this.#fadeStart = value;
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

    set fadeEnd(value: number) {
        if (this.#fadeEnd !== value) {
            this.#fadeEnd = value;
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
        if (!this.#pipeline) return;

        const renderResults = view.renderViewStateData.renderResults;
        const redGPUContext = view.redGPUContext;
        const systemUniformBuffer = view.systemUniform_Vertex_UniformBuffer;
        const systemUniformGpuBuffer = systemUniformBuffer.gpuBuffer;

        renderResults.num3DObjects++;
        renderResults.numDrawCalls++;
        renderResults.numTriangles += GRID_QUAD_TRIANGLE_COUNT;

        if (!this.#renderBundle || systemUniformGpuBuffer !== this.#prevSystemUniformGpuBuffer) {
            this.#renderBundle = this.#getOrCreateRenderBundle(redGPUContext, systemUniformBuffer);
            this.#prevSystemUniformGpuBuffer = systemUniformGpuBuffer;
        }

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

    /**
     * [KO] `DrawDebuggerGrid` 인스턴스를 파기하고 할당된 GPU 리소스를 해제합니다.
     * [EN] Destroys the `DrawDebuggerGrid` instance and releases allocated GPU resources.
     */
    destroy() {
        this.#vertexBuffer = null;
        this.#indexBuffer = null;
        if (this.#uniformBuffer) {
            this.#uniformBuffer.destroy();
            this.#uniformBuffer = null;
        }
        this.#bindGroupLayout = null;
        this.#pipeline = null;
        this.#renderBundle = null;
        this.#prevSystemUniformGpuBuffer = null;
        this.#renderBundleCache = new WeakMap();
        this.#singleBundleArray[0] = null as any;
        this.#currentView = null;
        console.log("🧹 DrawDebuggerGrid destroy 완료");
    }

    #getOrCreateRenderBundle(redGPUContext: RedGPUContext, systemUniformBuffer: UniformBuffer): GPURenderBundle {
        const systemUniformGpuBuffer = systemUniformBuffer.gpuBuffer;
        let cachedBundle = this.#renderBundleCache.get(systemUniformGpuBuffer);
        if (!cachedBundle) {
            const {gpuDevice} = redGPUContext;
            const bindGroup = gpuDevice.createBindGroup({
                label: FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME,
                layout: this.#bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: systemUniformGpuBuffer,
                            offset: 0,
                            size: systemUniformBuffer.size,
                        },
                    },
                    {
                        binding: 1,
                        resource: {
                            buffer: this.#uniformBuffer.gpuBuffer,
                            offset: 0,
                            size: this.#uniformBuffer.size,
                        },
                    },
                ],
            });
            const bundleEncoder = gpuDevice.createRenderBundleEncoder(this.#bundleEncoderDescriptor);
            bundleEncoder.setPipeline(this.#pipeline);
            bundleEncoder.setBindGroup(0, bindGroup);
            bundleEncoder.setVertexBuffer(0, this.#vertexBuffer.gpuBuffer);
            bundleEncoder.setIndexBuffer(this.#indexBuffer.gpuBuffer, this.#indexBuffer.format);
            bundleEncoder.drawIndexed(this.#indexBuffer.indexCount, GRID_DRAW_INSTANCE_COUNT, 0, 0, 0);
            cachedBundle = bundleEncoder.finish();
            this.#renderBundleCache.set(systemUniformGpuBuffer, cachedBundle);
        }
        return cachedBundle;
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
        d[17] = Math.max(MIN_GRID_STEP, this.#gridSize);
        d[18] = Math.max(MIN_GRID_STEP, this.#majorStep);
        d[19] = Math.max(0.0, this.#lineWidth) * HALF_LINE_WIDTH_SCALE;

        d[20] = Math.max(0.0, this.#majorLineWidth) * HALF_LINE_WIDTH_SCALE;
        d[21] = Math.max(0.0, this.#axisLineWidth);
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
            let vertexBuffer = cachedBufferState[VERTEX_BUFFER_UNIQUE_KEY];
            if (!vertexBuffer) {
                const interleaveData = new Float32Array([
                    -GRID_QUAD_HALF_EXTENT, GRID_QUAD_Y, -GRID_QUAD_HALF_EXTENT,
                    GRID_QUAD_HALF_EXTENT, GRID_QUAD_Y, -GRID_QUAD_HALF_EXTENT,
                    GRID_QUAD_HALF_EXTENT, GRID_QUAD_Y, GRID_QUAD_HALF_EXTENT,
                    -GRID_QUAD_HALF_EXTENT, GRID_QUAD_Y, GRID_QUAD_HALF_EXTENT,
                ]);
                vertexBuffer = new VertexBuffer(
                    redGPUContext,
                    interleaveData,
                    new VertexInterleavedStruct({
                        position: VertexInterleaveType.float32x3,
                    }),
                    undefined,
                    VERTEX_BUFFER_UNIQUE_KEY
                );
                cachedBufferState[VERTEX_BUFFER_UNIQUE_KEY] = vertexBuffer;
            }
            this.#vertexBuffer = vertexBuffer;
        }

        {
            let indexBuffer = cachedBufferState[INDEX_BUFFER_UNIQUE_KEY];
            if (!indexBuffer) {
                const indexData = new Uint32Array([
                    0, 1, 2,
                    0, 2, 3,
                ]);
                indexBuffer = new IndexBuffer(
                    redGPUContext,
                    indexData,
                    undefined,
                    INDEX_BUFFER_UNIQUE_KEY
                );
                cachedBufferState[INDEX_BUFFER_UNIQUE_KEY] = indexBuffer;
            }
            this.#indexBuffer = indexBuffer;
        }

        {
            const uniformData = new ArrayBuffer(GRID_UNIFORM_BYTE_LENGTH);
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
