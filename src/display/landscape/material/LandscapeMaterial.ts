import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import AUVTransformBaseMaterial from "../../../material/core/AUVTransformBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import landscapeFragmentSource from "../shader/landscapeFragment.wgsl";
import LandscapeLayer from "./LandscapeLayer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import defineColorRGBA from "../../../defineProperty/funcs/color/defineColorRGBA";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

const MAX_LANDSCAPE_LAYERS = 8;

interface LandscapeMaterial {
    color: ColorRGBA;
    baseColorTextureSampler: Sampler;
}

class LandscapeMaterial extends AUVTransformBaseMaterial {
    #layers: LandscapeLayer[] = [];
    #textureArraySize: number = 1024;

    #gpuBaseColorArrayTexture: GPUTexture | null = null;
    #gpuNormalArrayTexture: GPUTexture | null = null;
    #gpuORMArrayTexture: GPUTexture | null = null;
    #gpuWeightMapArrayTexture: GPUTexture | null = null;

    #baseColorArrayView: GPUTextureView | null = null;
    #normalArrayView: GPUTextureView | null = null;
    #ormArrayView: GPUTextureView | null = null;
    #weightMapArrayView: GPUTextureView | null = null;

    #textureArrayVersion: number = 0;

    #uniformByteLength: number = 0;
    #uniformFloatArray: Float32Array;
    #uniformUintArray: Uint32Array;

    constructor(redGPUContext: RedGPUContext, colorHex: string = '#387d42', textureArraySize: number = 1024) {
        super(
            redGPUContext,
            'LANDSCAPE_MATERIAL',
            landscapeFragmentSource,
            2
        );

        this.#textureArraySize = Math.max(128, textureArraySize);

        // WGSLParser 리플렉션으로부터 MaterialUniforms 구조체 크기 동적 추출
        this.#uniformByteLength = this.UNIFORM_STRUCT?.arrayBufferByteLength || this.SHADER_INFO?.uniforms?.uniforms?.arrayBufferByteLength || 0;
        this.#uniformFloatArray = new Float32Array(this.#uniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#uniformUintArray = new Uint32Array(this.#uniformFloatArray.buffer);

        this.#initDummyTextureArrays();

        this.baseColorTextureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,

        });

        this.color.setColorByHEX(colorHex);
        this.initGPURenderInfos();
    }

    get layers(): readonly LandscapeLayer[] {
        return this.#layers;
    }

    get textureArraySize(): number {
        return this.#textureArraySize;
    }

    onRebakeVBTRequested?: () => void;
    #isRebakeScheduled: boolean = false;
    #rebakeDebounceTimer: any = null;

    get layerBaseColorArray(): { gpuTexture: GPUTexture | null, gpuTextureView: GPUTextureView | null } {
        return {gpuTexture: this.#gpuBaseColorArrayTexture, gpuTextureView: this.#baseColorArrayView};
    }

    get layerNormalArray(): { gpuTexture: GPUTexture | null, gpuTextureView: GPUTextureView | null } {
        return {gpuTexture: this.#gpuNormalArrayTexture, gpuTextureView: this.#normalArrayView};
    }

    get layerORMArray(): { gpuTexture: GPUTexture | null, gpuTextureView: GPUTextureView | null } {
        return {gpuTexture: this.#gpuORMArrayTexture, gpuTextureView: this.#ormArrayView};
    }

    get layerWeightMapArray(): { gpuTexture: GPUTexture | null, gpuTextureView: GPUTextureView | null } {
        return {gpuTexture: this.#gpuWeightMapArrayTexture, gpuTextureView: this.#weightMapArrayView};
    }

    requestVBTRebake(immediate: boolean = false, debounceDelayMs: number = 150): void {
        if (immediate) {
            if (this.#rebakeDebounceTimer !== null) {
                clearTimeout(this.#rebakeDebounceTimer);
                this.#rebakeDebounceTimer = null;
            }
            if (this.#isRebakeScheduled) return;
            this.#isRebakeScheduled = true;
            queueMicrotask(() => {
                this.#isRebakeScheduled = false;
                this.onRebakeVBTRequested?.();
            });
            return;
        }

        if (this.#rebakeDebounceTimer !== null) {
            clearTimeout(this.#rebakeDebounceTimer);
        }
        this.#rebakeDebounceTimer = setTimeout(() => {
            this.#rebakeDebounceTimer = null;
            this.onRebakeVBTRequested?.();
        }, debounceDelayMs);
    }

    addLayer(layer: LandscapeLayer): this {
        if (this.#layers.length >= MAX_LANDSCAPE_LAYERS) {
            console.warn(`[LandscapeMaterial] Maximum layer count (${MAX_LANDSCAPE_LAYERS}) reached.`);
            return this;
        }
        if (this.#layers.includes(layer)) return this;

        layer.resolvePendingTextures(this.redGPUContext);
        this.#layers.push(layer);
        layer.onChange = () => {
            this.updateUniformsData();
            this.requestVBTRebake(false, 150);
        };
        layer.dirty = true;
        this.dirtyPipeline = true;
        this.#rebuildTextureArrays();
        this.updateUniformsData();
        return this;
    }

    removeLayer(layer: LandscapeLayer | string): boolean {
        const idx = typeof layer === 'string'
            ? this.#layers.findIndex(l => l.name === layer)
            : this.#layers.indexOf(layer);
        if (idx !== -1) {
            const removed = this.#layers.splice(idx, 1)[0];
            removed.onChange = undefined;
            this.dirtyPipeline = true;
            this.#textureArrayVersion++;
            this.#rebuildTextureArrays();
            this.updateUniformsData();
            return true;
        }
        return false;
    }

    clearLayers(): void {
        for (const l of this.#layers) {
            l.onChange = undefined;
        }
        this.#layers.length = 0;
        this.#textureArrayVersion++;
        this.updateUniformsData();
    }

    getLayer(layerName: string): LandscapeLayer | undefined {
        return this.#layers.find(l => l.name === layerName);
    }

    updateUniformsData(): void {
        const floatBuf = this.#uniformFloatArray;
        const uintBuf = this.#uniformUintArray;

        const activeCount = this.#layers.length;
        uintBuf[0] = activeCount;
        uintBuf[1] = 0;
        uintBuf[2] = 0;
        uintBuf[3] = 0;

        const colorLinear = this.color ? this.color.rgbaNormalLinear : [0.22, 0.49, 0.26, 1.0];
        floatBuf[4] = colorLinear[0];
        floatBuf[5] = colorLinear[1];
        floatBuf[6] = colorLinear[2];
        floatBuf[7] = colorLinear[3];

        let offset = 8;
        for (let i = 0; i < MAX_LANDSCAPE_LAYERS; i++) {
            if (i < activeCount) {
                const layer = this.#layers[i];
                // vec4 0: uvOffset (2), uvScale (2)
                floatBuf[offset + 0] = layer.uvOffset[0];
                floatBuf[offset + 1] = layer.uvOffset[1];
                floatBuf[offset + 2] = layer.uvScale[0];
                floatBuf[offset + 3] = layer.uvScale[1];

                // vec4 1: tintColor (4)
                const layerColorLinear = layer.tintColor ? layer.tintColor.rgbaNormalLinear : [1, 1, 1, 1];
                floatBuf[offset + 4] = layerColorLinear[0];
                floatBuf[offset + 5] = layerColorLinear[1];
                floatBuf[offset + 6] = layerColorLinear[2];
                floatBuf[offset + 7] = layerColorLinear[3];

                // vec4 2: roughness, metallic, normalIntensity, enabled
                floatBuf[offset + 8] = layer.roughness;
                floatBuf[offset + 9] = layer.metallic;
                floatBuf[offset + 10] = layer.normalIntensity;
                floatBuf[offset + 11] = layer.enabled ? 1.0 : 0.0;

                // vec4 3: aoIntensity, weightMapChannelIndex, pad0, pad1
                floatBuf[offset + 12] = layer.aoIntensity;
                floatBuf[offset + 13] = layer.weightMapChannelIndex;
                floatBuf[offset + 14] = 0.0;
                floatBuf[offset + 15] = 0.0;
            } else {
                floatBuf.fill(0, offset, offset + 16);
            }
            offset += 16;
        }

        const fragRenderInfo = this.gpuRenderInfo;
        if (fragRenderInfo && fragRenderInfo.fragmentUniformBuffer) {
            const rawGpuBuffer = fragRenderInfo.fragmentUniformBuffer.gpuBuffer;
            if (rawGpuBuffer && rawGpuBuffer.size) {
                this.redGPUContext.gpuDevice.queue.writeBuffer(rawGpuBuffer, 0, floatBuf.buffer, floatBuf.byteOffset, floatBuf.byteLength);
            }
        }
    }

    override _updateFragmentState(): void {
        if (this.redGPUContext.destroyed) return;

        super._updateFragmentState();

        const {gpuDevice} = this.redGPUContext;
        if (!gpuDevice || !this.gpuRenderInfo) return;

        this.updateUniformsData();

        const customUniformBuffer = new UniformBuffer(
            this.redGPUContext,
            this.#uniformFloatArray.buffer as ArrayBuffer,
            `LandscapeMaterial_UniformBuffer_${this.uuid}`
        );

        const entries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: customUniformBuffer.gpuBuffer,
                    offset: 0,
                    size: customUniformBuffer.size
                }
            },
            {binding: 1, resource: this.baseColorTextureSampler.gpuSampler},
            {binding: 2, resource: this.#baseColorArrayView!},
            {binding: 3, resource: this.#normalArrayView!},
            {binding: 4, resource: this.#ormArrayView!},
            {binding: 5, resource: this.#weightMapArrayView!}
        ];

        const descriptor = getFragmentBindGroupLayoutDescriptorFromShaderInfo(this.SHADER_INFO, 2);
        const bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeMaterial_BindGroupLayout',
            ...descriptor
        });

        const bindGroup = gpuDevice.createBindGroup({
            label: 'LandscapeMaterial_BindGroup',
            layout: bindGroupLayout,
            entries: entries
        });

        this.gpuRenderInfo.fragmentBindGroupLayout = bindGroupLayout;
        this.gpuRenderInfo.fragmentUniformBindGroup = bindGroup;
        this.gpuRenderInfo.fragmentUniformBuffer = customUniformBuffer;
    }

    #getBaseColorArrayFormat(): GPUTextureFormat {
        const preferred = navigator.gpu?.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';
        return `${preferred}-srgb` as GPUTextureFormat;
    }

    #getDataArrayFormat(): GPUTextureFormat {
        const preferred = navigator.gpu?.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';
        return preferred as GPUTextureFormat;
    }

    #initDummyTextureArrays(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const depth = 1;
        const size: [number, number, number] = [this.#textureArraySize, this.#textureArraySize, depth];
        const baseColorFormat = this.#getBaseColorArrayFormat();
        const dataFormat = this.#getDataArrayFormat();

        const baseColorDesc: GPUTextureDescriptor = {
            size,
            format: baseColorFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_BaseColor_Array_Dummy'
        };
        const normalDesc: GPUTextureDescriptor = {
            size,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Normal_Array_Dummy'
        };
        const ormDesc: GPUTextureDescriptor = {
            size,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_ORM_Array_Dummy'
        };
        const weightMapDesc: GPUTextureDescriptor = {
            size,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_WeightMap_Array_Dummy'
        };

        this.#gpuBaseColorArrayTexture = gpuDevice.createTexture(baseColorDesc);
        this.#gpuNormalArrayTexture = gpuDevice.createTexture(normalDesc);
        this.#gpuORMArrayTexture = gpuDevice.createTexture(ormDesc);
        this.#gpuWeightMapArrayTexture = gpuDevice.createTexture(weightMapDesc);

        this.#baseColorArrayView = this.#gpuBaseColorArrayTexture.createView({dimension: '2d-array'});
        this.#normalArrayView = this.#gpuNormalArrayTexture.createView({dimension: '2d-array'});
        this.#ormArrayView = this.#gpuORMArrayTexture.createView({dimension: '2d-array'});
        this.#weightMapArrayView = this.#gpuWeightMapArrayTexture.createView({dimension: '2d-array'});
    }

    #rebuildTextureArrays(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#textureArrayVersion++;

        const count = Math.max(1, this.#layers.length);
        const depth = count;
        const size: [number, number, number] = [this.#textureArraySize, this.#textureArraySize, depth];
        const baseColorFormat = this.#getBaseColorArrayFormat();
        const dataFormat = this.#getDataArrayFormat();
        const mipLevelCount = Math.floor(Math.log2(this.#textureArraySize)) + 1;

        if (this.#gpuBaseColorArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuBaseColorArrayTexture);
        if (this.#gpuNormalArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuNormalArrayTexture);
        if (this.#gpuORMArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuORMArrayTexture);
        if (this.#gpuWeightMapArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuWeightMapArrayTexture);

        this.#gpuBaseColorArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: baseColorFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_BaseColor_Texture2DArray'
        });
        this.#gpuNormalArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Normal_Texture2DArray'
        });
        this.#gpuORMArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_ORM_Texture2DArray'
        });
        this.#gpuWeightMapArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_WeightMap_Texture2DArray'
        });

        this.#baseColorArrayView = this.#gpuBaseColorArrayTexture.createView({dimension: '2d-array'});
        this.#normalArrayView = this.#gpuNormalArrayTexture.createView({dimension: '2d-array'});
        this.#ormArrayView = this.#gpuORMArrayTexture.createView({dimension: '2d-array'});
        this.#weightMapArrayView = this.#gpuWeightMapArrayTexture.createView({dimension: '2d-array'});

        for (let i = 0; i < this.#layers.length; i++) {
            const layer = this.#layers[i];
            this.#copyLayerTextureToSlice(layer, i);
        }

        this.dirtyPipeline = true;
    }

    #updateLayerMipmaps(): void {
        const count = Math.max(1, this.#layers.length);
        const mipLevelCount = Math.floor(Math.log2(this.#textureArraySize)) + 1;
        const baseColorFormat = this.#getBaseColorArrayFormat();
        const dataFormat = this.#getDataArrayFormat();
        const mipmapGenerator = this.redGPUContext.resourceManager.mipmapGenerator;

        if (this.#gpuBaseColorArrayTexture) {
            mipmapGenerator.generateMipmap(
                this.#gpuBaseColorArrayTexture,
                {
                    size: [this.#textureArraySize, this.#textureArraySize, count],
                    mipLevelCount,
                    format: baseColorFormat,
                    usage: 0
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );
        }
        if (this.#gpuNormalArrayTexture) {
            mipmapGenerator.generateMipmap(
                this.#gpuNormalArrayTexture,
                {
                    size: [this.#textureArraySize, this.#textureArraySize, count],
                    mipLevelCount,
                    format: dataFormat,
                    usage: 0
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );
        }
        if (this.#gpuORMArrayTexture) {
            mipmapGenerator.generateMipmap(
                this.#gpuORMArrayTexture,
                {
                    size: [this.#textureArraySize, this.#textureArraySize, count],
                    mipLevelCount,
                    format: dataFormat,
                    usage: 0
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );
        }
        if (this.#gpuWeightMapArrayTexture) {
            mipmapGenerator.generateMipmap(
                this.#gpuWeightMapArrayTexture,
                {
                    size: [this.#textureArraySize, this.#textureArraySize, count],
                    mipLevelCount,
                    format: dataFormat,
                    usage: 0
                },
                false,
                COMMAND_ENCODER_TYPE.IMMEDIATE
            );
        }
    }

    #copyLayerTextureToSlice(layer: LandscapeLayer, sliceIndex: number): void {
        const device = this.redGPUContext.gpuDevice;
        if (!device) return;

        const capturedVersion = this.#textureArrayVersion;
        const texSize = this.#textureArraySize;

        const copyTexture = (srcBmpTexture: any, dstTexture: GPUTexture | null, fallbackColor: [number, number, number, number], textureType: string) => {
            if (!dstTexture) return;

            const onTextureReady = () => {
                if (capturedVersion !== this.#textureArrayVersion || !dstTexture) return;

                if (srcBmpTexture && srcBmpTexture.gpuTexture) {
                    try {
                        const srcTex: GPUTexture = srcBmpTexture.gpuTexture;
                        const copyW = Math.min(texSize, srcBmpTexture.width || texSize);
                        const copyH = Math.min(texSize, srcBmpTexture.height || texSize);

                        const commandEncoder = device.createCommandEncoder({label: `Landscape_LayerCopy_${sliceIndex}_${textureType}`});
                        commandEncoder.copyTextureToTexture(
                            {texture: srcTex, mipLevel: 0, origin: [0, 0, 0]},
                            {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                            [copyW, copyH, 1]
                        );
                        device.queue.submit([commandEncoder.finish()]);
                        this.#updateLayerMipmaps();
                        this.requestVBTRebake();
                    } catch (e) {
                        console.warn(`[LandscapeMaterial] ⚠️ Texture slice copy failed, applying fallback color [${fallbackColor.join(', ')}]:`, {
                            layer: layer.name,
                            sliceIndex,
                            textureType,
                            error: e
                        });
                        const pixelData = new Uint8Array(fallbackColor);
                        device.queue.writeTexture(
                            {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                            pixelData,
                            {bytesPerRow: 4, rowsPerImage: 1},
                            [1, 1, 1]
                        );
                    }
                } else {
                    console.warn(`[LandscapeMaterial] ℹ️ Texture missing or not loaded yet for [Layer: ${layer.name} -> ${textureType}], applying fallback color [${fallbackColor.join(', ')}]`);
                    const pixelData = new Uint8Array(fallbackColor);
                    device.queue.writeTexture(
                        {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                        pixelData,
                        {bytesPerRow: 4, rowsPerImage: 1},
                        [1, 1, 1]
                    );
                }
            };

            if (srcBmpTexture) {
                srcBmpTexture.addLoadListeners(() => {
                    onTextureReady();
                });
            } else {
                onTextureReady();
            }
        };

        copyTexture(layer.baseColorTexture, this.#gpuBaseColorArrayTexture, [255, 255, 255, 255], 'baseColorTexture');
        copyTexture(layer.normalTexture, this.#gpuNormalArrayTexture, [128, 128, 255, 255], 'normalTexture');
        copyTexture(layer.ormTexture, this.#gpuORMArrayTexture, [255, 255, 0, 255], 'ormTexture');
        copyTexture(layer.weightTexture, this.#gpuWeightMapArrayTexture, [255, 255, 255, 255], 'weightTexture');
    }
}

defineColorRGBA(LandscapeMaterial, [
    {key: 'color'}
]);

defineSampler(LandscapeMaterial, [
    {key: 'baseColorTextureSampler'}
]);

export {LandscapeMaterial};
export default LandscapeMaterial;
