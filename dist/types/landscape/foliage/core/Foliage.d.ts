import RedGPUContext from "../../../context/RedGPUContext";
import Mesh from "../../../display/mesh/Mesh";
import type Landscape from "../../Landscape";
import FoliageRenderUnit from "./FoliageRenderUnit";
import FoliageMegaBuffer, { FoliageTypeAllocation } from "./buffer/FoliageMegaBuffer";
import { AScatterType, AScatterTypeInitOptions } from "../../core/scatter";
import FoliageSlotPooler from "./buffer/FoliageSlotPooler";
import FoliageInstanceBaker from "./baking/FoliageInstanceBaker";
/**
 * [KO] 식생(Foliage) 스트리밍의 최소 공간 단위인 서브 셀(Sub-Cell) 상태 정보 인터페이스입니다.
 * [EN] Interface representing the state information of a sub-cell, the minimum spatial unit for foliage streaming.
 * @category Landscape
 */
export interface FoliageSubCell {
    /**
     * [KO] 서브 셀 그리드 좌표(`subCellX`, `subCellZ`)를 패킹한 고유 키
     * [EN] Unique key packed from sub-cell grid coordinates (`subCellX`, `subCellZ`)
     */
    subCellKey: number;
    /**
     * [KO] 서브 셀의 그리드 X 인덱스
     * [EN] Grid X index of the sub-cell
     */
    subCellX: number;
    /**
     * [KO] 서브 셀의 그리드 Z 인덱스
     * [EN] Grid Z index of the sub-cell
     */
    subCellZ: number;
    /**
     * [KO] 서브 셀 중심의 월드 X 좌표
     * [EN] World X coordinate of the sub-cell center
     */
    centerX: number;
    /**
     * [KO] 서브 셀 중심의 월드 Z 좌표
     * [EN] World Z coordinate of the sub-cell center
     */
    centerZ: number;
    /**
     * [KO] 서브 셀 내 배치될 유효 인스턴스 개수 (미계산 시 `-1`)
     * [EN] Number of valid instances to be placed in the sub-cell (`-1` if not yet computed)
     */
    instanceCount: number;
    /**
     * [KO] 현재 GPU 메가 버퍼에 마운트되어 있는지 여부
     * [EN] Whether the sub-cell is currently mounted in the GPU mega buffer
     */
    isMounted: boolean;
    /**
     * [KO] 마운트된 GPU 메가 버퍼 내 슬롯 시작 오프셋 (미마운트 시 `-1`)
     * [EN] Starting slot offset within the mounted GPU mega buffer (`-1` if unmounted)
     */
    mountedSlotIndex: number;
}
/**
 * [KO] 식생(Foliage)의 개별 LOD(Level of Detail) 단계 구성을 정의하는 인터페이스입니다.
 * [EN] Interface defining an individual LOD (Level of Detail) level configuration for foliage.
 * @category Landscape
 */
export interface FoliageLODConfig {
    /**
     * [KO] 해당 LOD 단계에서 렌더링할 `Mesh` 또는 `Mesh` 배열
     * [EN] `Mesh` or array of `Mesh` instances to render at this LOD level
     */
    mesh: Mesh | Mesh[];
    /**
     * [KO] 해당 LOD 단계가 적용되는 최대 카메라 거리 (미터 단위)
     * [EN] Maximum camera distance at which this LOD level applies (in meters)
     */
    lodDistance?: number;
    /**
     * [KO] 해당 LOD 단계의 그림자 수신 여부
     * [EN] Whether this LOD level receives shadows
     */
    receiveShadow?: boolean;
}
/**
 * [KO] 어셈블리 완료 후 GPU 컬링 및 렌더링에 사용되는 LOD 메타데이터 인터페이스입니다.
 * [EN] LOD metadata interface used for GPU culling and rendering after assembly.
 * @category Landscape
 */
export interface FoliageLODInfo {
    /**
     * [KO] LOD 단계 인덱스
     * [EN] LOD level index
     */
    lodIndex: number;
    /**
     * [KO] 해당 LOD 단계의 전환 거리 (미터 단위)
     * [EN] Transition distance for this LOD level (in meters)
     */
    lodDistance: number;
    /**
     * [KO] 렌더 유닛 배열 내 시작 오프셋
     * [EN] Starting offset within the render unit array
     */
    renderUnitOffset: number;
    /**
     * [KO] 해당 LOD 단계에 속한 렌더 유닛 개수
     * [EN] Number of render units belonging to this LOD level
     */
    renderUnitCount: number;
}
/**
 * [KO] 식생(`Foliage`) 타입 생성 및 초기화를 위한 설정 옵션 인터페이스입니다.
 * [EN] Configuration options interface for creating and initializing a `Foliage` type.
 * @category Landscape
 */
export interface FoliageOptions extends AScatterTypeInitOptions {
    /**
     * [KO] 거리별 LOD 메시 구성 목록
     * [EN] List of distance-based LOD mesh configurations
     */
    lods: FoliageLODConfig[];
    /**
     * [KO] 식생 표면의 그림자 수신 여부 (기본값: `true`)
     * [EN] Whether the foliage surface receives shadows (default: `true`)
     */
    receiveShadow?: boolean;
    /**
     * [KO] 할당할 최대 인스턴스 수용량 (미지정 시 밀도와 반경 기반으로 자동 계산)
     * [EN] Maximum instance capacity to allocate (automatically calculated based on density and radius if omitted)
     */
    maxInstances?: number;
    /**
     * [KO] 인스턴스 랜덤 스케일 최솟값 `[x, y, z]` (기본값: `[1.0, 1.0, 1.0]`)
     * [EN] Minimum random instance scale `[x, y, z]` (default: `[1.0, 1.0, 1.0]`)
     */
    minScale?: [number, number, number];
    /**
     * [KO] 인스턴스 랜덤 스케일 최댓값 `[x, y, z]` (기본값: `[1.0, 1.0, 1.0]`)
     * [EN] Maximum random instance scale `[x, y, z]` (default: `[1.0, 1.0, 1.0]`)
     */
    maxScale?: [number, number, number];
    /**
     * [KO] Y축 기준 랜덤 회전 적용 여부 (기본값: `true`)
     * [EN] Whether to apply random rotation around the Y-axis (default: `true`)
     */
    randomRotationY?: boolean;
    /**
     * [KO] 원거리 옥타헤드럴 임포스터(Octahedral Impostor) LOD 자동 생성 및 사용 여부 (기본값: `true`)
     * [EN] Whether to automatically generate and use a far-distance Octahedral Impostor LOD (default: `true`)
     */
    useImpostor?: boolean;
    /**
     * [KO] 메시 결합 시 원본 피벗(Pivot) 보존 여부
     * [EN] Whether to preserve the original pivot when assembling meshes
     */
    preservePivot?: boolean;
    /**
     * [KO] 바람에 의한 줄기/기둥 흔들림 강도 배율 (기본값: `1.0`)
     * [EN] Wind-driven trunk bending scale multiplier (default: `1.0`)
     */
    trunkBendScale?: number;
    /**
     * [KO] 바람에 의한 잎사귀 떨림 강도 배율 (기본값: `1.0`)
     * [EN] Wind-driven leaf flutter scale multiplier (default: `1.0`)
     */
    leafFlutterScale?: number;
    /**
     * [KO] 지형 표면 법선(Normal) 방향으로 인스턴스 정렬 여부 (기본값: `false`)
     * [EN] Whether to align instances to the terrain surface normal (default: `false`)
     */
    alignToNormal?: boolean;
    /**
     * [KO] 지형 법선 정렬 반영 비율 (`0.0` ~ `1.0`, 기본값: `1.0`)
     * [EN] Terrain normal alignment factor (`0.0` to `1.0`, default: `1.0`)
     */
    alignFactor?: number;
    /**
     * [KO] 지형 하단 색상 블렌딩이 적용되는 높이 범위 (미터 단위, 기본값: `1.5`)
     * [EN] Height range over which terrain ground color blending is applied in meters (default: `1.5`)
     */
    groundBlendRange?: number;
}
/**
 * [KO] 지형(`Landscape`) 위에 배치되는 단일 식생(나무, 바위, 관목 등) 타입의 LOD, 서브 셀 스트리밍 및 렌더링 속성을 관리하는 클래스입니다.
 * [EN] Class that manages LODs, sub-cell streaming, and rendering properties for a single foliage type (trees, rocks, shrubs, etc.) placed on a `Landscape`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] LOD 및 임포스터 옵션을 포함하여 식생 타입 추가
 * // [EN] Add a foliage type with LOD and impostor options
 * const pineTree = landscape.foliageManager.addType({
 *     name: 'PineTree',
 *     lods: [
 *         { mesh: pineLod0Mesh, lodDistance: 60 },
 *         { mesh: pineLod1Mesh, lodDistance: 150 }
 *     ],
 *     densityPerHectare: 150,
 *     useImpostor: true
 * });
 * ```
 *
 * @see [Foliage and Impostors example](/RedGPU/examples/3d/landscape/foliageAndImpostors/)
 * @category Landscape
 */
declare class Foliage extends AScatterType<FoliageTypeAllocation> {
    #private;
    /**
     * [KO] 유니폼 파라미터가 변경되어 UBO 갱신이 필요할 때 호출되는 콜백 함수
     * [EN] Callback function invoked when uniform parameters change and UBO update is required
     */
    onUniformDirty?: (typeId: number) => void;
    /**
     * [KO] 배치 파라미터 변경으로 인해 서브 셀 인스턴스 재배치가 필요할 때 호출되는 콜백 함수
     * [EN] Callback function invoked when sub-cell instance repopulation is required due to placement parameter changes
     */
    onRepopulateRequired?: (type: Foliage) => void;
    /**
     * [KO] `Foliage` 인스턴스를 생성합니다.
     * [EN] Creates a `Foliage` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param options -
     * [KO] 식생 타입 초기화 옵션
     * [EN] Foliage type initialization options
     * @param megaBuffer -
     * [KO] 식생 인스턴스 데이터를 저장할 `FoliageMegaBuffer` 인스턴스
     * [EN] `FoliageMegaBuffer` instance to store foliage instance data
     * @param baker -
     * [KO] 서브 셀 인스턴스 베이킹을 수행하는 `FoliageInstanceBaker` 인스턴스
     * [EN] `FoliageInstanceBaker` instance that performs sub-cell instance baking
     * @param slotPooler -
     * [KO] 렌더 유닛 UBO 슬롯을 관리하는 `FoliageSlotPooler` 인스턴스
     * [EN] `FoliageSlotPooler` instance managing render unit UBO slots
     * @param landscape -
     * [KO] 식생이 배치될 대상 `Landscape` 인스턴스
     * [EN] Target `Landscape` instance where foliage is placed
     */
    constructor(redGPUContext: RedGPUContext, options: FoliageOptions, megaBuffer?: FoliageMegaBuffer | null, baker?: FoliageInstanceBaker | null, slotPooler?: FoliageSlotPooler | null, landscape?: Landscape | null);
    /**
     * [KO] 바람에 의한 줄기/기둥 흔들림 강도 배율을 반환하거나 설정합니다.
     * [EN] Gets or sets the wind-driven trunk bending scale multiplier.
     * @returns
     * [KO] 줄기 흔들림 강도 배율
     * [EN] Trunk bending scale multiplier
     */
    get trunkBendScale(): number;
    set trunkBendScale(val: number);
    /**
     * [KO] 식생 타입 이름으로부터 계산된 해시 값을 반환합니다.
     * [EN] Returns the hash value calculated from the foliage type name.
     * @returns
     * [KO] 이름 해시 값
     * [EN] Name hash value
     */
    get nameHash(): number;
    /**
     * [KO] 이 식생 타입에 할당된 최대 인스턴스 수용량을 반환합니다.
     * [EN] Returns the maximum instance capacity allocated to this foliage type.
     * @returns
     * [KO] 최대 인스턴스 수
     * [EN] Maximum instance count
     */
    get maxInstances(): number;
    set minScale(v: [number, number, number] | [number, number]);
    /**
     * [KO] 인스턴스 랜덤 스케일의 최솟값 `[x, y, z]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the minimum random instance scale `[x, y, z]`.
     * @returns
     * [KO] 최소 스케일 튜플 `[x, y, z]`
     * [EN] Minimum scale tuple `[x, y, z]`
     */
    get minScale(): [number, number, number];
    set maxScale(v: [number, number, number] | [number, number]);
    /**
     * [KO] 인스턴스 랜덤 스케일의 최댓값 `[x, y, z]`를 반환하거나 설정합니다.
     * [EN] Gets or sets the maximum random instance scale `[x, y, z]`.
     * @returns
     * [KO] 최대 스케일 튜플 `[x, y, z]`
     * [EN] Maximum scale tuple `[x, y, z]`
     */
    get maxScale(): [number, number, number];
    /**
     * [KO] Y축 기준 랜덤 회전 적용 여부를 반환합니다.
     * [EN] Returns whether random rotation around the Y-axis is applied.
     * @returns
     * [KO] Y축 랜덤 회전 여부
     * [EN] Whether Y-axis random rotation is enabled
     */
    get randomRotationY(): boolean;
    /**
     * [KO] 연결된 `FoliageMegaBuffer` 인스턴스를 반환합니다.
     * [EN] Returns the associated `FoliageMegaBuffer` instance.
     * @returns
     * [KO] `FoliageMegaBuffer` 인스턴스 또는 `null`
     * [EN] `FoliageMegaBuffer` instance or `null`
     */
    get megaBuffer(): FoliageMegaBuffer | null;
    /**
     * [KO] 식생이 배치된 대상 `Landscape` 인스턴스를 반환합니다.
     * [EN] Returns the target `Landscape` instance where the foliage is placed.
     * @returns
     * [KO] `Landscape` 인스턴스 또는 `null`
     * [EN] `Landscape` instance or `null`
     */
    get landscape(): Landscape | null;
    /**
     * [KO] 모든 LOD 단계의 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of `FoliageRenderUnit` instances across all LOD levels.
     * @returns
     * [KO] `FoliageRenderUnit` 배열
     * [EN] Array of `FoliageRenderUnit`
     */
    get renderUnits(): FoliageRenderUnit[];
    /**
     * [KO] Depth Prepass에서 렌더링되는 불투명(Opaque) `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of opaque `FoliageRenderUnit` instances rendered in the Depth Prepass.
     * @returns
     * [KO] 불투명 Depth Prepass 렌더 유닛 배열
     * [EN] Array of opaque Depth Prepass render units
     */
    get depthPrepassOpaqueRenderUnits(): FoliageRenderUnit[];
    /**
     * [KO] Depth Prepass에서 렌더링되는 알파 마스크(Masked) `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of alpha-masked `FoliageRenderUnit` instances rendered in the Depth Prepass.
     * @returns
     * [KO] 알파 마스크 Depth Prepass 렌더 유닛 배열
     * [EN] Array of alpha-masked Depth Prepass render units
     */
    get depthPrepassMaskedRenderUnits(): FoliageRenderUnit[];
    /**
     * [KO] 메인 컬러 패스에서 렌더링되는 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of `FoliageRenderUnit` instances rendered in the main color pass.
     * @returns
     * [KO] 메인 패스 렌더 유닛 배열
     * [EN] Array of main pass render units
     */
    get mainRenderUnits(): FoliageRenderUnit[];
    /**
     * [KO] LOD 0 단계에 해당하는 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of `FoliageRenderUnit` instances belonging to LOD 0.
     * @returns
     * [KO] LOD 0 렌더 유닛 배열
     * [EN] Array of LOD 0 render units
     */
    get lod0RenderUnits(): FoliageRenderUnit[];
    /**
     * [KO] 그림자 패스 렌더링을 위해 병합된 `FoliageRenderUnit` 목록을 반환합니다.
     * [EN] Returns the list of merged `FoliageRenderUnit` instances for shadow pass rendering.
     * @returns
     * [KO] 그림자용 병합 렌더 유닛 배열
     * [EN] Array of shadow-merged render units
     */
    get shadowMergedRenderUnits(): FoliageRenderUnit[];
    /**
     * [KO] 구성된 각 LOD 단계의 메타데이터(`FoliageLODInfo`) 목록을 반환합니다.
     * [EN] Returns the list of metadata (`FoliageLODInfo`) for each configured LOD level.
     * @returns
     * [KO] `FoliageLODInfo` 배열
     * [EN] Array of `FoliageLODInfo`
     */
    get lodInfoList(): FoliageLODInfo[];
    /**
     * [KO] 현재 GPU 메가 버퍼에 마운트되어 활성화된 총 인스턴스 수를 반환합니다.
     * [EN] Returns the total number of active instances currently mounted in the GPU mega buffer.
     * @returns
     * [KO] 활성 인스턴스 수
     * [EN] Active instance count
     */
    get activeInstanceCount(): number;
    /**
     * [KO] 식생 메시의 바운딩 구 반경(미터 단위)을 반환합니다.
     * [EN] Returns the bounding sphere radius of the foliage mesh in meters.
     * @returns
     * [KO] 바운딩 반경
     * [EN] Bounding radius
     */
    get boundingRadius(): number;
    /**
     * [KO] LOD 0 단계에 알파 마스크(Masked) 재질이 포함되어 있는지 여부를 반환합니다.
     * [EN] Returns whether LOD 0 contains an alpha-masked material.
     * @returns
     * [KO] LOD 0 알파 마스크 포함 여부
     * [EN] Whether LOD 0 has a masked material
     */
    get hasMaskedLOD0(): boolean;
    /**
     * [KO] 바람에 의한 잎사귀 떨림 강도 배율을 반환하거나 설정합니다.
     * [EN] Gets or sets the wind-driven leaf flutter scale multiplier.
     * @returns
     * [KO] 잎사귀 떨림 강도 배율
     * [EN] Leaf flutter scale multiplier
     */
    get leafFlutterScale(): number;
    set alignToNormal(val: boolean);
    set leafFlutterScale(val: number);
    set alignFactor(val: number);
    /**
     * [KO] 지형 표면 법선(Normal) 방향으로 인스턴스를 정렬할지 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether to align instances to the terrain surface normal.
     * @returns
     * [KO] 지형 법선 정렬 활성화 여부
     * [EN] Whether terrain normal alignment is enabled
     */
    get alignToNormal(): boolean;
    set groundBlendRange(v: number);
    /**
     * [KO] 지형 법선 정렬 반영 비율(`0.0` ~ `1.0`)을 반환하거나 설정합니다.
     * [EN] Gets or sets the terrain normal alignment factor (`0.0` to `1.0`).
     * @returns
     * [KO] 법선 정렬 반영 비율
     * [EN] Normal alignment factor
     */
    get alignFactor(): number;
    /**
     * [KO] 이 식생 타입에 생성된 옥타헤드럴 임포스터 렌더 유닛이 존재하는지 여부를 반환합니다.
     * [EN] Returns whether an octahedral impostor render unit exists for this foliage type.
     * @returns
     * [KO] 임포스터 렌더 유닛 존재 여부
     * [EN] Whether an impostor render unit exists
     */
    get hasImpostor(): boolean;
    /**
     * [KO] 원거리 옥타헤드럴 임포스터(Octahedral Impostor) LOD 사용 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the far-distance Octahedral Impostor LOD is used.
     * @returns
     * [KO] 임포스터 사용 여부
     * [EN] Whether the impostor is used
     */
    get useImpostor(): boolean;
    set useImpostor(value: boolean);
    /**
     * [KO] 식생 표면의 그림자 수신 여부를 반환하거나 설정합니다.
     * [EN] Gets or sets whether the foliage surface receives shadows.
     * @returns
     * [KO] 그림자 수신 여부
     * [EN] Whether shadows are received
     */
    get receiveShadow(): boolean;
    set receiveShadow(value: boolean);
    /**
     * [KO] 서브 셀 스트리밍이 수행되는 유효 반경(미터 단위)을 반환합니다.
     * [EN] Returns the effective radius in meters within which sub-cell streaming is performed.
     * @returns
     * [KO] 스트리밍 반경 (미터)
     * [EN] Streaming radius in meters
     */
    get streamingRadius(): number;
    /**
     * [KO] 지형 하단 색상 블렌딩이 적용되는 높이 범위(미터 단위)를 반환하거나 설정합니다.
     * [EN] Gets or sets the height range in meters over which terrain ground color blending is applied.
     * @returns
     * [KO] 지형 블렌딩 높이 범위 (미터)
     * [EN] Ground blend height range in meters
     */
    get groundBlendRange(): number;
    /**
     * [KO] 현재 마운트되어 있는 서브 셀의 개수를 반환합니다.
     * [EN] Returns the number of currently mounted sub-cells.
     * @returns
     * [KO] 마운트된 서브 셀 개수
     * [EN] Number of mounted sub-cells
     */
    get mountedSubCellCount(): number;
    /**
     * [KO] 가장 최근 스트리밍 업데이트에서 새로 마운트된 서브 셀 개수를 반환합니다.
     * [EN] Returns the number of newly mounted sub-cells in the most recent streaming update.
     * @returns
     * [KO] 최근 마운트된 서브 셀 개수
     * [EN] Recently mounted sub-cell count
     */
    get lastMountedCount(): number;
    /**
     * [KO] 가장 최근 스트리밍 업데이트에서 마운트 해제된 서브 셀 개수를 반환합니다.
     * [EN] Returns the number of unmounted sub-cells in the most recent streaming update.
     * @returns
     * [KO] 최근 언마운트된 서브 셀 개수
     * [EN] Recently unmounted sub-cell count
     */
    get lastUnmountedCount(): number;
    /**
     * [KO] 식생 타입의 모든 렌더 유닛, 서브 셀 캐시 및 관련 리소스를 해제합니다.
     * [EN] Releases all render units, sub-cell caches, and associated resources of the foliage type.
     */
    destroy(): void;
    /**
     * [KO] 타입 파라미터를 동기화하고 모든 렌더 유닛 및 그림자 렌더 유닛의 슬롯 UBO를 GPU에 플러시합니다.
     * [EN] Synchronizes type parameters and flushes the slot UBOs of all render units and shadow render units to the GPU.
     */
    flushAllRenderUnitUBOs(): void;
    /**
     * [KO] 마운트된 모든 서브 셀의 상태를 초기화하고 서브 셀 캐시를 비웁니다.
     * [EN] Resets the state of all mounted sub-cells and clears the sub-cell cache.
     */
    clearSubCellCache(): void;
    /**
     * [KO] 특정 LOD 단계의 전환 거리를 변경합니다.
     * [EN] Updates the transition distance of a specific LOD level.
     *
     * @param lodIndex -
     * [KO] 대상 LOD 단계 인덱스
     * [EN] Target LOD level index
     * @param distance -
     * [KO] 설정할 전환 거리 (미터 단위)
     * [EN] Transition distance to set in meters
     */
    setLODDistance(lodIndex: number, distance: number): void;
    /**
     * [KO] 스캐터 속성 값이 변경되었을 때 호출되어 캐시 초기화, 리베이크 또는 UBO 갱신을 트리거합니다.
     * [EN] Invoked when a scatter property value changes, triggering cache reset, rebaking, or UBO update.
     *
     * @param prop -
     * [KO] 변경된 속성 이름
     * [EN] Name of the changed property
     */
    onParameterChanged(prop: string): void;
    /**
     * [KO] 카메라 위치를 기준으로 스트리밍 반경 내외의 서브 셀을 예산(Budget) 범위 안에서 마운트하거나 언마운트합니다.
     * [EN] Mounts or unmounts sub-cells inside and outside the streaming radius within the given budget based on the camera position.
     *
     * @param camX -
     * [KO] 카메라의 월드 X 좌표
     * [EN] World X coordinate of the camera
     * @param camZ -
     * [KO] 카메라의 월드 Z 좌표
     * [EN] World Z coordinate of the camera
     * @param mountBudget -
     * [KO] 프레임당 최대 서브 셀 마운트 허용 개수 (기본값: `16`)
     * [EN] Maximum number of sub-cells allowed to mount per frame (default: `16`)
     * @param unmountBudget -
     * [KO] 프레임당 최대 서브 셀 언마운트 허용 개수 (기본값: `32`)
     * [EN] Maximum number of sub-cells allowed to unmount per frame (default: `32`)
     */
    updateStreaming(camX: number, camZ: number, mountBudget?: number, unmountBudget?: number): void;
    /**
     * [KO] 현재 마운트된 모든 서브 셀의 인스턴스 변환 데이터를 GPU 메가 버퍼에 다시 베이킹합니다.
     * [EN] Rebakes the instance transform data of all currently mounted sub-cells into the GPU mega buffer.
     */
    rebake(): void;
}
export default Foliage;
