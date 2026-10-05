/**
 * [KO] 엔진 전역 바람 물리 파라미터 구조체 (32 Bytes, 16바이트 정렬)
 * [EN] Engine global wind physics parameter structure (32 Bytes, 16-byte aligned)
 */
struct Wind {
    // Offset 0: 바람 진행 방향 단위 벡터 (정규화된 vec3)
    direction: vec3<f32>,
    // Offset 12: 바람 이동 속도 (시간 배율)
    speed: f32,
    // Offset 16: 줄기 및 본체 주 굽힘 강도
    strength: f32,
    // Offset 20: 바람 진동 주파수 (물결 주기)
    frequency: f32,
    // Offset 24: 잎사귀/잔가지 미세 떨림 강도
    flutterStrength: f32,
    // Offset 28: 바람 효과 활성화 플래그 (1 = ON, 0 = OFF)
    enabled: u32,
};
