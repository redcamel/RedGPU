import ColorRGBA from "../color/ColorRGBA";
import RedGPUContext from "../context/RedGPUContext";
import AUVTransformBaseMaterial from "../material/core/AUVTransformBaseMaterial";
import Sampler from "../resources/sampler/Sampler";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import landscapeFragmentSource from "./core/shader/landscapeFragment.wgsl";
import LandscapeLayer from "./LandscapeLayer";
import {COMMAND_ENCODER_TYPE} from "../commandEncoderManager/COMMAND_ENCODER_TYPE";
import defineColorRGBA from "../defineProperty/funcs/color/defineColorRGBA";
import defineSampler from "../defineProperty/funcs/texture/defineSampler";
import {getFragmentBindGroupLayoutDescriptorFromShaderInfo} from "../material/core";

const MAX_LANDSCAPE_LAYERS = 8;

interface LandscapeMaterial {
    baseColor: ColorRGBA;
    baseColorTextureSampler: Sampler;
}

const DEFAULT_BASE_COLOR: number[] = [0.22, 0.49, 0.26, 1.0];

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
    #nearDetailDistance: number = 250.0;

    #uniformByteLength: number = 0;
    #uniformFloatArray: Float32Array;
    #uniformUintArray: Uint32Array;

    constructor(redGPUContext: RedGPUContext, baseColorHex: string = '#387d42', textureArraySize: number = 1024) {
        super(
            redGPUContext,
            'LANDSCAPE_MATERIAL',
            landscapeFragmentSource,
            2
        );

        this.#textureArraySize = Math.max(128, textureArraySize);

        this.#uniformByteLength = this.UNIFORM_STRUCT?.arrayBufferByteLength || this.SHADER_INFO?.uniforms?.uniforms?.arrayBufferByteLength || 0;
        this.#uniformFloatArray = new Float32Array(this.#uniformByteLength / Float32Array.BYTES_PER_ELEMENT);
        this.#uniformUintArray = new Uint32Array(this.#uniformFloatArray.buffer);

        const {resourceManager} = redGPUContext;
        const {emptyTexture2DArrayView, basicDisplacementSampler} = resourceManager;
        this.#baseColorArrayView = emptyTexture2DArrayView;
        this.#normalArrayView = emptyTexture2DArrayView;
        this.#ormArrayView = emptyTexture2DArrayView;
        this.#weightMapArrayView = emptyTexture2DArrayView;

        this.baseColorTextureSampler = basicDisplacementSampler;

        this.baseColor.setColorByHEX(baseColorHex);
        this.initGPURenderInfos();
    }

    get layers(): LandscapeLayer[] {
        return this.#layers;
    }

    get nearDetailDistance(): number {
        return this.#nearDetailDistance;
    }

    set nearDetailDistance(val: number) {
        this.#nearDetailDistance = Math.max(0, val);
        this.updateUniformsData();
    }

    #onRebakeVBTRequested?: () => void;
    #isRebakeScheduled: boolean = false;
    #rebakeDebounceTimer: any = null;
    #pendingLayerMipmapUpdate: boolean = false;
    #isRebuildTextureArraysScheduled: boolean = false;

    #internalLayerViews = {
        baseColorView: null as GPUTextureView | null,
        normalView: null as GPUTextureView | null,
        ormView: null as GPUTextureView | null,
        weightMapView: null as GPUTextureView | null,
    };

    getInternalLayerViews(): {
        baseColorView: GPUTextureView | null;
        normalView: GPUTextureView | null;
        ormView: GPUTextureView | null;
        weightMapView: GPUTextureView | null;
    } {
        this.#internalLayerViews.baseColorView = this.#baseColorArrayView;
        this.#internalLayerViews.normalView = this.#normalArrayView;
        this.#internalLayerViews.ormView = this.#ormArrayView;
        this.#internalLayerViews.weightMapView = this.#weightMapArrayView;
        return this.#internalLayerViews;
    }

    setOnRebakeVBTRequested(callback?: () => void): void {
        this.#onRebakeVBTRequested = callback;
    }

    requestVBTRebake(immediate: boolean = false, debounceDelayMs: number = 200): void {
        if (this.#layers.length === 0) return;
        this.#pendingLayerMipmapUpdate = true;

        if (immediate) {
            if (this.#rebakeDebounceTimer !== null) {
                clearTimeout(this.#rebakeDebounceTimer);
                this.#rebakeDebounceTimer = null;
            }
            if (this.#isRebakeScheduled) return;
            this.#isRebakeScheduled = true;
            queueMicrotask(() => {
                this.#isRebakeScheduled = false;
                if (this.#pendingLayerMipmapUpdate) {
                    this.#pendingLayerMipmapUpdate = false;
                    this.#updateLayerMipmaps();
                }
                this.#onRebakeVBTRequested?.();
            });
            return;
        }

        if (this.#rebakeDebounceTimer !== null) {
            clearTimeout(this.#rebakeDebounceTimer);
        }
        this.#rebakeDebounceTimer = setTimeout(() => {
            this.#rebakeDebounceTimer = null;
            if (this.#pendingLayerMipmapUpdate) {
                this.#pendingLayerMipmapUpdate = false;
                this.#updateLayerMipmaps();
            }
            this.#onRebakeVBTRequested?.();
        }, debounceDelayMs);
    }

    addLayer(layer: LandscapeLayer): this {
        if (this.#layers.length >= MAX_LANDSCAPE_LAYERS) {
            console.warn(`[LandscapeMaterial] Maximum layer count (${MAX_LANDSCAPE_LAYERS}) reached.`);
            return this;
        }
        if (this.#layers.includes(layer)) return this;

        layer.resolvePendingTextures(this.redGPUContext);
        const {weightTexture, weightMapCPUSampler} = layer;
        if (weightTexture?.src) {
            weightMapCPUSampler?.load(weightTexture.src);
        }
        this.#layers.push(layer);
        layer.onChange = () => {
            this.updateUniformsData();
            this.requestVBTRebake(false, 150);
        };
        layer.onUniformChange = () => {
            this.updateUniformsData();
        };
        this.dirtyPipeline = true;
        this.#scheduleRebuildTextureArrays();
        this.updateUniformsData();
        return this;
    }

    removeLayer(layer: LandscapeLayer | string): boolean {
        if (!layer) return false;
        const target = typeof layer === 'string'
            ? this.getLayer(layer)
            : layer;
        if (!target) return false;

        const idx = this.#layers.indexOf(target);
        if (idx !== -1) {
            const removed = this.#layers.splice(idx, 1)[0];
            removed.onChange = undefined;
            removed.onUniformChange = undefined;
            this.dirtyPipeline = true;
            this.#textureArrayVersion++;
            this.#scheduleRebuildTextureArrays();
            this.updateUniformsData();
            return true;
        }
        return false;
    }

    clearLayers(): void {
        while (this.#layers.length > 0) {
            this.removeLayer(this.#layers[this.#layers.length - 1]);
        }
    }

    getLayer(layerName: string): LandscapeLayer | undefined {
        if (!layerName) return undefined;
        const count = this.#layers.length;
        for (let i = 0; i < count; i++) {
            const l = this.#layers[i];
            if (l.name === layerName) return l;
        }
        return undefined;
    }

    updateUniformsData(): void {
        const floatBuf = this.#uniformFloatArray;
        const uintBuf = this.#uniformUintArray;

        const activeCount = this.#layers.length;
        uintBuf[0] = activeCount;
        floatBuf[1] = this.#nearDetailDistance;
        floatBuf[2] = Math.max(5.0, this.#nearDetailDistance * 0.12);
        uintBuf[3] = 0;

        const colorLinear = this.baseColor ? this.baseColor.rgbaNormalLinear : DEFAULT_BASE_COLOR;
        const [r, g, b, a] = colorLinear;
        floatBuf[4] = r;
        floatBuf[5] = g;
        floatBuf[6] = b;
        floatBuf[7] = a;

        let offset = 8;
        for (let i = 0; i < MAX_LANDSCAPE_LAYERS; i++) {
            if (i < activeCount) {
                this.#layers[i].writeUniformData(floatBuf, offset);
            } else {
                LandscapeLayer.writeZeroUniformData(floatBuf, offset);
            }
            offset += LandscapeLayer.UNIFORM_FLOAT_COUNT;
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

        const {gpuDevice, resourceManager} = this.redGPUContext;
        if (!gpuDevice || !this.gpuRenderInfo) return;

        const requiredByteLength = this.#uniformByteLength;
        let uniformBuffer = this.gpuRenderInfo.fragmentUniformBuffer;

        if (uniformBuffer && uniformBuffer.size === requiredByteLength) {
            this.updateUniformsData();
        } else {
            if (uniformBuffer) {
                uniformBuffer.destroy();
            }
            uniformBuffer = new UniformBuffer(
                this.redGPUContext,
                this.#uniformFloatArray.buffer as ArrayBuffer,
                `LandscapeMaterial_UniformBuffer_${this.uuid}`
            );
            this.gpuRenderInfo.fragmentUniformBuffer = uniformBuffer;
            this.updateUniformsData();
        }

        const entries: GPUBindGroupEntry[] = [
            {
                binding: 0,
                resource: {
                    buffer: uniformBuffer.gpuBuffer,
                    offset: 0,
                    size: uniformBuffer.size
                }
            },
            {binding: 1, resource: this.baseColorTextureSampler.gpuSampler},
            {binding: 2, resource: this.#baseColorArrayView!},
            {binding: 3, resource: this.#normalArrayView!},
            {binding: 4, resource: this.#ormArrayView!},
            {binding: 5, resource: this.#weightMapArrayView!}
        ];

        const descriptor = getFragmentBindGroupLayoutDescriptorFromShaderInfo(this.SHADER_INFO, 2);
        const bindGroupLayout = resourceManager.createBindGroupLayout(
            'Landscape_Material_BindGroupLayout',
            descriptor
        );
        const bindGroup = gpuDevice.createBindGroup({
            label: `Landscape_Material_BindGroup_${this.instanceId}`,
            layout: bindGroupLayout,
            entries: entries
        });

        this.gpuRenderInfo.fragmentBindGroupLayout = bindGroupLayout;
        this.gpuRenderInfo.fragmentUniformBindGroup = bindGroup;
    }

    #getBaseColorArrayFormat(): GPUTextureFormat {
        const preferred = navigator.gpu?.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';
        return `${preferred}-srgb` as GPUTextureFormat;
    }

    #getDataArrayFormat(): GPUTextureFormat {
        return 'rgba8unorm';
    }

    #scheduleRebuildTextureArrays(): void {
        if (this.#isRebuildTextureArraysScheduled) return;
        this.#isRebuildTextureArraysScheduled = true;
        queueMicrotask(() => {
            this.#isRebuildTextureArraysScheduled = false;
            if (this.redGPUContext.destroyed) return;
            this.#rebuildTextureArrays();
            this.updateUniformsData();
        });
    }

    override destroy(): void {
        super.destroy();
        if (this.#rebakeDebounceTimer !== null) {
            clearTimeout(this.#rebakeDebounceTimer);
            this.#rebakeDebounceTimer = null;
        }
        const {commandEncoderManager} = this.redGPUContext;
        if (this.#gpuBaseColorArrayTexture) {
            commandEncoderManager.addDeferredDestroy(this.#gpuBaseColorArrayTexture);
            this.#gpuBaseColorArrayTexture = null;
        }
        if (this.#gpuNormalArrayTexture) {
            commandEncoderManager.addDeferredDestroy(this.#gpuNormalArrayTexture);
            this.#gpuNormalArrayTexture = null;
        }
        if (this.#gpuORMArrayTexture) {
            commandEncoderManager.addDeferredDestroy(this.#gpuORMArrayTexture);
            this.#gpuORMArrayTexture = null;
        }
        if (this.#gpuWeightMapArrayTexture) {
            commandEncoderManager.addDeferredDestroy(this.#gpuWeightMapArrayTexture);
            this.#gpuWeightMapArrayTexture = null;
        }
        this.#baseColorArrayView = null;
        this.#normalArrayView = null;
        this.#ormArrayView = null;
        this.#weightMapArrayView = null;
        this.clearLayers();
    }

    #rebuildTextureArrays(): void {
        const {gpuDevice, resourceManager, commandEncoderManager} = this.redGPUContext;
        if (!gpuDevice) return;

        this.#textureArrayVersion++;

        if (this.#layers.length === 0) {
            if (this.#gpuBaseColorArrayTexture) {
                commandEncoderManager.addDeferredDestroy(this.#gpuBaseColorArrayTexture);
                this.#gpuBaseColorArrayTexture = null;
            }
            if (this.#gpuNormalArrayTexture) {
                commandEncoderManager.addDeferredDestroy(this.#gpuNormalArrayTexture);
                this.#gpuNormalArrayTexture = null;
            }
            if (this.#gpuORMArrayTexture) {
                commandEncoderManager.addDeferredDestroy(this.#gpuORMArrayTexture);
                this.#gpuORMArrayTexture = null;
            }
            if (this.#gpuWeightMapArrayTexture) {
                commandEncoderManager.addDeferredDestroy(this.#gpuWeightMapArrayTexture);
                this.#gpuWeightMapArrayTexture = null;
            }
            const {emptyTexture2DArrayView} = resourceManager;
            this.#baseColorArrayView = emptyTexture2DArrayView;
            this.#normalArrayView = emptyTexture2DArrayView;
            this.#ormArrayView = emptyTexture2DArrayView;
            this.#weightMapArrayView = emptyTexture2DArrayView;
            this.dirtyPipeline = true;
            return;
        }

        const count = this.#layers.length;
        const depth = count;
        const size: [number, number, number] = [this.#textureArraySize, this.#textureArraySize, depth];
        const baseColorFormat = this.#getBaseColorArrayFormat();
        const dataFormat = this.#getDataArrayFormat();
        const mipLevelCount = Math.floor(Math.log2(this.#textureArraySize)) + 1;

        if (this.#gpuBaseColorArrayTexture) commandEncoderManager.addDeferredDestroy(this.#gpuBaseColorArrayTexture);
        if (this.#gpuNormalArrayTexture) commandEncoderManager.addDeferredDestroy(this.#gpuNormalArrayTexture);
        if (this.#gpuORMArrayTexture) commandEncoderManager.addDeferredDestroy(this.#gpuORMArrayTexture);
        if (this.#gpuWeightMapArrayTexture) commandEncoderManager.addDeferredDestroy(this.#gpuWeightMapArrayTexture);

        this.#gpuBaseColorArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: baseColorFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_BaseColorTexture2DArray'
        });
        this.#gpuNormalArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_NormalTexture2DArray'
        });
        this.#gpuORMArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_ORMTexture2DArray'
        });
        this.#gpuWeightMapArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_WeightMapTexture2DArray'
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
                        const isSameSize = (srcTex.width === texSize && srcTex.height === texSize);

                        if (isSameSize) {
                            const commandEncoder = device.createCommandEncoder({label: `Landscape_Material_LayerCopy_${sliceIndex}_${textureType}`});
                            commandEncoder.copyTextureToTexture(
                                {texture: srcTex, mipLevel: 0, origin: [0, 0, 0]},
                                {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                                [texSize, texSize, 1]
                            );
                            device.queue.submit([commandEncoder.finish()]);
                        } else {
                            const mipmapGenerator = this.redGPUContext.resourceManager.mipmapGenerator;
                            const pipeline = mipmapGenerator.getMipmapPipeline(dstTexture.format);
                            const srcView = srcTex.createView({
                                baseMipLevel: 0,
                                mipLevelCount: 1,
                                dimension: '2d',
                                baseArrayLayer: 0,
                                arrayLayerCount: 1,
                                label: `Landscape_Material_LayerSrcView_${srcTex.label || textureType}`
                            });
                            const dstView = dstTexture.createView({
                                baseMipLevel: 0,
                                mipLevelCount: 1,
                                dimension: '2d',
                                baseArrayLayer: sliceIndex,
                                arrayLayerCount: 1,
                                label: `Landscape_Material_LayerDstSliceView_${sliceIndex}_${textureType}`
                            });
                            const bindGroup = mipmapGenerator.createBindGroup(srcTex, srcView);

                            const commandEncoder = device.createCommandEncoder({label: `Landscape_Material_LayerBlit_${sliceIndex}_${textureType}`});
                            const passEncoder = commandEncoder.beginRenderPass({
                                colorAttachments: [{
                                    view: dstView,
                                    loadOp: 'clear',
                                    storeOp: 'store',
                                    clearValue: {r: 0, g: 0, b: 0, a: 1}
                                }]
                            });
                            passEncoder.setPipeline(pipeline);
                            passEncoder.setBindGroup(0, bindGroup);
                            passEncoder.draw(3);
                            passEncoder.end();
                            device.queue.submit([commandEncoder.finish()]);
                        }

                        this.requestVBTRebake();
                    } catch (e) {
                        console.warn(`[LandscapeMaterial] ⚠️ Texture slice copy/blit failed, applying fallback color [${fallbackColor.join(', ')}]:`, {
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

        const {baseColorTexture, normalTexture, ormTexture, weightTexture} = layer;
        copyTexture(baseColorTexture, this.#gpuBaseColorArrayTexture, [255, 255, 255, 255], 'baseColorTexture');
        copyTexture(normalTexture, this.#gpuNormalArrayTexture, [128, 128, 255, 255], 'normalTexture');
        copyTexture(ormTexture, this.#gpuORMArrayTexture, [255, 255, 0, 255], 'ormTexture');
        copyTexture(weightTexture, this.#gpuWeightMapArrayTexture, [255, 255, 255, 255], 'weightTexture');
    }

    #updateLayerMipmaps(): void {
        if (!this.#layers.length) return;
        if (!this.#gpuBaseColorArrayTexture || this.#gpuBaseColorArrayTexture.mipLevelCount <= 1) return;

        const count = this.#layers.length;
        const mipLevelCount = Math.floor(Math.log2(this.#textureArraySize)) + 1;
        const baseColorFormat = this.#getBaseColorArrayFormat();
        const dataFormat = this.#getDataArrayFormat();
        const {mipmapGenerator} = this.redGPUContext.resourceManager;

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
}

defineColorRGBA(LandscapeMaterial, [
    {key: 'baseColor'}
]);

defineSampler(LandscapeMaterial, [
    {key: 'baseColorTextureSampler'}
]);

export {LandscapeMaterial};
Object.freeze(LandscapeMaterial);
export default LandscapeMaterial;

