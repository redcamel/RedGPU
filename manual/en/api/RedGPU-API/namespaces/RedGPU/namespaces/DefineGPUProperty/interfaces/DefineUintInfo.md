[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineUintInfo

# Interface: DefineUintInfo

Defined in: [src/defineProperty/funcs/number/defineUint.ts:9](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineUint.ts#L9)

`defineUint` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:14](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineUint.ts#L14)

Key name of the property. Defined on the target object's prototype under this name.

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:29](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineUint.ts#L29)

Optional maximum allowed value. Assigning a value above this limit will log a warning and clamp it.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:24](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineUint.ts#L24)

Optional minimum allowed value (defaults to 0). Assigning a value below this limit will log a warning and clamp it.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:19](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/defineProperty/funcs/number/defineUint.ts#L19)

Initial unsigned integer (Uint) value of the property.
