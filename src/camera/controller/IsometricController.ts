import RedGPUContext from "../../context/RedGPUContext";
import View3D from "../../display/view/View3D";
import validateNumberRange from "../../runtimeChecker/validateFunc/validateNumberRange";
import OrthographicCamera from "../camera/OrthographicCamera";
import AController from "../core/AController";

const PER_PI = Math.PI / 180;

/**
 * [KO] 등각 투영(Isometric) 시점을 제공하는 카메라 컨트롤러입니다.
 * [EN] Camera controller providing an isometric view.
 *
 * [KO] 거리감 없는 직교 투영을 사용하여 전략 시뮬레이션이나 타일 기반 게임에서 주로 사용되는 고정된 각도의 쿼터뷰(Quarter View)를 구현합니다.
 * [EN] Implements a fixed-angle quarter view, commonly used in strategy simulations or tile-based games, using orthographic projection without perspective distortion.
 *
 * ### Example
 * ```typescript
 * const controller = new RedGPU.IsometricController(redGPUContext);
 * controller.viewHeight = 15;
 * controller.zoom = 1;
 * ```
 * <iframe src="/RedGPU/examples/3d/controller/isometricController/" style="width:100%; height:500px;"></iframe>
 * @category Controller
 */
class IsometricController extends AController {
    // ==================== 카메라 위치 및 각도 ====================
    #cameraAngle: number = 45;
    // ==================== 줌 관련 ====================
    #currentZoom: number = 1;
    #targetZoom: number = 1;
    #zoomInterpolation: number = 0.1;
    #speedZoom: number = 0.1;
    #minZoom: number = 0.5;
    #maxZoom: number = 3;
    // ==================== 카메라 뷰 (OrthographicCamera) ====================
    #currentViewHeight: number = 15;
    #targetViewHeight: number = 15;
    #viewHeightInterpolation: number = 0.1;
    // ==================== 타겟 추적 ====================
    #currentX: number = 0;
    #currentZ: number = 0;
    #targetX: number = 0;
    #targetZ: number = 0;
    // ==================== 이동 관련 ====================
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
     * [EN] Creates an instance of IsometricController.
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
     * [KO] 줌 레벨을 가져오거나 설정합니다.
     * [EN] Gets or sets the zoom level.
     * @returns [KO] 줌 레벨 [EN] Zoom level
     */
    get zoom(): number {
        return this.#targetZoom;
    }

    set zoom(value: number) {
        validateNumberRange(value);
        this.#targetZoom = Math.max(this.#minZoom, Math.min(this.#maxZoom, value));
    }

    /** [KO] 줌 보간 계수 [EN] Zoom interpolation factor */
    get zoomInterpolation(): number {
        return this.#zoomInterpolation;
    }

    set zoomInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#zoomInterpolation = value;
    }

    /** [KO] 줌 속도 [EN] Zoom speed */
    get speedZoom(): number {
        return this.#speedZoom;
    }

    set speedZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#speedZoom = value;
    }

    /** [KO] 최소 줌 [EN] Minimum zoom */
    get minZoom(): number {
        return this.#minZoom;
    }

    set minZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#minZoom = value;
        this.zoom = this.#targetZoom;
    }

    /** [KO] 최대 줌 [EN] Maximum zoom */
    get maxZoom(): number {
        return this.#maxZoom;
    }

    set maxZoom(value: number) {
        validateNumberRange(value, 0.01);
        this.#maxZoom = value;
        this.zoom = this.#targetZoom;
    }

    /** [KO] 뷰 높이 [EN] View height */
    get viewHeight(): number {
        return this.#targetViewHeight;
    }

    set viewHeight(value: number) {
        validateNumberRange(value, 0.1);
        this.#targetViewHeight = value;
    }

    /** [KO] 뷰 높이 보간 계수 [EN] View height interpolation factor */
    get viewHeightInterpolation(): number {
        return this.#viewHeightInterpolation;
    }

    set viewHeightInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#viewHeightInterpolation = value;
    }

    /** [KO] 이동 속도 [EN] Movement speed */
    get moveSpeed(): number {
        return this.#moveSpeed;
    }

    set moveSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#moveSpeed = value;
    }

    /** [KO] 이동 보간 계수 [EN] Movement interpolation factor */
    get moveSpeedInterpolation(): number {
        return this.#moveSpeedInterpolation;
    }

    set moveSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#moveSpeedInterpolation = value;
    }

    /** [KO] 마우스 이동 속도 [EN] Mouse movement speed */
    get mouseMoveSpeed(): number {
        return this.#mouseMoveSpeed;
    }

    set mouseMoveSpeed(value: number) {
        validateNumberRange(value, 0.01);
        this.#mouseMoveSpeed = value;
    }

    /** [KO] 마우스 이동 보간 계수 [EN] Mouse movement interpolation factor */
    get mouseMoveSpeedInterpolation(): number {
        return this.#mouseMoveSpeedInterpolation;
    }

    set mouseMoveSpeedInterpolation(value: number) {
        validateNumberRange(value, 0.0001, 1);
        this.#mouseMoveSpeedInterpolation = value;
    }

    /** [KO] 키 매핑 설정 [EN] Key mapping configuration */
    get keyNameMapper() {
        return {...this.#keyNameMapper};
    }

    /** [KO] 타겟 X 위치 [EN] Target X position */
    get targetX(): number {
        return this.#currentX;
    }

    /** [KO] 타겟 Y 위치 [EN] Target Y position */
    get targetY(): number {
        return 0;
    }

    /** [KO] 타겟 Z 위치 [EN] Target Z position */
    get targetZ(): number {
        return this.#currentZ;
    }

    /** [KO] 상향 이동 키 설정 [EN] Sets the move up key */
    setMoveUpKey(value: string) {
        this.#keyNameMapper.moveUp = value;
    }

    /** [KO] 하향 이동 키 설정 [EN] Sets the move down key */
    setMoveDownKey(value: string) {
        this.#keyNameMapper.moveDown = value;
    }

    /** [KO] 좌측 이동 키 설정 [EN] Sets the move left key */
    setMoveLeftKey(value: string) {
        this.#keyNameMapper.moveLeft = value;
    }

    /** [KO] 우측 이동 키 설정 [EN] Sets the move right key */
    setMoveRightKey(value: string) {
        this.#keyNameMapper.moveRight = value;
    }

    /**
     * [KO] 매 프레임마다 카메라를 업데이트합니다.
     * [EN] Updates the camera every frame.
     * @param view - [KO] 3D 뷰 [EN] 3D view
     * @param time - [KO] 현재 시간 [EN] Current time
     */
    update(view: View3D, time: number): void {
        super.update(view, time, this.#updateAnimation);
    }

    #updateAnimation = (view: View3D, deltaTime: number): void => {
        this.#handleKeyboardInput(view, deltaTime);

        // 지수적 감쇄 보간
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
