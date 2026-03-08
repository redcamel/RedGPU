import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import skyAtmosphereFn from "../../../skyAtmosphereFn.wgsl";
import reflectionShaderCode from "./skyAtmosphereReflectionShaderCode.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import createUUID from "../../../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../../../utils/texture/getMipLevelCount";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + reflectionShaderCode, 'SKY_ATMOSPHERE_REFLECTION_GENERATOR');

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 프리필터링된 반사 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a pre-filtered reflection cubemap based on real-time atmospheric scattering data.
 *
 * [KO] 대기 산란 데이터를 큐브맵으로 렌더링한 후, GGX 프리필터링을 통해 거칠기(Roughness)별 반사 데이터를 생성합니다.
 * [EN] Renders atmospheric scattering data to a cubemap, then generates reflection data by roughness through GGX pre-filtering.
 *
 * @example
 * ```typescript
 * const reflectionGenerator = new SkyAtmosphereReflectionGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * await reflectionGenerator.render(transmittance, multiScat, skyView);
 * ```
 * @category SkyAtmosphere
 */
class SkyAtmosphereReflectionGenerator extends ASkyAtmosphereLUTGenerator {
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #prefilteredTexture: DirectCubeTexture;

    /**
     * [KO] SkyAtmosphereReflectionGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a SkyAtmosphereReflectionGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param sharedUniformBuffer -
     * [KO] 공유 유니폼 버퍼
     * [EN] Shared uniform buffer
     * @param sampler -
     * [KO] LUT 샘플링에 사용할 샘플러
     * [EN] Sampler to be used for LUT sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SKY_REFL_GEN', 256, 256, 6);
        this.#init();
    }

    /**
     * [KO] 렌더링 소스로 사용된 원본 큐브맵 텍스처를 반환합니다.
     * [EN] Returns the source cubemap texture used for rendering.
     */
    get sourceCubeTexture(): GPUTexture {
        return this.#sourceCubeTexture;
    }

    /**
     * [KO] 프리필터링이 완료된 결과 큐브맵 텍스처를 반환합니다.
     * [EN] Returns the resulting pre-filtered cubemap texture.
     */
    get prefilteredTexture(): DirectCubeTexture {
        return this.#prefilteredTexture;
    }

    /**
     * [KO] 생성된 반사 큐브맵(프리필터링된 결과)을 반환합니다.
     * [EN] Returns the generated reflection cubemap (pre-filtered result).
     */
    get lutTexture(): DirectCubeTexture {
        return this.#prefilteredTexture;
    }

    /**
     * [KO] 반사 큐브맵을 생성하고 프리필터링을 수행합니다.
     * [EN] Generates the reflection cubemap and performs pre-filtering.
     *
     * @example
     * ```typescript
     * await reflectionGenerator.render(transmittance, multiScat, skyView);
     * ```
     * @param transmittance -
     * [KO] 투과율 LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScat -
     * [KO] 다중 산란 LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     * @param skyView -
     * [KO] 스카이 뷰 LUT 텍스처
     * [EN] Sky-View LUT texture
     */
    async render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void> {
        const {gpuDevice, resourceManager} = this.redGPUContext;

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#sourceCubeTextureView},
                {binding: 1, resource: multiScat.gpuTextureView},
                {binding: 2, resource: this.sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                {binding: 4, resource: transmittance.gpuTextureView},
                {binding: 5, resource: skyView.gpuTextureView}
            ]
        });

        this.gpuRender(bindGroup, [8, 8, 1]);

        resourceManager.mipmapGenerator.generateMipmap(this.#sourceCubeTexture, {
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: this.#sourceCubeTexture.usage,
            mipLevelCount: getMipLevelCount(this.width, this.height),
            dimension: '2d'
        });

        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, this.#prefilteredTexture);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);

        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyAtmosphere_Reflection_Source_Cube',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount: mipLevelCount
        });
        this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({
            dimension: '2d-array',
            baseMipLevel: 0,
            mipLevelCount: 1
        });

        this.#prefilteredTexture = new DirectCubeTexture(this.redGPUContext, `SKY_ATMOSPHERE_REFL_FIXED_${createUUID()}`);

        this.pipeline = gpuDevice.createComputePipeline({
            label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default SkyAtmosphereReflectionGenerator;
