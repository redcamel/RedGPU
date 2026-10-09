/**
 * [KO] 지형 가상 텍스처(VBT, VHT, VNT) 아틀라스 베이커 추상 기본 클래스 모듈입니다.
 * [EN] Abstract base class module for terrain virtual texture (VBT, VHT, VNT) atlas bakers.
 * @packageDocumentation
 */

import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 지형 GPU Compute 아틀라스 베이킹을 위한 공통 파이프라인, 유니폼 풀 및 디스패치 루프를 제공하는 추상 기본 클래스입니다.
 * [EN] Abstract base class providing common compute pipelines, uniform pools, and dispatch loops for terrain GPU compute atlas baking.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **GPU Compute 기반 실시간 베이킹**: 지형의 거대한 가상 텍스처 아틀라스(VHT 높이, VNT 노멀, VBT 베이스 재질)를 WebGPU 컴퓨트 파이프라인(`GPUComputePipeline`)을 통해 실시간 병렬 생성합니다.
 * - **제로 GC 유니폼 버퍼 풀링 (`acquireUniformBuffer`)**: 매 프레임 혹은 매 타일 디스패치 시 발생하는 힙 메모리 할당 및 가비지 컬렉션(GC) 부하를 방지하기 위해, 사전 할당된 유니폼 버퍼 풀(`GPUBuffer[]`)을 프레임 단위로 재사용합니다.
 * - **타일 단위 2D 컴퓨트 디스패치 (`dispatchBakePass`)**: 16x16 워크그룹(`workgroup_size(16, 16)`)을 기준으로 타일의 픽셀 영역만을 정확하게 타겟팅하여 GPU 부하를 최소화합니다.
 * - **비동기 리소스 커맨드 엔코딩**: `COMMAND_ENCODER_TYPE.RESOURCE` 인코더를 활용하여 렌더 패스 간섭 없이 백그라운드 텍스처 갱신을 수행합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Real-time GPU Compute Baking**: Generates massive terrain virtual texture atlases (VHT height, VNT normal, VBT base material) in parallel using WebGPU compute pipelines (`GPUComputePipeline`).
 * - **Zero-GC Uniform Buffer Pooling (`acquireUniformBuffer`)**: Reuses pre-allocated uniform buffer pools (`GPUBuffer[]`) on a per-frame basis to prevent heap memory allocation and garbage collection (GC) overhead during frequent tile dispatches.
 * - **2D Tile-based Compute Dispatch (`dispatchBakePass`)**: Minimizes GPU workload by targeting only the specific pixel region of a tile based on 16x16 workgroups (`workgroup_size(16, 16)`).
 * - **Asynchronous Resource Command Encoding**: Utilizes the `COMMAND_ENCODER_TYPE.RESOURCE` encoder to perform background texture updates without interfering with primary render passes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class ALandscapeAtlasGenerator extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformBufferPool: GPUBuffer[] = [];
    #poolIndex: number = 0;
    #lastFrameId: number = -1;
    #generatorLabel: string;

    constructor(redGPUContext: RedGPUContext, generatorLabel: string) {
        super(redGPUContext);
        this.#generatorLabel = generatorLabel;
    }

    /**
     * [KO] 아틀라스 베이킹에 사용되는 GPU 컴퓨트 파이프라인 인스턴스를 반환합니다.
     * [EN] Returns the GPU compute pipeline instance used for atlas baking.
     */
    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    /**
     * [KO] 컴퓨트 파이프라인의 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the bind group layout of the compute pipeline.
     */
    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 프레임 단위로 유니폼 버퍼를 풀링하여 재사용하고 필요한 경우 확장합니다.
     * [EN] Pools and reuses uniform buffers per frame, expanding when necessary.
     * @param byteLength -
     * [KO] 필요한 바이트 크기
     * [EN] Required byte size
     * @returns
     * [KO] 할당 또는 재사용된 GPUBuffer
     * [EN] Allocated or reused GPUBuffer
     */
    acquireUniformBuffer(byteLength: number): GPUBuffer {
        const device = this.gpuDevice;
        const curFrame = this.redGPUContext.currentRequestAnimationFrame;

        if (this.#lastFrameId !== curFrame) {
            this.#lastFrameId = curFrame;
            this.#poolIndex = 0;
        }

        if (this.#poolIndex >= this.#uniformBufferPool.length) {
            this.#uniformBufferPool.push(device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${this.#uniformBufferPool.length}`,
                size: Math.max(16, byteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        const buf = this.#uniformBufferPool[this.#poolIndex++];
        if (buf.size < byteLength) {
            try {
                buf.destroy();
            } catch {
            }
            const newBuf = device.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${this.#poolIndex - 1}`,
                size: Math.max(16, byteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.#uniformBufferPool[this.#poolIndex - 1] = newBuf;
            return newBuf;
        }

        return buf;
    }

    /**
     * [KO] 지정된 픽셀 영역에 대해 GPU Compute 베이킹 패스를 실행합니다.
     * [EN] Dispatches a GPU compute bake pass for the specified pixel region.
     * @param bindGroup -
     * [KO] 바인딩할 GPUBindGroup
     * [EN] GPUBindGroup to bind
     * @param pixelW -
     * [KO] 베이킹 가로 픽셀 폭
     * [EN] Bake pixel width
     * @param pixelH -
     * [KO] 베이킹 세로 픽셀 높이
     * [EN] Bake pixel height
     * @param pixelX -
     * [KO] 베이킹 시작 X 픽셀 좌표
     * [EN] Bake start X pixel coordinate
     * @param pixelZ -
     * [KO] 베이킹 시작 Z 픽셀 좌표
     * [EN] Bake start Z pixel coordinate
     */
    dispatchBakePass(
        bindGroup: GPUBindGroup,
        pixelW: number,
        pixelH: number,
        pixelX: number,
        pixelZ: number
    ): void {
        if (!this.#computePipeline) return;
        if (pixelW <= 0 || pixelH <= 0) return;

        const workgroupCountX = Math.max(1, Math.ceil(pixelW / 16));
        const workgroupCountY = Math.max(1, Math.ceil(pixelH / 16));

        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `Landscape_${this.#generatorLabel}_ComputePass_[${pixelX},${pixelZ}]`
            });
            pass.setPipeline(this.#computePipeline!);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
            pass.end();
        });
    }

    /**
     * [KO] 셰이더 코드 및 바인드 그룹 레이아웃을 기반으로 기본 컴퓨트 파이프라인과 유니폼 버퍼 풀을 초기화합니다.
     * [EN] Initializes the base compute pipeline and uniform buffer pool based on shader code and bind group layout.
     *
     * @param shaderModuleKey -
     * [KO] 리소스 매니저 셰이더 모듈 키
     * [EN] Resource manager shader module key
     * @param shaderCode -
     * [KO] WGSL 셰이더 소스 코드
     * [EN] WGSL shader source code
     * @param layoutEntries -
     * [KO] 바인드 그룹 레이아웃 엔트리 목록
     * [EN] Bind group layout entry descriptors
     * @param defaultUniformByteLength -
     * [KO] 기본 유니폼 버퍼 바이트 크기 (기본값: 16)
     * [EN] Default uniform buffer byte size (default: 16)
     */
    initBaseComputePipeline(
        shaderModuleKey: string,
        shaderCode: string,
        layoutEntries: GPUBindGroupLayoutEntry[],
        defaultUniformByteLength: number = 16
    ): void {
        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice) return;

        this.#uniformBufferPool = [];
        for (let i = 0; i < 16; i++) {
            this.#uniformBufferPool.push(gpuDevice.createBuffer({
                label: `Landscape_${this.#generatorLabel}_UniformBuffer_Slot_${i}`,
                size: Math.max(16, defaultUniformByteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            }));
        }

        let shaderModule = resourceManager.getGPUShaderModule(shaderModuleKey);
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule(shaderModuleKey, {
                code: shaderCode
            });
        }

        this.#bindGroupLayout = resourceManager.createBindGroupLayout(
            `Landscape_${this.#generatorLabel}_BindGroupLayout`,
            {
                label: `Landscape_${this.#generatorLabel}_BindGroupLayout`,
                entries: layoutEntries
            }
        );

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            `Landscape_${this.#generatorLabel}_PipelineLayout`,
            {
                label: `Landscape_${this.#generatorLabel}_PipelineLayout`,
                bindGroupLayouts: [this.#bindGroupLayout]
            }
        );

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: `Landscape_${this.#generatorLabel}_ComputePipeline`,
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }

    /**
     * [KO] 풀링된 유니폼 버퍼 및 컴퓨트 파이프라인 자원을 해제하고 파기합니다.
     * [EN] Releases and destroys pooled uniform buffers and compute pipeline resources.
     */
    destroy(): void {
        const count = this.#uniformBufferPool.length;
        for (let i = 0; i < count; i++) {
            try {
                this.#uniformBufferPool[i]?.destroy();
            } catch (e) {
            }
        }
        this.#uniformBufferPool.length = 0;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
    }
}

Object.freeze(ALandscapeAtlasGenerator);
export default ALandscapeAtlasGenerator;
