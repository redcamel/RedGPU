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
    let sun_dir = normalize(uniforms.sunDirection);
    let up = vec3<f32>(0.0, 1.0, 0.0);
    
    // 비선형 샘플링 좌표 (Sky-View LUT 매핑과 동기화)
    let azimuth = atan2(view_dir.z, view_dir.x); 
    let elevation = asin(clamp(view_dir.y, -1.0, 1.0));
    
    var v: f32;
    if (elevation > 0.0) {
        v = 0.5 * (1.0 - sqrt(elevation / (PI * 0.5)));
    } else {
        v = 0.5 * (1.0 + sqrt(-elevation / (PI * 0.5)));
    }
    let sky_uv = vec2<f32>((azimuth / (2.0 * PI)) + 0.5, v);
    
    // 1. 대기 휘도 샘플링
    var sky_luminance = textureSample(skyViewTexture, transmittanceTextureSampler, clamp(sky_uv, vec2<f32>(0.0), vec2<f32>(1.0))).rgb;
    
    // 2. 태양 투과율 (태양의 실제 색상)
    let sun_zenith_cos = dot(sun_dir, up);
    let sun_uv = vec2<f32>((sun_zenith_cos + 1.0) * 0.5, 1.0 - (0.2 / uniforms.atmosphereHeight));
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;
    
    // 3. 태양 디스크 및 눈부심 (Halo)
    let view_sun_cos = dot(view_dir, sun_dir);
    
    // 태양 본체 (Sun Disk)
    let sun_angular_radius = uniforms.sunSize * (PI / 180.0);
    let sun_cos_radius = cos(sun_angular_radius);
    let sun_disk = smoothstep(sun_cos_radius - 0.0001, sun_cos_radius, view_sun_cos);
    
    // 태양 주변 눈부심 (Mie Glow - 임시 강화)
    let sun_glow = pow(max(0.0, view_sun_cos), 2000.0) * 10.0;
    
    // 4. 최종 합성 및 가시성 보정
    // [KO] 가시성을 위해 노출값을 20배 상향 (톤매핑 전 임시 조치)
    let exposure = 20.0;
    var final_color = sky_luminance * exposure;
    
    // 태양 에너지 합성 (물리적으로 매우 밝게 설정)
    final_color += (sun_disk + sun_glow) * sun_transmittance * 100.0;

    output.color = vec4<f32>(final_color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
