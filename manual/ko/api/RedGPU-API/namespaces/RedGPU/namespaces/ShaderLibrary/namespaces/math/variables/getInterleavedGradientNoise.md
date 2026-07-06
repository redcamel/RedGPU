[**RedGPU API v4.2.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [math](../README.md) / getInterleavedGradientNoise

# Variable: getInterleavedGradientNoise

> `const` **getInterleavedGradientNoise**: `string` = `getInterleavedGradientNoise_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:403](https://github.com/redcamel/RedGPU/blob/091a447ce4546f482b09304906702c57d6ea3b67/src/systemCodeManager/ShaderLibrary.ts#L403)

Jorge Jimenez의 Interleaved Gradient Noise를 생성합니다. (디더링 및 샘플 회전용 초고속 노이즈)

//

## Param

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
