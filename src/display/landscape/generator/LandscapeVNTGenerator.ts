import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vntBakeShaderCode from "../shader/landscapeVNTBake.wgsl";
import {COMMAND_ENCODER_TYPE} from "../../../commandEncoderManager/COMMAND_ENCODER_TYPE";

/**
 * [KO] 16비트 고도맵 VHT 아틀라스로부터 GPU Compute Shader 기반 실시간 픽셀 노멀 VNT 아틀라스를 베이킹하는 매니저 클래스입니다.
 * [EN] Manager class that bakes real-time pixel normal VNT Atlas based on GPU Compute Shader from 16-bit Heightmap VHT Atlas.
 */
export class LandscapeVNTGenerator {
    #redGPUContext: RedGPUContext;
    #computePipeline: GPUComputePipeline | null = null;
    #bindGroupLayout: GPUBindGroupLayout | null = null;
    #uniformBuffer: GPUBuffer | null = null;
    #uniformArray: Float32Array;

    constructor(redGPUContext: RedGPUContext) {
        this.#redGPUContext = redGPUContext;
        this.#uniformArray = new Float32Array(12); // 48 bytes for VNTBakeUniforms struct
        this.#initComputeResources();
    }

    bakeTileRegion(
        vhtAtlas: DirectTexture,
        vntAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number,
        heightScale: number,
        worldSizeX: number,
        componentCountX: number
    ): void {
        if (!this.#computePipeline || !this.#bindGroupLayout) return;
        if (!vhtAtlas?.gpuTexture || !vntAtlas?.gpuTexture) return;

        const device = this.#redGPUContext.gpuDevice;
        const atlasW = vhtAtlas.gpuTexture.width;
        const atlasH = vhtAtlas.gpuTexture.height;

        const texelWorldSize = worldSizeX / (componentCountX * 512);

        const bakeX = Math.max(0, pixelX - 1);
        const bakeZ = Math.max(0, pixelZ - 1);
        const bakeW = Math.min(atlasW - bakeX, pixelW + (pixelX > 0 ? 2 : 1));
        const bakeH = Math.min(atlasH - bakeZ, pixelH + (pixelZ > 0 ? 2 : 1));

        const arr = this.#uniformArray;
        arr[0] = bakeX;
        arr[1] = bakeZ;
        arr[2] = bakeW;
        arr[3] = bakeH;

        arr[4] = atlasW;
        arr[5] = atlasH;
        arr[6] = heightScale;
        arr[7] = texelWorldSize;

        const uniformBuffer = device.createBuffer({
            label: `LandscapeVNTBake_UniformBuffer_[${bakeX},${bakeZ}]`,
            size: 48,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
        device.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, 48);

        const bindGroup = device.createBindGroup({
            label: 'LandscapeVNTBake_BindGroup',
            layout: this.#bindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: {buffer: uniformBuffer}
                },
                {
                    binding: 1,
                    resource: vhtAtlas.gpuTextureView
                },
                {
                    binding: 2,
                    resource: vntAtlas.gpuTextureView
                }
            ]
        });

        const workgroupCountX = Math.ceil(bakeW / 16);
        const workgroupCountY = Math.ceil(bakeH / 16);

        this.#redGPUContext.commandEncoderManager.useEncoder(COMMAND_ENCODER_TYPE.RESOURCE, (commandEncoder) => {
            const pass = commandEncoder.beginComputePass({
                label: `LandscapeVNTBakeComputePass_[${pixelX},${pixelZ}]`
            });
            pass.setPipeline(this.#computePipeline);
            pass.setBindGroup(0, bindGroup);
            pass.dispatchWorkgroups(workgroupCountX, workgroupCountY);
            pass.end();
        });

        console.log(`[LandscapeVNTGenerator 🌀] GPU VNT Normal Bake executed for region [${pixelX}, ${pixelZ}, ${pixelW}x${pixelH}]`);
    }

    #initComputeResources(): void {
        const device = this.#redGPUContext.gpuDevice;
        const resourceManager = this.#redGPUContext.resourceManager;

        let shaderModule = resourceManager.getGPUShaderModule('LandscapeVNTBakeComputeShaderModule');
        if (!shaderModule) {
            shaderModule = resourceManager.createGPUShaderModule('LandscapeVNTBakeComputeShaderModule', {
                code: vntBakeShaderCode
            });
        }

        this.#bindGroupLayout = device.createBindGroupLayout({
            label: 'LandscapeVNTBake_BindGroupLayout',
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.COMPUTE,
                    buffer: {type: 'uniform'}
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.COMPUTE,
                    texture: {sampleType: 'unfilterable-float', viewDimension: '2d'}
                },
                {
                    binding: 2,
                    visibility: GPUShaderStage.COMPUTE,
                    storageTexture: {access: 'write-only', format: 'rgba8unorm', viewDimension: '2d'}
                }
            ]
        });

        const pipelineLayout = device.createPipelineLayout({
            label: 'LandscapeVNTBake_PipelineLayout',
            bindGroupLayouts: [this.#bindGroupLayout]
        });

        this.#computePipeline = device.createComputePipeline({
            label: 'LandscapeVNTBake_ComputePipeline',
            layout: pipelineLayout,
            compute: {
                module: shaderModule,
                entryPoint: 'main'
            }
        });

        this.#uniformBuffer = device.createBuffer({
            label: 'LandscapeVNTBake_UniformBuffer',
            size: 48,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
        });
    }
}

export default LandscapeVNTGenerator;
