import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import TransmittanceGenerator from "./core/generator/transmittance/TransmittanceGenerator";
import MultiScatteringGenerator from "./core/generator/multiScattering/MultiScatteringGenerator";
import SkyViewGenerator from "./core/generator/skyView/SkyViewGenerator";
import AerialPerspectiveGenerator from "./core/generator/aerialPerspective/AerialPerspectiveGenerator";
import transmittanceShaderCode_wgsl from "./core/generator/transmittance/transmittanceShaderCode.wgsl";
import Sampler from "../../resources/sampler/Sampler";
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
import SkyAtmospherePostEffect from "./skyAtmospherePostEffect/SkyAtmospherePostEffect";
import {ASinglePassPostEffectResult} from "../../postEffect/core/ASinglePassPostEffect";

const SHADER_INFO = parseWGSL('SkyAtmosphere_Core', transmittanceShaderCode_wgsl, AtmosphereShaderLibrary);
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

/**
 * [KO] SkyAtmosphere 클래스는 대기 산란 물리 시뮬레이션의 핵심 시스템입니다.
 * [EN] The SkyAtmosphere class is the core system of atmospheric scattering physical simulation.
 */
class SkyAtmosphere {
    #redGPUContext: RedGPUContext;
    #transmittanceGenerator: TransmittanceGenerator;
    #multiScatteringGenerator: MultiScatteringGenerator;
    #skyViewGenerator: SkyViewGenerator;
    #aerialPerspectiveGenerator: AerialPerspectiveGenerator;
    #sampler: Sampler;
    #sharedUniformBuffer: UniformBuffer;
    #skyLight: SkyLight;

    #backgroundRenderer: SkyAtmosphereBackground;
    #postEffect: SkyAtmospherePostEffect;

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

    #markDirty(lut: boolean, skyView: boolean, ibl: boolean): void {
        this.#dirtyUniformBuffer = true;
        if (lut) this.#dirtyLUT = true;
        if (skyView) this.#dirtySkyView = true;
        if (ibl) this.#skyLight.dirty = true;
    }

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;

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
        this.#postEffect = new SkyAtmospherePostEffect(redGPUContext, this);
    }

    /** [KO] RedGPU 컨텍스트 반환 [EN] Returns RedGPU Context */
    get redGPUContext(): RedGPUContext { return this.#redGPUContext; }

    /** [KO] Post Effect 인스턴스 반환 [EN] Returns Post Effect instance */
    get postEffect(): SkyAtmospherePostEffect { return this.#postEffect; }

    /**
     * [KO] 배경 렌더링을 수행합니다. (무한 거리 배경 처리 전용)
     * [EN] Performs background rendering. (Dedicated to infinite distance background processing)
     */
    renderBackground(renderViewStateData: RenderViewStateData) {
        const {view} = renderViewStateData;
        this.#performUpdate(view);
        this.#backgroundRenderer.render(
            renderViewStateData,
            this.#transmittanceGenerator.lutTexture,
            this.#multiScatteringGenerator.lutTexture,
            this.skyViewLUT,
            this.#sampler
        );
    }

    /**
     * [KO] 포스트 이펙트 렌더링을 수행합니다. (오브젝트 영역 대기 투과 처리 전용)
     * [EN] Performs post-effect rendering. (Dedicated to atmospheric transmittance on object regions)
     */
    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        this.#performUpdate(view);
        return this.#postEffect.render(view, width, height, sourceTextureInfo);
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
}

Object.freeze(SkyAtmosphere);
export default SkyAtmosphere;
