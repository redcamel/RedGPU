import validatePositiveNumberRange from "../../runtimeChecker/validateFunc/validatePositiveNumberRange";
import defineProperty_SETTING from "./defineProperty_SETTING";

function createSetter(
    propertyKey: string,
    symbol: symbol,
    isFragment: boolean,
    min: number = 0,
    max?: number
) {
    return function (newValue: number) {
        // `min`/`max` 범위 확인 및 경고 출력
        if (min !== undefined && newValue < min) {
            console.warn(
                `Value for ${propertyKey} is below the minimum (${min}). Received: ${newValue}. Adjusted to ${min}.`
            );
            newValue = min; // 최소값으로 조정
        }
        if (max !== undefined && newValue > max) {
            console.warn(
                `Value for ${propertyKey} exceeds the maximum (${max}). Received: ${newValue}. Adjusted to ${max}.`
            );
            newValue = max; // 최대값으로 조정
        }
        // 양수 범위 검증
        validatePositiveNumberRange(newValue);
        // 값 설정
        this[symbol] = newValue;
        // GPU Uniform 버퍼 업데이트
        const {gpuRenderInfo} = this;
        if (isFragment) {
            const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo;
            fragmentUniformBuffer.writeOnlyBuffer(
                fragmentUniformInfo.members[propertyKey],
                this[symbol]
            );
        } else if (gpuRenderInfo) {
            const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo;
            vertexUniformBuffer.writeOnlyBuffer(
                vertexUniformInfo.members[propertyKey],
                this[symbol]
            );
        }
    };
}

function definePositiveNumberRange(
    propertyKey: string,
    initValue: number = 1,
    forFragment: boolean = true,
    min: number = 0,
    max?: number
) {
    const symbol = Symbol(propertyKey); // 고유 심볼 생성
    return {
        get: function (): number {
            if (this[symbol] === undefined) this[symbol] = initValue;
            return this[symbol];
        },
        set: createSetter(propertyKey, symbol, forFragment, min, max),
        ...defineProperty_SETTING,
    };
}

Object.freeze(definePositiveNumberRange);
export default definePositiveNumberRange;
