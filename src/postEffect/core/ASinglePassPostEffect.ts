import AntialiasingManager from "../../antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import calculateTextureByteSize from "../../utils/texture/calculateTextureByteSize";
import GBUFFER_TYPE from "../../display/view/core/GBUFFER_TYPE";



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
    #systemUniformsInfo
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
     * @param workSize
     * [KO] 워크그룹 사이즈 (선택, 기본값: 16, 16, 1)
     * [EN] Workgroup size (optional, default: 16, 16, 1)
     */
    constructor(redGPUContext: RedGPUContext, workSize?: { x?: number, y?: number, z?: number }) {
        this.#redGPUContext = redGPUContext;
        this.#antialiasingManager = redGPUContext.antialiasingManager;
        if (workSize) {
            if (workSize.x !== undefined) this.#WORK_SIZE_X = workSize.x;
            if (workSize.y !== undefined) this.#WORK_SIZE_Y = workSize.y;
            if (workSize.z !== undefined) this.#WORK_SIZE_Z = workSize.z;
        }
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
    get systemUniformsInfo() {
        return this.#systemUniformsInfo
    }

    /**
     * [KO] Workgroup Size X
     * [EN] Workgroup Size X
     */
    get WORK_SIZE_X(): number {
        return this.#WORK_SIZE_X;
    }

    /**
     * [KO] Workgroup Size Y
     * [EN] Workgroup Size Y
     */
    get WORK_SIZE_Y(): number {
        return this.#WORK_SIZE_Y;
    }

    /**
     * [KO] Workgroup Size Z
     * [EN] Workgroup Size Z
     */
    get WORK_SIZE_Z(): number {
        return this.#WORK_SIZE_Z;
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
        // 텍스처 풀을 사용하므로 여기서 직접 destroy 하지 않음 (필요 시 풀에서 처리)
        this.#outputTexture = null;
        this.#outputTextureView = null;
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
     */
    init(redGPUContext: RedGPUContext, name: string, computeCodes: {
        msaa: string,
        nonMsaa: string
    }) {
        this.#name = name;
        const {resourceManager} = redGPUContext;

        // 셰이더 모듈 생성
        this.#computeShaderMSAA = resourceManager.createGPUShaderModule(`${name}_MSAA`, {code: computeCodes.msaa});
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule(`${name}_NonMSAA`, {code: computeCodes.nonMsaa});

        // 셰이더 정보 파싱
        this.#SHADER_INFO_MSAA = parseWGSL(`${name}_MSAA`, computeCodes.msaa);
        this.#SHADER_INFO_NON_MSAA = parseWGSL(`${name}_NonMSAA`, computeCodes.nonMsaa);

        const {storage, uniforms} = this.#SHADER_INFO_MSAA;
        this.#storageInfo = storage;
        this.#uniformsInfo = uniforms.uniforms;
        this.#systemUniformsInfo = uniforms.systemUniforms;

        // 유니폼 버퍼 초기화
        if (this.#uniformsInfo) {
            const uniformData = new ArrayBuffer(this.#uniformsInfo.arrayBufferByteLength);
            this.#uniformBuffer = new UniformBuffer(redGPUContext, uniformData, `${this.constructor.name}_UniformBuffer`);
        }
    }

    #execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number) {
        const {commandEncoderManager} = this.#redGPUContext;
        const {renderViewStateData} = view;

        commandEncoderManager.addPostProcessComputePass(`ASinglePassPostEffect_${this.#name}_ComputePass`, (computePassEncoder) => {
            computePassEncoder.setPipeline(this.#computePipeline);
            computePassEncoder.setBindGroup(0, renderViewStateData.swapBufferIndex ? this.#computeBindGroup0List_swap1 : this.#computeBindGroup0List_swap0);
            computePassEncoder.setBindGroup(1, this.#computeBindGroup1);
            computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
        });
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
        const {gpuDevice, antialiasingManager, resourceManager} = this.#redGPUContext;
        const {useMSAA, msaaID} = antialiasingManager;

        // 텍스처 풀에서 출력 텍스처 할당
        const prevOutputTexture = this.#outputTexture;
        this.#outputTexture = view.postEffectManager.texturePool.alloc(width, height, 'rgba16float');
        this.#outputTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#outputTexture);

        // 변경 감지
        const outputTextureChanged = prevOutputTexture !== this.#outputTexture;
        const dimensionsChanged = this.#prevInfo?.width !== width || this.#prevInfo?.height !== height;
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
        const sourceTextureChanged = this.#detectSourceTextureChange(sourceTextureInfo);

        if (dimensionsChanged || msaaChanged || sourceTextureChanged || outputTextureChanged) {
            this.#createBindGroups(view, sourceTextureInfo, this.#outputTextureView, useMSAA, gpuDevice);
        }

        this.#execute(view, gpuDevice, width, height);

        // 상태 업데이트
        this.#prevMSAA = useMSAA;
        this.#prevMSAAID = msaaID;
        this.#prevInfo = {width, height};
        this.#calcVideoMemory();

        return {
            texture: this.#outputTexture,
            textureView: this.#outputTextureView
        };
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
        const memberInfo = this.uniformsInfo?.members[key];
        if (memberInfo) {
            this.uniformBuffer.writeOnlyBuffer(memberInfo, value);
        }
    }

    #createBindGroups(view: View3D, sourceTextureInfoList: ASinglePassPostEffectResult[], targetOutputView: GPUTextureView, useMSAA: boolean, gpuDevice: GPUDevice) {
        this.#computeBindGroupEntries0_swap0 = [];
        this.#computeBindGroupEntries0_swap1 = [];
        this.#computeBindGroupEntries1 = [];

        this.#updateBindGroupEntries(view, sourceTextureInfoList, targetOutputView);
        this.#updateLayoutsAndPipeline(useMSAA, gpuDevice);

        // 소스 텍스처 참조 저장
        this.#saveCurrentSourceTextureReferences(sourceTextureInfoList);
    }

    #updateBindGroupEntries(view: View3D, sourceTextureInfoList: ASinglePassPostEffectResult[], targetOutputView: GPUTextureView) {
        const {storage, textures} = this.shaderInfo;
        const {viewRenderTextureManager, postEffectManager} = view;

        // Group 0: 소스 텍스처들
        for (const k in storage) {
            const {binding, name} = storage[k];
            if (name !== 'outputTexture') {
                const resource = sourceTextureInfoList[binding].textureView;
                this.#computeBindGroupEntries0_swap0.push({binding, resource});
                this.#computeBindGroupEntries0_swap1.push({binding, resource});
            }
        }

        // Group 0: 추가 리소스 (Depth, Normal)
        textures.forEach(({name, binding}) => {
            if (name === "depthTexture") {
                this.#computeBindGroupEntries0_swap0.push({binding, resource: viewRenderTextureManager.depthTextureView});
                this.#computeBindGroupEntries0_swap1.push({binding, resource: viewRenderTextureManager.prevDepthTextureView});
            } else if (name === "gBufferNormalTexture") {
                const normalView = this.#redGPUContext.antialiasingManager.useMSAA
                    ? viewRenderTextureManager.getGBufferResolveTextureView(GBUFFER_TYPE.NORMAL)
                    : viewRenderTextureManager.getGBufferTextureView(GBUFFER_TYPE.NORMAL);
                this.#computeBindGroupEntries0_swap0.push({binding, resource: normalView});
                this.#computeBindGroupEntries0_swap1.push({binding, resource: normalView});
            }
        });

        // Group 1: 출력 텍스처 및 유니폼 버퍼
        this.#computeBindGroupEntries1.push({binding: 0, resource: targetOutputView});

        if (this.systemUniformsInfo) {
            this.#computeBindGroupEntries1.push({
                binding: this.systemUniformsInfo.binding,
                resource: {
                    buffer: postEffectManager.postEffectSystemUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: postEffectManager.postEffectSystemUniformBuffer.size
                }
            });
        }

        if (this.#uniformBuffer && this.uniformsInfo) {
            this.#computeBindGroupEntries1.push({
                binding: this.uniformsInfo.binding,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                },
            });
        }
    }

    #updateLayoutsAndPipeline(useMSAA: boolean, gpuDevice: GPUDevice) {
        const {resourceManager} = this.#redGPUContext;
        const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
        const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;

        const layout0Name = `${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`;
        const layout1Name = `${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`;

        this.#computeBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(layout0Name) ||
            resourceManager.createBindGroupLayout(layout0Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA));

        this.#computeBindGroupLayout1 = resourceManager.getGPUBindGroupLayout(layout1Name) ||
            resourceManager.createBindGroupLayout(layout1Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA));

        this.#computeBindGroup0List_swap0 = gpuDevice.createBindGroup({
            label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP0`,
            layout: this.#computeBindGroupLayout0,
            entries: this.#computeBindGroupEntries0_swap0
        });

        this.#computeBindGroup0List_swap1 = gpuDevice.createBindGroup({
            label: `${this.#name}_BIND_GROUP_0_USE_MSAA_${useMSAA}_SWAP1`,
            layout: this.#computeBindGroupLayout0,
            entries: this.#computeBindGroupEntries0_swap1
        });

        this.#computeBindGroup1 = gpuDevice.createBindGroup({
            label: `${this.#name}_BIND_GROUP_1_USE_MSAA_${useMSAA}`,
            layout: this.#computeBindGroupLayout1,
            entries: this.#computeBindGroupEntries1
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
            layout: gpuDevice.createPipelineLayout({bindGroupLayouts: [this.#computeBindGroupLayout0, this.#computeBindGroupLayout1]}),
            compute: {module: currentShader, entryPoint: 'main'}
        });
    }

    #calcVideoMemory() {
        this.#videoMemorySize = this.#uniformBuffer ? this.#uniformBuffer.size : 0;
    }

    #detectSourceTextureChange(sourceTextureInfoList: ASinglePassPostEffectResult[]): boolean {
        if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureInfoList.length) {
            return true;
        }
        return sourceTextureInfoList.some((info, i) => info.textureView !== this.#previousSourceTextureReferences[i].textureView);
    }

    #saveCurrentSourceTextureReferences(sourceTextureInfoList: ASinglePassPostEffectResult[]) {
        this.#previousSourceTextureReferences = [...sourceTextureInfoList];
    }
}

Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
