[**RedGPU API v4.4.0-Alpha**](../../../../../../../../README.md)

***

[RedGPU API](../../../../../../../../README.md) / [RedGPU](../../../../../README.md) / [ShaderLibrary](../../../README.md) / [systemStruct](../README.md) / Wind

# Variable: Wind

> `const` **Wind**: `string` = `Wind_wgsl`

Defined in: [src/systemCodeManager/ShaderLibrary.ts:2540](https://github.com/redcamel/RedGPU/blob/26caeb42c00946af874ef1905798dd18e81e18de/src/systemCodeManager/ShaderLibrary.ts#L2540)

엔진 전역 바람 물리 파라미터 구조체 (32 Bytes, 16바이트 정렬)

```wgsl
struct Wind {
    // Offset 0 (12B): 바람 진행 방향 단위 벡터 (정규화된 vec3, Y=0)
    direction: vec3<f32>,
    // Offset 12 (4B): 풍속 (대기 흐름의 시간 진행 속도 배율)
    speed: f32,
    // Offset 16 (4B): 풍압 / 바람의 기본 물리적 세기 (Wind Force / Intensity)
    strength: f32,
    // Offset 20 (4B): 바람 효과 활성화 플래그 (1 = ON, 0 = OFF)
    enabled: u32,
    // Offset 24 (4B): 16바이트 슬롯 완성을 위한 끝단 패딩 0
    pad0: f32,
    // Offset 28 (4B): 16바이트 슬롯 완성을 위한 끝단 패딩 1 (총 32B)
    pad1: f32,
};
```
