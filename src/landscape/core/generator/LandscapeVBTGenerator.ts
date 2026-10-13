import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vbtBakeShaderCode from "../shader/landscapeVBTBake.wgsl";
import tileMipShaderCode from "../shader/landscapeTileMipmap.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import LandscapeMaterial from "../../LandscapeMaterial";
import LandscapeLayer from "../../LandscapeLayer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

class LandscapeVBTGenerator extends ALandscapeAtlasGenerator {
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

    bakeAtlas(
        vntAtlas: DirectTexture,
        vbtBaseColorArray: DirectTexture,
        vbtNormalArray: DirectTexture,
        vbtORMArray: DirectTexture,
        material: LandscapeMaterial,
        singleTilePixels: number = 256
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vntAtlas?.gpuTexture) return;
        if (!vbtBaseColorArray?.gpuTexture || !vbtNormalArray?.gpuTexture || !vbtORMArray?.gpuTexture) return;

        const {gpuDevice} = this.redGPUContext;
        const {width, height} = vbtBaseColorArray.gpuTexture;

        const fArr = this.#uniformFloatArray;
        const uArr = this.#uniformUintArray;

        fArr[0] = 0;
        fArr[1] = 0;
        fArr[2] = width;
        fArr[3] = height;
        fArr[4] = width;
        fArr[5] = height;

        const activeLayers = material.layers;
        const activeCount = Math.min(8, activeLayers.length);
        uArr[6] = activeCount;
        fArr[7] = singleTilePixels;

        const [bcR, bcG, bcB] = material.baseColor ? material.baseColor.rgbNormalLinear : [0.22, 0.49, 0.26];
        fArr[8] = bcR;
        fArr[9] = bcG;
        fArr[10] = bcB;
        fArr[11] = 1.0;

        for (let i = 0; i < 8; i++) {
            const offset = 12 + i * LandscapeLayer.UNIFORM_FLOAT_COUNT;
            if (i < activeCount) {
                activeLayers[i].writeUniformData(fArr, offset);
            } else {
                LandscapeLayer.writeZeroUniformData(fArr, offset);
            }
        }

        const uniformBuffer = this.acquireUniformBuffer(this.#vbtUniformByteLength);
        gpuDevice.queue.writeBuffer(uniformBuffer, 0, fArr.buffer, 0, this.#vbtUniformByteLength);

        const vbtBaseColorStorageView = this.#getStorageTextureView(vbtBaseColorArray.gpuTexture, 0);
        const vbtNormalStorageView = this.#getStorageTextureView(vbtNormalArray.gpuTexture, 0);
        const vbtORMStorageView = this.#getStorageTextureView(vbtORMArray.gpuTexture, 0);

        const {baseColorView, normalView, ormView, weightMapView} = material.getInternalLayerViews();
        const bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_VBT_BindGroup_FullAtlas`,
            layout: this.bindGroupLayout,
            entries: [
                {binding: 0, resource: {buffer: uniformBuffer}},
                {binding: 1, resource: vntAtlas.gpuTextureView},
                {binding: 2, resource: material.baseColorTextureSampler.gpuSampler},
                {binding: 3, resource: baseColorView!},
                {binding: 4, resource: normalView!},
                {binding: 5, resource: ormView!},
                {binding: 6, resource: weightMapView!},
                {binding: 7, resource: vbtBaseColorStorageView},
                {binding: 8, resource: vbtNormalStorageView},
                {binding: 9, resource: vbtORMStorageView},
            ]
        });

        this.dispatchBakePass(bindGroup, width, height, 0, 0);

        this.#dispatchTileMipmaps(
            vbtBaseColorArray.gpuTexture,
            vbtNormalArray.gpuTexture,
            vbtORMArray.gpuTexture,
            0,
            0,
            width,
            6
        );
    }

    override destroy(): void {
        const count = this.#tileMipUniformBuffers.length;
        for (let i = 0; i < count; i++) {
            try {
                this.#tileMipUniformBuffers[i].destroy();
            } catch {
            }
        }
        this.#tileMipUniformBuffers.length = 0;
        this.#tileMipPipeline = null;
        this.#tileMipBindGroupLayout = null;
        this.#storageViewsCache = new WeakMap();
        this.#sampleViewsCache = new WeakMap();
        this.#tileMipBindGroupsCache = new WeakMap();
        super.destroy();
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
        const {gpuDevice, resourceManager} = this.redGPUContext;
        if (!gpuDevice) return;

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
        this.#tileMipBindGroupLayout = resourceManager.createBindGroupLayout(
            'Landscape_TileMipmap_BindGroupLayout',
            descriptor
        );

        const pipelineLayout = resourceManager.createGPUPipelineLayout(
            'Landscape_TileMipmap_PipelineLayout',
            {
                bindGroupLayouts: [this.#tileMipBindGroupLayout]
            }
        );

        this.#tileMipPipeline = gpuDevice.createComputePipeline({
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
        const {gpuDevice} = this.redGPUContext;

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
                gpuDevice.queue.writeBuffer(mipUniformBuffer, 0, uArr.buffer, 0, this.#tileMipUniformByteLength);

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

