import RedGPUContext from '../../../context/RedGPUContext';
import ResourceManager from '../../../resources/core/resourceManager/ResourceManager';
import Landscape from '../core/Landscape';
import {FoliageSubMesh, FoliageType, FoliageTypeOptions} from './FoliageType';

import foliageCullingComputeWGSL from './shader/foliageCullingCompute.wgsl';
import foliageInstancedWGSL from './shader/foliageInstanced.wgsl';
import computeViewFrustumPlanes from '../../../math/computeViewFrustumPlanes';

/**
 * LandscapeFoliageManager
 * Landscape 지형 엔진 연동 및 수십만 개 식생 인스턴스 렌더링 총괄 매니저
 * (WebGPU Compute Shader 기반 GPU Frustum & Distance Culling 및 Multi-Submesh Indirect Drawing 적용)
 */
export class LandscapeFoliageManager {
    readonly landscape: Landscape;
    readonly redGPUContext: RedGPUContext;

    #vertexShaderModule: GPUShaderModule | null = null;
    #cullingComputePipeline: GPUComputePipeline | null = null;
    #cullingBindGroupLayout: GPUBindGroupLayout | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;
    #emptyBindGroupLayout: GPUBindGroupLayout | null = null;
    #emptyBindGroup: GPUBindGroup | null = null;
    #foliageTypes: Map<string, FoliageType> = new Map();
    #typeList: FoliageType[] = [];
    #pipelineCache: Map<string, GPURenderPipeline> = new Map();
    #transparentEntries: any[] = [];


    get hasFoliageTypes(): boolean {
        return this.#typeList.length > 0;
    }

    constructor(landscape: Landscape) {
        this.landscape = landscape;
        this.redGPUContext = landscape.redGPUContext;

        const gpuDevice = this.redGPUContext.gpuDevice;
        if (gpuDevice) {
            this.#emptyBindGroupLayout = gpuDevice.createBindGroupLayout({
                label: 'EmptyFoliageBindGroupLayout',
                entries: []
            });
            this.#emptyBindGroup = gpuDevice.createBindGroup({
                label: 'EmptyFoliageBindGroup',
                layout: this.#emptyBindGroupLayout,
                entries: []
            });
            this.#subMeshVertexBindGroupLayout = gpuDevice.createBindGroupLayout({
                label: 'FoliageSubMesh_VertexBindGroupLayout',
                entries: [
                    {
                        binding: 0,
                        visibility: GPUShaderStage.VERTEX,
                        buffer: {type: 'uniform'}
                    }
                ]
            });
        }

        this.#initVertexShader();
        this.#initCullingComputePipeline();

        if (landscape?.tileStreamer) {
            landscape.tileStreamer.onTileLoaded = (comp: any) => {
                this.onTileLoaded(comp);
            };
        }
    }

    /**
     * [KO] 지형 타일(LandscapeComponent) 로딩 완수 시 해당 타일 영역 식생만 자동 부분 업로드합니다.
     */
    onTileLoaded(comp: any): void {
        const typeList = this.#typeList;
        const count = typeList.length;
        for (let i = 0; i < count; i++) {
            typeList[i].populateTile(comp);
        }
    }

    /**
     * 렌더 패스 엔코더에 인스턴스드 드로우콜 바인딩 및 디스패치 (Multi-Submesh 공유 인스턴스 버퍼 기반 Indirect Draw)
     */
    render(view: any, passEncoder: GPURenderPassEncoder): void {
        const typeList = this.#typeList;
        const typeCount = typeList.length;
        if (!passEncoder || typeCount === 0) return;

        // RedGPU 정석 View3D & System Uniform BindGroup 및 AntialiasingManager 추출
        const view3D = view?.view || view;
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup || (this.redGPUContext as any)?.systemUniform_Vertex_UniformBindGroup;

        const antialiasingManager = view3D?.antialiasingManager || (this.redGPUContext as any)?.antialiasingManager;
        const useMSAA = antialiasingManager?.useMSAA ?? true;
        const msaaID = antialiasingManager?.msaaID ?? 'default_msaa_id';
        const sampleCount = useMSAA ? 4 : 1;

        // 카메라 위치 정보 (Transparent 거리 정렬용)
        const rawCamera = view3D?.rawCamera || view3D?.camera || view;
        const camX = rawCamera?.x ?? 0;
        const camY = rawCamera?.y ?? 0;
        const camZ = rawCamera?.z ?? 0;

        // 🌟 1단계: 모든 FoliageType의 Basic / Opaque / MASK 서브메시지 렌더링 (Depth 선점)
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            passEncoder.setVertexBuffer(1, culledGPU);

            for (let s = 0; s < subCount; s++) {
                const mat = subMeshes[s].material;
                const isTransparent = !!mat.transparent || !!mat.use2PathRender;
                const isAlpha = (mat.alphaBlend === 2 || (mat.opacity !== undefined && mat.opacity < 1.0)) && !isTransparent;
                if (!isTransparent && !isAlpha) {
                    this.#drawSubMesh(passEncoder, subMeshes[s], s, sampleCount, msaaID, systemBG, indirectGPU);
                }
            }
        }

        // 🌟 2단계: 모든 FoliageType의 Alpha Layer 서브메시지 렌더링 (Transparent 이전)
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            passEncoder.setVertexBuffer(1, culledGPU);

            for (let s = 0; s < subCount; s++) {
                const mat = subMeshes[s].material;
                const isTransparent = !!mat.transparent || !!mat.use2PathRender;
                const isAlpha = (mat.alphaBlend === 2 || (mat.opacity !== undefined && mat.opacity < 1.0)) && !isTransparent;
                if (isAlpha) {
                    this.#drawSubMesh(passEncoder, subMeshes[s], s, sampleCount, msaaID, systemBG, indirectGPU);
                }
            }
        }

        // 🌟 3단계: Transparent Layer / 2Path Layer (카메라 거리 기준 Back-to-Front 정렬 후 렌더링)
        let transCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                const mat = sub.material;
                const isTransparent = !!mat.transparent || !!mat.use2PathRender;
                if (isTransparent) {
                    let entry = this.#transparentEntries[transCount];
                    if (!entry) {
                        entry = {subMesh: sub, subIndex: s, culledGPU, indirectGPU, distanceSq: 0};
                        this.#transparentEntries[transCount] = entry;
                    } else {
                        entry.subMesh = sub;
                        entry.subIndex = s;
                        entry.culledGPU = culledGPU;
                        entry.indirectGPU = indirectGPU;
                    }

                    // 카메라 중심과의 상대 거리 계산 (Back-to-Front 정렬용)
                    const meshNode = sub.mesh;
                    const dx = (meshNode?.x ?? 0) - camX;
                    const dy = (meshNode?.y ?? 0) - camY;
                    const dz = (meshNode?.z ?? 0) - camZ;
                    entry.distanceSq = dx * dx + dy * dy + dz * dz;

                    transCount++;
                }
            }
        }

        if (transCount > 0) {
            // sortTransparentObjects 알고리즘: 원근 거리 내림차순(먼 순서) 정렬
            const validEntries = this.#transparentEntries.slice(0, transCount);
            validEntries.sort((a, b) => b.distanceSq - a.distanceSq);

            let currentCulledGPU: GPUBuffer | null = null;
            for (let i = 0; i < transCount; i++) {
                const item = validEntries[i];
                if (currentCulledGPU !== item.culledGPU) {
                    passEncoder.setVertexBuffer(1, item.culledGPU);
                    currentCulledGPU = item.culledGPU;
                }
                this.#drawSubMesh(passEncoder, item.subMesh, item.subIndex, sampleCount, msaaID, systemBG, item.indirectGPU);
            }
        }
    }


    addFoliageType(options: FoliageTypeOptions): FoliageType {


        if (this.#foliageTypes.has(options.name)) {
            console.warn(`[LandscapeFoliageManager] FoliageType with name '${options.name}' already exists.`);
            return this.#foliageTypes.get(options.name)!;
        }

        const foliageType = new FoliageType(this.redGPUContext, options);
        foliageType.foliageManager = this;
        this.#foliageTypes.set(options.name, foliageType);
        this.#typeList.push(foliageType);

        // 🌟 핵심 해결: glTF 비동기 로딩 등으로 뒤늦게 등록되었을 때,
        // 이미 생성되어 있는 모든 지형 타일(flatCells)에 식생을 즉시 자동 파퓰레이션!
        const spatialGrid = this.landscape?.spatialGrid;
        if (spatialGrid && spatialGrid.flatCells.length > 0) {
            const cells = spatialGrid.flatCells;
            const count = cells.length;
            for (let i = 0; i < count; i++) {
                foliageType.populateTile(cells[i]);
            }
        }

        return foliageType;
    }


    #drawSubMesh(
        passEncoder: GPURenderPassEncoder,
        sub: FoliageSubMesh,
        subIndex: number,
        sampleCount: number,
        msaaID: string,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer
    ) {
        const vertexGPUBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const material = sub.material;
        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }

        const cullMode = material.doubleSided ? 'none' : (material.cullMode ?? 'none');
        const pipeline = this.#getOrCreatePipeline(material, sampleCount, msaaID, sub.strideBytes, cullMode);
        if (!pipeline) return;


        passEncoder.setPipeline(pipeline);

        if (systemBG) {
            passEncoder.setBindGroup(0, systemBG);
        }

        // Group 1: 서브메시의 상대 변환 행렬 및 globalFragmentSlotIndex 유니폼 바인드그룹
        const vertexUniformBG = sub.vertexUniformBindGroup || this.#emptyBindGroup;
        if (vertexUniformBG) {
            passEncoder.setBindGroup(1, vertexUniformBG);
        }

        // Group 2: 서브메시 머티리얼 프래그먼트 유니폼 바인드그룹
        const matUniformBG = material.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG) {
            passEncoder.setBindGroup(2, matUniformBG);
        }

        // Buffer 0: 해당 서브메시의 버텍스 버퍼
        passEncoder.setVertexBuffer(0, vertexGPUBuffer);

        const indirectOffsetBytes = subIndex * 20;
        if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
            const format = sub.indexFormat || 'uint32';
            passEncoder.setIndexBuffer(sub.geometry.indexBuffer.gpuBuffer, format);
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, indirectOffsetBytes);
        }
    }

    removeFoliageType(name: string): boolean {
        const foliageType = this.#foliageTypes.get(name);
        if (foliageType) {
            foliageType.destroy();
            const idx = this.#typeList.indexOf(foliageType);
            if (idx !== -1) {
                this.#typeList.splice(idx, 1);
            }
            return this.#foliageTypes.delete(name);
        }
        return false;
    }

    getFoliageType(name: string): FoliageType | undefined {
        return this.#foliageTypes.get(name);
    }

    #cachedVHTAtlasGPUTexture: GPUTexture | null = null;
    #cachedVHTView: GPUTextureView | null = null;

    update(cameraOrX: any, renderViewStateDataOrY?: any, argZ?: number): void {
        const typeList = this.#typeList;
        const typeCount = typeList.length;
        if (typeCount === 0 || cameraOrX === undefined || cameraOrX === null) return;

        let camX = 0;
        let camY = 0;
        let camZ = 0;
        let frustumPlanes: number[][] | null = null;

        if (typeof cameraOrX === 'number') {
            camX = cameraOrX;
            camY = typeof renderViewStateDataOrY === 'number' ? renderViewStateDataOrY : 0;
            camZ = typeof argZ === 'number' ? argZ : 0;
        } else {
            const camera = cameraOrX;
            const renderViewStateData = renderViewStateDataOrY;
            camX = camera.x ?? camera.position?.[0] ?? camera.camera?.x ?? 0;
            camY = camera.y ?? camera.position?.[1] ?? camera.camera?.y ?? 0;
            camZ = camera.z ?? camera.position?.[2] ?? camera.camera?.z ?? 0;

            const rawCamera = camera?.camera ?? camera;
            frustumPlanes = renderViewStateData?.frustumPlanes
                ?? renderViewStateData?.view?.frustumPlanes
                ?? camera?.frustumPlanes
                ?? rawCamera?.frustumPlanes
                ?? null;

            if (!frustumPlanes && rawCamera?.projectionMatrix && rawCamera?.viewMatrix) {
                frustumPlanes = computeViewFrustumPlanes(rawCamera.projectionMatrix, rawCamera.viewMatrix);
            }
        }

        const cullingPipeline = this.#cullingComputePipeline;
        const cullingBindGroupLayout = this.#cullingBindGroupLayout;

        // VHT TextureView 1회 캐싱 (Zero-GC: 매 프레임 createView 스팸 방지)
        const vhtAtlasTexture = this.landscape.vhtAtlasTexture;
        const rawGPUTexture = vhtAtlasTexture?.gpuTexture || null;
        if (rawGPUTexture && this.#cachedVHTAtlasGPUTexture !== rawGPUTexture) {
            this.#cachedVHTAtlasGPUTexture = rawGPUTexture;
            this.#cachedVHTView = rawGPUTexture.createView();
        }
        const vhtView = this.#cachedVHTView || undefined;
        const vhtSampler = this.redGPUContext.resourceManager.basicSampler.gpuSampler;

        const worldSizeX = this.landscape.worldSize?.[0] ?? 0;
        const heightScale = this.landscape.heightScale ?? 500;
        const hasVHT = !!rawGPUTexture;

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            const activeCount = foliageType.activeInstanceCount;
            if (activeCount <= 0) continue;

            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const cullingDist = foliageType.options.cullingDistance;
            const fadeStartDist = foliageType.options.fadeStartDistance;
            const boundingRadius = 20.0;
            const bottomOffset = foliageType.getGeometryBottomOffset();

            // 1. Multi-Indirect Command Buffer 모든 서브메시 슬롯의 instanceCount를 매 프레임 0으로 깨끗이 초기화
            foliageType.updateIndirectBuffer();

            // 2. Culling Uniform 갱신 (GPU VHT 고도 정보, subMeshCount 및 카메라/절두체 전달)
            buffer.updateCullingUniforms(
                camX, camY, camZ,
                cullingDist, fadeStartDist, activeCount, boundingRadius,
                worldSizeX, heightScale, bottomOffset, hasVHT,
                subCount,
                frustumPlanes
            );

            // 3. Render Pass 생성 직전 Pre-Process Compute Pass 전처리 등록 (Zero-GC 바인딩)
            if (cullingPipeline && cullingBindGroupLayout) {
                const cullingBindGroup = buffer.getOrCreateCullingBindGroup(cullingBindGroupLayout, vhtView, vhtSampler);
                if (cullingBindGroup) {
                    const workgroupSize = 64;
                    const workgroupCount = Math.ceil(activeCount / workgroupSize);

                    this.redGPUContext.commandEncoderManager.addPreProcessComputePass('Foliage_GPUCulling_ComputePass', (computePass) => {
                        computePass.setPipeline(cullingPipeline);
                        computePass.setBindGroup(0, cullingBindGroup);
                        computePass.dispatchWorkgroups(workgroupCount);
                    });
                }
            }
        }
    }

    destroy(): void {
        this.#foliageTypes.forEach((type) => type.destroy());
        this.#foliageTypes.clear();
        this.#pipelineCache.clear();
    }

    /**
     * 식생 버텍스 인스턴싱 전용 WGSL 버텍스 셰이더 모듈 초기화
     */
    #initVertexShader(): void {
        const resourceManager = this.redGPUContext.resourceManager;
        let module = resourceManager.getGPUShaderModule('FoliageInstancedVertexShader_Module');
        if (!module) {
            module = resourceManager.createGPUShaderModule('FoliageInstancedVertexShader_Module', {
                code: foliageInstancedWGSL,
            });
        }
        this.#vertexShaderModule = module;
    }

    /**
     * 식생 GPU Compute Shader Culling 전용 파이프라인 및 바인드 그룹 레이아웃 초기화
     */
    #initCullingComputePipeline(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const layout = gpuDevice.createBindGroupLayout({
            label: 'FoliageCullingBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'storage'}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
            ],
        });
        this.#cullingBindGroupLayout = layout;

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'FoliageCullingPipelineLayout',
            bindGroupLayouts: [layout],
        });

        const computeModule = gpuDevice.createShaderModule({
            label: 'FoliageCullingComputeModule',
            code: foliageCullingComputeWGSL,
        });

        this.#cullingComputePipeline = gpuDevice.createComputePipeline({
            label: 'FoliageCullingComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: computeModule,
                entryPoint: 'main',
            },
        });
    }

    /**
     * RedGPU 정석 AntialiasingManager.msaaID 및 Material(PBRMaterial 등) 호환 GPURenderPipeline 반환/생성
     */
    #getOrCreatePipeline(
        material: any,
        sampleCount: number,
        msaaID: string,
        strideBytes: number = 48,
        cullMode: GPUCullMode = 'none'
    ): GPURenderPipeline | null {
        if (!material) return null;

        const resourceManager = this.redGPUContext.resourceManager;
        const gpuDevice: GPUDevice = this.redGPUContext.gpuDevice;
        const preferredFormat = navigator.gpu.getPreferredCanvasFormat();

        // 1. 머티리얼 셰이더 상태 갱신
        if (material.dirtyPipeline || !material.fragmentShaderModule) {
            material._updateFragmentState();
        }

        const fragmentModule = material.fragmentShaderModule || material.gpuRenderInfo?.fragmentShaderModule;
        if (!fragmentModule || !this.#vertexShaderModule) return null;

        const baseKey = material.uuid || material.name || material.constructor.name;
        const shaderLabel = fragmentModule?.label || 'default';
        const pipelineKey = `${baseKey}_${shaderLabel}_${msaaID}_stride${strideBytes}_cull${cullMode}`;

        const cachedPipeline = this.#pipelineCache.get(pipelineKey);
        if (cachedPipeline) {
            return cachedPipeline;
        }

        // 2. RedGPU Primitive Geometry Stride (strideBytes = floatCount * 4 bytes)
        const validStrideBytes = Math.max(strideBytes, 48);
        const geometryBufferLayout: GPUVertexBufferLayout = {
            arrayStride: validStrideBytes,
            attributes: [
                { shaderLocation: 0, offset: 0, format: 'float32x3' },  // position
                { shaderLocation: 1, offset: 12, format: 'float32x3' }, // normal
                { shaderLocation: 2, offset: 24, format: 'float32x2' }, // uv
            ],
        };


        const instanceBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 12 * 4,
            stepMode: 'instance',
            attributes: [
                { shaderLocation: 3, offset: 0, format: 'float32x3' },  // instancePos
                { shaderLocation: 4, offset: 12, format: 'float32x4' }, // instanceRotQuat
                { shaderLocation: 5, offset: 28, format: 'float32x3' }, // instanceScale
                { shaderLocation: 6, offset: 40, format: 'float32x2' }, // instanceExtra (fade, subId)
            ],
        };

        // 3. RedGPU 명시적 PipelineLayout 구축 (Group 0: System, Group 1: SubMesh Transform, Group 2: Material)
        const systemBindGroupLayout = resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System);
        const subMeshBindGroupLayout = this.#subMeshVertexBindGroupLayout || this.#emptyBindGroupLayout || gpuDevice.createBindGroupLayout({
            label: 'EmptyFoliageBindGroupLayout',
            entries: []
        });
        const materialBindGroupLayout = material.gpuRenderInfo?.fragmentBindGroupLayout
            || material.gpuRenderInfo?.fragmentUniformBindGroup?.layout
            || this.#emptyBindGroupLayout;

        const bindGroupLayouts: GPUBindGroupLayout[] = [
            systemBindGroupLayout,
            subMeshBindGroupLayout,
            materialBindGroupLayout
        ];

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: `FoliagePipelineLayout_${pipelineKey}`,
            bindGroupLayouts: bindGroupLayouts,
        });

        // 4. RedGPU G-Buffer 3개 타겟 및 정석 DepthStencil State
        const pipelineDescriptor: GPURenderPipelineDescriptor = {
            label: `FoliageRenderPipeline_${pipelineKey}`,
            layout: pipelineLayout,
            vertex: {
                module: this.#vertexShaderModule,
                entryPoint: 'mainInput',
                buffers: [geometryBufferLayout, instanceBufferLayout],
            },
            fragment: {
                module: fragmentModule,
                entryPoint: 'main',
                targets: material.getFragmentRenderState
                    ? material.getFragmentRenderState().targets
                    : [
                        {
                            format: 'rgba16float',
                            blend: material.blendColorState ? {
                                color: material.blendColorState.state,
                                alpha: material.blendAlphaState.state
                            } : undefined,
                            writeMask: material.writeMaskState,
                        },
                        {
                            format: preferredFormat,
                            blend: undefined,
                            writeMask: material.writeMaskState,
                        },
                        {
                            format: 'rgba16float',
                            blend: undefined,
                            writeMask: material.writeMaskState,
                        }
                    ],
            },

            primitive: {
                topology: 'triangle-list',
                cullMode: cullMode,
            },
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: true,
                depthCompare: 'less',
            },

            multisample: {
                count: sampleCount,
            },
        };

        try {
            const pipeline = gpuDevice.createRenderPipeline(pipelineDescriptor);
            this.#pipelineCache.set(pipelineKey, pipeline);
            return pipeline;
        } catch (e) {
            console.warn('[LandscapeFoliageManager] Pipeline creation fallback:', e);
            return null;
        }
    }


}
