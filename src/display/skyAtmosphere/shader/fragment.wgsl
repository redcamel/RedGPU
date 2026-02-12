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
    exposure: f32,
    sunIntensity: f32,
    cameraHeight: f32,
    earthRadius: f32,
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

    // skyViewShaderCode.wgsl과 동일한 역매핑 적용
    var v: f32;
    if (elevation >= 0.0) {
        // 위쪽(0° ~ 90°) -> v = 0.0 ~ 0.5
        let coord = sqrt(elevation / (PI * 0.5));
        v = 0.5 * (1.0 - coord);
    } else {
        // 아래쪽(-90° ~ 0°) -> v = 0.5 ~ 1.0
        let coord = sqrt(-elevation / (PI * 0.5));
        v = 0.5 * (1.0 + coord);
    }
    let sky_uv = vec2<f32>((azimuth / (2.0 * PI)) + 0.5, v);

    // 1. 대기 산란 휘도 (Sky-View LUT)
    // 지평선 아래 방향도 포함 (대기를 통한 간접광)
    let sky_luminance = textureSample(skyViewTexture, transmittanceTextureSampler, clamp(sky_uv, vec2<f32>(0.0), vec2<f32>(1.0))).rgb;

    // 2. 태양 디스크 직접광 (대기권 밖에서 들어오는 태양 자체)
    let view_sun_cos = dot(view_dir, sun_dir);

    // 태양 각반경 체크
    let sun_angular_radius = uniforms.sunSize * (PI / 180.0);
    let sun_cos_radius = cos(sun_angular_radius);

    // 태양 디스크 영역: 대기를 통과한 태양 직접광 계산
    let sun_zenith_cos = dot(sun_dir, up);
    let sun_uv = vec2<f32>((sun_zenith_cos + 1.0) * 0.5, 1.0 - (uniforms.cameraHeight / uniforms.atmosphereHeight));
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;

    // 태양 입체각(solid angle) 계산: Ω = 2π(1 - cos(θ))
    let sun_solid_angle = 2.0 * PI * (1.0 - cos(sun_angular_radius));

    // 태양 복사 휘도 (Radiance): 지구 대기권 밖에서의 태양 강도
    // 물리적 단위: W/(m²·sr)
    let sun_radiance = uniforms.sunIntensity / sun_solid_angle;

    // 태양 디스크 마스크 (smoothstep으로 부드러운 경계)
    let sun_disk_mask = smoothstep(sun_cos_radius - 0.001, sun_cos_radius, view_sun_cos);

    // 지평선 클리핑: view_dir이 지평선 아래를 보면 태양 안 보임
    let view_above_horizon = step(0.0, view_dir.y);

    // 태양이 지평선과 교차할 때 처리
    // 태양 중심의 elevation angle (라디안)
    let sun_elevation_angle = asin(clamp(sun_dir.y, -1.0, 1.0));

    // 태양의 하단 가장자리가 지평선보다 위에 있으면 보임
    // 태양이 완전히 지평선 아래로 내려가면 안 보임
    let sun_bottom_elevation = sun_elevation_angle - sun_angular_radius;
    let sun_top_elevation = sun_elevation_angle + sun_angular_radius;

    // 부드러운 전환: 태양 하단이 지평선 근처일 때
    let horizon_fade = smoothstep(-sun_angular_radius * 0.1, sun_angular_radius * 0.1, sun_bottom_elevation);

    let sun_disk_luminance = sun_radiance * sun_transmittance * sun_disk_mask * view_above_horizon * horizon_fade;

    // 3. 최종 합성: 산란광 + 태양 직접광
    let final_luminance = sky_luminance + sun_disk_luminance;

    // 4. 노출 적용 (모든 광원에 동일하게)
    var final_color = final_luminance * uniforms.exposure;

    output.color = vec4<f32>(final_color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
