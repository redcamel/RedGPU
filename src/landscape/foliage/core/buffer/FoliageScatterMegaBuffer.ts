import RedGPUContext from '../../../../context/RedGPUContext';
import {AScatterMegaBuffer, DRAW_INDEXED_INDIRECT_ARGS_COUNT} from '../../../core/scatter/AScatterMegaBuffer';
import foliageCullingComputeWGSL from '../culling/foliageCullingCompute.wgsl';
import FoliageSubMesh from '../submesh/FoliageSubMesh';
import FoliageShadowMergedSubMesh from '../submesh/FoliageShadowMergedSubMesh';
import {FoliageLODInfo} from '../Foliage';

/**
 * [KO] Cascaded Shadow Maps (CSM) 그림자 캐스케이드 분할 단계 수
 * [EN] Number of Cascaded Shadow Maps (CSM) shadow cascade split levels
 */
export const SHADOW_CASCADE_COUNT = 4;

/**
 * [KO] 메가버퍼 내 단일 식생 타입의 할당 정보 인터페이스입니다.
 * [EN] Interface for single foliage type allocation information in mega-buffer.
 */
export interface FoliageTypeAllocation {
    /**
     * [KO] 식생 타입 고유 정수 ID
     * [EN] Unique integer ID for foliage type
     */
    typeId: number;
    /**
     * [KO] 식생 타입 고유 이름
     * [EN] Unique foliage type name
     */
    name: string;
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
     * [KO] 해당 타입에 속한 서브메시 개수
     * [EN] Number of sub-meshes belonging to this type
     */
    subMeshCount: number;
    /**
     * [KO] 현재 활성화된 인스턴스 수
     * [EN] Current active instance count
     */
    instanceCount: number;
}

/**
 * [KO] 캐스케이드 그림자 컬링 파라미터 인터페이스입니다.
 * [EN] Interface for cascade shadow culling parameters.
 */
export interface CascadeCullingParam {
    /**
     * [KO] 캐스케이드 최대 거리
     * [EN] Cascade maximum distance
     */
    maxDistance: number;
    /**
     * [KO] 그림자 활성화 여부
     * [EN] Whether shadow is enabled
     */
    hasShadow: boolean;
    /**
     * [KO] 캐스케이드 프러스텀 평면 방정식 배열
     * [EN] Cascade frustum plane equations array
     */
    frustumPlanes: number[][] | null;
}

/**
 * [KO] 모든 식생 타입의 인스턴스 원시 데이터, GPU 컬링 결과, 간접 드로우 버퍼, 캐스케이드 그림자 버퍼를 단일 대형 GPU 버퍼로 통합 관리하는 클래스입니다.
 * [EN] Class that integrally manages raw instance data, GPU culling results, indirect draw buffers, and cascade shadow buffers for all foliage types in a single large GPU buffer.
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
            foliageCullingComputeWGSL
        );

        super(
            redGPUContext,
            {
                shaderInfo,
                rawStorageName: 'rawInstances',
                instanceStructName: 'FoliageInstance',
                typeParamStructName: 'FoliageTypeParam'
            },
            initialCapacity,
            maxTypes,
            maxTypes * 8
        );

        this.#shadowIndirectResetTemplate = new Uint32Array(
            this.maxSubMeshes * DRAW_INDEXED_INDIRECT_ARGS_COUNT * SHADOW_CASCADE_COUNT
        );

        const globalUniformBytes =
            shaderInfo.uniforms?.['globalUniforms']?.arrayBufferByteLength ||
            shaderInfo.structs?.['FoliageCullingUniforms']?.arrayBufferByteLength;
        if (!globalUniformBytes) {
            throw new Error('[FoliageScatterMegaBuffer] Failed to reflect "FoliageCullingUniforms" struct size from foliageCullingComputeWGSL.');
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
     * [KO] 등록된 모든 식생 타입의 활성 인스턴스 총합
     * [EN] Total active instances across all registered foliage types
     */
    get totalActiveInstances(): number {
        let total = 0;
        const count = this.#allocatedTypes.length;
        for (let i = 0; i < count; i++) {
            total += this.#allocatedTypes[i].instanceCount;
        }
        return total;
    }

    /**
     * [KO] 특정 식생 타입 이름에 해당하는 메가버퍼 할당 정보 객체를 조회합니다.
     * [EN] Retrieves the mega-buffer allocation information object for a specific foliage type name.
     */
    getAllocation(name: string): FoliageTypeAllocation | undefined {
        return this.#allocations.get(name);
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
     * @param subMeshes -
     * [KO] 식생 서브메시 배열
     * [EN] Foliage sub-meshes array
     * @param shadowMergedSubMeshes -
     * [KO] 그림자 패스 통합 서브메시 배열 (선택사항)
     * [EN] Shadow pass merged sub-meshes array (optional)
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
        subMeshes: FoliageSubMesh[],
        shadowMergedSubMeshes?: FoliageShadowMergedSubMesh[],
        lodInfoList?: FoliageLODInfo[]
    ): FoliageTypeAllocation {
        if (this.#allocations.has(name)) {
            return this.#allocations.get(name)!;
        }

        const typeId = this.#allocatedTypes.length;
        if (typeId >= this.maxTypes) {
            throw new Error(`[FoliageScatterMegaBuffer] Maximum supported FoliageTypes (${this.maxTypes}) exceeded.`);
        }

        const subMeshCount = subMeshes.length;
        const baseSegment = this.allocateBaseSegment(name, maxInstances, subMeshCount, 8);
        const {rawBaseOffset, culledBaseOffset, indirectBaseOffset, maxInstances: alignedMaxInstances} = baseSegment;

        const allocation: FoliageTypeAllocation = {
            typeId,
            name,
            maxInstances: alignedMaxInstances,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            subMeshCount,
            instanceCount: 0
        };

        this.#allocations.set(name, allocation);
        this.#allocatedTypes.push(allocation);

        const strideFloats = this.strideFloats;
        const strideBytes = this.strideBytes;

        const baseFloat = rawBaseOffset * strideFloats;
        const defaultColorAndType = (((typeId & 0xFF) << 24) | (0x33 << 16) | (0x33 << 8) | 0x33) >>> 0;
        const cpuRawUint32 = this.cpuRawDataUint32;
        for (let i = 0; i < alignedMaxInstances; i++) {
            cpuRawUint32[baseFloat + i * strideFloats + 7] = defaultColorAndType;
        }

        for (let s = 0; s < subMeshCount; s++) {
            const sub = subMeshes[s];
            sub.instanceBufferOffset = (culledBaseOffset + (sub.lodIndex * alignedMaxInstances)) * strideBytes;
            sub.indirectOffsetBytes = (indirectBaseOffset + s) * 20;
        }

        if (shadowMergedSubMeshes && lodInfoList) {
            for (let i = 0; i < shadowMergedSubMeshes.length; i++) {
                const shadowSub = shadowMergedSubMeshes[i];
                let lodInfo: any = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === shadowSub.lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                const subOffset = lodInfo ? lodInfo.subMeshOffset : 0;
                shadowSub.instanceBufferOffset = (culledBaseOffset + (shadowSub.lodIndex * alignedMaxInstances)) * strideBytes;
                shadowSub.indirectOffsetBytes = (indirectBaseOffset + subOffset) * 20;
            }
        }

        this.registerSubMeshesToTemplate(subMeshes, indirectBaseOffset, shadowMergedSubMeshes, lodInfoList);
        this.#unifiedCullingBindGroup = null;

        return allocation;
    }

    /**
     * [KO] 특정 식생 타입 할당 구간의 인스턴스 데이터를 GPU 원본 버퍼로 업로드합니다.
     * [EN] Uploads instance data of a specific foliage type allocation range to the GPU raw buffer.
     */
    uploadAllocationRangeToGPU(allocation: FoliageTypeAllocation, startIndex: number, count: number): void {
        if (count <= 0) return;
        allocation.instanceCount = Math.max(allocation.instanceCount, startIndex + count);
        this.uploadInstances(allocation.rawBaseOffset + startIndex, count);
    }

    /**
     * [KO] 매 프레임 GPU 컬링 실행 전, 간접 드로우 인스턴스 카운트를 초기화합니다.
     * [EN] Resets indirect draw instance counts before executing GPU culling every frame.
     * @param commandEncoder -
     * [KO] 선택사항인 GPU 커맨드 인코더 (지정 시 GPU copyBufferToBuffer 사용)
     * [EN] Optional GPU command encoder (uses GPU copyBufferToBuffer if provided)
     */
    resetMultiIndirectCommands(commandEncoder?: GPUCommandEncoder): void {
        const totalIndirect = this.totalIndirectDrawCalls;
        if (totalIndirect === 0) return;

        super.resetMultiIndirectCommands(commandEncoder);

        if (!this.#shadowIndirectGPUBuffer) return;

        const indirectStrideBytes = DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT;
        const shadowResetBytes = Math.min(
            (this.maxSubMeshes * 3 + totalIndirect) * indirectStrideBytes,
            this.#shadowIndirectResetTemplate.byteLength
        );

        if (commandEncoder && this.#shadowIndirectResetTemplateGPUBuffer) {
            commandEncoder.copyBufferToBuffer(
                this.#shadowIndirectResetTemplateGPUBuffer,
                0,
                this.#shadowIndirectGPUBuffer,
                0,
                shadowResetBytes
            );
            return;
        }

        const gpuDevice = this.gpuDevice;
        if (gpuDevice) {
            gpuDevice.queue.writeBuffer(
                this.#shadowIndirectGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                this.#shadowIndirectResetTemplate.byteOffset,
                shadowResetBytes
            );
        }
    }


    /**
     * [KO] 유니파이드 GPU 컬링에 필요한 글로벌 유니폼 버퍼를 CPU에서 갱신하고 GPU로 전송합니다.
     * [EN] Updates global uniforms required for unified GPU culling on CPU and transfers them to GPU.
     */
    updateUnifiedGlobalUniforms(
        camX: number, camY: number, camZ: number,
        worldSizeX: number, heightScale: number, hasVHT: boolean,
        fovFactor: number,
        mainFrustumPlanes: number[][] | null,
        cascades: CascadeCullingParam[],
        activeCascadeCount: number = 4,
        viewportHeight: number = 1080.0,
        hzbEnabled: boolean = false,
        viewProjectionMatrix: any = null,
        hzbWidth: number = 512.0,
        hzbHeight: number = 256.0,
        depthBias: number = 0.002
    ): void {
        const typeParamsGPUBuffer = this.typeParamsGPUBuffer;
        if (!this.#unifiedGlobalUniformGPUBuffer || !typeParamsGPUBuffer) return;

        const gf32 = this.#cpuUnifiedGlobalUniformData;
        const gu32 = this.#cpuUnifiedGlobalUniformUint32;

        gf32[0] = camX;
        gf32[1] = camY;
        gf32[2] = camZ;
        gu32[3] = this.totalAllocatedInstances;

        gf32[4] = worldSizeX > 0 ? (1.0 / worldSizeX) : 0.0;
        gf32[5] = heightScale;
        gu32[6] = hasVHT ? 1 : 0;
        gf32[7] = fovFactor > 0 ? fovFactor : 1.0;

        gu32[8] = this.maxSubMeshes;
        gu32[9] = this.instanceCapacity * 8;
        gu32[10] = activeCascadeCount;
        gu32[11] = (hzbEnabled && viewProjectionMatrix) ? 1 : 0;
        gf32[12] = viewportHeight > 0 ? viewportHeight : 1080.0;
        gf32[13] = depthBias;
        gf32[14] = hzbWidth;
        gf32[15] = hzbHeight;

        gf32[16] = 0;
        gf32[17] = 0;
        gf32[18] = 0;
        gf32[19] = 0;

        if (viewProjectionMatrix) {
            gf32.set(viewProjectionMatrix, 20);
        } else {
            gf32.fill(0, 20, 36);
        }

        if (mainFrustumPlanes && mainFrustumPlanes.length >= 6) {
            for (let p = 0; p < 6; p++) {
                const plane = mainFrustumPlanes[p];
                const baseOffset = 36 + p * 4;
                gf32[baseOffset] = plane[0];
                gf32[baseOffset + 1] = plane[1];
                gf32[baseOffset + 2] = plane[2];
                gf32[baseOffset + 3] = plane[3];
            }
        }

        for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
            const cascade = cascades[c];
            const cascadeBase = 60 + c * 28;
            if (cascade && cascade.hasShadow) {
                gf32[cascadeBase] = cascade.maxDistance;
                gu32[cascadeBase + 1] = 1;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;

                const planes = cascade.frustumPlanes;
                if (planes && planes.length >= 6) {
                    for (let p = 0; p < 6; p++) {
                        const plane = planes[p];
                        const pOffset = cascadeBase + 4 + p * 4;
                        gf32[pOffset] = plane[0];
                        gf32[pOffset + 1] = plane[1];
                        gf32[pOffset + 2] = plane[2];
                        gf32[pOffset + 3] = plane[3];
                    }
                }
            } else {
                gf32[cascadeBase] = 0.0;
                gu32[cascadeBase + 1] = 0;
                gu32[cascadeBase + 2] = 0;
                gu32[cascadeBase + 3] = 0;
            }
        }

        const count = this.#allocatedTypes.length;
        const typeParamFloats = this.typeParamFloats;
        const cpuTypeParamsUint32 = this.cpuTypeParamsUint32;
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
        maxShadowDistance: number = 300.0,
        boundingHeight: number = 2.0
    ): void {
        this.#dirtyTypeParams = true;
        const typeId = allocation.typeId;
        const baseOffset = typeId * this.typeParamFloats;
        const f32 = this.cpuTypeParamsBuffer;
        const u32 = this.cpuTypeParamsUint32;

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
        f32[baseOffset + 10] = maxShadowDistance;

        f32[baseOffset + 11] = 1.0 / fadeRange;
        f32[baseOffset + 12] = boundingHeight;
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
                u32[lodBase + 6] = info.subMeshOffset;
                u32[lodBase + 7] = info.subMeshCount;
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
        const rawGPUBuffer = this.rawGPUBuffer;
        const typeParamsGPUBuffer = this.typeParamsGPUBuffer;
        const culledGPUBuffer = this.culledGPUBuffer;
        const indirectGPUBuffer = this.indirectGPUBuffer;

        if (!rawGPUBuffer || !this.#unifiedGlobalUniformGPUBuffer || !typeParamsGPUBuffer ||
            !culledGPUBuffer || !indirectGPUBuffer ||
            !this.#shadowCulledGPUBuffer || !this.#shadowIndirectGPUBuffer) {
            return null;
        }

        const gpuDevice = this.gpuDevice;
        const targetHZBView = hzbTextureView || this.resourceManager.emptyR32FloatTextureView;
        const targetHZBSampler = hzbSampler || this.resourceManager.basicSampler.gpuSampler;

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
                {binding: 1, resource: {buffer: this.#unifiedGlobalUniformGPUBuffer}},
                {binding: 2, resource: {buffer: typeParamsGPUBuffer}},
                {binding: 3, resource: {buffer: culledGPUBuffer}},
                {binding: 4, resource: {buffer: indirectGPUBuffer}},
                {binding: 5, resource: {buffer: this.#shadowCulledGPUBuffer}},
                {binding: 6, resource: {buffer: this.#shadowIndirectGPUBuffer}},
                {binding: 7, resource: targetHZBView},
                {binding: 8, resource: targetHZBSampler},
            ],
        });

        return this.#unifiedCullingBindGroup;
    }

    /**
     * [KO] 서브메시 및 그림자 통합 서브메시의 드로우 인자들을 인디렉트 템플릿 버퍼에 등록합니다.
     * [EN] Registers draw arguments of sub-meshes and shadow merged sub-meshes to indirect template buffer.
     */
    registerSubMeshesToTemplate(
        subMeshes: FoliageSubMesh[],
        indirectBaseOffset: number,
        shadowMergedSubMeshes?: FoliageShadowMergedSubMesh[],
        lodInfoList?: FoliageLODInfo[]
    ): void {
        const maxSubMeshes = this.maxSubMeshes;

        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            const count = sub.isIndexed ? sub.indexCount : sub.vertexCount;
            this.registerIndirectDrawSlot(indirectBaseOffset + s, count, sub.firstIndex);

            for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                const shadowSlot = (c * maxSubMeshes + indirectBaseOffset + s) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                this.#shadowIndirectResetTemplate[shadowSlot] = count;
                this.#shadowIndirectResetTemplate[shadowSlot + 2] = sub.firstIndex;
            }
        }

        if (shadowMergedSubMeshes && lodInfoList) {
            const hasMaskedLOD0 = subMeshes.some(s => s.lodIndex === 0 && s.isMasked);
            for (let i = 0; i < shadowMergedSubMeshes.length; i++) {
                const shadowSub = shadowMergedSubMeshes[i];
                if (shadowSub.lodIndex === 0 && hasMaskedLOD0) {
                    continue;
                }
                let lodInfo: FoliageLODInfo | null = null;
                for (let l = 0; l < lodInfoList.length; l++) {
                    if (lodInfoList[l].lodIndex === shadowSub.lodIndex) {
                        lodInfo = lodInfoList[l];
                        break;
                    }
                }
                if (!lodInfo) continue;
                const slotIndex = indirectBaseOffset + lodInfo.subMeshOffset;
                const count = shadowSub.isIndexed ? shadowSub.indexCount : shadowSub.vertexCount;
                for (let c = 0; c < SHADOW_CASCADE_COUNT; c++) {
                    const shadowSlot = (c * maxSubMeshes + slotIndex) * DRAW_INDEXED_INDIRECT_ARGS_COUNT;
                    this.#shadowIndirectResetTemplate[shadowSlot] = count;
                    this.#shadowIndirectResetTemplate[shadowSlot + 2] = shadowSub.firstIndex;
                }
            }
        }

        this.syncIndirectResetTemplateToGPU(indirectBaseOffset, subMeshes.length);

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

    onResizeBuffers(newCapacity: number): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const strideBytes = this.strideBytes;
        const instanceCapacity = this.instanceCapacity;
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

        this.#unifiedCullingBindGroup = null;
    }

    onDestroy(): void {
        this.#cachedHZBTextureView = null;
        this.#cachedHZBSampler = null;
        this.#shadowCulledGPUBuffer?.destroy();
        this.#shadowIndirectGPUBuffer?.destroy();
        this.#unifiedGlobalUniformGPUBuffer?.destroy();
        this.#shadowIndirectResetTemplateGPUBuffer?.destroy();

        this.#shadowCulledGPUBuffer = null;
        this.#shadowIndirectGPUBuffer = null;
        this.#unifiedGlobalUniformGPUBuffer = null;
        this.#shadowIndirectResetTemplateGPUBuffer = null;
        this.#unifiedCullingBindGroup = null;
        this.#allocations.clear();
        this.#allocatedTypes.length = 0;
        this.clearBaseAllocations();
    }

    #initBuffers(): void {
        const gpuDevice = this.gpuDevice;
        const instanceCapacity = this.instanceCapacity;
        const maxSubMeshes = this.maxSubMeshes;

        const rawByteSize = Math.max(instanceCapacity * this.strideBytes, 64);
        const culledByteSize = rawByteSize * 8;
        const indirectByteSize = Math.max(
            maxSubMeshes * DRAW_INDEXED_INDIRECT_ARGS_COUNT * Uint32Array.BYTES_PER_ELEMENT,
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
