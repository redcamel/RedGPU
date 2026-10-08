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
import LandscapeMaterial from "../../LandscapeMaterial";
import LandscapeLayer from "../../LandscapeLayer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

/**
 * [KO] 스플랫 레이어 머티리얼과 VNT 아틀라스를 합성하여 지형 타일별 베이스컬러/노멀/ORM 아틀라스를 베이킹하는 제너레이터 클래스입니다.
 * [EN] Generator class that combines splat layer materials and VNT atlases to bake per-tile base color, normal, and ORM atlases.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **다중 레이어 스플래팅 융합 (VBT Bake)**: 가중치 맵(Weight Map)과 최대 다수의 지형 텍스처 레이어(Diffuse, Normal, ORM)를 VNT 지형 노멀과 조합하여 고해상도 단일 가상 베이스 텍스처(VBT) 아틀라스로 합성합니다.
 * - **타일 단위 GPU 밉맵 생성 (`Tile Mipmap`)**: 가상 텍스처에서 이웃 타일 간의 샘플링 번짐(Bleeding) 아티팩트를 방지하기 위해, 각 타일의 경계 내에서 독립적인 다운샘플링 밉체인을 GPU Compute 셰이더(`landscapeTileMipmap.wgsl`)로 고속 빌드합니다.
 * - **리소스 뷰 캐싱 및 무할당 렌더링**: `WeakMap` 기반의 텍스처 뷰 및 바인드 그룹 캐시를 활용하여 매 베이킹 호출 시 GC 압박 없는 극대화된 렌더링 성능을 보장합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Multi-layer Splatting Fusion (VBT Bake)**: Blends weight maps and multiple terrain texture layers (Diffuse, Normal, ORM) with VNT terrain normals to composite high-resolution unified Virtual Base Texture (VBT) atlases.
 * - **Tile-level GPU Mipmap Generation (`Tile Mipmap`)**: Builds independent downsampled mip-chains within each tile boundary using GPU compute shaders (`landscapeTileMipmap.wgsl`) to prevent cross-tile texture bleeding artifacts in virtual texturing.
 * - **Resource View Caching & Allocation-free Execution**: Employs `WeakMap`-based caches for texture views and bind groups to ensure maximum baking throughput without GC pressure.
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
     * [KO] 전체 VNT 아틀라스 영역에 대해 모든 지형 타일의 VBT 베이스컬러/노멀/ORM 아틀라스를 일괄 베이킹합니다.
     * [EN] Bakes VBT base color, normal, and ORM atlases for all terrain tiles across the entire VNT atlas region in a single batch.
     *
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
     * @param singleTilePixels -
     * [KO] 단일 타일 해상도 (픽셀, 기본값: 256)
     * [EN] Single tile resolution in pixels (default: 256)
     */
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

    /**
     * [KO] 타일 밉맵 유니폼 버퍼 및 컴퓨트 파이프라인 자원을 해제하고 파기합니다.
     * [EN] Releases and destroys tile mipmap uniform buffers and compute pipeline resources.
     */
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
