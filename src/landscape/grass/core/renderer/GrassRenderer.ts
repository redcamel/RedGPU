/**
 * [KO] 잔디 WebGPU 렌더러 모듈입니다.
 * [EN] Grass WebGPU renderer module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../../context/RedGPUContext";
import RedGPUObject from "../../../../base/RedGPUObject";
import View3D from "../../../../display/view/View3D";
import GPU_PRIMITIVE_TOPOLOGY from "../../../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import {Grass} from "../Grass";
import {GrassScatterMegaBuffer} from "../buffer/GrassScatterMegaBuffer";
import grassVertexWGSL from "../pipeline/grassVertex.wgsl";
import grassFragmentNearWGSL from "../pipeline/grassFragmentNear.wgsl";
import grassFragmentFarWGSL from "../pipeline/grassFragmentFar.wgsl";
import grassShadowVertexWGSL from "../pipeline/grassShadowVertex.wgsl";
import grassShadowFragmentWGSL from "../pipeline/grassShadowFragment.wgsl";

/**
 * [KO] 잔디 타입별 런타임 머티리얼 버퍼 및 바인드 그룹 자원 인터페이스입니다.
 * [EN] Interface for runtime material buffer and bind group resources per grass type.
 */
export interface GrassTypeMaterialBufferResources {
    uniformBuffer: GPUBuffer;
    cpuBuffer: Float32Array;
    uintBuffer: Uint32Array;
    grassUniformGPUBuffer: GPUBuffer;
    grassUniformCPUBuffer: Float32Array;
    bindGroup: GPUBindGroup | null;
    instanceBindGroup: GPUBindGroup | null;
    cachedColorTexView: GPUTextureView | null;
    initialized: boolean;
    cachedHasVbt: boolean;
    subMeshResources: {
        bindGroup: GPUBindGroup | null;
        cachedColorTexView: GPUTextureView | null;
    }[];
}

/**
 * [KO] GPU 컬링된 대규모 잔디 인스턴스들을 간접 드로우(drawIndexedIndirect)를 통해 메인 패스 및 섀도우 패스로 렌더링하는 렌더러 클래스입니다.
 * [EN] Renderer class that renders GPU-culled large-scale grass instances to main and shadow passes using indirect drawing (drawIndexedIndirect).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(GrassManager)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (GrassManager).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class GrassRenderer extends RedGPUObject {
    #vertexModule: GPUShaderModule | null = null;
    #vertexShadowModule: GPUShaderModule | null = null;
    #fragmentNearModule: GPUShaderModule | null = null;
    #fragmentFarModule: GPUShaderModule | null = null;
    #fragmentShadowModule: GPUShaderModule | null = null;

    #pipelineLayout: GPUPipelineLayout | null = null;
    #pipelineBindGroupLayout1: GPUBindGroupLayout | null = null;
    #pipelineBindGroupLayout2: GPUBindGroupLayout | null = null;

    #renderPipelinesNear: Map<number, GPURenderPipeline> = new Map();
    #renderPipelinesFar: Map<number, GPURenderPipeline> = new Map();
    #shadowPipeline: GPURenderPipeline | null = null;

    /**
     * [KO] GrassRenderer 인스턴스를 생성하고 셰이더 모듈 및 파이프라인 레이아웃을 초기화합니다.
     * [EN] Creates a GrassRenderer instance and initializes shader modules and pipeline layouts.
     * @param redGPUContext - RedGPU 컨텍스트 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#initShadersAndLayouts();
    }

    /**
     * [KO] 인스턴스 버퍼 및 전역 잔디 유니폼용 GPUBindGroupLayout(Group 1)을 반환합니다.
     * [EN] Returns the GPUBindGroupLayout (Group 1) for instance buffer and global grass uniforms.
     */
    get pipelineBindGroupLayout1(): GPUBindGroupLayout | null {
        return this.#pipelineBindGroupLayout1;
    }

    /**
     * [KO] 머티리얼 텍스처 및 개별 잔디 유니폼용 GPUBindGroupLayout(Group 2)을 반환합니다.
     * [EN] Returns the GPUBindGroupLayout (Group 2) for material textures and individual grass uniforms.
     */
    get pipelineBindGroupLayout2(): GPUBindGroupLayout | null {
        return this.#pipelineBindGroupLayout2;
    }

    /**
     * [KO] 주어진 잔디 타입들의 인스턴스를 메인 렌더 패스(Near/Far 파이프라인)에 드로우합니다.
     * [EN] Draws instances of the given grass types to the main render pass (Near/Far pipelines).
     *
     * @param view - 현재 렌더링 중인 View3D 객체
     * @param passEncoder - 메인 씬 GPURenderPassEncoder
     * @param grassList - 렌더링할 잔디 타입 목록
     * @param megaBuffer - 잔디 스캐터 메가버퍼 인스턴스
     * @param typeMaterialBuffers - 잔디 타입별 머티리얼 버퍼 맵
     */
    render(
        view: View3D,
        passEncoder: GPURenderPassEncoder,
        grassList: readonly Grass[],
        megaBuffer: GrassScatterMegaBuffer,
        typeMaterialBuffers: Map<number, GrassTypeMaterialBufferResources>
    ): void {
        const {systemUniform_Vertex_UniformBindGroup: systemBG} = view;
        if (!systemBG) return;

        const {gpuDevice, antialiasingManager, resourceManager} = this;
        if (!gpuDevice || !this.#pipelineBindGroupLayout1 || !this.#pipelineBindGroupLayout2) return;

        const sampleCount = antialiasingManager.useMSAA ? 4 : 1;
        const nearPipeline = this.#getRenderPipeline(sampleCount, false);
        const farPipeline = this.#getRenderPipeline(sampleCount, true);
        if (!nearPipeline || !farPipeline) return;

        let currentPipeline: GPURenderPipeline | null = nearPipeline;
        passEncoder.setPipeline(nearPipeline);
        passEncoder.setBindGroup(0, systemBG);

        const {indirectGPUBuffer, culledGPUBuffer} = megaBuffer;
        if (!indirectGPUBuffer) return;

        const count = grassList.length;
        for (let i = 0; i < count; i++) {
            const type = grassList[i];
            const {typeId, name, unifiedGeometry, subMeshes} = type;
            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc || alloc.instanceCount === 0) continue;

            const res = typeMaterialBuffers.get(typeId);
            if (!res) continue;

            const {uniformBuffer, grassUniformGPUBuffer} = res;

            if (!res.instanceBindGroup && culledGPUBuffer && grassUniformGPUBuffer) {
                res.instanceBindGroup = gpuDevice.createBindGroup({
                    label: `Grass_InstanceBindGroup_${name}_${this.instanceId}`,
                    layout: this.#pipelineBindGroupLayout1,
                    entries: [
                        {binding: 0, resource: {buffer: culledGPUBuffer}},
                        {binding: 1, resource: {buffer: grassUniformGPUBuffer}},
                    ]
                });
            }

            if (!res.instanceBindGroup) continue;

            const targetGeom = unifiedGeometry;
            if (!targetGeom) continue;
            const {vertexBuffer: lvb, indexBuffer: lib} = targetGeom;
            if (!lvb || !lib) continue;

            passEncoder.setBindGroup(1, res.instanceBindGroup);
            passEncoder.setVertexBuffer(0, lvb.gpuBuffer);
            passEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

            const subMeshCount = subMeshes.length;
            const {basicSampler} = resourceManager;

            if (alloc.nearSlots.length > 0) {
                if (currentPipeline !== nearPipeline) {
                    passEncoder.setPipeline(nearPipeline);
                    currentPipeline = nearPipeline;
                }
                for (let s = 0; s < subMeshCount; s++) {
                    const subMesh = subMeshes[s];
                    const slot = alloc.nearSlots[s];
                    if (!slot) continue;

                    let subRes = res.subMeshResources[s];
                    if (!subRes) {
                        subRes = {bindGroup: null, cachedColorTexView: null};
                        res.subMeshResources[s] = subRes;
                    }

                    const subTex = subMesh.baseColorTexture;
                    const subTexView = (subTex ? resourceManager.getGPUResourceBitmapTextureView(subTex) : null)
                        || type.baseColorTextureView
                        || resourceManager.emptyBitmapTextureView;

                    if (!subRes.bindGroup || subRes.cachedColorTexView !== subTexView) {
                        subRes.bindGroup = gpuDevice.createBindGroup({
                            label: `Grass_MaterialBindGroup_${name}_sub${s}_${this.instanceId}`,
                            layout: this.#pipelineBindGroupLayout2,
                            entries: [
                                {binding: 0, resource: subTexView},
                                {binding: 1, resource: basicSampler.gpuSampler},
                                {binding: 2, resource: {buffer: uniformBuffer}},
                            ]
                        });
                        subRes.cachedColorTexView = subTexView;
                    }

                    passEncoder.setBindGroup(2, subRes.bindGroup);
                    const indirectOffsetBytes = slot.indirectOffset * 5 * 4;
                    passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
                }
            }

            if (alloc.farSlots.length > 0) {
                if (currentPipeline !== farPipeline) {
                    passEncoder.setPipeline(farPipeline);
                    currentPipeline = farPipeline;
                }
                for (let s = 0; s < subMeshCount; s++) {
                    const subMesh = subMeshes[s];
                    const slot = alloc.farSlots[s];
                    if (!slot) continue;

                    let subRes = res.subMeshResources[s];
                    if (!subRes) {
                        subRes = {bindGroup: null, cachedColorTexView: null};
                        res.subMeshResources[s] = subRes;
                    }

                    const subTex = subMesh.baseColorTexture;
                    const subTexView = (subTex ? resourceManager.getGPUResourceBitmapTextureView(subTex) : null)
                        || type.baseColorTextureView
                        || resourceManager.emptyBitmapTextureView;

                    if (!subRes.bindGroup || subRes.cachedColorTexView !== subTexView) {
                        subRes.bindGroup = gpuDevice.createBindGroup({
                            label: `Grass_MaterialBindGroup_${name}_sub${s}_${this.instanceId}`,
                            layout: this.#pipelineBindGroupLayout2,
                            entries: [
                                {binding: 0, resource: subTexView},
                                {binding: 1, resource: basicSampler.gpuSampler},
                                {binding: 2, resource: {buffer: uniformBuffer}},
                            ]
                        });
                        subRes.cachedColorTexView = subTexView;
                    }

                    passEncoder.setBindGroup(2, subRes.bindGroup);
                    const indirectOffsetBytes = slot.indirectOffset * 5 * 4;
                    passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
                }
            }
        }
    }

    /**
     * [KO] 캐스케이드 그림자 맵(CSM) 패스에서 그림자 투사(`castShadow: true`)가 설정된 잔디 인스턴스들의 그림자를 렌더링합니다.
     * [EN] Renders shadows for grass instances configured with `castShadow: true` in the cascaded shadow map (CSM) pass.
     *
     * @param view - 그림자 패스를 렌더링 중인 View3D 객체
     * @param passEncoder - 섀도우 맵 생성을 위한 GPURenderPassEncoder
     * @param grassList - 렌더링할 잔디 타입 목록
     * @param megaBuffer - 잔디 스캐터 메가버퍼 인스턴스
     * @param typeMaterialBuffers - 잔디 타입별 머티리얼 버퍼 맵
     */
    renderShadow(
        view: View3D,
        passEncoder: GPURenderPassEncoder,
        grassList: readonly Grass[],
        megaBuffer: GrassScatterMegaBuffer,
        typeMaterialBuffers: Map<number, GrassTypeMaterialBufferResources>
    ): void {
        const {currentCascadeIndex: currentCascade, systemUniform_Vertex_UniformBindGroup: systemBG} = view;
        if (currentCascade !== undefined && currentCascade > 1) return;

        const {gpuDevice, resourceManager} = this;
        if (!gpuDevice) return;

        const {indirectGPUBuffer} = megaBuffer;
        if (!indirectGPUBuffer) return;

        const pipeline = this.#getShadowRenderPipeline();
        if (!pipeline) return;

        if (!systemBG) return;

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, systemBG);

        const count = grassList.length;
        for (let i = 0; i < count; i++) {
            const type = grassList[i];
            const {castShadow, typeId, name, unifiedGeometry, subMeshes} = type;
            if (!castShadow) continue;

            const alloc = megaBuffer.getAllocation(typeId);
            if (!alloc || alloc.instanceCount === 0) continue;

            const res = typeMaterialBuffers.get(typeId);
            if (!res || !res.instanceBindGroup) continue;

            const targetGeom = unifiedGeometry;
            if (!targetGeom) continue;
            const {vertexBuffer: lvb, indexBuffer: lib} = targetGeom;
            if (!lvb || !lib) continue;

            passEncoder.setBindGroup(1, res.instanceBindGroup);
            passEncoder.setVertexBuffer(0, lvb.gpuBuffer);
            passEncoder.setIndexBuffer(lib.gpuBuffer, 'uint32');

            const subMeshCount = subMeshes.length;
            const {basicSampler} = resourceManager;

            for (let s = 0; s < subMeshCount; s++) {
                const subMesh = subMeshes[s];
                const nearSlot = alloc.nearSlots[s];
                if (!nearSlot) continue;

                let subRes = res.subMeshResources[s];
                if (!subRes) {
                    subRes = {bindGroup: null, cachedColorTexView: null};
                    res.subMeshResources[s] = subRes;
                }

                const subTex = subMesh.baseColorTexture;
                const subTexView = (subTex ? resourceManager.getGPUResourceBitmapTextureView(subTex) : null)
                    || type.baseColorTextureView
                    || resourceManager.emptyBitmapTextureView;

                if (!subRes.bindGroup || subRes.cachedColorTexView !== subTexView) {
                    subRes.bindGroup = gpuDevice.createBindGroup({
                        label: `Grass_MaterialBindGroup_${name}_sub${s}_${this.instanceId}`,
                        layout: this.#pipelineBindGroupLayout2,
                        entries: [
                            {binding: 0, resource: subTexView},
                            {binding: 1, resource: basicSampler.gpuSampler},
                            {binding: 2, resource: {buffer: res.uniformBuffer}},
                        ]
                    });
                    subRes.cachedColorTexView = subTexView;
                }

                passEncoder.setBindGroup(2, subRes.bindGroup);
                const indirectOffsetBytes = nearSlot.indirectOffset * 5 * 4;
                passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
            }
        }
    }

    /**
     * [KO] 렌더러의 내부 리소스(파이프라인 캐시 및 셰이더 참조)를 해제합니다.
     * [EN] Releases internal resources (pipeline caches and shader references) of the renderer.
     */
    destroy(): void {
        this.#renderPipelinesNear.clear();
        this.#renderPipelinesFar.clear();
        this.#shadowPipeline = null;
        this.#vertexModule = null;
        this.#vertexShadowModule = null;
        this.#fragmentNearModule = null;
        this.#fragmentFarModule = null;
        this.#fragmentShadowModule = null;
        this.#pipelineLayout = null;
        this.#pipelineBindGroupLayout1 = null;
        this.#pipelineBindGroupLayout2 = null;
    }

    #getShadowRenderPipeline(): GPURenderPipeline | null {
        if (this.#shadowPipeline) return this.#shadowPipeline;

        const gpuDevice = this.gpuDevice;
        if (!gpuDevice || !this.#pipelineLayout || !this.#vertexShadowModule || !this.#fragmentShadowModule) return null;

        this.#shadowPipeline = gpuDevice.createRenderPipeline({
            label: `Grass_Shadow_RenderPipeline_${this.instanceId}`,
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#vertexShadowModule,
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
                module: this.#fragmentShadowModule,
                entryPoint: 'main',
                targets: []
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
                count: 1
            }
        });

        return this.#shadowPipeline;
    }

    #getRenderPipeline(sampleCount: number = 1, isFar: boolean = false): GPURenderPipeline | null {
        const cache = isFar ? this.#renderPipelinesFar : this.#renderPipelinesNear;
        let pipeline = cache.get(sampleCount);
        if (pipeline) return pipeline;

        const gpuDevice = this.gpuDevice;
        const fragModule = isFar ? this.#fragmentFarModule : this.#fragmentNearModule;
        if (!gpuDevice || !this.#pipelineLayout || !this.#vertexModule || !fragModule) return null;

        const preferredNormalFormat = navigator.gpu.getPreferredCanvasFormat();

        pipeline = gpuDevice.createRenderPipeline({
            label: `Grass_RenderPipeline_${isFar ? 'Far' : 'Near'}_msaa${sampleCount}_${this.instanceId}`,
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

    #initShadersAndLayouts(): void {
        const {gpuDevice, resourceManager} = this;

        if (!gpuDevice) return;

        this.#vertexModule = resourceManager.createGPUShaderModule('Grass_VertexModule', {
            code: grassVertexWGSL
        });

        this.#fragmentNearModule = resourceManager.createGPUShaderModule('Grass_FragmentNearModule', {
            code: grassFragmentNearWGSL
        });

        this.#fragmentFarModule = resourceManager.createGPUShaderModule('Grass_FragmentFarModule', {
            code: grassFragmentFarWGSL
        });

        this.#vertexShadowModule = resourceManager.createGPUShaderModule('Grass_VertexShadowModule', {
            code: grassShadowVertexWGSL
        });

        this.#fragmentShadowModule = resourceManager.createGPUShaderModule('Grass_FragmentShadowModule', {
            code: grassShadowFragmentWGSL
        });

        const systemBGLayout = resourceManager.getGPUBindGroupLayout('PRESET_GPUBindGroupLayout_System');

        this.#pipelineBindGroupLayout1 = resourceManager.createBindGroupLayout('Grass_Pipeline_Group1_Layout', {
            label: 'Grass_Pipeline_Group1_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
            ]
        });

        this.#pipelineBindGroupLayout2 = resourceManager.createBindGroupLayout('Grass_Pipeline_Group2_Layout', {
            label: 'Grass_Pipeline_Group2_Layout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
            ]
        });

        this.#pipelineLayout = gpuDevice.createPipelineLayout({
            label: `Grass_PipelineLayout_${this.instanceId}`,
            bindGroupLayouts: [
                systemBGLayout,
                this.#pipelineBindGroupLayout1,
                this.#pipelineBindGroupLayout2
            ]
        });
    }
}

export default GrassRenderer;
