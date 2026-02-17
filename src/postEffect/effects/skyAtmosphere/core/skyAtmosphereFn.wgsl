#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.HPI
#redgpu_include math.INV_PI
const MAX_TAU: f32 = 50.0;

// [KO] 대기 산란 시스템 통합 파라미터 구조체 (16바이트 정렬 완료)
struct AtmosphereParameters {
    rayleighScattering: vec3<f32>,
    mieAnisotropy: f32,
    ozoneAbsorption: vec3<f32>,
    ozoneLayerCenter: f32,
    groundAlbedo: vec3<f32>,
    groundAmbient: f32,
    sunDirection: vec3<f32>,
    sunSize: f32,
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

// [KO] 레이-구체 교차점 계산
fn get_ray_sphere_intersection(ray_origin: vec3<f32>, ray_dir: vec3<f32>, sphere_radius: f32) -> f32 {
    let b = dot(ray_origin, ray_dir);
    let c = dot(ray_origin, ray_origin) - sphere_radius * sphere_radius;
    let delta = b * b - c;
    if (delta < 0.0) { return -1.0; }
    let s = sqrt(delta);
    let t0 = -b - s;
    let t1 = -b + s;
    
    // [KO] epsilon을 1e-4로 조정하여 정밀도 문제로 인한 자기 교차 방지
    // [EN] Adjust epsilon to 1e-4 to prevent self-intersection due to precision issues
    if (t0 > 1e-4) { return t0; }
    if (t1 > 1e-4) { return t1; }
    return -1.0;
}

// [KO] UE5 표준 Transmittance LUT UV 매핑 (u: zenith, v: height)
// WebGPU: V=0.0 (Top) -> Atmosphere Top, V=1.0 (Bottom) -> Ground
fn get_transmittance_uv(h: f32, cos_theta: f32, atmosphere_height: f32) -> vec2<f32> {
    let H = clamp(h / atmosphere_height, 0.0, 1.0);
    let mu = cos_theta * 0.5 + 0.5;
    return vec2<f32>(mu, 1.0 - H); // V축 반전: 0(Top)=Atmo, 1(Bottom)=Ground
}

// [KO] 투과율 샘플링
fn get_transmittance(t_tex: texture_2d<f32>, t_sam: sampler, h: f32, cos_theta: f32, atmosphere_height: f32) -> vec3<f32> {
    let uv = get_transmittance_uv(h, cos_theta, atmosphere_height);
    return textureSampleLevel(t_tex, t_sam, uv, 0.0).rgb;
}

// [KO] UE5 표준 Sky-View LUT UV 매핑 (v=0.5: Horizon, v=0: Top, v=1: Bottom)
fn get_sky_view_uv(view_dir: vec3<f32>, view_height: f32, earth_radius: f32, atmosphere_height: f32) -> vec2<f32> {
    let azimuth = atan2(view_dir.z, view_dir.x);
    let u = (azimuth / PI2) + 0.5;

    let r = earth_radius;
    let h = max(0.0, view_height);
    let horizon_cos = -sqrt(max(0.0, h * (2.0 * r + h))) / (r + h);
    let horizon_elevation = asin(clamp(horizon_cos, -1.0, 1.0));
    let view_elevation = asin(clamp(view_dir.y, -1.0, 1.0));

    var v: f32;
    if (view_elevation >= horizon_elevation) {
        // [Sky Part] Horizon -> Top (0.5 -> 0.0)
        let v_range = HPI - horizon_elevation;
        let ratio = (view_elevation - horizon_elevation) / v_range;
        v = 0.5 * (1.0 - sqrt(max(0.0, ratio)));
    } else {
        // [Ground Part] Horizon -> Bottom (0.5 -> 1.0)
        let v_range = horizon_elevation + HPI;
        let ratio = (horizon_elevation - view_elevation) / v_range;
        v = 0.5 * (1.0 + sqrt(max(0.0, ratio)));
    }
    return vec2<f32>(u, clamp(v, 0.0, 1.0));
}

// [KO] 페이즈 함수
fn phase_rayleigh(cos_theta: f32) -> f32 {
    return 3.0 / (16.0 * PI) * (1.0 + cos_theta * cos_theta);
}

fn phase_mie(cos_theta: f32, g: f32) -> f32 {
    let g2 = g * g;
    return 1.0 / (4.0 * PI) * ((1.0 - g2) / pow(max(0.001, 1.0 + g2 - 2.0 * g * cos_theta), 1.5));
}

// [KO] 높이 안개 투과율
fn get_height_fog_transmittance(cam_h: f32, ray_dir_y: f32, dist: f32, density: f32, falloff: f32) -> f32 {
    if (density <= 0.0) { return 1.0; }
    let h = max(0.0, cam_h);
    let k = falloff;
    let y = ray_dir_y;
    var exponent: f32;
    if (abs(y) < 0.0001) {
        exponent = density * exp(-k * h) * dist;
    } else {
        exponent = (density * exp(-k * h)) / (k * y) * (1.0 - exp(-k * y * dist));
    }
    return exp(-max(0.0, exponent));
}
