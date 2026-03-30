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

/**
 * [KO] 거리별 공중 투시(Aerial Perspective)를 위한 3D LUT 생성을 담당하는 클래스입니다.
 * [EN] Class responsible for generating 3D LUT for Aerial Perspective by distance.
 *
 * [KO] 카메라 시점으로부터의 거리와 방향에 따른 대기 산란광 및 투과율 데이터를 3D 텍스처로 사전 계산하여 저장합니다.
 * [EN] Pre-calculates and stores atmospheric scattered light and transmittance data as a 3D texture based on distance and direction from the camera perspective.
 *
 * @example
 * ```typescript
 * const aerialPerspectiveGenerator = new AerialPerspectiveGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * aerialPerspectiveGenerator.render(view, transmittanceTexture, multiScatteringTexture);
 * ```
 * @category SkyAtmosphere
 */
class AerialPerspectiveGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectCubeTexture; // [KO] 3D 및 Cube 텍스처를 담당하는 DirectCubeTexture 사용
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;
    #prevSystemBuffer: GPUBuffer;

    /**
     * [KO] AerialPerspectiveGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a AerialPerspectiveGenerator instance.
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        // [KO] UE5 표준: 32x32x32 혹은 32x32x16 사용
        super(redGPUContext, sharedUniformBuffer, sampler, 'AerialPerspective_Gen', 32, 32, 32);
        this.#init();
    }

    /**
     * [KO] 생성된 카메라 볼륨 LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Camera Volume LUT texture.
     */
    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 카메라 볼륨 LUT를 렌더링(Compute)합니다.
     * [EN] Renders (computes) the Camera Volume LUT.
     */
    render(view: View3D, transmittance: DirectTexture, multiScat: DirectTexture): void {
        const systemBuffer = view.systemUniform_Vertex_UniformBuffer?.gpuBuffer;

        if (!systemBuffer) {
            console.warn('AerialPerspectiveGenerator: systemUniform_Vertex_UniformBuffer is not ready yet.');
            return;
        }

        if (!this.#bindGroup || this.#prevSystemBuffer !== systemBuffer) {
            this.#prevSystemBuffer = systemBuffer;
            this.#bindGroup = this.createBindGroup('SkyAtmosphere_AerialPerspective_BindGroup', this.#pipeline, [
                {binding: 0, resource: {buffer: systemBuffer}}, // systemUniforms
                {binding: 1, resource: this.#lutTexture.gpuTextureView}, // aerialPerspectiveLUT (DirectCubeTexture에서 자동 생성된 3D 뷰 사용)
                {binding: 2, resource: multiScat.gpuTextureView}, // multiScatLUT
                {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}, // params
                {binding: 4, resource: transmittance.gpuTextureView}, // transmittanceLUT
                {binding: 13, resource: this.sampler.gpuSampler} // skyAtmosphereSampler
            ]);
        }

        this.executeComputePass(this.#pipeline, this.#bindGroup, [8, 8, 4]); // [KO] 워크그룹 사이즈 최적화
    }

    #init(): void {
        // [KO] createLUTTexture(true)는 내부적으로 3D 텍스처를 생성함
        const gpuTexture = this.createLUTTexture(true);
        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `SkyAtmosphere_AerialPerspective_LUTTexture_${createUUID()}`, gpuTexture);
        this.#pipeline = this.createComputePipeline('SkyAtmosphere_AerialPerspective_Pipeline', SHADER_INFO.defaultSource);
    }
}

export default AerialPerspectiveGenerator;
