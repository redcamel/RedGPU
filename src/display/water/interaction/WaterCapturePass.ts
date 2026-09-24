import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../mesh/Mesh";
import vertexShaderCode from "./shader/waterCapturePenetration.wgsl";
import vertexShaderSkinnedCode from "./shader/waterCapturePenetrationSkinned.wgsl";
import {WaterActiveMeshEntry} from "./WaterInteractionManager";

export class WaterCapturePass {
    readonly redGPUContext: RedGPUContext;
    readonly textureSize: number = 512;

    captureTexture: GPUTexture;
    captureTextureView: GPUTextureView;

    #depthTexture: GPUTexture;
    #depthTextureView: GPUTextureView;

    #shaderModule: GPUShaderModule;
    #pipelineLayout: GPUPipelineLayout;
    readonly #pipelines: Map<number, GPURenderPipeline> = new Map();

    #shaderModuleSkinned: GPUShaderModule;
    #pipelineSkinnedLayout: GPUPipelineLayout;
    #pipelineSkinned: GPURenderPipeline | null = null;

    #globalUniformBuffer: GPUBuffer;
    #globalBindGroup: GPUBindGroup;

    readonly #meshUniformBuffers: GPUBuffer[] = [];
    readonly #meshBindGroups: GPUBindGroup[] = [];
    readonly #meshUniformData: Float32Array = new Float32Array(20);

    readonly #skinnedBindGroups: GPUBindGroup[] = [];
    readonly #skinnedBoundStorageBuffers: (GPUBuffer | null)[] = [];

    readonly #orthoProj: mat4 = mat4.create();
    readonly #topView: mat4 = mat4.create();
    readonly #viewProj: mat4 = mat4.create();
    readonly #globalData: Float32Array = new Float32Array(20);

    readonly #lookAtEye: Float32Array = new Float32Array(3);
    readonly #lookAtCenter: Float32Array = new Float32Array(3);
    readonly #lookAtUp: Float32Array = new Float32Array([0, 0, -1]);

    #renderPassDescriptor: GPURenderPassDescriptor;

    #meshBGL: GPUBindGroupLayout;
    #meshSkinnedBGL: GPUBindGroupLayout;

    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        this.redGPUContext = redGPUContext;
        this.textureSize = textureSize;

        this.#createTextures();
        this.#initPipelineLayout();
    }

    render(
        commandEncoder: GPUCommandEncoder,
        activeMeshes: WaterActiveMeshEntry[],
        domainCenterX: number,
        domainCenterZ: number,
        domainSize: number,
        waterLevel: number,
        maxPenetration: number = 0.35
    ): void {
        const device = this.redGPUContext.gpuDevice;
        const halfSize = domainSize * 0.5;

        mat4.ortho(this.#orthoProj, -halfSize, halfSize, -halfSize, halfSize, 0.1, 20.0);
        const eye = this.#lookAtEye;
        eye[0] = domainCenterX;
        eye[1] = waterLevel + 10.0;
        eye[2] = domainCenterZ;

        const center = this.#lookAtCenter;
        center[0] = domainCenterX;
        center[1] = waterLevel;
        center[2] = domainCenterZ;

        mat4.lookAt(this.#topView, eye, center, this.#lookAtUp);
        mat4.multiply(this.#viewProj, this.#orthoProj, this.#topView);

        this.#globalData.set(this.#viewProj, 0);
        this.#globalData[16] = waterLevel;
        this.#globalData[17] = maxPenetration;
        this.#globalData[18] = 0;
        this.#globalData[19] = 0;
        device.queue.writeBuffer(this.#globalUniformBuffer, 0, this.#globalData as unknown as BufferSource);

        const passEncoder = commandEncoder.beginRenderPass(this.#renderPassDescriptor);

        if (activeMeshes.length > 0) {
            passEncoder.setBindGroup(0, this.#globalBindGroup);

            let lastPipeline: GPURenderPipeline | null = null;
            const meshCount = activeMeshes.length;

            for (let i = 0; i < meshCount; i++) {
                const entry = activeMeshes[i];
                const mesh = entry.mesh;
                const geom = mesh.geometry;
                if (!geom || !geom.vertexBuffer || !geom.indexBuffer) continue;

                const skinInfo = mesh.animationInfo?.skinInfo;
                const storageBuffer = skinInfo?.vertexStorageBuffer;
                const isSkinned = !!storageBuffer;

                const buf = this.#getOrCreateMeshUniformBuffer(i);
                this.#fillMeshUniformData(mesh, entry);
                device.queue.writeBuffer(buf, 0, this.#meshUniformData as unknown as BufferSource);

                if (isSkinned) {
                    const pipeline = this.#getOrCreateSkinnedPipeline();
                    if (pipeline !== lastPipeline) {
                        passEncoder.setPipeline(pipeline);
                        lastPipeline = pipeline;
                    }

                    const bg = this.#getOrCreateSkinnedMeshBindGroup(i, storageBuffer);
                    passEncoder.setBindGroup(1, bg);
                    passEncoder.setIndexBuffer(geom.indexBuffer.gpuBuffer, geom.indexBuffer.format);
                    passEncoder.drawIndexed(geom.indexBuffer.indexCount);
                } else {
                    const stride = geom.vertexBuffer.interleavedStruct?.arrayStride || 32;
                    const pipeline = this.#getOrCreatePipeline(stride);
                    if (pipeline !== lastPipeline) {
                        passEncoder.setPipeline(pipeline);
                        lastPipeline = pipeline;
                    }

                    const bg = this.#getOrCreateMeshBindGroup(i);
                    passEncoder.setBindGroup(1, bg);
                    passEncoder.setVertexBuffer(0, geom.vertexBuffer.gpuBuffer);
                    passEncoder.setIndexBuffer(geom.indexBuffer.gpuBuffer, geom.indexBuffer.format);
                    passEncoder.drawIndexed(geom.indexBuffer.indexCount);
                }
            }
        }

        passEncoder.end();
    }

    destroy(): void {
        if (this.captureTexture) {
            this.captureTexture.destroy();
        }
        if (this.#depthTexture) {
            this.#depthTexture.destroy();
        }
        if (this.#globalUniformBuffer) {
            this.#globalUniformBuffer.destroy();
        }
        for (const buf of this.#meshUniformBuffers) {
            buf.destroy();
        }
        this.#meshUniformBuffers.length = 0;
        this.#meshBindGroups.length = 0;
        this.#skinnedBindGroups.length = 0;
        this.#skinnedBoundStorageBuffers.length = 0;
        this.#pipelines.clear();
        this.#pipelineSkinned = null;
    }

    #createTextures(): void {
        const device = this.redGPUContext.gpuDevice;

        this.captureTexture = device.createTexture({
            size: [this.textureSize, this.textureSize, 1],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            label: 'WaterInteraction_CaptureTexture'
        });
        this.captureTextureView = this.captureTexture.createView();

        this.#depthTexture = device.createTexture({
            size: [this.textureSize, this.textureSize, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'WaterInteraction_CaptureDepthTexture'
        });
        this.#depthTextureView = this.#depthTexture.createView();

        this.#renderPassDescriptor = {
            colorAttachments: [{
                view: this.captureTextureView,
                clearValue: {r: 0, g: 0, b: 0, a: 0},
                loadOp: 'clear',
                storeOp: 'store'
            }],
            depthStencilAttachment: {
                view: this.#depthTextureView,
                depthClearValue: 1.0,
                depthLoadOp: 'clear',
                depthStoreOp: 'discard'
            },
            label: 'WaterCapture_RenderPass'
        };
    }

    #initPipelineLayout(): void {
        const device = this.redGPUContext.gpuDevice;

        this.#shaderModule = device.createShaderModule({
            code: vertexShaderCode,
            label: 'WaterCapturePenetrationShader'
        });

        this.#shaderModuleSkinned = device.createShaderModule({
            code: vertexShaderSkinnedCode,
            label: 'WaterCapturePenetrationSkinnedShader'
        });

        this.#globalUniformBuffer = device.createBuffer({
            size: 96,
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

        this.#globalBindGroup = device.createBindGroup({
            layout: globalBGL,
            entries: [{
                binding: 0,
                resource: {buffer: this.#globalUniformBuffer}
            }],
            label: 'WaterCapture_GlobalBindGroup'
        });

        this.#meshBGL = device.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {type: 'uniform'}
            }],
            label: 'WaterCapture_MeshBGL'
        });

        this.#pipelineLayout = device.createPipelineLayout({
            bindGroupLayouts: [globalBGL, this.#meshBGL],
            label: 'WaterCapture_PipelineLayout'
        });

        this.#meshSkinnedBGL = device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                    buffer: {type: 'uniform'}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.VERTEX,
                    buffer: {type: 'read-only-storage'}
                }
            ],
            label: 'WaterCapture_MeshSkinnedBGL'
        });

        this.#pipelineSkinnedLayout = device.createPipelineLayout({
            bindGroupLayouts: [globalBGL, this.#meshSkinnedBGL],
            label: 'WaterCapture_PipelineSkinnedLayout'
        });
    }

    #getOrCreatePipeline(stride: number): GPURenderPipeline {
        let pipeline = this.#pipelines.get(stride);
        if (pipeline) return pipeline;

        const device = this.redGPUContext.gpuDevice;
        pipeline = device.createRenderPipeline({
            layout: this.#pipelineLayout,
            vertex: {
                module: this.#shaderModule,
                entryPoint: 'vs_main',
                buffers: [{
                    arrayStride: stride,
                    attributes: [{
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3'
                    }]
                }]
            },
            fragment: {
                module: this.#shaderModule,
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

        this.#pipelines.set(stride, pipeline);
        return pipeline;
    }

    #getOrCreateSkinnedPipeline(): GPURenderPipeline {
        if (this.#pipelineSkinned) return this.#pipelineSkinned;

        const device = this.redGPUContext.gpuDevice;
        this.#pipelineSkinned = device.createRenderPipeline({
            layout: this.#pipelineSkinnedLayout,
            vertex: {
                module: this.#shaderModuleSkinned,
                entryPoint: 'vs_main',
                buffers: []
            },
            fragment: {
                module: this.#shaderModuleSkinned,
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
            label: 'WaterCapture_RenderPipeline_Skinned'
        });

        return this.#pipelineSkinned;
    }

    #getOrCreateMeshUniformBuffer(index: number): GPUBuffer {
        const device = this.redGPUContext.gpuDevice;
        while (index >= this.#meshUniformBuffers.length) {
            const idx = this.#meshUniformBuffers.length;
            const buffer = device.createBuffer({
                size: 80,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                label: `WaterCapture_MeshUniformBuffer_${idx}`
            });
            this.#meshUniformBuffers.push(buffer);
        }
        return this.#meshUniformBuffers[index];
    }

    #getOrCreateMeshBindGroup(index: number): GPUBindGroup {
        const buffer = this.#getOrCreateMeshUniformBuffer(index);

        if (index < this.#meshBindGroups.length && this.#meshBindGroups[index]) {
            return this.#meshBindGroups[index];
        }

        const device = this.redGPUContext.gpuDevice;
        const bindGroup = device.createBindGroup({
            layout: this.#meshBGL,
            entries: [{
                binding: 0,
                resource: {buffer}
            }],
            label: `WaterCapture_MeshBindGroup_${index}`
        });

        this.#meshBindGroups[index] = bindGroup;
        return bindGroup;
    }

    #getOrCreateSkinnedMeshBindGroup(index: number, storageBuffer: GPUBuffer): GPUBindGroup {
        const uniformBuffer = this.#getOrCreateMeshUniformBuffer(index);

        if (
            index < this.#skinnedBindGroups.length &&
            this.#skinnedBindGroups[index] &&
            this.#skinnedBoundStorageBuffers[index] === storageBuffer
        ) {
            return this.#skinnedBindGroups[index];
        }

        const device = this.redGPUContext.gpuDevice;
        const bindGroup = device.createBindGroup({
            layout: this.#meshSkinnedBGL,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: uniformBuffer}
                },
                {
                    binding: 1,
                    resource: {buffer: storageBuffer}
                }
            ],
            label: `WaterCapture_MeshSkinnedBindGroup_${index}`
        });

        this.#skinnedBindGroups[index] = bindGroup;
        this.#skinnedBoundStorageBuffers[index] = storageBuffer;
        return bindGroup;
    }

    #fillMeshUniformData(mesh: Mesh, entry: WaterActiveMeshEntry): void {
        this.#meshUniformData.set(mesh.modelMatrix, 0);
        this.#meshUniformData[16] = entry.waveStrength;
        this.#meshUniformData[17] = entry.speed;
        this.#meshUniformData[18] = entry.stepPulse;
        this.#meshUniformData[19] = entry.footSide;
    }
}
