[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineVector3Info

# Interface: DefineVector3Info

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:10](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector3.ts#L10)

`defineVector3` 함수에 전달할 속성 정의 옵션 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector3.ts#L15)

대상 객체 프로토타입에 정의할 속성 키 이름

***

### value?

> `optional` **value?**: \[`number`, `number`, `number`\]

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector3.ts#L20)

속성의 초기 3차원 벡터 튜플 값 (기본값: `[0, 0, 0]`)
