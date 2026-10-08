/**
 * [KO] 잔디(Grass) GPU 물리 베이커 모듈입니다.
 * [EN] GPU Physics instance baker module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import grassBakeWGSL from "./grassBake.wgsl";
import type Landscape from "../../../Landscape";
import type Grass from "../Grass";
import type {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import AScatterInstanceBaker from "../../../core/scatter/AScatterInstanceBaker";

export const GRASS_CELL_SIZE: number = 16.0;
const DEFAULT_GRASS_MIN_SCALE = Object.freeze([0.8, 0.8] as const);
const DEFAULT_GRASS_MAX_SCALE = Object.freeze([1.2, 1.2] as const);

export default class GrassInstanceBaker extends AScatterInstanceBaker {
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
        const pipeline = this.computePipeline;
        const uniformBuffer = this.uniformGPUBuffer;
        const gpuDevice = this.gpuDevice;
        if (!pipeline || !uniformBuffer || !gpuDevice) return;

        const rawBuffer = megaBuffer.rawGPUBuffer;
        if (!rawBuffer) return;

        if (!landscape.hasValidScatterAtlas) return;

        const vhtView = landscape.vhtAtlasTexture.gpuTextureView;
        const vbtView = landscape.vbtBaseColorAtlas.gpuTextureView;

        const alloc = megaBuffer.getAllocation(grass.typeId);
        if (!alloc) return;

        const {worldSizeX, worldSizeZ, invWorldSizeX, invWorldSizeZ, heightScale} = landscape;

        // 16m 서브셀 단위 계산
        const cellSize = GRASS_CELL_SIZE;
        const effectiveRadius = Math.max(grass.streamingRadius || grass.cullingDistance || 80.0, 16.0);
        const cellRadius = Math.ceil(effectiveRadius / cellSize);

        const centerCellX = Math.floor(centerX / cellSize);
        const centerCellZ = Math.floor(centerZ / cellSize);

        // 카메라 중심 거리순 셀 오프셋 목록 가져오기
        const spiralOffsets = this.#getSpiralOffsets(cellRadius);
        const totalCircularCells = spiralOffsets.length / 2;

        if (!this.#cellOffsetsGPUBuffer || this.#cellOffsetsGPUBuffer.size < spiralOffsets.byteLength) {
            this.#cellOffsetsGPUBuffer?.destroy();
            const newSize = Math.max(2048 * 8, Math.ceil(spiralOffsets.byteLength / 256) * 256);
            this.#cellOffsetsGPUBuffer = gpuDevice.createBuffer({
                label: 'Grass_Bake_CellOffsets_Buffer',
                size: newSize,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
            this.#currentUploadedRadius = -1;
        }

        const activeOffsetsBuffer = this.#cellOffsetsGPUBuffer;
        if (this.#currentUploadedRadius !== cellRadius) {
            this.#currentUploadedRadius = cellRadius;
            gpuDevice.queue.writeBuffer(activeOffsetsBuffer, 0, spiralOffsets.buffer, 0, spiralOffsets.byteLength);
        }

        // 셀당 인스턴스 수 계산 (16m x 16m = 256m²)
        const targetDensity = Math.max(1, Math.min(1024, grass.instancesPerCell || 64));
        const maxCellsAllowed = Math.floor(alloc.maxInstances / targetDensity);
        const totalCells = Math.min(totalCircularCells, Math.max(1, maxCellsAllowed));
        if (totalCells <= 0) return;

        alloc.instanceCount = totalCells * targetDensity;

        // TargetLayer WeightMap 찾기
        let weightView: GPUTextureView = this.redGPUContext.resourceManager.emptyBitmapTextureView;
        let hasWeightMap = 0;
        let weightChannelIndex = 0;

        if (grass.targetLayer !== undefined && grass.targetLayer !== null && grass.targetLayer !== '' && landscape.layers) {
            const matchedLayer = typeof grass.targetLayer === 'number'
                ? landscape.layers[grass.targetLayer]
                : landscape.layers.find(
                    l => l.name === grass.targetLayer
                );
            if (matchedLayer) {
                const wt = matchedLayer.weightTexture;
                if (wt && wt.gpuTexture) {
                    weightView = this.redGPUContext.resourceManager.getGPUResourceBitmapTextureView(wt)
                        || wt.gpuTexture.createView();
                    hasWeightMap = 1;
                    weightChannelIndex = matchedLayer.weightChannelIndex ?? 0;
                }
            }
        }

        const minScale = grass.minScale || DEFAULT_GRASS_MIN_SCALE;
        const maxScale = grass.maxScale || DEFAULT_GRASS_MAX_SCALE;
        const minScaleS = minScale[0];
        const maxScaleS = maxScale[0];
        const minScaleH = minScale[1];
        const maxScaleH = maxScale[1];

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

        uf[8] = grass.bottomOffset || 0.0;
        uf[9] = grass.height || 1.0;
        uf[10] = grass.minSlope ? Math.tan(grass.minSlope * 0.0174533) ** 2 : 0.0;
        uf[11] = grass.maxSlope ? Math.tan(grass.maxSlope * 0.0174533) ** 2 : 9999.0;

        uu[12] = (grass.minSlope > 0 || grass.maxSlope < 90) ? 1 : 0;
        uf[13] = minScaleS;
        uf[14] = minScaleH;
        uf[15] = maxScaleS - minScaleS;
        uf[16] = maxScaleH - minScaleH;
        uu[17] = grass.typeId;

        uu[18] = alloc.rawBaseOffset;
        uu[19] = hasWeightMap;
        uu[20] = weightChannelIndex;
        uu[21] = grass.densityScaleByWeight ? 1 : 0;

        gpuDevice.queue.writeBuffer(uniformBuffer, 0, this.#uniformArrayBuffer, 0, 88);

        const bindGroup = this.getOrCreateBindGroup(
            grass.typeId,
            'Grass_Bake',
            rawBuffer,
            vhtView,
            vbtView,
            weightView,
            activeOffsetsBuffer
        );
        if (!bindGroup) return;

        const commandEncoder = gpuDevice.createCommandEncoder({
            label: `Grass_Bake_CommandEncoder_Type_${grass.typeId}`
        });
        const computePass = commandEncoder.beginComputePass({
            label: `Grass_Bake_ComputePass_Type_${grass.typeId}`
        });
        computePass.setPipeline(pipeline);
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
            result[i * 2] = temp[i].dx;
            result[i * 2 + 1] = temp[i].dz;
        }

        this.#cellOffsetsCache.set(cellRadius, result);
        return result;
    }
}
