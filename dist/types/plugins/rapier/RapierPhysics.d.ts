import RAPIER from '@dimforge/rapier3d-compat';
import Mesh from '../../display/mesh/Mesh';
import { BodyParams, IPhysicsEngine } from '../../physics/IPhysicsEngine';
import { RapierBody } from './RapierBody';
/**
 * [KO] Rapier 물리 엔진을 사용하는 RedGPU 물리 플러그인 구현체입니다.
 * [EN] RedGPU physics plugin implementation using the Rapier physics engine.
 *
 * [KO] 이 클래스는 WASM 기반의 Rapier 엔진을 RedGPU 환경에 통합하며, 고성능 물리 시뮬레이션 월드를 관리합니다. 강체 생성, 충돌 감지, 캐릭터 컨트롤러 및 중력 설정과 같은 핵심 물리 기능을 제공합니다.
 * [EN] This class integrates the WASM-based Rapier engine into the RedGPU environment and manages a high-performance physics simulation world. It provides core physics features such as rigid body creation, collision detection, character controllers, and gravity settings.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @see [KO] [물리 플러그인 매뉴얼](/RedGPU/manual/ko/plugins/physics)
 * @see [EN] [Physics Plugin Manual](/RedGPU/manual/en/plugins/physics)
 * @experimental
 * @category RapierPhysics
 */
export declare class RapierPhysics implements IPhysicsEngine {
    #private;
    /**
     * [KO] 물리 엔진에서 충돌이 시작될 때 호출되는 콜백입니다.
     * [EN] Callback called when a collision starts in the physics engine.
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
     * [KO] 물리 엔진의 원본 월드(World) 객체를 반환합니다.
     * [EN] Returns the native World object of the physics engine.
     * @readonly
     */
    get nativeWorld(): RAPIER.World;
    /**
     * [KO] Rapier 라이브러리 네임스페이스를 반환합니다.
     * [EN] Returns the Rapier library namespace.
     * @readonly
     */
    get RAPIER(): typeof RAPIER;
    /**
     * [KO] 엔진에서 관리 중인 모든 RapierBody 리스트를 반환합니다.
     * [EN] Returns a list of all RapierBody instances managed by the engine.
     * @readonly
     */
    get bodies(): RapierBody[];
    /**
     * [KO] 콜라이더 핸들을 통해 관리 중인 RapierBody를 찾아서 반환합니다.
     * [EN] Finds and returns the managed RapierBody using its collider handle.
     *
     * * ### Example
     * ```typescript
     * const body = physicsEngine.getBodyByColliderHandle(handle);
     * ```
     *
     * @param handle -
     * [KO] 찾을 콜라이더의 고유 핸들
     * [EN] Unique handle of the collider to find
     * @returns
     * [KO] 찾은 RapierBody (없으면 undefined)
     * [EN] The found RapierBody (undefined if not found)
     */
    getBodyByColliderHandle(handle: number): RapierBody;
    /**
     * [KO] Rapier 엔진을 초기화하고 물리 월드를 생성합니다.
     * [EN] Initializes the Rapier engine and creates the physics world.
     *
     * * ### Example
     * ```typescript
     * await physicsEngine.init();
     * ```
     *
     * @returns
     * [KO] 초기화 완료를 보장하는 Promise
     * [EN] Promise that guarantees initialization completion
     */
    init(): Promise<void>;
    /**
     * [KO] 물리 시뮬레이션을 한 단계 진행하고 메쉬 트랜스폼을 동기화합니다.
     * [EN] Steps the physics simulation and synchronizes mesh transforms.
     *
     * * ### Example
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
     * [KO] 특정 메쉬에 물리 바디를 생성하고 엔진에 등록합니다.
     * [EN] Creates a physics body for a specific mesh and registers it with the engine.
     *
     * * ### Example
     * ```typescript
     * const body = physicsEngine.createBody(mesh, {
     *     type: RedGPU.Physics.PHYSICS_BODY_TYPE.DYNAMIC,
     *     shape: RedGPU.Physics.PHYSICS_SHAPE.SPHERE,
     *     mass: 1.0
     * });
     * ```
     *
     * @param mesh -
     * [KO] 대상 RedGPU 메쉬
     * [EN] Target RedGPU mesh
     * @param params -
     * [KO] 바디 생성 설정 파라미터
     * [EN] Parameters for body creation
     * @returns
     * [KO] 생성된 RapierBody 인스턴스
     * [EN] Created RapierBody instance
     */
    createBody(mesh: Mesh, params: BodyParams): RapierBody;
    /**
     * [KO] 물리 바디를 엔진에서 제거합니다.
     * [EN] Removes a physics body from the engine.
     *
     * * ### Example
     * ```typescript
     * // [KO] 물리 바디 제거
     * // [EN] Remove physics body
     * physicsEngine.removeBody(body);
     * ```
     *
     * @param body -
     * [KO] 제거할 RapierBody 인스턴스
     * [EN] RapierBody instance to remove
     */
    removeBody(body: RapierBody): void;
    /**
     * [KO] 물리 월드의 중력 가속도를 설정하거나 반환합니다.
     * [EN] Sets or returns the gravity acceleration of the physics world.
     *
     * * ### Example
     * ```typescript
     * // [KO] 중력 설정
     * // [EN] Set gravity
     * physicsEngine.gravity = { x: 0, y: -9.81, z: 0 };
     * ```
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
     * [KO] 캐릭터 컨트롤러를 생성하여 반환합니다.
     * [EN] Creates and returns a character controller.
     *
     * * ### Example
     * ```typescript
     * const controller = physicsEngine.createCharacterController(0.1);
     * ```
     *
     * @param offset -
     * [KO] 캐릭터와 지면 사이의 간격
     * [EN] Offset between the character and the ground
     * @returns
     * [KO] Rapier 캐릭터 컨트롤러 인스턴스
     * [EN] Rapier character controller instance
     */
    createCharacterController(offset: number): RAPIER.KinematicCharacterController;
}
