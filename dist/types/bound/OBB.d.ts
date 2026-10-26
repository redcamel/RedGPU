import { mat4 } from "gl-matrix";
/**
 * [KO] 3차원 방향성 경계 상자(Oriented Bounding Box) 클래스입니다.
 * [EN] 3D Oriented Bounding Box (OBB) class.
 *
 * [KO] 중심 좌표, 세 축의 반치수(Half Extents), 방향 행렬(`mat4`)을 기반으로 회전된 경계 상자를 정의하며 분리축 정리(SAT) 기반 교차 판정 및 점 포함 여부를 검사합니다.
 * [EN] Defines an oriented bounding box using center coordinates, half-extents along three axes, and an orientation matrix (`mat4`), providing Separating Axis Theorem (SAT) intersection and point containment tests.
 *
 * ### Example
 * ```typescript
 * const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 1, 1], orientationMatrix);
 * const intersects = obb.intersects(otherOBB);
 * ```
 *
 * @category Bound
 */
export declare class OBB {
    #private;
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
     * [KO] 로컬 X축 방향의 반치수(Half Extent)입니다.
     * [EN] Half extent along the local X-axis.
     */
    readonly halfExtentX: number;
    /**
     * [KO] 로컬 Y축 방향의 반치수(Half Extent)입니다.
     * [EN] Half extent along the local Y-axis.
     */
    readonly halfExtentY: number;
    /**
     * [KO] 로컬 Z축 방향의 반치수(Half Extent)입니다.
     * [EN] Half extent along the local Z-axis.
     */
    readonly halfExtentZ: number;
    /**
     * [KO] 경계 상자의 회전 방향을 나타내는 4x4 행렬(`mat4`)입니다.
     * [EN] 4x4 matrix (`mat4`) representing the rotational orientation of the bounding box.
     */
    readonly orientation: mat4;
    /**
     * [KO] 경계 상자의 중심 좌표 `[x, y, z]` 튜플입니다.
     * [EN] Center coordinates `[x, y, z]` tuple of the bounding box.
     */
    readonly center: [number, number, number];
    /**
     * [KO] 경계 상자의 세 축 반치수 `[x, y, z]` 튜플입니다.
     * [EN] Half extents `[x, y, z]` tuple along the three axes of the bounding box.
     */
    readonly halfExtents: [number, number, number];
    /**
     * [KO] 경계 상자의 중심에서 꼭짓점까지의 유클리드 거리(외접 구 반지름)입니다.
     * [EN] Euclidean distance from the center of the bounding box to a corner vertex (bounding sphere radius).
     */
    readonly geometryRadius: number;
    /**
     * [KO] `OBB` 인스턴스를 생성합니다.
     * [EN] Creates an `OBB` instance.
     *
     * ### Example
     * ```typescript
     * const obb = new RedGPU.Bound.OBB([0, 0, 0], [1, 2, 1], orientationMatrix);
     * ```
     *
     * @param center -
     * [KO] 중심 좌표 `[x, y, z]`
     * [EN] Center coordinates `[x, y, z]`
     * @param halfExtents -
     * [KO] 각 축의 반치수 `[x, y, z]`
     * [EN] Half extents `[x, y, z]` along each axis
     * @param orientation -
     * [KO] 4x4 방향 행렬(`mat4`)
     * [EN] 4x4 orientation matrix (`mat4`)
     */
    constructor(center: [number, number, number], halfExtents: [number, number, number], orientation: mat4);
    /**
     * [KO] 분리축 정리(SAT)를 사용하여 다른 `OBB` 인스턴스와의 교차 여부를 판정합니다.
     * [EN] Determines whether this box intersects with another `OBB` instance using the Separating Axis Theorem (SAT).
     *
     * ### Example
     * ```typescript
     * const isIntersecting = obb.intersects(otherOBB);
     * ```
     *
     * @param other -
     * [KO] 교차 여부를 검사할 대상 `OBB` 인스턴스
     * [EN] Target `OBB` instance to test for intersection
     * @returns
     * [KO] 교차 시 `true`, 그렇지 않으면 `false`
     * [EN] `true` if intersecting, otherwise `false`
     */
    intersects(other: OBB): boolean;
    /**
     * [KO] 지정한 3차원 좌표 또는 점이 `OBB` 내부에 포함되는지 확인합니다.
     * [EN] Checks whether the specified 3D coordinate or point is contained within the `OBB`.
     *
     * ### Example
     * ```typescript
     * const isInside = obb.contains(0, 0, 0);
     * const isPointInside = obb.contains([0, 0, 0]);
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
     * [KO] 현재 `OBB`와 동일한 속성을 가진 새 `OBB` 인스턴스를 복제하여 반환합니다.
     * [EN] Clones and returns a new `OBB` instance with the same properties as the current `OBB`.
     *
     * ### Example
     * ```typescript
     * const clonedOBB = obb.clone();
     * ```
     *
     * @returns
     * [KO] 복제된 `OBB` 인스턴스
     * [EN] Cloned `OBB` instance
     */
    clone(): OBB;
}
export default OBB;
