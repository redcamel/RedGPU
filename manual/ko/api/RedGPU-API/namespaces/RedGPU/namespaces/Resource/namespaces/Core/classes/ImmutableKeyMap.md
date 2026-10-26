[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [Core](../README.md) / ImmutableKeyMap

# Class: ImmutableKeyMap

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1380](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1380)

한 번 등록된 키의 값을 변경할 수 없는 불변 키 맵 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- `Map`

## Constructors



***

### Constructor

> **new ImmutableKeyMap**(`initValues?`): `ImmutableKeyMap`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1389](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1389)

ImmutableKeyMap 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `initValues?` | \[`any`, `any`\][] | `[]` | 초기 `[key, value]` 엔트리 배열 |

#### Returns

`ImmutableKeyMap`

#### Overrides

`Map.constructor`

## Properties



## Methods



***

### set()

> **set**(`key`, `value`): `this`

Defined in: [src/resources/core/resourceManager/ResourceManager.ts:1411](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/resources/core/resourceManager/ResourceManager.ts#L1411)

새로운 키와 값을 등록합니다. 이미 존재하는 키의 값은 변경할 수 없습니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `any` | 등록할 키 |
| `value` | `any` | 등록할 값 |

#### Returns

`this`

현재 `ImmutableKeyMap` 인스턴스

#### Throws

이미 존재하는 키에 값을 설정하려 할 때 Error 발생

#### Overrides

`Map.set`

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \[toStringTag\]

> <span class="readonly-badge">readonly</span> **\[toStringTag\]**: `string`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:137

#### Inherited from

`Map.[toStringTag]`

***

***

### size

> <span class="readonly-badge">readonly</span> **size**: `number`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.collection.d.ts:45

#### Returns

the number of elements in the Map.

#### Inherited from

`Map.size`

***

***

### \[species\]

> <span class="readonly-badge">readonly</span> `static` **\[species\]**: `MapConstructor`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:319

#### Inherited from

`Map.[species]`

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \[iterator\]()

> **\[iterator\]**(): `MapIterator`\<\[`any`, `any`\]\>

Defined in: manual/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:143

Returns an iterable of entries in the map.

#### Returns

`MapIterator`\<\[`any`, `any`\]\>

#### Inherited from

`Map.[iterator]`

***

***

### clear()

> **clear**(): `void`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.collection.d.ts:20

#### Returns

`void`

#### Inherited from

`Map.clear`

***

***

### delete()

> **delete**(`key`): `boolean`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.collection.d.ts:24

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `any` |

#### Returns

`boolean`

true if an element in the Map existed and has been removed, or false if the element does not exist.

#### Inherited from

`Map.delete`

***

***

### entries()

> **entries**(): `MapIterator`\<\[`any`, `any`\]\>

Defined in: manual/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:148

Returns an iterable of key, value pairs for every entry in the map.

#### Returns

`MapIterator`\<\[`any`, `any`\]\>

#### Inherited from

`Map.entries`

***

***

### forEach()

> **forEach**(`callbackfn`, `thisArg?`): `void`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.collection.d.ts:28

Executes a provided function once per each key/value pair in the Map, in insertion order.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `callbackfn` | (`value`, `key`, `map`) => `void` |
| `thisArg?` | `any` |

#### Returns

`void`

#### Inherited from

`Map.forEach`

***

***

### get()

> **get**(`key`): `any`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.collection.d.ts:33

Returns a specified element from the Map object. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it inside the Map.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `any` |

#### Returns

`any`

Returns the element associated with the specified key. If no element is associated with the specified key, undefined is returned.

#### Inherited from

`Map.get`

***

***

### has()

> **has**(`key`): `boolean`

Defined in: manual/node\_modules/typescript/lib/lib.es2015.collection.d.ts:37

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `key` | `any` |

#### Returns

`boolean`

boolean indicating whether an element with the specified key exists or not.

#### Inherited from

`Map.has`

***

***

### keys()

> **keys**(): `MapIterator`\<`any`\>

Defined in: manual/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:153

Returns an iterable of keys in the map

#### Returns

`MapIterator`\<`any`\>

#### Inherited from

`Map.keys`

***

***

### values()

> **values**(): `MapIterator`\<`any`\>

Defined in: manual/node\_modules/typescript/lib/lib.es2015.iterable.d.ts:158

Returns an iterable of values in the map

#### Returns

`MapIterator`\<`any`\>

#### Inherited from

`Map.values`

***

***

### groupBy()

> `static` **groupBy**\<`K`, `T`\>(`items`, `keySelector`): `Map`\<`K`, `T`[]\>

Defined in: manual/node\_modules/typescript/lib/lib.es2024.collection.d.ts:25

Groups members of an iterable according to the return value of the passed callback.

#### Type Parameters

| Type Parameter |
| ------ |
| <a id="type-parameter-k"></a> `K` |
| <a id="type-parameter-t"></a> `T` |

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `items` | `Iterable`\<`T`\> | An iterable. |
| `keySelector` | (`item`, `index`) => `K` | A callback which will be invoked for each item in items. |

#### Returns

`Map`\<`K`, `T`[]\>

#### Inherited from

`Map.groupBy`

</details>
