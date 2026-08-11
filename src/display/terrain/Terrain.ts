import RedGPUContext from "../../context/RedGPUContext";
import TerrainTileBind from "./core/bind/TerrainTileBind";
import {TerrainLayerConfig} from "./core/material/TerrainMaterial";
import TerrainExporter from "./core/exporter/TerrainExporter";
import {TerrainOptions} from "./core/tile/TerrainTileManager";
import Sampler from "../../resources/sampler/Sampler";
import GPU_ADDRESS_MODE from "../../gpuConst/GPU_ADDRESS_MODE";
import GPU_FILTER_MODE from "../../gpuConst/GPU_FILTER_MODE";
import GPU_MIPMAP_FILTER_MODE from "../../gpuConst/GPU_MIPMAP_FILTER_MODE";
import vertexModuleSource from "./vertex.wgsl";
import defineSampler from "../../defineProperty/funcs/texture/defineSampler";
import DirectTexture from "../../resources/texture/DirectTexture";
import BitmapTexture from "../../resources/texture/BitmapTexture";

export type {TerrainLayerConfig, TerrainOptions};

interface Terrain {
    heightmapSampler: Sampler;
}

class Terrain extends TerrainTileBind {
    customVertexBindGroupLayout!: GPUBindGroupLayout;

    constructor(redGPUContext: RedGPUContext, options?: TerrainOptions, name?: string) {
        super(redGPUContext, options);

        if (name) {
            this.name = name;
        }

        this.ignoreFrustumCulling = true;
        this.receiveShadow = true;

        this.heightmapSampler = new Sampler(redGPUContext, {
            magFilter: GPU_FILTER_MODE.LINEAR,
            minFilter: GPU_FILTER_MODE.LINEAR,
            mipmapFilter: GPU_MIPMAP_FILTER_MODE.LINEAR,
            addressModeU: GPU_ADDRESS_MODE.CLAMP_TO_EDGE,
            addressModeV: GPU_ADDRESS_MODE.CLAMP_TO_EDGE
        });
    }

    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        if (!this.customVertexBindGroupLayout) {
            this.customVertexBindGroupLayout = this.redGPUContext.gpuDevice.createBindGroupLayout({
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
        const SHADER_INFO = this.redGPUContext.resourceManager.wgslParser.parse('TERRAIN_VERTEX', vertexModuleSource);
        const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;
        const shaderModule = this.createMeshVertexShaderModuleBASIC('TERRAIN_VERTEX', SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource);

        this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
            getTerrainVertexBindGroupDescriptor(this, this.customVertexBindGroupLayout)
        );

        return shaderModule;
    }

    updateTexture(prevTexture: DirectTexture | BitmapTexture | null, texture: DirectTexture | BitmapTexture | null) {
        if (prevTexture) {
            prevTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        if (texture) {
            texture.__addDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        this.#dirtyPipelineListener();
    }

    updateSampler() {
        this.#dirtyPipelineListener();
    }

    override destroy() {
        if (this.heightmapSampler) {
            this.heightmapSampler = null!;
        }
        if (this.heightmapAtlasTexture) {
            this.heightmapAtlasTexture.__removeDirtyPipelineListener(this.#dirtyPipelineListener);
        }
        super.destroy();
    }

    downloadHeightmapAtlasAsPNG(fileName: string = 'Terrain_HeightmapTileAtlasGPUTexture.png') {
        return TerrainExporter.downloadHeightmapAtlasAsPNG(
            this.redGPUContext,
            this.heightmapAtlasTexture,
            fileName
        );
    }

    renderAtlasPreview(ctx: CanvasRenderingContext2D, width: number = 512, height: number = 512) {
        return TerrainExporter.renderAtlasPreview(
            ctx,
            this.atlasTileCountX,
            this.atlasTileCountZ,
            this.tileDataCache,
            width,
            height
        );
    }

    #dirtyPipelineListener = () => {
        if (this.gpuRenderInfo && this.redGPUContext && this.customVertexBindGroupLayout) {
            this.gpuRenderInfo.vertexUniformBindGroup = this.redGPUContext.gpuDevice.createBindGroup(
                getTerrainVertexBindGroupDescriptor(this, this.customVertexBindGroupLayout)
            );
            this.dirtyPipeline = true;
        }
    }
}

const getTerrainVertexBindGroupDescriptor = (mesh: Terrain, layout: GPUBindGroupLayout) => {
    const {redGPUContext} = mesh;
    const {resourceManager} = redGPUContext;

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

defineSampler(Terrain, [
    {key: "heightmapSampler"}
]);

Object.defineProperty(Terrain.prototype, 'isTerrain', {
    value: true,
    writable: false
});

Object.freeze(Terrain);
export default Terrain;