[**RedGPU API v3.9.1-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [ToneMapping](../README.md) / ToneMappingManager

# Class: ToneMappingManager

Defined in: [src/toneMapping/ToneMappingManager.ts:31](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L31)

톤 매핑, 노출, 대비, 밝기를 통합 관리하는 클래스입니다.


::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.

:::

* ### Example
```typescript
// View3D를 통해 접근합니다. (Access through View3D)
const toneMappingManager = view.toneMappingManager;
toneMappingManager.mode = RedGPU.TONE_MAPPING_MODE.ACES_FILMIC_HILL;
toneMappingManager.exposure = 1.2;
```

## Constructors

### Constructor

> **new ToneMappingManager**(`view`): `ToneMappingManager`

Defined in: [src/toneMapping/ToneMappingManager.ts:46](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L46)

ToneMappingManager 인스턴스를 생성합니다. (내부 시스템 전용)


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | View3D 인스턴스

#### Returns

`ToneMappingManager`

## Accessors

### brightness

#### Get Signature

> **get** **brightness**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:97](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L97)

밝기(Brightness)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **brightness**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:102](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L102)

밝기(Brightness)를 설정합니다. (-1.0 ~ 1.0, 기본값: 0.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### contrast

#### Get Signature

> **get** **contrast**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:85](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L85)

명암 대비(Contrast)를 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **contrast**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:90](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L90)

명암 대비(Contrast)를 설정합니다. (0.0 ~ 2.0, 기본값: 1.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### exposure

#### Get Signature

> **get** **exposure**(): `number`

Defined in: [src/toneMapping/ToneMappingManager.ts:73](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L73)

노출값(Exposure)을 반환합니다.

##### Returns

`number`

#### Set Signature

> **set** **exposure**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:78](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L78)

노출값(Exposure)을 설정합니다. (기본값: 1.0)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

***

### mode

#### Get Signature

> **get** **mode**(): [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

Defined in: [src/toneMapping/ToneMappingManager.ts:58](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L58)

현재 적용된 톤 매핑 모드를 반환합니다.

##### Returns

[`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md)

#### Set Signature

> **set** **mode**(`value`): `void`

Defined in: [src/toneMapping/ToneMappingManager.ts:63](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L63)

톤 매핑 모드를 설정합니다.

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`TONE_MAPPING_MODE`](../type-aliases/TONE_MAPPING_MODE.md) |

##### Returns

`void`

***

### toneMapping

#### Get Signature

> **get** **toneMapping**(): `AToneMappingEffect`

Defined in: [src/toneMapping/ToneMappingManager.ts:52](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L52)

현재 활성화된 톤 매핑 이펙트 인스턴스를 반환합니다.

##### Returns

`AToneMappingEffect`

## Methods

### render()

> **render**(`width`, `height`, `currentTextureView`): `ASinglePassPostEffectResult`

Defined in: [src/toneMapping/ToneMappingManager.ts:116](https://github.com/redcamel/RedGPU/blob/b6431aa69ee7246cf56c0e787d030ba82af82fd0/src/toneMapping/ToneMappingManager.ts#L116)

톤 매핑을 렌더링합니다.


#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `width` | `number` | 너비
| `height` | `number` | 높이
| `currentTextureView` | `ASinglePassPostEffectResult` | 현재 텍스처 뷰 정보

#### Returns

`ASinglePassPostEffectResult`

렌더링 결과
