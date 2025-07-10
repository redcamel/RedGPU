import { mat4, vec3 } from "gl-matrix";
import consoleAndThrowError from "../../consoleAndThrowError";

export class OBB {
	readonly centerX: number;
	readonly centerY: number;
	readonly centerZ: number;
	readonly halfExtentX: number;
	readonly halfExtentY: number;
	readonly halfExtentZ: number;
	readonly orientation: mat4;
	readonly center: [number, number, number];
	readonly halfExtents: [number, number, number];
	readonly geometryRadius: number;

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

	clone(): OBB {
		return new OBB(
			[this.centerX, this.centerY, this.centerZ],
			[this.halfExtentX, this.halfExtentY, this.halfExtentZ],
			this.orientation
		);
	}

	#getAxes(): [vec3, vec3, vec3] {
		return [
			vec3.fromValues(this.orientation[0], this.orientation[1], this.orientation[2]),
			vec3.fromValues(this.orientation[4], this.orientation[5], this.orientation[6]),
			vec3.fromValues(this.orientation[8], this.orientation[9], this.orientation[10])
		];
	}

	#getProjectionRadius(axis: vec3): number {
		const axes = this.#getAxes();
		return Math.abs(vec3.dot(axes[0], axis)) * this.halfExtentX +
			Math.abs(vec3.dot(axes[1], axis)) * this.halfExtentY +
			Math.abs(vec3.dot(axes[2], axis)) * this.halfExtentZ;
	}
}

export default OBB;
