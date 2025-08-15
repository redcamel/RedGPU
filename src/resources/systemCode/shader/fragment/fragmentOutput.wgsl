struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) gBufferNormal: vec4<f32>,
    @location(2) gBufferRoughness: vec4<f32>,
}
