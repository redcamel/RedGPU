[**RedGPU API v4.1.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [ShaderLibrary](../../../../../README.md) / [entryPoint](../../../README.md) / [mesh](../README.md) / entryPointPickingFragment

# Variable: entryPointPickingFragment

> `const` **entryPointPickingFragment**: `string` = `meshEntryPointPickingFragment_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2082](https://github.com/redcamel/RedGPU/blob/ed852b773d59f6e9bad76f340c03dc4200b077ba/src/systemCodeManager/ShaderLibrary.ts#L2082)

메쉬 피킹 프래그먼트 셰이더 엔트리 포인트입니다.

//

## Param

프래그먼트 입력 데이터
//

## Returns

피킹 ID (location 0)

```wgsl
@fragment
fn entryPointPickingFragment(inputData: InputData) -> @location(0) vec4<f32> {
    var finalColor:vec4<f32> = inputData.pickingId;
    return finalColor;
}
```
