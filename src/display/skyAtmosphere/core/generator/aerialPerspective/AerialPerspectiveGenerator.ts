import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import aerialPerspectiveShaderCode_wgsl from "./aerialPerspectiveShaderCode.wgsl";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";
import View3D from "../../../../view/View3D";


/**
 * [KO] AerialPerspectiveGenerator는 에리얼 퍼스펙티브(Aerial Perspective) LUT를 생성합니다.
 * [EN] AerialPerspectiveGenerator creates the Aerial Perspective LUT.
 *
 * [KO] 카메라와 물체 사이의 거리에 따른 대기 산란 및 투과율 감쇠를 3D LUT에 저장합니다. 이를 통해 씬 내의 일반 오브젝트들에 거리 기반 안개 효과와 공기감을 실시간으로 적용할 수 있습니다.
 * [EN] Stores atmospheric scattering and transmittance attenuation according to the distance between the camera and objects in a 3D LUT. This enables real-time application of distance-based fog and atmospheric feel to general objects in the scene.
 *
 * @category SkyAtmosphere
 */
class AerialPerspectiveGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectCubeTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;
    #prevSystemBuffer: GPUBuffer;

    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'AerialPerspective_Gen', 32, 32, 32);
        this.#init();
    }

    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    render(view: View3D, transmittance: DirectTexture, multiScat: DirectTexture): void {
        const systemBuffer = view.systemUniform_Vertex_UniformBuffer?.gpuBuffer;

        if (!systemBuffer) {
            console.warn('AerialPerspectiveGenerator: systemUniform_Vertex_UniformBuffer is not ready yet.');
            return;
        }

        if (!this.#bindGroup || this.#prevSystemBuffer !== systemBuffer) {
            this.#prevSystemBuffer = systemBuffer;
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_AerialPerspective_BindGroup', this.#pipeline, [
                {binding: 0, resource: {buffer: systemBuffer}},
                {binding: 1, resource: this.#lutTexture.gpuTextureView},
                {binding: 2, resource: multiScat.gpuTextureView},
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                {binding: 4, resource: transmittance.gpuTextureView},
                {binding: 13, resource: this.sampler.gpuSampler}
            ]);
        }

        this.executeComputePass(this.#pipeline, this.#bindGroup, [8, 8, 4]);
    }

    #init(): void {
        const gpuTexture = this.createLUTTexture(true);
        const SHADER_INFO = this.resourceManager.wgslParser.parse('SkyAtmosphere_AerialPerspective_Generator', aerialPerspectiveShaderCode_wgsl);

        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_AerialPerspective_LUTTexture_${createUUID()}`, gpuTexture);
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_AerialPerspective_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(AerialPerspectiveGenerator);
export default AerialPerspectiveGenerator;