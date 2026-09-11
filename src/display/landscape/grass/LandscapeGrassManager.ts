import RedGPUContext from "../../../context/RedGPUContext";
import Landscape from "../core/Landscape";
import {GrassType} from "./GrassType";
import {GrassMegaBuffer} from "./core/buffer/GrassMegaBuffer";
import {GrassBaker} from "./core/baking/GrassBaker";
import {GrassCuller} from "./core/culling/GrassCuller";
import grassVertexSource from "./shader/grassVertex.wgsl";
import grassFragmentSource from "./shader/grassFragment.wgsl";
import grassFragmentFarSource from "./shader/grassFragmentFar.wgsl";
import computeViewFrustumPlanes from "../../../math/computeViewFrustumPlanes";
import GPU_PRIMITIVE_TOPOLOGY from "../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import LandscapeWeightMapCache from "../material/LandscapeWeightMapCache";

export class LandscapeGrassManager {
    static readonly CELL_SIZE: number = 16.0;
    static readonly DEFAULT_STREAMING_RADIUS: number = 120.0;
    static readonly MAX_CANDIDATE_CELLS: number = 2048;
    static readonly MAX_POPULATE_CELLS_PER_FRAME: number = 8;

    static readonly #COMPUTE_PASS_DESCRIPTOR: GPUComputePassDescriptor = {
        label: 'LandscapeGrass_ComputePass'
    };

    #redGPUContext: RedGPUContext;
    #landscape: Landscape;
    #enabled: boolean = true;
    #streamingRadius: number = LandscapeGrassManager.DEFAULT_STREAMING_RADIUS;

    #megaBuffer: GrassMegaBuffer;
    #baker: GrassBaker;
    #culler: GrassCuller;

    #grassTypes: GrassType[] = [];
    #nextTypeId: number = 0;
    #totalInstancesPopulated: number = 0;
    #populated: boolean = false;

    #vertexModule: GPUShaderModule | null = null;
    #fragmentModule: GPUShaderModule | null = null;
    #fragmentFarModule: GPUShaderModule | null = null;
    #pipelineLayout: GPUPipelineLayout | null = null;
    #pipelineBindGroupLayout0: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout1: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout2: GPUBindGroupLayout | null = null;
    #renderPipelinesNear: Map<number, GPURenderPipeline> = new Map();
    #renderPipelinesFar: Map<number, GPURenderPipeline> = new Map();

    #typeMaterialBuffers: Map<number, {
        uniformBuffer: GPUBuffer;
        cpuBuffer: Float32Array;
        uintBuffer: Uint32Array;
        grassUniformGPUBuffer: GPUBuffer;
        grassUniformCPUBuffer: Float32Array;
        bindGroup: GPUBindGroup | null;
        instanceBindGroup: GPUBindGroup | null;
        cachedColorTexView: GPUTextureView | null;
    }> = new Map();

    #candidateKeys: Int32Array = new Int32Array(LandscapeGrassManager.MAX_CANDIDATE_CELLS);
    #candidateDistancesSq: Float32Array = new Float32Array(LandscapeGrassManager.MAX_CANDIDATE_CELLS);
    #candidateIndices: Int32Array = new Int32Array(LandscapeGrassManager.MAX_CANDIDATE_CELLS);

    #typeCellStates: Map<number, {
        activeCellRanges: Map<number, { start: number; count: number; filledCount?: number }>;
        freeSlotRanges: Array<{ start: number; count: number }>;
        slotHead: number;
        activeCount: number;
    }> = new Map();

    #neededCellKeysSet: Set<number> = new Set();
    #keysToEvict: number[] = [];
    #lastPopulatePos: [number, number, number] = [0, 0, 0];
    #lastUpdateGridPos: [number, number] = [-999999, -999999];
    #frustumPlanesF32: Float32Array = new Float32Array(24);
    #tempWeights4: Float32Array = new Float32Array(4);

    #prngState: number = 12345;

    constructor(landscape: Landscape) {
        this.#landscape = landscape;
        this.#redGPUContext = landscape.redGPUContext;

        this.#megaBuffer = new GrassMegaBuffer(this.#redGPUContext, 131072);
        this.#baker = new GrassBaker(this.#redGPUContext);
        this.#culler = new GrassCuller(this.#redGPUContext);

        this.#megaBuffer.onRecreated = () => {
            this.#baker.invalidateBindGroup();
            this.#culler.invalidateBindGroup();
            for (const res of this.#typeMaterialBuffers.values()) {
                res.instanceBindGroup = null;
            }
        };

        this.#initShadersAndLayouts();
    }

    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(val: boolean) {
        this.#enabled = val;
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(val: number) {
        const clamped = Math.max(16.0, val);
        if (this.#streamingRadius !== clamped) {
            this.#streamingRadius = clamped;
            this.populateInstances(this.#lastPopulatePos);
        }
    }

    get grassTypes(): GrassType[] {
        return this.#grassTypes;
    }

    get hasGrassTypes(): boolean {
        return this.#grassTypes.length > 0;
    }

    get totalInstancesPopulated(): number {
        return this.#totalInstancesPopulated;
    }

    getOrCreateRenderPipeline(sampleCount: number = 1, isFar: boolean = false): GPURenderPipeline | null {
        const cache = isFar ? this.#renderPipelinesFar : this.#renderPipelinesNear;
        let pipeline = cache.get(sampleCount);
        if (pipeline) return pipeline;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        const fragModule = isFar ? this.#fragmentFarModule : this.#fragmentModule;
        if (!gpuDevice || !this.#pipelineLayout || !this.#vertexModule || !fragModule) return null;

        const preferredNormalFormat = navigator.gpu.getPreferredCanvasFormat();

        pipeline = gpuDevice.createRenderPipeline({
            label: `Grass_RenderPipeline_${isFar ? 'Far' : 'Near'}_msaa${sampleCount}`,
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 18 * 4,
                        stepMode: 'vertex',
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'},
                            {shaderLocation: 1, offset: 12, format: 'float32x3'},
                            {shaderLocation: 2, offset: 24, format: 'float32x2'},
                        ]
                    }
                ]
            },
            fragment: {
                module: fragModule,
                entryPoint: 'main',
                targets: [
                    {format: 'rgba16float'},
                    {format: preferredNormalFormat},
                    {format: 'rgba16float'}
                ]
            },
            primitive: {
                topology: GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST,
                cullMode: 'none',
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less-equal',
            },
            multisample: {
                count: sampleCount
            }
        });

        cache.set(sampleCount, pipeline);
        return pipeline;
    }

    addGrassType(grassType: GrassType): void {
        const typeId = this.#nextTypeId++;
        grassType.typeId = typeId;
        this.#grassTypes.push(grassType);

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const targetRadius = Math.max(grassType.cullingDistance, this.#streamingRadius);
        const cellCountApprox = Math.ceil((Math.PI * targetRadius * targetRadius) / (LandscapeGrassManager.CELL_SIZE * LandscapeGrassManager.CELL_SIZE));
        const maxInstances = Math.max(2048, Math.min(262144, cellCountApprox * Math.ceil(grassType.instancesPerCell * 1.3)));

        const lodAllocConfigs = grassType.lods.map(l => ({
            lodIndex: l.lodIndex,
            lodDistance: l.lodDistance,
            indexCount: (l.geometry as any)?.indexBuffer?.indexCount ?? 0,
            firstIndex: 0,
            baseVertex: 0
        }));

        const alloc = this.#megaBuffer.allocateType(
            typeId,
            grassType.name,
            maxInstances,
            lodAllocConfigs
        );

        const baseOffset = alloc.rawBaseOffset;
        for (let i = 0; i < maxInstances; i++) {
            this.#megaBuffer.writeInstanceData(baseOffset + i, 0.0, -999999.0, 0.0, 0.0, 0.0, 0.0);
        }
        this.#megaBuffer.uploadInstances(baseOffset, maxInstances);

        this.#culler.invalidateBindGroup();
        this.#baker.invalidateBindGroup();

        this.#typeCellStates.set(typeId, {
            activeCellRanges: new Map(),
            freeSlotRanges: [],
            slotHead: 0,
            activeCount: 0
        });

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (gpuDevice) {
            const cpuBuffer = new Float32Array(16);
            const uintBuffer = new Uint32Array(cpuBuffer.buffer);

            const uniformBuffer = gpuDevice.createBuffer({
                label: `Grass_MaterialUniform_${grassType.name}`,
                size: cpuBuffer.byteLength,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            const grassUniformCPUBuffer = new Float32Array(8);
            const grassUniformGPUBuffer = gpuDevice.createBuffer({
                label: `Grass_UniformBuffer_${grassType.name}`,
                size: 32,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });

            this.#typeMaterialBuffers.set(grassType.typeId, {
                uniformBuffer,
                cpuBuffer,
                uintBuffer,
                grassUniformGPUBuffer,
                grassUniformCPUBuffer,
                bindGroup: null,
                instanceBindGroup: null,
                cachedColorTexView: null
            });
        }

        grassType.onChanged = () => {
            this.#typeCellStates.get(typeId)?.activeCellRanges.clear();
            this.populateInstances(this.#lastPopulatePos);
        };

        if (grassType.targetLayer) {
            const matchedLayer = this.#landscape.layers.find(l => l.name === grassType.targetLayer || (l as any).key === grassType.targetLayer);
            const targetSrc = matchedLayer?.weightTexture?.src || (matchedLayer as any)?.pendingWeightSrc;
            if (targetSrc) {
                LandscapeWeightMapCache.load(targetSrc).then(() => {
                    this.populateInstances(this.#lastPopulatePos);
                });
            }
        }
    }

    update(camera: any, stateData?: any): void {
        if (!this.#enabled || this.#grassTypes.length === 0) return;

        const camPos: [number, number, number] = [
            camera.x ?? camera.position?.[0] ?? 0,
            camera.y ?? camera.position?.[1] ?? 0,
            camera.z ?? camera.position?.[2] ?? 0
        ];

        this.#lastPopulatePos[0] = camPos[0];
        this.#lastPopulatePos[1] = camPos[1];
        this.#lastPopulatePos[2] = camPos[2];

        const rawCam = camera?.camera ?? camera;
        let frustumPlanes: any = stateData?.frustumPlanes
            ?? stateData?.view?.frustumPlanes
            ?? camera?.frustumPlanes
            ?? rawCam?.frustumPlanes
            ?? null;

        if (!frustumPlanes && rawCam?.projectionMatrix && rawCam?.viewMatrix) {
            frustumPlanes = computeViewFrustumPlanes(rawCam.projectionMatrix, rawCam.viewMatrix);
        }

        let frustumPlanesF32: Float32Array | null = null;
        if (frustumPlanes) {
            if (frustumPlanes instanceof Float32Array) {
                frustumPlanesF32 = frustumPlanes;
            } else if (Array.isArray(frustumPlanes) && frustumPlanes.length === 6) {
                for (let p = 0; p < 6; p++) {
                    this.#frustumPlanesF32.set(frustumPlanes[p], p * 4);
                }
                frustumPlanesF32 = this.#frustumPlanesF32;
            }
        }

        this.#updateCellStreaming(camPos[0], camPos[1], camPos[2], frustumPlanesF32);
        this.#megaBuffer.resetIndirectDrawCountsCPU();

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const vbtAtlas = this.#landscape.getInternalAtlasTexture('vbtBaseColor');

        for (const type of this.#grassTypes) {
            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res) continue;

            const gf = res.grassUniformCPUBuffer;
            gf[0] = type.cullingDistance;
            gf[1] = type.fadeStartDistance;
            gf[2] = type.shrinkStartDistance;
            gf[3] = type.bottomOffset;
            gf[4] = type.meshHeight;
            gf[5] = type.groundBlendStrength;
            gf[6] = type.minY;
            gf[7] = 0.0;

            gpuDevice.queue.writeBuffer(
                res.grassUniformGPUBuffer,
                0,
                res.grassUniformCPUBuffer.buffer,
                0,
                res.grassUniformCPUBuffer.byteLength
            );

            const mf = res.cpuBuffer;
            const mu = res.uintBuffer;

            mf[0] = worldSizeX;
            mf[1] = worldSizeZ;
            mf[2] = type.groundBlendStrength;
            mf[3] = type.alphaCutoff;
            const hasValidVbt = !!(vbtAtlas?.gpuTexture && this.#landscape.loadedTileCount > 0);
            mu[4] = hasValidVbt ? 1 : 0;
            mf[5] = type.roughness;
            mf[6] = type.subsurfaceStrength;
            mf[7] = type.exposureBoost;

            const ssc = type.subsurfaceColor;
            mf[8] = ssc[0];
            mf[9] = ssc[1];
            mf[10] = ssc[2];
            mf[11] = type.subsurfaceDistortion;

            mf[12] = type.aoIntensity;
            mu[13] = type.receiveShadow ? 1 : 0;
            mf[14] = type.shadowStrength;
            mf[15] = 0;

            gpuDevice.queue.writeBuffer(
                res.uniformBuffer,
                0,
                res.cpuBuffer.buffer,
                0,
                res.cpuBuffer.byteLength
            );

            const lodCount = Math.min(4, type.lodCount);
            const lodDistances: [number, number, number, number] = [9999, 9999, 9999, 9999];
            for (let i = 0; i < lodCount; i++) {
                lodDistances[i] = type.lods[i].lodDistance;
            }

            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (alloc) {
                const DEG2RAD = 0.017453292519943295;
                const minSlope = type.minSlope ?? 0.0;
                const maxSlope = type.maxSlope ?? 89.0;
                const hasSlopeFilter = minSlope > 0.0 || maxSlope < 89.0;
                const minSlopeTan2 = minSlope > 0.0 ? Math.tan(minSlope * DEG2RAD) ** 2 : 0.0;
                const maxSlopeTan2 = maxSlope < 89.0 ? Math.tan(maxSlope * DEG2RAD) ** 2 : 999999.0;

                this.#megaBuffer.updateTypeParams(
                    type.typeId,
                    type.cullingDistance,
                    type.fadeStartDistance,
                    type.shrinkStartDistance,
                    type.bottomOffset,
                    type.groundBlendStrength,
                    type.meshHeight,
                    alloc.rawBaseOffset,
                    alloc.maxInstances,
                    alloc.culledBaseOffset,
                    alloc.indirectBaseOffset,
                    lodCount,
                    alloc.maxInstances,
                    lodDistances,
                    minSlopeTan2,
                    maxSlopeTan2,
                    hasSlopeFilter
                );
            }
        }

        const totalAllocated = this.#megaBuffer.totalAllocatedInstances;
        this.#culler.updateUniforms(
            camPos[0],
            camPos[1],
            camPos[2],
            frustumPlanesF32,
            totalAllocated,
            this.#grassTypes.length
        );

        this.#culler.updateBindGroup(this.#megaBuffer);

        this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
            LandscapeGrassManager.#COMPUTE_PASS_DESCRIPTOR,
            this.#onPreProcessComputePass
        );
    }

    populateInstances(centerPos: [number, number, number]): void {
        this.#lastPopulatePos[0] = centerPos[0];
        this.#lastPopulatePos[1] = centerPos[1];
        this.#lastPopulatePos[2] = centerPos[2];
        this.#updateCellStreaming(centerPos[0], centerPos[1], centerPos[2], null, true);
    }

    render(view: any, passEncoder: GPURenderPassEncoder): void {
        if (!this.#enabled || this.#grassTypes.length === 0 || !this.#populated) return;

        const view3D = view?.view || view;
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (!systemBG) return;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#pipelineBindGroupLayout1 || !this.#pipelineBindGroupLayout2) return;

        const sampleCount = view3D?.sampleCount ?? (this.#redGPUContext.antialiasingManager.useMSAA ? 4 : 1);
        const nearPipeline = this.getOrCreateRenderPipeline(sampleCount, false);
        const farPipeline = this.getOrCreateRenderPipeline(sampleCount, true);
        if (!nearPipeline || !farPipeline) return;

        const fallbackTex = this.#redGPUContext.resourceManager.emptyBitmapTextureView;
        const basicSampler = this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        let currentPipeline: GPURenderPipeline | null = nearPipeline;
        passEncoder.setPipeline(nearPipeline);
        passEncoder.setBindGroup(0, systemBG);

        const indirectGPUBuffer = this.#megaBuffer.indirectGPUBuffer;
        if (!indirectGPUBuffer) return;

        for (const type of this.#grassTypes) {
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!alloc || alloc.activeCount === 0) continue;

            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res) continue;

            // Group 1: Instances + Grass Uniform
            if (!res.instanceBindGroup && this.#megaBuffer.culledGPUBuffer && res.grassUniformGPUBuffer) {
                res.instanceBindGroup = gpuDevice.createBindGroup({
                    label: `Grass_InstanceBindGroup_${type.name}`,
                    layout: this.#pipelineBindGroupLayout1,
                    entries: [
                        {binding: 0, resource: {buffer: this.#megaBuffer.culledGPUBuffer}},
                        {binding: 1, resource: {buffer: res.grassUniformGPUBuffer}},
                    ]
                });
            }

            // Group 2: Material Textures + Uniform (Zero-VTF: 순수 FRAGMENT 바인딩)
            const rawTex = type.baseColorTexture?.gpuTexture;
            const colorTexView = (rawTex
                ? (this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(type.baseColorTexture) || rawTex.createView())
                : null) || fallbackTex;

            if (!res.bindGroup || res.cachedColorTexView !== colorTexView) {
                res.bindGroup = gpuDevice.createBindGroup({
                    label: `Grass_MaterialBindGroup_${type.name}`,
                    layout: this.#pipelineBindGroupLayout2,
                    entries: [
                        {binding: 0, resource: colorTexView},
                        {binding: 1, resource: basicSampler},
                        {binding: 2, resource: {buffer: res.uniformBuffer}},
                    ]
                });
                res.cachedColorTexView = colorTexView;
            }

            if (!res.instanceBindGroup || !res.bindGroup) continue;

            passEncoder.setBindGroup(1, res.instanceBindGroup);
            passEncoder.setBindGroup(2, res.bindGroup);

            // 각 LOD 레벨별 지오메트리 바인딩 및 인다이렉트 드로우
            for (const lodAlloc of alloc.lods) {
                const targetPipeline = lodAlloc.lodIndex === 0 ? nearPipeline : farPipeline;
                if (currentPipeline !== targetPipeline) {
                    passEncoder.setPipeline(targetPipeline);
                    currentPipeline = targetPipeline;
                }

                const lodGeom = type.getGeometryForLOD(lodAlloc.lodIndex);
                const lvb = lodGeom?.vertexBuffer;
                const lib = lodGeom?.indexBuffer;
                if (!lvb || !lib) continue;

                passEncoder.setVertexBuffer(0, lvb.gpuBuffer);
                passEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

                const indirectOffsetBytes = lodAlloc.indirectOffset * 5 * 4;
                passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
            }
        }
    }

    destroy(): void {
        this.#megaBuffer.destroy();
        this.#baker.destroy();
        this.#culler.destroy();

        for (const res of this.#typeMaterialBuffers.values()) {
            res.uniformBuffer.destroy();
            res.grassUniformGPUBuffer.destroy();
        }
        this.#typeMaterialBuffers.clear();
        this.#typeCellStates.clear();
        this.#neededCellKeysSet.clear();
        this.#keysToEvict.length = 0;
        this.#renderPipelinesNear.clear();
        this.#renderPipelinesFar.clear();
        this.#grassTypes.length = 0;
    }

    #initShadersAndLayouts(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        const resourceManager = this.#redGPUContext.resourceManager;
        if (!gpuDevice) return;

        this.#vertexModule = resourceManager.createGPUShaderModule('Grass_VertexModule', {
            code: grassVertexSource
        });

        this.#fragmentModule = resourceManager.createGPUShaderModule('Grass_FragmentModule', {
            code: grassFragmentSource
        });

        this.#fragmentFarModule = resourceManager.createGPUShaderModule('Grass_FragmentFarModule', {
            code: grassFragmentFarSource
        });

        this.#pipelineBindGroupLayout0 = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');

        this.#pipelineBindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'Grass_Pipeline_Group1_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
            ]
        });

        // Group 2: Material Textures + Uniforms (Zero-VTF: 순수 Fragment 전용)
        this.#pipelineBindGroupLayout2 = gpuDevice.createBindGroupLayout({
            label: 'Grass_Pipeline_Group2_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
            ]
        });

        this.#pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'Grass_PipelineLayout',
            bindGroupLayouts: [
                this.#pipelineBindGroupLayout0,
                this.#pipelineBindGroupLayout1,
                this.#pipelineBindGroupLayout2,
            ]
        });
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        // 1. 신규 스폰된 인스턴스가 있다면 VHT/VBT 1회성 베이킹 선행 실행 (스폰 없는 프레임에는 0회)
        if (this.#baker.hasPendingTasks) {
            const vhtAtlas = this.#landscape.getInternalAtlasTexture('vht');
            const vbtAtlas = this.#landscape.getInternalAtlasTexture('vbtBaseColor');
            const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
            this.#baker.dispatchPass(
                computePass,
                this.#megaBuffer,
                vhtAtlas?.gpuTextureView,
                this.#landscape.vhtSampler,
                vbtAtlas?.gpuTextureView,
                this.#redGPUContext.resourceManager.basicSampler.gpuSampler,
                worldSizeX,
                worldSizeZ,
                this.#landscape.heightScale
            );
        }

        // 2. 순수 ALU 초고속 프러스텀/LOD 컬링 실행 (텍스처 접근 0%)
        this.#culler.dispatchPass(computePass, this.#megaBuffer.totalAllocatedInstances);
    };

    #updateCellStreaming(
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanes: Float32Array | null = null,
        forceRebuild: boolean = false
    ): void {
        const cellSize = LandscapeGrassManager.CELL_SIZE;
        const curGridX = Math.floor(camX / cellSize);
        const curGridZ = Math.floor(camZ / cellSize);

        if (!forceRebuild && curGridX === this.#lastUpdateGridPos[0] && curGridZ === this.#lastUpdateGridPos[1]) {
            return;
        }

        this.#lastUpdateGridPos[0] = curGridX;
        this.#lastUpdateGridPos[1] = curGridZ;

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const halfWorldX = worldSizeX * 0.5;
        const halfWorldZ = worldSizeZ * 0.5;

        for (const type of this.#grassTypes) {
            const state = this.#typeCellStates.get(type.typeId);
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!state || !alloc) continue;

            if (forceRebuild) {
                state.activeCellRanges.clear();
                state.freeSlotRanges.length = 0;
                state.slotHead = 0;
                state.activeCount = 0;
                alloc.activeCount = 0;

                const baseOffset = alloc.rawBaseOffset;
                for (let i = 0; i < alloc.maxInstances; i++) {
                    this.#megaBuffer.writeInstanceData(baseOffset + i, 0.0, -999999.0, 0.0, 0.0, 0.0, 0.0);
                }
                this.#megaBuffer.uploadInstances(baseOffset, alloc.maxInstances);
            }

            const radius = Math.min(type.cullingDistance, this.#streamingRadius);
            const radiusSq = radius * radius;
            const cellRadius = Math.ceil(radius / cellSize);

            this.#neededCellKeysSet.clear();
            let candidateCount = 0;
            const maxCandidates = LandscapeGrassManager.MAX_CANDIDATE_CELLS;

            for (let dz = -cellRadius; dz <= cellRadius; dz++) {
                const cz = curGridZ + dz;
                const cellCenterZ = (cz + 0.5) * cellSize;
                if (cellCenterZ < -halfWorldZ || cellCenterZ > halfWorldZ) continue;

                const distZ = cellCenterZ - camZ;
                const distZSq = distZ * distZ;

                for (let dx = -cellRadius; dx <= cellRadius; dx++) {
                    const cx = curGridX + dx;
                    const cellCenterX = (cx + 0.5) * cellSize;
                    if (cellCenterX < -halfWorldX || cellCenterX > halfWorldX) continue;

                    const distX = cellCenterX - camX;
                    const dSq = distX * distX + distZSq;
                    if (dSq > radiusSq) continue;

                    const key = ((cx & 0xFFFF) << 16) | (cz & 0xFFFF);
                    this.#neededCellKeysSet.add(key);

                    if (!state.activeCellRanges.has(key) && candidateCount < maxCandidates) {
                        this.#candidateKeys[candidateCount] = key;
                        this.#candidateDistancesSq[candidateCount] = dSq;
                        this.#candidateIndices[candidateCount] = candidateCount;
                        candidateCount++;
                    }
                }
            }

            // 카메라 거리 기준 정렬 (Near-to-Far)
            if (candidateCount > 1) {
                const dists = this.#candidateDistancesSq;
                const indices = this.#candidateIndices;
                indices.subarray(0, candidateCount).sort((a, b) => dists[a] - dists[b]);
            }

            // 범위 벗어난 셀 퇴출
            this.#keysToEvict.length = 0;
            for (const activeKey of state.activeCellRanges.keys()) {
                if (!this.#neededCellKeysSet.has(activeKey)) {
                    this.#keysToEvict.push(activeKey);
                }
            }

            for (let i = 0; i < this.#keysToEvict.length; i++) {
                const evictKey = this.#keysToEvict[i];
                const range = state.activeCellRanges.get(evictKey)!;
                state.activeCellRanges.delete(evictKey);

                for (let s = 0; s < range.count; s++) {
                    this.#megaBuffer.writeInstanceData(
                        alloc.rawBaseOffset + range.start + s,
                        0.0, -999999.0, 0.0, 0.0, 0.0, 0.0
                    );
                }
                this.#megaBuffer.uploadInstances(alloc.rawBaseOffset + range.start, range.count);
                state.freeSlotRanges.push({start: range.start, count: range.count});
                state.activeCount -= (range.filledCount ?? range.count);
            }

            // 신규 진입 셀 스폰 (Time-sliced Budget 적용)
            const maxCellsToPopulate = forceRebuild ? candidateCount : LandscapeGrassManager.MAX_POPULATE_CELLS_PER_FRAME;
            const cellsToProcess = Math.min(candidateCount, maxCellsToPopulate);
            const targetDensity = type.instancesPerCell;
            const matchedLayer = type.targetLayer ? this.#landscape.layers.find(l => l.name === type.targetLayer || (l as any).key === type.targetLayer) : undefined;
            const targetSrc = matchedLayer?.weightTexture?.src || (matchedLayer as any)?.pendingWeightSrc || null;
            const hasWeightMap = !!(targetSrc && LandscapeWeightMapCache.has(targetSrc));
            const channelIdx = matchedLayer?.weightChannelIndex ?? 0;

            for (let i = 0; i < cellsToProcess; i++) {
                const sortedIdx = this.#candidateIndices[i];
                const key = this.#candidateKeys[sortedIdx];
                if (state.activeCellRanges.has(key)) continue;

                let slotBase = -1;
                if (state.freeSlotRanges.length > 0) {
                    const freeRange = state.freeSlotRanges.pop()!;
                    slotBase = freeRange.start;
                } else if (state.slotHead + targetDensity <= alloc.maxInstances) {
                    slotBase = state.slotHead;
                    state.slotHead += targetDensity;
                } else {
                    break;
                }

                const cellX = (key >> 16);
                const cellZ = (key << 16) >> 16;
                const cellMinX = cellX * cellSize;
                const cellMinZ = cellZ * cellSize;

                // 결정론적 고유 시드 설정
                this.#setPrngSeed((cellX * 73856093) ^ (cellZ * 19349663) ^ (type.typeId * 83492791));

                let filledCount = 0;
                for (let inst = 0; inst < targetDensity; inst++) {
                    const gx = cellMinX + this.#nextPrng() * cellSize;
                    const gz = cellMinZ + this.#nextPrng() * cellSize;

                    if (hasWeightMap && targetSrc) {
                        const u = (gx + halfWorldX) / worldSizeX;
                        const v = (gz + halfWorldZ) / worldSizeZ;
                        LandscapeWeightMapCache.getAllWeights(targetSrc, u, v, this.#tempWeights4);
                        const w = this.#tempWeights4[channelIdx] || 0.0;

                        if (w < type.minWeightThreshold) continue;
                        if (type.densityScaleByWeight && this.#nextPrng() > w) continue;
                    }

                    const rot = this.#nextPrng() * 6.2831853;
                    const sScale = type.minScale[0] + this.#nextPrng() * (type.maxScale[0] - type.minScale[0]);
                    const hScale = type.minScale[1] + this.#nextPrng() * (type.maxScale[1] - type.minScale[1]);

                    const globalInstIdx = alloc.rawBaseOffset + slotBase + filledCount;
                    this.#megaBuffer.writeInstanceData(
                        globalInstIdx,
                        gx, 0.0, gz,
                        rot, sScale, hScale
                    );
                    filledCount++;
                }

                for (let rem = filledCount; rem < targetDensity; rem++) {
                    this.#megaBuffer.writeInstanceData(
                        alloc.rawBaseOffset + slotBase + rem,
                        0.0, -999999.0, 0.0, 0.0, 0.0, 0.0
                    );
                }

                if (filledCount > 0) {
                    this.#megaBuffer.uploadInstances(alloc.rawBaseOffset + slotBase, targetDensity);
                    this.#baker.addBakeTasks(alloc.rawBaseOffset + slotBase, filledCount, type.typeId);
                    state.activeCellRanges.set(key, {start: slotBase, count: targetDensity, filledCount: filledCount});
                    state.activeCount += filledCount;
                } else {
                    this.#megaBuffer.uploadInstances(alloc.rawBaseOffset + slotBase, targetDensity);
                    state.freeSlotRanges.push({start: slotBase, count: targetDensity});
                }
            }

            alloc.activeCount = state.activeCount;
        }

        let totalPop = 0;
        for (const type of this.#grassTypes) {
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (alloc) totalPop += alloc.activeCount;
        }
        this.#totalInstancesPopulated = totalPop;
        this.#populated = totalPop > 0;
    }

    #setPrngSeed(seed: number): void {
        this.#prngState = seed >>> 0;
    }

    #nextPrng(): number {
        this.#prngState = (this.#prngState + 0x6D2B79F5) | 0;
        let t = Math.imul(this.#prngState ^ (this.#prngState >>> 15), 1 | this.#prngState);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
}

export default LandscapeGrassManager;
