import RedGPUContext from "../../../../context/RedGPUContext";
import SkyAtmosphere from "../../SkyAtmosphere";
import SkyLightReflectionGenerator from "./core/SkyLightReflectionGenerator";
import SkyLightIrradianceGenerator from "./core/SkyLightIrradianceGenerator";
import DirectCubeTexture from "../../../../resources/texture/DirectCubeTexture";
import Sampler from "../../../../resources/sampler/Sampler";
import UniformBuffer from "../../../../resources/buffer/uniformBuffer/UniformBuffer";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] SkyAtmosphere의 대기 산란 데이터를 기반으로 실시간 간접 조명(IBL)용 디퓨즈(Irradiance) 및 스펙큘러(Reflection) 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates diffuse (Irradiance) and specular (Reflection) cubemaps for real-time indirect lighting (IBL) based on SkyAtmosphere's atmospheric scattering data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const skyLight = skyAtmosphere.skyLight;
 * ```
 *
 * @category SkyAtmosphere
 */
class SkyLight extends RedGPUObject {
    /**
     * [KO] IBL 데이터 갱신 필요 여부 (기본값: true)
     * [EN] Whether IBL data needs to be updated (default: true)
     */
    dirty: boolean = true;
    #reflectionGenerator: SkyLightReflectionGenerator;
    #irradianceGenerator: SkyLightIrradianceGenerator;

    /**
     * [KO] SkyLight 인스턴스를 생성합니다.
     * [EN] Creates a SkyLight instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] 대기 산란 샘플링용 샘플러
     * [EN] Sampler for atmospheric scattering sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext);
        this.#reflectionGenerator = new SkyLightReflectionGenerator(redGPUContext, sharedUniformBuffer, sampler);
        this.#irradianceGenerator = new SkyLightIrradianceGenerator(redGPUContext, sharedUniformBuffer, sampler);
    }

    /**
     * [KO] 간접 디퓨즈 조명용 Irradiance 큐브 텍스처를 반환합니다.
     * [EN] Returns the Irradiance cube texture for indirect diffuse lighting.
     *
     * @returns
     * [KO] Irradiance 큐브 텍스처
     * [EN] Irradiance cube texture
     */
    get irradianceLUT(): DirectCubeTexture {
        return this.#irradianceGenerator.lutTexture;
    }

    /**
     * [KO] 간접 스펙큘러 조명용 Reflection 큐브 텍스처를 반환합니다.
     * [EN] Returns the Reflection cube texture for indirect specular lighting.
     *
     * @returns
     * [KO] Reflection 큐브 텍스처
     * [EN] Reflection cube texture
     */
    get reflectionLUT(): DirectCubeTexture {
        return this.#reflectionGenerator.lutTexture;
    }

    /**
     * [KO] SkyAtmosphere의 LUT 데이터를 기반으로 디퓨즈 및 스펙큘러 IBL 큐브맵을 베이킹합니다.
     * [EN] Bakes diffuse and specular IBL cubemaps based on SkyAtmosphere's LUT data.
     *
     * @param skyAtmosphere -
     * [KO] 소스 SkyAtmosphere 인스턴스
     * [EN] Source SkyAtmosphere instance
     */
    update(skyAtmosphere: SkyAtmosphere): void {
        if (this.dirty) {
            const {transmittanceLUT, skyViewLUT} = skyAtmosphere;
            this.#reflectionGenerator.render(transmittanceLUT, skyViewLUT);
            this.#irradianceGenerator.render(transmittanceLUT, skyViewLUT);

            this.dirty = false;
        }
    }

    /**
     * [KO] SkyLight 인스턴스 및 내부 IBL 생성기 리소스를 해제합니다.
     * [EN] Releases the SkyLight instance and internal IBL generator resources.
     */
    destroy(): void {
        if (this.#reflectionGenerator) {
            this.#reflectionGenerator.destroy();
        }
        if (this.#irradianceGenerator) {
            this.#irradianceGenerator.destroy();
        }
        this.#reflectionGenerator = null;
        this.#irradianceGenerator = null;
    }
}

Object.freeze(SkyLight);
export default SkyLight;
