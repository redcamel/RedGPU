/**
 * [KO] 식생 LOD 메쉬 결합 및 서브메시 어셈블 모듈입니다.
 * [EN] Foliage LOD mesh combination and sub-mesh assembly module.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../../../context/RedGPUContext";
import Mesh from "../../../../../display/mesh/Mesh";
import Geometry from "../../../../../geometry/Geometry";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import FoliageShadowMergedSubMesh from "../../submesh/FoliageShadowMergedSubMesh";
import type {FoliageOptions} from "../../Foliage";
import combineScatterMeshes from "../../../../core/scatter/combineScatterMeshes";
import {PBR_STRIDE_BYTES, POSITION_ONLY_STRIDE_BYTES} from "../../../../core/scatter/ScatterVertexFormats";
import prepareFoliageMaterials from "./prepareFoliageMaterials";
import createFoliageSubMeshInstance from "./createFoliageSubMeshInstance";
import {createFoliageShadowSubMeshUniform, type FoliageSubMeshUniformResult} from "./createFoliageSubMeshUniform";

const identityMatrix: mat4 = mat4.create();

/**
 * [KO] 단일 LOD 레벨 어셈블 결과 인터페이스입니다.
 * [EN] Result interface for a single assembled LOD level.
 */
export interface AssembledLODResult {
    /**
     * [KO] 결합되어 생성된 PBR 서브메시 목록
     * [EN] List of combined PBR sub-meshes
     */
    subMeshes: FoliageSubMesh[];
    /**
     * [KO] 단일 통합 PBR 지오메트리 (버텍스/인덱스 버퍼 재바인딩 제로화용)
     * [EN] Single unified PBR geometry (for zero-rebinding of vertex/index buffers)
     */
    unifiedGeometry?: Geometry | null;
    /**
     * [KO] 그림자 패스 전용 통합 서브메시 (생성되지 않은 경우 null)
     * [EN] Unified sub-mesh dedicated to shadow pass (null if not generated)
     */
    shadowMergedSubMesh: FoliageShadowMergedSubMesh | null;
    /**
     * [KO] 바운딩 구 반경
     * [EN] Bounding sphere radius
     */
    boundingRadius: number;
    /**
     * [KO] 전체 바운딩 높이
     * [EN] Total bounding height
     */
    boundingHeight: number;
    /**
     * [KO] 로컬 Y 최소값
     * [EN] Local minimum Y
     */
    minY: number;
    /**
     * [KO] 로컬 Y 최대값
     * [EN] Local maximum Y
     */
    maxY: number;
}

/**
 * [KO] 단일 LOD 레벨의 메쉬들을 결합하고 PBR 서브메쉬 및 섀도우 머지드 서브메쉬를 생성합니다.
 * [EN] Combines meshes for a single LOD level, creating PBR sub-meshes and shadow merged sub-meshes.
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param roots -
 * [KO] 해당 LOD에 속한 루트 메쉬 배열
 * [EN] Array of root meshes belonging to the LOD level
 * @param lodIndex -
 * [KO] 대상 LOD 인덱스
 * [EN] Target LOD index
 * @param options -
 * [KO] 식생 설정 옵션
 * [EN] Foliage configuration options
 * @param subMeshBindGroupLayout -
 * [KO] 서브메시 바인드 그룹 레이아웃
 * [EN] Sub-mesh bind group layout
 * @param subMeshUniformCache -
 * [KO] 서브메시 유니폼 캐시 맵 (선택사항)
 * [EN] Sub-mesh uniform cache map (optional)
 * @param lodReceiveShadow -
 * [KO] 해당 LOD의 그림자 수신 여부 (기본값: true)
 * [EN] Whether the LOD level receives shadows (default: true)
 * @returns
 * [KO] 조립 완료된 서브메시 및 바운딩 정보
 * [EN] Assembled sub-meshes and bounding information
 */
export default function assembleFoliageLODMeshes(
    redGPUContext: RedGPUContext,
    roots: Mesh[],
    lodIndex: number,
    options: FoliageOptions,
    subMeshBindGroupLayout: GPUBindGroupLayout,
    subMeshUniformCache?: Map<string, FoliageSubMeshUniformResult>,
    lodReceiveShadow: boolean = true
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
            subMeshBindGroupLayout,
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
            uniformCache: subMeshUniformCache,
            firstIndex: group.firstIndex,
            indexCount: group.indexCount,
            maxPrepassLOD: 0,
            groundBlendStrength: options.groundBlendStrength,
            groundBlendRange: options.groundBlendRange,
            windMultiplier: options.windMultiplier,
            windFlutterMultiplier: options.windFlutterMultiplier,
            treeHeight: treeH
        });

        resultSubMeshes.push(combinedSubMesh);
    }

    let shadowMergedSubMesh: FoliageShadowMergedSubMesh | null = null;
    if (combineResult.shadowMergedGeometry && combineResult.totalVertexCount > 0) {
        const shadowUniform = createFoliageShadowSubMeshUniform(
            gpuDevice,
            subMeshBindGroupLayout,
            options.name,
            lodIndex,
            options.windMultiplier,
            treeH,
            options.windFlutterMultiplier
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
        unifiedGeometry,
        shadowMergedSubMesh,
        boundingRadius: combineResult.boundingRadius,
        boundingHeight: combineResult.boundingHeight,
        minY: combineResult.minY,
        maxY: combineResult.maxY,
    };
}
