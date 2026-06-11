[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [displacement](../README.md) / getDisplacementPosition

# Variable: getDisplacementPosition

> `const` **getDisplacementPosition**: `string` = `getDisplacementPosition_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2493](https://github.com/redcamel/RedGPU/blob/1acaed6a7f0d9944ec006546eb911e628cd46850/src/systemCodeManager/ShaderLibrary.ts#L2493)

디스플레이스먼트 텍스처를 바이큐빅 필터링으로 샘플링하여 변형된 정점 위치를 계산합니다.

//

## Param

입력 정점 위치
//

## Param

입력 정점 법선
//

## Param

디스플레이스먼트 텍스처
//

## Param

샘플러
//

## Param

변위 강도
//

## Param

입력 UV 좌표
//

## Param

밉맵 레벨
//

## Returns

변형된 정점 위치

```wgsl
fn getDisplacementPosition(
    input_position: vec3<f32>,
    input_vertexNormal: vec3<f32>,
    displacementTexture: texture_2d<f32>,
    displacementTextureSampler: sampler,
    displacementScale: f32,
    input_uv: vec2<f32>,
    mipLevel: f32
) -> vec3<f32> {
    // 텍스처 크기는 베이스 해상도(Mip 0)를 기준으로 하여 변위의 연속성을 유지합니다.
    let textureDimensions = vec2<f32>(textureDimensions(displacementTexture, 0));
    let invTexSize = 1.0 / textureDimensions;

    let uv = input_uv * textureDimensions;
    let iuv = floor(uv - 0.5);
    let fuv = fract(uv - 0.5);

    let w0 = (1.0 - fuv) * (1.0 - fuv) * (1.0 - fuv) / 6.0;
    let w1 = (4.0 - 6.0 * fuv * fuv + 3.0 * fuv * fuv * fuv) / 6.0;
    let w2 = (1.0 + 3.0 * fuv + 3.0 * fuv * fuv - 3.0 * fuv * fuv * fuv) / 6.0;
    let w3 = fuv * fuv * fuv / 6.0;

    let g0 = w0 + w1;
    let g1 = w2 + w3;
    let h0 = (w1 / g0) - 1.0 + iuv;
    let h1 = (w3 / g1) + 1.0 + iuv;

    let res0 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h0.x, h0.y) + 0.5) * invTexSize, mipLevel).r * g0.x * g0.y;
    let res1 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h1.x, h0.y) + 0.5) * invTexSize, mipLevel).r * g1.x * g0.y;
    let res2 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h0.x, h1.y) + 0.5) * invTexSize, mipLevel).r * g0.x * g1.y;
    let res3 = textureSampleLevel(displacementTexture, displacementTextureSampler, (vec2<f32>(h1.x, h1.y) + 0.5) * invTexSize, mipLevel).r * g1.x * g1.y;

    let h_bicubic = res0 + res1 + res2 + res3;

    let scaledDisplacement = (h_bicubic - 0.5) * displacementScale;
    let displacedPosition = input_position + normalize(input_vertexNormal) * scaledDisplacement;

    return displacedPosition;
}
```
