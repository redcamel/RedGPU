import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 지형 가상 텍스처 아틀라스(VHT, VNT, VBT) 베이킹 생성기의 공통 컴퓨트 파이프라인 및 유니폼 버퍼 풀을 관리하는 추상 클래스입니다.
 * [EN] Abstract class that manages common compute pipelines and uniform buffer pools for terrain virtual texture atlas (VHT, VNT, VBT) baking generators.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
abstract class ALandscapeAtlasGenerator extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;

    #uniformBufferPool: GPUBuffer[] = [];
    #poolIndex: number = 0;
    #lastFrameId: number = -1;
    #generatorLabel: string;
    #workgroupSize: number = 16;

    /**
     * [KO] `ALandscapeAtlasGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes an `ALandscapeAtlasGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param generatorLabel -
     * [KO] GPU 리소스 디버그 라벨 식별자 (예: `'VHT'`, `'VNT'`, `'VBT'`)
     * [EN] GPU resource debug label identifier (e.g., `'VHT'`, `'VNT'`, `'VBT'`)
     * @param workgroupSize -
     * [KO] 컴퓨트 셰이더 2D 워크그룹 가로/세로 크기 (기본값: `16`)
     * [EN] Compute shader 2D workgroup width/height size (Default: `16`)
     */
    constructor(redGPUContext: RedGPUContext, generatorLabel: string, workgroupSize: number = 16) {
        super(redGPUContext);
        this.#generatorLabel = generatorLabel;
        this.#workgroupSize = workgroupSize;
    }

    /**
     * [KO] 아틀라스 베이킹에 사용되는 기본 컴퓨트 파이프라인을 반환합니다.
     * [EN] Returns the base compute pipeline used for atlas baking.
     *
     * @returns
     * [KO] 컴퓨트 파이프라인 또는 `null`
     * [EN] Compute pipeline or `null`
     */
    get computePipeline(): GPUComputePipeline | null {
        return this.#computePipeline;
    }

    /**
     * [KO] 아틀라스 베이킹 컴퓨트 파이프라인의 바인드 그룹 레이아웃을 반환합니다.
     * [EN] Returns the bind group layout of the atlas baking compute pipeline.
     *
     * @returns
     * [KO] 바인드 그룹 레이아웃 또는 `null`
     * [EN] Bind group layout or `null`
     */
    get bindGroupLayout(): GPUBindGroupLayout | null {
        return this.#bindGroupLayout;
    }

    /**
     * [KO] 현재 프레임에서 사용 가능한 지정된 바이트 크기 이상의 유니폼 버퍼를 풀에서 할당받아 반환합니다.
     * [EN] Acquires and returns an available uniform buffer with at least the specified byte length from the pool for the current frame.
     *
     * @param byteLength -
     * [KO] 필요한 최소 유니폼 버퍼 바이트 크기
     * [EN] Minimum required uniform buffer size in bytes
     * @returns
     * [KO] 할당된 `GPUBuffer` 인스턴스
     * [EN] Allocated `GPUBuffer` instance
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
     * [KO] 지정된 바인드 그룹과 픽셀 영역 크기로 아틀라스 베이킹 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches an atlas baking compute pass with the specified bind group and pixel region dimensions.
     *
     * @param bindGroup -
     * [KO] 바인딩할 `GPUBindGroup` 인스턴스
     * [EN] `GPUBindGroup` instance to bind
     * @param pixelW -
     * [KO] 베이킹 영역의 가로 픽셀 크기
     * [EN] Width of the baking region in pixels
     * @param pixelH -
     * [KO] 베이킹 영역의 세로 픽셀 크기
     * [EN] Height of the baking region in pixels
     * @param pixelX -
     * [KO] 베이킹 영역의 시작 X 픽셀 오프셋
     * [EN] Starting X pixel offset of the baking region
     * @param pixelZ -
     * [KO] 베이킹 영역의 시작 Z(Y) 픽셀 오프셋
     * [EN] Starting Z(Y) pixel offset of the baking region
     */
    dispatchBakePass(
        bindGroup: GPUBindGroup,
        pixelW: number,
        pixelH: number,
        pixelX: number,
        pixelZ: number
    ): void {
        const computePipeline = this.#computePipeline;
        if (!computePipeline) return;
        if (pixelW <= 0 || pixelH <= 0) return;

        const workgroupCountX = Math.max(1, Math.ceil(pixelW / this.#workgroupSize));
        const workgroupCountY = Math.max(1, Math.ceil(pixelH / this.#workgroupSize));

        this.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `Landscape_${this.#generatorLabel}_ComputePass_[${pixelX},${pixelZ}]`
            });
            pass.setPipeline(computePipeline);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
            pass.end();
        });
    }

    /**
     * [KO] 셰이더 모듈과 바인드 그룹 레이아웃 엔트리를 기반으로 기본 컴퓨트 파이프라인 및 유니폼 버퍼 풀을 초기화합니다.
     * [EN] Initializes the base compute pipeline and uniform buffer pool based on the shader module and bind group layout entries.
     *
     * @param shaderModuleKey -
     * [KO] 리소스 매니저에 등록할 셰이더 모듈 캐시 키
     * [EN] Shader module cache key to register in the resource manager
     * @param shaderCode -
     * [KO] WGSL 컴퓨트 셰이더 소스 코드
     * [EN] WGSL compute shader source code
     * @param layoutEntries -
     * [KO] 바인드 그룹 레이아웃 엔트리 배열 (`GPUBindGroupLayoutEntry[]`)
     * [EN] Array of bind group layout entries (`GPUBindGroupLayoutEntry[]`)
     * @param defaultUniformByteLength -
     * [KO] 초기 유니폼 버퍼 슬롯의 기본 바이트 크기 (기본값: 16)
     * [EN] Default byte length for initial uniform buffer slots (default: 16)
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
     * [KO] 유니폼 버퍼 풀을 파기하고 컴퓨트 파이프라인 참조를 해제합니다.
     * [EN] Destroys the uniform buffer pool and releases compute pipeline references.
     */
    destroy(): void {
        const count = this.#uniformBufferPool.length;
        for (let i = 0; i < count; i++) {
            try {
                this.#uniformBufferPool[i].destroy();
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
