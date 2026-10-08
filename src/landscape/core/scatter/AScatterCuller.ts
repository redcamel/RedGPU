/**
 * [KO] Landscape 스캐터(Grass, Foliage 등) GPU 초고속 컬링 파이프라인 추상 기본 클래스 모듈입니다.
 * [EN] Abstract base class module for Landscape scatter (Grass, Foliage, etc.) ultra-fast GPU culling compute pipelines.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 대규모 지형 스캐터 엔티티의 GPU 프러스텀/거리/HZB 컬링 파이프라인 추상 기본 클래스입니다.
 * [EN] Abstract base class managing GPU frustum, distance, and HZB culling pipelines for large-scale landscape scatter entities.
 *
 * **[KO] 주요 역할:**
 * - WebGPU 컴퓨트 파이프라인 및 바인드 그룹 레이아웃의 안전한 초기화/캐싱 및 자원 해제 관리
 * - 사전 할당된 스캐터 메가버퍼 기반 워크그룹 자동 계산 및 Zero-GC 디스패치 루프 제공
 *
 * @category Landscape
 */
export abstract class AScatterCuller extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    /**
     * [KO] AScatterCuller 생성자입니다.
     * [EN] Constructor for AScatterCuller.
     *
     * @param redGPUContext - RedGPUContext 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
    }

    /**
     * [KO] 생성된 GPUComputePipeline 인스턴스를 반환합니다.
     * [EN] Returns the created GPUComputePipeline instance.
     */
    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    /**
     * [KO] 생성된 GPUBindGroupLayout 인스턴스를 반환합니다.
     * [EN] Returns the created GPUBindGroupLayout instance.
     */
    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 소유한 모든 WebGPU 파이프라인 및 레이아웃 자원 참조를 해제합니다.
     * [EN] Releases all held WebGPU pipeline and layout resource references.
     */
    destroy(): void {
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
    }

    /**
     * [KO] WGSL 셰이더 소스로부터 GPU 컴퓨트 파이프라인 및 바인드 그룹 레이아웃을 생성합니다.
     * [EN] Initializes the GPU compute pipeline and bind group layout from WGSL shader source.
     *
     * @param shaderName - 셰이더 모듈 식별자
     * @param shaderSource - WGSL 셰이더 소스코드
     * @param labelPrefix - WebGPU 리소스 라벨 접두사
     * @param entryPoint - 컴퓨트 셰이더 진입점 (기본값: 'main')
     */
    protected initComputePipeline(
        shaderName: string,
        shaderSource: string,
        labelPrefix: string,
        entryPoint: string = 'main'
    ): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        if (!gpuDevice) return;

        const shaderInfo = resourceManager.wgslParser.parse(shaderName, shaderSource);
        let computeModule = resourceManager.getGPUShaderModule(shaderName);
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule(shaderName, {
                code: shaderSource
            });
        }

        const bglDesc = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout(`${labelPrefix}_BindGroupLayout`, {
            label: `${labelPrefix}_BindGroupLayout`,
            ...bglDesc
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
     * [KO] 사전 바인딩된 파이프라인 및 바인드 그룹으로 워크그룹을 디스패치합니다 (Zero-GC).
     * [EN] Dispatches workgroups with the bound compute pipeline and bind group (Zero-GC).
     *
     * @param computePass - 현재 실행 중인 GPUComputePassEncoder
     * @param bindGroup - 바인딩할 GPUBindGroup
     * @param totalInstances - 처리할 총 인스턴스 개수
     * @param workgroupSize - 셰이더 워크그룹 크기 (기본값: 64)
     */
    protected dispatchCompute(
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

export default AScatterCuller;
