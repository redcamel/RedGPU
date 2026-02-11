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
    sunSize: f32,
    atmosphereHeight: f32,
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
    
    // Sky-View Sampling
    var color = textureSample(skyViewTexture, transmittanceTextureSampler, clamp(sky_uv, vec2<f32>(0.0), vec2<f32>(1.0))).rgb;
    
    // Sun Disk Calculation
    let sun_dir = normalize(uniforms.sunDirection);
    let view_sun_cos = dot(view_dir, sun_dir);
    let sun_angular_radius = uniforms.sunSize * (PI / 180.0);
    let sun_cos_radius = cos(sun_angular_radius);
    let sun_disk = smoothstep(sun_cos_radius - 0.0001, sun_cos_radius, view_sun_cos);
    
    // Sun Transmittance (V=1 is Ground 매핑)
    let sun_zenith_cos = dot(sun_dir, vec3<f32>(0.0, 1.0, 0.0));
    // [KO] 주입받은 atmosphereHeight 사용
    let sun_uv = vec2<f32>((sun_zenith_cos + 1.0) * 0.5, 1.0 - (0.2 / uniforms.atmosphereHeight));
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;
    
    // 최종 에너지 합성 (임시 보정치 유지)
    color *= 20.0; 
    color += sun_disk * sun_transmittance * 100.0;

    output.color = vec4<f32>(color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
