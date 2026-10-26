import { mat4 } from "gl-matrix";
import Camera2D from "../../../camera/camera/Camera2D";
import OrthographicCamera from "../../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import AController from "../../../camera/core/AController";
import { RedResizeEvent } from "../../../context/core/RedGPUContextSizeManager";
import RedGPUContext from "../../../context/RedGPUContext";
import RedGPUObject from "../../../base/RedGPUObject";
/**
 * [KO] 뷰의 위치, 크기 및 카메라 투영 행렬을 관리하는 기본 클래스입니다.
 * [EN] Base class that manages the position, size, and camera projection matrix of a view.
 *
 * ::: warning
 * [KO] 이 클래스는 추상 클래스이므로 직접 인스턴스를 생성할 수 없습니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is an abstract class, so you cannot create an instance directly.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
declare class ViewTransform extends RedGPUObject {
    #private;
    /**
     * [KO] 뷰 크기 변경 시 호출되는 콜백 함수
     * [EN] Callback function invoked when the view size changes
     */
    onResize: ((event: RedResizeEvent<ViewTransform>) => void) | null;
    /**
     * [KO] ViewTransform 인스턴스를 생성합니다.
     * [EN] Creates a ViewTransform instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * [KO] 현재 뷰에 연결된 카메라 또는 컨트롤러를 반환하거나 설정합니다.
     * [EN] Gets or sets the camera or controller connected to the current view.
     *
     * @returns
     * [KO] 연결된 카메라 또는 컨트롤러 인스턴스
     * [EN] Connected camera or controller instance
     */
    get camera(): PerspectiveCamera | OrthographicCamera | AController | Camera2D;
    set camera(value: PerspectiveCamera | OrthographicCamera | AController | Camera2D);
    /**
     * [KO] 뷰의 X 좌표(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.
     * [EN] Gets or sets the X coordinate (pixels or percentage string) of the view.
     *
     * @returns
     * [KO] 뷰의 X 좌표
     * [EN] X coordinate of the view
     */
    get x(): number | string;
    set x(value: number | string);
    /**
     * [KO] 뷰의 Y 좌표(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.
     * [EN] Gets or sets the Y coordinate (pixels or percentage string) of the view.
     *
     * @returns
     * [KO] 뷰의 Y 좌표
     * [EN] Y coordinate of the view
     */
    get y(): number | string;
    set y(value: number | string);
    /**
     * [KO] 뷰의 너비(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.
     * [EN] Gets or sets the width (pixels or percentage string) of the view.
     *
     * @returns
     * [KO] 뷰의 너비
     * [EN] Width of the view
     */
    get width(): number | string;
    set width(value: number | string);
    /**
     * [KO] 뷰의 높이(픽셀 또는 백분율 문자열)를 반환하거나 설정합니다.
     * [EN] Gets or sets the height (pixels or percentage string) of the view.
     *
     * @returns
     * [KO] 뷰의 높이
     * [EN] Height of the view
     */
    get height(): number | string;
    set height(value: number | string);
    /**
     * [KO] 물리 픽셀 단위의 사각형 배열(`[x, y, width, height]`)을 반환합니다.
     * [EN] Returns the rectangle array in physical pixels (`[x, y, width, height]`).
     *
     * @returns
     * [KO] 물리 픽셀 사각형 배열
     * [EN] Physical pixel rectangle array
     */
    get pixelRectArray(): [number, number, number, number];
    /**
     * [KO] 물리 픽셀 단위의 사각형 정보 객체(`{ x, y, width, height }`)를 반환합니다.
     * [EN] Returns the rectangle information object in physical pixels (`{ x, y, width, height }`).
     *
     * @returns
     * [KO] 물리 픽셀 사각형 객체
     * [EN] Physical pixel rectangle object
     */
    get pixelRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * [KO] `devicePixelRatio`가 반영된 CSS 스크린 기준 사각형 정보 객체를 반환합니다.
     * [EN] Returns the CSS screen-relative rectangle information object scaled by `devicePixelRatio`.
     *
     * @returns
     * [KO] 스크린 기준 사각형 객체
     * [EN] Screen-relative rectangle object
     */
    get screenRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * [KO] 뷰포트의 가로세로 비율(종횡비)을 반환합니다.
     * [EN] Returns the aspect ratio (width / height) of the viewport.
     *
     * @returns
     * [KO] 뷰포트 종횡비
     * [EN] Viewport aspect ratio
     */
    get aspect(): number;
    /**
     * [KO] 현재 투영 행렬과 뷰 행렬을 기반으로 계산된 6개의 뷰 프러스텀 평면 배열을 반환합니다.
     * [EN] Returns the array of 6 view frustum planes calculated from the current projection and view matrices.
     *
     * @returns
     * [KO] 프러스텀 평면 배열
     * [EN] Frustum planes array
     */
    get frustumPlanes(): number[][];
    /**
     * [KO] 현재 투영 행렬과 뷰 행렬을 기반으로 계산된 1차원 평탄 프러스텀 평면 버퍼(`Float32Array(24)`)를 반환합니다.
     * [EN] Returns the 1D flattened frustum planes buffer (`Float32Array(24)`) calculated from the current projection and view matrices.
     *
     * @returns
     * [KO] 24개 float으로 구성된 1차원 프러스텀 평면 버퍼
     * [EN] 1D frustum planes buffer of 24 floats
     */
    get frustumPlanesFlat(): Float32Array;
    /**
     * [KO] 실제 렌더링에 사용되는 내부 카메라 인스턴스를 반환합니다. (`AController`가 연결된 경우 제어 대상 카메라 반환)
     * [EN] Returns the raw camera instance used for actual rendering. (Returns the controlled camera if an `AController` is connected)
     *
     * @returns
     * [KO] 내부 카메라 인스턴스
     * [EN] Raw camera instance
     */
    get rawCamera(): PerspectiveCamera | Camera2D | OrthographicCamera;
    /**
     * [KO] TAA 지터(Jitter)가 적용되지 않은 원본 투영 행렬을 반환합니다.
     * [EN] Returns the original projection matrix without TAA jitter applied.
     *
     * @returns
     * [KO] 지터가 배제된 투영 행렬
     * [EN] Projection matrix without jitter
     */
    get noneJitterProjectionMatrix(): mat4;
    /**
     * [KO] TAA 활성화 여부에 따라 지터 오프셋이 반영된 최종 투영 행렬을 반환합니다.
     * [EN] Returns the final projection matrix reflecting the jitter offset depending on whether TAA is enabled.
     *
     * @returns
     * [KO] 최종 투영 행렬
     * [EN] Final projection matrix
     */
    get projectionMatrix(): mat4;
    /**
     * [KO] 현재 투영 행렬의 역행렬을 계산하여 반환합니다.
     * [EN] Computes and returns the inverse of the current projection matrix.
     *
     * @returns
     * [KO] 역투영 행렬
     * [EN] Inverse projection matrix
     */
    get inverseProjectionMatrix(): mat4;
    /**
     * [KO] 현재 적용된 픽셀 지터 오프셋(`[offsetX, offsetY]`)을 반환합니다.
     * [EN] Returns the currently applied pixel jitter offset (`[offsetX, offsetY]`).
     *
     * @returns
     * [KO] 지터 오프셋 튜플
     * [EN] Jitter offset tuple
     */
    get jitterOffset(): [number, number];
    /**
     * [KO] TAA 연산을 위한 서브픽셀 지터 오프셋을 설정합니다.
     * [EN] Sets the sub-pixel jitter offset for TAA calculations.
     *
     * @param offsetX -
     * [KO] X축 지터 오프셋
     * [EN] X-axis jitter offset
     * @param offsetY -
     * [KO] Y축 지터 오프셋
     * [EN] Y-axis jitter offset
     */
    setJitterOffset(offsetX: number, offsetY: number): void;
    /**
     * [KO] 지터 오프셋을 `[0, 0]`으로 초기화합니다.
     * [EN] Resets the jitter offset to `[0, 0]`.
     */
    clearJitterOffset(): void;
    /**
     * [KO] 뷰의 위치(X, Y)를 설정하고 물리 픽셀 영역 좌표를 갱신합니다.
     * [EN] Sets the position (X, Y) of the view and updates the physical pixel rectangle coordinates.
     *
     * ### Example
     * ```typescript
     * // [KO] 픽셀 또는 퍼센트 단위로 뷰 위치 지정
     * // [EN] Set view position in pixels or percentage
     * view.setPosition(100, '50%');
     * ```
     *
     * @param x -
     * [KO] X 좌표 (픽셀 수치 또는 백분율 문자열)
     * [EN] X coordinate (pixel number or percentage string)
     * @param y -
     * [KO] Y 좌표 (픽셀 수치 또는 백분율 문자열)
     * [EN] Y coordinate (pixel number or percentage string)
     */
    setPosition(x?: string | number, y?: string | number): void;
    /**
     * [KO] 뷰의 크기(너비, 높이)를 설정하고 물리 픽셀 영역을 갱신하며, `onResize` 콜백이 등록되어 있으면 호출합니다.
     * [EN] Sets the size (width, height) of the view, updates the physical pixel rectangle, and invokes the `onResize` callback if registered.
     *
     * ### Example
     * ```typescript
     * // [KO] 픽셀 또는 퍼센트 단위로 뷰 크기 지정
     * // [EN] Set view size in pixels or percentage
     * view.setSize('100%', '100%');
     * ```
     *
     * @param w -
     * [KO] 너비 (픽셀 수치 또는 백분율 문자열)
     * [EN] Width (pixel number or percentage string)
     * @param h -
     * [KO] 높이 (픽셀 수치 또는 백분율 문자열)
     * [EN] Height (pixel number or percentage string)
     */
    setSize(w?: string | number, h?: string | number): void;
}
export default ViewTransform;
