import { mat4 } from "gl-matrix";
/**
 * [KO] 3차원 방향성 경계 상자(Oriented Bounding Box) 클래스입니다.
 * [EN] 3D Oriented Bounding Box (OBB) class.
 *
 * [KO] 임의의 방향을 가질 수 있는 경계 상자를 정의하며 SAT 기반 교차 판정 및 포함 여부 확인 기능을 제공합니다.
 * [EN] Defines a bounding box with arbitrary orientation and provides SAT-based intersection and containment tests.
 *
 * * ### Example
 * ```typescript
 * const obb = new RedGPU.Util.OBB([0, 0, 0], [1, 1, 1], orientationMatrix);
 * const intersects = obb.intersects(otherOBB);
 * ```
 *
 * @category Bound
 */
export declare class OBB {
    #private;
    /**
     * [KO] X축 중심 좌표
     * [EN] Center X coordinate
     */
    readonly centerX: number;
    /**
     * [KO] Y축 중심 좌표
     * [EN] Center Y coordinate
     */
    readonly centerY: number;
    /**
     * [KO] Z축 중심 좌표
     * [EN] Center Z coordinate
     */
    readonly centerZ: number;
    /**
     * [KO] X축 반치수(half extent)
     * [EN] X half extent
     */
    readonly halfExtentX: number;
    /**
     * [KO] Y축 반치수(half extent)
     * [EN] Y half extent
     */
    readonly halfExtentY: number;
    /**
     * [KO] Z축 반치수(half extent)
     * [EN] Z half extent
     */
    readonly halfExtentZ: number;
    /**
     * [KO] 방향 행렬(mat4)
     * [EN] Orientation matrix (mat4)
     */
    readonly orientation: mat4;
    /**
     * [KO] 중심 좌표 [x, y, z]
     * [EN] Center coordinates [x, y, z]
     */
    readonly center: [number, number, number];
    /**
     * [KO] 반치수 [x, y, z]
     * [EN] Half extents [x, y, z]
     */
    readonly halfExtents: [number, number, number];
    /**
     * [KO] 중심에서 꼭짓점까지의 거리(반지름)
     * [EN] Distance from center to vertex (radius)
     */
    readonly geometryRadius: number;
    /**
     * [KO] OBB 인스턴스를 생성합니다.
     * [EN] Creates an OBB instance.
     *
     * @param center -
     * [KO] 중심 좌표 [x, y, z]
     * [EN] Center coordinates [x, y, z]
     * @param halfExtents -
     * [KO] 반치수 [x, y, z]
     * [EN] Half extents [x, y, z]
     * @param orientation -
     * [KO] 방향 행렬(mat4)
     * [EN] Orientation matrix (mat4)
     */
    constructor(center: [number, number, number], halfExtents: [number, number, number], orientation: mat4);
    /**
     * [KO] 다른 OBB와의 교차 여부를 반환합니다.
     * [EN] Returns whether it intersects with another OBB.
     *
     * @param other -
     * [KO] 교차 여부를 검사할 OBB 인스턴스
     * [EN] OBB instance to check for intersection
     * @returns
     * [KO] 교차하면 true, 아니면 false
     * [EN] True if intersecting, otherwise false
     */
    intersects(other: OBB): boolean;
    /**
     * [KO] 점 또는 좌표가 OBB 내부에 포함되는지 여부를 반환합니다.
     * [EN] Returns whether a point or coordinate is contained within the OBB.
     *
     * @param pointOrX -
     * [KO] [x, y, z] 배열 또는 x 좌표
     * [EN] [x, y, z] array or x coordinate
     * @param y -
     * [KO] y 좌표
     * [EN] y coordinate
     * @param z -
     * [KO] z 좌표
     * [EN] z coordinate
     * @returns
     * [KO] 포함되면 true, 아니면 false
     * [EN] True if contained, otherwise false
     */
    contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean;
    /**
     * [KO] OBB 인스턴스를 복제합니다.
     * [EN] Clones the OBB instance.
     *
     * @returns
     * [KO] 복제된 OBB 인스턴스
     * [EN] Cloned OBB instance
     */
    clone(): OBB;
}
export default OBB;
