struct Light {
    position : vec3<f32>,
    radius : f32,
    color : vec3<f32>,
    intensity : f32
};
struct LightList {
    count:vec4<f32>,
    lights : array<Light>
};
@group(0) @binding(2) var<storage> lightList : LightList;