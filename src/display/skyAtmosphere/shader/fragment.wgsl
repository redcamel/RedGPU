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
    
    // LUT 샘플링 좌표 계산
    let uv = vec2<f32>((cos_theta + 1.0) * 0.5, h / atmosphereHeight);
    let transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, uv).rgb;
    
    // 태양 방향과의 각도 계산
    let sun_cos_theta = dot(view_dir, normalize(uniforms.sunDirection));
    
    // 투과율을 기반으로 색상 결정
    var color = 1.0 - transmittance;
    
    // 단순 태양 디스크 표현
    let sun_disk = smoothstep(0.99, 1.0, sun_cos_theta);
    
    // 하늘색 혼합 (태양 위치에 따라 색상 변화)
    let sky_color = mix(vec3<f32>(0.3, 0.5, 0.9), vec3<f32>(0.1, 0.2, 0.4), clamp(cos_theta, 0.0, 1.0));
    color = color * sky_color * 2.0 + sun_disk * transmittance * 5.0;

    output.color = vec4<f32>(color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
