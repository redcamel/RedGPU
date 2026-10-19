import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import Mesh from "../../../display/mesh/Mesh";
import vertexShaderCode from "./shader/lakeCapturePenetration.wgsl";
import vertexShaderSkinnedCode from "./shader/lakeCapturePenetrationSkinned.wgsl";
import {LakeActiveMeshEntry} from "./LakeInteractionManager";

/**
 * [KO] 상단 직교 투영(Top-down Orthographic Projection)을 통해 활성 메시의 수면 침투 깊이 및 파동 자극 데이터를 `rg16float` 텍스처에 캡처하는 렌더 패스 클래스입니다.
 * [EN] Render pass class that captures water penetration depth and wave impulse data of active meshes into an `rg16float` texture via top-down orthographic projection.
 *
 * [KO] 일반 정적/동적 메시와 스키닝(Skinned) 메시 파이프라인을 모두 지원하며, `Lake` 인스턴스 내부에서 자동으로 생성됩니다.
 * [EN] Supports both standard static/dynamic meshes and skinned mesh pipelines, and is automatically created inside a `Lake` instance.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
class LakeCapturePass extends RedGPUObject {
    /**
     * [KO] 캡처 텍스처의 가로·세로 해상도(픽셀)입니다. (기본값: `512`)
     * [EN] Width and height resolution of the capture texture in pixels. (Default: `512`)
     */
    textureSize: number = 512;

    /**
     * [KO] 침투 깊이 및 속도 자극이 기록되는 `rg16float` 포맷의 `GPUTexture`입니다.
     * [EN] `GPUTexture` in `rg16float` format where penetration depth and velocity impulses are recorded.
     */
    captureTexture: GPUTexture;
    /**
     * [KO] `captureTexture`의 `GPUTextureView`입니다.
     * [EN] `GPUTextureView` of `captureTexture`.
     */
    captureTextureView: GPUTextureView;

    #depthTexture: GPUTexture;
    #depthTextureView: GPUTextureView;

    #shaderModule: GPUShaderModule;
    #pipelineLayout: GPUPipelineLayout;
    #pipelines: Map<number, GPURenderPipeline> = new Map();

    #shaderModuleSkinned: GPUShaderModule;
    #pipelineSkinnedLayout: GPUPipelineLayout;
    #pipelineSkinned: GPURenderPipeline | null = null;

    #globalUniformBuffer: GPUBuffer;
    #globalBindGroup: GPUBindGroup;

    #meshUniformBuffers: GPUBuffer[] = [];
    #meshBindGroups: GPUBindGroup[] = [];
    #meshUniformData: Float32Array = new Float32Array(20);

    #skinnedBindGroups: GPUBindGroup[] = [];
    #skinnedBoundStorageBuffers: (GPUBuffer | null)[] = [];

    #orthoProj: mat4 = mat4.create();
    #topView: mat4 = mat4.create();
    #viewProj: mat4 = mat4.create();
    #globalData: Float32Array = new Float32Array(20);

    #lookAtEye: Float32Array = new Float32Array(3);
    #lookAtCenter: Float32Array = new Float32Array(3);
    #lookAtUp: Float32Array = new Float32Array([0, 0, -1]);

    #renderPassDescriptor: GPURenderPassDescriptor;

    #meshBGL: GPUBindGroupLayout;
    #meshSkinnedBGL: GPUBindGroupLayout;

    /**
     * [KO] `LakeCapturePass` 인스턴스를 생성합니다.
     * [EN] Creates an instance of `LakeCapturePass`.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param textureSize -
     * [KO] 캡처 텍스처 해상도 (기본값: `512`)
     * [EN] Capture texture resolution (default: `512`)
     */
    constructor(redGPUContext: RedGPUContext, textureSize: number = 512) {
        super(redGPUContext);
        this.textureSize = textureSize;

        this.#createTextures();
        this.#initPipelineLayout();
    }

    /**
     * [KO] 활성 메시 목록을 상단 직교 투영으로 렌더링하여 수면 침투 깊이를 캡처 텍스처에 기록합니다.
     * [EN] Renders the active mesh list with top-down orthographic projection to record water penetration depth into the capture texture.
     *
     * @param commandEncoder -
     * [KO] 패스를 기록할 `GPUCommandEncoder`
     * [EN] `GPUCommandEncoder` to record the pass
     * @param activeMeshes -
     * [KO] 수면과 교차 중인 활성 메시 엔트리 배열 (`LakeActiveMeshEntry[]`)
     * [EN] Array of active mesh entries intersecting the water surface (`LakeActiveMeshEntry[]`)
     * @param domainCenterX -
     * [KO] 캡처 도메인 중심 월드 X 좌표
     * [EN] Capture domain center world X coordinate
     * @param domainCenterZ -
     * [KO] 캡처 도메인 중심 월드 Z 좌표
     * [EN] Capture domain center world Z coordinate
     * @param domainSize -
     * [KO] 캡처 도메인의 월드 단위 한 변 크기
     * [EN] Side length of the capture domain in world units
     * @param waterLevel -
     * [KO] 호수 수면의 월드 Y 좌표
     * [EN] World Y coordinate of the lake water surface
     * @param maxPenetration -
     * [KO] 최대 허용 침투 깊이 (기본값: `0.35`)
     * [EN] Maximum allowable penetration depth (default: `0.35`)
     */
    render(
        commandEncoder: GPUCommandEncoder,
        activeMeshes: LakeActiveMeshEntry[],
        domainCenterX: number,
        domainCenterZ: number,
        domainSize: number,
        waterLevel: number,
        maxPenetration: number = 0.35
    ): void {
        const {gpuDevice} = this;
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
        gpuDevice.queue.writeBuffer(this.#globalUniformBuffer, 0, this.#globalData as unknown as BufferSource);

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
                gpuDevice.queue.writeBuffer(buf, 0, this.#meshUniformData as unknown as BufferSource);

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

    /**
     * [KO] 캡처 텍스처, 깊이 텍스처 및 유니폼 버퍼 등 할당된 GPU 리소스를 모두 해제합니다.
     * [EN] Releases all allocated GPU resources including capture texture, depth texture, and uniform buffers.
     */
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
        const {gpuDevice} = this;

        this.captureTexture = gpuDevice.createTexture({
            size: [this.textureSize, this.textureSize, 1],
            format: 'rg16float',
            usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
            label: 'LakeInteraction_CaptureTexture'
        });
        this.captureTextureView = this.captureTexture.createView();

        this.#depthTexture = gpuDevice.createTexture({
            size: [this.textureSize, this.textureSize, 1],
            format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
            label: 'LakeInteraction_CaptureDepthTexture'
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
            label: 'LakeCapture_RenderPass'
        };
    }

    #initPipelineLayout(): void {
        const {gpuDevice} = this;

        this.#shaderModule = gpuDevice.createShaderModule({
            code: vertexShaderCode,
            label: 'LakeCapturePenetrationShader'
        });

        this.#shaderModuleSkinned = gpuDevice.createShaderModule({
            code: vertexShaderSkinnedCode,
            label: 'LakeCapturePenetrationSkinnedShader'
        });

        this.#globalUniformBuffer = gpuDevice.createBuffer({
            size: 96,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
            label: 'LakeCapture_GlobalUniformBuffer'
        });

        const globalBGL = gpuDevice.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {type: 'uniform'}
            }],
            label: 'LakeCapture_GlobalBGL'
        });

        this.#globalBindGroup = gpuDevice.createBindGroup({
            layout: globalBGL,
            entries: [{
                binding: 0,
                resource: {buffer: this.#globalUniformBuffer}
            }],
            label: 'LakeCapture_GlobalBindGroup'
        });

        this.#meshBGL = gpuDevice.createBindGroupLayout({
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
                buffer: {type: 'uniform'}
            }],
            label: 'LakeCapture_MeshBGL'
        });

        this.#pipelineLayout = gpuDevice.createPipelineLayout({
            bindGroupLayouts: [globalBGL, this.#meshBGL],
            label: 'LakeCapture_PipelineLayout'
        });

        this.#meshSkinnedBGL = gpuDevice.createBindGroupLayout({
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
            label: 'LakeCapture_MeshSkinnedBGL'
        });

        this.#pipelineSkinnedLayout = gpuDevice.createPipelineLayout({
            bindGroupLayouts: [globalBGL, this.#meshSkinnedBGL],
            label: 'LakeCapture_PipelineSkinnedLayout'
        });
    }

    #getOrCreatePipeline(stride: number): GPURenderPipeline {
        let pipeline = this.#pipelines.get(stride);
        if (pipeline) return pipeline;

        const {gpuDevice} = this;
        pipeline = gpuDevice.createRenderPipeline({
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
            label: `LakeCapture_RenderPipeline_stride_${stride}`
        });

        this.#pipelines.set(stride, pipeline);
        return pipeline;
    }

    #getOrCreateSkinnedPipeline(): GPURenderPipeline {
        if (this.#pipelineSkinned) return this.#pipelineSkinned;

        const {gpuDevice} = this;
        this.#pipelineSkinned = gpuDevice.createRenderPipeline({
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
            label: 'LakeCapture_RenderPipeline_Skinned'
        });

        return this.#pipelineSkinned;
    }

    #getOrCreateMeshUniformBuffer(index: number): GPUBuffer {
        const {gpuDevice} = this;
        while (index >= this.#meshUniformBuffers.length) {
            const idx = this.#meshUniformBuffers.length;
            const buffer = gpuDevice.createBuffer({
                size: 80,
                usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
                label: `LakeCapture_MeshUniformBuffer_${idx}`
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

        const {gpuDevice} = this;
        const bindGroup = gpuDevice.createBindGroup({
            layout: this.#meshBGL,
            entries: [{
                binding: 0,
                resource: {buffer}
            }],
            label: `LakeCapture_MeshBindGroup_${index}`
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

        const {gpuDevice} = this;
        const bindGroup = gpuDevice.createBindGroup({
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
            label: `LakeCapture_MeshSkinnedBindGroup_${index}`
        });

        this.#skinnedBindGroups[index] = bindGroup;
        this.#skinnedBoundStorageBuffers[index] = storageBuffer;
        return bindGroup;
    }

    #fillMeshUniformData(mesh: Mesh, entry: LakeActiveMeshEntry): void {
        this.#meshUniformData.set(mesh.modelMatrix, 0);
        this.#meshUniformData[16] = entry.waveStrength;
        this.#meshUniformData[17] = entry.speed;
        this.#meshUniformData[18] = entry.stepPulse;
        this.#meshUniformData[19] = entry.footSide;
    }
}

Object.freeze(LakeCapturePass);
export default LakeCapturePass;

