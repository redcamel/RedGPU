import { mat4, vec3, vec2 } from "gl-matrix";
import View2D from "../display/view/View2D";
import Mesh from "../display/mesh/Mesh";
import Ray from "../math/Ray";
import { RayIntersectResult } from "./Raycaster3D";

/**
 * [KO] 2D 공간에서 객체와의 교차를 검사하는 클래스입니다.
 * [EN] Class that checks for intersections with objects in 2D space.
 *
 * [KO] View2D 환경에 최적화되어 있으며, NDC 좌표를 역추적하여 2D 객체의 정밀한 로컬 좌표 및 UV를 산출합니다.
 * [EN] Optimized for View2D environments, it reverse-tracks NDC coordinates to calculate precise local coordinates and UVs for 2D objects.
 *
 * * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster2D();
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 * @category Picking
 */
export default class Raycaster2D {
	/**
	 * [KO] 내부적으로 관리되는 광원 객체
	 * [EN] Internally managed ray object
	 *
	 * [KO] 2D에서는 실제 광선 대신 월드 좌표상의 지점을 사용하지만, Raycaster3D와의 호환성을 위해 유지됩니다.
	 * [EN] In 2D, a point in world coordinates is used instead of an actual ray, but it is maintained for compatibility with Raycaster3D.
	 */
	readonly ray: Ray;

	#view: View2D;
	#ndcPoint: vec3 = vec3.create();
	#tempMat4 = mat4.create();
	#tempMat4_2 = mat4.create();
	#tempVec3 = vec3.create();

	/**
	 * [KO] Raycaster2D 인스턴스를 생성합니다.
	 * [EN] Creates a Raycaster2D instance.
	 */
	constructor() {
		this.ray = new Ray();
	}

	/**
	 * [KO] 화면 좌표를 기반으로 피킹 지점을 설정합니다.
	 * [EN] Sets the picking point based on screen coordinates.
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
	 * [KO] 대상 View2D 인스턴스
	 * [EN] Target View2D instance
	 */
	setFromCamera(screenX: number, screenY: number, view: View2D): void {
		this.#view = view;
		const { pixelRectObject } = view;
		
		const ndcX = (screenX * devicePixelRatio / pixelRectObject.width) * 2 - 1;
		const ndcY = 1 - (screenY * devicePixelRatio / pixelRectObject.height) * 2;
		
		vec3.set(this.#ndcPoint, ndcX, ndcY, 0);

		const worldPoint = view.screenToWorld(screenX, screenY);
		vec3.set(this.ray.origin, worldPoint[0], worldPoint[1], worldPoint[2]);
		vec3.set(this.ray.direction, 0, 0, -1);
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
			const view = this.#view;
			const projectionMatrix = view.projectionMatrix;
			const cameraMatrix = view.rawCamera.modelMatrix;
			
			const combinedMatrix = mat4.multiply(this.#tempMat4, projectionMatrix, cameraMatrix);
			mat4.multiply(combinedMatrix, combinedMatrix, mesh.modelMatrix);
			
			if ((mesh as any).is2DMeshType) {
				mat4.scale(combinedMatrix, combinedMatrix, [(mesh as any).width, (mesh as any).height, 1]);
			}

			const invCombinedMatrix = mat4.invert(this.#tempMat4_2, combinedMatrix);
			if (invCombinedMatrix) {
				const localPoint = vec3.transformMat4(this.#tempVec3, this.#ndcPoint, invCombinedMatrix);

				if (localPoint[0] >= -0.5 && localPoint[0] <= 0.5 &&
					localPoint[1] >= -0.5 && localPoint[1] <= 0.5) {

					const invProjView = mat4.invert(mat4.create(), mat4.multiply(mat4.create(), projectionMatrix, cameraMatrix));
					const worldPoint = vec3.transformMat4(vec3.create(), this.#ndcPoint, invProjView);

					const faceIndex = localPoint[0] > localPoint[1] ? 1 : 0;

					intersects.push({
						distance: 0,
						point: worldPoint,
						localPoint: vec3.clone(localPoint),
						object: mesh,
						uv: vec2.fromValues(localPoint[0] + 0.5, localPoint[1] + 0.5),
						ray: this.ray.clone(),
						faceIndex: faceIndex
					});
				}
			}
		}

		if (recursive && mesh.children) {
			for (const child of mesh.children) {
				this.#intersectObject(child as Mesh, recursive, intersects);
			}
		}
	}
}
