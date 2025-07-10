struct Uniforms {
    amount: f32,
    centerX:f32,
    centerY:f32
};
fn random(id: vec3<u32>, delta: f32) -> f32 {
    let seed: u32 = ((id.x << 16) | (id.y & 0xFFFF)) ^ (id.z * 0x63641362);
    let t: vec3<f32> = vec3<f32>(f32(seed & 0xFF), f32((seed >> 8) & 0xFF), f32(seed >> 16));
    return delta + fract(sin(dot(t, vec3<f32>(12.9898, 78.233, 12.9898))) * 43758.5453);
}
