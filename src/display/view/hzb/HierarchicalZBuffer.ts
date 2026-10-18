import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import hzbDownsampleShader from "./hzbDownsample.wgsl";
import hzbMip0MSAAShader from "./hzbMip0MSAA.wgsl";

/**
 * [KO] 뷰포트 깊이 버퍼로부터 8단계 밉맵 깊이 피라미드를 생성하고 관리하는 클래스입니다.
 * [EN] Class that generates and manages an 8-level mipmap depth pyramid from the viewport depth buffer.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] 올바른 접근 방법
 * // [EN] Correct access method
 * const hzb = view.hierarchicalZBuffer;
 * ```
 *
 * @category View
 */
class HierarchicalZBuffer extends RedGPUObject {
    /**
     * [KO] HZB 피라미드의 기본 너비 (픽셀)
     * [EN] Base width of the HZB pyramid (pixels)
     */
    static HZB_WIDTH = 512;
    /**
     * [KO] HZB 피라미드의 기본 높이 (픽셀)
     * [EN] Base height of the HZB pyramid (pixels)
     */
    static HZB_HEIGHT = 256;
    /**
     * [KO] HZB 피라미드의 밉맵 단계 수
     * [EN] Number of mipmap levels in the HZB pyramid
     */
    static MIP_COUNT = 8;

    #hzbTexture: GPUTexture | null = null;
    #hzbFullTextureView: GPUTextureView | null = null;
    #hzbMipViews: GPUTextureView[] = [];
    #hzbSampler: GPUSampler | null = null;

    #pipelineMip0: GPUComputePipeline | null = null;
    #pipelineMip0MSAA: GPUComputePipeline | null = null;
    #pipelineDownsampleSPD5: GPUComputePipeline | null = null;
    #pipelineDownsampleTail: GPUComputePipeline | null = null;

    #bglMip0: GPUBindGroupLayout | null = null;
    #bglMip0MSAA: GPUBindGroupLayout | null = null;
    #bglDownsampleSPD5: GPUBindGroupLayout | null = null;
    #bglDownsampleTail: GPUBindGroupLayout | null = null;

    #uniformBufferMip0: GPUBuffer | null = null;
    #bindGroupsMip0: Map<GPUTextureView, GPUBindGroup> = new Map();
    #bindGroupDownsampleSPD5: GPUBindGroup | null = null;
    #bindGroupDownsampleTail: GPUBindGroup | null = null;

    #lastSrcWidth: number = -1;
    #lastSrcHeight: number = -1;
    #cachedMip0Params: Uint32Array = new Uint32Array(4);

    #isInitialized = false;

    /**
     * [KO] `HierarchicalZBuffer` 인스턴스를 생성합니다.
     * [EN] Creates a `HierarchicalZBuffer` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.#init();
    }

    /**
     * [KO] HZB 밉맵 피라미드 `GPUTexture`를 반환합니다.
     * [EN] Returns the HZB mipmap pyramid `GPUTexture`.
     *
     * @returns
     * [KO] `GPUTexture` 또는 `null`
     * [EN] `GPUTexture` or `null`
     */
    get texture(): GPUTexture | null {
        return this.#hzbTexture;
    }

    /**
     * [KO] 전체 HZB 밉맵 레벨을 포함하는 `GPUTextureView`를 반환합니다.
     * [EN] Returns the `GPUTextureView` covering all HZB mipmap levels.
     *
     * @returns
     * [KO] `GPUTextureView` 또는 `null`
     * [EN] `GPUTextureView` or `null`
     */
    get textureView(): GPUTextureView | null {
        return this.#hzbFullTextureView;
    }

    /**
     * [KO] HZB 샘플러(`GPUSampler`)를 반환합니다.
     * [EN] Returns the HZB `GPUSampler`.
     *
     * @returns
     * [KO] `GPUSampler` 또는 `null`
     * [EN] `GPUSampler` or `null`
     */
    get sampler(): GPUSampler | null {
        return this.#hzbSampler;
    }

    /**
     * [KO] 소스 깊이 텍스처 뷰로부터 8단계 HZB 밉맵 피라미드를 SPD(Single-Pass Downsampler)로 생성합니다.
     * [EN] Generates an 8-level HZB mipmap pyramid from the source depth texture view using Single-Pass Downsampler (SPD).
     *
     * @param commandEncoder -
     * [KO] 컴퓨트 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the compute pass
     * @param sourceDepthTextureView -
     * [KO] 원본 깊이 텍스처 뷰
     * [EN] Source depth texture view
     * @param srcWidth -
     * [KO] 원본 깊이 텍스처 너비 (픽셀)
     * [EN] Source depth texture width (pixels)
     * @param srcHeight -
     * [KO] 원본 깊이 텍스처 높이 (픽셀)
     * [EN] Source depth texture height (pixels)
     * @param isMSAA -
     * [KO] 멀티샘플링(MSAA) 깊이 텍스처 여부 (기본값: `false`)
     * [EN] Whether the depth texture is multisampled (MSAA) (default: `false`)
     */
    generate(
        commandEncoder: GPUCommandEncoder,
        sourceDepthTextureView: GPUTextureView,
        srcWidth: number,
        srcHeight: number,
        isMSAA: boolean = false
    ): void {
        if (!this.#isInitialized || !this.#pipelineMip0 || !this.#pipelineMip0MSAA || !this.#pipelineDownsampleSPD5 || !this.#pipelineDownsampleTail) return;
        const gpuDevice = this.gpuDevice;

        if (this.#lastSrcWidth !== srcWidth || this.#lastSrcHeight !== srcHeight) {
            this.#lastSrcWidth = srcWidth;
            this.#lastSrcHeight = srcHeight;
            this.#bindGroupsMip0.clear();
            const p = this.#cachedMip0Params;
            p[0] = srcWidth;
            p[1] = srcHeight;
            p[2] = HierarchicalZBuffer.HZB_WIDTH;
            p[3] = HierarchicalZBuffer.HZB_HEIGHT;
            gpuDevice.queue.writeBuffer(this.#uniformBufferMip0!, 0, p.buffer, p.byteOffset, p.byteLength);
        }

        let bgMip0 = this.#bindGroupsMip0.get(sourceDepthTextureView);
        if (!bgMip0) {
            const layout = isMSAA ? this.#bglMip0MSAA! : this.#bglMip0!;
            bgMip0 = gpuDevice.createBindGroup({
                label: isMSAA ? 'HZB_BindGroup_Mip0_MSAA_Dynamic' : 'HZB_BindGroup_Mip0_Dynamic',
                layout,
                entries: [
                    {binding: 0, resource: sourceDepthTextureView},
                    {binding: 1, resource: this.#hzbMipViews[0]},
                    {binding: 2, resource: {buffer: this.#uniformBufferMip0!}},
                ],
            });
            this.#bindGroupsMip0.set(sourceDepthTextureView, bgMip0);
        }

        const pass = commandEncoder.beginComputePass({
            label: 'HierarchicalZBuffer_Generation_Pass',
        });

        const pipelineMip0 = isMSAA ? this.#pipelineMip0MSAA : this.#pipelineMip0;
        pass.setPipeline(pipelineMip0);
        pass.setBindGroup(0, bgMip0);
        pass.dispatchWorkgroups(
            Math.ceil(HierarchicalZBuffer.HZB_WIDTH / 8),
            Math.ceil(HierarchicalZBuffer.HZB_HEIGHT / 8)
        );

        pass.setPipeline(this.#pipelineDownsampleSPD5);
        pass.setBindGroup(0, this.#bindGroupDownsampleSPD5!);
        pass.dispatchWorkgroups(16, 8);

        pass.setPipeline(this.#pipelineDownsampleTail);
        pass.setBindGroup(0, this.#bindGroupDownsampleTail!);
        pass.dispatchWorkgroups(1, 1);

        pass.end();
    }

    /**
     * [KO] HZB 피라미드 텍스처 및 컴퓨트 파이프라인 리소스를 해제합니다.
     * [EN] Destroys the HZB pyramid texture and compute pipeline resources.
     */
    destroy(): void {
        this.#hzbTexture?.destroy();
        this.#hzbTexture = null;
        this.#hzbFullTextureView = null;
        this.#hzbMipViews.length = 0;
        this.#uniformBufferMip0?.destroy();
        this.#uniformBufferMip0 = null;
        this.#bindGroupsMip0.clear();
        this.#bindGroupDownsampleSPD5 = null;
        this.#bindGroupDownsampleTail = null;
        this.#pipelineMip0 = null;
        this.#pipelineMip0MSAA = null;
        this.#pipelineDownsampleSPD5 = null;
        this.#pipelineDownsampleTail = null;
        this.#bglMip0 = null;
        this.#bglMip0MSAA = null;
        this.#bglDownsampleSPD5 = null;
        this.#bglDownsampleTail = null;
        this.#isInitialized = false;
    }

    #init(): void {
        const gpuDevice = this.gpuDevice;
        if (!gpuDevice) return;

        this.#hzbTexture = gpuDevice.createTexture({
            label: 'HierarchicalZBuffer_Texture',
            size: {
                width: HierarchicalZBuffer.HZB_WIDTH,
                height: HierarchicalZBuffer.HZB_HEIGHT,
                depthOrArrayLayers: 1,
            },
            mipLevelCount: HierarchicalZBuffer.MIP_COUNT,
            format: 'r32float',
            usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.STORAGE_BINDING,
        });

        this.#hzbFullTextureView = this.#hzbTexture.createView({
            label: 'HierarchicalZBuffer_FullView',
        });

        this.#hzbMipViews = [];
        for (let m = 0; m < HierarchicalZBuffer.MIP_COUNT; m++) {
            const mipView = this.#hzbTexture.createView({
                label: `HierarchicalZBuffer_MipView_${m}`,
                baseMipLevel: m,
                mipLevelCount: 1,
            });
            this.#hzbMipViews.push(mipView);
        }

        this.#hzbSampler = gpuDevice.createSampler({
            label: 'HierarchicalZBuffer_Sampler',
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'nearest',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });

        const shaderModule = gpuDevice.createShaderModule({
            label: 'HierarchicalZBuffer_ShaderModule',
            code: hzbDownsampleShader,
        });

        const shaderModuleMSAA = gpuDevice.createShaderModule({
            label: 'HierarchicalZBuffer_MSAA_ShaderModule',
            code: hzbMip0MSAAShader,
        });

        this.#bglMip0 = gpuDevice.createBindGroupLayout({
            label: 'HZB_BGL_Mip0',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'depth'},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'},
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'uniform'},
                },
            ],
        });

        this.#bglMip0MSAA = gpuDevice.createBindGroupLayout({
            label: 'HZB_BGL_Mip0_MSAA',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'depth', multisampled: true},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'},
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'uniform'},
                },
            ],
        });

        this.#bglDownsampleSPD5 = gpuDevice.createBindGroupLayout({
            label: 'HZB_BGL_Downsample_SPD5',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'unfilterable-float'}},
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
                {
                    binding: 3,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
                {
                    binding: 4,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
                {
                    binding: 5,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
            ],
        });

        this.#bglDownsampleTail = gpuDevice.createBindGroupLayout({
            label: 'HZB_BGL_Downsample_Tail',
            entries: [
                {binding: 0, visibility: GPUShaderStage.COMPUTE, texture: {sampleType: 'unfilterable-float'}},
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float'}
                },
            ],
        });

        this.#pipelineMip0 = gpuDevice.createComputePipeline({
            label: 'HZB_Pipeline_Mip0',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#bglMip0],
            }),
            compute: {
                module: shaderModule,
                entryPoint: 'mainMip0',
            },
        });

        this.#pipelineMip0MSAA = gpuDevice.createComputePipeline({
            label: 'HZB_Pipeline_Mip0_MSAA',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#bglMip0MSAA],
            }),
            compute: {
                module: shaderModuleMSAA,
                entryPoint: 'mainMip0MSAA',
            },
        });

        this.#pipelineDownsampleSPD5 = gpuDevice.createComputePipeline({
            label: 'HZB_Pipeline_Downsample_SPD5',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#bglDownsampleSPD5],
            }),
            compute: {
                module: shaderModule,
                entryPoint: 'mainDownsampleSPD5',
            },
        });

        this.#pipelineDownsampleTail = gpuDevice.createComputePipeline({
            label: 'HZB_Pipeline_Downsample_Tail',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#bglDownsampleTail],
            }),
            compute: {
                module: shaderModule,
                entryPoint: 'mainDownsampleTail',
            },
        });

        this.#uniformBufferMip0 = gpuDevice.createBuffer({
            label: 'HZB_UniformBuffer_Mip0',
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        this.#bindGroupDownsampleSPD5 = gpuDevice.createBindGroup({
            label: 'HZB_BindGroup_Downsample_SPD5',
            layout: this.#bglDownsampleSPD5,
            entries: [
                {binding: 0, resource: this.#hzbMipViews[0]},
                {binding: 1, resource: this.#hzbMipViews[1]},
                {binding: 2, resource: this.#hzbMipViews[2]},
                {binding: 3, resource: this.#hzbMipViews[3]},
                {binding: 4, resource: this.#hzbMipViews[4]},
                {binding: 5, resource: this.#hzbMipViews[5]},
            ],
        });

        this.#bindGroupDownsampleTail = gpuDevice.createBindGroup({
            label: 'HZB_BindGroup_Downsample_Tail',
            layout: this.#bglDownsampleTail,
            entries: [
                {binding: 0, resource: this.#hzbMipViews[5]},
                {binding: 1, resource: this.#hzbMipViews[6]},
                {binding: 2, resource: this.#hzbMipViews[7]},
            ],
        });

        this.#isInitialized = true;
    }
}

Object.freeze(HierarchicalZBuffer);
export default HierarchicalZBuffer;
