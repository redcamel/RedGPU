[**RedGPU API v4.4.0-Alpha**](../../../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../../../README.md) / [RedGPU](../../../../../../../README.md) / [Landscape](../../../../../README.md) / [Core](../../../README.md) / [Shader](../README.md) / LandscapeShaderLibrary

# Variable: LandscapeShaderLibrary

> `const` **LandscapeShaderLibrary**: `Readonly`\<\{ `checkAABBInHZB`: `string`; `foliageOctahedralCommon`: `string`; `grassFragmentCommon`: `string`; `grassVertexCommon`: `string`; `rotateVectorByQuat`: `string`; `scatterBakeCommon`: `string`; `scatterCullCommon`: `string`; `stochasticSampling`: `string`; `struct`: `Readonly`\<\{ `DrawIndexedIndirectArgs`: `string`; `FoliageInstance`: `string`; `GrassInstance`: `string`; `GrassPositionResult`: `string`; `GrassRenderParams`: `string`; `GrassShadowVertexOutput`: `string`; `GrassVertexOutput`: `string`; `ImpostorBakeVertexOutput`: `string`; `LandscapeLayerParams`: `string`; `LandscapeSurfaceSample`: `string`; `LandscapeTile`: `string`; `LandscapeUniforms`: `string`; `StochasticGridTri`: `string`; `StochasticSampleResult`: `string`; \}\>; `testSphereInFrustum`: `string`; \}\>

Defined in: [src/landscape/core/shader/library/LandscapeShaderLibrary.ts:32](https://github.com/redcamel/RedGPU/blob/1e59941e5b6c61327f4eb8821e5e6784da4a52cb/src/landscape/core/shader/library/LandscapeShaderLibrary.ts#L32)

지형, 식생 및 잔디 셰이더에서 공용으로 참조하는 WGSL 구조체 및 유틸리티 함수 라이브러리입니다.
