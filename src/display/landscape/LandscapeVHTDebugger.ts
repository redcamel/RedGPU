import Landscape from "./Landscape";

/**
 * [KO] Landscape 지형 시스템의 16비트 Virtual Heightfield Texture (VHT) 아틀라스 GPU 텍스처 합성 상태를 실시간 시각화하는 WebGPU 디버거 클래스입니다.
 * [EN] WebGPU debugger class visualizing the 16-bit Virtual Heightfield Texture (VHT) atlas GPU texture synthesis state of Landscape terrain system in real-time.
 */
export class LandscapeVHTDebugger {
    #landscape: Landscape;
    #canvas: HTMLCanvasElement;
    #context: GPUCanvasContext | null = null;
    #pipeline: GPURenderPipeline | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #lastBoundTexture: GPUTexture | null = null;
    #visible: boolean = true;
    #canvasFormat: GPUTextureFormat = 'bgra8unorm';

    #width: number = 100;
    #height: number = 100;
    #left: number = 120;
    #bottom: number = 12;

    constructor(landscape: Landscape, options: {
        width?: number,
        height?: number,
        left?: number,
        bottom?: number
    } = {}) {
        this.#landscape = landscape;

        const w = options.width ?? 100;
        const h = options.height ?? 100;
        const left = options.left ?? 120;
        const bottom = options.bottom ?? 12;

        const canvas = document.createElement('canvas');
        canvas.id = 'landscape-vht-debugger-canvas';
        canvas.width = w;
        canvas.height = h;

        // 외부 전역 CSS 규칙 완전 차단 (CSS Isolation)
        canvas.style.setProperty('all', 'initial', 'important');
        canvas.style.setProperty('position', 'fixed', 'important');
        canvas.style.setProperty('left', `${left}px`, 'important');
        canvas.style.setProperty('bottom', `${bottom}px`, 'important');
        canvas.style.setProperty('top', 'auto', 'important');
        canvas.style.setProperty('right', 'auto', 'important');
        canvas.style.setProperty('width', `${w}px`, 'important');
        canvas.style.setProperty('height', `${h}px`, 'important');
        canvas.style.setProperty('min-width', `${w}px`, 'important');
        canvas.style.setProperty('min-height', `${h}px`, 'important');
        canvas.style.setProperty('max-width', `${w}px`, 'important');
        canvas.style.setProperty('max-height', `${h}px`, 'important');
        canvas.style.setProperty('box-sizing', 'border-box', 'important');
        canvas.style.setProperty('margin', '0', 'important');
        canvas.style.setProperty('padding', '0', 'important');
        canvas.style.setProperty('transform', 'none', 'important');
        canvas.style.setProperty('background', 'rgba(15, 23, 42, 0.85)', 'important');
        canvas.style.setProperty('backdrop-filter', 'blur(6px)', 'important');
        canvas.style.setProperty('border', '1px solid rgba(56, 189, 248, 0.35)', 'important');
        canvas.style.setProperty('border-radius', '6px', 'important');
        canvas.style.setProperty('pointer-events', 'none', 'important');
        canvas.style.setProperty('z-index', '99999', 'important');
        canvas.style.setProperty('display', 'block', 'important');

        document.body.appendChild(canvas);
        this.#canvas = canvas;
        this.#width = w;
        this.#height = h;
        this.#left = left;
        this.#bottom = bottom;

        this.#initWebGPUContext();
    }

    get visible(): boolean {
        return this.#visible;
    }

    set visible(val: boolean) {
        this.#visible = val;
        this.#canvas.style.setProperty('display', val ? 'block' : 'none', 'important');
    }

    get width(): number {
        return this.#width;
    }

    set width(w: number) {
        this.setSize(w, this.#height);
    }

    get height(): number {
        return this.#height;
    }

    set height(h: number) {
        this.setSize(this.#width, h);
    }

    get left(): number {
        return this.#left;
    }

    set left(l: number) {
        this.setPosition(l, this.#bottom);
    }

    get bottom(): number {
        return this.#bottom;
    }

    set bottom(b: number) {
        this.setPosition(this.#left, b);
    }

    setSize(w: number, h: number): void {
        this.#width = Math.max(20, w);
        this.#height = Math.max(20, h);
        this.#canvas.width = this.#width;
        this.#canvas.height = this.#height;

        this.#canvas.style.setProperty('width', `${this.#width}px`, 'important');
        this.#canvas.style.setProperty('height', `${this.#height}px`, 'important');
        this.#canvas.style.setProperty('min-width', `${this.#width}px`, 'important');
        this.#canvas.style.setProperty('min-height', `${this.#height}px`, 'important');
        this.#canvas.style.setProperty('max-width', `${this.#width}px`, 'important');
        this.#canvas.style.setProperty('max-height', `${this.#height}px`, 'important');
    }

    setPosition(left: number, bottom: number): void {
        this.#left = left;
        this.#bottom = bottom;
        this.#canvas.style.setProperty('left', `${left}px`, 'important');
        this.#canvas.style.setProperty('bottom', `${bottom}px`, 'important');
    }

    update(): void {
        if (!this.#visible || !this.#context) return;

        const redGPUContext = (this.#landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const vhtTexture = this.#landscape.vhtAtlasTexture;
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

    destroy(): void {
        if (this.#canvas && this.#canvas.parentNode) {
            this.#canvas.parentNode.removeChild(this.#canvas);
        }
    }

    #initWebGPUContext(): void {
        const gpu = navigator.gpu;
        if (!gpu) return;

        this.#canvasFormat = gpu.getPreferredCanvasFormat ? gpu.getPreferredCanvasFormat() : 'bgra8unorm';
        const ctx = this.#canvas.getContext('webgpu') as GPUCanvasContext | null;
        if (!ctx) return;
        this.#context = ctx;

        const redGPUContext = (this.#landscape as any)?.redGPUContext;
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
