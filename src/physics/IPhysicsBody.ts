import { quat, vec3 } from 'gl-matrix';

/**
 * [KO] 물리 엔진의 강체(Rigid Body)와 RedGPU 메쉬를 연결하는 인터페이스입니다.
 * [EN] Interface that connects a physics engine's rigid body with a RedGPU mesh.
 *
 * [KO] 이 인터페이스를 통해 물리 시뮬레이션 결과(위치, 회전 등)를 메쉬에 반영하거나, 외부에서 물리 객체를 제어할 수 있습니다.
 * [EN] Through this interface, physics simulation results (position, rotation, etc.) can be reflected in the mesh, or the physics object can be controlled externally.
 *
 * @category Physics
 */
export interface IPhysicsBody {
	/**
	 * [KO] 물리 엔진의 원본 Body 객체 (Escape Hatch)
	 * [EN] The native body object of the physics engine (Escape Hatch)
	 *
	 * [KO] 특정 물리 엔진(예: Rapier)의 고유 기능에 직접 접근해야 할 때 사용합니다.
	 * [EN] Used when direct access to unique features of a specific physics engine (e.g., Rapier) is required.
	 */
	nativeBody: any;

	/**
	 * [KO] 물리 바디의 현재 위치
	 * [EN] Current position of the physics body
	 *
	 * ### Example
	 * ```typescript
	 * body.position = [0, 10, 0];
	 * ```
	 */
	position: vec3 | { x: number; y: number; z: number };

	/**
	 * [KO] 물리 바디의 현재 회전 (쿼터니언)
	 * [EN] Current rotation of the physics body (Quaternion)
	 *
	 * ### Example
	 * ```typescript
	 * body.rotation = [0, 0, 0, 1];
	 * ```
	 */
	rotation: quat | { x: number; y: number; z: number; w: number };

	/**
	 * [KO] 물리 바디의 현재 선속도
	 * [EN] Current linear velocity of the physics body
	 *
	 * ### Example
	 * ```typescript
	 * const velocity = body.velocity;
	 * ```
	 */
	velocity: vec3 | { x: number; y: number; z: number };

	/**
	 * [KO] 물리 바디에 충격량(Impulse)을 적용합니다.
	 * [EN] Applies an impulse to the physics body.
	 *
	 * ### Example
	 * ```typescript
	 * body.applyImpulse([0, 5, 0]);
	 * ```
	 *
	 * @param force -
	 * [KO] 적용할 힘의 벡터
	 * [EN] Vector of the force to apply
	 */
	applyImpulse(force: vec3 | { x: number; y: number; z: number }): void;

	/**
	 * [KO] 물리 엔진의 시뮬레이션 결과를 연결된 메쉬의 트랜스폼에 동기화합니다.
	 * [EN] Synchronizes the physics engine's simulation results to the transform of the connected mesh.
	 *
	 * [KO] 일반적으로 렌더링 루프에서 자동으로 호출됩니다.
	 * [EN] Normally called automatically in the rendering loop.
	 */
	syncToMesh(): void;
}