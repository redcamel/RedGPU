import RedGPUContext from "../../context/RedGPUContext";
import SkyAtmosphere from "./SkyAtmosphere";
import SkyAtmosphereSpecularGenerator from "./core/generator/ibl/reflection/SkyAtmosphereSpecularGenerator";
import SkyAtmosphereIrradianceGenerator from "./core/generator/ibl/reflection/SkyAtmosphereIrradianceGenerator";
import DirectCubeTexture from "../../resources/texture/DirectCubeTexture";
import createUUID from "../../utils/uuid/createUUID";
import Sampler from "../../resources/sampler/Sampler";
import UniformBuffer from "../../resources/buffer/uniformBuffer/UniformBuffer";

/**
 * [KO] SkyLight 클래스는 SkyAtmosphere의 대기 산란 데이터를 기반으로 씬의 간접 조명(IBL)을 생성하고 관리합니다.
 * [EN] The SkyLight class generates and manages indirect lighting (IBL) for the scene based on SkyAtmosphere's atmospheric scattering data.
 */
class SkyLight {
    #redGPUContext: RedGPUContext;
    #specularGenerator: SkyAtmosphereSpecularGenerator;
    #irradianceGenerator: SkyAtmosphereIrradianceGenerator;
    #irradianceLUT: DirectCubeTexture;
    #sampler: Sampler;
    #sharedUniformBuffer: UniformBuffer;

    #dirtyIBL: boolean = true;
    #isUpdatingIBL: boolean = false;

    /**
     * @param redGPUContext - [KO] RedGPU 컨텍스트 [EN] RedGPU Context
     * @param sharedUniformBuffer - [KO] 공유 유니폼 버퍼 [EN] Shared uniform buffer
     * @param sampler - [KO] 대기 산란용 샘플러 [EN] Sampler for atmospheric scattering
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        this.#redGPUContext = redGPUContext;
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = sampler;

        this.#irradianceLUT = new DirectCubeTexture(redGPUContext, `SkyAtmosphere_Irradiance_LUTTexture_${createUUID()}`,
            this.#redGPUContext.resourceManager.createManagedTexture({
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
    }

    /**
     * [KO] IBL 갱신 여부 (true일 경우 다음 프레임에 갱신 수행)
     * [EN] Whether IBL needs to be updated (if true, update is performed on the next frame)
     */
    get dirty(): boolean { return this.#dirtyIBL; }
    set dirty(v: boolean) { this.#dirtyIBL = v; }

    /**
     * [KO] SkyAtmosphere의 상태를 기반으로 IBL 데이터를 업데이트합니다.
     * [EN] Updates IBL data based on the state of SkyAtmosphere.
     * @param skyAtmosphere - [KO] 소스가 되는 SkyAtmosphere 인스턴스 [EN] Source SkyAtmosphere instance
     */
    async update(skyAtmosphere: SkyAtmosphere): Promise<void> {
        if (this.#dirtyIBL && !this.#isUpdatingIBL) {
            this.#isUpdatingIBL = true;
            
            // [KO] 스펙큘러 및 디퓨즈 IBL 생성
            // [EN] Generate specular and diffuse IBL
             this.#specularGenerator.render(
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
             this.#redGPUContext.resourceManager.irradianceGenerator.render(
                this.#irradianceGenerator.sourceCubeTexture,
                this.#irradianceLUT.gpuTexture
            );
            
            this.#irradianceLUT.notifyUpdate();
            this.#isUpdatingIBL = false;
            this.#dirtyIBL = false;
        }
    }

    /** [KO] 간접 디퓨즈 조명용 Irradiance LUT [EN] Irradiance LUT for indirect diffuse lighting */
    get irradianceLUT(): DirectCubeTexture { return this.#irradianceLUT; }

    /** [KO] 간접 스펙큘러 조명용 Reflection LUT [EN] Reflection LUT for indirect specular lighting */
    get reflectionLUT(): DirectCubeTexture { return this.#specularGenerator.prefilteredTexture; }
}

Object.freeze(SkyLight);
export default SkyLight;
