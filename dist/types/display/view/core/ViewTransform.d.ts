import { mat4 } from "gl-matrix";
import Camera2D from "../../../camera/camera/Camera2D";
import OrthographicCamera from "../../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../../camera/camera/PerspectiveCamera";
import AController from "../../../camera/core/AController";
import RedGPUContext from "../../../context/RedGPUContext";
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
declare class ViewTransform {
    #private;
    /**
     * 뷰 크기 변경 시 호출되는 콜백입니다.
     * @type {((width: number, height: number) => void) | null}
     */
    onResize: ((width: number, height: number) => void) | null;
    /**
     * ViewTransform 생성자.
     * @param {RedGPUContext} redGPUContext - 유효한 RedGPUContext 인스턴스
     */
    constructor(redGPUContext: RedGPUContext);
    /**
     * 연결된 RedGPUContext 반환 (읽기 전용).
     * @returns {RedGPUContext}
     */
    get redGPUContext(): RedGPUContext;
    /**
     * 현재 연결된 카메라를 반환합니다.
     * @returns {PerspectiveCamera | OrthographicCamera | AController | Camera2D}
     */
    get camera(): PerspectiveCamera | OrthographicCamera | AController | Camera2D;
    /**
     * 카메라를 설정합니다. 허용되는 타입은 PerspectiveCamera, OrthographicCamera, AController, Camera2D 입니다.
     * 잘못된 타입이 들어오면 오류를 발생시킵니다.
     * @param {PerspectiveCamera | OrthographicCamera | AController | Camera2D} value
     */
    set camera(value: PerspectiveCamera | OrthographicCamera | AController | Camera2D);
    /**
     * 뷰의 X 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get x(): number | string;
    /**
     * 뷰의 X 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.
     * @param {number | string} value
     */
    set x(value: number | string);
    /**
     * 뷰의 Y 위치 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get y(): number | string;
    /**
     * 뷰의 Y 위치를 설정합니다. 내부적으로 setPosition을 호출합니다.
     * @param {number | string} value
     */
    set y(value: number | string);
    /**
     * 뷰의 너비 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get width(): number | string;
    /**
     * 뷰의 너비를 설정합니다. 내부적으로 setSize를 호출합니다.
     * @param {number | string} value
     */
    set width(value: number | string);
    /**
     * 뷰의 높이 값을 반환합니다 (픽셀 또는 퍼센트 문자열).
     * @returns {number | string}
     */
    get height(): number | string;
    /**
     * 뷰의 높이를 설정합니다. 내부적으로 setSize를 호출합니다.
     * @param {number | string} value
     */
    set height(value: number | string);
    /**
     * 픽셀 단위 사각형 배열을 반환합니다. [x, y, width, height]
     * @returns {[number, number, number, number]}
     */
    get pixelRectArray(): [number, number, number, number];
    /**
     * 픽셀 단위 사각형을 객체 형태로 반환합니다.
     * @returns {{x:number,y:number,width:number,height:number}}
     */
    get pixelRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * 스크린 기준 사각형을 반환합니다 (devicePixelRatio로 나눔).
     * @returns {{x:number,y:number,width:number,height:number}}
     */
    get screenRectObject(): {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * 현재 뷰의 종횡비(가로/세로)를 반환합니다.
     * @returns {number}
     */
    get aspect(): number;
    /**
     * 현재 프로젝션 및 카메라 모델 행렬을 기반으로 뷰 프러스텀 평면을 계산하여 반환합니다.
     * AController 인스턴스 사용 시 내부 카메라의 modelMatrix를 사용합니다.
     * @returns {Float32Array[]} 프러스텀 평면 배열
     */
    get frustumPlanes(): number[][];
    /**
     * 내부에 연결된 실제 카메라 인스턴스(PerspectiveCamera 또는 Camera2D)를 반환합니다.
     * AController가 연결된 경우 내부 camera를 반환합니다.
     * @returns {PerspectiveCamera | Camera2D}
     */
    get rawCamera(): PerspectiveCamera | Camera2D | OrthographicCamera;
    /**
     * 지터가 적용되지 않은 원본 프로젝션 행렬을 계산하여 반환합니다.
     * Orthographic, Camera2D, Perspective 각각의 방식으로 행렬을 구성합니다.
     * @returns {mat4}
     */
    get noneJitterProjectionMatrix(): mat4;
    /**
     * 현재 프로젝션 행렬(지터 적용 여부를 반영)을 반환합니다.
     * TAA 사용 시 PerspectiveCamera에 한해 지터 오프셋을 적용합니다.
     * @returns {mat4}
     */
    get projectionMatrix(): mat4;
    /**
     * 현재 프로젝션 행렬의 역행렬을 반환합니다.
     * @returns {mat4 | null} 역행렬 (계산 실패 시 null)
     */
    get inverseProjectionMatrix(): mat4;
    /**
     * 현재 적용된 지터 오프셋 [offsetX, offsetY]를 반환합니다.
     * @returns {[number, number]}
     */
    get jitterOffset(): [number, number];
    /**
     * TAA 적용을 위한 지터 오프셋을 설정합니다.
     * @param {number} offsetX - X축 지터 오프셋 (정규화된 값)
     * @param {number} offsetY - Y축 지터 오프셋 (정규화된 값)
     */
    setJitterOffset(offsetX: number, offsetY: number): void;
    /**
     * 지터 오프셋을 초기화합니다.
     */
    clearJitterOffset(): void;
    /**
     * 뷰의 위치를 설정하고 내부 픽셀 사각형을 업데이트합니다.
     * 입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.
     * @param {string | number} [x=this.#x] - X 위치 (픽셀 또는 퍼센트)
     * @param {string | number} [y=this.#y] - Y 위치 (픽셀 또는 퍼센트)
     */
    setPosition(x?: string | number, y?: string | number): void;
    /**
     * 뷰의 크기를 설정하고 내부 픽셀 사각형을 업데이트합니다.
     * 입력 값은 픽셀 또는 퍼센트 문자열을 허용합니다.
     * onResize 콜백이 설정되어 있으면 호출합니다.
     * @param {string | number} [w=this.#width] - 너비 (픽셀 또는 퍼센트)
     * @param {string | number} [h=this.#height] - 높이 (픽셀 또는 퍼센트)
     */
    setSize(w?: string | number, h?: string | number): void;
}
export default ViewTransform;
