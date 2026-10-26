[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / globalVertexStruct

# Variable: globalVertexStruct

> `const` **globalVertexStruct**: `string` = `globalVertexStruct_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2562](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/systemCodeManager/ShaderLibrary.ts#L2562)

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
    disableJitter: u32,
    globalFragmentSlotIndex:u32,
    uvTransform: vec4<f32>,
};
```
