#redgpu_include color.getLuminance
#redgpu_include math.PI

struct Uniforms {
    maxCoC: f32,
    bokehBrightness: f32,
    bladeCount: u32,
    passMode: u32,
};

const TWO_PI: f32 = 6.28318530718;
const RING_COUNT: u32 = 5u;
const INV_RING_COUNT: f32 = 0.2;

fn getOpticalSampleWeight(color: vec3<f32>, bokehBrightness: f32) -> f32 {
    let luma = max(getLuminance(color), 0.0);
    let hdrExcess = max(luma - 1.0, 0.0);
    return 1.0 + hdrExcess * bokehBrightness;
}
