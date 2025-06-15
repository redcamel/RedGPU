import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import BLEND_MODE from "../../../material/BLEND_MODE";

interface Mesh2DBase {
	rotationZ: number;

	setScale(x: number, y: number): void;

	setPosition(x: number, y: number): void;
}

export function mixInMesh2D<TBase extends new (...args: any[]) => Mesh2DBase>(Base: TBase) {
	const resultClass = class extends Base {
		#rotation: number = 0
		#blendMode: number = BLEND_MODE.NORMAL;
		get blendMode(): string {
			const entry = Object.entries(BLEND_MODE).find(([, value]) => value === this.#blendMode);
			if (!entry) {
				throw new Error(`Invalid blendMode value: ${this.#blendMode}`);
			}
			return entry[0]; // Return the key (e.g., "MULTIPLY")
		}

		set blendMode(value: BLEND_MODE | keyof typeof BLEND_MODE) {
			// @ts-ignore
			// const {gpuRenderInfo} = this;
			// const { vertexUniformInfo, vertexUniformBuffer } = gpuRenderInfo;
			let valueIdx: number;
			if (typeof value === "string") {
				if (!(value in BLEND_MODE)) {
					throw new Error(`Invalid blendMode key: ${value}`);
				}
				valueIdx = BLEND_MODE[value];
			} else if (typeof value === "number" && Object.values(BLEND_MODE).includes(value)) {
				valueIdx = value;
			} else {
				throw new Error(`Invalid blendMode: ${value}`);
			}
			// vertexUniformBuffer.writeBuffer(vertexUniformInfo.members.blendMode, valueIdx);
			this.#blendMode = valueIdx;
			this.#setBlendFactor(valueIdx)
		}

		// @ts-ignore
		get rotation(): number {
			return this.#rotation;
		}

		set rotation(value: number) {
			this.#rotation = value;
			super.rotationZ = value;
		}

		setScale(x: number, y?: number) {
			y = y ?? x;
			// @ts-ignore
			super.setScale(x, y, 1)
		}

		setPosition(x: number, y?: number) {
			y = y ?? x;
			// @ts-ignore
			super.setPosition(x, y, 0)
		}

		setRotation(value: number) {
			this.rotation = value;
		}

		#setBlendFactor(mode: number) {
			// @ts-ignore
			const {blendColorState, blendAlphaState} = this._material
			switch (mode) {
				case BLEND_MODE.NORMAL: {
					blendColorState.operation = GPU_BLEND_OPERATION.ADD;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					break;
				}
				case BLEND_MODE.MULTIPLY: {
					blendColorState.operation = GPU_BLEND_OPERATION.ADD;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					break;
				}
				case BLEND_MODE.LIGHTEN: {
					blendColorState.operation = GPU_BLEND_OPERATION.MAX;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE;
					blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					break;
				}
				case BLEND_MODE.SCREEN: {
					blendColorState.operation = GPU_BLEND_OPERATION.ADD;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC;
					blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					break;
				}
				case BLEND_MODE.LINEAR_DODGE: {
					blendColorState.operation = GPU_BLEND_OPERATION.ADD;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE;
					blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE;
					break;
				}
				case BLEND_MODE.SUBTRACT: {
					blendColorState.operation = GPU_BLEND_OPERATION.REVERSE_SUBTRACT;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					blendAlphaState.operation = GPU_BLEND_OPERATION.REVERSE_SUBTRACT;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE;
					break;
				}
				case BLEND_MODE.DIFFERENCE: {
					blendColorState.operation = GPU_BLEND_OPERATION.SUBTRACT;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE;
					blendAlphaState.operation = GPU_BLEND_OPERATION.SUBTRACT;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE;
					break;
				}
				case BLEND_MODE.EXCLUSION: {
					blendColorState.operation = GPU_BLEND_OPERATION.ADD;
					blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
					blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
					blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
					blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
					blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE;
					break;
				}
				default: {
					console.warn(`Unsupported blend mode: ${mode}`);
					break;
				}
			}
		}

		// TODO - 2패스 렌더링 먹고 나서 처리하자
		// setBlendFactorsFromCompositeModePreset(mode: COMPOSITE_MODE) {
		// 	const {blendColorState,blendAlphaState} = this._material
		// 	switch (mode) {
		// 		case COMPOSITE_MODE.ADDITIVE: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE;
		// 			break;
		// 		}
		// 		case COMPOSITE_MODE.SOURCE_OVER: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		// 			break;
		// 		}
		//
		// 		case COMPOSITE_MODE.SOURCE_IN: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.DST_ALPHA;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.DST_ALPHA;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO;
		// 			break;
		// 		}
		// 		case COMPOSITE_MODE.SOURCE_OUT: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ZERO;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ZERO;
		// 			break;
		// 		}
		// 		case COMPOSITE_MODE.SOURCE_ATOP: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.DST_ALPHA;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.DST_ALPHA;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		// 			break;
		// 		}
		// 		case COMPOSITE_MODE.DESTINATION_OVER: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE;
		// 			break;
		// 		}
		// 		case COMPOSITE_MODE.DESTINATION_IN: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ZERO;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ZERO;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
		// 			break;
		// 		}
		// 		case COMPOSITE_MODE.DESTINATION_OUT: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ZERO;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ZERO;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.ONE_MINUS_SRC_ALPHA;
		// 			break;
		// 		}
		//
		// 		case COMPOSITE_MODE.DESTINATION_ATOP: {
		// 			blendColorState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendColorState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
		// 			blendColorState.dstFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
		// 			blendAlphaState.operation = GPU_BLEND_OPERATION.ADD;
		// 			blendAlphaState.srcFactor = GPU_BLEND_FACTOR.ONE_MINUS_DST_ALPHA;
		// 			blendAlphaState.dstFactor = GPU_BLEND_FACTOR.SRC_ALPHA;
		// 			break;
		// 		}
		// 		default: {
		// 			console.warn(`Unsupported composite mode: ${mode}`);
		// 			break;
		// 		}
		// 	}
		// }
	};
	Object.defineProperty(resultClass.prototype, 'is2DMeshType', {
		value: true,
		writable: false
	});
	return resultClass
}

