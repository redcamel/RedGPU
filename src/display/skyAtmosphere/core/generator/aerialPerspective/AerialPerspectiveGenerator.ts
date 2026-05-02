import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import aerialPerspectiveShaderCode_wgsl from "./aerialPerspectiveShaderCode.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";
import View3D from "../../../../view/View3D";
import AtmosphereShaderLibrary from "../../AtmosphereShaderLibrary";

const SHADER_INFO = parseWGSL('SkyAtmosphere_AerialPerspective_Generator', aerialPerspectiveShaderCode_wgsl, AtmosphereShaderLibrary);

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
        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_AerialPerspective_LUTTexture_${createUUID()}`, gpuTexture);
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_AerialPerspective_Pipeline', SHADER_INFO.defaultSource);
    }
}

Object.freeze(AerialPerspectiveGenerator);
export default AerialPerspectiveGenerator;