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
import consoleAndThrowError from '../../../../utils/consoleAndThrowError';

const SHADOW_CASCADE_COUNT = 4;

/**
 * [KO] 메가 버퍼 내 단일 식생 타입에 할당된 세그먼트 정보 인터페이스입니다.
 * [EN] Interface representing segment allocation information for a single foliage type within the mega buffer.
 * @category Landscape
 */
export interface FoliageTypeAllocation extends ScatterBaseSegmentAllocation {
    /**
     * [KO] 할당된 식생 타입의 고유 이름
     * [EN] Unique name of the allocated foliage type
     */
    name: string;
}

/**
 * [KO] 모든 식생(Foliage) 타입의 원시 인스턴스, 메인/그림자 컬링 출력 버퍼, 간접 드로우 버퍼 및 컬링 유니폼을 단일 통합 버퍼 체계로 관리하는 메가 버퍼 클래스입니다.
 * [EN] Mega buffer class that manages raw instances, main/shadow culled output buffers, indirect draw buffers, and culling uniforms for all foliage types in a unified buffer architecture.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class FoliageMegaBuffer extends AScatterMegaBuffer {
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
     * [KO] `FoliageMegaBuffer` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageMegaBuffer` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param initialCapacity -
     * [KO] 초기 최대 인스턴스 수용량 (기본값: `65536`)
     * [EN] Initial maximum instance capacity (default: `65536`)
     * @param maxTypes -
     * [KO] 지원할 최대 식생 타입 수 (기본값: `64`)
     * [EN] Maximum number of supported foliage types (default: `64`)
     * @throws
     * [KO] `foliageCullWGSL`에서 `FoliageCullingUniforms` 구조체 크기를 리플렉션하지 못한 경우 Error 발생
     * [EN] Throws Error if reflecting the `FoliageCullingUniforms` struct size from `foliageCullWGSL` fails
     */
    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 65536,
        maxTypes: number = 64
    ) {
        const {resourceManager} = redGPUContext;
        const shaderInfo = resourceManager.wgslParser.parse(
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

        const {uniforms, structs} = shaderInfo;
        const globalUniformBytes =
            uniforms?.['globalUniforms']?.arrayBufferByteLength ??
            structs?.['FoliageCullingUniforms']?.arrayBufferByteLength;
        if (!globalUniformBytes) {
            throw new Error('[FoliageMegaBuffer] Failed to reflect "FoliageCullingUniforms" struct size from foliageCullWGSL.');
        }

        this.#globalUniformBytes = globalUniformBytes;
        const globalUniformFloats = globalUniformBytes / Float32Array.BYTES_PER_ELEMENT;
        this.#cpuUnifiedGlobalUniformData = new Float32Array(globalUniformFloats);
        this.#cpuUnifiedGlobalUniformUint32 = new Uint32Array(this.#cpuUnifiedGlobalUniformData.buffer);

        this.#initBuffers();
    }

    /**
     * [KO] 그림자 캐스케이드용 컬링 결과 인스턴스 GPU 버퍼를 반환합니다.
     * [EN] Returns the culled instance GPU buffer for shadow cascades.
     *
     * @returns
     * [KO] 그림자 컬링 인스턴스 `GPUBuffer` 또는 `null`
     * [EN] Shadow culled instance `GPUBuffer` or `null`
     */
    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#shadowCulledGPUBuffer;
    }

    /**
     * [KO] 그림자 캐스케이드용 간접 드로우(Indirect Draw) GPU 버퍼를 반환합니다.
     * [EN] Returns the indirect draw GPU buffer for shadow cascades.
     *
     * @returns
     * [KO] 그림자 간접 드로우 `GPUBuffer` 또는 `null`
     * [EN] Shadow indirect draw `GPUBuffer` or `null`
     */
    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#shadowIndirectGPUBuffer;
    }

    /**
     * [KO] 모든 내부 GPU 버퍼가 정상적으로 생성되어 사용 가능한 상태인지 반환합니다.
     * [EN] Returns whether all internal GPU buffers are properly created and ready for use.
     *
     * @returns
     * [KO] 메가 버퍼 준비 완료 여부
     * [EN] Whether the mega buffer is ready
     */
    override get isReady(): boolean {
        return super.isReady && this.culledGPUBuffer != null && this.#shadowCulledGPUBuffer != null && this.#unifiedGlobalUniformGPUBuffer != null;
    }

    /**
     * [KO] 새로운 식생 타입을 위한 인스턴스 세그먼트 및 간접 드로우 슬롯을 할당합니다.
     * [EN] Allocates an instance segment and indirect draw slots for a new foliage type.
     *
     * @param name -
     * [KO] 식생 타입 고유 이름
     * [EN] Unique name of the foliage type
     * @param maxInstances -
     * [KO] 할당할 최대 인스턴스 수
     * [EN] Maximum number of instances to allocate
     * @param renderUnits -
     * [KO] 메인 패스용 렌더 유닛 목록
     * [EN] List of render units for the main pass
     * @param shadowMergedRenderUnits -
     * [KO] 그림자 패스 전용 병합 렌더 유닛 목록 (선택)
     * [EN] List of merged render units for the shadow pass (optional)
     * @param lodInfoList -
     * [KO] LOD 단계별 메타데이터 목록 (선택)
     * [EN] List of metadata per LOD level (optional)
     * @returns
     * [KO] 할당된 식생 타입 세그먼트 정보(`FoliageTypeAllocation`)
     * [EN] Allocated foliage type segment information (`FoliageTypeAllocation`)
     * @throws
     * [KO] 최대 지원 식생 타입 수(`maxTypes`)를 초과할 경우 Error 발생
     * [EN] Throws Error if the maximum supported foliage types (`maxTypes`) is exceeded
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
            throw new Error(`[FoliageMegaBuffer] Maximum supported FoliageTypes (${this.maxTypes}) exceeded.`);
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
            const {lodIndex} = unit;
            unit.instanceBufferOffset = (culledBaseOffset + (lodIndex * alignedMaxInstances)) * strideBytes;
            unit.indirectOffsetBytes = (indirectBaseOffset + s) * 20;
        }

        if (shadowMergedRenderUnits && lodInfoList) {
            for (let i = 0; i < shadowMergedRenderUnits.length; i++) {
                const shadowUnit = shadowMergedRenderUnits[i];
                const {lodIndex} = shadowUnit;
                let lodInfo: any = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                const unitOffset = lodInfo?.renderUnitOffset ?? 0;
                shadowUnit.instanceBufferOffset = (culledBaseOffset + (lodIndex * alignedMaxInstances)) * strideBytes;
                shadowUnit.indirectOffsetBytes = (indirectBaseOffset + unitOffset) * 20;
            }
        }

        this.registerRenderUnitsToTemplate(renderUnits, indirectBaseOffset, shadowMergedRenderUnits, lodInfoList);
        this.invalidateUnifiedCullingBindGroup();

        return allocation;
    }

    /**
     * [KO] 카메라 위치, 절두체 평면, 그림자 캐스케이드 정보 및 타입별 인스턴스 수를 통합 글로벌 유니폼 버퍼에 업데이트합니다.
     * [EN] Updates the unified global uniform buffer with camera position, frustum planes, shadow cascade data, and per-type instance counts.
     *
     * @param renderViewStateData -
     * [KO] 현재 프레임의 렌더 뷰 상태 데이터
     * [EN] Render view state data for the current frame
     * @param fovFactor -
     * [KO] 카메라 시야각 탄젠트 계수(`tan(fov * 0.5)`)
     * [EN] Camera field-of-view tangent factor (`tan(fov * 0.5)`)
     * @param viewProjectionMatrix -
     * [KO] 뷰-프로젝션 결합 행렬(`mat4` 또는 `null`)
     * [EN] Combined view-projection matrix (`mat4` or `null`)
     * @param hzbWidth -
     * [KO] HZB 텍스처 너비 (기본값: `512.0`)
     * [EN] HZB texture width (default: `512.0`)
     * @param hzbHeight -
     * [KO] HZB 텍스처 높이 (기본값: `256.0`)
     * [EN] HZB texture height (default: `256.0`)
     * @param depthBias -
     * [KO] HZB 오클루전 테스트 깊이 바이어스 (기본값: `0.002`)
     * [EN] HZB occlusion test depth bias (default: `0.002`)
     */
    updateUnifiedGlobalUniforms(
        renderViewStateData: RenderViewStateData,
        fovFactor: number,
        viewProjectionMatrix: mat4 | null = null,
        hzbWidth: number = 512.0,
        hzbHeight: number = 256.0,
        depthBias: number = 0.002
    ): void {
        const {typeParamsGPUBuffer} = this;
        if (!typeParamsGPUBuffer) return;

        const {
            view,
            activeCascadeCount,
            cascadeSplitDepths,
            cascadeShadowFrustumPlanesByCascade,
            frustumPlanesFlat: mainFrustumPlanes
        } = renderViewStateData;
        const {rawCamera, pixelRectArray, hierarchicalZBuffer} = view;
        const {x, y, z} = rawCamera;
        const viewportHeight = pixelRectArray[3];
        const hzbEnabled = !!hierarchicalZBuffer?.textureView;

        const gf32 = this.#cpuUnifiedGlobalUniformData;
        const gu32 = this.#cpuUnifiedGlobalUniformUint32;
        const {totalAllocatedInstances, maxRenderUnits, instanceCapacity} = this;

        gf32[0] = x;
        gf32[1] = y;
        gf32[2] = z;
        gu32[3] = totalAllocatedInstances;

        gf32[4] = fovFactor > 0 ? fovFactor : 1.0;
        gu32[5] = maxRenderUnits;
        gu32[6] = instanceCapacity * 8;
        gu32[7] = activeCascadeCount;

        gu32[8] = (hzbEnabled && viewProjectionMatrix) ? 1 : 0;
        gf32[9] = viewportHeight > 0 ? viewportHeight : 1080.0;
        gf32[10] = depthBias;
        gf32[11] = 0;

        gf32[12] = 0;
        gf32[13] = 0;
        gf32[14] = 0;
        gf32[15] = 0;

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
            const {typeId, instanceCount} = alloc;
            const baseOffset = typeId * typeParamFloats;
            const prevCount = cpuTypeParamsUint32[baseOffset + 9];
            if (prevCount !== instanceCount) {
                cpuTypeParamsUint32[baseOffset + 9] = instanceCount;
                this.#dirtyTypeParams = true;
            }
        }

        const {gpuDevice} = this;
        const {buffer, byteOffset} = gf32;
        const globalUniformBytes = this.#globalUniformBytes;
        gpuDevice.queue.writeBuffer(
            this.#unifiedGlobalUniformGPUBuffer,
            0,
            buffer,
            byteOffset,
            globalUniformBytes
        );

        if (this.#dirtyTypeParams) {
            this.#dirtyTypeParams = false;
            const {buffer, byteOffset} = this.cpuTypeParamsBuffer;
            gpuDevice.queue.writeBuffer(
                typeParamsGPUBuffer,
                0,
                buffer,
                byteOffset,
                this.#allocatedTypes.length * typeParamFloats * 4
            );
        }
    }

    /**
     * [KO] 특정 식생 타입의 컬링 거리, 페이드 구간, 바운딩 치수 및 LOD 전환 거리 정보를 타입 파라미터 버퍼에 기록합니다.
     * [EN] Writes culling distance, fade range, bounding dimensions, and LOD transition distances for a specific foliage type into the type parameters buffer.
     *
     * @param allocation -
     * [KO] 대상 식생 타입 세그먼트 할당 정보
     * [EN] Target foliage type segment allocation info
     * @param cullingDistance -
     * [KO] 최대 컬링 거리(월드 단위)
     * [EN] Maximum culling distance in world units
     * @param fadeStartDistance -
     * [KO] 디더링 페이드 아웃 시작 거리(월드 단위)
     * [EN] Dither fade-out start distance in world units
     * @param boundingRadius -
     * [KO] 바운딩 스피어 반경(월드 단위)
     * [EN] Bounding sphere radius in world units
     * @param bottomOffset -
     * [KO] 하단 수직 오프셋(월드 단위)
     * [EN] Bottom vertical offset in world units
     * @param lodInfoList -
     * [KO] LOD 단계별 메타데이터 배열
     * [EN] Array of metadata per LOD level
     * @param shadowCullDistance -
     * [KO] 그림자 최대 컬링 거리 (기본값: `300.0`)
     * [EN] Maximum shadow culling distance (default: `300.0`)
     * @param height -
     * [KO] 식생 기준 높이 (기본값: `2.0`)
     * [EN] Reference foliage height (default: `2.0`)
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
        const {
            typeId,
            maxInstances,
            culledBaseOffset,
            indirectBaseOffset,
            rawBaseOffset,
            instanceCount
        } = allocation;
        const baseOffset = typeId * this.typeParamFloats;
        const {cpuTypeParamsBuffer: f32, cpuTypeParamsUint32: u32} = this;

        f32[baseOffset] = cullingDistance;
        f32[baseOffset + 1] = fadeStartDistance;
        f32[baseOffset + 2] = boundingRadius;
        f32[baseOffset + 3] = bottomOffset;

        const numLODs = Math.min(lodInfoList.length, 8);
        u32[baseOffset + 4] = numLODs;
        u32[baseOffset + 5] = maxInstances;
        u32[baseOffset + 6] = culledBaseOffset;
        u32[baseOffset + 7] = indirectBaseOffset;

        const fadeRange = Math.max(cullingDistance - fadeStartDistance, 1.0);
        u32[baseOffset + 8] = rawBaseOffset;
        u32[baseOffset + 9] = instanceCount;
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
                const {lodDistance, renderUnitOffset, renderUnitCount} = info;
                const prevDist = l > 0 ? lodInfoList[l - 1].lodDistance : 0.0;
                const span = Math.max(lodDistance - prevDist, 5.0);
                const fadeRange = Math.max(5.0, Math.min(15.0, span * 0.10));
                const halfRange = fadeRange * 0.5;

                const enterStart = Math.max(prevDist - halfRange, 0.0);
                const enterEnd = prevDist + halfRange;
                const exitStart = lodDistance - halfRange;
                const exitEnd = lodDistance + halfRange;

                const enterSpan = Math.max(enterEnd - enterStart, 0.001);
                const exitSpan = Math.max(exitEnd - exitStart, 0.001);

                f32[lodBase] = enterStart;
                f32[lodBase + 1] = enterEnd;
                f32[lodBase + 2] = exitStart;
                f32[lodBase + 3] = exitEnd;
                f32[lodBase + 4] = 1.0 / enterSpan;
                f32[lodBase + 5] = 1.0 / exitSpan;
                u32[lodBase + 6] = renderUnitOffset;
                u32[lodBase + 7] = renderUnitCount;
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
     * [KO] 통합 식생 컬링 컴퓨트 패스를 위한 `GPUBindGroup`을 조회하거나 생성하여 반환합니다.
     * [EN] Retrieves or creates the `GPUBindGroup` for the unified foliage culling compute pass.
     *
     * @param layout -
     * [KO] 컬링 파이프라인의 `GPUBindGroupLayout`
     * [EN] `GPUBindGroupLayout` of the culling pipeline
     * @param hzbTextureView -
     * [KO] 계층적 Z-버퍼(HZB) 텍스처 뷰 (선택)
     * [EN] Hierarchical Z-buffer (HZB) texture view (optional)
     * @param hzbSampler -
     * [KO] HZB 샘플러 (선택)
     * [EN] HZB sampler (optional)
     * @returns
     * [KO] 생성 또는 캐시된 `GPUBindGroup` 인스턴스 (버퍼 미준비 시 `null`)
     * [EN] Created or cached `GPUBindGroup` instance (`null` if buffers are not ready)
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

        const {emptyR32FloatTextureView, basicSampler} = resourceManager;
        const targetHZBView = hzbTextureView ?? emptyR32FloatTextureView;
        const targetHZBSampler = hzbSampler ?? basicSampler.gpuSampler;

        if (this.#unifiedCullingBindGroup &&
            this.#cachedHZBTextureView === targetHZBView &&
            this.#cachedHZBSampler === targetHZBSampler) {
            return this.#unifiedCullingBindGroup;
        }

        this.#cachedHZBTextureView = targetHZBView;
        this.#cachedHZBSampler = targetHZBSampler;

        this.#unifiedCullingBindGroup = gpuDevice.createBindGroup({
            label: 'FoliageMegaBuffer_Culling_BindGroup',
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
     * [KO] 캐싱된 통합 컬링 바인드 그룹을 무효화합니다.
     * [EN] Invalidates the cached unified culling bind group.
     */
    override invalidateUnifiedCullingBindGroup(): void {
        this.#unifiedCullingBindGroup = null;
        this.#cachedHZBTextureView = null;
        this.#cachedHZBSampler = null;
    }

    /**
     * [KO] 메인 및 그림자 렌더 유닛들의 인덱스 개수와 시작 오프셋을 간접 드로우 리셋 템플릿 버퍼에 등록합니다.
     * [EN] Registers index counts and start offsets of main and shadow render units into the indirect draw reset template buffers.
     *
     * @param renderUnits -
     * [KO] 메인 패스용 렌더 유닛 목록
     * [EN] List of render units for the main pass
     * @param indirectBaseOffset -
     * [KO] 간접 드로우 버퍼 내 시작 슬롯 오프셋
     * [EN] Starting slot offset in the indirect draw buffer
     * @param shadowMergedRenderUnits -
     * [KO] 그림자 패스 전용 병합 렌더 유닛 목록 (선택)
     * [EN] List of merged render units for the shadow pass (optional)
     * @param lodInfoList -
     * [KO] LOD 단계별 메타데이터 목록 (선택)
     * [EN] List of metadata per LOD level (optional)
     */
    registerRenderUnitsToTemplate(
        renderUnits: FoliageRenderUnit[],
        indirectBaseOffset: number,
        shadowMergedRenderUnits?: FoliageRenderUnit[],
        lodInfoList?: FoliageLODInfo[]
    ): void {
        const {maxRenderUnits} = this;

        for (let s = 0; s < renderUnits.length; s++) {
            const unit = renderUnits[s];
            const {isIndexed, indexCount, vertexCount, firstIndex} = unit;
            const count = isIndexed ? indexCount : vertexCount;
            this.registerIndirectDrawSlot(indirectBaseOffset + s, count, firstIndex);

            for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                const shadowSlot = (c * maxRenderUnits + indirectBaseOffset + s) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                this.#shadowIndirectResetTemplate[shadowSlot] = count;
                this.#shadowIndirectResetTemplate[shadowSlot + 2] = firstIndex;
            }
        }

        if (shadowMergedRenderUnits && lodInfoList) {
            const hasMaskedLOD0 = renderUnits.some(({lodIndex, isMasked}) => lodIndex === 0 && isMasked);
            for (let i = 0; i < shadowMergedRenderUnits.length; i++) {
                const shadowUnit = shadowMergedRenderUnits[i];
                const {lodIndex, isIndexed, indexCount, vertexCount, firstIndex} = shadowUnit;
                if (lodIndex === 0 && hasMaskedLOD0) {
                    continue;
                }
                let lodInfo: FoliageLODInfo | null = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                if (!lodInfo) continue;
                const slotIndex = indirectBaseOffset + lodInfo.renderUnitOffset;
                const count = isIndexed ? indexCount : vertexCount;
                for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                    const shadowSlot = (c * maxRenderUnits + slotIndex) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                    this.#shadowIndirectResetTemplate[shadowSlot] = count;
                    this.#shadowIndirectResetTemplate[shadowSlot + 2] = firstIndex;
                }
            }
        }

        this.syncIndirectResetTemplateToGPU(indirectBaseOffset, renderUnits.length);

        if (this.#shadowIndirectResetTemplateGPUBuffer) {
            const {buffer, byteLength} = this.#shadowIndirectResetTemplate;
            this.gpuDevice.queue.writeBuffer(
                this.#shadowIndirectResetTemplateGPUBuffer,
                0,
                buffer,
                0,
                byteLength
            );
        }
    }

    /**
     * [KO] 메가 버퍼 수용량이 확장될 때 메인 및 그림자 컬링 출력 GPU 버퍼를 재할당합니다.
     * [EN] Reallocates main and shadow culled output GPU buffers when mega buffer capacity expands.
     *
     * @param newCapacity -
     * [KO] 확장된 새 인스턴스 수용량
     * [EN] New expanded instance capacity
     */
    onResizeBuffers(newCapacity: number): void {
        const {gpuDevice, strideBytes} = this;
        const {VERTEX, STORAGE} = GPUBufferUsage;
        const culledBufferUsage = VERTEX | STORAGE;

        const instanceCapacity = newCapacity > 0 ? newCapacity : this.instanceCapacity;
        const culledByteSize = instanceCapacity * 8 * strideBytes;
        const maxBufferSize = gpuDevice.limits?.maxBufferSize ?? 2147483648;
        const shadowCulledByteSize = culledByteSize * SHADOW_CASCADE_COUNT;

        if (shadowCulledByteSize > maxBufferSize) {
            consoleAndThrowError(
                `[FoliageMegaBuffer] Requested shadow culled buffer size (${shadowCulledByteSize} bytes) exceeds WebGPU maxBufferSize limit (${maxBufferSize} bytes).`
            );
        }

        this.culledGPUBuffer.destroy();
        this.#shadowCulledGPUBuffer.destroy();

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: culledBufferUsage,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_ShadowMega',
            size: shadowCulledByteSize,
            usage: culledBufferUsage,
        });

        this.invalidateUnifiedCullingBindGroup();
    }

    /**
     * [KO] 메가 버퍼가 파괴될 때 그림자 및 글로벌 유니폼 관련 GPU 리소스를 정리합니다.
     * [EN] Cleans up shadow and global uniform GPU resources when the mega buffer is destroyed.
     */
    onDestroy(): void {
        this.invalidateUnifiedCullingBindGroup();
        this.#shadowCulledGPUBuffer.destroy();
        this.#shadowIndirectGPUBuffer.destroy();
        this.#unifiedGlobalUniformGPUBuffer.destroy();
        this.#shadowIndirectResetTemplateGPUBuffer.destroy();

        this.#shadowCulledGPUBuffer = null;
        this.#shadowIndirectGPUBuffer = null;
        this.#unifiedGlobalUniformGPUBuffer = null;
        this.#shadowIndirectResetTemplateGPUBuffer = null;
        this.#allocations.clear();
        this.#allocatedTypes.length = 0;
        this.clearBaseAllocations();
    }

    /**
     * [KO] 그림자 간접 드로우 버퍼를 리셋 템플릿 버퍼로부터 복사하여 초기화합니다.
     * [EN] Resets the shadow indirect draw buffer by copying from the reset template buffer.
     *
     * @param commandEncoder -
     * [KO] 복사에 사용할 `GPUCommandEncoder` 인스턴스 (`null`인 경우 큐 직접 쓰기 수행)
     * [EN] `GPUCommandEncoder` instance to use for copying (performs direct queue write if `null`)
     */
    override onResetMultiIndirectCommands(commandEncoder: GPUCommandEncoder | null): void {
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
            this.gpuDevice.queue.writeBuffer(
                targetGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                0,
                byteSize
            );
        }
    }

    #initBuffers(): void {
        const {gpuDevice, instanceCapacity, maxRenderUnits, strideBytes} = this;
        const {VERTEX, STORAGE, INDIRECT, COPY_DST, COPY_SRC, UNIFORM} = GPUBufferUsage;

        const rawByteSize = Math.max(instanceCapacity * strideBytes, 64);
        const culledByteSize = rawByteSize * 8;
        const maxBufferSize = gpuDevice.limits?.maxBufferSize ?? 2147483648;
        const shadowCulledByteSize = culledByteSize * SHADOW_CASCADE_COUNT;

        if (shadowCulledByteSize > maxBufferSize) {
            consoleAndThrowError(
                `[FoliageMegaBuffer] Initial shadow culled buffer size (${shadowCulledByteSize} bytes) exceeds WebGPU maxBufferSize limit (${maxBufferSize} bytes).`
            );
        }

        const indirectByteSize = Math.max(
            maxRenderUnits * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT,
            64
        );

        this.culledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: VERTEX | STORAGE,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Culled_ShadowMega',
            size: shadowCulledByteSize,
            usage: VERTEX | STORAGE,
        });

        this.#shadowIndirectGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_ShadowMega',
            size: indirectByteSize * SHADOW_CASCADE_COUNT,
            usage: INDIRECT | STORAGE | COPY_DST,
        });

        this.#shadowIndirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_Indirect_ShadowTemplate',
            size: indirectByteSize * SHADOW_CASCADE_COUNT,
            usage: COPY_SRC | COPY_DST,
        });

        this.#unifiedGlobalUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'FoliageMegaBuffer_GlobalUniformBuffer',
            size: this.#globalUniformBytes,
            usage: UNIFORM | COPY_DST,
        });
    }
}

Object.freeze(FoliageMegaBuffer);
export default FoliageMegaBuffer;
