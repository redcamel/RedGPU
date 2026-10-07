/**
 * [KO] CPU 스테이징 버퍼를 통해 인스턴스 데이터를 관리하고 GPU로 전송하는 스캐터 메가버퍼 확장 추상 클래스입니다.
 * [EN] Scatter mega-buffer extended abstract class that manages instance data via CPU staging buffers and uploads to the GPU.
 * @packageDocumentation
 */
import RedGPUContext from '../../../context/RedGPUContext';
import AScatterMegaBuffer, {ScatterShaderReflectionConfig} from './AScatterMegaBuffer';

/**
 * [KO] CPU 메모리 상에서 대규모 인스턴스 배열을 조작/스트리밍하고 이를 GPU VRAM(rawGPUBuffer)으로 일괄 업로드하는 메가버퍼 추상 클래스입니다.
 * [EN] Abstract mega-buffer class that manipulates/streams massive instance arrays in CPU memory and batch-uploads them to GPU VRAM (rawGPUBuffer).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **CPU 메모리 스테이징**: 인스턴스 추가, 슬롯 패킹, 서브셀 마운트/언마운트 연산을 CPU 시스템 RAM 상의 단일 `Float32Array`(`cpuRawDataBuffer`)에서 수행합니다.
 * - **GPU 선택적 전송 (`uploadInstances`)**: 변경된 인스턴스 구간만을 선택하여 WebGPU 큐(`writeBuffer`)를 통해 VRAM의 `rawGPUBuffer`로 고속 전송합니다.
 * - **동적 확장 시 VRAM 복원 동기화**: `ensureCapacity`로 메가버퍼가 확장 재할당될 때, 기존 CPU 인스턴스 데이터 배열을 2배로 확장하고 새 GPU 버퍼로 이전 데이터를 자동 동기화합니다.
 * - **Zero-GC 아키텍처**: 매 프레임 스트리밍 및 갱신 시 임시 객체를 생성하지 않고 사전 할당된 CPU 배열 버퍼를 재사용합니다.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class ACpuStagedScatterMegaBuffer extends AScatterMegaBuffer {
    #cpuRawDataBuffer: Float32Array;
    #cpuRawDataUint32: Uint32Array;

    /**
     * [KO] ACpuStagedScatterMegaBuffer 인스턴스를 초기화하고 CPU 스테이징 TypedArray를 할당합니다.
     * [EN] Initializes an ACpuStagedScatterMegaBuffer instance and allocates CPU staging TypedArrays.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param reflectionConfig -
     * [KO] 셰이더 메타데이터 리플렉션 설정 객체
     * [EN] Shader metadata reflection configuration object
     * @param initialCapacity -
     * [KO] 초기 최대 수용 인스턴스 수
     * [EN] Initial maximum instance capacity
     * @param maxTypes -
     * [KO] 최대 지원 스캐터 타입 개수
     * [EN] Maximum supported scatter types count
     * @param maxSubMeshes -
     * [KO] 최대 지원 서브메시(드로우 슬롯) 개수
     * [EN] Maximum supported sub-meshes (draw slots) count
     */
    constructor(
        redGPUContext: RedGPUContext,
        reflectionConfig: ScatterShaderReflectionConfig,
        initialCapacity: number,
        maxTypes: number,
        maxSubMeshes: number
    ) {
        super(redGPUContext, reflectionConfig, initialCapacity, maxTypes, maxSubMeshes);

        this.#cpuRawDataBuffer = new Float32Array(this.instanceCapacity * this.strideFloats);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);
    }

    /**
     * [KO] CPU 스테이징 원시 인스턴스 데이터 버퍼를 반환합니다.
     * [EN] Returns the CPU staging raw instance data buffer.
     */
    get cpuRawDataBuffer(): Float32Array {
        return this.#cpuRawDataBuffer;
    }

    /**
     * [KO] CPU 스테이징 원시 인스턴스 데이터 버퍼(Uint32 뷰)를 반환합니다.
     * [EN] Returns the CPU staging raw instance data buffer (Uint32 view).
     */
    get cpuRawDataUint32(): Uint32Array {
        return this.#cpuRawDataUint32;
    }

    /**
     * [KO] CPU 스테이징 버퍼의 인스턴스 데이터를 GPU 원본 버퍼(rawGPUBuffer)로 일괄 업로드합니다.
     * [EN] Batch uploads instance data in CPU staging buffer to GPU raw buffer (rawGPUBuffer).
     * @param startInstance -
     * [KO] 시작 인스턴스 인덱스
     * [EN] Starting instance index
     * @param count -
     * [KO] 업로드할 인스턴스 수
     * [EN] Number of instances to upload
     */
    uploadInstances(startInstance: number, count: number): void {
        const gpuDevice = this.gpuDevice;
        const rawBuffer = this.rawGPUBuffer;
        if (!gpuDevice || !rawBuffer || count <= 0) return;

        const strideBytes = this.strideBytes;
        const startByteOffset = startInstance * strideBytes;
        const byteCount = count * strideBytes;

        gpuDevice.queue.writeBuffer(
            rawBuffer,
            startByteOffset,
            this.#cpuRawDataBuffer.buffer,
            this.#cpuRawDataBuffer.byteOffset + startByteOffset,
            byteCount
        );
    }

    /**
     * [KO] 메가버퍼의 런타임 확장으로 인해 새 GPU rawBuffer가 생성되었을 때 호출되는 훅 메서드입니다. CPU 버퍼를 2배로 확장하고 이전 데이터를 새 GPU 버퍼로 복원합니다.
     * [EN] Hook method invoked when a new GPU rawBuffer is created due to runtime mega-buffer expansion. Expands CPU buffer by 2x and restores previous data to the new GPU buffer.
     * @param rawBuffer -
     * [KO] 새로 생성된 GPU 원본 인스턴스 버퍼
     * [EN] Newly created GPU raw instance buffer
     * @param newCapacity -
     * [KO] 새로 확장된 인스턴스 수용 용량
     * [EN] Newly expanded instance capacity
     */
    override onRawBufferCreated(rawBuffer: GPUBuffer, newCapacity: number): void {
        const oldCpuBuffer = this.#cpuRawDataBuffer;
        this.#cpuRawDataBuffer = new Float32Array(newCapacity * this.strideFloats);
        if (oldCpuBuffer) {
            this.#cpuRawDataBuffer.set(oldCpuBuffer);
        }
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);

        const gpuDevice = this.gpuDevice;
        const totalAllocated = this.totalAllocatedInstances;
        if (gpuDevice && totalAllocated > 0) {
            gpuDevice.queue.writeBuffer(
                rawBuffer,
                0,
                this.#cpuRawDataBuffer.buffer,
                this.#cpuRawDataBuffer.byteOffset,
                totalAllocated * this.strideBytes
            );
        }
    }
}

Object.freeze(ACpuStagedScatterMegaBuffer);
export default ACpuStagedScatterMegaBuffer;
