[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Water](../../../../../README.md) / [LakeCore](../../../README.md) / [Interaction](../README.md) / LakeActiveMeshEntry

# Interface: LakeActiveMeshEntry

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L12)

호수 수면과 상호작용하는 활성 메시의 물리 및 파동 정보를 정의하는 인터페이스입니다.

## Properties

### footSide

> **footSide**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:37](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L37)

보행 주기의 좌우 발 구분 부호입니다. (`-1.0` 또는 `1.0`)

***

### mesh

> **mesh**: [`Mesh`](../../../../../../Display/classes/Mesh.md)

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L17)

상호작용 대상 `Mesh` 인스턴스입니다.

***

### speed

> **speed**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L27)

메시의 이동 속도(초당 월드 단위)입니다.

***

### stepPulse

> **stepPulse**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L32)

이동 중 발생하는 발걸음 충격 펄스 세기입니다. (범위: `0` ~ `1`)

***

### waveStrength

> **waveStrength**: `number`

Defined in: [src/water/lakeCore/interaction/LakeInteractionManager.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/water/lakeCore/interaction/LakeInteractionManager.ts#L22)

수면 침수에 의한 파동 강도입니다.
