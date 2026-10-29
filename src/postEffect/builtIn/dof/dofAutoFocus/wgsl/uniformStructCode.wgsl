#redgpu_include math.getIsFinite

struct Uniforms {
    focusDistance: f32,
    historyMode: u32,
    pad0: u32, // 16-byte tail alignment
    pad1: u32,
};

// [KO] 표준 카메라 뷰파인더 정중앙 측거점, 세로 높이 대비 ±2.5% Zone AF 반경, 및 초음파 모터(USM/STM) 표준 AF-C 추적 속도 상수
// [EN] Standard camera viewfinder center metering point, ±2.5% vertical Zone AF radius, and ultrasonic motor (USM/STM) standard AF-C tracking speed constants
const AF_CENTER_UV = vec2<f32>(0.5, 0.5);
const AF_ZONE_RADIUS: f32 = 0.025;
const AF_MOTOR_SPEED: f32 = 8.0;
const INV_SQRT2: f32 = 1.0 / sqrt(2.0);

const AF_ZONE_OFFSETS = array<vec2<f32>, 9>(
    vec2<f32>(0.0, 0.0),
    vec2<f32>(0.5, 0.0),
    vec2<f32>(-0.5, 0.0),
    vec2<f32>(0.0, 0.5),
    vec2<f32>(0.0, -0.5),
    vec2<f32>(INV_SQRT2, INV_SQRT2),
    vec2<f32>(-INV_SQRT2, INV_SQRT2),
    vec2<f32>(-INV_SQRT2, -INV_SQRT2),
    vec2<f32>(INV_SQRT2, -INV_SQRT2)
);

const AF_ZONE_WEIGHTS = array<f32, 9>(
    4.0,
    2.0,
    2.0,
    2.0,
    2.0,
    1.0,
    1.0,
    1.0,
    1.0
);
