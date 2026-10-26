[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineVector4Info

# Interface: DefineVector4Info

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:10](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector4.ts#L10)

Interface for property definition options passed to the `defineVector4` function.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:15](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector4.ts#L15)

Property key name to define on the target object's prototype

***

### value?

> `optional` **value?**: \[`number`, `number`, `number`, `number`\]

Defined in: [src/defineProperty/funcs/vector/defineVector4.ts:20](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/defineProperty/funcs/vector/defineVector4.ts#L20)

Initial 4D vector tuple value of the property (default: `[0, 0, 0, 0]`)
