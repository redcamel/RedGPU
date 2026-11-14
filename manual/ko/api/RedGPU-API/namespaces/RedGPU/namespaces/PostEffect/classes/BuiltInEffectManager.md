[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [PostEffect](../README.md) / BuiltInEffectManager

# Class: BuiltInEffectManager

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:38](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L38)

`View3D`의 시스템 내장(Built-in) 후처리 이펙트(`SSAO`, `SSR`, `Fog`, `HeightFog`, `DOF`, `Bloom`, `LensFlare`, `AutoExposure`, `ChromaticAberration`, `LensDistortion`, `Vignetting`, `FilmGrain`)를 통합 관리하는 클래스입니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// View3D의 builtInEffectManager를 통해 접근
const builtInEffectManager = view.builtInEffectManager;
builtInEffectManager.useSSAO = true;
builtInEffectManager.useBloom = true;
builtInEffectManager.bloom.setCinematic();
```

## Extends

- [`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md)

## Constructors



***

### Constructor

> **new BuiltInEffectManager**(`view`): `BuiltInEffectManager`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:74](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L74)

`BuiltInEffectManager` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `view` | [`View3D`](../../Display/classes/View3D.md) | 연결할 `View3D` 인스턴스 |

#### Returns

`BuiltInEffectManager`

#### Overrides

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`constructor`](../../BaseObject/classes/RedGPUObject.md#constructor)

## Accessors



***

### autoExposure

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **autoExposure**(): [`AutoExposure`](../namespaces/BuiltIn/classes/AutoExposure.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:111](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L111)

자동 노출(`AutoExposure`) 인스턴스를 반환합니다.

##### Returns

[`AutoExposure`](../namespaces/BuiltIn/classes/AutoExposure.md)

`AutoExposure` 인스턴스

***

***

### bloom

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **bloom**(): [`Bloom`](../namespaces/BuiltIn/classes/Bloom.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:341](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L341)

Bloom 이펙트 인스턴스를 반환합니다.

##### Returns

[`Bloom`](../namespaces/BuiltIn/classes/Bloom.md)

`Bloom` 인스턴스

***

***

### chromaticAberration

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **chromaticAberration**(): [`ChromaticAberration`](../namespaces/BuiltIn/classes/ChromaticAberration.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:411](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L411)

ChromaticAberration 이펙트 인스턴스를 반환합니다.

##### Returns

[`ChromaticAberration`](../namespaces/BuiltIn/classes/ChromaticAberration.md)

`ChromaticAberration` 인스턴스

***

***

### dof

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **dof**(): [`DOF`](../namespaces/BuiltIn/classes/DOF.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:306](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L306)

DOF 이펙트 인스턴스를 반환합니다.

##### Returns

[`DOF`](../namespaces/BuiltIn/classes/DOF.md)

`DOF` 인스턴스

***

***

### filmGrain

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **filmGrain**(): [`FilmGrain`](../namespaces/BuiltIn/classes/FilmGrain.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:516](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L516)

FilmGrain 이펙트 인스턴스를 반환합니다.

##### Returns

[`FilmGrain`](../namespaces/BuiltIn/classes/FilmGrain.md)

`FilmGrain` 인스턴스

***

***

### fog

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **fog**(): [`Fog`](../namespaces/BuiltIn/classes/Fog.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:236](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L236)

Fog 이펙트 인스턴스를 반환합니다.

##### Returns

[`Fog`](../namespaces/BuiltIn/classes/Fog.md)

`Fog` 인스턴스

***

***

### hasAutoExposure

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **hasAutoExposure**(): `boolean`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:99](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L99)

자동 노출(`AutoExposure`) 인스턴스가 이미 초기화되어 있는지 여부를 반환합니다.

##### Returns

`boolean`

`AutoExposure` 초기화 여부

***

***

### heightFog

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **heightFog**(): [`HeightFog`](../namespaces/BuiltIn/classes/HeightFog.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:271](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L271)

HeightFog 이펙트 인스턴스를 반환합니다.

##### Returns

[`HeightFog`](../namespaces/BuiltIn/classes/HeightFog.md)

`HeightFog` 인스턴스

***

***

### lensDistortion

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lensDistortion**(): [`LensDistortion`](../namespaces/BuiltIn/classes/LensDistortion.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:446](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L446)

LensDistortion 이펙트 인스턴스를 반환합니다.

##### Returns

[`LensDistortion`](../namespaces/BuiltIn/classes/LensDistortion.md)

`LensDistortion` 인스턴스

***

***

### lensFlare

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **lensFlare**(): [`LensFlare`](../namespaces/BuiltIn/classes/LensFlare.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:376](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L376)

LensFlare 이펙트 인스턴스를 반환합니다.

##### Returns

[`LensFlare`](../namespaces/BuiltIn/classes/LensFlare.md)

`LensFlare` 인스턴스

***

***

### ssao

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **ssao**(): [`SSAO`](../namespaces/BuiltIn/classes/SSAO.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:166](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L166)

SSAO 이펙트 인스턴스를 반환합니다.

##### Returns

[`SSAO`](../namespaces/BuiltIn/classes/SSAO.md)

`SSAO` 인스턴스

***

***

### ssr

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **ssr**(): [`SSR`](../namespaces/BuiltIn/classes/SSR.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:201](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L201)

SSR 이펙트 인스턴스를 반환합니다.

##### Returns

[`SSR`](../namespaces/BuiltIn/classes/SSR.md)

`SSR` 인스턴스

***

***

### useBloom

#### Get Signature

> **get** **useBloom**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:322](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L322)

Bloom 활성화 여부입니다.

##### Returns

`boolean`

Bloom 활성화 여부

#### Set Signature

> **set** **useBloom**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:326](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L326)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useChromaticAberration

#### Get Signature

> **get** **useChromaticAberration**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:392](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L392)

ChromaticAberration 활성화 여부입니다.

##### Returns

`boolean`

ChromaticAberration 활성화 여부

#### Set Signature

> **set** **useChromaticAberration**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:396](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L396)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useDOF

#### Get Signature

> **get** **useDOF**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:287](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L287)

DOF(Depth of Field) 활성화 여부입니다.

##### Returns

`boolean`

DOF 활성화 여부

#### Set Signature

> **set** **useDOF**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:291](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L291)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useFilmGrain

#### Get Signature

> **get** **useFilmGrain**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:497](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L497)

FilmGrain 활성화 여부입니다.

##### Returns

`boolean`

FilmGrain 활성화 여부

#### Set Signature

> **set** **useFilmGrain**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:501](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L501)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useFog

#### Get Signature

> **get** **useFog**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:217](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L217)

Fog 활성화 여부입니다.

##### Returns

`boolean`

Fog 활성화 여부

#### Set Signature

> **set** **useFog**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:221](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L221)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useHeightFog

#### Get Signature

> **get** **useHeightFog**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:252](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L252)

HeightFog 활성화 여부입니다.

##### Returns

`boolean`

HeightFog 활성화 여부

#### Set Signature

> **set** **useHeightFog**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:256](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L256)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useLensDistortion

#### Get Signature

> **get** **useLensDistortion**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:427](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L427)

LensDistortion 활성화 여부입니다.

##### Returns

`boolean`

LensDistortion 활성화 여부

#### Set Signature

> **set** **useLensDistortion**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:431](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L431)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useLensFlare

#### Get Signature

> **get** **useLensFlare**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:357](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L357)

LensFlare 활성화 여부입니다.

##### Returns

`boolean`

LensFlare 활성화 여부

#### Set Signature

> **set** **useLensFlare**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:361](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L361)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useSSAO

#### Get Signature

> **get** **useSSAO**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:147](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L147)

SSAO(Screen Space Ambient Occlusion) 활성화 여부입니다.

##### Returns

`boolean`

SSAO 활성화 여부

#### Set Signature

> **set** **useSSAO**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:151](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L151)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useSSR

#### Get Signature

> **get** **useSSR**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:182](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L182)

SSR(Screen Space Reflection) 활성화 여부입니다.

##### Returns

`boolean`

SSR 활성화 여부

#### Set Signature

> **set** **useSSR**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:186](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L186)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### useVignetting

#### Get Signature

> **get** **useVignetting**(): `boolean` = `false`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:462](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L462)

Vignetting 활성화 여부입니다.

##### Returns

`boolean`

Vignetting 활성화 여부

#### Set Signature

> **set** **useVignetting**(`value`): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:466](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L466)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `boolean` |

##### Returns

`void`

***

***

### videoMemorySize

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **videoMemorySize**(): `number`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:531](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L531)

생성된 모든 빌트인 이펙트들의 총 비디오 메모리 사용량(바이트)을 반환합니다.

##### Returns

`number`

비디오 메모리 사용량 (단위: 바이트)

***

***

### view

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **view**(): [`View3D`](../../Display/classes/View3D.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:87](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L87)

연결된 `View3D` 인스턴스를 반환합니다.

##### Returns

[`View3D`](../../Display/classes/View3D.md)

`View3D` 인스턴스

***

***

### vignetting

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **vignetting**(): [`Vignetting`](../namespaces/BuiltIn/classes/Vignetting.md)

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:481](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L481)

Vignetting 이펙트 인스턴스를 반환합니다.

##### Returns

[`Vignetting`](../namespaces/BuiltIn/classes/Vignetting.md)

`Vignetting` 인스턴스

## Methods



***

### clear()

> **clear**(): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:540](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L540)

생성된 모든 빌트인 이펙트들의 캐시된 리소스를 비웁니다.

#### Returns

`void`

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:559](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L559)

생성된 모든 빌트인 이펙트 및 자동 노출 리소스를 파기합니다.

#### Returns

`void`

***

***

### getPreExposure()

> **getPreExposure**(): `number`

Defined in: [src/postEffect/builtIn/BuiltInEffectManager.ts:126](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/postEffect/builtIn/BuiltInEffectManager.ts#L126)

불필요한 GPU 버퍼 지연 생성을 방지하면서 현재 뷰의 사전 노출 배율(`preExposure`)을 계산하여 반환합니다.

#### Returns

`number`

사전 노출 배율

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### antialiasingManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **antialiasingManager**(): [`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

Defined in: [src/base/RedGPUObject.ts:80](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L80)

안티앨리어싱 설정을 관리하는 `AntialiasingManager` 인스턴스를 반환합니다.

##### Returns

[`AntialiasingManager`](../../Antialiasing/classes/AntialiasingManager.md)

`AntialiasingManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`antialiasingManager`](../../BaseObject/classes/RedGPUObject.md#antialiasingmanager)

***

***

### commandEncoderManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **commandEncoderManager**(): [`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

Defined in: [src/base/RedGPUObject.ts:92](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L92)

WebGPU 커맨드 인코딩을 관리하는 `CommandEncoderManager` 인스턴스를 반환합니다.

##### Returns

[`CommandEncoderManager`](../../CommandEncoderManager/classes/CommandEncoderManager.md)

`CommandEncoderManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`commandEncoderManager`](../../BaseObject/classes/RedGPUObject.md#commandencodermanager)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/base/RedGPUObject.ts:56](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L56)

컨텍스트에 할당된 논리적 WebGPU 디바이스(`GPUDevice`)를 반환합니다.

##### Returns

`GPUDevice`

`GPUDevice` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`gpuDevice`](../../BaseObject/classes/RedGPUObject.md#gpudevice)

***

***

### instanceId

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **instanceId**(): `number`

Defined in: [src/base/BaseObject.ts:36](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L36)

클래스별로 순차 부여되는 고유 인스턴스 번호를 반환합니다.

##### Returns

`number`

클래스별 고유 인스턴스 번호

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`instanceId`](../../BaseObject/classes/RedGPUObject.md#instanceid)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`name`](../../BaseObject/classes/RedGPUObject.md#name)

***

***

### redGPUContext

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **redGPUContext**(): [`RedGPUContext`](../../Context/classes/RedGPUContext.md)

Defined in: [src/base/RedGPUObject.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L44)

바인딩된 `RedGPUContext` 인스턴스를 반환합니다.

##### Returns

[`RedGPUContext`](../../Context/classes/RedGPUContext.md)

`RedGPUContext` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`redGPUContext`](../../BaseObject/classes/RedGPUObject.md#redgpucontext)

***

***

### resourceManager

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManager**(): [`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

Defined in: [src/base/RedGPUObject.ts:68](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/RedGPUObject.ts#L68)

전역 GPU 리소스를 관리하는 `ResourceManager` 인스턴스를 반환합니다.

##### Returns

[`ResourceManager`](../../Resource/namespaces/Core/classes/ResourceManager.md)

`ResourceManager` 인스턴스

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`resourceManager`](../../BaseObject/classes/RedGPUObject.md#resourcemanager)

***

***

### uuid

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **uuid**(): `string`

Defined in: [src/base/BaseObject.ts:48](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/base/BaseObject.ts#L48)

객체의 고유 식별자(UUID)를 반환합니다.

##### Returns

`string`

객체의 UUID 문자열

#### Inherited from

[`RedGPUObject`](../../BaseObject/classes/RedGPUObject.md).[`uuid`](../../BaseObject/classes/RedGPUObject.md#uuid)

***

</details>
