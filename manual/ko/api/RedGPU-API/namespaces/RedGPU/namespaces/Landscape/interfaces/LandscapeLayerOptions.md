[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Landscape](../README.md) / LandscapeLayerOptions

# Interface: LandscapeLayerOptions

Defined in: [src/landscape/LandscapeLayer.ts:21](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L21)

`LandscapeLayer` 생성 시 전달하는 설정 옵션 인터페이스입니다.

## Properties

### aoIntensity?

> `optional` **aoIntensity?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:88](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L88)

앰비언트 오클루전(AO) 강도 (기본값: `1.0`)

***

### baseColorTexture?

> `optional` **baseColorTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:36](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L36)

베이스 컬러(BaseColor) 텍스처 인스턴스 또는 이미지 URL

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:31](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L31)

레이어 활성화 여부 (기본값: `true`)

***

### heightBlendFactor?

> `optional` **heightBlendFactor?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:93](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L93)

높이 기반 레이어 블렌딩 대비 계수 (범위: `0.0 ~ 5.0`, 기본값: `1.0`)

***

### name

> **name**: `string`

Defined in: [src/landscape/LandscapeLayer.ts:26](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L26)

레이어의 고유 이름

***

### nearUVScaleMultiplier?

> `optional` **nearUVScaleMultiplier?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:67](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L67)

근접 디테일 영역에 적용되는 UV 스케일 배율 (기본값: `2.0`)

***

### normalIntensity?

> `optional` **normalIntensity?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:83](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L83)

노멀 맵 강도 (기본값: `1.0`)

***

### normalTexture?

> `optional` **normalTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:41](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L41)

노멀(Normal) 텍스처 인스턴스 또는 이미지 URL

***

### ormTexture?

> `optional` **ormTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:46](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L46)

ORM(Occlusion, Roughness, Metallic) 텍스처 인스턴스 또는 이미지 URL

***

### roughness?

> `optional` **roughness?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:78](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L78)

표면 거칠기(Roughness) 계수 (기본값: `1.0`)

***

### stochasticScale?

> `optional` **stochasticScale?**: `number`

Defined in: [src/landscape/LandscapeLayer.ts:103](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L103)

스토캐스틱 타일링 셀 스케일 (최솟값: `0.01`, 기본값: `1.0`)

***

### stochasticTiling?

> `optional` **stochasticTiling?**: `boolean`

Defined in: [src/landscape/LandscapeLayer.ts:98](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L98)

반복 패턴 억제를 위한 스토캐스틱 타일링(Stochastic Tiling) 사용 여부 (기본값: `true`)

***

### uvOffset?

> `optional` **uvOffset?**: \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:62](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L62)

텍스처 UV 오프셋 `[u, v]` (기본값: `[0.0, 0.0]`)

***

### uvScale?

> `optional` **uvScale?**: \[`number`, `number`\]

Defined in: [src/landscape/LandscapeLayer.ts:57](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L57)

텍스처 UV 타일링 스케일 `[u, v]` (기본값: `[20.0, 20.0]`)

***

### weightChannel?

> `optional` **weightChannel?**: [`LandscapeWeightMapChannel`](../type-aliases/LandscapeWeightMapChannel.md)

Defined in: [src/landscape/LandscapeLayer.ts:72](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L72)

가중치 텍스처에서 참조할 색상 채널 (기본값: `'R'`)

***

### weightTexture?

> `optional` **weightTexture?**: `string` \| [`BitmapTexture`](../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/LandscapeLayer.ts:51](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/LandscapeLayer.ts#L51)

스플래팅 가중치(Weight) 텍스처 인스턴스 또는 이미지 URL (지형 전체에서 단일 RGBA 가중치 맵 1장을 공유하여 `weightChannel`로 R/G/B/A 채널을 참조합니다)
