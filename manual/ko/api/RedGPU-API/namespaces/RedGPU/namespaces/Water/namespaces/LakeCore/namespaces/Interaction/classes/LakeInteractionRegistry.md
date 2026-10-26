[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeInteractionRegistry

# Class: LakeInteractionRegistry

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L28)

호수 수면과 상호작용할 메시(`Mesh`)를 전역으로 등록 및 관리하는 클래스입니다.

`mesh.enableWaterInteraction = true` 설정 시 내부적으로 자동 등록됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

### Example
```typescript
// 올바른 접근 방법
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

등록된 상호작용 대상 메시 집합(`ReadonlySet<Mesh>`)을 반환합니다.

##### Returns

`ReadonlySet`\<[`Mesh`](../../../../../../Display/classes/Mesh.md)\>

등록된 메시 집합 (`ReadonlySet<Mesh>`)

## Methods

### clear()

> `static` **clear**(): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:71](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L71)

등록된 모든 상호작용 메시를 제거합니다.

#### Returns

`void`

***

### register()

> `static` **register**(`mesh`): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:51](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L51)

메시를 수면 상호작용 대상으로 등록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../../../Display/classes/Mesh.md) | 등록할 `Mesh` 인스턴스 |

#### Returns

`void`

***

### unregister()

> `static` **unregister**(`mesh`): `void`

Defined in: [src/water/lakeCore/interaction/LakeInteractionRegistry.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/interaction/LakeInteractionRegistry.ts#L63)

등록된 메시의 상호작용 등록을 해제합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `mesh` | [`Mesh`](../../../../../../Display/classes/Mesh.md) | 등록 해제할 `Mesh` 인스턴스 |

#### Returns

`void`
