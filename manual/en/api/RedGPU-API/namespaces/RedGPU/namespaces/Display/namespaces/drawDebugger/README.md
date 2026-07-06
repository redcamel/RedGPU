[**RedGPU API v4.1.0-Alpha**](../../../../../../../README.md)

***

[RedGPU API](../../../../../../../README.md) / [RedGPU](../../../../README.md) / [Display](../../README.md) / drawDebugger

# drawDebugger

RedGPU의 공간 디버깅 헬퍼 및 가이드 요소들을 제공하는 모듈입니다.

이 모듈은 3D 공간 상에서 축(Axis), 그리드(Grid), 메시 바운딩 볼륨(AABB, OBB), 그리고 각종 조명(Directional, Point, Spot)들의
물리적 위치와 영향 범위를 가시적으로 표현하는 디버깅 오브젝트를 포함합니다.

## Remarks


***
- Offers debugging aids to visualize 3D helper guides such as axes, grid, bounding volumes, and light sources.
- Dynamically updates GPU geometries based on change-detection state tracking to avoid redundant write overhead.
- Integrates with frustum culling parameters for optimized draw execution.

## Debugger

- [ADrawDebuggerLight](classes/ADrawDebuggerLight.md)
- [DrawDebuggerAxis](classes/DrawDebuggerAxis.md)
- [DrawDebuggerDirectionalLight](classes/DrawDebuggerDirectionalLight.md)
- [DrawDebuggerGrid](classes/DrawDebuggerGrid.md)
- [DrawDebuggerMesh](classes/DrawDebuggerMesh.md)
- [DrawDebuggerPointLight](classes/DrawDebuggerPointLight.md)
- [DrawDebuggerSpotLight](classes/DrawDebuggerSpotLight.md)
