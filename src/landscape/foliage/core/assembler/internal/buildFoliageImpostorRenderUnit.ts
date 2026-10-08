/**
 * [KO] 식생 옥타헤드럴 임포스터 렌더 단위(Render Unit) 빌더 모듈입니다.
 * [EN] Foliage octahedral impostor render unit builder module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import {createOctahedralImpostorGeometry} from "../../impostor/octahedral/createOctahedralImpostorGeometry";
import OctahedralImpostorMaterial from "../../impostor/octahedral/OctahedralImpostorMaterial";
import bakeFoliageImpostor from "../../impostor/bakeFoliageImpostor";
import type {FoliageLODInfo, FoliageOptions} from "../../Foliage";
import {PBR_STRIDE_BYTES} from "../../../../core/scatter/ScatterVertexFormats";
import {FoliageSlotPooler} from "../../buffer/FoliageSlotPooler";
import {FoliageRenderUnit} from "../../renderUnit/FoliageRenderUnit";
import createFoliageRenderUnitInstance from "./createFoliageRenderUnitInstance";

const identityMatrix: mat4 = mat4.create();

/**
 * [KO] LOD 0 렌더 단위를 기반으로 옥타헤드럴 임포스터를 베이킹하고, 마지막 LOD에 단일 임포스터 렌더 단위를 생성 및 부착합니다.
 * [EN] Bakes octahedral impostors based on LOD 0 render units and creates/attaches a single impostor render unit to the last LOD.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param options -
 * [KO] 식생 설정 옵션
 * [EN] Foliage configuration options
 * @param sourceRenderUnits -
 * [KO] 베이킹 소스로 사용할 LOD 0 렌더 단위 목록
 * [EN] LOD 0 render unit list used as baking source
 * @param renderUnits -
 * [KO] 렌더 단위가 추가될 전체 렌더 단위 배열
 * [EN] Global render unit array to append the impostor render unit to
 * @param lodInfoList -
 * [KO] LOD 메타데이터가 추가될 배열
 * [EN] LOD metadata array to append the impostor LOD to
 * @param impostorLODIndex -
 * [KO] 임포스터가 배치될 LOD 인덱스
 * [EN] LOD index where the impostor will be assigned
 * @param slotPooler -
 * [KO] 렌더 단위 슬롯 풀러 (선택사항)
 * [EN] Render unit slot pooler (optional)
 */
export default function buildFoliageImpostorRenderUnit(
    redGPUContext: RedGPUContext,
    options: FoliageOptions,
    sourceRenderUnits: FoliageRenderUnit[],
    renderUnits: FoliageRenderUnit[],
    lodInfoList: FoliageLODInfo[],
    impostorLODIndex: number,
    slotPooler?: FoliageSlotPooler | null
): void {
    const gpuDevice = redGPUContext.gpuDevice;
    const bakeResult = bakeFoliageImpostor(redGPUContext, sourceRenderUnits, options.name);

    const {width, height, bottomOffset = 0} = bakeResult;

    const bbGeom = createOctahedralImpostorGeometry(redGPUContext, width, height, bottomOffset);
    const bbMat = new OctahedralImpostorMaterial(
        redGPUContext,
        bakeResult.baseColorTexture,
        bakeResult.normalTexture,
        bakeResult.packedORMTexture,
        `${options.name}_OctahedralMat`
    );

    const bbStartOffset = renderUnits.length;
    const bbRenderUnit = createFoliageRenderUnitInstance({
        gpuDevice,
        meshNode: sourceRenderUnits[0]?.mesh,
        geom: bbGeom,
        mat: bbMat,
        relMatrix: identityMatrix,
        normMatrix: identityMatrix,
        strideBytes: PBR_STRIDE_BYTES,
        lodIndex: impostorLODIndex,
        isImpostorOverride: true,
        bottomOffset,
        receiveShadow: false,
        windMultiplier: options.windMultiplier,
        windFlutterMultiplier: options.windFlutterMultiplier,
        treeHeight: height,
        slotPooler
    });
    renderUnits.push(bbRenderUnit);

    lodInfoList.push({
        lodIndex: impostorLODIndex,
        lodDistance: 1000000.0,
        renderUnitOffset: bbStartOffset,
        renderUnitCount: 1,
        receiveShadow: false,
    });
}
