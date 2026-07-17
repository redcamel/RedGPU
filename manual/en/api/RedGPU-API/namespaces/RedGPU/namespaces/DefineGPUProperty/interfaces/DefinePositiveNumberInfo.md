[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefinePositiveNumberInfo

# Interface: DefinePositiveNumberInfo

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:9](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/number/definePositiveNumber.ts#L9)

`definePositiveNumber` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:14](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/number/definePositiveNumber.ts#L14)

Key name of the property. Defined on the target object's prototype under this name.

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:29](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/number/definePositiveNumber.ts#L29)

Optional maximum allowed value. Assigning a value above this limit will log a warning and clamp it.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:24](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/number/definePositiveNumber.ts#L24)

Optional minimum allowed value (defaults to 0). Assigning a value below this limit will log a warning and clamp it.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:19](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/number/definePositiveNumber.ts#L19)

Initial positive numeric value of the property.
