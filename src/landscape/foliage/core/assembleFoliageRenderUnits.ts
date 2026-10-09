/**
 * [KO] Foliage 계층 모델의 렌더 단위(Render Unit) 조립, LOD 분기, 옥타헤드럴 임포스터 베이킹 및 섀도우 지오메트리 결합 모듈입니다.
 * [EN] Render unit assembly, LOD branching, octahedral impostor baking, and shadow geometry combination module for Foliage models.
 *
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import FoliageRenderUnit from "./FoliageRenderUnit";
import type {FoliageLODInfo, FoliageOptions} from "./Foliage";
import type {FoliageDepthPassMode} from "./pipeline/FoliagePipelineRegistry";
import {FoliageSlotPooler} from "./buffer/FoliageSlotPooler";
import bakeFoliageImpostor from "./baking/impostor/bakeFoliageImpostor";
import OctahedralImpostorMaterial from "./baking/impostor/octahedral/OctahedralImpostorMaterial";
import assembleScatterRenderUnits from "../../core/scatter/assembleScatterRenderUnits";
import {
    PBR_INTERLEAVED_STRUCT,
    PBR_STRIDE_BYTES,
    POSITION_ONLY_STRIDE_BYTES
} from "../../core/scatter/ScatterVertexFormats";

const identityMatrix: mat4 = mat4.create();
const IMPOSTOR_QUAD_INDICES: Uint32Array = new Uint32Array([0, 1, 2, 0, 2, 3]);

/**
 * [KO] 옥타헤드럴(Octahedral) 임포스터 렌더링을 위한 4정점 2삼각형 평면 빌보드 지오메트리를 생성합니다.
 * [EN] Creates a 4-vertex 2-triangle planar billboard geometry for octahedral impostor rendering.
 */
function createOctahedralImpostorGeometry(
    redGPUContext: RedGPUContext,
    width: number = 6.0,
    height: number = 6.0,
    bottomOffset: number = 0.0
): Geometry {
    const halfW = width * 0.5;
    const halfH = height * 0.5;
    const centerY = bottomOffset + halfH;

    const interleaved = new Float32Array([
        -halfW, -halfH, centerY, 0.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        halfW, -halfH, centerY, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        halfW, halfH, centerY, 0.0, 0.0, 1.0, 1.0, 0.0, 1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0,
        -halfW, halfH, centerY, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 0.0, -999.0
    ]);

    const vertexBuffer = new VertexBuffer(
        redGPUContext,
        interleaved,
        PBR_INTERLEAVED_STRUCT
    );

    const indexBuffer = new IndexBuffer(
        redGPUContext,
        IMPOSTOR_QUAD_INDICES
    );

    return new Geometry(redGPUContext, vertexBuffer, indexBuffer);
}

/**
 * [KO] 메쉬 및 하위 자식 노드의 머티리얼을 순회하며 식생 전용 셰이더 상태(CutOff, DoubleSided, AlphaBlend)를 설정합니다.
 * [EN] Traverses materials of a mesh and its children, configuring foliage-specific shader states (CutOff, DoubleSided, AlphaBlend).
 */
function prepareFoliageMaterials(node: Mesh): void {
    if (!node) return;
    const {material, children} = node;
    if (material) {
        const mat = material as any;
        const {useCutOff, alphaBlend, transparent, cutOff = 0} = mat;
        const isMasked = !!useCutOff || alphaBlend === 1 || alphaBlend === 2 || !!transparent;
        mat.isFoliage = true;
        if (isMasked) {
            mat.useCutOff = true;
            mat.cutOff = cutOff > 0 ? cutOff : 0.3333;
            mat.doubleSided = true;
            mat.alphaBlend = 1;
            mat.transparent = false;
        } else {
            mat.useCutOff = false;
            mat.doubleSided = false;
            mat.alphaBlend = 0;
            mat.transparent = false;
        }
        mat.dirtyPipeline = true;

        if (mat.dirtyPipeline || !mat.gpuRenderInfo?.fragmentShaderModule || !mat.gpuRenderInfo?.fragmentUniformBindGroup) {
            mat._updateFragmentState?.();
            mat.dirtyPipeline = false;
        }
    }
    if (children && children.length > 0) {
        for (let i = 0; i < children.length; i++) {
            prepareFoliageMaterials(children[i] as Mesh);
        }
    }
}

/**
 * [KO] PBR 식생 렌더 유닛을 생성하고 UBO 슬롯 풀러를 바인딩하는 단일 공통 함수입니다.
 * [EN] Unified common function instantiating a PBR foliage render unit and binding the UBO slot pooler.
 */
function createPBRRenderUnit(
    meshNode: Mesh | undefined,
    geom: any,
    mat: any,
    firstIndex: number,
    indexCount: number,
    lodIndex: number,
    receiveShadow: boolean,
    treeHeight: number,
    bottomOffset: number,
    groundBlendStrength: number | undefined,
    groundBlendRange: number | undefined,
    windMultiplier: number | undefined,
    windFlutterMultiplier: number | undefined,
    slotPooler?: FoliageSlotPooler | null,
    isImpostorOverride: boolean = false
): FoliageRenderUnit {
    const {indexBuffer, vertexBuffer} = geom;
    const {useCutOff, alphaBlend, transparent, baseColorTexture, globalFragmentSlotIndex = 0} = (mat as any) || {};

    const isImpostor = isImpostorOverride || mat instanceof OctahedralImpostorMaterial || mat?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof mat?.name === 'string' && mat.name.includes('Octahedral'));
    const isMasked = !!useCutOff || alphaBlend === 1 || alphaBlend === 2 || !!transparent || isImpostor;

    let slotIndex = -1;
    if (slotPooler) {
        slotIndex = slotPooler.allocateSlot();
        if (slotIndex >= 0) {
            slotPooler.writePBRRenderUnitSlot(
                slotIndex,
                globalFragmentSlotIndex,
                receiveShadow,
                isMasked,
                !isImpostor,
                groundBlendStrength,
                groundBlendRange,
                windMultiplier,
                treeHeight,
                windFlutterMultiplier
            );
        }
    }

    const hasBaseColorTexture = !!(baseColorTexture?.gpuTexture || baseColorTexture?.src || baseColorTexture?.url);
    const isDepthPrepass = !isImpostor && (lodIndex <= 0) && (!isMasked || hasBaseColorTexture);
    const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

    return new FoliageRenderUnit({
        mesh: meshNode,
        geometry: geom,
        material: mat,
        firstIndex,
        indexCount,
        vertexCount: vertexBuffer?.vertexCount ?? 0,
        isIndexed: !!indexBuffer,
        strideBytes: PBR_STRIDE_BYTES,
        bottomOffset,
        relativeModelMatrix: identityMatrix,
        relativeNormalMatrix: identityMatrix,
        slotIndex,
        slotPooler,
        lodIndex,
        isDepthPrepass,
        isMasked,
        mainDepthMode,
        isImpostor,
        receiveShadow,
    });
}

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
    const {gpuDevice} = redGPUContext;
    const renderUnits: FoliageRenderUnit[] = [];
    const shadowMergedRenderUnits: FoliageRenderUnit[] = [];
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

    const {
        name,
        useImpostor = true,
        lods = [],
        preservePivot = true,
        bottomOffset = 0,
        height: optHeight = 2.0,
        groundBlendStrength,
        groundBlendRange,
        windMultiplier,
        windFlutterMultiplier
    } = options;
    const numLODs = Math.min(lods.length, 8);

    let maxBoundingRadius = 0;
    let globalMinY = Infinity;
    let globalMaxY = -Infinity;
    let lod0RenderUnits: FoliageRenderUnit[] = [];

    // 1. LOD 레벨별 지오메트리 병합 및 PBR/섀도우 렌더 유닛 조립
    for (let l = 0; l < numLODs; l++) {
        const {mesh, receiveShadow = true, lodDistance} = lods[l];
        const lodMeshes = Array.isArray(mesh) ? mesh : [mesh];
        const startSubOffset = renderUnits.length;
        const lodReceiveShadow = receiveShadow !== false;

        // 머티리얼 전처리
        for (let r = 0; r < lodMeshes.length; r++) {
            prepareFoliageMaterials(lodMeshes[r]);
        }

        // 지오메트리 및 렌더 유닛 조립
        const mergeResult = assembleScatterRenderUnits(
            redGPUContext,
            lodMeshes,
            {
                preservePivot,
                centerXZ: true,
                generateShadowMergedGeometry: true
            }
        );

        const {
            groups,
            unifiedGeometry,
            boundingRadius = 5.0,
            shadowMergedGeometry,
            totalIndexCount,
            totalVertexCount,
            minY,
            maxY
        } = mergeResult;

        if (groups.length > 0) {
            const treeH = Math.max(5.0, (boundingRadius || 5.0) * 1.8);

            // 각 서브메시 그룹별 PBR 렌더 유닛 생성 (공통 헬퍼 활용)
            for (let g = 0; g < groups.length; g++) {
                const {
                    rawNodes,
                    geometry: groupGeom,
                    material: groupMat,
                    firstIndex,
                    indexCount: groupIndexCount
                } = groups[g];
                const geom = unifiedGeometry || groupGeom;
                const indexCount = groupIndexCount !== undefined ? groupIndexCount : (geom.indexBuffer?.indexCount ?? 0);

                const unit = createPBRRenderUnit(
                    rawNodes[0]?.node,
                    geom,
                    groupMat,
                    firstIndex,
                    indexCount,
                    l,
                    lodReceiveShadow,
                    treeH,
                    0,
                    groundBlendStrength,
                    groundBlendRange,
                    windMultiplier,
                    windFlutterMultiplier,
                    slotPooler
                );

                renderUnits.push(unit);
            }

            // 그림자 패스 전용 통합 렌더 유닛 구성
            if (shadowMergedGeometry && totalVertexCount > 0) {
                let shadowSlotIndex = -1;
                if (slotPooler) {
                    shadowSlotIndex = slotPooler.allocateSlot();
                    if (shadowSlotIndex >= 0) {
                        slotPooler.writeShadowRenderUnitSlot(
                            shadowSlotIndex,
                            windMultiplier,
                            treeH,
                            windFlutterMultiplier
                        );
                    }
                }

                shadowMergedRenderUnits.push(new FoliageRenderUnit({
                    geometry: shadowMergedGeometry,
                    indexCount: totalIndexCount,
                    vertexCount: totalVertexCount,
                    isIndexed: true,
                    strideBytes: POSITION_ONLY_STRIDE_BYTES,
                    slotIndex: shadowSlotIndex,
                    slotPooler,
                    lodIndex: l,
                    isShadowMerged: true,
                }));
            }

            // 바운딩 정보 갱신
            if (boundingRadius > maxBoundingRadius) {
                maxBoundingRadius = boundingRadius;
            }
            if (isFinite(minY) && minY < globalMinY) {
                globalMinY = minY;
            }
            if (isFinite(maxY) && maxY > globalMaxY) {
                globalMaxY = maxY;
            }
        }

        const unitCountForThisLOD = renderUnits.length - startSubOffset;

        // 첫 번째 LOD 유닛 배열을 즉시 보관 (사후 2차 전체 순회 소거)
        if (l === 0) {
            lod0RenderUnits = renderUnits.slice(startSubOffset, renderUnits.length);
        }

        const defaultDist = (l === 0) ? 80.0 : (80.0 * Math.pow(2.5, l));
        const switchDist = lodDistance ?? defaultDist;

        lodInfoList.push({
            lodIndex: l,
            lodDistance: switchDist,
            renderUnitOffset: startSubOffset,
            renderUnitCount: unitCountForThisLOD,
            receiveShadow: lodReceiveShadow,
        });
    }

    // 2. 옥타헤드럴 임포스터 베이킹 및 최종 LOD 렌더 유닛 추가
    if (useImpostor && lod0RenderUnits.length > 0) {
        const impostorLODIndex = lodInfoList.length;
        const bakeResult = bakeFoliageImpostor(redGPUContext, lod0RenderUnits, name);
        const {
            width,
            height,
            bottomOffset: bakeBottomOffset = 0,
            baseColorTexture,
            normalTexture,
            packedORMTexture
        } = bakeResult;

        const bbGeom = createOctahedralImpostorGeometry(redGPUContext, width, height, bakeBottomOffset);
        const bbMat = new OctahedralImpostorMaterial(
            redGPUContext,
            baseColorTexture,
            normalTexture,
            packedORMTexture,
            `${name}_OctahedralMat`
        );

        const bbStartOffset = renderUnits.length;
        const bbRenderUnit = createPBRRenderUnit(
            lod0RenderUnits[0]?.mesh,
            bbGeom,
            bbMat,
            0,
            bbGeom.indexBuffer?.indexCount ?? 0,
            impostorLODIndex,
            false,
            height,
            bakeBottomOffset,
            groundBlendStrength,
            groundBlendRange,
            windMultiplier,
            windFlutterMultiplier,
            slotPooler,
            true // isImpostorOverride
        );

        renderUnits.push(bbRenderUnit);

        lodInfoList.push({
            lodIndex: impostorLODIndex,
            lodDistance: 1000000.0,
            renderUnitOffset: bbStartOffset,
            renderUnitCount: 1,
            receiveShadow: false,
        });
    }

    const boundingHeight = (isFinite(globalMinY) && isFinite(globalMaxY))
        ? Math.max(0.1, globalMaxY - globalMinY)
        : optHeight;

    return {
        renderUnits,
        shadowMergedRenderUnits,
        lodInfoList,
        bottomOffset,
        boundingRadius: maxBoundingRadius || 10.0,
        boundingHeight
    };
}
