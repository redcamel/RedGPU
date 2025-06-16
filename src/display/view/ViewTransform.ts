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
	#camera: PerspectiveCamera | OrthographicCamera | AController | Camera2D
	#x: number | string = 0
	#y: number | string = 0
	//TODO rotationX,rotationY,rotationZ를 가질수 있도록 할수 있는가?
	#width: number | string
	#height: number | string
	#pixelRectArray: [number, number, number, number] = [0, 0, 0, 0]

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

	get projectionMatrix(): mat4 {
		const {pixelRectObject, redGPUContext} = this
		if (this.rawCamera instanceof OrthographicCamera) {
			const {nearClipping, farClipping} = this.rawCamera
			mat4.orthoZO(this.#projectionMatrix, this.rawCamera.left, this.rawCamera.right, this.rawCamera.bottom, this.rawCamera.top, nearClipping, farClipping)
		} else if (this.rawCamera instanceof Camera2D) {
			mat4.ortho(
				this.#projectionMatrix,
				-0.5, // left
				0.5, // right
				-0.5, // bottom
				0.5, // top,
				-100000,
				100000
			);
			mat4.scale(
				this.#projectionMatrix,
				this.#projectionMatrix,
				[
					redGPUContext.renderScale,
					redGPUContext.renderScale,
					1
				]
			)
			mat4.translate(this.#projectionMatrix, this.#projectionMatrix, [-0.5, 0.5, 0]);
			mat4.scale(
				this.#projectionMatrix,
				this.#projectionMatrix,
				[
					1 / pixelRectObject.width * window.devicePixelRatio,
					-1 / pixelRectObject.height * window.devicePixelRatio,
					1
				]
			);
			mat4.identity(this.rawCamera.modelMatrix);
		} else {
			const {fieldOfView, nearClipping, farClipping} = this.rawCamera
			mat4.perspective(this.#projectionMatrix, (Math.PI / 180) * fieldOfView, this.aspect, nearClipping, farClipping);
		}
		return this.#projectionMatrix;
	}

	get inverseProjectionMatrix(): mat4 {
		return mat4.invert(mat4.create(), this.#projectionMatrix);
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
