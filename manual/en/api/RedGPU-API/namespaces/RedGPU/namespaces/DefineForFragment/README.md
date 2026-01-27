[**RedGPU API v3.9.1-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / DefineForFragment

# DefineForFragment


Namespace that defines properties used in Fragment Shaders.


Provides various property definition features required for fragment-stage rendering, such as textures, samplers, and colors.

* ### Example
```typescript
const material = new RedGPU.Material.BaseMaterial(redGPUContext);
RedGPU.DefineForFragment.COLOR('color', [1, 0, 0]);
```
 DefineForFragment

## Variables

- [defineBoolean](variables/defineBoolean.md)
- [defineColorRGB](variables/defineColorRGB.md)
- [defineColorRGBA](variables/defineColorRGBA.md)
- [defineCubeTexture](variables/defineCubeTexture.md)
- [definePositiveNumber](variables/definePositiveNumber.md)
- [defineSampler](variables/defineSampler.md)
- [defineTexture](variables/defineTexture.md)
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

## Functions

- [defineByPreset](functions/defineByPreset.md)
