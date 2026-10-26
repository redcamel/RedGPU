import RAPIER from '@dimforge/rapier3d-compat';
import Mesh from '../../display/mesh/Mesh';
import { BodyParams, IPhysicsEngine } from '../../physics/IPhysicsEngine';
import { RapierBody } from './RapierBody';
/**
 * [KO] Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인 구현체입니다.
 * [EN] RedGPU physics plugin implementation using the Rapier physics engine.
 *
 * [KO] WASM 기반의 Rapier 엔진을 통합하여 강체 생성, 충돌 감지, 캐릭터 컨트롤러 및 중력 설정 등 물리 시뮬레이션 월드를 관리합니다.
 * [EN] Integrates the WASM-based Rapier engine to manage the physics simulation world, including rigid body creation, collision detection, character controllers, and gravity settings.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @see [Basic Physics example](/RedGPU/examples/physics/basic/)
 * @experimental
 * @category RapierPhysics
 */
export declare class RapierPhysics implements IPhysicsEngine {
    #private;
    /**
     * [KO] 물리 엔진에서 충돌이 시작될 때 호출되는 콜백 함수입니다.
     * [EN] Callback function invoked when a collision starts in the physics engine.
     *
     * @param handle1 -
     * [KO] 첫 번째 콜라이더 핸들
     * [EN] Handle of the first collider
     * @param handle2 -
     * [KO] 두 번째 콜라이더 핸들
     * [EN] Handle of the second collider
     */
    onCollisionStarted: (handle1: number, handle2: number) => void;
    /**
     * [KO] 물리 엔진의 원본 월드(World) 객체를 반환합니다.
     * [EN] Returns the native World object of the physics engine.
     *
     * @returns
     * [KO] Rapier 원본 월드 객체
     * [EN] Native Rapier World object
     */
    get nativeWorld(): RAPIER.World;
    /**
     * [KO] Rapier 라이브러리 네임스페이스를 반환합니다.
     * [EN] Returns the Rapier library namespace.
     *
     * @returns
     * [KO] Rapier 네임스페이스 객체
     * [EN] Rapier namespace object
     */
    get RAPIER(): typeof RAPIER;
    /**
     * [KO] 엔진에서 관리 중인 모든 `RapierBody` 목록을 반환합니다.
     * [EN] Returns a list of all `RapierBody` instances managed by the engine.
     *
     * @returns
     * [KO] `RapierBody` 인스턴스 배열
     * [EN] Array of `RapierBody` instances
     */
    get bodies(): RapierBody[];
    /**
     * [KO] 물리 월드의 중력 가속도를 가져오거나 설정합니다.
     * [EN] Gets or sets the gravity acceleration of the physics world.
     *
     * ### Example
     * ```typescript
     * // [KO] 중력 설정
     * // [EN] Set gravity
     * physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
     * ```
     *
     * @returns
     * [KO] X, Y, Z 축 중력 가속도 벡터
     * [EN] Gravity acceleration vector for X, Y, and Z axes
     */
    get gravity(): {
        x: number;
        y: number;
        z: number;
    };
    set gravity(value: {
        x: number;
        y: number;
        z: number;
    });
    /**
     * [KO] 콜라이더 핸들로 관리 중인 `RapierBody`를 조회하여 반환합니다.
     * [EN] Finds and returns the managed `RapierBody` by its collider handle.
     *
     * ### Example
     * ```typescript
     * const body = physicsEngine.getBodyByColliderHandle(handle);
     * ```
     *
     * @param handle -
     * [KO] 조회할 콜라이더의 고유 핸들
     * [EN] Unique handle of the collider to find
     * @returns
     * [KO] 조회된 `RapierBody` 인스턴스 (존재하지 않으면 `undefined`)
     * [EN] Found `RapierBody` instance (`undefined` if not found)
     */
    getBodyByColliderHandle(handle: number): RapierBody;
    /**
     * [KO] Rapier 엔진을 초기화하고 기본 중력이 적용된 물리 월드를 생성합니다.
     * [EN] Initializes the Rapier engine and creates a physics world with default gravity.
     *
     * ### Example
     * ```typescript
     * await physicsEngine.init();
     * ```
     *
     * @returns
     * [KO] 초기화 완료 `Promise`
     * [EN] `Promise` that resolves when initialization is complete
     */
    init(): Promise<void>;
    /**
     * [KO] 물리 시뮬레이션을 한 스텝 진행하고 충돌 이벤트 처리 및 메쉬 트랜스폼 동기화를 수행합니다.
     * [EN] Advances the physics simulation by one step, processes collision events, and synchronizes mesh transforms.
     *
     * ### Example
     * ```typescript
     * // [KO] 렌더링 루프에서 물리 시뮬레이션 진행
     * // [EN] Step physics simulation in rendering loop
     * renderer.start(redGPUContext, (time, deltaTime) => {
     *     physicsEngine.step(deltaTime / 1000);
     * });
     * ```
     *
     * @param deltaTime -
     * [KO] 프레임 간 시간 간격 (초 단위)
     * [EN] Time interval between frames (in seconds)
     */
    step(deltaTime: number): void;
    /**
     * [KO] 대상 메쉬에 물리 바디와 콜라이더를 생성하고 물리 월드에 등록합니다.
     * [EN] Creates a physics body and colliders for the target mesh and registers them in the physics world.
     *
     * ### Example
     * ```typescript
     * const body = physicsEngine.createBody(mesh, {
     *     type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
     *     shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
     *     mass: 1.0
     * });
     * ```
     *
     * @param mesh -
     * [KO] 물리 바디를 적용할 대상 메쉬
     * [EN] Target mesh to apply the physics body
     * @param params -
     * [KO] 물리 바디 생성 설정 파라미터
     * [EN] Configuration parameters for creating the physics body
     * @returns
     * [KO] 생성된 `RapierBody` 인스턴스
     * [EN] Created `RapierBody` instance
     */
    createBody(mesh: Mesh, params: BodyParams): RapierBody;
    /**
     * [KO] 물리 바디를 물리 월드에서 제거합니다.
     * [EN] Removes a physics body from the physics world.
     *
     * ### Example
     * ```typescript
     * // [KO] 물리 바디 제거
     * // [EN] Remove physics body
     * physicsEngine.removeBody(body);
     * ```
     *
     * @param body -
     * [KO] 제거할 `RapierBody` 인스턴스
     * [EN] `RapierBody` instance to remove
     */
    removeBody(body: RapierBody): void;
    /**
     * [KO] 경사로 및 계단 오르기와 지면 밀착이 활성화된 캐릭터 컨트롤러를 생성하여 반환합니다.
     * [EN] Creates and returns a character controller with autostep and snap-to-ground enabled.
     *
     * ### Example
     * ```typescript
     * const controller = physicsEngine.createCharacterController(0.1);
     * ```
     *
     * @param offset -
     * [KO] 캐릭터와 주변 장애물 사이의 여유 간격
     * [EN] Clearance offset between the character and surrounding obstacles
     * @returns
     * [KO] 생성된 `RAPIER.KinematicCharacterController` 인스턴스
     * [EN] Created `RAPIER.KinematicCharacterController` instance
     */
    createCharacterController(offset: number): RAPIER.KinematicCharacterController;
}
