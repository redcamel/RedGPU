[**RedGPU API v4.0.0-Alpha**](../../../../../README.md)

***

[RedGPU API](../../../../../README.md) / [RedGPU](../../README.md) / Resource

# Resource

다양한 리소스 객체와 유틸리티(버퍼, 텍스처, 샘플러, 리소스 매니저, WGSL 파서 등)를 제공합니다.


각 리소스 및 유틸리티를 통해 GPU 메모리 관리, 데이터 버퍼링, 텍스처 처리, 샘플링, WGSL 파싱 등 렌더링에 필요한 다양한 리소스 관리 기능을 손쉽게 사용할 수 있습니다.


## Buffer

- [IndexBuffer](classes/IndexBuffer.md)
- [StorageBuffer](classes/StorageBuffer.md)
- [UniformBuffer](classes/UniformBuffer.md)
- [VertexBuffer](classes/VertexBuffer.md)
- [VertexInterleavedStruct](classes/VertexInterleavedStruct.md)
- [VertexInterleaveType](classes/VertexInterleaveType.md)

## IBL

- [IBL](classes/IBL.md)

## NoiseTexture

- [SimplexTexture](classes/SimplexTexture.md)
- [VoronoiTexture](classes/VoronoiTexture.md)
- [NOISE\_DIMENSION](variables/NOISE_DIMENSION.md)
- [VORONOI\_DISTANCE\_TYPE](variables/VORONOI_DISTANCE_TYPE.md)
- [VORONOI\_OUTPUT\_TYPE](variables/VORONOI_OUTPUT_TYPE.md)

## Other

- [Core](namespaces/Core/README.md)
- [CoreBuffer](namespaces/CoreBuffer/README.md)
- [CoreIBL](namespaces/CoreIBL/README.md)
- [CoreNoiseTexture](namespaces/CoreNoiseTexture/README.md)
- [CoreVertexBuffer](namespaces/CoreVertexBuffer/README.md)
- [CoreWGSLParser](namespaces/CoreWGSLParser/README.md)

## Sampler

- [Sampler](classes/Sampler.md)

## Texture

- [BitmapTexture](classes/BitmapTexture.md)
- [CubeTexture](classes/CubeTexture.md)
- [HDRTexture](classes/HDRTexture.md)
- [PackedTexture](classes/PackedTexture.md)

## WGSL

- [parseWGSL](functions/parseWGSL.md)
