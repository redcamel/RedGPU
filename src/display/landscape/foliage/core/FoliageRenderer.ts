import RedGPUContext from "../../../../context/RedGPUContext";
import FoliageType, {FoliageSubMesh} from "../FoliageType";
import FoliagePipelineRegistry, {FoliageDepthPassMode} from "./FoliagePipelineRegistry";

interface TransparentFoliageEntry {
    subMesh: FoliageSubMesh;
    subIndex: number;
    culledGPU: GPUBuffer;
    indirectGPU: GPUBuffer;
    distanceSq: number;
    maxInstances: number;
}

/**
 * [KO] 식생 4단계 렌더 패스 엔코더 & 드로우콜 최적화 렌더러 (단일 책임: 렌더 패스 순회 & 상태 캐싱 커맨드 엔코딩)
 * [EN] Foliage 4-Step Render Pass Encoder & DrawCall Optimizer (Single Responsibility: Pass Traversal & State-Cached Encoding)
 */
class FoliageRenderer {
    #redGPUContext: RedGPUContext;
    #pipelineRegistry: FoliagePipelineRegistry;
    #emptyBindGroup: GPUBindGroup | null = null;
    #subMeshVertexBindGroupLayout: GPUBindGroupLayout | null = null;

    // 🌟 Zero-GC: 드로우콜 간 중복 바인딩 스킵 상태 캐시
    #lastBoundPipeline: GPURenderPipeline | null = null;
    #lastBoundSystemBG: GPUBindGroup | null = null;
    #lastBoundMatBG: GPUBindGroup | null = null;
    #lastBoundInstanceBuffer: GPUBuffer | null = null;
    #lastBoundInstanceOffset: number = -1;

    // 🌟 Zero-GC: 투명(Transparent) 서브메시 정렬용 재사용 객체 풀
    readonly #transparentEntries: TransparentFoliageEntry[] = [];

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

    /**
     * 식생 4-Step 렌더 패스 엔코딩 실행
     */
    render(
        passEncoder: GPURenderPassEncoder,
        typeList: FoliageType[],
        view: any
    ): void {
        const typeCount = typeList.length;
        if (typeCount === 0) return;

        // 🌟 1. 드로우콜 바인딩 상태 캐시 초기화
        this.#lastBoundPipeline = null;
        this.#lastBoundSystemBG = null;
        this.#lastBoundMatBG = null;
        this.#lastBoundInstanceBuffer = null;
        this.#lastBoundInstanceOffset = -1;

        // View 및 System BindGroup
        const view3D = view as any;
        const antialiasingManager = view3D?.antialiasingManager;
        const sampleCount = antialiasingManager?.sampleCount ?? 1;
        const msaaID = antialiasingManager?.msaaID ?? 'NONE';
        const systemBG = view3D?.viewUniformBindGroup ?? null;

        // 카메라 위치 정보 (Transparent 거리 정렬용)
        const rawCamera = view3D?.rawCamera || view3D?.camera || view;
        const camX = rawCamera?.x ?? 0;
        const camY = rawCamera?.y ?? 0;
        const camZ = rawCamera?.z ?? 0;

        // 🌟 Step 0: 근거리(LOD 0) Masked 잎사귀 서브메시의 선행 깊이 패스 (Depth Pre-pass)
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
                if (sub.isDepthPrepass) {
                    this.#drawSubMesh(passEncoder, sub, s, sampleCount, msaaID, systemBG, indirectGPU, culledGPU, foliageType.options.maxInstances, 'depthPrepass');
                }
            }
        }

        // 🌟 Step 1: 모든 FoliageType의 불투명(Opaque/Masked) 서브메시지 본 렌더링 (Main Shading Pass)
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

        // 🌟 Step 2: 모든 FoliageType의 Alpha Layer 서브메시지 렌더링
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

        // 🌟 Step 3: Transparent Layer (카메라 거리 기준 Back-to-Front 정렬 후 렌더링)
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
            // 🌟 100% Zero-GC In-place Insertion Sort (거리 내림차순: 먼 것 먼저)
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

            let currentCulledGPU: GPUBuffer | null = null;
            for (let i = 0; i < transCount; i++) {
                const item = entries[i];
                if (currentCulledGPU !== item.culledGPU) {
                    passEncoder.setVertexBuffer(1, item.culledGPU);
                    currentCulledGPU = item.culledGPU;
                }
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

        // 🌟 1. Pipeline 상태 캐싱
        if (this.#lastBoundPipeline !== pipeline) {
            passEncoder.setPipeline(pipeline);
            this.#lastBoundPipeline = pipeline;
        }

        // 🌟 2. Group 0 (System Uniforms)
        if (systemBG && this.#lastBoundSystemBG !== systemBG) {
            passEncoder.setBindGroup(0, systemBG);
            this.#lastBoundSystemBG = systemBG;
        }

        // 🌟 3. Group 1 (SubMesh 상대 변환)
        const vertexUniformBG = sub.vertexUniformBindGroup || this.#emptyBindGroup;
        if (vertexUniformBG) {
            passEncoder.setBindGroup(1, vertexUniformBG);
        }

        // 🌟 4. Group 2 (머티리얼 유니폼)
        const matUniformBG = material.gpuRenderInfo?.fragmentUniformBindGroup;
        if (matUniformBG && this.#lastBoundMatBG !== matUniformBG) {
            passEncoder.setBindGroup(2, matUniformBG);
            this.#lastBoundMatBG = matUniformBG;
        }

        // 🌟 5. Buffer 0 (지오메트리 버텍스)
        passEncoder.setVertexBuffer(0, vertexGPUBuffer);

        // 🌟 6. Buffer 1 (인스턴스 버텍스 버퍼 상태 캐싱)
        const isBillboard = sub.lodIndex === 1;
        const instanceBufferOffset = isBillboard ? (maxInstances * 48) : 0;
        if (this.#lastBoundInstanceBuffer !== culledGPUBuffer || this.#lastBoundInstanceOffset !== instanceBufferOffset) {
            passEncoder.setVertexBuffer(1, culledGPUBuffer, instanceBufferOffset);
            this.#lastBoundInstanceBuffer = culledGPUBuffer;
            this.#lastBoundInstanceOffset = instanceBufferOffset;
        }

        const indirectOffsetBytes = subIndex * 20;
        if (sub.isIndexed && sub.geometry.indexBuffer?.gpuBuffer) {
            const format = sub.indexFormat || 'uint32';
            passEncoder.setIndexBuffer(sub.geometry.indexBuffer.gpuBuffer, format);
            passEncoder.drawIndexedIndirect(indirectGPUBuffer, indirectOffsetBytes);
        } else {
            passEncoder.drawIndirect(indirectGPUBuffer, indirectOffsetBytes);
        }
    }
}

Object.freeze(FoliageRenderer);
export default FoliageRenderer;
