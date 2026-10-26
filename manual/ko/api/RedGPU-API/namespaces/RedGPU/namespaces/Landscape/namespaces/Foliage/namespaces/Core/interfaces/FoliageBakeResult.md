[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageBakeResult

# Interface: FoliageBakeResult

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L17)

식생 메시를 팔면체 임포스터(Octahedral Impostor)로 베이킹한 결과 데이터 인터페이스입니다.

## Properties

### baseColorTexture

> **baseColorTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L22)

베이킹된 베이스 컬러(Base Color) 아틀라스 텍스처

***

### bottomOffset

> **bottomOffset**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:52](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L52)

모델 바닥면의 Y축 오프셋

***

### depth

> **depth**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:47](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L47)

바운딩 박스 깊이 (월드 단위)

***

### height

> **height**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:42](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L42)

바운딩 박스 높이 (월드 단위)

***

### normalTexture

> **normalTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L27)

베이킹된 월드 공간 노멀(Normal) 아틀라스 텍스처

***

### packedORMTexture

> **packedORMTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L32)

베이킹된 패킹 ORM(Occlusion/Roughness/Metallic) 아틀라스 텍스처

***

### width

> **width**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L37)

바운딩 박스 가로 폭 (월드 단위)
