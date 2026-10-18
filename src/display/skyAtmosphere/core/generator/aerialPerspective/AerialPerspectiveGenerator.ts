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
 * [KO] 카메라와 물체 사이의 거리에 따른 대기 산란 및 투과율 감쇠를 저장하는 Aerial Perspective 3D LUT 생성기입니다.
 * [EN] Generator for the Aerial Perspective 3D LUT that stores atmospheric scattering and transmittance attenuation by distance from the camera.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class AerialPerspectiveGenerator extends ASkyAtmosphereLUTGenerator {
    #lutTexture: DirectCubeTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;
    #prevSystemBuffer: GPUBuffer;

    /**
     * [KO] AerialPerspectiveGenerator 인스턴스를 생성합니다.
     * [EN] Creates an AerialPerspectiveGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param sharedUniformBuffer -
     * [KO] 대기 파라미터 공유 유니폼 버퍼
     * [EN] Shared uniform buffer for atmospheric parameters
     * @param sampler -
     * [KO] LUT 샘플링용 샘플러
     * [EN] Sampler for LUT sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'AerialPerspective_Gen', 32, 32, 32);
        this.#init();
    }

    /**
     * [KO] 생성된 Aerial Perspective 3D LUT 텍스처를 반환합니다.
     * [EN] Returns the generated Aerial Perspective 3D LUT texture.
     *
     * @returns
     * [KO] DirectCubeTexture 인스턴스
     * [EN] DirectCubeTexture instance
     */
    get lutTexture(): DirectCubeTexture {
        return this.#lutTexture;
    }

    /**
     * [KO] 현재 뷰와 투과율 및 다중 산란 LUT를 기반으로 Aerial Perspective LUT를 계산합니다.
     * [EN] Computes the Aerial Perspective LUT based on the current view, transmittance LUT, and multi-scattering LUT.
     *
     * @param view -
     * [KO] 렌더링 대상 View3D 인스턴스
     * [EN] Target View3D instance for rendering
     * @param transmittance -
     * [KO] 투과율(Transmittance) LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScat -
     * [KO] 다중 산란(Multi-Scattering) LUT 텍스처
     * [EN] Multi-Scattering LUT texture
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

    /**
     * [KO] 생성기 및 내부 리소스를 해제합니다.
     * [EN] Releases the generator and internal resources.
     */
    destroy(): void {
        super.destroy();
        this.#lutTexture = null;
        this.#bindGroup = null;
        this.#pipeline = null;
        this.#prevSystemBuffer = null;
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