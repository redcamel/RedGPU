import {mat4, vec3} from "gl-matrix";
import consoleAndThrowError from "../../consoleAndThrowError";

/**
 * [KO] 3차원 Oriented Bounding Box(OBB) 클래스
 * [EN] 3D Oriented Bounding Box (OBB) class
 *
 * [KO] 3차원 공간에서 임의의 방향을 갖는 경계 상자(Oriented Bounding Box)를 표현합니다. 중심 좌표, 반치수(half extents), 방향 행렬, 반지름 등의 정보를 제공합니다. 교차 및 포함 여부 판별, 복제 기능을 지원합니다.
 * [EN] Represents an oriented bounding box in 3D space with an arbitrary orientation. Provides information such as center coordinates, half extents, orientation matrix, radius, etc. Supports intersection and containment checks, and cloning.
 *
 * <iframe src="/RedGPU/examples/3d/mesh/boundBox/meshOBBIntersects/"></iframe>
 *
 * @category Bound
 */
export class OBB {
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
     * @param center
     * [KO] 중심 좌표 [x, y, z]
     * [EN] Center coordinates [x, y, z]
     * @param halfExtents
     * [KO] 반치수 [x, y, z]
     * [EN] Half extents [x, y, z]
     * @param orientation
     * [KO] 방향 행렬(mat4)
     * [EN] Orientation matrix (mat4)
     */
    constructor(
        center: [number, number, number],
        halfExtents: [number, number, number],
        orientation: mat4
    ) {
        this.centerX = center[0];
        this.centerY = center[1];
        this.centerZ = center[2];
        this.halfExtentX = halfExtents[0];
        this.halfExtentY = halfExtents[1];
        this.halfExtentZ = halfExtents[2];
        this.center = [this.centerX, this.centerY, this.centerZ];
        this.halfExtents = [this.halfExtentX, this.halfExtentY, this.halfExtentZ];
        this.orientation = mat4.clone(orientation);
        this.geometryRadius = Math.sqrt(
            this.halfExtentX ** 2 +
            this.halfExtentY ** 2 +
            this.halfExtentZ ** 2
        );
    }

    /**
     * [KO] 다른 OBB와의 교차 여부를 반환합니다.
     * [EN] Returns whether it intersects with another OBB.
     * @param other
     * [KO] 교차 여부를 검사할 OBB 인스턴스
     * [EN] OBB instance to check for intersection
     * @returns
     * [KO] 교차하면 true, 아니면 false
     * [EN] True if intersecting, otherwise false
     */
    intersects(other: OBB): boolean {
        if (!(other instanceof OBB)) {
            consoleAndThrowError('allow only OBB instance');
        }
        // 간단한 구 테스트 먼저 수행 (빠른 거부)
        const centerDiff = vec3.subtract(vec3.create(), this.center, other.center);
        const centerDistance = vec3.length(centerDiff);
        if (centerDistance > this.geometryRadius + other.geometryRadius) {
            return false;
        }
        // SAT를 위한 축 벡터들 추출
        const axesA = this.#getAxes();
        const axesB = other.#getAxes();
        // 6개 축만 테스트 (각 OBB의 3개 축)
        const axes = [...axesA, ...axesB];
        for (const axis of axes) {
            const radiusA = this.#getProjectionRadius(axis);
            const radiusB = other.#getProjectionRadius(axis);
            const distance = Math.abs(vec3.dot(centerDiff, axis));
            if (distance > radiusA + radiusB) {
                return false;
            }
        }
        return true;
    }

    /**
     * [KO] 점 또는 좌표가 OBB 내부에 포함되는지 여부를 반환합니다.
     * [EN] Returns whether a point or coordinate is contained within the OBB.
     * @param pointOrX
     * [KO] [x, y, z] 배열 또는 x 좌표
     * [EN] [x, y, z] array or x coordinate
     * @param y
     * [KO] y 좌표 (선택)
     * [EN] y coordinate (optional)
     * @param z
     * [KO] z 좌표 (선택)
     * [EN] z coordinate (optional)
     * @returns
     * [KO] 포함되면 true, 아니면 false
     * [EN] True if contained, otherwise false
     */
    contains(pointOrX: [number, number, number] | number, y?: number, z?: number): boolean {
        let point: vec3;
        if (Array.isArray(pointOrX)) {
            point = vec3.fromValues(pointOrX[0], pointOrX[1], pointOrX[2]);
        } else {
            point = vec3.fromValues(pointOrX, y!, z!);
        }
        const localPoint = vec3.subtract(vec3.create(), point, this.center);
        const axes = this.#getAxes();
        for (let i = 0; i < 3; i++) {
            const projection = vec3.dot(localPoint, axes[i]);
            if (Math.abs(projection) > this.halfExtents[i]) {
                return false;
            }
        }
        return true;
    }

    /**
     * [KO] OBB 인스턴스를 복제합니다.
     * [EN] Clones the OBB instance.
     * @returns
     * [KO] 복제된 OBB 인스턴스
     * [EN] Cloned OBB instance
     */
    clone(): OBB {
        return new OBB(
            [this.centerX, this.centerY, this.centerZ],
            [this.halfExtentX, this.halfExtentY, this.halfExtentZ],
            this.orientation
        );
    }

    /**
     * [KO] OBB의 로컬 축 벡터 3개를 반환합니다.
     * [EN] Returns the 3 local axis vectors of the OBB.
     * @returns
     * [KO] [vec3, vec3, vec3] 각 축 벡터
     * [EN] [vec3, vec3, vec3] axis vectors
     * @internal
     */
    #getAxes(): [vec3, vec3, vec3] {
        return [
            vec3.fromValues(this.orientation[0], this.orientation[1], this.orientation[2]),
            vec3.fromValues(this.orientation[4], this.orientation[5], this.orientation[6]),
            vec3.fromValues(this.orientation[8], this.orientation[9], this.orientation[10])
        ];
    }

    /**
     * [KO] 주어진 축(axis)에 대한 OBB의 투영 반지름을 반환합니다.
     * [EN] Returns the projection radius of the OBB onto the given axis.
     * @param axis
     * [KO] 투영할 축 벡터
     * [EN] Axis vector to project onto
     * @returns
     * [KO] 투영 반지름
     * [EN] Projection radius
     * @internal
     */
    #getProjectionRadius(axis: vec3): number {
        const axes = this.#getAxes();
        return Math.abs(vec3.dot(axes[0], axis)) * this.halfExtentX +
            Math.abs(vec3.dot(axes[1], axis)) * this.halfExtentY +
            Math.abs(vec3.dot(axes[2], axis)) * this.halfExtentZ;
    }
}

export default OBB;
