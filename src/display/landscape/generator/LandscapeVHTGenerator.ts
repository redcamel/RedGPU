import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vhtShaderCode from "../shader/landscapeVHTBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";

export class LandscapeVHTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Uint32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VHT');
        this.#uniformArray = new Uint32Array(4);
        this.#initComputeResources();
    }

    bakeTileRegion(
        srcTileTexture: GPUTexture,
        vhtAtlas: DirectTexture,
        pixelX: number,
        pixelZ: number,
        pixelW: number,
        pixelH: number
    ): void {
        if (!this.computePipeline || !this.bindGroupLayout) return;
        const atlasW = vhtAtlas.gpuTexture.width;
        const atlasH = vhtAtlas.gpuTexture.height;
        if (pixelX >= atlasW || pixelZ >= atlasH || pixelW <= 0 || pixelH <= 0) return;

        const device = this.redGPUContext.gpuDevice;

        const arr = this.#uniformArray;
        arr[0] = pixelX;
        arr[1] = pixelZ;
        arr[2] = pixelW;
        arr[3] = pixelH;

        const uniformBuffer = this.acquireUniformBuffer(16);
        device.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, 16);

        const srcView = srcTileTexture.createView();
        const bindGroup = device.createBindGroup({
            label: `Landscape_VHT_BindGroup_[${pixelX},${pixelZ}]`,
            layout: this.bindGroupLayout,
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

        this.dispatchBakePass(bindGroup, pixelW, pixelH, pixelX, pixelZ);
        console.log(`[LandscapeVHTGenerator ⚡] GPU Compute r32float VHT Height Bake executed for region [${pixelX}, ${pixelZ}, ${pixelW}x${pixelH}]`);
    }

    #initComputeResources(): void {
        this.initBaseComputePipeline(
            'LandscapeVHTBakeComputeShaderModule',
            vhtShaderCode,
            [
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
            ],
            16
        );
    }
}

export default LandscapeVHTGenerator;
