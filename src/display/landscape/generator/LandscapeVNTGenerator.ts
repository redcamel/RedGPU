import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vntBakeShaderCode from "../shader/landscapeVNTBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";
import {getComputeBindGroupLayoutDescriptorFromShaderInfo} from "../../../material/core";

export class LandscapeVNTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Float32Array;
    #uniformByteLength: number = 48;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VNT');
        this.#uniformArray = new Float32Array(12);
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
        if (!this.computePipeline || !this.bindGroupLayout) return;
        if (!vhtAtlas?.gpuTexture || !vntAtlas?.gpuTexture) return;

        const device = this.redGPUContext.gpuDevice;
        const atlasW = vhtAtlas.gpuTexture.width;
        const atlasH = vhtAtlas.gpuTexture.height;

        const texelWorldSize = worldSizeX / (componentCountX * 512);

        const bakeX = Math.max(0, pixelX - 1);
        const bakeZ = Math.max(0, pixelZ - 1);
        const bakeW = Math.min(atlasW - bakeX, pixelW + (pixelX > 0 ? 2 : 1));
        const bakeH = Math.min(atlasH - bakeZ, pixelH + (pixelZ > 0 ? 2 : 1));

        if (bakeW <= 0 || bakeH <= 0 || pixelX >= atlasW || pixelZ >= atlasH) return;

        const arr = this.#uniformArray;
        arr[0] = bakeX;
        arr[1] = bakeZ;
        arr[2] = bakeW;
        arr[3] = bakeH;

        arr[4] = atlasW;
        arr[5] = atlasH;
        arr[6] = heightScale;
        arr[7] = texelWorldSize;

        const uniformBuffer = this.acquireUniformBuffer(this.#uniformByteLength);
        device.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, this.#uniformByteLength);

        const bindGroup = device.createBindGroup({
            label: `Landscape_VNT_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.bindGroupLayout,
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

        this.dispatchBakePass(bindGroup, bakeW, bakeH, pixelX, pixelZ);
    }

    #initComputeResources(): void {
        const resourceManager = this.redGPUContext.resourceManager;
        const shaderInfo = resourceManager.wgslParser.parse('LandscapeVNTBakeComputeShaderModule', vntBakeShaderCode);
        const uniformByteLength = shaderInfo?.uniforms?.uniforms?.arrayBufferByteLength || 48;
        this.#uniformByteLength = uniformByteLength;
        this.#uniformArray = new Float32Array(uniformByteLength / Float32Array.BYTES_PER_ELEMENT);

        const descriptor = getComputeBindGroupLayoutDescriptorFromShaderInfo(shaderInfo, 0, {
            1: {
                texture: {
                    sampleType: 'unfilterable-float',
                    viewDimension: '2d'
                }
            }
        });

        this.initBaseComputePipeline(
            'LandscapeVNTBakeComputeShaderModule',
            vntBakeShaderCode,
            descriptor.entries as GPUBindGroupLayoutEntry[],
            uniformByteLength
        );
    }
}

export default LandscapeVNTGenerator;
