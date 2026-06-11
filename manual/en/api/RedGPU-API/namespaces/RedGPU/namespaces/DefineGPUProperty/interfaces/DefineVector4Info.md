[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineVector4Info

# Interface: DefineVector4Info

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:7](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/vector/defineVector4.ts#L7)

`defineVector4` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:12](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/vector/defineVector4.ts#L12)

Key name of the property. Defined on the target object's prototype under this name.

***

### value?

> `optional` **value?**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:17](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/vector/defineVector4.ts#L17)

Initial 4-dimensional numeric array value (tuple). Defaults to `[0, 0, 0, 0]`.
