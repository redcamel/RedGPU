[**RedGPU API v4.4.0-Alpha**](../../../../../../README.md)

***

[RedGPU API](../../../../../../README.md) / [RedGPU](../../../README.md) / [Material](../README.md) / BLEND\_MODE

# Variable: BLEND\_MODE

> `const` **BLEND\_MODE**: `object`

Defined in: [src/material/BLEND\_MODE.ts:13](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L13)

Blend mode constants used when compositing 2D objects and materials.

### Example
```typescript
sprite2D.blendMode = RedGPU.Material.BLEND_MODE.MULTIPLY;
```

## Type Declaration

| Name | Type | Default value | Description | Defined in |
| ------ | ------ | ------ | ------ | ------ |
| <a id="property-difference"></a> `DIFFERENCE` | `6` | `6` | Difference blend mode (6) | [src/material/BLEND\_MODE.ts:48](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L48) |
| <a id="property-exclusion"></a> `EXCLUSION` | `7` | `7` | Exclusion blend mode (7) | [src/material/BLEND\_MODE.ts:53](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L53) |
| <a id="property-lighten"></a> `LIGHTEN` | `2` | `2` | Lighten blend mode (2) | [src/material/BLEND\_MODE.ts:28](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L28) |
| <a id="property-linear_dodge"></a> `LINEAR_DODGE` | `4` | `4` | Linear Dodge blend mode (4) | [src/material/BLEND\_MODE.ts:38](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L38) |
| <a id="property-multiply"></a> `MULTIPLY` | `1` | `1` | Multiply blend mode (1) | [src/material/BLEND\_MODE.ts:23](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L23) |
| <a id="property-normal"></a> `NORMAL` | `0` | `0` | Normal blend mode (0) | [src/material/BLEND\_MODE.ts:18](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L18) |
| <a id="property-screen"></a> `SCREEN` | `3` | `3` | Screen blend mode (3) | [src/material/BLEND\_MODE.ts:33](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L33) |
| <a id="property-subtract"></a> `SUBTRACT` | `5` | `5` | Subtract blend mode (5) | [src/material/BLEND\_MODE.ts:43](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/material/BLEND_MODE.ts#L43) |

## See

[2D BlendMode basic example](https://redcamel.github.io/RedGPU/examples/2d/blendMode/basic/)
