// [KO] Sky-View LUT 생성을 위한 Compute Shader
@group(0) @binding(0) var skyViewTexture: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(2) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(3) var tSampler: sampler;

// [수정] 16바이트 정렬을 고려한 패킹 구조체
struct AtmosphereParameters {
    // Chunk 1
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,

    // Chunk 2 (vec3 + f32 패킹)
    rayleighScattering: vec3<f32>,
    mieAnisotropy: f32,

    // Chunk 3
    rayleighScaleHeight: f32,
    mieScaleHeight: f32,
    cameraHeight: f32,
    multiScatAmbient: f32,

    // Chunk 4 (vec3 + f32 패킹)
    ozoneAbsorption: vec3<f32>,
    ozoneLayerCenter: f32,

    // Chunk 5 (vec3 + f32 패킹)
    sunDirection: vec3<f32>,
    ozoneLayerWidth: f32,
};
@group(0) @binding(4) var<uniform> params: AtmosphereParameters;

const PI: f32 = 3.14159265359;

fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let t = -b + sqrt(delta);
    return select(-1.0, t, t > 0.0);
}

fn get_transmittance(h: f32, cos_theta: f32) -> vec3<f32> {
    // MultiScattering에서 사용한 매핑과 동일하게 유지
    let uv = vec2<f32>(
        clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0),
        clamp(h / params.atmosphereHeight, 0.0, 1.0)
    );
    return textureSampleLevel(transmittanceTexture, tSampler, uv, 0.0).rgb;
}

fn phase_rayleigh(cos_theta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cos_theta * cos_theta);
}

fn phase_mie(cos_theta: f32) -> f32 {
    let g = params.mieAnisotropy;
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(0.001, 1.0 + g2 - 2.0 * g * cos_theta), 1.5));
}

@compute @workgroup_size(16, 16)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(skyViewTexture);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = vec2<f32>(global_id.xy) / vec2<f32>(size - 1u);
    let azimuth = (uv.x - 0.5) * 2.0 * PI;

    // 비선형 고도 매핑 (지평선 부근 해상도 확보)
    let v = uv.y;
    var elevation: f32;
    if (v < 0.5) {
        let coord = 1.0 - v * 2.0;
        elevation = (coord * coord) * (PI * 0.5);
    } else {
        let coord = (v - 0.5) * 2.0;
        elevation = -(coord * coord) * (PI * 0.5);
    }

    // 카메라 기준 View Vector 계산
    let view_dir = vec3<f32>(cos(elevation) * cos(azimuth), sin(elevation), cos(elevation) * sin(azimuth));
    let ray_origin = vec3<f32>(0.0, params.cameraHeight + params.earthRadius, 0.0);

    let t_max = get_ray_sphere_intersection(ray_origin, view_dir, params.earthRadius + params.atmosphereHeight);
    let t_earth = get_ray_sphere_intersection(ray_origin, view_dir, params.earthRadius);

    var dist_limit = t_max;
    if (t_earth > 0.0) { dist_limit = min(t_max, t_earth); }

    var luminance = vec3<f32>(0.0);
    var transmittance_to_camera = vec3<f32>(1.0);

    if (dist_limit > 0.0) {
        let steps = 32; // 성능/품질 타협
        let step_size = dist_limit / f32(steps);

        for (var i = 0; i < steps; i = i + 1) {
            let t = (f32(i) + 0.5) * step_size;
            let p = ray_origin + view_dir * t;
            let cur_h = length(p) - params.earthRadius;

            // 태양 방향 투과율 (Shadow 포함)
            // MultiScattering에서 그림자를 이미 처리했으므로, 여기선 기하학적 그림자만 체크하면 됨
            let sun_trans = get_transmittance(max(0.0, cur_h), params.sunDirection.y);

            // 행성 자체 그림자 체크 (밤하늘 구현)
            let shadow_t = get_ray_sphere_intersection(p, params.sunDirection, params.earthRadius);
            var shadow_mask = 1.0;
            if (shadow_t > 0.0) { shadow_mask = 0.0; }

            let rho_r = exp(-max(0.0, cur_h) / params.rayleighScaleHeight);
            let rho_m = exp(-max(0.0, cur_h) / params.mieScaleHeight);

            let view_sun_cos = dot(view_dir, params.sunDirection);
            let phase_r = phase_rayleigh(view_sun_cos);
            let phase_m = phase_mie(view_sun_cos);

            // [1] Single Scattering (직사광)
            let scat_r = params.rayleighScattering * rho_r * phase_r;
            let scat_m = params.mieScattering * rho_m * phase_m;
            let single_scat = (scat_r + scat_m) * sun_trans * shadow_mask;

            // [2] Multi Scattering (간접광)
            // Multi-Scattering LUT 샘플링: X축(태양각도), Y축(고도)
            let multi_scat_uv = vec2<f32>(
                params.sunDirection.y * 0.5 + 0.5,
                clamp(cur_h / params.atmosphereHeight, 0.0, 1.0)
            );
            let multi_scat_energy = textureSampleLevel(multiScatTexture, tSampler, multi_scat_uv, 0.0).rgb;

            let total_density = params.rayleighScattering * rho_r + params.mieScattering * rho_m;
            // 그림자 속에서도 산란광(Ambient)은 존재해야 하므로 shadow_mask 대신 Ambient factor 사용
            let multi_scat = multi_scat_energy * total_density * params.multiScatAmbient;

            // 최종 합산
            let step_scat = single_scat + multi_scat;

            // 소멸(Extinction) 계산
            let ozone_density = max(0.0, 1.0 - abs(cur_h - params.ozoneLayerCenter) / params.ozoneLayerWidth);
            let extinction = params.rayleighScattering * rho_r + params.mieExtinction * rho_m + params.ozoneAbsorption * ozone_density;

            luminance += transmittance_to_camera * step_scat * step_size;
            transmittance_to_camera *= exp(-extinction * step_size);

            // 투과율이 거의 0이면 조기 종료 (성능 최적화)
            if (transmittance_to_camera.x < 0.001 && transmittance_to_camera.y < 0.001 && transmittance_to_camera.z < 0.001) {
                break;
            }
        }
    }

    textureStore(skyViewTexture, global_id.xy, vec4<f32>(luminance, 1.0));
}