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

/**
 * [KO] 식생 서브메쉬 조립 결과 인터페이스입니다.
 * [EN] Foliage sub-mesh assembly result interface.
 */
export interface FoliageAssemblyResult {
    /**
     * [KO] 조립된 전체 서브메시 배열
     * [EN] Array of all assembled sub-meshes
     */
    subMeshes: FoliageSubMesh[];
    /**
     * [KO] LOD 레벨별 단일 통합 지오메트리 배열
     * [EN] Array of per-LOD unified geometries
     */
    unifiedGeometries: (Geometry | null)[];
    /**
     * [KO] 그림자 패스 전용 통합 서브메시 배열
     * [EN] Array of shadow pass dedicated merged sub-meshes
     */
    shadowMergedSubMeshes: FoliageShadowMergedSubMesh[];
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
    subMeshBindGroupLayout: GPUBindGroupLayout,
    globalWindBuffer?: GPUBuffer | null
): FoliageAssemblyResult {
    const gpuDevice = redGPUContext.gpuDevice;
    const subMeshes: FoliageSubMesh[] = [];
    const unifiedGeometries: (Geometry | null)[] = [];
    const lodInfoList: FoliageLODInfo[] = [];

    if (!gpuDevice || !subMeshBindGroupLayout) {
        return {
            subMeshes: subMeshes,
            unifiedGeometries: [],
            shadowMergedSubMeshes: [],
            lodInfoList: [],
            bottomOffset: 0,
            boundingRadius: 10.0,
            boundingHeight: 10.0
        };
    }

    const windBuffer = globalWindBuffer || gpuDevice.createBuffer({
        label: 'Foliage_Dummy_WindBuffer',
        size: 32,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

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
        const startSubOffset = subMeshes.length;
        const lodReceiveShadow = lodCfg.receiveShadow !== false;

        const assembled = assembleFoliageLODMeshes(
            redGPUContext,
            lodMeshes,
            l,
            options,
            subMeshBindGroupLayout,
            windBuffer,
            subMeshUniformCache,
            lodReceiveShadow
        );

        unifiedGeometries.push(assembled.unifiedGeometry || null);

        const assembledSubMeshes = assembled.subMeshes;
        for (let s = 0; s < assembledSubMeshes.length; s++) {
            subMeshes.push(assembledSubMeshes[s]);
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

        const subCountForThisLOD = subMeshes.length - startSubOffset;
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

    if (useImpostor && subMeshes.length > 0) {
        const impostorLODIndex = lodInfoList.length;
        const lod0SubMeshes: FoliageSubMesh[] = [];
        for (let i = 0; i < subMeshes.length; i++) {
            if (subMeshes[i].lodIndex === 0) {
                lod0SubMeshes.push(subMeshes[i]);
            }
        }

        buildFoliageImpostorSubMesh(
            redGPUContext,
            gpuDevice,
            subMeshBindGroupLayout,
            windBuffer,
            options,
            lod0SubMeshes,
            subMeshes,
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
        subMeshes: subMeshes,
        unifiedGeometries,
        shadowMergedSubMeshes,
        lodInfoList,
        bottomOffset: finalBottomOffset,
        boundingRadius,
        boundingHeight,
    };
}
