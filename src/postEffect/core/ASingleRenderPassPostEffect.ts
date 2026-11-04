import RedGPUObject from "../../base/RedGPUObject";
import ColorRGB from "../../color/ColorRGB";
import ColorRGBA from "../../color/ColorRGBA";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import {IPostEffectResult} from "./types";

const resourceIdMap = new WeakMap<GPUTexture, number>();
let nextResourceId = 0;

interface ASingleRenderPassPostEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean
}

/**
 * [KO] 기존 컬러 버퍼 위에 단일 In-Place 렌더 패스(Full-Screen Triangle + Fragment Shader + ROP 하드웨어 블렌딩)로 직접 합성하는 후처리 이펙트의 추상 기본 클래스입니다.
 * [EN] Abstract base class for post-processing effects that composite directly onto the existing color buffer in a single In-Place render pass (Full-Screen Triangle + Fragment Shader + ROP hardware blending).
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
abstract class ASingleRenderPassPostEffect extends RedGPUObject {
    #isLdr: boolean = false
    #blendState: GPUBlendState
    #useGroup2: boolean = true
    #renderShader: GPUShaderModule
    #fragmentBindGroupLayout0: GPUBindGroupLayout
    #fragmentBindGroupLayout1: GPUBindGroupLayout
    #fragmentBindGroup0: GPUBindGroup
    #fragmentBindGroup1: GPUBindGroup
    #fragmentBindGroupEntries0: GPUBindGroupEntry[]
    #fragmentBindGroupEntries1: GPUBindGroupEntry[]
    #renderPipeline: GPURenderPipeline
    #prevTargetFormat: GPUTextureFormat
    #uniformBuffer: UniformBuffer
    #uniformsInfo
    #name: string
    #shaderInfo
    #prevWidth: number = 0
    #prevHeight: number = 0
    #videoMemorySize: number = 0
    #bindGroupCache0 = new Map<string, GPUBindGroup>();
    #bindGroupCache1: GPUBindGroup;
    #colorAttachment: GPURenderPassColorAttachment;
    #renderPassDescriptor: GPURenderPassDescriptor;
    #currentGbufferBindGroup: GPUBindGroup = null;
    #copySrcInfo: { texture: GPUTexture } = {texture: null};
    #copyDstInfo: { texture: GPUTexture } = {texture: null};
    #copyExtent: { width: number; height: number; depthOrArrayLayers: number } = {
        width: 1,
        height: 1,
        depthOrArrayLayers: 1
    };
    #destroyed: boolean = false

    /**
     * [KO] ASingleRenderPassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASingleRenderPassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param options -
     * [KO] 초기화 옵션 (`isLdr`, `blendState`)
     * [EN] Initialization options (`isLdr`, `blendState`)
     */
    protected constructor(
        redGPUContext: RedGPUContext,
        options?: {
            isLdr?: boolean;
            blendState?: GPUBlendState;
        }
    ) {
        super(redGPUContext)
        if (options) {
            const {isLdr, blendState} = options;
            if (isLdr !== undefined) this.#isLdr = isLdr;
            if (blendState !== undefined) this.#blendState = blendState;
        }
        this.#colorAttachment = {
            view: null,
            clearValue: {r: 0, g: 0, b: 0, a: 0},
            loadOp: GPU_LOAD_OP.LOAD,
            storeOp: GPU_STORE_OP.STORE
        };
        this.#renderPassDescriptor = {
            label: 'ASingleRenderPassPostEffect_RenderPass',
            colorAttachments: [this.#colorAttachment]
        };
    }

    /**
     * [KO] 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space after tone mapping.
     *
     * @defaultValue false
     * @returns
     * [KO] LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space
     */
    get isLdr(): boolean {
        return this.#isLdr
    }

    /**
     * [KO] 렌더 파이프라인의 하드웨어 블렌딩 상태(`GPUBlendState`)를 반환합니다.
     * [EN] Returns the hardware blend state (`GPUBlendState`) of the render pipeline.
     *
     * @returns
     * [KO] 하드웨어 블렌딩 상태
     * [EN] Hardware blend state
     */
    get blendState(): GPUBlendState {
        return this.#blendState;
    }

    /**
     * [KO] 이펙트 고유 버퍼의 비디오 메모리 사용량(바이트)을 반환합니다.
     * [EN] Returns the video memory usage (in bytes) of the effect's dedicated buffer.
     *
     * @returns
     * [KO] 비디오 메모리 사용량 (단위: 바이트)
     * [EN] Video memory usage (unit: bytes)
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

    /**
     * [KO] WGSL 셰이더 파싱 정보를 반환합니다.
     * [EN] Returns the WGSL shader parsing information.
     *
     * @returns
     * [KO] WGSL 셰이더 파싱 정보
     * [EN] WGSL shader parsing information
     */
    get shaderInfo() {
        return this.#shaderInfo;
    }

    /**
     * [KO] 이펙트 전용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the effect-specific uniform buffer.
     *
     * @returns
     * [KO] `UniformBuffer` 인스턴스
     * [EN] `UniformBuffer` instance
     */
    get uniformBuffer(): UniformBuffer {
        return this.#uniformBuffer;
    }

    /**
     * [KO] 이펙트 전용 유니폼 구조체 정보를 반환합니다.
     * [EN] Returns the effect-specific uniform struct information.
     *
     * @returns
     * [KO] 유니폼 구조체 정보
     * [EN] Uniform struct information
     */
    get uniformsInfo() {
        return this.#uniformsInfo
    }

    /**
     * [KO] 캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.
     * [EN] Clears cached bind groups and output texture references.
     */
    clear() {
        this.#bindGroupCache0.clear();
        this.#bindGroupCache1 = null;
        this.#copySrcInfo.texture = null;
        this.#copyDstInfo.texture = null;
    }

    /**
     * [KO] 이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.
     * [EN] Destroys the effect's uniform buffer and cached resources.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true
        this.clear()
        this.#uniformBuffer?.destroy()
        this.#uniformBuffer = null
        this.#uniformsInfo = null
        this.#name = null
        this.#shaderInfo = null
        this.#renderShader = null
        this.#renderPipeline = null
    }

    /**
     * [KO] 렌더 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating the render shader module and the uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param shaderCode -
     * [KO] 렌더 셰이더 WGSL 코드 문자열
     * [EN] Render shader WGSL code string
     */
    init(redGPUContext: RedGPUContext, name: string, shaderCode: string) {
        this.#name = this.#isLdr ? `${name}_LDR` : name;
        this.#renderPassDescriptor.label = `ASingleRenderPassPostEffect_${this.#name}_RenderPass`;
        const {resourceManager} = redGPUContext;

        this.#renderShader = resourceManager.createGPUShaderModule(this.#name, {code: shaderCode});
        this.#shaderInfo = resourceManager.wgslParser.parse(this.#name, shaderCode);

        const {uniforms} = this.#shaderInfo;
        this.#uniformsInfo = uniforms.uniforms;
        this.#useGroup2 = Boolean(uniforms.systemUniforms);

        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength);
            this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, `${this.constructor.name}_UniformBuffer`);
        }

        {
            const {members} = this.#uniformsInfo || {}
            if (members) {
                for (const k in members) {
                    const property = this[k];
                    if (property === undefined) continue;
                    if (property instanceof ColorRGBA) {
                        this.uniformBuffer.writeOnlyBuffer(members[k], property.rgbaNormalLinear);
                    } else if (property instanceof ColorRGB) {
                        this.uniformBuffer.writeOnlyBuffer(members[k], property.rgbNormalLinear);
                    } else {
                        this.uniformBuffer.writeOnlyBuffer(members[k], property);
                    }
                }
            }
        }
    }

    /**
     * [KO] 입력 컬러 버퍼 위에 In-Place 렌더 패스를 실행하고 결과 텍스처 정보를 반환합니다.
     * [EN] Executes the In-Place render pass onto the input color buffer and returns the result texture information.
     *
     * @param view -
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     * @param width -
     * [KO] 렌더링 너비 (단위: 픽셀)
     * [EN] Rendering width (in pixels)
     * @param height -
     * [KO] 렌더링 높이 (단위: 픽셀)
     * [EN] Rendering height (in pixels)
     * @param sourceTextureInfo -
     * [KO] 입력 소스 텍스처 정보 목록 (`sourceTextureInfo[0]`은 합성 대상 컬러 버퍼, 이후 항목은 보조 샘플링 텍스처)
     * [EN] List of input source texture information (`sourceTextureInfo[0]` is the target color buffer, subsequent items are auxiliary sampled textures)
     * @returns
     * [KO] 렌더링 결과 텍스처 및 뷰 (`IPostEffectResult`)
     * [EN] Rendering result texture and view (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: IPostEffectResult[]): IPostEffectResult {
        const {gpuDevice} = this;

        let result: IPostEffectResult;
        let targetFormat: GPUTextureFormat = this.#isLdr ? 'rgba8unorm' : 'rgba16float';

        const primarySource = sourceTextureInfo[0];
        const srcTexture = primarySource.texture;
        targetFormat = srcTexture.format || targetFormat;

        if (srcTexture.usage & GPUTextureUsage.RENDER_ATTACHMENT) {
            result = primarySource;
        } else {
            result = view.postEffectManager.texturePool.allocResult(width, height, targetFormat, false);
            this.#copySrcInfo.texture = srcTexture;
            this.#copyDstInfo.texture = result.texture;
            this.#copyExtent.width = width;
            this.#copyExtent.height = height;
            this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.POST_PROCESS, this.#executeCopyTexture);
        }

        if (this.#prevWidth !== width || this.#prevHeight !== height) {
            this.#bindGroupCache0.clear();
        }

        this.#checkAndCreatePipeline(view, targetFormat, gpuDevice);

        this.#updateBindGroups(sourceTextureInfo, gpuDevice);

        this.#execute(result.textureView, this.#useGroup2 ? view.postEffectManager.gbufferBindGroup : null);

        this.#prevWidth = width;
        this.#prevHeight = height;
        this.#calcVideoMemory();

        return result;
    }

    /**
     * [KO] 지정된 유니폼 멤버의 값을 유니폼 버퍼에 기록합니다.
     * [EN] Writes the value of the specified uniform member to the uniform buffer.
     *
     * @param key -
     * [KO] 유니폼 멤버 키 이름
     * [EN] Uniform member key name
     * @param value -
     * [KO] 기록할 값
     * [EN] Value to write
     */
    updateUniform(key: string, value: number | number[] | boolean) {
        const memberInfo = this.uniformsInfo?.members[key];
        if (memberInfo) {
            this.uniformBuffer.writeOnlyBuffer(memberInfo, value);
        }
    }

    #getResourceId(resource: GPUTexture): number {
        if (!resource) return 0;
        let id = resourceIdMap.get(resource);
        if (id === undefined) {
            id = nextResourceId++;
            resourceIdMap.set(resource, id);
        }
        return id;
    }

    #executeCopyTexture = (encoder: GPUCommandEncoder): void => {
        if (this.#copySrcInfo.texture && this.#copyDstInfo.texture) {
            encoder.copyTextureToTexture(this.#copySrcInfo, this.#copyDstInfo, this.#copyExtent);
        }
    };

    #executeRenderPass = (renderPassEncoder: GPURenderPassEncoder): void => {
        renderPassEncoder.setPipeline(this.#renderPipeline);

        if (this.#fragmentBindGroup0) renderPassEncoder.setBindGroup(0, this.#fragmentBindGroup0);
        if (this.#fragmentBindGroup1) renderPassEncoder.setBindGroup(1, this.#fragmentBindGroup1);
        if (this.#useGroup2 && this.#currentGbufferBindGroup) {
            renderPassEncoder.setBindGroup(2, this.#currentGbufferBindGroup);
        }

        renderPassEncoder.draw(3, 1, 0, 0);
    };

    #execute(targetOutputView: GPUTextureView, gbufferBindGroup: GPUBindGroup) {
        this.#colorAttachment.view = targetOutputView;
        this.#currentGbufferBindGroup = gbufferBindGroup;

        this.commandEncoderManager.addPostProcessRenderPass(
            this.#renderPassDescriptor,
            this.#executeRenderPass
        );

        this.#currentGbufferBindGroup = null;
    }

    #checkAndCreatePipeline(view: View3D, targetFormat: GPUTextureFormat, gpuDevice: GPUDevice) {
        if (this.#prevTargetFormat !== targetFormat) {
            this.#renderPipeline = null;
            this.#prevTargetFormat = targetFormat;
        }

        if (this.#renderPipeline) return;

        const {resourceManager} = this;
        const currentShaderInfo = this.#shaderInfo;

        const layout0Name = `${this.#name}_FRAGMENT_BGL_0`;
        const layout1Name = `${this.#name}_FRAGMENT_BGL_1`;

        this.#fragmentBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(layout0Name) ||
            resourceManager.createBindGroupLayout(layout0Name, getFragmentBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0));

        this.#fragmentBindGroupLayout1 = resourceManager.getGPUBindGroupLayout(layout1Name) ||
            resourceManager.createBindGroupLayout(layout1Name, getFragmentBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1));

        const colorTarget: GPUColorTargetState = {
            format: targetFormat
        };
        if (this.#blendState) {
            colorTarget.blend = this.#blendState;
        }

        const bindGroupLayouts: GPUBindGroupLayout[] = this.#useGroup2
            ? [
                this.#fragmentBindGroupLayout0,
                this.#fragmentBindGroupLayout1,
                view.postEffectManager.gbufferBindGroupLayout
            ]
            : [
                this.#fragmentBindGroupLayout0,
                this.#fragmentBindGroupLayout1
            ];

        this.#renderPipeline = gpuDevice.createRenderPipeline({
            label: `${this.#name}_RENDER_PIPELINE_${targetFormat}`,
            layout: gpuDevice.createPipelineLayout({
                label: `${this.#name}_PIPELINE_LAYOUT`,
                bindGroupLayouts
            }),
            vertex: {
                module: this.#renderShader,
                entryPoint: 'vs_main'
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            fragment: {
                module: this.#renderShader,
                entryPoint: 'fs_main',
                targets: [colorTarget]
            }
        });
    }

    #updateBindGroups(sourceTextureInfoList: IPostEffectResult[], gpuDevice: GPUDevice) {
        const {textures, samplers} = this.#shaderInfo;
        const sourceOffset = 1;
        const sourceCount = sourceTextureInfoList.length;

        let group0Key: string;
        if (sourceCount <= sourceOffset) {
            group0Key = 'empty';
        } else if (sourceCount - sourceOffset === 1) {
            group0Key = `${this.#getResourceId(sourceTextureInfoList[sourceOffset]?.texture)}`;
        } else {
            group0Key = '';
            for (let i = sourceOffset; i < sourceCount; i++) {
                if (i > sourceOffset) group0Key += '_';
                group0Key += this.#getResourceId(sourceTextureInfoList[i]?.texture);
            }
        }

        const cachedBG0 = this.#bindGroupCache0.get(group0Key);
        if (cachedBG0) {
            this.#fragmentBindGroup0 = cachedBG0;
        } else {
            this.#fragmentBindGroupEntries0 = [];

            for (let i = 0, len = textures.length; i < len; i++) {
                const {binding, group} = textures[i];
                if (group === 0) {
                    const resource = sourceTextureInfoList[binding + sourceOffset]?.textureView;
                    if (resource) {
                        this.#fragmentBindGroupEntries0.push({binding, resource});
                    }
                }
            }
            if (samplers) {
                for (let i = 0, len = samplers.length; i < len; i++) {
                    const {binding, group} = samplers[i];
                    if (group === 0) {
                        this.#fragmentBindGroupEntries0.push({
                            binding,
                            resource: this.redGPUContext.resourceManager.basicSampler.gpuSampler
                        });
                    }
                }
            }

            this.#fragmentBindGroup0 = gpuDevice.createBindGroup({
                label: `${this.#name}_FRAGMENT_BG_0`,
                layout: this.#fragmentBindGroupLayout0,
                entries: this.#fragmentBindGroupEntries0
            });

            this.#bindGroupCache0.set(group0Key, this.#fragmentBindGroup0);
        }

        if (this.#bindGroupCache1) {
            this.#fragmentBindGroup1 = this.#bindGroupCache1;
        } else if (this.#uniformBuffer && this.uniformsInfo) {
            this.#fragmentBindGroupEntries1 = [{
                binding: 0,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                },
            }];
            this.#fragmentBindGroup1 = gpuDevice.createBindGroup({
                label: `${this.#name}_FRAGMENT_BG_1`,
                layout: this.#fragmentBindGroupLayout1,
                entries: this.#fragmentBindGroupEntries1
            });
            this.#bindGroupCache1 = this.#fragmentBindGroup1;
        } else {
            this.#fragmentBindGroup1 = gpuDevice.createBindGroup({
                label: `${this.#name}_FRAGMENT_BG_1_EMPTY`,
                layout: this.#fragmentBindGroupLayout1,
                entries: []
            });
            this.#bindGroupCache1 = this.#fragmentBindGroup1;
        }
    }

    #calcVideoMemory() {
        this.#videoMemorySize = this.#uniformBuffer ? this.#uniformBuffer.size : 0;
    }
}

Object.defineProperty(ASingleRenderPassPostEffect.prototype, 'isInstanceofPostEffect', {
    value: true,
    writable: false
});
Object.freeze(ASingleRenderPassPostEffect)
export default ASingleRenderPassPostEffect
