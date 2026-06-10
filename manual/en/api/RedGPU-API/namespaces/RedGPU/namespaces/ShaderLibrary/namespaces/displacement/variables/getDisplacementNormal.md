[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [displacement](../README.md) / getDisplacementNormal

# Variable: getDisplacementNormal

> `const` **getDisplacementNormal**: `string` = `getDisplacementNormal_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2572](https://github.com/redcamel/RedGPU/blob/92e43fdf28e3ceced28d533c99c1ab7acee472f2/src/systemCodeManager/ShaderLibrary.ts#L2572)

Bicubic filtering helper (High-precision version based on B-Spline)

//

## Param

UV coordinates to sample
//

## Param

Texture to sample
//

## Param

Sampler
//

## Param

Texture dimensions
//

## Param

Inverse of texture dimensions
//

## Param

Mipmap level
//

## Returns

Sampled value

```wgsl
fn sampleBicubic(uv: vec2<f32>, tex: texture_2d<f32>, smp: sampler, dims: vec2<f32>, invSize: vec2<f32>, mip: f32) -> f32 {
    let res_uv = uv * dims;
    let i = floor(res_uv - 0.5);
    let f = fract(res_uv - 0.5);

    let w0 = (1.0 - f) * (1.0 - f) * (1.0 - f) / 6.0;
    let w1 = (4.0 - 6.0 * f * f + 3.0 * f * f * f) / 6.0;
    let w2 = (1.0 + 3.0 * f + 3.0 * f * f - 3.0 * f * f * f) / 6.0;
    let w3 = f * f * f / 6.0;

    let g0 = w0 + w1;
    let g1 = w2 + w3;
    let h0 = (w1 / g0) - 1.0 + i;
    let h1 = (w3 / g1) + 1.0 + i;

    let r0 = textureSampleLevel(tex, smp, (vec2<f32>(h0.x, h0.y) + 0.5) * invSize, mip).r * g0.x * g0.y;
    let r1 = textureSampleLevel(tex, smp, (vec2<f32>(h1.x, h0.y) + 0.5) * invSize, mip).r * g1.x * g0.y;
    let r2 = textureSampleLevel(tex, smp, (vec2<f32>(h0.x, h1.y) + 0.5) * invSize, mip).r * g0.x * g1.y;
    let r3 = textureSampleLevel(tex, smp, (vec2<f32>(h1.x, h1.y) + 0.5) * invSize, mip).r * g1.x * g1.y;

    return r0 + r1 + r2 + r3;
}

/**
 * Calculates the modified normal vector by sampling the displacement texture with bicubic filtering.
 *
 * @param displacementTexture Displacement texture
 * @param displacementTextureSampler Sampler
 * @param displacementScale Displacement scale
 * @param input_uv Input UV coordinates
 * @param mipLevel Mipmap level
 * @returns Modified normal vector
 *
 */
fn getDisplacementNormal(
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    // Texture dimensions based on base resolution (Mip 0) to maintain normal sharpness.
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
    let invTexSize = 1.0 / textureDimensions;

    // Sampling interval for normal calculation (adjusted by mip level)
    let step = invTexSize * exp2(mipLevel);

    let h_u0 = sampleBicubic(input_uv + vec2<f32>(-step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_u1 = sampleBicubic(input_uv + vec2<f32>( step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v0 = sampleBicubic(input_uv + vec2<f32>(0.0, -step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v1 = sampleBicubic(input_uv + vec2<f32>(0.0,  step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);

    let ddu = (h_u1 - h_u0) * displacementScale / (step.x * 2.0);
    let ddv = (h_v1 - h_v0) * displacementScale / (step.y * 2.0);

    return normalize(vec3<f32>(-ddu, -ddv, 1.0));
}
```
