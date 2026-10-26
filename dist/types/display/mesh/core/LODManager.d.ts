import Geometry from "../../../geometry/Geometry";
import Primitive from "../../../primitive/core/Primitive";
import ABaseMaterial from "../../../material/core/ABaseMaterial";
/**
 * [KO] LOD 단계에 사용할 수 있는 지오메트리 타입입니다.
 * [EN] Geometry type that can be used for LOD levels.
 *
 * @category Core
 */
type LODGeometry = Geometry | Primitive;
/**
 * [KO] 단일 LOD(Level of Detail) 레벨을 나타내는 정보입니다.
 * [EN] Information representing a single LOD (Level of Detail) level.
 *
 * @category Core
 */
type LODEntry = {
    distance: number;
    distanceSquared: number;
    geometry: LODGeometry;
    materialIsPBR: boolean;
    geometryIsPBR: boolean;
    material?: ABaseMaterial;
    label?: string;
    source?: string;
};
/**
 * [KO] 거리 기반 LOD(Level of Detail)를 관리하는 클래스입니다.
 * [EN] Class that manages distance-based LOD (Level of Detail).
 *
 * [KO] 카메라와의 거리에 따라 적절한 지오메트리 및 재질 레벨을 선택하고, LOD 목록이 변경될 때 콜백을 호출합니다.
 * [EN] Selects the appropriate geometry and material level based on distance from the camera, and invokes a callback when the LOD list changes.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * ### Example
 * ```typescript
 * // [KO] Mesh 인스턴스를 통해 접근
 * // [EN] Access via Mesh instance
 * const lodManager = mesh.LODManager;
 * lodManager.addLOD(10, nearGeometry, material);
 * ```
 *
 * @see [Mesh CPU LOD example](/RedGPU/examples/3d/lod/MeshCPULOD/)
 * @see [Mesh CPU LOD material example](/RedGPU/examples/3d/lod/MeshCPULOD_material/)
 * @see [InstancingMesh GPU LOD example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD/)
 * @see [InstancingMesh GPU LOD material example](/RedGPU/examples/3d/lod/InstanceMeshGPULOD_material/)
 * @category Core
 */
declare class LODManager {
    #private;
    /**
     * [KO] LODManager 인스턴스를 생성합니다.
     * [EN] Creates a LODManager instance.
     *
     * @param owner -
     * [KO] LODManager를 소유하는 대상 객체
     * [EN] Target object that owns the LODManager
     * @param callback -
     * [KO] LOD 목록이 변경될 때 호출되는 콜백 함수
     * [EN] Callback function invoked when the LOD list changes
     */
    constructor(owner: any, callback: () => void);
    /**
     * [KO] 등록된 모든 LOD 레벨 목록의 복사본을 반환합니다.
     * [EN] Returns a copy of all registered LOD levels.
     *
     * @returns
     * [KO] LOD 레벨 정보 배열 복사본
     * [EN] Copy of the LOD level entry array
     */
    get LODList(): LODEntry[];
    /**
     * [KO] 새로운 LOD 레벨을 추가합니다. 최대 8개까지 등록할 수 있으며 동일한 거리는 중복 등록할 수 없습니다.
     * [EN] Adds a new LOD level. Up to 8 levels can be registered, and duplicate distances are not allowed.
     *
     * ### Example
     * ```typescript
     * mesh.LODManager.addLOD(20, lowPolyGeometry, material);
     * ```
     *
     * @param distance -
     * [KO] 이 LOD가 활성화될 기준 거리 (1 이상의 양수)
     * [EN] Threshold distance at which this LOD activates (positive number >= 1)
     * @param geometry -
     * [KO] 해당 LOD 거리에서 사용할 지오메트리
     * [EN] Geometry to use at this LOD distance
     * @param material -
     * [KO] 해당 LOD 거리에서 사용할 재질
     * [EN] Material to use at this LOD distance
     * @throws
     * [KO] LOD 레벨이 8개를 초과하거나 동일한 거리의 LOD가 이미 존재할 경우 Error 발생
     * [EN] Throws Error if LOD levels exceed 8 or if a LOD with the same distance already exists
     */
    addLOD(distance: number, geometry: LODGeometry, material: ABaseMaterial): void;
    /**
     * [KO] 현재 거리 값에 해당하는 LOD 엔트리를 반환합니다.
     * [EN] Returns the LOD entry corresponding to the current distance value.
     *
     * @param currentDistance -
     * [KO] 기준이 되는 현재 거리 값
     * [EN] Current distance value to evaluate
     * @returns
     * [KO] 선택된 LOD 엔트리 (등록된 LOD가 없으면 `undefined`)
     * [EN] Selected LOD entry (`undefined` if no LOD is registered)
     */
    getLOD(currentDistance: number): LODEntry | undefined;
    /**
     * [KO] 지정한 기준 거리의 LOD 레벨을 제거합니다.
     * [EN] Removes the LOD level with the specified threshold distance.
     *
     * @param distance -
     * [KO] 제거할 LOD 레벨의 기준 거리
     * [EN] Threshold distance of the LOD level to remove
     */
    removeLOD(distance: number): void;
    /**
     * [KO] 등록된 모든 LOD 레벨을 제거합니다.
     * [EN] Removes all registered LOD levels.
     */
    clearLOD(): void;
}
export default LODManager;
