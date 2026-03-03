import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import CameraVolumeGenerator from "./core/generator/cameraVolume/CameraVolumeGenerator";
import AtmosphereIrradianceGenerator from "./core/generator/irradiance/AtmosphereIrradianceGenerator";
import SkyAtmosphereReflectionGenerator from "./core/generator/reflection/SkyAtmosphereReflectionGenerator";
import skyAtmosphereFn from "./core/skyAtmosphereFn.wgsl";
import transmittanceShaderCode from "./core/generator/transmittance/transmittanceShaderCode.wgsl";
import computeCode from "./wgsl/computeCode.wgsl";
import Sampler from "../../resources/sampler/Sampler";
import SystemCodeManager from "../../systemCodeManager/SystemCodeManager";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";

import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + transmittanceShaderCode, 'SKY_ATMOSPHERE_CORE');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering) 클래스입니다.
 * [EN] Physics-based Atmospheric Scattering class.
 *
 * [KO] Rayleigh 산란, Mie 산란 및 오존 흡수를 시뮬레이션하여 사실적인 하늘과 공중 투시 효과를 제공합니다.
 * [EN] Provides realistic sky and aerial perspective effects by simulating Rayleigh scattering, Mie scattering, and ozone absorption.
 *
 * ### Example
 * ```typescript
 * const skyAtmosphere = new RedGPU.Display.SkyAtmosphere(redGPUContext);
 * view.skyAtmosphere = skyAtmosphere;
 * ```
 *
 * @category Display
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

    #params = {
        earthRadius: 6360.0,
        atmosphereHeight: 60.0,
        mieScattering: 0.003996,
        mieExtinction: 0.004440,
        rayleighScattering: [0.005802, 0.013558, 0.033100],
        rayleighScaleHeight: 8.0,
        mieScaleHeight: 1.2,
        mieAnisotropy: 0.8,
        ozoneAbsorption: [0.000650, 0.001881, 0.000085],
        ozoneLayerCenter: 25.0,
        ozoneLayerWidth: 15.0,
        multiScatteringAmbient: 1.0,
        sunSize: 0.5,
        sunIntensity: 10.0,
        exposure: 1.0,
        heightFogDensity: 0.0,
        heightFogFalloff: 0.1,
        horizonHaze: 0.0,
        groundAmbient: 0.0,
        groundAlbedo: [0.1, 0.1, 0.1],
        mieGlow: 0.75,
        mieHalo: 0.99,
        groundShininess: 512.0,
        groundSpecular: 4.0,
        sunDirection: new Float32Array([0, 1, 0]),
        cameraHeight: 0.001,
        useGround: 1.0,
        showGround: 1.0,
        seaLevel: 0.0
    };

    #sunElevation: number = 45;
    #sunAzimuth: number = 0;
    #dirtyLUT: boolean = true;
    #dirtySkyView: boolean = true;
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
            addressModeU: 'repeat',
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
    }

    /** [KO] 지표면 기준 고도 (km) [EN] Sea level offset (km) */
    get seaLevel(): number {
        return this.#params.seaLevel;
    }

    set seaLevel(v: number) {
        this.#params.seaLevel = v;
        this.#dirtyUniformBuffer = true;
        this.#dirtySkyView = true;
    }

    /** [KO] 태양 고도 (도) [EN] Sun elevation (degrees) */
    get sunElevation(): number {
        return this.#sunElevation;
    }

    set sunElevation(v: number) {
        validateNumberRange(v, -90, 90);
        this.#sunElevation = v;
        this.#updateSunDirection();
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 태양 방위각 (도) [EN] Sun azimuth (degrees) */
    get sunAzimuth(): number {
        return this.#sunAzimuth;
    }

    set sunAzimuth(v: number) {
        validateNumberRange(v, -360, 360);
        this.#sunAzimuth = v;
        this.#updateSunDirection();
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 태양 방향 벡터 [EN] Sun direction vector */
    get sunDirection(): Float32Array {
        return this.#params.sunDirection;
    }

    /** [KO] 대기 파라미터 객체 [EN] Atmosphere parameters object */
    get params() {
        return this.#params;
    }

    /** [KO] 카메라 고도 (km) [EN] Camera height (km) */
    get cameraHeight(): number {
        return this.#params.cameraHeight;
    }

    /** [KO] 노출 (Exposure) [EN] Exposure */
    get exposure(): number {
        return this.#params.exposure;
    }

    set exposure(v: number) {
        validatePositiveNumberRange(v, 0, 100);
        this.#params.exposure = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 태양 강도 [EN] Sun intensity */
    get sunIntensity(): number {
        return this.#params.sunIntensity;
    }

    set sunIntensity(v: number) {
        validatePositiveNumberRange(v, 0, 10000);
        this.#params.sunIntensity = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지구 반지름 (km) [EN] Earth radius (km) */
    get earthRadius(): number {
        return this.#params.earthRadius;
    }

    set earthRadius(v: number) {
        validatePositiveNumberRange(v, 1);
        this.#params.earthRadius = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 대기층 높이 (km) [EN] Atmosphere height (km) */
    get atmosphereHeight(): number {
        return this.#params.atmosphereHeight;
    }

    set atmosphereHeight(v: number) {
        validatePositiveNumberRange(v, 1);
        this.#params.atmosphereHeight = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 미(Mie) 산란 계수 [EN] Mie scattering coefficient */
    get mieScattering(): number {
        return this.#params.mieScattering;
    }

    set mieScattering(v: number) {
        validatePositiveNumberRange(v, 0, 1.0);
        this.#params.mieScattering = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 미(Mie) 소멸 계수 [EN] Mie extinction coefficient */
    get mieExtinction(): number {
        return this.#params.mieExtinction;
    }

    set mieExtinction(v: number) {
        validatePositiveNumberRange(v, 0, 1.0);
        this.#params.mieExtinction = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 레일리(Rayleigh) 산란 계수 [EN] Rayleigh scattering coefficient */
    get rayleighScattering(): [number, number, number] {
        return [this.#params.rayleighScattering[0], this.#params.rayleighScattering[1], this.#params.rayleighScattering[2]];
    }

    set rayleighScattering(v: [number, number, number]) {
        this.#params.rayleighScattering = [...v];
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 레일리(Rayleigh) 스케일 높이 (km) [EN] Rayleigh scale height (km) */
    get rayleighScaleHeight(): number {
        return this.#params.rayleighScaleHeight;
    }

    set rayleighScaleHeight(v: number) {
        validatePositiveNumberRange(v, 0.1, 100);
        this.#params.rayleighScaleHeight = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 미(Mie) 스케일 높이 (km) [EN] Mie scale height (km) */
    get mieScaleHeight(): number {
        return this.#params.mieScaleHeight;
    }

    set mieScaleHeight(v: number) {
        validatePositiveNumberRange(v, 0.1, 100);
        this.#params.mieScaleHeight = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 미(Mie) 비등방성 (g) [EN] Mie anisotropy (g) */
    get mieAnisotropy(): number {
        return this.#params.mieAnisotropy;
    }

    set mieAnisotropy(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.mieAnisotropy = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지평선 연무 (Haze) [EN] Horizon haze */
    get horizonHaze(): number {
        return this.#params.horizonHaze;
    }

    set horizonHaze(v: number) {
        validatePositiveNumberRange(v, 0, 10);
        this.#params.horizonHaze = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지면 알베도 [EN] Ground albedo */
    get groundAlbedo(): [number, number, number] {
        return [this.#params.groundAlbedo[0], this.#params.groundAlbedo[1], this.#params.groundAlbedo[2]];
    }

    set groundAlbedo(v: [number, number, number]) {
        this.#params.groundAlbedo = [...v];
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지면 환경광 [EN] Ground ambient */
    get groundAmbient(): number {
        return this.#params.groundAmbient;
    }

    set groundAmbient(v: number) {
        validatePositiveNumberRange(v, 0, 10);
        this.#params.groundAmbient = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 오존 흡수 계수 [EN] Ozone absorption coefficient */
    get ozoneAbsorption(): [number, number, number] {
        return [this.#params.ozoneAbsorption[0], this.#params.ozoneAbsorption[1], this.#params.ozoneAbsorption[2]];
    }

    set ozoneAbsorption(v: [number, number, number]) {
        this.#params.ozoneAbsorption = [...v];
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 오존층 중심 고도 (km) [EN] Ozone layer center altitude (km) */
    get ozoneLayerCenter(): number {
        return this.#params.ozoneLayerCenter;
    }

    set ozoneLayerCenter(v: number) {
        validatePositiveNumberRange(v, 0, 100);
        this.#params.ozoneLayerCenter = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 오존층 두께 (km) [EN] Ozone layer width (km) */
    get ozoneLayerWidth(): number {
        return this.#params.ozoneLayerWidth;
    }

    set ozoneLayerWidth(v: number) {
        validatePositiveNumberRange(v, 1, 50);
        this.#params.ozoneLayerWidth = v;
        this.#dirtyLUT = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 다중 산란 환경광 기여도 [EN] Multi-scattering ambient contribution */
    get multiScatteringAmbient(): number {
        return this.#params.multiScatteringAmbient;
    }

    set multiScatteringAmbient(v: number) {
        validatePositiveNumberRange(v, 0, 1.0);
        this.#params.multiScatteringAmbient = v;
        this.#dirtySkyView = true;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 높이 안개 밀도 [EN] Height fog density */
    get heightFogDensity(): number {
        return this.#params.heightFogDensity;
    }

    set heightFogDensity(v: number) {
        validatePositiveNumberRange(v, 0, 10);
        this.#params.heightFogDensity = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 높이 안개 감쇄 계수 [EN] Height fog falloff coefficient */
    get heightFogFalloff(): number {
        return this.#params.heightFogFalloff;
    }

    set heightFogFalloff(v: number) {
        validatePositiveNumberRange(v, 0.001, 10);
        this.#params.heightFogFalloff = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 태양 시직경 [EN] Sun size */
    get sunSize(): number {
        return this.#params.sunSize;
    }

    set sunSize(v: number) {
        validatePositiveNumberRange(v, 0.01, 10.0);
        this.#params.sunSize = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 미(Mie) 글로우 강도 [EN] Mie glow intensity */
    get mieGlow(): number {
        return this.#params.mieGlow;
    }

    set mieGlow(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.mieGlow = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 미(Mie) 헤일로 강도 [EN] Mie halo intensity */
    get mieHalo(): number {
        return this.#params.mieHalo;
    }

    set mieHalo(v: number) {
        validateNumberRange(v, 0, 0.999);
        this.#params.mieHalo = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지면 광택도 [EN] Ground shininess */
    get groundShininess(): number {
        return this.#params.groundShininess;
    }

    set groundShininess(v: number) {
        validatePositiveNumberRange(v, 1, 2048);
        this.#params.groundShininess = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지면 스펙큘러 강도 [EN] Ground specular intensity */
    get groundSpecular(): number {
        return this.#params.groundSpecular;
    }

    set groundSpecular(v: number) {
        validatePositiveNumberRange(v, 0, 100);
        this.#params.groundSpecular = v;
        this.#dirtyUniformBuffer = true;
    }

    /** [KO] 지면 렌더링 여부 [EN] Whether to render the ground */
    get useGround(): boolean {
        return !!this.#params.useGround;
    }

    set useGround(v: boolean) {
        this.#params.useGround = v ? 1.0 : 0.0;
        this.#dirtyUniformBuffer = true;
        this.#dirtyLUT = true;
        this.#dirtySkyView = true;
    }

    /** [KO] 지면 렌더링 여부 [EN] Whether to render the ground */
    get showGround(): boolean {
        return !!this.#params.showGround;
    }

    set showGround(v: boolean) {
        this.#params.showGround = v ? 1.0 : 0.0;
        this.#dirtyUniformBuffer = true;
        this.#dirtyLUT = true;
        this.#dirtySkyView = true;
    }

    /** [KO] 투과율 LUT 텍스처를 반환합니다. [EN] Returns the Transmittance LUT texture. */
    get transmittanceTexture(): DirectTexture {
        return this.#transmittanceGenerator.lutTexture;
    }

    /** [KO] 다중 산란 LUT 텍스처를 반환합니다. [EN] Returns the Multi-Scattering LUT texture. */
    get multiScatteringTexture(): DirectTexture {
        return this.#multiScatteringGenerator.lutTexture;
    }

    /** [KO] 스카이 뷰 LUT 텍스처를 반환합니다. [EN] Returns the Sky-View LUT texture. */
    get skyViewTexture(): DirectTexture {
        return this.#skyViewGenerator.lutTexture;
    }

    /** [KO] 카메라 볼륨(AP) LUT 텍스처를 반환합니다. [EN] Returns the Camera Volume (AP) LUT texture. */
    get cameraVolumeTexture(): DirectCubeTexture {
        return this.#cameraVolumeGenerator.lutTexture;
    }

    /** [KO] 대기 조도(Irradiance) LUT 텍스처를 반환합니다. [EN] Returns the Atmospheric Irradiance LUT texture. */
    get atmosphereIrradianceTexture(): DirectTexture {
        return this.#irradianceGenerator.lutTexture;
    }

    /** [KO] 프리필터링된 대기 반사 큐브맵을 반환합니다. [EN] Returns the pre-filtered atmospheric reflection cubemap. */
    get atmosphereReflectionTexture(): DirectCubeTexture {
        return this.#reflectionGenerator.prefilteredTexture;
    }

    /** [KO] 대기 산란 전용 샘플러를 반환합니다. [EN] Returns the dedicated atmosphere sampler. */
    get skyAtmosphereSampler() {
        return this.#sampler;
    }

    /**
     * [KO] 씬을 렌더링하고 대기 효과를 합성합니다.
     * [EN] Renders the scene and composites atmospheric effects.
     *
     * @param view -
     * [KO] 렌더링할 3D 뷰
     * [EN] 3D view to render
     * @param width -
     * [KO] 출력 너비
     * [EN] Output width
     * @param height -
     * [KO] 출력 높이
     * [EN] Output height
     * @param sourceTextureInfo -
     * [KO] 소스 텍스처 정보
     * [EN] Source texture information
     * @returns
     * [KO] 후처리 결과
     * [EN] Post-effect result
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        const {gpuDevice, resourceManager} = this.redGPUContext;
        const {rawCamera} = view;
        const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
        
        // [KO] seaLevel 기준 상대 고도 계산
        // [EN] Calculate relative height based on seaLevel
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
        }

        if (this.#dirtySkyView) {
            this.#skyViewGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#cameraVolumeGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#irradianceGenerator.render(this.#skyViewGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#reflectionGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#dirtySkyView = false;
        }

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
                {binding: 4, resource: this.skyViewTexture.gpuTextureView},
                {binding: 5, resource: this.#cameraVolumeGenerator.lutTexture.gpuTexture.createView({dimension: '3d'})},
                {binding: 6, resource: this.#sampler.gpuSampler},
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
					${useMSAA
                ? 'return textureLoad(depthTexture, clampedPos, 0);'
                : 'return textureLoad(depthTexture, clampedPos, 0);'}
				}
			`;

            return [
                '#redgpu_include depth.getLinearizeDepth',
                skyAtmosphereFn,
                '@group(0) @binding(0) var sourceTexture : texture_2d<f32>;',
                depthTextureDeclaration,
                '@group(0) @binding(2) var transmittanceTexture : texture_2d<f32>;',
                '@group(0) @binding(3) var multiScatteringTexture : texture_2d<f32>;',
                '@group(0) @binding(4) var skyViewTexture : texture_2d<f32>;',
                '@group(0) @binding(5) var cameraVolumeTexture : texture_3d<f32>;',
                '@group(0) @binding(6) var atmosphereSampler : sampler;',
                '@group(0) @binding(7) var atmosphereIrradianceTexture : texture_2d<f32>;',
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
                '    let r = uniforms.earthRadius;',
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
                {binding: 7, visibility: GPUShaderStage.COMPUTE, texture: {}}
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
    }
}

Object.freeze(SkyAtmosphere);
export default SkyAtmosphere;
