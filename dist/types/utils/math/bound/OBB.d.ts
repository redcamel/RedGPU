import { mat4 } from "gl-matrix";
/**
 * 3차원 Oriented Bounding Box(OBB) 클래스
 *
 * 3차원 공간에서 임의의 방향을 갖는 경계 상자(Oriented Bounding Box)를 표현합니다.
 *
 * 중심 좌표, 반치수(half extents), 방향 행렬, 반지름 등의 정보를 제공합니다.
 *
 * 교차 및 포함 여부 판별, 복제 기능을 지원합니다.
 *
 * @category Bound
 */
export declare class OBB {
    #private;
    /** X축 중심 좌표 */
    readonly centerX: number;
    /** Y축 중심 좌표 */
    readonly centerY: number;
    /** Z축 중심 좌표 */
    readonly centerZ: number;
    /** X축 반치수(half extent) */
    readonly halfExtentX: number;
    /** Y축 반치수(half extent) */
    readonly halfExtentY: number;
    /** Z축 반치수(half extent) */
    readonly halfExtentZ: number;
    /** 방향 행렬(mat4) */
    readonly orientation: mat4;
    /** 중심 좌표 [x, y, z] */
    readonly center: [number, number, number];
    /** 반치수 [x, y, z] */
    readonly halfExtents: [number, number, number];
    /** 중심에서 꼭짓점까지의 거리(반지름) */
    readonly geometryRadius: number;
    /**
     * OBB 인스턴스를 생성합니다.
     * @param center 중심 좌표 [x, y, z]
     * @param halfExtents 반치수 [x, y, z]
     * @param orientation 방향 행렬(mat4)
     */
    constructor(center: [number, number, number], halfExtents: [number, number, number], orientation: mat4);
    /**
     * 다른 OBB와의 교차 여부를 반환합니다.
     * @param other 교차 여부를 검사할 OBB 인스턴스
     * @returns 교차하면 true, 아니면 false
     */
    intersects(other: OBB): boolean;
    /**
     * 점 또는 좌표가 OBB 내부에 포함되는지 여부를 반환합니다.
     * @param pointOrX [x, y, z] 배열 또는 x 좌표
     * @param y y 좌표 (선택)
     * @param z z 좌표 (선택)
     * @returns 포함되면 true, 아니면 false
     */
    contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean;
    /**
     * OBB 인스턴스를 복제합니다.
     * @returns 복제된 OBB 인스턴스
     */
    clone(): OBB;
}
export default OBB;
