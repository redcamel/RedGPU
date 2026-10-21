import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 스캐터(Scatter) 시스템의 GPU 컴퓨트 컬링 파이프라인 및 디스패치 처리를 담당하는 추상 기반 클래스입니다.
 * [EN] Abstract base class responsible for the GPU compute culling pipeline and dispatch execution of the scatter system.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
abstract class AScatterCuller extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    /**
     * [KO] `AScatterCuller` 인스턴스를 초기화합니다.
     * [EN] Initializes an `AScatterCuller` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 생성된 WebGPU 컴퓨트 파이프라인을 반환합니다.
     * [EN] Returns the created WebGPU compute pipeline.
     *
     * @returns
     * [KO] 컴퓨트 파이프라인(`GPUComputePipeline`) 또는 미초기화 시 `null`
     * [EN] Compute pipeline (`GPUComputePipeline`), or `null` if not initialized
     */
    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    /**
     * [KO] 컴퓨트 컬링 셰이더의 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the bind group layout of the compute culling shader.
     *
     * @returns
     * [KO] 바인드 그룹 레이아웃(`GPUBindGroupLayout`) 또는 미초기화 시 `null`
     * [EN] Bind group layout (`GPUBindGroupLayout`), or `null` if not initialized
     */
    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 컴퓨트 파이프라인 및 바인드 그룹 레이아웃 참조를 해제합니다.
     * [EN] Releases references to the compute pipeline and bind group layout.
     */
    destroy(): void {
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
    }

    /**
     * [KO] WGSL 컴퓨트 셰이더 소스를 파싱하여 바인드 그룹 레이아웃과 컴퓨트 파이프라인을 초기화합니다.
     * [EN] Parses the WGSL compute shader source and initializes the bind group layout and compute pipeline.
     *
     * @param shaderName -
     * [KO] 리소스 매니저에 등록할 셰이더 모듈 식별자 이름
     * [EN] Shader module identifier name to register in the resource manager
     * @param shaderSource -
     * [KO] 컴퓨트 컬링용 WGSL 셰이더 소스 코드
     * [EN] WGSL shader source code for compute culling
     * @param labelPrefix -
     * [KO] 파이프라인 및 레이아웃 디버그 라벨 접두사
     * [EN] Debug label prefix for pipeline and layout resources
     * @param entryPoint -
     * [KO] 컴퓨트 셰이더 진입점 함수 이름 (기본값: `'main'`)
     * [EN] Compute shader entry point function name (default: `'main'`)
     */
    initComputePipeline(
        shaderName: string,
        shaderSource: string,
        labelPrefix: string,
        entryPoint: string = 'main'
    ): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        const {wgslParser} = resourceManager;
        const shaderInfo = wgslParser.parse(shaderName, shaderSource);
        const computeModule = resourceManager.getGPUShaderModule(shaderName)
            ?? resourceManager.createGPUShaderModule(shaderName, {
                code: shaderSource
            });

        const bindGroupLayoutDescriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout(`${labelPrefix}_BindGroupLayout`, {
            label: `${labelPrefix}_BindGroupLayout`,
            ...bindGroupLayoutDescriptor
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout(`${labelPrefix}_PipelineLayout`, {
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `${labelPrefix}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint
            }
        });
    }

    /**
     * [KO] 전체 인스턴스 수와 워크그룹 크기를 기준으로 컴퓨트 컬링 워크그룹을 디스패치합니다.
     * [EN] Dispatches compute culling workgroups based on the total instance count and workgroup size.
     *
     * @param computePass -
     * [KO] 대상 GPU 컴퓨트 패스 인코더
     * [EN] Target GPU compute pass encoder
     * @param bindGroup -
     * [KO] 바인딩할 컬링용 GPU 바인드 그룹
     * [EN] Culling GPU bind group to bind
     * @param totalInstances -
     * [KO] 컬링 대상 전체 인스턴스 수
     * [EN] Total number of instances to cull
     * @param workgroupSize -
     * [KO] 컴퓨트 셰이더 워크그룹 크기 (기본값: `64`)
     * [EN] Compute shader workgroup size (default: `64`)
     */
    dispatchCompute(
        computePass: GPUComputePassEncoder,
        bindGroup: GPUBindGroup,
        totalInstances: number,
        workgroupSize: number = 64
    ): void {
        if (!this.#computePipeline || totalInstances <= 0) return;
        computePass.setPipeline(this.#computePipeline);
        computePass.setBindGroup(0, bindGroup);
        const workgroupCount = Math.ceil(totalInstances / workgroupSize);
        computePass.dispatchWorkgroups(workgroupCount);
    }
}

Object.freeze(AScatterCuller);
export default AScatterCuller;
