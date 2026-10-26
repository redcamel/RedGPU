import { mat4 } from "gl-matrix";
import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ScatterRenderUnit from "./ScatterRenderUnit";
/**
 * [KO] 계층 구조 순회를 통해 추출된 개별 원시 메시 노드의 지오메트리, 머티리얼 및 상대 변환 행렬 정보를 담는 인터페이스입니다.
 * [EN] Interface containing geometry, material, and relative transformation matrix information of an individual raw mesh node extracted through hierarchy traversal.
 *
 * @category Landscape
 */
export interface RawMeshNode {
    /**
     * [KO] 메시에 연결된 `Geometry` 또는 `Primitive` 인스턴스
     * [EN] `Geometry` or `Primitive` instance attached to the mesh
     */
    geometry: Geometry | Primitive;
    /**
     * [KO] 메시에 할당된 머티리얼 인스턴스
     * [EN] Material instance assigned to the mesh
     */
    material: any;
    /**
     * [KO] 루트 기준 누적 상대 변환 행렬 (`mat4`)
     * [EN] Accumulated relative transformation matrix (`mat4`) from the root
     */
    currentRelativeMatrix: mat4;
    /**
     * [KO] 법선 및 탄젠트 변환을 위한 역전치 법선 행렬 (`mat4`)
     * [EN] Inverse-transpose normal matrix (`mat4`) for transforming normals and tangents
     */
    normalMatrix: mat4;
    /**
     * [KO] 원본 정점 버퍼의 정점당 `Float32` 요소 개수
     * [EN] Number of `Float32` elements per vertex in the source vertex buffer
     */
    rawStride: number;
}
/**
 * [KO] 동일 머티리얼 기준으로 병합된 서브메시 그룹의 지오메트리 및 인덱스 범위 정보를 담는 인터페이스입니다.
 * [EN] Interface containing geometry and index range information of a submesh group merged by identical material.
 *
 * @category Landscape
 */
export interface AssembledMeshGroup {
    /**
     * [KO] 그룹에 적용된 머티리얼 인스턴스
     * [EN] Material instance applied to the group
     */
    material: any;
    /**
     * [KO] 병합된 통합 또는 그룹 `Geometry` 인스턴스
     * [EN] Merged unified or group `Geometry` instance
     */
    geometry: Geometry;
    /**
     * [KO] 그룹 내 총 정점 개수
     * [EN] Total vertex count within the group
     */
    vertexCount: number;
    /**
     * [KO] 그룹 내 총 인덱스 개수
     * [EN] Total index count within the group
     */
    indexCount: number;
    /**
     * [KO] 통합 인덱스 버퍼 내 시작 인덱스 오프셋
     * [EN] Starting index offset within the unified index buffer
     */
    firstIndex: number;
}
/**
 * [KO] 스캐터 렌더 유닛 조립 시 피벗 보존, 중심 정렬 및 그림자 전용 병합 지오메트리 생성 여부를 제어하는 옵션 인터페이스입니다.
 * [EN] Options interface controlling pivot preservation, center alignment, and shadow-only merged geometry generation when assembling scatter render units.
 *
 * @category Landscape
 */
export interface ScatterAssemblyOptions {
    /**
     * [KO] 원본 메시의 Y축 피벗을 그대로 유지할지 여부 (기본값: `true`)
     * [EN] Whether to preserve the original mesh's Y-axis pivot (default: `true`)
     */
    preservePivot?: boolean;
    /**
     * [KO] 바운딩 박스의 XZ 중심을 원점(`0, 0`)으로 정렬할지 여부 (기본값: `false`)
     * [EN] Whether to align the XZ center of the bounding box to the origin (`0, 0`) (default: `false`)
     */
    centerXZ?: boolean;
    /**
     * [KO] 그림자 패스용 위치 전용(`POSITION_ONLY`) 단일 병합 지오메트리를 함께 생성할지 여부 (기본값: `false`)
     * [EN] Whether to also generate a position-only (`POSITION_ONLY`) single merged geometry for the shadow pass (default: `false`)
     */
    generateShadowMergedGeometry?: boolean;
    /**
     * [KO] 기본 `ScatterRenderUnit[]` 인스턴스 배열을 생성할지 여부 (기본값: `true`)
     * [EN] Whether to instantiate the default `ScatterRenderUnit[]` array (default: `true`)
     */
    createRenderUnits?: boolean;
}
/**
 * [KO] `assembleScatterRenderUnits` 함수가 메시 계층을 병합하여 생성한 렌더 유닛, 통합 지오메트리 및 바운딩 볼륨 결과 인터페이스입니다.
 * [EN] Result interface containing render units, unified geometry, and bounding volume metrics produced by `assembleScatterRenderUnits` after merging a mesh hierarchy.
 *
 * @category Landscape
 */
export interface ScatterAssemblyResult {
    /**
     * [KO] 머티리얼별로 병합된 메시 그룹(`AssembledMeshGroup[]`) 목록
     * [EN] List of mesh groups (`AssembledMeshGroup[]`) merged by material
     */
    groups: AssembledMeshGroup[];
    /**
     * [KO] 스캐터 렌더링에 사용할 `ScatterRenderUnit[]` 배열
     * [EN] Array of `ScatterRenderUnit[]` instances to use for scatter rendering
     */
    renderUnits: ScatterRenderUnit[];
    /**
     * [KO] 모든 그룹의 정점/인덱스가 하나로 병합된 통합 `Geometry` 인스턴스
     * [EN] Unified `Geometry` instance with vertices and indices of all groups merged into one
     */
    unifiedGeometry: Geometry | null;
    /**
     * [KO] 병합된 전체 정점 개수
     * [EN] Total merged vertex count
     */
    totalVertexCount: number;
    /**
     * [KO] 병합된 전체 인덱스 개수
     * [EN] Total merged index count
     */
    totalIndexCount: number;
    /**
     * [KO] 원점 기준 전체 정점의 최대 바운딩 구 반지름
     * [EN] Maximum bounding sphere radius of all vertices from the origin
     */
    boundingRadius: number;
    /**
     * [KO] 바운딩 박스의 전체 Y축 높이 (`maxY - minY`)
     * [EN] Total Y-axis height of the bounding box (`maxY - minY`)
     */
    boundingHeight: number;
    /**
     * [KO] 그림자 패스용으로 병합된 위치 전용 `Geometry` 인스턴스 (생성 시)
     * [EN] Position-only `Geometry` instance merged for the shadow pass (when generated)
     */
    shadowMergedGeometry?: Geometry | null;
    /**
     * [KO] 정렬 후 바운딩 박스의 최소 Y 좌표
     * [EN] Minimum Y coordinate of the bounding box after alignment
     */
    minY: number;
}
/**
 * [KO] 하나 이상의 `Mesh` 계층 구조를 순회하여 동일 머티리얼 단위로 정점/인덱스 버퍼를 병합하고, 스캐터 인스턴싱 렌더링에 최적화된 `ScatterRenderUnit` 목록과 바운딩 정보를 생성합니다.
 * [EN] Traverses one or more `Mesh` hierarchies to merge vertex and index buffers by identical material, producing a list of `ScatterRenderUnit` instances and bounding metrics optimized for scatter instanced rendering.
 *
 * @param redGPUContext -
 * [KO] `RedGPUContext` 인스턴스
 * [EN] `RedGPUContext` instance
 * @param roots -
 * [KO] 병합할 루트 `Mesh` 또는 `Mesh[]` 배열
 * [EN] Root `Mesh` or `Mesh[]` array to merge
 * @param options -
 * [KO] 피벗 보존, XZ 중심 정렬, 그림자 병합 지오메트리 및 렌더 유닛 생성 옵션 (선택적)
 * [EN] Options for pivot preservation, XZ center alignment, shadow merged geometry, and render unit generation (optional)
 * @returns
 * [KO] 병합된 렌더 유닛, 통합 지오메트리 및 바운딩 볼륨 정보를 담은 `ScatterAssemblyResult` 객체
 * [EN] `ScatterAssemblyResult` object containing merged render units, unified geometry, and bounding volume metrics
 *
 * @category Landscape
 */
export default function assembleScatterRenderUnits(redGPUContext: RedGPUContext, roots: Mesh | Mesh[], options?: ScatterAssemblyOptions): ScatterAssemblyResult;
