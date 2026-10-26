[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeInteractionRegistry

# Class: LakeInteractionRegistry

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L28)

Class that globally registers and manages meshes (`Mesh`) interacting with lake water surfaces.

Automatically registered internally when `mesh.enableWaterInteraction = true` is set.

::: warning
This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
:::

### Example
```typescript
// Correct access method
mesh.enableWaterInteraction = true;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/water/lake/interaction/" style="width:100%; height:500px;"></iframe>

## See

 - [Lake interaction example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/interaction/)
 - [Character walking example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/characterWalking/)

## Constructors

### Constructor

> **new LakeInteractionRegistry**(): `LakeInteractionRegistry`

#### Returns

`LakeInteractionRegistry`

## Accessors

### meshes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** `static` **meshes**(): `ReadonlySet`\<[`Mesh`](../../../../../../Display/classes/Mesh.md)\>

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L39)

Returns the set of registered interaction target meshes (`ReadonlySet<Mesh>`).

##### Returns

`ReadonlySet`\<[`Mesh`](../../../../../../Display/classes/Mesh.md)\>

Set of registered meshes (`ReadonlySet<Mesh>`)

## Methods

### clear()

> `static` **clear**(): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L71)

Clears all registered interaction meshes.

#### Returns

`void`

***

### register()

> `static` **register**(`mesh`): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L51)

Registers a mesh as a water surface interaction target.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../../../Display/classes/Mesh.md) | `Mesh` instance to register |

#### Returns

`void`

***

### unregister()

> `static` **unregister**(`mesh`): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L63)

Unregisters a mesh from water surface interaction.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../../../Display/classes/Mesh.md) | `Mesh` instance to unregister |

#### Returns

`void`
