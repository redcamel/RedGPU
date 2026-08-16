import RedGPUContext from "../../../context/RedGPUContext";
import DirectTexture from "../../../resources/texture/DirectTexture";
import vntBakeShaderCode from "../shader/landscapeVNTBake.wgsl";
import ALandscapeAtlasGenerator from "./ALandscapeAtlasGenerator";

/**
 * [KO] 16비트 고도맵 VHT 아틀라스로부터 GPU Compute Shader 기반 실시간 픽셀 노멀 VNT 아틀라스를 베이킹하는 매니저 클래스입니다.
 * [EN] Manager class that bakes real-time pixel normal VNT Atlas based on GPU Compute Shader from 16-bit Heightmap VHT Atlas.
 */
export class LandscapeVNTGenerator extends ALandscapeAtlasGenerator {
    #uniformArray: Float32Array;

    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, 'VNT');
        this.#uniformArray = new Float32Array(12); // 48 bytes for VNTBakeUniforms struct
        this.#initComputeResources();
    }

    /**
     * [KO] VHT 고도 아틀라스로부터 [pixelX, pixelZ] 타일 영역의 노멀을 계산하여 VNT 아틀라스에 베이킹합니다 (Zero-GC Dynamic Frame-Pool).
     * [EN] Computes normals for [pixelX, pixelZ] tile region from VHT height atlas and bakes into VNT atlas (Zero-GC Dynamic Frame-Pool).
     */
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

        const uniformBuffer = this.acquireUniformBuffer(48);
        device.queue.writeBuffer(uniformBuffer, 0, arr.buffer, 0, 48);

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
        console.log(`[LandscapeVNTGenerator 🌀] GPU VNT Normal Bake executed for region [${pixelX}, ${pixelZ}, ${pixelW}x${pixelH}]`);
    }

    #initComputeResources(): void {
        this.initBaseComputePipeline(
            'LandscapeVNTBakeComputeShaderModule',
            vntBakeShaderCode,
            [
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
            ],
            48
        );
    }
}

export default LandscapeVNTGenerator;
