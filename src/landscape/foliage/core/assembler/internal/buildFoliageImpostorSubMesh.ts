import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import {createOctahedralImpostorGeometry} from "../../../../core/geometry/createOctahedralImpostorGeometry";
import OctahedralImpostorMaterial from "../../impostor/octahedral/OctahedralImpostorMaterial";
import FoliageImpostorBaker from "../../impostor/FoliageImpostorBaker";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import type {FoliageLODInfo, FoliageOptions} from "../../Foliage";
import {PBR_STRIDE_BYTES} from "../../../../core/geometry/LandscapeVertexFormats";
import createFoliageSubMeshInstance from "./createFoliageSubMeshInstance";
import type {SubMeshUniformResult} from "./createSubMeshUniform";

/**
 * [KO] LOD 0 서브메쉬를 기반으로 옥타헤드럴 임포스터를 베이킹하고, 마지막 LOD에 단일 임포스터 서브메쉬를 생성 및 부착합니다.
 * [EN] Bakes octahedral impostors based on LOD 0 sub-meshes and creates/attaches a single impostor sub-mesh to the last LOD.
 */
export default function buildFoliageImpostorSubMesh(
    redGPUContext: RedGPUContext,
    gpuDevice: GPUDevice,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    options: FoliageOptions,
    sourceSubMeshes: FoliageSubMesh[],
    subList: FoliageSubMesh[],
    lodInfoList: FoliageLODInfo[],
    impostorLODIndex: number,
    subMeshUniformCache?: Map<string, SubMeshUniformResult>
): void {
    const bakeResult = FoliageImpostorBaker.bakeSubMeshes(redGPUContext, sourceSubMeshes, options.name);

    const bbWidth = bakeResult.width;
    const bbHeight = bakeResult.height;
    const bbBottomOffset = bakeResult.bottomOffset ?? 0;

    const bbGeom = createOctahedralImpostorGeometry(redGPUContext, bbWidth, bbHeight, bbBottomOffset);
    const bbMat = new OctahedralImpostorMaterial(
        redGPUContext,
        bakeResult.baseColorTexture,
        bakeResult.normalTexture,
        bakeResult.packedORMTexture,
        `${options.name}_OctahedralMat`,
        8.0
    );

    const bbStartOffset = subList.length;
    const bbSubMesh = createFoliageSubMeshInstance({
        gpuDevice,
        subMeshBindGroupLayout,
        meshNode: sourceSubMeshes[0]?.mesh,
        geom: bbGeom,
        mat: bbMat,
        relMatrix: mat4.create(),
        normMatrix: mat4.create(),
        strideBytes: PBR_STRIDE_BYTES,
        lodIndex: impostorLODIndex,
        isImpostorOverride: true,
        bottomOffset: bbBottomOffset,
        receiveShadow: false,
        uniformCache: subMeshUniformCache
    });
    subList.push(bbSubMesh);

    lodInfoList.push({
        lodIndex: impostorLODIndex,
        lodDistance: 1000000.0,
        subMeshOffset: bbStartOffset,
        subMeshCount: 1,
        receiveShadow: false,
    });
}
