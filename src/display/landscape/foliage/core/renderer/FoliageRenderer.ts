import RedGPUContext from "../../../../../context/RedGPUContext";
import type {FoliageSubMesh} from "../../FoliageType";
import FoliageType from "../../FoliageType";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import FoliagePipelineRegistry from "../pipeline/FoliagePipelineRegistry";

interface TransparentFoliageEntry {
    subMesh: FoliageSubMesh;
    subIndex: number;
    culledGPU: GPUBuffer;
    indirectGPU: GPUBuffer;
    distanceSq: number;
    maxInstances: number;
}

class FoliageRenderer {
    #redGPUContext: RedGPUContext;
    #pipelineRegistry: FoliagePipelineRegistry;
    #emptyBindGroup: GPUBindGroup | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    #lastBoundPipeline: GPURenderPipeline | null = null;
    #lastBoundSystemBG: GPUBindGroup | null = null;
    #lastBoundVertexUniformBG: GPUBindGroup | null = null;
    #lastBoundMatBG: GPUBindGroup | null = null;
    #lastBoundGeometryVertexBuffer: GPUBuffer | null = null;
    #lastBoundIndexBuffer: GPUBuffer | null = null;
    #lastBoundInstanceBuffer: GPUBuffer | null = null;
    #lastBoundInstanceOffset: number = -1;

    #transparentEntries: TransparentFoliageEntry[] = [];

    constructor(
        redGPUContext: RedGPUContext,
        pipelineRegistry: FoliagePipelineRegistry,
        emptyBindGroup?: GPUBindGroup | null,
        subMeshVertexBindGroupLayout?: GPUBindGroupLayout | null
    ) {
        this.#redGPUContext = redGPUContext;
        this.#pipelineRegistry = pipelineRegistry;
        this.#emptyBindGroup = emptyBindGroup || null;
        this.#subMeshVertexBindGroupLayout = subMeshVertexBindGroupLayout || null;
    }

    render(
        passEncoder: GPURenderPassEncoder,
        typeList: FoliageType[],
        view: any
    ): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundVertexUniformBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundGeometryVertexBuffer = null;
        this.#lastBoundIndexBuffer = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        const view3D = view as any;
        const antialiasingManager = this.#redGPUContext.antialiasingManager;
        const msaaID = antialiasingManager.msaaID;
        const useMSAA = antialiasingManager.useMSAA;
        const sampleCount = useMSAA ? 4 : 1;
        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup ?? (view as any)?.systemUniform_Vertex_UniformBindGroup ?? null;

        const rawCamera = view3D?.rawCamera || view3D?.camera || view;
        const camX = rawCamera?.x ?? 0;
        const camY = rawCamera?.y ?? 0;
        const camZ = rawCamera?.z ?? 0;

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                // 🌿 3D 식생에 대해 Depth Prepass 렌더링
                if (sub.isDepthPrepass) {
                    this.#drawSubMesh(passEncoder, sub, s, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, foliageType.options.maxInstances, 'depthPrepass');
                }
            }
        }

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.isMainOpaqueOrMasked) {
                    this.#drawSubMesh(passEncoder, sub, s, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, foliageType.options.maxInstances, sub.mainDepthMode);
                }
            }
        }

        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.isAlpha) {
                    this.#drawSubMesh(passEncoder, sub, s, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, foliageType.options.maxInstances, 'normal');
                }
            }
        }

        let transCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;
            if (subCount === 0) continue;

            const buffer = foliageType.instanceBuffer;
            const culledGPU = buffer.getCulledGPUBuffer();
            const indirectGPU = buffer.getIndirectGPUBuffer();
            if (!culledGPU || !indirectGPU) continue;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.isTransparent) {
                    let entry = this.#transparentEntries[transCount];
                    if (!entry) {
                        entry = {
                            subMesh: sub,
                            subIndex: s,
                            culledGPU,
                            indirectGPU,
                            distanceSq: 0,
                            maxInstances: foliageType.options.maxInstances
                        };
                        this.#transparentEntries[transCount] = entry;
                    } else {
                        entry.subMesh = sub;
                        entry.subIndex = s;
                        entry.culledGPU = culledGPU;
                        entry.indirectGPU = indirectGPU;
                        entry.maxInstances = foliageType.options.maxInstances;
                    }

                    const meshNode = sub.mesh;
                    const dx = (meshNode?.x ?? 0) - camX;
                    const dy = (meshNode?.y ?? 0) - camY;
                    const dz = (meshNode?.z ?? 0) - camZ;
                    entry.distanceSq = dx * dx + dy * dy + dz * dz;

                    transCount++;
                }
            }
        }

        if (transCount > 0) {

            const entries = this.#transparentEntries;
            for (let i = 1; i < transCount; i++) {
                const current = entries[i];
                const currentDist = current.distanceSq;
                let j = i - 1;
                while (j >= 0 && entries[j].distanceSq < currentDist) {
                    entries[j + 1] = entries[j];
                    j--;
                }
                entries[j + 1] = current;
            }

            for (let i = 0; i < transCount; i++) {
                const item = entries[i];
                this.#drawSubMesh(passEncoder, item.subMesh, item.subIndex, sampleCount, msaaID, systemBG, item.indirectGPU, item.culledGPU, item.maxInstances ?? 50000, 'normal');
            }
        }
    }

    #drawSubMesh(
        passEncoder: GPURenderPassEncoder,
        sub: FoliageSubMesh,
        subIndex: number,
        sampleCount: number,
        msaaID: string,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        maxInstances: number,
        depthPassMode: FoliageDepthPassMode = 'normal'
    ): void {
        const vertexGPUBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const material = sub.material;
        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }

        const cullMode = material.doubleSided ? 'none' : (material.cullMode ?? 'none');
        const pipeline = this.#pipelineRegistry.getOrCreatePipeline(
            material, sampleCount, msaaID, sub.strideBytes, cullMode, depthPassMode, this.#subMeshVertexBindGroupLayout
        );
        if (!pipeline) return;

        if (this.#lastBoundPipeline !== pipeline) {
            passEncoder.setPipeline(pipeline);
            this.#lastBoundPipeline = pipeline;
        }

        if (systemBG && this.#lastBoundSystemBG !== systemBG) {
            passEncoder.setBindGroup(0, systemBG);
            this.#lastBoundSystemBG = systemBG;
        }

        const vertexUniformBG = sub.vertexUniformBindGroup || this.#emptyBindGroup;
        if (vertexUniformBG && this.#lastBoundVertexUniformBG !== vertexUniformBG) {
            passEncoder.setBindGroup(1, vertexUniformBG);
            this.#lastBoundVertexUniformBG = vertexUniformBG;
        }

        const matUniformBG = material.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG && this.#lastBoundMatBG !== matUniformBG) {
            passEncoder.setBindGroup(2, matUniformBG);
            this.#lastBoundMatBG = matUniformBG;
        }

        if (this.#lastBoundGeometryVertexBuffer !== vertexGPUBuffer) {
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            this.#lastBoundGeometryVertexBuffer = vertexGPUBuffer;
        }

        const lodIdx = sub.lodIndex ?? 0;
        const instanceBufferOffset = lodIdx * maxInstances * 48;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        const indirectOffsetBytes = subIndex * 20;
        if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
            const indexGPUBuffer = sub.geometry.indexBuffer.gpuBuffer;
            if (this.#lastBoundIndexBuffer !== indexGPUBuffer) {
                const format = sub.indexFormat || 'uint32';
                passEncoder.setIndexBuffer(indexGPUBuffer, format);
                this.#lastBoundIndexBuffer = indexGPUBuffer;
            }
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, indirectOffsetBytes);
        }
    }
}

Object.freeze(FoliageRenderer);
export default FoliageRenderer;
