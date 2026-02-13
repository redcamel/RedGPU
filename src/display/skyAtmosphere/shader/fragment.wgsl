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
@group(2) @binding(4) var cameraVolumeTexture: texture_3d<f32>;
@group(2) @binding(5) var sceneDepthTexture: texture_depth_2d;
@group(2) @binding(6) var tSampler: sampler;

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;

    let viewDir = normalize(outData.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);
    let camH = max(0.0001, uniforms.cameraHeight);
    let r = uniforms.earthRadius;
    let atmH = uniforms.atmosphereHeight;

    // 1. 깊이 정보를 통한 거리 계산
    let rawDepth = textureLoad(sceneDepthTexture, vec2<i32>(outData.position.xy), 0);
    let near = systemUniforms.camera.nearClipping;
    let far = systemUniforms.camera.farClipping;
    let sceneDistKm = (near * far / (far - rawDepth * (far - near))) / 1000.0;

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
        let v = elevation / PI + 0.5;
        let w = sqrt(clamp(hitDistKm / 100.0, 0.0, 1.0));
        
        let apSample = textureSampleLevel(cameraVolumeTexture, tSampler, vec3<f32>(u, v, w), 0.0);
        atmosphereColor = apSample.rgb;
        atmosphereTransmittance = apSample.a;
    }

    // 4. 지면 색상 계산 (메시가 없을 때만 가상 지면 렌더링)
    var finalHDR = atmosphereColor * uniforms.sunIntensity;
    if (rawDepth >= 1.0 && t_earth > 0.0) {
        let hitPos = camPos + viewDir * t_earth;
        let up = normalize(hitPos);
        let cos_sun = dot(up, sunDir);
        let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, cos_sun, atmH);
        
        // 지면 알베도 및 라이팅 (가장 단순한 물리 모델)
        let diffuse = (uniforms.groundAlbedo / PI) * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
        finalHDR = (diffuse * atmosphereTransmittance) + (atmosphereColor * uniforms.sunIntensity);
    } else if (rawDepth < 1.0) {
        // 메시 영역은 셰이더에서 직접 그리지 않고 discard 하여 메시가 보이게 함
        // (메시 머티리얼에서 이 LUT를 써야 완벽하게 합성됨)
        discard;
    }

    // 5. 태양 디스크 (하늘 영역에만)
    if (rawDepth >= 1.0 && t_earth <= 0.0) {
        let view_sun_cos = dot(viewDir, sunDir);
        let sun_rad = uniforms.sunSize * (PI / 180.0);
        let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
        let sun_trans = get_transmittance(transmittanceTexture, tSampler, camH, sunDir.y, atmH);
        finalHDR += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
    }

    output.color = vec4<f32>(finalHDR * uniforms.exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
