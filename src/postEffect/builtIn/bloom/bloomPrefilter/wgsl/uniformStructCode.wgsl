#redgpu_include color.getLuminance

struct Uniforms {
    threshold: f32,
    softKnee: f32,
    maxBrightness: f32,
    pad0: f32,
};

fn applySoftThreshold(color: vec3<f32>, threshold: f32, softKnee: f32, maxBrightness: f32) -> vec3<f32> {
    let brightness = max(color.r, max(color.g, color.b));
    let knee = threshold * softKnee + 1e-5;
    let soft = clamp(brightness - threshold + knee, 0.0, 2.0 * knee);
    let quadratic = (soft * soft) / (4.0 * knee);
    let contribution = max(quadratic, brightness - threshold) / max(brightness, 1e-5);
    return min(color * contribution, vec3<f32>(maxBrightness));
}

fn karisWeight(color: vec3<f32>) -> f32 {
    return 1.0 / (1.0 + getLuminance(color));
}
