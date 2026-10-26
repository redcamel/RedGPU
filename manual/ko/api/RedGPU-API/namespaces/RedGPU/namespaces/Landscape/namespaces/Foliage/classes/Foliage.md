[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Foliage](../README.md) / Foliage

# Class: Foliage

Defined in: [src/landscape/foliage/core/Foliage.ts:319](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L319)

지형(`Landscape`) 위에 배치되는 단일 식생(나무, 바위, 관목 등) 타입의 LOD, 서브 셀 스트리밍 및 렌더링 속성을 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// LOD 및 임포스터 옵션을 포함하여 식생 타입 추가
const pineTree = landscape.foliageManager.addType({
    name: 'PineTree',
    lods: [
        { mesh: pineLod0Mesh, lodDistance: 60 },
        { mesh: pineLod1Mesh, lodDistance: 150 }
    ],
    densityPerHectare: 150,
    useImpostor: true
});
```

## See

[Foliage and Impostors example](https://redcamel.github.io/RedGPU/examples/3d/landscape/foliageAndImpostors/)

## Extends

- [`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md)\<`FoliageTypeAllocation`\>

## Constructors



***

### Constructor

> **new Foliage**(`redGPUContext`, `options`, `megaBuffer?`, `baker?`, `slotPooler?`, `landscape?`): `Foliage`

Defined in: [src/landscape/foliage/core/Foliage.ts:396](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L396)

`Foliage` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `RedGPUContext` 인스턴스 |
| `options` | [`FoliageOptions`](../interfaces/FoliageOptions.md) | 식생 타입 초기화 옵션 |
| `megaBuffer?` | [`FoliageMegaBuffer`](../namespaces/Core/classes/FoliageMegaBuffer.md) | 식생 인스턴스 데이터를 저장할 `FoliageMegaBuffer` 인스턴스 |
| `baker?` | [`FoliageInstanceBaker`](../namespaces/Core/classes/FoliageInstanceBaker.md) | 서브 셀 인스턴스 베이킹을 수행하는 `FoliageInstanceBaker` 인스턴스 |
| `slotPooler?` | [`FoliageSlotPooler`](../namespaces/Core/classes/FoliageSlotPooler.md) | 렌더 유닛 UBO 슬롯을 관리하는 `FoliageSlotPooler` 인스턴스 |
| `landscape?` | [`Landscape`](../../../classes/Landscape.md) | 식생이 배치될 대상 `Landscape` 인스턴스 |

#### Returns

`Foliage`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`constructor`](../../Core/namespaces/Scatter/classes/AScatterType.md#constructor)

## Properties



***

### onRepopulateRequired?

> `optional` **onRepopulateRequired?**: (`type`) => `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:369](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L369)

배치 파라미터 변경으로 인해 서브 셀 인스턴스 재배치가 필요할 때 호출되는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `type` | `Foliage` |

#### Returns

`void`

***

***

### onUniformDirty?

> `optional` **onUniformDirty?**: (`typeId`) => `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:364](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L364)

유니폼 파라미터가 변경되어 UBO 갱신이 필요할 때 호출되는 콜백 함수

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `typeId` | `number` |

#### Returns

`void`

## Accessors



***

### activeInstanceCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **activeInstanceCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:799](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L799)

현재 GPU 메가 버퍼에 마운트되어 활성화된 총 인스턴스 수를 반환합니다.

##### Returns

`number`

활성 인스턴스 수

***

***

### alignFactor

#### Get Signature

> **get** **alignFactor**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:890](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L890)

지형 법선 정렬 반영 비율(`0.0` ~ `1.0`)을 반환하거나 설정합니다.

##### Returns

`number`

법선 정렬 반영 비율

#### Set Signature

> **set** **alignFactor**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:853](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L853)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### alignToNormal

#### Get Signature

> **get** **alignToNormal**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:870](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L870)

지형 표면 법선(Normal) 방향으로 인스턴스를 정렬할지 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

지형 법선 정렬 활성화 여부

#### Set Signature

> **set** **alignToNormal**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:836](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L836)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

***

***

### boundingRadius

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **boundingRadius**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:810](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L810)

식생 메시의 바운딩 구 반경(미터 단위)을 반환합니다.

##### Returns

`number`

바운딩 반경

***

***

### depthPrepassMaskedRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthPrepassMaskedRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:744](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L744)

Depth Prepass에서 렌더링되는 알파 마스크(Masked) `FoliageRenderUnit` 목록을 반환합니다.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

알파 마스크 Depth Prepass 렌더 유닛 배열

***

***

### depthPrepassOpaqueRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **depthPrepassOpaqueRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:733](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L733)

Depth Prepass에서 렌더링되는 불투명(Opaque) `FoliageRenderUnit` 목록을 반환합니다.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

불투명 Depth Prepass 렌더 유닛 배열

***

***

### groundBlendRange

#### Get Signature

> **get** **groundBlendRange**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:964](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L964)

지형 하단 색상 블렌딩이 적용되는 높이 범위(미터 단위)를 반환하거나 설정합니다.

##### Returns

`number`

지형 블렌딩 높이 범위 (미터)

#### Set Signature

> **set** **groundBlendRange**(`v`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:874](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L874)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | `number` |

##### Returns

`void`

***

***

### hasImpostor

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasImpostor**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:901](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L901)

이 식생 타입에 생성된 옥타헤드럴 임포스터 렌더 유닛이 존재하는지 여부를 반환합니다.

##### Returns

`boolean`

임포스터 렌더 유닛 존재 여부

***

***

### hasMaskedLOD0

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasMaskedLOD0**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:821](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L821)

LOD 0 단계에 알파 마스크(Masked) 재질이 포함되어 있는지 여부를 반환합니다.

##### Returns

`boolean`

LOD 0 알파 마스크 포함 여부

***

***

### landscape

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **landscape**(): [`Landscape`](../../../classes/Landscape.md)

Defined in: [src/landscape/foliage/core/Foliage.ts:711](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L711)

식생이 배치된 대상 `Landscape` 인스턴스를 반환합니다.

##### Returns

[`Landscape`](../../../classes/Landscape.md)

`Landscape` 인스턴스 또는 `null`

***

***

### lastMountedCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lastMountedCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:986](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L986)

가장 최근 스트리밍 업데이트에서 새로 마운트된 서브 셀 개수를 반환합니다.

##### Returns

`number`

최근 마운트된 서브 셀 개수

***

***

### lastUnmountedCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lastUnmountedCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:997](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L997)

가장 최근 스트리밍 업데이트에서 마운트 해제된 서브 셀 개수를 반환합니다.

##### Returns

`number`

최근 언마운트된 서브 셀 개수

***

***

### leafFlutterScale

#### Get Signature

> **get** **leafFlutterScale**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:832](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L832)

바람에 의한 잎사귀 떨림 강도 배율을 반환하거나 설정합니다.

##### Returns

`number`

잎사귀 떨림 강도 배율

#### Set Signature

> **set** **leafFlutterScale**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:844](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L844)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### lod0RenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lod0RenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:766](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L766)

LOD 0 단계에 해당하는 `FoliageRenderUnit` 목록을 반환합니다.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

LOD 0 렌더 유닛 배열

***

***

### lodInfoList

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lodInfoList**(): [`FoliageLODInfo`](../namespaces/Core/interfaces/FoliageLODInfo.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:788](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L788)

구성된 각 LOD 단계의 메타데이터(`FoliageLODInfo`) 목록을 반환합니다.

##### Returns

[`FoliageLODInfo`](../namespaces/Core/interfaces/FoliageLODInfo.md)[]

`FoliageLODInfo` 배열

***

***

### mainRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mainRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:755](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L755)

메인 컬러 패스에서 렌더링되는 `FoliageRenderUnit` 목록을 반환합니다.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

메인 패스 렌더 유닛 배열

***

***

### maxInstances

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **maxInstances**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:624](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L624)

이 식생 타입에 할당된 최대 인스턴스 수용량을 반환합니다.

##### Returns

`number`

최대 인스턴스 수

***

***

### maxScale

#### Get Signature

> **get** **maxScale**(): \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:678](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L678)

인스턴스 랜덤 스케일의 최댓값 `[x, y, z]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`, `number`\]

최대 스케일 튜플 `[x, y, z]`

#### Set Signature

> **set** **maxScale**(`v`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:655](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L655)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### megaBuffer

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **megaBuffer**(): [`FoliageMegaBuffer`](../namespaces/Core/classes/FoliageMegaBuffer.md)

Defined in: [src/landscape/foliage/core/Foliage.ts:700](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L700)

연결된 `FoliageMegaBuffer` 인스턴스를 반환합니다.

##### Returns

[`FoliageMegaBuffer`](../namespaces/Core/classes/FoliageMegaBuffer.md)

`FoliageMegaBuffer` 인스턴스 또는 `null`

***

***

### minScale

#### Get Signature

> **get** **minScale**(): \[`number`, `number`, `number`\]

Defined in: [src/landscape/foliage/core/Foliage.ts:651](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L651)

인스턴스 랜덤 스케일의 최솟값 `[x, y, z]`를 반환하거나 설정합니다.

##### Returns

\[`number`, `number`, `number`\]

최소 스케일 튜플 `[x, y, z]`

#### Set Signature

> **set** **minScale**(`v`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:628](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L628)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `v` | \[`number`, `number`\] \| \[`number`, `number`, `number`\] |

##### Returns

`void`

***

***

### mountedSubCellCount

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **mountedSubCellCount**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:975](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L975)

현재 마운트되어 있는 서브 셀의 개수를 반환합니다.

##### Returns

`number`

마운트된 서브 셀 개수

***

***

### nameHash

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **nameHash**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:613](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L613)

식생 타입 이름으로부터 계산된 해시 값을 반환합니다.

##### Returns

`number`

이름 해시 값

***

***

### randomRotationY

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **randomRotationY**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:689](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L689)

Y축 기준 랜덤 회전 적용 여부를 반환합니다.

##### Returns

`boolean`

Y축 랜덤 회전 여부

***

***

### receiveShadow

#### Get Signature

> **get** **receiveShadow**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:933](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L933)

식생 표면의 그림자 수신 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

그림자 수신 여부

#### Set Signature

> **set** **receiveShadow**(`value`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:937](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L937)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### renderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **renderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:722](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L722)

모든 LOD 단계의 `FoliageRenderUnit` 목록을 반환합니다.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

`FoliageRenderUnit` 배열

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`renderUnits`](../../Core/namespaces/Scatter/classes/AScatterType.md#renderunits)

***

***

### shadowMergedRenderUnits

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **shadowMergedRenderUnits**(): [`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

Defined in: [src/landscape/foliage/core/Foliage.ts:777](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L777)

그림자 패스 렌더링을 위해 병합된 `FoliageRenderUnit` 목록을 반환합니다.

##### Returns

[`FoliageRenderUnit`](../namespaces/Core/classes/FoliageRenderUnit.md)[]

그림자용 병합 렌더 유닛 배열

***

***

### streamingRadius

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **streamingRadius**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:953](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L953)

서브 셀 스트리밍이 수행되는 유효 반경(미터 단위)을 반환합니다.

##### Returns

`number`

스트리밍 반경 (미터)

***

***

### trunkBendScale

#### Get Signature

> **get** **trunkBendScale**(): `number`

Defined in: [src/landscape/foliage/core/Foliage.ts:593](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L593)

바람에 의한 줄기/기둥 흔들림 강도 배율을 반환하거나 설정합니다.

##### Returns

`number`

줄기 흔들림 강도 배율

#### Set Signature

> **set** **trunkBendScale**(`val`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:597](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L597)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

***

***

### useImpostor

#### Get Signature

> **get** **useImpostor**(): `boolean`

Defined in: [src/landscape/foliage/core/Foliage.ts:912](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L912)

원거리 옥타헤드럴 임포스터(Octahedral Impostor) LOD 사용 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

임포스터 사용 여부

#### Set Signature

> **set** **useImpostor**(`value`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:916](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L916)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

## Methods



***

### clearSubCellCache()

> **clearSubCellCache**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1061](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1061)

마운트된 모든 서브 셀의 상태를 초기화하고 서브 셀 캐시를 비웁니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1005](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1005)

식생 타입의 모든 렌더 유닛, 서브 셀 캐시 및 관련 리소스를 해제합니다.

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`destroy`](../../Core/namespaces/Scatter/classes/AScatterType.md#destroy)

***

***

### flushAllRenderUnitUBOs()

> **flushAllRenderUnitUBOs**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1043](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1043)

타입 파라미터를 동기화하고 모든 렌더 유닛 및 그림자 렌더 유닛의 슬롯 UBO를 GPU에 플러시합니다.

#### Returns

`void`

***

***

### onParameterChanged()

> **onParameterChanged**(`prop`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1108](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1108)

스캐터 속성 값이 변경되었을 때 호출되어 캐시 초기화, 리베이크 또는 UBO 갱신을 트리거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prop` | `string` | 변경된 속성 이름 |

#### Returns

`void`

#### Overrides

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`onParameterChanged`](../../Core/namespaces/Scatter/classes/AScatterType.md#onparameterchanged)

***

***

### rebake()

> **rebake**(): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1339](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1339)

현재 마운트된 모든 서브 셀의 인스턴스 변환 데이터를 GPU 메가 버퍼에 다시 베이킹합니다.

#### Returns

`void`

***

***

### setLODDistance()

> **setLODDistance**(`lodIndex`, `distance`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1088](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1088)

특정 LOD 단계의 전환 거리를 변경합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `lodIndex` | `number` | 대상 LOD 단계 인덱스 |
| `distance` | `number` | 설정할 전환 거리 (미터 단위) |

#### Returns

`void`

***

***

### updateStreaming()

> **updateStreaming**(`camX`, `camZ`, `mountBudget?`, `unmountBudget?`): `void`

Defined in: [src/landscape/foliage/core/Foliage.ts:1208](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/foliage/core/Foliage.ts#L1208)

카메라 위치를 기준으로 스트리밍 반경 내외의 서브 셀을 예산(Budget) 범위 안에서 마운트하거나 언마운트합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `camX` | `number` | `undefined` | 카메라의 월드 X 좌표 |
| `camZ` | `number` | `undefined` | 카메라의 월드 Z 좌표 |
| `mountBudget?` | `number` | `16` | 프레임당 최대 서브 셀 마운트 허용 개수 (기본값: `16`) |
| `unmountBudget?` | `number` | `32` | 프레임당 최대 서브 셀 언마운트 허용 개수 (기본값: `32`) |

#### Returns

`void`

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### allocation

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **allocation**(): `TAllocation`

Defined in: [src/landscape/core/scatter/AScatterType.ts:211](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L211)

메가 버퍼에서 이 타입에 할당된 세그먼트 정보(`TAllocation | null`)를 반환합니다.

##### Returns

`TAllocation`

세그먼트 할당 정보(`TAllocation`) 또는 미할당 시 `null`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`allocation`](../../Core/namespaces/Scatter/classes/AScatterType.md#allocation)

***

***

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`antialiasingManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#antialiasingmanager)

***

***

### bottomOffset

#### Get Signature

> **get** **bottomOffset**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:235](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L235)

지형 표면으로부터의 인스턴스 하단 높이 오프셋을 반환하거나 설정합니다.

##### Returns

`number`

하단 높이 오프셋

#### Set Signature

> **set** **bottomOffset**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:259](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L259)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`bottomOffset`](../../Core/namespaces/Scatter/classes/AScatterType.md#bottomoffset)

***

***

### castShadow

#### Get Signature

> **get** **castShadow**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:414](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L414)

디렉셔널 라이트 그림자 투사 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

그림자 투사 활성화 여부

#### Set Signature

> **set** **castShadow**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:438](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L438)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`castShadow`](../../Core/namespaces/Scatter/classes/AScatterType.md#castshadow)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`commandEncoderManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#commandencodermanager)

***

***

### cullingDistance

#### Get Signature

> **get** **cullingDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:255](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L255)

메인 패스 인스턴스 가시 컬링 거리를 반환하거나 설정합니다 (`0` 이상).

##### Returns

`number`

메인 패스 가시 컬링 거리

#### Set Signature

> **set** **cullingDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:279](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L279)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`cullingDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#cullingdistance)

***

***

### densityMultiplier

#### Get Signature

> **get** **densityMultiplier**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:394](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L394)

기준 밀도에 곱해지는 밀도 배율을 반환하거나 설정합니다 (`0.0` 이상).

##### Returns

`number`

밀도 배율

#### Set Signature

> **set** **densityMultiplier**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:418](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L418)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityMultiplier`](../../Core/namespaces/Scatter/classes/AScatterType.md#densitymultiplier)

***

***

### densityPerHectare

#### Get Signature

> **get** **densityPerHectare**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:374](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L374)

헥타르(10,000㎡)당 기준 인스턴스 밀도를 반환하거나 설정합니다 (`0.0` 이상).

##### Returns

`number`

헥타르당 기준 배치 밀도

#### Set Signature

> **set** **densityPerHectare**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:398](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L398)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityPerHectare`](../../Core/namespaces/Scatter/classes/AScatterType.md#densityperhectare)

***

***

### densityScaleByWeight

#### Get Signature

> **get** **densityScaleByWeight**(): `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:354](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L354)

지형 레이어 가중치에 따라 인스턴스 스케일을 조절할지 여부를 반환하거나 설정합니다.

##### Returns

`boolean`

가중치 기반 스케일 조절 여부

#### Set Signature

> **set** **densityScaleByWeight**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:378](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L378)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `boolean` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/classes/AScatterType.md#densityscalebyweight)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`gpuDevice`](../../Core/namespaces/Scatter/classes/AScatterType.md#gpudevice)

***

***

### groundBlendStrength

#### Get Signature

> **get** **groundBlendStrength**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:434](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L434)

지형 표면과의 하단 블렌딩 강도(`0.0`~`1.0`)를 반환하거나 설정합니다.

##### Returns

`number`

하단 블렌딩 강도 (`0.0`~`1.0`)

#### Set Signature

> **set** **groundBlendStrength**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L461)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/classes/AScatterType.md#groundblendstrength)

***

***

### height

#### Get Signature

> **get** **height**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:223](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L223)

스캐터 인스턴스의 기준 높이를 반환하거나 설정합니다 (`0.01` 이상).

##### Returns

`number`

인스턴스 기준 높이

#### Set Signature

> **set** **height**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:239](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L239)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`height`](../../Core/namespaces/Scatter/classes/AScatterType.md#height)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`instanceId`](../../Core/namespaces/Scatter/classes/AScatterType.md#instanceid)

***

***

### maxSlope

#### Get Signature

> **get** **maxSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:334](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L334)

인스턴스 배치가 허용되는 최대 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최대 지형 경사각 (단위: 도)

#### Set Signature

> **set** **maxSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:358](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L358)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`maxSlope`](../../Core/namespaces/Scatter/classes/AScatterType.md#maxslope)

***

***

### minSlope

#### Get Signature

> **get** **minSlope**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:315](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L315)

인스턴스 배치가 허용되는 최소 지형 경사각(도, `0.0`~`90.0`)을 반환하거나 설정합니다.

##### Returns

`number`

최소 지형 경사각 (단위: 도)

#### Set Signature

> **set** **minSlope**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:338](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L338)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`minSlope`](../../Core/namespaces/Scatter/classes/AScatterType.md#minslope)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:166](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L166)

스캐터 타입의 고유 이름을 반환합니다. 생성 이후에는 변경할 수 없습니다.

##### Returns

`string`

스캐터 타입의 고유 이름

#### Set Signature

> **set** **name**(`_value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:170](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L170)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `_value` | `string` |

##### Returns

`void`

객체 이름 문자열

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`name`](../../Core/namespaces/Scatter/classes/AScatterType.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`redGPUContext`](../../Core/namespaces/Scatter/classes/AScatterType.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`resourceManager`](../../Core/namespaces/Scatter/classes/AScatterType.md#resourcemanager)

***

***

### shadowCullDistance

#### Get Signature

> **get** **shadowCullDistance**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:275](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L275)

그림자 패스 인스턴스 컬링 거리를 반환하거나 설정합니다 (`0` 이상).

##### Returns

`number`

그림자 패스 컬링 거리

#### Set Signature

> **set** **shadowCullDistance**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:299](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L299)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/classes/AScatterType.md#shadowculldistance)

***

***

### targetLayer

#### Get Signature

> **get** **targetLayer**(): `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:295](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L295)

배치 밀도 가중치를 참조할 대상 지형 레이어 이름 또는 인덱스를 반환하거나 설정합니다.

##### Returns

`string` \| `number`

대상 레이어 이름(`string`), 인덱스(`number`) 또는 `undefined`

#### Set Signature

> **set** **targetLayer**(`val`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:319](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L319)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `string` \| `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`targetLayer`](../../Core/namespaces/Scatter/classes/AScatterType.md#targetlayer)

***

***

### typeId

#### Get Signature

> **get** **typeId**(): `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:182](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L182)

스캐터 타입에 할당된 고유 숫자 ID를 반환하거나 설정합니다.

##### Returns

`number`

스캐터 타입 숫자 ID

#### Set Signature

> **set** **typeId**(`value`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:186](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`typeId`](../../Core/namespaces/Scatter/classes/AScatterType.md#typeid)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`uuid`](../../Core/namespaces/Scatter/classes/AScatterType.md#uuid)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### bindAllocation()

> **bindAllocation**(`allocation`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:454](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L454)

메가 버퍼 세그먼트 할당 정보를 이 스캐터 타입에 바인딩합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `allocation` | `FoliageTypeAllocation` | 바인딩할 세그먼트 할당 정보 또는 `null` |

#### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`bindAllocation`](../../Core/namespaces/Scatter/classes/AScatterType.md#bindallocation)

***

***

### setRawScatterProperties()

> **setRawScatterProperties**(`values`): `void`

Defined in: [src/landscape/core/scatter/AScatterType.ts:477](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L477)

`onParameterChanged` 콜백을 트리거하지 않고 스캐터 속성들의 내부 원시 값을 일괄 설정합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `values` | \{ `bottomOffset?`: `number`; `castShadow?`: `boolean`; `cullingDistance?`: `number`; `densityMultiplier?`: `number`; `densityPerHectare?`: `number`; `densityScaleByWeight?`: `boolean`; `groundBlendStrength?`: `number`; `height?`: `number`; `maxSlope?`: `number`; `minSlope?`: `number`; `shadowCullDistance?`: `number`; `targetLayer?`: `string` \| `number`; \} | 일괄 설정할 스캐터 속성 값 객체 |
| `values.bottomOffset?` | `number` | - |
| `values.castShadow?` | `boolean` | - |
| `values.cullingDistance?` | `number` | - |
| `values.densityMultiplier?` | `number` | - |
| `values.densityPerHectare?` | `number` | - |
| `values.densityScaleByWeight?` | `boolean` | - |
| `values.groundBlendStrength?` | `number` | - |
| `values.height?` | `number` | - |
| `values.maxSlope?` | `number` | - |
| `values.minSlope?` | `number` | - |
| `values.shadowCullDistance?` | `number` | - |
| `values.targetLayer?` | `string` \| `number` | - |

#### Returns

`void`

#### Inherited from

[`AScatterType`](../../Core/namespaces/Scatter/classes/AScatterType.md).[`setRawScatterProperties`](../../Core/namespaces/Scatter/classes/AScatterType.md#setrawscatterproperties)

***

</details>
