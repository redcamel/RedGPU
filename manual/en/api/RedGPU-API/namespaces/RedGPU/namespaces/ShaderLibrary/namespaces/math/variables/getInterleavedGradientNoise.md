[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [math](../README.md) / getInterleavedGradientNoise

# Variable: getInterleavedGradientNoise

> `const` **getInterleavedGradientNoise**: `string` = `getInterleavedGradientNoise_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:410](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L410)

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
