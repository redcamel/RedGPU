[**RedGPU API v4.5.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Foliage](../../../README.md) / [Core](../README.md) / FoliageBakeResult

# Interface: FoliageBakeResult

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:19](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L19)

식생 메시를 팔면체 임포스터(Octahedral Impostor)로 베이킹한 결과 데이터 인터페이스입니다.

## Properties

### baseColorTexture

> **baseColorTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:24](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L24)

베이킹된 베이스 컬러(Base Color) 아틀라스 텍스처

***

### bottomOffset

> **bottomOffset**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:54](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L54)

모델 바닥면의 Y축 오프셋

***

### depth

> **depth**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:49](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L49)

바운딩 박스 깊이 (월드 단위)

***

### height

> **height**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:44](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L44)

바운딩 박스 높이 (월드 단위)

***

### normalTexture

> **normalTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:29](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L29)

베이킹된 월드 공간 노멀(Normal) 아틀라스 텍스처

***

### packedORMTexture

> **packedORMTexture**: [`DirectTexture`](../../../../../../Resource/classes/DirectTexture.md)

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:34](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L34)

베이킹된 패킹 ORM(Occlusion/Roughness/Metallic) 아틀라스 텍스처

***

### width

> **width**: `number`

Defined in: [src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts:39](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/landscape/foliage/core/baking/impostor/bakeFoliageImpostor.ts#L39)

바운딩 박스 가로 폭 (월드 단위)
