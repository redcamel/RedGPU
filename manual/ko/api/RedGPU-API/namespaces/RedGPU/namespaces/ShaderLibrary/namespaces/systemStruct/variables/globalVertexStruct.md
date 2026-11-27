[**RedGPU API v4.6.0**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / globalVertexStruct

# Variable: globalVertexStruct

> `const` **globalVertexStruct**: `string` = `globalVertexStruct_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2565](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/systemCodeManager/ShaderLibrary.ts#L2565)

```wgsl
struct MatrixList{
    localMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    prevModelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct GlobalVertexStruct {
    matrixList:MatrixList,
    pickingId: u32,
    receiveShadow: f32,
    combinedOpacity: f32,
    useDisplacementTexture: u32,
    displacementScale: f32,

    globalFragmentSlotIndex:u32,
    uvTransform: vec4<f32>,
};
```
