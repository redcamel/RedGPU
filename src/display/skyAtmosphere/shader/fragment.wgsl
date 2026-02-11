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
    
    // Sky-View Sampling (Luminance)
    var color = textureSample(skyViewTexture, transmittanceTextureSampler, clamp(sky_uv, vec2<f32>(0.0), vec2<f32>(1.0))).rgb;
    
    // Sun Disk Calculation
    let sun_dir = normalize(uniforms.sunDirection);
    let view_sun_cos = dot(view_dir, sun_dir);
    
    // [KO] 태양 크기 조절 (sunSize 반영)
    // [EN] Adjust sun disk size using sunSize
    let sun_angular_radius = uniforms.sunSize * (PI / 180.0);
    let sun_cos_radius = cos(sun_angular_radius);
    let sun_disk = smoothstep(sun_cos_radius - 0.0001, sun_cos_radius, view_sun_cos);
    
    // Sun Transmittance
    let sun_zenith_cos = dot(sun_dir, vec3<f32>(0.0, 1.0, 0.0));
    let sun_uv = vec2<f32>((sun_zenith_cos + 1.0) * 0.5, 1.0 - (0.2 / 60.0));
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;
    
    // [KO] 최종 에너지 합성
    // 1. 하늘 산란광 증폭 (톤매핑 전 가시성 확보)
    color *= 20.0; 
    
    // 2. 태양 디스크 합성 (물리적 투과율 적용)
    color += sun_disk * sun_transmittance * 100.0;

    output.color = vec4<f32>(color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
