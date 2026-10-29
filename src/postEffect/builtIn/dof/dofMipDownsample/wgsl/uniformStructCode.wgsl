#redgpu_include color.getLuminance

fn computeDefocusSampleWeight(sample: vec4<f32>, maxAbsCoC: f32) -> f32 {
    let absCoC = abs(sample.a);
    let defocusGate = select(1.0, smoothstep(0.15, 0.85, absCoC), maxAbsCoC > 0.35);
    let luma = max(getLuminance(sample.rgb), 0.0);
    let karisWeight = 1.0 / (1.0 + luma * 0.05);
    return max(defocusGate * karisWeight, 1e-4);
}
