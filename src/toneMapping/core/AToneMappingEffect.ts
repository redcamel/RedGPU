import RedGPUObject from "../../base/RedGPUObject";
import RedGPUContext from "../../context/RedGPUContext";
import defineNumber from "../../defineProperty/funcs/number/defineNumber";
import View3D from "../../display/view/View3D";
import GPU_LOAD_OP from "../../gpuConst/GPU_LOAD_OP";
import GPU_STORE_OP from "../../gpuConst/GPU_STORE_OP";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import {IPostEffectResult} from "../../postEffect/core/types";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";

const resourceIdMap = new WeakMap<GPUTexture, number>();
let nextResourceId = 0;

interface AToneMappingEffect {
    /**
     * [KO] 후처리 이펙트 인스턴스 여부
     * [EN] Whether the instance is a post-processing effect
     * @defaultValue true
     */
    isInstanceofPostEffect: boolean;
    /**
     * [KO] 대비(Contrast) 값입니다. (기본값: 1.0, 범위: 0.5 ~ 20.0)
     * [EN] Contrast value. (Default: 1.0, Range: 0.5 ~ 20.0)
     */
    contrast: number;
    /**
     * [KO] 밝기(Brightness) 오프셋 값입니다. (기본값: 0.0, 범위: -1.0 ~ 1.0)
     * [EN] Brightness offset value. (Default: 0.0, Range: -1.0 ~ 1.0)
     */
    brightness: number;
}

/**
 * [KO] 모든 톤 매핑 이펙트의 기반이 되며, HDR(`rgba16float`) 입력을 LDR(`rgba8unorm`) 렌더 타겟으로 변환하는 Out-of-Place 렌더 패스 추상 클래스입니다.
 * [EN] Abstract base class for all tone mapping effects, converting HDR (`rgba16float`) input to an LDR (`rgba8unorm`) render target via an Out-of-Place render pass.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category ToneMapping
 */
abstract class AToneMappingEffect extends RedGPUObject {
    #name: string;
    #renderShader: GPUShaderModule;
    #shaderInfo;
    #fragmentBindGroupLayout0: GPUBindGroupLayout;
    #fragmentBindGroupLayout1: GPUBindGroupLayout;
    #fragmentBindGroup0: GPUBindGroup;
    #fragmentBindGroup1: GPUBindGroup;
    #renderPipeline: GPURenderPipeline;
    #uniformBuffer: UniformBuffer;
    #uniformsInfo;
    #videoMemorySize: number = 0;
    #prevWidth: number = 0;
    #prevHeight: number = 0;
    #outputTexture: GPUTexture;
    #outputTextureView: GPUTextureView;
    #bindGroupCache0 = new Map<number, GPUBindGroup>();
    #colorAttachment: GPURenderPassColorAttachment;
    #renderPassDescriptor: GPURenderPassDescriptor;
    #destroyed: boolean = false;

    /**
     * [KO] AToneMappingEffect 인스턴스를 생성합니다. (하위 클래스 전용)
     * [EN] Creates an AToneMappingEffect instance. (Subclasses only)
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    protected constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#colorAttachment = {
            view: null,
            clearValue: {r: 0, g: 0, b: 0, a: 0},
            loadOp: GPU_LOAD_OP.CLEAR,
            storeOp: GPU_STORE_OP.STORE
        };
        this.#renderPassDescriptor = {
            label: 'AToneMappingEffect_RenderPass',
            colorAttachments: [this.#colorAttachment]
        };
    }

    /**
     * [KO] 톤매핑 이후 LDR(Low Dynamic Range) 공간에서 동작하는지 여부를 반환합니다.
     * [EN] Returns whether the effect operates in LDR (Low Dynamic Range) space.
     *
     * @defaultValue true
     * @returns
     * [KO] LDR 공간 동작 여부
     * [EN] Whether the effect operates in LDR space
     */
    get isLdr(): boolean {
        return true;
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
        return this.#videoMemorySize;
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
        return this.#uniformsInfo;
    }

    /**
     * [KO] 현재 패스에 할당된 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the output texture view allocated to the current pass.
     *
     * @returns
     * [KO] 출력 `GPUTextureView`
     * [EN] Output `GPUTextureView`
     */
    get outputTextureView(): GPUTextureView {
        return this.#outputTextureView;
    }

    /**
     * [KO] 톤 매핑 렌더 셰이더 모듈과 유니폼 버퍼를 생성하여 이펙트를 초기화합니다.
     * [EN] Initializes the effect by creating the tone mapping render shader module and uniform buffer.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param name -
     * [KO] 이펙트 식별 이름
     * [EN] Effect identifier name
     * @param code -
     * [KO] 프래그먼트 본문 WGSL 코드
     * [EN] Fragment body WGSL code
     * @param uniformStruct -
     * [KO] 유니폼 구조체 및 헬퍼 함수 WGSL 코드
     * [EN] Uniform struct and helper function WGSL code
     */
    init(redGPUContext: RedGPUContext, name: string, code: string, uniformStruct: string = '') {
        this.#name = `${name}_LDR`;
        this.#renderPassDescriptor.label = `${this.#name}_RenderPass`;
        const {resourceManager} = redGPUContext;

        const shaderCode = `
            @group(0) @binding(0) var sourceTexture: texture_2d<f32>;
            ${uniformStruct}
            @group(1) @binding(0) var<uniform> uniforms: Uniforms;

            @vertex
            fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> @builtin(position) vec4<f32> {
                let pos = array<vec2<f32>, 3>(
                    vec2<f32>(-1.0, -1.0),
                    vec2<f32>( 3.0, -1.0),
                    vec2<f32>(-1.0,  3.0)
                );
                return vec4<f32>(pos[vertexIndex], 0.0, 1.0);
            }

            @fragment
            fn fs_main(@builtin(position) fragPosition: vec4<f32>) -> @location(0) vec4<f32> {
                let index = vec2<u32>(fragPosition.xy);
                ${code}
            }
        `;

        this.#renderShader = resourceManager.createGPUShaderModule(this.#name, {code: shaderCode});
        this.#shaderInfo = resourceManager.wgslParser.parse(this.#name, shaderCode);
        this.#uniformsInfo = this.#shaderInfo.uniforms.uniforms;

        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength);
            this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, `${this.constructor.name}_UniformBuffer`);
            this.#videoMemorySize = this.#uniformBuffer.size;

            const {members} = this.#uniformsInfo;
            if (members) {
                for (const k in members) {
                    this.#uniformBuffer.writeOnlyBuffer(members[k], this[k]);
                }
            }
        }
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
        const memberInfo = this.#uniformsInfo?.members[key];
        if (memberInfo) {
            this.#uniformBuffer.writeOnlyBuffer(memberInfo, value);
        }
    }

    /**
     * [KO] HDR 입력 텍스처를 톤 매핑하여 LDR(`rgba8unorm`) 렌더 타겟에 기록하고 결과를 반환합니다.
     * [EN] Tone-maps the HDR input texture into an LDR (`rgba8unorm`) render target and returns the result.
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
     * [KO] 입력 HDR 소스 텍스처 정보
     * [EN] Input HDR source texture information
     * @returns
     * [KO] 톤 매핑된 LDR 렌더링 결과 (`IPostEffectResult`)
     * [EN] Tone-mapped LDR rendering result (`IPostEffectResult`)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: IPostEffectResult): IPostEffectResult {
        const {gpuDevice} = this;

        const result = view.postEffectManager.texturePool.allocResult(width, height, 'rgba8unorm', false);
        this.#outputTexture = result.texture;
        this.#outputTextureView = result.textureView;

        if (this.#prevWidth !== width || this.#prevHeight !== height) {
            this.#bindGroupCache0.clear();
            this.#prevWidth = width;
            this.#prevHeight = height;
        }

        if (!this.#renderPipeline) {
            this.#createPipeline(gpuDevice);
        }

        this.#updateBindGroups(sourceTextureInfo, gpuDevice);

        this.#colorAttachment.view = this.#outputTextureView;
        this.commandEncoderManager.addPostProcessRenderPass(
            this.#renderPassDescriptor,
            this.#executeRenderPass
        );

        return result;
    }

    /**
     * [KO] 캐시된 바인드 그룹 및 출력 텍스처 참조를 초기화합니다.
     * [EN] Clears cached bind groups and output texture references.
     */
    clear() {
        this.#outputTexture = null;
        this.#outputTextureView = null;
        this.#bindGroupCache0.clear();
        this.#fragmentBindGroup0 = null;
        this.#fragmentBindGroup1 = null;
    }

    /**
     * [KO] 이펙트의 유니폼 버퍼와 캐시 리소스를 파기합니다.
     * [EN] Destroys the effect's uniform buffer and cached resources.
     */
    destroy() {
        if (this.#destroyed) return;
        this.#destroyed = true;
        this.clear();
        this.#uniformBuffer?.destroy();
        this.#uniformBuffer = null;
        this.#uniformsInfo = null;
        this.#shaderInfo = null;
        this.#renderShader = null;
        this.#renderPipeline = null;
        this.#fragmentBindGroupLayout0 = null;
        this.#fragmentBindGroupLayout1 = null;
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

    #executeRenderPass = (renderPassEncoder: GPURenderPassEncoder): void => {
        renderPassEncoder.setPipeline(this.#renderPipeline);
        renderPassEncoder.setBindGroup(0, this.#fragmentBindGroup0);
        renderPassEncoder.setBindGroup(1, this.#fragmentBindGroup1);
        renderPassEncoder.draw(3, 1, 0, 0);
    };

    #createPipeline(gpuDevice: GPUDevice) {
        const {resourceManager} = this;
        const layout0Name = `${this.#name}_FRAGMENT_BGL_0`;
        const layout1Name = `${this.#name}_FRAGMENT_BGL_1`;

        this.#fragmentBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(layout0Name) ||
            resourceManager.createBindGroupLayout(layout0Name, getFragmentBindGroupLayoutDescriptorFromShaderInfo(this.#shaderInfo, 0));

        this.#fragmentBindGroupLayout1 = resourceManager.getGPUBindGroupLayout(layout1Name) ||
            resourceManager.createBindGroupLayout(layout1Name, getFragmentBindGroupLayoutDescriptorFromShaderInfo(this.#shaderInfo, 1));

        this.#renderPipeline = gpuDevice.createRenderPipeline({
            label: `${this.#name}_RENDER_PIPELINE`,
            layout: gpuDevice.createPipelineLayout({
                label: `${this.#name}_PIPELINE_LAYOUT`,
                bindGroupLayouts: [
                    this.#fragmentBindGroupLayout0,
                    this.#fragmentBindGroupLayout1
                ]
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
                targets: [{format: 'rgba8unorm'}]
            }
        });
    }

    #updateBindGroups(sourceTextureInfo: IPostEffectResult, gpuDevice: GPUDevice) {
        const resourceId = this.#getResourceId(sourceTextureInfo.texture);
        const cachedBG0 = this.#bindGroupCache0.get(resourceId);
        if (cachedBG0) {
            this.#fragmentBindGroup0 = cachedBG0;
        } else {
            this.#fragmentBindGroup0 = gpuDevice.createBindGroup({
                label: `${this.#name}_FRAGMENT_BG_0`,
                layout: this.#fragmentBindGroupLayout0,
                entries: [{
                    binding: 0,
                    resource: sourceTextureInfo.textureView
                }]
            });
            this.#bindGroupCache0.set(resourceId, this.#fragmentBindGroup0);
        }

        if (!this.#fragmentBindGroup1) {
            this.#fragmentBindGroup1 = gpuDevice.createBindGroup({
                label: `${this.#name}_FRAGMENT_BG_1`,
                layout: this.#fragmentBindGroupLayout1,
                entries: [{
                    binding: 0,
                    resource: {
                        buffer: this.#uniformBuffer.gpuBuffer,
                        offset: 0,
                        size: this.#uniformBuffer.size
                    }
                }]
            });
        }
    }
}

Object.defineProperty(AToneMappingEffect.prototype, 'isInstanceofPostEffect', {
    value: true,
    writable: false
});
defineNumber(AToneMappingEffect, [
    {key: 'contrast', value: 1.0, min: 0.5, max: 20.0},
    {key: 'brightness', value: 0.0, min: -1.0, max: 1.0}
]);
Object.freeze(AToneMappingEffect);
export default AToneMappingEffect;
