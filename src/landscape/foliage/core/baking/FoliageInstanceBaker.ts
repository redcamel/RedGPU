import type RedGPUContext from "../../../../context/RedGPUContext";
import foliageBakeWGSL from "./foliageBake.wgsl";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";

import type FoliageMegaBuffer from "../buffer/FoliageMegaBuffer";
import type Landscape from "../../../Landscape";
import type Foliage from "../Foliage";
import {FoliageSubCell} from "../Foliage";
import {FOLIAGE_SEED_GRID_SIZE} from "../../FOLIAGE_CONSTANTS";

/**
 * [KO] `FoliageInstanceBaker` 생성을 위한 옵션 인터페이스입니다.
 * [EN] Options interface for creating a `FoliageInstanceBaker`.
 * @category Landscape
 */
export interface FoliageInstanceBakerOptions {
    /**
     * [KO] 사용자 정의 베이킹 컴퓨트 셰이더 WGSL 코드 (선택)
     * [EN] Custom baking compute shader WGSL code (optional)
     */
    computeShaderCode?: string;
    /**
     * [KO] GPU 파이프라인 및 버퍼 디버그 레이블 (선택)
     * [EN] Debug label for GPU pipelines and buffers (optional)
     */
    label?: string;
}

/**
 * [KO] 컴퓨트 셰이더를 사용하여 지형 서브 셀 영역의 식생 인스턴스 트랜스폼 및 속성을 메가 버퍼에 베이킹하는 클래스입니다.
 * [EN] Class that bakes foliage instance transforms and attributes for terrain sub-cells into the mega buffer using a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class FoliageInstanceBaker extends AScatterInstanceBaker {
    #uniformCPUBuffer: Float32Array;
    #uniformUintBuffer: Uint32Array;

    #tasksGPUBuffer: GPUBuffer;
    #tasksCPUBuffer: Uint32Array;
    #taskCapacity: number;

    #label: string;

    /**
     * [KO] `FoliageInstanceBaker` 인스턴스를 생성합니다.
     * [EN] Creates a `FoliageInstanceBaker` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param options -
     * [KO] 베이커 초기화 옵션 (선택)
     * [EN] Baker initialization options (optional)
     */
    constructor(redGPUContext: RedGPUContext, options?: FoliageInstanceBakerOptions) {
        super(redGPUContext);

        const {computeShaderCode = foliageBakeWGSL, label = 'FoliageInstanceBaker'} = options ?? {};
        this.#label = label;
        this.#taskCapacity = 256;

        this.#uniformCPUBuffer = new Float32Array(64);
        this.#uniformUintBuffer = new Uint32Array(this.#uniformCPUBuffer.buffer);

        this.#tasksCPUBuffer = new Uint32Array(this.#taskCapacity * 4);

        this.initComputePipeline(computeShaderCode, label, 256);
        this.#initTaskBuffer();
    }

    /**
     * [KO] 단일 식생 서브 셀에 대한 절차적 인스턴스 배치 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches a procedural instance placement compute pass for a single foliage sub-cell.
     *
     * @param megaBuffer -
     * [KO] 인스턴스 데이터가 기록될 `FoliageMegaBuffer` 인스턴스
     * [EN] `FoliageMegaBuffer` instance where instance data will be written
     * @param landscape -
     * [KO] 지형 높이맵 및 가중치 맵을 제공하는 `Landscape` 인스턴스
     * [EN] `Landscape` instance providing terrain heightmap and weight maps
     * @param foliage -
     * [KO] 베이킹할 대상 `Foliage` 타입 인스턴스
     * [EN] Target `Foliage` type instance to bake
     * @param subCell -
     * [KO] 베이킹할 대상 서브 셀 정보(`FoliageSubCell`)
     * [EN] Target sub-cell information (`FoliageSubCell`) to bake
     * @param targetSlot -
     * [KO] 메가 버퍼 내 기록 시작 슬롯 오프셋
     * [EN] Starting slot offset in the mega buffer for writing
     * @param targetCount -
     * [KO] 서브 셀에 할당된 최대 인스턴스 수
     * [EN] Maximum number of instances allocated for the sub-cell
     * @param subCellSize -
     * [KO] 서브 셀의 한 변 크기(월드 단위)
     * [EN] Side length of the sub-cell in world units
     */
    dispatchBakeSubCell(
        megaBuffer: FoliageMegaBuffer,
        landscape: Landscape,
        foliage: Foliage,
        subCell: FoliageSubCell,
        targetSlot: number,
        targetCount: number,
        subCellSize: number
    ): void {
        const {rawGPUBuffer} = megaBuffer;
        if (!rawGPUBuffer) return;

        const {computePipeline, uniformGPUBuffer, gpuDevice, resourceManager} = this;
        const {queue} = gpuDevice;
        const {emptyBitmapTextureView} = resourceManager;

        const {vhtTextureView, vbtTextureView} = landscape;
        const vhtView = vhtTextureView ?? emptyBitmapTextureView;
        const vbtView = vbtTextureView ?? emptyBitmapTextureView;

        const {
            worldSizeX,
            worldSizeZ,
            invWorldSizeX,
            invWorldSizeZ,
            halfWorldSizeX: halfWorldX,
            halfWorldSizeZ: halfWorldZ,
            heightScale
        } = landscape;
        const {subCellX, subCellZ} = subCell;

        const subMinX = subCellX * subCellSize - halfWorldX;
        const subMaxX = subMinX + subCellSize;
        const subMinZ = subCellZ * subCellSize - halfWorldZ;
        const subMaxZ = subMinZ + subCellSize;

        const startGx = Math.floor((subMinX + halfWorldX) / FOLIAGE_SEED_GRID_SIZE);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FOLIAGE_SEED_GRID_SIZE);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FOLIAGE_SEED_GRID_SIZE);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FOLIAGE_SEED_GRID_SIZE);

        const gridCountX = endGx - startGx + 1;
        const gridCountZ = endGz - startGz + 1;
        const totalGrids = gridCountX * gridCountZ;
        if (totalGrids <= 0) return;

        this.#ensureTaskCapacity(totalGrids * 2);
        const tasksBuf = this.#tasksCPUBuffer;
        let tOffset = 0;
        for (let gz = startGz; gz <= endGz; gz++) {
            for (let gx = startGx; gx <= endGx; gx++) {
                tasksBuf[tOffset++] = gx;
                tasksBuf[tOffset++] = gz;
                tasksBuf[tOffset++] = targetCount;
                tasksBuf[tOffset++] = 0;
            }
        }

        const taskBytes = tOffset * 4;
        queue.writeBuffer(this.#tasksGPUBuffer, 0, tasksBuf.buffer, 0, taskBytes);

        const {
            targetLayer,
            minScale,
            maxScale,
            densityPerHectare,
            densityMultiplier,
            nameHash = 0,
            bottomOffset,
            minSlope,
            maxSlope,
            alignFactor,
            alignToNormal,
            randomRotationY,
            densityScaleByWeight,
            typeId
        } = foliage;

        const {weightView, hasWeightMap, weightChannelIndex} = this.resolveWeightLayer(landscape, targetLayer);

        const [minScaleX, minScaleY, minScaleZ] = minScale;
        const [maxScaleX, maxScaleY, maxScaleZ] = maxScale;
        const scaleDiffX = maxScaleX - minScaleX;
        const scaleDiffY = maxScaleY - minScaleY;
        const scaleDiffZ = maxScaleZ - minScaleZ;

        const f32 = this.#uniformCPUBuffer;
        const u32 = this.#uniformUintBuffer;

        f32[0] = invWorldSizeX;
        f32[1] = invWorldSizeZ;
        f32[2] = halfWorldX;
        f32[3] = halfWorldZ;

        f32[4] = FOLIAGE_SEED_GRID_SIZE;
        u32[5] = Math.max(1, Math.round(densityPerHectare * densityMultiplier));
        u32[6] = u32[5] * 2;
        u32[7] = nameHash;

        f32[8] = minScaleX;
        f32[9] = minScaleY;
        f32[10] = minScaleZ;
        f32[11] = scaleDiffX;

        f32[12] = scaleDiffY;
        f32[13] = scaleDiffZ;
        f32[14] = bottomOffset;
        f32[15] = minSlope ? Math.tan(minSlope * 0.0174533) ** 2 : 0.0;

        f32[16] = maxSlope ? Math.tan(maxSlope * 0.0174533) ** 2 : 9999.0;
        f32[17] = alignFactor;
        u32[18] = (minSlope > 0 || maxSlope < 90) ? 1 : 0;
        u32[19] = alignToNormal ? 1 : 0;

        u32[20] = randomRotationY ? 1 : 0;
        u32[21] = densityScaleByWeight ? 1 : 0;
        u32[22] = (scaleDiffX === scaleDiffZ && minScaleX === minScaleZ) ? 1 : 0;
        u32[23] = typeId;

        u32[24] = landscape.hasValidVbtAtlas ? 1 : 0;
        u32[25] = hasWeightMap;
        u32[26] = weightChannelIndex;
        u32[27] = targetSlot;

        f32[28] = heightScale;
        u32[29] = totalGrids;
        f32[30] = subMinX;
        f32[31] = subMinZ;

        f32[32] = subMaxX;
        f32[33] = subMaxZ;
        u32[34] = 0;
        u32[35] = 0;

        queue.writeBuffer(uniformGPUBuffer, 0, f32.buffer, 0, 144);

        const bindGroup = this.getOrCreateBindGroup(
            typeId,
            this.#label,
            rawGPUBuffer,
            vhtView,
            vbtView,
            weightView,
            this.#tasksGPUBuffer
        );
        if (!bindGroup) return;

        const commandEncoder = gpuDevice.createCommandEncoder({
            label: `${this.#label}_SubCell_CommandEncoder`
        });
        const computePass = commandEncoder.beginComputePass({
            label: `${this.#label}_SubCell_ComputePass`
        });
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        const workgroups = Math.ceil(totalGrids / 64);
        computePass.dispatchWorkgroups(workgroups);
        computePass.end();

        queue.submit([commandEncoder.finish()]);
    }

    /**
     * [KO] 베이커가 보유한 태스크 버퍼 및 GPU 리소스를 해제합니다.
     * [EN] Releases the task buffer and GPU resources held by the baker.
     */
    override destroy(): void {
        this.#tasksGPUBuffer.destroy();
        this.#tasksGPUBuffer = null;
        super.destroy();
    }

    #initTaskBuffer(): void {
        const {gpuDevice} = this;
        const {STORAGE, COPY_DST} = GPUBufferUsage;

        this.#tasksGPUBuffer?.destroy();
        this.#tasksGPUBuffer = gpuDevice.createBuffer({
            label: `${this.#label}_TasksGPUBuffer`,
            size: this.#taskCapacity * 16,
            usage: STORAGE | COPY_DST
        });
    }

    #ensureTaskCapacity(required: number): void {
        if (required <= this.#taskCapacity) return;

        let newCap = Math.max(this.#taskCapacity * 2, 256);
        while (newCap < required) newCap *= 2;

        this.#tasksCPUBuffer = new Uint32Array(newCap * 4);
        this.#taskCapacity = newCap;

        this.#initTaskBuffer();
    }
}

Object.freeze(FoliageInstanceBaker);
export default FoliageInstanceBaker;
