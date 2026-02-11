#redgpu_include SYSTEM_UNIFORM;
struct OutData {
  @builtin(position) position : vec4<f32>,
  @location(0) vertexPosition: vec4<f32>,
};
struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) motionVector: vec4<f32>,
};
struct Uniforms {
    sunDirection: vec3<f32>,
};
@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(2) @binding(2) var multiScatteringTexture: texture_2d<f32>;
@group(2) @binding(3) var skyViewTexture: texture_2d<f32>;
@group(2) @binding(4) var transmittanceTextureSampler: sampler;

const PI: f32 = 3.14159265359;

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;
    
    let view_dir = normalize(outData.vertexPosition.xyz);
    
    let azimuth = atan2(view_dir.z, view_dir.x);
    let elevation = asin(clamp(view_dir.y, -1.0, 1.0));
    let sky_uv = vec2<f32>(
        (azimuth / (2.0 * PI)) + 0.5,
        0.5 - (elevation / PI)
    );
    
    // [KO] 순수 물리 에너지 샘플링 (임의 증폭 제거)
    var color = textureSample(skyViewTexture, transmittanceTextureSampler, clamp(sky_uv, vec2<f32>(0.0), vec2<f32>(1.0))).rgb;
    
    // Sun Disk
    let sun_dir = normalize(uniforms.sunDirection);
    let view_sun_cos = dot(view_dir, sun_dir);
    let sun_disk = smoothstep(0.9998, 1.0, view_sun_cos);
    
    let sun_zenith_cos = dot(sun_dir, vec3<f32>(0.0, 1.0, 0.0));
    let sun_uv = vec2<f32>((sun_zenith_cos + 1.0) * 0.5, 1.0 - (0.2 / 60.0));
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;
    
    // [KO] 태양 강도 보정 (태양은 물리적으로 매우 밝음)
    // 태양 밝기는 추후 외부 파라미터로 제어해야 하지만, 현재는 최소한의 가시성을 위해 유지
    color += sun_disk * sun_transmittance;

    output.color = vec4<f32>(color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
