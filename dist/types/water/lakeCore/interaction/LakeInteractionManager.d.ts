import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
import Mesh from "../../../display/mesh/Mesh";
/**
 * [KO] 호수 수면과 상호작용하는 활성 메시의 물리 및 파동 정보를 정의하는 인터페이스입니다.
 * [EN] Interface defining physical and wave information of an active mesh interacting with the lake surface.
 *
 * @category Water
 */
export interface LakeActiveMeshEntry {
    /**
     * [KO] 상호작용 대상 `Mesh` 인스턴스입니다.
     * [EN] Target `Mesh` instance for interaction.
     */
    mesh: Mesh;
    /**
     * [KO] 수면 침수에 의한 파동 강도입니다.
     * [EN] Wave strength caused by water submersion.
     */
    waveStrength: number;
    /**
     * [KO] 메시의 이동 속도(초당 월드 단위)입니다.
     * [EN] Movement speed of the mesh in world units per second.
     */
    speed: number;
    /**
     * [KO] 이동 중 발생하는 발걸음 충격 펄스 세기입니다. (범위: `0` ~ `1`)
     * [EN] Footstep impulse strength generated during movement. (Range: `0` ~ `1`)
     */
    stepPulse: number;
    /**
     * [KO] 보행 주기의 좌우 발 구분 부호입니다. (`-1.0` 또는 `1.0`)
     * [EN] Left/right foot indicator sign of the stride cycle. (`-1.0` or `1.0`)
     */
    footSide: number;
}
/**
 * [KO] 호수 수면과 교차하는 활성 메시를 선별하고 이동 속도 및 파동 파라미터를 계산하는 매니저 클래스입니다.
 * [EN] Manager class that selects active meshes intersecting the lake surface and computes movement speed and wave parameters.
 *
 * [KO] `Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.
 * [EN] Automatically created internally when a `Lake` instance is constructed.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Water
 */
declare class LakeInteractionManager extends RedGPUObject {
    #private;
    /**
     * [KO] `LakeInteractionManager` 인스턴스를 생성합니다.
     * [EN] Creates a `LakeInteractionManager` instance.
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 시뮬레이션 영역 내에 위치한 활성 메시 목록(`LakeActiveMeshEntry[]`)을 수집합니다.
     * [EN] Collects active meshes (`LakeActiveMeshEntry[]`) located within the simulation region.
     *
     * @param dt -
     * [KO] 프레임 델타 시간(초)
     * [EN] Frame delta time in seconds
     * @param domainCenterX -
     * [KO] 시뮬레이션 도메인 중심 월드 X 좌표
     * [EN] Simulation domain center world X coordinate
     * @param domainCenterZ -
     * [KO] 시뮬레이션 도메인 중심 월드 Z 좌표
     * [EN] Simulation domain center world Z coordinate
     * @param domainRadius -
     * [KO] 시뮬레이션 도메인 유효 반경
     * [EN] Effective radius of the simulation domain
     * @param waterLevel -
     * [KO] 호수 수면의 월드 Y 좌표
     * [EN] World Y coordinate of the lake water surface
     * @param verticalRange -
     * [KO] 수면 기준 상하 유효 판정 거리 (기본값: `6.0`)
     * [EN] Vertical check range above and below the water level (default: `6.0`)
     * @returns
     * [KO] 수집된 활성 메시 엔트리 배열 (`LakeActiveMeshEntry[]`)
     * [EN] Array of collected active mesh entries (`LakeActiveMeshEntry[]`)
     */
    collectActiveMeshes(dt: number, domainCenterX: number, domainCenterZ: number, domainRadius: number, waterLevel: number, verticalRange?: number): LakeActiveMeshEntry[];
    /**
     * [KO] 내부 모션 트래커와 활성 메시 버퍼를 정리합니다.
     * [EN] Clears internal motion trackers and the active mesh buffer.
     */
    destroy(): void;
}
export default LakeInteractionManager;
