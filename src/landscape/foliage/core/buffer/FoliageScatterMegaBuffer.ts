/**
 * [KO] 대규모 식생(Foliage) 시스템의 멀티 LOD 인스턴스 데이터, 간접 드로우 및 캐스케이드 그림자 버퍼를 통합 관리하는 메가버퍼 모듈입니다.
 * [EN] Mega-buffer module integrally managing multi-LOD instance data, indirect draw, and cascade shadow buffers for large-scale foliage systems.
 * @packageDocumentation
 */
import {mat4} from "gl-matrix";
import RedGPUContext from '../../../../context/RedGPUContext';
import type RenderViewStateData from "../../../../display/view/core/RenderViewStateData";
import AScatterMegaBuffer, {
    DRAW_INDEXED_INDIRECT_ARGS_COUNT,
    ScatterBaseSegmentAllocation
} from '../../../core/scatter/AScatterMegaBuffer';
import foliageCullWGSL from '../culling/foliageCull.wgsl';
import FoliageRenderUnit from '../FoliageRenderUnit';
import {FoliageLODInfo} from '../Foliage';

/**
 * [KO] Cascaded Shadow Maps (CSM) 그림자 캐스케이드 분할 단계 수
 * [EN] Number of Cascaded Shadow Maps (CSM) shadow cascade split levels
 */
const SHADOW_CASCADE_COUNT = 4;

/**
 * [KO] 메가버퍼 내 단일 식생 타입의 할당 정보 인터페이스입니다.
 * [EN] Interface for single foliage type allocation information in mega-buffer.
 */
export interface FoliageTypeAllocation extends ScatterBaseSegmentAllocation {
    /**
     * [KO] 식생 타입 고유 이름
     * [EN] Unique foliage type name
     */
    name: string;
}


/**
 * [KO] 모든 식생 타입의 인스턴스 원시 데이터, GPU 컬링 결과, 간접 드로우 버퍼, 캐스케이드 그림자 버퍼를 단일 대형 GPU 버퍼로 통합 관리하는 클래스입니다.
 * 그림자 간접 버퍼는 가상 훅(`onResetMultiIndirectCommands`) 오버라이드를 통해 매 프레임 단일 GPU 커맨드 인코더 파이프라인에서 일괄 리셋됩니다.
 * [EN] Class that integrally manages raw instance data, GPU culling results, indirect draw buffers, and cascade shadow buffers for all foliage types in a single large GPU buffer.
 * Shadow indirect draw buffers are batch-reset within a single GPU command encoder pipeline per frame via the overridden virtual hook (`onResetMultiIndirectCommands`).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageScatterMegaBuffer extends AScatterMegaBuffer {
    #globalUniformBytes: number;

    #shadowCulledGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectGPUBuffer: GPUBuffer | null = null;
    #unifiedGlobalUniformGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectResetTemplateGPUBuffer: GPUBuffer | null = null;

    #cpuUnifiedGlobalUniformData: Float32Array;
    #cpuUnifiedGlobalUniformUint32: Uint32Array;

    #shadowIndirectResetTemplate: Uint32Array;
    #dirtyTypeParams: boolean = true;

    #allocations: Map<string, FoliageTypeAllocation> = new Map();
    #allocatedTypes: FoliageTypeAllocation[] = [];

    #unifiedCullingBindGroup: GPUBindGroup | null = null;
    #cachedHZBTextureView: GPUTextureView | null = null;
    #cachedHZBSampler: GPUSampler | null = null;

    /**
     * [KO] FoliageScatterMegaBuffer 인스턴스를 생성하고 내부 GPU 버퍼들을 초기화합니다.
     * [EN] Creates a FoliageScatterMegaBuffer instance and initializes internal GPU buffers.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param initialCapacity -
     * [KO] 초기 인스턴스 수용 용량 (기본값: 65536)
     * [EN] Initial instance capacity (default: 65536)
     * @param maxTypes -
     * [KO] 최대 지원 식생 타입 개수 (기본값: 64)
     * [EN] Maximum supported foliage types count (default: 64)
     */
    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 65536,
        maxTypes: number = 64
    ) {
        const shaderInfo = redGPUContext.resourceManager.wgslParser.parse(
            'Foliage_Cull_ShaderModule',
            foliageCullWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                instanceStructName: 'FoliageInstance',
                typeParamStructName: 'FoliageTypeParam'
            },
            initialCapacity,
            maxTypes,
            maxTypes * 8
        );

        this.#shadowIndirectResetTemplate = new Uint32Array(
            this.maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT * SHADOW_CASCADE_COUNT
        );

        const globalUniformBytes =
            shaderInfo.uniforms?.['globalUniforms']?.arrayBufferByteLength ||
            shaderInfo.structs?.['FoliageCullingUniforms']?.arrayBufferByteLength;
        if (!globalUniformBytes) {
            throw new Error('[FoliageScatterMegaBuffer] Failed to reflect "FoliageCullingUniforms" struct size from foliageCullWGSL.');
        }

        this.#globalUniformBytes = globalUniformBytes;
        const globalUniformFloats = globalUniformBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#cpuUnifiedGlobalUniformData = new Float32Array(globalUniformFloats);
        this.#cpuUnifiedGlobalUniformUint32 = new Uint32Array(this.#cpuUnifiedGlobalUniformData.buffer);

        this.#initBuffers();
    }

    /**
     * [KO] 캐스케이드 그림자 컬링을 통과한 인스턴스 데이터가 기록되는 GPU 스토리지 버퍼를 반환합니다.
     * [EN] Returns the GPU storage buffer where instances passing cascade shadow culling are recorded.
     */
    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#shadowCulledGPUBuffer;
    }

    /**
     * [KO] 캐스케이드 그림자 드로우 호출에 사용되는 GPU 간접 버퍼를 반환합니다.
     * [EN] Returns the GPU indirect buffer used for cascade shadow draw calls.
     */
    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#shadowIndirectGPUBuffer;
    }

    /**
     * [KO] 모든 필수 GPU 버퍼(컬링 및 섀도우 버퍼 포함)가 초기화되어 준비되었는지 여부를 반환합니다.
     * [EN] Returns whether all essential GPU buffers (including culling and shadow buffers) are initialized and ready for use.
     */
    override get isReady(): boolean {
        return super.isReady && this.culledGPUBuffer !== null && this.#shadowCulledGPUBuffer !== null && this.#unifiedGlobalUniformGPUBuffer !== null;
    }

    /**
     * [KO] 새로운 식생 타입에 대한 버퍼 세그먼트를 할당하고 오프셋을 등록합니다.
     * [EN] Allocates a buffer segment and registers offsets for a new foliage type.
     * @param name -
     * [KO] 식생 타입 고유 이름
     * [EN] Unique foliage type name
     * @param maxInstances -
     * [KO] 최대 허용 인스턴스 수
     * [EN] Maximum allowed instances
     * @param renderUnits -
     * [KO] 식생 렌더 유닛 배열
     * [EN] Foliage render units array
     * @param shadowMergedRenderUnits -
     * [KO] 그림자 패스 통합 렌더 유닛 배열 (선택사항)
     * [EN] Shadow pass merged render units array (optional)
     * @param lodInfoList -
     * [KO] LOD 정보 목록 (선택사항)
     * [EN] LOD info list (optional)
     * @returns
     * [KO] 할당된 세그먼트 정보 객체
     * [EN] Allocated segment info object
     */
    allocateType(
        name: string,
        maxInstances: number,
        renderUnits: FoliageRenderUnit[],
        shadowMergedRenderUnits?: FoliageRenderUnit[],
        lodInfoList?: FoliageLODInfo[]
    ): FoliageTypeAllocation {
        const existing = this.#allocations.get(name);
        if (existing) {
            return existing;
        }

        const typeId = this.#allocatedTypes.length;
        if (typeId >= this.maxTypes) {
            throw new Error(`[FoliageScatterMegaBuffer] Maximum supported FoliageTypes (${this.maxTypes}) exceeded.`);
        }

        const renderUnitCount = renderUnits.length;
        const baseSegment = this.allocateBaseSegment(name, maxInstances, renderUnitCount, 8);
        const {culledBaseOffset, indirectBaseOffset, maxInstances: alignedMaxInstances} = baseSegment;

        const allocation: FoliageTypeAllocation = {
            ...baseSegment,
            typeId,
            name,
            renderUnitCount,
            instanceCount: 0
        };

        this.#allocations.set(name, allocation);
        this.#allocatedTypes.push(allocation);

        const {strideBytes} = this;

        for (let s = 0; s < renderUnitCount; s++) {
            const unit = renderUnits[s];
            unit.instanceBufferOffset = (culledBaseOffset + (unit.lodIndex * alignedMaxInstances)) * strideBytes;
            unit.indirectOffsetBytes = (indirectBaseOffset + s) * 20;
        }

        if (shadowMergedRenderUnits && lodInfoList) {
            for (let i = 0; i < shadowMergedRenderUnits.length; i++) {
                const shadowUnit = shadowMergedRenderUnits[i];
                let lodInfo: any = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === shadowUnit.lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                const unitOffset = lodInfo ? lodInfo.renderUnitOffset : 0;
                shadowUnit.instanceBufferOffset = (culledBaseOffset + (shadowUnit.lodIndex * alignedMaxInstances)) * strideBytes;
                shadowUnit.indirectOffsetBytes = (indirectBaseOffset + unitOffset) * 20;
            }
        }

        this.registerRenderUnitsToTemplate(renderUnits, indirectBaseOffset, shadowMergedRenderUnits, lodInfoList);
        this.invalidateUnifiedCullingBindGroup();

        return allocation;
    }

    /**
     * [KO] 유니파이드 GPU 컬링에 필요한 글로벌 유니폼 버퍼를 RenderViewStateData SSOT로부터 CPU에서 갱신하고 GPU로 전송합니다.
     * [EN] Updates global uniforms required for unified GPU culling on CPU directly from RenderViewStateData SSOT and transfers them to GPU.
     *
     * @param renderViewStateData - 렌더 뷰 상태 데이터 (카메라, 프러스텀, 캐스케이드 정보 포함)
     * @param fovFactor - 카메라 FOV 탄젠트 팩터
     * @param viewProjectionMatrix - 뷰-프로젝션 행렬 (선택사항)
     * @param hzbWidth - HZB 텍스처 가로 크기 (기본값: 512.0)
     * @param hzbHeight - HZB 텍스처 세로 크기 (기본값: 256.0)
     * @param depthBias - HZB 오클루전 깊이 바이어스 (기본값: 0.002)
     */
    updateUnifiedGlobalUniforms(
        renderViewStateData: RenderViewStateData,
        fovFactor: number,
        viewProjectionMatrix: mat4 | null = null,
        hzbWidth: number = 512.0,
        hzbHeight: number = 256.0,
        depthBias: number = 0.002
    ): void {
        const typeParamsGPUBuffer = this.typeParamsGPUBuffer;
        if (!typeParamsGPUBuffer) return;

        const {
            view,
            activeCascadeCount,
            cascadeSplitDepths,
            cascadeShadowFrustumPlanesByCascade,
            frustumPlanesFlat: mainFrustumPlanes
        } = renderViewStateData;
        const camera = view.rawCamera;
        const {x: camX, y: camY, z: camZ} = camera;
        const {pixelRectArray, hierarchicalZBuffer} = view;
        const viewportHeight = pixelRectArray[3];
        const hzbEnabled = !!hierarchicalZBuffer?.textureView;

        const gf32 = this.#cpuUnifiedGlobalUniformData;
        const gu32 = this.#cpuUnifiedGlobalUniformUint32;

        gf32[0] = camX;
        gf32[1] = camY;
        gf32[2] = camZ;
        gu32[3] = this.totalAllocatedInstances;

        gf32[4] = fovFactor > 0 ? fovFactor : 1.0;
        gu32[5] = this.maxRenderUnits;
        gu32[6] = this.instanceCapacity * 8;
        gu32[7] = activeCascadeCount;

        gu32[8] = (hzbEnabled && viewProjectionMatrix) ? 1 : 0;
        gf32[9] = viewportHeight > 0 ? viewportHeight : 1080.0;
        gf32[10] = depthBias;
        gf32[11] = 0; // pad0 (hzbWidth)

        gf32[12] = 0; // pad1 (hzbHeight)
        gf32[13] = 0; // pad2
        gf32[14] = 0; // pad3
        gf32[15] = 0; // pad4

        if (viewProjectionMatrix) {
            gf32.set(viewProjectionMatrix, 16);
        } else {
            gf32.fill(0, 16, 32);
        }

        gf32.set(mainFrustumPlanes, 32);

        for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
            const cascadeBase = 56 + c * 28;
            if (c < activeCascadeCount && cascadeShadowFrustumPlanesByCascade?.[c]) {
                gf32[cascadeBase] = cascadeSplitDepths?.[c] ?? 0.0;
                gu32[cascadeBase + 1] = 1;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;
                gf32.set(cascadeShadowFrustumPlanesByCascade[c], cascadeBase + 4);
            } else {
                gf32[cascadeBase] = 0.0;
                gu32[cascadeBase + 1] = 0;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;
                gf32.fill(0, cascadeBase + 4, cascadeBase + 28);
            }
        }

        const count = this.#allocatedTypes.length;
        const {typeParamFloats, cpuTypeParamsUint32} = this;
        for (let i = 0; i < count; i++) {
            const alloc = this.#allocatedTypes[i];
            const baseOffset = alloc.typeId * typeParamFloats;
            const prevCount = cpuTypeParamsUint32[baseOffset + 9];
            if (prevCount !== alloc.instanceCount) {
                cpuTypeParamsUint32[baseOffset + 9] = alloc.instanceCount;
                this.#dirtyTypeParams = true;
            }
        }

        const gpuDevice = this.gpuDevice;
        const globalUniformBytes = this.#globalUniformBytes;
        gpuDevice.queue.writeBuffer(
            this.#unifiedGlobalUniformGPUBuffer,
            0,
            gf32.buffer,
            gf32.byteOffset,
            globalUniformBytes
        );

        if (this.#dirtyTypeParams) {
            this.#dirtyTypeParams = false;
            gpuDevice.queue.writeBuffer(
                typeParamsGPUBuffer,
                0,
                this.cpuTypeParamsBuffer.buffer,
                this.cpuTypeParamsBuffer.byteOffset,
                this.#allocatedTypes.length * typeParamFloats * 4
            );
        }
    }

    /**
     * [KO] 특정 식생 타입의 컬링 및 LOD 파라미터를 CPU 버퍼에 갱신합니다.
     * [EN] Updates culling and LOD parameters for a specific foliage type in CPU buffer.
     */
    updateTypeParams(
        allocation: FoliageTypeAllocation,
        cullingDistance: number,
        fadeStartDistance: number,
        boundingRadius: number,
        bottomOffset: number,
        lodInfoList: FoliageLODInfo[],
        shadowCullDistance: number = 300.0,
        height: number = 2.0
    ): void {
        this.#dirtyTypeParams = true;
        const typeId = allocation.typeId;
        const baseOffset = typeId * this.typeParamFloats;
        const {cpuTypeParamsBuffer: f32, cpuTypeParamsUint32: u32} = this;

        f32[baseOffset] = cullingDistance;
        f32[baseOffset + 1] = fadeStartDistance;
        f32[baseOffset + 2] = boundingRadius;
        f32[baseOffset + 3] = bottomOffset;

        const numLODs = Math.min(lodInfoList.length, 8);
        u32[baseOffset + 4] = numLODs;
        u32[baseOffset + 5] = allocation.maxInstances;
        u32[baseOffset + 6] = allocation.culledBaseOffset;
        u32[baseOffset + 7] = allocation.indirectBaseOffset;

        const fadeRange = Math.max(cullingDistance - fadeStartDistance, 1.0);
        u32[baseOffset + 8] = allocation.rawBaseOffset;
        u32[baseOffset + 9] = allocation.instanceCount;
        f32[baseOffset + 10] = shadowCullDistance;

        f32[baseOffset + 11] = 1.0 / fadeRange;
        f32[baseOffset + 12] = height;
        f32[baseOffset + 13] = 0;
        f32[baseOffset + 14] = 0;
        f32[baseOffset + 15] = 0;

        for (let l = 0; l < 8; l++) {
            const lodBase = baseOffset + 16 + l * 8;
            if (l < numLODs) {
                const info = lodInfoList[l];
                const prevDist = l > 0 ? lodInfoList[l - 1].lodDistance : 0.0;
                const nextDist = info.lodDistance;
                const span = Math.max(nextDist - prevDist, 5.0);
                const fadeRange = Math.max(5.0, Math.min(15.0, span * 0.10));
                const halfRange = fadeRange * 0.5;

                const enterStart = Math.max(prevDist - halfRange, 0.0);
                const enterEnd = prevDist + halfRange;
                const exitStart = nextDist - halfRange;
                const exitEnd = nextDist + halfRange;

                const enterSpan = Math.max(enterEnd - enterStart, 0.001);
                const exitSpan = Math.max(exitEnd - exitStart, 0.001);

                f32[lodBase] = enterStart;
                f32[lodBase + 1] = enterEnd;
                f32[lodBase + 2] = exitStart;
                f32[lodBase + 3] = exitEnd;
                f32[lodBase + 4] = 1.0 / enterSpan;
                f32[lodBase + 5] = 1.0 / exitSpan;
                u32[lodBase + 6] = info.renderUnitOffset;
                u32[lodBase + 7] = info.renderUnitCount;
            } else {
                f32[lodBase] = 999999.0;
                f32[lodBase + 1] = 999999.0;
                f32[lodBase + 2] = 999999.0;
                f32[lodBase + 3] = 999999.0;
                f32[lodBase + 4] = 0.0;
                f32[lodBase + 5] = 0.0;
                u32[lodBase + 6] = 0;
                u32[lodBase + 7] = 0;
            }
        }
    }

    /**
     * [KO] 통합 컬링 연산에 필요한 GPUBindGroup을 생성하거나 캐시된 바인드그룹을 반환합니다.
     * [EN] Creates GPUBindGroup required for unified culling compute or returns cached bind group.
     */
    getOrCreateUnifiedCullingBindGroup(
        layout: GPUBindGroupLayout,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): GPUBindGroup | null {
        const {
            rawGPUBuffer,
            typeParamsGPUBuffer,
            culledGPUBuffer,
            indirectGPUBuffer,
            gpuDevice,
            resourceManager
        } = this;
        const shadowCulled = this.#shadowCulledGPUBuffer;
        const shadowIndirect = this.#shadowIndirectGPUBuffer;
        const globalUniform = this.#unifiedGlobalUniformGPUBuffer;

        if (!rawGPUBuffer || !typeParamsGPUBuffer || !culledGPUBuffer || !indirectGPUBuffer || !shadowCulled || !shadowIndirect || !globalUniform) {
            return null;
        }

        const targetHZBView = hzbTextureView || resourceManager.emptyR32FloatTextureView;
        const targetHZBSampler = hzbSampler || resourceManager.basicSampler.gpuSampler;

        if (this.#unifiedCullingBindGroup &&
            this.#cachedHZBTextureView === targetHZBView &&
            this.#cachedHZBSampler === targetHZBSampler) {
            return this.#unifiedCullingBindGroup;
        }

        this.#cachedHZBTextureView = targetHZBView;
        this.#cachedHZBSampler = targetHZBSampler;

        this.#unifiedCullingBindGroup = gpuDevice.createBindGroup({
            label: 'FoliageScatterMegaBuffer_Culling_BindGroup',
            layout,
            entries: [
                {binding: 0, resource: {buffer: rawGPUBuffer}},
                {binding: 1, resource: {buffer: globalUniform}},
                {binding: 2, resource: {buffer: typeParamsGPUBuffer}},
                {binding: 3, resource: {buffer: culledGPUBuffer}},
                {binding: 4, resource: {buffer: indirectGPUBuffer}},
                {binding: 5, resource: {buffer: shadowCulled}},
                {binding: 6, resource: {buffer: shadowIndirect}},
                {binding: 7, resource: targetHZBView},
                {binding: 8, resource: targetHZBSampler},
            ],
        });

        return this.#unifiedCullingBindGroup;
    }

    /**
     * [KO] 캐시된 단일 일괄 컬링 바인드그룹 및 HZB 텍스처/샘플러 캐시를 무효화합니다.
     * [EN] Invalidates the cached unified culling bind group and HZB texture/sampler caches.
     */
    override invalidateUnifiedCullingBindGroup(): void {
        this.#unifiedCullingBindGroup = null;
        this.#cachedHZBTextureView = null;
        this.#cachedHZBSampler = null;
    }

    /**
     * [KO] 렌더 유닛 및 그림자 통합 렌더 유닛의 드로우 인자들을 인디렉트 템플릿 버퍼에 등록합니다.
     * [EN] Registers draw arguments of render units and shadow merged render units to indirect template buffer.
     */
    registerRenderUnitsToTemplate(
        renderUnits: FoliageRenderUnit[],
        indirectBaseOffset: number,
        shadowMergedRenderUnits?: FoliageRenderUnit[],
        lodInfoList?: FoliageLODInfo[]
    ): void {
        const maxRenderUnits = this.maxRenderUnits;

        for (let s = 0; s < renderUnits.length; s++) {
            const unit = renderUnits[s];
            const count = unit.isIndexed ? unit.indexCount : unit.vertexCount;
            this.registerIndirectDrawSlot(indirectBaseOffset + s, count, unit.firstIndex);

            for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                const shadowSlot = (c * maxRenderUnits + indirectBaseOffset + s) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                this.#shadowIndirectResetTemplate[shadowSlot] = count;
                this.#shadowIndirectResetTemplate[shadowSlot + 2] = unit.firstIndex;
            }
        }

        if (shadowMergedRenderUnits && lodInfoList) {
            const hasMaskedLOD0 = renderUnits.some(s => s.lodIndex === 0 && s.isMasked);
            for (let i = 0; i < shadowMergedRenderUnits.length; i++) {
                const shadowUnit = shadowMergedRenderUnits[i];
                if (shadowUnit.lodIndex === 0 && hasMaskedLOD0) {
                    continue;
                }
                let lodInfo: FoliageLODInfo | null = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === shadowUnit.lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                if (!lodInfo) continue;
                const slotIndex = indirectBaseOffset + lodInfo.renderUnitOffset;
                const count = shadowUnit.isIndexed ? shadowUnit.indexCount : shadowUnit.vertexCount;
                for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                    const shadowSlot = (c * maxRenderUnits + slotIndex) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                    this.#shadowIndirectResetTemplate[shadowSlot] = count;
                    this.#shadowIndirectResetTemplate[shadowSlot + 2] = shadowUnit.firstIndex;
                }
            }
        }

        this.syncIndirectResetTemplateToGPU(indirectBaseOffset, renderUnits.length);

        const gpuDevice = this.gpuDevice;
        if (gpuDevice && this.#shadowIndirectResetTemplateGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#shadowIndirectResetTemplateGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                0,
                this.#shadowIndirectResetTemplate.byteLength
            );
        }
    }

    /**
     * [KO] 인스턴스 최대 수용 용량이 증가할 때 호출되어 메인 및 그림자 컬링 GPU 버퍼를 리사이징합니다.
     * [EN] Invoked when maximum instance capacity expands to resize main and shadow culled GPU buffers.
     *
     * @param newCapacity -
     * [KO] 새로 확장된 인스턴스 수용 용량
     * [EN] Newly expanded instance capacity
     */
    onResizeBuffers(newCapacity: number): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const strideBytes = this.strideBytes;
        const instanceCapacity = newCapacity || this.instanceCapacity;
        const culledByteSize = instanceCapacity * 8 * strideBytes;

        this.culledGPUBuffer?.destroy();
        this.#shadowCulledGPUBuffer?.destroy();

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_Culled_ShadowMega',
            size: culledByteSize * SHADOW_CASCADE_COUNT,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.invalidateUnifiedCullingBindGroup();
    }

    /**
     * [KO] 메가버퍼 인스턴스 해제 시 그림자 버퍼, 유니폼 버퍼, 바인드그룹 및 식생 타입 할당 목록을 파괴합니다.
     * [EN] Destroys shadow buffers, uniform buffers, bind groups, and foliage type allocations upon mega-buffer release.
     */
    onDestroy(): void {
        this.invalidateUnifiedCullingBindGroup();
        this.#shadowCulledGPUBuffer?.destroy();
        this.#shadowIndirectGPUBuffer?.destroy();
        this.#unifiedGlobalUniformGPUBuffer?.destroy();
        this.#shadowIndirectResetTemplateGPUBuffer?.destroy();

        this.#shadowCulledGPUBuffer = null;
        this.#shadowIndirectGPUBuffer = null;
        this.#unifiedGlobalUniformGPUBuffer = null;
        this.#shadowIndirectResetTemplateGPUBuffer = null;
        this.#allocations.clear();
        this.#allocatedTypes.length = 0;
        this.clearBaseAllocations();
    }

    /**
     * [KO] 매 프레임 식생의 CSM 그림자 간접 드로우 버퍼 인스턴스 카운트를 템플릿으로부터 리셋합니다.
     * [EN] Resets instance counts of foliage CSM shadow indirect draw buffers from template each frame.
     * @param commandEncoder - GPU 커맨드 인코더 (제공 시 copyBufferToBuffer 사용)
     */
    protected override onResetMultiIndirectCommands(commandEncoder: GPUCommandEncoder | null): void {
        const targetGPUBuffer = this.#shadowIndirectGPUBuffer;
        const templateGPUBuffer = this.#shadowIndirectResetTemplateGPUBuffer;

        const indirectStrideBytes = DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
        const byteSize = Math.min(
            (this.maxRenderUnits * 3 + this.totalIndirectDrawCalls) * indirectStrideBytes,
            this.#shadowIndirectResetTemplate.byteLength
        );
        if (byteSize <= 0) return;

        if (commandEncoder) {
            commandEncoder.copyBufferToBuffer(
                templateGPUBuffer,
                0,
                targetGPUBuffer,
                0,
                byteSize
            );
        } else {
            const gpuDevice = this.gpuDevice;
            if (gpuDevice) {
                gpuDevice.queue.writeBuffer(
                    targetGPUBuffer,
                    0,
                    this.#shadowIndirectResetTemplate.buffer,
                    0,
                    byteSize
                );
            }
        }
    }

    #initBuffers(): void {
        const {gpuDevice, instanceCapacity, maxRenderUnits} = this;

        const rawByteSize = Math.max(instanceCapacity * this.strideBytes, 64);
        const culledByteSize = rawByteSize * 8;
        const indirectByteSize = Math.max(
            maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT,
            64
        );

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_Culled_ShadowMega',
            size: culledByteSize * SHADOW_CASCADE_COUNT,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#shadowIndirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_Indirect_ShadowMega',
            size: indirectByteSize * SHADOW_CASCADE_COUNT,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#shadowIndirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_Indirect_ShadowTemplate',
            size: indirectByteSize * SHADOW_CASCADE_COUNT,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.#unifiedGlobalUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageScatterMegaBuffer_GlobalUniformBuffer',
            size: this.#globalUniformBytes,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(FoliageScatterMegaBuffer);
export default FoliageScatterMegaBuffer;
