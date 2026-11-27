[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [math](../README.md) / getInterleavedGradientNoise

# Variable: getInterleavedGradientNoise

> `const` **getInterleavedGradientNoise**: `string` = `getInterleavedGradientNoise_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:409](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L409)

Jorge Jimenez의 Interleaved Gradient Noise를 생성합니다. (디더링 및 샘플 회전용 초고속 노이즈)

//

## Param

**screenCoord**

스크린 좌표
//

## Returns

생성된 노이즈 값

```wgsl
fn getInterleavedGradientNoise(screenCoord: vec2<f32>) -> f32 {
    let magic = vec3<f32>(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(screenCoord, magic.xy)));
}
```
