[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineColorRGBAInfo

# Interface: DefineColorRGBAInfo

Defined in: [src/defineProperty/funcs/color/defineColorRGBA.ts:14](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/color/defineColorRGBA.ts#L14)

`defineColorRGBA` 함수에 전달할 RGBA 색상 프로퍼티 정의 옵션 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/color/defineColorRGBA.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/color/defineColorRGBA.ts#L19)

대상 프로토타입에 정의할 프로퍼티 키 이름입니다.

***

### value?

> `optional` **value?**: `string`

Defined in: [src/defineProperty/funcs/color/defineColorRGBA.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/color/defineColorRGBA.ts#L24)

초기 16진수 색상 코드 문자열(예: `'#ff0000'`)입니다. 기본값은 `'#fff'`입니다.
