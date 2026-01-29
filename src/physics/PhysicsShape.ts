/**
 * [KO] 물리 시뮬레이션에서 사용하는 충돌체 형상(Shape)의 종류를 정의합니다.
 * [EN] Defines the types of collider shapes used in physics simulations.
 *
 * @category Physics
 */
export const PHYSICS_SHAPE = {
	/**
	 * [KO] 박스 형태의 충돌체
	 * [EN] Box-shaped collider
	 */
	BOX: 'box',
	/**
	 * [KO] 구 형태의 충돌체
	 * [EN] Sphere-shaped collider
	 */
	SPHERE: 'sphere',
	/**
	 * [KO] 캡슐 형태의 충돌체
	 * [EN] Capsule-shaped collider
	 */
	CAPSULE: 'capsule',
	/**
	 * [KO] 원통 형태의 충돌체
	 * [EN] Cylinder-shaped collider
	 */
	CYLINDER: 'cylinder',
	/**
	 * [KO] 평면 형태의 충돌체
	 * [EN] Plane-shaped collider
	 */
	PLANE: 'plane',
	/**
	 * [KO] 메쉬의 지오메트리를 그대로 사용하는 복잡한 충돌체 (비용 높음)
	 * [EN] Complex collider using the mesh geometry itself (high cost)
	 */
	MESH: 'mesh'
} as const;

/**
 * [KO] PHYSICS_SHAPE의 값들에 대한 유니온 타입입니다.
 * [EN] Union type for the values of PHYSICS_SHAPE.
 */
export type PhysicsShape = typeof PHYSICS_SHAPE[keyof typeof PHYSICS_SHAPE];
