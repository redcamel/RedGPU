[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageRenderUnit

# Class: FoliageRenderUnit

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L62)

식생(Foliage)의 개별 서브메시 또는 임포스터 드로우 단위를 나타내는 렌더 유닛 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

## Extends

- [`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md)

## Constructors



***

### Constructor

> **new FoliageRenderUnit**(`init`): `FoliageRenderUnit`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:79](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L79)

`FoliageRenderUnit` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `init` | `FoliageRenderUnitInitOptions` | 렌더 유닛 초기화 옵션 |

#### Returns

`FoliageRenderUnit`

#### Overrides

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`constructor`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#constructor)

## Accessors



***

### isImpostor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isImpostor**(): `boolean`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:144](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L144)

팔면체 임포스터 렌더 유닛인지 여부를 반환합니다.

##### Returns

`boolean`

임포스터 렌더 유닛 여부

***

***

### mainDepthMode

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainDepthMode**(): `FoliageDepthPassMode`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:132](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L132)

메인 패스에서의 깊이 테스트 모드를 반환합니다.

##### Returns

`FoliageDepthPassMode`

깊이 패스 모드(`FoliageDepthPassMode`)

***

***

### slotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **slotIndex**(): `number`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:120](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L120)

할당된 동적 유니폼 슬롯 인덱스를 반환합니다.

##### Returns

`number`

슬롯 인덱스 (미할당 시 `-1`)

***

## Methods



***

### canRenderInPass()

> **canRenderInPass**(`passType`): `boolean`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:249](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L249)

지정된 렌더 패스 유형에서 이 렌더 유닛이 렌더링 가능한지 확인합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `passType` | `FoliageRenderPassType` | 확인할 렌더 패스 유형(`'depthPrepass'` 또는 `'main'`) |

#### Returns

`boolean`

해당 패스에서의 렌더링 가능 여부

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:229](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L229)

할당된 유니폼 슬롯을 반환하고 렌더 유닛 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`destroy`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#destroy)

***

***

### flushSlotUBO()

> **flushSlotUBO**(): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:219](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L219)

CPU 슬롯 버퍼의 변경 사항을 GPU 유니폼 버퍼에 업로드합니다.

#### Returns

`void`

***

***

### getPipeline()

> **getPipeline**(`registry`, `sampleCount`, `msaaID`, `depthPassMode`, `renderUnitBindGroupLayout`): `GPURenderPipeline`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:284](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L284)

현재 머티리얼과 렌더 상태에 부합하는 `GPURenderPipeline`을 조회하거나 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `registry` | [`FoliagePipelineRegistry`](FoliagePipelineRegistry.md) | 파이프라인 캐시 레지스트리(`FoliagePipelineRegistry`) |
| `sampleCount` | `number` | MSAA 샘플 수 |
| `msaaID` | `string` | MSAA 설정 식별자 문자열 |
| `depthPassMode` | `FoliageDepthPassMode` | 깊이 패스 동작 모드 |
| `renderUnitBindGroupLayout` | `GPUBindGroupLayout` | 렌더 유닛 동적 유니폼 바인드 그룹 레이아웃 |

#### Returns

`GPURenderPipeline`

생성 또는 캐시된 `GPURenderPipeline` 인스턴스 (머티리얼 부재 시 `null`)

***

***

### updateGroundBlendParams()

> **updateGroundBlendParams**(`groundBlendStrength`, `groundBlendRange`): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:188](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L188)

지형 표면과의 하단 색상 블렌딩 강도 및 범위를 슬롯 버퍼에 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `groundBlendStrength` | `number` | 지형 블렌딩 강도 (`0.0` ~ `1.0`) |
| `groundBlendRange` | `number` | 지형 블렌딩 적용 높이 범위(미터 단위) |

#### Returns

`void`

***

***

### updateReceiveShadow()

> **updateReceiveShadow**(`receiveShadow`): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:209](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L209)

그림자 수신 여부를 슬롯 버퍼에 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `receiveShadow` | `boolean` | 그림자 수신 여부 |

#### Returns

`void`

***

***

### updateWindScales()

> **updateWindScales**(`trunkBendScale`, `leafFlutterScale`, `foliageHeight`): `void`

Defined in: [src/landscape/foliage/core/FoliageRenderUnit.ts:162](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/FoliageRenderUnit.ts#L162)

바람에 의한 줄기 굽힘 및 잎사귀 흔들림 스케일 파라미터를 슬롯 버퍼에 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `trunkBendScale` | `number` | 줄기 굽힘 강도 배율 |
| `leafFlutterScale` | `number` | 잎사귀 흔들림 강도 배율 |
| `foliageHeight` | `number` | 식생 기준 높이 |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

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

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`baseColorTexture`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#basecolortexture)

***

***

### firstIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **firstIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:208](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L208)

통합 인덱스 버퍼 내 시작 인덱스 오프셋을 반환합니다.

##### Returns

`number`

시작 인덱스 오프셋

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`firstIndex`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#firstindex)

***

***

### geometry

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **geometry**(): [`Geometry`](../../../../../../../classes/Geometry.md)

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:172](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L172)

렌더 유닛의 `Geometry` 인스턴스를 반환합니다.

##### Returns

[`Geometry`](../../../../../../../classes/Geometry.md)

`Geometry` 인스턴스

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`geometry`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#geometry)

***

***

### indexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:196](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L196)

렌더 유닛의 인덱스 개수를 반환합니다.

##### Returns

`number`

인덱스 개수

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`indexCount`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#indexcount)

***

***

### indexFormat

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **indexFormat**(): `GPUIndexFormat`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:232](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L232)

인덱스 버퍼의 `GPUIndexFormat`을 반환합니다.

##### Returns

`GPUIndexFormat`

인덱스 포맷 (`GPUIndexFormat`)

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`indexFormat`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#indexformat)

***

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

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`indirectOffsetBytes`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#indirectoffsetbytes)

***

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

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`instanceBufferOffset`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#instancebufferoffset)

***

***

### isIndexed

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isIndexed**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:220](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L220)

인덱스 버퍼 기반 렌더링 여부를 반환합니다.

##### Returns

`boolean`

인덱스 버퍼 사용 여부

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`isIndexed`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#isindexed)

***

***

### isMasked

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **isMasked**(): `boolean`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:328](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L328)

알파 마스크(Alpha Cutoff) 머티리얼 사용 여부를 반환합니다.

##### Returns

`boolean`

알파 마스크 사용 여부

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`isMasked`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#ismasked)

***

***

### lodIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodIndex**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:316](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L316)

이 렌더 유닛이 속한 LOD 레벨 인덱스를 반환합니다.

##### Returns

`number`

LOD 레벨 인덱스

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`lodIndex`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#lodindex)

***

***

### material

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **material**(): `any`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:288](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L288)

렌더 유닛에 연결된 머티리얼 인스턴스를 반환합니다.

##### Returns

`any`

머티리얼 인스턴스

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`material`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#material)

***

***

### strideBytes

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **strideBytes**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:244](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L244)

정점당 바이트 스트라이드를 반환합니다.

##### Returns

`number`

정점당 바이트 스트라이드

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`strideBytes`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#stridebytes)

***

***

### vertexCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vertexCount**(): `number`

Defined in: [src/landscape/core/scatter/ScatterRenderUnit.ts:184](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/scatter/ScatterRenderUnit.ts#L184)

렌더 유닛의 정점 개수를 반환합니다.

##### Returns

`number`

정점 개수

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`vertexCount`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#vertexcount)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

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

#### Inherited from

[`ScatterRenderUnit`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md).[`draw`](../../../../Core/namespaces/Scatter/classes/ScatterRenderUnit.md#draw)

***

</details>
