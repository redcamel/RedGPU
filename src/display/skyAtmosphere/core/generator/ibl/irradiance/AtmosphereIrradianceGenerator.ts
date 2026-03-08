import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import atmosphereIrradianceShaderCode from "./atmosphereIrradianceShaderCode.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../../utils/uuid/createUUID";
import DirectCubeTexture from "../../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";

const SHADER_INFO = parseWGSL(atmosphereIrradianceShaderCode, 'ATMOSPHERE_IRRADIANCE_GENERATOR');

/**
 * [KO] 반사 큐브맵을 기반으로 물리적으로 일치하는 조도(Irradiance) 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a physically consistent irradiance cubemap based on the reflection cubemap.
 *
 * [KO] 프리필터링된 대기 반사 데이터를 적분하여 주변 환경으로부터 오는 확산광 조도 데이터를 생성합니다.
 * [EN] Generates diffuse irradiance data from the surrounding environment by integrating pre-filtered atmospheric reflection data.
 *
 * @example
 * ```typescript
 * const irradianceGenerator = new AtmosphereIrradianceGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * irradianceGenerator.render(reflectionCubeView, transmittanceTexture);
 * ```
 * @category SkyAtmosphere
 */
class AtmosphereIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectCubeTexture;
    #faceMatrixBuffer: UniformBuffer;

    /**
     * [KO] AtmosphereIrradianceGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes an AtmosphereIrradianceGenerator instance.
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
        super(redGPUContext, sharedUniformBuffer, sampler, 'ATMOSPHERE_IRRADIANCE_GEN', 32, 32, 6);
        this.#init();
    }

    /**
     * [KO] 생성된 조도 큐브맵 텍스처를 반환합니다.
     * [EN] Returns the generated irradiance cubemap texture.
     */
    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 조도 큐브맵을 렌더링(Compute)합니다.
     * [EN] Renders (computes) the irradiance cubemap.
     *
     * @example
     * ```typescript
     * irradianceGenerator.render(reflectionCubeView, transmittance);
     * ```
     * @param reflectionCubeView -
     * [KO] 소스로 사용할 리플렉션 큐브맵 뷰
     * [EN] Reflection cubemap view to use as source
     * @param transmittance -
     * [KO] 투과율 LUT (계산에 참조될 수 있음)
     * [EN] Transmittance LUT (can be referenced for calculation)
     */
    render(reflectionCubeView: GPUTextureView, transmittance: DirectTexture): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: reflectionCubeView},
                {binding: 1, resource: this.sampler.gpuSampler},
                {binding: 2, resource: this.#lutTexture.gpuTexture.createView({dimension: '2d-array'})}
            ]
        });

        this.gpuRender(bindGroup, [8, 8, 1]);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `AtmosphereIrradianceCubeTexture_${createUUID()}`, this.createLUTTexture(false));

        const faceMatrices = this.#getCubeMapFaceMatrices();
        const faceMatrixData = new Float32Array(16 * 6);
        faceMatrices.forEach((m, i) => faceMatrixData.set(m, i * 16));
        this.#faceMatrixBuffer = new UniformBuffer(this.redGPUContext, faceMatrixData.buffer, 'ATM_IRRADIANCE_FACE_MATRIX_BUFFER');

        this.pipeline = gpuDevice.createComputePipeline({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }

    #getCubeMapFaceMatrices(): Float32Array[] {
        return [
            // +X (WebGPU Face 0)
            new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
            // -X (WebGPU Face 1)
            new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
            // +Y (WebGPU Face 2)
            new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
            // -Y (WebGPU Face 3)
            new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
            // +Z (WebGPU Face 4)
            new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            // -Z (WebGPU Face 5)
            new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
        ];
    }
}

export default AtmosphereIrradianceGenerator;
