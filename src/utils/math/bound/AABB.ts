import consoleAndThrowError from "../../consoleAndThrowError";

/**
 * 3차원 Axis-Aligned Bounding Box(AABB) 클래스
 *
 * 3차원 공간에서 축에 정렬된 경계 상자(Axis-Aligned Bounding Box)를 표현합니다.
 *
 * min/max 좌표, 중심 좌표, 크기, 반지름 등의 정보를 제공합니다.
 *
 * 교차 및 포함 여부 판정, 복제 기능을 지원합니다.
 *
 * @category Bound
 */
export class AABB {
    /** X축 최소값 */
    readonly minX: number;
    /** X축 최대값 */
    readonly maxX: number;
    /** Y축 최소값 */
    readonly minY: number;
    /** Y축 최대값 */
    readonly maxY: number;
    /** Z축 최소값 */
    readonly minZ: number;
    /** Z축 최대값 */
    readonly maxZ: number;
    /** X축 중심 좌표 */
    readonly centerX: number;
    /** Y축 중심 좌표 */
    readonly centerY: number;
    /** Z축 중심 좌표 */
    readonly centerZ: number;
    /** X축 크기 */
    readonly xSize: number;
    /** Y축 크기 */
    readonly ySize: number;
    /** Z축 크기 */
    readonly zSize: number;
    /** 중심에서 꼭짓점까지의 거리(반지름) */
    readonly geometryRadius: number;

    /**
     * AABB 인스턴스를 생성합니다.
     * @param minX X축 최소값
     * @param maxX X축 최대값
     * @param minY Y축 최소값
     * @param maxY Y축 최대값
     * @param minZ Z축 최소값
     * @param maxZ Z축 최대값
     */
    constructor(
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        minZ: number,
        maxZ: number
    ) {
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.minZ = minZ;
        this.maxZ = maxZ;
        this.centerX = (maxX + minX) / 2;
        this.centerY = (maxY + minY) / 2;
        this.centerZ = (maxZ + minZ) / 2;
        this.xSize = (maxX - minX);
        this.ySize = (maxY - minY);
        this.zSize = (maxZ - minZ);
        this.geometryRadius = Math.sqrt((this.xSize / 2) ** 2 + (this.ySize / 2) ** 2 + (this.zSize / 2) ** 2);
    }

    /**
     * 다른 AABB와의 교차 여부를 반환합니다.
     * @param other 교차 여부를 검사할 AABB 인스턴스
     * @returns 교차하면 true, 아니면 false
     */
    intersects(other: AABB): boolean {
        if (!(other instanceof AABB)) {
            consoleAndThrowError('allow only AABB instance')
        }
        return this.minX <= other.maxX && this.maxX >= other.minX &&
            this.minY <= other.maxY && this.maxY >= other.minY &&
            this.minZ <= other.maxZ && this.maxZ >= other.minZ;
    }

    /**
     * 점 또는 좌표가 AABB 내부에 포함되는지 여부를 반환합니다.
     * @param pointOrX [x, y, z] 배열 또는 x 좌표
     * @param y y 좌표 (선택)
     * @param z z 좌표 (선택)
     * @returns 포함되면 true, 아니면 false
     */
    contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean {
        if (Array.isArray(pointOrX)) {
            const [x, y, z] = pointOrX;
            return x >= this.minX && x <= this.maxX &&
                y >= this.minY && y <= this.maxY &&
                z >= this.minZ && z <= this.maxZ;
        } else {
            return pointOrX >= this.minX && pointOrX <= this.maxX &&
                y! >= this.minY && y! <= this.maxY &&
                z! >= this.minZ && z! <= this.maxZ;
        }
    }

    /**
     * AABB 인스턴스를 복제합니다.
     * @returns 복제된 AABB 인스턴스
     */
    clone(): AABB {
        return new AABB(this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
    }
}

export default AABB;
