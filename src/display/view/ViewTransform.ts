import {mat4} from "gl-matrix";
import Camera2D from "../../camera/camera/Camera2D";
import OrthographicCamera from "../../camera/camera/OrthographicCamera";
import PerspectiveCamera from "../../camera/camera/PerspectiveCamera";
import AController from "../../camera/core/AController";
import RedGPUContextSizeManager from "../../context/core/RedGPUContextSizeManager";
import RedGPUContext from "../../context/RedGPUContext";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import computeViewFrustumPlanes from "../../utils/math/computeViewFrustumPlanes";

class ViewTransform {
	onResize: ((width: number, height: number) => void) | null = null;
	readonly #redGPUContext: RedGPUContext
	#projectionMatrix = mat4.create()
	#noneJitterProjectionMatrix = mat4.create()
	#camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D
	#x: number | string = 0
	#y: number | string = 0
	//TODO rotationX,rotationY,rotationZ를 가질수 있도록 할수 있는가?
	#width: number | string
	#height: number | string
	#pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]
	// TAA 지터 관련 속성 추가
	#jitterOffsetX: number = 0;
	#jitterOffsetY: number = 0;

	constructor(redGPUContext: RedGPUContext) {
		validateRedGPUContext(redGPUContext)
		this.#redGPUContext = redGPUContext
	}

	get redGPUContext(): RedGPUContext {
		return this.#redGPUContext;
	}

	get camera(): PerspectiveCamera | OrthographicCamera | AController | Camera2D {
		return this.#camera;
	}

	set camera(value: PerspectiveCamera | OrthographicCamera | AController | Camera2D) {
		if (!(value instanceof PerspectiveCamera || value instanceof Camera2D) && !(value instanceof Camera2D) && !(value instanceof OrthographicCamera) && !(value instanceof AController)) consoleAndThrowError('allow PerspectiveCamera or OrthographicCamera or AController instance')
		this.#camera = value;
	}

	get x(): number | string {
		return this.#x;
	}

	set x(value: number | string) {
		this.setPosition(value, this.y)
	}

	get y(): number | string {
		return this.#y;
	}

	set y(value: number | string) {
		this.setPosition(this.x, value)
	}

	get width(): number | string {
		return this.#width;
	}

	set width(value: number | string) {
		this.setSize(value, this.#height)
	}

	get height(): number | string {
		return this.#height;
	}

	set height(value: number | string) {
		this.setSize(this.#width, value)
	}

	get pixelRectArray() {
		return this.#pixelRectArray;
	}

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
	get screenRectObject() {
		return {
			x: this.#pixelRectArray[0] / devicePixelRatio,
			y: this.#pixelRectArray[1] / devicePixelRatio,
			width: this.#pixelRectArray[2] / devicePixelRatio,
			height: this.#pixelRectArray[3] / devicePixelRatio
		};
	}

	get aspect(): number {
		return this.#pixelRectArray[2] / this.#pixelRectArray[3]
	}

	get frustumPlanes() {
		if (this.#camera instanceof AController) {
			return computeViewFrustumPlanes(this.projectionMatrix, this.#camera.camera.modelMatrix)
		} else {
			return computeViewFrustumPlanes(this.projectionMatrix, this.#camera.modelMatrix)
		}
	}

	get rawCamera(): PerspectiveCamera | Camera2D {
		return this.#camera instanceof AController ? this.#camera.camera : this.#camera
	}

	/**
	 * 현재 지터 오프셋 반환
	 */
	get jitterOffset(): [number, number] {
		return [this.#jitterOffsetX, this.#jitterOffsetY];
	}

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

	get projectionMatrix(): mat4 {
		const {redGPUContext} = this
		const {antialiasingManager} = redGPUContext
		this.#projectionMatrix = mat4.clone(this.noneJitterProjectionMatrix)
		// TAA 지터 오프셋 적용 (PerspectiveCamera에만 적용)
		if (antialiasingManager.useTAA) {
			if (this.rawCamera instanceof PerspectiveCamera && (this.#jitterOffsetX !== 0 || this.#jitterOffsetY !== 0)) {
				// devicePixelRatio를 고려한 정확한 픽셀 크기 계산
				const logicalWidth = this.#pixelRectArray[2];
				const logicalHeight = this.#pixelRectArray[3];
				const pixelWidth = 2.0 / logicalWidth;
				const pixelHeight = 2.0 / logicalHeight;
				this.#projectionMatrix[8] += this.#jitterOffsetX * pixelWidth;  // X 오프셋
				this.#projectionMatrix[9] += this.#jitterOffsetY * pixelHeight; // Y 오프셋
			}
		}
		return this.#projectionMatrix;
	}

	get inverseProjectionMatrix(): mat4 {
		return mat4.invert(mat4.create(), this.#projectionMatrix);
	}

	/**
	 * TAA를 위한 지터 오프셋 설정
	 * @param offsetX X축 지터 오프셋 (정규화된 값, 예: -0.5 ~ 0.5)
	 * @param offsetY Y축 지터 오프셋 (정규화된 값, 예: -0.5 ~ 0.5)
	 */
	setJitterOffset(offsetX: number, offsetY: number) {
		this.#jitterOffsetX = offsetX;
		this.#jitterOffsetY = offsetY;
	}

	/**
	 * 지터 오프셋 초기화
	 */
	clearJitterOffset() {
		this.#jitterOffsetX = 0;
		this.#jitterOffsetY = 0;
	}

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
			this.onResize(this.screenRectObject.width, this.screenRectObject.height);
		}
	}
}

export default ViewTransform
