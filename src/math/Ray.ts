import {mat4, vec3} from "gl-matrix";
import AABB from "../bound/AABB";

/**
 * [KO] 3D 공간의 시작점(`origin`)과 방향 벡터(`direction`)를 가지며 AABB 및 삼각형과의 교차 판정을 수행하는 광선(Ray) 클래스입니다.
 * [EN] Ray class with a 3D `origin` and `direction` vector that performs intersection tests against AABBs and triangles.
 *
 * ### Example
 * ```typescript
 * const ray = new RedGPU.Math.Ray([0, 0, 0], [0, 0, -1]);
 * ```
 *
 * @see [Mouse Event Raycasting example](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
 * @category Math
 */
class Ray {
    /**
     * [KO] 광선의 시작점 좌표 (`vec3`)
     * [EN] Origin coordinates of the ray (`vec3`)
     */
    origin: vec3;
    /**
     * [KO] 광선의 정규화된 방향 벡터 (`vec3`)
     * [EN] Normalized direction vector of the ray (`vec3`)
     */
    direction: vec3;

    /**
     * [KO] 지정된 시작점과 방향 벡터로 `Ray` 인스턴스를 생성합니다.
     * [EN] Creates a `Ray` instance with the specified origin and direction vector.
     *
     * ### Example
     * ```typescript
     * const ray = new RedGPU.Math.Ray([0, 0, 0], [0, 0, -1]);
     * ```
     *
     * @param origin -
     * [KO] 광선의 시작점 (기본값: `[0, 0, 0]`)
     * [EN] Origin of the ray (default: `[0, 0, 0]`)
     * @param direction -
     * [KO] 광선의 방향 벡터 (기본값: `[0, 0, -1]`)
     * [EN] Direction vector of the ray (default: `[0, 0, -1]`)
     */
    constructor(origin: vec3 = vec3.create(), direction: vec3 = vec3.fromValues(0, 0, -1)) {
        this.origin = vec3.clone(origin);
        this.direction = vec3.clone(direction);
    }

    /**
     * [KO] 현재 광선의 시작점과 방향을 복사한 새 `Ray` 인스턴스를 반환합니다.
     * [EN] Returns a new `Ray` instance with copied origin and direction.
     *
     * ### Example
     * ```typescript
     * const clonedRay = ray.clone();
     * ```
     *
     * @returns
     * [KO] 복제된 `Ray` 인스턴스
     * [EN] Cloned `Ray` instance
     */
    clone(): Ray {
        return new Ray(this.origin, this.direction);
    }

    /**
     * [KO] 4x4 변환 행렬을 현재 광선의 시작점과 방향 벡터에 인플레이스(In-place)로 적용하고 방향 벡터를 정규화합니다.
     * [EN] Applies a 4x4 transformation matrix to the ray's origin and direction vector in-place and normalizes the direction vector.
     *
     * ::: warning
     * [KO] 이 메서드는 인스턴스 자신을 직접 수정합니다. 원본 보존이 필요한 경우 `clone()`과 함께 사용하십시오.
     * [EN] This method modifies the instance in-place. Use with `clone()` if the original ray must be preserved.
     * :::
     *
     * ### Example
     * ```typescript
     * // [KO] 원본 광선 직접 변환
     * // [EN] Transform original ray in-place
     * ray.applyMatrix4(matrix);
     *
     * // [KO] 원본 보존 후 변환
     * // [EN] Preserve original and transform clone
     * const transformedRay = ray.clone().applyMatrix4(matrix);
     * ```
     *
     * @param matrix -
     * [KO] 적용할 4x4 변환 행렬 (`mat4`)
     * [EN] 4x4 transformation matrix to apply (`mat4`)
     * @returns
     * [KO] 변환이 적용된 현재 `Ray` 인스턴스 (`this`)
     * [EN] The transformed current `Ray` instance (`this`)
     */
    applyMatrix4(matrix: mat4): Ray {
        vec3.transformMat4(this.origin, this.origin, matrix);
        const dir = vec3.create();
        vec3.copy(dir, this.direction);
        const m = mat4.clone(matrix);
        m[12] = m[13] = m[14] = 0;
        vec3.transformMat4(this.direction, dir, m);
        vec3.normalize(this.direction, this.direction);
        return this;
    }

    /**
     * [KO] Slabs 알고리즘을 사용하여 광선과 `AABB` 바운딩 박스의 교차 여부를 판별합니다.
     * [EN] Determines whether the ray intersects an `AABB` bounding box using the Slabs algorithm.
     *
     * ### Example
     * ```typescript
     * const isHit = ray.intersectBox(aabb);
     * ```
     *
     * @param aabb -
     * [KO] 교차 검사할 대상 `AABB` 인스턴스
     * [EN] Target `AABB` instance to test for intersection
     * @returns
     * [KO] 교차 여부 (`boolean`)
     * [EN] Whether the ray intersects the box (`boolean`)
     */
    intersectBox(aabb: AABB): boolean {
        let tmin = -Infinity;
        let tmax = Infinity;

        for (let i = 0; i < 3; i++) {
            const invDir = 1.0 / this.direction[i];
            const minVal = i === 0 ? aabb.minX : i === 1 ? aabb.minY : aabb.minZ;
            const maxVal = i === 0 ? aabb.maxX : i === 1 ? aabb.maxY : aabb.maxZ;

            let t1 = (minVal - this.origin[i]) * invDir;
            let t2 = (maxVal - this.origin[i]) * invDir;

            if (t1 > t2) {
                const temp = t1;
                t1 = t2;
                t2 = temp;
            }

            tmin = Math.max(tmin, t1);
            tmax = Math.min(tmax, t2);
        }

        return tmax >= tmin && tmax >= 0;
    }

    /**
     * [KO] Möller-Trumbore 알고리즘을 사용하여 광선과 삼각형의 교차 지점 좌표를 계산합니다.
     * [EN] Calculates the intersection point between the ray and a triangle using the Möller-Trumbore algorithm.
     *
     * ### Example
     * ```typescript
     * const hitPoint = ray.intersectTriangle(v0, v1, v2, true);
     * ```
     *
     * @param v0 -
     * [KO] 삼각형의 첫 번째 정점 (`vec3`)
     * [EN] First vertex of the triangle (`vec3`)
     * @param v1 -
     * [KO] 삼각형의 두 번째 정점 (`vec3`)
     * [EN] Second vertex of the triangle (`vec3`)
     * @param v2 -
     * [KO] 삼각형의 세 번째 정점 (`vec3`)
     * [EN] Third vertex of the triangle (`vec3`)
     * @param backfaceCulling -
     * [KO] 후면 컬링 적용 여부 (기본값: `true`)
     * [EN] Whether to apply backface culling (default: `true`)
     * @returns
     * [KO] 교차 지점 좌표 (`vec3`) 또는 미교차 시 `null`
     * [EN] Intersection point coordinates (`vec3`) or `null` if no intersection
     */
    intersectTriangle(v0: vec3, v1: vec3, v2: vec3, backfaceCulling: boolean = true): vec3 | null {
        const edge1 = vec3.create();
        const edge2 = vec3.create();
        const h = vec3.create();
        const s = vec3.create();
        const q = vec3.create();

        vec3.subtract(edge1, v1, v0);
        vec3.subtract(edge2, v2, v0);
        vec3.cross(h, this.direction, edge2);
        const a = vec3.dot(edge1, h);

        if (backfaceCulling) {
            if (a < 0.00001) return null;
        } else {
            if (a > -0.00001 && a < 0.00001) return null;
        }

        const f = 1.0 / a;
        vec3.subtract(s, this.origin, v0);
        const u = f * vec3.dot(s, h);

        if (u < 0.0 || u > 1.0) return null;

        vec3.cross(q, s, edge1);
        const v = f * vec3.dot(this.direction, q);

        if (v < 0.0 || u + v > 1.0) return null;

        const t = f * vec3.dot(edge2, q);

        if (t > 0.00001) {
            const intersectPoint = vec3.create();
            vec3.scaleAndAdd(intersectPoint, this.origin, this.direction, t);
            return intersectPoint;
        }

        return null;
    }

    /**
     * [KO] 광선과 삼각형의 교차 지점 좌표, 거리(`t`), 및 무게중심 좌표(`u`, `v`)를 계산합니다.
     * [EN] Calculates the intersection point, distance (`t`), and barycentric coordinates (`u`, `v`) between the ray and a triangle.
     *
     * ### Example
     * ```typescript
     * const hit = ray.intersectTriangleBarycentric(v0, v1, v2);
     * if (hit) {
     *     console.log(hit.point, hit.t, hit.u, hit.v);
     * }
     * ```
     *
     * @param v0 -
     * [KO] 삼각형의 첫 번째 정점 (`vec3`)
     * [EN] First vertex of the triangle (`vec3`)
     * @param v1 -
     * [KO] 삼각형의 두 번째 정점 (`vec3`)
     * [EN] Second vertex of the triangle (`vec3`)
     * @param v2 -
     * [KO] 삼각형의 세 번째 정점 (`vec3`)
     * [EN] Third vertex of the triangle (`vec3`)
     * @param backfaceCulling -
     * [KO] 후면 컬링 적용 여부 (기본값: `true`)
     * [EN] Whether to apply backface culling (default: `true`)
     * @returns
     * [KO] 교차 정보 객체 (`{ point: vec3, t: number, u: number, v: number }`) 또는 미교차 시 `null`
     * [EN] Intersection info object (`{ point: vec3, t: number, u: number, v: number }`) or `null` if no intersection
     */
    intersectTriangleBarycentric(v0: vec3, v1: vec3, v2: vec3, backfaceCulling: boolean = true): {
        point: vec3,
        t: number,
        u: number,
        v: number
    } | null {
        const edge1 = vec3.create();
        const edge2 = vec3.create();
        const h = vec3.create();
        const s = vec3.create();
        const q = vec3.create();

        vec3.subtract(edge1, v1, v0);
        vec3.subtract(edge2, v2, v0);
        vec3.cross(h, this.direction, edge2);
        const a = vec3.dot(edge1, h);

        if (backfaceCulling) {
            if (a < 0.00001) return null;
        } else {
            if (a > -0.00001 && a < 0.00001) return null;
        }

        const f = 1.0 / a;
        vec3.subtract(s, this.origin, v0);
        const u = f * vec3.dot(s, h);

        if (u < 0.0 || u > 1.0) return null;

        vec3.cross(q, s, edge1);
        const v = f * vec3.dot(this.direction, q);

        if (v < 0.0 || u + v > 1.0) return null;

        const t = f * vec3.dot(edge2, q);

        if (t > 0.00001) {
            const intersectPoint = vec3.create();
            vec3.scaleAndAdd(intersectPoint, this.origin, this.direction, t);
            return {point: intersectPoint, t, u, v};
        }

        return null;
    }
}

Object.freeze(Ray)
export default Ray