import RedGPUContext from "../../../../context/RedGPUContext";
import backgroundVertexShaderCode_wgsl from "./wgsl/background_vertex.wgsl";
import backgroundFragmentShaderCode_wgsl from "./wgsl/background_fragment.wgsl";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] 미리 계산된 SkyView LUT를 참조하여 무한 거리의 하늘 배경을 렌더링하는 클래스입니다.
 * [EN] Class that renders the sky background at infinite distance by referencing the precomputed SkyView LUT.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category SkyAtmosphere
 */
class SkyAtmosphereBackground extends RedGPUObject {
    readonly #backgroundBindGroupLayout2: GPUBindGroupLayout;

    #backgroundBindGroup2: GPUBindGroup;
    #backgroundPipeline: GPURenderPipeline;
    #backgroundRenderBundle: GPURenderBundle;

    #dirtyBackgroundPipeline: boolean = true;
    #prevBackgroundSystemUniformBindGroup: GPUBindGroup;
    #lastUpdateMSAAID: string;

    /**
     * [KO] SkyAtmosphereBackground 인스턴스를 생성합니다.
     * [EN] Creates a SkyAtmosphereBackground instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext,)

        this.#backgroundBindGroupLayout2 = this.gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BGL_2',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {}}
            ]
        });
    }

    /**
     * [KO] 전체 화면 삼각형(Full-screen Triangle)을 사용하여 하늘과 지면의 산란광 배경을 렌더링합니다.
     * [EN] Renders the scattered light background for the sky and ground using a full-screen triangle.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더링 상태 데이터
     * [EN] Render state data of the current view
     * @param transmittanceLUT -
     * [KO] 대기 투과율(Transmittance) LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScatLUT -
     * [KO] 다중 산란(Multi-Scattering) LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     * @param skyViewLUT -
     * [KO] 스카이 뷰(Sky View) LUT 텍스처
     * [EN] Sky View LUT texture
     * @param sampler -
     * [KO] LUT 샘플링용 샘플러
     * [EN] Sampler for LUT sampling
     */
    render(
        renderViewStateData: RenderViewStateData,
        transmittanceLUT: DirectTexture,
        multiScatLUT: DirectTexture,
        skyViewLUT: DirectTexture,
        sampler: Sampler
    ) {
        const {currentRenderPassEncoder, view} = renderViewStateData;
        const {gpuDevice, antialiasingManager} = this;
        const {useMSAA, msaaID} = antialiasingManager;

        const dirtyMSAA = this.#lastUpdateMSAAID !== msaaID;
        if (this.#dirtyBackgroundPipeline || dirtyMSAA || this.#prevBackgroundSystemUniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
            this.#lastUpdateMSAAID = msaaID;
            this.#updateBackgroundPipeline(useMSAA);
            this.#dirtyBackgroundPipeline = false;
            this.#prevBackgroundSystemUniformBindGroup = view.systemUniform_Vertex_UniformBindGroup;

            this.#backgroundBindGroup2 = gpuDevice.createBindGroup({
                label: 'SKY_ATMOSPHERE_BACKGROUND_BG_2',
                layout: this.#backgroundBindGroupLayout2,
                entries: [
                    {binding: 0, resource: transmittanceLUT.gpuTextureView},
                    {binding: 1, resource: multiScatLUT.gpuTextureView},
                    {binding: 2, resource: skyViewLUT.gpuTextureView},
                    {binding: 3, resource: sampler.gpuSampler}
                ]
            });

            const bundleEncoder = gpuDevice.createRenderBundleEncoder({
                ...view.basicRenderBundleEncoderDescriptor,
                label: 'SKY_ATMOSPHERE_BACKGROUND_BUNDLE_ENCODER'
            });

            bundleEncoder.setPipeline(this.#backgroundPipeline);
            bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
            bundleEncoder.setBindGroup(1, this.#backgroundBindGroup2);
            bundleEncoder.draw(3, 1, 0, 0);

            this.#backgroundRenderBundle = bundleEncoder.finish({label: 'SKY_ATMOSPHERE_BACKGROUND_BUNDLE'});
        }

        currentRenderPassEncoder.executeBundles([this.#backgroundRenderBundle]);
    }

    /**
     * [KO] 배경 렌더러 및 내부 파이프라인 리소스 참조를 해제합니다.
     * [EN] Releases the background renderer and internal pipeline resource references.
     */
    destroy(): void {
        this.#backgroundBindGroup2 = null;
        this.#backgroundPipeline = null;
        this.#backgroundRenderBundle = null;
        this.#prevBackgroundSystemUniformBindGroup = null;
        // @ts-ignore
        this.#backgroundBindGroupLayout2 = null;
    }

    #updateBackgroundPipeline(useMSAA: boolean) {
        const {gpuDevice, resourceManager} = this;
        const vertexModule = resourceManager.createGPUShaderModule('SkyAtmosphere_Background_Vertex_ShaderModule', {code: backgroundVertexShaderCode_wgsl});
        const fragmentModule = resourceManager.createGPUShaderModule('SkyAtmosphere_Background_Fragment_ShaderModule', {code: backgroundFragmentShaderCode_wgsl});

        this.#backgroundPipeline = gpuDevice.createRenderPipeline({
            label: 'SkyAtmosphere_Background_Pipeline',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [
                    resourceManager.getGPUBindGroupLayout(ResourceManager.PRESET_GPUBindGroupLayout_System),
                    this.#backgroundBindGroupLayout2
                ]
            }),
            vertex: {
                module: vertexModule,
                entryPoint: 'main',
                buffers: []
            },
            fragment: {
                module: fragmentModule,
                entryPoint: 'main',
                targets: [
                    {format: 'rgba16float'},
                    {format: navigator.gpu.getPreferredCanvasFormat()},
                    {format: 'rgba16float'}
                ]
            },
            primitive: {topology: 'triangle-list', cullMode: 'none'},
            depthStencil: {
                format: 'depth32float',
                depthWriteEnabled: false,
                depthCompare: 'less-equal'
            },
            multisample: {count: useMSAA ? 4 : 1}
        });
    }
}

Object.freeze(SkyAtmosphereBackground);
export default SkyAtmosphereBackground;
