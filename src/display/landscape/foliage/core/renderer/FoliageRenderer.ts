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
    #validTypes: { type: FoliageType; culledGPU: GPUBuffer; indirectGPU: GPUBuffer }[] = [];

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

    render(passEncoder: GPURenderPassEncoder, typeList: readonly FoliageType[], view: any): void {
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

        // 🌲 1. 유효한 활성 식생 품종 1회 수집 (4개 루프 중복 검사 및 게터 조회 75% 제거)
        let validCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const culledGPU = foliageType.culledGPUBuffer;
            const indirectGPU = foliageType.indirectGPUBuffer;
            if (!culledGPU || !indirectGPU || foliageType.subMeshes.length === 0) continue;

            let item = this.#validTypes[validCount];
            if (!item) {
                item = {type: foliageType, culledGPU, indirectGPU};
                this.#validTypes[validCount] = item;
            } else {
                item.type = foliageType;
                item.culledGPU = culledGPU;
                item.indirectGPU = indirectGPU;
            }
            validCount++;
        }
        if (validCount === 0) return;

        // 🌲 2. Depth Prepass 루프
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.isDepthPrepass) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
                }
            }
        }

        // 🌲 3. Main Opaque / Masked 루프
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.isMainOpaqueOrMasked) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, sub.mainDepthMode);
                }
            }
        }

        // 🌲 4. Alpha Blended 루프
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.isAlpha) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'normal');
                }
            }
        }

        // 🌲 5. Transparent 루프 (카메라 거리 기준 정렬)
        let transCount = 0;
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

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
                this.#drawSubMesh(passEncoder, item.subMesh, sampleCount, msaaID, systemBG, item.indirectGPU, item.culledGPU, 'normal');
            }
        }
    }

    #drawSubMesh(
        passEncoder: GPURenderPassEncoder,
        sub: FoliageSubMesh,
        sampleCount: number,
        msaaID: string,
        systemBG: GPUBindGroup | null,
        indirectGPUBuffer: GPUBuffer,
        culledGPUBuffer: GPUBuffer,
        depthPassMode: FoliageDepthPassMode = 'normal'
    ): void {
        const vertexGPUBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const material = sub.material;
        if (material.dirtyPipeline || !material.gpuRenderInfo?.fragmentUniformBindGroup) {
            material._updateFragmentState();
            material.dirtyPipeline = false;
        }

        // 🌲 서브메시별 파이프라인 캐싱 (Zero GC)
        const pipelineKey = `${msaaID}_${depthPassMode}`;
        let pipeline = sub.pipelineCache?.get(pipelineKey) || null;
        if (!pipeline) {
            const cullMode = material.doubleSided ? 'none' : (material.cullMode ?? 'none');
            pipeline = this.#pipelineRegistry.getOrCreatePipeline(
                material, sampleCount, msaaID, sub.strideBytes, cullMode, depthPassMode, this.#subMeshVertexBindGroupLayout
            );
            if (pipeline && sub.pipelineCache) {
                sub.pipelineCache.set(pipelineKey, pipeline);
            }
        }
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

        const instanceBufferOffset = sub.instanceBufferOffset;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        const indirectOffsetBytes = sub.indirectOffsetBytes;
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
