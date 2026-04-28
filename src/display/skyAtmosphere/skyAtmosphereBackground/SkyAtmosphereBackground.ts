import RedGPUContext from "../../../context/RedGPUContext";
import Box from "../../../primitive/Box";
import UniformBuffer from "../../../resources/buffer/uniformBuffer/UniformBuffer";
import {mat4} from "gl-matrix";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import backgroundVertexShaderCode_wgsl from "./wgsl/background_vertex.wgsl";
import backgroundFragmentShaderCode_wgsl from "./wgsl/background_fragment.wgsl";
import ResourceManager from "../../../resources/core/resourceManager/ResourceManager";
import RenderViewStateData from "../../view/core/RenderViewStateData";
import Sampler from "../../../resources/sampler/Sampler";
import DirectTexture from "../../../resources/texture/DirectTexture";

const BACKGROUND_SHADER_INFO = parseWGSL('SkyAtmosphere_Background_Vertex', backgroundVertexShaderCode_wgsl);
const BACKGROUND_UNIFORM_STRUCT = BACKGROUND_SHADER_INFO.uniforms.vertexUniforms;

class SkyAtmosphereBackground {
    readonly #redGPUContext: RedGPUContext;
    readonly #backgroundMesh: Box;
    readonly #backgroundUniformBuffer: UniformBuffer;
    readonly #backgroundBindGroupLayout1: GPUBindGroupLayout;
    readonly #backgroundBindGroupLayout2: GPUBindGroupLayout;
    readonly #backgroundBindGroup1: GPUBindGroup;
    
    #backgroundBindGroup2: GPUBindGroup;
    #backgroundPipeline: GPURenderPipeline;
    #backgroundRenderBundle: GPURenderBundle;
    
    #dirtyBackgroundPipeline: boolean = true;
    #prevBackgroundSystemUniformBindGroup: GPUBindGroup;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        const {gpuDevice} = redGPUContext;

        this.#backgroundMesh = new Box(this.#redGPUContext);
        this.#backgroundUniformBuffer = new UniformBuffer(this.#redGPUContext, new ArrayBuffer(BACKGROUND_UNIFORM_STRUCT.arrayBufferByteLength), 'SKY_ATMOSPHERE_BACKGROUND_VERTEX_UNIFORM_BUFFER');
        this.#backgroundUniformBuffer.writeOnlyBuffer(BACKGROUND_UNIFORM_STRUCT.members.modelMatrix, mat4.create());

        this.#backgroundBindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BGL_1',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}}
            ]
        });

        this.#backgroundBindGroupLayout2 = gpuDevice.createBindGroupLayout({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BGL_2',
            entries: [
                {binding: 0, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 1, visibility: GPUShaderStage.FRAGMENT, texture: {}},
                {binding: 2, visibility: GPUShaderStage.FRAGMENT, sampler: {}}
            ]
        });

        this.#backgroundBindGroup1 = gpuDevice.createBindGroup({
            label: 'SKY_ATMOSPHERE_BACKGROUND_BG_1',
            layout: this.#backgroundBindGroupLayout1,
            entries: [
                {binding: 0, resource: {buffer: this.#backgroundUniformBuffer.gpuBuffer}}
            ]
        });
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
                    this.#backgroundBindGroupLayout1,
                    this.#backgroundBindGroupLayout2
                ]
            }),
            vertex: {
                module: vertexModule,
                entryPoint: 'main',
                buffers: this.#backgroundMesh.gpuRenderInfo.buffers
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

    render(
        renderViewStateData: RenderViewStateData,
        transmittanceLUT: DirectTexture,
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
                    {binding: 1, resource: skyViewLUT.gpuTextureView},
                    {binding: 2, resource: sampler.gpuSampler}
                ]
            });

            const bundleEncoder = gpuDevice.createRenderBundleEncoder({
                ...view.basicRenderBundleEncoderDescriptor,
                label: 'SKY_ATMOSPHERE_BACKGROUND_BUNDLE_ENCODER'
            });

            bundleEncoder.setPipeline(this.#backgroundPipeline);
            bundleEncoder.setBindGroup(0, view.systemUniform_Vertex_UniformBindGroup);
            bundleEncoder.setBindGroup(1, this.#backgroundBindGroup1);
            bundleEncoder.setBindGroup(2, this.#backgroundBindGroup2);
            bundleEncoder.setVertexBuffer(0, this.#backgroundMesh.vertexBuffer.gpuBuffer);
            bundleEncoder.setIndexBuffer(this.#backgroundMesh.indexBuffer.gpuBuffer, this.#backgroundMesh.indexBuffer.format);
            bundleEncoder.drawIndexed(this.#backgroundMesh.indexBuffer.indexCount);

            this.#backgroundRenderBundle = bundleEncoder.finish({label: 'SKY_ATMOSPHERE_BACKGROUND_BUNDLE'});
        }

        currentRenderPassEncoder.executeBundles([this.#backgroundRenderBundle]);
    }
}

Object.freeze(SkyAtmosphereBackground);
export default SkyAtmosphereBackground;
