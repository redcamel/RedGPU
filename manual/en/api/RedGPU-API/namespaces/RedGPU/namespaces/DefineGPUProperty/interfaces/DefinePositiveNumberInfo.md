[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefinePositiveNumberInfo

# Interface: DefinePositiveNumberInfo

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/definePositiveNumber.ts#L12)

Interface for property definition options passed to the `definePositiveNumber` function.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/definePositiveNumber.ts#L17)

Property key name to define on the target object's prototype

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/definePositiveNumber.ts#L32)

Optional maximum allowed value. Values above this limit log a warning and are clamped.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/definePositiveNumber.ts#L27)

Optional minimum allowed value (default: 0). Values below this limit log a warning and are clamped.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/definePositiveNumber.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/definePositiveNumber.ts#L22)

Initial positive numeric value of the property
