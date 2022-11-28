struct SystemUniforms {
  projectionMatrix : mat4x4<f32>,
  inverseProjectionMatrix: mat4x4<f32>,
  cameraMatrix: mat4x4<f32>,
  resolution: vec2<f32>,
  nearFar: vec2<f32>,
};
@group(0) @binding(0) var<uniform> systemUniforms : SystemUniforms;