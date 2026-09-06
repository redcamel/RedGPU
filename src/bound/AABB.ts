import consoleAndThrowError from "../utils/consoleAndThrowError";

/**
 * [KO] 3차원 축 정렬 경계 상자(Axis-Aligned Bounding Box) 클래스입니다.
 * [EN] 3D Axis-Aligned Bounding Box (AABB) class.
 *
 * [KO] 각 축에 평행한 경계 상자를 정의하며 교차 판정, 포함 여부 확인 기능을 제공합니다.
 * [EN] Defines a bounding box parallel to each axis and provides intersection and containment tests.
 *
 * * ### Example
 * ```typescript
 * const aabb = new RedGPU.Bound.AABB(-1, 1, -1, 1, -1, 1);
 * const intersects = aabb.intersects(otherAABB);
 * ```
 *
 * @category Bound
 */
export class AABB {
    /**
     * [KO] X축 최소값
     * [EN] Minimum X value
     */
    readonly minX: number;
    /**
     * [KO] X축 최대값
     * [EN] Maximum X value
     */
    readonly maxX: number;
    /**
     * [KO] Y축 최소값
     * [EN] Minimum Y value
     */
    readonly minY: number;
    /**
     * [KO] Y축 최대값
     * [EN] Maximum Y value
     */
    readonly maxY: number;
    /**
     * [KO] Z축 최소값
     * [EN] Minimum Z value
     */
    readonly minZ: number;
    /**
     * [KO] Z축 최대값
     * [EN] Maximum Z value
     */
    readonly maxZ: number;
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
     * [KO] X축 크기
     * [EN] X size
     */
    readonly xSize: number;
    /**
     * [KO] Y축 크기
     * [EN] Y size
     */
    readonly ySize: number;
    /**
     * [KO] Z축 크기
     * [EN] Z size
     */
    readonly zSize: number;
    /**
     * [KO] 중심에서 꼭짓점까지의 거리(반지름)
     * [EN] Distance from center to vertex (radius)
     */
    readonly geometryRadius: number;

    /**
     * [KO] AABB 인스턴스를 생성합니다.
     * [EN] Creates an AABB instance.
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
     */
    constructor(
        minX: number = 0,
        maxX: number = 0,
        minY: number = 0,
        maxY: number = 0,
        minZ: number = 0,
        maxZ: number = 0
    ) {
        this.set(minX, maxX, minY, maxY, minZ, maxZ);
    }

    /**
     * [KO] 기존 AABB 인스턴스의 경계값을 인플레이스로 갱신합니다. (Zero-GC)
     * [EN] Updates the bounding values of an existing AABB instance in-place. (Zero-GC)
     *
     * @param minX - [KO] X축 최소값 [EN] Minimum X value
     * @param maxX - [KO] X축 최대값 [EN] Maximum X value
     * @param minY - [KO] Y축 최소값 [EN] Minimum Y value
     * @param maxY - [KO] Y축 최대값 [EN] Maximum Y value
     * @param minZ - [KO] Z축 최소값 [EN] Minimum Z value
     * @param maxZ - [KO] Z축 최대값 [EN] Maximum Z value
     * @returns [KO] 갱신된 현재 인스턴스 [EN] Updated current instance
     */
    set(
        minX: number,
        maxX: number,
        minY: number,
        maxY: number,
        minZ: number,
        maxZ: number
    ): this {
        (this as any).minX = minX;
        (this as any).maxX = maxX;
        (this as any).minY = minY;
        (this as any).maxY = maxY;
        (this as any).minZ = minZ;
        (this as any).maxZ = maxZ;
        (this as any).centerX = (maxX + minX) * 0.5;
        (this as any).centerY = (maxY + minY) * 0.5;
        (this as any).centerZ = (maxZ + minZ) * 0.5;
        const xSize = (maxX - minX);
        const ySize = (maxY - minY);
        const zSize = (maxZ - minZ);
        (this as any).xSize = xSize;
        (this as any).ySize = ySize;
        (this as any).zSize = zSize;
        const hx = xSize * 0.5;
        const hy = ySize * 0.5;
        const hz = zSize * 0.5;
        (this as any).geometryRadius = Math.sqrt(hx * hx + hy * hy + hz * hz);
        return this;
    }

    /**
     * [KO] 다른 AABB의 값을 현재 인스턴스에 복사합니다. (Zero-GC)
     * [EN] Copies values from another AABB into the current instance. (Zero-GC)
     *
     * @param other - [KO] 복사할 원본 AABB [EN] Source AABB to copy from
     * @returns [KO] 현재 인스턴스 [EN] Current instance
     */
    copy(other: AABB): this {
        return this.set(other.minX, other.maxX, other.minY, other.maxY, other.minZ, other.maxZ);
    }

    /**
     * [KO] 다른 AABB와의 교차 여부를 반환합니다.
     * [EN] Returns whether it intersects with another AABB.
     *
     * @param other -
     * [KO] 교차 여부를 검사할 AABB 인스턴스
     * [EN] AABB instance to check for intersection
     * @returns
     * [KO] 교차하면 true, 아니면 false
     * [EN] True if intersecting, otherwise false
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
     * [KO] 점 또는 좌표가 AABB 내부에 포함되는지 여부를 반환합니다.
     * [EN] Returns whether a point or coordinate is contained within the AABB.
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
     * [KO] AABB 인스턴스를 복제합니다.
     * [EN] Clones the AABB instance.
     *
     * @returns
     * [KO] 복제된 AABB 인스턴스
     * [EN] Cloned AABB instance
     */
    clone(): AABB {
        return new AABB(this.minX, this.maxX, this.minY, this.maxY, this.minZ, this.maxZ);
    }
}

Object.freeze(AABB);
export default AABB;
