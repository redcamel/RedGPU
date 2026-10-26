[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Scatter](../README.md) / ScatterRenderUnit

# Class: ScatterRenderUnit

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:101](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L101)

스캐터 시스템에서 단일 `drawIndexedIndirect` 드로우콜 단위가 되는 서브메시/LOD 렌더 유닛 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extended by

- [`FoliageRenderUnit`](../../../../Foliage/namespaces/Core/classes/FoliageRenderUnit.md)

## Constructors

### Constructor

> **new ScatterRenderUnit**(`init`): `ScatterRenderUnit`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:125](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L125)

`ScatterRenderUnit` 인스턴스를 초기화합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | [`ScatterRenderUnitInitOptions`](../interfaces/ScatterRenderUnitInitOptions.md) | 렌더 유닛 초기화 옵션 |

#### Returns

`ScatterRenderUnit`

## Accessors

### baseColorTexture

#### Get Signature

> **get** **baseColorTexture**(): [`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:300](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L300)

렌더 유닛의 베이스 컬러 `BitmapTexture`를 반환하거나 설정합니다.

##### Returns

[`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md)

베이스 컬러 `BitmapTexture`, `null` 또는 `undefined`

#### Set Signature

> **set** **baseColorTexture**(`val`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:304](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L304)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | [`BitmapTexture`](../../../../../../Resource/classes/BitmapTexture.md) |

##### Returns

`void`

***

### firstIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **firstIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L208)

통합 인덱스 버퍼 내 시작 인덱스 오프셋을 반환합니다.

##### Returns

`number`

시작 인덱스 오프셋

***

### geometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **geometry**(): [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L172)

렌더 유닛의 `Geometry` 인스턴스를 반환합니다.

##### Returns

[`Geometry`](../../../../../../../classes/Geometry.md)

`Geometry` 인스턴스

***

### indexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L196)

렌더 유닛의 인덱스 개수를 반환합니다.

##### Returns

`number`

인덱스 개수

***

### indexFormat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexFormat**(): `GPUIndexFormat`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L232)

인덱스 버퍼의 `GPUIndexFormat`을 반환합니다.

##### Returns

`GPUIndexFormat`

인덱스 포맷 (`GPUIndexFormat`)

***

### indirectOffsetBytes

#### Get Signature

> **get** **indirectOffsetBytes**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:256](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L256)

인다이렉트 드로우 버퍼 내 바이트 오프셋을 반환하거나 설정합니다.

##### Returns

`number`

인다이렉트 버퍼 내 바이트 오프셋

#### Set Signature

> **set** **indirectOffsetBytes**(`val`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:260](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L260)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### instanceBufferOffset

#### Get Signature

> **get** **instanceBufferOffset**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:272](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L272)

컬링된 인스턴스 버퍼 내 시작 인스턴스 오프셋을 반환하거나 설정합니다.

##### Returns

`number`

시작 인스턴스 오프셋

#### Set Signature

> **set** **instanceBufferOffset**(`val`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:276](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L276)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

### isIndexed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isIndexed**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L220)

인덱스 버퍼 기반 렌더링 여부를 반환합니다.

##### Returns

`boolean`

인덱스 버퍼 사용 여부

***

### isMasked

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMasked**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:328](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L328)

알파 마스크(Alpha Cutoff) 머티리얼 사용 여부를 반환합니다.

##### Returns

`boolean`

알파 마스크 사용 여부

***

### lodIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L316)

이 렌더 유닛이 속한 LOD 레벨 인덱스를 반환합니다.

##### Returns

`number`

LOD 레벨 인덱스

***

### material

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **material**(): `any`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L288)

렌더 유닛에 연결된 머티리얼 인스턴스를 반환합니다.

##### Returns

`any`

머티리얼 인스턴스

***

### strideBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **strideBytes**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L244)

정점당 바이트 스트라이드를 반환합니다.

##### Returns

`number`

정점당 바이트 스트라이드

***

### vertexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L184)

렌더 유닛의 정점 개수를 반환합니다.

##### Returns

`number`

정점 개수

## Methods

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:355](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L355)

렌더 유닛이 참조하는 `Geometry` 리소스를 파기합니다.

#### Returns

`void`

***

### draw()

> **draw**(`passEncoder`, `indirectGPUBuffer`, `offsetBytes?`): `void`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:346](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L346)

전달된 렌더 패스 또는 렌더 번들 인코더에 `drawIndexedIndirect` 명령을 기록합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passEncoder` | `GPURenderPassEncoder` \| `GPURenderBundleEncoder` | 드로우 명령을 기록할 렌더 패스 인코더 또는 렌더 번들 인코더 |
| `indirectGPUBuffer` | `GPUBuffer` | 인다이렉트 드로우 인자가 담긴 `GPUBuffer` |
| `offsetBytes?` | `number` | 인다이렉트 버퍼 내 바이트 오프셋 (생략 시 `indirectOffsetBytes` 사용) |

#### Returns

`void`
