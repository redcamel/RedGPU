[**RedGPU API v4.3.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / globalVertexStruct

# Variable: globalVertexStruct

> `const` **globalVertexStruct**: `string` = `globalVertexStruct_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2466](https://github.com/redcamel/RedGPU/blob/183d0117087b28c3f28ce1934611cd3a1a56551b/src/systemCodeManager/ShaderLibrary.ts#L2466)

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
