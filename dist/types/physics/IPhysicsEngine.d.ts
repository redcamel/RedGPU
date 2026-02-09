import Mesh from "../display/mesh/Mesh";
import { IPhysicsBody } from "./IPhysicsBody";
import { PhysicsBodyType } from "./PhysicsBodyType";
import { PhysicsShape } from "./PhysicsShape";
/**
 * [KO] 물리 바디 생성을 위한 파라미터 인터페이스입니다.
 * [EN] Parameter interface for creating a physics body.
 */
export interface BodyParams {
    /**
     * [KO] 물리 바디의 타입 (정적, 동적, 키네마틱)
     * [EN] Type of the physics body (Static, Dynamic, Kinematic)
     */
    type?: PhysicsBodyType;
    /**
     * [KO] 충돌체의 형상
     * [EN] Shape of the collider
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
     * [KO] 탄성 계수
     * [EN] Restitution coefficient
     */
    restitution?: number;
    /**
     * [KO] 선형 감쇠
     * [EN] Linear damping
     */
    linearDamping?: number;
    /**
     * [KO] 각감쇠
     * [EN] Angular damping
     */
    angularDamping?: number;
    /**
     * [KO] 센서 여부 (충돌 반응 없이 이벤트만 발생)
     * [EN] Whether it is a sensor (Generates events without collision response)
     */
    isSensor?: boolean;
    /**
     * [KO] 연속 충돌 감지(CCD) 활성화 여부
     * [EN] Whether to enable Continuous Collision Detection (CCD)
     */
    enableCCD?: boolean;
    /**
     * [KO] 높이맵 데이터 (shape가 HEIGHTFIELD일 경우 필수)
     * [EN] Heightfield data (Required if shape is HEIGHTFIELD)
     */
    heightData?: {
        /**
         * [KO] 세로(Z축) 세그먼트 수
         * [EN] Number of subdivisions along the Z axis
         */
        nrows: number;
        /**
         * [KO] 가로(X축) 세그먼트 수
         * [EN] Number of subdivisions along the X axis
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
     * [KO] 물리 엔진의 원본 월드 인스턴스 (Escape Hatch)
     * [EN] The native world instance of the physics engine (Escape Hatch)
     */
    readonly nativeWorld: any;
    /**
     * [KO] 물리 엔진 라이브러리 네임스페이스 (Escape Hatch)
     * [EN] The physics engine library namespace (Escape Hatch)
     */
    readonly RAPIER: any;
    /**
     * [KO] 엔진에서 관리 중인 모든 물리 바디 리스트
     * [EN] List of all physics bodies managed by the engine
     */
    readonly bodies: IPhysicsBody[];
    /**
     * [KO] 물리 엔진에서 충돌이 시작될 때 호출되는 콜백입니다.
     * [EN] Callback called when a collision starts in the physics engine.
     * @param handle1 -
     * [KO] 첫 번째 충돌체의 핸들
     * [EN] Handle of the first collider
     * @param handle2 -
     * [KO] 두 번째 충돌체의 핸들
     * [EN] Handle of the second collider
     */
    onCollisionStarted: (handle1: number, handle2: number) => void;
    /**
     * [KO] 물리 엔진을 초기화합니다. (WASM 로딩 등)
     * [EN] Initializes the physics engine. (WASM loading, etc.)
     *
     * @returns
     * [KO] 초기화 완료를 보장하는 Promise
     * [EN] Promise that guarantees initialization completion
     */
    init(): Promise<void>;
    /**
     * [KO] 물리 시뮬레이션을 한 단계 진행합니다.
     * [EN] Steps the physics simulation.
     * @param deltaTime -
     * [KO] 프레임 간 시간 간격
     * [EN] Time interval between frames
     */
    step(deltaTime: number): void;
    /**
     * [KO] 메쉬에 물리 바디를 생성하고 연결합니다.
     * [EN] Creates and attaches a physics body to a mesh.
     * @param mesh -
     * [KO] 대상 메쉬
     * [EN] Target mesh
     * @param params -
     * [KO] 바디 생성 파라미터
     * [EN] Body creation parameters
     * @returns
     * [KO] 생성된 물리 바디
     * [EN] Created physics body
     */
    createBody(mesh: Mesh, params: BodyParams): IPhysicsBody;
    /**
     * [KO] 물리 바디를 제거합니다.
     * [EN] Removes a physics body.
     * @param body -
     * [KO] 제거할 바디
     * [EN] Body to remove
     */
    removeBody(body: IPhysicsBody): void;
    /**
     * [KO] 중력을 설정하거나 가져옵니다.
     * [EN] Sets or gets the gravity.
     *
     * ### Example
     * ```typescript
     * physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
     * ```
     */
    gravity: {
        x: number;
        y: number;
        z: number;
    };
    /**
     * [KO] 캐릭터 컨트롤러를 생성합니다.
     * [EN] Creates a character controller.
     *
     * @param offset -
     * [KO] 지면과의 간격
     * [EN] Offset from the ground
     * @returns
     * [KO] 캐릭터 컨트롤러 인스턴스
     * [EN] Character controller instance
     */
    createCharacterController(offset: number): any;
}
