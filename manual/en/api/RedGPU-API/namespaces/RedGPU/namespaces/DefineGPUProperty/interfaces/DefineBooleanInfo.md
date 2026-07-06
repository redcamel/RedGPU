[**RedGPU API v4.2.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineBooleanInfo

# Interface: DefineBooleanInfo

Defined in: [src/defineProperty/funcs/defineBoolean.ts:12](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/defineProperty/funcs/defineBoolean.ts#L12)

`defineBoolean` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Remarks

Since GPUs do not natively support booleans, they are converted to 0 or 1 integers when written to the globalStruct buffer.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:17](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/defineProperty/funcs/defineBoolean.ts#L17)

Key name of the property. Defined on the target object's prototype under this name.

***

### value

> **value**: `boolean`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:22](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/defineProperty/funcs/defineBoolean.ts#L22)

Initial boolean value of the property.
