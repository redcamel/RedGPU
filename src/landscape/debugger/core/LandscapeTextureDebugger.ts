import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "../../Landscape";
import LandscapeTileStreamer from "../../core/spatial/LandscapeTileStreamer";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import fullscreenQuadVertexWGSL from "./shader/fullscreenQuadVertex.wgsl";

/**
 * [KO] 지형 또는 타일 스트리머로부터 디버그 대상 GPU 텍스처와 뷰를 조회하는 함수 타입입니다.
 * [EN] Function type that retrieves the target debug GPU texture and view from a `Landscape` or `LandscapeTileStreamer`.
 *
 * @category Debugger
 */
export type TextureGetter = (landscape: Landscape, tileStreamer?: LandscapeTileStreamer | null) => {
    gpuTexture?: GPUTexture | null;
    gpuTextureView?: GPUTextureView | null;
} | null;

/**
 * [KO] 지형(`Landscape`)의 가상 텍스처(VHT, VNT, VBT 등) 아틀라스를 화면 오버레이 캔버스에 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes `Landscape` virtual texture atlases (VHT, VNT, VBT, etc.) on an on-screen overlay canvas.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] LandscapeDebuggerManager를 통해 가상 텍스처 디버거 활성화
 * // [EN] Enable virtual texture debuggers via LandscapeDebuggerManager
 * landscape.debuggerManager.vht = true;
 * landscape.debuggerManager.vbt = true;
 * ```
 *
 * @category Debugger
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
     * [KO] `LandscapeTextureDebugger` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeTextureDebugger` instance.
     *
     * @param landscape -
     * [KO] 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance
     * @param tileStreamer -
     * [KO] `LandscapeTileStreamer` 인스턴스
     * [EN] `LandscapeTileStreamer` instance
     * @param cameraOrOptions -
     * [KO] 추적할 카메라 인스턴스 또는 디버거 설정 옵션
     * [EN] Camera instance to track or debugger configuration options
     * @param options -
     * [KO] 디버거 UI 배치 및 크기 옵션 (`ALandscapeDebuggerOptions`)
     * [EN] Debugger UI placement and size options (`ALandscapeDebuggerOptions`)
     * @param shaderCode -
     * [KO] 텍스처 시각화에 사용할 프래그먼트 WGSL 셰이더 코드
     * [EN] Fragment WGSL shader code used for texture visualization
     * @param shaderModuleName -
     * [KO] 셰이더 모듈 식별 이름
     * [EN] Identifier name for the shader module
     * @param textureGetter -
     * [KO] 시각화할 텍스처를 반환하는 콜백 함수 (`TextureGetter`)
     * [EN] Callback function returning the texture to visualize (`TextureGetter`)
     * @param clearColor -
     * [KO] 렌더 패스 배경 클리어 색상 (`GPUColorDict`)
     * [EN] Render pass background clear color (`GPUColorDict`)
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
     * [KO] 대상 텍스처와 카메라 오버레이를 디버거 캔버스에 렌더링합니다.
     * [EN] Renders the target texture and camera overlay onto the debugger canvas.
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
     * [KO] 디버거 DOM 요소 및 내부 WebGPU 파이프라인 참조를 해제합니다.
     * [EN] Destroys debugger DOM elements and releases internal WebGPU pipeline references.
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
