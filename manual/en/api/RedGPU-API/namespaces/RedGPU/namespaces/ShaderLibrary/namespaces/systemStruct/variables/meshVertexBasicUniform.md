[**RedGPU API v4.1.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / meshVertexBasicUniform

# Variable: meshVertexBasicUniform

> `const` **meshVertexBasicUniform**: `string` = `meshVertexBasicUniform_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2432](https://github.com/redcamel/RedGPU/blob/a734ff9f69c2580cada1bff993a61d03dd359f8b/src/systemCodeManager/ShaderLibrary.ts#L2432)

```wgsl
struct MatrixList{
    localMatrix: mat4x4<f32>,
    modelMatrix: mat4x4<f32>,
    prevModelMatrix: mat4x4<f32>,
    normalModelMatrix: mat4x4<f32>,
}
struct VertexUniforms {
    matrixList:MatrixList,
    pickingId: u32,
    receiveShadow: f32,
    combinedOpacity: f32,
    useDisplacementTexture: u32,
    displacementScale: f32,
    disableJitter: u32,
    uvTransform: vec4<f32>,
};
```
