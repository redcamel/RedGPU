import { mat4, vec3, vec2 } from "gl-matrix";
import Ray from "../math/Ray";
import View3D from "../display/view/View3D";
import Mesh from "../display/mesh/Mesh";

/**
 * [KO] 3D 공간에서 광선(Ray)을 투사하여 객체와의 교차를 검사하는 클래스입니다.
 * [EN] Class that casts a ray in 3D space to check for intersections with objects.
 *
 * [KO] 마우스 좌표와 카메라 정보를 기반으로 광선을 생성하고, 메시의 정밀한 삼각형 단위 충돌 검사를 수행합니다.
 * [EN] Generates a ray based on mouse coordinates and camera information, and performs precise triangle-level collision tests on meshes.
 *
 * * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster();
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 * @category Picking
 */
export default class Raycaster {
	/**
	 * [KO] 내부적으로 관리되는 광원 객체
	 * [EN] Internally managed ray object
	 */
	readonly ray: Ray;

	/**
	 * [KO] 교차 검사 시 고려할 최소 거리
	 * [EN] Minimum distance to consider for intersection
	 * @defaultValue 0
	 */
	near: number = 0;

	/**
	 * [KO] 교차 검사 시 고려할 최대 거리
	 * [EN] Maximum distance to consider for intersection
	 * @defaultValue Infinity
	 */
	far: number = Infinity;

	#tempMat4 = mat4.create();

	/**
	 * [KO] Raycaster 인스턴스를 생성합니다.
	 * [EN] Creates a Raycaster instance.
	 */
	constructor() {
		this.ray = new Ray();
	}

	/**
	 * [KO] 화면 좌표와 카메라 정보를 기반으로 광선을 설정합니다.
	 * [EN] Sets the ray based on screen coordinates and camera information.
	 *
	 * * ### Example
	 * ```typescript
	 * raycaster.setFromCamera(mouseX, mouseY, view);
	 * ```
	 *
	 * @param screenX -
	 * [KO] 화면 X 좌표
	 * [EN] Screen X coordinate
	 * @param screenY -
	 * [KO] 화면 Y 좌표
	 * [EN] Screen Y coordinate
	 * @param view -
	 * [KO] 대상 View3D 인스턴스
	 * [EN] Target View3D instance
	 */
	setFromCamera(screenX: number, screenY: number, view: View3D): void {
		const { rawCamera } = view;
		const origin = vec3.fromValues(rawCamera.x, rawCamera.y, rawCamera.z);
		const targetPoint = view.screenToWorld(screenX, screenY);
		const direction = vec3.create();
		vec3.subtract(direction, targetPoint as vec3, origin);
		vec3.normalize(direction, direction);

		vec3.copy(this.ray.origin, origin);
		vec3.copy(this.ray.direction, direction);

		if ('nearClipping' in rawCamera) this.near = rawCamera.nearClipping;
		if ('farClipping' in rawCamera) this.far = rawCamera.farClipping;
	}

	/**
	 * [KO] 단일 객체와의 교차 여부를 검사합니다.
	 * [EN] Checks for intersection with a single object.
	 *
	 * * ### Example
	 * ```typescript
	 * const result = raycaster.intersectObject(mesh);
	 * ```
	 *
	 * @param mesh -
	 * [KO] 검사할 메시 객체
	 * [EN] Mesh object to check
	 * @param recursive -
	 * [KO] 자식 객체도 포함할지 여부 (기본값: true)
	 * [EN] Whether to include child objects (default: true)
	 * @returns
	 * [KO] 교차 정보 배열 (`RayIntersectResult[]`)
	 * [EN] Array of intersection information (`RayIntersectResult[]`)
	 */
	intersectObject(mesh: Mesh, recursive: boolean = true): RayIntersectResult[] {
		const intersects: RayIntersectResult[] = [];
		this.#intersectObject(mesh, recursive, intersects);
		return intersects.sort((a, b) => a.distance - b.distance);
	}

	/**
	 * [KO] 여러 객체와의 교차 여부를 검사합니다.
	 * [EN] Checks for intersections with multiple objects.
	 *
	 * * ### Example
	 * ```typescript
	 * const results = raycaster.intersectObjects(scene.children);
	 * ```
	 *
	 * @param meshes -
	 * [KO] 검사할 메시 객체 배열
	 * [EN] Array of mesh objects to check
	 * @param recursive -
	 * [KO] 자식 객체도 포함할지 여부 (기본값: true)
	 * [EN] Whether to include child objects (default: true)
	 * @returns
	 * [KO] 교차 정보 배열 (`RayIntersectResult[]`)
	 * [EN] Array of intersection information (`RayIntersectResult[]`)
	 */
	intersectObjects(meshes: Mesh[], recursive: boolean = true): RayIntersectResult[] {
		const intersects: RayIntersectResult[] = [];
		for (const mesh of meshes) {
			this.#intersectObject(mesh, recursive, intersects);
		}
		return intersects.sort((a, b) => a.distance - b.distance);
	}

	#intersectObject(mesh: Mesh, recursive: boolean, intersects: RayIntersectResult[]): void {
		if (mesh.geometry) {
			// 1. Broad-phase: AABB 검사
			const worldAABB = mesh.boundingAABB;
			if (this.ray.intersectBox(worldAABB)) {
				// 2. Narrow-phase: 로컬 공간 변환 및 삼각형 정밀 검사
				const localRay = new Ray();
				vec3.copy(localRay.origin, this.ray.origin);
				vec3.copy(localRay.direction, this.ray.direction);

				const invModelMatrix = mat4.invert(this.#tempMat4, mesh.modelMatrix);
				if (invModelMatrix) {
					localRay.applyMatrix4(invModelMatrix);

					const geometry = mesh.geometry;
					const vertexBuffer = geometry.vertexBuffer;
					const indexBuffer = geometry.indexBuffer;
					const data = vertexBuffer.data;
					const stride = vertexBuffer.interleavedStruct.arrayStride / 4;

					if (indexBuffer) {
						const indices = indexBuffer.data;
						for (let i = 0; i < indices.length; i += 3) {
							this.#checkTriangle(localRay, mesh, data, stride, indices[i], indices[i + 1], indices[i + 2], intersects);
						}
					} else {
						const count = vertexBuffer.vertexCount;
						for (let i = 0; i < count; i += 3) {
							this.#checkTriangle(localRay, mesh, data, stride, i, i + 1, i + 2, intersects);
						}
					}
				}
			}
		}

		if (recursive && mesh.children) {
			for (const child of mesh.children) {
				this.#intersectObject(child, recursive, intersects);
			}
		}
	}

	#checkTriangle(
		localRay: Ray,
		mesh: Mesh,
		data: Float32Array,
		stride: number,
		i0: number, i1: number, i2: number,
		intersects: RayIntersectResult[]
	) {
		const v0 = vec3.fromValues(data[i0 * stride], data[i0 * stride + 1], data[i0 * stride + 2]);
		const v1 = vec3.fromValues(data[i1 * stride], data[i1 * stride + 1], data[i1 * stride + 2]);
		const v2 = vec3.fromValues(data[i2 * stride], data[i2 * stride + 1], data[i2 * stride + 2]);

		const result = localRay.intersectTriangleBarycentric(v0, v1, v2);
		if (result) {
			const { point: localIntersectPoint, u, v } = result;
			const worldIntersectPoint = vec3.create();
			vec3.transformMat4(worldIntersectPoint, localIntersectPoint, mesh.modelMatrix);

			const distance = vec3.distance(this.ray.origin, worldIntersectPoint);
			if (distance >= this.near && distance <= this.far) {
				// UV Interpolation
				// Assuming standard interleaved layout: [Px, Py, Pz, Nx, Ny, Nz, U, V] (Stride 8)
				// UV offset is usually 6. We should verify this dynamically if possible, but for now hardcoded offset 6 is common in RedGPU primitives.
				const uv0 = vec2.fromValues(data[i0 * stride + 6], data[i0 * stride + 7]);
				const uv1 = vec2.fromValues(data[i1 * stride + 6], data[i1 * stride + 7]);
				const uv2 = vec2.fromValues(data[i2 * stride + 6], data[i2 * stride + 7]);

				const hitUV = vec2.create();
				const w = 1 - u - v;
				vec2.scaleAndAdd(hitUV, hitUV, uv0, w);
				vec2.scaleAndAdd(hitUV, hitUV, uv1, u);
				vec2.scaleAndAdd(hitUV, hitUV, uv2, v);

				intersects.push({
					distance,
					point: worldIntersectPoint,
					localPoint: localIntersectPoint,
					object: mesh,
					faceIndex: Math.floor(i0 / 3),
					uv: hitUV
				});
			}
		}
	}
}

/**
 * [KO] 레이캐스팅 교차 결과 인터페이스입니다.
 * [EN] Raycasting intersection result interface.
 */
export interface RayIntersectResult {
	/**
	 * [KO] 광선 시작점부터 교차 지점까지의 거리
	 * [EN] Distance from ray origin to intersection point
	 */
	distance: number;
	/**
	 * [KO] 월드 공간상의 교차 지점
	 * [EN] Intersection point in world space
	 */
	point: vec3;
	/**
	 * [KO] 로컬 공간상의 교차 지점
	 * [EN] Intersection point in local space
	 */
	localPoint: vec3;
	/**
	 * [KO] 교차된 객체
	 * [EN] The intersected object
	 */
	object: Mesh;
	/**
	 * [KO] 교차된 삼각형의 인덱스
	 * [EN] Index of the intersected triangle
	 */
	faceIndex?: number;
	/**
	 * [KO] 교차 지점의 UV 좌표
	 * [EN] UV coordinates at the intersection point
	 */
	uv?: vec2;
}
