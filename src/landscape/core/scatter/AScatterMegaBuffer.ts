import RedGPUObject from '../../../base/RedGPUObject';
import RedGPUContext from '../../../context/RedGPUContext';

/**
 * [KO] GPU 컬링 연산 워크그룹 크기 상수 (기본 64)
 * [EN] GPU culling compute workgroup size constant (default 64)
 */
export const CULLING_WORKGROUP_SIZE = 64;

/**
 * [KO] WebGPU DrawIndexedIndirect 호출 1건당 인자 개수 (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
 * [EN] Number of arguments per WebGPU DrawIndexedIndirect call (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
 */
export const DRAW_INDEXED_INDIRECT_ARGS_COUNT = 5;

/**
 * [KO] 스캐터 셰이더 메타데이터 리플렉션 설정 인터페이스입니다.
 * [EN] Interface for scatter shader metadata reflection configuration.
 */
export interface ScatterShaderReflectionConfig {
    /**
     * [KO] 파싱된 WGSL 셰이더 정보 객체
     * [EN] Parsed WGSL shader information object
     */
    shaderInfo: any;
    /**
     * [KO] 인스턴스 스토리지 버퍼 이름 (선택사항)
     * [EN] Instance storage buffer name (optional)
     */
    rawStorageName?: string;
    /**
     * [KO] 인스턴스 데이터 구조체 이름
     * [EN] Instance data struct name
     */
    instanceStructName: string;
    /**
     * [KO] 타입 파라미터 구조체 이름
     * [EN] Type parameter struct name
     */
    typeParamStructName: string;
}

/**
 * [KO] 스캐터 시스템(Foliage, Grass 등)에서 대규모 인스턴스 데이터, 컬링 결과, 간접 드로우 버퍼를 관리하는 공통 추상 메가버퍼 기반 클래스입니다.
 * [EN] Common abstract mega-buffer base class managing massive instance data, culling results, and indirect draw buffers across the scatter system (Foliage, Grass, etc.).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 내부적으로 관리되는 추상 클래스입니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class managed internally by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export abstract class AScatterMegaBuffer extends RedGPUObject {
    #instanceCapacity: number;
    #strideFloats: number;
    #strideBytes: number;
    #typeParamFloats: number;
    #maxSubMeshes: number;
    #maxTypes: number;

    #cpuRawDataBuffer: Float32Array;
    #cpuRawDataUint32: Uint32Array;

    #cpuTypeParamsBuffer: Float32Array;
    #cpuTypeParamsUint32: Uint32Array;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #indirectResetTemplate: Uint32Array;

    #onRecreated: (() => void) | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        reflectionConfig: ScatterShaderReflectionConfig,
        initialCapacity: number,
        maxTypes: number,
        maxSubMeshes: number
    ) {
        super(redGPUContext);

        const {shaderInfo, rawStorageName, instanceStructName, typeParamStructName} = reflectionConfig;

        const strideBytes =
            (rawStorageName ? shaderInfo.storage?.[rawStorageName]?.stride : undefined) ||
            shaderInfo.structs?.[instanceStructName]?.arrayBufferByteLength;

        if (!strideBytes) {
            throw new Error(`[AScatterMegaBuffer] Failed to reflect instance stride for "${instanceStructName}".`);
        }

        const typeParamBytes = shaderInfo.structs?.[typeParamStructName]?.arrayBufferByteLength;
        if (!typeParamBytes) {
            throw new Error(`[AScatterMegaBuffer] Failed to reflect type param struct size for "${typeParamStructName}".`);
        }

        this.#maxTypes = maxTypes;
        this.#maxSubMeshes = maxSubMeshes;
        this.#strideBytes = strideBytes;
        this.#strideFloats = strideBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#typeParamFloats = typeParamBytes / Float32Array.BYTES_PER_ELEMENT;

        this.#instanceCapacity = Math.ceil(initialCapacity / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;

        this.#cpuRawDataBuffer = new Float32Array(this.#instanceCapacity * this.#strideFloats);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);

        this.#cpuTypeParamsBuffer = new Float32Array(this.#maxTypes * this.#typeParamFloats);
        this.#cpuTypeParamsUint32 = new Uint32Array(this.#cpuTypeParamsBuffer.buffer);

        this.#indirectResetTemplate = new Uint32Array(this.#maxSubMeshes * DRAW_INDEXED_INDIRECT_ARGS_COUNT);

        this.#initBaseBuffers();
    }

    /**
     * [KO] 인스턴스 데이터의 바이트 단위 스트라이드 크기를 반환합니다.
     * [EN] Returns the byte stride size of instance data.
     */
    get strideBytes(): number {
        return this.#strideBytes;
    }

    /**
     * [KO] 인스턴스 데이터의 Float32 단위 스트라이드 크기를 반환합니다.
     * [EN] Returns the Float32 stride size of instance data.
     */
    get strideFloats(): number {
        return this.#strideFloats;
    }

    /**
     * [KO] 타입 파라미터 구조체의 Float32 단위 크기를 반환합니다.
     * [EN] Returns the Float32 size of type parameter struct.
     */
    get typeParamFloats(): number {
        return this.#typeParamFloats;
    }

    /**
     * [KO] 지원할 최대 간접 드로우(서브메시) 슬롯 수
     * [EN] Maximum indirect draw (sub-mesh) slots supported
     */
    get maxSubMeshes(): number {
        return this.#maxSubMeshes;
    }

    /**
     * [KO] 최대 지원 타입 수
     * [EN] Maximum supported types
     */
    get maxTypes(): number {
        return this.#maxTypes;
    }

    /**
     * [KO] 현재 할당된 메가버퍼의 최대 수용 인스턴스 용량을 반환합니다.
     * [EN] Returns the maximum instance capacity of the currently allocated mega-buffer.
     */
    get instanceCapacity(): number {
        return this.#instanceCapacity;
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
     * [KO] CPU 스테이징 타입 파라미터 데이터 버퍼를 반환합니다.
     * [EN] Returns the CPU staging type parameters data buffer.
     */
    get cpuTypeParamsBuffer(): Float32Array {
        return this.#cpuTypeParamsBuffer;
    }

    /**
     * [KO] CPU 스테이징 타입 파라미터 데이터 버퍼(Uint32 뷰)를 반환합니다.
     * [EN] Returns the CPU staging type parameters data buffer (Uint32 view).
     */
    get cpuTypeParamsUint32(): Uint32Array {
        return this.#cpuTypeParamsUint32;
    }

    /**
     * [KO] 간접 드로우 리셋 템플릿 배열을 반환합니다.
     * [EN] Returns the indirect draw reset template array.
     */
    get indirectResetTemplate(): Uint32Array {
        return this.#indirectResetTemplate;
    }

    /**
     * [KO] 모든 인스턴스의 원본 배치 데이터(위치, 스케일, 회전 쿼터니언, 바운딩, 지면색 등)를 보관하는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer holding raw placement data (position, scale, rotation quaternion, bounding, ground color, etc.) for all instances.
     */
    get rawGPUBuffer(): GPUBuffer | null {
        return this.#rawGPUBuffer;
    }

    set rawGPUBuffer(buffer: GPUBuffer | null) {
        this.#rawGPUBuffer = buffer;
    }

    /**
     * [KO] GPU 거리 및 프러스텀 컬링을 통과한 인스턴스 데이터가 기록되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where instances passing GPU distance and frustum culling are recorded.
     */
    get culledGPUBuffer(): GPUBuffer | null {
        return this.#culledGPUBuffer;
    }

    set culledGPUBuffer(buffer: GPUBuffer | null) {
        this.#culledGPUBuffer = buffer;
    }

    /**
     * [KO] 간접 드로우(`drawIndexedIndirect`) 호출에 사용되는 GPU 인디렉트 버퍼를 반환합니다.
     * [EN] Returns the GPU indirect buffer used for indirect draw (`drawIndexedIndirect`) calls.
     */
    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#indirectGPUBuffer;
    }

    set indirectGPUBuffer(buffer: GPUBuffer | null) {
        this.#indirectGPUBuffer = buffer;
    }

    /**
     * [KO] 각 스캐터 타입별 컬링 거리, 오프셋 등의 설정 파라미터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer storing configuration parameters such as culling distances and offsets for each scatter type.
     */
    get typeParamsGPUBuffer(): GPUBuffer | null {
        return this.#typeParamsGPUBuffer;
    }

    set typeParamsGPUBuffer(buffer: GPUBuffer | null) {
        this.#typeParamsGPUBuffer = buffer;
    }

    /**
     * [KO] 인스턴스 수 증가로 인해 메가버퍼가 확장·재생성되었을 때 호출될 콜백 함수를 반환합니다.
     * [EN] Returns the callback function to be invoked when the mega-buffer is resized and recreated due to instance count growth.
     */
    get onRecreated(): (() => void) | null {
        return this.#onRecreated;
    }

    /**
     * [KO] 인스턴스 수 증가로 인해 메가버퍼가 확장·재생성되었을 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when the mega-buffer is resized and recreated due to instance count growth.
     */
    set onRecreated(cb: (() => void) | null) {
        this.#onRecreated = cb;
    }

    /**
     * [KO] 현재까지 등록된 모든 타입들의 총 할당 인스턴스 수를 반환합니다.
     * [EN] Returns the total allocated instance count across all registered types to date.
     */
    abstract get totalAllocatedInstances(): number;

    /**
     * [KO] 요청된 용량을 수용할 수 있도록 메가 버퍼의 크기를 검사하고 필요한 경우 2배 단위로 확장합니다.
     * [EN] Checks the mega buffer capacity and expands it in power-of-two increments if necessary to accommodate the requested capacity.
     * @param requiredCapacity -
     * [KO] 필요한 총 인스턴스 수용 용량
     * [EN] Required total instance capacity
     * @returns
     * [KO] 버퍼가 재할당되어 확장되었으면 true, 아니면 false
     * [EN] True if buffers were reallocated/expanded, false otherwise
     */
    ensureCapacity(requiredCapacity: number): boolean {
        if (requiredCapacity <= this.#instanceCapacity) {
            return false;
        }

        let newCapacity = this.#instanceCapacity;
        while (newCapacity < requiredCapacity) {
            newCapacity = Math.ceil((newCapacity * 2) / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;
        }

        this.#instanceCapacity = newCapacity;

        const oldCpuBuffer = this.#cpuRawDataBuffer;
        this.#cpuRawDataBuffer = new Float32Array(newCapacity * this.#strideFloats);
        this.#cpuRawDataBuffer.set(oldCpuBuffer);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);

        const gpuDevice = this.gpuDevice;
        if (gpuDevice) {
            this.#rawGPUBuffer?.destroy();
            this.#rawGPUBuffer = gpuDevice.createBuffer({
                label: `${this.constructor.name}_RawInstances`,
                size: newCapacity * this.#strideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });

            const totalAllocated = this.totalAllocatedInstances;
            if (totalAllocated > 0) {
                gpuDevice.queue.writeBuffer(
                    this.#rawGPUBuffer,
                    0,
                    this.#cpuRawDataBuffer.buffer,
                    this.#cpuRawDataBuffer.byteOffset,
                    totalAllocated * this.#strideBytes
                );
            }
        }

        this.onResizeBuffers(newCapacity);

        this.#onRecreated?.();
        return true;
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
        if (!gpuDevice || !this.#rawGPUBuffer || count <= 0) return;

        const strideBytes = this.#strideBytes;
        const startByteOffset = startInstance * strideBytes;
        const byteCount = count * strideBytes;

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            startByteOffset,
            this.#cpuRawDataBuffer.buffer,
            this.#cpuRawDataBuffer.byteOffset + startByteOffset,
            byteCount
        );
    }

    /**
     * [KO] 메가버퍼의 모든 GPU 자원과 내부 메모리를 해제합니다.
     * [EN] Releases all GPU resources and internal memory of the mega-buffer.
     */
    destroy(): void {
        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();

        this.#rawGPUBuffer = null;
        this.#culledGPUBuffer = null;
        this.#indirectGPUBuffer = null;
        this.#typeParamsGPUBuffer = null;

        this.onDestroy();
    }

    /**
     * [KO] 버퍼 확장 발생 시 서브클래스별 특화 GPU 버퍼(컬링 버퍼, 그림자 버퍼 등)를 재할당하는 훅 메서드입니다.
     * [EN] Hook method that reallocates subclass-specific GPU buffers (culled buffer, shadow buffers, etc.) when buffer expansion occurs.
     */
    abstract onResizeBuffers(newCapacity: number): void;

    /**
     * [KO] 메가버퍼 해제 시 서브클래스별 특화 GPU 자원을 정리하는 훅 메서드입니다.
     * [EN] Hook method that cleans up subclass-specific GPU resources when the mega-buffer is destroyed.
     */
    abstract onDestroy(): void;

    /**
     * [KO] 공통 기본 GPU 버퍼(rawGPUBuffer, typeParamsGPUBuffer)를 초기화합니다.
     * [EN] Initializes common base GPU buffers (rawGPUBuffer, typeParamsGPUBuffer).
     */
    #initBaseBuffers(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const rawByteSize = Math.max(this.#instanceCapacity * this.#strideBytes, 64);
        const typeParamsByteSize = this.#maxTypes * this.#typeParamFloats * Float32Array.BYTES_PER_ELEMENT;

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: `${this.constructor.name}_RawInstances`,
            size: rawByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
            label: `${this.constructor.name}_TypeParams`,
            size: typeParamsByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(AScatterMegaBuffer);
