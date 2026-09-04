import RedGPUContext from "../../../context/RedGPUContext";
import hzbDownsampleShader from "./hzbDownsample.wgsl";
import hzbMip0MSAAShader from "./hzbMip0MSAA.wgsl";

/**
 * 🌿 Hierarchical Z-Buffer (HZB) 전역 피라미드 매니저
 * - 뷰포트 깊이 버퍼로부터 8단계 Mipmap 깊이 피라미드(512x256 POT)를 생성합니다.
 * - GPU Culling (식생/오브젝트) 및 Hi-Z SSR, SSAO, Contact Shadow에 활용됩니다.
 */
class HierarchicalZBuffer {
    static readonly HZB_WIDTH = 512;
    static readonly HZB_HEIGHT = 256;
    static readonly MIP_COUNT = 8; // 512x256 -> 256x128 -> 128x64 -> 64x32 -> 32x16 -> 16x8 -> 8x4 -> 4x2

    #redGPUContext: RedGPUContext;
    #hzbTexture: GPUTexture | null = null;
    #hzbFullTextureView: GPUTextureView | null = null;
    #hzbMipViews: GPUTextureView[] = [];
    #hzbSampler: GPUSampler | null = null;

    #pipelineMip0: GPUComputePipeline | null = null;
    #pipelineMip0MSAA: GPUComputePipeline | null = null;
    #pipelineDownsample: GPUComputePipeline | null = null;

    #bglMip0: GPUBindGroupLayout | null = null;
    #bglMip0MSAA: GPUBindGroupLayout | null = null;
    #bglDownsample: GPUBindGroupLayout | null = null;

    #uniformBuffers: GPUBuffer[] = [];
    #bindGroupsMip0: Map<GPUTextureView, GPUBindGroup> = new Map();
    #bindGroupsDownsample: GPUBindGroup[] = [];

    #lastSrcWidth: number = -1;
    #lastSrcHeight: number = -1;
    #cachedMip0Params: Uint32Array = new Uint32Array(4);

    #isInitialized = false;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#init();
    }

    get texture(): GPUTexture | null {
        return this.#hzbTexture;
    }

    get textureView(): GPUTextureView | null {
        return this.#hzbFullTextureView;
    }

    get sampler(): GPUSampler | null {
        return this.#hzbSampler;
    }

    /**
     * Depth Texture로부터 8단계 HZB Mipmap 피라미드를 고속(0.02ms) 생성합니다.
     */
    generate(
        commandEncoder: GPUCommandEncoder,
        sourceDepthTextureView: GPUTextureView,
        srcWidth: number,
        srcHeight: number,
        isMSAA: boolean = false
    ): void {
        if (!this.#isInitialized || !this.#pipelineMip0 || !this.#pipelineMip0MSAA || !this.#pipelineDownsample) return;
        const gpuDevice = this.#redGPUContext.gpuDevice;

        // Mip 0 파라미터 업데이트 (해상도 변경 시에만 1회 전송 및 GC 0건 인플레이스 기록)
        if (this.#lastSrcWidth !== srcWidth || this.#lastSrcHeight !== srcHeight) {
            this.#lastSrcWidth = srcWidth;
            this.#lastSrcHeight = srcHeight;
            this.#bindGroupsMip0.clear();
            const p = this.#cachedMip0Params;
            p[0] = srcWidth;
            p[1] = srcHeight;
            p[2] = HierarchicalZBuffer.HZB_WIDTH;
            p[3] = HierarchicalZBuffer.HZB_HEIGHT;
            gpuDevice.queue.writeBuffer(this.#uniformBuffers[0], 0, p.buffer, p.byteOffset, p.byteLength);
        }

        // Mip 0 바인드그룹 조회 또는 생성
        let bgMip0 = this.#bindGroupsMip0.get(sourceDepthTextureView);
        if (!bgMip0) {
            const layout = isMSAA ? this.#bglMip0MSAA! : this.#bglMip0!;
            bgMip0 = gpuDevice.createBindGroup({
                label: isMSAA ? 'HZB_BindGroup_Mip0_MSAA_Dynamic' : 'HZB_BindGroup_Mip0_Dynamic',
                layout,
                entries: [
                    {binding: 0, resource: sourceDepthTextureView},
                    {binding: 1, resource: this.#hzbMipViews[0]},
                    {binding: 2, resource: {buffer: this.#uniformBuffers[0]}},
                ],
            });
            this.#bindGroupsMip0.set(sourceDepthTextureView, bgMip0);
        }

        const pass = commandEncoder.beginComputePass({
            label: 'HierarchicalZBuffer_Generation_Pass',
        });

        // 1. Mip 0 생성 (Depth -> HZB Mip 0)
        const pipelineMip0 = isMSAA ? this.#pipelineMip0MSAA : this.#pipelineMip0;
        pass.setPipeline(pipelineMip0);
        pass.setBindGroup(0, bgMip0);
        pass.dispatchWorkgroups(
            Math.ceil(HierarchicalZBuffer.HZB_WIDTH / 8),
            Math.ceil(HierarchicalZBuffer.HZB_HEIGHT / 8)
        );

        // 2. Mip 1..N 다운샘플링 (HZB Mip[K-1] -> HZB Mip[K])
        pass.setPipeline(this.#pipelineDownsample);
        for (let m = 1; m < HierarchicalZBuffer.MIP_COUNT; m++) {
            const dstW = Math.max(HierarchicalZBuffer.HZB_WIDTH >> m, 1);
            const dstH = Math.max(HierarchicalZBuffer.HZB_HEIGHT >> m, 1);

            pass.setBindGroup(0, this.#bindGroupsDownsample[m - 1]);
            pass.dispatchWorkgroups(Math.ceil(dstW / 8), Math.ceil(dstH / 8));
        }

        pass.end();
    }

    destroy(): void {
        this.#hzbTexture?.destroy();
        this.#hzbTexture = null;
        this.#hzbFullTextureView = null;
        this.#hzbMipViews.length = 0;
        this.#uniformBuffers.forEach(b => b.destroy());
        this.#uniformBuffers.length = 0;
        this.#bindGroupsMip0.clear();
        this.#bindGroupsDownsample.length = 0;
        this.#pipelineMip0 = null;
        this.#pipelineMip0MSAA = null;
        this.#pipelineDownsample = null;
        this.#bglMip0 = null;
        this.#bglMip0MSAA = null;
        this.#bglDownsample = null;
        this.#isInitialized = false;
    }

    #init(): void {
        const gpuDevice = this.#redGPUContext.gpuDevice;
        if (!gpuDevice) return;

        // 1. HZB 텍스처 생성 (512x256, r32float, 8 Mips)
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

        // 2. HZB 샘플러 생성 (Point/Linear Clamp)
        this.#hzbSampler = gpuDevice.createSampler({
            label: 'HierarchicalZBuffer_Sampler',
            magFilter: 'linear',
            minFilter: 'linear',
            mipmapFilter: 'nearest',
            addressModeU: 'clamp-to-edge',
            addressModeV: 'clamp-to-edge',
        });

        // 3. Compute Shader 모듈 생성
        const shaderModule = gpuDevice.createShaderModule({
            label: 'HierarchicalZBuffer_ShaderModule',
            code: hzbDownsampleShader,
        });

        const shaderModuleMSAA = gpuDevice.createShaderModule({
            label: 'HierarchicalZBuffer_MSAA_ShaderModule',
            code: hzbMip0MSAAShader,
        });

        // 4. BindGroupLayouts
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

        this.#bglDownsample = gpuDevice.createBindGroupLayout({
            label: 'HZB_BGL_Downsample',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'unfilterable-float'},
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

        // 5. Compute Pipelines
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

        this.#pipelineDownsample = gpuDevice.createComputePipeline({
            label: 'HZB_Pipeline_Downsample',
            layout: gpuDevice.createPipelineLayout({
                bindGroupLayouts: [this.#bglDownsample],
            }),
            compute: {
                module: shaderModule,
                entryPoint: 'mainDownsample',
            },
        });

        // 6. Uniform Buffers (Mip별 파라미터 캐싱)
        this.#uniformBuffers = [];
        for (let m = 0; m < HierarchicalZBuffer.MIP_COUNT; m++) {
            const buf = gpuDevice.createBuffer({
                label: `HZB_UniformBuffer_Mip_${m}`,
                size: 16, // 4 x u32
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            });
            this.#uniformBuffers.push(buf);
        }

        // 7. Mip 1..N 다운샘플 바인드그룹 사전 생성
        this.#bindGroupsDownsample = [];
        for (let m = 1; m < HierarchicalZBuffer.MIP_COUNT; m++) {
            const srcMip = m - 1;
            const dstMip = m;

            const srcW = Math.max(HierarchicalZBuffer.HZB_WIDTH >> srcMip, 1);
            const srcH = Math.max(HierarchicalZBuffer.HZB_HEIGHT >> srcMip, 1);
            const dstW = Math.max(HierarchicalZBuffer.HZB_WIDTH >> dstMip, 1);
            const dstH = Math.max(HierarchicalZBuffer.HZB_HEIGHT >> dstMip, 1);

            const paramData = new Uint32Array([srcW, srcH, dstW, dstH]);
            gpuDevice.queue.writeBuffer(this.#uniformBuffers[dstMip], 0, paramData);

            const bg = gpuDevice.createBindGroup({
                label: `HZB_BindGroup_Downsample_${m}`,
                layout: this.#bglDownsample,
                entries: [
                    {binding: 0, resource: this.#hzbMipViews[srcMip]},
                    {binding: 1, resource: this.#hzbMipViews[dstMip]},
                    {binding: 2, resource: {buffer: this.#uniformBuffers[dstMip]}},
                ],
            });
            this.#bindGroupsDownsample.push(bg);
        }

        this.#isInitialized = true;
    }
}

Object.freeze(HierarchicalZBuffer);
export default HierarchicalZBuffer;
