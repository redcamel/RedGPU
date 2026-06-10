/**
 * [KO] RedGPU 속성 정의 시 Object.defineProperty에 공통으로 적용되는 PropertyDescriptor 설정값입니다.
 * [EN] PropertyDescriptor configuration values commonly applied to Object.defineProperty in RedGPU property definitions.
 */
const defineProperty_SETTING: PropertyDescriptor = {
    enumerable: true,
    configurable: false,
}
Object.freeze(defineProperty_SETTING)
export default defineProperty_SETTING
