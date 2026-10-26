import { vec2, vec3 } from "gl-matrix";
import Ray from "../math/Ray";
import View3D from "../display/view/View3D";
import Mesh from "../display/mesh/Mesh";
/**
 * [KO] 3D 공간에서 카메라와 화면 좌표를 기반으로 광선(`Ray`)을 투사하여 메시와의 정밀한 삼각형 단위 교차를 검사하는 클래스입니다.
 * [EN] Class that casts a `Ray` in 3D space based on camera and screen coordinates to perform precise triangle-level intersection tests with meshes.
 *
 * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster3D();
 * // [KO] 화면 좌표와 뷰를 기반으로 광선 설정 및 교차 검사 수행
 * // [EN] Set ray based on screen coordinates and view, then perform intersection test
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 *
 * @see [MouseEvent (Raycasting) example](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
 * @category Picking
 */
declare class Raycaster3D {
    #private;
    /**
     * [KO] 내부적으로 관리되는 광선(`Ray`) 객체
     * [EN] Internally managed `Ray` object
     */
    readonly ray: Ray;
    /**
     * [KO] 교차 검사 시 고려할 카메라로부터의 최소 거리 (기본값: `0`)
     * [EN] Minimum distance from the camera to consider for intersection (default: `0`)
     */
    near: number;
    /**
     * [KO] 교차 검사 시 고려할 카메라로부터의 최대 거리 (기본값: `Infinity`)
     * [EN] Maximum distance from the camera to consider for intersection (default: `Infinity`)
     */
    far: number;
    /**
     * [KO] `Raycaster3D` 인스턴스를 생성합니다.
     * [EN] Creates a `Raycaster3D` instance.
     */
    constructor();
    /**
     * [KO] 화면 좌표와 `View3D`의 카메라 정보를 기반으로 광선을 설정합니다.
     * [EN] Sets the ray based on screen coordinates and camera information of `View3D`.
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
     * [KO] 대상 `View3D` 인스턴스
     * [EN] Target `View3D` instance
     */
    setFromCamera(screenX: number, screenY: number, view: View3D): void;
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
export default Raycaster3D;
/**
 * [KO] 레이캐스팅 교차 검사 결과를 나타내는 인터페이스입니다.
 * [EN] Interface representing the result of a raycasting intersection test.
 * @category Picking
 */
export interface RayIntersectResult {
    /**
     * [KO] 광선 시작점부터 교차 지점까지의 거리
     * [EN] Distance from ray origin to intersection point
     */
    distance: number;
    /**
     * [KO] 월드 공간상의 교차 지점 좌표 (`vec3`)
     * [EN] Intersection point coordinates in world space (`vec3`)
     */
    point: vec3;
    /**
     * [KO] 객체의 로컬 공간상의 교차 지점 좌표 (`vec3`)
     * [EN] Intersection point coordinates in the object's local space (`vec3`)
     */
    localPoint: vec3;
    /**
     * [KO] 교차된 메시(`Mesh`) 객체
     * [EN] Intersected `Mesh` object
     */
    object: Mesh;
    /**
     * [KO] 교차된 삼각형의 면 인덱스
     * [EN] Face index of the intersected triangle
     */
    faceIndex?: number;
    /**
     * [KO] 교차 지점의 보간된 UV 텍스처 좌표 (`vec2`)
     * [EN] Interpolated UV texture coordinates at the intersection point (`vec2`)
     */
    uv?: vec2;
    /**
     * [KO] 교차 검사에 사용된 월드 광선 (`Ray`)
     * [EN] World `Ray` used for the intersection test
     */
    ray: Ray;
}
