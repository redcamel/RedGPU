import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import atmosphereIrradianceShaderCode from "./atmosphereIrradianceShaderCode.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../resources/texture/DirectTexture";

const SHADER_INFO = parseWGSL(atmosphereIrradianceShaderCode, 'ATMOSPHERE_IRRADIANCE_GENERATOR');

/**
 * [KO] 반사 큐브맵을 기반으로 물리적으로 일치하는 조도(Irradiance) 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a physically consistent irradiance cubemap based on the reflection cubemap.
 */
class AtmosphereIrradianceGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectCubeTexture;
    #faceMatrixBuffer: UniformBuffer;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'ATMOSPHERE_IRRADIANCE_GEN', 32, 32, 6);
        this.#init();
    }

    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    render(reflectionCube: DirectCubeTexture): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'ATMOSPHERE_IRRADIANCE_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: reflectionCube.gpuTexture.createView({dimension: 'cube'})},
                {binding: 1, resource: this.sampler.gpuSampler},
                {binding: 2, resource: this.#lutTexture.gpuTexture.createView({dimension: '2d-array'})},
                {binding: 3, resource: {buffer: this.#faceMatrixBuffer.gpuBuffer}}
            ]
        });
        
        // [KO] 6개 면에 대해 컴퓨트 패스 실행
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
            new Float32Array([0, 0, -1, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
            new Float32Array([0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
            new Float32Array([1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            new Float32Array([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
        ];
    }
}

export default AtmosphereIrradianceGenerator;
