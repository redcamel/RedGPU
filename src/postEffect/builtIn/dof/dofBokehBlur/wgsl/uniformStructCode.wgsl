#redgpu_include color.getLuminance
#redgpu_include math.PI

struct Uniforms {
    maxCoC: f32,
    bokehBrightness: f32,
    bladeCount: u32,
    passMode: u32,
};

const TWO_PI: f32 = PI * 2.0;
const CIRCULAR_SECTOR_COUNT: u32 = u32(round(TWO_PI));
const RING_COUNT: u32 = 5u;
