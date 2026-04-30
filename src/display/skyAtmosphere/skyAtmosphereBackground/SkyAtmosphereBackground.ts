import RedGPUContext from "../../../context/RedGPUContext";
import backgroundVertexShaderCode_wgsl from "./wgsl/background_vertex.wgsl";
import backgroundFragmentShaderCode_wgsl from "./wgsl/background_fragment.wgsl";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import Sampler from "../../../resources/sampler/Sampler";
import DirectTexture from "../../../resources/texture/DirectTexture";

class SkyAtmosphereBackground {
    readonly #redGPUContext: RedGPUContext;
    readonly #backgroundBindGroupLayout2: GPUBindGroupLayout;

    #backgroundBindGroup2: GPUBindGroup;
    #backgroundPipeline: GPURenderPipeline;
    #backgroundRenderBundle: GPURenderBundle;

    #dirtyBackgroundPipeline: boolean = true;
    #prevBackgroundSystemUniformBindGroup: GPUBindGroup;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        const {gpuDevice} = redGPUContext;

        this.#backgroundBindGroupLayout2 = gpuDevice.createBindGroupLayout({
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
        const {gpuDevice, antialiasingManager} = this.#redGPUContext;
        const {useMSAA} = antialiasingManager;

        if (this.#dirtyBackgroundPipeline || antialiasingManager.changedMSAA || this.#prevBackgroundSystemUniformBindGroup !== view.systemUniform_Vertex_UniformBindGroup) {
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

    #updateBackgroundPipeline(useMSAA: boolean) {
        const {gpuDevice, resourceManager} = this.#redGPUContext;
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
