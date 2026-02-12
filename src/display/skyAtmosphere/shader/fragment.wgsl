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
    let sun_zenith_cos = sunDirection.y;

    // [수정] Transmittance LUT 매핑 동기화 (UE 표준: [-1, 1] 선형 + 비선형 높이)
    let safe_h = clamp(cameraHeight / atmosphereHeight, 0.0, 1.0);
    let sun_uv = vec2<f32>(
        clamp(sun_zenith_cos * 0.5 + 0.5, 0.0, 1.0),
        sqrt(safe_h)
    );
    let sun_transmittance = textureSample(transmittanceTexture, transmittanceTextureSampler, sun_uv).rgb;

    // 태양 Radiance 계산
    let sun_solid_angle = 2.0 * PI * (1.0 - cos(sun_angular_radius));
    let sun_radiance = sunIntensity / sun_solid_angle;

    // 태양 가장자리 부드럽게 (Anti-aliasing)
    let sun_disk_mask = smoothstep(sun_cos_radius - 0.0002, sun_cos_radius + 0.0002, view_sun_cos);

    // [수정] 지평선 아래 태양 제거 및 부드러운 전이
    let sun_visibility = smoothstep(-0.02, 0.02, sun_zenith_cos);
    let view_above_horizon = smoothstep(-0.01, 0.01, view_dir.y);

    let sun_disk_luminance = sun_radiance * sun_transmittance * sun_disk_mask * view_above_horizon * sun_visibility;

    // [4] 가짜 지표면 (Fake Ground) 렌더링
    var ground_color = vec3<f32>(0.0);
    if (view_dir.y < -0.01) {
        // 1. 지구 표면 색상 (Albedo): 조금 더 밝은 회색
        let earth_albedo = vec3<f32>(0.15, 0.15, 0.15);

        // 2. 물리적 지표면 법선 계산 (구형 지구 중심 기준)
        let r = uniforms.earthRadius.x;
        // 카메라 위치는 (0, r+h, 0)
        let cam_pos = vec3<f32>(0.0, r + cameraHeight, 0.0);
        
        // Ray-Sphere Intersection (지표면 r과 교차)
        let b = dot(cam_pos, view_dir);
        let c = dot(cam_pos, cam_pos) - r * r;
        let delta = b * b - c;
        // delta는 항상 양수여야 함 (내부에서 아래를 보므로)
        let t = -b - sqrt(max(0.0, delta));
        
        let hit_pos = cam_pos + view_dir * t;
        let ground_normal = normalize(hit_pos); // 구 중심(0,0,0) 기준 법선

        // 3. 지표면 조명 계산 (Lambertian + Physical Ambient)
        // 직사광
        let NdotL = max(0.0, dot(ground_normal, sunDirection));
        
        // 지표면(h=0)에서의 투과율 계산 (v = sqrt(0/H) = 0)
        let ground_sun_uv = vec2<f32>(
            clamp(sunDirection.y * 0.5 + 0.5, 0.0, 1.0),
            0.0 
        );
        let ground_transmittance = textureSampleLevel(transmittanceTexture, transmittanceTextureSampler, ground_sun_uv, 0.0).rgb;
        let direct_light = sunIntensity * ground_transmittance * NdotL;
        
        // 간접광 (Ambient from MultiScattering LUT)
        // 지표면(h=0)에서의 평균 산란광 (v = 0)
        let ambient_uv = vec2<f32>(
             clamp(sunDirection.y * 0.5 + 0.5, 0.0, 1.0),
             0.0
        );
        let ambient_light = textureSampleLevel(multiScatteringTexture, transmittanceTextureSampler, ambient_uv, 0.0).rgb * sunIntensity * 0.5;
        
        // 4. 최종 지표면 색상
        ground_color = earth_albedo * (direct_light + ambient_light);
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