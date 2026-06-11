[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineBooleanInfo

# Interface: DefineBooleanInfo

Defined in: [src/defineProperty/funcs/defineBoolean.ts:12](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/defineBoolean.ts#L12)

`defineBoolean` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Remarks

GPU는 불리언(Boolean)을 직접 지원하지 않으므로, 유니폼 버퍼에 기록 시 정수 0 또는 1로 변환됩니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:17](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/defineBoolean.ts#L17)

속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.

***

### value

> **value**: `boolean`

Defined in: [src/defineProperty/funcs/defineBoolean.ts:22](https://github.com/redcamel/RedGPU/blob/be50b2c2c71cc3b1b61935ef99a8ccd1d938046a/src/defineProperty/funcs/defineBoolean.ts#L22)

속성의 초기 불리언 값.
