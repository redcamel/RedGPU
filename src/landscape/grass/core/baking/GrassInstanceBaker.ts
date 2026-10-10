/**
 * [KO] 잔디(Grass) GPU 물리 베이커 모듈입니다.
 * [EN] GPU Physics instance baker module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import grassBakeWGSL from "./grassBake.wgsl";
import type Landscape from "../../../Landscape";
import type Grass from "../Grass";
import type GrassScatterMegaBuffer from "../buffer/GrassScatterMegaBuffer";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";

export const GRASS_CELL_SIZE: number = 16.0;

/**
 * [KO] 지형(Landscape) 높이맵 및 레이어 가중치 텍스처를 기반으로 잔디 인스턴스를 100% GPU 베이킹하는 클래스입니다.
 * [EN] Baker class that bakes grass instances 100% on the GPU based on landscape heightmaps and layer weight textures.
 */
class GrassInstanceBaker extends AScatterInstanceBaker {
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;
    #uniformInt32View: Int32Array;

    #cellOffsetsCache: Map<number, Int32Array> = new Map();
    #cellOffsetsGPUBuffer: GPUBuffer | null = null;
    #currentUploadedRadius: number = -1;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.#uniformInt32View = new Int32Array(this.#uniformArrayBuffer);
        this.initComputePipeline(grassBakeWGSL, 'Grass_Bake', 256);
    }

    /**
     * [KO] 특정 잔디 타입에 대해 16m 서브셀 단위 GPU 베이킹 Compute Pass를 1회 실행합니다.
     * [EN] Executes GPU Baking Compute Pass once for a specific grass type using 16m subcells.
     */
    dispatchBake(
        megaBuffer: GrassScatterMegaBuffer,
        landscape: Landscape,
        grass: Grass,
        centerX: number = 0,
        centerZ: number = 0
    ): void {
        const {rawGPUBuffer} = megaBuffer;
        if (!rawGPUBuffer) return;

        const {computePipeline, uniformGPUBuffer, gpuDevice} = this;

        const {
            vhtAtlasTexture,
            vbtBaseColorAtlas,
            invWorldSizeX,
            invWorldSizeZ,
            heightScale
        } = landscape;
        const vhtView = vhtAtlasTexture.gpuTextureView;
        const vbtView = vbtBaseColorAtlas.gpuTextureView;

        const {typeId, streamingRadius} = grass;
        const alloc = megaBuffer.getAllocation(typeId);
        if (!alloc) return;

        const cellSize = GRASS_CELL_SIZE;
        const effectiveRadius = Math.max(streamingRadius, 16.0);
        const cellRadius = Math.ceil(effectiveRadius / cellSize);

        const centerCellX = Math.floor(centerX / cellSize);
        const centerCellZ = Math.floor(centerZ / cellSize);

        const spiralOffsets = this.#getSpiralOffsets(cellRadius);
        const {length, byteLength} = spiralOffsets;
        const totalCircularCells = length / 2;

        if (!this.#cellOffsetsGPUBuffer || this.#cellOffsetsGPUBuffer.size < byteLength) {
            this.#cellOffsetsGPUBuffer?.destroy();
            const newSize = Math.max(2048 * 8, Math.ceil(spiralOffsets.byteLength / 256) * 256);
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
            const {buffer, byteLength} = spiralOffsets;
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

    override destroy(): void {
        this.#cellOffsetsGPUBuffer?.destroy();
        this.#cellOffsetsGPUBuffer = null;
        this.#cellOffsetsCache.clear();
        super.destroy();
    }

    /**
     * [KO] 특정 반경에 대해 카메라 중심 기준 원형 거리순으로 정렬된 상대 셀 좌표 [dx, dz] 배열을 반환합니다. (Zero-GC 캐싱)
     * [EN] Returns relative cell coordinates [dx, dz] sorted in circular distance order from the camera center. (Zero-GC cached)
     */
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
