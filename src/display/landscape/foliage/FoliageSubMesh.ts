import {mat4} from "gl-matrix";
import Mesh from "../../mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import type {FoliageDepthPassMode} from "./core/pipeline/FoliagePipelineRegistry";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";

export type FoliageRenderPassType = 'depthPrepass' | 'main' | 'shadow';

export interface FoliageSubMeshInitOptions {
    mesh: Mesh;
    geometry: Geometry;
    material: any;
    indexCount: number;
    vertexCount: number;
    isIndexed: boolean;
    indexFormat?: GPUIndexFormat;
    strideBytes: number;
    bottomOffset?: number;
    relativeModelMatrix: mat4;
    relativeNormalMatrix: mat4;
    vertexUniformBuffer: GPUBuffer;
    vertexUniformBindGroup: GPUBindGroup;
    lodIndex: number;

    isDepthPrepass: boolean;
    isMainOpaqueOrMasked: boolean;
    isMasked?: boolean;
    mainDepthMode: FoliageDepthPassMode;
    isImpostor?: boolean;
    impostorWidth?: number;
    impostorHeight?: number;
    receiveShadow?: boolean;

    instanceBufferOffset?: number;
    indirectOffsetBytes?: number;
}

class FoliageSubMesh {
    static readonly #singleFloatBuffer: Float32Array = new Float32Array(1);

    readonly mesh: Mesh;
    readonly geometry: Geometry;
    readonly material: any;
    readonly indexCount: number;
    readonly vertexCount: number;
    readonly isIndexed: boolean;
    readonly indexFormat: GPUIndexFormat;
    readonly strideBytes: number;
    bottomOffset: number;
    readonly relativeModelMatrix: mat4;
    readonly relativeNormalMatrix: mat4;
    readonly vertexUniformBuffer: GPUBuffer;
    readonly vertexUniformBindGroup: GPUBindGroup;
    readonly lodIndex: number;

    readonly isDepthPrepass: boolean;
    readonly isMainOpaqueOrMasked: boolean;
    readonly isMasked: boolean;
    readonly mainDepthMode: FoliageDepthPassMode;
    isImpostor: boolean;
    impostorWidth: number;
    impostorHeight: number;
    receiveShadow: boolean;

    instanceBufferOffset: number;
    indirectOffsetBytes: number;
    #pipelineCacheByMode: Record<string, Record<string, GPURenderPipeline>> = {};

    constructor(init: FoliageSubMeshInitOptions) {
        this.mesh = init.mesh;
        this.geometry = init.geometry;
        this.material = init.material;
        this.indexCount = init.indexCount;
        this.vertexCount = init.vertexCount;
        this.isIndexed = init.isIndexed;
        this.indexFormat = init.indexFormat || 'uint32';
        this.strideBytes = init.strideBytes;
        this.bottomOffset = init.bottomOffset ?? 0;
        this.relativeModelMatrix = init.relativeModelMatrix;
        this.relativeNormalMatrix = init.relativeNormalMatrix;
        this.vertexUniformBuffer = init.vertexUniformBuffer;
        this.vertexUniformBindGroup = init.vertexUniformBindGroup;
        this.lodIndex = init.lodIndex;

        this.isDepthPrepass = init.isDepthPrepass;
        this.isMainOpaqueOrMasked = init.isMainOpaqueOrMasked;
        this.isMasked = init.isMasked ?? true;
        this.mainDepthMode = init.mainDepthMode;
        this.isImpostor = init.isImpostor ?? false;
        this.impostorWidth = init.impostorWidth ?? 0;
        this.impostorHeight = init.impostorHeight ?? 0;
        this.receiveShadow = init.receiveShadow !== false;

        this.instanceBufferOffset = init.instanceBufferOffset ?? 0;
        this.indirectOffsetBytes = init.indirectOffsetBytes ?? 0;
    }

    updateReceiveShadow(gpuDevice: GPUDevice, receiveShadow: boolean): void {
        this.receiveShadow = receiveShadow;
        if (this.vertexUniformBuffer && gpuDevice) {
            FoliageSubMesh.#singleFloatBuffer[0] = receiveShadow ? 1.0 : 0.0;
            gpuDevice.queue.writeBuffer(
                this.vertexUniformBuffer,
                34 * 4,
                FoliageSubMesh.#singleFloatBuffer.buffer,
                FoliageSubMesh.#singleFloatBuffer.byteOffset,
                4
            );
        }
    }


    needsShadowFragment(depthPassMode: FoliageDepthPassMode = 'shadow'): boolean {
        if (depthPassMode === 'shadowOpaque') return false;
        return this.isMasked;
    }

    canRenderInPass(passType: FoliageRenderPassType): boolean {
        switch (passType) {
            case 'depthPrepass':
                return this.isDepthPrepass;
            case 'main':
            case 'shadow':
                return this.isMainOpaqueOrMasked;
            default:
                return false;
        }
    }

    getPipeline(
        registry: FoliagePipelineRegistry,
        sampleCount: number,
        msaaID: string,
        depthPassMode: FoliageDepthPassMode,
        subMeshBindGroupLayout: GPUBindGroupLayout | null
    ): GPURenderPipeline | null {
        const material = this.material;
        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }


        let modeMap = this.#pipelineCacheByMode[msaaID];
        if (!modeMap) {
            modeMap = {};
            this.#pipelineCacheByMode[msaaID] = modeMap;
        }

        let pipeline = modeMap[depthPassMode];
        if (!pipeline) {


            let cullMode: GPUCullMode;
            if (!this.isMasked) {
                cullMode = 'back';
            } else if (depthPassMode === 'shadow') {
                cullMode = material.doubleSided ? 'none' : 'back';
            } else if (depthPassMode === 'shadowOpaque') {
                cullMode = 'back';
            } else {
                cullMode = material.doubleSided ? 'none' : (material.cullMode ?? 'back');
            }

            pipeline = registry.getOrCreatePipeline(
                material,
                sampleCount,
                msaaID,
                this.strideBytes,
                cullMode,
                depthPassMode,
                subMeshBindGroupLayout
            ) || undefined;

            if (pipeline) {
                modeMap[depthPassMode] = pipeline;
            }
        }
        return pipeline || null;
    }

    draw(passEncoder: GPURenderPassEncoder | GPURenderBundleEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
        const offset = offsetBytes !== undefined ? offsetBytes : this.indirectOffsetBytes;
        if (this.isIndexed && this.geometry.indexBuffer?.gpuBuffer) {
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, offset);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, offset);
        }
    }

    destroy(): void {
        this.vertexUniformBuffer?.destroy();
        this.#pipelineCacheByMode = {};
    }
}

Object.freeze(FoliageSubMesh);
export default FoliageSubMesh;
