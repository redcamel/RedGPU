/**
 * [KO] Foliage 계층 모델의 렌더 단위(Render Unit) 조립, LOD 분기, 옥타헤드럴 임포스터 베이킹 및 섀도우 지오메트리 결합 모듈입니다.
 * [EN] Render unit assembly, LOD branching, octahedral impostor baking, and shadow geometry combination module for Foliage models.
 *
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import type Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import VertexBuffer from "../../../resources/buffer/vertexBuffer/VertexBuffer";
import IndexBuffer from "../../../resources/buffer/indexBuffer/IndexBuffer";
import FoliageRenderUnit from "./FoliageRenderUnit";
import type {FoliageLODInfo, FoliageOptions} from "./Foliage";
import type {FoliageDepthPassMode} from "./pipeline/FoliagePipelineRegistry";
import type FoliageSlotPooler from "./buffer/FoliageSlotPooler";
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
    const {material, children} = node;
    if (material) {
        const mat = material as any;
        const {useCutOff, alphaBlend, transparent, cutOff = 0} = mat;
        const isMasked = !!useCutOff || alphaBlend === 1 || alphaBlend === 2 || !!transparent;
        mat.isFoliage = true;
        if (isMasked) {
            mat.useCutOff = true;
            mat.cutOff = cutOff ?? 0.3333;
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
        mat._updateFragmentState();
        mat.dirtyPipeline = false;
    }
    if (children) {
        const {length} = children;
        for (let i = 0; i < length; i++) {
            prepareFoliageMaterials(children[i] as Mesh);
        }
    }
}

interface FoliageSharedContext {
    slotPooler?: FoliageSlotPooler | null;
    groundBlendStrength?: number;
    groundBlendRange?: number;
    windMultiplier?: number;
    windFlutterMultiplier?: number;
}

/**
 * [KO] PBR 식생 렌더 유닛을 생성하고 UBO 슬롯 풀러를 바인딩하는 단일 공통 함수입니다.
 * [EN] Unified common function instantiating a PBR foliage render unit and binding the UBO slot pooler.
 */
function createPBRRenderUnit(
    geometry: any,
    material: any,
    firstIndex: number | undefined,
    indexCount: number | undefined,
    lodIndex: number,
    receiveShadow: boolean,
    treeHeight: number,
    bottomOffset: number,
    sharedContext: FoliageSharedContext,
    isImpostorOverride: boolean = false
): FoliageRenderUnit {
    const {useCutOff, alphaBlend, transparent, baseColorTexture, globalFragmentSlotIndex = 0} = material as any;

    const isImpostor = isImpostorOverride || material instanceof OctahedralImpostorMaterial;
    const isMasked = !!useCutOff || alphaBlend === 1 || alphaBlend === 2 || !!transparent || isImpostor;

    const {slotPooler, groundBlendStrength, groundBlendRange, windMultiplier, windFlutterMultiplier} = sharedContext;

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
        geometry,
        material,
        firstIndex,
        indexCount,
        strideBytes: PBR_STRIDE_BYTES,
        bottomOffset,
        relativeModelMatrix: identityMatrix,
        slotIndex,
        slotPooler,
        lodIndex,
        isDepthPrepass,
        isMasked,
        mainDepthMode,
        isImpostor,
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
    const renderUnits: FoliageRenderUnit[] = [];
    const shadowMergedRenderUnits: FoliageRenderUnit[] = [];
    const lodInfoList: FoliageLODInfo[] = [];

    const {
        name,
        useImpostor = true,
        lods = [],
        preservePivot = true,
        bottomOffset = 0,
        height = 2.0,
        groundBlendStrength,
        groundBlendRange,
        windMultiplier,
        windFlutterMultiplier
    } = options;
    const numLODs = Math.min(lods.length, 8);

    const sharedContext: FoliageSharedContext = {
        slotPooler,
        groundBlendStrength,
        groundBlendRange,
        windMultiplier,
        windFlutterMultiplier
    };

    let maxBoundingRadius = 0;
    let maxBoundingHeight = 0;
    let autoBottomOffset = 0;
    let lod0RenderUnits: FoliageRenderUnit[] = [];

    for (let l = 0; l < numLODs; l++) {
        const {mesh, receiveShadow = true, lodDistance} = lods[l];
        const lodMeshes = Array.isArray(mesh) ? mesh : [mesh];
        const startSubOffset = renderUnits.length;
        const lodReceiveShadow = options.receiveShadow !== false && receiveShadow !== false;

        for (let r = 0; r < lodMeshes.length; r++) {
            prepareFoliageMaterials(lodMeshes[r]);
        }

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
            boundingRadius,
            boundingHeight,
            shadowMergedGeometry,
            totalIndexCount,
            totalVertexCount
        } = mergeResult;

        if (groups.length > 0) {
            const treeH = boundingHeight > 0 ? boundingHeight : Math.max(5.0, boundingRadius * 1.8);

            for (let g = 0; g < groups.length; g++) {
                const group = groups[g];
                const {geometry, material, firstIndex, indexCount} = group;
                const unit = createPBRRenderUnit(
                    unifiedGeometry ?? geometry,
                    material,
                    firstIndex,
                    indexCount,
                    l,
                    lodReceiveShadow,
                    treeH,
                    0,
                    sharedContext
                );

                renderUnits.push(unit);
            }

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

            if (boundingRadius > maxBoundingRadius) {
                maxBoundingRadius = boundingRadius;
            }
            if (boundingHeight > maxBoundingHeight) {
                maxBoundingHeight = boundingHeight;
            }
            if (l === 0) {
                autoBottomOffset = mergeResult.bottomOffset;
            }
        }

        const unitCountForThisLOD = renderUnits.length - startSubOffset;

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

    if (useImpostor && lod0RenderUnits.length > 0) {
        const impostorLODIndex = lodInfoList.length;
        const bakeResult = bakeFoliageImpostor(redGPUContext, lod0RenderUnits, name);
        const {
            width,
            height: impostorHeight,
            bottomOffset = 0,
            baseColorTexture,
            normalTexture,
            packedORMTexture
        } = bakeResult;

        const impostorGeometry = createOctahedralImpostorGeometry(redGPUContext, width, impostorHeight, bottomOffset);
        const impostorMaterial = new OctahedralImpostorMaterial(
            redGPUContext,
            baseColorTexture,
            normalTexture,
            packedORMTexture,
            `${name}_OctahedralMat`
        );

        const bbStartOffset = renderUnits.length;
        const bbRenderUnit = createPBRRenderUnit(
            impostorGeometry,
            impostorMaterial,
            0,
            impostorGeometry.indexBuffer.indexCount,
            impostorLODIndex,
            false,
            impostorHeight,
            bottomOffset,
            sharedContext,
            true
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

    const boundingHeight = maxBoundingHeight > 0 ? maxBoundingHeight : height;
    const resolvedBottomOffset = options.bottomOffset ?? autoBottomOffset;

    return {
        renderUnits,
        shadowMergedRenderUnits,
        lodInfoList,
        bottomOffset: resolvedBottomOffset,
        boundingRadius: maxBoundingRadius ?? 10.0,
        boundingHeight
    };
}
