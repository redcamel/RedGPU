/**
 * [KO] 지형 전용 텍스처 2D 어레이 스플래팅 PBR 머티리얼 모듈입니다.
 * [EN] Terrain dedicated 2D texture array splatting PBR material module.
 * @packageDocumentation
 */
import ColorRGBA from "../color/ColorRGBA";
import RedGPUContext from "../context/RedGPUContext";
import AUVTransformBaseMaterial from "../material/core/AUVTransformBaseMaterial";
import Sampler from "../resources/sampler/Sampler";
import UniformBuffer from "../resources/buffer/uniformBuffer/UniformBuffer";
import GPU_FILTER_MODE from "../gpuConst/GPU_FILTER_MODE";
import GPU_ADDRESS_MODE from "../gpuConst/GPU_ADDRESS_MODE";
import GPU_MIPMAP_FILTER_MODE from "../gpuConst/GPU_MIPMAP_FILTER_MODE";
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

/**
 * [KO] 최대 8개의 스플랫 텍스처 레이어를 Texture2DArray로 패킹하여 고속 블렌딩 셰이딩을 수행하는 지형 머티리얼 클래스입니다.
 * [EN] Terrain material class that packs up to 8 splat texture layers into Texture2DArray for high-speed blending shading.
 *
 * **[KO] 아키텍처 및 역할:**
 * - **Texture2DArray 기반 텍스처 패킹**: 최대 8개의 레이어(`MAX_LANDSCAPE_LAYERS = 8`)를 지원하며, 각 레이어의 BaseColor, Normal, ORM, WeightMap을 개별 2D 텍스처 배열(`GPUTexture` with `texture_2d_array`)로 바인딩하여 셰이더 샘플러 슬롯 낭비 없이 고속 샘플링을 수행합니다.
 * - **가상 베이스 텍스처(VBT) 리베이킹 조정자**: 레이어 목록 변경, 파라미터 수정, 텍스처 로드 완료 등을 감지하여 지형 전체의 텍스처 배열을 재구성하고, 등록된 콜백(`onRebakeVBTRequested`)을 통해 비동기 VBT 베이킹을 조율합니다.
 * - **PBR 프래그먼트 셰이딩**: `landscapeFragment.wgsl`을 통해 각 프래그먼트에서 가중치 합계 정규화, 높이 맵 기반 블렌딩 콘트라스트 보정, 물리 기반 셰이딩을 안정적으로 수행합니다.
 *
 * **[EN] Architecture & Role:**
 * - **Texture2DArray Texture Packing**: Supports up to 8 layers (`MAX_LANDSCAPE_LAYERS = 8`), packing each layer's BaseColor, Normal, ORM, and WeightMap into individual 2D texture arrays (`GPUTexture` with `texture_2d_array`) for efficient sampling without consuming individual sampler slots.
 * - **Virtual Base Texture (VBT) Rebake Coordinator**: Detects layer list changes, parameter adjustments, and image load completions to rebuild GPU texture arrays and orchestrate asynchronous VBT atlas rebaking via `onRebakeVBTRequested`.
 * - **PBR Fragment Shading**: Executes normalized weight blending, height-based blend contrast enhancement, and physically-based shading via `landscapeFragment.wgsl`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템(Landscape)에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system (Landscape).<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * const material = landscape.material;
 * ```
 */
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

    /**
     * [KO] LandscapeMaterial 인스턴스를 생성합니다.
     * [EN] Creates a LandscapeMaterial instance.
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트 인스턴스
     * [EN] RedGPU context instance
     * @param baseColorHex -
     * [KO] 기본 베이스 컬러 HEX 코드 (기본값: '#387d42')
     * [EN] Default base color HEX code (default: '#387d42')
     * @param textureArraySize -
     * [KO] 텍스처 어레이 레이어 해상도 (기본값: 1024)
     * [EN] Texture array layer resolution (default: 1024)
     */
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

        this.#initDummyTextureArrays();

        this.baseColorTextureSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.REPEAT,
            addressModeV: GPU_ADDRESS_MODE.REPEAT,

        });

        this.baseColor.setColorByHEX(baseColorHex);
        this.initGPURenderInfos();
    }

    /**
     * [KO] 지형 머티리얼에 등록된 텍스처 블렌딩 레이어 목록을 반환합니다. (읽기 전용)
     * [EN] Returns the list of texture blending layers registered on this terrain material. (Read-only)
     */
    get layers(): LandscapeLayer[] {
        return this.#layers;
    }

    /**
     * [KO] 텍스처 2D 어레이 레이어 슬라이스의 가로/세로 해상도를 반환합니다.
     * [EN] Returns the width/height resolution of the texture 2D array layer slices.
     */
    get textureArraySize(): number {
        return this.#textureArraySize;
    }

    /**
     * [KO] 카메라 근접 텍스처 디테일이 최대로 유지되는 시작 거리(월드 단위)를 반환합니다.
     * [EN] Returns the near-distance threshold (world units) where close-up texture detail remains fully visible.
     */
    get nearDetailDistance(): number {
        return this.#nearDetailDistance;
    }

    /**
     * [KO] 카메라 근접 텍스처 디테일 시작 거리를 설정합니다.
     * [EN] Sets the near-distance threshold for close-up texture detail.
     *
     * @param val -
     * [KO] 근접 디테일 유지 거리
     * [EN] Near detail distance
     */
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

    /**
     * [KO] 셰이더 바인딩용 내부 Texture2DArray 뷰 객체들을 반환합니다. (시스템 내부 렌더러용)
     * [EN] Returns the internal Texture2DArray views for shader bindings. (Internal renderer use)
     *
     * @internal
     */
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

    /**
     * [KO] 가상 베이스 텍스처(VBT) 재베이킹 요청 시 호출될 콜백 리스너를 등록합니다.
     * [EN] Registers the callback listener invoked when a Virtual Base Texture (VBT) rebake is requested.
     *
     * @param callback -
     * [KO] 재베이킹 요청 콜백
     * [EN] Rebake request callback
     */
    setOnRebakeVBTRequested(callback?: () => void): void {
        this.#onRebakeVBTRequested = callback;
    }

    /**
     * [KO] 지형 VBT 아틀라스 재베이킹을 요청합니다. 디바운싱 타이머 또는 즉시 마이크로태스크 실행을 지원합니다.
     * [EN] Requests rebaking of the terrain VBT atlas. Supports debounced timer or immediate microtask execution.
     *
     * @param immediate -
     * [KO] 지연 없이 즉시 실행 여부 (기본값: false)
     * [EN] Whether to execute immediately without debounce delay (default: false)
     * @param debounceDelayMs -
     * [KO] 디바운스 대기 시간(밀리초, 기본값: 200)
     * [EN] Debounce delay in milliseconds (default: 200)
     */
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

    /**
     * [KO] 지형 스플랫 레이어를 머티리얼에 추가하고 텍스처 2D 어레이를 재구성합니다.
     * [EN] Adds a terrain splat layer to the material and reconstructs the 2D texture arrays.
     *
     * @param layer -
     * [KO] 추가할 LandscapeLayer 인스턴스
     * [EN] LandscapeLayer instance to add
     * @returns
     * [KO] 체이닝을 위한 LandscapeMaterial 인스턴스 자신
     * [EN] This LandscapeMaterial instance for chaining
     */
    addLayer(layer: LandscapeLayer): this {
        if (this.#layers.length >= MAX_LANDSCAPE_LAYERS) {
            console.warn(`[LandscapeMaterial] Maximum layer count (${MAX_LANDSCAPE_LAYERS}) reached.`);
            return this;
        }
        if (this.#layers.includes(layer)) return this;

        layer.resolvePendingTextures(this.redGPUContext);
        if (layer.weightTexture?.src) {
            layer.weightMapCPUSampler?.load(layer.weightTexture.src);
        }
        this.#layers.push(layer);
        layer.onChange = () => {
            this.updateUniformsData();
            this.requestVBTRebake(false, 150);
        };
        layer.dirty = true;
        this.dirtyPipeline = true;
        this.#scheduleRebuildTextureArrays();
        this.updateUniformsData();
        return this;
    }

    /**
     * [KO] 지정된 레이어 인스턴스 또는 레이어 이름으로 머티리얼에서 레이어를 제거합니다.
     * [EN] Removes a layer from the material by instance or layer name.
     *
     * @param layer -
     * [KO] 제거할 LandscapeLayer 인스턴스 또는 레이어 이름 문자열
     * [EN] LandscapeLayer instance or layer name string to remove
     * @returns
     * [KO] 제거 성공 여부
     * [EN] Whether removal succeeded
     */
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
            this.dirtyPipeline = true;
            this.#textureArrayVersion++;
            this.#scheduleRebuildTextureArrays();
            this.updateUniformsData();
            return true;
        }
        return false;
    }

    /**
     * [KO] 등록된 모든 스플랫 텍스처 레이어를 머티리얼에서 제거합니다.
     * [EN] Clears all registered splat texture layers from the material.
     */
    clearLayers(): void {
        while (this.#layers.length > 0) {
            this.removeLayer(this.#layers[this.#layers.length - 1]);
        }
    }

    /**
     * [KO] 등록된 지형 텍스처 블렌딩 레이어를 이름으로 조회합니다.
     * [EN] Retrieves a registered terrain texture blending layer by name.
     *
     * @param layerName -
     * [KO] 조회할 레이어 이름
     * [EN] Name of the layer to retrieve
     * @returns
     * [KO] 일치하는 {@link LandscapeLayer} 인스턴스 (미등록 시 `undefined`)
     * [EN] Matching {@link LandscapeLayer} instance (`undefined` if not registered)
     */
    getLayer(layerName: string): LandscapeLayer | undefined {
        if (!layerName) return undefined;
        const count = this.#layers.length;
        for (let i = 0; i < count; i++) {
            const l = this.#layers[i];
            if (l.name === layerName) return l;
        }
        return undefined;
    }

    /**
     * [KO] 등록된 레이어 속성 및 유니폼 파라미터(디테일 거리/페이드, 베이스 컬러, UV 스케일/오프셋 등)를 GPU 유니폼 버퍼에 기록합니다.
     * [EN] Writes registered layer attributes and uniform parameters (detail distance/fade, base color, UV scale/offset, etc.) to the GPU uniform buffer.
     */
    updateUniformsData(): void {
        const floatBuf = this.#uniformFloatArray;
        const uintBuf = this.#uniformUintArray;

        const activeCount = this.#layers.length;
        uintBuf[0] = activeCount;
        floatBuf[1] = this.#nearDetailDistance;
        floatBuf[2] = Math.max(5.0, this.#nearDetailDistance * 0.25);
        uintBuf[3] = 0;

        const colorLinear = this.baseColor ? this.baseColor.rgbaNormalLinear : DEFAULT_BASE_COLOR;
        floatBuf[4] = colorLinear[0];
        floatBuf[5] = colorLinear[1];
        floatBuf[6] = colorLinear[2];
        floatBuf[7] = colorLinear[3];

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

    /**
     * [KO] 프래그먼트 셰이더 상태 및 머티리얼 바인드 그룹(바인딩 0~5: 유니폼, 샘플러, 4개 2D 어레이 뷰)을 재구성합니다.
     * [EN] Reconstructs fragment shader state and material bind group (bindings 0 to 5: uniform, sampler, four 2D array views).
     */
    override _updateFragmentState(): void {
        if (this.redGPUContext.destroyed) return;

        super._updateFragmentState();

        const {gpuDevice, resourceManager} = this.redGPUContext;
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
        this.gpuRenderInfo.fragmentUniformBuffer = customUniformBuffer;
    }

    #getBaseColorArrayFormat(): GPUTextureFormat {
        const preferred = navigator.gpu?.getPreferredCanvasFormat ? navigator.gpu.getPreferredCanvasFormat() : 'rgba8unorm';
        return `${preferred}-srgb` as GPUTextureFormat;
    }

    #getDataArrayFormat(): GPUTextureFormat {
        return 'rgba8unorm';
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
            label: 'Landscape_Material_BaseColorTexture2DArray_Dummy'
        };
        const normalDesc: GPUTextureDescriptor = {
            size,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_NormalTexture2DArray_Dummy'
        };
        const ormDesc: GPUTextureDescriptor = {
            size,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_ORMTexture2DArray_Dummy'
        };
        const weightMapDesc: GPUTextureDescriptor = {
            size,
            format: dataFormat,
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'Landscape_Material_WeightMapTexture2DArray_Dummy'
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

    #updateLayerMipmaps(): void {
        if (!this.#layers.length) return;
        if (!this.#gpuBaseColorArrayTexture || this.#gpuBaseColorArrayTexture.mipLevelCount <= 1) return;

        const count = this.#layers.length;
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

        copyTexture(layer.baseColorTexture, this.#gpuBaseColorArrayTexture, [255, 255, 255, 255], 'baseColorTexture');
        copyTexture(layer.normalTexture, this.#gpuNormalArrayTexture, [128, 128, 255, 255], 'normalTexture');
        copyTexture(layer.ormTexture, this.#gpuORMArrayTexture, [255, 255, 0, 255], 'ormTexture');
        copyTexture(layer.weightTexture, this.#gpuWeightMapArrayTexture, [255, 255, 255, 255], 'weightTexture');
    }

    /**
     * [KO] 머티리얼에 할당된 모든 2D 어레이 GPU 텍스처, 텍스처 뷰 및 레이어 목록을 해제하고 파기합니다.
     * [EN] Releases and destroys all 2D array GPU textures, texture views, and layer collections allocated to this material.
     */
    override destroy(): void {
        super.destroy();
        if (this.#rebakeDebounceTimer !== null) {
            clearTimeout(this.#rebakeDebounceTimer);
            this.#rebakeDebounceTimer = null;
        }
        if (this.#gpuBaseColorArrayTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuBaseColorArrayTexture);
            this.#gpuBaseColorArrayTexture = null;
        }
        if (this.#gpuNormalArrayTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuNormalArrayTexture);
            this.#gpuNormalArrayTexture = null;
        }
        if (this.#gpuORMArrayTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuORMArrayTexture);
            this.#gpuORMArrayTexture = null;
        }
        if (this.#gpuWeightMapArrayTexture) {
            this.redGPUContext.commandEncoderManager.addDeferredDestroy(this.#gpuWeightMapArrayTexture);
            this.#gpuWeightMapArrayTexture = null;
        }
        this.#baseColorArrayView = null;
        this.#normalArrayView = null;
        this.#ormArrayView = null;
        this.#weightMapArrayView = null;
        this.clearLayers();
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
