import RedGPUContext from "../../context/RedGPUContext";
import DirectTexture from "../../resources/texture/DirectTexture";
import bakeSrc from "./rvt_bake.wgsl";
import TerrainMaterial from "./TerrainMaterial";
import {keepLog} from "../../utils";

export interface TerrainRVTOptions {
    atlasSize?: number;
}

class TerrainRVT {
    readonly #redGPUContext: RedGPUContext;
    readonly #atlasSize: number;

    #albedoAtlasGPU: GPUTexture | null = null;
    #normalORMAtlasGPU: GPUTexture | null = null;

    #albedoDirectTexture: DirectTexture | null = null;
    #normalORMDirectTexture: DirectTexture | null = null;

    #albedoPipeline: GPURenderPipeline | null = null;
    #normalORMPipeline: GPURenderPipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformBuffer: GPUBuffer | null = null;

    #sampler: GPUSampler | null = null;
    #emptyArrayGPUTexture: GPUTexture | null = null;

    constructor(redGPUContext: RedGPUContext, options: TerrainRVTOptions = {}) {
        this.#redGPUContext = redGPUContext;
        this.#atlasSize = options.atlasSize ?? 2048;
        this.#initAtlas();
        this.#initPipeline();
    }

    get atlasSize(): number {
        return this.#atlasSize;
    }

    get albedoDirectTexture(): DirectTexture | null {
        return this.#albedoDirectTexture;
    }

    get normalORMDirectTexture(): DirectTexture | null {
        return this.#normalORMDirectTexture;
    }

    public bake(material: TerrainMaterial): void {

        if (!this.#albedoPipeline || !this.#normalORMPipeline) return;

        const mat = material as any;
        const splatGPUView = this.#getTextureView(mat.splatTexture);
        const diffuseGPUView = this.#getArrayTextureView(mat.diffuseArray);
        const normalGPUView = this.#getArrayTextureView(mat.normalArray);
        const heightGPUView = this.#getArrayTextureView(mat.heightArray);
        const ormGPUView = this.#getArrayTextureView(mat.ormArray);
        const baseColorGPUView = this.#getTextureView(mat.baseColorTexture);
        const ormTextureGPUView = this.#getTextureView(mat.ormTexture);

        if (!splatGPUView || !diffuseGPUView) {
            return; // 텍스처 로드 중이면 스킵 (다음 프레임에 재시도)
        }

        keepLog('베이킹')
        const device = this.#redGPUContext.gpuDevice;

        const uData = new Float32Array(16);
        uData[0] = 0.0;
        uData[1] = 0.0;
        uData[2] = 1.0;
        uData[3] = 1.0;
        uData[4] = 0.0;
        uData[5] = 0.0;
        uData[6] = 1.0;
        uData[7] = 1.0;
        uData[8] = mat.tileScale ?? 75.0;
        uData[9] = mat.macroScale ?? 10.0;
        uData[10] = mat.blendContrast ?? 0.0;
        uData[11] = 0.0;
        uData[12] = mat.grassRoughnessFactor ?? 0.85;
        uData[13] = mat.sandRoughnessFactor ?? 0.80;
        uData[14] = mat.rockRoughnessFactor ?? 0.65;
        uData[15] = mat.gravelRoughnessFactor ?? 0.70;

        device.queue.writeBuffer(this.#uniformBuffer!, 0, uData);

        const rm = this.#redGPUContext.resourceManager;
        const emptyView = rm.emptyBitmapTextureView;
        const emptyArrayView = this.#getOrCreateEmptyArrayView();

        const resolvedSplat = splatGPUView ?? emptyView;
        const resolvedDiffuse = diffuseGPUView ?? emptyArrayView;
        const resolvedNormal = normalGPUView ?? emptyArrayView;
        const resolvedHeight = heightGPUView ?? emptyArrayView;
        const resolvedORM = ormGPUView ?? emptyArrayView;
        const resolvedBaseColor = baseColorGPUView ?? emptyView;
        const resolvedORMTexture = ormTextureGPUView ?? emptyView;

        const bindGroup = device.createBindGroup({
            label: 'RVT_BakeBindGroup',
            layout: this.#bindGroupLayout!,
            entries: [
                {binding: 0, resource: {buffer: this.#uniformBuffer!}},
                {binding: 1, resource: resolvedSplat},
                {binding: 2, resource: resolvedDiffuse},
                {binding: 3, resource: resolvedNormal},
                {binding: 4, resource: resolvedHeight},
                {binding: 5, resource: resolvedORM},
                {binding: 6, resource: this.#sampler!},
                {binding: 7, resource: resolvedBaseColor},
                {binding: 8, resource: resolvedORMTexture},
            ]
        });

        const encoder = device.createCommandEncoder({label: 'RVT_BakeEncoder'});

        {
            const pass = encoder.beginRenderPass({
                label: 'RVT_AlbedoBakePass',
                colorAttachments: [{
                    view: this.#albedoAtlasGPU!.createView(),
                    loadOp: 'clear', storeOp: 'store',
                    clearValue: {r: 0, g: 0, b: 0, a: 1}
                }]
            });
            pass.setPipeline(this.#albedoPipeline!);
            pass.setBindGroup(0, bindGroup);
            pass.draw(3, 1, 0, 0);
            pass.end();
        }

        {
            const pass = encoder.beginRenderPass({
                label: 'RVT_NormalORMBakePass',
                colorAttachments: [{
                    view: this.#normalORMAtlasGPU!.createView(),
                    loadOp: 'clear', storeOp: 'store',
                    clearValue: {r: 0.5, g: 0.5, b: 0.5, a: 1}
                }]
            });
            pass.setPipeline(this.#normalORMPipeline!);
            pass.setBindGroup(0, bindGroup);
            pass.draw(3, 1, 0, 0);
            pass.end();
        }

        device.queue.submit([encoder.finish()]);

        this.#refreshDirectTextures();
    }

    public destroy(): void {
        this.#albedoAtlasGPU?.destroy();
        this.#normalORMAtlasGPU?.destroy();
        this.#uniformBuffer?.destroy();
        this.#albedoAtlasGPU = null;
        this.#normalORMAtlasGPU = null;
        this.#uniformBuffer = null;
        this.#albedoDirectTexture = null;
        this.#normalORMDirectTexture = null;
    }

    #initAtlas(): void {
        const device = this.#redGPUContext.gpuDevice;
        const size = this.#atlasSize;

        this.#albedoAtlasGPU = device.createTexture({
            label: 'RVT_AlbedoAtlas', size: [size, size, 1], format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });

        this.#normalORMAtlasGPU = device.createTexture({
            label: 'RVT_NormalORMAtlas', size: [size, size, 1], format: 'rgba8unorm',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });

        const uid = Math.random().toString(36).slice(2);
        this.#albedoDirectTexture = new DirectTexture(this.#redGPUContext, `RVT_Albedo_${uid}`, this.#albedoAtlasGPU);
        this.#normalORMDirectTexture = new DirectTexture(this.#redGPUContext, `RVT_NormalORM_${uid}`, this.#normalORMAtlasGPU);

        this.#uniformBuffer = device.createBuffer({
            label: 'RVT_BakeUniform', size: 16 * 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#sampler = device.createSampler({
            label: 'RVT_BakeSampler', magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
            addressModeU: 'repeat', addressModeV: 'repeat',
        });
    }

    #initPipeline(): void {
        const device = this.#redGPUContext.gpuDevice;
        this.#bindGroupLayout = device.createBindGroupLayout({
            label: 'RVT_BakeBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT | GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {binding: 6, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
                {binding: 7, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 8, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float', viewDimension: '2d'}},
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'RVT_BakePipelineLayout', bindGroupLayouts: [this.#bindGroupLayout]
        });

        const shaderModule = device.createShaderModule({label: 'RVT_BakeShader', code: bakeSrc});
        const vertexState: GPUVertexState = {module: shaderModule, entryPoint: 'vs_main'};

        this.#albedoPipeline = device.createRenderPipeline({
            label: 'RVT_AlbedoBakePipeline', layout: pipelineLayout, vertex: vertexState,
            fragment: {module: shaderModule, entryPoint: 'fs_albedo', targets: [{format: 'rgba8unorm'}]},
            primitive: {topology: 'triangle-list'},
        });

        this.#normalORMPipeline = device.createRenderPipeline({
            label: 'RVT_NormalORMBakePipeline', layout: pipelineLayout, vertex: vertexState,
            fragment: {module: shaderModule, entryPoint: 'fs_normal_orm', targets: [{format: 'rgba8unorm'}]},
            primitive: {topology: 'triangle-list'},
        });
    }

    #getTextureView(texture: any): GPUTextureView | null {
        if (!texture) return null;
        return this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(texture) ?? null;
    }

    #getArrayTextureView(textureArray: any): GPUTextureView | null {
        if (!textureArray) return null;
        return this.#redGPUContext.resourceManager.getGPUResourceBitmapTextureView(textureArray, {dimension: '2d-array'}) ?? null;
    }

    #getOrCreateEmptyArrayView(): GPUTextureView {
        if (!this.#emptyArrayGPUTexture) {
            this.#emptyArrayGPUTexture = this.#redGPUContext.gpuDevice.createTexture({
                label: 'RVT_EmptyArray', size: [1, 1, 4], format: 'rgba8unorm',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            });
        }
        return this.#emptyArrayGPUTexture.createView({dimension: '2d-array', arrayLayerCount: 4, baseArrayLayer: 0});
    }

    #refreshDirectTextures(): void {
    }
}

Object.freeze(TerrainRVT);
export default TerrainRVT;