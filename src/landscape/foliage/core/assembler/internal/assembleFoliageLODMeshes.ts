/**
 * [KO] 식생 LOD 레벨별 메시 결합 및 서브메시 인스턴스 조립 모듈입니다.
 * [EN] Mesh combining and sub-mesh instance assembly module per foliage LOD level.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../../display/mesh/Mesh";
import Geometry from "../../../../../geometry/Geometry";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../../submesh/FoliageShadowMergedSubMesh";
import type {FoliageOptions} from "../../Foliage";
import {PBR_STRIDE_BYTES, POSITION_ONLY_STRIDE_BYTES} from "../../../../core/scatter/ScatterVertexFormats";
import combineScatterMeshes from "../../../../core/scatter/combineScatterMeshes";
import prepareFoliageMaterials from "./prepareFoliageMaterials";
import createFoliageSubMeshInstance from "./createFoliageSubMeshInstance";
import {FoliageSubMeshSlotPooler} from "../../submesh/FoliageSubMeshSlotPooler";

const identityMatrix: mat4 = mat4.create();

/**
 * [KO] 조립 완료된 LOD 레벨 결과 인터페이스입니다.
 * [EN] Interface representing the result of an assembled LOD level.
 */
export interface AssembledLODResult {
    /**
     * [KO] 조립된 서브메시 목록
     * [EN] List of assembled sub-meshes
     */
    subMeshes: FoliageSubMesh[];
    /**
     * [KO] 단일 결합된 통합 지오메트리
     * [EN] Single unified combined geometry
     */
    unifiedGeometry: Geometry | null;
    /**
     * [KO] 그림자 패스 전용 통합 서브메시
     * [EN] Merged sub-mesh dedicated to shadow pass
     */
    shadowMergedSubMesh: FoliageShadowMergedSubMesh | null;
    /**
     * [KO] 바운딩 구체 반경 (미터)
     * [EN] Bounding sphere radius in meters
     */
    boundingRadius: number;
    /**
     * [KO] 바운딩 높이 (미터)
     * [EN] Bounding height in meters
     */
    boundingHeight: number;
    /**
     * [KO] 모델 로컬 Y 최소값
     * [EN] Minimum local Y of the model
     */
    minY: number;
    /**
     * [KO] 모델 로컬 Y 최대값
     * [EN] Maximum local Y of the model
     */
    maxY: number;
}

/**
 * [KO] 단일 LOD 레벨에 속한 메시 노드들을 결합하고 PBR 서브메시 및 그림자용 통합 서브메시를 생성합니다.
 * [EN] Combines mesh nodes for a single LOD level, creating PBR sub-meshes and shadow merged sub-meshes.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param roots -
 * [KO] 조립 대상 루트 메시 배열
 * [EN] Array of root meshes to assemble
 * @param lodIndex -
 * [KO] 대상 LOD 단계 인덱스
 * [EN] Target LOD level index
 * @param options -
 * [KO] 식생 설정 옵션
 * [EN] Foliage configuration options
 * @param lodReceiveShadow -
 * [KO] 해당 LOD의 그림자 수신 여부 (기본값: true)
 * [EN] Whether the LOD level receives shadows (default: true)
 * @param slotPooler -
 * [KO] 256B 정렬 Dynamic Offset UBO 슬롯 풀러 (선택사항)
 * [EN] 256B aligned Dynamic Offset UBO slot pooler (optional)
 * @param megaUBO -
 * [KO] 단일 고정 메가 UBO 버퍼 (선택사항)
 * [EN] Single fixed mega UBO buffer (optional)
 * @returns
 * [KO] 조립 완료된 서브메시 및 바운딩 정보
 * [EN] Assembled sub-meshes and bounding information
 */
export default function assembleFoliageLODMeshes(
    redGPUContext: RedGPUContext,
    roots: Mesh[],
    lodIndex: number,
    options: FoliageOptions,
    lodReceiveShadow: boolean = true,
    slotPooler?: FoliageSubMeshSlotPooler | null,
    megaUBO?: GPUBuffer | null
): AssembledLODResult {
    const gpuDevice = redGPUContext.gpuDevice;

    for (let r = 0; r < roots.length; r++) {
        prepareFoliageMaterials(roots[r]);
    }

    const combineResult = combineScatterMeshes(
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
            unifiedGeometry: null,
            shadowMergedSubMesh: null,
            boundingRadius: 0,
            boundingHeight: 0,
            minY: 0,
            maxY: 0
        };
    }

    const resultSubMeshes: FoliageSubMesh[] = [];
    const unifiedGeometry = combineResult.unifiedGeometry;
    const treeH = Math.max(5.0, (combineResult.boundingRadius || 5.0) * 1.8);

    for (let g = 0; g < combineResult.groups.length; g++) {
        const group = combineResult.groups[g];
        const combinedSubMesh = createFoliageSubMeshInstance({
            gpuDevice,
            meshNode: group.rawNodes[0]?.node,
            geom: unifiedGeometry || group.geometry,
            mat: group.material,
            relMatrix: identityMatrix,
            normMatrix: identityMatrix,
            strideBytes: PBR_STRIDE_BYTES,
            lodIndex,
            isImpostorOverride: false,
            bottomOffset: 0,
            receiveShadow: lodReceiveShadow,
            firstIndex: group.firstIndex,
            indexCount: group.indexCount,
            maxPrepassLOD: 0,
            groundBlendStrength: options.groundBlendStrength,
            groundBlendRange: options.groundBlendRange,
            windMultiplier: options.windMultiplier,
            windFlutterMultiplier: options.windFlutterMultiplier,
            treeHeight: treeH,
            slotPooler,
            megaUBO
        });

        resultSubMeshes.push(combinedSubMesh);
    }

    let shadowMergedSubMesh: FoliageShadowMergedSubMesh | null = null;
    if (combineResult.shadowMergedGeometry && combineResult.totalVertexCount > 0) {
        let shadowSlotIndex = -1;
        if (slotPooler && megaUBO) {
            shadowSlotIndex = slotPooler.allocateSlot();
            if (shadowSlotIndex >= 0) {
                slotPooler.writeShadowSubMeshSlot(
                    gpuDevice,
                    megaUBO,
                    shadowSlotIndex,
                    options.windMultiplier,
                    treeH,
                    options.windFlutterMultiplier
                );
            }
        }

        shadowMergedSubMesh = new FoliageShadowMergedSubMesh({
            geometry: combineResult.shadowMergedGeometry,
            indexCount: combineResult.totalIndexCount,
            vertexCount: combineResult.totalVertexCount,
            isIndexed: true,
            indexFormat: 'uint32',
            strideBytes: POSITION_ONLY_STRIDE_BYTES,
            slotIndex: shadowSlotIndex,
            slotPooler,
            megaUBO,
            lodIndex,
            instanceBufferOffset: 0,
            indirectOffsetBytes: 0,
        });
    }

    return {
        subMeshes: resultSubMeshes,
        unifiedGeometry,
        shadowMergedSubMesh,
        boundingRadius: combineResult.boundingRadius,
        boundingHeight: combineResult.boundingHeight,
        minY: combineResult.minY,
        maxY: combineResult.maxY,
    };
}
