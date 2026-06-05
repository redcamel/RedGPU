import RedGPUContext from "../../../context/RedGPUContext";
import SkyAtmosphere from "../SkyAtmosphere";
import SkyLightReflectionGenerator from "./core/SkyLightReflectionGenerator";
import SkyLightIrradianceGenerator from "./core/SkyLightIrradianceGenerator";
import DirectCubeTexture from "../../../resources/texture/DirectCubeTexture";
import createUUID from "../../../utils/uuid/createUUID";
import Sampler from "../../../resources/sampler/Sampler";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import RedGPUObject from "../../../base/RedGPUObject";

/**
 * [KO] SkyLight 클래스는 SkyAtmosphere의 대기 산란 데이터를 실시간으로 분석하여 씬의 간접 조명(IBL)을 생성합니다.
 * [EN] The SkyLight class analyzes SkyAtmosphere's atmospheric scattering data in real-time to generate indirect lighting (IBL) for the scene.
 *
 * [KO] 대기색에 기반한 디퓨즈(Irradiance) 및 스펙큘러(Reflection) 큐브맵을 베이킹하여, 물체들이 하늘색과 태양 위치에 따라 실시간으로 반응하도록 합니다.
 * [EN] Bakes diffuse (Irradiance) and specular (Reflection) cubemaps based on atmospheric color, allowing objects to react in real-time to the sky color and sun position.
 */
class SkyLight extends RedGPUObject {
    /**
     * [KO] IBL 갱신 여부 (true일 경우 다음 프레임에 갱신 수행)
     * [EN] Whether IBL needs to be updated (if true, update is performed on the next frame)
     */
    dirty: boolean = true;
    #reflectionGenerator: SkyLightReflectionGenerator;
    #irradianceGenerator: SkyLightIrradianceGenerator;
    #irradianceLUT: DirectCubeTexture;
    #sampler: Sampler;
    #sharedUniformBuffer: UniformBuffer;
    #isUpdatingIBL: boolean = false;

    /**
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     * @param sharedUniformBuffer - [KO] 공유 유니폼 버퍼 [EN] Shared uniform buffer
     * @param sampler - [KO] 대기 산란용 샘플러 [EN] Sampler for atmospheric scattering
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext);
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = sampler;

        this.#irradianceLUT = new DirectCubeTexture(redGPUContext, `SkyAtmosphere_Irradiance_LUTTexture_${createUUID()}`,
            this.resourceManager.createManagedTexture({
                size: [32, 32, 6],
                format: 'rgba16float',
                usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
                dimension: '2d',
                mipLevelCount: 1,
                label: 'SkyAtmosphere_Irradiance_LUT'
            })
        );
        this.#reflectionGenerator = new SkyLightReflectionGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
        this.#irradianceGenerator = new SkyLightIrradianceGenerator(redGPUContext, this.#sharedUniformBuffer, this.#sampler);
    }

    /** [KO] 간접 디퓨즈 조명용 Irradiance LUT [EN] Irradiance LUT for indirect diffuse lighting */
    get irradianceLUT(): DirectCubeTexture {
        return this.#irradianceLUT;
    }

    /** [KO] 간접 스펙큘러 조명용 Reflection LUT [EN] Reflection LUT for indirect specular lighting */
    get reflectionLUT(): DirectCubeTexture {
        return this.#reflectionGenerator.prefilteredTexture;
    }

    /**
     * [KO] SkyAtmosphere의 상태를 기반으로 IBL 데이터를 업데이트합니다.
     * [EN] Updates IBL data based on the state of SkyAtmosphere.
     * @param skyAtmosphere - [KO] 소스가 되는 SkyAtmosphere 인스턴스 [EN] Source SkyAtmosphere instance
     */
    async update(skyAtmosphere: SkyAtmosphere): Promise<void> {
        if (this.dirty && !this.#isUpdatingIBL) {
            this.#isUpdatingIBL = true;

            // [KO] 스펙큘러 및 디퓨즈 IBL 생성
            // [EN] Generate specular and diffuse IBL
            this.#reflectionGenerator.render(
                skyAtmosphere.transmittanceLUT,
                skyAtmosphere.multiScatLUT,
                skyAtmosphere.skyViewLUT
            );
            this.#irradianceGenerator.render(
                skyAtmosphere.transmittanceLUT,
                skyAtmosphere.multiScatLUT,
                skyAtmosphere.skyViewLUT
            );

            // [KO] 최종 Irradiance LUT로 베이킹
            // [EN] Bake to final Irradiance LUT
            this.resourceManager.irradianceGenerator.render(
                this.#irradianceGenerator.sourceCubeTexture,
                this.#irradianceLUT.gpuTexture
            );

            this.#irradianceLUT.notifyUpdate();
            this.#isUpdatingIBL = false;
            this.dirty = false;
        }
    }
}

Object.freeze(SkyLight);
export default SkyLight;
