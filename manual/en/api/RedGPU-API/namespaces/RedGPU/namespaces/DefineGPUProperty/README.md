[**RedGPU API v4.3.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / DefineGPUProperty

# DefineGPUProperty

RedGPU의 GPU 속성 정의 시스템 (`DefineGPUProperty`) 모듈입니다.

이 모듈은 JavaScript 클래스의 프로토타입에 GPU와 연동되는 속성을 동적으로 정의하기 위한
헬퍼 함수들의 집합입니다. 속성 값이 변경되면 updateTargetUniform 내부 유틸리티를 통해
GPU 유니폼 버퍼에 즉각 반영됩니다.

## Remarks


***
- All `define*` functions inject getter/setter pairs onto the target class prototype via `Object.defineProperty`.
- Both a single config object and an array form are supported.

## Example

```typescript
import RedGPU from 'RedGPU';

// 커스텀 Material 클래스에 GPU 연동 속성을 추가합니다.
RedGPU.DefineGPUProperty.defineNumber(MyMaterial, { key: 'opacity', value: 1.0, min: 0, max: 1 });
RedGPU.DefineGPUProperty.defineColorRGB(MyMaterial, { key: 'albedo', value: '#ffffff' });
RedGPU.DefineGPUProperty.defineBoolean(MyMaterial, { key: 'useAlphaTest', value: false });
```

## Interfaces

- [DefineBooleanInfo](interfaces/DefineBooleanInfo.md)
- [DefineColorRGBAInfo](interfaces/DefineColorRGBAInfo.md)
- [DefineColorRGBInfo](interfaces/DefineColorRGBInfo.md)
- [DefineCubeTextureInfo](interfaces/DefineCubeTextureInfo.md)
- [DefineNumberInfo](interfaces/DefineNumberInfo.md)
- [DefinePositiveNumberInfo](interfaces/DefinePositiveNumberInfo.md)
- [DefineSamplerInfo](interfaces/DefineSamplerInfo.md)
- [DefineTextureInfo](interfaces/DefineTextureInfo.md)
- [DefineUintInfo](interfaces/DefineUintInfo.md)
- [DefineVector2Info](interfaces/DefineVector2Info.md)
- [DefineVector3Info](interfaces/DefineVector3Info.md)
- [DefineVector4Info](interfaces/DefineVector4Info.md)

## Functions

- [defineBoolean](functions/defineBoolean.md)
- [defineColorRGB](functions/defineColorRGB.md)
- [defineColorRGBA](functions/defineColorRGBA.md)
- [defineCubeTexture](functions/defineCubeTexture.md)
- [defineNumber](functions/defineNumber.md)
- [definePositiveNumber](functions/definePositiveNumber.md)
- [defineSampler](functions/defineSampler.md)
- [defineTexture](functions/defineTexture.md)
- [defineUint](functions/defineUint.md)
- [defineVector2](functions/defineVector2.md)
- [defineVector3](functions/defineVector3.md)
- [defineVector4](functions/defineVector4.md)
