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
    trunkBendScale?: number;
    leafFlutterScale?: number;
}

function createPBRRenderUnit(
    geometry: any,
    material: any,
    firstIndex: number | undefined,
    indexCount: number | undefined,
    lodIndex: number,
    receiveShadow: boolean,
    foliageHeight: number,
    sharedContext: FoliageSharedContext,
    isImpostorOverride: boolean = false
): FoliageRenderUnit {
    const {useCutOff, alphaBlend, transparent, baseColorTexture, globalFragmentSlotIndex = 0} = material as any;

    const isImpostor = isImpostorOverride || material instanceof OctahedralImpostorMaterial;
    const isMasked = !!useCutOff || alphaBlend === 1 || alphaBlend === 2 || !!transparent || isImpostor;

    const {slotPooler, groundBlendStrength, groundBlendRange, trunkBendScale, leafFlutterScale} = sharedContext;

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
                trunkBendScale,
                foliageHeight,
                leafFlutterScale
            );
        }
    }

    const hasBaseColorTexture = !!(baseColorTexture?.gpuTexture || baseColorTexture?.src || baseColorTexture?.url);
    const isDepthPrepass = (lodIndex <= 0 || isImpostor) && (!isMasked || hasBaseColorTexture);
    const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

    return new FoliageRenderUnit({
        geometry,
        material,
        firstIndex,
        indexCount,
        strideBytes: PBR_STRIDE_BYTES,
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
 * [KO] 식생 메시 어셈블리 및 임포스터 베이킹 결과 데이터 인터페이스입니다.
 * [EN] Result data interface for foliage mesh assembly and impostor baking.
 * @category Landscape
 */
export interface FoliageAssemblyResult {
    /**
     * [KO] 메인 및 깊이 프리패스용 렌더 유닛 목록
     * [EN] List of render units for main and depth prepass rendering
     */
    renderUnits: FoliageRenderUnit[];
    /**
     * [KO] 그림자 패스 전용 병합 렌더 유닛 목록
     * [EN] List of merged render units dedicated to the shadow pass
     */
    shadowMergedRenderUnits: FoliageRenderUnit[];
    /**
     * [KO] LOD 단계별 거리 및 렌더 유닛 범위 메타데이터 목록
     * [EN] List of distance and render unit range metadata per LOD level
     */
    lodInfoList: FoliageLODInfo[];
    /**
     * [KO] 지오메트리 최하단 기준 수직 오프셋(월드 단위)
     * [EN] Vertical bottom offset based on the lowest geometry point in world units
     */
    bottomOffset: number;
    /**
     * [KO] 식생 전체 바운딩 스피어 반경(월드 단위)
     * [EN] Overall bounding sphere radius of the foliage in world units
     */
    boundingRadius: number;
    /**
     * [KO] 식생 전체 바운딩 높이(월드 단위)
     * [EN] Overall bounding height of the foliage in world units
     */
    boundingHeight: number;
}

/**
 * [KO] 식생 옵션에 정의된 LOD 메시들을 병합하고 팔면체 임포스터를 베이킹하여 렌더 유닛 리스트를 조립합니다.
 * [EN] Merges LOD meshes defined in foliage options and bakes an octahedral impostor to assemble render unit lists.
 *
 * @param redGPUContext -
 * [KO] RedGPU 컨텍스트 인스턴스
 * [EN] RedGPU context instance
 * @param options -
 * [KO] 식생 생성 및 LOD 구성 옵션
 * [EN] Foliage creation and LOD configuration options
 * @param slotPooler -
 * [KO] 렌더 유닛 동적 유니폼 슬롯 풀러 (선택)
 * [EN] Render unit dynamic uniform slot pooler (optional)
 * @returns
 * [KO] 조립된 렌더 유닛, 그림자 유닛, LOD 정보 및 바운딩 치수를 담은 결과 객체
 * [EN] Result object containing assembled render units, shadow units, LOD info, and bounding dimensions
 * @category Landscape
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
        trunkBendScale,
        leafFlutterScale
    } = options;
    const numLODs = Math.min(lods.length, 8);

    const sharedContext: FoliageSharedContext = {
        slotPooler,
        groundBlendStrength,
        groundBlendRange,
        trunkBendScale,
        leafFlutterScale
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
                            trunkBendScale,
                            treeH,
                            leafFlutterScale
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
            maxBoundingRadius > 0 ? maxBoundingRadius : 3.0,
            `${name}_OctahedralMat`
        );

        const bbStartOffset = renderUnits.length;
        const bbReceiveShadow = options.receiveShadow !== false;
        const bbRenderUnit = createPBRRenderUnit(
            impostorGeometry,
            impostorMaterial,
            0,
            impostorGeometry.indexBuffer.indexCount,
            impostorLODIndex,
            bbReceiveShadow,
            impostorHeight,
            sharedContext,
            true
        );

        renderUnits.push(bbRenderUnit);

        if (options.castShadow !== false) {
            let shadowSlotIndex = -1;
            if (slotPooler) {
                shadowSlotIndex = slotPooler.allocateSlot();
                if (shadowSlotIndex >= 0) {
                    slotPooler.writeShadowRenderUnitSlot(
                        shadowSlotIndex,
                        0,
                        impostorHeight,
                        0
                    );
                }
            }

            shadowMergedRenderUnits.push(new FoliageRenderUnit({
                geometry: impostorGeometry,
                material: impostorMaterial,
                indexCount: impostorGeometry.indexBuffer.indexCount,
                isIndexed: true,
                strideBytes: PBR_STRIDE_BYTES,
                slotIndex: shadowSlotIndex,
                slotPooler,
                lodIndex: impostorLODIndex,
                isShadowMerged: false,
                isImpostor: true,
                isMasked: true
            }));
        }

        lodInfoList.push({
            lodIndex: impostorLODIndex,
            lodDistance: 1000000.0,
            renderUnitOffset: bbStartOffset,
            renderUnitCount: 1,
            receiveShadow: bbReceiveShadow,
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
