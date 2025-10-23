import { vec3 } from "gl-matrix";
import ColorRGBA from "../../../color/ColorRGBA";
import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import GPU_COMPARE_FUNCTION from "../../../gpuConst/GPU_COMPARE_FUNCTION";
import { getFragmentBindGroupLayoutDescriptorFromShaderInfo } from "../../../material/core";
import BlendState from "../../../renderState/BlendState";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import VertexInterleavedStruct from "../../../resources/buffer/vertexBuffer/VertexInterleavedStruct";
import VertexInterleaveType from "../../../resources/buffer/vertexBuffer/VertexInterleaveType";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import InstanceIdGenerator from "../../../utils/uuid/InstanceIdGenerator";
import shaderSource from './shader.wgsl';
import DrawBufferManager from "../../../renderer/core/DrawBufferManager";
const SHADER_INFO = parseWGSL(shaderSource);
const FRAGMENT_UNIFORM_STRUCT = SHADER_INFO.uniforms.gridArgs;
console.log(SHADER_INFO);
const SHADER_MODULE_NAME = 'VERTEX_MODULE_GRID';
const FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME = 'FRAGMENT_BIND_GROUP_DESCRIPTOR_GRID';
const PIPELINE_DESCRIPTOR_LABEL = 'PIPELINE_DESCRIPTOR_GRID';
class DrawDebuggerGrid {
    #vertexBuffer;
    #indexBuffer;
    #uniformBuffer;
    #fragmentBindGroup;
    #pipeline;
    #pipelineMSAA;
    #blendColorState;
    #blendAlphaState;
    #lineColor;
    #size = 100;
    #instanceId;
    #name;
    #drawBufferManager;
    #drawCommandSlot;
    #bundleEncoder;
    #renderBundle;
    constructor(redGPUContext) {
        validateRedGPUContext(redGPUContext);
        this.#drawBufferManager = DrawBufferManager.getInstance(redGPUContext);
        this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        const { resourceManager, gpuDevice } = redGPUContext;
        const moduleDescriptor = { code: SHADER_INFO.defaultSource };
        const shaderModule = resourceManager.createGPUShaderModule(SHADER_MODULE_NAME, moduleDescriptor);
        this.#blendColorState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD);
        this.#blendAlphaState = new BlendState(this, GPU_BLEND_FACTOR.SRC_ALPHA, GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA, GPU_BLEND_OPERATION.ADD);
        this.#lineColor = new ColorRGBA(128, 128, 128, 0.5);
        const vertexBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const fragmentBindGroupLayout = redGPUContext.resourceManager.getGPUBindGroupLayout('GRID_MATERIAL_BIND_GROUP_LAYOUT') || redGPUContext.resourceManager.createBindGroupLayout('GRID_MATERIAL_BIND_GROUP_LAYOUT', getFragmentBindGroupLayoutDescriptorFromShaderInfo(SHADER_INFO, 1));
        this.#setBuffers(redGPUContext);
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
        const basePipelineDescriptor = {
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
                        format: navigator.gpu.getPreferredCanvasFormat(),
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
            drawBufferManager.updateSingleCommand(this.#drawCommandSlot);
        }
    }
    get name() {
        if (!this.#instanceId)
            this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }
    set name(value) {
        this.#name = value;
    }
    get size() {
        return this.#size;
    }
    set size(value) {
        this.#size = value;
    }
    get lineColor() {
        return this.#lineColor;
    }
    render(renderViewStateData) {
        const { view, currentRenderPassEncoder } = renderViewStateData;
        const { redGPUContext } = view;
        const { gpuDevice, antialiasingManager } = redGPUContext;
        const { useMSAA, changedMSAA } = antialiasingManager;
        const position = vec3.create();
        vec3.set(position, view.rawCamera.x, view.rawCamera.y, view.rawCamera.z);
        renderViewStateData.num3DObjects++;
        renderViewStateData.numDrawCalls++;
        if (this.#pipeline) {
            const lineCount = (this.#size + 1) * 2; // 세로 + 가로 라인 수
            const indexCount = lineCount * 2; // 각 라인마다 2개 인덱스
            if (!this.#bundleEncoder || changedMSAA) {
                // keepLog('렌더번들갱신', this.name, useMSAA,changedMSAA)
                this.#bundleEncoder = gpuDevice.createRenderBundleEncoder({
                    colorFormats: [navigator.gpu.getPreferredCanvasFormat(), navigator.gpu.getPreferredCanvasFormat(), 'rgba16float'],
                    depthStencilFormat: 'depth32float',
                    sampleCount: useMSAA ? 4 : 1,
                    label: this.name
                });
                this.#bundleEncoder.setPipeline(view.redGPUContext.antialiasingManager.useMSAA ? this.#pipelineMSAA : this.#pipeline);
                this.#bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
                this.#bundleEncoder.setBindGroup(1, this.#fragmentBindGroup);
                this.#bundleEncoder.setVertexBuffer(0, this.#vertexBuffer.gpuBuffer);
                this.#bundleEncoder.setIndexBuffer(this.#indexBuffer.gpuBuffer, this.#indexBuffer.format);
                // this.#bundleEncoder.drawIndexed(indexCount);
                this.#bundleEncoder.drawIndexedIndirect(this.#drawCommandSlot.buffer, this.#drawCommandSlot.commandOffset * 4);
                this.#renderBundle = this.#bundleEncoder.finish();
            }
            renderViewStateData.numTriangles += 0; // 라인이므로 삼각형 수는 0
            renderViewStateData.numPoints += indexCount;
            currentRenderPassEncoder.executeBundles([this.#renderBundle]);
        }
    }
    #makeGridLineData(size) {
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
            interleaveData.push(i, 0, -halfSize, ...color, // 시작점
            i, 0, halfSize, ...color // 끝점
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
            interleaveData.push(-halfSize, 0, i, ...color, // 시작점
            halfSize, 0, i, ...color // 끝점
            );
            // 인덱스 추가
            indexData.push(vertexIndex, vertexIndex + 1);
            vertexIndex += 2;
        }
        return { interleaveData, indexData };
    }
    #setBuffers(redGPUContext) {
        const size = this.#size;
        const { resourceManager } = redGPUContext;
        const { cachedBufferState } = resourceManager;
        {
            const uniqueKey = `VertexBuffer_Grid_${size}`;
            let vertexBuffer = cachedBufferState[uniqueKey];
            if (!vertexBuffer) {
                const { interleaveData } = this.#makeGridLineData(size);
                vertexBuffer = new VertexBuffer(redGPUContext, interleaveData, new VertexInterleavedStruct({
                    position: VertexInterleaveType.float32x3,
                    color: VertexInterleaveType.float32x4,
                }), undefined, uniqueKey);
                cachedBufferState[uniqueKey] = vertexBuffer;
            }
            this.#vertexBuffer = vertexBuffer;
        }
        {
            const uniqueKey = `IndexBuffer_Grid_${size}`;
            let indexBuffer = cachedBufferState[uniqueKey];
            if (!indexBuffer) {
                const { indexData } = this.#makeGridLineData(size);
                indexBuffer = new IndexBuffer(redGPUContext, indexData, undefined, uniqueKey);
                cachedBufferState[uniqueKey] = indexBuffer;
            }
            this.#indexBuffer = indexBuffer;
        }
        {
            const uniqueKey = `UniformBuffer_Grid`;
            let uniformBuffer = cachedBufferState[uniqueKey];
            if (!uniformBuffer) {
                const uniformData = new ArrayBuffer(FRAGMENT_UNIFORM_STRUCT.arrayBufferByteLength);
                uniformBuffer = new UniformBuffer(redGPUContext, uniformData);
                cachedBufferState[uniqueKey] = uniformBuffer;
            }
            this.#uniformBuffer = uniformBuffer;
        }
        this.#uniformBuffer.writeOnlyBuffer(FRAGMENT_UNIFORM_STRUCT.members.lineColor, this.#lineColor.rgbaNormal);
    }
}
export default DrawDebuggerGrid;
