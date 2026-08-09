import RedGPUContext from "../../context/RedGPUContext";
import {TerrainLayerConfig} from "./core/material/TerrainMaterial";
import Sampler from "../../resources/sampler/Sampler";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import vertexModuleSource from "./vertex.wgsl";
import TerrainTileSystem, {TerrainOptions} from "./core/TerrainTileSystem";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";

export type {TerrainLayerConfig, TerrainOptions};

interface Terrain {
    heightmapSampler: Sampler;
}

class Terrain extends TerrainTileSystem {
    customVertexBindGroupLayout: GPUBindGroupLayout;

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions, name?: string) {
        super(redGPUContext, options);
        if (name) {
            this.name = name
        }
        this.ignoreFrustumCulling = true;
        this.heightmapSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });

        this.customVertexBindGroupLayout = redGPUContext.gpuDevice.createBindGroupLayout({
            label: 'TERRAIN_VERTEX_GPUBindGroupLayout',
            entries: [
                {binding: 0, visibility: GPUShaderStage.VERTEX, buffer: {type: 'uniform'}},
                {binding: 1, visibility: GPUShaderStage.VERTEX, sampler: {type: 'filtering'}},
                {
                    binding: 2,
                    visibility: GPUShaderStage.VERTEX,
                    texture: {sampleType: 'float', viewDimension: '2d', multisampled: false}
                },
                {binding: 3, visibility: GPUShaderStage.VERTEX, buffer: {type: 'read-only-storage'}},
            ]
        });


    }

    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TERRAIN_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('TERRAIN_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);

        this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
            getTerrainVertexBindGroupDescriptor(this)
        );

        return shaderModule;
    }


    updateTexture(prevTexture: any, texture: any) {
        if (prevTexture) {
            prevTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (texture) {
            texture.__addDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        this.#dirtyPipelineListener();
    }

    updateSampler() {
        this.#dirtyPipelineListener()
    }

    getTerrainHeight(x: number, z: number): number {
        const [worldW, worldH] = this.worldSize;
        const [offX, offZ] = this.worldOffset;

        // 1. [0, 1] 범위의 normalized UV 좌표 구하기
        const u = Math.max(0, Math.min(1, (x - offX) / worldW));
        const v = Math.max(0, Math.min(1, (z - offZ) / worldH));

        // 2. 16x16 격자 내의 타일 컬럼, 로우 계산 (높이맵 Y축은 보통 v를 뒤집음)
        const col = Math.max(0, Math.min(15, Math.floor(u * 16)));
        const row = Math.max(0, Math.min(15, Math.floor((1 - v) * 16)));
        const key = `${col}_${row}`;

        const tileData = this.tileDataCache.get(key) as any;
        if (!tileData) return this.minHeight; // 아직 타일이 로드되지 않았으면 최소 높이 반환

        // 3. 타일 내 상대적 UV 좌표
        const tu = (u * 16) - col;
        const tv = ((1 - v) * 16) - row;

        // 4. 512x512 픽셀 중 가장 가까운 픽셀 인덱스 구하기
        const px = Math.max(0, Math.min(511, Math.floor(tu * 512)));
        const py = Math.max(0, Math.min(511, Math.floor(tv * 512)));

        const u16 = tileData[py * 512 + px];
        if (u16 === undefined) return this.minHeight;

        const ratio = u16 / 65535.0;
        return this.minHeight + ratio * (this.maxHeight - this.minHeight);
    }

    destroy() {
        if (this.heightmapAtlasTexture) {
            this.heightmapAtlasTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        super.destroy();
    }

    async downloadHeightmapAtlasAsPNG(fileName: string = 'Terrain_HeightmapTileAtlasGPUTexture.png') {
        const gpuTexture = this.heightmapAtlasTexture?.gpuTexture;
        if (!gpuTexture) {
            console.warn('downloadHeightmapAtlasAsPNG: heightmapAtlasTexture가 생성되지 않았습니다.');
            return;
        }

        const device = this.redGPUContext.gpuDevice;
        const width = gpuTexture.width;
        const height = gpuTexture.height;

        const bytesPerPixel = gpuTexture.format === 'r16float' ? 2 : 4;
        const unpaddedBytesPerRow = width * bytesPerPixel;
        const align = 256;
        const paddedBytesPerRow = Math.ceil(unpaddedBytesPerRow / align) * align;
        const bufferSize = paddedBytesPerRow * height;

        const readBuffer = device.createBuffer({
            label: 'Terrain_DownloadAtlasReadBuffer',
            size: bufferSize,
            usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ
        });

        const commandEncoder = device.createCommandEncoder({
            label: 'Terrain_DownloadAtlasEncoder'
        });

        commandEncoder.copyTextureToBuffer(
            {texture: gpuTexture},
            {
                buffer: readBuffer,
                bytesPerRow: paddedBytesPerRow,
                rowsPerImage: height
            },
            [width, height, 1]
        );

        device.queue.submit([commandEncoder.finish()]);

        await readBuffer.mapAsync(GPUMapMode.READ);
        const copyArrayBuffer = readBuffer.getMappedRange();

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const imageData = ctx.createImageData(width, height);
        const imgData = imageData.data;

        if (gpuTexture.format === 'r16float') {
            const dataView = new DataView(copyArrayBuffer);
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * paddedBytesPerRow;
                const dstRowOffset = y * width * 4;
                for (let x = 0; x < width; x++) {
                    const u16 = dataView.getUint16(srcRowOffset + x * 2, true);
                    let exp = (u16 & 0x7C00) >> 10;
                    let frac = u16 & 0x03FF;
                    let val = (exp === 0) ? (frac / 1024) * Math.pow(2, -14) : (1 + frac / 1024) * Math.pow(2, exp - 15);
                    let byteVal = Math.min(255, Math.max(0, Math.round(val * 255)));

                    const dstIdx = dstRowOffset + x * 4;
                    imgData[dstIdx + 0] = byteVal;
                    imgData[dstIdx + 1] = byteVal;
                    imgData[dstIdx + 2] = byteVal;
                    imgData[dstIdx + 3] = 255;
                }
            }
        } else {
            const data = new Uint8Array(copyArrayBuffer);
            for (let y = 0; y < height; y++) {
                const srcRowOffset = y * paddedBytesPerRow;
                const dstRowOffset = y * width * 4;
                for (let x = 0; x < width * 4; x++) {
                    imgData[dstRowOffset + x] = data[srcRowOffset + x];
                }
            }
        }

        ctx.putImageData(imageData, 0, 0);
        readBuffer.unmap();
        readBuffer.destroy();

        canvas.toBlob((blob) => {
            if (!blob) return;
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fileName;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    }

    renderAtlasPreview(ctx: CanvasRenderingContext2D, width: number = 512, height: number = 512) {
        if (!ctx) return;
        const curDpr = window.devicePixelRatio || 1;
        ctx.setTransform(curDpr, 0, 0, curDpr, 0, 0);
        ctx.imageSmoothingEnabled = false;

        const countX = this.atlasTileCountX;
        const countZ = this.atlasTileCountZ;
        const cellW = width / countX;
        const cellH = height / countZ;

        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, width, height);

        for (let x = 0; x < countX; x++) {
            for (let z = 0; z < countZ; z++) {
                const px = x * cellW;
                const py = z * cellH;

                ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
                ctx.fillRect(px, py, cellW, cellH);

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.strokeRect(px, py, cellW, cellH);

                const key = `${x}_${z}`;
                if (this.tileDataCache.has(key)) {
                    const data = this.tileDataCache.get(key);
                    if (data instanceof HTMLImageElement || data instanceof ImageBitmap) {
                        try {
                            ctx.drawImage(data as CanvasImageSource, px, py, cellW, cellH);
                        } catch (e) {
                        }
                    } else {
                        ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
                        ctx.fillRect(px + 2, py + 2, cellW - 4, cellH - 4);
                    }
                }
            }
        }
    }

    #dirtyPipelineListener = () => {
        if (this.gpuRenderInfo && this.redGPUContext) {
            this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
                getTerrainVertexBindGroupDescriptor(this)
            );
            this.dirtyPipeline = true
        }
    }


}

const getTerrainVertexBindGroupDescriptor = (mesh: Terrain) => {
    const {redGPUContext} = mesh;
    const {resourceManager} = redGPUContext;
    const layout = mesh.customVertexBindGroupLayout;

    return {
        label: `TERRAIN_VERTEX_GPUBindGroup`,
        layout,
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mesh.gpuRenderInfo.vertexUniformBuffer.gpuBuffer
                }
            },
            {
                binding: 1,
                resource: mesh.heightmapSampler?.gpuSampler || resourceManager.basicDisplacementSampler.gpuSampler
            },
            {
                binding: 2,
                resource: resourceManager.getGPUResourceBitmapTextureView(mesh.heightmapAtlasTexture) || resourceManager.emptyBitmapTextureView
            },
            {
                binding: 3,
                resource: {
                    buffer: mesh.instanceBuffer
                }
            }
        ]
    };
};

Object.defineProperty(Terrain.prototype, 'isTerrain', {
    value: true,
    writable: false
});
defineSampler(Terrain, [
    {key: "heightmapSampler"}
]);
Object.freeze(Terrain);
export default Terrain;