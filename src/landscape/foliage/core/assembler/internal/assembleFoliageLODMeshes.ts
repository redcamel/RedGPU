import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../../display/mesh/Mesh";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../../submesh/FoliageShadowMergedSubMesh";
import type {FoliageOptions} from "../../Foliage";
import LandscapeMeshCombiner from "../../../../core/geometry/LandscapeMeshCombiner";
import {PBR_STRIDE_BYTES, POSITION_ONLY_STRIDE_BYTES} from "../../../../core/geometry/LandscapeVertexFormats";
import prepareFoliageMaterials from "./prepareFoliageMaterials";
import createFoliageSubMeshInstance from "./createFoliageSubMeshInstance";
import {createShadowSubMeshUniform, type SubMeshUniformResult} from "./createSubMeshUniform";

const identityMatrix: mat4 = mat4.create();

export interface AssembledLODResult {
    subMeshes: FoliageSubMesh[];
    shadowMergedSubMesh: FoliageShadowMergedSubMesh | null;
    boundingRadius: number;
    boundingHeight: number;
    minY: number;
    maxY: number;
}

/**
 * [KO] 단일 LOD 레벨의 메쉬들을 결합하고 PBR 서브메쉬 및 섀도우 머지드 서브메쉬를 생성합니다.
 * [EN] Combines meshes for a single LOD level, creating PBR sub-meshes and shadow merged sub-meshes.
 */
export default function assembleFoliageLODMeshes(
    redGPUContext: RedGPUContext,
    roots: Mesh[],
    lodIndex: number,
    options: FoliageOptions,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    subMeshUniformCache?: Map<string, SubMeshUniformResult>,
    lodReceiveShadow: boolean = true
): AssembledLODResult {
    const gpuDevice = redGPUContext.gpuDevice;

    for (let r = 0; r < roots.length; r++) {
        prepareFoliageMaterials(roots[r]);
    }

    const combineResult = LandscapeMeshCombiner.combine(
        redGPUContext,
        roots,
        {
            preservePivot: options.preservePivot ?? true,
            centerXZ: true,
            generateShadowMergedGeometry: true
        }
    );

    if (combineResult.groups.length === 0) {
        return {
            subMeshes: [],
            shadowMergedSubMesh: null,
            boundingRadius: 0,
            boundingHeight: 0,
            minY: 0,
            maxY: 0
        };
    }

    const resultSubMeshes: FoliageSubMesh[] = [];

    for (let g = 0; g < combineResult.groups.length; g++) {
        const group = combineResult.groups[g];
        const combinedSubMesh = createFoliageSubMeshInstance({
            gpuDevice,
            subMeshBindGroupLayout,
            meshNode: group.rawNodes[0]?.node,
            geom: group.geometry,
            mat: group.material,
            relMatrix: identityMatrix,
            normMatrix: identityMatrix,
            strideBytes: PBR_STRIDE_BYTES,
            lodIndex,
            isImpostorOverride: false,
            bottomOffset: 0,
            receiveShadow: lodReceiveShadow,
            uniformCache: subMeshUniformCache,
            maxPrepassLOD: 0,
            groundBlendStrength: options.groundBlendStrength,
            groundBlendRange: options.groundBlendRange
        });

        resultSubMeshes.push(combinedSubMesh);
    }

    let shadowMergedSubMesh: FoliageShadowMergedSubMesh | null = null;
    if (combineResult.shadowMergedGeometry && combineResult.totalVertexCount > 0) {
        const shadowUniform = createShadowSubMeshUniform(
            gpuDevice,
            subMeshBindGroupLayout,
            options.name,
            lodIndex
        );

        shadowMergedSubMesh = new FoliageShadowMergedSubMesh({
            geometry: combineResult.shadowMergedGeometry,
            indexCount: combineResult.totalIndexCount,
            vertexCount: combineResult.totalVertexCount,
            isIndexed: true,
            indexFormat: 'uint32',
            strideBytes: POSITION_ONLY_STRIDE_BYTES,
            vertexUniformBuffer: shadowUniform.buffer,
            vertexUniformBindGroup: shadowUniform.bindGroup,
            lodIndex,
            instanceBufferOffset: 0,
            indirectOffsetBytes: 0,
        });
    }

    return {
        subMeshes: resultSubMeshes,
        shadowMergedSubMesh,
        boundingRadius: combineResult.boundingRadius,
        boundingHeight: combineResult.boundingHeight,
        minY: combineResult.minY,
        maxY: combineResult.maxY,
    };
}
