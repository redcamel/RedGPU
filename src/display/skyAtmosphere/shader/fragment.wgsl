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

// [수정] Uniform Buffer 정렬 문제를 해결하기 위해 vec4로 패킹
// TS(SkyAtmosphereMaterial.ts)와 1:1로 대응됩니다.
struct Uniforms {
    sunData: vec4<f32>,          // xyz: sunDirection, w: sunSize
    atmosphereParams: vec4<f32>, // x: atmHeight, y: exposure, z: sunIntensity, w: cameraHeight
    earthRadius: vec4<f32>,      // x: earthRadius, yzw: padding
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

    // [1] 데이터 언패킹 (Unpacking)
    let sunDirection = normalize(uniforms.sunData.xyz);
    let sunSize = uniforms.sunData.w;

    let atmosphereHeight = uniforms.atmosphereParams.x;
    let exposure = uniforms.atmosphereParams.y;
    let sunIntensity = uniforms.atmosphereParams.z;
    let cameraHeight = uniforms.atmosphereParams.w;
    // earthRadius는 패딩으로 인해 x값만 사용

    let view_dir = normalize(outData.vertexPosition.xyz);
    let up = vec3<f32>(0.0, 1.0, 0.0);

    // [2] Sky-View LUT 샘플링
    // atan2(z, x)는 Azimuth 0도를 +X축으로 정의합니다.
    let azimuth = atan2(view_dir.z, view_dir.x);
    let elevation = asin(clamp(view_dir.y, -1.0, 1.0));

    // SkyViewGenerator와 동일한 비선형 매핑 좌표 계산
    var v: f32;
    if (elevation >= 0.0) {
        let coord = sqrt(elevation / (PI * 0.5));
        v = 0.5 * (1.0 - coord);
    } else {
        let coord = sqrt(-elevation / (PI * 0.5));
        v = 0.5 * (1.0 + coord);
    }
    let sky_uv = vec2<f32>((azimuth / (2.0 * PI)) + 0.5, v);

    // 하늘 산란광 (Sky Luminance) 샘플링
    // 지평선 아래(y < 0) 영역에서는 SkyView LUT가 보통 어둡거나 검게 나옵니다.
    let sky_luminance = textureSample(skyViewTexture, transmittanceTextureSampler, clamp(sky_uv, vec2<f32>(0.0), vec2<f32>(1.0))).rgb;

    // [3] 태양 디스크 직접광 (Sun Disk)
    let view_sun_cos = dot(view_dir, sunDirection);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let sun_cos_radius = cos(sun_angular_radius);

    // 투과율 텍스처 샘플링을 위한 UV 계산
    let sun_zenith_cos = dot(sunDirection, up);

    // Transmittance UV 계산 (Y축 뒤집지 않음)
    let sun_uv = vec2<f32>(
        (sun_zenith_cos + 1.0) * 0.5,
        clamp(cameraHeight / atmosphereHeight, 0.0, 1.0)
    );
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;

    // 태양 Radiance 계산
    let sun_solid_angle = 2.0 * PI * (1.0 - cos(sun_angular_radius));
    let sun_radiance = sunIntensity / sun_solid_angle;

    // 태양 가장자리 부드럽게 (Anti-aliasing)
    let sun_disk_mask = smoothstep(sun_cos_radius - 0.0002, sun_cos_radius + 0.0002, view_sun_cos);

    // 지평선 아래 태양 제거
    let view_above_horizon = smoothstep(-0.01, 0.01, view_dir.y);

    let sun_disk_luminance = sun_radiance * sun_transmittance * sun_disk_mask * view_above_horizon;

    // [4] 가짜 지표면 (Fake Ground) 렌더링
    // 지평선 아래가 검게 나오는 현상을 방지하기 위해 지구 표면 색상을 합성합니다.
    var ground_color = vec3<f32>(0.0);
    if (view_dir.y < -0.01) {
        // 1. 지구 표면 색상 (Albedo): 약간 푸르스름한 회색
        let earth_albedo = vec3<f32>(0.05, 0.05, 0.1);

        // 2. 지표면 법선(Normal): 구체라고 가정하고 중심에서 뻗어나가는 방향
        let ground_normal = normalize(outData.vertexPosition.xyz);

        // 3. 지표면 조명 계산 (Lambertian)
        let NdotL = max(0.0, dot(ground_normal, sunDirection));

        // 4. 최종 지표면 색상 = 알베도 * 태양광 * 강도 (반사율 감안하여 조절)
        ground_color = earth_albedo * (sunIntensity * NdotL * 0.1);
    }

    // [5] 최종 합성 (HDR)
    // Sky + Sun + Ground
    // view_dir.y가 음수일 때 sky_luminance는 거의 0에 가까우므로 ground_color가 주가 됩니다.
    let final_hdr = sky_luminance + sun_disk_luminance + ground_color;

    // [6] 노출 적용 (톤맵핑 제거됨, Linear Output)
    let final_color = final_hdr * exposure;

    output.color = vec4<f32>(final_color, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}