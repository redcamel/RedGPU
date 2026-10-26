import View2D from "../display/view/View2D";
import Mesh from "../display/mesh/Mesh";
import Ray from "../math/Ray";
import { RayIntersectResult } from "./Raycaster3D";
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
declare class Raycaster2D {
    #private;
    /**
     * [KO] `Raycaster3D`와의 호환성을 위해 내부적으로 관리되는 광선(`Ray`) 객체
     * [EN] Internally managed `Ray` object maintained for compatibility with `Raycaster3D`
     */
    readonly ray: Ray;
    /**
     * [KO] `Raycaster2D` 인스턴스를 생성합니다.
     * [EN] Creates a `Raycaster2D` instance.
     */
    constructor();
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
    setFromCamera(screenX: number, screenY: number, view: View2D): void;
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
    intersectObject(mesh: Mesh, recursive?: boolean): RayIntersectResult[];
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
    intersectObjects(meshes: Mesh[], recursive?: boolean): RayIntersectResult[];
}
export default Raycaster2D;
