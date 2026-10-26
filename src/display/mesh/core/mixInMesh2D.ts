import GPU_BLEND_FACTOR from "../../../gpuConst/GPU_BLEND_FACTOR";
import GPU_BLEND_OPERATION from "../../../gpuConst/GPU_BLEND_OPERATION";
import BLEND_MODE from "../../../material/BLEND_MODE";

/**
 * [KO] 2D 메쉬 믹스인이 적용될 기본 클래스의 인터페이스입니다.
 * [EN] Interface for the base class to which the 2D mesh mixin is applied.
 *
 * @category Core
 */
interface Mesh2DBase {
    /**
     * [KO] Z축 회전값 (도 단위)
     * [EN] Z-axis rotation value (in degrees)
     */
    rotationZ: number;

    /**
     * [KO] X, Y 스케일을 설정합니다.
     * [EN] Sets the X and Y scale.
     *
     * @param x -
     * [KO] X축 스케일
     * [EN] X-axis scale
     * @param y -
     * [KO] Y축 스케일
     * [EN] Y-axis scale
     */
    setScale(x: number, y: number): void;

    /**
     * [KO] X, Y 위치를 설정합니다.
     * [EN] Sets the X and Y position.
     *
     * @param x -
     * [KO] X축 좌표
     * [EN] X-axis coordinate
     * @param y -
     * [KO] Y축 좌표
     * [EN] Y-axis coordinate
     */
    setPosition(x: number, y: number): void;
}

/**
 * [KO] 기본 메쉬 클래스에 2D 전용 트랜스폼(위치, 스케일, 회전) 및 블렌드 모드 기능을 결합하는 믹스인 함수입니다.
 * [EN] Mixin function that combines 2D-specific transform (position, scale, rotation) and blend mode functionality into a base mesh class.
 *
 * @param Base -
 * [KO] 확장할 기반 클래스
 * [EN] Base class to extend
 * @returns
 * [KO] 2D 메쉬 기능이 확장된 클래스
 * [EN] Class extended with 2D mesh functionality
 * @typeParam TBase -
 * [KO] `Mesh2DBase`를 만족하는 생성자 타입
 * [EN] Constructor type satisfying `Mesh2DBase`
 * @category Core
 */
function mixInMesh2D<TBase extends new (...args: any[]) => Mesh2DBase>(Base: TBase) {
    const resultClass = class extends Base {
        #rotation: number = 0
        #blendMode: number = BLEND_MODE.NORMAL;

        /**
         * [KO] 2D 객체의 블렌드 모드를 가져오거나 설정합니다.
         * [EN] Gets or sets the blend mode of the 2D object.
         *
         * @returns
         * [KO] 현재 적용된 블렌드 모드 키 문자열
         * [EN] Currently applied blend mode key string
         */
        get blendMode(): string {
            const entry = Object.entries(BLEND_MODE).find(([, value]) => value === this.#blendMode);
            if (!entry) {
                throw new Error(`Invalid blendMode value: ${this.#blendMode}`);
            }
            return entry[0];
        }

        set blendMode(value: BLEND_MODE | keyof typeof BLEND_MODE) {
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
            this.#blendMode = valueIdx;
            this.#setBlendFactor(valueIdx)
        }

        /**
         * [KO] 2D 회전 각도(도 단위, `rotationZ`와 연동)를 가져오거나 설정합니다.
         * [EN] Gets or sets the 2D rotation angle (in degrees, linked with `rotationZ`).
         *
         * @returns
         * [KO] 회전 각도 (도 단위)
         * [EN] Rotation angle (in degrees)
         */
        // @ts-ignore
        get rotation(): number {
            return this.#rotation;
        }

        set rotation(value: number) {
            this.#rotation = value;
            super.rotationZ = value;
        }

        /**
         * [KO] 2D 객체의 X, Y 스케일을 설정합니다. `y`를 생략하면 `x`와 동일한 값으로 설정됩니다.
         * [EN] Sets the X and Y scale of the 2D object. If `y` is omitted, it is set to the same value as `x`.
         *
         * @param x -
         * [KO] X축 스케일
         * [EN] X-axis scale
         * @param y -
         * [KO] Y축 스케일 (생략 시 `x` 값 적용)
         * [EN] Y-axis scale (defaults to `x` if omitted)
         */
        setScale(x: number, y?: number) {
            y = y ?? x;
            // @ts-ignore
            super.setScale(x, y, 1)
        }

        /**
         * [KO] 2D 객체의 X, Y 위치를 설정합니다. `y`를 생략하면 `x`와 동일한 값으로 설정됩니다.
         * [EN] Sets the X and Y position of the 2D object. If `y` is omitted, it is set to the same value as `x`.
         *
         * @param x -
         * [KO] X축 좌표
         * [EN] X-axis coordinate
         * @param y -
         * [KO] Y축 좌표 (생략 시 `x` 값 적용)
         * [EN] Y-axis coordinate (defaults to `x` if omitted)
         */
        setPosition(x: number, y?: number) {
            y = y ?? x;
            // @ts-ignore
            super.setPosition(x, y, 0)
        }

        /**
         * [KO] 2D 객체의 회전 각도(도 단위)를 설정합니다.
         * [EN] Sets the rotation angle (in degrees) of the 2D object.
         *
         * @param value -
         * [KO] 회전 각도 (도 단위)
         * [EN] Rotation angle (in degrees)
         */
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
    };
    Object.defineProperty(resultClass.prototype, 'is2DMeshType', {
        value: true,
        writable: false
    });
    return resultClass
}

export {
    mixInMesh2D
}
