import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vbtBakeShaderCode from "../shader/landscapeVBTBake.wgsl";
import tileMipShaderCode from "../shader/landscapeTileMipmap.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import LandscapeMaterial from "../material/LandscapeMaterial";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

export class LandscapeVBTGenerator extends ALandscapeAtlasGenerator {
    #uniformFloatArray: Float32Array;
    #uniformUintArray: Uint32Array;
    #mipUniformArray: Uint32Array = new Uint32Array(8);

    #storageViewsCache: WeakMap<GPUTexture, Map<number, GPUTextureView>> = new WeakMap();
    #sampleViewsCache: WeakMap<GPUTexture, Map<number, GPUTextureView>> = new WeakMap();

    #tileMipPipeline: GPUComputePipeline | null = null;
    #tileMipBindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VBT');
        this.#uniformFloatArray = new Float32Array(204);
        this.#uniformUintArray = new Uint32Array(this.#uniformFloatArray.buffer);
        this.#initComputeResources();
        this.#initTileMipComputeResources();
    }

    bakeTileRegion(
        vhtAtlas: DirectTexture,
        vntAtlas: DirectTexture,
        vbtBaseColorArray: DirectTexture,
        vbtNormalArray: DirectTexture,
        vbtORMArray: DirectTexture,
        material: LandscapeMaterial,
        sliceIndex: number,
        col: number,
        row: number,
        tileSizePixels: number = 512
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vhtAtlas?.gpuTexture || !vntAtlas?.gpuTexture) return;
        if (!vbtBaseColorArray?.gpuTexture || !vbtNormalArray?.gpuTexture || !vbtORMArray?.gpuTexture) return;

        const device = this.redGPUContext.gpuDevice;
        const atlasW = vhtAtlas.gpuTexture.width;
        const atlasH = vhtAtlas.gpuTexture.height;

        const originX = col * tileSizePixels;
        const originZ = row * tileSizePixels;

        if (originX >= atlasW || originZ >= atlasH || tileSizePixels <= 0) return;

        const fArr = this.#uniformFloatArray;
        const uArr = this.#uniformUintArray;

        fArr[0] = originX;
        fArr[1] = originZ;
        fArr[2] = tileSizePixels;
        fArr[3] = tileSizePixels;
        fArr[4] = atlasW;
        fArr[5] = atlasH;
        uArr[6] = sliceIndex;

        const activeLayers = material.layers;
        const activeCount = Math.min(8, activeLayers.length);
        uArr[7] = activeCount;

        const baseColorRGBA = material.color.rgbNormalLinear;
        fArr[8] = baseColorRGBA[0];
        fArr[9] = baseColorRGBA[1];
        fArr[10] = baseColorRGBA[2];
        fArr[11] = 1.0;

        for (let i = 0; i < 8; i++) {
            const offset = 12 + i * 16;
            if (i < activeCount) {
                const layer = activeLayers[i];
                // vec4 0: uvOffset (2), uvScale (2)
                fArr[offset + 0] = layer.uvOffset[0];
                fArr[offset + 1] = layer.uvOffset[1];
                fArr[offset + 2] = layer.uvScale[0];
                fArr[offset + 3] = layer.uvScale[1];

                // vec4 1: tintColor (4)
                const tint = layer.tintColor.rgbNormalLinear;
                fArr[offset + 4] = tint[0];
                fArr[offset + 5] = tint[1];
                fArr[offset + 6] = tint[2];
                fArr[offset + 7] = 1.0;

                // vec4 2: roughness, metallic, normalIntensity, enabled
                fArr[offset + 8] = layer.roughness;
                fArr[offset + 9] = layer.metallic;
                fArr[offset + 10] = layer.normalIntensity;
                fArr[offset + 11] = layer.enabled ? 1.0 : 0.0;

                // vec4 3: aoIntensity, weightMapChannelIndex, pad0, pad1
                fArr[offset + 12] = layer.aoIntensity;
                fArr[offset + 13] = layer.weightMapChannelIndex;
                fArr[offset + 14] = 0.0;
                fArr[offset + 15] = 0.0;
            } else {
                for (let j = 0; j < 16; j++) {
                    fArr[offset + j] = 0.0;
                }
            }
        }

        const uniformBuffer = this.acquireUniformBuffer(560);
        device.queue.writeBuffer(uniformBuffer, 0, fArr.buffer, 0, 560);

        const vbtBaseColorStorageView = this.#getStorageTextureView(vbtBaseColorArray.gpuTexture, 0);
        const vbtNormalStorageView = this.#getStorageTextureView(vbtNormalArray.gpuTexture, 0);
        const vbtORMStorageView = this.#getStorageTextureView(vbtORMArray.gpuTexture, 0);

        const bindGroup = device.createBindGroup({
            label: `Landscape_VBT_BindGroup_Slice_${sliceIndex}`,
            layout: this.bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: uniformBuffer}},
                {binding: 1, resource: vhtAtlas.gpuTextureView},
                {binding: 2, resource: vntAtlas.gpuTextureView},
                {binding: 3, resource: material.baseColorTextureSampler.gpuSampler},
                {binding: 4, resource: material.layerBaseColorArray.gpuTextureView},
                {binding: 5, resource: material.layerNormalArray.gpuTextureView},
                {binding: 6, resource: material.layerORMArray.gpuTextureView},
                {binding: 7, resource: material.layerWeightMapArray.gpuTextureView},
                {binding: 8, resource: vbtBaseColorStorageView},
                {binding: 9, resource: vbtNormalStorageView},
                {binding: 10, resource: vbtORMStorageView},
            ]
        });

        this.dispatchBakePass(bindGroup, tileSizePixels, tileSizePixels, originX, originZ);

        this.#dispatchTileMipmaps(
            vbtBaseColorArray.gpuTexture,
            vbtNormalArray.gpuTexture,
            vbtORMArray.gpuTexture,
            originX,
            originZ,
            tileSizePixels,
            6
        );

        console.log(`[LandscapeVBTGenerator 🎨] GPU VBT 3-Set + Tile-Local Mipmaps baked for slice [${sliceIndex}] at (${col}, ${row})`);
    }

    #dispatchTileMipmaps(
        bcTex: GPUTexture,
        normTex: GPUTexture,
        ormTex: GPUTexture,
        originX: number,
        originZ: number,
        tileSizePixels: number,
        maxMipLevels: number = 6
    ): void {
        if (!this.#tileMipPipeline || !this.#tileMipBindGroupLayout) return;
        const device = this.redGPUContext.gpuDevice;

        this.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `Landscape_TileMipmap_Pass_[${originX},${originZ}]`
            });
            pass.setPipeline(this.#tileMipPipeline!);

            for (let m = 1; m < maxMipLevels; m++) {
                const srcOriginX = originX >> (m - 1);
                const srcOriginZ = originZ >> (m - 1);
                const dstOriginX = originX >> m;
                const dstOriginZ = originZ >> m;
                const dstW = Math.max(1, tileSizePixels >> m);
                const dstH = Math.max(1, tileSizePixels >> m);

                const uArr = this.#mipUniformArray;
                uArr[0] = srcOriginX;
                uArr[1] = srcOriginZ;
                uArr[2] = dstOriginX;
                uArr[3] = dstOriginZ;
                uArr[4] = dstW;
                uArr[5] = dstH;
                uArr[6] = 0;
                uArr[7] = 0;

                const mipUniformBuffer = this.acquireUniformBuffer(32);
                device.queue.writeBuffer(mipUniformBuffer, 0, uArr.buffer, 0, 32);

                const srcBcView = this.#getSampleTextureView(bcTex, m - 1);
                const dstBcView = this.#getStorageTextureView(bcTex, m);
                const srcNormView = this.#getSampleTextureView(normTex, m - 1);
                const dstNormView = this.#getStorageTextureView(normTex, m);
                const srcOrmView = this.#getSampleTextureView(ormTex, m - 1);
                const dstOrmView = this.#getStorageTextureView(ormTex, m);

                const mipBindGroup = device.createBindGroup({
                    label: `Landscape_TileMip_BG_Mip_${m}`,
                    layout: this.#tileMipBindGroupLayout!,
                    entries: [
                        {binding: 0, resource: {buffer: mipUniformBuffer}},
                        {binding: 1, resource: srcBcView},
                        {binding: 2, resource: dstBcView},
                        {binding: 3, resource: srcNormView},
                        {binding: 4, resource: dstNormView},
                        {binding: 5, resource: srcOrmView},
                        {binding: 6, resource: dstOrmView},
                    ]
                });

                pass.setBindGroup(0, mipBindGroup);
                pass.dispatchWorkgroups(Math.max(1, Math.ceil(dstW / 16)), Math.max(1, Math.ceil(dstH / 16)));
            }

            pass.end();
        });
    }

    #getStorageTextureView(tex: GPUTexture, mipLevel: number = 0): GPUTextureView {
        let views = this.#storageViewsCache.get(tex);
        if (!views) {
            views = new Map();
            this.#storageViewsCache.set(tex, views);
        }
        let view = views.get(mipLevel);
        if (!view) {
            view = tex.createView({
                dimension: '2d',
                baseMipLevel: mipLevel,
                mipLevelCount: 1,
                label: `Landscape_VBT_StorageView_Mip${mipLevel}`
            });
            views.set(mipLevel, view);
        }
        return view;
    }

    #getSampleTextureView(tex: GPUTexture, mipLevel: number = 0): GPUTextureView {
        let views = this.#sampleViewsCache.get(tex);
        if (!views) {
            views = new Map();
            this.#sampleViewsCache.set(tex, views);
        }
        let view = views.get(mipLevel);
        if (!view) {
            view = tex.createView({
                dimension: '2d',
                baseMipLevel: mipLevel,
                mipLevelCount: 1,
                label: `Landscape_VBT_SampleView_Mip${mipLevel}`
            });
            views.set(mipLevel, view);
        }
        return view;
    }

    #initComputeResources(): void {
        this.initBaseComputePipeline(
            'LandscapeVBTBakeComputeShaderModule',
            vbtBakeShaderCode,
            [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'unfilterable-float', viewDimension: '2d'}
                },
                {binding: 2, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, sampler: {type: 'filtering'}},
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
                {
                    binding: 6,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 7,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'float', viewDimension: '2d-array'}
                },
                {
                    binding: 8,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
                {
                    binding: 9,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
                {
                    binding: 10,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
            ],
            816
        );
    }

    #initTileMipComputeResources(): void {
        const device = this.redGPUContext.gpuDevice;
        if (!device) return;

        const resourceManager = this.redGPUContext.resourceManager;
        const shaderModule = resourceManager.createGPUShaderModule('LandscapeTileMipmapComputeShaderModule', {
            code: tileMipShaderCode
        });

        this.#tileMipBindGroupLayout = device.createBindGroupLayout({
            label: 'LandscapeTileMipmap_BindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
                {binding: 3, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 4,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
                {binding: 5, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'float', viewDimension: '2d'}},
                {
                    binding: 6,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                },
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'LandscapeTileMipmap_PipelineLayout',
            bindGroupLayouts: [this.#tileMipBindGroupLayout]
        });

        this.#tileMipPipeline = device.createComputePipeline({
            label: 'LandscapeTileMipmap_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }
}

export default LandscapeVBTGenerator;
