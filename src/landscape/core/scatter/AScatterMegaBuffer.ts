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
     * [KO] 인스턴스 데이터 구조체 이름
     * [EN] Instance data struct name
     */
    instanceStructName: string;
    /**
     * [KO] 타입 파라미터 구조체 이름 (선택사항, 불필요한 경우 생략 가능)
     * [EN] Type parameter struct name (optional, omit if not needed)
     */
    typeParamStructName?: string;
}

/**
 * [KO] 스캐터 메가버퍼의 기본 세그먼트 할당 정보 인터페이스입니다.
 * [EN] Interface for base segment allocation info in scatter mega-buffer.
 */
export interface ScatterBaseSegmentAllocation {
    /**
     * [KO] 할당된 타입 고유 ID
     * [EN] Allocated unique type ID
     */
    typeId: number;
    /**
     * [KO] 할당된 타입 이름 (선택사항)
     * [EN] Allocated type name (optional)
     */
    name?: string;
    /**
     * [KO] 정렬 보정된 최대 인스턴스 용량
     * [EN] Aligned maximum instance capacity
     */
    maxInstances: number;
    /**
     * [KO] GPU 원본 인스턴스 버퍼 시작 오프셋
     * [EN] Raw instance buffer start offset
     */
    rawBaseOffset: number;
    /**
     * [KO] GPU 컬링 통과 인스턴스 버퍼 시작 오프셋
     * [EN] Culled instance buffer start offset
     */
    culledBaseOffset: number;
    /**
     * [KO] GPU 간접 드로우 인자 버퍼 슬롯 시작 오프셋
     * [EN] Indirect draw args buffer slot start offset
     */
    indirectBaseOffset: number;
    /**
     * [KO] 서브메시 개수
     * [EN] Number of sub-meshes
     */
    subMeshCount: number;
    /**
     * [KO] 현재 활성화된 인스턴스 수
     * [EN] Current active instance count
     */
    instanceCount: number;
}

/**
 * [KO] 보조 간접 드로우 버퍼 등록 정보 인터페이스입니다 (그림자, 추가 렌더 패스 등).
 * [EN] Interface for auxiliary indirect draw buffer registration info (shadow, additional render passes, etc.).
 */
export interface AuxiliaryIndirectBufferEntry {
    /**
     * [KO] 고유 식별자 키 (예: 'shadow', 'custom' 등)
     * [EN] Unique identifier key (e.g., 'shadow', 'custom', etc.)
     */
    key: string;
    /**
     * [KO] 리셋 대상 GPU 간접 드로우 버퍼
     * [EN] Target GPU indirect draw buffer to reset
     */
    targetGPUBuffer: GPUBuffer | null;
    /**
     * [KO] GPU 템플릿 복사 원본 버퍼 (COPY_SRC)
     * [EN] GPU template copy source buffer (COPY_SRC)
     */
    templateGPUBuffer: GPUBuffer | null;
    /**
     * [KO] CPU 템플릿 BufferSource 또는 ArrayBufferLike (GPU 큐 fallback용)
     * [EN] CPU template BufferSource or ArrayBufferLike (for GPU queue fallback)
     */
    cpuTemplateBuffer?: BufferSource | ArrayBufferLike | null;
    /**
     * [KO] 매 프레임 리셋 시 복사할 바이트 크기를 반환하는 콜백 함수 (생략 시 templateGPUBuffer 크기 전체)
     * [EN] Callback returning byte size to copy during per-frame reset (full size if omitted)
     */
    getResetByteSize?: () => number;
}

/**
 * [KO] 스캐터 시스템(Foliage, Grass 등)에서 대규모 인스턴스 데이터, 컬링 결과, 간접 드로우 버퍼를 관리하는 순수 GPU VRAM 추상 메가버퍼 기반 클래스입니다.
 * [EN] Pure GPU VRAM abstract mega-buffer base class managing massive instance data, culling results, and indirect draw buffers across the scatter system (Foliage, Grass, etc.).
 *
 * **[KO] 아키텍처 및 역할:**
 * - **VRAM 통합 관리 (Unified Mega-Buffer)**: 개별 스캐터 인스턴스 버퍼를 분할 생성하지 않고, 단일 원본 스토리지 버퍼(`rawGPUBuffer`)와 컬링 통과 스토리지 버퍼(`culledGPUBuffer`)에서 64바이트 배수로 정렬 할당하여 GPU 메모리 단편화를 제거합니다.
 * - **간접 드로우(Indirect Draw) 인프라 및 다중 버퍼 일괄 리셋**: WebGPU `drawIndexedIndirect`에 필요한 5개 u32 인자(indexCount, instanceCount, firstIndex, baseVertex, firstInstance) 버퍼를 일괄 생성하고, 사전 기록된 템플릿 버퍼(`COPY_SRC`)를 통해 매 프레임 단 1회의 `copyBufferToBuffer`로 드로우 인스턴스 수를 초고속 리셋(`resetMultiIndirectCommands`)합니다. 그림자(CSM) 등 추가 패스용 보조 버퍼(`registerAuxiliaryIndirectBuffer`)도 레지스트리에 등록하여 단일 파이프라인에서 일괄 초기화됩니다.
 * - **WGSL 셰이더 리플렉션 연동**: 런타임에 WGSL 셰이더 구조체(`GrassInstance`, `GrassTypeParam` 등)의 스트라이드 바이트 크기를 자동 리플렉션하여 CPU/GPU 메모리 레이아웃 불일치를 원천 방지합니다.
 * - **Zero-GC 아키텍처**: 매 프레임 렌더 루프 및 리셋 과정에서 일체의 임시 객체 생성을 배제하고 사전 할당된 버퍼를 재사용합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Unified VRAM Management**: Eliminates GPU memory fragmentation by allocating 64-byte aligned segments from single raw storage (`rawGPUBuffer`) and culled storage (`culledGPUBuffer`) buffers instead of fragmenting buffers per scatter species.
 * - **Multi-Draw Indirect Infrastructure & Batch Reset**: Allocates 5-u32 indirect draw arguments (indexCount, instanceCount, firstIndex, baseVertex, firstInstance) in a unified GPU buffer, executing ultra-fast reset of instance counts per frame via a single `copyBufferToBuffer` command (`resetMultiIndirectCommands`). Auxiliary indirect buffers for shadow cascades and additional passes (`registerAuxiliaryIndirectBuffer`) are registered and batch-reset in the same pipeline.
 * - **WGSL Shader Reflection Integration**: Automatically reflects byte strides of WGSL shader structs (`GrassInstance`, `GrassTypeParam`, etc.) at runtime to guarantee CPU/GPU memory layout synchronization.
 * - **Zero-GC Architecture**: Prohibits temporary object allocations during per-frame rendering and reset passes, relying exclusively on pre-allocated buffers.
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

    #totalAllocatedInstances: number = 0;
    #totalAllocatedCulledInstances: number = 0;
    #totalIndirectDrawCalls: number = 0;


    #cpuTypeParamsBuffer: Float32Array;
    #cpuTypeParamsUint32: Uint32Array;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #indirectResetTemplate: Uint32Array;
    #indirectResetTemplateGPUBuffer: GPUBuffer | null = null;

    #auxiliaryIndirectBuffers: AuxiliaryIndirectBufferEntry[] = [];

    #onRecreated: (() => void) | null = null;

    constructor(
        redGPUContext: RedGPUContext,
        reflectionConfig: ScatterShaderReflectionConfig,
        initialCapacity: number,
        maxTypes: number,
        maxSubMeshes: number
    ) {
        super(redGPUContext);

        const {shaderInfo, instanceStructName, typeParamStructName} = reflectionConfig;

        const strideBytes = shaderInfo.structs?.[instanceStructName]?.arrayBufferByteLength;

        if (!strideBytes) {
            throw new Error(`[AScatterMegaBuffer] Failed to reflect instance stride for "${instanceStructName}".`);
        }

        const typeParamBytes = typeParamStructName
            ? shaderInfo.structs?.[typeParamStructName]?.arrayBufferByteLength
            : 0;

        if (typeParamStructName && !typeParamBytes) {
            throw new Error(`[AScatterMegaBuffer] Failed to reflect type param struct size for "${typeParamStructName}".`);
        }

        this.#maxTypes = maxTypes;
        this.#maxSubMeshes = maxSubMeshes;
        this.#strideBytes = strideBytes;
        this.#strideFloats = strideBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#typeParamFloats = typeParamBytes ? typeParamBytes / Float32Array.BYTES_PER_ELEMENT : 0;

        this.#instanceCapacity = Math.ceil(initialCapacity / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;


        const typeParamsCount = this.#maxTypes * this.#typeParamFloats;
        this.#cpuTypeParamsBuffer = new Float32Array(typeParamsCount > 0 ? typeParamsCount : 1);
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

    /**
     * [KO] 각 스캐터 타입별 컬링 거리, 오프셋 등의 설정 파라미터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer storing configuration parameters such as culling distances and offsets for each scatter type.
     */
    get typeParamsGPUBuffer(): GPUBuffer | null {
        return this.#typeParamsGPUBuffer;
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
    get totalAllocatedInstances(): number {
        return this.#totalAllocatedInstances;
    }

    /**
     * [KO] 현재까지 등록된 모든 타입들의 총 할당 컬링 인스턴스 수를 반환합니다.
     * [EN] Returns the total allocated culled instance count across all registered types to date.
     */
    get totalAllocatedCulledInstances(): number {
        return this.#totalAllocatedCulledInstances;
    }

    /**
     * [KO] 현재까지 등록된 총 간접 드로우 슬롯(호출) 수를 반환합니다.
     * [EN] Returns the total number of indirect draw slots (calls) registered to date.
     */
    get totalIndirectDrawCalls(): number {
        return this.#totalIndirectDrawCalls;
    }

    /**
     * [KO] 새로운 스캐터 타입에 필요한 기본 VRAM 세그먼트를 할당하고 시작 오프셋들을 반환합니다.
     * [EN] Allocates a base VRAM segment for a new scatter type and returns starting offsets.
     * @param typeIdOrName -
     * [KO] 타입 ID 또는 고유 이름
     * [EN] Type ID or unique name
     * @param maxInstances -
     * [KO] 최대 허용 인스턴스 수
     * [EN] Maximum allowed instances
     * @param subMeshCount -
     * [KO] 서브메시(드로우 슬롯) 수
     * [EN] Number of sub-meshes (draw slots)
     * @param culledMultiplier -
     * [KO] 컬링 버퍼 배수 (기본값: 2, Foliage는 8)
     * [EN] Culled buffer multiplier (default: 2, Foliage is 8)
     * @returns
     * [KO] 할당된 기본 세그먼트 메타데이터 객체
     * [EN] Allocated base segment metadata object
     */
    allocateBaseSegment(
        typeIdOrName: number | string,
        maxInstances: number,
        subMeshCount: number,
        culledMultiplier: number = 2
    ): ScatterBaseSegmentAllocation {
        const alignedMax = Math.ceil(maxInstances / CULLING_WORKGROUP_SIZE) * CULLING_WORKGROUP_SIZE;
        this.ensureCapacity(this.#totalAllocatedInstances + alignedMax);

        const rawBaseOffset = this.#totalAllocatedInstances;
        const culledBaseOffset = this.#totalAllocatedCulledInstances;
        const indirectBaseOffset = this.#totalIndirectDrawCalls;

        this.#totalAllocatedInstances += alignedMax;
        this.#totalAllocatedCulledInstances += alignedMax * culledMultiplier;
        this.#totalIndirectDrawCalls += subMeshCount;

        const typeId = typeof typeIdOrName === 'number' ? typeIdOrName : 0;
        const name = typeof typeIdOrName === 'string' ? typeIdOrName : undefined;

        return {
            typeId,
            name,
            maxInstances: alignedMax,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            subMeshCount,
            instanceCount: 0
        };
    }

    /**
     * [KO] 단일 간접 드로우 슬롯의 인자들을 리셋 템플릿에 등록합니다.
     * [EN] Registers arguments of a single indirect draw slot to the reset template.
     * @param slotIndex -
     * [KO] 간접 드로우 슬롯 인덱스
     * [EN] Indirect draw slot index
     * @param indexCount -
     * [KO] 인덱스 개수
     * [EN] Index count
     * @param firstIndex -
     * [KO] 인덱스 버퍼 내 시작 오프셋 (기본값: 0)
     * [EN] Starting offset in index buffer (default: 0)
     * @param baseVertex -
     * [KO] 기준 정점 오프셋 (기본값: 0)
     * [EN] Base vertex offset (default: 0)
     * @param firstInstance -
     * [KO] 시작 인스턴스 오프셋 (기본값: 0)
     * [EN] First instance offset (default: 0)
     */
    registerIndirectDrawSlot(
        slotIndex: number,
        indexCount: number,
        firstIndex: number = 0,
        baseVertex: number = 0,
        firstInstance: number = 0
    ): void {
        const base = slotIndex * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
        const template = this.#indirectResetTemplate;
        template[base + 0] = indexCount;
        template[base + 1] = 0;
        template[base + 2] = firstIndex;
        template[base + 3] = baseVertex;
        template[base + 4] = firstInstance;
    }

    /**
     * [KO] CPU 간접 드로우 리셋 템플릿을 GPU 인디렉트 버퍼 및 템플릿 버퍼로 동기화합니다.
     * [EN] Synchronizes CPU indirect draw reset template to GPU indirect and template buffers.
     * @param slotIndex -
     * [KO] 동기화할 시작 슬롯 인덱스 (생략 시 전체 동기화)
     * [EN] Starting slot index to synchronize (omitted for full sync)
     * @param slotCount -
     * [KO] 동기화할 슬롯 개수
     * [EN] Number of slots to synchronize
     */
    syncIndirectResetTemplateToGPU(slotIndex?: number, slotCount?: number): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const indirectGPUBuffer = this.#indirectGPUBuffer;
        if (!indirectGPUBuffer) return;

        if (slotIndex !== undefined && slotCount !== undefined) {
            const byteOffset = slotIndex * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
            const byteSize = slotCount * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
            gpuDevice.queue.writeBuffer(
                indirectGPUBuffer,
                byteOffset,
                this.#indirectResetTemplate.buffer,
                byteOffset,
                byteSize
            );
            if (this.#indirectResetTemplateGPUBuffer) {
                gpuDevice.queue.writeBuffer(
                    this.#indirectResetTemplateGPUBuffer,
                    byteOffset,
                    this.#indirectResetTemplate.buffer,
                    byteOffset,
                    byteSize
                );
            }
        } else {
            const byteSize = this.#totalIndirectDrawCalls * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
            if (byteSize > 0) {
                gpuDevice.queue.writeBuffer(
                    indirectGPUBuffer,
                    0,
                    this.#indirectResetTemplate.buffer,
                    0,
                    byteSize
                );
                if (this.#indirectResetTemplateGPUBuffer) {
                    gpuDevice.queue.writeBuffer(
                        this.#indirectResetTemplateGPUBuffer,
                        0,
                        this.#indirectResetTemplate.buffer,
                        0,
                        byteSize
                    );
                }
            }
        }
    }

    /**
     * [KO] 그림자(CSM) 등 추가적인 보조 간접 드로우 GPU 버퍼를 등록합니다.
     * [EN] Registers an auxiliary indirect draw GPU buffer such as cascade shadow passes.
     * @param entry -
     * [KO] 등록할 보조 간접 드로우 버퍼 정보
     * [EN] Auxiliary indirect draw buffer entry to register
     */
    registerAuxiliaryIndirectBuffer(entry: AuxiliaryIndirectBufferEntry): void {
        const idx = this.#auxiliaryIndirectBuffers.findIndex(e => e.key === entry.key);
        if (idx >= 0) {
            this.#auxiliaryIndirectBuffers[idx] = entry;
        } else {
            this.#auxiliaryIndirectBuffers.push(entry);
        }
    }

    /**
     * [KO] 등록된 특정 보조 간접 드로우 버퍼를 해제합니다.
     * [EN] Unregisters a specific auxiliary indirect draw buffer.
     * @param key -
     * [KO] 해제할 보조 간접 드로우 버퍼 키
     * [EN] Auxiliary indirect draw buffer key to unregister
     */
    unregisterAuxiliaryIndirectBuffer(key: string): void {
        const idx = this.#auxiliaryIndirectBuffers.findIndex(e => e.key === key);
        if (idx >= 0) {
            this.#auxiliaryIndirectBuffers.splice(idx, 1);
        }
    }

    /**
     * [KO] 등록된 모든 보조 간접 드로우 버퍼를 제거합니다.
     * [EN] Clears all registered auxiliary indirect draw buffers.
     */
    clearAuxiliaryIndirectBuffers(): void {
        this.#auxiliaryIndirectBuffers.length = 0;
    }

    /**
     * [KO] 매 프레임 GPU 컬링 실행 전 메인 및 등록된 모든 보조 간접 드로우 인스턴스 카운트를 0으로 일괄 리셋합니다 (Zero-GC).
     * [EN] Resets instance counts to zero for main and all registered auxiliary indirect draw buffers before GPU culling executes every frame (Zero-GC).
     * @param commandEncoder -
     * [KO] 선택사항인 GPU 커맨드 인코더 (제공 시 copyBufferToBuffer 사용)
     * [EN] Optional GPU command encoder (uses copyBufferToBuffer if provided)
     */
    resetMultiIndirectCommands(commandEncoder?: GPUCommandEncoder): void {
        if (this.#totalIndirectDrawCalls === 0) return;

        // 1. 메인 간접 드로우 버퍼 리셋
        const indirectGPUBuffer = this.#indirectGPUBuffer;
        if (indirectGPUBuffer) {
            const byteSize = this.#totalIndirectDrawCalls * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;

            if (commandEncoder && this.#indirectResetTemplateGPUBuffer) {
                commandEncoder.copyBufferToBuffer(
                    this.#indirectResetTemplateGPUBuffer,
                    0,
                    indirectGPUBuffer,
                    0,
                    byteSize
                );
            } else {
                const gpuDevice = this.gpuDevice;
                if (gpuDevice) {
                    gpuDevice.queue.writeBuffer(
                        indirectGPUBuffer,
                        0,
                        this.#indirectResetTemplate.buffer,
                        0,
                        byteSize
                    );
                }
            }
        }

        // 2. 등록된 보조 간접 드로우 버퍼 일괄 리셋 (그림자 등, Zero-GC 루프)
        const auxList = this.#auxiliaryIndirectBuffers;
        const auxCount = auxList.length;
        if (auxCount > 0) {
            for (let i = 0; i < auxCount; i++) {
                const entry = auxList[i];
                const targetGPUBuffer = entry.targetGPUBuffer;
                if (!targetGPUBuffer) continue;

                const templateGPUBuffer = entry.templateGPUBuffer;
                const byteSize = entry.getResetByteSize ? entry.getResetByteSize() : (templateGPUBuffer?.size || 0);
                if (byteSize <= 0) continue;

                if (commandEncoder && templateGPUBuffer) {
                    commandEncoder.copyBufferToBuffer(
                        templateGPUBuffer,
                        0,
                        targetGPUBuffer,
                        0,
                        byteSize
                    );
                } else if (entry.cpuTemplateBuffer) {
                    const gpuDevice = this.gpuDevice;
                    if (gpuDevice) {
                        gpuDevice.queue.writeBuffer(
                            targetGPUBuffer,
                            0,
                            entry.cpuTemplateBuffer,
                            0,
                            byteSize
                        );
                    }
                }
            }
        }
    }

    /**
     * [KO] 기본 할당 카운트들을 0으로 리셋합니다.
     * [EN] Resets base allocation counts to zero.
     */
    clearBaseAllocations(): void {
        this.#totalAllocatedInstances = 0;
        this.#totalAllocatedCulledInstances = 0;
        this.#totalIndirectDrawCalls = 0;
    }

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

        const gpuDevice = this.gpuDevice;
        if (gpuDevice) {
            this.#rawGPUBuffer?.destroy();
            this.#rawGPUBuffer = gpuDevice.createBuffer({
                label: `${this.constructor.name}_RawInstances`,
                size: newCapacity * this.#strideBytes,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });

            this.onRawBufferCreated(this.#rawGPUBuffer, newCapacity);
        }

        this.onResizeBuffers(newCapacity);

        this.#onRecreated?.();
        return true;
    }

    /**
     * [KO] 메가버퍼 확장으로 인해 새 GPU rawGPUBuffer가 생성되었을 때 호출되는 훅 메서드입니다. 하위 클래스에서 데이터 복원 또는 CPU 동기화를 수행할 수 있습니다.
     * [EN] Hook method invoked when a new GPU rawGPUBuffer is created due to mega-buffer expansion. Subclasses can perform data restoration or CPU synchronization.
     * @param rawBuffer -
     * [KO] 새로 생성된 GPU 원본 인스턴스 버퍼
     * [EN] Newly created GPU raw instance buffer
     * @param newCapacity -
     * [KO] 새로 확장된 인스턴스 수용 용량
     * [EN] Newly expanded instance capacity
     */
    onRawBufferCreated(rawBuffer: GPUBuffer, newCapacity: number): void {
        // [KO] 순수 GPU 메가버퍼 기본 구현: 별도의 CPU 동기화를 수행하지 않음 (Zero-op)
        // [EN] Pure GPU mega-buffer default: No CPU synchronization performed (Zero-op)
    }

    /**
     * [KO] 메가버퍼의 모든 GPU 자원과 내부 메모리를 해제합니다.
     * [EN] Releases all GPU resources and internal memory of the mega-buffer.
     */
    destroy(): void {
        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#indirectResetTemplateGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();

        this.#rawGPUBuffer = null;
        this.#culledGPUBuffer = null;
        this.#indirectGPUBuffer = null;
        this.#indirectResetTemplateGPUBuffer = null;
        this.#typeParamsGPUBuffer = null;

        this.clearAuxiliaryIndirectBuffers();
        this.invalidateUnifiedCullingBindGroup();

        this.onDestroy();
    }

    /**
     * [KO] 캐시된 단일 일괄 컬링 바인드그룹을 무효화합니다 (메가버퍼 재생성, 타입 등록, 해제 시 호출).
     * [EN] Invalidates the cached unified culling bind group (called on buffer recreation, type registration, destruction).
     */
    abstract invalidateUnifiedCullingBindGroup(): void;

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

        if (typeParamsByteSize > 0) {
            this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
                label: `${this.constructor.name}_TypeParams`,
                size: typeParamsByteSize,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
        }

        const indirectByteSize = Math.max(
            this.#maxSubMeshes * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT,
            64
        );

        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: `${this.constructor.name}_Indirect_Main`,
            size: indirectByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
        });

        this.#indirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: `${this.constructor.name}_Indirect_Template`,
            size: indirectByteSize,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(AScatterMegaBuffer);
export default AScatterMegaBuffer;
