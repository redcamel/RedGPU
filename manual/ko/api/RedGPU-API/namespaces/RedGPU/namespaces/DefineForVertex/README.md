[**RedGPU API v4.0.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / DefineForVertex

# DefineForVertex

버텍스 쉐이더(Vertex Shader)에서 사용되는 속성들을 정의하는 네임스페이스입니다.


빌보드 설정, 그림자 수신 여부 등 버텍스 단계의 기하학적 연산에 필요한 속성 정의 기능을 제공합니다.


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
