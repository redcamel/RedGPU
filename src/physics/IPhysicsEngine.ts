import Mesh from '../display/mesh/Mesh';
import { IPhysicsBody } from './IPhysicsBody';
import { PhysicsShape } from './PhysicsShape';
import { PhysicsBodyType } from './PhysicsBodyType';

/**
 * [KO] 물리 바디 생성 시 사용하는 초기화 파라미터입니다.
 * [EN] Initialization parameters used when creating a physics body.
 *
 * @category Physics
 */
export interface BodyParams {
	/**
	 * [KO] 바디의 타입 (PHYSICS_BODY_TYPE 참고)
	 * [EN] Type of the body (See PHYSICS_BODY_TYPE)
	 *
	 * [KO] dynamic은 물리 법칙의 영향을 받고, static은 고정되어 있으며, kinematic은 코드로 직접 움직임을 제어합니다.
	 * [EN] dynamic is affected by physics laws, static is fixed, and kinematic is controlled directly by code.
	 */
	type: PhysicsBodyType;
	/**
	 * [KO] 충돌체 형상
	 * [EN] Shape of the collider
	 */
	shape?: PhysicsShape;
	/**
	 * [KO] 질량 (기본값: 1)
	 * [EN] Mass (Default: 1)
	 */
	mass?: number;
	/**
	 * [KO] 마찰 계수
	 * [EN] Friction coefficient
	 */
	friction?: number;
	/**
	 * [KO] 반발 계수 (탄성)
	 * [EN] Restitution coefficient (bounciness)
	 */
	restitution?: number;
	/**
	 * [KO] 선형 감쇠 (공기 저항 등, 기본값: 0)
	 * [EN] Linear damping (e.g. air resistance, Default: 0)
	 */
	linearDamping?: number;
	/**
	 * [KO] 회전 감쇠 (회전 저항 등, 기본값: 0)
	 * [EN] Angular damping (e.g. rotation resistance, Default: 0)
	 */
	angularDamping?: number;
	/**
	 * [KO] 센서 여부 (충돌은 발생하지 않으나 이벤트만 감지)
	 * [EN] Whether it is a sensor (no physical collision, only event detection)
	 */
	isSensor?: boolean;
	/**
	 * [KO] 연속 충돌 감지(CCD) 활성화 여부 (고속 물체 권장)
	 * [EN] Whether to enable Continuous Collision Detection (CCD) (Recommended for fast objects)
	 */
	enableCCD?: boolean;
}

/**
 * [KO] 물리 엔진 플러그인이 구현해야 하는 핵심 인터페이스입니다.
 * [EN] Core interface that physics engine plugins must implement.
 *
 * [KO] RedGPU는 이 인터페이스를 통해 다양한 물리 엔진(예: Rapier)을 동일한 방식으로 사용할 수 있습니다.
 * [EN] RedGPU can use various physics engines (e.g., Rapier) in the same way through this interface.
 *
 * @category Physics
 */
export interface IPhysicsEngine {
	/**
	 * [KO] 물리 엔진의 원본 인스턴스 (Escape Hatch)
	 * [EN] The native instance of the physics engine (Escape Hatch)
	 */
	nativeWorld: any;

	/**
	 * [KO] 물리 엔진을 초기화합니다. (WASM 로딩 등)
	 * [EN] Initializes the physics engine (e.g., loading WASM).
	 *
	 * * ### Example
	 * ```typescript
	 * await physicsEngine.init();
	 * ```
	 *
	 * @returns
	 * [KO] 초기화 완료 후 해결되는 Promise
	 * [EN] A Promise that resolves after initialization is complete
	 */
	init(): Promise<void>;

	/**
	 * [KO] 물리 시뮬레이션을 한 단계 진행시킵니다.
	 * [EN] Advances the physics simulation by one step.
	 *
	 * @param deltaTime -
	 * [KO] 이전 프레임 이후 경과 시간 (초)
	 * [EN] Elapsed time since the last frame (seconds)
	 */
	step(deltaTime: number): void;

	/**
	 * [KO] 메쉬를 기반으로 물리 바디를 생성합니다.
	 * [EN] Creates a physics body based on a mesh.
	 *
	 * * ### Example
	 * ```typescript
	 * const body = physicsEngine.createBody(mesh, { type: 'dynamic', shape: 'box' });
	 * ```
	 *
	 * @param mesh -
	 * [KO] 연결할 RedGPU 메쉬 객체
	 * [EN] RedGPU mesh object to connect
	 * @param params -
	 * [KO] 물리 바디 설정 파라미터
	 * [EN] Physics body configuration parameters
	 * @returns
	 * [KO] 생성된 물리 바디 객체
	 * [EN] The created physics body object
	 */
	createBody(mesh: Mesh, params: BodyParams): IPhysicsBody;

	/**
	 * [KO] 물리 바디를 월드에서 제거합니다.
	 * [EN] Removes a physics body from the world.
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
	 * @param offset - [KO] 지면과의 간격 [EN] Offset from the ground
	 * @returns [KO] Rapier 캐릭터 컨트롤러 인스턴스 [EN] Rapier character controller instance
	 */
	createCharacterController(offset: number): any;
}