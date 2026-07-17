[**RedGPU API v4.1.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineVector3Info

# Interface: DefineVector3Info

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:7](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/vector/defineVector3.ts#L7)

`defineVector3` 함수에 전달할 설정 옵션을 정의하는 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:12](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/vector/defineVector3.ts#L12)

속성의 키 이름. 대상 객체 프로토타입에 이 이름으로 정의됩니다.

***

### value?

> `optional` **value?**: \[`number`, `number`, `number`\]

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:17](https://github.com/redcamel/RedGPU/blob/302ea63caf5f5ecf51af7f70ca3a0940bde79a48/src/defineProperty/funcs/vector/defineVector3.ts#L17)

속성의 초기 3차원 숫자 배열 값 (튜플 형태). 기본값은 `[0, 0, 0]`입니다.
