/**
 * [KO] 식생(Foliage) 인스턴스 지형 물리 베이커 모듈입니다.
 * [EN] Foliage instance terrain physical baker module.
 * @packageDocumentation
 */
import type RedGPUContext from "../../../../context/RedGPUContext";
import foliageBakeWGSL from "./foliageBake.wgsl";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";

import type FoliageScatterMegaBuffer from "../buffer/FoliageScatterMegaBuffer";
import type Landscape from "../../../Landscape";
import type Foliage from "../Foliage";
import {FoliageSubCell} from "../Foliage";

/**
 * [KO] FoliageInstanceBaker 초기화 옵션 인터페이스입니다.
 * [EN] Initialization options interface for FoliageInstanceBaker.
 */
export interface FoliageInstanceBakerOptions {
    /**
     * [KO] 실행할 WebGPU Compute WGSL 셰이더 소스코드 문자열 (선택사항)
     * [EN] WebGPU Compute WGSL shader source code string to execute (optional)
     */
    computeShaderCode?: string;
    /**
     * [KO] 디버깅 및 프로파일링용 베이커 식별 라벨
     * [EN] Identifier label for debugging and profiling
     */
    label?: string;
}

/**
 * [KO] 지형(Landscape) 표면에 식생 인스턴스들을 물리적으로 안착 및 100% GPU 베이킹하는 클래스입니다.
 * [EN] Baker class that physically conforms and 100% GPU-bakes foliage instances onto landscape terrain.
 */
export class FoliageInstanceBaker extends AScatterInstanceBaker {
    #uniformCPUBuffer: Float32Array;
    #uniformUintBuffer: Uint32Array;

    #tasksGPUBuffer: GPUBuffer;
    #tasksCPUBuffer: Uint32Array;
    #taskCapacity: number;

    #label: string;

    /**
     * [KO] FoliageInstanceBaker 인스턴스를 생성하고 내부 유니폼 버퍼 및 GPU 컴퓨트 파이프라인을 초기화합니다.
     * [EN] Creates a FoliageInstanceBaker instance and initializes internal uniform buffers and the GPU compute pipeline.
     *
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     * @param options - 베이커 초기화 설정 옵션
     */
    constructor(redGPUContext: RedGPUContext, options?: FoliageInstanceBakerOptions) {
        super(redGPUContext);

        const computeShaderCode = options?.computeShaderCode || foliageBakeWGSL;
        this.#label = options?.label || 'FoliageInstanceBaker';
        this.#taskCapacity = 256;

        this.#uniformCPUBuffer = new Float32Array(64);
        this.#uniformUintBuffer = new Uint32Array(this.#uniformCPUBuffer.buffer);

        this.#tasksCPUBuffer = new Uint32Array(this.#taskCapacity * 4);

        this.initComputePipeline(computeShaderCode, this.#label, 256);
        this.#initTaskBuffer();
    }

    /**
     * [KO] 단일 서브셀(SubCell)에 대해 GPU 원스톱 베이킹을 실행합니다.
     * [EN] Executes GPU one-stop baking for a single SubCell.
     */
    dispatchBakeSubCell(
        megaBuffer: FoliageScatterMegaBuffer,
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
        const {emptyBitmapTextureView} = resourceManager;

        const vhtView = landscape.vhtAtlasTexture?.gpuTextureView || emptyBitmapTextureView;
        const vbtView = landscape.vbtBaseColorAtlas?.gpuTextureView || emptyBitmapTextureView;

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

        const FIXED_GRID = 100.0;
        const startGx = Math.floor((subMinX + halfWorldX) / FIXED_GRID);
        const endGx = Math.floor((subMaxX + halfWorldX - 0.001) / FIXED_GRID);
        const startGz = Math.floor((subMinZ + halfWorldZ) / FIXED_GRID);
        const endGz = Math.floor((subMaxZ + halfWorldZ - 0.001) / FIXED_GRID);

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
                tasksBuf[tOffset++] = 0; // pad0 (16-byte alignment tail padding)
            }
        }

        const taskBytes = tOffset * 4;
        gpuDevice.queue.writeBuffer(this.#tasksGPUBuffer, 0, tasksBuf.buffer, 0, taskBytes);

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

        f32[4] = FIXED_GRID;
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
        u32[34] = 0; // pad0 (strideFloats)
        u32[35] = 0; // pad1

        gpuDevice.queue.writeBuffer(uniformGPUBuffer, 0, f32.buffer, 0, 144);

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

        gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    override destroy(): void {
        this.#tasksGPUBuffer?.destroy();
        this.#tasksGPUBuffer = null;
        super.destroy();
    }

    #initTaskBuffer(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        this.#tasksGPUBuffer?.destroy();
        this.#tasksGPUBuffer = gpuDevice.createBuffer({
            label: `${this.#label}_TasksGPUBuffer`,
            size: this.#taskCapacity * 16,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
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
