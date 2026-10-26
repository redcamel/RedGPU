[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineVector4Info

# Interface: DefineVector4Info

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:10](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/vector/defineVector4.ts#L10)

`defineVector4` 함수에 전달할 속성 정의 옵션 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:15](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/vector/defineVector4.ts#L15)

대상 객체 프로토타입에 정의할 속성 키 이름

***

### value?

> `optional` **value?**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:20](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/vector/defineVector4.ts#L20)

속성의 초기 4차원 벡터 튜플 값 (기본값: `[0, 0, 0, 0]`)
