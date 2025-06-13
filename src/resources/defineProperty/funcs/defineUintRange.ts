import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";
import defineProperty_SETTING from "./defineProperty_SETTING";

function createSetter(
	propertyKey: string,
	symbol: symbol,
	isFragment: boolean,
	min: number = 0,
	max?: number
) {
	return function (newValue: number) {
		// 검증: Uint 범위 확인
		validateUintRange(newValue);
		// min/max 범위 확인 및 경고 출력
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
		// 값 설정
		this[symbol] = newValue;
		// GPU 업데이트
		const {gpuRenderInfo} = this;
		if (isFragment) {
			const {fragmentUniformInfo, fragmentUniformBuffer} = gpuRenderInfo;
			fragmentUniformBuffer.writeBuffer(
				fragmentUniformInfo.members[propertyKey],
				this[symbol]
			);
		} else if (gpuRenderInfo) {
			const {vertexUniformInfo, vertexUniformBuffer} = gpuRenderInfo;
			vertexUniformBuffer.writeBuffer(
				vertexUniformInfo.members[propertyKey],
				this[symbol]
			);
		}
	};
}

function defineUintRange(
	propertyKey: string,
	initValue: number = 0,
	forFragment: boolean = true,
	min: number = 0,
	max?: number
) {
	// 고유 심볼 생성
	const symbol = Symbol(propertyKey);
	return {
		// getter: 초기값 설정 및 반환
		get: function (): number {
			if (this[symbol] === undefined) this[symbol] = initValue;
			return this[symbol];
		},
		// setter: 값 변경 로직 정의
		set: createSetter(propertyKey, symbol, forFragment, min, max),
		// 기타 설정 병합
		...defineProperty_SETTING,
	};
}

Object.freeze(defineUintRange);
export default defineUintRange;
