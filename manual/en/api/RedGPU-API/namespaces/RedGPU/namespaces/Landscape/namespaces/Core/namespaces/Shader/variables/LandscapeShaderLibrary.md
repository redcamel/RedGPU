[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Shader](../README.md) / LandscapeShaderLibrary

# Variable: LandscapeShaderLibrary

> `const` **LandscapeShaderLibrary**: `Readonly`\<\{ `checkAABBInHZB`: `string`; `foliageOctahedralCommon`: `string`; `grassFragmentCommon`: `string`; `grassVertexCommon`: `string`; `rotateVectorByQuat`: `string`; `scatterBakeCommon`: `string`; `scatterCullCommon`: `string`; `stochasticSampling`: `string`; `struct`: `Readonly`\<\{ `DrawIndexedIndirectArgs`: `string`; `FoliageInstance`: `string`; `GrassInstance`: `string`; `GrassPositionResult`: `string`; `GrassRenderParams`: `string`; `GrassShadowVertexOutput`: `string`; `GrassVertexOutput`: `string`; `ImpostorBakeVertexOutput`: `string`; `LandscapeLayerParams`: `string`; `LandscapeSurfaceSample`: `string`; `LandscapeTile`: `string`; `LandscapeUniforms`: `string`; `StochasticGridTri`: `string`; `StochasticSampleResult`: `string`; \}\>; `testSphereInFrustum`: `string`; \}\>

Defined in: [src/landscape/core/shader/library/LandscapeShaderLibrary.ts:32](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/landscape/core/shader/library/LandscapeShaderLibrary.ts#L32)

WGSL struct and utility function library shared across landscape, foliage, and grass shaders.
