import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import Landscape from "../../core/Landscape";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import fullscreenQuadVertexWGSL from "../core/shader/fullscreenQuadVertex.wgsl";
import vntDebuggerWGSL from "./shader/vntDebugger.wgsl";

export class LandscapeVNTDebugger extends ALandscapeDebugger {
    #context: GPUCanvasContext | null = null;
    #pipeline: GPURenderPipeline | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #canvasFormat: GPUTextureFormat = 'bgra8unorm';
    #lastBoundTexture: GPUTexture | null = null;

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        super(landscape, cameraOrOptions, options);
        this.#initWebGPUContext();
    }

    update(): void {
        if (!this.visible) return;

        if (!this.#context || !this.#pipeline) {
            this.#initWebGPUContext();
            if (!this.#context || !this.#pipeline) return;
        }

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const vntTexture = this.landscape.vntAtlasTexture;
        if (!vntTexture || !vntTexture.gpuTexture) return;

        if ((this.#lastBoundTexture !== vntTexture.gpuTexture || !this.#bindGroup) && this.#bindGroupLayout) {
            try {
                this.#bindGroup = gpuDevice.createBindGroup({
                    label: 'VNTDebuggerBindGroup',
                    layout: this.#bindGroupLayout,
                    entries: [
                        {
                            binding: 0,
                            resource: vntTexture.gpuTextureView
                        }
                    ]
                });
                this.#lastBoundTexture = vntTexture.gpuTexture;
            } catch (e) {
                this.#lastBoundTexture = null;
                this.#bindGroup = null;
                return;
            }
        }

        if (!this.#pipeline || !this.#bindGroup) return;

        let currentTargetView: GPUTextureView;
        try {
            currentTargetView = this.#context.getCurrentTexture().createView();
        } catch {
            return;
        }

        this.landscape.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const passEncoder = commandEncoder.beginRenderPass({
                label: 'LandscapeVNTDebuggerRenderPass',
                colorAttachments: [{
                    view: currentTargetView,
                    clearValue: {r: 0.1, g: 0.1, b: 0.1, a: 1.0},
                    loadOp: 'clear',
                    storeOp: 'store'
                }]
            });

            passEncoder.setPipeline(this.#pipeline);
            passEncoder.setBindGroup(0, this.#bindGroup);
            passEncoder.draw(4);
            passEncoder.end();
        });

        // 공통 2D 카메라 오버레이 렌더링
        this.renderOverlay();
    }

    #initWebGPUContext(): void {
        const gpu = navigator.gpu;
        if (!gpu) return;

        this.#canvasFormat = ALandscapeDebugger.getPreferredCanvasFormat();
        const ctx = this.canvas.getContext('webgpu') as GPUCanvasContext | null;
        if (!ctx) return;
        this.#context = ctx;

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        ctx.configure({
            device: gpuDevice,
            format: this.#canvasFormat,
            alphaMode: 'premultiplied'
        });

        const resourceManager = this.landscape.redGPUContext.resourceManager;
        const wgslCode = `
            ${fullscreenQuadVertexWGSL}
            ${vntDebuggerWGSL}
        `;

        const shaderInfo = resourceManager.wgslParser.parse('LandscapeVNTDebuggerShaderModule', wgslCode);
        let shaderModule = resourceManager.getGPUShaderModule('LandscapeVNTDebuggerShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('LandscapeVNTDebuggerShaderModule', {
                code: wgslCode
            });
        }

        const descriptor = getFragmentBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0, {
            0: {
                texture: {
                    sampleType: 'unfilterable-float',
                    viewDimension: '2d'
                }
            }
        });
        this.#bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeVNTDebuggerBindGroupLayout',
            entries: descriptor.entries
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'LandscapeVNTDebuggerPipelineLayout',
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#pipeline = gpuDevice.createRenderPipeline({
            label: 'LandscapeVNTDebuggerRenderPipeline',
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [
                    {
                        format: this.#canvasFormat
                    }
                ]
            },
            primitive: {
                topology: 'triangle-strip'
            }
        });
    }
}

export default LandscapeVNTDebugger;
