/**
 * [KO] Foliage 계층 모델의 렌더 단위(Render Unit) 조립, LOD 분기, 옥타헤드럴 임포스터 베이킹 및 섀도우 지오메트리 결합 모듈입니다.
 * [EN] Render unit assembly, LOD branching, octahedral impostor baking, and shadow geometry combination module for Foliage models.
 *
 * @packageDocumentation
 */

import RedGPUContext from "../../../../context/RedGPUContext";
import FoliageRenderUnit from "../renderUnit/FoliageRenderUnit";
import type {FoliageLODInfo, FoliageOptions} from "../Foliage";
import assembleFoliageLODMeshes from "./internal/assembleFoliageLODMeshes";
import buildFoliageImpostorRenderUnit from "./internal/buildFoliageImpostorRenderUnit";
import {FoliageSlotPooler} from "../buffer/FoliageSlotPooler";

/**
 * [KO] 식생 렌더 단위 조립 결과 인터페이스입니다.
 * [EN] Foliage render unit assembly result interface.
 */
export interface FoliageAssemblyResult {
    /**
     * [KO] 조립된 전체 렌더 단위 배열
     * [EN] Array of all assembled render units
     */
    renderUnits: FoliageRenderUnit[];
    /**
     * [KO] 그림자 패스 전용 통합 렌더 단위 배열
     * [EN] Array of shadow pass dedicated merged render units
     */
    shadowMergedRenderUnits: FoliageRenderUnit[];
    /**
     * [KO] LOD 레벨별 메타데이터 목록
     * [EN] List of per-LOD metadata
     */
    lodInfoList: FoliageLODInfo[];
    /**
     * [KO] 밑둥 피벗 보정 오프셋 (미터)
     * [EN] Bottom pivot correction offset in meters
     */
    bottomOffset: number;
    /**
     * [KO] 식생 모델의 최대 바운딩 구체 반경 (미터)
     * [EN] Maximum bounding sphere radius in meters of the foliage model
     */
    boundingRadius: number;
    /**
     * [KO] 식생 모델의 바운딩 높이 (미터)
     * [EN] Bounding height in meters of the foliage model
     */
    boundingHeight: number;
}

/**
 * [KO] Foliage 계층 모델의 렌더 단위들을 LOD별 단일 통합 버퍼로 조립하고, 옥타헤드럴 임포스터 및 섀도우 지오메트리를 생성합니다.
 * [EN] Assembles render units of Foliage models into unified per-LOD buffers, creating octahedral impostors and shadow geometries.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param options -
 * [KO] 식생 설정 옵션
 * [EN] Foliage configuration options
 * @param slotPooler -
 * [KO] 256B 정렬 Dynamic Offset UBO 슬롯 풀러 (선택사항)
 * [EN] 256B aligned Dynamic Offset UBO slot pooler (optional)
 * @returns
 * [KO] 조립 완료된 식생 렌더 단위 및 LOD 정보
 * [EN] Assembled foliage render units and LOD information
 */
export default function assembleFoliageRenderUnits(
    redGPUContext: RedGPUContext,
    options: FoliageOptions,
    slotPooler?: FoliageSlotPooler | null
): FoliageAssemblyResult {
    const gpuDevice = redGPUContext.gpuDevice;
    const renderUnits: FoliageRenderUnit[] = [];
    const lodInfoList: FoliageLODInfo[] = [];

    if (!gpuDevice) {
        return {
            renderUnits: [],
            shadowMergedRenderUnits: [],
            lodInfoList: [],
            bottomOffset: 0,
            boundingRadius: 10.0,
            boundingHeight: 10.0
        };
    }

    const {useImpostor = true, lods = []} = options;
    const numLODs = Math.min(lods.length, 8);

    const shadowMergedRenderUnits: FoliageRenderUnit[] = [];
    let maxBoundingRadius = 0;
    let globalMinY = Infinity;
    let globalMaxY = -Infinity;

    for (let l = 0; l < numLODs; l++) {
        const lodCfg = lods[l];
        const {mesh, receiveShadow = true} = lodCfg;
        const lodMeshes = Array.isArray(mesh) ? mesh : [mesh];
        const startSubOffset = renderUnits.length;
        const lodReceiveShadow = receiveShadow !== false;

        const assembled = assembleFoliageLODMeshes(
            redGPUContext,
            lodMeshes,
            l,
            options,
            lodReceiveShadow,
            slotPooler
        );

        const assembledUnits = assembled.renderUnits;
        for (let s = 0; s < assembledUnits.length; s++) {
            renderUnits.push(assembledUnits[s]);
        }

        if (assembled.shadowMergedRenderUnit) {
            shadowMergedRenderUnits.push(assembled.shadowMergedRenderUnit);
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

        const unitCountForThisLOD = renderUnits.length - startSubOffset;
        const defaultDist = (l === 0) ? 80.0 : (80.0 * Math.pow(2.5, l));
        const switchDist = lodCfg.lodDistance ?? defaultDist;

        lodInfoList.push({
            lodIndex: l,
            lodDistance: switchDist,
            renderUnitOffset: startSubOffset,
            renderUnitCount: unitCountForThisLOD,
            receiveShadow: lodReceiveShadow,
        });
    }

    if (useImpostor && renderUnits.length > 0) {
        const impostorLODIndex = lodInfoList.length;
        const lod0RenderUnits: FoliageRenderUnit[] = [];
        for (let i = 0; i < renderUnits.length; i++) {
            if (renderUnits[i].lodIndex === 0) {
                lod0RenderUnits.push(renderUnits[i]);
            }
        }

        buildFoliageImpostorRenderUnit(
            redGPUContext,
            options,
            lod0RenderUnits,
            renderUnits,
            lodInfoList,
            impostorLODIndex,
            slotPooler
        );
    }

    const boundingHeight = (isFinite(globalMinY) && isFinite(globalMaxY))
        ? Math.max(0.1, globalMaxY - globalMinY)
        : (options.height || 2.0);

    return {
        renderUnits,
        shadowMergedRenderUnits,
        lodInfoList,
        bottomOffset: options.bottomOffset ?? 0,
        boundingRadius: maxBoundingRadius || 10.0,
        boundingHeight
    };
}
