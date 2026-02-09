import { vec3, vec2 } from "gl-matrix";
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
 * ### Example
 * ```typescript
 * const raycaster = new RedGPU.Picking.Raycaster3D();
 * raycaster.setFromCamera(mouseX, mouseY, view);
 * const intersects = raycaster.intersectObjects(scene.children);
 * ```
 * @category Picking
 */
export default class Raycaster3D {
    #private;
    /**
     * [KO] 내부적으로 관리되는 광원 객체
     * [EN] Internally managed ray object
     */
    readonly ray: Ray;
    /**
     * [KO] 교차 검사 시 고려할 최소 거리 (카메라로부터)
     * [EN] Minimum distance to consider for intersection (from camera)
     * @defaultValue 0
     */
    near: number;
    /**
     * [KO] 교차 검사 시 고려할 최대 거리 (카메라로부터)
     * [EN] Maximum distance to consider for intersection (from camera)
     * @defaultValue Infinity
     */
    far: number;
    /**
     * [KO] Raycaster3D 인스턴스를 생성합니다.
     * [EN] Creates a Raycaster3D instance.
     */
    constructor();
    /**
     * [KO] 화면 좌표와 카메라 정보를 기반으로 광선을 설정합니다.
     * [EN] Sets the ray based on screen coordinates and camera information.
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
     * [KO] 대상 View3D 인스턴스
     * [EN] Target View3D instance
     */
    setFromCamera(screenX: number, screenY: number, view: View3D): void;
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
     * [KO] 월드 공간상의 교차 지점 좌표
     * [EN] Intersection point coordinates in world space
     */
    point: vec3;
    /**
     * [KO] 객체의 로컬 공간상의 교차 지점 좌표
     * [EN] Intersection point coordinates in the object's local space
     */
    localPoint: vec3;
    /**
     * [KO] 교차된 메시 객체
     * [EN] The intersected mesh object
     */
    object: Mesh;
    /**
     * [KO] 교차된 삼각형의 인덱스
     * [EN] Index of the intersected triangle
     */
    faceIndex?: number;
    /**
     * [KO] 교차 지점의 UV 좌표 (텍스처 좌표)
     * [EN] UV coordinates at the intersection point (Texture coordinates)
     */
    uv?: vec2;
    /**
     * [KO] 교차 검사에 사용된 월드 광선
     * [EN] World ray used for intersection test
     */
    ray: Ray;
}
