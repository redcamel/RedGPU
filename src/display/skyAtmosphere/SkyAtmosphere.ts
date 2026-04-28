import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import AerialPerspectiveGenerator from "./core/generator/aerialPerspective/AerialPerspectiveGenerator";
import transmittanceShaderCode_wgsl from "./core/generator/transmittance/transmittanceShaderCode.wgsl";
import computeCode_wgsl from "./wgsl/computeCode.wgsl";
import Sampler from "../../resources/sampler/Sampler";
import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";
import parseWGSL from "../../resources/wgslParser/parseWGSL";

import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../resources/texture/DirectTexture";

import {mat4} from "gl-matrix";
import RenderViewStateData from "../../display/view/core/RenderViewStateData";
import AtmosphereShaderLibrary from "./core/AtmosphereShaderLibrary";
import DirectionalLight from "../../light/lights/DirectionalLight";
import SkyLight from "./skyLight/SkyLight";
import SkyAtmosphereBackground from "./skyAtmosphereBackground/SkyAtmosphereBackground";

const SHADER_INFO = parseWGSL('SkyAtmosphere_Core', transmittanceShaderCode_wgsl, AtmosphereShaderLibrary);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

class SkyAtmosphere extends ASinglePassPostEffect {
    #transmittanceGenerator: TransmittanceGenerator;
    #multiScatteringGenerator: MultiScatteringGenerator;
    #skyViewGenerator: SkyViewGenerator;
    #aerialPerspectiveGenerator: AerialPerspectiveGenerator;
    #sampler: Sampler;
    #sharedUniformBuffer: UniformBuffer;
    #skyLight: SkyLight;

    #backgroundRenderer: SkyAtmosphereBackground;

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
    #dirtyUniformBuffer: boolean = true;

    #lastUpdateFrame: number = -1;
    #prevCameraMatrix: mat4 = mat4.create();

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
        if (ibl) this.#skyLight.dirty = true;
    }

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
        
        this.#skyLight = new SkyLight(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#backgroundRenderer = new SkyAtmosphereBackground(redGPUContext);

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
    }

    renderBackground(renderViewStateData: RenderViewStateData) {
        const {view} = renderViewStateData;
        this.#performUpdate(view);
        this.#backgroundRenderer.render(
            renderViewStateData,
            this.#transmittanceGenerator.lutTexture,
            this.skyViewLUT,
            this.#sampler
        );
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
            this.#skyLight.dirty = true;
        }

        if (this.#dirtySkyView) {
            this.#skyViewGenerator.render(this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#aerialPerspectiveGenerator.render(view, this.#transmittanceGenerator.lutTexture, this.#multiScatteringGenerator.lutTexture);
            this.#dirtySkyView = false;
        }

        this.#skyLight.update(this);
    }

    #setParam(key: string, value: any, lut: boolean, skyView: boolean, ibl: boolean, validator?: (v: any) => void): void {
        if (validator) validator(value);
        (this.#params as any)[key] = value;
        this.#markDirty(lut, skyView, ibl);
    }

    get params() { return this.#params; }

    get aerialPerspectiveDistanceScale(): number { return this.#params.aerialPerspectiveDistanceScale; }
    set aerialPerspectiveDistanceScale(v: number) {
        this.#setParam('aerialPerspectiveDistanceScale', v, false, true, true, (v) => validatePositiveNumberRange(v, 1, 1000));
    }

    get aerialPerspectiveStartDepth(): number { return this.#params.aerialPerspectiveStartDepth; }
    set aerialPerspectiveStartDepth(v: number) {
        this.#setParam('aerialPerspectiveStartDepth', v, false, true, true, (v) => validatePositiveNumberRange(v, 0, 100));
    }

    get transmittanceMinLightElevationAngle(): number { return this.#params.transmittanceMinLightElevationAngle; }
    set transmittanceMinLightElevationAngle(v: number) {
        this.#setParam('transmittanceMinLightElevationAngle', v, true, true, true, (v) => validateNumberRange(v, -90, 90));
    }

    get groundRadius(): number { return this.#params.groundRadius; }
    set groundRadius(v: number) {
        this.#setParam('groundRadius', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
    }

    get atmosphereHeight(): number { return this.#params.atmosphereHeight; }
    set atmosphereHeight(v: number) {
        this.#setParam('atmosphereHeight', v, true, false, true, (v) => validatePositiveNumberRange(v, 1));
    }

    get mieScattering(): [number, number, number] {
        return [this.#params.mieScattering[0], this.#params.mieScattering[1], this.#params.mieScattering[2]];
    }
    set mieScattering(v: [number, number, number]) {
        this.#setParam('mieScattering', [...v], true, false, true);
    }

    get mieAbsorption(): [number, number, number] {
        return [this.#params.mieAbsorption[0], this.#params.mieAbsorption[1], this.#params.mieAbsorption[2]];
    }
    set mieAbsorption(v: [number, number, number]) {
        this.#setParam('mieAbsorption', [...v], true, false, true);
    }

    get rayleighScattering(): [number, number, number] {
        return [this.#params.rayleighScattering[0], this.#params.rayleighScattering[1], this.#params.rayleighScattering[2]];
    }
    set rayleighScattering(v: [number, number, number]) {
        this.#setParam('rayleighScattering', [...v], true, false, true);
    }

    get rayleighExponentialDistribution(): number { return this.#params.rayleighExponentialDistribution; }
    set rayleighExponentialDistribution(v: number) {
        this.#setParam('rayleighExponentialDistribution', v, true, false, true, (v) => validatePositiveNumberRange(v, 0.1, 100));
    }

    get mieExponentialDistribution(): number { return this.#params.mieExponentialDistribution; }
    set mieExponentialDistribution(v: number) {
        this.#setParam('mieExponentialDistribution', v, true, false, true, (v) => validatePositiveNumberRange(v, 0.1, 100));
    }

    get mieAnisotropy(): number { return this.#params.mieAnisotropy; }
    set mieAnisotropy(v: number) {
        this.#setParam('mieAnisotropy', v, true, false, true, (v) => validateNumberRange(v, 0, 0.999));
    }

    get groundAlbedo(): [number, number, number] {
        return [this.#params.groundAlbedo[0], this.#params.groundAlbedo[1], this.#params.groundAlbedo[2]];
    }
    set groundAlbedo(v: [number, number, number]) {
        this.#setParam('groundAlbedo', [...v], true, false, true);
    }

    get absorptionCoefficient(): [number, number, number] {
        return [this.#params.absorptionCoefficient[0], this.#params.absorptionCoefficient[1], this.#params.absorptionCoefficient[2]];
    }
    set absorptionCoefficient(v: [number, number, number]) {
        this.#setParam('absorptionCoefficient', [...v], true, false, true);
    }

    get absorptionTipAltitude(): number { return this.#params.absorptionTipAltitude; }
    set absorptionTipAltitude(v: number) {
        this.#setParam('absorptionTipAltitude', v, true, false, true, (v) => validatePositiveNumberRange(0, 100));
    }

    get absorptionTentWidth(): number { return this.#params.absorptionTentWidth; }
    set absorptionTentWidth(v: number) {
        this.#setParam('absorptionTentWidth', v, true, false, true, (v) => validatePositiveNumberRange(v, 1, 50));
    }

    get multiScatteringFactor(): number { return this.#params.multiScatteringFactor; }
    set multiScatteringFactor(v: number) {
        this.#setParam('multiScatteringFactor', v, true, false, true, (v) => validatePositiveNumberRange(v, 0, 10));
    }

    get sunSize(): number { return this.#params.sunSize; }
    set sunSize(v: number) {
        this.#setParam('sunSize', v, false, true, true, (v) => validatePositiveNumberRange(v, 0.01, 10.0));
    }

    get sunLimbDarkening(): number { return this.#params.sunLimbDarkening; }
    set sunLimbDarkening(v: number) {
        this.#setParam('sunLimbDarkening', v, false, false, true, (v) => validateNumberRange(v, 0, 10.0));
    }

    get skyLuminanceFactor(): [number, number, number] {
        return [this.#params.skyLuminanceFactor[0], this.#params.skyLuminanceFactor[1], this.#params.skyLuminanceFactor[2]];
    }
    set skyLuminanceFactor(v: [number, number, number]) {
        this.#setParam('skyLuminanceFactor', [...v], true, false, true);
    }

    get transmittanceLUT(): DirectTexture { return this.#transmittanceGenerator.lutTexture; }

    get multiScatLUT(): DirectTexture { return this.#multiScatteringGenerator.lutTexture; }

    get skyViewLUT(): DirectTexture { return this.#skyViewGenerator.lutTexture; }

    get aerialPerspectiveLUT(): DirectCubeTexture { return this.#aerialPerspectiveGenerator.lutTexture; }

    get skyAtmosphereIrradianceLUT(): DirectCubeTexture { return this.#skyLight.irradianceLUT; }

    get skyAtmosphereReflectionLUT(): DirectCubeTexture { return this.#skyLight.reflectionLUT; }

    get skyLight(): SkyLight { return this.#skyLight; }

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