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
 * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster2D();
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 * @category Picking
 */
export default class Raycaster2D {
    #private;
    /**
     * [KO] 내부적으로 관리되는 광선 객체
     * [EN] Internally managed ray object
     *
     * [KO] 2D에서는 실제 광선 대신 월드 좌표상의 지점을 사용하지만, Raycaster3D와의 호환성을 위해 유지됩니다.
     * [EN] In 2D, a point in world coordinates is used instead of an actual ray, but it is maintained for compatibility with Raycaster3D.
     */
    readonly ray: Ray;
    /**
     * [KO] Raycaster2D 인스턴스를 생성합니다.
     * [EN] Creates a Raycaster2D instance.
     */
    constructor();
    /**
     * [KO] 화면 좌표를 기반으로 피킹 지점을 설정합니다.
     * [EN] Sets the picking point based on screen coordinates.
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
     * [KO] 대상 View2D 인스턴스
     * [EN] Target View2D instance
     */
    setFromCamera(screenX: number, screenY: number, view: View2D): void;
    /**
     * [KO] 단일 객체와의 교차 여부를 검사합니다.
     * [EN] Checks for intersection with a single object.
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
     * [KO] 자식 객체도 포함할지 여부 (기본값: true)
     * [EN] Whether to include child objects (default: true)
     * @returns
     * [KO] 교차 정보 배열 (`RayIntersectResult[]`)
     * [EN] Array of intersection information (`RayIntersectResult[]`)
     */
    intersectObject(mesh: Mesh, recursive?: boolean): RayIntersectResult[];
    /**
     * [KO] 여러 객체와의 교차 여부를 검사합니다.
     * [EN] Checks for intersections with multiple objects.
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
     * [KO] 자식 객체도 포함할지 여부 (기본값: true)
     * [EN] Whether to include child objects (default: true)
     * @returns
     * [KO] 교차 정보 배열 (`RayIntersectResult[]`)
     * [EN] Array of intersection information (`RayIntersectResult[]`)
     */
    intersectObjects(meshes: Mesh[], recursive?: boolean): RayIntersectResult[];
}
