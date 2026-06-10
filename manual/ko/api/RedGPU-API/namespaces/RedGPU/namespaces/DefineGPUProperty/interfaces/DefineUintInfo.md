[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineUintInfo

# Interface: DefineUintInfo

Defined in: [src/defineProperty/funcs/number/defineUint.ts:9](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/number/defineUint.ts#L9)

`defineUint` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:14](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/number/defineUint.ts#L14)

속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:29](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/number/defineUint.ts#L29)

허용할 최대값 (옵션). 설정 범위 초과의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:24](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/number/defineUint.ts#L24)

허용할 최소값 (옵션, 기본값 0). 설정 범위 미만의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:19](https://github.com/redcamel/RedGPU/blob/07ca821aa5a5e0e3029b4e96ef3f9523994db21c/src/defineProperty/funcs/number/defineUint.ts#L19)

속성의 초기 부호 없는 정수(Uint) 값.
