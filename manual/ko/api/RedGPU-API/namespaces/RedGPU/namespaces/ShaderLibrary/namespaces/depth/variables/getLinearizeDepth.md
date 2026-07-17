[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [depth](../README.md) / getLinearizeDepth

# Variable: getLinearizeDepth

> `const` **getLinearizeDepth**: `string` = `getLinearizeDepth_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:1416](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L1416)

비선형 깊이(Depth) 값을 선형 거리로 복구합니다. (Stable Version)

//

## Param

텍스처에서 샘플링된 0~1 사이의 깊이값
//

## Param

카메라의 Near 평면 거리
//

## Param

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
