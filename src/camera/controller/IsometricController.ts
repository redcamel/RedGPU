import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import OrthographicCamera from "../camera/OrthographicCamera";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;

/**
 * [KO] 직교 투영(OrthographicCamera)을 사용하여 고정된 각도의 등각 투영(쿼터뷰) 시점을 제공하는 카메라 컨트롤러 클래스입니다.
 * [EN] Camera controller class that provides a fixed-angle isometric (quarter-view) perspective using orthographic projection (`OrthographicCamera`).
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
 * controller.viewHeight = 15;
 * controller.zoom = 1;
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>
 * @see [IsometricController example](/RedGPU/examples/3d/controller/isometricController/)
 * @category Controller
 */
class IsometricController extends AController {
    #cameraAngle: number = 45;
    #currentZoom: number = 1;
    #targetZoom: number = 1;
    #zoomInterpolation: number = 0.1;
    #speedZoom: number = 0.1;
    #minZoom: number = 0.5;
    #maxZoom: number = 3;
    #currentViewHeight: number = 15;
    #targetViewHeight: number = 15;
    #viewHeightInterpolation: number = 0.1;
    #currentX: number = 0;
    #currentZ: number = 0;
    #targetX: number = 0;
    #targetZ: number = 0;
    #moveSpeed: number = 50;
    #moveSpeedInterpolation: number = 0.1;
    #keyNameMapper = {
        moveUp: 'w',
        moveDown: 's',
        moveLeft: 'a',
        moveRight: 'd'
    };
    #mouseMoveSpeed: number = 1;
    #mouseMoveSpeedInterpolation: number = 0.1;

    /**
     * [KO] IsometricController 인스턴스를 생성합니다.
     * [EN] Creates an IsometricController instance.
     *
     * ### Example
     * ```typescript
     * const controller = new RedGPU.Camera.IsometricController(redGPUContext);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     */
    constructor(redGPUContext: RedGPUContext) {
        super(redGPUContext, {
            camera: new OrthographicCamera(),
            HD_Wheel: (e: WheelEvent) => {
                this.#targetZoom -= (e.deltaY / 100) * this.#speedZoom;
                this.#targetZoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, this.#targetZoom));
            },
            HD_Move: (deltaX: number, deltaY: number) => {
                const angleRad = this.#cameraAngle * PER_PI;
                const cos = Math.cos(angleRad);
                const sin = Math.sin(angleRad);

                const effectiveHeight = this.#currentViewHeight / this.#currentZoom;
                const worldPerPixel = effectiveHeight / redGPUContext.boundingClientRect.height;

                const mouseDeltaX = deltaX * worldPerPixel;
                const mouseDeltaY = deltaY * worldPerPixel;

                const worldDeltaX = -(mouseDeltaX * cos) - (mouseDeltaY * sin);
                const worldDeltaZ = -(mouseDeltaX * (-sin)) - (mouseDeltaY * cos);

                this.#targetX += worldDeltaX;
                this.#targetZ += worldDeltaZ;
            },
            HD_TouchPinch: (deltaScale: number) => {
                this.#targetZoom /= deltaScale;
                this.#targetZoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, this.#targetZoom));
            },
            useKeyboard: true
        });
    }

    /**
     * [KO] 목표 줌 배율을 가져오거나 설정합니다. (`minZoom` ~ `maxZoom`)
     * [EN] Gets or sets the target zoom scale. (`minZoom` ~ `maxZoom`)
     *
     * @returns
     * [KO] 목표 줌 배율 (기본값: `1`)
     * [EN] Target zoom scale (default: `1`)
     */
    get zoom(): number {
        return this.#targetZoom;
    }

    set zoom(value: number) {
        validateNumberRange(value);
        this.#targetZoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, value));
    }

    /**
     * [KO] 줌 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for zoom changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 줌 보간 계수 (기본값: `0.1`)
     * [EN] Zoom interpolation factor (default: `0.1`)
     */
    get zoomInterpolation(): number {
        return this.#zoomInterpolation;
    }

    set zoomInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#zoomInterpolation = value;
    }

    /**
     * [KO] 마우스 휠 줌 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the mouse wheel zoom speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 줌 속도 (기본값: `0.1`)
     * [EN] Zoom speed (default: `0.1`)
     */
    get speedZoom(): number {
        return this.#speedZoom;
    }

    set speedZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedZoom = value;
    }

    /**
     * [KO] 최소 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the minimum zoom scale. (`0.01` or greater)
     *
     * @returns
     * [KO] 최소 줌 배율 (기본값: `0.5`)
     * [EN] Minimum zoom scale (default: `0.5`)
     */
    get minZoom(): number {
        return this.#minZoom;
    }

    set minZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#minZoom = value;
        this.zoom = this.#targetZoom;
    }

    /**
     * [KO] 최대 줌 배율을 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the maximum zoom scale. (`0.01` or greater)
     *
     * @returns
     * [KO] 최대 줌 배율 (기본값: `3`)
     * [EN] Maximum zoom scale (default: `3`)
     */
    get maxZoom(): number {
        return this.#maxZoom;
    }

    set maxZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#maxZoom = value;
        this.zoom = this.#targetZoom;
    }

    /**
     * [KO] 직교 투영 뷰의 기준 높이를 가져오거나 설정합니다. (`0.1` 이상)
     * [EN] Gets or sets the base height of the orthographic projection view. (`0.1` or greater)
     *
     * @returns
     * [KO] 뷰 높이 (기본값: `15`)
     * [EN] View height (default: `15`)
     */
    get viewHeight(): number {
        return this.#targetViewHeight;
    }

    set viewHeight(value: number) {
        validateNumberRange(value, 0.1);
        this.#targetViewHeight = value;
    }

    /**
     * [KO] 뷰 높이 변화의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for view height changes. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 뷰 높이 보간 계수 (기본값: `0.1`)
     * [EN] View height interpolation factor (default: `0.1`)
     */
    get viewHeightInterpolation(): number {
        return this.#viewHeightInterpolation;
    }

    set viewHeightInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#viewHeightInterpolation = value;
    }

    /**
     * [KO] 키보드 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the keyboard movement speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 이동 속도 (기본값: `50`)
     * [EN] Movement speed (default: `50`)
     */
    get moveSpeed(): number {
        return this.#moveSpeed;
    }

    set moveSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#moveSpeed = value;
    }

    /**
     * [KO] 위치 이동의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for position movement. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 이동 보간 계수 (기본값: `0.1`)
     * [EN] Movement interpolation factor (default: `0.1`)
     */
    get moveSpeedInterpolation(): number {
        return this.#moveSpeedInterpolation;
    }

    set moveSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#moveSpeedInterpolation = value;
    }

    /**
     * [KO] 마우스 이동 속도를 가져오거나 설정합니다. (`0.01` 이상)
     * [EN] Gets or sets the mouse movement speed. (`0.01` or greater)
     *
     * @returns
     * [KO] 마우스 이동 속도 (기본값: `1`)
     * [EN] Mouse movement speed (default: `1`)
     */
    get mouseMoveSpeed(): number {
        return this.#mouseMoveSpeed;
    }

    set mouseMoveSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#mouseMoveSpeed = value;
    }

    /**
     * [KO] 마우스 이동의 감쇄 보간 계수를 가져오거나 설정합니다. (`0.0001` ~ `1`)
     * [EN] Gets or sets the damping interpolation factor for mouse movement. (`0.0001` ~ `1`)
     *
     * @returns
     * [KO] 마우스 이동 보간 계수 (기본값: `0.1`)
     * [EN] Mouse movement interpolation factor (default: `0.1`)
     */
    get mouseMoveSpeedInterpolation(): number {
        return this.#mouseMoveSpeedInterpolation;
    }

    set mouseMoveSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#mouseMoveSpeedInterpolation = value;
    }

    /**
     * [KO] 현재 설정된 키보드 키 매핑 객체의 복사본을 반환합니다.
     * [EN] Returns a copy of the currently configured keyboard key mapping object.
     *
     * @returns
     * [KO] 키 매핑 설정 객체
     * [EN] Key mapping configuration object
     */
    get keyNameMapper() {
        return {...this.#keyNameMapper};
    }

    /**
     * [KO] 카메라가 바라보는 기준점의 현재 X축 좌표를 반환합니다.
     * [EN] Returns the current X-axis coordinate of the target point the camera looks at.
     *
     * @returns
     * [KO] 타겟 X축 좌표
     * [EN] Target X-axis coordinate
     */
    get targetX(): number {
        return this.#currentX;
    }

    /**
     * [KO] 카메라가 바라보는 기준점의 현재 Y축 좌표를 반환합니다. (항상 `0`)
     * [EN] Returns the current Y-axis coordinate of the target point the camera looks at. (Always `0`)
     *
     * @returns
     * [KO] 타겟 Y축 좌표 (`0`)
     * [EN] Target Y-axis coordinate (`0`)
     */
    get targetY(): number {
        return 0;
    }

    /**
     * [KO] 카메라가 바라보는 기준점의 현재 Z축 좌표를 반환합니다.
     * [EN] Returns the current Z-axis coordinate of the target point the camera looks at.
     *
     * @returns
     * [KO] 타겟 Z축 좌표
     * [EN] Target Z-axis coordinate
     */
    get targetZ(): number {
        return this.#currentZ;
    }

    /**
     * [KO] 상향 이동 키를 설정합니다.
     * [EN] Sets the move up key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'w'`)
     * [EN] Key name to assign (e.g., `'w'`)
     */
    setMoveUpKey(value: string) {
        this.#keyNameMapper.moveUp = value;
    }

    /**
     * [KO] 하향 이동 키를 설정합니다.
     * [EN] Sets the move down key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'s'`)
     * [EN] Key name to assign (e.g., `'s'`)
     */
    setMoveDownKey(value: string) {
        this.#keyNameMapper.moveDown = value;
    }

    /**
     * [KO] 좌측 이동 키를 설정합니다.
     * [EN] Sets the move left key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'a'`)
     * [EN] Key name to assign (e.g., `'a'`)
     */
    setMoveLeftKey(value: string) {
        this.#keyNameMapper.moveLeft = value;
    }

    /**
     * [KO] 우측 이동 키를 설정합니다.
     * [EN] Sets the move right key.
     *
     * @param value -
     * [KO] 할당할 키 이름 (예: `'d'`)
     * [EN] Key name to assign (e.g., `'d'`)
     */
    setMoveRightKey(value: string) {
        this.#keyNameMapper.moveRight = value;
    }

    /**
     * [KO] 매 프레임 등각 투영 카메라의 상태를 갱신합니다.
     * [EN] Updates the isometric camera state every frame.
     *
     * @param view -
     * [KO] 컨트롤러가 연결된 `View3D` 인스턴스
     * [EN] `View3D` instance connected to the controller
     * @param time -
     * [KO] 현재 경과 시간 (ms)
     * [EN] Current elapsed time (ms)
     */
    update(view: View3D, time: number): void {
        super.update(view, time, this.#updateAnimation);
    }

    #updateAnimation = (view: View3D, deltaTime: number): void => {
        this.#handleKeyboardInput(view, deltaTime);

        this.#currentZoom = this.#targetZoom + (this.#currentZoom - this.#targetZoom) * Math.pow(this.#zoomInterpolation, deltaTime);
        this.#currentViewHeight = this.#targetViewHeight + (this.#currentViewHeight - this.#targetViewHeight) * Math.pow(this.#viewHeightInterpolation, deltaTime);

        const posSmoothing = Math.pow(this.#moveSpeedInterpolation, deltaTime);
        this.#currentX = this.#targetX + (this.#currentX - this.#targetX) * posSmoothing;
        this.#currentZ = this.#targetZ + (this.#currentZ - this.#targetZ) * posSmoothing;

        const angleRad = this.#cameraAngle * PER_PI;

        const {width, height} = view.pixelRectObject;
        const aspectRatio = width / height;
        const effectiveHeight = this.#currentViewHeight / this.#currentZoom;
        const effectiveWidth = effectiveHeight * aspectRatio;

        const scaleFactor = this.#currentViewHeight / 15;
        const baseDistance = 15;
        const baseHeight = 12;

        const cameraDistance = (baseDistance * scaleFactor) / this.#currentZoom;
        const cameraHeight = (baseHeight * scaleFactor) / this.#currentZoom;

        const cameraX = this.#currentX + Math.cos(angleRad) * cameraDistance;
        const cameraY = cameraHeight;
        const cameraZ = this.#currentZ + Math.sin(angleRad) * cameraDistance;

        this.camera.setPosition(cameraX, cameraY, cameraZ);
        this.camera.lookAt(this.#currentX, 0, this.#currentZ);

        const orthoCamera = this.camera as OrthographicCamera;
        orthoCamera.left = -effectiveWidth / 2;
        orthoCamera.right = effectiveWidth / 2;
        orthoCamera.top = effectiveHeight / 2;
        orthoCamera.bottom = -effectiveHeight / 2;
    };

    #handleKeyboardInput(view: View3D, deltaTime: number): boolean {
        if (!this.checkKeyboardInput(view, this.#keyNameMapper)) return false;

        const {keyboardKeyBuffer} = view.redGPUContext;
        const tKeyNameMapper = this.#keyNameMapper;
        const speed = this.#moveSpeed * deltaTime;

        let inputUp = 0, inputDown = 0, inputLeft = 0, inputRight = 0;
        if (keyboardKeyBuffer[tKeyNameMapper.moveUp]) inputUp = speed;
        if (keyboardKeyBuffer[tKeyNameMapper.moveDown]) inputDown = speed;
        if (keyboardKeyBuffer[tKeyNameMapper.moveLeft]) inputLeft = speed;
        if (keyboardKeyBuffer[tKeyNameMapper.moveRight]) inputRight = speed;

        const angleRad = this.#cameraAngle * PER_PI;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);

        const worldDeltaX = (inputDown - inputUp) * cos + (inputRight - inputLeft) * cos;
        const worldDeltaZ = (inputDown - inputUp) * sin + (inputRight - inputLeft) * (-sin);

        this.#targetX += worldDeltaX;
        this.#targetZ += worldDeltaZ;
        return true;
    }
}

Object.freeze(IsometricController);
export default IsometricController;
