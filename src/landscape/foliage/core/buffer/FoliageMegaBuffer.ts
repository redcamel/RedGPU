/**
 * [KO] 전체 식생 인스턴스/컬링/간접 드로우 버퍼를 통합 관리하는 메가 버퍼 모듈입니다.
 * [EN] Foliage mega buffer module for unified management of instance, culling, and indirect draw buffers.
 * @packageDocumentation
 */

import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import foliageCullingComputeWGSL from "../culling/foliageCullingCompute.wgsl";
import type {FoliageLODInfo} from "../Foliage";
import type FoliageSubMesh from "../submesh/FoliageSubMesh";
import type FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";

/**
 * [KO] 식생 타입별 메가 버퍼 메모리 할당 정보 인터페이스입니다.
 * [EN] Allocation info interface for foliage type segments within the mega buffer.
 */
export interface FoliageTypeAllocation {
    /**
     * [KO] 식생 타입 고유 정수 ID
     * [EN] Unique integer ID for the foliage type
     */
    typeId: number;
    /**
     * [KO] 식생 타입 이름
     * [EN] Foliage type name
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
     * [KO] 현재 활성화(마운트)된 인스턴스 수
     * [EN] Currently active (mounted) instance count
     */
    activeCount: number;
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
 * [KO] 모든 식생 타입의 인스턴스 원시 데이터, GPU 컬링 결과, 간접 드로우 인다이렉트 버퍼를 단일 대형 GPU 버퍼로 통합 관리하는 클래스입니다.
 * [EN] Class that unifies raw instance data, GPU culling results, and indirect draw buffers for all foliage types into a single large GPU buffer.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(FoliageManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (FoliageManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class FoliageMegaBuffer extends RedGPUObject {
    #strideFloats: number;
    #strideBytes: number;
    #maxTypes: number;
    #typeParamFloats: number;
    #instanceCapacity: number;
    #maxSubMeshes: number;

    #rawGPUBuffer: GPUBuffer | null = null;
    #culledGPUBuffer: GPUBuffer | null = null;
    #indirectGPUBuffer: GPUBuffer | null = null;
    #typeParamsGPUBuffer: GPUBuffer | null = null;

    #shadowCulledGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectGPUBuffer: GPUBuffer | null = null;
    #unifiedGlobalUniformGPUBuffer: GPUBuffer | null = null;
    #indirectResetTemplateGPUBuffer: GPUBuffer | null = null;
    #shadowIndirectResetTemplateGPUBuffer: GPUBuffer | null = null;

    #cpuRawDataBuffer: Float32Array;
    #cpuRawDataUint32: Uint32Array;

    #cpuTypeParamsBuffer: Float32Array;
    #cpuTypeParamsUint32: Uint32Array;

    #cpuUnifiedGlobalUniformData: Float32Array = new Float32Array(200);
    #cpuUnifiedGlobalUniformUint32: Uint32Array = new Uint32Array(this.#cpuUnifiedGlobalUniformData.buffer);

    #indirectResetTemplate: Uint32Array;
    #shadowIndirectResetTemplate: Uint32Array;
    #dirtyTypeParams: boolean = true;

    #allocations: Map<string, FoliageTypeAllocation> = new Map();
    #allocatedTypes: FoliageTypeAllocation[] = [];
    #nextRawOffset: number = 0;
    #nextCulledOffset: number = 0;
    #nextIndirectOffset: number = 0;

    #unifiedCullingBindGroup: GPUBindGroup | null = null;
    #cachedHZBTextureView: GPUTextureView | null = null;
    #cachedHZBSampler: GPUSampler | null = null;

    #onRecreated: (() => void) | null = null;

    /**
     * [KO] FoliageMegaBuffer 인스턴스를 생성하고 내부 GPU 버퍼들을 초기화합니다.
     * [EN] Creates a FoliageMegaBuffer instance and initializes internal GPU buffers.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param initialCapacity -
     * [KO] 초기 인스턴스 수용 용량 (기본값: 65536)
     * [EN] Initial instance capacity (default: 65536)
     * @param maxSubMeshes -
     * [KO] 최대 지원 서브메시 개수 (기본값: 256)
     * [EN] Maximum supported sub-meshes count (default: 256)
     * @param maxTypes -
     * [KO] 최대 지원 식생 타입 개수 (기본값: 64)
     * [EN] Maximum supported foliage types count (default: 64)
     */
    constructor(
        redGPUContext: RedGPUContext,
        initialCapacity: number = 65536,
        maxSubMeshes: number = 256,
        maxTypes: number = 64
    ) {
        super(redGPUContext);

        const shaderInfo = redGPUContext.resourceManager.wgslParser.parse(
            'Foliage_Cull_ShaderModule',
            foliageCullingComputeWGSL
        );
        const strideBytes =
            shaderInfo.storage?.['rawInstanceBuffer']?.stride ||
            shaderInfo.structs?.['FoliageInstanceData']?.arrayBufferByteLength ||
            32;

        this.#strideBytes = strideBytes;
        this.#strideFloats = strideBytes / 4;
        this.#typeParamFloats =
            (shaderInfo.structs?.['FoliageTypeParam']?.arrayBufferByteLength || 320) / 4;
        this.#maxTypes = maxTypes;
        this.#instanceCapacity = Math.ceil(initialCapacity / 64) * 64;
        this.#maxSubMeshes = maxSubMeshes;

        this.#cpuRawDataBuffer = new Float32Array(this.#instanceCapacity * this.#strideFloats);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);
        this.#indirectResetTemplate = new Uint32Array(this.#maxSubMeshes * 5);
        this.#shadowIndirectResetTemplate = new Uint32Array(this.#maxSubMeshes * 5 * 4);

        this.#cpuTypeParamsBuffer = new Float32Array(this.#maxTypes * this.#typeParamFloats);
        this.#cpuTypeParamsUint32 = new Uint32Array(this.#cpuTypeParamsBuffer.buffer);

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
     * [KO] 지원 가능한 최대 식생 타입 개수를 반환합니다.
     * [EN] Returns the maximum supported foliage types count.
     */
    get maxTypes(): number {
        return this.#maxTypes;
    }

    /**
     * [KO] 타입 파라미터 구조체의 Float32 단위 크기를 반환합니다.
     * [EN] Returns the Float32 size of the type parameter struct.
     */
    get typeParamFloats(): number {
        return this.#typeParamFloats;
    }

    get rawGPUBuffer(): GPUBuffer | null {
        return this.#rawGPUBuffer;
    }

    get typeParamsGPUBuffer(): GPUBuffer | null {
        return this.#typeParamsGPUBuffer;
    }

    get cpuRawDataBuffer(): Float32Array {
        return this.#cpuRawDataBuffer;
    }

    get cpuRawDataUint32(): Uint32Array {
        return this.#cpuRawDataUint32;
    }

    get culledGPUBuffer(): GPUBuffer | null {
        return this.#culledGPUBuffer;
    }

    get indirectGPUBuffer(): GPUBuffer | null {
        return this.#indirectGPUBuffer;
    }

    get shadowCulledGPUBuffer(): GPUBuffer | null {
        return this.#shadowCulledGPUBuffer;
    }

    get shadowIndirectGPUBuffer(): GPUBuffer | null {
        return this.#shadowIndirectGPUBuffer;
    }

    /**
     * [KO] 현재 할당된 메가버퍼의 최대 수용 인스턴스 용량을 반환합니다.
     * [EN] Returns the maximum instance capacity of the currently allocated mega-buffer.
     */
    get instanceCapacity(): number {
        return this.#instanceCapacity;
    }

    /**
     * [KO] 현재 할당된 메가버퍼의 최대 수용 인스턴스 용량을 반환합니다. (호환용)
     * [EN] Returns the maximum instance capacity of the currently allocated mega-buffer. (Compatibility)
     */
    get maxTotalInstances(): number {
        return this.#instanceCapacity;
    }

    /**
     * [KO] 특정 식생 타입 이름에 해당하는 메가버퍼 할당 정보 객체를 조회합니다.
     * [EN] Retrieves the mega-buffer allocation information object for a specific foliage type name.
     */
    getAllocation(name: string): FoliageTypeAllocation | undefined {
        return this.#allocations.get(name);
    }

    get maxSubMeshes(): number {
        return this.#maxSubMeshes;
    }

    get onRecreated(): (() => void) | null {
        return this.#onRecreated;
    }

    set onRecreated(cb: (() => void) | null) {
        this.#onRecreated = cb;
    }

    /**
     * [KO] 현재까지 할당된 총 인스턴스 범위
     * [EN] Total allocated instance range so far
     */
    get totalAllocatedRange(): number {
        return this.#nextRawOffset;
    }

    /**
     * [KO] 등록된 모든 식생 타입의 활성 인스턴스 총합
     * [EN] Total active instances across all registered foliage types
     */
    get totalActiveInstances(): number {
        let total = 0;
        const count = this.#allocatedTypes.length;
        for (let i = 0; i < count; i++) {
            total += this.#allocatedTypes[i].activeCount;
        }
        return total;
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
            newCapacity = Math.ceil((newCapacity * 2) / 64) * 64;
        }

        this.#instanceCapacity = newCapacity;

        const oldCpuBuffer = this.#cpuRawDataBuffer;
        this.#cpuRawDataBuffer = new Float32Array(newCapacity * this.#strideFloats);
        this.#cpuRawDataBuffer.set(oldCpuBuffer);
        this.#cpuRawDataUint32 = new Uint32Array(this.#cpuRawDataBuffer.buffer);

        const gpuDevice = this.gpuDevice;
        if (gpuDevice) {
            const strideBytes = this.#strideBytes;
            const rawByteSize = this.#instanceCapacity * strideBytes;
            const culledByteSize = this.#instanceCapacity * 8 * strideBytes;

            this.#rawGPUBuffer?.destroy();
            this.#culledGPUBuffer?.destroy();
            this.#shadowCulledGPUBuffer?.destroy();

            this.#rawGPUBuffer = gpuDevice.createBuffer({
                label: 'Foliage_MegaBuffer_Raw',
                size: rawByteSize,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
            });

            this.#culledGPUBuffer = gpuDevice.createBuffer({
                label: 'Foliage_MegaBuffer_Culled_Main',
                size: culledByteSize,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
            });

            this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
                label: 'Foliage_MegaBuffer_Culled_ShadowMega',
                size: culledByteSize * 4,
                usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
            });

            if (this.#nextRawOffset > 0) {
                gpuDevice.queue.writeBuffer(
                    this.#rawGPUBuffer,
                    0,
                    this.#cpuRawDataBuffer.buffer,
                    this.#cpuRawDataBuffer.byteOffset,
                    this.#nextRawOffset * strideBytes
                );
            }

            this.#unifiedCullingBindGroup = null;
            this.#onRecreated?.();
        }

        return true;
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
        if (typeId >= this.#maxTypes) {
            throw new Error(`[FoliageMegaBuffer] Maximum supported FoliageTypes (${this.#maxTypes}) exceeded.`);
        }

        const subMeshCount = subMeshes.length;

        const alignedMaxInstances = Math.ceil(maxInstances / 64) * 64;
        this.ensureCapacity(this.#nextRawOffset + alignedMaxInstances);

        const rawBaseOffset = this.#nextRawOffset;
        const culledBaseOffset = this.#nextCulledOffset;
        const indirectBaseOffset = this.#nextIndirectOffset;

        const allocation: FoliageTypeAllocation = {
            typeId,
            name,
            maxInstances: alignedMaxInstances,
            rawBaseOffset,
            culledBaseOffset,
            indirectBaseOffset,
            subMeshCount,
            activeCount: 0
        };

        this.#allocations.set(name, allocation);
        this.#allocatedTypes.push(allocation);

        const strideFloats = this.#strideFloats;
        const strideBytes = this.#strideBytes;

        const baseFloat = rawBaseOffset * strideFloats;
        const defaultColorAndType = (((typeId & 0xFF) << 24) | (0x33 << 16) | (0x33 << 8) | 0x33) >>> 0;
        for (let i = 0; i < alignedMaxInstances; i++) {
            this.#cpuRawDataUint32[baseFloat + i * strideFloats + 7] = defaultColorAndType;
        }

        this.#nextRawOffset += alignedMaxInstances;
        this.#nextCulledOffset += alignedMaxInstances * 8;
        this.#nextIndirectOffset += subMeshCount;

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
     * [KO] 새로운 식생 타입에 대한 버퍼 세그먼트를 할당하고 오프셋을 등록합니다. (하위 호환 래퍼)
     * [EN] Allocates a buffer segment and registers offsets for a new foliage type. (Compatibility wrapper)
     */
    allocateTypeSegment(
        name: string,
        maxInstances: number,
        subMeshes: FoliageSubMesh[],
        shadowMergedSubMeshes?: FoliageShadowMergedSubMesh[],
        lodInfoList?: FoliageLODInfo[]
    ): FoliageTypeAllocation {
        return this.allocateType(name, maxInstances, subMeshes, shadowMergedSubMeshes, lodInfoList);
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
     * [KO] 특정 식생 타입 할당 구간의 인스턴스 데이터를 GPU 원본 버퍼로 업로드합니다.
     * [EN] Uploads instance data of a specific foliage type allocation range to the GPU raw buffer.
     */
    uploadAllocationRangeToGPU(allocation: FoliageTypeAllocation, startIndex: number, count: number): void {
        if (count <= 0) return;
        allocation.activeCount = Math.max(allocation.activeCount, startIndex + count);
        this.uploadInstances(allocation.rawBaseOffset + startIndex, count);
    }

    resetMultiIndirectCommands(commandEncoder?: GPUCommandEncoder): void {
        if (this.#nextIndirectOffset === 0) return;

        const mainBytes = this.#nextIndirectOffset * 20;
        const shadowResetBytes = Math.min(
            (this.#maxSubMeshes * 3 + this.#nextIndirectOffset) * 20,
            this.#shadowIndirectResetTemplate.byteLength
        );

        if (commandEncoder && this.#indirectResetTemplateGPUBuffer && this.#shadowIndirectResetTemplateGPUBuffer) {
            if (this.#indirectGPUBuffer) {
                commandEncoder.copyBufferToBuffer(
                    this.#indirectResetTemplateGPUBuffer, 0,
                    this.#indirectGPUBuffer, 0,
                    mainBytes
                );
            }
            if (this.#shadowIndirectGPUBuffer) {
                commandEncoder.copyBufferToBuffer(
                    this.#shadowIndirectResetTemplateGPUBuffer, 0,
                    this.#shadowIndirectGPUBuffer, 0,
                    shadowResetBytes
                );
            }
            return;
        }

        const gpuDevice = this.gpuDevice;
        if (this.#indirectGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#indirectGPUBuffer,
                0,
                this.#indirectResetTemplate.buffer,
                this.#indirectResetTemplate.byteOffset,
                mainBytes
            );
        }

        if (this.#shadowIndirectGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#shadowIndirectGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                this.#shadowIndirectResetTemplate.byteOffset,
                shadowResetBytes
            );
        }
    }

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
        if (!this.#unifiedGlobalUniformGPUBuffer || !this.#typeParamsGPUBuffer) return;

        const gf32 = this.#cpuUnifiedGlobalUniformData;
        const gu32 = this.#cpuUnifiedGlobalUniformUint32;

        gf32[0] = camX;
        gf32[1] = camY;
        gf32[2] = camZ;
        gu32[3] = this.#nextRawOffset;

        gf32[4] = worldSizeX > 0 ? (1.0 / worldSizeX) : 0.0;
        gf32[5] = heightScale;
        gu32[6] = hasVHT ? 1 : 0;
        gf32[7] = fovFactor > 0 ? fovFactor : 1.0;

        gu32[8] = this.#maxSubMeshes;
        gu32[9] = this.#instanceCapacity * 8;
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

        for (let c = 0; c < 4; c++) {
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
        const typeParamFloats = this.#typeParamFloats;
        for (let i = 0; i < count; i++) {
            const alloc = this.#allocatedTypes[i];
            const baseOffset = alloc.typeId * typeParamFloats;
            const prevCount = this.#cpuTypeParamsUint32[baseOffset + 9];
            if (prevCount !== alloc.activeCount) {
                this.#cpuTypeParamsUint32[baseOffset + 9] = alloc.activeCount;
                this.#dirtyTypeParams = true;
            }
        }

        const gpuDevice = this.gpuDevice;
        gpuDevice.queue.writeBuffer(
            this.#unifiedGlobalUniformGPUBuffer,
            0,
            gf32.buffer,
            gf32.byteOffset,
            688
        );

        if (this.#dirtyTypeParams) {
            this.#dirtyTypeParams = false;
            gpuDevice.queue.writeBuffer(
                this.#typeParamsGPUBuffer,
                0,
                this.#cpuTypeParamsBuffer.buffer,
                this.#cpuTypeParamsBuffer.byteOffset,
                this.#allocatedTypes.length * typeParamFloats * 4
            );
        }
    }

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
        const baseOffset = typeId * this.#typeParamFloats;
        const f32 = this.#cpuTypeParamsBuffer;
        const u32 = this.#cpuTypeParamsUint32;

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
        u32[baseOffset + 9] = allocation.activeCount;
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

    getOrCreateUnifiedCullingBindGroup(
        layout: GPUBindGroupLayout,
        hzbTextureView?: GPUTextureView | null,
        hzbSampler?: GPUSampler | null
    ): GPUBindGroup | null {
        if (!this.#rawGPUBuffer || !this.#unifiedGlobalUniformGPUBuffer || !this.#typeParamsGPUBuffer ||
            !this.#culledGPUBuffer || !this.#indirectGPUBuffer ||
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
            label: 'Foliage_MegaBuffer_Culling_BindGroup',
            layout,
            entries: [
                {binding: 0, resource: {buffer: this.#rawGPUBuffer}},
                {binding: 1, resource: {buffer: this.#unifiedGlobalUniformGPUBuffer}},
                {binding: 2, resource: {buffer: this.#typeParamsGPUBuffer}},
                {binding: 3, resource: {buffer: this.#culledGPUBuffer}},
                {binding: 4, resource: {buffer: this.#indirectGPUBuffer}},
                {binding: 5, resource: {buffer: this.#shadowCulledGPUBuffer}},
                {binding: 6, resource: {buffer: this.#shadowIndirectGPUBuffer}},
                {binding: 7, resource: targetHZBView},
                {binding: 8, resource: targetHZBSampler},
            ],
        });

        return this.#unifiedCullingBindGroup;
    }

    destroy(): void {

        this.#cachedHZBTextureView = null;
        this.#cachedHZBSampler = null;
        this.#rawGPUBuffer?.destroy();
        this.#culledGPUBuffer?.destroy();
        this.#indirectGPUBuffer?.destroy();
        this.#typeParamsGPUBuffer?.destroy();
        this.#shadowCulledGPUBuffer?.destroy();
        this.#shadowIndirectGPUBuffer?.destroy();
        this.#unifiedGlobalUniformGPUBuffer?.destroy();
        this.#indirectResetTemplateGPUBuffer?.destroy();
        this.#shadowIndirectResetTemplateGPUBuffer?.destroy();

        this.#rawGPUBuffer = null;
        this.#culledGPUBuffer = null;
        this.#indirectGPUBuffer = null;
        this.#typeParamsGPUBuffer = null;
        this.#shadowCulledGPUBuffer = null;
        this.#shadowIndirectGPUBuffer = null;
        this.#unifiedGlobalUniformGPUBuffer = null;
        this.#indirectResetTemplateGPUBuffer = null;
        this.#shadowIndirectResetTemplateGPUBuffer = null;
        this.#unifiedCullingBindGroup = null;
        this.#allocations.clear();
        this.#allocatedTypes.length = 0;
    }

    registerSubMeshesToTemplate(
        subMeshes: FoliageSubMesh[],
        indirectBaseOffset: number,
        shadowMergedSubMeshes?: FoliageShadowMergedSubMesh[],
        lodInfoList?: FoliageLODInfo[]
    ): void {
        for (let s = 0; s < subMeshes.length; s++) {
            const sub = subMeshes[s];
            const count = sub.isIndexed ? sub.indexCount : sub.vertexCount;
            this.#indirectResetTemplate[(indirectBaseOffset + s) * 5] = count;

            for (let c = 0; c < 4; c++) {
                const shadowSlot = (c * this.#maxSubMeshes + indirectBaseOffset + s) * 5;
                this.#shadowIndirectResetTemplate[shadowSlot] = count;
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
                for (let c = 0; c < 4; c++) {
                    const shadowSlot = (c * this.#maxSubMeshes + slotIndex) * 5;
                    this.#shadowIndirectResetTemplate[shadowSlot] = count;
                }
            }
        }

        const gpuDevice = this.gpuDevice;
        if (gpuDevice && this.#indirectResetTemplateGPUBuffer && this.#shadowIndirectResetTemplateGPUBuffer) {
            gpuDevice.queue.writeBuffer(
                this.#indirectResetTemplateGPUBuffer,
                0,
                this.#indirectResetTemplate.buffer,
                0,
                this.#indirectResetTemplate.byteLength
            );
            gpuDevice.queue.writeBuffer(
                this.#shadowIndirectResetTemplateGPUBuffer,
                0,
                this.#shadowIndirectResetTemplate.buffer,
                0,
                this.#shadowIndirectResetTemplate.byteLength
            );
        }
    }

    #initBuffers(): void {
        const gpuDevice = this.gpuDevice;
        const rawByteSize = Math.max(this.#instanceCapacity * this.#strideBytes, 64);
        const culledByteSize = rawByteSize * 8;
        const indirectByteSize = Math.max(this.#maxSubMeshes * 20, 64);
        const typeParamsByteSize = this.#maxTypes * this.#typeParamFloats * 4;

        this.#rawGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Raw',
            size: rawByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#culledGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Culled_Main',
            size: culledByteSize,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#indirectGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Indirect_Main',
            size: indirectByteSize,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#indirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Indirect_Template',
            size: indirectByteSize,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.#shadowCulledGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Culled_ShadowMega',
            size: culledByteSize * 4,
            usage: GPUBufferUsage.VERTEX | GPUBufferUsage.STORAGE,
        });

        this.#shadowIndirectGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Indirect_ShadowMega',
            size: indirectByteSize * 4,
            usage: GPUBufferUsage.INDIRECT | GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#shadowIndirectResetTemplateGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_Indirect_ShadowTemplate',
            size: indirectByteSize * 4,
            usage: GPUBufferUsage.COPY_SRC | GPUBufferUsage.COPY_DST,
        });

        this.#typeParamsGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_TypeParams',
            size: typeParamsByteSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });

        this.#unifiedGlobalUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'Foliage_MegaBuffer_GlobalUniformBuffer',
            size: 800,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
    }
}

Object.freeze(FoliageMegaBuffer);
export default FoliageMegaBuffer;
