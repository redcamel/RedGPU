[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Landscape](../../../README.md) / [Grass](../README.md) / GrassOptions

# Interface: GrassOptions

Defined in: [src/landscape/grass/core/Grass.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L18)

잔디(`Grass`) 타입 생성 및 초기화를 위한 설정 옵션 인터페이스입니다.

## Extends

- [`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md)

## Properties



***

### alphaCutoff?

> `optional` **alphaCutoff?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L43)

알파 컷오프 임계값 (`0.01` ~ `1.0`, 기본값: `0.2`)

***

***

### baseColorTexture?

> `optional` **baseColorTexture?**: `string` \| [`BitmapTexture`](../../../../Resource/classes/BitmapTexture.md)

Defined in: [src/landscape/grass/core/Grass.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L28)

잔디 베이스 컬러 텍스처 경로 문자열 또는 `BitmapTexture` 인스턴스

***

***

### exposureBoost?

> `optional` **exposureBoost?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:63](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L63)

밝기 노출 부스트 배율 (기본값: `1.0`)

***

***

### maxInstances?

> `optional` **maxInstances?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:83](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L83)

할당할 최대 인스턴스 수용량

***

***

### maxScale?

> `optional` **maxScale?**: \[`number`, `number`\] \| \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L38)

인스턴스 랜덤 스케일 최댓값 `[width, height]` 또는 `[x, y, z]` (기본값: `[1.3, 1.4]`)

***

***

### mesh

> **mesh**: [`Mesh`](../../../../Display/classes/Mesh.md)

Defined in: [src/landscape/grass/core/Grass.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L23)

잔디 블레이드 지오메트리 및 재질을 추출할 원본 `Mesh` 인스턴스

***

***

### minScale?

> `optional` **minScale?**: \[`number`, `number`\] \| \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L33)

인스턴스 랜덤 스케일 최솟값 `[width, height]` 또는 `[x, y, z]` (기본값: `[0.7, 0.7]`)

***

***

### minY?

> `optional` **minY?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:68](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L68)

메시 로컬 바운딩 최소 Y 오프셋 (미지정 시 메시 지오메트리로부터 자동 계산)

***

***

### receiveShadow?

> `optional` **receiveShadow?**: `boolean`

Defined in: [src/landscape/grass/core/Grass.ts:73](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L73)

잔디 표면의 그림자 수신 여부 (기본값: `true`)

***

***

### roughness?

> `optional` **roughness?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L48)

표면 거칠기(Roughness) 계수 (`0.04` ~ `1.0`, 기본값: `0.55`)

***

***

### shadowStrength?

> `optional` **shadowStrength?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L78)

수신된 그림자의 어두움 강도 (`0.0` ~ `1.0`, 기본값: `1.0`)

***

***

### subsurfaceColor?

> `optional` **subsurfaceColor?**: \[`number`, `number`, `number`\]

Defined in: [src/landscape/grass/core/Grass.ts:58](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L58)

서브서피스 스캐터링 RGB 색상 `[r, g, b]` (`0.0` ~ `1.0`, 기본값: `[0.35, 0.65, 0.15]`)

***

***

### subsurfaceStrength?

> `optional` **subsurfaceStrength?**: `number`

Defined in: [src/landscape/grass/core/Grass.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/grass/core/Grass.ts#L53)

서브서피스 스캐터링(Subsurface Scattering) 투과 강도 (`0.0` ~ `3.0`, 기본값: `0.25`)

***

***

## 상속받은 속성

<details>
<summary>상속받은 속성 보기 (클릭하여 확장)</summary>

### bottomOffset?

> `optional` **bottomOffset?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:36](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L36)

지형 표면 대비 인스턴스 하단 높이 오프셋 (기본값: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`bottomOffset`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#bottomoffset)

***

***

### castShadow?

> `optional` **castShadow?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L48)

디렉셔널 라이트 그림자 투사 활성화 여부 (기본값: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`castShadow`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#castshadow)

***

***

### cullingDistance?

> `optional` **cullingDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:24](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L24)

카메라로부터 인스턴스가 컬링되는 최대 가시 거리 (기본값: `200.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`cullingDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#cullingdistance)

***

***

### densityMultiplier?

> `optional` **densityMultiplier?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:84](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L84)

기준 밀도에 곱해지는 밀도 배율 (기본값: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityMultiplier`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densitymultiplier)

***

***

### densityPerHectare?

> `optional` **densityPerHectare?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:78](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L78)

헥타르(10,000㎡)당 기준 배치 밀도 (기본값: `1000.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityPerHectare`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityperhectare)

***

***

### densityScaleByWeight?

> `optional` **densityScaleByWeight?**: `boolean`

Defined in: [src/landscape/core/scatter/AScatterType.ts:72](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L72)

레이어 가중치에 비례하여 인스턴스 스케일을 조절할지 여부 (기본값: `true`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`densityScaleByWeight`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#densityscalebyweight)

***

***

### groundBlendStrength?

> `optional` **groundBlendStrength?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:90](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L90)

지형 표면 색상 및 법선과의 하단 블렌딩 강도 (`0.0`~`1.0`, 기본값: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`groundBlendStrength`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#groundblendstrength)

***

***

### height?

> `optional` **height?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:42](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L42)

인스턴스의 기준 높이 (기본값: `1.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`height`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#height)

***

***

### maxSlope?

> `optional` **maxSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:66](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L66)

인스턴스가 배치될 수 있는 최대 지형 경사각 (단위: 도, 기본값: `45.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`maxSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#maxslope)

***

***

### minSlope?

> `optional` **minSlope?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:60](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L60)

인스턴스가 배치될 수 있는 최소 지형 경사각 (단위: 도, 기본값: `0.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`minSlope`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#minslope)

***

***

### name

> **name**: `string`

Defined in: [src/landscape/core/scatter/AScatterType.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L18)

스캐터 타입의 고유 식별 이름

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`name`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#name)

***

***

### shadowCullDistance?

> `optional` **shadowCullDistance?**: `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:30](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L30)

그림자 패스에서 인스턴스가 컬링되는 최대 거리 (기본값: `50.0`)

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`shadowCullDistance`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#shadowculldistance)

***

***

### targetLayer?

> `optional` **targetLayer?**: `string` \| `number`

Defined in: [src/landscape/core/scatter/AScatterType.ts:54](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/scatter/AScatterType.ts#L54)

배치 밀도를 참조할 대상 지형 레이어의 이름 또는 인덱스

#### Inherited from

[`AScatterTypeInitOptions`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md).[`targetLayer`](../../Core/namespaces/Scatter/interfaces/AScatterTypeInitOptions.md#targetlayer)

</details>
