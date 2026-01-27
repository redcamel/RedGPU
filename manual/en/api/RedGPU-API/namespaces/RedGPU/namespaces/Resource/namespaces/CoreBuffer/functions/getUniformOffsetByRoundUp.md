[**RedGPU API v3.9.1-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [Resource](../../../README.md) / [CoreBuffer](../README.md) / getUniformOffsetByRoundUp

# Function: getUniformOffsetByRoundUp()

> **getUniformOffsetByRoundUp**(`previousOffsetAndSize`, `requiredAlignment`): `number`

Defined in: [src/resources/buffer/core/func/getUniformOffsetByRoundUp.ts:12](https://github.com/redcamel/RedGPU/blob/c7295db2e0ba400cc1c1d95dee8a613dd3fd6ded/src/resources/buffer/core/func/getUniformOffsetByRoundUp.ts#L12)

주어진 오프셋과 사이즈를 시작으로 필요한 정렬을 기준으로 오프셋을 반올림합니다.
<br/>Rounds up the offset based on the given previous offset and size and the required alignment.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `previousOffsetAndSize` | `number` | 이전 오프셋과 사이즈입니다. <br/>The previous offset and size. |
| `requiredAlignment` | `number` | 필요한 정렬입니다. <br/>The required alignment. |

## Returns

`number`

- 반올림된 오프셋을 반환합니다.
<br/>Returns the rounded up offset.
