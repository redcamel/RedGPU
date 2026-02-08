/**
 * [KO] 물리 바디의 시뮬레이션 타입을 정의합니다.
 * [EN] Defines the simulation types of physics bodies.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @experimental
 * @category Physics
 */
export const PHYSICS_BODY_TYPE = {
	/**
	 * [KO] 물리 법칙(중력, 충돌 등)의 영향을 받는 동적 바디
	 * [EN] Dynamic body affected by physics laws (gravity, collisions, etc.)
	 */
	DYNAMIC: 'dynamic',
	/**
	 * [KO] 움직이지 않고 고정된 정적 바디
	 * [EN] Fixed static body that does not move
	 */
	STATIC: 'static',
	/**
	 * [KO] 물리 법칙의 영향은 받지 않으나 코드로 직접 움직임을 제어하는 바디 (위치 기반)
	 * [EN] Kinematic body not affected by physics laws but controlled directly by code (Position based)
	 */
	KINEMATIC: 'kinematic',
	/**
	 * [KO] 물리 법칙의 영향은 받지 않으나 코드로 직접 움직임을 제어하는 바디 (위치 기반)
	 * [EN] Kinematic body not affected by physics laws but controlled directly by code (Position based)
	 */
	KINEMATIC_POSITION: 'kinematicPosition',
	/**
	 * [KO] 물리 법칙의 영향은 받지 않으나 속도로 움직임을 제어하는 바디
	 * [EN] Kinematic body controlled by velocity
	 */
	KINEMATIC_VELOCITY: 'kinematicVelocity'
} as const;

/**
 * [KO] `PHYSICS_BODY_TYPE`의 값들에 대한 유니온 타입입니다.
 * [EN] Union type for the values of `PHYSICS_BODY_TYPE`.
 */
export type PhysicsBodyType = typeof PHYSICS_BODY_TYPE[keyof typeof PHYSICS_BODY_TYPE];
