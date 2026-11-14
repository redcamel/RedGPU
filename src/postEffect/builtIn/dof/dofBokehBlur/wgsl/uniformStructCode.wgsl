#redgpu_include color.getLuminance
#redgpu_include math.PI

struct Uniforms {
    bokehBrightness: f32,
    bladeCount: u32,
    passMode: u32,
    pad0: u32, // 16-byte tail alignment
};

const TWO_PI: f32 = PI * 2.0;
const CIRCULAR_SECTOR_COUNT: u32 = u32(round(TWO_PI));
const RING_COUNT: u32 = 5u;
const MAX_BLADE_COUNT: u32 = 9u;
const TAPS_PER_SECTOR: u32 = (RING_COUNT * (RING_COUNT + 1u)) / 2u;
const MAX_KERNEL_TAPS: u32 = MAX_BLADE_COUNT * TAPS_PER_SECTOR;

// [KO] 워크그룹(16x16 = 256 스레드) 공유 조리개 단위 커널 캐시: (edgeDir.x, edgeDir.y, polyScale, 0.0)
// [EN] Workgroup (16x16 = 256 threads) shared unit aperture kernel cache: (edgeDir.x, edgeDir.y, polyScale, 0.0)
var<workgroup> sharedKernel: array<vec4<f32>, MAX_KERNEL_TAPS>;
