import {mat4} from "gl-matrix";
import Camera2D from "../../../camera/camera/Camera2D";
import OrthographicCamera from "../../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import AController from "../../../camera/core/AController";
import RedGPUContextSizeManager, {RedResizeEvent} from "../../../context/core/RedGPUContextSizeManager";
import RedGPUContext from "../../../context/RedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import computeViewFrustumPlanes from "../../../math/computeViewFrustumPlanes";
import RedGPUObject from "../../../base/RedGPUObject";

/**
 * [KO] View3D/View2D의 크기와 위치를 관리하는 클래스입니다.
 * [EN] Class that manages the size and position of View3D/View2D.
 *
 * [KO] 카메라 타입을 받아 해당 카메라에 맞는 투영 행렬을 생성하고, 화면 내 위치 및 크기(pixel rect) 등을 계산하는 기능을 담당합니다.
 * [EN] Receives a camera type, generates a projection matrix suitable for that camera, and handles the calculation of the position and size (pixel rect) within the screen.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템 내부적으로 사용되는 기본 클래스입니다.<br/>직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is a base class used internally by the system.<br/>Do not create instances directly.
 * :::
 *
 * @category Core
 */
class ViewTransform extends RedGPUObject {
    /**
     * [KO] 뷰 크기 변경 시 호출되는 콜백 함수
     * [EN] Callback function called when the view size changes
     */
    onResize: ((event: RedResizeEvent<ViewTransform>) => void) | null = null;
    /**
     * [KO] 현재 적용된(지터 포함) 프로젝션 행렬 캐시
     * [EN] Cached current projection matrix (including jitter)
     */
    #projectionMatrix = mat4.create()
    /**
     * [KO] 지터가 적용되지 않은 원본 프로젝션 행렬 캐시
     * [EN] Cached original projection matrix without jitter
     */
    #noneJitterProjectionMatrix = mat4.create()
    /**
     * [KO] 이 뷰에 연결된 카메라 인스턴스
     * [EN] Camera instance connected to this view
     */
    #camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D
    /**
     * [KO] 뷰의 X 위치 값 (픽셀 수 또는 백분율 문자열)
     * [EN] X position of the view (pixels or percentage string)
     */
    #x: number | string = 0
    /**
     * [KO] 뷰의 Y 위치 값 (픽셀 수 또는 백분율 문자열)
     * [EN] Y position of the view (pixels or percentage string)
     */
    #y: number | string = 0
    /**
     * [KO] 뷰의 너비 값 (픽셀 수 또는 백분율 문자열)
     * [EN] Width of the view (pixels or percentage string)
     */
    #width: number | string
    /**
     * [KO] 뷰의 높이 값 (픽셀 수 또는 백분율 문자열)
     * [EN] Height of the view (pixels or percentage string)
     */
    #height: number | string
    /**
     * [KO] 픽셀 단위 사각형 [x, y, width, height] (device pixel 단위)
     * [EN] Pixel rectangle [x, y, width, height] (in device pixels)
     */
    #pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]
    /**
     * [KO] 현재 적용된 지터 오프셋 X 값 (정규화된 값)
     * [EN] Currently applied jitter offset X value (normalized value)
     */
    #jitterOffsetX: number = 0;
    /**
     * [KO] 현재 적용된 지터 오프셋 Y 값 (정규화된 값)
     * [EN] Currently applied jitter offset Y value (normalized value)
     */
    #jitterOffsetY: number = 0;

    /**
     * [KO] ViewTransform 인스턴스를 생성합니다.
     * [EN] Creates a new ViewTransform instance.
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext);
        this.setSize('100%', '100%')
    }

    /**
     * [KO] 현재 연결된 카메라를 반환합니다.
     * [EN] Returns the currently connected camera.
     */
    get camera(): PerspectiveCamera | OrthographicCamera | AController | Camera2D {
        return this.#camera;
    }

    /**
     * [KO] 카메라를 설정합니다. PerspectiveCamera, OrthographicCamera, AController, Camera2D 중 하나여야 합니다.
     * [EN] Sets the camera. Must be one of PerspectiveCamera, OrthographicCamera, AController, or Camera2D.
     * @param value -
     * [KO] 연결할 카메라 인스턴스
     * [EN] Camera instance to connect
     * @throws
     * [KO] 지원하지 않는 카메라 타입일 경우 에러 발생
     * [EN] Throws error if camera type is not supported
     */
    set camera(value: PerspectiveCamera | OrthographicCamera | AController | Camera2D) {
        if (!(value instanceof PerspectiveCamera) && !(value instanceof Camera2D) && !(value instanceof OrthographicCamera) && !(value instanceof AController)) consoleAndThrowError('allow PerspectiveCamera or OrthographicCamera or AController instance')
        this.#camera = value;
    }

    /**
     * [KO] 뷰의 X 위치 값을 반환합니다. (픽셀 또는 퍼센트 문자열)
     * [EN] Returns the X position value of the view. (Pixels or percentage string)
     */
    get x(): number | string {
        return this.#x;
    }

    /**
     * [KO] 뷰의 X 위치를 설정합니다.
     * [EN] Sets the X position of the view.
     * @param value -
     * [KO] 설정할 X 위치 값
     * [EN] X position value to set
     */
    set x(value: number | string) {
        this.setPosition(value, this.y)
    }

    /**
     * [KO] 뷰의 Y 위치 값을 반환합니다. (픽셀 또는 퍼센트 문자열)
     * [EN] Returns the Y position value of the view. (Pixels or percentage string)
     */
    get y(): number | string {
        return this.#y;
    }

    /**
     * [KO] 뷰의 Y 위치를 설정합니다.
     * [EN] Sets the Y position of the view.
     * @param value -
     * [KO] 설정할 Y 위치 값
     * [EN] Y position value to set
     */
    set y(value: number | string) {
        this.setPosition(this.x, value)
    }

    /**
     * [KO] 뷰의 너비 값을 반환합니다. (픽셀 또는 퍼센트 문자열)
     * [EN] Returns the width value of the view. (Pixels or percentage string)
     */
    get width(): number | string {
        return this.#width;
    }

    /**
     * [KO] 뷰의 너비를 설정합니다.
     * [EN] Sets the width of the view.
     * @param value -
     * [KO] 설정할 너비 값
     * [EN] Width value to set
     */
    set width(value: number | string) {
        this.setSize(value, this.#height)
    }

    /**
     * [KO] 뷰의 높이 값을 반환합니다. (픽셀 또는 퍼센트 문자열)
     * [EN] Returns the height value of the view. (Pixels or percentage string)
     */
    get height(): number | string {
        return this.#height;
    }

    /**
     * [KO] 뷰의 높이를 설정합니다.
     * [EN] Sets the height of the view.
     * @param value -
     * [KO] 설정할 높이 값
     * [EN] Height value to set
     */
    set height(value: number | string) {
        this.setSize(this.#width, value)
    }

    /**
     * [KO] 픽셀 단위의 사각형 배열을 반환합니다. ([x, y, width, height])
     * [EN] Returns the rectangle array in pixels. ([x, y, width, height])
     */
    get pixelRectArray() {
        return this.#pixelRectArray;
    }

    /**
     * [KO] 픽셀 단위의 사각형을 객체 형태로 반환합니다. ({ x, y, width, height })
     * [EN] Returns the pixel rectangle in object form. ({ x, y, width, height })
     */
    get pixelRectObject() {
        return {
            x: this.#pixelRectArray[0],
            y: this.#pixelRectArray[1],
            width: this.#pixelRectArray[2],
            height: this.#pixelRectArray[3]
        }
    }

    /**
     * [KO] 스크린 해상도(DPI)가 고려된 스크린 기준 사각형 객체를 반환합니다. (devicePixelRatio로 나눈 값)
     * [EN] Returns the screen-relative rectangle object scaled by dividing by devicePixelRatio.
     */
    get screenRectObject() {
        return {
            x: this.#pixelRectArray[0] / devicePixelRatio,
            y: this.#pixelRectArray[1] / devicePixelRatio,
            width: this.#pixelRectArray[2] / devicePixelRatio,
            height: this.#pixelRectArray[3] / devicePixelRatio
        };
    }

    /**
     * [KO] 현재 뷰의 가로세로 비율(Aspect Ratio)을 반환합니다.
     * [EN] Returns the aspect ratio (width/height) of the current view.
     */
    get aspect(): number {
        return this.#pixelRectArray[2] / this.#pixelRectArray[3]
    }

    /**
     * [KO] 현재 투영(projection) 및 카메라 뷰(view) 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.
     * [EN] Calculates and returns the view frustum planes based on the current projection and camera view matrices.
     * @returns
     * [KO] 프러스텀 평면 배열
     * [EN] Frustum planes array
     */
    get frustumPlanes() {
        if (this.#camera instanceof AController) {
            return computeViewFrustumPlanes(this.projectionMatrix, this.#camera.camera.viewMatrix)
        } else {
            return computeViewFrustumPlanes(this.projectionMatrix, this.#camera.viewMatrix)
        }
    }

    /**
     * [KO] 내부적으로 참조하는 실제 카메라 인스턴스를 반환합니다. (AController가 연동된 경우 제어 대상 내부 카메라 반환)
     * [EN] Returns the raw camera instance referenced internally. (Returns internal camera if AController is linked)
     */
    get rawCamera(): PerspectiveCamera | Camera2D | OrthographicCamera {
        return this.#camera instanceof AController ? this.#camera.camera : this.#camera
    }

    /**
     * [KO] 지터(Jitter)가 배제된 상태의 원본 프로젝션 행렬을 반환합니다.
     * [EN] Returns the original projection matrix with jitter excluded.
     */
    get noneJitterProjectionMatrix(): mat4 {
        const {pixelRectObject, redGPUContext} = this
        if (this.rawCamera instanceof OrthographicCamera) {
            const {nearClipping, farClipping} = this.rawCamera
            mat4.orthoZO(this.#noneJitterProjectionMatrix, this.rawCamera.left, this.rawCamera.right, this.rawCamera.bottom, this.rawCamera.top, nearClipping, farClipping)
        } else if (this.rawCamera instanceof Camera2D) {
            mat4.ortho(
                this.#noneJitterProjectionMatrix,
                -0.5, // left
                0.5, // right
                -0.5, // bottom
                0.5, // top,
                -100000,
                100000
            );
            mat4.scale(
                this.#noneJitterProjectionMatrix,
                this.#noneJitterProjectionMatrix,
                [
                    redGPUContext.renderScale,
                    redGPUContext.renderScale,
                    1
                ]
            )
            mat4.translate(this.#noneJitterProjectionMatrix, this.#noneJitterProjectionMatrix, [-0.5, 0.5, 0]);
            mat4.scale(
                this.#noneJitterProjectionMatrix,
                this.#noneJitterProjectionMatrix,
                [
                    1 / pixelRectObject.width * window.devicePixelRatio,
                    -1 / pixelRectObject.height * window.devicePixelRatio,
                    1
                ]
            );
        } else {
            const {fieldOfView, nearClipping, farClipping} = this.rawCamera
            mat4.perspective(this.#noneJitterProjectionMatrix, (Math.PI / 180) * fieldOfView, this.aspect, nearClipping, farClipping);
        }
        return this.#noneJitterProjectionMatrix
    }

    /**
     * [KO] 지터 오프셋이 반영된 최종 프로젝션 행렬을 반환합니다. (TAA 기동 시 PerspectiveCamera에 한해 적용됨)
     * [EN] Returns the final projection matrix reflecting the jitter offset. (Applied only to PerspectiveCamera when TAA is enabled)
     */
    get projectionMatrix(): mat4 {
        const {redGPUContext} = this
        const {antialiasingManager} = redGPUContext
        this.#projectionMatrix = mat4.clone(this.noneJitterProjectionMatrix)
        const needJitter = this.constructor.name === 'View3D' && (this.camera.constructor.name !== 'IsometricController') && antialiasingManager.useTAA

        if (needJitter) {
            if (this.rawCamera instanceof PerspectiveCamera && (this.#jitterOffsetX !== 0 || this.#jitterOffsetY !== 0)) {
                const ndcJitterX = (this.#jitterOffsetX / this.pixelRectObject.width) * 2.0;
                const ndcJitterY = (this.#jitterOffsetY / this.pixelRectObject.height) * 2.0;

                this.#projectionMatrix[8] += ndcJitterX;
                this.#projectionMatrix[9] += ndcJitterY;
            }
        }
        return this.#projectionMatrix;
    }

    /**
     * [KO] 프로젝션 행렬의 역행렬을 계산하여 반환합니다.
     * [EN] Computes and returns the inverse projection matrix.
     */
    get inverseProjectionMatrix(): mat4 {
        return mat4.invert(mat4.create(), this.#projectionMatrix);
    }

    /**
     * [KO] 현재 설정된 지터 오프셋 [offsetX, offsetY]을 반환합니다.
     * [EN] Returns the currently configured jitter offset [offsetX, offsetY].
     */
    get jitterOffset(): [number, number] {
        return [this.#jitterOffsetX, this.#jitterOffsetY];
    }

    /**
     * [KO] TAA 계산을 위한 렌더 픽셀 지터 오프셋을 설정합니다.
     * [EN] Sets the render pixel jitter offset for TAA calculations.
     * @param offsetX -
     * [KO] X축 지터 오프셋 값
     * [EN] X-axis jitter offset value
     * @param offsetY -
     * [KO] Y축 지터 오프셋 값
     * [EN] Y-axis jitter offset value
     */
    setJitterOffset(offsetX: number, offsetY: number) {
        this.#jitterOffsetX = offsetX;
        this.#jitterOffsetY = offsetY;
    }

    /**
     * [KO] 지터 오프셋을 0으로 지우고 초기화합니다.
     * [EN] Clears and resets the jitter offset to 0.
     */
    clearJitterOffset() {
        this.#jitterOffsetX = 0;
        this.#jitterOffsetY = 0;
    }

    /**
     * [KO] 뷰의 위치(X, Y)를 지정하고 스크린 해상도를 고려해 물리 픽셀 사각형 정보를 갱신합니다.
     * [EN] Sets the position (X, Y) of the view and updates physical pixel rectangle values considering DPI.
     * @param x -
     * [KO] 설정할 X 위치 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 X 위치)
     * [EN] X position to set (pixel number or percentage string, default: current X)
     * @param y -
     * [KO] 설정할 Y 위치 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 Y 위치)
     * [EN] Y position to set (pixel number or percentage string, default: current Y)
     */
    setPosition(x: string | number = this.#x, y: string | number = this.#y) {
        const {sizeManager} = this.redGPUContext
        RedGPUContextSizeManager.validatePositionValue(x)
        RedGPUContextSizeManager.validatePositionValue(y)
        this.#x = x;
        this.#y = y;
        const pixelRectObject = sizeManager.pixelRectObject
        const tX = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'width', x)
        const tY = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'height', y)
        this.#pixelRectArray[0] = Math.round(tX * (this.#x.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio));
        this.#pixelRectArray[1] = Math.round(tY * (this.#y.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio));
    }

    /**
     * [KO] 뷰의 크기(너비, 높이)를 지정하고 내부 물리 픽셀 사각형 정보를 갱신합니다. onResize 콜백이 지정되어 있다면 호출합니다.
     * [EN] Sets the size (width, height) of the view and updates internal physical pixel rectangle values. Triggers onResize callback if registered.
     * @param w -
     * [KO] 설정할 너비 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 너비)
     * [EN] Width to set (pixel number or percentage string, default: current width)
     * @param h -
     * [KO] 설정할 높이 (픽셀 단위 수 또는 백분율 문자열, 기본값: 현재 높이)
     * [EN] Height to set (pixel number or percentage string, default: current height)
     */
    setSize(w: string | number = this.#width, h: string | number = this.#height) {
        const {sizeManager} = this.redGPUContext
        RedGPUContextSizeManager.validateSizeValue(w)
        RedGPUContextSizeManager.validateSizeValue(h)
        this.#width = w;
        this.#height = h;
        const pixelRectObject = sizeManager.pixelRectObject
        const tW = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'width', w)
        const tH = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'height', h)
        this.#pixelRectArray[2] = Math.max(1, Math.round(tW * (this.#width.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio)));
        this.#pixelRectArray[3] = Math.max(1, Math.round(tH * (this.#height.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio)));
        if (this.onResize) this.onResize({
            target: this,
            screenRectObject: this.screenRectObject,
            pixelRectObject: this.pixelRectObject
        })
    }
}

Object.freeze(ViewTransform)
export default ViewTransform
