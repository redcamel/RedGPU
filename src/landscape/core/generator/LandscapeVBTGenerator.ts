/**
 * [KO] 지형 가상 베이스 텍스처(VBT) 아틀라스 베이킹 제너레이터 모듈입니다.
 * [EN] Terrain virtual base texture (VBT) atlas baking generator module.
 * @packageDocumentation
 */
import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vbtBakeShaderCode from "../shader/landscapeVBTBake.wgsl";
import tileMipShaderCode from "../shader/landscapeTileMipmap.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import LandscapeMaterial from "../material/LandscapeMaterial";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 스플랫 레이어 머티리얼과 VNT 아틀라스를 합성하여 지형 타일별 베이스컬러/노멀/ORM 아틀라스를 베이킹하는 제너레이터 클래스입니다.
 * [EN] Generator class that combines splat layer materials and VNT atlases to bake per-tile base color, normal, and ORM atlases.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(LandscapeTileStreamer)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (LandscapeTileStreamer).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export class LandscapeVBTGenerator extends ALandscapeAtlasGenerator {
    #uniformFloatArray: Float32Array;
    #uniformUintArray: Uint32Array;
    #mipUniformArray: Uint32Array;

    #vbtUniformByteLength: number = 0;
    #tileMipUniformByteLength: number = 0;

    #storageViewsCache: WeakMap<GPUTexture, Map<number, GPUTextureView>> = new WeakMap();
    #sampleViewsCache: WeakMap<GPUTexture, Map<number, GPUTextureView>> = new WeakMap();
    #tileMipBindGroupsCache: WeakMap<GPUTexture, Map<number, GPUBindGroup>> = new WeakMap();
    #tileMipUniformBuffers: GPUBuffer[] = [];

    #tileMipPipeline: GPUComputePipeline | null = null;
    #tileMipBindGroupLayout: GPUBindGroupLayout | null = null;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VBT');
        this.#initComputeResources();
        this.#initTileMipComputeResources();
    }

    /**
     * [KO] 특정 타일 영역에 대해 VNT 노멀 데이터와 스플랫 머티리얼을 기반으로 VBT 베이스컬러/노멀/ORM 아틀라스를 베이킹합니다.
     * [EN] Bakes VBT base color, normal, and ORM atlases for a specific tile region based on VNT normals and splat materials.
     * @param vntAtlas -
     * [KO] 지형 가상 노멀 텍스처 (VNT) 아틀라스
     * [EN] Terrain virtual normal texture (VNT) atlas
     * @param vbtBaseColorArray -
     * [KO] 베이킹 결과를 저장할 베이스컬러 DirectTexture
     * [EN] Base color DirectTexture to store bake result
     * @param vbtNormalArray -
     * [KO] 베이킹 결과를 저장할 노멀 DirectTexture
     * [EN] Normal DirectTexture to store bake result
     * @param vbtORMArray -
     * [KO] 베이킹 결과를 저장할 ORM DirectTexture
     * [EN] ORM DirectTexture to store bake result
     * @param material -
     * [KO] 지형 머티리얼 인스턴스
     * [EN] Landscape material instance
     * @param col -
     * [KO] 타일 열(X) 인덱스
     * [EN] Tile column (X) index
     * @param row -
     * [KO] 타일 행(Z) 인덱스
     * [EN] Tile row (Z) index
     * @param tileSizePixels -
     * [KO] 타일 해상도 (픽셀, 기본값: 512)
     * [EN] Tile resolution in pixels (default: 512)
     */
    bakeTileRegion(
        vntAtlas: DirectTexture,
        vbtBaseColorArray: DirectTexture,
        vbtNormalArray: DirectTexture,
        vbtORMArray: DirectTexture,
        material: LandscapeMaterial,
        col: number,
        row: number,
        tileSizePixels: number = 512
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vntAtlas?.gpuTexture) return;
        if (!vbtBaseColorArray?.gpuTexture || !vbtNormalArray?.gpuTexture || !vbtORMArray?.gpuTexture) return;

        const device = this.redGPUContext.gpuDevice;
        const atlasW = vntAtlas.gpuTexture.width;
        const atlasH = vntAtlas.gpuTexture.height;

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

        const activeLayers = material.layers;
        const activeCount = Math.min(8, activeLayers.length);
        uArr[6] = activeCount;
        fArr[7] = tileSizePixels;

        const baseColorRGBA = material.baseColor ? material.baseColor.rgbNormalLinear : [0.22, 0.49, 0.26];
        fArr[8] = baseColorRGBA[0];
        fArr[9] = baseColorRGBA[1];
        fArr[10] = baseColorRGBA[2];
        fArr[11] = 1.0;

        for (let i = 0; i < 8; i++) {
            const offset = 12 + i * 12;
            if (i < activeCount) {
                const layer = activeLayers[i];

                fArr[offset + 0] = layer.uvOffset[0];
                fArr[offset + 1] = layer.uvOffset[1];
                fArr[offset + 2] = layer.uvScale[0];
                fArr[offset + 3] = layer.uvScale[1];

                fArr[offset + 4] = layer.roughness;
                fArr[offset + 5] = layer.metallic;
                fArr[offset + 6] = layer.normalIntensity;
                fArr[offset + 7] = layer.enabled ? 1.0 : 0.0;

                fArr[offset + 8] = layer.aoIntensity;
                fArr[offset + 9] = layer.weightChannelIndex;
                fArr[offset + 10] = layer.nearUVScaleMultiplier;
                fArr[offset + 11] = 0.0;
            } else {
                for (let j = 0; j < 12; j++) {
                    fArr[offset + j] = 0.0;
                }
            }
        }

        const uniformBuffer = this.acquireUniformBuffer(this.#vbtUniformByteLength);
        device.queue.writeBuffer(uniformBuffer, 0, fArr.buffer, 0, this.#vbtUniformByteLength);

        const vbtBaseColorStorageView = this.#getStorageTextureView(vbtBaseColorArray.gpuTexture, 0);
        const vbtNormalStorageView = this.#getStorageTextureView(vbtNormalArray.gpuTexture, 0);
        const vbtORMStorageView = this.#getStorageTextureView(vbtORMArray.gpuTexture, 0);

        const layerViews = material.getInternalLayerViews();
        const bindGroup = device.createBindGroup({
            label: `Landscape_VBT_BindGroup_${col}_${row}`,
            layout: this.bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: uniformBuffer}},
                {binding: 1, resource: vntAtlas.gpuTextureView},
                {binding: 2, resource: material.baseColorTextureSampler.gpuSampler},
                {binding: 3, resource: layerViews.baseColorView!},
                {binding: 4, resource: layerViews.normalView!},
                {binding: 5, resource: layerViews.ormView!},
                {binding: 6, resource: layerViews.weightMapView!},
                {binding: 7, resource: vbtBaseColorStorageView},
                {binding: 8, resource: vbtNormalStorageView},
                {binding: 9, resource: vbtORMStorageView},
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
    }

    bakeAtlas(
        vntAtlas: DirectTexture,
        vbtBaseColorArray: DirectTexture,
        vbtNormalArray: DirectTexture,
        vbtORMArray: DirectTexture,
        material: LandscapeMaterial,
        singleTilePixels: number = 512
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vntAtlas?.gpuTexture) return;
        if (!vbtBaseColorArray?.gpuTexture || !vbtNormalArray?.gpuTexture || !vbtORMArray?.gpuTexture) return;

        const device = this.redGPUContext.gpuDevice;
        const atlasW = vntAtlas.gpuTexture.width;
        const atlasH = vntAtlas.gpuTexture.height;

        const fArr = this.#uniformFloatArray;
        const uArr = this.#uniformUintArray;

        fArr[0] = 0;
        fArr[1] = 0;
        fArr[2] = atlasW;
        fArr[3] = atlasH;
        fArr[4] = atlasW;
        fArr[5] = atlasH;

        const activeLayers = material.layers;
        const activeCount = Math.min(8, activeLayers.length);
        uArr[6] = activeCount;
        fArr[7] = singleTilePixels;

        const baseColorRGBA = material.baseColor ? material.baseColor.rgbNormalLinear : [0.22, 0.49, 0.26];
        fArr[8] = baseColorRGBA[0];
        fArr[9] = baseColorRGBA[1];
        fArr[10] = baseColorRGBA[2];
        fArr[11] = 1.0;

        for (let i = 0; i < 8; i++) {
            const offset = 12 + i * 12;
            if (i < activeCount) {
                const layer = activeLayers[i];

                fArr[offset + 0] = layer.uvOffset[0];
                fArr[offset + 1] = layer.uvOffset[1];
                fArr[offset + 2] = layer.uvScale[0];
                fArr[offset + 3] = layer.uvScale[1];

                fArr[offset + 4] = layer.roughness;
                fArr[offset + 5] = layer.metallic;
                fArr[offset + 6] = layer.normalIntensity;
                fArr[offset + 7] = layer.enabled ? 1.0 : 0.0;

                fArr[offset + 8] = layer.aoIntensity;
                fArr[offset + 9] = layer.weightChannelIndex;
                fArr[offset + 10] = layer.nearUVScaleMultiplier;
                fArr[offset + 11] = 0.0;
            } else {
                for (let j = 0; j < 12; j++) {
                    fArr[offset + j] = 0.0;
                }
            }
        }

        const uniformBuffer = this.acquireUniformBuffer(this.#vbtUniformByteLength);
        device.queue.writeBuffer(uniformBuffer, 0, fArr.buffer, 0, this.#vbtUniformByteLength);

        const vbtBaseColorStorageView = this.#getStorageTextureView(vbtBaseColorArray.gpuTexture, 0);
        const vbtNormalStorageView = this.#getStorageTextureView(vbtNormalArray.gpuTexture, 0);
        const vbtORMStorageView = this.#getStorageTextureView(vbtORMArray.gpuTexture, 0);

        const layerViews = material.getInternalLayerViews();
        const bindGroup = device.createBindGroup({
            label: `Landscape_VBT_BindGroup_FullAtlas`,
            layout: this.bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: uniformBuffer}},
                {binding: 1, resource: vntAtlas.gpuTextureView},
                {binding: 2, resource: material.baseColorTextureSampler.gpuSampler},
                {binding: 3, resource: layerViews.baseColorView!},
                {binding: 4, resource: layerViews.normalView!},
                {binding: 5, resource: layerViews.ormView!},
                {binding: 6, resource: layerViews.weightMapView!},
                {binding: 7, resource: vbtBaseColorStorageView},
                {binding: 8, resource: vbtNormalStorageView},
                {binding: 9, resource: vbtORMStorageView},
            ]
        });

        this.dispatchBakePass(bindGroup, atlasW, atlasH, 0, 0);

        this.#dispatchTileMipmaps(
            vbtBaseColorArray.gpuTexture,
            vbtNormalArray.gpuTexture,
            vbtORMArray.gpuTexture,
            0,
            0,
            atlasW,
            6
        );
    }

    override destroy(): void {
        super.destroy();
        for (let i = 0; i < this.#tileMipUniformBuffers.length; i++) {
            this.#tileMipUniformBuffers[i]?.destroy();
        }
        this.#tileMipUniformBuffers = [];
        this.#tileMipPipeline = null;
        this.#tileMipBindGroupLayout = null;
    }

    #getOrCreateTileMipUniformBuffer(mipLevel: number): GPUBuffer {
        let buffer = this.#tileMipUniformBuffers[mipLevel];
        if (!buffer) {
            buffer = this.redGPUContext.gpuDevice.createBuffer({
                label: `Landscape_TileMip_UniformBuffer_Mip${mipLevel}`,
                size: Math.max(16, this.#tileMipUniformByteLength),
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
            });
            this.#tileMipUniformBuffers[mipLevel] = buffer;
        }
        return buffer;
    }

    #getOrCreateTileMipBindGroup(
        bcTex: GPUTexture,
        normTex: GPUTexture,
        ormTex: GPUTexture,
        mipLevel: number
    ): GPUBindGroup {
        let bgMap = this.#tileMipBindGroupsCache.get(bcTex);
        if (!bgMap) {
            bgMap = new Map();
            this.#tileMipBindGroupsCache.set(bcTex, bgMap);
        }
        let bindGroup = bgMap.get(mipLevel);
        if (!bindGroup) {
            const mipUniformBuffer = this.#getOrCreateTileMipUniformBuffer(mipLevel);
            const srcBcView = this.#getSampleTextureView(bcTex, mipLevel - 1);
            const dstBcView = this.#getStorageTextureView(bcTex, mipLevel);
            const srcNormView = this.#getSampleTextureView(normTex, mipLevel - 1);
            const dstNormView = this.#getStorageTextureView(normTex, mipLevel);
            const srcOrmView = this.#getSampleTextureView(ormTex, mipLevel - 1);
            const dstOrmView = this.#getStorageTextureView(ormTex, mipLevel);

            bindGroup = this.redGPUContext.gpuDevice.createBindGroup({
                label: `Landscape_TileMip_BindGroup_Mip${mipLevel}`,
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
            bgMap.set(mipLevel, bindGroup);
        }
        return bindGroup;
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
        const resourceManager = this.redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('LandscapeVBTBakeComputeShaderModule', vbtBakeShaderCode);
        this.#vbtUniformByteLength = shaderInfo.uniforms.uniforms?.arrayBufferByteLength || 0;

        this.#uniformFloatArray = new Float32Array(this.#vbtUniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#uniformUintArray = new Uint32Array(this.#uniformFloatArray.buffer);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0);

        this.initBaseComputePipeline(
            'Landscape_VBT_Bake_ShaderModule',
            vbtBakeShaderCode,
            descriptor.entries as GPUBindGroupLayoutEntry[],
            this.#vbtUniformByteLength
        );
    }

    #initTileMipComputeResources(): void {
        const device = this.redGPUContext.gpuDevice;
        if (!device) return;

        const resourceManager = this.redGPUContext.resourceManager;
        const mipShaderInfo = resourceManager.wgslParser.parse('Landscape_TileMipmap_ShaderModule', tileMipShaderCode);
        this.#tileMipUniformByteLength = mipShaderInfo.uniforms.params?.arrayBufferByteLength || 0;

        this.#mipUniformArray = new Uint32Array(this.#tileMipUniformByteLength / Uint32Array.BYTES_PER_ELEMENT);

        let shaderModule = resourceManager.getGPUShaderModule('Landscape_TileMipmap_ShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('Landscape_TileMipmap_ShaderModule', {
                code: tileMipShaderCode
            });
        }

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(mipShaderInfo, 0);
        this.#tileMipBindGroupLayout = device.createBindGroupLayout({
            label: 'Landscape_TileMipmap_BindGroupLayout',
            ...descriptor
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'Landscape_TileMipmap_PipelineLayout',
            bindGroupLayouts: [this.#tileMipBindGroupLayout]
        });

        this.#tileMipPipeline = device.createComputePipeline({
            label: 'Landscape_TileMipmap_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
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

                const mipUniformBuffer = this.#getOrCreateTileMipUniformBuffer(m);
                device.queue.writeBuffer(mipUniformBuffer, 0, uArr.buffer, 0, this.#tileMipUniformByteLength);

                const mipBindGroup = this.#getOrCreateTileMipBindGroup(bcTex, normTex, ormTex, m);

                const pass = commandEncoder.beginComputePass({
                    label: `Landscape_TileMipmap_Pass_Level_${m}_[${originX},${originZ}]`
                });
                pass.setPipeline(this.#tileMipPipeline!);
                pass.setBindGroup(0, mipBindGroup);
                pass.dispatchWorkgroups(Math.max(1, Math.ceil(dstW / 16)), Math.max(1, Math.ceil(dstH / 16)));
                pass.end();
            }
        });
    }
}

Object.freeze(LandscapeVBTGenerator);
export default LandscapeVBTGenerator;
