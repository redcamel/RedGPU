import AntialiasingManager from "../../antialiasing/AntialiasingManager";
import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../material/core";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";
import {IPostEffectResult} from "./types";
import {keepLog} from "../../utils";

/**
 * [KO] 단일 패스 후처리 이펙트 추상 클래스입니다.
 * [EN] Abstract class for single-pass post-processing effects.
 *
 * [KO] 한 번의 컴퓨트(Compute) 패스로 동작하는 후처리 이펙트의 기반 클래스입니다.
 * [EN] Base class for post-processing effects that operate in a single compute pass.
 *
 * @category Core
 */
abstract class ASinglePassPostEffect {
    // 컴퓨트 셰이더 및 파이프라인 관련 리소스
    #computeShaderMSAA: GPUShaderModule
    #computeShaderNonMSAA: GPUShaderModule
    #computeBindGroupLayout0: GPUBindGroupLayout
    #computeBindGroupLayout1: GPUBindGroupLayout
    #outputBindGroupLayout: GPUBindGroupLayout
    #computeBindGroup0List_swap0: GPUBindGroup
    #computeBindGroup0List_swap1: GPUBindGroup
    #computeBindGroup1: GPUBindGroup
    #outputBindGroup: GPUBindGroup
    #computeBindGroupEntries0_swap0: GPUBindGroupEntry[]
    #computeBindGroupEntries0_swap1: GPUBindGroupEntry[]
    #computeBindGroupEntries1: GPUBindGroupEntry[]
    #outputBindGroupEntries: GPUBindGroupEntry[]
    #computePipeline: GPUComputePipeline
    #computePipelineMSAA: GPUComputePipeline
    #computePipelineNonMSAA: GPUComputePipeline

    // 유니폼 및 셰이더 구조 정보
    #uniformBuffer: UniformBuffer
    #uniformsInfo
    #systemUniformsInfo
    #storageInfo
    #name: string
    #SHADER_INFO_MSAA
    #SHADER_INFO_NON_MSAA
    #prevInfo: { width: number, height: number }

    // 출력 텍스처 및 설정
    #outputTexture: GPUTexture
    #outputTextureView: GPUTextureView
    #WORK_SIZE_X: number = 16
    #WORK_SIZE_Y: number = 16
    #WORK_SIZE_Z: number = 1
    #redGPUContext: RedGPUContext
    #antialiasingManager: AntialiasingManager
    #previousSourceTextureReferences: IPostEffectResult[] = [];
    #videoMemorySize: number = 0
    #prevMSAA: boolean
    #prevMSAAID: string

    /**
     * [KO] ASinglePassPostEffect 인스턴스를 생성합니다.
     * [EN] Creates an ASinglePassPostEffect instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param workSize -
     * [KO] 워크그룹 사이즈 설정 (선택, 기본값: {x: 16, y: 16, z: 1})
     * [EN] Workgroup size configuration (optional, default: {x: 16, y: 16, z: 1})
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
     * [KO] 비디오 메모리 사용량(Bytes)을 반환합니다.
     * [EN] Returns the video memory usage in bytes.
     */
    get videoMemorySize(): number {
        return this.#videoMemorySize
    }

    /**
     * [KO] RedGPU 컨텍스트를 반환합니다.
     * [EN] Returns the RedGPU context.
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * [KO] 셰이더의 스토리지 구조 정보를 반환합니다.
     * [EN] Returns storage info from the shader.
     */
    get storageInfo() {
        return this.#storageInfo
    }

    /**
     * [KO] 현재 MSAA 상태에 따른 셰이더 정보를 반환합니다.
     * [EN] Returns shader information based on the current MSAA state.
     */
    get shaderInfo() {
        return this.#antialiasingManager.useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
    }

    /**
     * [KO] 이펙트 전용 유니폼 버퍼를 반환합니다.
     * [EN] Returns the effect-specific uniform buffer.
     */
    get uniformBuffer(): UniformBuffer {
        return this.#uniformBuffer;
    }

    /**
     * [KO] 이펙트 전용 유니폼 구조 정보를 반환합니다.
     * [EN] Returns the effect-specific uniform struct information.
     */
    get uniformsInfo() {
        return this.#uniformsInfo
    }

    /**
     * [KO] 시스템 공용 유니폼 구조 정보를 반환합니다.
     * [EN] Returns the system common uniform struct information.
     */
    get systemUniformsInfo() {
        return this.#systemUniformsInfo
    }

    /**
     * [KO] 워크그룹 사이즈 X를 반환합니다.
     * [EN] Returns the workgroup size X.
     */
    get WORK_SIZE_X(): number {
        return this.#WORK_SIZE_X;
    }

    /**
     * [KO] 워크그룹 사이즈 Y를 반환합니다.
     * [EN] Returns the workgroup size Y.
     */
    get WORK_SIZE_Y(): number {
        return this.#WORK_SIZE_Y;
    }

    /**
     * [KO] 워크그룹 사이즈 Z를 반환합니다.
     * [EN] Returns the workgroup size Z.
     */
    get WORK_SIZE_Z(): number {
        return this.#WORK_SIZE_Z;
    }

    /**
     * [KO] 현재 할당된 출력 텍스처 뷰를 반환합니다.
     * [EN] Returns the currently allocated output texture view.
     */
    get outputTextureView(): GPUTextureView {
        return this.#outputTextureView;
    }

    /**
     * [KO] 이펙트에서 사용 중인 리소스를 해제합니다.
     * [EN] Clears the resources used by the effect.
     */
    clear() {
        this.#outputTexture = null;
        this.#outputTextureView = null;
    }

    /**
     * [KO] 이펙트를 초기화합니다. 컴퓨트 셰이더 및 유니폼 버퍼를 생성합니다.
     * [EN] Initializes the effect. Creates compute shaders and uniform buffers.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU Context
     * @param name -
     * [KO] 이펙트 이름
     * [EN] Effect name
     * @param computeCodes -
     * [KO] MSAA 및 Non-MSAA용 컴퓨트 셰이더 소스 코드
     * [EN] Compute shader source codes for MSAA and Non-MSAA
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

        // 셰이더 정보 파싱 (WGSL 분석)
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

        {
            keepLog(this.#uniformsInfo)
            const {members} = this.#uniformsInfo || {}
            if (members) {
                for (const k in members) {
                    this.uniformBuffer.writeOnlyBuffer(members[k], this[k]);
                }
            }
        }

    }


    /**
     * [KO] 이펙트를 렌더링하고 결과를 반환합니다. 필요한 경우 바인드 그룹을 갱신합니다.
     * [EN] Renders the effect and returns the result. Updates bind groups if necessary.
     *
     * @param view -
     * [KO] View3D 인스턴스
     * [EN] View3D instance
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 입력으로 사용될 소스 텍스처 정보 리스트
     * [EN] List of source texture information to be used as input
     * @returns
     * [KO] 렌더링 결과 (텍스처 및 뷰)
     * [EN] Rendering result (texture and view)
     */
    render(view: View3D, width: number, height: number, ...sourceTextureInfo: IPostEffectResult[]): IPostEffectResult {
        const {gpuDevice, antialiasingManager, resourceManager} = this.#redGPUContext;
        const {useMSAA, msaaID} = antialiasingManager;

        // 텍스처 풀에서 출력 텍스처 할당
        const prevOutputTexture = this.#outputTexture;
        this.#outputTexture = view.postEffectManager.texturePool.alloc(width, height, 'rgba16float');
        this.#outputTextureView = resourceManager.getGPUResourceBitmapTextureView(this.#outputTexture);

        // 변경 감지 (재바인딩 필요성 확인)
        const outputTextureChanged = prevOutputTexture !== this.#outputTexture;
        const dimensionsChanged = this.#prevInfo?.width !== width || this.#prevInfo?.height !== height;
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
        const sourceTextureChanged = this.#detectSourceTextureChange(sourceTextureInfo);

        // 파이프라인 준비 (상태에 따라 최초 1회 생성 및 캐싱)
        this.#checkAndCreatePipeline(view, useMSAA, gpuDevice);


        if (dimensionsChanged || msaaChanged || sourceTextureChanged || outputTextureChanged) {
            keepLog(this.constructor.name, dimensionsChanged, msaaChanged, sourceTextureChanged, outputTextureChanged)
            this.#updateBindGroups(view, sourceTextureInfo, this.#outputTextureView, useMSAA, gpuDevice);
        }

        // 컴퓨트 패스 실행
        this.#execute(view, gpuDevice, width, height, view.postEffectManager.gbufferBindGroup);

        // 이전 상태 저장
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
     * [KO] 특정 유니폼 값을 업데이트합니다.
     * [EN] Updates a specific uniform value.
     *
     * @param key -
     * [KO] 유니폼 키 이름
     * [EN] Uniform key name
     * @param value -
     * [KO] 설정할 값
     * [EN] Value to set
     */
    updateUniform(key: string, value: number | number[] | boolean) {
        const memberInfo = this.uniformsInfo?.members[key];
        if (memberInfo) {
            this.uniformBuffer.writeOnlyBuffer(memberInfo, value);
        }
    }

    /**
     * [KO] 실제 컴퓨트 패스를 커맨드 인코더에 추가합니다.
     * [EN] Adds the actual compute pass to the command encoder.
     */
    #execute(view: View3D, gpuDevice: GPUDevice, width: number, height: number, gbufferBindGroup: GPUBindGroup) {
        const {commandEncoderManager} = this.#redGPUContext;
        const {renderViewStateData} = view;

        commandEncoderManager.addPostProcessComputePass(`ASinglePassPostEffect_${this.#name}_ComputePass`, (computePassEncoder) => {
            computePassEncoder.setPipeline(this.#computePipeline);
            computePassEncoder.setBindGroup(0, renderViewStateData.swapBufferIndex ? this.#computeBindGroup0List_swap1 : this.#computeBindGroup0List_swap0);
            computePassEncoder.setBindGroup(1, this.#computeBindGroup1);
            computePassEncoder.setBindGroup(2, gbufferBindGroup);
            computePassEncoder.setBindGroup(3, this.#outputBindGroup);
            computePassEncoder.dispatchWorkgroups(Math.ceil(width / this.WORK_SIZE_X), Math.ceil(height / this.WORK_SIZE_Y));
        });
    }

    /**
     * [KO] 파이프라인 및 레이아웃을 확인하고 필요한 경우 생성합니다.
     * [EN] Checks for the pipeline and layout, creating them if necessary.
     */
    #checkAndCreatePipeline(view: View3D, useMSAA: boolean, gpuDevice: GPUDevice) {
        const cachedPipeline = useMSAA ? this.#computePipelineMSAA : this.#computePipelineNonMSAA;
        if (cachedPipeline) {
            this.#computePipeline = cachedPipeline;
            return;
        }

        const {resourceManager} = this.#redGPUContext;
        const currentShaderInfo = useMSAA ? this.#SHADER_INFO_MSAA : this.#SHADER_INFO_NON_MSAA;
        const currentShader = useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA;

        const layout0Name = `${this.#name}_BIND_GROUP_LAYOUT_0_USE_MSAA_${useMSAA}`;
        const layout1Name = `${this.#name}_BIND_GROUP_LAYOUT_1_USE_MSAA_${useMSAA}`;
        const layout3Name = `${this.#name}_BIND_GROUP_LAYOUT_3_USE_MSAA_${useMSAA}`;

        // 레이아웃 캐싱 및 생성
        this.#computeBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(layout0Name) ||
            resourceManager.createBindGroupLayout(layout0Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 0, useMSAA));

        this.#computeBindGroupLayout1 = resourceManager.getGPUBindGroupLayout(layout1Name) ||
            resourceManager.createBindGroupLayout(layout1Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 1, useMSAA));

        this.#outputBindGroupLayout = resourceManager.getGPUBindGroupLayout(layout3Name) ||
            resourceManager.createBindGroupLayout(layout3Name, getComputeBindGroupLayoutDescriptorFromShaderInfo(currentShaderInfo, 3, useMSAA));

        // 파이프라인 생성
        const pipeline = gpuDevice.createComputePipeline({
            label: `${this.#name}_COMPUTE_PIPELINE_USE_MSAA_${useMSAA}`,
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    this.#computeBindGroupLayout0,
                    this.#computeBindGroupLayout1,
                    view.postEffectManager.gbufferBindGroupLayout,
                    this.#outputBindGroupLayout
                ]
            }),
            compute: {module: currentShader, entryPoint: 'main'}
        });

        // 캐싱
        if (useMSAA) this.#computePipelineMSAA = pipeline;
        else this.#computePipelineNonMSAA = pipeline;

        this.#computePipeline = pipeline;
    }

    /**
     * [KO] 바인드 그룹을 갱신합니다.
     * [EN] Updates bind groups.
     */
    #updateBindGroups(view: View3D, sourceTextureInfoList: IPostEffectResult[], targetOutputView: GPUTextureView, useMSAA: boolean, gpuDevice: GPUDevice) {
        this.#computeBindGroupEntries0_swap0 = [];
        this.#computeBindGroupEntries0_swap1 = [];
        this.#computeBindGroupEntries1 = [];
        this.#outputBindGroupEntries = [];

        const {storage, textures} = this.shaderInfo;

        // Group 0: 소스 텍스처들
        for (const k in storage) {
            const {binding, name, group} = storage[k];
            if (group === 0 && name !== 'outputTexture') {
                const resource = sourceTextureInfoList[binding]?.textureView;
                if (resource) {
                    this.#computeBindGroupEntries0_swap0.push({binding, resource});
                    this.#computeBindGroupEntries0_swap1.push({binding, resource});
                }
            }
        }
        textures.forEach(({binding, group}) => {
            if (group === 0) {
                const resource = sourceTextureInfoList[binding]?.textureView;
                if (resource) {
                    this.#computeBindGroupEntries0_swap0.push({binding, resource});
                    this.#computeBindGroupEntries0_swap1.push({binding, resource});
                }
            }
        });

        // Group 1: 이펙트 개별 유니폼 버퍼
        if (this.#uniformBuffer && this.uniformsInfo) {
            this.#computeBindGroupEntries1.push({
                binding: 0,
                resource: {
                    buffer: this.#uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: this.#uniformBuffer.size
                },
            });
        }

        // Group 3: 출력 텍스처
        this.#outputBindGroupEntries.push({binding: 0, resource: targetOutputView});

        // 바인드 그룹 실제 생성
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

        this.#outputBindGroup = gpuDevice.createBindGroup({
            label: `${this.#name}_BIND_GROUP_3_USE_MSAA_${useMSAA}`,
            layout: this.#outputBindGroupLayout,
            entries: this.#outputBindGroupEntries
        });

        // 현재 소스 텍스처 참조 저장
        this.#saveCurrentSourceTextureReferences(sourceTextureInfoList);
    }

    /**
     * [KO] 비디오 메모리 사용량을 계산합니다. (유니폼 버퍼 크기 기준)
     * [EN] Calculates video memory usage based on uniform buffer size.
     */
    #calcVideoMemory() {
        this.#videoMemorySize = this.#uniformBuffer ? this.#uniformBuffer.size : 0;
    }

    /**
     * [KO] 입력 소스 텍스처들의 변경 여부를 감지합니다.
     * [EN] Detects changes in the input source textures.
     */
    #detectSourceTextureChange(sourceTextureInfoList: IPostEffectResult[]): boolean {
        if (!this.#previousSourceTextureReferences || this.#previousSourceTextureReferences.length !== sourceTextureInfoList.length) {
            return true;
        }
        return sourceTextureInfoList.some((info, i) => info.textureView !== this.#previousSourceTextureReferences[i].textureView);
    }

    /**
     * [KO] 현재 소스 텍스처들의 참조를 저장합니다.
     * [EN] Saves the references of the current source textures.
     */
    #saveCurrentSourceTextureReferences(sourceTextureInfoList: IPostEffectResult[]) {
        this.#previousSourceTextureReferences = [...sourceTextureInfoList];
    }
}

Object.freeze(ASinglePassPostEffect)
export default ASinglePassPostEffect
