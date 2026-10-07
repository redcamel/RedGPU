/**
 * [KO] 식생 서브메시 인스턴스 인스턴스화 모듈입니다.
 * [EN] Module for instantiating foliage sub-mesh instances.
 * @packageDocumentation
 */

import {mat4} from "gl-matrix";
import Mesh from "../../../../../display/mesh/Mesh";
import FoliageSubMesh from "../../submesh/FoliageSubMesh";
import OctahedralImpostorMaterial from "../../impostor/octahedral/OctahedralImpostorMaterial";
import type {FoliageDepthPassMode} from "../../pipeline/FoliagePipelineRegistry";
import {FoliageSubMeshSlotPooler} from "../../submesh/FoliageSubMeshSlotPooler";

/**
 * [KO] 서브메시 인스턴스 생성을 위한 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface for creating a sub-mesh instance.
 */
export interface CreateSubMeshOptions {
    /**
     * [KO] WebGPU 디바이스 인스턴스
     * [EN] WebGPU device instance
     */
    gpuDevice: GPUDevice;
    /**
     * [KO] 소스 메쉬 노드
     * [EN] Source mesh node
     */
    meshNode: Mesh;
    /**
     * [KO] 소스 지오메트리
     * [EN] Source geometry
     */
    geom: any;
    /**
     * [KO] 소스 머티리얼
     * [EN] Source material
     */
    mat: any;
    /**
     * [KO] 상대 모델 변환 행렬
     * [EN] Relative model transform matrix
     */
    relMatrix: mat4;
    /**
     * [KO] 상대 노멀 변환 행렬
     * [EN] Relative normal transform matrix
     */
    normMatrix: mat4;
    /**
     * [KO] 정점 버텍스 스트라이드 바이트 수
     * [EN] Vertex stride in bytes
     */
    strideBytes: number;
    /**
     * [KO] LOD 레벨 인덱스
     * [EN] LOD level index
     */
    lodIndex?: number;
    /**
     * [KO] 임포스터 머티리얼 여부 강제 지정 플래그
     * [EN] Flag to force override whether material is an impostor
     */
    isImpostorOverride?: boolean;
    /**
     * [KO] 피벗 기준 바닥 오프셋
     * [EN] Bottom offset relative to pivot
     */
    bottomOffset?: number;
    /**
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    receiveShadow?: boolean;
    /**
     * [KO] 인스턴스별 바람 강도 배수
     * [EN] Per-instance wind strength multiplier
     */
    windMultiplier?: number;
    /**
     * [KO] 인스턴스별 잔잎 흔들림 배수
     * [EN] Per-instance flutter multiplier
     */
    windFlutterMultiplier?: number;
    /**
     * [KO] 식생 전체 높이
     * [EN] Total foliage height
     */
    treeHeight?: number;
    /**
     * [KO] 서브메시 인덱스 시작 오프셋 (단일 통합 지오메트리 분할용)
     * [EN] Sub-mesh index start offset (for unified geometry partitioning)
     */
    firstIndex?: number;
    /**
     * [KO] 서브메시 인덱스 개수
     * [EN] Sub-mesh index count
     */
    indexCount?: number;
    /**
     * [KO] 뎁스 프리패스를 적용할 최대 LOD 인덱스
     * [EN] Maximum LOD index to apply depth prepass
     */
    maxPrepassLOD?: number;
    /**
     * [KO] 지면 색상 블렌딩 강도
     * [EN] Ground color blending strength
     */
    groundBlendStrength?: number;
    /**
     * [KO] 지면 색상 블렌딩 높이 범위
     * [EN] Ground color blending vertical range
     */
    groundBlendRange?: number;
    /**
     * [KO] 256B 정렬 Dynamic Offset UBO 슬롯 풀러
     * [EN] 256B aligned Dynamic Offset UBO slot pooler
     */
    slotPooler?: FoliageSubMeshSlotPooler | null;
}

/**
 * [KO] 재질 및 지오메트리 데이터를 분석하여 최적화된 FoliageSubMesh 인스턴스를 생성하고 유니폼 버퍼를 설정/캐싱합니다.
 * [EN] Analyzes material and geometry data to create an optimized FoliageSubMesh instance, configuring/caching uniform buffers.
 * @param options -
 * [KO] 서브메시 생성 옵션
 * [EN] Sub-mesh creation options
 * @returns
 * [KO] 생성된 FoliageSubMesh 인스턴스
 * [EN] Created FoliageSubMesh instance
 */
export default function createFoliageSubMeshInstance(
    options: CreateSubMeshOptions
): FoliageSubMesh {
    const {
        gpuDevice,
        meshNode,
        geom,
        mat,
        relMatrix,
        normMatrix,
        strideBytes,
        lodIndex = 0,
        isImpostorOverride = false,
        bottomOffset = 0,
        receiveShadow = true,
        firstIndex = 0,
        indexCount: optIndexCount,
        maxPrepassLOD = 0,
        groundBlendStrength,
        groundBlendRange,
        windMultiplier,
        windFlutterMultiplier,
        treeHeight,
        slotPooler
    } = options;

    const isIndexed = !!geom.indexBuffer;
    const indexCount = optIndexCount !== undefined ? optIndexCount : (geom.indexBuffer?.indexCount ?? 0);
    const vertexCount = geom.vertexBuffer?.vertexCount ?? 0;

    const isImpostor = isImpostorOverride || mat instanceof OctahedralImpostorMaterial || mat?.constructor?.name === 'OctahedralImpostorMaterial' || (typeof mat?.name === 'string' && mat.name.includes('Octahedral'));
    const isMasked = !!mat.useCutOff || mat.alphaBlend === 1 || mat.alphaBlend === 2 || !!mat.transparent || isImpostor;

    const globalSlot = (mat as any)?.globalFragmentSlotIndex ?? 0;

    let slotIndex = -1;
    if (slotPooler) {
        slotIndex = slotPooler.allocateSlot();
        if (slotIndex >= 0) {
            slotPooler.writePBRSubMeshSlot(
                slotIndex,
                globalSlot,
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

    const hasBaseColorTexture = !!(mat.baseColorTexture?.gpuTexture || mat.baseColorTexture?.src || mat.baseColorTexture?.url || (mat.diffuseTexture && (mat.diffuseTexture.gpuTexture || mat.diffuseTexture.src || mat.diffuseTexture.url)));

    const isDepthPrepass = !isImpostor && (lodIndex <= maxPrepassLOD) && (!isMasked || hasBaseColorTexture);
    const isMainOpaqueOrMasked = true;
    const mainDepthMode: FoliageDepthPassMode = isDepthPrepass ? 'mainShadingAfterDepth' : 'normal';

    return new FoliageSubMesh({
        mesh: meshNode,
        geometry: geom,
        material: mat,
        firstIndex,
        indexCount,
        vertexCount,
        isIndexed,
        indexFormat: geom.indexBuffer?.format || 'uint32',
        strideBytes,
        bottomOffset,
        relativeModelMatrix: relMatrix,
        relativeNormalMatrix: normMatrix,
        slotIndex,
        slotPooler,
        lodIndex,
        isDepthPrepass,
        isMainOpaqueOrMasked,
        isMasked,
        mainDepthMode,
        isImpostor,
        receiveShadow,
        instanceBufferOffset: 0,
        indirectOffsetBytes: 0,
    });
}
