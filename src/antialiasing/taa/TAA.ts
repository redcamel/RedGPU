import {mat4} from "gl-matrix";
import AntialiasingManager from "../AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import {keepLog} from "../../utils";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import postEffectSystemUniform from "../../postEffect/core/postEffectSystemUniform.wgsl"
import computeCode from "./wgsl/computeCode.wgsl"
import uniformStructCode from "./wgsl/uniformStructCode.wgsl"

/**
 * [KO] TAA(Temporal Anti-Aliasing) 후처리 이펙트입니다.
 * [EN] TAA (Temporal Anti-Aliasing) post-processing effect.
 *
 * [KO] 이전 프레임들의 정보를 누적하여 현재 프레임의 계단 현상을 제거하는 고품질 안티앨리어싱 기법입니다.
 * [EN] A high-quality anti-aliasing technique that removes aliasing in the current frame by accumulating information from previous frames.
 *
 * ::: warning
 * [KO] 이 클래스는 AntialiasingManager에 의해 관리됩니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is managed by AntialiasingManager.<br/>Do not create an instance directly.
 * :::
 *
 * * ### Example
 * ```typescript
 * // AntialiasingManager를 통해 TAA 설정 (Configure TAA via AntialiasingManager)
 * redGPUContext.antialiasingManager.useTAA = true;
 * ```
 *
 * @category PostEffect
 */
class TAA {
    #redGPUContext: RedGPUContext
    #antialiasingManager: AntialiasingManager
    #computeShaderMSAA: GPUShaderModule
    #computeShaderNonMSAA: GPUShaderModule
    #computeBindGroupLayout0: GPUBindGroupLayout
    #computeBindGroupLayout1: GPUBindGroupLayout
    #computePipeline: GPUComputePipeline
    #uniformBuffer: UniformBuffer
    #uniformsInfo: any
    #systemUuniformsInfo: any
    #storageInfo: any
    #name: string
    #SHADER_INFO_MSAA: any
    #SHADER_INFO_NON_MSAA: any
    #prevInfo: any
    #cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map()
    #cachedPipelineLayouts: Map<string, GPUPipelineLayout> = new Map()
    #cachedComputePipelines: Map<string, GPUComputePipeline> = new Map()
    #currentMSAAState: boolean | null = null
    // 스왑 버퍼 구조로 변경
    #currentFrameTexture: GPUTexture
    #currentFrameTextureView: GPUTextureView
    #historyTexture: GPUTexture
    #historyTextureView: GPUTextureView
    #frameBufferBindGroup0: GPUBindGroup
    #frameBufferBindGroup1: GPUBindGroup
    #WORK_SIZE_X = 8
    #WORK_SIZE_Y = 8
    #WORK_SIZE_Z = 1
    #previousSourceTextureReferences: GPUTextureView[] = [];
    #videoMemorySize: number = 0
    #frameIndex: number = 0
    #jitterStrength: number = 0.5;
    #prevMSAA: Boolean
    #prevMSAAID: string
    #prevJitterOffset: [number, number] = [0, 0]
    #prevNoneJitterProjectionCameraMatrix: mat4 = mat4.create();

    /**
     * [KO] TAA 인스턴스를 생성합니다.
     * [EN] Creates a TAA instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext
        this.#antialiasingManager = redGPUContext.antialiasingManager
        const shaderCode = this.#createTAAShaderCode();
        this.#init(
            redGPUContext,
            'POST_EFFECT_TAA',
            {
                msaa: shaderCode.msaa,
                nonMsaa: shaderCode.nonMsaa
            }
        );
        this.jitterStrength = this.#jitterStrength;
    }

    /**
     * [KO] 이전 프레임의 지터링 없는 프로젝션 카메라 행렬을 반환합니다.
     * [EN] Returns the non-jittered projection camera matrix of the previous frame.
     *
     * @returns
     * [KO] 4x4 행렬
     * [EN] 4x4 matrix
     */
    get prevNoneJitterProjectionCameraMatrix(): mat4 {
        return this.#prevNoneJitterProjectionCameraMatrix;
    }

    /**
     * [KO] 프레임 인덱스를 반환합니다.
     * [EN] Returns the frame index.
     *
     * @returns
     * [KO] 현재 프레임 인덱스
     * [EN] Current frame index
     */
    get frameIndex(): number {
        return this.#frameIndex;
    }

    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     *
     * @returns
     * [KO] 메모리 사용량 (바이트)
     * [EN] Memory usage (bytes)
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

    /**
     * [KO] 지터링 강도를 반환합니다.
     * [EN] Returns the jitter strength.
     *
     * @returns
     * [KO] 지터링 강도
     * [EN] Jitter strength
     */
    get jitterStrength(): number {
        return this.#jitterStrength;
    }

    /**
     * [KO] 지터링 강도를 설정합니다.
     * [EN] Sets the jitter strength.
     *
     * @param value -
     * [KO] 지터링 강도 (0.0 ~ 1.0)
     * [EN] Jitter strength (0.0 ~ 1.0)
     */
    set jitterStrength(value: number) {
        // validateNumberRange(value, 0.0, 1.0);
        this.#jitterStrength = value;
    }


    /**
     * [KO] TAA 이펙트를 렌더링합니다.
     * [EN] Renders the TAA effect.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 너비
     * [EN] Width
     * @param height -
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture info
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {

        const sourceTextureView = sourceTextureInfo.textureView
        const sourceTexture = sourceTextureInfo.texture;
        const {gpuDevice, antialiasingManager} = this.#redGPUContext
        const {useMSAA, msaaID} = antialiasingManager
        this.#frameIndex++;
        if (this.#uniformBuffer) {
            this.updateUniform('frameIndex', this.#frameIndex);
            this.updateUniform('currJitterOffset', view.jitterOffset);
            this.updateUniform('prevJitterOffset', this.#prevJitterOffset);
            mat4.copy(this.#prevNoneJitterProjectionCameraMatrix, view.noneJitterProjectionCameraMatrix)

            this.#prevJitterOffset = [...view.jitterOffset]
        }

        const dimensionsChanged = this.#createRenderTexture(view)
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
        const sourceTextureChanged = this.#detectSourceTextureChange([sourceTextureView]);
        if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
            this.#createFrameBufferBindGroups(view, [sourceTextureView], useMSAA, this.#redGPUContext, gpuDevice);
        }
        this.#execute(gpuDevice, width, height);
        {
            const commentEncode_compute = gpuDevice.createCommandEncoder({
                label: 'TAA_CopyTexture_CommandEncoder_compute'
            })
            commentEncode_compute.copyTextureToTexture(
                {texture: this.#currentFrameTexture},
                {texture: this.#historyTexture},
                [width, height, 1]
            );
            gpuDevice.queue.submit([commentEncode_compute.finish()]);
        }
        if (this.#frameIndex <= 20 || this.#frameIndex % 60 === 0) {
            console.log(`TAA Frame ${this.#frameIndex}: BuffersSwapped, JitterStrength=${this.#jitterStrength}`);
        }
        this.#prevMSAA = useMSAA;
        this.#prevMSAAID = msaaID;

        return {
            texture: this.#currentFrameTexture,
            textureView: this.#currentFrameTextureView
        }
    }

    /**
     * [KO] TAA 리소스를 초기화합니다.
     * [EN] Clears TAA resources.
     */
    clear() {
        if (this.#historyTexture) {
            this.#historyTexture.destroy();
            this.#historyTexture = null;
            this.#historyTextureView = null;
        }
        if (this.#currentFrameTexture) {
            this.#currentFrameTexture.destroy();
            this.#currentFrameTexture = null;
            this.#currentFrameTextureView = null;
        }
        this.#cachedBindGroupLayouts.clear();
        this.#cachedPipelineLayouts.clear();
        this.#cachedComputePipelines.clear();
        this.#currentMSAAState = null;
    }

    /**
     * [KO] 유니폼 값을 업데이트합니다.
     * [EN] Updates a uniform value.
     *
     * @param key -
     * [KO] 유니폼 키
     * [EN] Uniform key
     * @param value -
     * [KO] 유니폼 값
     * [EN] Uniform value
     */
    updateUniform(key: string, value: number | number[] | boolean) {
        this.#uniformBuffer.writeOnlyBuffer(this.#uniformsInfo.members[key], value)
    }


    #createTAAShaderCode() {
        const createCode = (useMSAA: boolean) => {
            return `
				${uniformStructCode}
				
				@group(0) @binding(0) var sourceTexture : texture_2d<f32>;
				@group(0) @binding(1) var historyTexture : texture_2d<f32>;
				@group(0) @binding(2) var motionVectorTexture : texture_2d<f32>;
				@group(0) @binding(3) var taaTextureSampler : sampler;
				@group(0) @binding(4) var depthTexture : texture_depth_2d;
				@group(0) @binding(5) var historyDepthTexture : texture_depth_2d;
				
				@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;
				${postEffectSystemUniform}
				@group(1) @binding(2) var<uniform> uniforms: Uniforms;
				
				@compute @workgroup_size(${this.#WORK_SIZE_X}, ${this.#WORK_SIZE_Y}, ${this.#WORK_SIZE_Z})
				fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
					${computeCode}
				}
			`;
        };
        return {
            msaa: createCode(true),
            nonMsaa: createCode(false)
        };
    }

    #init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string,
        nonMsaa: string
    }) {
        this.#name = name
        const {resourceManager} = redGPUContext
        this.#computeShaderMSAA = resourceManager.createGPUShaderModule(
            `${name}_MSAA`,
            {code: computeCodes.msaa}
        )
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(
            `${name}_NonMSAA`,
            {code: computeCodes.nonMsaa}
        )
        this.#SHADER_INFO_MSAA = parseWGSL(computeCodes.msaa, 'TAA_MSAA')
        this.#SHADER_INFO_NON_MSAA = parseWGSL(computeCodes.nonMsaa, 'TAA_NON_MSAA')
        const STORAGE_STRUCT = this.#SHADER_INFO_MSAA.storage;
        const UNIFORM_STRUCT = this.#SHADER_INFO_MSAA.uniforms;
        this.#storageInfo = STORAGE_STRUCT
        this.#uniformsInfo = UNIFORM_STRUCT.uniforms
        this.#systemUuniformsInfo = UNIFORM_STRUCT.systemUniforms
        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength)
            this.#uniformBuffer = new UniformBuffer(
                redGPUContext,
                uniformData,
                `TAA_UniformBuffer`,
            )
        }
    }

    #execute(gpuDevice: GPUDevice, width: number, height: number) {
        const commentEncode_compute = gpuDevice.createCommandEncoder({
            label: 'TAA_Execute_CommandEncoder_compute'
        })
        const computePassEncoder = commentEncode_compute.beginComputePass()
        computePassEncoder.setPipeline(this.#computePipeline)
        computePassEncoder.setBindGroup(0, this.#frameBufferBindGroup0)
        computePassEncoder.setBindGroup(1, this.#frameBufferBindGroup1)
        computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.#WORK_SIZE_X), Math.ceil(height / this.#WORK_SIZE_Y));
        computePassEncoder.end();
        gpuDevice.queue.submit([commentEncode_compute.finish()]);
    }

    #createFrameBufferBindGroups(view: View3D, sourceTextureView: GPUTextureView[], useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
        const computeBindGroupEntries0: GPUBindGroupEntry[] = []
        const computeBindGroupEntries1: GPUBindGroupEntry[] = []
        computeBindGroupEntries0.push({
            binding: 0,
            resource: sourceTextureView[0],
        });
        computeBindGroupEntries0.push({
            binding: 1,
            resource: this.#historyTextureView,
        });
        computeBindGroupEntries0.push({
            binding: 4,
            resource: view.viewRenderTextureManager.depthTextureView,
        });
        computeBindGroupEntries0.push({
            binding: 5,
            resource: view.viewRenderTextureManager.prevDepthTextureView,
        });
        // 모션벡터 텍스처 추가
        const motionVectorTextureView = useMSAA ? view.viewRenderTextureManager.gBufferMotionVectorResolveTextureView : view.viewRenderTextureManager.gBufferMotionVectorTextureView;
        computeBindGroupEntries0.push({
            binding: 2,
            resource: motionVectorTextureView,
        });
        computeBindGroupEntries0.push({
            binding: 3,
            resource: view.redGPUContext.resourceManager.basicSampler.gpuSampler,
        });
        computeBindGroupEntries1.push({
            binding: 0,
            resource: this.#currentFrameTextureView,
        });
        if (this.#systemUuniformsInfo) {
            computeBindGroupEntries1.push({
                binding: this.#systemUuniformsInfo.binding,
                resource: {
                    buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: view.postEffectManager.postEffectSystemUniformBuffer.size
                }
            });
        }
        if (this.#uniformBuffer && this.#uniformsInfo) {
            computeBindGroupEntries1.push({
                binding: this.#uniformsInfo.binding,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                },
            });
        }
        this.#createBindGroups(computeBindGroupEntries0, computeBindGroupEntries1, useMSAA, redGPUContext, gpuDevice);
        this.#createComputePipeline(useMSAA, redGPUContext, gpuDevice);
    }

    #createBindGroups(entries0: GPUBindGroupEntry[], entries1: GPUBindGroupEntry[], useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
        const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
        const layoutKey0 = `${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`;
        const layoutKey1 = `${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`;
        if (!this.#cachedBindGroupLayouts.has(layoutKey0)) {
            const layout0 = redGPUContext.resourceManager.getGPUBindGroupLayout(layoutKey0) ||
                redGPUContext.resourceManager.createBindGroupLayout(layoutKey0,
                    getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA)
                );
            this.#cachedBindGroupLayouts.set(layoutKey0, layout0);
        }
        if (!this.#cachedBindGroupLayouts.has(layoutKey1)) {
            const layout1 = redGPUContext.resourceManager.getGPUBindGroupLayout(layoutKey1) ||
                redGPUContext.resourceManager.createBindGroupLayout(layoutKey1,
                    getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA)
                );
            this.#cachedBindGroupLayouts.set(layoutKey1, layout1);
        }
        this.#computeBindGroupLayout0 = this.#cachedBindGroupLayouts.get(layoutKey0)!;
        this.#computeBindGroupLayout1 = this.#cachedBindGroupLayouts.get(layoutKey1)!;
        this.#frameBufferBindGroup0 = gpuDevice.createBindGroup({
            label: `${this.#name}_FRAME_BIND_GROUP_0_USE_MSAA_${useMSAA}`,
            layout: this.#computeBindGroupLayout0,
            entries: entries0
        });
        this.#frameBufferBindGroup1 = gpuDevice.createBindGroup({
            label: `${this.#name}_FRAME_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
            layout: this.#computeBindGroupLayout1,
            entries: entries1
        });
    }

    #createComputePipeline(useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
        const pipelineKey = `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`;
        const pipelineLayoutKey = `${this.#name}_PIPELINE_LAYOUT_USE_MSAA_${useMSAA}`;
        if (this.#currentMSAAState !== useMSAA || !this.#cachedComputePipelines.has(pipelineKey)) {
            if (!this.#cachedPipelineLayouts.has(pipelineLayoutKey)) {
                const pipelineLayout = gpuDevice.createPipelineLayout({
                    label: `${this.#name}_PIPELINE_LAYOUT_USE_MSAA_${useMSAA}`,
                    bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1]
                });
                this.#cachedPipelineLayouts.set(pipelineLayoutKey, pipelineLayout);
            }
            const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;
            const computePipeline = gpuDevice.createComputePipeline({
                label: pipelineKey,
                layout: this.#cachedPipelineLayouts.get(pipelineLayoutKey)!,
                compute: {module: currentShader, entryPoint: 'main'}
            });
            this.#cachedComputePipelines.set(pipelineKey, computePipeline);
            this.#currentMSAAState = useMSAA;
        }
        this.#computePipeline = this.#cachedComputePipelines.get(pipelineKey)!;
    }

    #createRenderTexture(view: View3D): boolean {
        const {redGPUContext, viewRenderTextureManager, name} = view
        const {gBufferColorTexture} = viewRenderTextureManager
        const {resourceManager} = redGPUContext
        const {width, height} = gBufferColorTexture
        const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height ||
            !this.#currentFrameTexture || !this.#historyTexture || !this.#currentFrameTexture;
        if (needChange) {
            keepLog(`TAA 텍스처 재생성: ${width}x${height}, 이전 프레임 히스토리 리셋`);
            this.#frameIndex = 0;
            this.clear();
            console.log(`TAA 프레임 텍스처 초기화 완료: CurrentFrame + PreviousFrame`);
            this.#currentFrameTexture = resourceManager.createManagedTexture({
                size: {width, height},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.STORAGE_BINDING |
                    GPUTextureUsage.COPY_SRC | GPUTextureUsage.RENDER_ATTACHMENT,
                label: `${name}_${this.#name}_currentFrame_${width}x${height}`
            });
            this.#currentFrameTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#currentFrameTexture, {
                dimension: '2d',
                format: 'rgba16float',
                label: `${this.#name}_currentFrame_View`
            });
            this.#historyTexture = resourceManager.createManagedTexture({
                size: {width, height},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.STORAGE_BINDING |
                    GPUTextureUsage.COPY_DST,
                label: `${name}_${this.#name}_previousFrame_${width}x${height}`
            });
            this.#historyTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#historyTexture, {
                dimension: '2d',
                format: 'rgba16float',
                label: `${this.#name}_previousFrame`
            });
            console.log('TAA 텍스처 생성 완료:', {
                previousFrame: {
                    width,
                    height,
                    format: this.#historyTexture.format,
                    usage: this.#historyTexture.usage
                },
                currentFrameTexture: {
                    width: this.#currentFrameTexture.width,
                    height: this.#currentFrameTexture.height,
                    format: this.#currentFrameTexture.format,
                    usage: this.#currentFrameTexture.usage
                }
            });
        }
        this.#prevInfo = {
            width,
            height,
        }
        this.#calcVideoMemory()
        return needChange
    }

    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        if (this.#currentFrameTexture) {
            this.#videoMemorySize += calculateTextureByteSize(this.#currentFrameTexture);
        }
        if (this.#historyTexture) {
            this.#videoMemorySize += calculateTextureByteSize(this.#historyTexture);
        }
    }

    #detectSourceTextureChange(sourceTextureView: GPUTextureView[]): boolean {
        if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureView.length) {
            this.#previousSourceTextureReferences = [...sourceTextureView];
            return true;
        }
        for (let i = 0; i < sourceTextureView.length; i++) {
            if (this.#previousSourceTextureReferences[i] !== sourceTextureView[i]) {
                this.#previousSourceTextureReferences = [...sourceTextureView];
                return true;
            }
        }
        return false;
    }
}

Object.freeze(TAA);
export default TAA;
