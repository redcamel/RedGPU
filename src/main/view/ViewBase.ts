import RedGPUContext from "../../context/RedGPUContext";
import RedGPUContextBase from "../../context/RedGPUContextBase";
import throwError from "../../util/errorFunc/throwError";
import {mat4} from "../../util/gl-matrix";
import ViewDebugger from "./ViewDebugger";

class ViewBase extends RedGPUContextBase {
	#dirtyViewRect: boolean = true
	#x: number | string = 0;
	#y: number | string = 0;
	#width: number | string = '100%';
	#height: number | string = '100%';
	#pixelViewRect = [0, 0, 0, 0]
	#projectionMatrix = mat4.create()
	#viewDebugger: ViewDebugger = new ViewDebugger()

	/**
	 *
	 * @param redGPUContext
	 */
	constructor(redGPUContext: RedGPUContext) {
		super(redGPUContext)
	}

	get x(): number | string {
		return this.#x;
	}

	set x(value: number | string) {
		switch (typeof value) {
			case 'number' :
				this.#x = value;
				break
			case 'string' :
				if (value.includes('%')) {
					this.#x = value;
					break
				}
			default :
				throwError('x : ', '숫자나 %모델만 허용됩니다.')
		}
		this.calcPixelViewRect()
	}

	get y(): number | string {
		return this.#y;
	}

	set y(value: number | string) {
		switch (typeof value) {
			case 'number' :
				this.#y = value;
				break
			case 'string' :
				if (value.includes('%')) {
					this.#y = value;
					break
				}
			default :
				throwError('y : ', '숫자 or %모델 만 허용됩니다.')
		}
		this.calcPixelViewRect()
	}

	get width(): number | string {
		return this.#width;
	}

	set width(value: number | string) {
		const msg = 'width : 음수가 아닌 숫자 or %모델 만 허용됩니다.'
		switch (typeof value) {
			case 'number' :
				if (value >= 0) {
					this.#width = value;
					break
				}
				throwError(msg)
				break
			case 'string' :
				if (value.includes('%')) {
					if (+value.replace('%', '') >= 0) {
						this.#width = value;
						break
					}
				}
			default :
				throwError(msg)
		}
		this.calcPixelViewRect()
	}

	get height(): number | string {
		return this.#height;
	}

	set height(value: number | string) {
		const msg = 'width : 음수가 아닌 숫자 or %모델 만 허용됩니다.'
		switch (typeof value) {
			case 'number' :
				if (value >= 0) {
					this.#height = value;
					break
				}
				throwError(msg)
				break
			case 'string' :
				if (value.includes('%')) {
					if (+value.replace('%', '') >= 0) {
						this.#height = value;
						break
					}
				}
			default :
				throwError(msg)
		}
		this.calcPixelViewRect()
	}

	get pixelViewRect(): number[] {
		return this.#pixelViewRect;
	}

	get pixelViewRectInt(): number[] {
		return [
			Math.floor(this.#pixelViewRect[0]),
			Math.floor(this.#pixelViewRect[1]),
			Math.floor(this.#pixelViewRect[2]),
			Math.floor(this.#pixelViewRect[3])
		];
	}

	get projectionMatrix(): any {
		return this.#projectionMatrix;
	}

	get inverseProjectionMatrix(): any {
		return mat4.invert(mat4.create(), this.#projectionMatrix);
	}

	get viewDebugger(): ViewDebugger {
		return this.#viewDebugger;
	}

	calcPixelViewRect() {
		const parentPixelSize = this.redGPUContext.pixelSizeInt
		const {renderScale} = this.redGPUContext
		this.#pixelViewRect = [
			((typeof this.#x === 'number' ? renderScale * this.#x : parentPixelSize.width * parseFloat(this.#x) / 100)),
			((typeof this.#y === 'number' ? renderScale * this.#y : parentPixelSize.height * parseFloat(this.#y) / 100)),
			((typeof this.#width === 'number' ? renderScale * this.#width : parentPixelSize.width * parseFloat(this.#width) / 100)),
			((typeof this.#height === 'number' ? renderScale * this.#height : parentPixelSize.height * parseFloat(this.#height) / 100)),
		]
		this.#dirtyViewRect = true
	}

	setSize(w = this.#width, h = this.#height) {
		this.width = w
		this.height = h
	}

	setLocation(x = this.#x, y = this.#y) {
		this.x = x
		this.y = y
	}
}

export default ViewBase
