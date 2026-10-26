[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineNumberInfo

# Interface: DefineNumberInfo

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L12)

`defineNumber` 함수에 전달할 속성 정의 옵션 인터페이스입니다.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L17)

대상 객체 프로토타입에 정의할 속성 키 이름

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L32)

허용할 최대값 (선택). 범위 초과의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L27)

허용할 최소값 (선택). 범위 미만의 값이 할당되면 경고를 출력하고 이 값으로 클램핑됩니다.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L22)

속성의 초기 숫자 값
