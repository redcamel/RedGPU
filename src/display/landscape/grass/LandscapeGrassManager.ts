import RedGPUContext from "../../../context/RedGPUContext";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import Landscape from "../core/Landscape";
import GrassType from "./GrassType";
import GrassMegaBuffer from "./core/buffer/GrassMegaBuffer";
import GrassCuller from "./core/culling/GrassCuller";
import {GrassBaker} from "./core/baking/GrassBaker";
import computeViewFrustumPlanes from "../../../math/computeViewFrustumPlanes";
import LandscapeWeightMapCache from "../material/LandscapeWeightMapCache";
import grassVertexSource from "./shader/grassVertex.wgsl";
import grassFragmentSource from "./shader/grassFragment.wgsl";

export class LandscapeGrassManager {
    // 월드 고정형 그리드 셀 스트리밍 상태
    static readonly CELL_SIZE: number = 16.0;
    static readonly MAX_POPULATE_CELLS_PER_FRAME: number = 8; // 프레임당 최대 생성 셀 수 (Time-sliced Budget)
    static readonly #tempWeights4: Float32Array = new Float32Array(4);
    // Zero-GC 스트리밍 후보 셀 버퍼 (CPU 정렬 및 중복 프러스텀 검사 제거)
    static readonly #MAX_CANDIDATE_CELLS: number = 2048;
    static #mulberry32State: number = 0;
    static readonly #COMPUTE_PASS_DESCRIPTOR: GPUComputePassDescriptor = Object.freeze({
        label: 'Landscape_GrassGPUCulling_ComputePass'
    });
    #landscape: Landscape;
    #redGPUContext: RedGPUContext;
    #grassTypes: GrassType[] = [];
    #megaBuffer: GrassMegaBuffer;
    #baker: GrassBaker;
    #culler: GrassCuller;
    #enabled: boolean = true;
    #streamingRadius: number = 120.0;
    // 파이프라인 및 바인드 그룹 캐시
    #pipelineLayout: GPUPipelineLayout | null = null;
    #vertexModule: GPUShaderModule | null = null;
    #fragmentModule: GPUShaderModule | null = null;
    #renderPipelines: Map<number, GPURenderPipeline> = new Map();
    #pipelineBindGroupLayout0: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout1: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout2: GPUBindGroupLayout | null = null;
    #grassUniformGPUBuffer: GPUBuffer | null = null;
    #grassUniformCPUBuffer: Float32Array;
    #typeMaterialBuffers: Map<number, {
        uniformBuffer: GPUBuffer;
        cpuBuffer: Float32Array;
        uintBuffer: Uint32Array;
        bindGroup: GPUBindGroup | null;
        instanceBindGroup: GPUBindGroup | null;
        cachedColorTexView: GPUTextureView | null;
        cachedNormalTexView: GPUTextureView | null;
        cachedOrmTexView: GPUTextureView | null;
    }> = new Map();
    readonly #candidateKeys: Int32Array = new Int32Array(LandscapeGrassManager.#MAX_CANDIDATE_CELLS);
    #typeCellStates: Map<number, {
        typeId: number;
        cellSize: number;
        instancesPerCell: number;
        maxCells: number;
        activeCells: Map<number, number>;
        freeSlots: number[];
        slotKeys: number[];
    }> = new Map();
    #neededCellKeysSet: Set<number> = new Set();
    #keysToEvict: number[] = [];
    #totalInstancesPopulated: number = 0;
    #populated: boolean = false;
    #lastPopulatePos: [number, number, number] = [0, 0, 0];
    #loadingWeightSrcs: Set<string> = new Set();
    readonly #frustumPlanesF32: Float32Array = new Float32Array(24);

    constructor(landscape: Landscape) {
        this.#landscape = landscape;
        this.#redGPUContext = landscape.redGPUContext;
        this.#megaBuffer = new GrassMegaBuffer(this.#redGPUContext, 524288, 16);
        this.#baker = new GrassBaker(this.#redGPUContext);
        this.#culler = new GrassCuller(this.#redGPUContext);
        this.#megaBuffer.onRecreated = () => {
            this.#baker.invalidateBindGroup();
            this.#culler.invalidateBindGroup();
            for (const res of this.#typeMaterialBuffers.values()) {
                res.instanceBindGroup = null;
            }
        };

        // GrassUniforms (8 floats = 32 bytes)
        this.#grassUniformCPUBuffer = new Float32Array(8);

        this.#init();
    }

    get enabled(): boolean {
        return this.#enabled;
    }

    set enabled(v: boolean) {
        this.#enabled = v;
    }

    get hasGrassTypes(): boolean {
        return this.#enabled && this.#grassTypes.length > 0;
    }

    get grassTypes(): readonly GrassType[] {
        return this.#grassTypes;
    }

    get streamingRadius(): number {
        return this.#streamingRadius;
    }

    set streamingRadius(v: number) {
        this.#streamingRadius = Math.max(20.0, v);
    }

    static #encodeCellKey(cx: number, cz: number): number {
        return ((cz + 32768) << 16) | ((cx + 32768) & 0xFFFF);
    }

    static #decodeCellKeyX(key: number): number {
        return (key & 0xFFFF) - 32768;
    }

    static #decodeCellKeyZ(key: number): number {
        return (key >>> 16) - 32768;
    }

    static #setMulberry32Seed(seed: number): void {
        LandscapeGrassManager.#mulberry32State = seed >>> 0;
    }

    static #mulberry32(): number {
        LandscapeGrassManager.#mulberry32State |= 0;
        LandscapeGrassManager.#mulberry32State = (LandscapeGrassManager.#mulberry32State + 0x6D2B79F5) | 0;
        let t = Math.imul(LandscapeGrassManager.#mulberry32State ^ (LandscapeGrassManager.#mulberry32State >>> 15), 1 | LandscapeGrassManager.#mulberry32State);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    getOrCreateRenderPipeline(sampleCount: number = 1): GPURenderPipeline | null {
        let pipeline = this.#renderPipelines.get(sampleCount);
        if (pipeline) return pipeline;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#pipelineLayout || !this.#vertexModule || !this.#fragmentModule) return null;

        const preferredNormalFormat = navigator.gpu.getPreferredCanvasFormat();

        pipeline = gpuDevice.createRenderPipeline({
            label: `Grass_RenderPipeline_msaa${sampleCount}`,
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexModule,
                entryPoint: 'main',
                buffers: [
                    {
                        arrayStride: 18 * 4,
                        stepMode: 'vertex',
                        attributes: [
                            {shaderLocation: 0, offset: 0, format: 'float32x3'}, // position
                            {shaderLocation: 1, offset: 12, format: 'float32x3'}, // normal
                            {shaderLocation: 2, offset: 24, format: 'float32x2'}, // uv
                        ]
                    }
                ]
            },
            fragment: {
                module: this.#fragmentModule,
                entryPoint: 'main',
                targets: [
                    {
                        format: 'rgba16float', // GBuffer 0: Color
                    },
                    {
                        format: preferredNormalFormat, // GBuffer 1: Normal
                    },
                    {
                        format: 'rgba16float', // GBuffer 2: Motion Vector
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none', // Two-sided grass quads
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

        this.#renderPipelines.set(sampleCount, pipeline);
        return pipeline;
    }

    addGrassType(grassType: GrassType): GrassType {
        const typeId = this.#grassTypes.length;
        grassType.typeId = typeId;
        this.#grassTypes.push(grassType);

        const geom = grassType.geometry;
        const indexCount = geom.indexBuffer?.indexCount ?? 0;

        // 월드 그리드 셀 파라미터 산출 (16m 셀)
        const cellSize = LandscapeGrassManager.CELL_SIZE;
        const maxCells = 144; // 12x12 셀 슬롯 링 버퍼
        const cellAreaHectares = (cellSize * cellSize) / 10000.0;
        const instancesPerCell = Math.max(16, Math.round(grassType.densityPerHectare * grassType.densityMultiplier * cellAreaHectares));
        // 런타임 densityMultiplier 상향 조절(최대 3배)을 수용할 수 있는 안전 버퍼 헤드룸 확보
        const maxInstances = maxCells * instancesPerCell * 3;

        const lodConfigs = grassType.lods.map(lod => {
            const ib = lod.geometry?.indexBuffer;
            return {
                lodIndex: lod.lodIndex,
                lodDistance: lod.lodDistance,
                indexCount: ib ? ib.indexCount : 0,
                firstIndex: 0,
                baseVertex: 0
            };
        });

        const alloc = this.#megaBuffer.allocateType(typeId, grassType.name, maxInstances, lodConfigs);

        // 초기 슬롯 인스턴스들을 모두 y = -999999.0로 무효화 (영구 기각)
        const baseOffset = alloc.rawBaseOffset;
        for (let i = 0; i < maxInstances; i++) {
            this.#megaBuffer.writeInstanceData(baseOffset + i, 0, -999999.0, 0, 0, 0, 0);
        }
        this.#megaBuffer.uploadInstances(baseOffset, maxInstances);
        alloc.activeCount = maxInstances;

        const lodCount = Math.min(4, grassType.lodCount);
        const lodDistances: [number, number, number, number] = [9999, 9999, 9999, 9999];
        for (let i = 0; i < lodCount; i++) {
            lodDistances[i] = grassType.lods[i].lodDistance;
        }

        this.#megaBuffer.updateTypeParams(
            typeId,
            grassType.cullingDistance,
            grassType.fadeStartDistance,
            grassType.shrinkStartDistance,
            grassType.bottomOffset,
            grassType.groundBlendStrength,
            grassType.meshHeight,
            alloc.rawBaseOffset,
            alloc.activeCount,
            alloc.culledBaseOffset,
            alloc.indirectBaseOffset,
            lodCount,
            alloc.maxInstances,
            lodDistances
        );

        // 셀 스트리밍 상태 초기화
        const freeSlots = new Array(maxCells);
        for (let s = 0; s < maxCells; s++) {
            freeSlots[s] = s;
        }

        this.#typeCellStates.set(typeId, {
            typeId,
            cellSize,
            instancesPerCell,
            maxCells,
            activeCells: new Map(),
            freeSlots,
            slotKeys: new Array(maxCells).fill(-1)
        });

        this.#createTypeMaterialResources(grassType);
        this.#culler.invalidateBindGroup();
        this.#populated = false;

        grassType.onChanged = () => {
            this.#recalcTypeCellParameters(grassType);
            if (this.#populated) {
                this.populateInstances(this.#lastPopulatePos);
            }
        };

        // 타겟 레이어의 스플랫맵 비동기 디코딩 완료 시 자동 무결점 재배치 (단일화 디바운스 적용)
        if (grassType.targetLayer !== undefined && grassType.targetLayer !== '' && this.#landscape.layers) {
            const layerObj = typeof grassType.targetLayer === 'string'
                ? this.#landscape.layers.find(l => l.name === grassType.targetLayer)
                : this.#landscape.layers[grassType.targetLayer];
            const src = layerObj?.weightTexture?.src;
            if (src && !LandscapeWeightMapCache.has(src) && !this.#loadingWeightSrcs.has(src)) {
                this.#loadingWeightSrcs.add(src);
                LandscapeWeightMapCache.load(src).then(() => {
                    this.#loadingWeightSrcs.delete(src);
                    this.populateInstances(this.#lastPopulatePos);
                });
            }
        }

        return grassType;
    }

    populateInstances(centerPos: [number, number, number]): void {
        this.#lastPopulatePos[0] = centerPos[0];
        this.#lastPopulatePos[1] = centerPos[1];
        this.#lastPopulatePos[2] = centerPos[2];
        this.#updateCellStreaming(centerPos[0], centerPos[1], centerPos[2], null, true);
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

        // Frustum Planes 계산 (GPU Culler 및 그리드 셀 스트리밍 우선순위 큐 공용)
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

        // 점진적 월드 그리드 셀 스트리밍 갱신 (화면 내 Frustum + 근거리 Near-to-Far 최우선 정렬)
        this.#updateCellStreaming(camPos[0], camPos[1], camPos[2], frustumPlanesF32);

        // 매 프레임 GPU 인다이렉트 드로우 버퍼의 instanceCount를 0으로 리셋
        this.#megaBuffer.resetIndirectDrawCountsCPU();

        // 유니폼 데이터 업데이트
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#grassUniformGPUBuffer) return;

        const activeType = this.#grassTypes[0];
        const f32 = this.#grassUniformCPUBuffer;

        f32[0] = activeType.cullingDistance;
        f32[1] = activeType.fadeStartDistance;
        f32[2] = activeType.shrinkStartDistance;
        f32[3] = activeType.bottomOffset;
        f32[4] = activeType.meshHeight;
        f32[5] = activeType.groundBlendStrength;
        f32[6] = activeType.minY;
        f32[7] = 0.0;

        gpuDevice.queue.writeBuffer(
            this.#grassUniformGPUBuffer,
            0,
            this.#grassUniformCPUBuffer.buffer,
            0,
            this.#grassUniformCPUBuffer.byteLength
        );

        // 지형 텍스처 및 머티리얼 유니폼 갱신
        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const vbtAtlas = this.#landscape.getInternalAtlasTexture('vbtBaseColor');

        for (const type of this.#grassTypes) {
            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res) continue;

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

            // 🌿 Two-Sided Foliage Subsurface Translucency (offset 32: 16-byte aligned)
            const ssc = type.subsurfaceColor;
            mf[8] = ssc[0];
            mf[9] = ssc[1];
            mf[10] = ssc[2];
            mf[11] = type.subsurfaceDistortion;

            // 🌿 Normal Texture & ORM PBR Parameters (offset 48)
            mu[12] = type.normalTexture?.gpuTexture ? 1 : 0;
            mu[13] = type.ormTexture?.gpuTexture ? 1 : 0;
            mf[14] = type.normalScale;
            mf[15] = type.aoIntensity;

            // 🌿 Receive Shadow Parameters (offset 64)
            mu[16] = type.receiveShadow ? 1 : 0;
            mf[17] = type.shadowStrength;
            mf[18] = 0;
            mf[19] = 0;

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
                    alloc.activeCount,
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

        // GPU Culler 유니폼 및 바인드 그룹 갱신 (순수 ALU 컬링 - VHT 100% 미사용)
        this.#culler.updateUniforms(
            camPos[0],
            camPos[1],
            camPos[2],
            frustumPlanesF32,
            this.#totalInstancesPopulated,
            this.#grassTypes.length
        );

        this.#culler.updateBindGroup(this.#megaBuffer);

        this.#redGPUContext.commandEncoderManager.addPreProcessComputePass(
            LandscapeGrassManager.#COMPUTE_PASS_DESCRIPTOR,
            this.#onPreProcessComputePass
        );
    }

    render(view: any, passEncoder: GPURenderPassEncoder): void {
        if (!this.#enabled || this.#grassTypes.length === 0 || !this.#populated) return;

        const view3D = view?.view || view;
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup;
        if (!systemBG) return;

        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice || !this.#pipelineBindGroupLayout1 || !this.#pipelineBindGroupLayout2) return;

        const sampleCount = view3D?.sampleCount ?? (this.#redGPUContext.antialiasingManager.useMSAA ? 4 : 1);
        const pipeline = this.getOrCreateRenderPipeline(sampleCount);
        if (!pipeline) return;

        const fallbackTex = this.#redGPUContext.resourceManager.emptyBitmapTextureView;
        const basicSampler = this.#redGPUContext.resourceManager.basicSampler.gpuSampler;

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, systemBG);

        const indirectGPUBuffer = this.#megaBuffer.indirectGPUBuffer;
        if (!indirectGPUBuffer) return;

        for (const type of this.#grassTypes) {
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!alloc || alloc.activeCount === 0) continue;

            const res = this.#typeMaterialBuffers.get(type.typeId);
            if (!res) continue;

            // Group 1: Instances + Grass Uniform
            if (!res.instanceBindGroup && this.#megaBuffer.culledGPUBuffer && this.#grassUniformGPUBuffer) {
                res.instanceBindGroup = gpuDevice.createBindGroup({
                    label: `Grass_InstanceBindGroup_${type.name}`,
                    layout: this.#pipelineBindGroupLayout1,
                    entries: [
                        {binding: 0, resource: {buffer: this.#megaBuffer.culledGPUBuffer}},
                        {binding: 1, resource: {buffer: this.#grassUniformGPUBuffer}},
                    ]
                });
            }

            // Group 2: Material Textures + Uniform (Zero-VTF: 순수 FRAGMENT 바인딩)
            const rawTex = type.baseColorTexture?.gpuTexture;
            const colorTexView = (rawTex
                ? (this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(type.baseColorTexture) || rawTex.createView())
                : null) || fallbackTex;

            const normalRawTex = type.normalTexture?.gpuTexture;
            const normalTexView = (normalRawTex
                ? (this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(type.normalTexture) || normalRawTex.createView())
                : null) || fallbackTex;

            const ormRawTex = type.ormTexture?.gpuTexture;
            const ormTexView = (ormRawTex
                ? (this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(type.ormTexture) || ormRawTex.createView())
                : null) || fallbackTex;

            if (
                !res.bindGroup ||
                res.cachedColorTexView !== colorTexView ||
                res.cachedNormalTexView !== normalTexView ||
                res.cachedOrmTexView !== ormTexView
            ) {
                res.bindGroup = gpuDevice.createBindGroup({
                    label: `Grass_MaterialBindGroup_${type.name}`,
                    layout: this.#pipelineBindGroupLayout2,
                    entries: [
                        {binding: 0, resource: colorTexView},
                        {binding: 1, resource: basicSampler},
                        {binding: 2, resource: {buffer: res.uniformBuffer}},
                        {binding: 3, resource: normalTexView},
                        {binding: 4, resource: basicSampler},
                        {binding: 5, resource: ormTexView},
                        {binding: 6, resource: basicSampler},
                    ]
                });
                res.cachedColorTexView = colorTexView;
                res.cachedNormalTexView = normalTexView;
                res.cachedOrmTexView = ormTexView;
            }

            if (!res.instanceBindGroup || !res.bindGroup) continue;

            passEncoder.setBindGroup(1, res.instanceBindGroup);
            passEncoder.setBindGroup(2, res.bindGroup);

            // 🌿 각 LOD 레벨별 지오메트리 바인딩 및 인다이렉트 드로우
            for (const lodAlloc of alloc.lods) {
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
        this.#grassUniformGPUBuffer?.destroy();
        this.#grassUniformGPUBuffer = null;

        for (const res of this.#typeMaterialBuffers.values()) {
            res.uniformBuffer.destroy();
        }
        this.#typeMaterialBuffers.clear();
        this.#typeCellStates.clear();
        this.#neededCellKeysSet.clear();
        this.#keysToEvict.length = 0;
        this.#renderPipelines.clear();
        this.#grassTypes.length = 0;
    }

    #onPreProcessComputePass = (computePass: GPUComputePassEncoder): void => {
        if (!this.#enabled || !this.#populated || this.#grassTypes.length === 0 || this.#totalInstancesPopulated === 0) {
            return;
        }

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

        // 2. 순수 ALU 초고속 프러스텀/LOD 컬링 실행 (VHT 바인딩 0%)
        this.#culler.dispatchPass(computePass, this.#totalInstancesPopulated);
    };

    #init(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#grassUniformGPUBuffer = gpuDevice.createBuffer({
            label: 'GrassManager_GrassUniformBuffer',
            size: this.#grassUniformCPUBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#initPipelines();
    }

    #initPipelines(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const resourceManager = this.#redGPUContext.resourceManager;
        this.#vertexModule = resourceManager.createGPUShaderModule('LandscapeGrassVertexShader', {
            code: grassVertexSource
        });
        this.#fragmentModule = resourceManager.createGPUShaderModule('LandscapeGrassFragmentShader', {
            code: grassFragmentSource
        });

        // Group 0: System Uniform
        this.#pipelineBindGroupLayout0 = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);

        // Group 1: Grass Instances (Storage) + Grass Uniforms (Uniform)
        this.#pipelineBindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'Grass_Pipeline_Group1_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
            ]
        });

        // Group 2: Material Textures + Material Uniforms (Zero-VTF: 순수 FRAGMENT 전용)
        this.#pipelineBindGroupLayout2 = gpuDevice.createBindGroupLayout({
            label: 'Grass_Pipeline_Group2_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
                {binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 4, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 5, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 6, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
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

    #recalcTypeCellParameters(grassType: GrassType): void {
        const state = this.#typeCellStates.get(grassType.typeId);
        const alloc = this.#megaBuffer.getAllocation(grassType.typeId);
        if (!state || !alloc) return;

        const cellSize = state.cellSize;
        const cellAreaHectares = (cellSize * cellSize) / 10000.0;
        const targetInstances = Math.max(16, Math.round(grassType.densityPerHectare * grassType.densityMultiplier * cellAreaHectares));
        // maxInstances 버퍼 한도 내에서 클램핑하여 버퍼 오버플로우 방지
        const maxInstancesPerCell = Math.floor(alloc.maxInstances / state.maxCells);
        state.instancesPerCell = Math.min(targetInstances, maxInstancesPerCell);
    }

    #getLayerWeight(targetLayer: any, u: number, v: number): number {
        const layers = this.#landscape.layers;
        if (!layers || layers.length <= 1) {
            return targetLayer.getWeightAtUV(u, v);
        }

        const targetSrc = targetLayer.weightTexture?.src;
        if (!targetSrc) {
            return targetLayer.getWeightAtUV(u, v);
        }

        // 지형의 모든 레이어가 동일한 weightTexture를 공유하는지 빠른 체크
        let allShareSameTexture = true;
        for (let i = 0; i < layers.length; i++) {
            const l = layers[i];
            if (l.enabled && l.weightTexture?.src && l.weightTexture.src !== targetSrc) {
                allShareSameTexture = false;
                break;
            }
        }

        if (allShareSameTexture) {
            // 4-Tap Bilinear 1회 패스로 4채널 동시 추출 (4배 연산 단축)
            LandscapeWeightMapCache.getAllWeights(targetSrc, u, v, LandscapeGrassManager.#tempWeights4);
            let totalWeight = 0.0;
            let targetWeight = 0.0;
            let activeWeightCount = 0;

            for (let i = 0; i < layers.length; i++) {
                const layer = layers[i];
                if (!layer.enabled) continue;
                const ch = layer.weightChannelIndex;
                const w = LandscapeGrassManager.#tempWeights4[ch] || 0.0;
                totalWeight += w;
                activeWeightCount++;
                if (layer === targetLayer) {
                    targetWeight = w;
                }
            }

            if (activeWeightCount <= 1 || totalWeight <= 0.001) {
                return targetWeight;
            }
            return targetWeight / totalWeight;
        }

        // 서로 다른 스플랫맵 텍스처인 경우 fallback
        let activeWeightLayerCount = 0;
        let totalWeight = 0.0;
        let targetWeight = 0.0;

        for (let i = 0; i < layers.length; i++) {
            const layer = layers[i];
            if (!layer.enabled) continue;
            if (layer.weightTexture?.src) {
                activeWeightLayerCount++;
            }
            const w = layer.getWeightAtUV(u, v);
            totalWeight += w;
            if (layer === targetLayer) {
                targetWeight = w;
            }
        }

        if (activeWeightLayerCount <= 1 || totalWeight <= 0.001) {
            return targetWeight;
        }

        return targetWeight / totalWeight;
    }

    #createTypeMaterialResources(grassType: GrassType): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        // Material Uniform (20 floats = 80 bytes, 16-byte aligned)
        const cpuBuffer = new Float32Array(20);
        const uintBuffer = new Uint32Array(cpuBuffer.buffer);

        const uniformBuffer = gpuDevice.createBuffer({
            label: `Grass_MaterialUniform_${grassType.name}`,
            size: cpuBuffer.byteLength,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#typeMaterialBuffers.set(grassType.typeId, {
            uniformBuffer,
            cpuBuffer,
            uintBuffer,
            bindGroup: null,
            instanceBindGroup: null,
            cachedColorTexView: null,
            cachedNormalTexView: null,
            cachedOrmTexView: null
        });
    }

    #updateCellStreaming(
        camX: number,
        camY: number,
        camZ: number,
        frustumPlanesF32: Float32Array | null,
        forceRebuild: boolean = false
    ): void {
        if (this.#grassTypes.length === 0) return;

        const [worldSizeX, worldSizeZ] = this.#landscape.worldSize;
        const halfWX = worldSizeX * 0.5;
        const halfWZ = worldSizeZ * 0.5;
        const radius = this.#streamingRadius;
        const radiusSq = radius * radius;

        let totalActiveInstances = 0;

        for (const type of this.#grassTypes) {
            const state = this.#typeCellStates.get(type.typeId);
            const alloc = this.#megaBuffer.getAllocation(type.typeId);
            if (!state || !alloc) continue;

            const cellSize = state.cellSize;
            const instancesPerCell = state.instancesPerCell;
            const baseOffset = alloc.rawBaseOffset;

            if (forceRebuild) {
                state.activeCells.clear();
                state.freeSlots.length = 0;
                for (let s = 0; s < state.maxCells; s++) {
                    state.freeSlots.push(s);
                    state.slotKeys[s] = -1;
                }
            }

            const centerCX = Math.floor(camX / cellSize);
            const centerCZ = Math.floor(camZ / cellSize);
            const cellR = Math.ceil(radius / cellSize);

            // 1. 필요한 셀 목록 수집 (반경 거리 체크만 수행, CPU 프러스텀 검사 및 퀵소트 완전 배제)
            this.#neededCellKeysSet.clear();
            let candidateCount = 0;
            const maxCandidates = LandscapeGrassManager.#MAX_CANDIDATE_CELLS;

            for (let cz = centerCZ - cellR; cz <= centerCZ + cellR; cz++) {
                for (let cx = centerCX - cellR; cx <= centerCX + cellR; cx++) {
                    const cellCenterX = (cx + 0.5) * cellSize;
                    const cellCenterZ = (cz + 0.5) * cellSize;
                    const dx = cellCenterX - camX;
                    const dz = cellCenterZ - camZ;
                    const distSq = dx * dx + dz * dz;

                    if (distSq <= radiusSq) {
                        if (cellCenterX >= -halfWX && cellCenterX <= halfWX && cellCenterZ >= -halfWZ && cellCenterZ <= halfWZ) {
                            const key = LandscapeGrassManager.#encodeCellKey(cx, cz);
                            this.#neededCellKeysSet.add(key);

                            // 아직 생성되지 않은 신규 진입 셀만 등록 (정렬 없이 순차 생성)
                            if (!state.activeCells.has(key) && candidateCount < maxCandidates) {
                                this.#candidateKeys[candidateCount++] = key;
                            }
                        }
                    }
                }
            }

            // 2. 범위를 벗어난 셀 해제 (Evict)
            this.#keysToEvict.length = 0;
            for (const key of state.activeCells.keys()) {
                if (!this.#neededCellKeysSet.has(key)) {
                    this.#keysToEvict.push(key);
                }
            }

            for (let e = 0; e < this.#keysToEvict.length; e++) {
                const key = this.#keysToEvict[e];
                const slot = state.activeCells.get(key)!;
                state.activeCells.delete(key);
                state.freeSlots.push(slot);
                state.slotKeys[slot] = -1;

                // 비워진 슬롯의 인스턴스를 무효화(y = -999999.0)하여 컬링에서 즉시 배제
                const slotBase = baseOffset + slot * instancesPerCell;
                for (let k = 0; k < instancesPerCell; k++) {
                    this.#megaBuffer.writeInstanceData(slotBase + k, 0, -999999.0, 0, 0, 0, 0);
                }
                this.#megaBuffer.uploadInstances(slotBase, instancesPerCell);
            }

            // 3. 새로 진입한 셀 인스턴스 생성 (정렬 불필요: 반경 내 셀 순차 스트리밍)
            const maxCellsToPopulate = forceRebuild ? 999999 : LandscapeGrassManager.MAX_POPULATE_CELLS_PER_FRAME;
            let cellsPopulatedThisFrame = 0;

            const [minSX, minSY, minSZ] = type.minScale;
            const [maxSX, maxSY, maxSZ] = type.maxScale;

            for (let i = 0; i < candidateCount; i++) {
                const key = this.#candidateKeys[i];

                if (state.activeCells.has(key)) continue;
                if (state.freeSlots.length === 0) break;
                if (cellsPopulatedThisFrame >= maxCellsToPopulate) break;

                const slot = state.freeSlots.pop()!;
                state.activeCells.set(key, slot);
                state.slotKeys[slot] = key;
                cellsPopulatedThisFrame++;

                const cellX = LandscapeGrassManager.#decodeCellKeyX(key);
                const cellZ = LandscapeGrassManager.#decodeCellKeyZ(key);

                const cellMinX = cellX * cellSize;
                const cellMinZ = cellZ * cellSize;

                // 결정론적 의사난수 시드
                const seed = ((cellX * 73856093) ^ (cellZ * 19349663) ^ (type.typeId * 83492791)) >>> 0;
                LandscapeGrassManager.#setMulberry32Seed(seed);

                const slotBase = baseOffset + slot * instancesPerCell;

                // 타겟 레이어 객체 및 스플랫맵/경사도 필터 설정
                const hasTargetLayer = type.targetLayer !== undefined && type.targetLayer !== '';
                let targetLayerObj: any = null;
                if (hasTargetLayer && this.#landscape.layers) {
                    if (typeof type.targetLayer === 'string') {
                        targetLayerObj = this.#landscape.layers.find(l => l.name === type.targetLayer);
                    } else if (typeof type.targetLayer === 'number') {
                        targetLayerObj = this.#landscape.layers[type.targetLayer];
                    }
                }

                // 타깃 레이어가 지정되었으나 레이어를 찾지 못한 경우 안전 차단 (Fail-Close)
                if (hasTargetLayer && !targetLayerObj) {
                    for (let k = 0; k < instancesPerCell; k++) {
                        this.#megaBuffer.writeInstanceData(slotBase + k, 0, -999999.0, 0, 0, 0, 0);
                    }
                    this.#megaBuffer.uploadInstances(slotBase, instancesPerCell);
                    continue;
                }

                const minWeight = type.minWeightThreshold;
                const densityScale = type.densityScaleByWeight;

                // 언리얼 규격: densityScaleByWeight: true 이면 가중치에 정비례하도록 시도 횟수를 instancesPerCell로 1:1 고정
                // densityScaleByWeight: false 이면 유효 영역에 균일 밀도를 채우기 위해 여유 시도 허용
                const maxAttempts = densityScale ? instancesPerCell : (targetLayerObj ? instancesPerCell * 2 : instancesPerCell);

                let filledCount = 0;
                for (let attempt = 0; attempt < maxAttempts && filledCount < instancesPerCell; attempt++) {
                    const gx = cellMinX + LandscapeGrassManager.#mulberry32() * cellSize;
                    const gz = cellMinZ + LandscapeGrassManager.#mulberry32() * cellSize;

                    // 1. 지형 스플랫맵 레이어 가중치 검사 (언리얼식 Rejection Sampling)
                    if (targetLayerObj) {
                        const weightSrc = targetLayerObj.weightTexture?.src;
                        if (weightSrc && !LandscapeWeightMapCache.has(weightSrc)) {
                            // 스플랫맵 캐시 디코딩 대기: 중복 방지 디바운스 적용
                            if (!this.#loadingWeightSrcs.has(weightSrc)) {
                                this.#loadingWeightSrcs.add(weightSrc);
                                LandscapeWeightMapCache.load(weightSrc).then(() => {
                                    this.#loadingWeightSrcs.delete(weightSrc);
                                    this.populateInstances(this.#lastPopulatePos);
                                });
                            }
                            break;
                        }

                        const u = (gx + halfWX) / worldSizeX;
                        const v = (gz + halfWZ) / worldSizeZ;
                        const weight = this.#getLayerWeight(targetLayerObj, u, v);
                        if (weight < minWeight) continue;
                        if (densityScale) {
                            const rReject = LandscapeGrassManager.#mulberry32();
                            if (rReject > weight) continue;
                        }
                    }

                    // 2. 지형 높이 및 법선은 GPU 1회성 인플레이스 베이크(Self-Baking)로 연동 (신규 스폰 플래그 posY = -99999.0)
                    const rot = LandscapeGrassManager.#mulberry32() * 6.2831853;
                    const sRatio = LandscapeGrassManager.#mulberry32();
                    const sXZ = minSX + (maxSX - minSX) * sRatio;
                    const sY = minSY + (maxSY - minSY) * sRatio;

                    this.#megaBuffer.writeInstanceData(slotBase + filledCount, gx, -99999.0, gz, rot, sXZ, sY);
                    filledCount++;
                }

                // 기각된 나머지 슬롯은 무효화 (Y = -999999.0)하여 GPU 컬링에서 0 cycle 즉시 배제
                for (let k = filledCount; k < instancesPerCell; k++) {
                    this.#megaBuffer.writeInstanceData(slotBase + k, 0, -999999.0, 0, 0, 0, 0);
                }

                this.#megaBuffer.uploadInstances(slotBase, instancesPerCell);

                // 새로 채워진 유효 인스턴스에 대해서만 1회성 GPU 지형 베이크 태스크 등록
                if (filledCount > 0) {
                    this.#baker.addBakeTasks(slotBase, filledCount, type.typeId);
                }
            }

            totalActiveInstances += alloc.activeCount;
        }

        this.#totalInstancesPopulated = totalActiveInstances;
        this.#populated = true;
    }
}

export default LandscapeGrassManager;
