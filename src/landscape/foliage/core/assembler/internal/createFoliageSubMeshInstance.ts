import {mat4} from "gl-matrix";
import Mesh from "../../../../../display/mesh/Mesh";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import OctahedralImpostorMaterial from "../../impostor/octahedral/OctahedralImpostorMaterial";
import type {FoliageDepthPassMode} from "../../pipeline/FoliagePipelineRegistry";
import {createFoliagePBRSubMeshUniform, type FoliageSubMeshUniformResult} from "./createFoliageSubMeshUniform";

export interface CreateSubMeshOptions {
    gpuDevice: GPUDevice;
    subMeshBindGroupLayout: GPUBindGroupLayout;
    meshNode: Mesh;
    geom: any;
    mat: any;
    relMatrix: mat4;
    normMatrix: mat4;
    strideBytes: number;
    lodIndex?: number;
    isImpostorOverride?: boolean;
    bottomOffset?: number;
    receiveShadow?: boolean;
    uniformCache?: Map<string, FoliageSubMeshUniformResult>;
    maxPrepassLOD?: number;
    groundBlendStrength?: number;
    groundBlendRange?: number;
}

/**
 * [KO] 재질 및 지오메트리 데이터를 분석하여 최적화된 FoliageSubMesh 인스턴스를 생성하고 유니폼 버퍼를 설정/캐싱합니다.
 * [EN] Analyzes material and geometry data to create an optimized FoliageSubMesh instance, configuring/caching uniform buffers.
 */
export default function createFoliageSubMeshInstance(
    options: CreateSubMeshOptions
): FoliageSubMesh {
    const {
        gpuDevice,
        subMeshBindGroupLayout,
        meshNode,
        geom,
        mat,
        relMatrix,
        normMatrix,
        strideBytes,
        lodIndex = 0,
        isImpostorOverride = false,
        bottomOffset = 0,
        receiveShadow = true,
        uniformCache,
        maxPrepassLOD = 0,
        groundBlendStrength,
        groundBlendRange
    } = options;

    const isIndexed = !!geom.indexBuffer;
    const indexCount = geom.indexBuffer?.indexCount ?? 0;
    const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;

    const isImpostor = isImpostorOverride || mat instanceof OctahedralImpostorMaterial || mat?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof mat?.name === 'string' && mat.name.includes('Octahedral'));
    const isMasked = !!mat.useCutOff || mat.alphaBlend === 1 || mat.alphaBlend === 2 || !!mat.transparent || isImpostor;

    const globalSlot = (mat as any)?.globalFragmentSlotIndex ?? 0;
    const cacheKey = `${globalSlot}_${receiveShadow ? 1 : 0}_${isMasked ? 1 : 0}`;

    let uniformBuffer: GPUBuffer;
    let vertexBindGroup: GPUBindGroup;

    if (uniformCache && uniformCache.has(cacheKey)) {
        const cached = uniformCache.get(cacheKey)!;
        uniformBuffer = cached.buffer;
        vertexBindGroup = cached.bindGroup;
    } else {
        const uniformResult = createFoliagePBRSubMeshUniform(
            gpuDevice,
            subMeshBindGroupLayout,
            relMatrix,
            normMatrix,
            globalSlot,
            receiveShadow,
            isMasked,
            !isImpostor,
            groundBlendStrength,
            groundBlendRange
        );
        uniformBuffer = uniformResult.buffer;
        vertexBindGroup = uniformResult.bindGroup;

        if (uniformCache) {
            uniformCache.set(cacheKey, uniformResult);
        }
    }

    const hasBaseColorTexture = !!(mat.baseColorTexture?.gpuTexture || mat.baseColorTexture?.src || mat.baseColorTexture?.url || (mat.diffuseTexture && (mat.diffuseTexture.gpuTexture || mat.diffuseTexture.src || mat.diffuseTexture.url)));

    const isMaskedFoliage = !isImpostor && isMasked && hasBaseColorTexture;
    const isDepthPrepass = isMaskedFoliage && (lodIndex <= maxPrepassLOD);
    const isMainOpaqueOrMasked = true;
    const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

    return new FoliageSubMesh({
        mesh: meshNode,
        geometry: geom,
        material: mat,
        indexCount,
        vertexCount,
        isIndexed,
        indexFormat: geom.indexBuffer?.format || 'uint32',
        strideBytes,
        bottomOffset,
        relativeModelMatrix: relMatrix,
        relativeNormalMatrix: normMatrix,
        vertexUniformBuffer: uniformBuffer,
        vertexUniformBindGroup: vertexBindGroup,
        lodIndex,
        isDepthPrepass,
        isMainOpaqueOrMasked,
        isMasked,
        mainDepthMode,
        isImpostor,
        receiveShadow,
        instanceBufferOffset: 0,
        indirectOffsetBytes: 0,
    });
}
