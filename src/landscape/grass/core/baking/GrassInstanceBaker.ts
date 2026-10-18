import RedGPUContext from "../../../../context/RedGPUContext";
import grassBakeWGSL from "./grassBake.wgsl";
import type Landscape from "../../../Landscape";
import type Grass from "../Grass";
import type GrassMegaBuffer from "../buffer/GrassMegaBuffer";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";

/**
 * [KO] 잔디 인스턴스 베이킹에 사용되는 셀 크기(단위: 미터)입니다.
 * [EN] Cell size (in meters) used for grass instance baking.
 *
 * @category Landscape
 */
export const GRASS_CELL_SIZE: number = 16.0;

/**
 * [KO] 컴퓨트 셰이더를 사용하여 지형(Landscape) 표면에 잔디(Grass) 인스턴스를 베이킹하는 시스템 내부 클래스입니다.
 * [EN] Internal system class that bakes grass instances onto the landscape surface using a compute shader.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
class GrassInstanceBaker extends AScatterInstanceBaker {
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;
    #uniformInt32View: Int32Array;

    #cellOffsetsCache: Map<number, Int32Array> = new Map();
    #cellOffsetsGPUBuffer: GPUBuffer | null = null;
    #currentUploadedRadius: number = -1;

    /**
     * [KO] GrassInstanceBaker 인스턴스를 초기화합니다.
     * [EN] Initializes the GrassInstanceBaker instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.#uniformInt32View = new Int32Array(this.#uniformArrayBuffer);
        this.initComputePipeline(grassBakeWGSL, 'Grass_Bake', 256);
    }

    /**
     * [KO] 중심 좌표를 기준으로 반경 내 셀에 대해 잔디 인스턴스 베이킹 컴퓨트 패스를 디스패치합니다.
     * [EN] Dispatches the grass instance baking compute pass for cells within the radius around the center coordinates.
     *
     * @param megaBuffer -
     * [KO] 잔디 인스턴스 데이터를 저장할 GrassMegaBuffer 인스턴스
     * [EN] GrassMegaBuffer instance to store grass instance data
     * @param landscape -
     * [KO] 지형(Landscape) 인스턴스
     * [EN] Landscape instance
     * @param grass -
     * [KO] 베이킹할 잔디(Grass) 타입 인스턴스
     * [EN] Grass type instance to bake
     * @param centerX -
     * [KO] 베이킹 중심 X 월드 좌표 (기본값: 0)
     * [EN] Baking center X world coordinate (default: 0)
     * @param centerZ -
     * [KO] 베이킹 중심 Z 월드 좌표 (기본값: 0)
     * [EN] Baking center Z world coordinate (default: 0)
     */
    dispatchBake(
        megaBuffer: GrassMegaBuffer,
        landscape: Landscape,
        grass: Grass,
        centerX: number = 0,
        centerZ: number = 0
    ): void {
        const {rawGPUBuffer} = megaBuffer;
        if (!rawGPUBuffer) return;

        const {computePipeline, uniformGPUBuffer, gpuDevice, resourceManager} = this;
        const {emptyBitmapTextureView} = resourceManager;

        const {
            vhtTextureView,
            vbtTextureView,
            invWorldSizeX,
            invWorldSizeZ,
            heightScale
        } = landscape;
        const vhtView = vhtTextureView ?? emptyBitmapTextureView;
        const vbtView = vbtTextureView ?? emptyBitmapTextureView;

        const {typeId, bakeRadius} = grass;
        const alloc = megaBuffer.getAllocation(typeId);
        if (!alloc) return;

        const cellSize = GRASS_CELL_SIZE;
        const effectiveRadius = Math.max(bakeRadius, 16.0);
        const cellRadius = Math.ceil(effectiveRadius / cellSize);

        const centerCellX = Math.floor(centerX / cellSize);
        const centerCellZ = Math.floor(centerZ / cellSize);

        const spiralOffsets = this.#getSpiralOffsets(cellRadius);
        const {length, byteLength, buffer} = spiralOffsets;
        const totalCircularCells = length / 2;

        if (!this.#cellOffsetsGPUBuffer || this.#cellOffsetsGPUBuffer.size < byteLength) {
            this.#cellOffsetsGPUBuffer?.destroy();
            const newSize = Math.max(2048 * 8, Math.ceil(byteLength / 256) * 256);
            const {STORAGE, COPY_DST} = GPUBufferUsage;
            this.#cellOffsetsGPUBuffer = gpuDevice.createBuffer({
                label: 'Grass_Bake_CellOffsets_Buffer',
                size: newSize,
                usage: STORAGE | COPY_DST
            });
            this.#currentUploadedRadius = -1;
        }

        const activeOffsetsBuffer = this.#cellOffsetsGPUBuffer;
        if (this.#currentUploadedRadius !== cellRadius) {
            this.#currentUploadedRadius = cellRadius;
            gpuDevice.queue.writeBuffer(activeOffsetsBuffer, 0, buffer, 0, byteLength);
        }

        const {
            instancesPerCell,
            targetLayer,
            minScale,
            maxScale,
            bottomOffset,
            height,
            minSlope,
            maxSlope,
            densityScaleByWeight
        } = grass;

        const {maxInstances, rawBaseOffset} = alloc;
        const targetDensity = Math.max(1, Math.min(1024, instancesPerCell));
        const maxCellsAllowed = Math.floor(maxInstances / targetDensity);
        const totalCells = Math.min(totalCircularCells, Math.max(1, maxCellsAllowed));
        if (totalCells <= 0) return;

        alloc.instanceCount = totalCells * targetDensity;

        const {weightView, hasWeightMap, weightChannelIndex} = this.resolveWeightLayer(landscape, targetLayer);

        const [minScaleS, minScaleH] = minScale;
        const [maxScaleS, maxScaleH] = maxScale;

        const ui = this.#uniformInt32View;
        const uu = this.#uniformUint32View;
        const uf = this.#uniformFloat32View;

        ui[0] = centerCellX;
        ui[1] = centerCellZ;
        uu[2] = totalCells;
        uu[3] = targetDensity;

        uf[4] = cellSize;
        uf[5] = invWorldSizeX;
        uf[6] = invWorldSizeZ;
        uf[7] = heightScale;

        uf[8] = bottomOffset;
        uf[9] = height;
        uf[10] = minSlope ? Math.tan(minSlope * 0.0174533) ** 2 : 0.0;
        uf[11] = maxSlope ? Math.tan(maxSlope * 0.0174533) ** 2 : 9999.0;

        uu[12] = (minSlope > 0 || maxSlope < 90) ? 1 : 0;
        uf[13] = minScaleS;
        uf[14] = minScaleH;
        uf[15] = maxScaleS - minScaleS;
        uf[16] = maxScaleH - minScaleH;
        uu[17] = typeId;

        uu[18] = rawBaseOffset;
        uu[19] = hasWeightMap;
        uu[20] = weightChannelIndex;
        uu[21] = densityScaleByWeight ? 1 : 0;

        gpuDevice.queue.writeBuffer(uniformGPUBuffer, 0, this.#uniformArrayBuffer, 0, 88);

        const bindGroup = this.getOrCreateBindGroup(
            typeId,
            'Grass_Bake',
            rawGPUBuffer,
            vhtView,
            vbtView,
            weightView,
            activeOffsetsBuffer
        );
        if (!bindGroup) return;

        const commandEncoder = gpuDevice.createCommandEncoder({
            label: `Grass_Bake_CommandEncoder_Type_${typeId}`
        });
        const computePass = commandEncoder.beginComputePass({
            label: `Grass_Bake_ComputePass_Type_${typeId}`
        });
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        const workgroups = Math.ceil(totalCells / 64);
        computePass.dispatchWorkgroups(workgroups);
        computePass.end();

        gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    /**
     * [KO] 베이커가 점유한 GPU 버퍼 및 캐시 리소스를 해제합니다.
     * [EN] Releases GPU buffers and cache resources occupied by the baker.
     */
    override destroy(): void {
        this.#cellOffsetsGPUBuffer?.destroy();
        this.#cellOffsetsGPUBuffer = null;
        this.#cellOffsetsCache.clear();
        super.destroy();
    }

    #getSpiralOffsets(cellRadius: number): Int32Array {
        let cached = this.#cellOffsetsCache.get(cellRadius);
        if (cached) return cached;

        const maxR = cellRadius;
        const maxRSq = maxR * maxR;

        const temp: Array<{ dx: number; dz: number; distSq: number }> = [];
        for (let dz = -maxR; dz <= maxR; dz++) {
            const dzSq = dz * dz;
            for (let dx = -maxR; dx <= maxR; dx++) {
                const distSq = dx * dx + dzSq;
                if (distSq <= maxRSq) {
                    temp.push({dx, dz, distSq});
                }
            }
        }

        temp.sort((a, b) => a.distSq - b.distSq);

        const count = temp.length;
        const result = new Int32Array(count * 2);
        for (let i = 0; i < count; i++) {
            const {dx, dz} = temp[i];
            result[i * 2] = dx;
            result[i * 2 + 1] = dz;
        }

        this.#cellOffsetsCache.set(cellRadius, result);
        return result;
    }
}

Object.freeze(GrassInstanceBaker);
export default GrassInstanceBaker;

