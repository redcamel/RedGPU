[**RedGPU API v4.6.0**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Shader](../README.md) / LandscapeShaderLibrary

# Variable: LandscapeShaderLibrary

> `const` **LandscapeShaderLibrary**: `Readonly`\<\{ `checkAABBInHZB`: `string`; `foliageOctahedralCommon`: `string`; `grassFragmentCommon`: `string`; `grassVertexCommon`: `string`; `rotateVectorByQuat`: `string`; `scatterBakeCommon`: `string`; `scatterCullCommon`: `string`; `stochasticSampling`: `string`; `struct`: `Readonly`\<\{ `DrawIndexedIndirectArgs`: `string`; `FoliageInstance`: `string`; `GrassInstance`: `string`; `GrassPositionResult`: `string`; `GrassRenderParams`: `string`; `GrassShadowVertexOutput`: `string`; `GrassVertexOutput`: `string`; `ImpostorBakeVertexOutput`: `string`; `LandscapeLayerParams`: `string`; `LandscapeSurfaceSample`: `string`; `LandscapeTile`: `string`; `LandscapeUniforms`: `string`; `StochasticGridTri`: `string`; `StochasticSampleResult`: `string`; \}\>; `testSphereInFrustum`: `string`; \}\>

Defined in: [src/landscape/core/shader/library/LandscapeShaderLibrary.ts:32](https://github.com/redcamel/RedGPU/blob/a7aa3608e4bb06382354064aa5b75e4f3525d77e/src/landscape/core/shader/library/LandscapeShaderLibrary.ts#L32)

WGSL struct and utility function library shared across landscape, foliage, and grass shaders.
