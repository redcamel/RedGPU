[**RedGPU API v4.5.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Color](../README.md) / convertSrgbToLinear

# Function: convertSrgbToLinear()

> **convertSrgbToLinear**(`channel`): `number`

Defined in: [src/color/convertSrgbToLinear.ts:31](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/color/convertSrgbToLinear.ts#L31)

0~255 범위의 sRGB 채널 값을 IEC 61966-2-1 표준 sRGB 전달 함수(EOTF)로 0~1 범위의 리니어 값으로 변환합니다.

단순 `pow(x, 2.2)` 근사 대신 GPU의 `-srgb` 텍스처 디코딩 및 셰이더 `srgbToLinearVec3`와 동일한 구간 함수를 사용하므로, 저채도·암부 영역에서도 텍스처 색상과 유니폼 색상이 일치합니다. 사전 계산된 조회 테이블을 사용하여 핫패스에서도 연산 및 힙 할당 비용이 없습니다.

### Example
```typescript
const linear = RedGPU.Color.convertSrgbToLinear(128); // 0.2158605...
```

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `channel` | `number` | sRGB 채널 값 (0~255 정수). 범위 검증을 수행하지 않으므로 호출 측에서 유효 범위를 보장해야 합니다. |

## Returns

`number`

0~1 범위의 리니어 값
