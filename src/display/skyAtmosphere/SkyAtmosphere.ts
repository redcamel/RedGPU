import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import AerialPerspectiveGenerator from "./core/generator/aerialPerspective/AerialPerspectiveGenerator";
import SkyAtmosphereSpecularGenerator from "./core/generator/ibl/reflection/SkyAtmosphereSpecularGenerator";
import SkyAtmosphereIrradianceGenerator from "./core/generator/ibl/reflection/SkyAtmosphereIrradianceGenerator";
import transmittanceShaderCode_wgsl from "./core/generator/transmittance/transmittanceShaderCode.wgsl";
import computeCode_wgsl from "./wgsl/computeCode.wgsl";
import Sampler from "../../resources/sampler/Sampler";
import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";

import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";

import backgroundVertexShaderCode_wgsl from "./wgsl/background_vertex.wgsl";
import backgroundFragmentShaderCode_wgsl from "./wgsl/background_fragment.wgsl";
import Box from "../../primitive/Box";
import {mat4} from "gl-matrix";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import ResourceManager from "../../resources/core/resourceManager/ResourceManager";
import AtmosphereShaderLibrary from "./core/AtmosphereShaderLibrary";
import DirectionalLight from "../../light/lights/DirectionalLight";
import createUUID from "../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL('SkyAtmosphere_Core', transmittanceShaderCode_wgsl, AtmosphereShaderLibrary);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

const BACKGROUND_SHADER_INFO = parseWGSL('SkyAtmosphere_Background_Vertex', backgroundVertexShaderCode_wgsl);
const BACKGROUND_UNIFORM_STRUCT = BACKGROUND_SHADER_INFO.uniforms.vertexUniforms;

/**
 * [KO] 물리 기반 대기 산란(Atmospheric Scattering) 클래스입니다.
 * [EN] Physics-based Atmospheric Scattering class.
 *
 * [KO] 실시간 태양 위치 및 대기 조성 파라미터를 기반으로 하늘의 색상, 태양 본체 및 공중 투시(Aerial Perspective) 효과를 시뮬레이션합니다.
 * [EN] Simulates sky color, sun disk, and Aerial Perspective effects based on real-time sun position and atmospheric composition parameters.
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
    #aerialPerspectiveGenerator: AerialPerspectiveGenerator;
    #irradianceLUT: DirectCubeTexture;
    #specularGenerator: SkyAtmosphereSpecularGenerator;
    #irradianceGenerator: SkyAtmosphereIrradianceGenerator;
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
        rayleighScattering: [0.005802, 0.013558, 0.033100],
        rayleighExponentialDistribution: 8.0,
        mieScattering: [0.003996, 0.003996, 0.003996],
        mieAnisotropy: 0.8,
        mieAbsorption: [0.000444, 0.000444, 0.000444],
        mieExponentialDistribution: 1.2,
        absorptionCoefficient: [0.000650, 0.001881, 0.000085],
        absorptionTipAltitude: 25.0,
        groundAlbedo: [0.4, 0.4, 0.4],
        absorptionTentWidth: 15.0,
        skyLuminanceFactor: [1.0, 1.0, 1.0],
        multiScatteringFactor: 1.0,
        sunDirection: new Float32Array([0, 1, 0]),
        transmittanceMinLightElevationAngle: -90.0,
        groundRadius: 6360.0,
        atmosphereHeight: 60.0,
        aerialPerspectiveDistanceScale: 100.0,
        aerialPerspectiveStartDepth: 0.0,
        sunIntensity: 100000.0,
        sunSize: 0.533,
        sunLimbDarkening: 0.5,
        cameraHeight: 0.001
    };

    #activeSunSource: DirectionalLight = null;
    #prevSunSource: DirectionalLight = null;
    #dirtyLUT: boolean = true;
    #dirtySkyView: boolean = true;
    #dirtyIBL: boolean = true;
    #dirtyUniformBuffer: boolean = true;

    #lastUpdateFrame: number = -1;
    #prevCameraMatrix: mat4 = mat4.create();
    #isUpdatingIBL: boolean = false;

    #computeShaderMSAA: GPUShaderModule;
    #computeShaderNonMSAA: GPUShaderModule;
    #cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map();
    #cachedComputePipelines: Map<string, GPUComputePipeline> = new Map();

    #bindGroupLayout1: GPUBindGroupLayout;
    #bindGroup0_swap0: GPUBindGroup;
    #bindGroup0_swap1: GPUBindGroup;
    #bindGroup1: GPUBindGroup;
    #prevSourceView_swap0: GPUTextureView;
    #prevSourceView_swap1: GPUTextureView;
    #prevDepthView_swap0: GPUTextureView;
    #prevDepthView_swap1: GPUTextureView;
    #prevPEUniformBuffer: GPUBuffer;
    #prevMSAA: boolean;
    #prevMSAAID: string;
    #outputTexture: GPUTexture;
    #outputTextureView: GPUTextureView;
    #prevDimensions: { width: number, height: number };


    #markDirty(lut: boolean, skyView: boolean, ibl: boolean): void {
        this.#dirtyUniformBuffer = true;
        if (lut) this.#dirtyLUT = true;
        if (skyView) this.#dirtySkyView = true;
        if (ibl) this.#dirtyIBL = true;
    }

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

        this.#sharedUniformBuffer = new UniformBuffer(this.redGPUContext, new ArrayBuffer(UNIFORM_STRUCT.arrayBufferByteLength), 'SkyAtmosphere_Shared_UniformBuffer');

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
        this.#aerialPerspectiveGenerator = new AerialPerspectiveGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#irradianceLUT = new DirectCubeTexture(redGPUContext, `SkyAtmosphere_Irradiance_LUTTexture_${createUUID()}`,
            this.redGPUContext.resourceManager.createManagedTexture({
                size: [32, 32, 6],
                format: 'rgba16float',
                usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                dimension: '2d',
                mipLevelCount: 1,
                label: 'SkyAtmosphere_Irradiance_LUT'
            })
        );
        this.#specularGenerator = new SkyAtmosphereSpecularGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#irradianceGenerator = new SkyAtmosphereIrradianceGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);

        this.#bindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'SkyAtmosphere_PE_BindGroupLayout_1',
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
        const vertexModule = resourceManager.createGPUShaderModule('SkyAtmosphere_Background_Vertex_ShaderModule', {code: backgroundVertexShaderCode_wgsl});
        const fragmentModule = resourceManager.createGPUShaderModule('SkyAtmosphere_Background_Fragment_ShaderModule', {code: backgroundFragmentShaderCode_wgsl});

        this.#backgroundPipeline = gpuDevice.createRenderPipeline({
            label: 'SkyAtmosphere_Background_Pipeline',
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

        this.#performUpdate(view);

        if (this.#dirtyBackgroundPipeline || antialiasingManager.changedMSAA || this.#prevBackgroundSystemUniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
            this.#updateBackgroundPipeline(useMSAA);
            this.#dirtyBackgroundPipeline = false;
            this.#prevBackgroundSystemUniformBindGroup = view.systemUniform_Vertex_UniformBindGroup;

            this.#backgroundBindGroup2 = gpuDevice.createBindGroup({
                label: 'SKY_ATMOSPHERE_BACKGROUND_BG_2',
                layout: this.#backgroundBindGroupLayout2,
                entries: [
                    {binding: 0, resource: this.#transmittanceGenerator.lutTexture.gpuTextureView},
                    {binding: 1, resource: this.skyViewLUT.gpuTextureView},
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

    #performUpdate(view: View3D) {
        const currentFrame = view.renderViewStateData.frameIndex;
        if (this.#lastUpdateFrame === currentFrame) return;
        this.#lastUpdateFrame = currentFrame;

        this.#updateSunInfo(view);
        this.#updateLUTs(view);
    }

    #updateSunInfo(view: View3D): void {
        const lights = view.scene.lightManager.directionalLights;
        const source = lights[0] || null;
        const sourceChanged = this.#prevSunSource !== source;
        if (sourceChanged) {
            this.#prevSunSource = source;
            this.#activeSunSource = source;
        }

        if (source) {
            const dir = source.direction;
            const currentDir = this.#params.sunDirection;
            const EPSILON = 0.0001;
            const dirLen = Math.sqrt(dir[0] * dir[0] + dir[1] * dir[1] + dir[2] * dir[2]);
            const normalizedDirX = dirLen > EPSILON ? dir[0] / dirLen : dir[0];
            const normalizedDirY = dirLen > EPSILON ? dir[1] / dirLen : dir[1];
            const normalizedDirZ = dirLen > EPSILON ? dir[2] / dirLen : dir[2];

            const targetDirX = -normalizedDirX;
            const targetDirY = -normalizedDirY;
            const targetDirZ = -normalizedDirZ;

            const directionChanged =
                Math.abs(targetDirX - currentDir[0]) > EPSILON ||
                Math.abs(targetDirY - currentDir[1]) > EPSILON ||
                Math.abs(targetDirZ - currentDir[2]) > EPSILON;

            if (sourceChanged || directionChanged) {
                currentDir[0] = targetDirX;
                currentDir[1] = targetDirY;
                currentDir[2] = targetDirZ;
                this.#markDirty(false, true, true);
            }

            const currentSunIntensity = source.lux * source.intensity;
            if (Math.abs(this.#params.sunIntensity - currentSunIntensity) > EPSILON) {
                this.#params.sunIntensity = currentSunIntensity;
                this.#markDirty(false, false, true);
            }
        }
    }

    #updateLUTs(view: View3D) {
        const {rawCamera} = view;
        const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
        const currentHeightKm = Math.max(0.001, (cameraPos[1] / 1000.0));

        if (Math.abs(this.#params.cameraHeight - currentHeightKm) > 0.0001) {
            this.#params.cameraHeight = currentHeightKm;
            this.#dirtyUniformBuffer = true;
        }

        const camMatrix = rawCamera.viewMatrix;
        let camMoved = false;
        for (let i = 0; i < 16; i++) {
            if (Math.abs(camMatrix[i] - this.#prevCameraMatrix[i]) > 0.0001) {
                camMoved = true;
                break;
            }
        }

        if (camMoved) {
            mat4.copy(this.#prevCameraMatrix, camMatrix);
            this.#dirtySkyView = true;
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
            this.#aerialPerspectiveGenerator.render(view, this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#dirtySkyView = false;
        }

        if (this.#dirtyIBL && !this.#isUpdatingIBL) {
            this.#isUpdatingIBL = true;
            (async () => {
                await this.#specularGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#skyViewGenerator.lutTexture);
                await this.#irradianceGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#skyViewGenerator.lutTexture);
                await this.redGPUContext.resourceManager.irradianceGenerator.render(this.#irradianceGenerator.sourceCubeTexture, this.#irradianceLUT.gpuTexture);
                this.#irradianceLUT.notifyUpdate();
                this.#isUpdatingIBL = false;
            })();
            this.#dirtyIBL = false;
        }
    }

    #setParam(key: string, value: any, lut: boolean, skyView: boolean, ibl: boolean, validator?: (v: any) => void): void {
        if (validator) validator(value);
        (this.#params as any)[key] = value;
        this.#markDirty(lut, skyView, ibl);
    }

    /**
     * [KO] 대기 산란 파라미터 객체를 반환합니다.
     * [EN] Returns the atmospheric scattering parameter object.
     */
    get params() { return this.#params; }

    /**
     * [KO] 공중 투시(Aerial Perspective) 효과가 적용될 거리 스케일 (km)입니다.
     * [EN] Distance scale (km) for Aerial Perspective effect.
     */
    get aerialPerspectiveDistanceScale(): number { return this.#params.aerialPerspectiveDistanceScale; }
    set aerialPerspectiveDistanceScale(v: number) {
        this.#setParam('aerialPerspectiveDistanceScale', v, false, true, true, (v) => validatePositiveNumberRange(v, 1, 1000));
    }

    /**
     * [KO] 공중 투시(Aerial Perspective) 효과가 시작되는 최소 깊이 (km)입니다.
     * [EN] Minimum depth (km) where Aerial Perspective effect starts.
     */
    get aerialPerspectiveStartDepth(): number { return this.#params.aerialPerspectiveStartDepth; }
    set aerialPerspectiveStartDepth(v: number) {
        this.#setParam('aerialPerspectiveStartDepth', v, false, true, true, (v) => validatePositiveNumberRange(v, 0, 100));
    }

    /**
     * [KO] 태양이 지평선 아래로 내려갔을 때 대기가 어두워지는 것을 방지하는 최소 고도 각도 (도)입니다.
     * [EN] Minimum elevation angle (degrees) to prevent the atmosphere from becoming too dark when the sun is below the horizon.
     */
    get transmittanceMinLightElevationAngle(): number { return this.#params.transmittanceMinLightElevationAngle; }
    set transmittanceMinLightElevationAngle(v: number) {
        this.#setParam('transmittanceMinLightElevationAngle', v, true, true, true, (v) => validateNumberRange(v, -90, 90));
    }

    /**
     * [KO] 행성의 바닥 반지름 (km)입니다.
     * [EN] Planet bottom radius (km).
     */
    get groundRadius(): number { return this.#params.groundRadius; }
    set groundRadius(v: number) {
        this.#setParam('groundRadius', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
    }

    /**
     * [KO] 대기층의 유효 높이 (km)입니다.
     * [EN] Effective height of the atmosphere (km).
     */
    get atmosphereHeight(): number { return this.#params.atmosphereHeight; }
    set atmosphereHeight(v: number) {
        this.#setParam('atmosphereHeight', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
    }

    /**
     * [KO] 미 산란(Mie Scattering) 계수 [R, G, B] 배열입니다.
     * [EN] Mie Scattering coefficient [R, G, B] array.
     */
    get mieScattering(): [number, number, number] {
        return [this.#params.mieScattering[0], this.#params.mieScattering[1], this.#params.mieScattering[2]];
    }
    set mieScattering(v: [number, number, number]) {
        this.#setParam('mieScattering', [...v], true, false, true);
    }

    /**
     * [KO] 미 흡수(Mie Absorption) 계수 [R, G, B] 배열입니다.
     * [EN] Mie Absorption coefficient [R, G, B] array.
     */
    get mieAbsorption(): [number, number, number] {
        return [this.#params.mieAbsorption[0], this.#params.mieAbsorption[1], this.#params.mieAbsorption[2]];
    }
    set mieAbsorption(v: [number, number, number]) {
        this.#setParam('mieAbsorption', [...v], true, false, true);
    }

    /**
     * [KO] 레일리 산란(Rayleigh Scattering) 계수 [R, G, B] 배열입니다.
     * [EN] Rayleigh Scattering coefficient [R, G, B] array.
     */
    get rayleighScattering(): [number, number, number] {
        return [this.#params.rayleighScattering[0], this.#params.rayleighScattering[1], this.#params.rayleighScattering[2]];
    }
    set rayleighScattering(v: [number, number, number]) {
        this.#setParam('rayleighScattering', [...v], true, false, true);
    }

    /**
     * [KO] 레일리 산란의 고도 별 지수 분포(Scale Height, km)입니다.
     * [EN] Rayleigh exponential distribution (Scale Height, km).
     */
    get rayleighExponentialDistribution(): number { return this.#params.rayleighExponentialDistribution; }
    set rayleighExponentialDistribution(v: number) {
        this.#setParam('rayleighExponentialDistribution', v, true, false, true, (v) => validatePositiveNumberRange(v, 0.1, 100));
    }

    /**
     * [KO] 미 산란의 고도 별 지수 분포(Scale Height, km)입니다.
     * [EN] Mie exponential distribution (Scale Height, km).
     */
    get mieExponentialDistribution(): number { return this.#params.mieExponentialDistribution; }
    set mieExponentialDistribution(v: number) {
        this.#setParam('mieExponentialDistribution', v, true, false, true, (v) => validatePositiveNumberRange(v, 0.1, 100));
    }

    /**
     * [KO] 미 산란의 비등방성 계수 (g, 0 ~ 0.999)입니다.
     * [EN] Anisotropy factor for Mie scattering (g, 0 to 0.999).
     */
    get mieAnisotropy(): number { return this.#params.mieAnisotropy; }
    set mieAnisotropy(v: number) {
        this.#setParam('mieAnisotropy', v, true, false, true, (v) => validateNumberRange(v, 0, 0.999));
    }

    /**
     * [KO] 지면의 반사율(Albedo) [R, G, B] 배열입니다.
     * [EN] Ground Albedo [R, G, B] array.
     */
    get groundAlbedo(): [number, number, number] {
        return [this.#params.groundAlbedo[0], this.#params.groundAlbedo[1], this.#params.groundAlbedo[2]];
    }
    set groundAlbedo(v: [number, number, number]) {
        this.#setParam('groundAlbedo', [...v], true, false, true);
    }

    /**
     * [KO] 대기 중 흡수 물질(오존 등)의 흡수 계수 [R, G, B] 배열입니다.
     * [EN] Absorption coefficient [R, G, B] array for atmospheric absorbers (e.g. Ozone).
     */
    get absorptionCoefficient(): [number, number, number] {
        return [this.#params.absorptionCoefficient[0], this.#params.absorptionCoefficient[1], this.#params.absorptionCoefficient[2]];
    }
    set absorptionCoefficient(v: [number, number, number]) {
        this.#setParam('absorptionCoefficient', [...v], true, false, true);
    }

    /**
     * [KO] 흡수층(Tent Distribution)의 중심 고도 (km)입니다.
     * [EN] Center altitude (km) of the absorption tip (Tent Distribution).
     */
    get absorptionTipAltitude(): number { return this.#params.absorptionTipAltitude; }
    set absorptionTipAltitude(v: number) {
        this.#setParam('absorptionTipAltitude', v, true, false, true, (v) => validatePositiveNumberRange(0, 100));
    }

    /**
     * [KO] 흡수층의 두께 너비 (km)입니다.
     * [EN] Thickness width (km) of the absorption tent.
     */
    get absorptionTentWidth(): number { return this.#params.absorptionTentWidth; }
    set absorptionTentWidth(v: number) {
        this.#setParam('absorptionTentWidth', v, true, false, true, (v) => validatePositiveNumberRange(v, 1, 50));
    }

    /**
     * [KO] 다중 산란(Multi-Scattering) 에너지 보정 배율입니다.
     * [EN] Multi-Scattering energy compensation factor.
     */
    get multiScatteringFactor(): number { return this.#params.multiScatteringFactor; }
    set multiScatteringFactor(v: number) {
        this.#setParam('multiScatteringFactor', v, true, false, true, (v) => validatePositiveNumberRange(v, 0, 10));
    }

    /**
     * [KO] 태양 본체의 각크기 (도)입니다.
     * [EN] Angular size (degrees) of the sun disk.
     */
    get sunSize(): number { return this.#params.sunSize; }
    set sunSize(v: number) {
        this.#setParam('sunSize', v, false, true, true, (v) => validatePositiveNumberRange(v, 0.01, 10.0));
    }

    /**
     * [KO] 태양의 주연 감광(Limb Darkening) 계수입니다.
     * [EN] Sun's Limb Darkening coefficient.
     */
    get sunLimbDarkening(): number { return this.#params.sunLimbDarkening; }
    set sunLimbDarkening(v: number) {
        this.#setParam('sunLimbDarkening', v, false, false, true, (v) => validateNumberRange(v, 0, 10.0));
    }

    /**
     * [KO] 대기 산란의 전체 휘도 및 색상 틴트 배율 [R, G, B] 배열입니다.
     * [EN] Overall luminance and color tint factor [R, G, B] array for atmospheric scattering.
     */
    get skyLuminanceFactor(): [number, number, number] {
        return [this.#params.skyLuminanceFactor[0], this.#params.skyLuminanceFactor[1], this.#params.skyLuminanceFactor[2]];
    }
    set skyLuminanceFactor(v: [number, number, number]) {
        this.#setParam('skyLuminanceFactor', [...v], true, false, true);
    }

    /**
     * [KO] 대기 투과율(Transmittance) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Transmittance LUT texture.
     */
    get transmittanceLUT(): DirectTexture { return this.#transmittanceGenerator.lutTexture; }

    /**
     * [KO] 다중 산란(Multi-Scattering) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Multi-Scattering LUT texture.
     */
    get multiScatLUT(): DirectTexture { return this.#multiScatteringGenerator.lutTexture; }

    /**
     * [KO] 스카이 뷰(Sky-View) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Sky-View LUT texture.
     */
    get skyViewLUT(): DirectTexture { return this.#skyViewGenerator.lutTexture; }

    /**
     * [KO] 카메라 볼륨(AP) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Camera Volume (AP) LUT texture.
     */
    get aerialPerspectiveLUT(): DirectCubeTexture { return this.#aerialPerspectiveGenerator.lutTexture; }

    /**
     * [KO] 대기 조도(Irradiance) LUT 텍스처를 반환합니다.
     * [EN] Returns the atmospheric Irradiance LUT texture.
     */
    get skyAtmosphereIrradianceLUT(): DirectCubeTexture { return this.#irradianceLUT; }

    /**
     * [KO] 프리필터링된 대기 반사 큐브맵을 반환합니다.
     * [EN] Returns the pre-filtered atmospheric reflection cubemap.
     */
    get skyAtmosphereReflectionLUT(): DirectCubeTexture { return this.#specularGenerator.prefilteredTexture; }

    /**
     * [KO] 대기 산란 전용 샘플러를 반환합니다.
     * [EN] Returns the dedicated atmosphere sampler.
     */
    get atmosphereSampler() { return this.#sampler; }

    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        const {gpuDevice, resourceManager, antialiasingManager} = this.redGPUContext;
        this.#performUpdate(view);

        const {useMSAA, msaaID} = antialiasingManager;
        const depthView = view.viewRenderTextureManager.depthTextureView;
        const peUniformBuffer = view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer;

        const dimensionsChanged = !this.#outputTexture || this.#prevDimensions?.width !== width || this.#prevDimensions?.height !== height;
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
        const peUniformBufferChanged = this.#prevPEUniformBuffer !== peUniformBuffer;

        if (dimensionsChanged) {
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

        const pipeline = this.#getPipeline(useMSAA);

        let currentBindGroup0: GPUBindGroup;
        if (view.renderViewStateData.swapBufferIndex === 0) {
            if (!this.#bindGroup0_swap0 || msaaChanged || this.#prevSourceView_swap0 !== sourceTextureInfo.textureView || this.#prevDepthView_swap0 !== depthView) {
                this.#prevSourceView_swap0 = sourceTextureInfo.textureView;
                this.#prevDepthView_swap0 = depthView;
                this.#bindGroup0_swap0 = gpuDevice.createBindGroup({
                    label: 'SKY_ATMOSPHERE_PE_BG_0_SWAP0',
                    layout: this.#getBindGroupLayout0(useMSAA),
                    entries: [
                        {binding: 0, resource: sourceTextureInfo.textureView},
                        {binding: 1, resource: depthView},
                        {binding: 2, resource: this.#transmittanceGenerator.lutTexture.gpuTextureView},
                        {binding: 3, resource: this.#multiScatteringGenerator.lutTexture.gpuTextureView},
                        {binding: 4, resource: this.skyViewLUT.gpuTextureView},
                        {binding: 5, resource: this.aerialPerspectiveLUT.gpuTexture.createView({dimension: '3d'})},
                        {binding: 6, resource: this.atmosphereSampler.gpuSampler},
                        {binding: 7, resource: this.skyAtmosphereIrradianceLUT.gpuTextureView}
                    ]
                });
            }
            currentBindGroup0 = this.#bindGroup0_swap0;
        } else {
            if (!this.#bindGroup0_swap1 || msaaChanged || this.#prevSourceView_swap1 !== sourceTextureInfo.textureView || this.#prevDepthView_swap1 !== depthView) {
                this.#prevSourceView_swap1 = sourceTextureInfo.textureView;
                this.#prevDepthView_swap1 = depthView;
                this.#bindGroup0_swap1 = gpuDevice.createBindGroup({
                    label: 'SKY_ATMOSPHERE_PE_BG_0_SWAP1',
                    layout: this.#getBindGroupLayout0(useMSAA),
                    entries: [
                        {binding: 0, resource: sourceTextureInfo.textureView},
                        {binding: 1, resource: depthView},
                        {binding: 2, resource: this.#transmittanceGenerator.lutTexture.gpuTextureView},
                        {binding: 3, resource: this.#multiScatteringGenerator.lutTexture.gpuTextureView},
                        {binding: 4, resource: this.skyViewLUT.gpuTextureView},
                        {binding: 5, resource: this.aerialPerspectiveLUT.gpuTexture.createView({dimension: '3d'})},
                        {binding: 6, resource: this.atmosphereSampler.gpuSampler},
                        {binding: 7, resource: this.skyAtmosphereIrradianceLUT.gpuTextureView}
                    ]
                });
            }
            currentBindGroup0 = this.#bindGroup0_swap1;
        }

        if (!this.#bindGroup1 || dimensionsChanged || peUniformBufferChanged) {
            this.#prevPEUniformBuffer = peUniformBuffer;
            this.#bindGroup1 = gpuDevice.createBindGroup({
                label: 'SKY_ATMOSPHERE_PE_BG_1',
                layout: this.#bindGroupLayout1,
                entries: [
                    {binding: 0, resource: this.#outputTextureView},
                    {binding: 1, resource: {buffer: peUniformBuffer}}
                ]
            });
        }

        const commandEncoder = gpuDevice.createCommandEncoder({label: 'SkyAtmosphere_PE_Pass'});
        const passEncoder = commandEncoder.beginComputePass();

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, currentBindGroup0);
        passEncoder.setBindGroup(1, this.#bindGroup1);
        passEncoder.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        this.#prevMSAA = useMSAA;
        this.#prevMSAAID = msaaID;

        return {texture: this.#outputTexture, textureView: this.#outputTextureView};
    }

    #updateSharedUniformBuffer(): void {
        const {members} = UNIFORM_STRUCT;
        const dataViewF32 = this.#sharedUniformBuffer.dataViewF32;
        const dataViewU32 = this.#sharedUniformBuffer.dataViewU32;

        for (const [key, member] of Object.entries(members)) {
            const value = (this.#params as any)[key];
            if (value !== undefined) {
                const targetMember = member as any;
                const offset = targetMember.uniformOffset / 4;
                if (typeof value === 'number') {
                    if (targetMember.View === Float32Array) dataViewF32[offset] = value;
                    else dataViewU32[offset] = value;
                } else if (value instanceof Float32Array || Array.isArray(value)) {
                    for (let i = 0; i < value.length; i++) dataViewF32[offset + i] = value[i];
                }
            }
        }
        this.redGPUContext.gpuDevice.queue.writeBuffer(this.#sharedUniformBuffer.gpuBuffer, 0, this.#sharedUniformBuffer.data);
    }

    #initShaders(): void {
        const {resourceManager} = this.redGPUContext;
        const createCode = (useMSAA: boolean) => {
            const rawCode = [
                '#redgpu_include depth.getLinearizeDepth',
                '#redgpu_include skyAtmosphere.skyAtmosphereFn',
                '@group(0) @binding(0) var sourceTexture : texture_2d<f32>;',
                `@group(0) @binding(1) var depthTexture : ${useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d'};`,
                '@group(0) @binding(2) var transmittanceLUT : texture_2d<f32>;',
                '@group(0) @binding(3) var multiScatLUT : texture_2d<f32>;',
                '@group(0) @binding(4) var skyViewLUT : texture_2d<f32>;',
                '@group(0) @binding(5) var aerialPerspectiveLUT : texture_3d<f32>;',
                '@group(0) @binding(6) var skyAtmosphereSampler : sampler;',
                '@group(0) @binding(7) var skyAtmosphereIrradianceLUT : texture_cube<f32>;',
                '',
                '@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;',
                ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM,
                '',
                'fn fetchDepth(pos: vec2<u32>) -> f32 {',
                '    let dSize = textureDimensions(depthTexture);',
                '    let clampedPos = min(pos, dSize - 1u);',
                '    return textureLoad(depthTexture, clampedPos, 0);',
                '}',
                '',
                '@compute @workgroup_size(16, 16)',
                'fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {',
                '    let uniforms = systemUniforms.skyAtmosphere;',
                '    let viewHeight = uniforms.cameraHeight;',
                '    let groundRadius = uniforms.groundRadius;',
                '    let atmosphereHeight = uniforms.atmosphereHeight;',
                computeCode_wgsl,
                '}'
            ].join('\n');

            return parseWGSL(`SkyAtmosphere_PE_Code_${useMSAA ? 'MSAA' : 'NonMSAA'}`, rawCode, AtmosphereShaderLibrary).defaultSource;
        };

        this.#computeShaderMSAA = resourceManager.createGPUShaderModule('SkyAtmosphere_PE_MSAA_ShaderModule', {code: createCode(true)});
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule('SkyAtmosphere_PE_NonMSAA_ShaderModule', {code: createCode(false)});
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
}

Object.freeze(SkyAtmosphere);
export default SkyAtmosphere;
