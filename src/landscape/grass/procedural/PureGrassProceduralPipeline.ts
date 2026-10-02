/**
 * [KO] Pure GPU 절차적 잔디 파이프라인 관리자 모듈입니다.
 * [EN] Pure GPU Procedural Grass pipeline manager module.
 * @packageDocumentation
 */

import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import pureGrassProceduralWGSL from "./pureGrassProcedural.wgsl";
import type Landscape from "../../Landscape";
import type LandscapeTileStreamer from "../../core/spatial/LandscapeTileStreamer";
import type Grass from "../core/Grass";
import type {GrassScatterMegaBuffer} from "../core/buffer/GrassScatterMegaBuffer";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] Pure GPU 절차적 잔디 생성 및 컬링을 위한 단일 통합 컴퓨트 파이프라인 클래스입니다.
 * [EN] Unified single-pass compute pipeline class for Pure GPU procedural grass generation and culling.
 */
export default class PureGrassProceduralPipeline extends RedGPUObject {
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformBuffer: GPUBuffer | null = null;

    // Zero-GC: 32비트 부동소수점 및 부호 없는 정수 뷰를 공유하는 재사용 유니폼 버퍼 (총 64개의 32비트 워드 = 256 바이트)
    #uniformArrayBuffer: ArrayBuffer = new ArrayBuffer(256);
    #uniformFloat32View: Float32Array;
    #uniformUint32View: Uint32Array;

    #cachedBindGroups: Map<number, GPUBindGroup> = new Map();
    #defaultSampler: GPUSampler | null = null;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#uniformFloat32View = new Float32Array(this.#uniformArrayBuffer);
        this.#uniformUint32View = new Uint32Array(this.#uniformArrayBuffer);
        this.#initPipeline();
    }

    /**
     * [KO] 바인드 그룹 캐시를 무효화합니다 (버퍼 재생성 시 호출).
     * [EN] Invalidates bind group cache (called when buffers are recreated).
     */
    invalidateBindGroups(): void {
        this.#cachedBindGroups.clear();
    }

    /**
     * [KO] 매 프레임 GPU 컴퓨트 패스를 통해 잔디를 절차적으로 생성, 지형 스냅, 컬링하고 간접 드로우 버퍼를 갱신합니다.
     * [EN] Procedurally generates, terrain-snaps, culls grass and updates indirect draw buffers via GPU compute pass every frame.
     */
    dispatchPass(
        computePass: GPUComputePassEncoder,
        megaBuffer: GrassScatterMegaBuffer,
        tileStreamer: LandscapeTileStreamer,
        landscape: Landscape,
        grassList: Grass[],
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanesF32: Float32Array | null
    ): void {
        const pipeline = this.#computePipeline;
        const bindGroupLayout = this.#bindGroupLayout;
        const uniformBuffer = this.#uniformBuffer;
        const gpuDevice = this.gpuDevice;
        if (!pipeline || !bindGroupLayout || !uniformBuffer || !gpuDevice) return;

        const culledBuffer = megaBuffer.culledGPUBuffer;
        const indirectBuffer = megaBuffer.indirectGPUBuffer;
        if (!culledBuffer || !indirectBuffer) return;

        const vhtAtlas = tileStreamer.getAtlasTexture('vht');
        const vbtAtlas = tileStreamer.getAtlasTexture('vbtBaseColor');
        const vhtView = vhtAtlas?.gpuTextureView;
        const vbtView = vbtAtlas?.gpuTextureView;
        if (!vhtView || !vbtView) return;

        const worldSize = landscape.worldSize;
        const worldSizeX = worldSize ? worldSize[0] : 8000.0;
        const worldSizeZ = worldSize ? worldSize[1] : 8000.0;
        const invWorldSizeX = worldSizeX > 0 ? 1.0 / worldSizeX : 0.000125;
        const invWorldSizeZ = worldSizeZ > 0 ? 1.0 / worldSizeZ : 0.000125;
        const heightScale = landscape.heightScale ?? 600.0;

        const uf = this.#uniformFloat32View;
        const uu = this.#uniformUint32View;

        computePass.setPipeline(pipeline);

        const grassCount = grassList.length;
        for (let g = 0; g < grassCount; g++) {
            const grass = grassList[g];
            const typeId = grass.typeId;
            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc) continue;

            const cullingDist = grass.cullingDistance || 80.0;
            // 밀도 기반 가상 그리드 스페이싱 계산 (기본 0.5m ~ 1.0m)
            const targetDensity = (grass.densityPerHectare / 10000.0) * 256.0 * grass.densityMultiplier;
            const spacing = Math.max(0.3, Math.min(2.0, 16.0 / Math.max(1.0, Math.sqrt(targetDensity))));

            const gridDimX = Math.min(512, Math.ceil((cullingDist * 2.0) / spacing));
            const gridDimZ = Math.min(512, Math.ceil((cullingDist * 2.0) / spacing));
            const totalCells = gridDimX * gridDimZ;
            if (totalCells <= 0) continue;

            const worldOriginMinX = camX - cullingDist;
            const worldOriginMinZ = camZ - cullingDist;

            // 1. Uniform 데이터 패킹 (Zero-GC)
            uf[0] = camX;
            uf[1] = camY;
            uf[2] = camZ;
            uf[3] = 0.0;

            if (frustumPlanesF32 && frustumPlanesF32.length >= 24) {
                uf.set(frustumPlanesF32.subarray(0, 24), 4);
            } else {
                for (let p = 4; p < 28; p++) uf[p] = 0.0;
            }

            uf[28] = worldOriginMinX;
            uf[29] = worldOriginMinZ;
            uu[30] = gridDimX;
            uu[31] = gridDimZ;

            uf[32] = spacing;
            uf[33] = cullingDist;
            uf[34] = invWorldSizeX;
            uf[35] = invWorldSizeZ;

            uf[36] = heightScale;
            uf[37] = grass.farDistance || (cullingDist * 0.5);
            uu[38] = 2; // stageCount
            uu[39] = Math.max(1, grass.subMeshes.length);

            uu[40] = typeId;
            uf[41] = grass.minSlope ? Math.tan(grass.minSlope * 0.0174533) ** 2 : 0.0;
            uf[42] = grass.maxSlope ? Math.tan(grass.maxSlope * 0.0174533) ** 2 : 9999.0;
            uu[43] = (grass.minSlope > 0 || grass.maxSlope < 90) ? 1 : 0;

            const minScale = grass.minScale;
            const maxScale = grass.maxScale;
            uf[44] = minScale ? minScale[0] : 0.8;
            uf[45] = maxScale ? maxScale[0] : 1.2;
            uf[46] = minScale ? minScale[1] : 0.8;
            uf[47] = maxScale ? maxScale[1] : 1.2;

            uf[48] = 0.2; // densityThreshold
            uu[49] = grass.targetLayer ? 1 : 0;
            uu[50] = 0; // weightChannelIndex
            uu[51] = Math.floor(alloc.maxInstances / 2);

            gpuDevice.queue.writeBuffer(uniformBuffer, 0, this.#uniformArrayBuffer);

            // 2. 바인드 그룹 취득 및 디스패치
            let bindGroup = this.#cachedBindGroups.get(typeId);
            if (!bindGroup) {
                bindGroup = gpuDevice.createBindGroup({
                    label: `PureGrass_Procedural_BG_Type_${typeId}`,
                    layout: bindGroupLayout,
                    entries: [
                        {binding: 0, resource: {buffer: uniformBuffer}},
                        {binding: 1, resource: {buffer: culledBuffer}},
                        {binding: 2, resource: {buffer: indirectBuffer}},
                        {binding: 3, resource: vhtView},
                        {binding: 4, resource: vbtView},
                        {binding: 5, resource: this.#defaultSampler!},
                    ]
                });
                this.#cachedBindGroups.set(typeId, bindGroup);
            }

            computePass.setBindGroup(0, bindGroup);
            const workgroups = Math.ceil(totalCells / 64);
            computePass.dispatchWorkgroups(workgroups);
        }
    }

    /**
     * [KO] 파이프라인 리소스를 안전하게 해제합니다.
     * [EN] Safely releases pipeline resources.
     */
    destroy(): void {
        this.#cachedBindGroups.clear();
        this.#uniformBuffer?.destroy();
        this.#uniformBuffer = null;
        this.#computePipeline = null;
        this.#bindGroupLayout = null;
        this.#defaultSampler = null;
    }

    #initPipeline(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('PureGrass_Procedural_ShaderModule', pureGrassProceduralWGSL);

        let computeModule = resourceManager.getGPUShaderModule('PureGrass_Procedural_ShaderModule');
        if (!computeModule) {
            computeModule = resourceManager.createGPUShaderModule('PureGrass_Procedural_ShaderModule', {
                code: pureGrassProceduralWGSL,
            });
        }

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);
        this.#bindGroupLayout = resourceManager.createBindGroupLayout('PureGrass_Procedural_BGL', {
            label: 'PureGrass_Procedural_BGL',
            ...descriptor,
        });

        const pipelineLayout = resourceManager.createGPUPipelineLayout('PureGrass_Procedural_PipelineLayout', {
            bindGroupLayouts: [this.#bindGroupLayout],
        });

        this.#computePipeline = gpuDevice.createComputePipeline({
            label: 'PureGrass_Procedural_Pipeline',
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main',
            },
        });

        this.#uniformBuffer = gpuDevice.createBuffer({
            label: 'PureGrass_Procedural_UniformBuffer',
            size: 256,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#defaultSampler = gpuDevice.createSampler({
            magFilter: 'linear',
            minFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });
    }
}

Object.freeze(PureGrassProceduralPipeline);
