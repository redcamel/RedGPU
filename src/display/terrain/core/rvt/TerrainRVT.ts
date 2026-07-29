import RedGPUContext from "../../../../context/RedGPUContext";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import bakeSrc from "./rvt_bake.wgsl";
import TerrainMaterial from "../material/TerrainMaterial";
import {keepLog} from "../../../../utils";

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

    #computePipeline: GPUComputePipeline | null = null;
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
        if (!this.#computePipeline) return;

        const mat = material as any;
        const splatGPUView = this.#getTextureView(mat.splatTexture);
        const diffuseGPUView = this.#getArrayTextureView(mat.diffuseArray);
        const normalGPUView = this.#getArrayTextureView(mat.normalArray);
        const heightGPUView = this.#getArrayTextureView(mat.heightArray);
        const ormGPUView = this.#getArrayTextureView(mat.ormArray);
        const baseColorGPUView = this.#getTextureView(mat.baseColorTexture);
        const ormTextureGPUView = this.#getTextureView(mat.ormTexture);
        const heightmapGPUView = this.#getTextureView(mat.targetTerrain?.heightmapAtlasTexture);

        keepLog('RVT 컴퓨트 셰이더 베이킹 실행');
        const device = this.#redGPUContext.gpuDevice;

        const uData = new Float32Array(24);
        uData[0] = 0.0;
        uData[1] = 0.0;
        uData[2] = 1.0;
        uData[3] = 1.0;
        uData[4] = 0.0;
        uData[5] = 0.0;
        uData[6] = 1.0;
        uData[7] = 1.0;
        const layers = mat.layers || [];
        const baseRoughness = mat.roughnessFactor ?? 1.0;
        uData[8] = mat.tileScale ?? 16.0;
        uData[9] = mat.macroScale ?? 2.0;
        uData[10] = mat.blendContrast ?? 0.0;
        uData[11] = baseRoughness;
        uData[12] = layers[0]?.roughnessFactor ?? 0.85;
        uData[13] = layers[1]?.roughnessFactor ?? 0.85;
        uData[14] = layers[2]?.roughnessFactor ?? 0.90;
        uData[15] = layers[3]?.roughnessFactor ?? 0.85;
        uData[16] = mat.normalScale ?? 1.0;
        uData[17] = mat.occlusionStrength ?? 1.0;
        uData[18] = mat.baseColorWeight ?? 0.5;
        uData[19] = mat.baseColorBlendMode === 'multiply' ? 1.0 : 0.0;
        const isAutoSplat = !mat.splatTexture || mat.useAutoSplat === true;
        uData[20] = isAutoSplat ? 1.0 : 0.0;

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
        const resolvedHeightmap = heightmapGPUView ?? emptyView;

        const albedoStorageView = this.#albedoAtlasGPU!.createView();
        const normalORMStorageView = this.#normalORMAtlasGPU!.createView();

        const bindGroup = device.createBindGroup({
            label: 'RVT_ComputeBakeBindGroup',
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
                {binding: 9, resource: resolvedHeightmap},
                {binding: 10, resource: albedoStorageView},
                {binding: 11, resource: normalORMStorageView},
            ]
        });

        const encoder = device.createCommandEncoder({label: 'RVT_ComputeBakeEncoder'});
        const pass = encoder.beginComputePass({label: 'RVT_ComputeBakePass'});
        pass.setPipeline(this.#computePipeline);
        pass.setBindGroup(0, bindGroup);
        const workgroups = Math.ceil(this.#atlasSize / 16);
        pass.dispatchWorkgroups(workgroups, workgroups);
        pass.end();

        device.queue.submit([encoder.finish()]);
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
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });

        this.#normalORMAtlasGPU = device.createTexture({
            label: 'RVT_NormalORMAtlas', size: [size, size, 1], format: 'rgba8unorm',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC,
        });

        const uid = Math.random().toString(36).slice(2);
        this.#albedoDirectTexture = new DirectTexture(this.#redGPUContext, `RVT_Albedo_${uid}`, this.#albedoAtlasGPU);
        this.#normalORMDirectTexture = new DirectTexture(this.#redGPUContext, `RVT_NormalORM_${uid}`, this.#normalORMAtlasGPU);

        this.#uniformBuffer = device.createBuffer({
            label: 'RVT_BakeUniform', size: 24 * 4, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#sampler = device.createSampler({
            label: 'RVT_BakeSampler', magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear',
            addressModeU: 'repeat', addressModeV: 'repeat',
        });
    }

    #initPipeline(): void {
        const device = this.#redGPUContext.gpuDevice;
        this.#bindGroupLayout = device.createBindGroupLayout({
            label: 'RVT_ComputeBakeBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {binding: 6, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
                {binding: 7, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 8, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 9, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 10,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
                {
                    binding: 11,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'RVT_ComputeBakePipelineLayout', bindGroupLayouts: [this.#bindGroupLayout]
        });

        const shaderModule = device.createShaderModule({label: 'RVT_ComputeBakeShader', code: bakeSrc});

        this.#computePipeline = device.createComputePipeline({
            label: 'RVT_ComputeBakePipeline', layout: pipelineLayout,
            compute: {module: shaderModule, entryPoint: 'cs_main'}
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
}

Object.freeze(TerrainRVT);
export default TerrainRVT;