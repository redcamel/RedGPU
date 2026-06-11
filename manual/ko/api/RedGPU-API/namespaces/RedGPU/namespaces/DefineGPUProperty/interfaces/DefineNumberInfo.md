[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineNumberInfo

# Interface: DefineNumberInfo

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:9](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/number/defineNumber.ts#L9)

`defineNumber` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:14](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/number/defineNumber.ts#L14)

속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:29](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/number/defineNumber.ts#L29)

허용할 최대값 (옵션). 설정 범위 초과의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:24](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/number/defineNumber.ts#L24)

허용할 최소값 (옵션). 설정 범위 미만의 값이 setter에 할당되면 경고를 내고 이 값으로 고정됩니다.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:19](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/number/defineNumber.ts#L19)

속성의 초기 숫자값.
