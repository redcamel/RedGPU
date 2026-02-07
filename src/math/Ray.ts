import { mat4, vec3 } from "gl-matrix";
import AABB from "../bound/AABB";

/**
 * [KO] 3D 공간에서 시작점(origin)과 방향(direction)을 가지는 광선(Ray) 클래스입니다.
 * [EN] Class representing a ray with an origin and direction in 3D space.
 *
 * [KO] 이 클래스는 교차 검사(Intersection test)를 위한 수학적 연산(박스, 삼각형 등)을 제공합니다.
 * [EN] This class provides mathematical operations (box, triangle, etc.) for intersection tests.
 *
 * ### Example
 * ```typescript
 * const ray = new RedGPU.math.Ray([0, 0, 0], [0, 0, -1]);
 * ```
 * @category Math
 */
export default class Ray {
	/**
	 * [KO] 광선의 시작점
	 * [EN] Origin of the ray
	 */
	origin: vec3;
	/**
	 * [KO] 광선의 방향 벡터 (정규화 권장)
	 * [EN] Direction vector of the ray (normalization recommended)
	 */
	direction: vec3;

	/**
	 * [KO] Ray 인스턴스를 생성합니다.
	 * [EN] Creates a Ray instance.
	 *
	 * ### Example
	 * ```typescript
	 * const ray = new RedGPU.math.Ray([0, 0, 0], [0, 0, 1]);
	 * ```
	 *
	 * @param origin -
	 * [KO] 시작점
	 * [EN] Origin
	 * @param direction -
	 * [KO] 방향 벡터
	 * [EN] Direction
	 */
	constructor(origin: vec3 = vec3.create(), direction: vec3 = vec3.fromValues(0, 0, -1)) {
		this.origin = vec3.clone(origin);
		this.direction = vec3.clone(direction);
	}

	/**
	 * [KO] 현재 Ray 인스턴스를 복제합니다.
	 * [EN] Clones the current Ray instance.
	 *
	 * ### Example
	 * ```typescript
	 * const clonedRay = ray.clone();
	 * ```
	 *
	 * @returns
	 * [KO] 복제된 Ray 인스턴스
	 * [EN] Cloned Ray instance
	 */
	clone(): Ray {
		return new Ray(this.origin, this.direction);
	}

	/**
	 * [KO] 행렬을 사용하여 광선을 변환합니다.
	 * [EN] Transforms the ray using a matrix.
	 *
	 * ::: warning
	 * [KO] 이 메서드는 호출 대상(자신)을 직접 수정합니다. 원본 광선의 상태를 보존해야 하는 경우 `.clone()`을 함께 사용하십시오.
	 * [EN] This method modifies the instance directly (in-place). If you need to preserve the original ray state, use it with `.clone()`.
	 * :::
	 *
	 * ### Example
	 * ```typescript
	 * // 원본 수정 (In-place)
	 * ray.applyMatrix4(matrix);
	 *
	 * // 원본 보존 (Preserve original)
	 * const transformedRay = ray.clone().applyMatrix4(matrix);
	 * ```
	 *
	 * @param matrix -
	 * [KO] 4x4 변환 행렬
	 * [EN] 4x4 transformation matrix
	 * @returns
	 * [KO] 변환된 자신
	 * [EN] The transformed self
	 */
	applyMatrix4(matrix: mat4): Ray {
		vec3.transformMat4(this.origin, this.origin, matrix);
		// 방향 벡터는 평행 이동을 무시하고 회전/스케일만 적용
		const dir = vec3.create();
		vec3.copy(dir, this.direction);
		const m = mat4.clone(matrix);
		m[12] = m[13] = m[14] = 0; // translation 제거
		vec3.transformMat4(this.direction, dir, m);
		vec3.normalize(this.direction, this.direction);
		return this;
	}

	/**
	 * [KO] AABB 박스와의 교차 여부를 판별합니다 (Slabs 알고리즘).
	 * [EN] Determines intersection with an AABB box (Slabs algorithm).
	 *
	 * ### Example
	 * ```typescript
	 * const intersects = ray.intersectBox(aabb);
	 * ```
	 *
	 * @param aabb -
	 * [KO] 대상 AABB 박스
	 * [EN] Target AABB box
	 * @returns
	 * [KO] 교차 여부
	 * [EN] Whether it intersects
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
	 * [KO] 삼각형과의 교차 지점을 계산합니다 (Möller-Trumbore 알고리즘).
	 * [EN] Calculates the intersection point with a triangle (Möller-Trumbore algorithm).
	 *
	 * ### Example
	 * ```typescript
	 * const point = ray.intersectTriangle(v0, v1, v2);
	 * ```
	 *
	 * @param v0 -
	 * [KO] 정점 0
	 * [EN] Vertex 0
	 * @param v1 -
	 * [KO] 정점 1
	 * [EN] Vertex 1
	 * @param v2 -
	 * [KO] 정점 2
	 * [EN] Vertex 2
	 * @param backfaceCulling -
	 * [KO] 뒷면 컬링 여부
	 * [EN] Whether to use backface culling
	 * @returns
	 * [KO] 교차 지점(vec3) 또는 null
	 * [EN] Intersection point (vec3) or null
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
	 * [KO] 삼각형과의 교차 지점 및 무게중심 좌표를 계산합니다.
	 * [EN] Calculates the intersection point and barycentric coordinates with a triangle.
	 *
	 * ### Example
	 * ```typescript
	 * const result = ray.intersectTriangleBarycentric(v0, v1, v2);
	 * if (result) {
	 *     console.log(result.point, result.u, result.v);
	 * }
	 * ```
	 *
	 * @param v0 -
	 * [KO] 정점 0
	 * [EN] Vertex 0
	 * @param v1 -
	 * [KO] 정점 1
	 * [EN] Vertex 1
	 * @param v2 -
	 * [KO] 정점 2
	 * [EN] Vertex 2
	 * @param backfaceCulling -
	 * [KO] 뒷면 컬링 여부
	 * [EN] Whether to use backface culling
	 * @returns
	 * [KO] 교차 정보({point, t, u, v}) 또는 null
	 * [EN] Intersection info ({point, t, u, v}) or null
	 */
	intersectTriangleBarycentric(v0: vec3, v1: vec3, v2: vec3, backfaceCulling: boolean = true): { point: vec3, t: number, u: number, v: number } | null {
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
			return { point: intersectPoint, t, u, v };
		}

		return null;
	}
}
