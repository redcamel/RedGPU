/**
 * [KO] 물리 시뮬레이션에서 사용하는 충돌체 형상(Shape) 상수입니다.
 * [EN] Collider shape constants used in physics simulations.
 *
 * ::: warning
 * [KO] 이 기능은 현재 실험적(Experimental) 단계입니다. 향후 API가 변경될 수 있습니다.
 * [EN] This feature is currently in the experimental stage. The API may change in the future.
 * :::
 *
 * @experimental
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
     * [KO] 높이맵 형태의 충돌체
     * [EN] Heightfield-shaped collider
     */
    HEIGHTFIELD: 'heightfield',
    /**
     * [KO] 삼각형 메시(Trimesh) 형태의 충돌체
     * [EN] Triangle mesh (Trimesh) collider
     */
    MESH: 'mesh'
} as const;

/**
 * [KO] `PHYSICS_SHAPE`의 값들에 대한 유니온 타입입니다.
 * [EN] Union type for the values of `PHYSICS_SHAPE`.
 *
 * @category Physics
 */
export type PhysicsShape = typeof PHYSICS_SHAPE[keyof typeof PHYSICS_SHAPE];