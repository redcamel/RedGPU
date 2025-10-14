import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import BLEND_MODE from "../../../material/BLEND_MODE";
/**
 * @remarks
 * `시스템 전용 클래스입니다.`\
 * 이 메서드는 렌더링 엔진 내부에서 자동으로 사용되는 기능으로, 일반적인 사용자는 직접 호출하지 않는 것이 좋습니다.
 */
function mixInMesh2D(Base) {
    const resultClass = class extends Base {
        #rotation = 0;
        #blendMode = BLEND_MODE.NORMAL;
        get blendMode() {
            const entry = Object.entries(BLEND_MODE).find(([, value]) => value === this.#blendMode);
            if (!entry) {
                throw new Error(`Invalid blendMode value: ${this.#blendMode}`);
            }
            return entry[0]; // Return the key (e.g., "MULTIPLY")
        }
        set blendMode(value) {
            // @ts-ignore
            // const {gpuRenderInfo} = this;
            // const { vertexUniformInfo, vertexUniformBuffer } = gpuRenderInfo;
            let valueIdx;
            if (typeof value === "string") {
                if (!(value in BLEND_MODE)) {
                    throw new Error(`Invalid blendMode key: ${value}`);
                }
                valueIdx = BLEND_MODE[value];
            }
            else if (typeof value === "number" && Object.values(BLEND_MODE).includes(value)) {
                valueIdx = value;
            }
            else {
                throw new Error(`Invalid blendMode: ${value}`);
            }
            // vertexUniformBuffer.writeBuffer(vertexUniformInfo.members.blendMode, valueIdx);
            this.#blendMode = valueIdx;
            this.#setBlendFactor(valueIdx);
        }
        // @ts-ignore
        get rotation() {
            return this.#rotation;
        }
        set rotation(value) {
            this.#rotation = value;
            super.rotationZ = value;
        }
        setScale(x, y) {
            y = y ?? x;
            // @ts-ignore
            super.setScale(x, y, 1);
        }
        setPosition(x, y) {
            y = y ?? x;
            // @ts-ignore
            super.setPosition(x, y, 0);
        }
        setRotation(value) {
            this.rotation = value;
        }
        #setBlendFactor(mode) {
            // @ts-ignore
            const { blendColorState, blendAlphaState } = this._material;
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
    };
    Object.defineProperty(resultClass.prototype, 'is2DMeshType', {
        value: true,
        writable: false
    });
    return resultClass;
}
export { mixInMesh2D };
