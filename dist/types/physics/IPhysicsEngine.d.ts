import Mesh from "../display/mesh/Mesh";
import { IPhysicsBody } from "./IPhysicsBody";
import { PhysicsBodyType } from "./PhysicsBodyType";
import { PhysicsShape } from "./PhysicsShape";
/**
 * [KO] 물리 바디 생성을 위한 설정 파라미터 인터페이스입니다.
 * [EN] Configuration parameter interface for creating a physics body.
 *
 * @category Physics
 */
export interface BodyParams {
    /**
     * [KO] 물리 바디의 시뮬레이션 타입 (정적, 동적, 키네마틱)
     * [EN] Simulation type of the physics body (Static, Dynamic, Kinematic)
     */
    type?: PhysicsBodyType;
    /**
     * [KO] 충돌체의 형상
     * [EN] Collider shape
     */
    shape?: PhysicsShape;
    /**
     * [KO] 질량
     * [EN] Mass
     */
    mass?: number;
    /**
     * [KO] 마찰 계수
     * [EN] Friction coefficient
     */
    friction?: number;
    /**
     * [KO] 반발(탄성) 계수
     * [EN] Restitution coefficient
     */
    restitution?: number;
    /**
     * [KO] 선형 감쇠율
     * [EN] Linear damping
     */
    linearDamping?: number;
    /**
     * [KO] 각감쇠율
     * [EN] Angular damping
     */
    angularDamping?: number;
    /**
     * [KO] 물리적 충돌 반응 없이 이벤트만 발생시키는 센서 여부
     * [EN] Whether it acts as a sensor that triggers events without physical collision response
     */
    isSensor?: boolean;
    /**
     * [KO] 연속 충돌 감지(CCD) 활성화 여부
     * [EN] Whether to enable Continuous Collision Detection (CCD)
     */
    enableCCD?: boolean;
    /**
     * [KO] 높이맵 데이터 (`shape`가 `HEIGHTFIELD`일 경우 필수)
     * [EN] Heightfield data (Required when `shape` is `HEIGHTFIELD`)
     */
    heightData?: {
        /**
         * [KO] 세로(Z축) 세그먼트 수
         * [EN] Number of subdivisions along the Z-axis
         */
        nrows: number;
        /**
         * [KO] 가로(X축) 세그먼트 수
         * [EN] Number of subdivisions along the X-axis
         */
        ncols: number;
        /**
         * [KO] 높이 데이터 배열
         * [EN] Height data array
         */
        heights: Float32Array;
        /**
         * [KO] 충돌체의 전체 스케일
         * [EN] Total scale of the collider
         */
        scale: {
            x: number;
            y: number;
            z: number;
        };
    };
}
/**
 * [KO] 물리 엔진 플러그인이 구현해야 할 인터페이스입니다.
 * [EN] Interface to be implemented by physics engine plugins.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @experimental
 * @category Physics
 */
export interface IPhysicsEngine {
    /**
     * [KO] 물리 엔진의 원본 월드 인스턴스
     * [EN] Native world instance of the physics engine
     */
    readonly nativeWorld: any;
    /**
     * [KO] 물리 엔진 라이브러리 네임스페이스
     * [EN] Physics engine library namespace
     */
    readonly RAPIER: any;
    /**
     * [KO] 엔진에서 관리 중인 모든 물리 바디 목록
     * [EN] List of all physics bodies managed by the engine
     */
    readonly bodies: IPhysicsBody[];
    /**
     * [KO] 충돌이 시작될 때 호출되는 콜백 함수입니다.
     * [EN] Callback function invoked when a collision starts.
     *
     * @param handle1 -
     * [KO] 첫 번째 충돌체의 핸들
     * [EN] Handle of the first collider
     * @param handle2 -
     * [KO] 두 번째 충돌체의 핸들
     * [EN] Handle of the second collider
     */
    onCollisionStarted: (handle1: number, handle2: number) => void;
    /**
     * [KO] 물리 월드의 중력 가속도 벡터
     * [EN] Gravity acceleration vector of the physics world
     */
    gravity: {
        x: number;
        y: number;
        z: number;
    };
    /**
     * [KO] 물리 엔진을 비동기로 초기화합니다.
     * [EN] Asynchronously initializes the physics engine.
     *
     * @returns
     * [KO] 초기화 완료 `Promise<void>`
     * [EN] Initialization completion `Promise<void>`
     */
    init(): Promise<void>;
    /**
     * [KO] 물리 시뮬레이션을 한 단계 진행합니다.
     * [EN] Advances the physics simulation by one step.
     *
     * @param deltaTime -
     * [KO] 프레임 간 경과 시간(초)
     * [EN] Elapsed time between frames in seconds
     */
    step(deltaTime: number): void;
    /**
     * [KO] 메시에 물리 바디를 생성하여 연결합니다.
     * [EN] Creates and attaches a physics body to a mesh.
     *
     * @param mesh -
     * [KO] 대상 메시 객체
     * [EN] Target mesh object
     * @param params -
     * [KO] 바디 생성 설정 파라미터
     * [EN] Body creation configuration parameters
     * @returns
     * [KO] 생성된 `IPhysicsBody` 인스턴스
     * [EN] Created `IPhysicsBody` instance
     */
    createBody(mesh: Mesh, params: BodyParams): IPhysicsBody;
    /**
     * [KO] 물리 월드에서 물리 바디를 제거합니다.
     * [EN] Removes a physics body from the physics world.
     *
     * @param body -
     * [KO] 제거할 물리 바디
     * [EN] Physics body to remove
     */
    removeBody(body: IPhysicsBody): void;
    /**
     * [KO] 캐릭터 컨트롤러를 생성합니다.
     * [EN] Creates a character controller.
     *
     * @param offset -
     * [KO] 지면과의 오프셋 간격
     * [EN] Offset distance from the ground
     * @returns
     * [KO] 생성된 캐릭터 컨트롤러 인스턴스
     * [EN] Created character controller instance
     */
    createCharacterController(offset: number): any;
}
