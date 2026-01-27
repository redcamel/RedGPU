[**RedGPU API v3.9.1-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / DefineForFragment

# DefineForFragment

프래그먼트 쉐이더(Fragment Shader)에서 사용되는 속성들을 정의하는 네임스페이스입니다.


텍스처, 샘플러, 색상 등 프래그먼트 단계의 렌더링에 필요한 다양한 속성 정의 기능을 제공합니다.


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
