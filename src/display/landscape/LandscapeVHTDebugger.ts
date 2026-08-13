import ALandscapeDebugger from "./ALandscapeDebugger";
import Landscape from "./Landscape";

/**
 * [KO] Landscape 지형 시스템의 16비트 VHT (Virtual Heightfield Texture) 아틀라스 텍스처를 WebGPU Canvas Context를 통해 60fps 실시간 오버레이로 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class visualizing the 16-bit VHT (Virtual Heightfield Texture) atlas texture of Landscape terrain system via WebGPU Canvas Context 60fps real-time overlay.
 */
export class LandscapeVHTDebugger extends ALandscapeDebugger {
    #context: GPUCanvasContext | null = null;
    #pipeline: GPURenderPipeline | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #lastBoundTexture: GPUTexture | null = null;
    #canvasFormat: GPUTextureFormat = 'bgra8unorm';

    constructor(
        landscape: Landscape,
        options: {
            width?: number,
            height?: number,
            left?: number,
            bottom?: number
        } = {}
    ) {
        const left = options.left ?? 120;
        super(landscape, 'landscape-vht-debugger-canvas', {...options, left});
        this.#initWebGPUContext();
    }

    update(): void {
        if (!this.visible || !this.#context) return;

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const vhtTexture = this.landscape.vhtAtlasTexture;
        if (!vhtTexture) return;

        // 지형 텍스처 변경 감지 시 GPUBindGroup 재할당
        if (this.#lastBoundTexture !== vhtTexture && this.#bindGroupLayout) {
            this.#lastBoundTexture = vhtTexture;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'VHTDebuggerBindGroup',
                layout: this.#bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: vhtTexture.createView()
                    }
                ]
            });
        }

        if (!this.#pipeline || !this.#bindGroup) return;

        try {
            const commandEncoder = gpuDevice.createCommandEncoder({label: 'VHTDebuggerCommandEncoder'});
            const currentTexture = this.#context.getCurrentTexture();
            if (!currentTexture) return;

            const passEncoder = commandEncoder.beginRenderPass({
                colorAttachments: [
                    {
                        view: currentTexture.createView(),
                        clearValue: {r: 0.06, g: 0.09, b: 0.16, a: 1.0},
                        loadOp: 'clear',
                        storeOp: 'store'
                    }
                ]
            });

            passEncoder.setPipeline(this.#pipeline);
            passEncoder.setBindGroup(0, this.#bindGroup);
            passEncoder.draw(4);
            passEncoder.end();

            gpuDevice.queue.submit([commandEncoder.finish()]);
        } catch (e) {
            // 프레임 스킵 안전 예외 처리
        }
    }

    #initWebGPUContext(): void {
        const gpu = navigator.gpu;
        if (!gpu) return;

        this.#canvasFormat = gpu.getPreferredCanvasFormat ? gpu.getPreferredCanvasFormat() : 'bgra8unorm';
        const ctx = this.canvas.getContext('webgpu') as GPUCanvasContext | null;
        if (!ctx) return;
        this.#context = ctx;

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        ctx.configure({
            device: gpuDevice,
            format: this.#canvasFormat,
            alphaMode: 'premultiplied'
        });

        // VHT 프리뷰어 전용 바인드 그룹 레이아웃 (@binding(0): unfilterable-float VHT texture_2d)
        const bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'VHTDebuggerBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'unfilterable-float',
                        viewDimension: '2d'
                    }
                }
            ]
        });
        this.#bindGroupLayout = bindGroupLayout;

        // VHT 렌더 셰이더 모듈
        const shaderModule = gpuDevice.createShaderModule({
            label: 'VHTDebuggerShaderModule',
            code: `
                struct VertexOutput {
                    @builtin(position) position: vec4<f32>,
                    @location(0) uv: vec2<f32>,
                };

                @vertex
                fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
                    var pos = array<vec2<f32>, 4>(
                        vec2<f32>(-1.0,  1.0),
                        vec2<f32>( 1.0,  1.0),
                        vec2<f32>(-1.0, -1.0),
                        vec2<f32>( 1.0, -1.0)
                    );
                    var uvs = array<vec2<f32>, 4>(
                        vec2<f32>(0.0, 0.0),
                        vec2<f32>(1.0, 0.0),
                        vec2<f32>(0.0, 1.0),
                        vec2<f32>(1.0, 1.0)
                    );
                    var output: VertexOutput;
                    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                    output.uv = uvs[vertexIndex];
                    return output;
                }

                @group(0) @binding(0) var vhtTexture: texture_2d<f32>;

                @fragment
                fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
                    let texSize = vec2<f32>(textureDimensions(vhtTexture));
                    let texCoord = vec2<i32>(clamp(in.uv * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                    let h = textureLoad(vhtTexture, texCoord, 0).r;
                    
                    // 그리드 라인 오버레이 (8x8 타일 경계선 보정)
                    let tileGrid = step(vec2<f32>(0.98), fract(in.uv * 8.0));
                    let isGrid = max(tileGrid.x, tileGrid.y);
                    let finalColor = mix(vec3<f32>(h, h * 0.9 + 0.1, h * 0.8), vec3<f32>(0.22, 0.74, 0.97), isGrid * 0.6);

                    return vec4<f32>(finalColor, 1.0);
                }
            `
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'VHTDebuggerPipelineLayout',
            bindGroupLayouts: [bindGroupLayout]
        });

        this.#pipeline = gpuDevice.createRenderPipeline({
            label: 'VHTDebuggerRenderPipeline',
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [{format: this.#canvasFormat}]
            },
            primitive: {
                topology: 'triangle-strip'
            }
        });
    }
}

export default LandscapeVHTDebugger;
