import {mat4} from "gl-matrix";
import Camera2D from "../../../camera/camera/Camera2D";
import OrthographicCamera from "../../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import IsometricController from "../../../camera/controller/IsometricController";
import AController from "../../../camera/core/AController";
import RedGPUContextSizeManager, {IRedGPURectObject, RedResizeEvent} from "../../../context/core/RedGPUContextSizeManager";
import RedGPUContext from "../../../context/RedGPUContext";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../../utils/consoleAndThrowError";
import computeViewFrustumPlanes from "../../../math/computeViewFrustumPlanes";

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
class ViewTransform {
    /**
     * 뷰 크기 변경 시 호출되는 콜백입니다.
     * @type {((event: RedResizeEvent<ViewTransform>) => void) | null}
     */
    onResize: ((event: RedResizeEvent<ViewTransform>) => void) | null = null;
    /**
     * 연결된 RedGPUContext 인스턴스(읽기 전용).
     * @private
     * @readonly
     * @type {RedGPUContext}
     */
    readonly #redGPUContext: RedGPUContext
    /**
     * 현재 적용된(지터 포함) 프로젝션 행렬 캐시입니다.
     * @private
     * @type {mat4}
     */
    #projectionMatrix = mat4.create()
    /**
     * 지터가 적용되지 않은 원본 프로젝션 행렬 캐시입니다.
     * @private
     * @type {mat4}
     */
    #noneJitterProjectionMatrix = mat4.create()
    /**
     * 이 뷰에 연결된 카메라 인스턴스(Perspective | Orthographic | AController | Camera2D).
     * @private
     */
    #camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D
    /**
     * 뷰의 X 위치 값(픽셀 또는 퍼센트 문자열).
     * @private
     * @type {number | string}
     */
    #x: number | string = 0
    /**
     * 뷰의 Y 위치 값(픽셀 또는 퍼센트 문자열).
     * @private
     * @type {number | string}
     */
    #y: number | string = 0
    //TODO rotationX,rotationY,rotationZ를 가질수 있도록 할수 있는가?
    /**
     * 뷰의 너비 값(픽셀 또는 퍼센트 문자열).
     * @private
     * @type {number | string}
     */
    #width: number | string
    /**
     * 뷰의 높이 값(픽셀 또는 퍼센트 문자열).
     * @private
     * @type {number | string}
     */
    #height: number | string
    /**
     * 픽셀 단위 사각형 [x, y, width, height] (device pixel 단위).
     * @private
     * @type {[number, number, number, number]}
     */
    #pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]
    // TAA 지터 관련 속성 추가
    /**
     * 현재 적용된 지터 오프셋 X 값 (정규화된 값).
     * @private
     * @type {number}
     */
    #jitterOffsetX: number = 0;
    /**
     * 현재 적용된 지터 오프셋 Y 값 (정규화된 값).
     * @private
     * @type {number}
     */
    #jitterOffsetY: number = 0;

    /**
     * ViewTransform 생성자.
     * @param {RedGPUContext} redGPUContext - 유효한 RedGPUContext 인스턴스
     */
    constructor(redGPUContext: RedGPUContext) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.setSize('100%', '100%')
    }

    /**
     * 연결된 RedGPUContext 반환 (읽기 전용).
     * @returns {RedGPUContext}
     */
    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    /**
     * 현재 연결된 카메라를 반환합니다.
     * @returns {PerspectiveCamera | OrthographicCamera | AController | Camera2D}
     */
    get camera(): PerspectiveCamera | OrthographicCamera | AController | Camera2D {
        return this.#camera;
    }

    /**
     * 카메라를 설정합니다. 허용되는 타입은 PerspectiveCamera, OrthographicCamera, AController, Camera2D 입니다.
     * 잘못된 타입이 들어오면 오류를 발생시킵니다.
     * @param {PerspectiveCamera | OrthographicCamera | AController | Camera2D} value
     */
    set camera(value: PerspectiveCamera | OrthographicCamera | AController | Camera2D) {
        if (!(value instanceof PerspectiveCamera || value instanceof Camera2D) && !(value instanceof Camera2D) && !(value instanceof OrthographicCamera) && !(value instanceof AController)) consoleAndThrowError('allow PerspectiveCamera or OrthographicCamera or AController instance')
        this.#camera = value;
    }

    /**
     * 뷰의 X 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get x(): number | string {
        return this.#x;
    }

    /**
     * 뷰의 X 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.
     * @param {number | string} value
     */
    set x(value: number | string) {
        this.setPosition(value, this.y)
    }

    /**
     * 뷰의 Y 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get y(): number | string {
        return this.#y;
    }

    /**
     * 뷰의 Y 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.
     * @param {number | string} value
     */
    set y(value: number | string) {
        this.setPosition(this.x, value)
    }

    /**
     * 뷰의 너비 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get width(): number | string {
        return this.#width;
    }

    /**
     * 뷰의 너비를 설정합니다. 내부적으로 setSize를 호출합니다.
     * @param {number | string} value
     */
    set width(value: number | string) {
        this.setSize(value, this.#height)
    }

    /**
     * 뷰의 높이 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get height(): number | string {
        return this.#height;
    }

    /**
     * 뷰의 높이를 설정합니다. 내부적으로 setSize를 호출합니다.
     * @param {number | string} value
     */
    set height(value: number | string) {
        this.setSize(this.#width, value)
    }

    /**
     * 픽셀 단위 사각형 배열을 반환합니다. [x, y, width, height]
     * @returns {[number, number, number, number]}
     */
    get pixelRectArray() {
        return this.#pixelRectArray;
    }

    /**
     * 픽셀 단위 사각형을 객체 형태로 반환합니다.
     * @returns {{x:number,y:number,width:number,height:number}}
     */
    get pixelRectObject() {
        return {
            x: this.#pixelRectArray[0],
            y: this.#pixelRectArray[1],
            width: this.#pixelRectArray[2],
            height: this.#pixelRectArray[3]
        }
    }

    // Returns an object representing the screen rectangle
    // The x, y, width, and height values are calculated by dividing the pixel rectangle values
    // by the device's pixel ratio for proper scaling on high-DPI screens.
    /**
     * 스크린 기준 사각형을 반환합니다 (devicePixelRatio로 나눔).
     * @returns {{x:number,y:number,width:number,height:number}}
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
     * 현재 뷰의 종횡비(가로/세로)를 반환합니다.
     * @returns {number}
     */
    get aspect(): number {
        return this.#pixelRectArray[2] / this.#pixelRectArray[3]
    }

    /**
     * 현재 프로젝션 및 카메라 모델 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.
     * AController 인스턴스 사용 시 내부 카메라의 modelMatrix를 사용합니다.
     * @returns {Float32Array[]} 프러스텀 평면 배열
     */
    get frustumPlanes() {
        if (this.#camera instanceof AController) {
            return computeViewFrustumPlanes(this.projectionMatrix, this.#camera.camera.modelMatrix)
        } else {
            return computeViewFrustumPlanes(this.projectionMatrix, this.#camera.modelMatrix)
        }
    }

    /**
     * 내부에 연결된 실제 카메라 인스턴스(PerspectiveCamera 또는 Camera2D)를 반환합니다.
     * AController가 연결된 경우 내부 camera를 반환합니다.
     * @returns {PerspectiveCamera | Camera2D}
     */
    get rawCamera(): PerspectiveCamera | Camera2D | OrthographicCamera {
        return this.#camera instanceof AController ? this.#camera.camera : this.#camera
    }


    /**
     * 지터가 적용되지 않은 원본 프로젝션 행렬을 계산하여 반환합니다.
     * Orthographic, Camera2D, Perspective 각각의 방식으로 행렬을 구성합니다.
     * @returns {mat4}
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
            mat4.identity(this.rawCamera.modelMatrix);
        } else {
            const {fieldOfView, nearClipping, farClipping} = this.rawCamera
            mat4.perspective(this.#noneJitterProjectionMatrix, (Math.PI / 180) * fieldOfView, this.aspect, nearClipping, farClipping);
        }
        return this.#noneJitterProjectionMatrix
    }

    /**
     * 현재 프로젝션 행렬(지터 적용 여부를 반영)을 반환합니다.
     * TAA 사용 시 PerspectiveCamera에 한해 지터 오프셋을 적용합니다.
     * @returns {mat4}
     */
    get projectionMatrix(): mat4 {
        const {redGPUContext} = this
        const {antialiasingManager} = redGPUContext
        this.#projectionMatrix = mat4.clone(this.noneJitterProjectionMatrix)
        // TAA 지터 오프셋 적용 (PerspectiveCamera에만 적용)
        const needJitter = this.constructor.name === 'View3D' && !(this.camera instanceof IsometricController) && antialiasingManager.useTAA

        if (needJitter) {
            if (this.rawCamera instanceof PerspectiveCamera && (this.#jitterOffsetX !== 0 || this.#jitterOffsetY !== 0)) {
                // NDC 좌표계는 -1.0 ~ 1.0 (폭 2.0)입니다.
                // 픽셀 오프셋을 NDC 비율로 변환하기 위해 2.0을 곱합니다.
                const ndcJitterX = (this.#jitterOffsetX / this.pixelRectObject.width) * 2.0;
                const ndcJitterY = (this.#jitterOffsetY / this.pixelRectObject.height) * 2.0;

                this.#projectionMatrix[8] += ndcJitterX;
                this.#projectionMatrix[9] += ndcJitterY;
            }
        }
        return this.#projectionMatrix;
    }

    /**
     * 현재 프로젝션 행렬의 역행렬을 반환합니다.
     * @returns {mat4 | null} 역행렬 (계산 실패 시 null)
     */
    get inverseProjectionMatrix(): mat4 {
        return mat4.invert(mat4.create(), this.#projectionMatrix);
    }

    /**
     * 현재 적용된 지터 오프셋 [offsetX, offsetY]를 반환합니다.
     * @returns {[number, number]}
     */
    get jitterOffset(): [number, number] {
        return [this.#jitterOffsetX, this.#jitterOffsetY];
    }

    /**
     * TAA 적용을 위한 지터 오프셋을 설정합니다.
     * @param {number} offsetX - X축 지터 오프셋 (정규화된 값)
     * @param {number} offsetY - Y축 지터 오프셋 (정규화된 값)
     */
    setJitterOffset(offsetX: number, offsetY: number) {
        this.#jitterOffsetX = offsetX;
        this.#jitterOffsetY = offsetY;
    }

    /**
     * 지터 오프셋을 초기화합니다.
     */
    clearJitterOffset() {
        this.#jitterOffsetX = 0;
        this.#jitterOffsetY = 0;
    }

    /**
     * 뷰의 위치를 설정하고 내부 픽셀 사각형을 업데이트합니다.
     * 입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.
     * @param {string | number} [x=this.#x] - X 위치 (픽셀 또는 퍼센트)
     * @param {string | number} [y=this.#y] - Y 위치 (픽셀 또는 퍼센트)
     */
    setPosition(x: string | number = this.#x, y: string | number = this.#y) {
        const {sizeManager} = this.#redGPUContext
        RedGPUContextSizeManager.validatePositionValue(x)
        RedGPUContextSizeManager.validatePositionValue(y)
        this.#x = x;
        this.#y = y;
        const pixelRectObject = sizeManager.pixelRectObject
        const tX = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'width', x)
        const tY = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'height', y)
        this.#pixelRectArray[0] = Math.floor(tX * (this.#x.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio));
        this.#pixelRectArray[1] = Math.floor(tY * (this.#y.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio));
        console.log(`${this.constructor.name}.setPosition - input : ${x},${y} | result : ${tX}, ${tY}`);
    }

    /**
     * 뷰의 크기를 설정하고 내부 픽셀 사각형을 업데이트합니다.
     * 입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.
     * onResize 콜백이 설정되어 있으면 호출합니다.
     * @param {string | number} [w=this.#width] - 너비 (픽셀 또는 퍼센트)
     * @param {string | number} [h=this.#height] - 높이 (픽셀 또는 퍼센트)
     */
    setSize(w: string | number = this.#width, h: string | number = this.#height) {
        const {sizeManager} = this.#redGPUContext
        RedGPUContextSizeManager.validateSizeValue(w)
        RedGPUContextSizeManager.validateSizeValue(h)
        this.#width = w;
        this.#height = h;
        const pixelRectObject = sizeManager.pixelRectObject
        const tW = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'width', w)
        const tH = RedGPUContextSizeManager.getPixelDimension(pixelRectObject, 'height', h)
        this.#pixelRectArray[2] = Math.floor(tW * (this.#width.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio));
        this.#pixelRectArray[3] = Math.floor(tH * (this.#height.toString().includes('%') ? 1 : sizeManager.renderScale * window.devicePixelRatio));
        // this.setPosition()
        console.log(`${this.constructor.name}.setSize - input : ${w},${h} | result : ${tW}, ${tH}`);
        if (this.onResize) {
            this.onResize({
                target: this,
                screenRect: this.screenRectObject,
                pixelRect: this.pixelRectObject
            });
        }
    }
}

Object.freeze(ViewTransform)
export default ViewTransform
