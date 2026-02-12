// [KO] 다중 산란(Multi-Scattering) 에너지 보정 LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var multiScatTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var tSampler: sampler;

struct AtmosphereParameters {
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,
    rayleighScattering: vec3<f32>,
    dummy1: f32,
    mieAnisotropy: f32,
    rayleighScaleHeight: f32,
    mieScaleHeight: f32,
    cameraHeight: f32,
    ozoneAbsorption: vec3<f32>,
    dummy2: f32,
};
@group(0) @binding(3) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let sol = -b + sqrt(delta);
    return select(-1.0, sol, sol > 0.0);
}

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    let uv = vec2<f32>(
        clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0),
        clamp(h / params.atmosphereHeight, 0.0, 1.0)
    );
    return textureSampleLevel(transmittanceTexture, tSampler, uv, 0.0).rgb;
}

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);

    // X축: 태양 각도, Y축: 고도
    let cos_sun_theta = uv.x * 2.0 - 1.0;
    let h = uv.y * params.atmosphereHeight;

    let ray_origin = vec3<f32>(0.0, h + params.earthRadius, 0.0);

    // 태양 방향 벡터
    let sun_dir = vec3<f32>(sqrt(max(0.0, 1.0 - cos_sun_theta * cos_sun_theta)), cos_sun_theta, 0.0);

    var lum_total = vec3<f32>(0.0);
    var fms = vec3<f32>(0.0);

    let sample_count = 64;

    // [Soft Shadow Fix]
    // 기존의 칼같은 shadow_check 대신, 지평선 각도를 기준으로 부드럽게 어둡게 만듭니다.

    var sun_transmittance = get_transmittance(h, cos_sun_theta);

    // 현재 높이 h에서의 지평선 코사인 값 계산 (기하학적 한계선)
    // cos_hor = -sqrt(h * (2R + h)) / (R + h)
    let r = params.earthRadius;
    let horizon_cosine = -sqrt(h * (2.0 * r + h)) / (r + h);

    // 지평선 근처에서 빛을 부드럽게 감쇠 (smoothstep 사용)
    // 0.15 범위는 '노을/박명'이 지속되는 구간의 길이를 조절합니다.
    let light_fade = smoothstep(horizon_cosine - 0.15, horizon_cosine + 0.15, cos_sun_theta);

    // 투과율에 감쇠 적용
    sun_transmittance = sun_transmittance * light_fade;

    for (var i = 0; i < sample_count; i = i + 1) {
        let step = f32(i) + 0.5;
        let theta = acos(1.0 - 2.0 * step / f32(sample_count));
        let phi = (sqrt(5.0) + 1.0) * PI * step;

        let ray_dir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let t_max = get_ray_sphere_intersection(ray_origin, ray_dir, params.earthRadius + params.atmosphereHeight);
        let t_earth = get_ray_sphere_intersection(ray_origin, ray_dir, params.earthRadius);

        if (t_max > 0.0 && t_earth < 0.0) {
            let ray_transmittance = get_transmittance(h, ray_dir.y);

            // Phase Function
            let nu = dot(ray_dir, sun_dir);
            let phase = 3.0 / (16.0 * PI) * (1.0 + nu * nu);

            let scattering = 1.0 - ray_transmittance;

            // 적분 누적
            lum_total += scattering * sun_transmittance * phase;
            fms += scattering * (1.0 / f32(sample_count));
        }
    }

    let final_energy = lum_total / f32(sample_count) * 4.0 * PI;

    // 지난번 에러(min 타입 불일치)도 여기서 함께 수정되어 있습니다.
    let output = final_energy / (1.0 - min(fms, vec3<f32>(0.999)));

    textureStore(multiScatTexture, global_id.xy, vec4<f32>(output, 1.0));
}