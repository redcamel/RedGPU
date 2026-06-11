[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineColorRGBInfo

# Interface: DefineColorRGBInfo

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:11](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/color/defineColorRGB.ts#L11)

`defineColorRGB` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:16](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/color/defineColorRGB.ts#L16)

속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.

***

### value?

> `optional` **value?**: `string`

Defined in: [src/defineProperty/funcs/color/defineColorRGB.ts:21](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/defineProperty/funcs/color/defineColorRGB.ts#L21)

초기 16진수 색상 코드값 (예: `#ff0000`). 지정하지 않을 경우 기본값은 `#fff`입니다.
