import ColorRGBA from "../../../color/ColorRGBA";
import RedGPUContext from "../../../context/RedGPUContext";
import AUVTransformBaseMaterial from "../../../material/core/AUVTransformBaseMaterial";
import Sampler from "../../../resources/sampler/Sampler";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import GPU_FILTER_MODE from "../../../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../../../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import landscapeFragmentSource from "../shader/landscapeFragment.wgsl";
import LandscapeLayer from "./LandscapeLayer";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";
import defineColorRGBA from "../../../defineProperty/funcs/color/defineColorRGBA";
import defineNumber from "../../../defineProperty/funcs/number/defineNumber";
import defineSampler from "../../../defineProperty/funcs/texture/defineSampler";
import defineTexture from "../../../defineProperty/funcs/texture/defineTexture";

const MAX_LANDSCAPE_LAYERS = 8;

interface LandscapeMaterial {
    color: ColorRGBA;
    roughnessFactor: number;
    metallicFactor: number;
    occlusionStrength: number;
    baseColorTexture: BitmapTexture;
    ormTexture: BitmapTexture;
    baseColorTextureSampler: Sampler;
}

/**
 * [KO] Landscape 지형 전용 Texture2DArray 기반 Multi-Layer PBR 머티리얼 클래스입니다.
 * [EN] Texture2DArray-based Multi-Layer PBR material class for Landscape terrain system.
 */
class LandscapeMaterial extends AUVTransformBaseMaterial {
    #layers: LandscapeLayer[] = [];
    #textureArraySize: number = 1024; // [KO] 동적 텍스처 어레이 해상도 (기본값: 1024px)

    #gpuBaseColorArrayTexture: GPUTexture | null = null;
    #gpuNormalArrayTexture: GPUTexture | null = null;
    #gpuORMArrayTexture: GPUTexture | null = null;
    #gpuWeightMapArrayTexture: GPUTexture | null = null;

    #baseColorArrayView: GPUTextureView | null = null;
    #normalArrayView: GPUTextureView | null = null;
    #ormArrayView: GPUTextureView | null = null;
    #weightMapArrayView: GPUTextureView | null = null;

    #dummyGlobalTextureView: GPUTextureView | null = null;

    // 텍스처 비동기 로딩 갱신 시 파괴된 텍스처 복사 제출 방지용 버저닝 가드
    #textureArrayVersion: number = 0;

    // Zero-GC 재사용 TypedArray Uniform 구조체 (WGSL 16-byte alignment 규칙 준수: 총 704 bytes = 176 float32 elements)
    #uniformFloatArray: Float32Array = new Float32Array(176);
    #uniformUintArray: Uint32Array;

    constructor(redGPUContext: RedGPUContext, colorHex: string = '#ffffff', baseColorTexture?: BitmapTexture) {
        super(
            redGPUContext,
            'LANDSCAPE_MATERIAL',
            landscapeFragmentSource,
            2 // RedGPU 표준 머티리얼 그룹 인덱스 2
        );

        this.#uniformUintArray = new Uint32Array(this.#uniformFloatArray.buffer);

        // 텍스처 뷰 및 덤미 뷰 최우선 초기화
        this.#initDummyTextureArrays();

        this.baseColorTextureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,
            maxAnisotropy: 16
        });

        if (baseColorTexture) {
            this.baseColorTexture = baseColorTexture;
        }

        this.color.setColorByHEX(colorHex);
        this.roughnessFactor = 1.0;
        this.metallicFactor = 0.0;
        this.occlusionStrength = 1.0;
        this.textureScale = [160, 160];
        this.textureOffset = [0, 0];

        this.initGPURenderInfos();
    }

    get layers(): readonly LandscapeLayer[] {
        return this.#layers;
    }

    set layers(value: any) {
        // RedGPU ABaseMaterial._updateBaseProperty 자동 동기화 예외 방지용 패스스루 setter
    }

    /**
     * [KO] 지형 텍스처 어레이의 해상도를 반환하거나 설정합니다 (예: 512, 1024, 2048).
     * [EN] Gets or sets the resolution of the terrain texture array (e.g. 512, 1024, 2048).
     */
    get textureArraySize(): number {
        return this.#textureArraySize;
    }

    set textureArraySize(size: number) {
        if (this.#textureArraySize !== size && size > 0) {
            this.#textureArraySize = size;
            this.#rebuildTextureArrays();
        }
    }

    /**
     * [KO] 신규 지형 레이어를 추가합니다 (최대 8개).
     * [EN] Adds a new terrain layer (up to 8 layers).
     */
    addLayer(layer: LandscapeLayer): void {
        if (this.#layers.length >= MAX_LANDSCAPE_LAYERS) {
            console.warn(`[LandscapeMaterial] Maximum layer count (${MAX_LANDSCAPE_LAYERS}) reached.`);
            return;
        }

        this.#layers.push(layer);
        layer.dirty = true;
        this.dirtyPipeline = true;
        this.#rebuildTextureArrays();
    }

    /**
     * [KO] 레이어를 이름으로 검색하여 삭제합니다.
     * [EN] Removes a layer by name.
     */
    removeLayer(layerName: string): boolean {
        const idx = this.#layers.findIndex(l => l.name === layerName);
        if (idx !== -1) {
            this.#layers.splice(idx, 1);
            this.dirtyPipeline = true;
            this.#rebuildTextureArrays();
            return true;
        }
        return false;
    }

    /**
     * [KO] 레이어를 이름으로 검색합니다.
     * [EN] Searches a layer by name.
     */
    getLayer(layerName: string): LandscapeLayer | undefined {
        return this.#layers.find(l => l.name === layerName);
    }

    /**
     * [KO] GPU Uniform Buffer 데이터를 업데이트합니다 (Zero-GC, WGSL 16-byte alignment 준수).
     */
    updateUniformsData(): void {
        const floatBuf = this.#uniformFloatArray;
        const uintBuf = this.#uniformUintArray;

        const activeCount = this.#layers.length;
        uintBuf[0] = activeCount; // offset 0~3 bytes

        const colorLinear = this.color ? this.color.rgbaNormalLinear : [1, 1, 1, 1];
        floatBuf[4] = colorLinear[0]; // offset 16 bytes
        floatBuf[5] = colorLinear[1];
        floatBuf[6] = colorLinear[2];
        floatBuf[7] = colorLinear[3];
        floatBuf[8] = this.textureOffset ? this.textureOffset[0] : 0.0; // offset 32 bytes
        floatBuf[9] = this.textureOffset ? this.textureOffset[1] : 0.0;
        floatBuf[10] = this.textureScale ? this.textureScale[0] : 1.0;  // offset 40 bytes
        floatBuf[11] = this.textureScale ? this.textureScale[1] : 1.0;
        floatBuf[12] = this.roughnessFactor ?? 1.0;     // offset 48 bytes
        floatBuf[13] = this.metallicFactor ?? 0.0;      // offset 52 bytes
        floatBuf[14] = this.occlusionStrength ?? 1.0;  // offset 56 bytes
        floatBuf[15] = 1.0; // padding/reserved (offset 60 bytes)

        let offset = 16; // offset 64 bytes (array<LandscapeLayerParams, 8> alignment)
        for (let i = 0; i < MAX_LANDSCAPE_LAYERS; i++) {
            if (i < activeCount) {
                const layer = this.#layers[i];
                floatBuf[offset + 0] = layer.uvOffset[0];
                floatBuf[offset + 1] = layer.uvOffset[1];
                floatBuf[offset + 2] = layer.uvScale[0];
                floatBuf[offset + 3] = layer.uvScale[1];

                const blendModeVal = layer.blendMode === 'SLOPE' ? 0 : (layer.blendMode === 'HEIGHT' ? 1 : 2);
                floatBuf[offset + 4] = layer.minVal;
                floatBuf[offset + 5] = layer.maxVal;
                floatBuf[offset + 6] = layer.blendFalloff;
                floatBuf[offset + 7] = blendModeVal;

                const layerColorLinear = layer.tintColor ? layer.tintColor.rgbaNormalLinear : [1, 1, 1, 1];
                floatBuf[offset + 8] = layerColorLinear[0];
                floatBuf[offset + 9] = layerColorLinear[1];
                floatBuf[offset + 10] = layerColorLinear[2];
                floatBuf[offset + 11] = layerColorLinear[3];

                floatBuf[offset + 12] = layer.roughness;
                floatBuf[offset + 13] = layer.metallic;
                floatBuf[offset + 14] = layer.normalIntensity;
                floatBuf[offset + 15] = layer.enabled ? 1.0 : 0.0; // enabled

                floatBuf[offset + 16] = layer.aoIntensity;
                floatBuf[offset + 17] = layer.heightOffset;
                floatBuf[offset + 18] = layer.heightContrast;
                floatBuf[offset + 19] = layer.weightMapChannelIndex;
            } else {
                floatBuf.fill(0, offset, offset + 20);
            }
            offset += 20;
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

        // 부모 ABaseMaterial의 표준 셰이더 바리안트(#redgpu_if baseColorTexture 등) 체크 및 파이프라인 동기화 실행
        super._updateFragmentState();

        const {gpuDevice} = this.redGPUContext;
        if (!gpuDevice || !this.gpuRenderInfo) return;

        this.updateUniformsData();

        // 커스텀 Uniform Buffer 업데이트
        const customUniformBuffer = new UniformBuffer(
            this.redGPUContext,
            this.#uniformFloatArray.buffer as ArrayBuffer,
            `LandscapeMaterial_UniformBuffer_${this.uuid}`
        );

        const baseColorView = (this.baseColorTexture && this.baseColorTexture.gpuTexture)
            ? this.baseColorTexture.gpuTexture.createView()
            : this.#dummyGlobalTextureView;

        const ormView = (this.ormTexture && this.ormTexture.gpuTexture)
            ? this.ormTexture.gpuTexture.createView()
            : this.#dummyGlobalTextureView;

        const layoutEntries: GPUBindGroupLayoutEntry[] = [
            {binding: 0, visibility: GPUShaderStage.FRAGMENT, buffer: {type: 'uniform'}},
            {binding: 1, visibility: GPUShaderStage.FRAGMENT, sampler: {type: 'filtering'}},
            {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
            {binding: 3, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float'}},
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
            {
                binding: 6,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {sampleType: 'float', viewDimension: '2d-array'}
            },
            {binding: 7, visibility: GPUShaderStage.FRAGMENT, texture: {sampleType: 'float', viewDimension: '2d-array'}}
        ];

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
            {binding: 2, resource: baseColorView},
            {binding: 3, resource: ormView},
            {binding: 4, resource: this.#baseColorArrayView || this.#dummyGlobalTextureView},
            {binding: 5, resource: this.#normalArrayView || this.#dummyGlobalTextureView},
            {binding: 6, resource: this.#ormArrayView || this.#dummyGlobalTextureView},
            {binding: 7, resource: this.#weightMapArrayView || this.#dummyGlobalTextureView}
        ];

        const bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'LandscapeMaterial_BindGroupLayout',
            entries: layoutEntries
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

    #getArrayTextureFormat(): GPUTextureFormat {
        const preferred = navigator.gpu?.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';
        return `${preferred}-srgb` as GPUTextureFormat;
    }

    #initDummyTextureArrays(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        const depth = 1;
        const size: [number, number, number] = [this.#textureArraySize, this.#textureArraySize, depth];
        const texFormat = this.#getArrayTextureFormat();

        const baseColorDesc: GPUTextureDescriptor = {
            size,
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_BaseColor_Array_Dummy'
        };
        const normalDesc: GPUTextureDescriptor = {
            size,
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Normal_Array_Dummy'
        };
        const ormDesc: GPUTextureDescriptor = {
            size,
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_ORM_Array_Dummy'
        };
        const weightMapDesc: GPUTextureDescriptor = {
            size,
            format: texFormat,
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

        const dummyGlobalTex = gpuDevice.createTexture({
            size: [1, 1],
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
            label: 'Landscape_Global_Dummy_Tex'
        });
        const whitePixel = new Uint8Array([255, 255, 255, 255]);
        gpuDevice.queue.writeTexture({texture: dummyGlobalTex}, whitePixel, {bytesPerRow: 4}, [1, 1]);
        this.#dummyGlobalTextureView = dummyGlobalTex.createView();
    }

    #rebuildTextureArrays(): void {
        const gpuDevice = this.redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        this.#textureArrayVersion++;

        const count = Math.max(1, this.#layers.length);
        const depth = count;
        const size: [number, number, number] = [this.#textureArraySize, this.#textureArraySize, depth];
        const texFormat = this.#getArrayTextureFormat();
        const mipLevelCount = Math.floor(Math.log2(this.#textureArraySize)) + 1;

        if (this.#gpuBaseColorArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuBaseColorArrayTexture);
        if (this.#gpuNormalArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuNormalArrayTexture);
        if (this.#gpuORMArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuORMArrayTexture);
        if (this.#gpuWeightMapArrayTexture) this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuWeightMapArrayTexture);

        this.#gpuBaseColorArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_BaseColor_Texture2DArray'
        });
        this.#gpuNormalArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Normal_Texture2DArray'
        });
        this.#gpuORMArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: texFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_ORM_Texture2DArray'
        });
        this.#gpuWeightMapArrayTexture = gpuDevice.createTexture({
            size,
            mipLevelCount,
            format: texFormat,
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
        const texFormat = this.#getArrayTextureFormat();
        const mipmapGenerator = this.redGPUContext.resourceManager.mipmapGenerator;

        if (this.#gpuBaseColorArrayTexture) {
            mipmapGenerator.generateMipmap(
                this.#gpuBaseColorArrayTexture,
                {
                    size: [this.#textureArraySize, this.#textureArraySize, count],
                    mipLevelCount,
                    format: texFormat,
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
                    format: texFormat,
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
                    format: texFormat,
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

        const copyTexture = (srcBmpTexture: any, dstTexture: GPUTexture | null, fallbackColor: [number, number, number, number]) => {
            if (!dstTexture) return;

            const onTextureReady = () => {
                if (capturedVersion !== this.#textureArrayVersion || !dstTexture) return;

                if (srcBmpTexture && srcBmpTexture.gpuTexture) {
                    try {
                        const srcTex: GPUTexture = srcBmpTexture.gpuTexture;
                        const copyW = Math.min(texSize, srcBmpTexture.width || texSize);
                        const copyH = Math.min(texSize, srcBmpTexture.height || texSize);

                        if (srcTex.format === dstTexture.format) {
                            const commandEncoder = device.createCommandEncoder({label: `Landscape_LayerCopy_${sliceIndex}`});
                            commandEncoder.copyTextureToTexture(
                                {texture: srcTex, mipLevel: 0, origin: [0, 0, 0]},
                                {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                                [copyW, copyH, 1]
                            );
                            device.queue.submit([commandEncoder.finish()]);
                            this.#updateLayerMipmaps();
                        } else {
                            // 포맷 차이가 발생하더라도 강제 copyTextureToTexture 실행 (또는 writeTexture)
                            const commandEncoder = device.createCommandEncoder({label: `Landscape_LayerCopy_${sliceIndex}`});
                            commandEncoder.copyTextureToTexture(
                                {texture: srcTex, mipLevel: 0, origin: [0, 0, 0]},
                                {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                                [copyW, copyH, 1]
                            );
                            device.queue.submit([commandEncoder.finish()]);
                            this.#updateLayerMipmaps();
                        }
                    } catch (e) {
                        console.warn('[LandscapeMaterial] Texture slice copy defer warning:', e);
                        const pixelData = new Uint8Array(fallbackColor);
                        device.queue.writeTexture(
                            {texture: dstTexture, mipLevel: 0, origin: [0, 0, sliceIndex]},
                            pixelData,
                            {bytesPerRow: 4, rowsPerImage: 1},
                            [1, 1, 1]
                        );
                    }
                } else {
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

        copyTexture(layer.baseColorTexture, this.#gpuBaseColorArrayTexture, [255, 255, 255, 255]);
        copyTexture(layer.normalTexture, this.#gpuNormalArrayTexture, [128, 128, 255, 255]);
        copyTexture(layer.ormTexture, this.#gpuORMArrayTexture, [255, 255, 0, 255]);
        copyTexture(layer.weightTexture, this.#gpuWeightMapArrayTexture, [255, 255, 255, 255]);
    }
}

defineColorRGBA(LandscapeMaterial, [
    {key: 'color'}
]);

defineNumber(LandscapeMaterial, [
    {key: 'roughnessFactor', value: 1.0, min: 0, max: 1},
    {key: 'metallicFactor', value: 0.0, min: 0, max: 1},
    {key: 'occlusionStrength', value: 1.0, min: 0, max: 2}
]);

defineSampler(LandscapeMaterial, [
    {key: 'baseColorTextureSampler'}
]);

defineTexture(LandscapeMaterial, [
    {key: 'baseColorTexture'},
    {key: 'ormTexture'}
]);

export {LandscapeMaterial};
export default LandscapeMaterial;
