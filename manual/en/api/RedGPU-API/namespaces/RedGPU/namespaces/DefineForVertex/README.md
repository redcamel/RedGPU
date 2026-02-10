[**RedGPU API v4.0.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / DefineForVertex

# DefineForVertex


Namespace that defines properties used in Vertex Shaders.


Provides property definition features required for vertex-stage geometric operations, such as billboard settings and shadow reception.

* ### Example
```typescript
const material = new RedGPU.Material.BaseMaterial(redGPUContext);
RedGPU.DefineForVertex.USE_BILLBOARD('useBillboard', true);
```
 DefineForVertex

## Variables

- [defineBoolean](variables/defineBoolean.md)
- [definePositiveNumber](variables/definePositiveNumber.md)
- [defineUint](variables/defineUint.md)
- [defineVec2](variables/defineVec2.md)
- [defineVec3](variables/defineVec3.md)
- [defineVec4](variables/defineVec4.md)
- [PRESET\_BOOLEAN](variables/PRESET_BOOLEAN.md)
- [PRESET\_COLOR\_RGB](variables/PRESET_COLOR_RGB.md)
- [PRESET\_CUBE\_TEXTURE](variables/PRESET_CUBE_TEXTURE.md)
- [PRESET\_POSITIVE\_NUMBER](variables/PRESET_POSITIVE_NUMBER.md)
- [PRESET\_SAMPLER](variables/PRESET_SAMPLER.md)
- [PRESET\_TEXTURE](variables/PRESET_TEXTURE.md)
- [PRESET\_UINT](variables/PRESET_UINT.md)
- [PRESET\_VEC2](variables/PRESET_VEC2.md)
- [PRESET\_VEC3](variables/PRESET_VEC3.md)
- [PRESET\_VEC4](variables/PRESET_VEC4.md)

## References

### defineByPreset

Re-exports [defineByPreset](../DefineForFragment/functions/defineByPreset.md)
