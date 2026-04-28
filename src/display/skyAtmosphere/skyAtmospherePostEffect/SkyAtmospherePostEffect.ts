import RedGPUContext from "../../../context/RedGPUContext";
import View3D from "../../../display/view/View3D";
import ASinglePassPostEffect, {ASinglePassPostEffectResult} from "../../../postEffect/core/ASinglePassPostEffect";
import SkyAtmosphere from "../SkyAtmosphere";
import ShaderLibrary from "../../../systemCodeManager/ShaderLibrary";
import AtmosphereShaderLibrary from "../core/AtmosphereShaderLibrary";
import parseWGSL from "../../../resources/wgslParser/parseWGSL";
import skyAtmospherePostEffect_compute_wgsl from "./wgsl/skyAtmospherePostEffect_compute.wgsl";

/**
 * [KO] SkyAtmospherePostEffect 클래스는 씬 내의 오브젝트들에 대해 대기 투과(Transmittance) 및 산란(Scattering)을 적용합니다.
 * [EN] The SkyAtmospherePostEffect class applies atmospheric transmittance and scattering to objects in the scene.
 */
class SkyAtmospherePostEffect extends ASinglePassPostEffect {
    #skyAtmosphere: SkyAtmosphere;
    
    #computeShaderMSAA: GPUShaderModule;
    #computeShaderNonMSAA: GPUShaderModule;
    #cachedBindGroupLayouts: Map<string, GPUBindGroupLayout> = new Map();
    #cachedComputePipelines: Map<string, GPUComputePipeline> = new Map();

    #bindGroupLayout1: GPUBindGroupLayout;
    #bindGroup0_swap0: GPUBindGroup;
    #bindGroup0_swap1: GPUBindGroup;
    #bindGroup1: GPUBindGroup;
    
    #prevSourceView_swap0: GPUTextureView;
    #prevSourceView_swap1: GPUTextureView;
    #prevDepthView_swap0: GPUTextureView;
    #prevDepthView_swap1: GPUTextureView;
    #prevPEUniformBuffer: GPUBuffer;
    #prevMSAA: boolean;
    #prevMSAAID: string;
    #outputTexture: GPUTexture;
    #outputTextureView: GPUTextureView;
    #prevDimensions: { width: number, height: number };

    constructor(redGPUContext: RedGPUContext, skyAtmosphere: SkyAtmosphere) {
        super(redGPUContext);
        this.#skyAtmosphere = skyAtmosphere;

        const {gpuDevice} = redGPUContext;
        this.#bindGroupLayout1 = gpuDevice.createBindGroupLayout({
            label: 'SkyAtmospherePostEffect_BindGroupLayout_1',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {format: 'rgba16float', access: 'write-only'}
                },
                {binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: {type: 'uniform'}}
            ]
        });

        this.#initShaders();
    }

    render(view: View3D, width: number, height: number, sourceTextureInfo: ASinglePassPostEffectResult): ASinglePassPostEffectResult {
        const {gpuDevice, resourceManager, antialiasingManager} = this.redGPUContext;
        
        const {useMSAA, msaaID} = antialiasingManager;
        const depthView = view.viewRenderTextureManager.depthTextureView;
        const peUniformBuffer = view.postEffectManager.postEffectSystemUniformBuffer.gpuBuffer;

        const dimensionsChanged = !this.#outputTexture || this.#prevDimensions?.width !== width || this.#prevDimensions?.height !== height;
        const msaaChanged = this.#prevMSAA !== useMSAA || this.#prevMSAAID !== msaaID;
        const peUniformBufferChanged = this.#prevPEUniformBuffer !== peUniformBuffer;

        if (dimensionsChanged) {
            if (this.#outputTexture) this.#outputTexture.destroy();
            this.#outputTexture = resourceManager.createManagedTexture({
                size: {width, height},
                format: 'rgba16float',
                usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
                label: 'SkyAtmospherePostEffect_Output'
            });
            this.#outputTextureView = this.#outputTexture.createView();
            this.#prevDimensions = {width, height};
        }

        const pipeline = this.#getPipeline(useMSAA);

        let currentBindGroup0: GPUBindGroup;
        const skyAtmosphere = this.#skyAtmosphere;

        if (view.renderViewStateData.swapBufferIndex === 0) {
            if (!this.#bindGroup0_swap0 || msaaChanged || this.#prevSourceView_swap0 !== sourceTextureInfo.textureView || this.#prevDepthView_swap0 !== depthView) {
                this.#prevSourceView_swap0 = sourceTextureInfo.textureView;
                this.#prevDepthView_swap0 = depthView;
                this.#bindGroup0_swap0 = gpuDevice.createBindGroup({
                    label: 'SkyAtmospherePostEffect_BG_0_SWAP0',
                    layout: this.#getBindGroupLayout0(useMSAA),
                    entries: [
                        {binding: 0, resource: sourceTextureInfo.textureView},
                        {binding: 1, resource: depthView},
                        {binding: 2, resource: skyAtmosphere.transmittanceLUT.gpuTextureView},
                        {binding: 3, resource: skyAtmosphere.multiScatLUT.gpuTextureView},
                        {binding: 4, resource: skyAtmosphere.skyViewLUT.gpuTextureView},
                        {binding: 5, resource: skyAtmosphere.aerialPerspectiveLUT.gpuTexture.createView({dimension: '3d'})},
                        {binding: 6, resource: skyAtmosphere.atmosphereSampler.gpuSampler},
                        {binding: 7, resource: skyAtmosphere.skyAtmosphereIrradianceLUT.gpuTextureView}
                    ]
                });
            }
            currentBindGroup0 = this.#bindGroup0_swap0;
        } else {
            if (!this.#bindGroup0_swap1 || msaaChanged || this.#prevSourceView_swap1 !== sourceTextureInfo.textureView || this.#prevDepthView_swap1 !== depthView) {
                this.#prevSourceView_swap1 = sourceTextureInfo.textureView;
                this.#prevDepthView_swap1 = depthView;
                this.#bindGroup0_swap1 = gpuDevice.createBindGroup({
                    label: 'SkyAtmospherePostEffect_BG_0_SWAP1',
                    layout: this.#getBindGroupLayout0(useMSAA),
                    entries: [
                        {binding: 0, resource: sourceTextureInfo.textureView},
                        {binding: 1, resource: depthView},
                        {binding: 2, resource: skyAtmosphere.transmittanceLUT.gpuTextureView},
                        {binding: 3, resource: skyAtmosphere.multiScatLUT.gpuTextureView},
                        {binding: 4, resource: skyAtmosphere.skyViewLUT.gpuTextureView},
                        {binding: 5, resource: skyAtmosphere.aerialPerspectiveLUT.gpuTexture.createView({dimension: '3d'})},
                        {binding: 6, resource: skyAtmosphere.atmosphereSampler.gpuSampler},
                        {binding: 7, resource: skyAtmosphere.skyAtmosphereIrradianceLUT.gpuTextureView}
                    ]
                });
            }
            currentBindGroup0 = this.#bindGroup0_swap1;
        }

        if (!this.#bindGroup1 || dimensionsChanged || peUniformBufferChanged) {
            this.#prevPEUniformBuffer = peUniformBuffer;
            this.#bindGroup1 = gpuDevice.createBindGroup({
                label: 'SkyAtmospherePostEffect_BG_1',
                layout: this.#bindGroupLayout1,
                entries: [
                    {binding: 0, resource: this.#outputTextureView},
                    {binding: 1, resource: {buffer: peUniformBuffer}}
                ]
            });
        }

        const commandEncoder = gpuDevice.createCommandEncoder({label: 'SkyAtmospherePostEffect_Pass'});
        const passEncoder = commandEncoder.beginComputePass();

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, currentBindGroup0);
        passEncoder.setBindGroup(1, this.#bindGroup1);
        passEncoder.dispatchWorkgroups(Math.ceil(width / 16), Math.ceil(height / 16));
        passEncoder.end();
        gpuDevice.queue.submit([commandEncoder.finish()]);

        this.#prevMSAA = useMSAA;
        this.#prevMSAAID = msaaID;

        return {texture: this.#outputTexture, textureView: this.#outputTextureView};
    }

    #initShaders(): void {
        const {resourceManager} = this.redGPUContext;
        const createCode = (useMSAA: boolean) => {
            const rawCode = [
                '#redgpu_include depth.getLinearizeDepth',
                '#redgpu_include skyAtmosphere.skyAtmosphereFn',
                '@group(0) @binding(0) var sourceTexture : texture_2d<f32>;',
                `@group(0) @binding(1) var depthTexture : ${useMSAA ? 'texture_depth_multisampled_2d' : 'texture_depth_2d'};`,
                '@group(0) @binding(2) var transmittanceLUT : texture_2d<f32>;',
                '@group(0) @binding(3) var multiScatLUT : texture_2d<f32>;',
                '@group(0) @binding(4) var skyViewLUT : texture_2d<f32>;',
                '@group(0) @binding(5) var aerialPerspectiveLUT : texture_3d<f32>;',
                '@group(0) @binding(6) var skyAtmosphereSampler : sampler;',
                '@group(0) @binding(7) var skyAtmosphereIrradianceLUT : texture_cube<f32>;',
                '',
                '@group(1) @binding(0) var outputTexture : texture_storage_2d<rgba16float, write>;',
                ShaderLibrary.POST_EFFECT_SYSTEM_UNIFORM,
                '',
                'fn fetchDepth(pos: vec2<u32>) -> f32 {',
                '    let dSize = textureDimensions(depthTexture);',
                '    let clampedPos = min(pos, dSize - 1u);',
                '    return textureLoad(depthTexture, clampedPos, 0);',
                '}',
                '',
                '@compute @workgroup_size(16, 16)',
                'fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {',
                '    let uniforms = systemUniforms.skyAtmosphere;',
                '    let viewHeight = uniforms.cameraHeight;',
                skyAtmospherePostEffect_compute_wgsl,
                '}'
            ].join('\n');

            return parseWGSL(`SkyAtmospherePostEffect_Code_${useMSAA ? 'MSAA' : 'NonMSAA'}`, rawCode, AtmosphereShaderLibrary).defaultSource;
        };

        this.#computeShaderMSAA = resourceManager.createGPUShaderModule('SkyAtmospherePostEffect_MSAA_ShaderModule', {code: createCode(true)});
        this.#computeShaderNonMSAA = resourceManager.createGPUShaderModule('SkyAtmospherePostEffect_NonMSAA_ShaderModule', {code: createCode(false)});
    }

    #getBindGroupLayout0(useMSAA: boolean): GPUBindGroupLayout {
        const key = `BGL0_MSAA_${useMSAA}`;
        if (this.#cachedBindGroupLayouts.has(key)) return this.#cachedBindGroupLayouts.get(key);

        const bgl = this.redGPUContext.gpuDevice.createBindGroupLayout({
            label: `SkyAtmospherePostEffect_${key}`,
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 1, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'depth', multisampled: useMSAA}},
                {binding: 2, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 3, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 4, visibility: GPUShaderStage.COMPUTE, texture: {}},
                {binding: 5, visibility: GPUShaderStage.COMPUTE, texture: {viewDimension: '3d'}},
                {binding: 6, visibility: GPUShaderStage.COMPUTE, sampler: {}},
                {binding: 7, visibility: GPUShaderStage.COMPUTE, texture: {viewDimension: 'cube'}}
            ]
        });
        this.#cachedBindGroupLayouts.set(key, bgl);
        return bgl;
    }

    #getPipeline(useMSAA: boolean): GPUComputePipeline {
        const key = `PIPELINE_MSAA_${useMSAA}`;
        if (this.#cachedComputePipelines.has(key)) return this.#cachedComputePipelines.get(key);

        const {gpuDevice} = this.redGPUContext;
        const pipeline = gpuDevice.createComputePipeline({
            label: `SkyAtmospherePostEffect_${key}`,
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#getBindGroupLayout0(useMSAA), this.#bindGroupLayout1]
            }),
            compute: {
                module: useMSAA ? this.#computeShaderMSAA : this.#computeShaderNonMSAA,
                entryPoint: 'main'
            }
        });
        this.#cachedComputePipelines.set(key, pipeline);
        return pipeline;
    }
}

Object.freeze(SkyAtmospherePostEffect);
export default SkyAtmospherePostEffect;
