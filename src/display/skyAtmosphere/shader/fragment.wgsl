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
@group(2) @binding(2) var transmittanceTextureSampler: sampler;

const PI: f32 = 3.14159265359;
const earthRadius: f32 = 6360.0;
const atmosphereHeight: f32 = 60.0;

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;
    
    // 로컬 위치를 정규화하여 방향 벡터 획득
    let view_dir = normalize(outData.vertexPosition.xyz);
    let up = vec3<f32>(0.0, 1.0, 0.0);
    let cos_theta = dot(view_dir, up);
    
    // 현재 카메라 높이 (일단 해수면 근처 0.2km로 가정)
    let h = 0.2;
    
    // 1. 시야각에 따른 투과율 (대기의 두께감 표현)
    let uv = vec2<f32>((cos_theta + 1.0) * 0.5, h / atmosphereHeight);
    let transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, uv).rgb;
    
    // 2. 태양 방향과의 각도 및 태양 투과율 (노을 색감의 핵심)
    let sun_dir = normalize(uniforms.sunDirection);
    let sun_cos_theta = dot(sun_dir, up);
    let sun_uv = vec2<f32>(sun_cos_theta * 0.5 + 0.5, h / atmosphereHeight);
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;
    
    // 3. 태양 디스크와 주변 산란 광량 계산
    let view_sun_cos_theta = dot(view_dir, sun_dir);
    let sun_disk = smoothstep(0.998, 1.0, view_sun_cos_theta);
    
    // 4. 하늘 바탕색 결정 (태양 투과율을 곱해 노을빛 적용)
    // 낮에는 푸른색, 노을시엔 태양 투과율에 따라 붉은색으로 전이
    let base_sky_color = mix(vec3<f32>(0.3, 0.5, 0.9), vec3<f32>(0.1, 0.2, 0.4), clamp(cos_theta, 0.0, 1.0));
    let sky_color = base_sky_color * sun_transmittance * 3.0; // 에너지를 보정하여 밝게 유지
    
    // 5. 최종 합성
    // (1.0 - transmittance)는 대기 농도를 의미함
    var color = (1.0 - transmittance) * sky_color;
    
    // 태양 디스크 추가 (태양 투과율이 적용된 색상)
    color = color + sun_disk * sun_transmittance * 10.0;

    output.color = vec4<f32>(color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
