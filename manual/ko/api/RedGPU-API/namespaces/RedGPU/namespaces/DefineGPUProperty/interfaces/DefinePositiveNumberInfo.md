[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefinePositiveNumberInfo

# Interface: DefinePositiveNumberInfo

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/definePositiveNumber.ts#L12)

`definePositiveNumber` 함수에 전달할 속성 정의 옵션 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/definePositiveNumber.ts#L17)

대상 객체 프로토타입에 정의할 속성 키 이름

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/definePositiveNumber.ts#L32)

허용할 최대값 (선택). 범위 초과의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/definePositiveNumber.ts#L27)

허용할 최소값 (선택, 기본값: 0). 범위 미만의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/definePositiveNumber.ts#L22)

속성의 초기 양수 값
