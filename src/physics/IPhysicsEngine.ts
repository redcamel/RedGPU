import Mesh from "../display/mesh/Mesh";
import { IPhysicsBody } from "./IPhysicsBody";
import { PhysicsBodyType } from "./PhysicsBodyType";
import { PhysicsShape } from "./PhysicsShape";

export interface BodyParams {
	type?: PhysicsBodyType;
	shape?: PhysicsShape;
	mass?: number;
	friction?: number;
	restitution?: number;
	linearDamping?: number;
	angularDamping?: number;
	isSensor?: boolean;
	enableCCD?: boolean;
}

/**
 * [KO] 물리 엔진 플러그인이 구현해야 할 인터페이스입니다.
 * [EN] Interface to be implemented by physics engine plugins.
 *
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
	 * @param handle1 - [KO] 첫 번째 충돌체의 핸들 [EN] Handle of the first collider
	 * @param handle2 - [KO] 두 번째 충돌체의 핸들 [EN] Handle of the second collider
	 */
	onCollisionStarted: (handle1: number, handle2: number) => void;

	/**
	 * [KO] 물리 엔진을 초기화합니다. (WASM 로딩 등)
	 * [EN] Initializes the physics engine. (WASM loading, etc.)
	 */
	init(): Promise<void>;

	/**
	 * [KO] 물리 시뮬레이션을 한 단계 진행합니다.
	 * [EN] Steps the physics simulation.
	 * @param deltaTime - [KO] 프레임 간 시간 간격 [EN] Time interval between frames
	 */
	step(deltaTime: number): void;

	/**
	 * [KO] 메쉬에 물리 바디를 생성하고 연결합니다.
	 * [EN] Creates and attaches a physics body to a mesh.
	 * @param mesh - [KO] 대상 메쉬 [EN] Target mesh
	 * @param params - [KO] 바디 생성 파라미터 [EN] Body creation parameters
	 * @returns [KO] 생성된 물리 바디 [EN] Created physics body
	 */
	createBody(mesh: Mesh, params: BodyParams): IPhysicsBody;

	/**
	 * [KO] 물리 바디를 제거합니다.
	 * [EN] Removes a physics body.
	 * @param body - [KO] 제거할 바디 [EN] Body to remove
	 */
	removeBody(body: IPhysicsBody): void;

	/**
	 * [KO] 중력을 설정합니다.
	 *
	 * * ### Example
	 * ```typescript
	 * physicsEngine.setGravity(0, -9.81, 0);
	 * ```
	 *
	 * @param x -
	 * [KO] X축 중력
	 * [EN] Gravity on X axis
	 * @param y -
	 * [KO] Y축 중력
	 * [EN] Gravity on Y axis
	 * @param z -
	 * [KO] Z축 중력
	 * [EN] Gravity on Z axis
	 */
	setGravity(x: number, y: number, z: number): void;

	/**
	 * [KO] 캐릭터 컨트롤러를 생성합니다.
	 * [EN] Creates a character controller.
	 *
	 * @param offset - [KO] 지면과의 간격 [EN] Offset from the ground
	 * @returns [KO] Rapier 캐릭터 컨트롤러 인스턴스 [EN] Rapier character controller instance
	 */
	createCharacterController(offset: number): any;
}
