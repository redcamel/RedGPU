[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / LINE\_TYPE

# Variable: LINE\_TYPE

> `const` **LINE\_TYPE**: `object`

Defined in: [src/display/line/LINE\_TYPE.ts:12](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/LINE_TYPE.ts#L12)

`Line2D` 및 `Line3D`에서 지원하는 라인 보간 방식 상수입니다.

### Example
```typescript
const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.CATMULL_ROM);
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-bezier"></a> `BEZIER` | `"bezier"` | `'bezier'` | 진입/진출 탄젠트 제어점을 사용하는 3차 베지어(Cubic Bezier) 곡선 보간 | [src/display/line/LINE\_TYPE.ts:27](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/LINE_TYPE.ts#L27) |
| <a id="property-catmull_rom"></a> `CATMULL_ROM` | `"catmullRom"` | `'catmullRom'` | 정점들을 부드럽게 통과하는 캣멀-롬(Catmull-Rom) 스플라인 곡선 보간 | [src/display/line/LINE\_TYPE.ts:22](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/LINE_TYPE.ts#L22) |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | 정점 사이를 직선으로 연결하는 선형 보간 | [src/display/line/LINE\_TYPE.ts:17](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/display/line/LINE_TYPE.ts#L17) |
