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

@group(2) @binding(0) var<uniform> uniforms: AtmosphereParameters;
@group(2) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(2) @binding(2) var multiScatteringTexture: texture_2d<f32>;
@group(2) @binding(3) var skyViewTexture: texture_2d<f32>;
// TODO: MSAA 대응 시 texture_depth_2d_multisampled 및 textureLoad sample_index 처리 필요
@group(2) @binding(5) var sceneDepthTexture: texture_depth_2d;

// [추가] 절차적 지형 노이즈 함수
fn hash33(p: vec3<f32>) -> vec3<f32> {
    var p3 = fract(p * vec3<f32>(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yxz + 33.33);
    return fract((p3.xxy + p3.yzz) * p3.zyx);
}

fn get_ground_noise(p: vec3<f32>) -> f32 {
    let i = floor(p);
    let f = fract(p);
    let u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(dot(hash33(i + vec3<f32>(0.0, 0.0, 0.0)), f - vec3<f32>(0.0, 0.0, 0.0)),
                       dot(hash33(i + vec3<f32>(1.0, 0.0, 0.0)), f - vec3<f32>(1.0, 0.0, 0.0)), u.x),
                   mix(dot(hash33(i + vec3<f32>(0.0, 1.0, 0.0)), f - vec3<f32>(0.0, 1.0, 0.0)),
                       dot(hash33(i + vec3<f32>(1.0, 1.0, 0.0)), f - vec3<f32>(1.0, 1.0, 0.0)), u.x), u.y),
               mix(mix(dot(hash33(i + vec3<f32>(0.0, 0.0, 1.0)), f - vec3<f32>(0.0, 0.0, 1.0)),
                       dot(hash33(i + vec3<f32>(1.0, 0.0, 1.0)), f - vec3<f32>(1.0, 0.0, 1.0)), u.x),
                   mix(dot(hash33(i + vec3<f32>(0.0, 1.0, 1.0)), f - vec3<f32>(0.0, 1.0, 1.0)),
                       dot(hash33(i + vec3<f32>(1.0, 1.0, 1.0)), f - vec3<f32>(1.0, 1.0, 1.0)), u.x), u.y), u.z);
}

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;

    let viewDir = normalize(outData.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);
    let camH = max(0.0001, uniforms.cameraHeight);
    let r = uniforms.earthRadius;
    let atmH = uniforms.atmosphereHeight;

    // 1. 깊이 정보를 통한 거리 계산 (리니어 깊이 -> 실제 시선 거리 보정)
    let rawDepth = textureLoad(sceneDepthTexture, vec2<i32>(outData.position.xy), 0);
    
    // [보정] 단순 View-Z 거리는 카메라 회전 시 값이 변하므로, 
    // 카메라 정방향(Forward)과의 각도를 고려하여 실제 Ray Length(Km)를 구합니다.
    let viewZ = linearDepth(rawDepth);
    let camForward = -normalize(systemUniforms.camera.cameraMatrix[2].xyz);
    let cosTheta = max(0.01, dot(viewDir, camForward));
    let sceneDistKm = (viewZ / cosTheta) / 1000.0;

    // 2. 가상 행성 충돌 검사
    let camPos = vec3<f32>(0.0, r + camH, 0.0);
    let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);
    
    // 최종 충돌 거리 결정 (메시가 있으면 메시 거리, 없으면 지면 거리)
    var hitDistKm = select(1e6, t_earth, t_earth > 0.0);
    if (rawDepth < 1.0) { hitDistKm = min(hitDistKm, sceneDistKm); }

    // 3. Sky-View 및 Aerial Perspective 샘플링
    var atmosphereColor: vec3<f32>;
    var atmosphereTransmittance: f32;

    if (rawDepth >= 1.0 && t_earth <= 0.0) {
        // [하늘 영역]
        let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
        atmosphereColor = skySample.rgb;
        atmosphereTransmittance = skySample.a;
    } else {
        // [메시/지면 영역] 3D Aerial Perspective 적용
        let azimuth = atan2(viewDir.z, viewDir.x);
        let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
        let u = (azimuth / (2.0 * PI)) + 0.5;
        let v = (elevation / PI) + 0.5; // [-PI/2, PI/2] -> [0, 1]
        
        // 3D LUT의 w 매핑 (0~100km 범위, 비선형)
        let w = sqrt(clamp(hitDistKm / 100.0, 0.0, 1.0));
        
        let apSample = textureSampleLevel(cameraVolumeTexture, tSampler, vec3<f32>(u, v, w), 0.0);
        atmosphereColor = apSample.rgb;
        atmosphereTransmittance = apSample.a;
    }

    // 4. 지면 및 메시 합성
    var finalHDR: vec3<f32>;
    let haze_amount = mix(0.3, 0.1, smoothstep(-0.2, 0.5, sunDir.y));

    if (rawDepth >= 1.0 && t_earth > 0.0) {
        // 가상 지면 렌더링
        let hitPos = camPos + viewDir * t_earth;
        let up = normalize(hitPos);
        let cos_sun = dot(up, sunDir);
        let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, cos_sun, atmH);
        
        let noiseVal = get_ground_noise(hitPos * 0.1) * 0.5 + get_ground_noise(hitPos * 2.0) * 0.25;
        let albedo = mix(uniforms.groundAlbedo * 0.7, uniforms.groundAlbedo * 1.3, noiseVal) / PI;
        
        let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
        finalHDR = (diffuse * atmosphereTransmittance) + (atmosphereColor * uniforms.sunIntensity);
    } else if (rawDepth < 1.0) {
        // 메시 영역 (실제 렌더링은 메시 머티리얼이 담당, 여기선 대기만 합성)
        // 현재 Sky는 투명도를 가질 수 없으므로 우선 메시 뒤로 숨김
        discard;
    } else {
        // 순수 하늘
        finalHDR = atmosphereColor * uniforms.sunIntensity;
        
        // 태양 디스크
        let view_sun_cos = dot(viewDir, sunDir);
        let sun_rad = uniforms.sunSize * (PI / 180.0);
        let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
        let sun_trans = get_transmittance(transmittanceTexture, tSampler, camH, sunDir.y, atmH);
        finalHDR += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
    }

    // 공통 지평선 연무 (Haze)
    let distFromHorizon = asin(clamp(viewDir.y, -1.0, 1.0)) - (asin(clamp(-sqrt(max(0.0, camH * (2.0 * r + camH))) / (r + camH), -1.0, 1.0)));
    let horizon_haze_mask = exp(-abs(distFromHorizon) * (15.0 / (haze_amount + 0.01)));
    finalHDR += (atmosphereColor * uniforms.sunIntensity) * uniforms.horizonHaze * horizon_haze_mask * 0.2;

    output.color = vec4<f32>(finalHDR * uniforms.exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
