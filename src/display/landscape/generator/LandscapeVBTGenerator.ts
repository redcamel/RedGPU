import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vbtBakeShaderCode from "../shader/landscapeVBTBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import LandscapeMaterial from "../material/LandscapeMaterial";

/**
 * [KO] 8개 레이어 머티리얼과 VHT/VNT로부터 Texture2DArray 기반 실시간 PBR VBT(BaseColor, Normal, ORM) 3종 세트를 베이킹하는 제너레이터입니다.
 * [EN] Generator that bakes Texture2DArray-based real-time PBR VBT (BaseColor, Normal, ORM) 3-set from 8-layer material and VHT/VNT.
 */
export class LandscapeVBTGenerator extends ALandscapeAtlasGenerator {
    #uniformFloatArray: Float32Array;
    #uniformUintArray: Uint32Array;
    #storageViewCache: WeakMap<GPUTexture, GPUTextureView> = new WeakMap();

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VBT');
        this.#uniformFloatArray = new Float32Array(204); // 816 bytes (204 floats)
        this.#uniformUintArray = new Uint32Array(this.#uniformFloatArray.buffer);
        this.#initComputeResources();
    }

    /**
     * [KO] 특정 타일 영역에 8개 레이어의 PBR 머티리얼 텍스처를 2D 거대 아틀라스에 일괄 사전 베이킹합니다 (Zero-GC).
     * [EN] Batch pre-bakes 8-layer PBR material textures for a specific tile region into 2D mega-atlas (Zero-GC).
     */
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

        // 1. Header (48 bytes: 12 floats / uints)
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

        // 2. Layers[8] (96 bytes per layer = 24 floats each)
        for (let i = 0; i < 8; i++) {
            const offset = 12 + i * 24;
            if (i < activeCount) {
                const layer = activeLayers[i];
                fArr[offset + 0] = layer.uvOffset[0];
                fArr[offset + 1] = layer.uvOffset[1];
                fArr[offset + 2] = layer.uvScaleDetail[0];
                fArr[offset + 3] = layer.uvScaleDetail[1];
                fArr[offset + 4] = layer.uvScaleAtlas[0];
                fArr[offset + 5] = layer.uvScaleAtlas[1];
                fArr[offset + 6] = layer.minVal;
                fArr[offset + 7] = layer.maxVal;

                const tint = layer.tintColor.rgbNormalLinear;
                fArr[offset + 8] = tint[0];
                fArr[offset + 9] = tint[1];
                fArr[offset + 10] = tint[2];
                fArr[offset + 11] = 1.0;

                fArr[offset + 12] = layer.blendFalloff;
                fArr[offset + 13] = layer.blendMode === 'HEIGHT' ? 1.0 : (layer.blendMode === 'WEIGHT_MAP' ? 2.0 : 0.0);
                fArr[offset + 14] = layer.roughness;
                fArr[offset + 15] = layer.metallic;

                fArr[offset + 16] = layer.normalIntensity;
                fArr[offset + 17] = layer.enabled ? 1.0 : 0.0;
                fArr[offset + 18] = layer.aoIntensity;
                fArr[offset + 19] = layer.heightOffset;

                fArr[offset + 20] = layer.heightContrast;
                fArr[offset + 21] = layer.weightMapChannelIndex;
                fArr[offset + 22] = 0.0;
                fArr[offset + 23] = 0.0;
            } else {
                for (let j = 0; j < 24; j++) {
                    fArr[offset + j] = 0.0;
                }
            }
        }

        const uniformBuffer = this.acquireUniformBuffer(816);
        device.queue.writeBuffer(uniformBuffer, 0, fArr.buffer, 0, 816);

        const vbtBaseColorStorageView = this.#getStorageTextureView(vbtBaseColorArray.gpuTexture);
        const vbtNormalStorageView = this.#getStorageTextureView(vbtNormalArray.gpuTexture);
        const vbtORMStorageView = this.#getStorageTextureView(vbtORMArray.gpuTexture);

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
        console.log(`[LandscapeVBTGenerator 🎨] GPU VBT 3-Set (BaseColor/Normal/ORM) baked for slice [${sliceIndex}] at (${col}, ${row})`);
    }

    #getStorageTextureView(tex: GPUTexture): GPUTextureView {
        let view = this.#storageViewCache.get(tex);
        if (!view) {
            view = tex.createView({
                dimension: '2d',
                baseMipLevel: 0,
                mipLevelCount: 1,
                label: `Landscape_VBT_StorageView_Mip0`
            });
            this.#storageViewCache.set(tex, view);
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
}

export default LandscapeVBTGenerator;
