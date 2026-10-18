import {mat4, vec2, vec3} from "gl-matrix";
import View2D from "../display/view/View2D";
import Mesh from "../display/mesh/Mesh";
import Ray from "../math/Ray";
import {RayIntersectResult} from "./Raycaster3D";

/**
 * [KO] `View2D` 환경에서 NDC 좌표를 역추적하여 2D 객체와의 교차 여부 및 로컬 좌표·UV를 산출하는 클래스입니다.
 * [EN] Class that reverse-tracks NDC coordinates in a `View2D` environment to calculate intersections, local coordinates, and UVs for 2D objects.
 *
 * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster2D();
 * // [KO] 화면 좌표를 기반으로 피킹 지점 설정 및 교차 검사 수행
 * // [EN] Set picking point based on screen coordinates and perform intersection test
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 *
 * @see [MouseEvent (Sprite2D) example](/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)
 * @category Picking
 */
class Raycaster2D {
    /**
     * [KO] `Raycaster3D`와의 호환성을 위해 내부적으로 관리되는 광선(`Ray`) 객체
     * [EN] Internally managed `Ray` object maintained for compatibility with `Raycaster3D`
     */
    readonly ray: Ray;

    #view: View2D;
    #ndcPoint: vec3 = vec3.create();
    #tempMat4 = mat4.create();
    #tempMat4_2 = mat4.create();
    #tempVec3 = vec3.create();

    /**
     * [KO] `Raycaster2D` 인스턴스를 생성합니다.
     * [EN] Creates a `Raycaster2D` instance.
     */
    constructor() {
        this.ray = new Ray();
    }

    /**
     * [KO] 화면 좌표와 `View2D` 정보를 기반으로 피킹 지점을 설정합니다.
     * [EN] Sets the picking point based on screen coordinates and `View2D` information.
     *
     * ### Example
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
     * [KO] 대상 `View2D` 인스턴스
     * [EN] Target `View2D` instance
     */
    setFromCamera(screenX: number, screenY: number, view: View2D): void {
        this.#view = view;
        const {pixelRectObject} = view;

        const ndcX = (screenX * devicePixelRatio / pixelRectObject.width) * 2 - 1;
        const ndcY = 1 - (screenY * devicePixelRatio / pixelRectObject.height) * 2;

        vec3.set(this.#ndcPoint, ndcX, ndcY, 0);

        const worldPoint = view.screenToWorld(screenX, screenY);
        vec3.set(this.ray.origin, worldPoint[0], worldPoint[1], worldPoint[2]);
        vec3.set(this.ray.direction, 0, 0, -1);
    }

    /**
     * [KO] 단일 메시 객체와의 교차 여부를 검사합니다.
     * [EN] Checks for intersection with a single mesh object.
     *
     * ### Example
     * ```typescript
     * const result = raycaster.intersectObject(mesh);
     * ```
     *
     * @param mesh -
     * [KO] 검사할 메시 객체
     * [EN] Mesh object to check
     * @param recursive -
     * [KO] 자식 객체도 포함할지 여부 (기본값: `true`)
     * [EN] Whether to include child objects (default: `true`)
     * @returns
     * [KO] 거리순으로 정렬된 교차 결과 배열 (`RayIntersectResult[]`)
     * [EN] Array of intersection results sorted by distance (`RayIntersectResult[]`)
     */
    intersectObject(mesh: Mesh, recursive: boolean = true): RayIntersectResult[] {
        const intersects: RayIntersectResult[] = [];
        this.#intersectObject(mesh, recursive, intersects);
        return intersects.sort((a, b) => a.distance - b.distance);
    }

    /**
     * [KO] 여러 메시 객체와의 교차 여부를 검사합니다.
     * [EN] Checks for intersections with multiple mesh objects.
     *
     * ### Example
     * ```typescript
     * const results = raycaster.intersectObjects(scene.children);
     * ```
     *
     * @param meshes -
     * [KO] 검사할 메시 객체 배열
     * [EN] Array of mesh objects to check
     * @param recursive -
     * [KO] 자식 객체도 포함할지 여부 (기본값: `true`)
     * [EN] Whether to include child objects (default: `true`)
     * @returns
     * [KO] 거리순으로 정렬된 교차 결과 배열 (`RayIntersectResult[]`)
     * [EN] Array of intersection results sorted by distance (`RayIntersectResult[]`)
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
            const viewMatrix = view.rawCamera.viewMatrix;

            const combinedMatrix = mat4.multiply(this.#tempMat4, projectionMatrix, viewMatrix);
            mat4.multiply(combinedMatrix, combinedMatrix, mesh.modelMatrix);

            const invCombinedMatrix = mat4.invert(this.#tempMat4_2, combinedMatrix);
            if (invCombinedMatrix) {
                const localPoint = vec3.transformMat4(this.#tempVec3, this.#ndcPoint, invCombinedMatrix);

                let isHit = false;
                let width = 1;
                let height = 1;

                if ((mesh as any).is2DMeshType) {
                    width = (mesh as any).width;
                    height = (mesh as any).height;
                    if (localPoint[0] >= -width / 2 && localPoint[0] <= width / 2 &&
                        localPoint[1] >= -height / 2 && localPoint[1] <= height / 2) {
                        isHit = true;
                    }
                } else {
                    if (localPoint[0] >= -0.5 && localPoint[0] <= 0.5 &&
                        localPoint[1] >= -0.5 && localPoint[1] <= 0.5) {
                        isHit = true;
                    }
                }

                if (isHit) {
                    const invProjView = mat4.invert(mat4.create(), mat4.multiply(mat4.create(), projectionMatrix, viewMatrix));
                    const worldPoint = vec3.transformMat4(vec3.create(), this.#ndcPoint, invProjView);

                    const faceIndex = (localPoint[0] / width) > (localPoint[1] / height) ? 1 : 0;

                    intersects.push({
                        distance: 0,
                        point: worldPoint,
                        localPoint: vec3.clone(localPoint),
                        object: mesh,
                        uv: vec2.fromValues(localPoint[0] / width + 0.5, localPoint[1] / height + 0.5),
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

Object.freeze(Raycaster2D);
export default Raycaster2D