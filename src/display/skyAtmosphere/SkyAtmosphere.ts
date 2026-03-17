import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import AerialPerspectiveGenerator from "./core/generator/aerialPerspective/AerialPerspectiveGenerator";
import SkyAtmosphereIrradianceGenerator from "./core/generator/ibl/irradiance/SkyAtmosphereIrradianceGenerator";
import SkyAtmosphereReflectionGenerator from "./core/generator/ibl/reflection/SkyAtmosphereReflectionGenerator";
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

const SHADER_INFO = parseWGSL('SkyAtmosphere_Core', transmittanceShaderCode_wgsl, AtmosphereShaderLibrary);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

const BACKGROUND_SHADER_INFO = parseWGSL('SkyAtmosphere_Background_Vertex', backgroundVertexShaderCode_wgsl);
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
    #aerialPerspectiveGenerator: AerialPerspectiveGenerator;
    #skyAtmosphereIrradianceGenerator: SkyAtmosphereIrradianceGenerator;
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
        sunElevation: 90.0,
        sunAzimuth: 0.0,
        cameraHeight: 0.001,
        useGround: 1.0,
        showGround: 1.0,
        seaLevel: 0.0,
        aerialPerspectiveDistanceScale: 100.0,
        heightFogAnisotropy: 0.7,
        sunLimbDarkening: 0.67,
        skyLuminanceFactor: 1.0
    };

    #sunSource: DirectionalLight = null;
    #activeSunSource: DirectionalLight = null;
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
        this.#skyAtmosphereIrradianceGenerator = new SkyAtmosphereIrradianceGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#reflectionGenerator = new SkyAtmosphereReflectionGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);

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
        // [KO] 동일 프레임에서 중복 업데이트 방지 (renderBackground와 render가 모두 활성화된 경우 대응)
        // [EN] Prevent redundant updates in the same frame (handles cases where both renderBackground and render are active)
        const currentFrame = view.renderViewStateData.frameIndex;
        if (this.#lastUpdateFrame === currentFrame) return;
        this.#lastUpdateFrame = currentFrame;

        this.#updateSunInfo(view);
        this.#updateLUTs(view);
    }

    #updateSunInfo(view: View3D): void {
        const findSource = (): DirectionalLight | null => {
            // [KO] 명시적으로 지정된 소스가 있으면 최우선 사용
            // [EN] Use explicitly specified source as top priority
            if (this.#sunSource) return this.#sunSource;
            
            // [KO] 규약에 따라 씬의 첫 번째 직사광(index 0)을 태양 소스로 사용
            // [EN] By convention, use the first directional light (index 0) in the scene as the sun source
            const lights = view.scene.lightManager.directionalLights;
            return lights[0] || null;
        };

        const source = findSource();
        this.#activeSunSource = source;
        if (source) {
            const dir = source.direction;
            const currentDir = this.#params.sunDirection;
            const EPSILON = 0.0001;

            const targetDirX = -dir[0];
            const targetDirY = -dir[1];
            const targetDirZ = -dir[2];

            if (
                Math.abs(targetDirX - currentDir[0]) > EPSILON ||
                Math.abs(targetDirY - currentDir[1]) > EPSILON ||
                Math.abs(targetDirZ - currentDir[2]) > EPSILON
            ) {
                currentDir[0] = targetDirX;
                currentDir[1] = targetDirY;
                currentDir[2] = targetDirZ;

                // [KO] 광원 방향이 변경되었으므로 구면 좌표계(고도, 방위각) 동기화
                // [EN] Since light direction changed, sync spherical coordinates (elevation, azimuth)
                this.#params.sunElevation = Math.asin(currentDir[1]) * 180 / Math.PI;
                this.#params.sunAzimuth = Math.atan2(currentDir[2], currentDir[0]) * 180 / Math.PI;

                this.#markDirty(false, true, true);
            }

            if (Math.abs(this.#params.sunIntensity - source.intensity) > EPSILON) {
                this.#params.sunIntensity = source.intensity;
                this.#markDirty(false, false, true);
            }
        }
    }

    #updateLUTs(view: View3D) {
        const {rawCamera} = view;
        const cameraPos = [rawCamera.x, rawCamera.y, rawCamera.z];
        const currentHeightKm = Math.max(0.001, (cameraPos[1] / 1000.0) - this.#params.seaLevel);

        if (Math.abs(this.#params.cameraHeight - currentHeightKm) > 0.0001) {
            this.#params.cameraHeight = currentHeightKm;
            this.#dirtyUniformBuffer = true;
        }

        // [KO] 카메라 행렬 변경 감지: AP LUT는 카메라 위치/회전에 종속적이므로 이동 시에만 갱신
        // [EN] Camera matrix change detection: AP LUT is dependent on camera pos/rot, so update only when moved
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
            // [KO] IBL 생성은 매우 무거우므로 중복 실행을 방지하기 위해 락(Lock) 메커니즘 적용
            // [EN] IBL generation is very heavy, so apply a lock mechanism to prevent redundant execution
            this.#isUpdatingIBL = true;
            (async () => {
                await this.#reflectionGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#skyViewGenerator.lutTexture);
                await this.#skyAtmosphereIrradianceGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture, this.#skyViewGenerator.lutTexture);
                this.#isUpdatingIBL = false;
            })();
            this.#dirtyIBL = false;
        }
    }

    /**
     * [KO] 파라미터 업데이트를 위한 통합 헬퍼 메서드입니다.
     * [EN] Integrated helper method for parameter updates.
     */
    #setParam(key: string, value: any, lut: boolean, skyView: boolean, ibl: boolean, validator?: (v: any) => void): void {
        if (validator) validator(value);
        (this.#params as any)[key] = value;
        this.#markDirty(lut, skyView, ibl);
    }

    /**
     * [KO] 지표면 기준 고도 오프셋 (km)입니다.
     * [EN] Sea level altitude offset (km).
     */
    get seaLevel(): number { return this.#params.seaLevel; }
    set seaLevel(v: number) { this.#setParam('seaLevel', v, false, true, true); }

    /**
     * [KO] 태양의 고도(Elevation, 도)입니다.
     * [EN] Sun elevation (degrees).
     */
    get sunElevation(): number { return this.#params.sunElevation; }
    set sunElevation(v: number) {
        this.#params.sunElevation = v;
        this.#updateDirectionFromSpherical();
    }

    /**
     * [KO] 태양의 방위각(Azimuth, 도)입니다.
     * [EN] Sun azimuth (degrees).
     */
    get sunAzimuth(): number { return this.#params.sunAzimuth; }
    set sunAzimuth(v: number) {
        this.#params.sunAzimuth = v;
        this.#updateDirectionFromSpherical();
    }

    #updateDirectionFromSpherical() {
        const el = this.#params.sunElevation * Math.PI / 180;
        const az = this.#params.sunAzimuth * Math.PI / 180;

        const cosEl = Math.cos(el);
        const x = cosEl * Math.cos(az);
        const y = Math.sin(el);
        const z = cosEl * Math.sin(az);

        const currentDir = this.#params.sunDirection;
        currentDir[0] = x;
        currentDir[1] = y;
        currentDir[2] = z;

        // [KO] 활성 광원이 존재하면 해당 광원의 방향도 업데이트 (광원 방향 = -태양 방향)
        // [EN] If an active light source exists, update its direction as well (light direction = -sun direction)
        if (this.#activeSunSource) {
            this.#activeSunSource.direction = [-x, -y, -z];
        }

        this.#markDirty(false, true, true);
    }

    /**
     * [KO] 대기 산란의 광원 데이터를 제공할 DirectionalLight를 설정합니다.
     * [EN] Sets the DirectionalLight that will provide light source data for atmospheric scattering.
     */
    get sunSource(): DirectionalLight { return this.#sunSource; }
    set sunSource(v: DirectionalLight) {
        this.#sunSource = v;
        this.#activeSunSource = v;
        this.#markDirty(false, true, true);
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
        this.#setParam('aerialPerspectiveDistanceScale', v, false, true, true, (v) => validatePositiveNumberRange(v, 1, 1000));
    }

    /**
     * [KO] 높이 안개의 비등방성 계수 (g, 0 ~ 0.999)입니다.
     * [EN] Anisotropy factor for height fog (g, 0 to 0.999).
     */
    get heightFogAnisotropy(): number { return this.#params.heightFogAnisotropy; }
    set heightFogAnisotropy(v: number) {
        this.#setParam('heightFogAnisotropy', v, false, true, true, (v) => validateNumberRange(v, 0, 0.999));
    }

    /**
     * [KO] 태양의 조도 강도입니다.
     * [EN] Sun's illuminance intensity.
     */
    get sunIntensity(): number { return this.#params.sunIntensity; }
    set sunIntensity(v: number) {
        this.#setParam('sunIntensity', v, false, false, true, (v) => validatePositiveNumberRange(v, 0, 10000));
    }

    /**
     * [KO] 행성의 바닥 반지름 (km)입니다.
     * [EN] Planet bottom radius (km).
     */
    get bottomRadius(): number { return this.#params.bottomRadius; }
    set bottomRadius(v: number) {
        this.#setParam('bottomRadius', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
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
     * [KO] 미 산란(Mie Scattering) 계수입니다.
     * [EN] Mie Scattering coefficient.
     */
    get mieScattering(): number { return this.#params.mieScattering; }
    set mieScattering(v: number) {
        this.#setParam('mieScattering', v, true, false, true, (v) => validatePositiveNumberRange(v, 0, 1.0));
    }

    /**
     * [KO] 미 흡수(Mie Absorption) 계수입니다.
     * [EN] Mie Absorption coefficient.
     */
    get mieAbsorption(): number { return this.#params.mieAbsorption; }
    set mieAbsorption(v: number) {
        this.#setParam('mieAbsorption', v, true, false, true, (v) => validatePositiveNumberRange(v, 0, 1.0));
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
     * [KO] 지면 환경광 강도입니다.
     * [EN] Ground ambient light intensity.
     */
    get groundAmbient(): number { return this.#params.groundAmbient; }
    set groundAmbient(v: number) {
        this.#setParam('groundAmbient', v, false, false, true, (v) => validatePositiveNumberRange(v, 0, 10));
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
     * [KO] 높이 안개의 밀도 계수입니다.
     * [EN] Density coefficient for height fog.
     */
    get heightFogDensity(): number { return this.#params.heightFogDensity; }
    set heightFogDensity(v: number) {
        this.#setParam('heightFogDensity', v, false, false, true, (v) => validatePositiveNumberRange(v, 0, 10));
    }

    /**
     * [KO] 높이 안개의 감쇄 지수(Falloff)입니다.
     * [EN] Falloff exponent for height fog.
     */
    get heightFogFalloff(): number { return this.#params.heightFogFalloff; }
    set heightFogFalloff(v: number) {
        this.#setParam('heightFogFalloff', v, false, false, true, (v) => validatePositiveNumberRange(v, 0.001, 10));
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
     * [KO] 미 산란 글로우(Mie Glow) 강도 (0 ~ 0.999)입니다.
     * [EN] Mie Glow intensity (0 to 0.999).
     */
    get mieGlow(): number { return this.#params.mieGlow; }
    set mieGlow(v: number) {
        this.#setParam('mieGlow', v, false, true, true, (v) => validateNumberRange(v, 0, 0.999));
    }

    /**
     * [KO] 미 산란 헤일로(Mie Halo)의 비등방성 계수 (0 ~ 0.999)입니다.
     * [EN] Anisotropy factor for Mie Halo (0 to 0.999).
     */
    get mieHalo(): number { return this.#params.mieHalo; }
    set mieHalo(v: number) {
        this.#setParam('mieHalo', v, false, false, true, (v) => validateNumberRange(v, 0, 0.999));
    }

    /**
     * [KO] 지면 사용 여부를 설정합니다.
     * [EN] Sets whether to use the ground.
     */
    get useGround(): boolean { return !!this.#params.useGround; }
    set useGround(v: boolean) { this.#setParam('useGround', v ? 1.0 : 0.0, true, true, true); }

    /**
     * [KO] 지면 표시 여부를 설정합니다.
     * [EN] Sets whether to show the ground.
     */
    get showGround(): boolean { return !!this.#params.showGround; }
    set showGround(v: boolean) { this.#setParam('showGround', v ? 1.0 : 0.0, true, true, true); }

    /**
     * [KO] 태양의 주연 감광(Limb Darkening) 계수입니다.
     * [EN] Sun's Limb Darkening coefficient.
     */
    get sunLimbDarkening(): number { return this.#params.sunLimbDarkening; }
    set sunLimbDarkening(v: number) {
        this.#setParam('sunLimbDarkening', v, false, false, true, (v) => validateNumberRange(v, 0, 10.0));
    }

    /**
     * [KO] 대기 산란의 전체 휘도 배율입니다.
     * [EN] Overall luminance factor for atmospheric scattering.
     */
    get skyLuminanceFactor(): number { return this.#params.skyLuminanceFactor; }
    set skyLuminanceFactor(v: number) {
        this.#setParam('skyLuminanceFactor', v, true, false, true, (v) => validatePositiveNumberRange(v, 0, 100.0));
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
    get skyAtmosphereIrradianceLUT(): DirectCubeTexture { return this.#skyAtmosphereIrradianceGenerator.lutTexture; }

    /**
     * [KO] 프리필터링된 대기 반사 큐브맵을 반환합니다.
     * [EN] Returns the pre-filtered atmospheric reflection cubemap.
     */
    get skyAtmosphereReflectionLUT(): DirectCubeTexture { return this.#reflectionGenerator.prefilteredTexture; }

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
        const {gpuDevice, resourceManager, antialiasingManager} = this.redGPUContext;
        this.#performUpdate(view);

        const {useMSAA, msaaID} = antialiasingManager;
        const depthView = view.viewRenderTextureManager.depthTextureView;
        const peUniformBuffer = view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer;

        // [KO] 리소스 변경 감지 플래그 정의 (ASinglePassPostEffect 패턴 준수)
        // [EN] Define resource change detection flags (Following ASinglePassPostEffect pattern)
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

        // [KO] bindGroup0 최적화: swap0/swap1 각각에 대해 변경 감지 및 캐싱 수행
        // [EN] bindGroup0 optimization: Perform change detection and caching for swap0/swap1 respectively
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

        // [KO] bindGroup1 최적화: 출력 텍스처(크기 변경 포함)나 시스템 유니폼 버퍼가 변경된 경우에만 생성
        // [EN] bindGroup1 optimization: Generate only when output texture (including size change) or system uniform buffer changes
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
                '    let bottomRadius = uniforms.bottomRadius;',
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
