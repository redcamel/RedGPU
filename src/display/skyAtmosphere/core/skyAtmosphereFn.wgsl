const PI: f32 = 3.14159265359;
const MAX_TAU: f32 = 50.0;

// [KO] 대기 산란 시스템에서 공유하는 통합 파라미터 구조체 (16바이트 정렬 최적화)
// [EN] Integrated parameter structure shared by the atmospheric scattering system (16-byte alignment optimized)
struct AtmosphereParameters {
    // 16-byte blocks
    rayleighScattering: vec3<f32>,
    mieAnisotropy: f32,

    ozoneAbsorption: vec3<f32>,
    ozoneLayerCenter: f32,

    groundAlbedo: vec3<f32>,
    groundAmbient: f32,

    sunDirection: vec3<f32>,
    sunSize: f32,

    // Scalars & Remaining
    earthRadius: f32,
    atmosphereHeight: f32,
    mieScattering: f32,
    mieExtinction: f32,

    rayleighScaleHeight: f32,
    mieScaleHeight: f32,
    cameraHeight: f32,
    multiScatteringAmbient: f32,

    exposure: f32,
    sunIntensity: f32,
    heightFogDensity: f32,
    heightFogFalloff: f32,

    horizonHaze: f32,
    mieGlow: f32,
    mieHalo: f32,
    groundShininess: f32,

    groundSpecular: f32,
    ozoneLayerWidth: f32,
    padding0: f32,
    padding1: f32,
};

// [KO] 레이와 구체의 교차점 중 '카메라 앞쪽의 가장 가까운 양수 교차점'을 정확히 반환
fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let s = sqrt(delta);
    let t0 = -b - s;
    let t1 = -b + s;
    if (t0 > -1e-6) { return max(0.0, t0); }
    if (t1 > -1e-6) { return max(0.0, t1); }
    return -1.0;
}

// [KO] 고도와 태양 각도에 따른 투과율 LUT UV 좌표 계산
fn get_transmittance_uv(h: f32, cos_theta: f32, atmosphere_height: f32) -> vec2<f32> {
    let v = sqrt(clamp(h / atmosphere_height, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return vec2<f32>(u, v);
}

// [KO] 레일리 산란(Rayleigh Scattering) 페이즈 함수
fn phase_rayleigh(cos_theta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cos_theta * cos_theta);
}

// [KO] 미 산란(Mie Scattering) 페이즈 함수 (Henyey-Greenstein)
fn phase_mie(cos_theta: f32, g: f32) -> f32 {
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(0.001, 1.0 + g2 - 2.0 * g * cos_theta), 1.5));
}

// [KO] 지수적 높이 안개 투과율 계산 (Exponential Height Fog)
fn get_height_fog_transmittance(cam_h: f32, ray_dir_y: f32, dist: f32, density: f32, falloff: f32) -> f32 {
    if (density <= 0.0) { return 1.0; }
    let h = max(0.0, cam_h);
    let k = falloff;
    let d = dist;
    let y = ray_dir_y;
    var exponent: f32;
    if (abs(y) < 0.0001) {
        exponent = density * exp(-k * h) * d;
    } else {
        exponent = (density * exp(-k * h)) / (k * y) * (1.0 - exp(-k * y * d));
    }
    return exp(-max(0.0, exponent));
}
