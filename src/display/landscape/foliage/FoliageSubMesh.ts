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
    readonly isMasked: boolean;
    readonly mainDepthMode: FoliageDepthPassMode;
    isImpostor: boolean;
    impostorWidth: number;
    impostorHeight: number;

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

        this.instanceBufferOffset = init.instanceBufferOffset ?? 0;
        this.indirectOffsetBytes = init.indirectOffsetBytes ?? 0;
    }

    /**
     * [KO] 지정된 섀도우 패스 모드에서 픽셀 셰이더(shadowMain - discard)가 필요한지 여부를 반환합니다.
     * [EN] Returns whether fragment shader (shadowMain - discard) is needed for the specified shadow pass mode.
     */
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

        // 🚀 [최적화 P0 / Step 16 - 렌더 루프 파이프라인 키 문자열 템플릿 생성 100% 박멸 (Zero-GC)]
        // 매 프레임 수만 번 호출되는 렌더 루프에서 `${msaaID}_${depthPassMode}` 문자열 힙 생성을 완전 제거하고,
        // 2단계 모드 객체 프로퍼티 룩업을 통해 V8 인라인 캐시(IC) 나노초 단위 참조 및 완전 Zero-Allocation 달성!
        let modeMap = this.#pipelineCacheByMode[msaaID];
        if (!modeMap) {
            modeMap = {};
            this.#pipelineCacheByMode[msaaID] = modeMap;
        }

        let pipeline = modeMap[depthPassMode];
        if (!pipeline) {
            // 🌟 [섀도우 패스 전면 백페이스 컬링 강제 (Zero-Overhead 50% 가속)]
            // 그림자 패스에서는 광원 기준 깊이(Z)만을 기록하므로, 기둥/잎사귀/원경/근경 예외 없이
            // 무조건 더블사이드를 끄고 'back' 컬링을 강제하여 래스터라이저의 지오메트리 처리량을 50% 일괄 절감합니다.
            // 메인 뷰 패스에서만 LOD 0의 material.doubleSided를 허용합니다.
            const isShadowPass = (depthPassMode === 'shadow' || depthPassMode === 'shadowOpaque');
            const isLOD0 = (this.lodIndex === 0);
            const cullMode: GPUCullMode = isShadowPass
                ? 'back'
                : ((isLOD0 && material.doubleSided) ? 'none' : (material.cullMode ?? 'back'));

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

    draw(passEncoder: GPURenderPassEncoder, indirectGPUBuffer: GPUBuffer, offsetBytes?: number): void {
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
