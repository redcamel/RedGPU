import {mat4} from "gl-matrix";
import Mesh from "../../mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import type {FoliageDepthPassMode} from "./core/pipeline/FoliagePipelineRegistry";
import FoliagePipelineRegistry from "./core/pipeline/FoliagePipelineRegistry";

export type FoliageRenderPassType = 'depthPrepass' | 'main';

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
    mainDepthMode: FoliageDepthPassMode;
    isImpostor?: boolean;
    impostorWidth?: number;
    impostorHeight?: number;

    instanceBufferOffset?: number;
    indirectOffsetBytes?: number;
}

class FoliageSubMesh {
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
    readonly mainDepthMode: FoliageDepthPassMode;
    isImpostor: boolean;
    impostorWidth: number;
    impostorHeight: number;

    instanceBufferOffset: number;
    indirectOffsetBytes: number;
    readonly #pipelineCache: Map<string, GPURenderPipeline> = new Map();

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
        this.mainDepthMode = init.mainDepthMode;
        this.isImpostor = init.isImpostor ?? false;
        this.impostorWidth = init.impostorWidth ?? 0;
        this.impostorHeight = init.impostorHeight ?? 0;

        this.instanceBufferOffset = init.instanceBufferOffset ?? 0;
        this.indirectOffsetBytes = init.indirectOffsetBytes ?? 0;
    }

    /**
     * 주어진 렌더 패스 유형에 이 서브메시가 렌더링 대상인지 O(1)로 판정합니다.
     */
    canRenderInPass(passType: FoliageRenderPassType): boolean {
        switch (passType) {
            case 'depthPrepass':
                return this.isDepthPrepass;
            case 'main':
                return this.isMainOpaqueOrMasked;
            default:
                return false;
        }
    }

    /**
     * 서브메시별 렌더 파이프라인을 Zero GC로 조회하거나 캐싱하여 반환합니다.
     */
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

        const pipelineKey = `${msaaID}_${depthPassMode}`;
        let pipeline = this.#pipelineCache.get(pipelineKey);
        if (!pipeline) {
            const cullMode = material.doubleSided ? 'none' : (material.cullMode ?? 'none');
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
                this.#pipelineCache.set(pipelineKey, pipeline);
            }
        }
        return pipeline || null;
    }

    /**
     * 인덱스 버퍼 유무에 따라 간접 드로우콜을 디스패치합니다.
     */
    draw(passEncoder: GPURenderPassEncoder, indirectGPUBuffer: GPUBuffer): void {
        if (this.isIndexed && this.geometry.indexBuffer?.gpuBuffer) {
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, this.indirectOffsetBytes);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, this.indirectOffsetBytes);
        }
    }

    destroy(): void {
        this.vertexUniformBuffer?.destroy();
        this.#pipelineCache.clear();
    }
}

Object.freeze(FoliageSubMesh);
export default FoliageSubMesh;
