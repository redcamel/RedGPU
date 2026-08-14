import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "./ALandscapeDebugger";
import Landscape from "./Landscape";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] Landscape 지형 시스템의 16비트 VHT (Virtual Heightfield Texture) 아틀라스 텍스처와 카메라 시선/FOV/로딩반경을 WebGPU Canvas 60fps 오버레이로 시각화하는 디버거 클래스입니다 (ALandscapeDebugger 기반 GPU-Native).
 * [EN] Debugger class visualizing the 16-bit VHT (Virtual Heightfield Texture) atlas texture, camera view direction, FOV, and loading radius of Landscape terrain system via WebGPU Canvas 60fps overlay (ALandscapeDebugger based GPU-Native).
 */
export class LandscapeVHTDebugger extends ALandscapeDebugger {
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

        const left = opts?.left ?? 120;
        super(landscape, cameraOrOptions, {...opts, left});
        this.#initWebGPUContext();
    }

    update(): void {
        if (!this.visible || !this.#context) return;

        const state = this.getCameraState();
        if (!state) return;

        const redGPUContext = (this.landscape as any)?.redGPUContext;
        const gpuDevice: GPUDevice = redGPUContext?.gpuDevice;
        if (!gpuDevice) return;

        const vhtTexture = this.landscape.vhtAtlasTexture;
        if (!vhtTexture) return;

        // 지형 텍스처 변경 감지 시 GPUBindGroup 재할당
        if ((this.#lastBoundTexture !== vhtTexture || !this.#bindGroup) && this.#bindGroupLayout && this.#cameraUniformBuffer) {
            this.#lastBoundTexture = vhtTexture;
            this.#bindGroup = gpuDevice.createBindGroup({
                label: 'VHTDebuggerBindGroup',
                layout: this.#bindGroupLayout,
                entries: [
                    {
                        binding: 0,
                        resource: vhtTexture.createView()
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
        this.#cameraDataArray[7] = 0.0;

        gpuDevice.queue.writeBuffer(this.#cameraUniformBuffer, 0, this.#cameraDataArray.buffer as ArrayBuffer);

        try {
            const currentTexture = this.#context.getCurrentTexture();
            if (!currentTexture) return;

            this.landscape.redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
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
            });
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

        // 카메라 유니폼 버퍼 생성 (32 bytes)
        this.#cameraUniformBuffer = gpuDevice.createBuffer({
            label: 'VHTDebuggerCameraUniformBuffer',
            size: 32,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });

        // VHT 프리뷰어 전용 바인드 그룹 레이아웃 (@binding(0): VHT texture, @binding(1): CameraParams)
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
        this.#bindGroupLayout = bindGroupLayout;

        // VHT 렌더 셰이더 모듈 (GPU-Native 카메라 FOV & 시선 표출)
        const shaderModule = gpuDevice.createShaderModule({
            label: 'VHTDebuggerShaderModule',
            code: `
                struct VertexOutput {
                    @builtin(position) position: vec4<f32>,
                    @location(0) uv: vec2<f32>,
                };

                struct CameraParams {
                    camUV: vec2<f32>,
                    worldSize: vec2<f32>,
                    panFovRadius: vec4<f32>,
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
                @group(0) @binding(1) var<uniform> camera: CameraParams;

                @fragment
                fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
                    let texSize = vec2<f32>(textureDimensions(vhtTexture));
                    let texCoord = vec2<i32>(clamp(in.uv * texSize, vec2<f32>(0.0), texSize - vec2<f32>(1.0)));
                    let h = textureLoad(vhtTexture, texCoord, 0).r;
                    
                    // 1. 타일 경계선 그리드 (8x8 아틀라스 셀)
                    let tileGrid = step(vec2<f32>(0.98), fract(in.uv * 8.0));
                    let isGrid = max(tileGrid.x, tileGrid.y);
                    var baseColor = mix(vec3<f32>(h, h * 0.9 + 0.1, h * 0.8), vec3<f32>(0.22, 0.74, 0.97), isGrid * 0.6);

                    // 2. 카메라 시야/FOV/시선/로딩반경 픽셀 오버레이
                    let camUV = camera.camUV;
                    let diff = in.uv - camUV;
                    let distUV = length(diff);

                    let radiusUV = camera.panFovRadius.z;
                    let panRad = camera.panFovRadius.x;
                    let halfFovRad = camera.panFovRadius.y * 0.5;

                    // 로딩 반경 점선 링 (Emerald Green)
                    let ringDist = abs(distUV - radiusUV);
                    if (ringDist < 0.007 && distUV <= radiusUV + 0.007) {
                        let angleDash = sin(atan2(diff.y, diff.x) * 24.0);
                        if (angleDash > 0.0) {
                            baseColor = mix(baseColor, vec3<f32>(0.2, 0.83, 0.6), 0.85);
                        }
                    }

                    // FOV 시야 부채꼴 (Amber Gold)
                    let centerRad = atan2(-cos(panRad), sin(panRad));
                    let pixelAngle = atan2(diff.y, diff.x);
                    let angleDiff = abs(atan2(sin(pixelAngle - centerRad), cos(pixelAngle - centerRad)));

                    let maxWedgeRadius = min(radiusUV, 0.28);
                    if (distUV < maxWedgeRadius && angleDiff < halfFovRad) {
                        baseColor = mix(baseColor, vec3<f32>(0.98, 0.75, 0.14), 0.45);
                    }

                    // 시선 중심 가이드 레이 (Coral Red)
                    if (distUV < maxWedgeRadius + 0.06 && angleDiff < 0.02) {
                        baseColor = mix(baseColor, vec3<f32>(0.93, 0.27, 0.27), 0.95);
                    }

                    // 카메라 원점 점 (White Dot with Coral Red Ring)
                    if (distUV < 0.014) {
                        if (distUV < 0.008) {
                            baseColor = vec3<f32>(1.0, 1.0, 1.0);
                        } else {
                            baseColor = vec3<f32>(0.93, 0.27, 0.27);
                        }
                    }

                    return vec4<f32>(baseColor, 1.0);
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

    override destroy(): void {
        super.destroy();
        if (this.#cameraUniformBuffer) {
            this.#cameraUniformBuffer.destroy();
            this.#cameraUniformBuffer = null;
        }
    }
}

export default LandscapeVHTDebugger;
