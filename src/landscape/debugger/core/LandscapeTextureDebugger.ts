/**
 * [KO] 풀스크린 쿼드 파이프라인 기반 지형 가상 텍스처 실시간 온스크린 투영 디버거 모듈입니다.
 * [EN] Texture debugger module projecting terrain GPU textures via fullscreen quad pipelines.
 * @packageDocumentation
 */
import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "../../Landscape";
import LandscapeTileStreamer from "../../core/spatial/LandscapeTileStreamer";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import fullscreenQuadVertexWGSL from "./shader/fullscreenQuadVertex.wgsl";

/**
 * [KO] Landscape 또는 LandscapeTileStreamer로부터 관찰 대상 GPUTexture 및 GPUTextureView를 추출하는 게터 함수 타입입니다.
 * [EN] Getter function type resolving target GPUTexture and GPUTextureView from Landscape or LandscapeTileStreamer.
 */
export type TextureGetter = (landscape: Landscape, tileStreamer?: LandscapeTileStreamer | null) => {
    gpuTexture?: GPUTexture | null;
    gpuTextureView?: GPUTextureView | null;
} | null;

/**
 * [KO] WebGPU 풀스크린 쿼드 렌더링 파이프라인을 구축하여 지형 텍스처(VHT/VNT/VBT)를 온스크린 캔버스에 실시간 투영하는 텍스처 디버거 클래스입니다.
 * [EN] Texture debugger projecting terrain GPU textures (VHT/VNT/VBT) onto on-screen canvases via WebGPU fullscreen quad render pipelines.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(DebuggerManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (DebuggerManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
class LandscapeTextureDebugger extends ALandscapeDebugger {
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

    /**
     * [KO] LandscapeTextureDebugger 생성자입니다.
     * [EN] Constructor for LandscapeTextureDebugger.
     *
     * @param landscape - [KO] 대상 Landscape 인스턴스 / [EN] Target Landscape instance
     * @param tileStreamer - [KO] 타일 스트리머 인스턴스 / [EN] Tile streamer instance
     * @param cameraOrOptions - [KO] 카메라 인스턴스 또는 옵션 / [EN] Camera instance or options
     * @param options - [KO] 디버거 옵션 / [EN] Debugger options
     * @param shaderCode - [KO] 프래그먼트 셰이더 WGSL 코드 / [EN] Fragment shader WGSL source code
     * @param shaderModuleName - [KO] 고유 셰이더 모듈 식별자 / [EN] Unique shader module identifier
     * @param textureGetter - [KO] 텍스처 추출 게터 함수 / [EN] Texture extractor getter function
     * @param clearColor - [KO] 배경 클리어 색상 (기본값: 진한 남색) / [EN] Background clear color (default: dark navy)
     */
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

    /**
     * [KO] 매 프레임 대상 GPUTexture를 풀스크린 쿼드로 캔버스에 렌더링하고 오버레이(카메라, 그리드)를 갱신합니다.
     * [EN] Renders target GPUTexture to canvas via fullscreen quad each frame and updates overlay (camera, grid).
     */
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
                label: `${this.#shaderModuleName}_BindGroup`,
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

    /**
     * [KO] 파이프라인 및 바인드 그룹 리소스를 해제하고 디버거 DOM 요소를 제거합니다.
     * [EN] Releases pipeline and bind group resources and destroys debugger DOM elements.
     */
    override destroy(): void {
        super.destroy();
        this.#pipeline = null;
        this.#bindGroup = null;
        this.#bindGroupLayout = null;
        this.#context = null;
        this.#lastBoundTexture = null;
    }

    #initWebGPUContext(): void {
        const {redGPUContext} = this;
        const {gpuDevice, resourceManager} = redGPUContext;
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
            `${this.#shaderModuleName}_BindGroupLayout`,
            descriptor
        );
        this.#bindGroupLayout = bindGroupLayout;

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            `${this.#shaderModuleName}_PipelineLayout`,
            {
                bindGroupLayouts: [bindGroupLayout]
            }
        );
        this.#pipeline = gpuDevice.createRenderPipeline({
            label: `${this.#shaderModuleName}_RenderPipeline`,
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

Object.freeze(LandscapeTextureDebugger);
export default LandscapeTextureDebugger;
