[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineNumberInfo

# Interface: DefineNumberInfo

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L12)

Interface for property definition options passed to the `defineNumber` function.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L17)

Property key name to define on the target object's prototype

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L32)

Optional maximum allowed value. Values above this limit log a warning and are clamped.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L27)

Optional minimum allowed value. Values below this limit log a warning and are clamped.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineNumber.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/defineProperty/funcs/number/defineNumber.ts#L22)

Initial numeric value of the property
