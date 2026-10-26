struct VertexOutput {
    @builtin(position) position: vec4<f32>,
    @location(0) uv: vec2<f32>,
    @location(1) vertexColor_0: vec4<f32>,
    @location(2) worldNormal: vec3<f32>,
    @location(3) worldTangent: vec4<f32>,
    @location(4) worldPos: vec3<f32>,
    @location(5) @interpolate(flat) baseColorFactor: vec4<f32>,
    @location(6) @interpolate(flat) materialParams: vec4<f32>,
    @location(7) @interpolate(flat) textureFlags: vec4<f32>,
    @location(8) @interpolate(flat) sphereCenterRadius: vec4<f32>,
    @location(9) @interpolate(flat) cameraDir: vec4<f32>,
};
