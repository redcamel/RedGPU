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
	 * [KO] 원기둥 형태의 충돌체
	 * [EN] Cylinder-shaped collider
	 */
	CYLINDER: 'cylinder',
	/**
	 * [KO] 높이맵 형태의 충돌체 (지형 등에 사용)
	 * [EN] Heightfield-shaped collider (Used for terrain, etc.)
	 */
	HEIGHTFIELD: 'heightfield',
	/**
	 * [KO] 임의의 메시 형태의 충돌체 (Trimesh)
	 * [EN] Arbitrary mesh-shaped collider (Trimesh)
	 */
	MESH: 'mesh'
} as const;

/**
 * [KO] `PHYSICS_SHAPE`의 값들에 대한 유니온 타입입니다.
 * [EN] Union type for the values of `PHYSICS_SHAPE`.
 */
export type PhysicsShape = typeof PHYSICS_SHAPE[keyof typeof PHYSICS_SHAPE];