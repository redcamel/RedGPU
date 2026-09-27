import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "../../Landscape";
import LandscapeTileStreamer from "../../core/spatial/LandscapeTileStreamer";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import fullscreenQuadVertexWGSL from "./shader/fullscreenQuadVertex.wgsl";

type TextureGetter = (landscape: Landscape, tileStreamer?: LandscapeTileStreamer | null) => {
    gpuTexture?: GPUTexture | null;
    gpuTextureView?: GPUTextureView | null;
} | null;

export abstract class ALandscapeTextureDebugger extends ALandscapeDebugger {
    #context: GPUCanvasContext | null = null;
    #pipeline: GPURenderPipeline | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #canvasFormat: GPUTextureFormat = 'bgra8unorm';
    #lastBoundTexture: GPUTexture | null = null;
    #tileStreamer: LandscapeTileStreamer | null = null;

    #shaderCode: string;
    #shaderModuleName: string;
    #textureGetter: TextureGetter;
    #clearColor: GPUColorDict;

    constructor(
        landscape: Landscape,
        tileStreamer: LandscapeTileStreamer | null | undefined,
        cameraOrOptions: any,
        options: ALandscapeDebuggerOptions | undefined,
        shaderCode: string,
        shaderModuleName: string,
        textureGetter: TextureGetter,
        clearColor: GPUColorDict = {r: 0.06, g: 0.09, b: 0.16, a: 1.0}
    ) {
        super(landscape, cameraOrOptions, options);
        this.#tileStreamer = tileStreamer || null;
        this.#shaderCode = shaderCode;
        this.#shaderModuleName = shaderModuleName;
        this.#textureGetter = textureGetter;
        this.#clearColor = clearColor;

        this.#initWebGPUContext();
    }

    update(): void {
        if (!this.visible || !this.#context) return;

        const redGPUContext = this.redGPUContext;
        const gpuDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const targetTexture = this.#textureGetter(this.landscape, this.#tileStreamer);
        if (!targetTexture || !targetTexture.gpuTexture || !targetTexture.gpuTextureView) return;

        if ((this.#lastBoundTexture !== targetTexture.gpuTexture || !this.#bindGroup) && this.#bindGroupLayout) {
            this.#lastBoundTexture = targetTexture.gpuTexture;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: `${this.#shaderModuleName}BindGroup`,
                layout: this.#bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: targetTexture.gpuTextureView
                    }
                ]
            });
        }

        if (!this.#pipeline || !this.#bindGroup) return;

        try {
            const currentTexture = this.#context.getCurrentTexture();
            if (!currentTexture) return;

            redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
                const passEncoder = commandEncoder.beginRenderPass({
                    colorAttachments: [
                        {
                            view: currentTexture.createView(),
                            clearValue: this.#clearColor,
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

        this.renderOverlay();
    }

    #initWebGPUContext(): void {
        const redGPUContext = this.redGPUContext;
        const gpuDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        this.#canvasFormat = ALandscapeDebugger.getPreferredCanvasFormat();
        const ctx = this.canvas.getContext('webgpu') as GPUCanvasContext | null;
        if (!ctx) return;
        this.#context = ctx;

        ctx.configure({
            device: gpuDevice,
            format: this.#canvasFormat,
            alphaMode: 'premultiplied'
        });

        const resourceManager = redGPUContext.resourceManager;
        const combinedShaderCode = `
            ${fullscreenQuadVertexWGSL}
            ${this.#shaderCode}
        `;

        const shaderInfo = resourceManager.wgslParser.parse(this.#shaderModuleName, combinedShaderCode);
        let shaderModule = resourceManager.getGPUShaderModule(this.#shaderModuleName);
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule(this.#shaderModuleName, {
                code: combinedShaderCode
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

        const bindGroupLayout = resourceManager.createBindGroupLayout(
            `${this.#shaderModuleName}BindGroupLayout`,
            descriptor
        );
        this.#bindGroupLayout = bindGroupLayout;

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            `${this.#shaderModuleName}PipelineLayout`,
            {
                bindGroupLayouts: [bindGroupLayout]
            }
        );
        this.#pipeline = gpuDevice.createRenderPipeline({
            label: `${this.#shaderModuleName}RenderPipeline`,
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

    override destroy(): void {
        super.destroy();
        this.#pipeline = null;
        this.#bindGroup = null;
        this.#bindGroupLayout = null;
        this.#context = null;
        this.#lastBoundTexture = null;
    }
}

Object.freeze(ALandscapeTextureDebugger);
export default ALandscapeTextureDebugger;
