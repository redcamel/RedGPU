[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineNumberInfo

# Interface: DefineNumberInfo

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:9](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/number/defineNumber.ts#L9)

`defineNumber` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:14](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/number/defineNumber.ts#L14)

Key name of the property. Defined on the target object's prototype under this name.

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:29](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/number/defineNumber.ts#L29)

Optional maximum allowed value. Assigning a value above this limit will log a warning and clamp it.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:24](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/number/defineNumber.ts#L24)

Optional minimum allowed value. Assigning a value below this limit will log a warning and clamp it.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:19](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/number/defineNumber.ts#L19)

Initial numeric value of the property.
