import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import vertexShaderCode from "./shader/waterCapturePenetration.wgsl";
import {WaterActiveMeshEntry} from "./WaterInteractionManager";

/**
 * [KO] 탑뷰(Top-down) 직교 투영 침수 깊이 및 속도 캡처 패스
 * [EN] Top-down orthographic penetration depth and velocity capture pass
 */
export class WaterCapturePass {
    readonly redGPUContext: RedGPUContext;
    readonly textureSize: number = 512;

    captureTexture: GPUTexture;
    captureTextureView: GPUTextureView;

    private _depthTexture: GPUTexture;
    private _depthTextureView: GPUTextureView;

    private _shaderModule: GPUShaderModule;
    private _pipelineLayout: GPUPipelineLayout;
    private readonly _pipelines: Map<number, GPURenderPipeline> = new Map();

    private _globalUniformBuffer: GPUBuffer;
    private _globalBindGroup: GPUBindGroup;

    // 메쉬별 유니폼 버퍼 풀 (GC 0바이트)
    private _meshUniformBuffers: GPUBuffer[] = [];
    private _meshBindGroups: GPUBindGroup[] = [];
    private readonly _meshUniformData: Float32Array = new Float32Array(24); // 16(mat4) + 8(uniforms) = 96 bytes

    // 행렬 캐시 (GC 0바이트)
    private readonly _orthoProj: mat4 = mat4.create();
    private readonly _topView: mat4 = mat4.create();
    private readonly _viewProj: mat4 = mat4.create();
    private readonly _globalData: Float32Array = new Float32Array(20);

    private _meshBGL: GPUBindGroupLayout;

    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        this.redGPUContext = redGPUContext;
        this.textureSize = textureSize;

        this._createTextures();
        this._initPipelineLayout();
    }

    /**
     * [KO] 활성 메쉬들을 탑뷰 오쏘그래픽으로 렌더링하여 침수 깊이/속도를 캡처합니다.
     * [EN] Renders active meshes via top-down orthographic view to capture penetration depth/velocity.
     */
    render(
        commandEncoder: GPUCommandEncoder,
        activeMeshes: WaterActiveMeshEntry[],
        domainCenterX: number,
        domainCenterZ: number,
        domainSize: number,
        waterLevel: number,
        maxPenetration: number = 1.5
    ): void {
        const device = this.redGPUContext.gpuDevice;
        const halfSize = domainSize * 0.5;

        // 1. 탑뷰 직교 투영 행렬 구성
        mat4.ortho(this._orthoProj, -halfSize, halfSize, -halfSize, halfSize, 0.1, 20.0);
        // 위(waterLevel + 10)에서 아래(waterLevel)를 내려다봄
        mat4.lookAt(
            this._topView,
            [domainCenterX, waterLevel + 10.0, domainCenterZ],
            [domainCenterX, waterLevel, domainCenterZ],
            [0, 0, -1] // 상향 벡터: -Z (화면 상단이 북쪽)
        );
        mat4.multiply(this._viewProj, this._orthoProj, this._topView);

        // 2. 글로벌 유니폼 버퍼 쓰기
        this._globalData.set(this._viewProj, 0);
        this._globalData[16] = waterLevel;
        this._globalData[17] = maxPenetration;
        this._globalData[18] = 0;
        this._globalData[19] = 0;
        device.queue.writeBuffer(this._globalUniformBuffer, 0, this._globalData as unknown as BufferSource);

        // 3. 렌더 패스 인코딩
        const passEncoder = commandEncoder.beginRenderPass({
            colorAttachments: [{
                view: this.captureTextureView,
                clearValue: {r: 0, g: 0, b: 0, a: 0},
                loadOp: 'clear',
                storeOp: 'store'
            }],
            depthStencilAttachment: {
                view: this._depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard'
            },
            label: 'WaterCapture_RenderPass'
        });

        if (activeMeshes.length > 0) {
            passEncoder.setBindGroup(0, this._globalBindGroup);

            let lastPipeline: GPURenderPipeline | null = null;
            const meshCount = activeMeshes.length;

            for (let i = 0; i < meshCount; i++) {
                const entry = activeMeshes[i];
                const mesh = entry.mesh;
                const geom = mesh.geometry;
                if (!geom || !geom.vertexBuffer || !geom.indexBuffer) continue;

                const stride = geom.vertexBuffer.interleavedStruct?.arrayStride || 32;
                const pipeline = this._getOrCreatePipeline(stride);
                if (pipeline !== lastPipeline) {
                    passEncoder.setPipeline(pipeline);
                    lastPipeline = pipeline;
                }

                const bg = this._getOrCreateMeshBindGroup(i);
                const buf = this._meshUniformBuffers[i];

                // 메쉬 유니폼 채우기 (발자국 첨벙임 펄스 및 좌우 발 정보 포함)
                this._meshUniformData.set(mesh.modelMatrix, 0);
                this._meshUniformData[16] = entry.waveStrength;
                this._meshUniformData[17] = entry.foamGeneration;
                this._meshUniformData[18] = entry.speed;
                this._meshUniformData[19] = entry.stepPulse;
                this._meshUniformData[20] = entry.footSide;
                this._meshUniformData[21] = 0;
                this._meshUniformData[22] = 0;
                this._meshUniformData[23] = 0;
                device.queue.writeBuffer(buf, 0, this._meshUniformData as unknown as BufferSource);

                passEncoder.setBindGroup(1, bg);
                passEncoder.setVertexBuffer(0, geom.vertexBuffer.gpuBuffer);
                passEncoder.setIndexBuffer(geom.indexBuffer.gpuBuffer, geom.indexBuffer.format);
                passEncoder.drawIndexed(geom.indexBuffer.indexCount);
            }
        }

        passEncoder.end();
    }

    destroy(): void {
        if (this.captureTexture) {
            this.captureTexture.destroy();
        }
        if (this._depthTexture) {
            this._depthTexture.destroy();
        }
        if (this._globalUniformBuffer) {
            this._globalUniformBuffer.destroy();
        }
        for (const buf of this._meshUniformBuffers) {
            buf.destroy();
        }
    }

    private _createTextures(): void {
        const device = this.redGPUContext.gpuDevice;

        this.captureTexture = device.createTexture({
            size: [this.textureSize, this.textureSize, 1],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            label: 'WaterInteraction_CaptureTexture'
        });
        this.captureTextureView = this.captureTexture.createView();

        this._depthTexture = device.createTexture({
            size: [this.textureSize, this.textureSize, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'WaterInteraction_CaptureDepthTexture'
        });
        this._depthTextureView = this._depthTexture.createView();
    }

    private _initPipelineLayout(): void {
        const device = this.redGPUContext.gpuDevice;

        this._shaderModule = device.createShaderModule({
            code: vertexShaderCode,
            label: 'WaterCapturePenetrationShader'
        });

        this._globalUniformBuffer = device.createBuffer({
            size: 96, // 80 rounded to 16-byte alignment
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: 'WaterCapture_GlobalUniformBuffer'
        });

        const globalBGL = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {type: 'uniform'}
            }],
            label: 'WaterCapture_GlobalBGL'
        });

        this._globalBindGroup = device.createBindGroup({
            layout: globalBGL,
            entries: [{
                binding: 0,
                resource: {buffer: this._globalUniformBuffer}
            }],
            label: 'WaterCapture_GlobalBindGroup'
        });

        this._meshBGL = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {type: 'uniform'}
            }],
            label: 'WaterCapture_MeshBGL'
        });

        this._pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [globalBGL, this._meshBGL],
            label: 'WaterCapture_PipelineLayout'
        });
    }

    private _getOrCreatePipeline(stride: number): GPURenderPipeline {
        let pipeline = this._pipelines.get(stride);
        if (pipeline) return pipeline;

        const device = this.redGPUContext.gpuDevice;
        pipeline = device.createRenderPipeline({
            layout: this._pipelineLayout,
            vertex: {
                module: this._shaderModule,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: stride,
                    attributes: [{
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3' // position은 모든 interleaved 정점의 첫 번째(offset 0)
                    }]
                }]
            },
            fragment: {
                module: this._shaderModule,
                entryPoint: 'fs_main',
                targets: [{
                    format: 'rg16float',
                    blend: {
                        color: {
                            srcFactor: 'one',
                            dstFactor: 'one',
                            operation: 'add'
                        },
                        alpha: {
                            srcFactor: 'one',
                            dstFactor: 'one',
                            operation: 'add'
                        }
                    }
                }]
            },
            primitive: {
                topology: 'triangle-list',
                cullMode: 'none'
            },
            depthStencil: {
                format: 'depth24plus',
                depthWriteEnabled: true,
                depthCompare: 'less-equal'
            },
            label: `WaterCapture_RenderPipeline_stride_${stride}`
        });

        this._pipelines.set(stride, pipeline);
        return pipeline;
    }

    private _getOrCreateMeshBindGroup(index: number): GPUBindGroup {
        const device = this.redGPUContext.gpuDevice;

        if (index < this._meshBindGroups.length) {
            return this._meshBindGroups[index];
        }

        const buffer = device.createBuffer({
            size: 96, // mat4(64) + 2 vec4s(32) = 96 bytes (16-byte aligned)
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: `WaterCapture_MeshUniformBuffer_${index}`
        });

        const bindGroup = device.createBindGroup({
            layout: this._meshBGL,
            entries: [{
                binding: 0,
                resource: {buffer}
            }],
            label: `WaterCapture_MeshBindGroup_${index}`
        });

        this._meshUniformBuffers.push(buffer);
        this._meshBindGroups.push(bindGroup);

        return bindGroup;
    }
}
