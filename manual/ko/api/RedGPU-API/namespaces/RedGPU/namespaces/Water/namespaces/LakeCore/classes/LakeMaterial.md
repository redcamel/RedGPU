[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Water](../../../README.md) / [LakeCore](../README.md) / LakeMaterial

# Class: LakeMaterial

Defined in: [src/water/lakeCore/LakeMaterial.ts:19](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L19)

호수 수면의 굴절, 수심 감쇠, 수중 커스틱 및 스크린 스페이스 반사(SSR)를 표현하는 재질 클래스입니다.

`Lake` 인스턴스 생성 시 내부적으로 자동 생성됩니다.

::: warning
이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
:::

***

### Example
```typescript
// 올바른 접근 방법
const lake = new RedGPU.Water.Lake(redGPUContext);
const material = lake.material;
```

<iframe src="https://redcamel.github.io/RedGPU/examples/3d/water/lake/lakeMaterial/" style="width:100%; height:500px;"></iframe>

## See

- [Basic lake example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/basicLake/)
 - [Lake material example](https://redcamel.github.io/RedGPU/examples/3d/water/lake/lakeMaterial/)

## Extends

- [`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md)

## Constructors



***

### Constructor

> **new LakeMaterial**(`redGPUContext`, `baseColor?`, `deepColor?`, `opacity?`): `LakeMaterial`

Defined in: [src/water/lakeCore/LakeMaterial.ts:226](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L226)

`LakeMaterial` 인스턴스를 생성합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `redGPUContext` | [`RedGPUContext`](../../../../Context/classes/RedGPUContext.md) | `undefined` | `RedGPUContext` 인스턴스 |
| `baseColor?` | `string` | `'#18d8b6'` | 얕은 수면 색상 HEX 문자열 (기본값: `'#18d8b6'`) |
| `deepColor?` | `string` | `'#065279'` | 깊은 수심 색상 HEX 문자열 (기본값: `'#065279'`) |
| `opacity?` | `number` | `1.0` | 수면 불투명도 (범위: `0` ~ `1`, 기본값: `1.0`) |

#### Returns

`LakeMaterial`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`constructor`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#constructor)

## Properties



***

### baseColor

> **baseColor**: [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L24)

얕은 수면의 기본 색상입니다. (기본값: `'#18d8b6'`)

***

***

### causticsScale

> **causticsScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:134](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L134)

수중 커스틱 패턴 크기 배율입니다. (범위: `0.1` ~ `5`, 기본값: `1.0`)

***

***

### causticsSpeed

> **causticsSpeed**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:139](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L139)

수중 커스틱 애니메이션 속도입니다. (범위: `0` ~ `5`, 기본값: `1.0`)

***

***

### causticsStrength

> **causticsStrength**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:129](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L129)

수중 커스틱 강도입니다. (범위: `0` ~ `2`, 기본값: `1.0`)

***

***

### debugMaxDepth

> **debugMaxDepth**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:114](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L114)

깊이 디버그 시각화의 기준 최대 수심입니다. (기본값: `5.0`)

***

***

### debugMode

> **debugMode**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:109](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L109)

디버그 시각화 모드입니다. (기본값: `0`)

***

***

### deepColor

> **deepColor**: [`ColorRGB`](../../../../Color/classes/ColorRGB.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:29](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L29)

깊은 수심의 색상입니다. (기본값: `'#065279'`)

***

***

### depthFadeDistance

> **depthFadeDistance**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:94](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L94)

물가 경계가 투명하게 페이드되는 수심 거리입니다. (기본값: `0.8`)

***

***

### enableSSR

> **enableSSR**: `boolean`

Defined in: [src/water/lakeCore/LakeMaterial.ts:144](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L144)

스크린 스페이스 반사(SSR) 활성화 여부입니다. (기본값: `true`)

***

***

### extinctionFactor

> **extinctionFactor**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L84)

수심 증가에 따른 빛 감쇠 계수입니다. (기본값: `0.22`)

***

***

### flowRateScale

> **flowRateScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L74)

노멀 텍스처의 흐름 속도 배율입니다. (기본값: `0.025`)

***

***

### invertNormalDetailY

> **invertNormalDetailY**: `boolean`

Defined in: [src/water/lakeCore/LakeMaterial.ts:124](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L124)

디테일 노멀 텍스처의 Y 채널 반전 여부입니다. (기본값: `false`)

***

***

### invertNormalY

> **invertNormalY**: `boolean`

Defined in: [src/water/lakeCore/LakeMaterial.ts:119](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L119)

기본 노멀 텍스처의 Y 채널 반전 여부입니다. (기본값: `false`)

***

***

### normalDetailScale

> **normalDetailScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:59](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L59)

디테일 노멀 텍스처의 강도입니다. (범위: `0` ~ `1`, 기본값: `0.5`)

***

***

### normalDetailTexture

> **normalDetailTexture**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:44](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L44)

미세 물결을 표현하는 디테일 노멀 텍스처입니다.

***

***

### normalDetailTiling

> **normalDetailTiling**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L69)

월드 `100m` 기준 디테일 노멀 텍스처의 타일링 반복 횟수입니다. (기본값: `40.0`)

***

***

### normalScale

> **normalScale**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L54)

기본 노멀 텍스처의 강도입니다. (범위: `0` ~ `1`, 기본값: `1.0`)

***

***

### normalTexture

> **normalTexture**: [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:34](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L34)

수면 굴곡을 표현하는 기본 노멀 텍스처입니다.

***

***

### normalTextureSampler

> **normalTextureSampler**: [`Sampler`](../../../../Resource/classes/Sampler.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:39](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L39)

노멀 텍스처 샘플러입니다.

***

***

### normalTiling

> **normalTiling**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L64)

월드 `100m` 기준 기본 노멀 텍스처의 타일링 반복 횟수입니다. (기본값: `20.0`)

***

***

### refractionStrength

> **refractionStrength**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L79)

수중 배경의 굴절 왜곡 강도입니다. (범위: `0` ~ `1`, 기본값: `1.0`)

***

***

### rippleDomainCenter

> **rippleDomainCenter**: \[`number`, `number`\]

Defined in: [src/water/lakeCore/LakeMaterial.ts:169](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L169)

상호작용 리플 도메인의 월드 XZ 중심 좌표입니다. (기본값: `[0.0, 0.0]`)

***

***

### rippleDomainSize

> **rippleDomainSize**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:174](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L174)

상호작용 리플 도메인의 월드 단위 한 변 크기입니다. (최소값: `1.0`, 기본값: `20.0`)

***

***

### rippleNormalStrength

> **rippleNormalStrength**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:179](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L179)

상호작용 리플이 수면 노멀에 반영되는 강도입니다. (최소값: `0.0`, 기본값: `1.0`)

***

***

### rippleTexture

> **rippleTexture**: `GPUTexture` \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md) \| [`DirectTexture`](../../../../Resource/classes/DirectTexture.md)

Defined in: [src/water/lakeCore/LakeMaterial.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L49)

상호작용 파동 시뮬레이션 결과가 저장된 리플 노멀 텍스처입니다.

***

***

### roughness

> **roughness**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:99](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L99)

수면 거칠기입니다. (범위: `0` ~ `1`, 기본값: `0.07`)

***

***

### specularFactor

> **specularFactor**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:104](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L104)

스페큘러 반사 강도입니다. (범위: `0` ~ `2`, 기본값: `1.0`)

***

***

### ssrMaxDistance

> **ssrMaxDistance**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:149](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L149)

SSR 레이 마칭 최대 추적 거리입니다. (범위: `2` ~ `300`, 기본값: `100.0`)

***

***

### ssrStepCount

> **ssrStepCount**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:154](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L154)

SSR 레이 마칭 단계 수입니다. (기본값: `64`)

***

***

### ssrThickness

> **ssrThickness**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:159](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L159)

SSR 교차 판정 깊이 두께입니다. (범위: `0.05` ~ `5`, 기본값: `1.0`)

***

***

### turbidity

> **turbidity**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:164](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L164)

물의 탁도입니다. (범위: `0` ~ `1`, 기본값: `0.35`)

***

## Accessors



## Methods



***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### \_\_packingList

> **\_\_packingList**: `any`[]

Defined in: [src/material/core/ABitmapBaseMaterial.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L24)

프래그먼트 상태 갱신 시 실행되는 텍스처 패킹 콜백 함수 목록

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__packingList`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__packinglist)

***

***

### dirtyPipeline

> **dirtyPipeline**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:74](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L74)

파이프라인 갱신 필요 여부 플래그

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`dirtyPipeline`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#dirtypipeline)

***

***

### gpuRenderInfo

> **gpuRenderInfo**: [`FragmentGPURenderInfo`](../../../../Material/namespaces/Core/classes/FragmentGPURenderInfo.md)

Defined in: [src/material/core/ABaseMaterial.ts:69](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L69)

프래그먼트 GPU 렌더 파이프라인 정보 객체

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuRenderInfo`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#gpurenderinfo)

***

***

### isInstanceofMaterial

> **isInstanceofMaterial**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L42)

머티리얼 인스턴스 여부 플래그

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`isInstanceofMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#isinstanceofmaterial)

***

***

### opacity

> **opacity**: `number`

Defined in: [src/water/lakeCore/LakeMaterial.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/water/lakeCore/LakeMaterial.ts#L89)

수면 불투명도입니다. (범위: `0` ~ `1`, 기본값: `1.0`)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`opacity`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#opacity)

***

***

### tint

> **tint**: [`ColorRGBA`](../../../../Color/classes/ColorRGBA.md)

Defined in: [src/material/core/ABaseMaterial.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L32)

머티리얼의 틴트 컬러 (ColorRGBA)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`tint`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#tint)

***

***

### transparent

> **transparent**: `boolean` = `false`

Defined in: [src/material/core/ABaseMaterial.ts:79](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L79)

머티리얼 투명 렌더링 활성화 여부

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`transparent`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#transparent)

***

***

### use2PathRender

> **use2PathRender**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:64](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L64)

2패스 렌더링 사용 여부

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`use2PathRender`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#use2pathrender)

***

***

### useTint

> **useTint**: `boolean`

Defined in: [src/material/core/ABaseMaterial.ts:37](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L37)

틴트 컬러 적용 여부

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`useTint`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#usetint)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`antialiasingManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#antialiasingmanager)

***

***

### blendAlphaState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendAlphaState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:277](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L277)

알파 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

알파 BlendState 인스턴스

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendAlphaState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#blendalphastate)

***

***

### blendColorState

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **blendColorState**(): [`BlendState`](../../../../RenderState/classes/BlendState.md)

Defined in: [src/material/core/ABaseMaterial.ts:265](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L265)

컬러 블렌드 상태 객체를 반환합니다.

##### Returns

[`BlendState`](../../../../RenderState/classes/BlendState.md)

컬러 BlendState 인스턴스

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`blendColorState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#blendcolorstate)

***

***

### cacheKey

#### Get Signature

> **get** **cacheKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:61](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L61)

캐시 키를 반환하거나 설정합니다.

##### Returns

`string`

캐시 키 문자열

#### Set Signature

> **set** **cacheKey**(`value`): `void`

Defined in: [src/resources/core/ResourceBase.ts:65](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L65)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`cacheKey`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#cachekey)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`commandEncoderManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#commandencodermanager)

***

***

### FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_BIND\_GROUP\_DESCRIPTOR\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:217](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L217)

프래그먼트 바인드 그룹 디스크립터 이름을 반환합니다.

##### Returns

`string`

바인드 그룹 디스크립터 이름

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_BIND_GROUP_DESCRIPTOR_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_bind_group_descriptor_name)

***

***

### FRAGMENT\_SHADER\_MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **FRAGMENT\_SHADER\_MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:205](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L205)

프래그먼트 셰이더 모듈 이름을 반환합니다.

##### Returns

`string`

프래그먼트 셰이더 모듈 이름

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`FRAGMENT_SHADER_MODULE_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#fragment_shader_module_name)

***

***

### globalFragmentSlotIndex

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **globalFragmentSlotIndex**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:305](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L305)

글로벌 프래그먼트 SSBO 내 할당된 슬롯 인덱스를 반환합니다.

##### Returns

`number`

할당된 슬롯 인덱스 (미할당 시 `-1`)

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`globalFragmentSlotIndex`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#globalfragmentslotindex)

***

***

### gpuDevice

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **gpuDevice**(): `GPUDevice`

Defined in: [src/resources/core/ResourceBase.ts:89](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L89)

연관된 GPUDevice를 반환합니다.

##### Returns

`GPUDevice`

GPUDevice 인스턴스

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`gpuDevice`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#gpudevice)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`instanceId`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#instanceid)

***

***

### MODULE\_NAME

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **MODULE\_NAME**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:193](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L193)

머티리얼 모듈 이름을 반환합니다.

##### Returns

`string`

모듈 이름

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`MODULE_NAME`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#module_name)

***

***

### name

#### Get Signature

> **get** **name**(): `string`

Defined in: [src/base/BaseObject.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L63)

객체의 이름을 반환하거나 설정합니다. 미설정 시 기본 이름(`ClassName Instance N`)을 반환합니다.

##### Returns

`string`

객체 이름 문자열

#### Set Signature

> **set** **name**(`value`): `void`

Defined in: [src/base/BaseObject.ts:70](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/base/BaseObject.ts#L70)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `string` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`name`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#name)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`redGPUContext`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#redgpucontext)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManager`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanager)

***

***

### resourceManagerKey

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **resourceManagerKey**(): `string`

Defined in: [src/resources/core/ResourceBase.ts:77](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L77)

리소스 매니저 키를 반환합니다.

##### Returns

`string`

리소스 매니저 키 문자열

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`resourceManagerKey`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#resourcemanagerkey)

***

***

### revision

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **revision**(): `number`

Defined in: [src/resources/core/ResourceBase.ts:49](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L49)

리소스의 리비전(업데이트 횟수)을 반환합니다.

##### Returns

`number`

리소스 리비전 번호

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`revision`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#revision)

***

***

### SHADER\_INFO

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **SHADER\_INFO**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:241](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L241)

파싱된 WGSL 셰이더 전체 정보를 반환합니다.

##### Returns

`any`

파싱된 셰이더 정보 객체

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`SHADER_INFO`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#shader_info)

***

***

### STORAGE\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **STORAGE\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:229](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L229)

파싱된 셰이더 스토리지 구조체 정보를 반환합니다.

##### Returns

`any`

스토리지 구조체 정보

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`STORAGE_STRUCT`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#storage_struct)

***

***

### tintBlendMode

#### Get Signature

> **get** **tintBlendMode**(): `string`

Defined in: [src/material/core/ABaseMaterial.ts:160](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L160)

현재 설정된 틴트 블렌드 모드의 키 이름을 반환하거나 새로운 모드를 설정합니다.

##### Throws

유효하지 않은 틴트 블렌드 모드 값 또는 키가 지정된 경우 Error 발생

##### Returns

`string`

틴트 블렌드 모드 키 문자열 (예: `'MULTIPLY'`)

#### Set Signature

> **set** **tintBlendMode**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:168](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L168)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `"COLOR"` \| `"NORMAL"` \| `"SUBTRACT"` \| `"MULTIPLY"` \| `"LIGHTEN"` \| `"SCREEN"` \| `"LINEAR_DODGE"` \| `"DARKEN"` \| `"OVERLAY"` \| `"COLOR_DODGE"` \| `"COLOR_BURN"` \| `"HARD_LIGHT"` \| `"SOFT_LIGHT"` \| `"DIFFERENCE"` \| `"EXCLUSION"` \| `"DIVIDE"` \| `"VIVID_LIGHT"` \| `"LINEAR_BURN"` \| `"PIN_LIGHT"` \| `"SATURATION"` \| `"HUE"` \| `"LUMINOSITY"` \| `"NEGATION"` \| [`TINT_BLEND_MODE`](../../../../Material/type-aliases/TINT_BLEND_MODE.md) |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`tintBlendMode`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#tintblendmode)

***

***

### UNIFORM\_STRUCT

#### Get Signature

> <span class="readonly-badge">readonly</span> **get** **UNIFORM\_STRUCT**(): `any`

Defined in: [src/material/core/ABaseMaterial.ts:253](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L253)

파싱된 셰이더 유니폼 구조체 정보를 반환합니다.

##### Returns

`any`

유니폼 구조체 정보

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`UNIFORM_STRUCT`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#uniform_struct)

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

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`uuid`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#uuid)

***

***

### writeMaskState

#### Get Signature

> **get** **writeMaskState**(): `number`

Defined in: [src/material/core/ABaseMaterial.ts:289](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L289)

컬러 쓰기 마스크(GPUColorWrite) 상태를 반환하거나 설정합니다.

##### Returns

`number`

GPUFlagsConstant 값

#### Set Signature

> **set** **writeMaskState**(`value`): `void`

Defined in: [src/material/core/ABaseMaterial.ts:293](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L293)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | `number` |

##### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`writeMaskState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#writemaskstate)

</details>


***

## 상속받은 메서드

<details>
<summary>상속받은 메서드 보기 (클릭하여 확장)</summary>

### \_\_addDirtyPipelineListener()

> **\_\_addDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:102](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L102)

리소스 변경 시 호출될 파이프라인 더티 리스너를 추가합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 등록할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__addDirtyPipelineListener`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__adddirtypipelinelistener)

***

***

### \_\_removeDirtyPipelineListener()

> **\_\_removeDirtyPipelineListener**(`listener`): `void`

Defined in: [src/resources/core/ResourceBase.ts:115](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L115)

등록된 파이프라인 더티 리스너를 제거합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `listener` | () => `void` | 제거할 리스너 함수 |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`__removeDirtyPipelineListener`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#__removedirtypipelinelistener)

***

***

### \_updateBaseProperty()

> **\_updateBaseProperty**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:461](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L461)

머티리얼의 기본 속성(유니폼, 컬러, 틴트 등)을 유니폼 버퍼 및 글로벌 SSBO에 동기화합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateBaseProperty`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#_updatebaseproperty)

***

***

### \_updateFragmentState()

> **\_updateFragmentState**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:357](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L357)

셰이더 바리안트를 점검하고 프래그먼트 바인드 그룹 및 렌더 상태를 갱신합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`_updateFragmentState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#_updatefragmentstate)

***

***

### destroy()

> **destroy**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:510](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L510)

머티리얼 인스턴스를 파기하고 할당된 유니폼 버퍼 및 글로벌 프래그먼트 슬롯을 해제합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`destroy`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#destroy)

***

***

### getFragmentRenderState()

> **getFragmentRenderState**(`entryPoint?`): `GPUFragmentState`

Defined in: [src/material/core/ABaseMaterial.ts:430](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L430)

GPU 프래그먼트 렌더 상태(GPUFragmentState) 객체를 생성하여 반환합니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `entryPoint?` | `string` | `'main'` | 프래그먼트 셰이더 엔트리 포인트 함수 이름 (기본값: `'main'`) |

#### Returns

`GPUFragmentState`

구성된 GPUFragmentState 객체

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`getFragmentRenderState`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#getfragmentrenderstate)

***

***

### getGPUResourceSampler()

> **getGPUResourceSampler**(`sampler`): `GPUSampler`

Defined in: [src/material/core/ABaseMaterial.ts:502](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L502)

Sampler 인스턴스로부터 GPUSampler를 반환하며, 없을 경우 기본 GPUSampler를 반환합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `sampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | Sampler 인스턴스 |

#### Returns

`GPUSampler`

GPUSampler 인스턴스

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`getGPUResourceSampler`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#getgpuresourcesampler)

***

***

### initGPURenderInfos()

> **initGPURenderInfos**(): `void`

Defined in: [src/material/core/ABaseMaterial.ts:313](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABaseMaterial.ts#L313)

GPU 프래그먼트 렌더 파이프라인 정보와 유니폼 버퍼를 초기화합니다.

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`initGPURenderInfos`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#initgpurenderinfos)

***

***

### notifyUpdate()

> **notifyUpdate**(`resetList?`): `void`

Defined in: [src/resources/core/ResourceBase.ts:131](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/resources/core/ResourceBase.ts#L131)

리소스가 업데이트되었음을 등록된 리스너들에게 알립니다.

#### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `resetList?` | `boolean` | `false` | 알림 실행 후 리스너 목록 초기화 여부 (기본값: false) |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`notifyUpdate`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#notifyupdate)

***

***

### updateSampler()

> **updateSampler**(`prevSampler`, `newSampler`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:80](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L80)

샘플러 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | 이전에 바인딩된 Sampler 인스턴스 |
| `newSampler` | [`Sampler`](../../../../Resource/classes/Sampler.md) | 새로 바인딩할 Sampler 인스턴스 |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateSampler`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#updatesampler)

***

***

### updateTexture()

> **updateTexture**(`prevTexture`, `texture`): `void`

Defined in: [src/material/core/ABitmapBaseMaterial.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/core/ABitmapBaseMaterial.ts#L63)

텍스처 변경에 따른 파이프라인 더티 리스너를 교체하고 프래그먼트 상태를 갱신합니다.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `prevTexture` | `any` | 이전에 바인딩된 텍스처 객체 |
| `texture` | `any` | 새로 바인딩할 텍스처 객체 |

#### Returns

`void`

#### Inherited from

[`ABitmapBaseMaterial`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md).[`updateTexture`](../../../../Material/namespaces/Core/classes/ABitmapBaseMaterial.md#updatetexture)

</details>
