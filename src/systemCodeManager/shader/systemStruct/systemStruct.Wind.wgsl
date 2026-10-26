/**
 * [KO] 엔진 전역 바람 물리 파라미터 구조체 (32 Bytes, 16바이트 정렬)
 * [EN] Engine global wind physics parameter structure (32 Bytes, 16-byte aligned)
 */
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
