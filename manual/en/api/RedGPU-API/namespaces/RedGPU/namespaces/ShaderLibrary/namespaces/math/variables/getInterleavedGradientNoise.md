[**RedGPU API v4.5.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [math](../README.md) / getInterleavedGradientNoise

# Variable: getInterleavedGradientNoise

> `const` **getInterleavedGradientNoise**: `string` = `getInterleavedGradientNoise_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:409](https://github.com/redcamel/RedGPU/blob/f63d8861781a3d693b7b3a5a73ed96b0cc3859a6/src/systemCodeManager/ShaderLibrary.ts#L409)

Generates Interleaved Gradient Noise by Jorge Jimenez. (Ultra-fast noise for dithering and sample rotation)

//

## Param

**screenCoord**

Screen coordinates
//

## Returns

Generated noise value

```wgsl
fn getInterleavedGradientNoise(screenCoord: vec2<f32>) -> f32 {
    let magic = vec3<f32>(0.06711056, 0.00583715, 52.9829189);
    return fract(magic.z * fract(dot(screenCoord, magic.xy)));
}
```
