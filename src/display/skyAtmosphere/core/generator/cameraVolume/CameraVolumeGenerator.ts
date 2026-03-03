import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import cameraVolumeShaderCode from "./cameraVolumeShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";

const SHADER_INFO = parseWGSL(skyAtmosphereFn + cameraVolumeShaderCode, 'CAMERA_VOLUME_GENERATOR');

/**
 * [KO] 거리별 공중 투시(Aerial Perspective)를 위한 3D LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating 3D LUT for Aerial Perspective by distance.
 */
class CameraVolumeGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectCubeTexture;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'CAMERA_VOLUME_GEN', 64, 64, 32);
        this.#init();
    }

    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    render(transmittance: DirectTexture, multiScat: DirectTexture): void {
        const {gpuDevice} = this.redGPUContext;
        const bindGroup = gpuDevice.createBindGroup({
            label: 'CAMERA_VOLUME_GEN_BG',
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
                {binding: 0, resource: this.#lutTexture.gpuTexture.createView({dimension: '3d'})},
                {binding: 1, resource: multiScat.gpuTextureView},
                {binding: 2, resource: this.sampler.gpuSampler},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                {binding: 4, resource: transmittance.gpuTextureView}
            ]
        });
        this.gpuRender(bindGroup, [4, 4, 4]);
    }

    #init(): void {
        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `CameraVolumeLUTTexture_${createUUID()}`, this.createLUTTexture(true));
        this.pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
            label: 'CAMERA_VOLUME_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: this.redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default CameraVolumeGenerator;
