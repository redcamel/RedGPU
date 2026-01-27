import AntialiasingManager from "../../antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";

export type ASinglePassPostEffectResult = {
    texture: GPUTexture
    textureView: GPUTextureView
}

/**
 * [KO] 단일 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for single-pass post-processing effects.
 *
 * [KO] 한 번의 Compute 패스로 동작하는 후처리 이펙트의 기반 클래스입니다.
 * [EN] Base class for post-processing effects that operate in a single compute pass.
 *
 * @category Core
 */
abstract class ASinglePassPostEffect {
    // compute 셰이더 및 파이프라인 관련
    #computeShaderMSAA: GPUShaderModule
    #computeShaderNonMSAA: GPUShaderModule
    #computeBindGroupLayout0: GPUBindGroupLayout
    #computeBindGroupLayout1: GPUBindGroupLayout
    #computeBindGroup0List_swap0: GPUBindGroup
    #computeBindGroup0List_swap1: GPUBindGroup
    #computeBindGroup1: GPUBindGroup
    #computeBindGroupEntries0_swap0: GPUBindGroupEntry[]
    #computeBindGroupEntries0_swap1: GPUBindGroupEntry[]
    #computeBindGroupEntries1: GPUBindGroupEntry[]
    #computePipeline: GPUComputePipeline
    // uniform 및 구조 정보
    #uniformBuffer: UniformBuffer
    #uniformsInfo
    #systemUuniformsInfo
    #storageInfo
    #name
    #SHADER_INFO_MSAA
    #SHADER_INFO_NON_MSAA
    #prevInfo
    // 출력 텍스처
    #outputTexture: GPUTexture
    #outputTextureView: GPUTextureView
    #WORK_SIZE_X = 16
    #WORK_SIZE_Y = 16
    #WORK_SIZE_Z = 1
    #useDepthTexture: boolean = false
    #useGBufferNormalTexture: boolean = false
    #redGPUContext: RedGPUContext
    #antialiasingManager: AntialiasingManager
    #previousSourceTextureReferences: ASinglePassPostEffectResult[] = [];
    #videoMemorySize: number = 0
    #prevMSAA: Boolean
    #prevMSAAID: string

    /**
     * [KO] ASinglePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASinglePassPostEffect instance.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     */
    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext
        this.#antialiasingManager = redGPUContext.antialiasingManager
    }

    /**
     * [KO] G-Buffer Normal 텍스처 사용 여부를 반환합니다.
     * [EN] Returns whether G-Buffer Normal texture is used.
     */
    get useGBufferNormalTexture(): boolean {
        return this.#useGBufferNormalTexture;
    }

    /**
     * [KO] G-Buffer Normal 텍스처 사용 여부를 설정합니다.
     * [EN] Sets whether G-Buffer Normal texture is used.
     */
    set useGBufferNormalTexture(value: boolean) {
        this.#useGBufferNormalTexture = value;
    }

    /**
     * [KO] 비디오 메모리 사용량을 반환합니다.
     * [EN] Returns the video memory usage.
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

    /**
     * [KO] 깊이 텍스처 사용 여부를 반환합니다.
     * [EN] Returns whether depth texture is used.
     */
    get useDepthTexture(): boolean {
        return this.#useDepthTexture;
    }

    /**
     * [KO] 깊이 텍스처 사용 여부를 설정합니다.
     * [EN] Sets whether depth texture is used.
     */
    set useDepthTexture(value: boolean) {
        this.#useDepthTexture = value;
    }

    /**
     * [KO] RedGPU 컨텍스트를 반환합니다.
     * [EN] Returns the RedGPU context.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] 스토리지 정보를 반환합니다.
     * [EN] Returns storage information.
     */
    get storageInfo() {
        return this.#storageInfo
    }

    /**
     * [KO] 셰이더 정보를 반환합니다. (MSAA 상태에 따라 다름)
     * [EN] Returns shader information. (Depends on MSAA state)
     */
    get shaderInfo() {
        // keepLog(this)
        const useMSAA = this.#antialiasingManager.useMSAA;
        return useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
    }

    /**
     * [KO] 유니폼 버퍼를 반환합니다.
     * [EN] Returns the uniform buffer.
     */
    get uniformBuffer(): UniformBuffer {
        return this.#uniformBuffer;
    }

    /**
     * [KO] 유니폼 정보를 반환합니다.
     * [EN] Returns uniform information.
     */
    get uniformsInfo() {
        return this.#uniformsInfo
    }

    /**
     * [KO] 시스템 유니폼 정보를 반환합니다.
     * [EN] Returns system uniform information.
     */
    get systemUuniformsInfo() {
        return this.#systemUuniformsInfo
    }

    /**
     * [KO] Workgroup Size X
     * [EN] Workgroup Size X
     */
    get WORK_SIZE_X(): number {
        return this.#WORK_SIZE_X;
    }

    set WORK_SIZE_X(value: number) {
        this.#WORK_SIZE_X = value;
    }

    /**
     * [KO] Workgroup Size Y
     * [EN] Workgroup Size Y
     */
    get WORK_SIZE_Y(): number {
        return this.#WORK_SIZE_Y;
    }

    set WORK_SIZE_Y(value: number) {
        this.#WORK_SIZE_Y = value;
    }

    /**
     * [KO] Workgroup Size Z
     * [EN] Workgroup Size Z
     */
    get WORK_SIZE_Z(): number {
        return this.#WORK_SIZE_Z;
    }

    set WORK_SIZE_Z(value: number) {
        this.#WORK_SIZE_Z = value;
    }

    /**
     * [KO] 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the output texture view.
     */
    get outputTextureView(): GPUTextureView {
        return this.#outputTextureView;
    }

    /**
     * [KO] 이펙트를 초기화(해제)합니다.
     * [EN] Clears the effect.
     */
    clear() {
        if (this.#outputTexture) {
            this.#outputTexture.destroy();
            this.#outputTexture = null;
            this.#outputTextureView = null;
        }
    }

    /**
     * [KO] 이펙트를 초기화합니다.
     * [EN] Initializes the effect.
     *
     * @param redGPUContext
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param name
     * [KO] 이펙트 이름
     * [EN] Effect name
     * @param computeCodes
     * [KO] MSAA 및 Non-MSAA용 컴퓨트 셰이더 코드
     * [EN] Compute shader codes for MSAA and Non-MSAA
     * @param bindGroupLayout
     * [KO] 바인드 그룹 레이아웃 (선택)
     * [EN] Bind group layout (optional)
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string,
        nonMsaa: string
    }, bindGroupLayout?: GPUBindGroupLayout) {
        this.#name = name
        const {resourceManager,} = redGPUContext
        // MSAA 셰이더 생성
        this.#computeShaderMSAA = resourceManager.createGPUShaderModule(
            `${name}_MSAA`,
            {code: computeCodes.msaa}
        )
        // Non-MSAA 셰이더 생성
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(
            `${name}_NonMSAA`,
            {code: computeCodes.nonMsaa}
        )
        // SHADER_INFO 파싱
        this.#SHADER_INFO_MSAA = parseWGSL(computeCodes.msaa)
        this.#SHADER_INFO_NON_MSAA = parseWGSL(computeCodes.nonMsaa)
        // MSAA 정보 저장
        const STORAGE_STRUCT = this.#SHADER_INFO_MSAA.storage;
        const UNIFORM_STRUCT = this.#SHADER_INFO_MSAA.uniforms;
        this.#storageInfo = STORAGE_STRUCT
        this.#uniformsInfo = UNIFORM_STRUCT.uniforms
        this.#systemUuniformsInfo = UNIFORM_STRUCT.systemUniforms
        // UniformBuffer는 구조가 동일하므로 하나만 생성 (Non-MSAA 기준)
        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength)
            this.#uniformBuffer = new UniformBuffer(
                redGPUContext,
                uniformData,
                `${this.constructor.name}_UniformBuffer`,
            )
        }
    }

    /**
     * [KO] 이펙트를 실행합니다.
     * [EN] Executes the effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param gpuDevice
     * [KO] GPU 디바이스
     * [EN] GPU Device
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     */
    execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number) {
        const commentEncode_compute = gpuDevice.createCommandEncoder({
            label: 'ASinglePassPostEffect_Execute_CommandEncoder'
        })
        const computePassEncoder = commentEncode_compute.beginComputePass()
        computePassEncoder.setPipeline(this.#computePipeline)
        computePassEncoder.setBindGroup(0, view.renderViewStateData.swapBufferIndex ? this.#computeBindGroup0List_swap1 : this.#computeBindGroup0List_swap0)
        computePassEncoder.setBindGroup(1, this.#computeBindGroup1)
        computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
        computePassEncoder.end();
        gpuDevice.queue.submit([commentEncode_compute.finish()]);
    }

    /**
     * [KO] 이펙트를 렌더링합니다.
     * [EN] Renders the effect.
     *
     * @param view
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width
     * [KO] 너비
     * [EN] Width
     * @param height
     * [KO] 높이
     * [EN] Height
     * @param sourceTextureInfo
     * [KO] 소스 텍스처 정보 리스트
     * [EN] Source texture info list
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: ASinglePassPostEffectResult[]): ASinglePassPostEffectResult {
        const {gpuDevice, antialiasingManager} = this.#redGPUContext
        const {useMSAA, msaaID} = antialiasingManager
        const dimensionsChanged = this.#createRenderTexture(view)
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
        // 소스 텍스처 변경 감지 - 첫 번째 요소만 사용
        const sourceTextureChanged = this.#detectSourceTextureChange(sourceTextureInfo);
        const targetOutputView = this.outputTextureView
        const {redGPUContext} = view
        if (dimensionsChanged || msaaChanged || sourceTextureChanged) {
            this.#createBindGroups(view, sourceTextureInfo, targetOutputView, useMSAA, redGPUContext, gpuDevice);
        }
        this.update(performance.now())
        this.execute(view, gpuDevice, width, height)
        this.#prevMSAA = useMSAA;
        this.#prevMSAAID = msaaID;
        return {
            texture: this.#outputTexture,
            textureView: targetOutputView
        }
    }

    /**
     * [KO] 이펙트 상태를 업데이트합니다.
     * [EN] Updates the effect state.
     *
     * @param deltaTime
     * [KO] 델타 타임
     * [EN] Delta time
     */
    update(deltaTime: number) {
    }

    /**
     * [KO] 유니폼 값을 업데이트합니다.
     * [EN] Updates a uniform value.
     *
     * @param key
     * [KO] 유니폼 키
     * [EN] Uniform key
     * @param value
     * [KO] 유니폼 값
     * [EN] Uniform value
     */
    updateUniform(key: string, value: number | number[] | boolean) {
        this.uniformBuffer.writeOnlyBuffer(this.uniformsInfo
            .members[key], value)
    }

    #createBindGroups(view: View3D, sourceTextureInfoList: ASinglePassPostEffectResult[], targetOutputView: GPUTextureView, useMSAA: boolean, redGPUContext: RedGPUContext, gpuDevice: GPUDevice) {
        const currentStorageInfo = this.storageInfo;
        const currentUniformsInfo = this.uniformsInfo
        const currentSystemUniformsInfo = this.systemUuniformsInfo;
        this.#computeBindGroupEntries0_swap0 = []
        this.#computeBindGroupEntries0_swap1 = []
        this.#computeBindGroupEntries1 = []
        // Group 0: source textures (outputTexture 제외)
        for (const k in currentStorageInfo) {
            const info = currentStorageInfo[k]
            const {binding, name} = info
            if (name !== 'outputTexture') {
                this.#computeBindGroupEntries0_swap0.push({
                    binding: binding,
                    resource: sourceTextureInfoList[binding].textureView,
                });
                this.#computeBindGroupEntries0_swap1.push({
                    binding: binding,
                    resource: sourceTextureInfoList[binding].textureView,
                });
            }
        }
        // Group 1: output texture
        this.#computeBindGroupEntries1.push({
            binding: 0,
            resource: targetOutputView,
        });
        // Group 0에 추가 리소스들 (depth, sampler, uniform)
        this.shaderInfo.textures.forEach(texture => {
            const {name, binding} = texture
            if (name === "depthTexture") {
                this.#computeBindGroupEntries0_swap0.push({
                    binding: binding,
                    resource: view.viewRenderTextureManager.depthTextureView
                })
                this.#computeBindGroupEntries0_swap1.push({
                    binding: binding,
                    resource: view.viewRenderTextureManager.prevDepthTextureView
                })
            }
            if (name === "gBufferNormalTexture") {
                this.#computeBindGroupEntries0_swap0.push({
                    binding: binding,
                    resource: view.redGPUContext.antialiasingManager.useMSAA ? view.viewRenderTextureManager.gBufferNormalResolveTextureView : view.viewRenderTextureManager.gBufferNormalTextureView
                })
                this.#computeBindGroupEntries0_swap1.push({
                    binding: binding,
                    resource: view.redGPUContext.antialiasingManager.useMSAA ? view.viewRenderTextureManager.gBufferNormalResolveTextureView : view.viewRenderTextureManager.gBufferNormalTextureView
                })
            }
        });
        // uniform buffer는 마지막에 추가
        if (currentSystemUniformsInfo) {
            this.#computeBindGroupEntries1.push({
                binding: currentSystemUniformsInfo.binding,
                resource: {
                    buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: view.postEffectManager.postEffectSystemUniformBuffer.size
                }
            });
        }
        if (this.#uniformBuffer && currentUniformsInfo) {
            this.#computeBindGroupEntries1.push({
                binding: currentUniformsInfo.binding,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                },
            });
        }
        const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
        const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;
        this.#computeBindGroupLayout0 = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`) ||
            redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`,
                getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA)
            );
        this.#computeBindGroupLayout1 = redGPUContext.resourceManager.getGPUBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`) ||
            redGPUContext.resourceManager.createBindGroupLayout(`${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`,
                getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA)
            );
        this.#computeBindGroup0List_swap0 =
            gpuDevice.createBindGroup({
                label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP0`,
                layout: this.#computeBindGroupLayout0,
                entries: this.#computeBindGroupEntries0_swap0
            })
        this.#computeBindGroup0List_swap1 = gpuDevice.createBindGroup({
            label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP0`,
            layout: this.#computeBindGroupLayout0,
            entries: this.#computeBindGroupEntries0_swap1
        })
        this.#computeBindGroup1 = gpuDevice.createBindGroup({
            label: `${this.#name}_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
            layout: this.#computeBindGroupLayout1,
            entries: this.#computeBindGroupEntries1
        });
        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1]}),
            compute: {module: currentShader, entryPoint: 'main',}
        });
        // 소스 텍스처 참조 저장
        this.#saveCurrentSourceTextureReferences(sourceTextureInfoList);
    }

    #calcVideoMemory() {
        this.#videoMemorySize = 0;
        if (this.#outputTexture) {
            this.#videoMemorySize = calculateTextureByteSize(this.#outputTexture);
        }
    }

    #detectSourceTextureChange(sourceTextureInfoList: ASinglePassPostEffectResult[]): boolean {
        if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureInfoList.length) {
            return true;
        }
        for (let i = 0; i < sourceTextureInfoList.length; i++) {
            if (this.#previousSourceTextureReferences[i].textureView !== sourceTextureInfoList[i].textureView) {
                return true;
            }
        }
        return false;
    }

    #saveCurrentSourceTextureReferences(sourceTextureInfoList: ASinglePassPostEffectResult[]) {
        this.#previousSourceTextureReferences = [...sourceTextureInfoList];
    }

    #createRenderTexture(view: View3D): boolean {
        const {redGPUContext, viewRenderTextureManager, name} = view
        const {gBufferColorTexture} = viewRenderTextureManager
        const {resourceManager} = redGPUContext
        const {width, height} = gBufferColorTexture
        const needChange = width !== this.#prevInfo?.width || height !== this.#prevInfo?.height || !this.#outputTexture;
        if (needChange) {
            // 기존 텍스처 정리
            this.clear();
            // 새 텍스처 생성
            this.#outputTexture = resourceManager.createManagedTexture({
                size: {
                    width,
                    height,
                },
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.COPY_SRC,
                label: `${name}_${this.#name}_${width}x${height}}`
            });
            this.#outputTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#outputTexture);
        }
        this.#prevInfo = {
            width,
            height,
        }
        this.#calcVideoMemory()
        return needChange
    }
}

Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
