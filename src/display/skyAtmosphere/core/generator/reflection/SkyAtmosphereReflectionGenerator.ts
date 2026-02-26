import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import reflectionShaderCode from "./skyAtmosphereReflectionShaderCode.wgsl";
import SkyAtmosphereLUTTexture from "../SkyAtmosphereLUTTexture";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import IBLCubeTexture from "../../../../../resources/texture/ibl/core/IBLCubeTexture";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + reflectionShaderCode, 'SKY_ATMOSPHERE_REFLECTION_GENERATOR');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 프리필터링된 반사 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a pre-filtered reflection cubemap based on real-time atmospheric scattering data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category PostEffect
 */
class SkyAtmosphereReflectionGenerator {
    /** [KO] 큐브맵 소스 해상도 [EN] Cubemap source resolution */
    readonly size: number = 128;
    #redGPUContext: RedGPUContext;
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #prefilteredTexture: IBLCubeTexture;
    #pipeline: GPUComputePipeline;
    #sharedUniformBuffer: UniformBuffer;
    #faceMatrixBuffer: UniformBuffer;
    #sampler: Sampler;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer) {
        this.#redGPUContext = redGPUContext;
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    /** [KO] 프리필터링된 반사 큐브맵을 반환합니다. [EN] Returns the pre-filtered reflection cubemap. */
    get prefilteredTexture(): IBLCubeTexture {
        return this.#prefilteredTexture;
    }

    /**
     * [KO] 대기 반사 큐브맵을 렌더링하고 프리필터링을 수행합니다.
     * [EN] Renders the atmospheric reflection cubemap and performs pre-filtering.
     *
     * @param transmittance - [KO] 투과율 LUT [EN] Transmittance LUT
     * @param multiScat - [KO] 다중 산란 LUT [EN] Multi-scattering LUT
     */
    async render(transmittance: SkyAtmosphereLUTTexture, multiScat: SkyAtmosphereLUTTexture): Promise<void> {
        const {gpuDevice, resourceManager} = this.#redGPUContext;

        // 1. 소스 큐브맵 렌더링 (6개 면)
        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#sourceCubeTextureView},
                {binding: 1, resource: transmittance.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: this.#sampler.gpuSampler},
                {binding: 4, resource: {buffer: this.#sharedUniformBuffer.gpuBuffer}},
                {binding: 5, resource: {buffer: this.#faceMatrixBuffer.gpuBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder({label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PASS'});
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(Math.ceil(this.size / 8), Math.ceil(this.size / 8), 6);
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        // 2. 프리필터링 수행 (기존 텍스처에 덮어쓰기)
        // [KO] 고정된 텍스처를 재사용함으로써 BindGroup 재생성 비용과 GC 부하를 제거합니다.
        // [EN] Eliminate BindGroup regeneration cost and GC overhead by reusing a fixed texture.
        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.size, this.#prefilteredTexture);
    }

    #init(): void {
        const {gpuDevice} = this.#redGPUContext;

        // 1. 소스 큐브맵 생성 (Storage binding 지원을 위해 2d-array로 생성 후 큐브로 샘플링)
        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyAtmosphere_Reflection_Source_Cube',
            size: [this.size, this.size, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC
        });
        this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({dimension: '2d-array'});

        // 2. 프리필터 결과용 텍스처 미리 생성
        this.#prefilteredTexture = new IBLCubeTexture(this.#redGPUContext, `SKY_ATMOSPHERE_REFL_FIXED_${createUUID()}`);

        const faceMatrices = this.#getCubeMapFaceMatrices();
        const faceMatrixData = new Float32Array(16 * 6);
        faceMatrices.forEach((m, i) => faceMatrixData.set(m, i * 16));
        this.#faceMatrixBuffer = new UniformBuffer(this.#redGPUContext, faceMatrixData.buffer, 'SKY_REFL_GEN_FACE_MATRIX_BUFFER');

        // 3. 파이프라인 초기화
        const shaderModule = gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource});
        this.#pipeline = gpuDevice.createComputePipeline({
            label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PIPELINE',
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }

    #getCubeMapFaceMatrices(): Float32Array[] {
        return [
            // [KO] +X (Right): x=1, y=v, z=-u
            new Float32Array([0, 0, -1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1]),
            // [KO] -X (Left): x=-1, y=v, z=u
            new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 0, 1]),
            // [KO] +Y (Top): x=u, y=1, z=-v
            new Float32Array([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]),
            // [KO] -Y (Bottom): x=u, y=-1, z=v
            new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1]),
            // [KO] +Z (Front): x=u, y=v, z=1
            new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
            // [KO] -Z (Back): x=-u, y=v, z=-1
            new Float32Array([-1, 0, 0, 0, 0, 1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1])
        ];
    }
}

export default SkyAtmosphereReflectionGenerator;
