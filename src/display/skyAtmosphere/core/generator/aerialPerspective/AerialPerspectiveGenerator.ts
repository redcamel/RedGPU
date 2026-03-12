import RedGPUContext from "../../../../../context/RedGPUContext";
import Sampler from "../../../../../resources/sampler/Sampler";
import DirectCubeTexture from "../../../../../resources/texture/DirectCubeTexture";
import aerialPerspectiveShaderCode from "./aerialPerspectiveShaderCode.wgsl";
import skyAtmosphereFn from "../../skyAtmosphereFn.wgsl";
import parseWGSL from "../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectTexture from "../../../../../resources/texture/DirectTexture";
import ASkyAtmosphereLUTGenerator from "../ASkyAtmosphereLUTGenerator";
import createUUID from "../../../../../utils/uuid/createUUID";
import View3D from "../../../../view/View3D";



const SHADER_INFO = parseWGSL(skyAtmosphereFn + aerialPerspectiveShaderCode, 'AERIAL_PERSPECTIVE_GENERATOR');

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
    #lutTexture: DirectCubeTexture;
    #bindGroup: GPUBindGroup;
    #pipeline: GPUComputePipeline;
    #prevSystemBuffer: GPUBuffer;

    /**
     * [KO] AerialPerspectiveGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a AerialPerspectiveGenerator instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 컨텍스트
     * [EN] RedGPU context
     * @param sharedUniformBuffer -
     * [KO] 공유 유니폼 버퍼
     * [EN] Shared uniform buffer
     * @param sampler -
     * [KO] LUT 샘플링에 사용할 샘플러
     * [EN] Sampler to be used for LUT sampling
     */
    constructor(redGPUContext: RedGPUContext, sharedUniformBuffer: UniformBuffer, sampler: Sampler) {
        super(redGPUContext, sharedUniformBuffer, sampler, 'AERIAL_PERSPECTIVE_GEN', 32, 32, 32);
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
     *
     * @example
     * ```typescript
     * aerialPerspectiveGenerator.render(view, transmittance, multiScat);
     * ```
     * @param view -
     * [KO] 렌더링에 사용되는 3D 뷰
     * [EN] 3D view used for rendering
     * @param transmittance -
     * [KO] 투과율 LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScat -
     * [KO] 다중 산란 LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     */
    render(view: View3D, transmittance: DirectTexture, multiScat: DirectTexture): void {
        const {gpuDevice} = this.redGPUContext;
        // [KO] View3D의 정확한 프로퍼티명인 systemUniform_Vertex_UniformBuffer를 사용하여 버퍼 추출
        const systemBuffer = view.systemUniform_Vertex_UniformBuffer?.gpuBuffer;
        
        if (!systemBuffer) {
            console.warn('AerialPerspectiveGenerator: systemUniform_Vertex_UniformBuffer is not ready yet.');
            return;
        }

        if (!this.#bindGroup || this.#prevSystemBuffer !== systemBuffer) {
            this.#prevSystemBuffer = systemBuffer;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'AERIAL_PERSPECTIVE_GEN_BG',
                layout: this.#pipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: {buffer: systemBuffer}}, // systemUniforms
                    {binding: 1, resource: this.#lutTexture.gpuTexture.createView({dimension: '3d'})}, // aerialPerspectiveLUT
                    {binding: 2, resource: multiScat.gpuTextureView}, // multiScatLUT
                    {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}}, // params
                    {binding: 4, resource: transmittance.gpuTextureView}, // transmittanceLUT
                    {binding: 13, resource: this.sampler.gpuSampler} // skyAtmosphereSampler
                ]
            });
        }
        
        this.executeComputePass(this.#pipeline, this.#bindGroup, [4, 4, 4]);
    }

    #init(): void {
        this.#lutTexture = new DirectCubeTexture(this.redGPUContext, `AerialPerspectiveLUTTexture_${createUUID()}`, this.createLUTTexture(true));
        this.#pipeline = this.redGPUContext.gpuDevice.createComputePipeline({
            label: 'AERIAL_PERSPECTIVE_GEN_PIPELINE',
            layout: 'auto',
            compute: {
                module: this.redGPUContext.gpuDevice.createShaderModule({code: SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });
    }
}

export default AerialPerspectiveGenerator;
