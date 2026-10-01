import RedGPUContext from '../../../../context/RedGPUContext';
import {AScatterMegaBuffer} from '../../../core/scatter/AScatterMegaBuffer';
import grassCullComputeWGSL from '../culling/grassCullCompute.wgsl';

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
export interface GrassTypeAllocation {
    /**
     * [KO] 최대 허용 인스턴스 수
     * [EN] Maximum allowed instances
     */
    maxInstances: number;
    /**
     * [KO] 원본 인스턴스 버퍼 기본 시작 오프셋
     * [EN] Base start offset in raw instance buffer
     */
    rawBaseOffset: number;
    /**
     * [KO] 컬링된 인스턴스 버퍼 기본 시작 오프셋
     * [EN] Base start offset in culled instance buffer
     */
    culledBaseOffset: number;
    /**
     * [KO] 간접 드로우 버퍼 기본 시작 오프셋
     * [EN] Base start offset in indirect draw buffer
     */
    indirectBaseOffset: number;
    /**
     * [KO] 현재 활성화된 인스턴스 수
     * [EN] Current active instance count
     */
    instanceCount: number;
    /**
     * [KO] 서브메시 총 개수
     * [EN] Total number of sub-meshes
     */
    subMeshCount: number;
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
            grassCullComputeWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                rawStorageName: 'rawInstances',
                instanceStructName: 'GrassInstance',
                typeParamStructName: 'GrassTypeParam'
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
     * @param subMeshesOrIndexCount -
     * [KO] 잔디 서브메시 목록 또는 단일 인덱스 수
     * [EN] List of grass sub-meshes or single index count
     * @returns
     * [KO] 할당된 잔디 타입 메타데이터 객체
     * [EN] Allocated grass type metadata object
     */
    allocateType(
        typeId: number,
        maxInstances: number,
        subMeshesOrIndexCount: { indexCount: number; firstIndex?: number }[] | number
    ): GrassTypeAllocation {
        if (this.#allocations.has(typeId)) {
            return this.#allocations.get(typeId)!;
        }

        const subMeshes: { indexCount: number; firstIndex: number }[] = Array.isArray(subMeshesOrIndexCount)
            ? subMeshesOrIndexCount.map(s => ({indexCount: s.indexCount, firstIndex: s.firstIndex ?? 0}))
            : [{indexCount: subMeshesOrIndexCount, firstIndex: 0}];
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
            maxInstances: baseAlloc.maxInstances,
            rawBaseOffset: baseAlloc.rawBaseOffset,
            culledBaseOffset: baseAlloc.culledBaseOffset,
            indirectBaseOffset: baseAlloc.indirectBaseOffset,
            instanceCount: 0,
            subMeshCount,
            slots,
            nearSlots,
            farSlots
        };

        this.#allocations.set(typeId, alloc);
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
        const base = globalInstanceIndex * this.strideFloats;
        const cpuRaw = this.cpuRawDataBuffer;
        cpuRaw[base] = x;
        cpuRaw[base + 1] = y;
        cpuRaw[base + 2] = z;
        cpuRaw[base + 3] = rotationY;
        cpuRaw[base + 4] = scaleXZ;
        cpuRaw[base + 5] = scaleY;
        cpuRaw[base + 6] = 0.0;
        cpuRaw[base + 7] = 0.0;
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
        stageDistances: [number, number, number, number] = [9999, 9999, 9999, 9999],
        subMeshCount: number = 1
    ): void {
        const typeParamFloats = this.typeParamFloats;
        const base = typeId * typeParamFloats;
        const f32 = this.cpuTypeParamsBuffer;
        const u32 = this.cpuTypeParamsUint32;

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
        u32[base + 15] = subMeshCount;

        const gpuDevice = this.gpuDevice;
        const typeParamsGPUBuffer = this.typeParamsGPUBuffer;
        if (gpuDevice && typeParamsGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                typeParamsGPUBuffer,
                base * 4,
                this.cpuTypeParamsBuffer.buffer,
                base * 4,
                typeParamFloats * 4
            );
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
