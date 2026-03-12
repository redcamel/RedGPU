import RedGPUContext from "../../../../../../context/RedGPUContext";
import Sampler from "../../../../../../resources/sampler/Sampler";
import skyAtmosphereFn from "../../../skyAtmosphereFn.wgsl";
import reflectionShaderCode from "./skyAtmosphereReflectionShaderCode.wgsl";
import reflectionShaderCodeNoSoftCut from "./skyAtmosphereReflectionShaderCodeNoSoftCut.wgsl";
import reflectionCombineShaderCode from "./skyAtmosphereReflectionCombineShaderCode.wgsl";
import parseWGSL from "../../../../../../resources/wgslParser/parseWGSL";
import UniformBuffer from "../../../../../../resources/buffer/uniformBuffer/UniformBuffer";
import DirectCubeTexture from "../../../../../../resources/texture/DirectCubeTexture";
import DirectTexture from "../../../../../../resources/texture/DirectTexture";
import createUUID from "../../../../../../utils/uuid/createUUID";
import ASkyAtmosphereLUTGenerator from "../../ASkyAtmosphereLUTGenerator";
import getMipLevelCount from "../../../../../../utils/texture/getMipLevelCount";

const SOFTCUT_SHADER_INFO = parseWGSL(skyAtmosphereFn + reflectionShaderCode, 'SKY_ATMOSPHERE_REFLECTION_GENERATOR_SOFTCUT');
const NOSOFTCUT_SHADER_INFO = parseWGSL(skyAtmosphereFn + reflectionShaderCodeNoSoftCut, 'SKY_ATMOSPHERE_REFLECTION_GENERATOR_NOSOFTCUT');
const COMBINE_SHADER_INFO = parseWGSL(skyAtmosphereFn + reflectionCombineShaderCode, 'SKY_ATMOSPHERE_REFLECTION_GENERATOR_COMBINE');

/**
 * [KO] 실시간 대기 산란 데이터를 기반으로 프리필터링된 반사 큐브맵을 생성하는 클래스입니다.
 * [EN] Class that generates a pre-filtered reflection cubemap based on real-time atmospheric scattering data.
 *
 * [KO] 대기 산란 데이터를 큐브맵으로 렌더링한 후 GGX 프리필터링을 통해 거칠기(Roughness)별 반사 데이터를 생성합니다.
 * [EN] Renders atmospheric scattering data to a cubemap, then generates reflection data by roughness through GGX pre-filtering.
 *
 * @example
 * ```typescript
 * const reflectionGenerator = new SkyAtmosphereReflectionGenerator(redGPUContext, sharedUniformBuffer, sampler);
 * await reflectionGenerator.render(transmittance, multiScat, skyView);
 * ```
 * @category SkyAtmosphere
 */
class SkyAtmosphereReflectionGenerator extends ASkyAtmosphereLUTGenerator {
    #sourceCubeTexture: GPUTexture;
    #sourceCubeTextureView: GPUTextureView;
    #prefilteredTextureSoftCut: DirectCubeTexture;
    #prefilteredTextureNoSoftCut: DirectCubeTexture;
    #prefilteredTextureCombined: DirectCubeTexture;
    #combinedCubeTexture: GPUTexture;
    #softCutPipeline: GPUComputePipeline;
    #noSoftCutPipeline: GPUComputePipeline;
    #combinePipeline: GPUComputePipeline;
    #combineUniformBuffer: UniformBuffer;
    
    #softCutBindGroup: GPUBindGroup;
    #noSoftCutBindGroup: GPUBindGroup;
    #combineBindGroups: GPUBindGroup[] = [];

    /**
     * [KO] SkyAtmosphereReflectionGenerator 인스턴스를 초기화합니다.
     * [EN] Initializes a SkyAtmosphereReflectionGenerator instance.
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
        super(redGPUContext, sharedUniformBuffer, sampler, 'SKY_REFL_GEN', 256, 256, 6);
        this.#init();
    }

    /**
     * [KO] 렌더링 소스로 사용되는 원본 큐브맵 텍스처를 반환합니다.
     * [EN] Returns the source cubemap texture used for rendering.
     */
    get sourceCubeTexture(): GPUTexture {
        return this.#sourceCubeTexture;
    }

    /**
     * [KO] 프리필터링이 완료된 결과 큐브맵 텍스처를 반환합니다.
     * [EN] Returns the resulting pre-filtered cubemap texture.
     */
    get prefilteredTexture(): DirectCubeTexture {
        return this.#prefilteredTextureCombined;
    }

    /**
     * [KO] 생성된 반사 큐브맵(프리필터링된 결과)을 반환합니다.
     * [EN] Returns the generated reflection cubemap (pre-filtered result).
     */
    get lutTexture(): DirectCubeTexture {
        return this.#prefilteredTextureCombined;
    }

    /**
     * [KO] 반사 큐브맵을 생성하고 프리필터링을 수행합니다.
     * [EN] Generates the reflection cubemap and performs pre-filtering.
     *
     * @example
     * ```typescript
     * await reflectionGenerator.render(transmittance, multiScat, skyView);
     * ```
     * @param transmittance -
     * [KO] 투과율 LUT 텍스처
     * [EN] Transmittance LUT texture
     * @param multiScat -
     * [KO] 다중 산란 LUT 텍스처
     * [EN] Multi-Scattering LUT texture
     * @param skyView -
     * [KO] 스카이 뷰 LUT 텍스처
     * [EN] Sky-View LUT texture
     */
    // @ts-ignore
    async render(transmittance: DirectTexture, multiScat: DirectTexture, skyView: DirectTexture): Promise<void> {
        const {gpuDevice, resourceManager} = this.redGPUContext;

        if (!this.#softCutBindGroup) {
            this.#softCutBindGroup = gpuDevice.createBindGroup({
                layout: this.#softCutPipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: this.#sourceCubeTextureView},
                    {binding: 1, resource: multiScat.gpuTextureView},
                    {binding: 2, resource: this.sampler.gpuSampler},
                    {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                    {binding: 4, resource: transmittance.gpuTextureView},
                    {binding: 5, resource: skyView.gpuTextureView}
                ]
            });
        }

        if (!this.#noSoftCutBindGroup) {
            this.#noSoftCutBindGroup = gpuDevice.createBindGroup({
                layout: this.#noSoftCutPipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: this.#sourceCubeTextureView},
                    {binding: 1, resource: multiScat.gpuTextureView},
                    {binding: 2, resource: this.sampler.gpuSampler},
                    {binding: 3, resource: {buffer: this.sharedUniformBuffer.gpuBuffer}},
                    {binding: 4, resource: transmittance.gpuTextureView},
                    {binding: 5, resource: skyView.gpuTextureView}
                ]
            });
        }

        this.#computeRender(this.#softCutPipeline, this.#softCutBindGroup, [8, 8, 1]);

        resourceManager.mipmapGenerator.generateMipmap(this.#sourceCubeTexture, {
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: this.#sourceCubeTexture.usage,
            mipLevelCount: getMipLevelCount(this.width, this.height),
            dimension: '2d'
        });

        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, this.#prefilteredTextureSoftCut);

        this.#computeRender(this.#noSoftCutPipeline, this.#noSoftCutBindGroup, [8, 8, 1]);

        resourceManager.mipmapGenerator.generateMipmap(this.#sourceCubeTexture, {
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: this.#sourceCubeTexture.usage,
            mipLevelCount: getMipLevelCount(this.width, this.height),
            dimension: '2d'
        });

        await resourceManager.prefilterGenerator.generate(this.#sourceCubeTexture, this.width, this.#prefilteredTextureNoSoftCut);

        this.#combinePrefilteredTextures();
    }

    #init(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);

        this.#sourceCubeTexture = gpuDevice.createTexture({
            label: 'SkyAtmosphere_Reflection_Source_Cube',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
            mipLevelCount: mipLevelCount
        });
        this.#sourceCubeTextureView = this.#sourceCubeTexture.createView({
            dimension: '2d-array',
            baseMipLevel: 0,
            mipLevelCount: 1
        });

        this.#prefilteredTextureSoftCut = new DirectCubeTexture(this.redGPUContext, `SKY_ATMOSPHERE_REFL_SOFTCUT_${createUUID()}`);
        this.#prefilteredTextureNoSoftCut = new DirectCubeTexture(this.redGPUContext, `SKY_ATMOSPHERE_REFL_NOSOFTCUT_${createUUID()}`);
        this.#combinedCubeTexture = gpuDevice.createTexture({
            label: 'SkyAtmosphere_Reflection_Combined_Cube',
            size: [this.width, this.height, 6],
            format: 'rgba16float',
            usage: GPUTextureUsage.STORAGE_BINDING | GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_SRC | GPUTextureUsage.COPY_DST,
            mipLevelCount: mipLevelCount
        });
        this.#prefilteredTextureCombined = new DirectCubeTexture(this.redGPUContext, `SKY_ATMOSPHERE_REFL_COMBINED_${createUUID()}`, this.#combinedCubeTexture);

        this.#softCutPipeline = gpuDevice.createComputePipeline({
            label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PIPELINE_SOFTCUT',
            layout: 'auto',
            compute: {
                module: gpuDevice.createShaderModule({code: SOFTCUT_SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });

        this.#noSoftCutPipeline = gpuDevice.createComputePipeline({
            label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PIPELINE_NOSOFTCUT',
            layout: 'auto',
            compute: {
                module: gpuDevice.createShaderModule({code: NOSOFTCUT_SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });

        this.#combinePipeline = gpuDevice.createComputePipeline({
            label: 'SKY_ATMOSPHERE_REFLECTION_GEN_PIPELINE_COMBINE',
            layout: 'auto',
            compute: {
                module: gpuDevice.createShaderModule({code: COMBINE_SHADER_INFO.defaultSource}),
                entryPoint: 'main'
            }
        });

        this.#combineUniformBuffer = new UniformBuffer(
            this.redGPUContext,
            new ArrayBuffer(16),
            'SKY_ATMOSPHERE_REFL_COMBINE_UBO'
        );
    }

    #computeRender(
        pipeline: GPUComputePipeline,
        bindGroup: GPUBindGroup,
        workgroupSize: [number, number, number] = [16, 16, 1],
        width: number = this.width,
        height: number = this.height,
        depth: number = this.depth
    ): void {
        const {gpuDevice} = this.redGPUContext;
        const commandEncoder = gpuDevice.createCommandEncoder({label: `${this.label}_COMMAND_ENCODER`});
        const passEncoder = commandEncoder.beginComputePass({label: `${this.label}_COMPUTE_PASS`});

        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, bindGroup);
        passEncoder.dispatchWorkgroups(
            Math.ceil(width / workgroupSize[0]),
            Math.ceil(height / workgroupSize[1]),
            Math.ceil(depth / workgroupSize[2])
        );
        passEncoder.end();

        gpuDevice.queue.submit([commandEncoder.finish()]);
    }

    #combinePrefilteredTextures(): void {
        const {gpuDevice} = this.redGPUContext;
        const mipLevelCount = getMipLevelCount(this.width, this.height);

        for (let mip = 0; mip < mipLevelCount; mip++) {
            const mipWidth = Math.max(1, this.width >> mip);
            const mipHeight = Math.max(1, this.height >> mip);
            const roughness = mipLevelCount > 1 ? mip / (mipLevelCount - 1) : 0.0;

            const uniformView = this.#combineUniformBuffer.dataViewF32;
            uniformView[0] = roughness;
            uniformView[1] = mip;
            gpuDevice.queue.writeBuffer(this.#combineUniformBuffer.gpuBuffer, 0, this.#combineUniformBuffer.data);

            const outputView = this.#combinedCubeTexture.createView({
                dimension: '2d-array',
                baseMipLevel: mip,
                mipLevelCount: 1,
                baseArrayLayer: 0,
                arrayLayerCount: 6
            });

            const bindGroup = gpuDevice.createBindGroup({
                layout: this.#combinePipeline.getBindGroupLayout(0),
                entries: [
                    {binding: 0, resource: this.#prefilteredTextureSoftCut.gpuTextureView},
                    {binding: 1, resource: this.#prefilteredTextureNoSoftCut.gpuTextureView},
                    {binding: 2, resource: this.sampler.gpuSampler},
                    {binding: 3, resource: outputView},
                    {binding: 4, resource: {buffer: this.#combineUniformBuffer.gpuBuffer}}
                ]
            });

            this.#computeRender(this.#combinePipeline, bindGroup, [8, 8, 1], mipWidth, mipHeight, 6);
        }

        this.#prefilteredTextureCombined.notifyUpdate();
    }
}

export default SkyAtmosphereReflectionGenerator;
