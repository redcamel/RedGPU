[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [displacement](../README.md) / getDisplacementNormal

# Variable: getDisplacementNormal

> `const` **getDisplacementNormal**: `string` = `getDisplacementNormal_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2572](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/systemCodeManager/ShaderLibrary.ts#L2572)

바이큐빅 필터링 헬퍼 (B-Spline 기반 고정밀 버전)

//

## Param

샘플링할 UV 좌표
//

## Param

샘플링할 텍스처
//

## Param

샘플러
//

## Param

텍스처 크기
//

## Param

텍스처 크기의 역수
//

## Param

밉맵 레벨
//

## Returns

샘플링된 값

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
 * 디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 법선 벡터를 계산합니다.
 * @param displacementTexture 디스플레이스먼트 텍스처
 * @param displacementTextureSampler 샘플러
 * @param displacementScale 변위 강도
 * @param input_uv 입력 UV 좌표
 * @param mipLevel 밉맵 레벨
 * @returns 변형된 법선 벡터
 *
 */
fn getDisplacementNormal(
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    // 텍스처 크기는 베이스 해상도(Mip 0)를 기준으로 하여 노멀의 선명도를 유지합니다.
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
    let invTexSize = 1.0 / textureDimensions;

    // 노멀 계산을 위한 샘플링 간격 (밉레벨에 따라 조절)
    let step = invTexSize * exp2(mipLevel);

    let h_u0 = sampleBicubic(input_uv + vec2<f32>(-step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_u1 = sampleBicubic(input_uv + vec2<f32>( step.x, 0.0), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v0 = sampleBicubic(input_uv + vec2<f32>(0.0, -step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);
    let h_v1 = sampleBicubic(input_uv + vec2<f32>(0.0,  step.y), displacementTexture, displacementTextureSampler, textureDimensions, invTexSize, mipLevel);

    // UV 단위당 높이 변화율(Derivative) 계산
    let ddu = (h_u1 - h_u0) * displacementScale / (step.x * 2.0);
    let ddv = (h_v1 - h_v0) * displacementScale / (step.y * 2.0);

    return normalize(vec3<f32>(-ddu, -ddv, 1.0));
}
```
