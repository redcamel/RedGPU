import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import Landscape from "../../core/Landscape";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import fullscreenQuadVertexWGSL from "../core/shader/fullscreenQuadVertex.wgsl";
import vhtDebuggerWGSL from "./shader/vhtDebugger.wgsl";

export class LandscapeVHTDebugger extends ALandscapeDebugger {
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
        if (!this.visible || !this.#context) return;

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const vhtTexture = this.landscape.vhtAtlasTexture;
        if (!vhtTexture || !vhtTexture.gpuTexture) return;

        if ((this.#lastBoundTexture !== vhtTexture.gpuTexture || !this.#bindGroup) && this.#bindGroupLayout) {
            this.#lastBoundTexture = vhtTexture.gpuTexture;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'VHTDebuggerBindGroup',
                layout: this.#bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: vhtTexture.gpuTextureView
                    }
                ]
            });
        }

        if (!this.#pipeline || !this.#bindGroup) return;

        try {
            const currentTexture = this.#context.getCurrentTexture();
            if (!currentTexture) return;

            this.landscape.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
                const passEncoder = commandEncoder.beginRenderPass({
                    colorAttachments: [
                        {
                            view: currentTexture.createView(),
                            clearValue: {r: 0.06, g: 0.09, b: 0.16, a: 1.0},
                            loadOp: 'clear',
                            storeOp: 'store'
                        }
                    ]
                });

                passEncoder.setPipeline(this.#pipeline);
                passEncoder.setBindGroup(0, this.#bindGroup);
                passEncoder.draw(4);
                passEncoder.end();
            });
        } catch (e) {

        }

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
        const shaderCode = `
            ${fullscreenQuadVertexWGSL}
            ${vhtDebuggerWGSL}
        `;

        const shaderInfo = resourceManager.wgslParser.parse('VHTDebuggerShaderModule', shaderCode);
        let shaderModule = resourceManager.getGPUShaderModule('VHTDebuggerShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('VHTDebuggerShaderModule', {
                code: shaderCode
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
        const bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'VHTDebuggerBindGroupLayout',
            entries: descriptor.entries
        });
        this.#bindGroupLayout = bindGroupLayout;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'VHTDebuggerPipelineLayout',
            bindGroupLayouts: [bindGroupLayout]
        });

        this.#pipeline = gpuDevice.createRenderPipeline({
            label: 'VHTDebuggerRenderPipeline',
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

export default LandscapeVHTDebugger;
