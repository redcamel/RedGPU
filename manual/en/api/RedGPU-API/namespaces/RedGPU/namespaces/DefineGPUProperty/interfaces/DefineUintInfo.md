[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineUintInfo

# Interface: DefineUintInfo

Defined in: [src/defineProperty/funcs/number/defineUint.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/defineUint.ts#L12)

Interface for property definition options passed to the `defineUint` function.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/defineUint.ts#L17)

Property key name to define on the target object's prototype

***

### max?

> `optional` **max?**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/defineUint.ts#L32)

Optional maximum allowed value. Values above this limit log a warning and are clamped.

***

### min?

> `optional` **min?**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/defineUint.ts#L27)

Optional minimum allowed value (default: 0). Values below this limit log a warning and are clamped.

***

### value

> **value**: `number`

Defined in: [src/defineProperty/funcs/number/defineUint.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/number/defineUint.ts#L22)

Initial unsigned integer (Uint) value of the property
