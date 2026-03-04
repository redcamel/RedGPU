import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import reflectionShaderCode from "./skyAtmosphereReflectionShaderCode.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import createUUID from "../../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + reflectionShaderCode, 'SKY_ATMOSPHERE_REFLECTION_GENERATOR');

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 프리필터링된 반사 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a pre-filtered reflection cubemap based on real-time atmospheric scattering data.
 */
class SkyAtmosphereReflectionGenerator extends ASkyAtmosphereLUTGenerator {
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #prefilteredTexture: DirectCubeTexture;
    #faceMatrixBuffer: UniformBuffer;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'SKY_REFL_GEN', 256, 256, 6);
        this.#init();
    }

    get prefilteredTexture(): DirectCubeTexture {
        return this.#prefilteredTexture;
    }

    get lutTexture(): DirectCubeTexture {
        return this.#prefilteredTexture;
    }

    async render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void> {
        const {gpuDevice, resourceManager} = this.redGPUContext;

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#sourceCubeTextureView},
                {binding: 1, resource: multiScat.gpuTextureView},
                {binding: 2, resource: this.sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                {binding: 4, resource: {buffer: this.#faceMatrixBuffer.gpuBuffer}},
                {binding: 5, resource: transmittance.gpuTextureView},
                {binding: 6, resource: skyView.gpuTextureView}
            ]
        });

        // 1. 소스 큐브맵 렌더링 (6개 면)
        this.gpuRender(bindGroup, [8, 8, 1]);

        // 2. 프리필터링 수행 (GGX)
        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, this.#prefilteredTexture);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;

        // 소스 큐브맵 생성 (Storage binding 지원용 2d-array)
        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyAtmosphere_Reflection_Source_Cube',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        });
        this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({dimension: '2d-array'});

        this.#prefilteredTexture = new DirectCubeTexture(this.redGPUContext, `SKY_ATMOSPHERE_REFL_FIXED_${createUUID()}`);

        const faceMatrices = this.#getCubeMapFaceMatrices();
        const faceMatrixData = new Float32Array(16 * 6);
        faceMatrices.forEach((m, i) => faceMatrixData.set(m, i * 16));
        this.#faceMatrixBuffer = new UniformBuffer(this.redGPUContext, faceMatrixData.buffer, 'SKY_REFL_GEN_FACE_MATRIX_BUFFER');

        this.pipeline = gpuDevice.createComputePipeline({
            label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PIPELINE',
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

export default SkyAtmosphereReflectionGenerator;
