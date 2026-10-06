/**
 * [KO] GPU 베이킹 파이프라인 매니저 모듈입니다.
 * [EN] GPU Baking Pipeline manager module for grass.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import grassBakeWGSL from "./grassBake.wgsl";
import type Landscape from "../../../Landscape";
import type LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import type Grass from "../Grass";
import type {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../../material/core";

const CELL_SIZE: number = 16.0;

export default class GrassBakePipeline extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;
    #uniformInt32View: Int32Array;
    #defaultSampler: GPUSampler | null = null;
    #dummyTexture: GPUTexture | null = null;
    #dummyTextureView: GPUTextureView | null = null;

    #cellOffsetsCache: Map<number, Int32Array> = new Map();
    #cellOffsetsGPUBuffer: GPUBuffer | null = null;
    #currentUploadedRadius: number = -1;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.#uniformInt32View = new Int32Array(this.#uniformArrayBuffer);
        this.#initPipeline();
    }

    /**
     * [KO] 특정 잔디 타입에 대해 16m 서브셀 단위 GPU 베이킹 Compute Pass를 1회 실행합니다.
     * [EN] Executes GPU Baking Compute Pass once for a specific grass type using 16m subcells.
     */
    dispatchBake(
        megaBuffer: GrassScatterMegaBuffer,
        tileStreamer: LandscapeTileStreamer,
        landscape: Landscape,
        grass: Grass,
        centerX: number = 0,
        centerZ: number = 0
    ): void {
        const pipeline = this.#computePipeline;
        const bindGroupLayout = this.#bindGroupLayout;
        const uniformBuffer = this.#uniformBuffer;
        const offsetsBuffer = this.#cellOffsetsGPUBuffer;
        const gpuDevice = this.gpuDevice;
        if (!pipeline || !bindGroupLayout || !uniformBuffer || !offsetsBuffer || !gpuDevice) return;

        const rawBuffer = megaBuffer.rawGPUBuffer;
        if (!rawBuffer) return;

        const vhtAtlas = tileStreamer.getAtlasTexture('vht');
        const vbtAtlas = tileStreamer.getAtlasTexture('vbtBaseColor');
        const vhtView = vhtAtlas?.gpuTextureView;
        const vbtView = vbtAtlas?.gpuTextureView;
        if (!vhtView || !vbtView) return;

        const alloc = megaBuffer.getAllocation(grass.typeId);
        if (!alloc) return;

        const worldSize = landscape.worldSize;
        const worldSizeX = worldSize ? worldSize[0] : 8000.0;
        const worldSizeZ = worldSize ? worldSize[1] : 8000.0;
        const invWorldSizeX = worldSizeX > 0 ? 1.0 / worldSizeX : 0.000125;
        const invWorldSizeZ = worldSizeZ > 0 ? 1.0 / worldSizeZ : 0.000125;
        const heightScale = landscape.heightScale ?? 600.0;

        // 16m 서브셀 단위 계산
        const cellSize = CELL_SIZE;
        const effectiveRadius = Math.max(grass.streamingRadius || grass.cullingDistance || 80.0, 16.0);
        const cellRadius = Math.ceil(effectiveRadius / cellSize);

        const centerCellX = Math.floor(centerX / cellSize);
        const centerCellZ = Math.floor(centerZ / cellSize);

        // 카메라 중심 거리순 셀 오프셋 목록 가져오기
        const spiralOffsets = this.#getSpiralOffsets(cellRadius);
        const totalCircularCells = spiralOffsets.length / 2;

        if (offsetsBuffer.size < spiralOffsets.byteLength) {
            offsetsBuffer.destroy();
            const newSize = Math.max(2048 * 8, Math.ceil(spiralOffsets.byteLength / 256) * 256);
            this.#cellOffsetsGPUBuffer = gpuDevice.createBuffer({
                label: 'Grass_Bake_CellOffsets_Buffer',
                size: newSize,
                usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
            });
            this.#currentUploadedRadius = -1;
        }

        const activeOffsetsBuffer = this.#cellOffsetsGPUBuffer!;
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
        let weightView: GPUTextureView = this.#dummyTextureView!;
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

        const minScale = grass.minScale || [0.8, 0.8];
        const maxScale = grass.maxScale || [1.2, 1.2];
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
        uf[14] = maxScaleS;
        uf[15] = minScaleH;

        uf[16] = maxScaleH;
        uf[17] = maxScaleS - minScaleS;
        uf[18] = maxScaleH - minScaleH;
        uu[19] = grass.typeId;

        uu[20] = alloc.rawBaseOffset;
        uu[21] = hasWeightMap;
        uu[22] = weightChannelIndex;
        uu[23] = grass.densityScaleByWeight ? 1 : 0;

        gpuDevice.queue.writeBuffer(uniformBuffer, 0, this.#uniformArrayBuffer);

        const bindGroup = gpuDevice.createBindGroup({
            label: `Grass_Bake_BG_Type_${grass.typeId}`,
            layout: bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: uniformBuffer}},
                {binding: 1, resource: {buffer: rawBuffer}},
                {binding: 2, resource: vhtView},
                {binding: 3, resource: vbtView},
                {binding: 4, resource: this.#defaultSampler!},
                {binding: 5, resource: weightView},
                {binding: 6, resource: this.#defaultSampler!},
                {binding: 7, resource: {buffer: activeOffsetsBuffer}},
            ]
        });

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

    destroy(): void {
        this.#uniformBuffer?.destroy();
        this.#uniformBuffer = null;
        this.#cellOffsetsGPUBuffer?.destroy();
        this.#cellOffsetsGPUBuffer = null;
        this.#dummyTexture?.destroy();
        this.#dummyTexture = null;
        this.#dummyTextureView = null;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
        this.#cellOffsetsCache.clear();
    }

    /**
     * [KO] 특정 반경에 대해 카메라 중심 기준 원형 거리순으로 정렬된 상대 셀 좌표 [dx, dz] 배열을 반환합니다. (Zero-GC 캐싱)
     * [EN] Returns relative cell coordinates [dx, dz] sorted in circular distance order from the camera center. (Zero-GC cached)
     */
    #getSpiralOffsets(cellRadius: number): Int32Array {
        let cached = this.#cellOffsetsCache.get(cellRadius);
        if (cached) return cached;

        const maxR = cellRadius;
        const radiusSq = maxR * maxR;
        const candidates: { dx: number; dz: number; distSq: number }[] = [];

        for (let dz = -maxR; dz <= maxR; dz++) {
            for (let dx = -maxR; dx <= maxR; dx++) {
                const distSq = dx * dx + dz * dz;
                if (distSq <= radiusSq) {
                    candidates.push({dx, dz, distSq});
                }
            }
        }

        candidates.sort((a, b) => a.distSq - b.distSq);

        const count = candidates.length;
        const arr = new Int32Array(count * 2);
        for (let i = 0; i < count; i++) {
            arr[i * 2] = candidates[i].dx;
            arr[i * 2 + 1] = candidates[i].dz;
        }

        this.#cellOffsetsCache.set(cellRadius, arr);
        return arr;
    }

    #initPipeline(): void {
        const {resourceManager, gpuDevice} = this.redGPUContext;
        if (!gpuDevice) return;

        this.#defaultSampler = gpuDevice.createSampler({
            label: 'Grass_Bake_Sampler',
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });

        // 1x1 White dummy texture for fallback
        this.#dummyTexture = gpuDevice.createTexture({
            label: 'Grass_Bake_Dummy_WeightTexture',
            size: [1, 1, 1],
            format: 'rgba8unorm',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST
        });
        gpuDevice.queue.writeTexture(
            {texture: this.#dummyTexture},
            new Uint8Array([255, 255, 255, 255]),
            {bytesPerRow: 4, rowsPerImage: 1},
            {width: 1, height: 1}
        );
        this.#dummyTextureView = this.#dummyTexture.createView();

        // 2048개 셀 오프셋을 저장할 수 있는 GPU 버퍼 (vec2<i32> * 2048 = 16384 bytes)
        this.#cellOffsetsGPUBuffer = gpuDevice.createBuffer({
            label: 'Grass_Bake_CellOffsets_Buffer',
            size: 2048 * 8,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
        });

        const shaderInfo = resourceManager.wgslParser.parse('Grass_Bake_ShaderModule', grassBakeWGSL);
        let computeModule = resourceManager.getGPUShaderModule('Grass_Bake_ShaderModule');
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule('Grass_Bake_ShaderModule', {
                code: grassBakeWGSL
            });
        }

        const bglDesc = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout('Grass_Bake_BGL', bglDesc);

        const pipelineLayout = resourceManager.createGPUPipelineLayout('Grass_Bake_PipelineLayout', {
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: 'Grass_Bake_Pipeline',
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main'
            }
        });

        this.#uniformBuffer = gpuDevice.createBuffer({
            label: 'Grass_Bake_UniformBuffer',
            size: this.#uniformArrayBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
}

Object.freeze(GrassBakePipeline);
