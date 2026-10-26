[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Display](../README.md) / LINE\_TYPE

# Variable: LINE\_TYPE

> `const` **LINE\_TYPE**: `object`

Defined in: [src/display/line/LINE\_TYPE.ts:12](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/line/LINE_TYPE.ts#L12)

Constants for line interpolation types supported by `Line2D` and `Line3D`.

### Example
```typescript
const line = new RedGPU.Display.Line3D(redGPUContext, RedGPU.Display.LINE_TYPE.CATMULL_ROM);
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-bezier"></a> `BEZIER` | `"bezier"` | `'bezier'` | Cubic Bezier curve interpolation using in/out tangent control points | [src/display/line/LINE\_TYPE.ts:27](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/line/LINE_TYPE.ts#L27) |
| <a id="property-catmull_rom"></a> `CATMULL_ROM` | `"catmullRom"` | `'catmullRom'` | Catmull-Rom spline curve interpolation passing smoothly through points | [src/display/line/LINE\_TYPE.ts:22](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/line/LINE_TYPE.ts#L22) |
| <a id="property-linear"></a> `LINEAR` | `"linear"` | `'linear'` | Linear interpolation connecting points with straight lines | [src/display/line/LINE\_TYPE.ts:17](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/display/line/LINE_TYPE.ts#L17) |
