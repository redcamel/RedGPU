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
import getMipLevelCount from "../../../../../utils/texture/getMipLevelCount";

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

    get sourceCubeTexture(): GPUTexture {
        return this.#sourceCubeTexture;
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

        // [KO] 소스 큐브맵의 밉맵 생성 (조도 적분 시 노이즈 제거용)
        // [EN] Generate mipmaps for source cubemap (for noise removal during irradiance integration)
        resourceManager.mipmapGenerator.generateMipmap(this.#sourceCubeTexture, {
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: this.#sourceCubeTexture.usage, // [KO] 원본 텍스처의 usage 정보를 전달하여 검증 에러 방지
            mipLevelCount: getMipLevelCount(this.width, this.height),
            dimension: '2d'
        });

        // 2. 프리필터링 수행 (GGX)
        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, this.#prefilteredTexture);
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);

        // 소스 큐브맵 생성 (밉맵 및 복사 지원 추가)
        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyAtmosphere_Reflection_Source_Cube',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount: mipLevelCount
        });
        // 렌더링은 Mip 0에만 수행하므로 2d-array 뷰 생성 시 Mip 0으로 제한
        this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({
            dimension: '2d-array',
            baseMipLevel: 0,
            mipLevelCount: 1
        });

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

export default SkyAtmosphereReflectionGenerator;
