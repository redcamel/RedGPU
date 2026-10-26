import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vbtBakeShaderCode from "../shader/landscapeVBTBake.wgsl";
import tileMipShaderCode from "../shader/landscapeTileMipmap.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import LandscapeMaterial from "../../LandscapeMaterial";
import LandscapeLayer from "../../LandscapeLayer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 지형 머티리얼의 다중 레이어를 합성하여 가상 블렌드 텍스처(VBT: BaseColor, Normal, ORM) 아틀라스와 밉맵 체인을 생성하는 클래스입니다.
 * [EN] Class that composites multiple terrain material layers to generate Virtual Blend Texture (VBT: BaseColor, Normal, ORM) atlases and mipmap chains.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Landscape
 */
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

    /**
     * [KO] `LandscapeVBTGenerator` 인스턴스를 초기화합니다.
     * [EN] Initializes a `LandscapeVBTGenerator` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VBT', 8);
        this.#initComputeResources();
        this.#initTileMipComputeResources();
    }

    /**
     * [KO] VNT 아틀라스와 `LandscapeMaterial`의 레이어 데이터를 기반으로 전체 VBT 아틀라스(BaseColor, Normal, ORM) 및 밉맵을 베이킹합니다.
     * [EN] Bakes the full VBT atlases (BaseColor, Normal, ORM) and mipmaps based on the VNT atlas and layer data of `LandscapeMaterial`.
     *
     * @param vntAtlas -
     * [KO] 가상 노멀 텍스처(VNT) 아틀라스
     * [EN] Virtual Normal Texture (VNT) atlas
     * @param vbtAtlas -
     * [KO] 베이킹 결과를 저장할 3-레이어 VBT(BaseColor, Normal, ORM) 아틀라스 텍스처
     * [EN] 3-layer VBT (BaseColor, Normal, ORM) atlas texture to store the baked result
     * @param material -
     * [KO] 합성할 레이어 정보를 가진 `LandscapeMaterial` 인스턴스
     * [EN] `LandscapeMaterial` instance containing layer information to composite
     * @param singleTilePixels -
     * [KO] 단일 타일당 픽셀 해상도 (기본값: `256`)
     * [EN] Pixel resolution per single tile (default: `256`)
     */
    bakeAtlas(
        vntAtlas: DirectTexture,
        vbtAtlas: DirectTexture,
        material: LandscapeMaterial,
        singleTilePixels: number = 256
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vntAtlas?.gpuTexture) return;
        if (!vbtAtlas?.gpuTexture) return;

        const {gpuDevice} = this.redGPUContext;
        const vbtGpuTexture = vbtAtlas.gpuTexture;
        const {width, height} = vbtGpuTexture;

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

        const vbtBaseColorStorageView = this.#getStorageTextureView(vbtGpuTexture, 0, 0);
        const vbtNormalStorageView = this.#getStorageTextureView(vbtGpuTexture, 0, 1);
        const vbtORMStorageView = this.#getStorageTextureView(vbtGpuTexture, 0, 2);

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
            vbtGpuTexture,
            0,
            0,
            width,
            6
        );
    }

    /**
     * [KO] VBT 베이킹 및 타일 밉맵 생성에 사용된 GPU 버퍼와 캐시를 모두 해제합니다.
     * [EN] Releases all GPU buffers and caches used for VBT baking and tile mipmap generation.
     */
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
        vbtTex: GPUTexture,
        mipLevel: number
    ): GPUBindGroup {
        let bgMap = this.#tileMipBindGroupsCache.get(vbtTex);
        if (!bgMap) {
            bgMap = new Map();
            this.#tileMipBindGroupsCache.set(vbtTex, bgMap);
        }
        let bindGroup = bgMap.get(mipLevel);
        if (!bindGroup) {
            const mipUniformBuffer = this.#getOrCreateTileMipUniformBuffer(mipLevel);
            const srcBcView = this.#getSampleTextureView(vbtTex, mipLevel - 1, 0);
            const dstBcView = this.#getStorageTextureView(vbtTex, mipLevel, 0);
            const srcNormView = this.#getSampleTextureView(vbtTex, mipLevel - 1, 1);
            const dstNormView = this.#getStorageTextureView(vbtTex, mipLevel, 1);
            const srcOrmView = this.#getSampleTextureView(vbtTex, mipLevel - 1, 2);
            const dstOrmView = this.#getStorageTextureView(vbtTex, mipLevel, 2);

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

    #getStorageTextureView(tex: GPUTexture, mipLevel: number = 0, arrayLayer: number = 0): GPUTextureView {
        let views = this.#storageViewsCache.get(tex);
        if (!views) {
            views = new Map();
            this.#storageViewsCache.set(tex, views);
        }
        const key = (mipLevel << 8) | arrayLayer;
        let view = views.get(key);
        if (!view) {
            view = tex.createView({
                dimension: '2d',
                baseMipLevel: mipLevel,
                mipLevelCount: 1,
                baseArrayLayer: arrayLayer,
                arrayLayerCount: 1,
                label: `Landscape_VBT_StorageView_L${arrayLayer}_Mip${mipLevel}`
            });
            views.set(key, view);
        }
        return view;
    }

    #getSampleTextureView(tex: GPUTexture, mipLevel: number = 0, arrayLayer: number = 0): GPUTextureView {
        let views = this.#sampleViewsCache.get(tex);
        if (!views) {
            views = new Map();
            this.#sampleViewsCache.set(tex, views);
        }
        const key = (mipLevel << 8) | arrayLayer;
        let view = views.get(key);
        if (!view) {
            view = tex.createView({
                dimension: '2d',
                baseMipLevel: mipLevel,
                mipLevelCount: 1,
                baseArrayLayer: arrayLayer,
                arrayLayerCount: 1,
                label: `Landscape_VBT_SampleView_L${arrayLayer}_Mip${mipLevel}`
            });
            views.set(key, view);
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
        vbtTex: GPUTexture,
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

                const mipBindGroup = this.#getOrCreateTileMipBindGroup(vbtTex, m);

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
