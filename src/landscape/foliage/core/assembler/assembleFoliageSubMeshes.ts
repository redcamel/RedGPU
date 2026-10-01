/**
 * [KO] Foliage 계층 모델의 서브메쉬 조립, LOD 분기, 옥타헤드럴 임포스터 베이킹 및 섀도우 지오메트리 결합 모듈입니다.
 * [EN] Sub-mesh assembly, LOD branching, octahedral impostor baking, and shadow geometry combination module for Foliage models.
 *
 * @packageDocumentation
 */

import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import FoliageSubMesh from "../submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../submesh/FoliageShadowMergedSubMesh";
import type {FoliageLODInfo, FoliageOptions} from "../Foliage";
import assembleFoliageLODMeshes from "./internal/assembleFoliageLODMeshes";
import buildFoliageImpostorSubMesh from "./internal/buildFoliageImpostorSubMesh";
import type {FoliageSubMeshUniformResult} from "./internal/createFoliageSubMeshUniform";

export interface FoliageAssemblyResult {
    subMeshes: FoliageSubMesh[];
    unifiedGeometries: (Geometry | null)[];
    shadowMergedSubMeshes: FoliageShadowMergedSubMesh[];
    lodInfoList: FoliageLODInfo[];
    bottomOffset: number;
    boundingRadius: number;
    boundingHeight: number;
}

/**
 * [KO] Foliage 계층 모델의 서브메쉬들을 LOD별 단일 통합 버퍼로 조립하고, 옥타헤드럴 임포스터 및 섀도우 지오메트리를 생성합니다.
 * [EN] Combines sub-meshes of Foliage hierarchical models into per-LOD unified buffers and generates impostor and shadow geometries.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param options -
 * [KO] 식생 생성 및 LOD 구성 설정 옵션
 * [EN] Foliage creation and LOD configuration options
 * @param subMeshBindGroupLayout -
 * [KO] 서브메쉬 유니폼 바인드 그룹 레이아웃
 * [EN] Sub-mesh uniform bind group layout
 * @returns
 * [KO] 조립된 서브메쉬, 섀도우 머지드 서브메쉬 및 LOD 정보 구조체
 * [EN] Assembled sub-meshes, shadow merged sub-meshes, and LOD info structure
 */
export default function assembleFoliageSubMeshes(
    redGPUContext: RedGPUContext,
    options: FoliageOptions,
    subMeshBindGroupLayout: GPUBindGroupLayout
): FoliageAssemblyResult {
    const gpuDevice = redGPUContext.gpuDevice;
    const subList: FoliageSubMesh[] = [];
    const unifiedGeometries: (Geometry | null)[] = [];
    const lodInfoList: FoliageLODInfo[] = [];

    if (!gpuDevice || !subMeshBindGroupLayout) {
        return {
            subMeshes: subList,
            unifiedGeometries: [],
            shadowMergedSubMeshes: [],
            lodInfoList: [],
            bottomOffset: 0,
            boundingRadius: 10.0,
            boundingHeight: 10.0
        };
    }

    const useImpostor = options.useImpostor !== undefined ? options.useImpostor : true;
    const lodConfigs = options.lods || [];
    const numLODs = Math.min(lodConfigs.length, 8);

    const shadowMergedSubMeshes: FoliageShadowMergedSubMesh[] = [];
    const subMeshUniformCache = new Map<string, FoliageSubMeshUniformResult>();

    let maxBoundingRadius = 0;
    let globalMinY = Infinity;
    let globalMaxY = -Infinity;

    for (let l = 0; l < numLODs; l++) {
        const lodCfg = lodConfigs[l];
        const lodMeshes = Array.isArray(lodCfg.mesh) ? lodCfg.mesh : [lodCfg.mesh];
        const startSubOffset = subList.length;
        const lodReceiveShadow = lodCfg.receiveShadow !== false;

        const assembled = assembleFoliageLODMeshes(
            redGPUContext,
            lodMeshes,
            l,
            options,
            subMeshBindGroupLayout,
            subMeshUniformCache,
            lodReceiveShadow
        );

        unifiedGeometries.push(assembled.unifiedGeometry || null);

        const assembledSubMeshes = assembled.subMeshes;
        for (let s = 0; s < assembledSubMeshes.length; s++) {
            subList.push(assembledSubMeshes[s]);
        }

        if (assembled.shadowMergedSubMesh) {
            shadowMergedSubMeshes.push(assembled.shadowMergedSubMesh);
        }

        if (assembled.boundingRadius > maxBoundingRadius) {
            maxBoundingRadius = assembled.boundingRadius;
        }
        if (isFinite(assembled.minY) && assembled.minY < globalMinY) {
            globalMinY = assembled.minY;
        }
        if (isFinite(assembled.maxY) && assembled.maxY > globalMaxY) {
            globalMaxY = assembled.maxY;
        }

        const subCountForThisLOD = subList.length - startSubOffset;
        const defaultDist = (l === 0) ? 80.0 : (80.0 * Math.pow(2.5, l));
        const switchDist = lodCfg.lodDistance ?? defaultDist;

        lodInfoList.push({
            lodIndex: l,
            lodDistance: switchDist,
            subMeshOffset: startSubOffset,
            subMeshCount: subCountForThisLOD,
            receiveShadow: lodReceiveShadow,
        });
    }

    if (useImpostor && subList.length > 0) {
        const impostorLODIndex = lodInfoList.length;
        const lod0SubMeshes: FoliageSubMesh[] = [];
        for (let i = 0; i < subList.length; i++) {
            if (subList[i].lodIndex === 0) {
                lod0SubMeshes.push(subList[i]);
            }
        }

        buildFoliageImpostorSubMesh(
            redGPUContext,
            gpuDevice,
            subMeshBindGroupLayout,
            options,
            lod0SubMeshes,
            subList,
            lodInfoList,
            impostorLODIndex,
            subMeshUniformCache
        );
    }

    const boundingRadius = maxBoundingRadius;
    const boundingHeight = (isFinite(globalMinY) && isFinite(globalMaxY) && globalMaxY > globalMinY)
        ? (globalMaxY - globalMinY)
        : (boundingRadius > 0 ? boundingRadius * 2.0 : 1.0);

    const userOffset = options.bottomOffset;
    const finalBottomOffset = userOffset !== undefined ? userOffset : 0;

    return {
        subMeshes: subList,
        unifiedGeometries,
        shadowMergedSubMeshes,
        lodInfoList,
        bottomOffset: finalBottomOffset,
        boundingRadius,
        boundingHeight,
    };
}
