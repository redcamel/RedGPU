[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [depth](../README.md) / getLinearizeDepth

# Variable: getLinearizeDepth

> `const` **getLinearizeDepth**: `string` = `getLinearizeDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2045](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2045)

비선형 깊이(Depth) 값을 선형 거리로 복구합니다. (Stable Version)

//

## Param

**depthSample**

텍스처에서 샘플링된 0~1 사이의 깊이값
//

## Param

**near**

카메라의 Near 평면 거리
//

## Param

**far**

카메라의 Far 평면 거리
//

## Returns

선형화된 거리 값

```wgsl
#redgpu_include math.EPSILON

fn getLinearizeDepth(depthSample : f32, near : f32, far : f32) -> f32 {
    let d = clamp(depthSample, 0.0, 1.0);
    return (near * far) / max(EPSILON, far - d * (far - near));
}
```
