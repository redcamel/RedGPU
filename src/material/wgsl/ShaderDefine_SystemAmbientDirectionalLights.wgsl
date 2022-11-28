struct DirectionalLightUniforms {
  color : vec3<f32>,
  intensity:f32,
  direction : vec3<f32>,
};
struct SystemLightUniforms {
  ambientLight : vec4<f32>,
  directionalLightCount : vec4<f32>,
  directionalLight : array<DirectionalLightUniforms,REDGPU_CONST_MAX_DIRECTIONAL_LIGHT_NUM>,
};
@group(0) @binding(1) var<uniform> systemLightUniforms : SystemLightUniforms;