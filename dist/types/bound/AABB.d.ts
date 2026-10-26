/**
 * [KO] 3차원 축 정렬 경계 상자(Axis-Aligned Bounding Box) 클래스입니다.
 * [EN] 3D Axis-Aligned Bounding Box (AABB) class.
 *
 * [KO] 각 축의 최소·최대 좌표를 기반으로 경계 영역의 중심, 크기, 반지름을 계산하며 교차 판정 및 점 포함 여부를 검사합니다.
 * [EN] Calculates the center, size, and radius of a bounding volume based on min/max coordinates along each axis, and tests for intersection and point containment.
 *
 * ### Example
 * ```typescript
 * const aabb = new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1);
 * const intersects = aabb.intersects(otherAABB);
 * ```
 *
 * @category Bound
 */
export declare class AABB {
    /**
     * [KO] X축 최소 좌표입니다.
     * [EN] Minimum X coordinate.
     */
    readonly minX: number;
    /**
     * [KO] X축 최대 좌표입니다.
     * [EN] Maximum X coordinate.
     */
    readonly maxX: number;
    /**
     * [KO] Y축 최소 좌표입니다.
     * [EN] Minimum Y coordinate.
     */
    readonly minY: number;
    /**
     * [KO] Y축 최대 좌표입니다.
     * [EN] Maximum Y coordinate.
     */
    readonly maxY: number;
    /**
     * [KO] Z축 최소 좌표입니다.
     * [EN] Minimum Z coordinate.
     */
    readonly minZ: number;
    /**
     * [KO] Z축 최대 좌표입니다.
     * [EN] Maximum Z coordinate.
     */
    readonly maxZ: number;
    /**
     * [KO] X축 중심 좌표입니다.
     * [EN] Center X coordinate.
     */
    readonly centerX: number;
    /**
     * [KO] Y축 중심 좌표입니다.
     * [EN] Center Y coordinate.
     */
    readonly centerY: number;
    /**
     * [KO] Z축 중심 좌표입니다.
     * [EN] Center Z coordinate.
     */
    readonly centerZ: number;
    /**
     * [KO] X축 방향 전체 크기(`maxX - minX`)입니다.
     * [EN] Total size along the X-axis (`maxX - minX`).
     */
    readonly xSize: number;
    /**
     * [KO] Y축 방향 전체 크기(`maxY - minY`)입니다.
     * [EN] Total size along the Y-axis (`maxY - minY`).
     */
    readonly ySize: number;
    /**
     * [KO] Z축 방향 전체 크기(`maxZ - minZ`)입니다.
     * [EN] Total size along the Z-axis (`maxZ - minZ`).
     */
    readonly zSize: number;
    /**
     * [KO] 경계 상자의 중심에서 꼭짓점까지의 유클리드 거리(외접 구 반지름)입니다.
     * [EN] Euclidean distance from the center of the bounding box to a corner vertex (bounding sphere radius).
     */
    readonly geometryRadius: number;
    /**
     * [KO] `AABB` 인스턴스를 생성합니다.
     * [EN] Creates an `AABB` instance.
     *
     * ### Example
     * ```typescript
     * const aabb = new RedGPU.Bound.AABB(-5, 5, -5, 5, -5, 5);
     * ```
     *
     * @param minX -
     * [KO] X축 최소값 (기본값: `0`)
     * [EN] Minimum X value (default: `0`)
     * @param maxX -
     * [KO] X축 최대값 (기본값: `0`)
     * [EN] Maximum X value (default: `0`)
     * @param minY -
     * [KO] Y축 최소값 (기본값: `0`)
     * [EN] Minimum Y value (default: `0`)
     * @param maxY -
     * [KO] Y축 최대값 (기본값: `0`)
     * [EN] Maximum Y value (default: `0`)
     * @param minZ -
     * [KO] Z축 최소값 (기본값: `0`)
     * [EN] Minimum Z value (default: `0`)
     * @param maxZ -
     * [KO] Z축 최대값 (기본값: `0`)
     * [EN] Maximum Z value (default: `0`)
     */
    constructor(minX?: number, maxX?: number, minY?: number, maxY?: number, minZ?: number, maxZ?: number);
    /**
     * [KO] 현재 `AABB` 인스턴스의 경계 좌표와 파생 속성들을 제자리(In-place)에서 갱신합니다.
     * [EN] Updates the bounding coordinates and derived properties of the current `AABB` instance in-place.
     *
     * ### Example
     * ```typescript
     * aabb.set(-10, 10, -10, 10, -10, 10);
     * ```
     *
     * @param minX -
     * [KO] X축 최소값
     * [EN] Minimum X value
     * @param maxX -
     * [KO] X축 최대값
     * [EN] Maximum X value
     * @param minY -
     * [KO] Y축 최소값
     * [EN] Minimum Y value
     * @param maxY -
     * [KO] Y축 최대값
     * [EN] Maximum Y value
     * @param minZ -
     * [KO] Z축 최소값
     * [EN] Minimum Z value
     * @param maxZ -
     * [KO] Z축 최대값
     * [EN] Maximum Z value
     * @returns
     * [KO] 갱신된 현재 `AABB` 인스턴스
     * [EN] Updated current `AABB` instance
     */
    set(minX: number, maxX: number, minY: number, maxY: number, minZ: number, maxZ: number): this;
    /**
     * [KO] 다른 `AABB` 인스턴스의 경계 값을 현재 인스턴스에 복사합니다.
     * [EN] Copies the bounding values of another `AABB` instance into the current instance.
     *
     * ### Example
     * ```typescript
     * aabb.copy(otherAABB);
     * ```
     *
     * @param other -
     * [KO] 복사할 원본 `AABB` 인스턴스
     * [EN] Source `AABB` instance to copy from
     * @returns
     * [KO] 갱신된 현재 `AABB` 인스턴스
     * [EN] Updated current `AABB` instance
     */
    copy(other: AABB): this;
    /**
     * [KO] 다른 `AABB` 인스턴스와의 교차 여부를 판정합니다.
     * [EN] Determines whether this box intersects with another `AABB` instance.
     *
     * ### Example
     * ```typescript
     * const isIntersecting = aabb.intersects(otherAABB);
     * ```
     *
     * @param other -
     * [KO] 교차 여부를 검사할 대상 `AABB` 인스턴스
     * [EN] Target `AABB` instance to test for intersection
     * @returns
     * [KO] 교차 시 `true`, 그렇지 않으면 `false`
     * [EN] `true` if intersecting, otherwise `false`
     */
    intersects(other: AABB): boolean;
    /**
     * [KO] 지정한 3차원 좌표 또는 점이 `AABB` 내부에 포함되는지 확인합니다.
     * [EN] Checks whether the specified 3D coordinate or point is contained within the `AABB`.
     *
     * ### Example
     * ```typescript
     * const isInside = aabb.contains(0, 0, 0);
     * const isPointInside = aabb.contains([0, 0, 0]);
     * ```
     *
     * @param pointOrX -
     * [KO] `[x, y, z]` 좌표 튜플 배열 또는 X축 좌표
     * [EN] `[x, y, z]` coordinate tuple array or X-axis coordinate
     * @param y -
     * [KO] Y축 좌표 (`pointOrX`가 숫자인 경우 사용)
     * [EN] Y-axis coordinate (used when `pointOrX` is a number)
     * @param z -
     * [KO] Z축 좌표 (`pointOrX`가 숫자인 경우 사용)
     * [EN] Z-axis coordinate (used when `pointOrX` is a number)
     * @returns
     * [KO] 포함 시 `true`, 그렇지 않으면 `false`
     * [EN] `true` if contained, otherwise `false`
     */
    contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean;
    /**
     * [KO] 현재 `AABB`와 동일한 경계 값을 가진 새 `AABB` 인스턴스를 복제하여 반환합니다.
     * [EN] Clones and returns a new `AABB` instance with the same bounding values as the current `AABB`.
     *
     * ### Example
     * ```typescript
     * const clonedAABB = aabb.clone();
     * ```
     *
     * @returns
     * [KO] 복제된 `AABB` 인스턴스
     * [EN] Cloned `AABB` instance
     */
    clone(): AABB;
}
export default AABB;
