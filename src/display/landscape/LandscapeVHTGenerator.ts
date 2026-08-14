import RedGPUContext from "../../context/RedGPUContext";
import DirectTexture from "../../resources/texture/DirectTexture";
import vhtShaderCode from "./shader/landscapeVHTBake.wgsl";
import {COMMAND_ENCODER_TYPE} from "../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 16비트 고도맵 타일 텍스처로부터 GPU Compute Shader 기반 r32float VHT (Virtual Heightfield Texture) 아틀라스로 고도를 베이킹하는 매니저 클래스입니다.
 * [EN] Manager class that bakes height values into r32float VHT (Virtual Heightfield Texture) Atlas based on GPU Compute Shader from 16-bit heightmap tile texture.
 */
export class LandscapeVHTGenerator {
    #redGPUContext: RedGPUContext;
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformArray: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#uniformArray = new Uint32Array(4); // targetX, targetZ, width, height (16 bytes)
        this.#initComputeResources();
    }

    /**
     * [KO] 단일 타일 GPU 텍스처 데이터를 GPU Compute Pass를 실행하여 r32float VHT 아틀라스 텍스처의 [pixelX, pixelZ] 영역에 베이킹합니다 (Zero-GC).
     */
    bakeTileRegion(
        srcTileTexture: GPUTexture,
        vhtAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number
    ): void {
        if (!this.#computePipeline || !this.#bindGroupLayout) return;
        if (!srcTileTexture || !vhtAtlas?.gpuTexture) return;

        const device = this.#redGPUContext.gpuDevice;

        const arr = this.#uniformArray;
        arr[0] = pixelX;
        arr[1] = pixelZ;
        arr[2] = pixelW;
        arr[3] = pixelH;

        const uniformBuffer = device.createBuffer({
            label: `LandscapeVHTBake_UniformBuffer_[${pixelX},${pixelZ}]`,
            size: 16,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, 16);

        const srcView = srcTileTexture.createView();
        const bindGroup = device.createBindGroup({
            label: `LandscapeVHTBake_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.#bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: srcView
                },
                {
                    binding: 1,
                    resource: vhtAtlas.gpuTextureView
                },
                {
                    binding: 2,
                    resource: {buffer: uniformBuffer}
                }
            ]
        });

        const workgroupCountX = Math.ceil(pixelW / 16);
        const workgroupCountY = Math.ceil(pixelH / 16);

        this.#redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `LandscapeVHTBakeComputePass_[${pixelX},${pixelZ}]`
            });
            pass.setPipeline(this.#computePipeline);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
            pass.end();
        });

        console.log(`[LandscapeVHTGenerator ⚡] GPU Compute r32float VHT Height Bake executed for region [${pixelX}, ${pixelZ}, ${pixelW}x${pixelH}]`);
    }

    #initComputeResources(): void {
        const device = this.#redGPUContext.gpuDevice;
        const resourceManager = this.#redGPUContext.resourceManager;

        let shaderModule = resourceManager.getGPUShaderModule('LandscapeVHTBakeComputeShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('LandscapeVHTBakeComputeShaderModule', {
                code: vhtShaderCode
            });
        }

        this.#bindGroupLayout = device.createBindGroupLayout({
            label: 'LandscapeVHTBake_BindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'unfilterable-float', viewDimension: '2d'}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'r32float', viewDimension: '2d'}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'uniform'}
                }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'LandscapeVHTBake_PipelineLayout',
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = device.createComputePipeline({
            label: 'LandscapeVHTBake_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });
    }
}

export default LandscapeVHTGenerator;
