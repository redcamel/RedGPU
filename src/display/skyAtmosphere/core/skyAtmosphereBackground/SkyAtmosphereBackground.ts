import RedGPUContext from "../../../../context/RedGPUContext";
import backgroundVertexShaderCode_wgsl from "./wgsl/background_vertex.wgsl";
import backgroundFragmentShaderCode_wgsl from "./wgsl/background_fragment.wgsl";
import ResourceManager from "../../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import Sampler from "../../../../resources/sampler/Sampler";
import DirectTexture from "../../../../resources/texture/DirectTexture";
import RedGPUObject from "../../../../base/RedGPUObject";

/**
 * [KO] SkyAtmosphereBackground 클래스는 무한 거리에 위치한 하늘 배경을 렌더링합니다.
 * [EN] The SkyAtmosphereBackground class renders the sky background located at infinite distance.
 *
 * [KO] 미리 계산된 SkyView LUT를 참조하여 전체 화면 삼각형(Full-screen Triangle)에 하늘과 지면의 기초 산란광을 출력합니다.
 * [EN] Renders base scattered light for the sky and ground onto a full-screen triangle by referencing the precomputed SkyView LUT.
 */
class SkyAtmosphereBackground extends RedGPUObject {
    readonly #backgroundBindGroupLayout2: GPUBindGroupLayout;

    #backgroundBindGroup2: GPUBindGroup;
    #backgroundPipeline: GPURenderPipeline;
    #backgroundRenderBundle: GPURenderBundle;

    #dirtyBackgroundPipeline: boolean = true;
    #prevBackgroundSystemUniformBindGroup: GPUBindGroup;
    #lastUpdateMSAAID: string;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext,)

        this.#backgroundBindGroupLayout2 = this.gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BGL_2',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {}}, // transmittance
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}}, // multiScat
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, texture: {}}, // skyView
                {binding: 3, visibility: GPUShaderStage.FRAGMENT, sampler: {}}  // sampler
            ]
        });
    }

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
