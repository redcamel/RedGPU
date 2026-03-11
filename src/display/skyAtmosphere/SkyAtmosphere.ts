import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import CameraVolumeGenerator from "./core/generator/cameraVolume/CameraVolumeGenerator";
import AtmosphereIrradianceGenerator from "./core/generator/ibl/irradiance/AtmosphereIrradianceGenerator";
import SkyAtmosphereReflectionGenerator from "./core/generator/ibl/reflection/SkyAtmosphereReflectionGenerator";
import skyAtmosphereFn from "./core/skyAtmosphereFn.wgsl";
import transmittanceShaderCode from "./core/generator/transmittance/transmittanceShaderCode.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import Sampler from "../../resources/sampler/Sampler";
import SystemCodeManager from "../../systemCodeManager/SystemCodeManager";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";

import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";

import backgroundVertexShaderCode from "./wgsl/background_vertex.wgsl";
import backgroundFragmentShaderCode from "./wgsl/background_fragment.wgsl";
import Box from "../../primitive/Box";
import {mat4} from "gl-matrix";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + transmittanceShaderCode, 'SKY_ATMOSPHERE_CORE');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

const BACKGROUND_SHADER_INFO = parseWGSL(backgroundVertexShaderCode, 'SKY_ATMOSPHERE_BACKGROUND_VERTEX');
const BACKGROUND_UNIFORM_STRUCT = BACKGROUND_SHADER_INFO.uniforms.vertexUniforms;

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering) 클래스입니다.
 * [EN] Physics-based Atmospheric Scattering class.
 *
 * [KO] 실시간 태양 위치 및 대기 조성 파라미터를 기반으로 하늘의 색상, 태양 본체, 미 산란(Mie Glow) 및 공중 투시(Aerial Perspective) 효과를 시뮬레이션합니다.
 * [EN] Simulates sky color, sun disk, Mie Glow, and Aerial Perspective effects based on real-time sun position and atmospheric composition parameters.
 *
 * @example
 * ```typescript
 * const skyAtmosphere = new RedGPU.SkyAtmosphere(redGPUContext);
 * scene.skyAtmosphere = skyAtmosphere;
 * ```
 * @category SkyAtmosphere
 */
class SkyAtmosphere extends ASinglePassPostEffect {
    #transmittanceGenerator: TransmittanceGenerator;
    #multiScatteringGenerator: MultiScatteringGenerator;
    #skyViewGenerator: SkyViewGenerator;
    #cameraVolumeGenerator: CameraVolumeGenerator;
    #irradianceGenerator: AtmosphereIrradianceGenerator;
    #reflectionGenerator: SkyAtmosphereReflectionGenerator;
    #sampler: Sampler;
    #sharedUniformBuffer: UniformBuffer;

    #backgroundMesh: Box;
    #backgroundPipeline: GPURenderPipeline;
    #backgroundBindGroupLayout1: GPUBindGroupLayout;
    #backgroundBindGroupLayout2: GPUBindGroupLayout;
    #backgroundBindGroup1: GPUBindGroup;
    #backgroundBindGroup2: GPUBindGroup;
    #backgroundUniformBuffer: UniformBuffer;
    #backgroundRenderBundle: GPURenderBundle;
    #dirtyBackgroundPipeline: boolean = true;
    #prevBackgroundSystemUniformBindGroup: GPUBindGroup;

    #params = {
        bottomRadius: 6360.0,
        atmosphereHeight: 100.0,
        mieScattering: 0.003996,
        mieAbsorption: 0.000444,
        rayleighScattering: [0.005802, 0.013558, 0.033100],
        rayleighExponentialDistribution: 8.0,
        mieExponentialDistribution: 1.2,
        mieAnisotropy: 0.8,
        absorptionCoefficient: [0.000650, 0.001881, 0.000085],
        absorptionTipAltitude: 25.0,
        absorptionTentWidth: 15.0,
        sunSize: 0.533,
        sunIntensity: 10.0,
        heightFogDensity: 0.0,
        heightFogFalloff: 0.1,
        groundAmbient: 0.0,
        groundAlbedo: [0.1, 0.1, 0.1],
        mieGlow: 0.5,
        mieHalo: 0.8,
        sunDirection: new Float32Array([0, 1, 0]),
        cameraHeight: 0.001,
        useGround: 1.0,
        showGround: 1.0,
        seaLevel: 0.0,
        aerialPerspectiveDistanceScale: 100.0,
        heightFogAnisotropy: 0.7,
        sunLimbDarkening: 0.67,
        skyLuminanceFactor: 1.0
    };

    #sunElevation: number = 45;
    #sunAzimuth: number = 0;
    #dirtyLUT: boolean = true;
    #dirtySkyView: boolean = true;
    #dirtyIBL: boolean = true;
    #dirtyUniformBuffer: boolean = true;

    #computeShaderMSAA: GPUShaderModule;
    #computeShaderNonMSAA: GPUShaderModule;
    #cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map();
    #cachedComputePipelines: Map<string, GPUComputePipeline> = new Map();

    #bindGroupLayout1: GPUBindGroupLayout;
    #outputTexture: GPUTexture;
    #outputTextureView: GPUTextureView;
    #prevDimensions: { width: number, height: number };

    /**
     * [KO] SkyAtmosphere 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmosphere instance.
     *
     * @example
     * ```typescript
     * const skyAtmosphere = new RedGPU.SkyAtmosphere(redGPUContext);
     * ```
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        const {gpuDevice} = redGPUContext;

        this.#sharedUniformBuffer = new UniformBuffer(this.redGPUContext, new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength), 'SKY_ATMOSPHERE_SHARED_UNIFORM_BUFFER');

        this.#sampler = new Sampler(redGPUContext, {
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'linear',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge'
        });

        this.#transmittanceGenerator = new TransmittanceGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#multiScatteringGenerator = new MultiScatteringGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#skyViewGenerator = new SkyViewGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#cameraVolumeGenerator = new CameraVolumeGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#irradianceGenerator = new AtmosphereIrradianceGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#reflectionGenerator = new SkyAtmosphereReflectionGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);

        this.#bindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_PE_BGL_1',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {format: 'rgba16float', access: 'write-only'}
                },
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#initShaders();
        this.#updateSunDirection();
        this.#initBackgroundResources();
    }

    #initBackgroundResources() {
        const {gpuDevice} = this.redGPUContext;
        this.#backgroundMesh = new Box(this.redGPUContext);
        this.#backgroundUniformBuffer = new UniformBuffer(this.redGPUContext, new ArrayBuffer(BACKGROUND_UNIFORM_STRUCT.arrayBufferByteLength), 'SKY_ATMOSPHERE_BACKGROUND_VERTEX_UNIFORM_BUFFER');
        this.#backgroundUniformBuffer.writeOnlyBuffer(BACKGROUND_UNIFORM_STRUCT.members.modelMatrix, mat4.create());

        this.#backgroundBindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BGL_1',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}}
            ]
        });

        this.#backgroundBindGroupLayout2 = gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BGL_2',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {}}
            ]
        });

        this.#backgroundBindGroup1 = gpuDevice.createBindGroup({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BG_1',
            layout: this.#backgroundBindGroupLayout1,
            entries: [
                {binding: 0, resource: {buffer: this.#backgroundUniformBuffer.gpuBuffer}}
            ]
        });
    }

    #updateBackgroundPipeline(useMSAA: boolean) {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const vertexModule = resourceManager.createGPUShaderModule('SKY_ATMOSPHERE_BACKGROUND_VERTEX', {code: backgroundVertexShaderCode});
        const fragmentModule = resourceManager.createGPUShaderModule('SKY_ATMOSPHERE_BACKGROUND_FRAGMENT', {code: backgroundFragmentShaderCode});

        this.#backgroundPipeline = gpuDevice.createRenderPipeline({
            label: 'SKY_ATMOSPHERE_BACKGROUND_PIPELINE',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
                    this.#backgroundBindGroupLayout1,
                    this.#backgroundBindGroupLayout2
                ]
            }),
            vertex: {
                module: vertexModule,
                entryPoint: 'main',
                buffers: this.#backgroundMesh.gpuRenderInfo.buffers
            },
            fragment: {
                module: fragmentModule,
                entryPoint: 'main',
                targets: [
                    {format: 'rgba16float'},
                    {format: navigator.gpu.getPreferredCanvasFormat()},
                    {format: 'rgba16float'}
                ]
            },
            primitive: {topology: 'triangle-list', cullMode: 'none'},
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: false,
                depthCompare: 'less-equal'
            },
            multisample: {count: useMSAA ? 4 : 1}
        });
    }

    /**
     * [KO] 스카이 배경을 렌더링합니다.
     * [EN] Renders the sky background.
     *
     * @example
     * ```typescript
     * skyAtmosphere.renderBackground(renderViewStateData);
     * ```
     * @param renderViewStateData -
     * [KO] 렌더 뷰 상태 데이터
     * [EN] Render view state data
     */
    renderBackground(renderViewStateData: RenderViewStateData) {
        const {currentRenderPassEncoder, view} = renderViewStateData;
        const {gpuDevice, antialiasingManager} = this.redGPUContext;
        const {useMSAA} = antialiasingManager;

        this.#updateLUTs(view);

        if (this.#dirtyBackgroundPipeline || antialiasingManager.changedMSAA || this.#prevBackgroundSystemUniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
            this.#updateBackgroundPipeline(useMSAA);
            this.#dirtyBackgroundPipeline = false;
            this.#prevBackgroundSystemUniformBindGroup = view.systemUniform_Vertex_UniformBindGroup;

            this.#backgroundBindGroup2 = gpuDevice.createBindGroup({
                label: 'SKY_ATMOSPHERE_BACKGROUND_BG_2',
                layout: this.#backgroundBindGroupLayout2,
                entries: [
                    {binding: 0, resource: this.#transmittanceGenerator.lutTexture.gpuTextureView},
                    {binding: 1, resource: this.atmosphereSkyViewTexture.gpuTextureView},
                    {binding: 2, resource: this.#sampler.gpuSampler}
                ]
            });

            const bundleEncoder = gpuDevice.createRenderBundleEncoder({
                ...view.basicRenderBundleEncoderDescriptor,
                label: 'SKY_ATMOSPHERE_BACKGROUND_BUNDLE_ENCODER'
            });

            bundleEncoder.setPipeline(this.#backgroundPipeline);
            bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
            bundleEncoder.setBindGroup(1, this.#backgroundBindGroup1);
            bundleEncoder.setBindGroup(2, this.#backgroundBindGroup2);
            bundleEncoder.setVertexBuffer(0, this.#backgroundMesh.vertexBuffer.gpuBuffer);
            bundleEncoder.setIndexBuffer(this.#backgroundMesh.indexBuffer.gpuBuffer, this.#backgroundMesh.indexBuffer.format);
            bundleEncoder.drawIndexed(this.#backgroundMesh.indexBuffer.indexCount);

            this.#backgroundRenderBundle = bundleEncoder.finish({label: 'SKY_ATMOSPHERE_BACKGROUND_BUNDLE'});
        }

        currentRenderPassEncoder.executeBundles([this.#backgroundRenderBundle]);
    }

    #updateLUTs(view: View3D) {
        const {rawCamera} = view;
        const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
        const currentHeightKm = Math.max(0.001, (cameraPos[1] / 1000.0) - this.#params.seaLevel);

        if (Math.abs(this.#params.cameraHeight - currentHeightKm) > 0.0001) {
            this.#params.cameraHeight = currentHeightKm;
            this.#dirtySkyView = true;
            this.#dirtyUniformBuffer = true;
        }

        if (this.#dirtyUniformBuffer) {
            this.#updateSharedUniformBuffer();
            this.#dirtyUniformBuffer = false;
        }

        if (this.#dirtyLUT) {
            this.#transmittanceGenerator.render();
            this.#multiScatteringGenerator.render(this.#transmittanceGenerator.lutTexture);
            this.#dirtyLUT = false;
            this.#dirtySkyView = true;
            this.#dirtyIBL = true;
        }

        if (this.#dirtySkyView) {
            this.#skyViewGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#cameraVolumeGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#dirtySkyView = false;
        }

        if (this.#dirtyIBL) {
            this.#reflectionGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#skyViewGenerator.lutTexture);
            this.#irradianceGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#skyViewGenerator.lutTexture);
            this.#dirtyIBL = false;
        }
    }

    /**
     * [KO] 지표면 기준 고도 오프셋 (km)입니다.
     * [EN] Sea level altitude offset (km).
     */
    get seaLevel(): number { return this.#params.seaLevel; }
    set seaLevel(v: number) {
        this.#params.seaLevel = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 태양의 고도 (도, -90 ~ 90)입니다.
     * [EN] Sun elevation (degrees, -90 to 90).
     */
    get sunElevation(): number { return this.#sunElevation; }
    set sunElevation(v: number) {
        validateNumberRange(v, -90, 90);
        this.#sunElevation = v;
        this.#updateSunDirection();
        this.#dirtyUniformBuffer = true;
    }

    /**
     * [KO] 태양의 방위각 (도, -360 ~ 360)입니다.
     * [EN] Sun azimuth (degrees, -360 to 360).
     */
    get sunAzimuth(): number { return this.#sunAzimuth; }
    set sunAzimuth(v: number) {
        validateNumberRange(v, -360, 360);
        this.#sunAzimuth = v;
        this.#updateSunDirection();
        this.#dirtyUniformBuffer = true;
    }

    /**
     * [KO] 태양의 방향 벡터 (정규화됨)를 반환합니다.
     * [EN] Returns the sun direction vector (normalized).
     */
    get sunDirection(): Float32Array { return this.#params.sunDirection; }

    /**
     * [KO] 대기 산란 파라미터 객체를 반환합니다.
     * [EN] Returns the atmospheric scattering parameter object.
     */
    get params() { return this.#params; }

    /**
     * [KO] 현재 카메라의 행성 중심 기준 고도 (km)를 반환합니다.
     * [EN] Returns the current camera altitude from planet center (km).
     */
    get cameraHeight(): number { return this.#params.cameraHeight; }

    /**
     * [KO] 공중 투시(Aerial Perspective) 효과가 적용될 거리 스케일 (km)입니다.
     * [EN] Distance scale (km) for Aerial Perspective effect.
     */
    get aerialPerspectiveDistanceScale(): number { return this.#params.aerialPerspectiveDistanceScale; }
    set aerialPerspectiveDistanceScale(v: number) {
        validatePositiveNumberRange(v, 1, 1000);
        this.#params.aerialPerspectiveDistanceScale = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 높이 안개의 비등방성 계수 (g, 0 ~ 0.999)입니다.
     * [EN] Anisotropy factor for height fog (g, 0 to 0.999).
     */
    get heightFogAnisotropy(): number { return this.#params.heightFogAnisotropy; }
    set heightFogAnisotropy(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.heightFogAnisotropy = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 태양의 조도 강도입니다.
     * [EN] Sun's illuminance intensity.
     */
    get sunIntensity(): number { return this.#params.sunIntensity; }
    set sunIntensity(v: number) {
        validatePositiveNumberRange(v, 0, 10000);
        this.#params.sunIntensity = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 행성의 바닥 반지름 (km)입니다.
     * [EN] Planet bottom radius (km).
     */
    get bottomRadius(): number { return this.#params.bottomRadius; }
    set bottomRadius(v: number) {
        validatePositiveNumberRange(v, 1);
        this.#params.bottomRadius = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 대기층의 유효 높이 (km)입니다.
     * [EN] Effective height of the atmosphere (km).
     */
    get atmosphereHeight(): number { return this.#params.atmosphereHeight; }
    set atmosphereHeight(v: number) {
        validatePositiveNumberRange(v, 1);
        this.#params.atmosphereHeight = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 미 산란(Mie Scattering) 계수입니다.
     * [EN] Mie Scattering coefficient.
     */
    get mieScattering(): number { return this.#params.mieScattering; }
    set mieScattering(v: number) {
        validatePositiveNumberRange(v, 0, 1.0);
        this.#params.mieScattering = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 미 흡수(Mie Absorption) 계수입니다.
     * [EN] Mie Absorption coefficient.
     */
    get mieAbsorption(): number { return this.#params.mieAbsorption; }
    set mieAbsorption(v: number) {
        validatePositiveNumberRange(v, 0, 1.0);
        this.#params.mieAbsorption = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 레일리 산란(Rayleigh Scattering) 계수 [R, G, B] 배열입니다.
     * [EN] Rayleigh Scattering coefficient [R, G, B] array.
     */
    get rayleighScattering(): [number, number, number] {
        return [this.#params.rayleighScattering[0], this.#params.rayleighScattering[1], this.#params.rayleighScattering[2]];
    }
    set rayleighScattering(v: [number, number, number]) {
        this.#params.rayleighScattering = [...v];
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 레일리 산란의 고도 별 지수 분포(Scale Height, km)입니다.
     * [EN] Rayleigh exponential distribution (Scale Height, km).
     */
    get rayleighExponentialDistribution(): number { return this.#params.rayleighExponentialDistribution; }
    set rayleighExponentialDistribution(v: number) {
        validatePositiveNumberRange(v, 0.1, 100);
        this.#params.rayleighExponentialDistribution = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 미 산란의 고도 별 지수 분포(Scale Height, km)입니다.
     * [EN] Mie exponential distribution (Scale Height, km).
     */
    get mieExponentialDistribution(): number { return this.#params.mieExponentialDistribution; }
    set mieExponentialDistribution(v: number) {
        validatePositiveNumberRange(v, 0.1, 100);
        this.#params.mieExponentialDistribution = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 미 산란의 비등방성 계수 (g, 0 ~ 0.999)입니다.
     * [EN] Anisotropy factor for Mie scattering (g, 0 to 0.999).
     */
    get mieAnisotropy(): number { return this.#params.mieAnisotropy; }
    set mieAnisotropy(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.mieAnisotropy = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 지면의 반사율(Albedo) [R, G, B] 배열입니다.
     * [EN] Ground Albedo [R, G, B] array.
     */
    get groundAlbedo(): [number, number, number] {
        return [this.#params.groundAlbedo[0], this.#params.groundAlbedo[1], this.#params.groundAlbedo[2]];
    }
    set groundAlbedo(v: [number, number, number]) {
        this.#params.groundAlbedo = [...v];
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 지면 환경광 강도입니다.
     * [EN] Ground ambient light intensity.
     */
    get groundAmbient(): number { return this.#params.groundAmbient; }
    set groundAmbient(v: number) {
        validatePositiveNumberRange(v, 0, 10);
        this.#params.groundAmbient = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 대기 중 흡수 물질(오존 등)의 흡수 계수 [R, G, B] 배열입니다.
     * [EN] Absorption coefficient [R, G, B] array for atmospheric absorbers (e.g. Ozone).
     */
    get absorptionCoefficient(): [number, number, number] {
        return [this.#params.absorptionCoefficient[0], this.#params.absorptionCoefficient[1], this.#params.absorptionCoefficient[2]];
    }
    set absorptionCoefficient(v: [number, number, number]) {
        this.#params.absorptionCoefficient = [...v];
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 흡수층(Tent Distribution)의 중심 고도 (km)입니다.
     * [EN] Center altitude (km) of the absorption tip (Tent Distribution).
     */
    get absorptionTipAltitude(): number { return this.#params.absorptionTipAltitude; }
    set absorptionTipAltitude(v: number) {
        validatePositiveNumberRange(v, 0, 100);
        this.#params.absorptionTipAltitude = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 흡수층의 두께 너비 (km)입니다.
     * [EN] Thickness width (km) of the absorption tent.
     */
    get absorptionTentWidth(): number { return this.#params.absorptionTentWidth; }
    set absorptionTentWidth(v: number) {
        validatePositiveNumberRange(v, 1, 50);
        this.#params.absorptionTentWidth = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 높이 안개의 밀도 계수입니다.
     * [EN] Density coefficient for height fog.
     */
    get heightFogDensity(): number { return this.#params.heightFogDensity; }
    set heightFogDensity(v: number) {
        validatePositiveNumberRange(v, 0, 10);
        this.#params.heightFogDensity = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 높이 안개의 감쇄 지수(Falloff)입니다.
     * [EN] Falloff exponent for height fog.
     */
    get heightFogFalloff(): number { return this.#params.heightFogFalloff; }
    set heightFogFalloff(v: number) {
        validatePositiveNumberRange(v, 0.001, 10);
        this.#params.heightFogFalloff = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 태양 본체의 각크기 (도)입니다.
     * [EN] Angular size (degrees) of the sun disk.
     */
    get sunSize(): number { return this.#params.sunSize; }
    set sunSize(v: number) {
        validatePositiveNumberRange(v, 0.01, 10.0);
        this.#params.sunSize = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 미 산란 글로우(Mie Glow) 강도 (0 ~ 0.999)입니다.
     * [EN] Mie Glow intensity (0 to 0.999).
     */
    get mieGlow(): number { return this.#params.mieGlow; }
    set mieGlow(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.mieGlow = v;
        this.#dirtySkyView = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 미 산란 헤일로(Mie Halo)의 비등방성 계수 (0 ~ 0.999)입니다.
     * [EN] Anisotropy factor for Mie Halo (0 to 0.999).
     */
    get mieHalo(): number { return this.#params.mieHalo; }
    set mieHalo(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.mieHalo = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 지면 사용 여부를 설정합니다.
     * [EN] Sets whether to use the ground.
     */
    get useGround(): boolean { return !!this.#params.useGround; }
    set useGround(v: boolean) {
        this.#params.useGround = v ? 1.0 : 0.0;
        this.#dirtyUniformBuffer = true;
        this.#dirtyLUT = true;
        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 지면 표시 여부를 설정합니다.
     * [EN] Sets whether to show the ground.
     */
    get showGround(): boolean { return !!this.#params.showGround; }
    set showGround(v: boolean) {
        this.#params.showGround = v ? 1.0 : 0.0;
        this.#dirtyUniformBuffer = true;
        this.#dirtyLUT = true;
        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 태양의 주연 감광(Limb Darkening) 계수입니다.
     * [EN] Sun's Limb Darkening coefficient.
     */
    get sunLimbDarkening(): number { return this.#params.sunLimbDarkening; }
    set sunLimbDarkening(v: number) {
        validateNumberRange(v, 0, 10.0);
        this.#params.sunLimbDarkening = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 대기 산란의 전체 휘도 배율입니다.
     * [EN] Overall luminance factor for atmospheric scattering.
     */
    get skyLuminanceFactor(): number { return this.#params.skyLuminanceFactor; }
    set skyLuminanceFactor(v: number) {
        validatePositiveNumberRange(v, 0, 100.0);
        this.#params.skyLuminanceFactor = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
        this.#dirtyIBL = true;
    }

    /**
     * [KO] 대기 투과율(Transmittance) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Transmittance LUT texture.
     */
    get atmosphereTransmittanceTexture(): DirectTexture { return this.#transmittanceGenerator.lutTexture; }

    /**
     * [KO] 다중 산란(Multi-Scattering) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Multi-Scattering LUT texture.
     */
    get atmosphereMultiScatteringTexture(): DirectTexture { return this.#multiScatteringGenerator.lutTexture; }

    /**
     * [KO] 스카이 뷰(Sky-View) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Sky-View LUT texture.
     */
    get atmosphereSkyViewTexture(): DirectTexture { return this.#skyViewGenerator.lutTexture; }

    /**
     * [KO] 카메라 볼륨(AP) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Camera Volume (AP) LUT texture.
     */
    get atmosphereCameraVolumeTexture(): DirectCubeTexture { return this.#cameraVolumeGenerator.lutTexture; }

    /**
     * [KO] 대기 조도(Irradiance) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Irradiance LUT texture.
     */
    get atmosphereIrradianceTexture(): DirectCubeTexture { return this.#irradianceGenerator.lutTexture; }

    /**
     * [KO] 프리필터링된 대기 반사 큐브맵을 반환합니다.
     * [EN] Returns the pre-filtered atmospheric reflection cubemap.
     */
    get atmosphereReflectionTexture(): DirectCubeTexture { return this.#reflectionGenerator.prefilteredTexture; }

    /**
     * [KO] 대기 산란 전용 샘플러를 반환합니다.
     * [EN] Returns the dedicated atmosphere sampler.
     */
    get atmosphereSampler() { return this.#sampler; }

    /**
     * [KO] 대기 산란 포스트 이펙트를 실행합니다.
     * [EN] Executes the atmospheric scattering post-effect.
     *
     * @example
     * ```typescript
     * const result = skyAtmosphere.render(view, width, height, sourceTextureInfo);
     * ```
     * @param view -
     * [KO] 렌더링에 사용되는 3D 뷰
     * [EN] 3D view used for rendering
     * @param width -
     * [KO] 렌더링 너비
     * [EN] Rendering width
     * @param height -
     * [KO] 렌더링 높이
     * [EN] Rendering height
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture information
     * @returns
     * [KO] 렌더링 결과 텍스처 정보
     * [EN] Rendering result texture information
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        this.#updateLUTs(view);

        if (!this.#outputTexture || this.#prevDimensions?.width !== width || this.#prevDimensions?.height !== height) {
            if (this.#outputTexture) this.#outputTexture.destroy();
            this.#outputTexture = resourceManager.createManagedTexture({
                size: {width, height},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
                label: 'SkyAtmosphere_PE_Output'
            });
            this.#outputTextureView = this.#outputTexture.createView();
            this.#prevDimensions = {width, height};
        }

        const commandEncoder = gpuDevice.createCommandEncoder({label: 'SkyAtmosphere_PE_Pass'});
        const passEncoder = commandEncoder.beginComputePass();

        const {useMSAA} = this.redGPUContext.antialiasingManager;
        const pipeline = this.#getPipeline(useMSAA);
        passEncoder.setPipeline(pipeline);

        const bindGroup0 = gpuDevice.createBindGroup({
            label: 'SKY_ATMOSPHERE_PE_BG_0',
            layout: this.#getBindGroupLayout0(useMSAA),
            entries: [
                {binding: 0, resource: sourceTextureInfo.textureView},
                {binding: 1, resource: view.viewRenderTextureManager.depthTextureView},
                {binding: 2, resource: this.#transmittanceGenerator.lutTexture.gpuTextureView},
                {binding: 3, resource: this.#multiScatteringGenerator.lutTexture.gpuTextureView},
                {binding: 4, resource: this.atmosphereSkyViewTexture.gpuTextureView},
                {binding: 5, resource: this.atmosphereCameraVolumeTexture.gpuTexture.createView({dimension: '3d'})},
                {binding: 6, resource: this.atmosphereSampler.gpuSampler},
                {binding: 7, resource: this.atmosphereIrradianceTexture.gpuTextureView}
            ]
        });

        const bindGroup1 = gpuDevice.createBindGroup({
            label: 'SKY_ATMOSPHERE_PE_BG_1',
            layout: this.#bindGroupLayout1,
            entries: [
                {binding: 0, resource: this.#outputTextureView},
                {binding: 1, resource: {buffer: view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer}}
            ]
        });

        passEncoder.setBindGroup(0, bindGroup0);
        passEncoder.setBindGroup(1, bindGroup1);
        passEncoder.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        return {texture: this.#outputTexture, textureView: this.#outputTextureView};
    }

    #updateSharedUniformBuffer(): void {
        const {members} = UNIFORM_STRUCT;
        for (const [key, member] of Object.entries(members)) {
            const value = this.#params[key];
            if (value !== undefined) this.#sharedUniformBuffer.writeOnlyBuffer(member, value);
        }
    }

    #initShaders(): void {
        const {resourceManager} = this.redGPUContext;
        const createCode = (useMSAA: boolean) => {
            const depthTextureDeclaration = useMSAA
                ? '@group(0) @binding(1) var depthTexture : texture_depth_multisampled_2d;'
                : '@group(0) @binding(1) var depthTexture : texture_depth_2d;';

            const fetchDepthFunction = `
				fn fetchDepth(pos: vec2<u32>) -> f32 {
					let dSize = textureDimensions(depthTexture);
					let clampedPos = min(pos, dSize - 1u);
					${useMSAA ? 'return textureLoad(depthTexture, clampedPos, 0);' : 'return textureLoad(depthTexture, clampedPos, 0);'}
				}
			`;

            return [
                '#redgpu_include depth.getLinearizeDepth',
                skyAtmosphereFn,
                '@group(0) @binding(0) var sourceTexture : texture_2d<f32>;',
                depthTextureDeclaration,
                '@group(0) @binding(2) var atmosphereTransmittanceTexture : texture_2d<f32>;',
                '@group(0) @binding(3) var atmosphereMultiScatteringTexture : texture_2d<f32>;',
                '@group(0) @binding(4) var atmosphereSkyViewTexture : texture_2d<f32>;',
                '@group(0) @binding(5) var atmosphereCameraVolumeTexture : texture_3d<f32>;',
                '@group(0) @binding(6) var atmosphereSampler : sampler;',
                '@group(0) @binding(7) var atmosphereIrradianceTexture : texture_cube<f32>;',
                '',
                '@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;',
                SystemCodeManager.POST_EFFECT_SYSTEM_UNIFORM,
                '',
                fetchDepthFunction,
                '',
                '@compute @workgroup_size(16, 16)',
                'fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {',
                '    let uniforms = systemUniforms.skyAtmosphere;',
                '    let camH = uniforms.cameraHeight;',
                '    let r = uniforms.bottomRadius;',
                '    let atmH = uniforms.atmosphereHeight;',
                computeCode,
                '}'
            ].join('\n');
        };

        this.#computeShaderMSAA = resourceManager.createGPUShaderModule('SKY_ATMOSPHERE_PE_MSAA', {code: createCode(true)});
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule('SKY_ATMOSPHERE_PE_NON_MSAA', {code: createCode(false)});
    }

    #getBindGroupLayout0(useMSAA: boolean): GPUBindGroupLayout {
        const key = `BGL0_MSAA_${useMSAA}`;
        if (this.#cachedBindGroupLayouts.has(key)) return this.#cachedBindGroupLayouts.get(key);

        const bgl = this.redGPUContext.gpuDevice.createBindGroupLayout({
            label: `SKY_ATMOSPHERE_PE_${key}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'depth', multisampled: useMSAA}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, texture: {viewDimension: '3d'}},
                {binding: 6, visibility: GPUShaderStage.COMPUTE, sampler: {}},
                {binding: 7, visibility: GPUShaderStage.COMPUTE, texture: {viewDimension: 'cube'}}
            ]
        });
        this.#cachedBindGroupLayouts.set(key, bgl);
        return bgl;
    }

    #getPipeline(useMSAA: boolean): GPUComputePipeline {
        const key = `PIPELINE_MSAA_${useMSAA}`;
        if (this.#cachedComputePipelines.has(key)) return this.#cachedComputePipelines.get(key);

        const {gpuDevice} = this.redGPUContext;
        const pipeline = gpuDevice.createComputePipeline({
            label: `SKY_ATMOSPHERE_PE_${key}`,
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#getBindGroupLayout0(useMSAA), this.#bindGroupLayout1]
            }),
            compute: {
                module: useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA,
                entryPoint: 'main'
            }
        });
        this.#cachedComputePipelines.set(key, pipeline);
        return pipeline;
    }

    #updateSunDirection(): void {
        const phi = (90 - this.#sunElevation) * (Math.PI / 180);
        const theta = (this.#sunAzimuth) * (Math.PI / 180);
        this.#params.sunDirection[0] = Math.sin(phi) * Math.cos(theta);
        this.#params.sunDirection[1] = Math.cos(phi);
        this.#params.sunDirection[2] = Math.sin(phi) * Math.sin(theta);

        this.#dirtySkyView = true;
        this.#dirtyIBL = true;
    }
}

Object.freeze(SkyAtmosphere);
export default SkyAtmosphere;
