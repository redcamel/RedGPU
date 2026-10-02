/**
 * [KO] 대규모 지형 잔디 시스템의 인스턴스 데이터, 간접 드로우 버퍼를 통합 관리하는 메가버퍼 모듈입니다.
 * [EN] Mega-buffer module managing instance data and indirect draw buffers for massive landscape grass systems.
 * @packageDocumentation
 */
import RedGPUContext from '../../../../context/RedGPUContext';
import {AScatterMegaBuffer, ScatterBaseSegmentAllocation} from '../../../core/scatter/AScatterMegaBuffer';
import grassCullWGSL from '../culling/grassCull.wgsl';

/**
 * [KO] 단일 잔디 타입의 거리별(Near/Far) 간접 드로우 슬롯 정보
 * [EN] Indirect draw slot info per distance (Near/Far) for a single grass type
 */
export interface GrassDrawSlot {
    /**
     * [KO] 슬롯 인덱스 (0: Near, 1: Far)
     * [EN] Slot index (0: Near, 1: Far)
     */
    slotIndex: number;
    /**
     * [KO] 서브메시 인덱스
     * [EN] Sub-mesh index
     */
    subMeshIndex: number;
    /**
     * [KO] 인디렉트 버퍼 내 슬롯 오프셋 (DrawIndexedIndirect 구조체 단위)
     * [EN] Slot offset in indirect buffer (unit of DrawIndexedIndirect struct)
     */
    indirectOffset: number;
    /**
     * [KO] 컬링된 인스턴스 버퍼 내 슬롯 기본 오프셋
     * [EN] Base offset of slot in culled instance buffer
     */
    culledBaseOffset: number;
    /**
     * [KO] 해당 서브메시의 인덱스 수
     * [EN] Index count of corresponding sub-mesh
     */
    indexCount: number;
    /**
     * [KO] 인덱스 버퍼 내 시작 인덱스 오프셋
     * [EN] Starting index offset in index buffer
     */
    firstIndex: number;
}

/**
 * [KO] 메가버퍼 내 단일 잔디 타입의 할당 정보
 * [EN] Allocation info for a single grass type in mega-buffer
 */
export interface GrassTypeAllocation extends ScatterBaseSegmentAllocation {
    /**
     * [KO] 현재 활성화된 인스턴스 수
     * [EN] Current active instance count
     */
    instanceCount: number;
    /**
     * [KO] 모든 간접 드로우 슬롯 목록
     * [EN] List of all indirect draw slots
     */
    slots: GrassDrawSlot[];
    /**
     * [KO] Near 거리 단계 간접 드로우 슬롯 목록
     * [EN] List of indirect draw slots for Near distance stage
     */
    nearSlots: GrassDrawSlot[];
    /**
     * [KO] Far 거리 단계 간접 드로우 슬롯 목록
     * [EN] List of indirect draw slots for Far distance stage
     */
    farSlots: GrassDrawSlot[];
}

/**
 * [KO] 대규모 지형 잔디 시스템의 모든 인스턴스 데이터, 컬링 결과, 간접 드로우(Indirect Draw) 버퍼를 단일 VRAM 영역에서 통합 관리하는 메가버퍼 클래스입니다.
 * [EN] Mega-buffer class that integrally manages all instance data, culling results, and indirect draw buffers for massive landscape grass systems in a single VRAM area.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(GrassManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class GrassScatterMegaBuffer extends AScatterMegaBuffer {
    #allocations: Map<number, GrassTypeAllocation> = new Map();

    /**
     * [KO] GrassScatterMegaBuffer 인스턴스를 생성하고 초기 VRAM 버퍼 및 템플릿 메모리를 초기화합니다. (사용자가 직접 생성하지 마시고 `landscape.grassManager` 프로퍼티를 통해 접근하십시오.)
     * [EN] Creates a GrassScatterMegaBuffer instance and initializes initial VRAM buffers and template memory. (Do not instantiate directly; access via the `landscape.grassManager` property instead.)
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
        const shaderInfo = redGPUContext.resourceManager.wgslParser.parse(
            'Grass_Cull_ShaderModule',
            grassCullWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                rawStorageName: 'rawInstances',
                instanceStructName: 'GrassInstance',
            },
            initialCapacity,
            maxTypes,
            maxTypes * 8
        );

        this.#initBuffers();
    }

    /**
     * [KO] 특정 잔디 타입에 대해 필요한 인스턴스 메모리 공간과 Near/Far 간접 드로우 슬롯을 할당합니다.
     * [EN] Allocates required instance memory space and Near/Far indirect draw slots for a specific grass type.
     *
     * @param typeId -
     * [KO] 잔디 타입의 고유 ID
     * [EN] Unique ID of the grass type
     * @param maxInstances -
     * [KO] 해당 타입에 배정할 최대 인스턴스 수
     * [EN] Maximum instance count assigned to this type
     * @param subMeshes -
     * [KO] 잔디 서브메시 목록
     * [EN] List of grass sub-meshes
     * @returns
     * [KO] 할당된 잔디 타입 메타데이터 객체
     * [EN] Allocated grass type metadata object
     */
    allocateType(
        typeId: number,
        maxInstances: number,
        subMeshes: { indexCount: number; firstIndex?: number }[]
    ): GrassTypeAllocation {
        if (this.#allocations.has(typeId)) {
            return this.#allocations.get(typeId)!;
        }

        const subMeshCount = Math.max(1, subMeshes.length);
        const baseAlloc = this.allocateBaseSegment(typeId, maxInstances, subMeshCount * 2, 2);

        const nearCulledOffset = baseAlloc.culledBaseOffset;
        const farCulledOffset = baseAlloc.culledBaseOffset + baseAlloc.maxInstances;

        const nearSlots: GrassDrawSlot[] = [];
        const farSlots: GrassDrawSlot[] = [];
        const slots: GrassDrawSlot[] = [];

        for (let s = 0; s < subMeshCount; s++) {
            const sub = subMeshes[s];
            const slotIdx = baseAlloc.indirectBaseOffset + s;
            const nearSlot: GrassDrawSlot = {
                slotIndex: 0,
                subMeshIndex: s,
                indirectOffset: slotIdx,
                culledBaseOffset: nearCulledOffset,
                indexCount: sub.indexCount,
                firstIndex: sub.firstIndex
            };
            this.registerIndirectDrawSlot(slotIdx, sub.indexCount, sub.firstIndex, 0, nearCulledOffset);
            nearSlots.push(nearSlot);
            slots.push(nearSlot);
        }

        for (let s = 0; s < subMeshCount; s++) {
            const sub = subMeshes[s];
            const slotIdx = baseAlloc.indirectBaseOffset + subMeshCount + s;
            const farSlot: GrassDrawSlot = {
                slotIndex: 1,
                subMeshIndex: s,
                indirectOffset: slotIdx,
                culledBaseOffset: farCulledOffset,
                indexCount: sub.indexCount,
                firstIndex: sub.firstIndex
            };
            this.registerIndirectDrawSlot(slotIdx, sub.indexCount, sub.firstIndex, 0, farCulledOffset);
            farSlots.push(farSlot);
            slots.push(farSlot);
        }

        this.syncIndirectResetTemplateToGPU(baseAlloc.indirectBaseOffset, subMeshCount * 2);

        const alloc: GrassTypeAllocation = {
            typeId: baseAlloc.typeId,
            maxInstances: baseAlloc.maxInstances,
            rawBaseOffset: baseAlloc.rawBaseOffset,
            culledBaseOffset: baseAlloc.culledBaseOffset,
            indirectBaseOffset: baseAlloc.indirectBaseOffset,
            subMeshCount,
            instanceCount: 0,
            slots,
            nearSlots,
            farSlots
        };

        this.#allocations.set(typeId, alloc);
        return alloc;
    }

    /**
     * [KO] 특정 잔디 타입의 할당 리소스를 해제합니다.
     * [EN] Releases allocated resources for a specific grass type.
     *
     * @param typeId - 해제할 잔디 타입 ID
     */
    freeType(typeId: number): void {
        const alloc = this.#allocations.get(typeId);
        if (alloc) {
            alloc.instanceCount = 0;
            this.#allocations.delete(typeId);
        }
    }



    /**
     * [KO] 특정 잔디 타입 ID에 해당하는 메가버퍼 할당 정보 객체를 조회합니다.
     * [EN] Retrieves the mega-buffer allocation information object for a specific grass type ID.
     *
     * @param typeId -
     * [KO] 조회할 잔디 타입의 고유 ID
     * [EN] Unique ID of the grass type to retrieve
     * @returns
     * [KO] 잔디 타입 할당 정보 객체 또는 undefined
     * [EN] Grass type allocation info object or undefined
     */
    getAllocation(typeId: number): GrassTypeAllocation | undefined {
        return this.#allocations.get(typeId);
    }

    /**
     * [KO] 인스턴스 최대 수용 용량이 증가할 때 호출되어 GPU 컬링 버퍼를 리사이징합니다.
     * [EN] Invoked when maximum instance capacity expands to resize the GPU culled buffer.
     *
     * @param newCapacity -
     * [KO] 새로 확장된 인스턴스 수용 용량
     * [EN] Newly expanded instance capacity
     */
    onResizeBuffers(newCapacity: number): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const strideBytes = this.strideBytes;
        const culledCapacity = Math.max(newCapacity * 2, this.totalAllocatedCulledInstances);
        const culledByteSize = culledCapacity * strideBytes;

        this.culledGPUBuffer?.destroy();
        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassScatterMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
    }

    /**
     * [KO] 메가버퍼 인스턴스 파괴 시 잔디 타입별 할당 데이터 및 기본 세그먼트를 정리합니다.
     * [EN] Clears grass type allocations and base segments upon mega-buffer destruction.
     */
    onDestroy(): void {
        this.#allocations.clear();
        this.clearBaseAllocations();
    }

    #initBuffers(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const strideBytes = this.strideBytes;
        const culledCapacity = Math.max(this.instanceCapacity * 2, this.totalAllocatedCulledInstances);
        const culledByteSize = culledCapacity * strideBytes;

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassScatterMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
    }
}

Object.freeze(GrassScatterMegaBuffer);
export default GrassScatterMegaBuffer;
