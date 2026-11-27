[**RedGPU API v4.6.0**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [DefineGPUProperty](../README.md) / DefineVector3Info

# Interface: DefineVector3Info

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:10](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/vector/defineVector3.ts#L10)

Interface for property definition options passed to the `defineVector3` function.

## Properties

### key

> **key**: `string`

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:15](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/vector/defineVector3.ts#L15)

Property key name to define on the target object's prototype

***

### value?

> `optional` **value?**: \[`number`, `number`, `number`\]

Defined in: [src/defineProperty/funcs/vector/defineVector3.ts:20](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/defineProperty/funcs/vector/defineVector3.ts#L20)

Initial 3D vector tuple value of the property (default: `[0, 0, 0]`)
