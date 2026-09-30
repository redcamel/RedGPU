/**
 * [KO] 잔디 인스턴스/컬링/간접 드로우 통합 VRAM 메가 버퍼 모듈입니다.
 * [EN] Unified VRAM mega buffer module for grass instances, culling, and indirect draws.
 * @packageDocumentation
 */
import type RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import grassCullComputeWGSL from "../culling/grassCullCompute.wgsl";

/**
 * [KO] 잔디 렌더링 시 거리별(Near/Far) LOD 단계에 대응하는 간접 드로우 슬롯 정보 인터페이스입니다.
 * [EN] Indirect draw slot information interface corresponding to near/far LOD distance stages in grass rendering.
 */
export interface GrassDrawSlot {
    /**
     * [KO] 슬롯 인덱스 (0: Near 스테이지, 1: Far 스테이지)
     * [EN] Slot index (0: Near stage, 1: Far stage)
     */
    slotIndex: number;
    /**
     * [KO] Indirect Draw 호출 버퍼 내 오프셋 인덱스
     * [EN] Offset index within the indirect draw call buffer
     */
    indirectOffset: number;
    /**
     * [KO] 컬링된 인스턴스 버퍼 내 기본 시작 오프셋
     * [EN] Base starting offset within the culled instance buffer
     */
    culledBaseOffset: number;
    /**
     * [KO] 잔디 메시의 인덱스 수
     * [EN] Index count of the grass mesh
     */
    indexCount: number;
}

/**
 * [KO] 잔디 종류별로 메가버퍼 내에 할당된 메모리 및 슬롯 정보 인터페이스입니다.
 * [EN] Memory and slot allocation information interface allocated within the mega-buffer for each grass type.
 */
export interface GrassTypeAllocation {
    /**
     * [KO] 해당 잔디 타입에 할당된 최대 인스턴스 수
     * [EN] Maximum instances allocated for this grass type
     */
    maxInstances: number;
    /**
     * [KO] 원본 인스턴스 버퍼(rawGPUBuffer) 내 시작 오프셋
     * [EN] Starting offset within the raw instance buffer (rawGPUBuffer)
     */
    rawBaseOffset: number;
    /**
     * [KO] 컬링된 인스턴스 버퍼(culledGPUBuffer) 내 시작 오프셋
     * [EN] Starting offset within the culled instance buffer (culledGPUBuffer)
     */
    culledBaseOffset: number;
    /**
     * [KO] 간접 드로우 버퍼(indirectGPUBuffer) 내 시작 오프셋
     * [EN] Starting offset within the indirect draw buffer (indirectGPUBuffer)
     */
    indirectBaseOffset: number;
    /**
     * [KO] 현재 활성화된 인스턴스 수
     * [EN] Current active instance count
     */
    instanceCount: number;
    /**
     * [KO] Near 및 Far 거리 단계별 간접 드로우 슬롯 튜플
     * [EN] Tuple of indirect draw slots for Near and Far distance stages
     */
    slots: [GrassDrawSlot, GrassDrawSlot];
}

/**
 * [KO] 대규모 지형 잔디 시스템의 모든 인스턴스 데이터, 컬링 결과, 간접 드로우(Indirect Draw) 버퍼를 단일 VRAM 영역에서 통합 관리하는 메가버퍼 클래스입니다.
 * [EN] Mega-buffer class that integrally manages all instance data, culling results, and indirect draw buffers for the large-scale terrain grass system within a unified VRAM region.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
/**
 * [KO] WebGPU DrawIndexedIndirect 호출 1건당 인자 개수 (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
 * [EN] Number of arguments per WebGPU DrawIndexedIndirect call (indexCount, instanceCount, firstIndex, baseVertex, firstInstance)
 */
const DRAW_INDEXED_INDIRECT_ARGS_COUNT = 5;

export class GrassMegaBuffer extends RedGPUObject {
    #strideFloats: number;
    #strideBytes: number;
    #typeParamFloats: number;
    #maxIndirectCalls: number;
    #instanceCapacity: number;
    #maxTypes: number;

    #cpuRawDataBuffer: Float32Array;

    #cpuTypeParamsBuffer: Float32Array;
    #cpuTypeParamsUint32: Uint32Array;
    #indirectResetTemplate: Uint32Array;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #allocations: Map<number, GrassTypeAllocation> = new Map();
    #totalAllocatedInstances: number = 0;
    #totalAllocatedCulledInstances: number = 0;
    #totalIndirectDrawCalls: number = 0;

    #onRecreated: (() => void) | null = null;

    /**
     * [KO] GrassMegaBuffer 인스턴스를 생성하고 초기 VRAM 버퍼 및 템플릿 메모리를 초기화합니다. (사용자가 직접 생성하지 마시고 `landscape.grassManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a GrassMegaBuffer instance and initializes initial VRAM buffers and template memory. (Do not instantiate directly; access via the `landscape.grassManager` property instead.)
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param initialCapacity -
     * [KO] 초기 최대 수용 인스턴스 수 (기본값: 131,072)
     * [EN] Initial maximum instance capacity (default: 131,072)
     * @param maxTypes -
     * [KO] 지원할 최대 잔디 타입 개수 (기본값: 16)
     * [EN] Maximum number of grass types supported (default: 16)
     */
    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 131072,
        maxTypes: number = 16
    ) {
        super(redGPUContext);

        const shaderInfo = redGPUContext.resourceManager.wgslParser.parse(
            'Grass_Cull_ShaderModule',
            grassCullComputeWGSL
        );
        const strideBytes =
            shaderInfo.storage?.['rawInstances']?.stride ||
            shaderInfo.structs?.['GrassInstance']?.arrayBufferByteLength;

        if (!strideBytes) {
            throw new Error('[GrassMegaBuffer] Failed to reflect instance stride from grassCullComputeWGSL.');
        }

        const typeParamBytes = shaderInfo.structs?.['GrassTypeParam']?.arrayBufferByteLength;
        if (!typeParamBytes) {
            throw new Error('[GrassMegaBuffer] Failed to reflect "GrassTypeParam" struct size from grassCullComputeWGSL.');
        }

        this.#strideBytes = strideBytes;
        this.#strideFloats = strideBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#typeParamFloats = typeParamBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#maxTypes = maxTypes;
        this.#maxIndirectCalls = maxTypes * 2;
        this.#instanceCapacity = Math.ceil(initialCapacity / 64) * 64;

        this.#cpuRawDataBuffer = new Float32Array(this.#instanceCapacity * this.#strideFloats);

        this.#cpuTypeParamsBuffer = new Float32Array(this.#maxTypes * this.#typeParamFloats);
        this.#cpuTypeParamsUint32 = new Uint32Array(this.#cpuTypeParamsBuffer.buffer);
        this.#indirectResetTemplate = new Uint32Array(this.#maxIndirectCalls * DRAW_INDEXED_INDIRECT_ARGS_COUNT);

        this.#initBuffers();
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
     * [EN] Returns the Float32 size of the type parameter struct.
     */
    get typeParamFloats(): number {
        return this.#typeParamFloats;
    }

    /**
     * [KO] 지원 가능한 최대 잔디 타입 개수를 반환합니다.
     * [EN] Returns the maximum supported grass types count.
     */
    get maxTypes(): number {
        return this.#maxTypes;
    }

    /**
     * [KO] 모든 잔디 인스턴스의 원본 배치 데이터(위치, 스케일, 회전 쿼터니언, 바운딩, 지면색)를 보관하는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer holding raw placement data (position, scale, rotation quaternion, bounding, ground color) for all grass instances.
     */
    get rawGPUBuffer(): GPUBuffer | null {
        return this.#rawGPUBuffer;
    }

    /**
     * [KO] CPU 스테이징 원시 인스턴스 데이터 버퍼를 반환합니다.
     * [EN] Returns the CPU staging raw instance data buffer.
     */
    get cpuRawDataBuffer(): Float32Array {
        return this.#cpuRawDataBuffer;
    }

    /**
     * [KO] GPU 거리 및 프러스텀 컬링을 통과한 인스턴스 데이터가 기록되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where instances passing GPU distance and frustum culling are recorded.
     */
    get culledGPUBuffer(): GPUBuffer | null {
        return this.#culledGPUBuffer;
    }

    /**
     * [KO] 간접 드로우(`drawIndexedIndirect`) 호출에 사용되는 GPU 인디렉트 버퍼를 반환합니다.
     * [EN] Returns the GPU indirect buffer used for indirect draw (`drawIndexedIndirect`) calls.
     */
    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#indirectGPUBuffer;
    }

    /**
     * [KO] 각 잔디 타입별 컬링 거리, 오프셋, 경사도 필터 등의 설정 파라미터가 저장된 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer storing configuration parameters such as culling distances, offsets, and slope filters for each grass type.
     */
    get typeParamsGPUBuffer(): GPUBuffer | null {
        return this.#typeParamsGPUBuffer;
    }

    /**
     * [KO] 현재까지 등록된 모든 잔디 타입들의 총 할당 인스턴스 수를 반환합니다.
     * [EN] Returns the total allocated instance count across all registered grass types to date.
     */
    get totalAllocatedInstances(): number {
        return this.#totalAllocatedInstances;
    }

    /**
     * [KO] 현재 할당된 메가버퍼의 최대 수용 인스턴스 용량을 반환합니다.
     * [EN] Returns the maximum instance capacity of the currently allocated mega-buffer.
     */
    get instanceCapacity(): number {
        return this.#instanceCapacity;
    }

    /**
     * [KO] 등록된 총 간접 드로우 호출 슬롯 수를 반환합니다.
     * [EN] Returns the total number of registered indirect draw call slots.
     */
    get totalIndirectDrawCalls(): number {
        return this.#totalIndirectDrawCalls;
    }

    /**
     * [KO] 잔디 인스턴스 수 증가로 인해 메가버퍼가 확장·재생성되었을 때 호출될 콜백 함수를 반환합니다.
     * [EN] Returns the callback function to be invoked when the mega-buffer is resized and recreated due to instance count growth.
     */
    get onRecreated(): (() => void) | null {
        return this.#onRecreated;
    }

    /**
     * [KO] 잔디 인스턴스 수 증가로 인해 메가버퍼가 확장·재생성되었을 때 호출될 콜백 함수를 설정합니다.
     * [EN] Sets the callback function to be invoked when the mega-buffer is resized and recreated due to instance count growth.
     */
    set onRecreated(cb: (() => void) | null) {
        this.#onRecreated = cb;
    }

    /**
     * [KO] 특정 잔디 타입에 대해 필요한 인스턴스 메모리 공간과 Near/Far 간접 드로우 슬롯을 할당합니다.
     * [EN] Allocates required instance memory space and Near/Far indirect draw slots for a specific grass type.
     *
     * @param typeId -
     * [KO] 잔디 타입의 고유 ID
     * [EN] Unique ID of the grass type
     * @param maxInstances -
     * [KO] 해당 타입에 필요한 최대 인스턴스 수
     * [EN] Maximum instances required for this type
     * @param indexCount -
     * [KO] 잔디 메시의 인덱스 수
     * [EN] Index count of the grass mesh
     * @returns
     * [KO] 할당된 오프셋 및 슬롯 정보 {@link GrassTypeAllocation}
     * [EN] Allocated offset and slot information {@link GrassTypeAllocation}
     */
    allocateType(
        typeId: number,
        maxInstances: number,
        indexCount: number
    ): GrassTypeAllocation {
        const rounded = Math.ceil(maxInstances / 64) * 64;
        const totalCulledNeeded = rounded * 2;

        if (
            this.#totalAllocatedInstances + rounded > this.#instanceCapacity ||
            this.#totalAllocatedCulledInstances + totalCulledNeeded > this.#instanceCapacity * 2
        ) {
            this.#resizeBuffer(Math.max(this.#instanceCapacity * 2, this.#totalAllocatedInstances + rounded));
        }

        const rawBaseOffset = this.#totalAllocatedInstances;
        const indirectBaseOffset = this.#totalIndirectDrawCalls;
        const culledBaseOffset = this.#totalAllocatedCulledInstances;

        const nearSlot: GrassDrawSlot = {
            slotIndex: 0,
            indirectOffset: this.#totalIndirectDrawCalls++,
            culledBaseOffset: this.#totalAllocatedCulledInstances,
            indexCount
        };
        this.#totalAllocatedCulledInstances += rounded;

        const farSlot: GrassDrawSlot = {
            slotIndex: 1,
            indirectOffset: this.#totalIndirectDrawCalls++,
            culledBaseOffset: this.#totalAllocatedCulledInstances,
            indexCount
        };
        this.#totalAllocatedCulledInstances += rounded;

        this.#updateIndirectTemplateForSlot(nearSlot);
        this.#updateIndirectTemplateForSlot(farSlot);

        const alloc: GrassTypeAllocation = {
            maxInstances: rounded,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            instanceCount: 0,
            slots: [nearSlot, farSlot]
        };

        this.#allocations.set(typeId, alloc);
        this.#totalAllocatedInstances += rounded;

        return alloc;
    }

    /**
     * [KO] CPU 스테이징 버퍼에 단일 잔디 인스턴스의 배치 데이터를 직접 기록합니다.
     * [EN] Directly writes placement data for a single grass instance into the CPU staging buffer.
     *
     * @param globalInstanceIndex -
     * [KO] 메가버퍼 내 글로벌 인스턴스 인덱스
     * [EN] Global instance index within the mega-buffer
     * @param x -
     * [KO] 월드 X 좌표
     * [EN] World X coordinate
     * @param y -
     * [KO] 월드 Y 좌표
     * [EN] World Y coordinate
     * @param z -
     * [KO] 월드 Z 좌표
     * [EN] World Z coordinate
     * @param rotationY -
     * [KO] Y축 회전 각도 (라디안)
     * [EN] Y-axis rotation angle (radians)
     * @param scaleXZ -
     * [KO] XZ 평면 스케일
     * [EN] XZ plane scale
     * @param scaleY -
     * [KO] Y 수직 스케일
     * [EN] Y vertical scale
     */
    writeInstanceData(
        globalInstanceIndex: number,
        x: number,
        y: number,
        z: number,
        rotationY: number,
        scaleXZ: number,
        scaleY: number
    ): void {
        const base = globalInstanceIndex * this.#strideFloats;
        this.#cpuRawDataBuffer[base] = x;
        this.#cpuRawDataBuffer[base + 1] = y;
        this.#cpuRawDataBuffer[base + 2] = z;
        this.#cpuRawDataBuffer[base + 3] = rotationY;
        this.#cpuRawDataBuffer[base + 4] = scaleXZ;
        this.#cpuRawDataBuffer[base + 5] = scaleY;
        this.#cpuRawDataBuffer[base + 6] = 0.0;
        this.#cpuRawDataBuffer[base + 7] = 0.0;
    }

    /**
     * [KO] CPU 스테이징 버퍼에 기록된 인스턴스 데이터를 GPU 원본 버퍼(rawGPUBuffer)로 일괄 업로드합니다.
     * [EN] Batch uploads instance data written in the CPU staging buffer to the GPU raw buffer (rawGPUBuffer).
     *
     * @param startInstance -
     * [KO] 업로드를 시작할 인스턴스 인덱스
     * [EN] Starting instance index to upload
     * @param count -
     * [KO] 업로드할 인스턴스 수
     * [EN] Number of instances to upload
     */
    uploadInstances(startInstance: number, count: number): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#rawGPUBuffer || count <= 0) return;

        const strideBytes = this.#strideBytes;
        const byteOffset = startInstance * strideBytes;
        const byteSize = count * strideBytes;

        gpuDevice.queue.writeBuffer(
            this.#rawGPUBuffer,
            byteOffset,
            this.#cpuRawDataBuffer.buffer,
            byteOffset,
            byteSize
        );
    }

    /**
     * [KO] 특정 잔디 타입의 컬링 및 렌더링 파라미터를 GPU 타입 파라미터 버퍼에 갱신합니다.
     * [EN] Updates culling and rendering parameters for a specific grass type in the GPU type parameter buffer.
     *
     * @param typeId -
     * [KO] 잔디 타입의 고유 ID
     * [EN] Unique ID of the grass type
     * @param cullingDistance -
     * [KO] 최대 컬링 거리
     * [EN] Maximum culling distance
     * @param bottomOffset -
     * [KO] 지형 표면 대비 바닥 높이 오프셋
     * [EN] Bottom height offset relative to terrain surface
     * @param meshHeight -
     * [KO] 잔디 메시의 높이
     * [EN] Height of the grass mesh
     * @param minSlopeTan2 -
     * [KO] 잔디가 자랄 수 있는 최소 경사도 (탄젠트 제곱)
     * [EN] Minimum slope angle allowed for grass (tangent squared)
     * @param maxSlopeTan2 -
     * [KO] 잔디가 자랄 수 있는 최대 경사도 (탄젠트 제곱)
     * [EN] Maximum slope angle allowed for grass (tangent squared)
     * @param hasSlopeFilter -
     * [KO] 경사도 필터 적용 여부
     * [EN] Whether slope filtering is enabled
     * @param rawBaseOffset -
     * [KO] 원본 인스턴스 시작 오프셋
     * [EN] Raw instance base offset
     * @param instanceCount -
     * [KO] 현재 인스턴스 개수
     * [EN] Current instance count
     * @param culledBaseOffset -
     * [KO] 컬링된 인스턴스 시작 오프셋
     * [EN] Culled instance base offset
     * @param indirectBaseOffset -
     * [KO] 간접 드로우 슬롯 시작 오프셋
     * [EN] Indirect draw slot base offset
     * @param stageCount -
     * [KO] LOD 스테이지 개수
     * [EN] Number of LOD stages
     * @param maxInstancesPerStage -
     * [KO] 스테이지당 최대 수용 인스턴스 수
     * [EN] Maximum instances per stage
     * @param stageDistances -
     * [KO] 스테이지별 전환 거리 배열
     * [EN] Stage transition distance array
     */
    updateTypeParams(
        typeId: number,
        cullingDistance: number,
        bottomOffset: number,
        meshHeight: number,
        minSlopeTan2: number,
        maxSlopeTan2: number,
        hasSlopeFilter: boolean,
        rawBaseOffset: number = 0,
        instanceCount: number = 0,
        culledBaseOffset: number = 0,
        indirectBaseOffset: number = 0,
        stageCount: number = 2,
        maxInstancesPerStage: number = 0,
        stageDistances: [number, number, number, number] = [9999, 9999, 9999, 9999]
    ): void {
        const typeParamFloats = this.#typeParamFloats;
        const base = typeId * typeParamFloats;
        const f32 = this.#cpuTypeParamsBuffer;
        const u32 = this.#cpuTypeParamsUint32;

        f32[base] = cullingDistance;
        f32[base + 1] = bottomOffset;
        f32[base + 2] = meshHeight;
        f32[base + 3] = minSlopeTan2;

        f32[base + 4] = maxSlopeTan2;
        u32[base + 5] = hasSlopeFilter ? 1 : 0;
        u32[base + 6] = rawBaseOffset;
        u32[base + 7] = instanceCount;

        u32[base + 8] = culledBaseOffset;
        u32[base + 9] = indirectBaseOffset;
        u32[base + 10] = stageCount;
        u32[base + 11] = maxInstancesPerStage;

        f32[base + 12] = stageDistances[0] ?? 9999;
        f32[base + 13] = stageDistances[1] ?? 9999;
        f32[base + 14] = stageDistances[2] ?? 9999;
        f32[base + 15] = 0.0;

        const gpuDevice = this.gpuDevice;
        if (gpuDevice && this.#typeParamsGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#typeParamsGPUBuffer,
                base * 4,
                this.#cpuTypeParamsBuffer.buffer,
                base * 4,
                typeParamFloats * 4
            );
        }
    }

    /**
     * [KO] 매 프레임 GPU 컬링 실행 전, CPU 템플릿을 사용하여 간접 드로우 인스턴스 카운트를 0으로 초기화합니다.
     * [EN] Resets the indirect draw instance counts to zero using the CPU template before executing GPU culling every frame.
     */
    resetIndirectDrawCountsCPU(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#indirectGPUBuffer || this.#totalIndirectDrawCalls === 0) return;
        gpuDevice.queue.writeBuffer(
            this.#indirectGPUBuffer,
            0,
            this.#indirectResetTemplate.buffer,
            0,
            this.#totalIndirectDrawCalls * 5 * 4
        );
    }

    /**
     * [KO] 특정 잔디 타입 ID에 해당하는 메가버퍼 할당 정보 객체를 조회합니다.
     * [EN] Retrieves the mega-buffer allocation information object for a specific grass type ID.
     *
     * @param typeId -
     * [KO] 조회할 잔디 타입의 고유 ID
     * [EN] Unique ID of the grass type to retrieve
     * @returns
     * [KO] 할당 정보 객체 또는 존재하지 않을 경우 `undefined`
     * [EN] Allocation object, or `undefined` if not found
     */
    getAllocation(typeId: number): GrassTypeAllocation | undefined {
        return this.#allocations.get(typeId);
    }

    /**
     * [KO] GrassMegaBuffer가 보유한 모든 GPU 버퍼(raw, culled, indirect, typeParams)를 해제하고 메모리를 정리합니다.
     * [EN] Releases all GPU buffers (raw, culled, indirect, typeParams) held by GrassMegaBuffer and clears memory.
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

        this.#allocations.clear();
        this.#totalAllocatedInstances = 0;
        this.#totalAllocatedCulledInstances = 0;
        this.#totalIndirectDrawCalls = 0;
    }

    #initBuffers(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const strideBytes = this.#strideBytes;
        const culledCapacity = Math.max(this.#instanceCapacity * 2, this.#totalAllocatedCulledInstances);
        const rawByteSize = this.#instanceCapacity * strideBytes;
        const culledByteSize = culledCapacity * strideBytes;
        const indirectByteSize =
            this.#maxIndirectCalls * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
        const typeParamsByteSize =
            this.#maxTypes * this.#typeParamFloats * Float32Array.BYTES_PER_ELEMENT;

        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: 'Grass_MegaBuffer_RawInstances',
            size: rawByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#culledGPUBuffer = gpuDevice.createBuffer({
            label: 'Grass_MegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });

        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: 'Grass_MegaBuffer_IndirectDraw',
            size: indirectByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.INDIRECT | GPUBufferUsage.COPY_DST,
        });

        this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
            label: 'Grass_MegaBuffer_TypeParams',
            size: typeParamsByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
    }

    #updateIndirectTemplateForSlot(slot: GrassDrawSlot): void {
        const offset = slot.indirectOffset * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
        this.#indirectResetTemplate[offset] = slot.indexCount;
        this.#indirectResetTemplate[offset + 1] = 0;
        this.#indirectResetTemplate[offset + 2] = 0;
        this.#indirectResetTemplate[offset + 3] = 0;
        this.#indirectResetTemplate[offset + 4] = slot.culledBaseOffset;

        const gpuDevice = this.gpuDevice;
        if (gpuDevice && this.#indirectGPUBuffer) {
            const byteOffset = offset * Uint32Array.BYTES_PER_ELEMENT;
            gpuDevice.queue.writeBuffer(
                this.#indirectGPUBuffer,
                byteOffset,
                this.#indirectResetTemplate.buffer,
                byteOffset,
                DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT
            );
        }
    }

    #resizeBuffer(newCapacity: number): void {
        this.#instanceCapacity = Math.ceil(newCapacity / 64) * 64;

        const newRawBuffer = new Float32Array(this.#instanceCapacity * this.#strideFloats);
        newRawBuffer.set(this.#cpuRawDataBuffer);
        this.#cpuRawDataBuffer = newRawBuffer;

        this.#initBuffers();

        if (this.#onRecreated) {
            this.#onRecreated();
        }
    }
}

Object.freeze(GrassMegaBuffer);
