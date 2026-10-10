/**
 * [KO] 대규모 지형 잔디 시스템의 인스턴스 데이터, 간접 드로우 버퍼를 통합 관리하는 메가버퍼 모듈입니다.
 * [EN] Mega-buffer module managing instance data and indirect draw buffers for massive landscape grass systems.
 * @packageDocumentation
 */
import RedGPUContext from '../../../../context/RedGPUContext';
import AScatterMegaBuffer, {type ScatterBaseSegmentAllocation} from '../../../core/scatter/AScatterMegaBuffer';
import grassCullWGSL from '../culling/grassCull.wgsl';
import type Grass from '../Grass';

/**
 * [KO] 단일 잔디 타입의 거리별(Near/Far) 간접 드로우 슬롯 정보
 * [EN] Indirect draw slot info per distance (Near/Far) for a single grass type
 */
interface GrassDrawSlot {
    /**
     * [KO] 인디렉트 버퍼 내 슬롯 오프셋 (DrawIndexedIndirect 구조체 단위)
     * [EN] Slot offset in indirect buffer (unit of DrawIndexedIndirect struct)
     */
    readonly indirectOffset: number;
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
class GrassScatterMegaBuffer extends AScatterMegaBuffer {
    #allocations: Map<number, GrassTypeAllocation> = new Map();
    #unifiedCullingBindGroup: GPUBindGroup | null = null;
    #cachedGlobalUniformBuffer: GPUBuffer | null = null;
    #cachedCullBindGroupLayout: GPUBindGroupLayout | null = null;

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
     * [KO] 지원할 최대 잔디 타입 개수 (기본값: 64)
     * [EN] Maximum number of grass types supported (default: 64)
     */
    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 131072,
        maxTypes: number = 64
    ) {
        const {resourceManager} = redGPUContext;
        const shaderInfo = resourceManager.wgslParser.parse(
            'Grass_Cull_ShaderModule',
            grassCullWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                instanceStructName: 'GrassInstance',
                typeParamStructName: 'GrassTypeParam',
            },
            initialCapacity,
            maxTypes,
            maxTypes * 8
        );

        this.#initBuffers();
    }

    /**
     * [KO] 모든 필수 잔디 GPU 버퍼(컬링 버퍼 포함)가 초기화되어 준비되었는지 여부를 반환합니다.
     * [EN] Returns whether all essential grass GPU buffers (including culled buffer) are initialized and ready for use.
     */
    override get isReady(): boolean {
        return super.isReady && this.culledGPUBuffer !== null;
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
     * @param renderUnits -
     * [KO] 잔디 렌더 유닛 목록
     * [EN] List of grass render units
     * @returns
     * [KO] 할당된 잔디 타입 메타데이터 객체
     * [EN] Allocated grass type metadata object
     */
    allocateType(
        typeId: number,
        maxInstances: number,
        renderUnits: { indexCount: number; firstIndex?: number }[]
    ): GrassTypeAllocation {
        const existing = this.#allocations.get(typeId);
        if (existing) {
            return existing;
        }

        const renderUnitCount = Math.max(1, renderUnits.length);
        const baseAlloc = this.allocateBaseSegment(typeId, maxInstances, renderUnitCount * 2, 2);
        const {culledBaseOffset, maxInstances: baseMax, indirectBaseOffset} = baseAlloc;

        const nearCulledOffset = culledBaseOffset;
        const farCulledOffset = culledBaseOffset + baseMax;

        const nearSlots: GrassDrawSlot[] = [];
        const farSlots: GrassDrawSlot[] = [];

        for (let s = 0; s < renderUnitCount; s++) {
            const unit = renderUnits[s];
            const {indexCount, firstIndex} = unit;
            const slotIdx = indirectBaseOffset + s;
            const nearSlot: GrassDrawSlot = {
                indirectOffset: slotIdx
            };
            this.registerIndirectDrawSlot(slotIdx, indexCount, firstIndex, 0, nearCulledOffset);
            nearSlots.push(nearSlot);
        }

        for (let s = 0; s < renderUnitCount; s++) {
            const unit = renderUnits[s];
            const {indexCount, firstIndex} = unit;
            const slotIdx = indirectBaseOffset + renderUnitCount + s;
            const farSlot: GrassDrawSlot = {
                indirectOffset: slotIdx
            };
            this.registerIndirectDrawSlot(slotIdx, indexCount, firstIndex, 0, farCulledOffset);
            farSlots.push(farSlot);
        }

        this.syncIndirectResetTemplateToGPU(indirectBaseOffset, renderUnitCount * 2);

        const alloc: GrassTypeAllocation = {
            ...baseAlloc,
            renderUnitCount,
            instanceCount: 0,
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

        const {typeParamFloats, cpuTypeParamsBuffer, gpuDevice, typeParamsGPUBuffer} = this;
        if (typeParamFloats > 0) {
            const baseFloat = typeId * typeParamFloats;
            cpuTypeParamsBuffer.fill(0, baseFloat, baseFloat + typeParamFloats);

            if (typeParamsGPUBuffer) {
                const byteOffset = baseFloat * Float32Array.BYTES_PER_ELEMENT;
                const byteSize = typeParamFloats * Float32Array.BYTES_PER_ELEMENT;
                gpuDevice.queue.writeBuffer(
                    typeParamsGPUBuffer,
                    byteOffset,
                    cpuTypeParamsBuffer.buffer,
                    byteOffset,
                    byteSize
                );
            }
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
     * [KO] 특정 잔디 타입의 컬링 및 렌더링 파라미터를 메가버퍼의 타입 파라미터 버퍼에 갱신하고 GPU로 동기화합니다.
     * [EN] Updates culling and rendering parameters of a specific grass type into the mega-buffer type parameters buffer and syncs to GPU.
     *
     * @param typeId - 잔디 타입 고유 ID
     * @param grass - 잔디 생태계 인스턴스
     * @param alloc - 메가버퍼 할당 정보 객체
     */
    updateTypeParams(typeId: number, grass: Grass, alloc: GrassTypeAllocation): void {
        const {typeParamFloats} = this;
        if (typeParamFloats === 0) return;

        const baseFloat = typeId * typeParamFloats;
        const {cpuTypeParamsBuffer: cf, cpuTypeParamsUint32: cu} = this;

        const {
            cullingDistance: cullingDist,
            farDistance: farDist,
            fadeStartDistance,
            shadowCullDistance: shadowCullDist,
            shadowFadeStartDistance
        } = grass;
        const fadeStartDist = Math.min(fadeStartDistance, cullingDist);
        const shadowFadeStartDist = Math.min(shadowFadeStartDistance, shadowCullDist);

        cf[baseFloat + 0] = cullingDist * cullingDist;
        cf[baseFloat + 1] = farDist * farDist;
        cf[baseFloat + 2] = fadeStartDist * fadeStartDist; // fadeStartSq
        cf[baseFloat + 3] = 1.0 / Math.max(0.001, cullingDist - fadeStartDist); // invFadeRange

        const {
            rawBaseOffset,
            culledBaseOffset,
            maxInstances,
            nearSlots,
            farSlots,
            renderUnitCount,
            instanceCount
        } = alloc;

        cu[baseFloat + 4] = rawBaseOffset;
        cu[baseFloat + 5] = culledBaseOffset;
        cu[baseFloat + 6] = culledBaseOffset + maxInstances;
        const nearOffset = nearSlots[0]?.indirectOffset ?? 0;
        cu[baseFloat + 7] = nearOffset;
        cu[baseFloat + 8] = farSlots[0]?.indirectOffset ?? nearOffset;
        cu[baseFloat + 9] = renderUnitCount;
        cu[baseFloat + 10] = farSlots.length > 0 ? 1 : 0;
        cu[baseFloat + 11] = instanceCount;
        cu[baseFloat + 12] = maxInstances;
        cf[baseFloat + 13] = cullingDist; // cullingDistance
        cf[baseFloat + 14] = shadowCullDist * shadowCullDist; // shadowCullDistanceSq
        cf[baseFloat + 15] = shadowFadeStartDist * shadowFadeStartDist; // shadowFadeStartSq
        cf[baseFloat + 16] = 1.0 / Math.max(0.001, shadowCullDist - shadowFadeStartDist); // invShadowFadeRange
        cf[baseFloat + 17] = shadowCullDist; // shadowCullDistance
        cu[baseFloat + 18] = 0; // pad1
        cu[baseFloat + 19] = 0; // pad2

        const {gpuDevice, typeParamsGPUBuffer} = this;
        if (typeParamsGPUBuffer) {
            const byteOffset = baseFloat * Float32Array.BYTES_PER_ELEMENT;
            const byteSize = typeParamFloats * Float32Array.BYTES_PER_ELEMENT;
            gpuDevice.queue.writeBuffer(
                typeParamsGPUBuffer,
                byteOffset,
                cf.buffer,
                byteOffset,
                byteSize
            );
        }
    }

    /**
     * [KO] 캐시된 단일 일괄 컬링 바인드그룹을 무효화합니다.
     * [EN] Invalidates the cached unified culling bind group.
     */
    override invalidateUnifiedCullingBindGroup(): void {
        this.#unifiedCullingBindGroup = null;
        this.#cachedGlobalUniformBuffer = null;
        this.#cachedCullBindGroupLayout = null;
    }

    /**
     * [KO] 단일 1회 일괄 컴퓨트 컬링 디스패치에 사용되는 통합 바인드그룹(Group 0)을 반환하거나 생성합니다.
     * [EN] Retrieves or creates the unified bind group (Group 0) used for single batch compute culling dispatch.
     *
     * @param bindGroupLayout - 컬링 파이프라인의 바인드그룹 레이아웃
     * @param globalUniformBuffer - 전역 컬링 유니폼 버퍼 (카메라 위치, 프러스텀 평면 등)
     * @returns 생성되거나 캐시된 GPUBindGroup 객체 (버퍼 미준비 시 null)
     */
    getOrCreateUnifiedCullingBindGroup(
        bindGroupLayout: GPUBindGroupLayout,
        globalUniformBuffer: GPUBuffer
    ): GPUBindGroup | null {
        const {
            gpuDevice,
            rawGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            typeParamsGPUBuffer
        } = this;

        if (!rawGPUBuffer || !culledGPUBuffer || !indirectGPUBuffer || !typeParamsGPUBuffer) {
            return null;
        }

        if (
            this.#unifiedCullingBindGroup &&
            this.#cachedCullBindGroupLayout === bindGroupLayout &&
            this.#cachedGlobalUniformBuffer === globalUniformBuffer
        ) {
            return this.#unifiedCullingBindGroup;
        }

        this.#cachedCullBindGroupLayout = bindGroupLayout;
        this.#cachedGlobalUniformBuffer = globalUniformBuffer;

        this.#unifiedCullingBindGroup = gpuDevice.createBindGroup({
            label: 'Grass_UnifiedCullingBindGroup',
            layout: bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: globalUniformBuffer}},
                {binding: 1, resource: {buffer: rawGPUBuffer}},
                {binding: 2, resource: {buffer: culledGPUBuffer}},
                {binding: 3, resource: {buffer: indirectGPUBuffer}},
                {binding: 4, resource: {buffer: typeParamsGPUBuffer}},
            ]
        });

        return this.#unifiedCullingBindGroup;
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
        this.invalidateUnifiedCullingBindGroup();
        const {gpuDevice, strideBytes} = this;
        const {STORAGE} = GPUBufferUsage;

        const culledCapacity = newCapacity * 2;
        const culledByteSize = culledCapacity * strideBytes;

        this.culledGPUBuffer?.destroy();
        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassScatterMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: STORAGE,
        });
    }

    /**
     * [KO] 메가버퍼 인스턴스 파괴 시 잔디 타입별 할당 데이터 및 기본 세그먼트를 정리합니다.
     * [EN] Clears grass type allocations and base segments upon mega-buffer destruction.
     */
    onDestroy(): void {
        this.invalidateUnifiedCullingBindGroup();
        this.#allocations.clear();
        this.clearBaseAllocations();
    }

    #initBuffers(): void {
        const {gpuDevice, strideBytes, instanceCapacity} = this;
        const {STORAGE} = GPUBufferUsage;

        const culledCapacity = instanceCapacity * 2;
        const culledByteSize = culledCapacity * strideBytes;

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassScatterMegaBuffer_CulledInstances',
            size: culledByteSize,
            usage: STORAGE,
        });
    }
}

Object.freeze(GrassScatterMegaBuffer);
export default GrassScatterMegaBuffer;
