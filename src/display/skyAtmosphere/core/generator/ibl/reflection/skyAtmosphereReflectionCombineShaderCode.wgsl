// [EN] Combine prefiltered cubemaps (soft-cut / no-soft-cut) by roughness.

@group(0) @binding(0) var softCutTexture: texture_cube<f32>;
@group(0) @binding(1) var noSoftCutTexture: texture_cube<f32>;
@group(0) @binding(2) var combineSampler: sampler;
@group(0) @binding(3) var outTexture: texture_storage_2d_array<rgba16float, write>;

struct CombineUniforms {
    roughness: f32,
    mipLevel: f32,
    _pad: vec2<f32>
}
@group(0) @binding(4) var<uniform> uniforms: CombineUniforms;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;

    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
    let viewDir = normalize(getCubeMapDirection(uv, face));

    let mip = uniforms.mipLevel;
    let soft = textureSampleLevel(softCutTexture, combineSampler, viewDir, mip).rgb;
    let noSoft = textureSampleLevel(noSoftCutTexture, combineSampler, viewDir, mip).rgb;
    let t = clamp(uniforms.roughness, 0.0, 1.0);
    let curve = pow(t, 3.0) / 6.0;
//    let mixed = mix(soft, noSoft, curve);
    let mixed = mix(soft, noSoft, pow(t, 2.2));
//    let mixed = mix(noSoft, noSoft, curve);

    textureStore(outTexture, global_id.xy, global_id.z, vec4<f32>(mixed, 1.0));
}
