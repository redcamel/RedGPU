[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Display](../../../README.md) / [CoreMesh](../README.md) / createMeshVertexUniformBuffers

# Function: createMeshVertexUniformBuffers()

> **createMeshVertexUniformBuffers**(`mesh`, `skin?`): `void`

Defined in: [src/display/mesh/core/createMeshVertexUniformBuffers.ts:22](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/display/mesh/core/createMeshVertexUniformBuffers.ts#L22)

Creates the vertex uniform buffer and bind group layout for the mesh.

::: warning
This function is called internally by the system.<br/>Do not call it directly.
:::

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../classes/Mesh.md) | `undefined` | Target Mesh instance |
| `skin?` | `boolean` | `false` | Whether skinning is used (default: false) |

## Returns

`void`
