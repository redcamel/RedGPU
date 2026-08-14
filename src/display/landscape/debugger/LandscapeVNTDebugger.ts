import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "../core/Landscape";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] Landscape 지형 시스템의 실시간 GPU 런타임 베이킹된 VNT (Virtual Normal Texture) 아틀라스 텍스처와 카메라 시선/FOV/로딩반경을 WebGPU Canvas 60fps 오버레이로 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class visualizing real-time GPU runtime baked VNT (Virtual Normal Texture) atlas texture, camera view direction, FOV, and loading radius of Landscape terrain system via WebGPU Canvas 60fps overlay.
 */
export class LandscapeVNTDebugger extends ALandscapeDebugger {
    #context: GPUCanvasContext | null = null;
    #pipeline: GPURenderPipeline | null = null;
    #bindGroup: GPUBindGroup | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #cameraUniformBuffer: GPUBuffer | null = null;
    #cameraDataArray: Float32Array = new Float32Array(8); // Reusable Float32Array (Zero-GC)

    #lastBoundTexture: GPUTexture | null = null;
    #canvasFormat: GPUTextureFormat = 'bgra8unorm';

    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        let opts = options;
        if (cameraOrOptions && (cameraOrOptions.width !== undefined || cameraOrOptions.left !== undefined || cameraOrOptions.bottom !== undefined)) {
            opts = cameraOrOptions;
        }

        const left = opts?.left ?? 228; // Default position right next to VHT Debugger (120 + 100 + 8)
        super(landscape, cameraOrOptions, {...opts, left}, 'Landscape_VNT_Debugger_Canvas');
        this.#initWebGPUContext();
    }

    update(): void {
        if (!this.visible || !this.#context) return;

        const state = this.getCameraState();
        if (!state) return;

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const vntTexture = this.landscape.vntAtlasTexture;
        if (!vntTexture || !vntTexture.gpuTexture) return;

        // 지형 텍스처 변경 감지 시 GPUBindGroup 재할당
        if ((this.#lastBoundTexture !== vntTexture.gpuTexture || !this.#bindGroup) && this.#bindGroupLayout && this.#cameraUniformBuffer) {
            this.#lastBoundTexture = vntTexture.gpuTexture;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'VNTDebuggerBindGroup',
                layout: this.#bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: vntTexture.gpuTextureView
                    },
                    {
                        binding: 1,
                        resource: {buffer: this.#cameraUniformBuffer}
                    }
                ]
            });
        }

        if (!this.#pipeline || !this.#bindGroup || !this.#cameraUniformBuffer) return;

        // 카메라 및 지형 파라미터 업데이트 (Zero-GC 버퍼 갱신)
        const {camNormX, camNormZ, worldSizeX, worldSizeZ, effPanRad, fov, loadingRadiusUV} = state;
        const fovRad = (fov * Math.PI) / 180.0;

        // cameraParams Float32Array (8 floats)
        this.#cameraDataArray[0] = camNormX;
        this.#cameraDataArray[1] = camNormZ;
        this.#cameraDataArray[2] = worldSizeX;
        this.#cameraDataArray[3] = worldSizeZ;
        this.#cameraDataArray[4] = effPanRad;
        this.#cameraDataArray[5] = fovRad;
        this.#cameraDataArray[6] = loadingRadiusUV;
        this.#cameraDataArray[7] = 0.0; // padding

        gpuDevice.queue.writeBuffer(this.#cameraUniformBuffer, 0, this.#cameraDataArray.buffer, 0, 32);

        // 1. WebGPU 텍스처 오버레이 렌더링 (60fps GPU Pass)
        let currentTargetView: GPUTextureView;
        try {
            currentTargetView = this.#context.getCurrentTexture().createView();
        } catch {
            return;
        }

        redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const renderPass = commandEncoder.beginRenderPass({
                label: 'LandscapeVNTDebuggerRenderPass',
                colorAttachments: [
                    {
                        view: currentTargetView,
                        clearValue: {r: 0.05, g: 0.08, b: 0.15, a: 1.0},
                        loadOp: 'clear',
                        storeOp: 'store'
                    }
                ]
            });

            renderPass.setPipeline(this.#pipeline);
            renderPass.setBindGroup(0, this.#bindGroup);
            renderPass.draw(6, 1, 0, 0);
            renderPass.end();
        });

        // 2. 2D 오버레이 캔버스 시야각 부채꼴 및 카메라 궤적 드로잉
        const ctx2d = this.canvas.getContext('2d');
        if (ctx2d) {
            this.drawCameraOverlay2D(ctx2d, state, this.width, this.height);

            // "VNT Normal" 라벨
            ctx2d.font = 'bold 9px sans-serif';
            ctx2d.fillStyle = '#38bdf8';
            ctx2d.fillText('VNT (Normal)', 4, 11);
        }
    }

    #initWebGPUContext(): void {
        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        this.#context = this.canvas.getContext('webgpu') as GPUCanvasContext;
        if (!this.#context) return;

        const preferredFormat = navigator.gpu?.getPreferredCanvasFormat?.() || 'bgra8unorm';
        this.#canvasFormat = preferredFormat;

        this.#context.configure({
            device: gpuDevice,
            format: preferredFormat,
            alphaMode: 'premultiplied'
        });

        // Camera Uniform Buffer 생성 (32 bytes)
        this.#cameraUniformBuffer = gpuDevice.createBuffer({
            label: 'VNTDebuggerCameraUniformBuffer',
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        // WGSL 셰이더 소스 (VNT 픽셀 노멀 아틀라스 전용 디버거 WGSL)
        const wgslCode = `
            struct CameraParams {
                camNormX: f32,
                camNormZ: f32,
                worldSizeX: f32,
                worldSizeZ: f32,
                effPanRad: f32,
                fovRad: f32,
                loadingRadiusUV: f32,
                padding: f32,
            }

            @group(0) @binding(0) var vntTexture: texture_2d<f32>;
            @group(0) @binding(1) var<uniform> camera: CameraParams;

            struct VertexOutput {
                @builtin(position) position: vec4<f32>,
                @location(0) uv: vec2<f32>,
            }

            @vertex
            fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
                var pos = array<vec2<f32>, 6>(
                    vec2<f32>(-1.0, -1.0),
                    vec2<f32>( 1.0, -1.0),
                    vec2<f32>(-1.0,  1.0),
                    vec2<f32>(-1.0,  1.0),
                    vec2<f32>( 1.0, -1.0),
                    vec2<f32>( 1.0,  1.0)
                );
                var uv = array<vec2<f32>, 6>(
                    vec2<f32>(0.0, 1.0),
                    vec2<f32>(1.0, 1.0),
                    vec2<f32>(0.0, 0.0),
                    vec2<f32>(0.0, 0.0),
                    vec2<f32>(1.0, 1.0),
                    vec2<f32>(1.0, 0.0)
                );

                var out: VertexOutput;
                out.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
                out.uv = uv[vertexIndex];
                return out;
            }

            @fragment
            fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
                let texDim = vec2<f32>(textureDimensions(vntTexture));
                let texCoord = vec2<i32>(clamp(in.uv * texDim, vec2<f32>(0.0), texDim - vec2<f32>(1.0)));
                let sampleNormal = textureLoad(vntTexture, texCoord, 0).rgb;

                // 타일 경계선 오버레이 (512x512 타일 그리드 디버깅)
                let pixelInTile = vec2<f32>(texCoord % 512);
                let isTileBorder = (pixelInTile.x <= 1.0 || pixelInTile.y <= 1.0 || pixelInTile.x >= 510.0 || pixelInTile.y >= 510.0);

                var finalColor = sampleNormal;
                if (isTileBorder) {
                    finalColor = mix(finalColor, vec3<f32>(0.2, 0.8, 1.0), 0.6);
                }

                return vec4<f32>(finalColor, 0.95);
            }
        `;

        const shaderModule = gpuDevice.createShaderModule({
            label: 'LandscapeVNTDebuggerShaderModule',
            code: wgslCode
        });

        this.#bindGroupLayout = gpuDevice.createBindGroupLayout({
            label: 'VNTDebuggerBindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {
                        sampleType: 'float',
                        viewDimension: '2d'
                    }
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    buffer: {
                        type: 'uniform'
                    }
                }
            ]
        });

        const pipelineLayout = gpuDevice.createPipelineLayout({
            label: 'VNTDebuggerPipelineLayout',
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#pipeline = gpuDevice.createRenderPipeline({
            label: 'LandscapeVNTDebuggerRenderPipeline',
            layout: pipelineLayout,
            vertex: {
                module: shaderModule,
                entryPoint: 'vs_main'
            },
            fragment: {
                module: shaderModule,
                entryPoint: 'fs_main',
                targets: [
                    {
                        format: preferredFormat
                    }
                ]
            },
            primitive: {
                topology: 'triangle-list'
            }
        });
    }
}

export default LandscapeVNTDebugger;
