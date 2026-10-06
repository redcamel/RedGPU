/**
 * [KO] 식생 옥타헤드럴 임포스터 서브메시 빌더 모듈입니다.
 * [EN] Foliage octahedral impostor sub-mesh builder module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import {createOctahedralImpostorGeometry} from "../../impostor/octahedral/createOctahedralImpostorGeometry";
import OctahedralImpostorMaterial from "../../impostor/octahedral/OctahedralImpostorMaterial";
import bakeFoliageImpostor from "../../impostor/bakeFoliageImpostor";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import type {FoliageLODInfo, FoliageOptions} from "../../Foliage";
import {PBR_STRIDE_BYTES} from "../../../../core/scatter/ScatterVertexFormats";
import createFoliageSubMeshInstance from "./createFoliageSubMeshInstance";
import {FoliageSubMeshSlotPooler} from "../../submesh/FoliageSubMeshSlotPooler";

const identityMatrix: mat4 = mat4.create();

/**
 * [KO] LOD 0 서브메쉬를 기반으로 옥타헤드럴 임포스터를 베이킹하고, 마지막 LOD에 단일 임포스터 서브메쉬를 생성 및 부착합니다.
 * [EN] Bakes octahedral impostors based on LOD 0 sub-meshes and creates/attaches a single impostor sub-mesh to the last LOD.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param options -
 * [KO] 식생 설정 옵션
 * [EN] Foliage configuration options
 * @param sourceSubMeshes -
 * [KO] 베이킹 소스로 사용할 LOD 0 서브메시 목록
 * [EN] LOD 0 sub-mesh list used as baking source
 * @param subMeshes -
 * [KO] 서브메시가 추가될 전체 서브메시 배열
 * [EN] Global sub-mesh array to append the impostor sub-mesh to
 * @param lodInfoList -
 * [KO] LOD 메타데이터가 추가될 배열
 * [EN] LOD metadata array to append the impostor LOD to
 * @param impostorLODIndex -
 * [KO] 임포스터가 배치될 LOD 인덱스
 * [EN] LOD index where the impostor will be assigned
 * @param slotPooler -
 * [KO] 서브메시 슬롯 풀러 (선택사항)
 * [EN] Sub-mesh slot pooler (optional)
 * @param megaUBO -
 * [KO] 메가 UBO 버퍼 (선택사항)
 * [EN] Mega UBO buffer (optional)
 */
export default function buildFoliageImpostorSubMesh(
    redGPUContext: RedGPUContext,
    options: FoliageOptions,
    sourceSubMeshes: FoliageSubMesh[],
    subMeshes: FoliageSubMesh[],
    lodInfoList: FoliageLODInfo[],
    impostorLODIndex: number,
    slotPooler?: FoliageSubMeshSlotPooler | null,
    megaUBO?: GPUBuffer | null
): void {
    const gpuDevice = redGPUContext.gpuDevice;
    const bakeResult = bakeFoliageImpostor(redGPUContext, sourceSubMeshes, options.name);

    const bbWidth = bakeResult.width;
    const bbHeight = bakeResult.height;
    const bbBottomOffset = bakeResult.bottomOffset ?? 0;

    const bbGeom = createOctahedralImpostorGeometry(redGPUContext, bbWidth, bbHeight, bbBottomOffset);
    const bbMat = new OctahedralImpostorMaterial(
        redGPUContext,
        bakeResult.baseColorTexture,
        bakeResult.normalTexture,
        bakeResult.packedORMTexture,
        `${options.name}_OctahedralMat`
    );

    const bbStartOffset = subMeshes.length;
    const bbSubMesh = createFoliageSubMeshInstance({
        gpuDevice,
        meshNode: sourceSubMeshes[0]?.mesh,
        geom: bbGeom,
        mat: bbMat,
        relMatrix: identityMatrix,
        normMatrix: identityMatrix,
        strideBytes: PBR_STRIDE_BYTES,
        lodIndex: impostorLODIndex,
        isImpostorOverride: true,
        bottomOffset: bbBottomOffset,
        receiveShadow: false,
        windMultiplier: options.windMultiplier,
        windFlutterMultiplier: options.windFlutterMultiplier,
        treeHeight: bbHeight,
        slotPooler,
        megaUBO
    });
    subMeshes.push(bbSubMesh);

    lodInfoList.push({
        lodIndex: impostorLODIndex,
        lodDistance: 1000000.0,
        subMeshOffset: bbStartOffset,
        subMeshCount: 1,
        receiveShadow: false,
    });
}
