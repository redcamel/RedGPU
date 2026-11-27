/**
 * [KO] glTF 2.0 `accessor.normalized === true` 정수 컴포넌트 값을 표준 부동소수점 범위(`[-1, 1]` 또는 `[0, 1]`)로 역정규화합니다.
 * [EN] Dequantizes a glTF 2.0 integer component value when `accessor.normalized === true` into the standard floating-point range (`[-1, 1]` or `[0, 1]`).
 *
 * @param value -
 * [KO] `DataView`에서 읽은 원본 숫자 값
 * [EN] Raw numeric value read from `DataView`
 * @param componentType -
 * [KO] glTF accessor `componentType` 코드 (`5120`: INT8, `5121`: UINT8, `5122`: INT16, `5123`: UINT16)
 * [EN] glTF accessor `componentType` code (`5120`: INT8, `5121`: UINT8, `5122`: INT16, `5123`: UINT16)
 * @param normalized -
 * [KO] `accessor.normalized` 플래그
 * [EN] `accessor.normalized` flag
 * @returns
 * [KO] 역정규화된 부동소수점 값 (`normalized !== true`이면 원본 값 반환)
 * [EN] Dequantized floating-point value (returns the raw value when `normalized !== true`)
 * @category GLTF
 */
declare const dequantizeAccessorValue: (value: number, componentType: number, normalized?: boolean) => number;
export default dequantizeAccessorValue;
