[**RedGPU API v4.1.0-Alpha**](../../../../../../../README.md)

***

[RedGPU API](../../../../../../../README.md) / [RedGPU](../../../../README.md) / [Display](../../README.md) / drawDebugger

# drawDebugger

RedGPU의 공간 디버깅 헬퍼 및 가이드 요소들을 제공하는 모듈입니다.

이 모듈은 3D 공간 상에서 축(Axis), 그리드(Grid), 메시 바운딩 볼륨(AABB, OBB), 그리고 각종 조명(Directional, Point, Spot)들의
물리적 위치와 영향 범위를 가시적으로 표현하는 디버깅 오브젝트를 포함합니다.

## Remarks

***
- 각 디버거들은 성능 최적화를 위해 원본 객체의 트랜스폼 및 볼륨 크기를 캐싱하여 변경이 감지될 때만 동적으로 기하를 갱신합니다.
- `enableDebugger` 플래그 및 카메라 절두체 컬링(View Frustum Culling)과의 연동으로 불필요한 GPU 렌더 연산을 회피합니다.


## Debugger

- [ADrawDebuggerLight](classes/ADrawDebuggerLight.md)
- [DrawDebuggerAxis](classes/DrawDebuggerAxis.md)
- [DrawDebuggerDirectionalLight](classes/DrawDebuggerDirectionalLight.md)
- [DrawDebuggerGrid](classes/DrawDebuggerGrid.md)
- [DrawDebuggerMesh](classes/DrawDebuggerMesh.md)
- [DrawDebuggerPointLight](classes/DrawDebuggerPointLight.md)
- [DrawDebuggerSpotLight](classes/DrawDebuggerSpotLight.md)
