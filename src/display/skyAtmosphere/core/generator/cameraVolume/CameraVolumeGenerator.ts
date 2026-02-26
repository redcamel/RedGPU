import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import cameraVolumeShaderCode from "./cameraVolumeShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectTexture from "../../../../../resources/texture/DirectTexture";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + cameraVolumeShaderCode, 'CAMERA_VOLUME_GENERATOR');
const UNIFORM_STRUCT = SHADER_INFO.uniforms.params;

/**
 * [KO] 거리별 공중 투시(Aerial Perspective)를 위한 3D LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating 3D LUT for Aerial Perspective by distance.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // SkyAtmosphere 내부에서 자동으로 관리됩니다.
 * const cameraVolumeTexture = skyAtmosphere.cameraVolumeTexture;
 * ```
 *
 * @category PostEffect
 */
class CameraVolumeGenerator {
    /** [KO] 텍스처 가로 크기 [EN] Texture width */
    readonly width: number = 64;
    /** [KO] 텍스처 세로 크기 [EN] Texture height */
    readonly height: number = 64;
    /** [KO] 텍스처 깊이 크기 [EN] Texture depth */
    readonly depth: number = 32;
    #redGPUContext: RedGPUContext;
    #lutTexture: DirectCubeTexture;
    #pipeline: GPUComputePipeline;
    #sharedUniformBuffer: UniformBuffer;
    #sampler: Sampler;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer) {
        this.#redGPUContext = redGPUContext;
        this.#sharedUniformBuffer = sharedUniformBuffer;
        this.#sampler = new Sampler(this.#redGPUContext, {magFilter: 'linear', minFilter: 'linear'});
        this.#init();
    }

    /** [KO] 생성된 LUT 텍스처를 반환합니다. [EN] Returns the generated LUT texture. */
    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 카메라 볼륨 LUT를 렌더링합니다.
     * [EN] Renders the Camera Volume LUT.
     *
     * @param transmittance - [KO] 투과율 LUT [EN] Transmittance LUT
     * @param multiScat - [KO] 다중 산란 LUT [EN] Multi-scattering LUT
     */
    render(transmittance: DirectTexture, multiScat: DirectTexture): void {
        const {gpuDevice} = this.#redGPUContext;

        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTexture.createView({dimension: '3d'})},
                {binding: 1, resource: transmittance.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: this.#sampler.gpuSampler},
                {binding: 4, resource: {buffer: this.#sharedUniformBuffer.gpuBuffer}}
            ]
        });

        const commandEncoder = gpuDevice.createCommandEncoder();
        const passEncoder = commandEncoder.beginComputePass();
        passEncoder.setPipeline(this.#pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(
            Math.ceil(this.width / 4),
            Math.ceil(this.height / 4),
            Math.ceil(this.depth / 4)
        );
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);
        this.#lutTexture.notifyUpdate();
    }

    #init(): void {
        const {resourceManager} = this.#redGPUContext;
        
        // 3D GPUTexture 생성
        const gpuTexture = resourceManager.createManagedTexture({
            label: 'CameraVolumeLUTTexture',
            size: [this.width, this.height, this.depth],
            dimension: '3d',
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING
        });

        // DirectCubeTexture (3D/Cube 범용 컨테이너)로 래핑
        this.#lutTexture = new DirectCubeTexture(this.#redGPUContext, 'CameraVolumeLUTTexture', gpuTexture);

        const shaderModule = this.#redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource});
        this.#pipeline = this.#redGPUContext.gpuDevice.createComputePipeline({
            layout: 'auto',
            compute: {module: shaderModule, entryPoint: 'main'}
        });
    }
}

export default CameraVolumeGenerator;
