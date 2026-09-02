import RedGPUContext from "../../../../../context/RedGPUContext";
import FoliageSubMesh from "../../FoliageSubMesh";
import FoliageType from "../../FoliageType";
import type {FoliageDepthPassMode} from "../pipeline/FoliagePipelineRegistry";
import FoliagePipelineRegistry from "../pipeline/FoliagePipelineRegistry";

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

        // 🌲 1. 유효한 활성 식생 품종 1회 수집 (루프 중복 검사 및 게터 조회 최소화)
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

        // 🌲 2. Depth Prepass 루프 (선행 깊이 버퍼 선점)
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.canRenderInPass('depthPrepass')) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, 'depthPrepass');
                }
            }
        }

        // 🌲 3. Main Opaque / Masked 루프 (Full PBR 셰이딩)
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.canRenderInPass('main')) {
                    this.#drawSubMesh(passEncoder, sub, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, sub.mainDepthMode);
                }
            }
        }
    }

    renderShadow(passEncoder: GPURenderPassEncoder, typeList: readonly FoliageType[], view: any): void {
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
        const currentCascade = view3D?.currentCascadeIndex ?? 0;
        // 🌲 4개 캐스케이드(Cascade 0, 1, 2, 3) 모두 지원 (Cascade 2, 3은 2-트라이앵글 임포스터로 초고속 렌더링)
        if (currentCascade > 3) return;

        const systemBG = view3D?.systemUniform_Vertex_UniformBindGroup ?? (view as any)?.systemUniform_Vertex_UniformBindGroup ?? null;

        let validCount = 0;
        for (let t = 0; t < typeCount; t++) {
            const foliageType = typeList[t];
            if (foliageType.activeInstanceCount <= 0) continue;
            const culledGPU = foliageType.shadowCulledGPUBuffer;
            const indirectGPU = foliageType.shadowIndirectGPUBuffer;
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

        const cascadeIndirectOffset = currentCascade * 256 * 20;
        const cascadeInstanceOffset = currentCascade * (500000 * 8) * 32;

        // 🌲 Shadow Pass 루프 (식생 그림자 뎁스 기록)
        for (let t = 0; t < validCount; t++) {
            const {type: foliageType, culledGPU, indirectGPU} = this.#validTypes[t];
            const subMeshes = foliageType.subMeshes;
            const subCount = subMeshes.length;

            for (let s = 0; s < subCount; s++) {
                const sub = subMeshes[s];
                if (sub.canRenderInPass('shadow')) {
                    const instOffset = cascadeInstanceOffset + sub.instanceBufferOffset;
                    const indOffset = cascadeIndirectOffset + sub.indirectOffsetBytes;
                    this.#drawSubMesh(passEncoder, sub, 1, 'shadow', systemBG, indirectGPU, culledGPU, 'shadow', instOffset, indOffset);
                }
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
        depthPassMode: FoliageDepthPassMode = 'normal',
        overrideInstanceOffset?: number,
        overrideIndirectOffset?: number
    ): void {
        const vertexGPUBuffer = sub.geometry.vertexBuffer?.gpuBuffer;
        if (!vertexGPUBuffer) return;

        const pipeline = sub.getPipeline(
            this.#pipelineRegistry,
            sampleCount,
            msaaID,
            depthPassMode,
            this.#subMeshVertexBindGroupLayout
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

        const matUniformBG = sub.material.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG && this.#lastBoundMatBG !== matUniformBG) {
            passEncoder.setBindGroup(2, matUniformBG);
            this.#lastBoundMatBG = matUniformBG;
        }

        if (this.#lastBoundGeometryVertexBuffer !== vertexGPUBuffer) {
            passEncoder.setVertexBuffer(0, vertexGPUBuffer);
            this.#lastBoundGeometryVertexBuffer = vertexGPUBuffer;
        }

        const instanceBufferOffset = overrideInstanceOffset !== undefined ? overrideInstanceOffset : sub.instanceBufferOffset;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
            const indexGPUBuffer = sub.geometry.indexBuffer.gpuBuffer;
            if (this.#lastBoundIndexBuffer !== indexGPUBuffer) {
                passEncoder.setIndexBuffer(indexGPUBuffer, sub.indexFormat);
                this.#lastBoundIndexBuffer = indexGPUBuffer;
            }
        }

        sub.draw(passEncoder, indirectGPUBuffer, overrideIndirectOffset);
    }
}

Object.freeze(FoliageRenderer);
export default FoliageRenderer;
