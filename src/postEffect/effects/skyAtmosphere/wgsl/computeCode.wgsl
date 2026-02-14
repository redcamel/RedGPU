let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneColor = textureLoad(sourceTexture, id, 0).rgb;

// 1. 역행렬을 이용한 월드 공간 시선 방향(viewDir) 재구성
let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
let clipPos = vec4<f32>(ndc, 0.0, 1.0); // 0.0 is near in WebGPU
var viewDirPos = systemUniforms.inverseProjectionCameraMatrix * clipPos;
viewDirPos /= viewDirPos.w;
let viewDir = normalize(viewDirPos.xyz - systemUniforms.camera.cameraPosition);

let sunDir = normalize(uniforms.sunDirection);
let camH = max(0.0001, uniforms.cameraHeight);
let r = uniforms.earthRadius;
let atmH = uniforms.atmosphereHeight;

// 2. 깊이 정보를 통한 거리 계산
let rawDepth = fetchDepth(id);
let viewZ = linearDepth(rawDepth);
let camForward = -normalize(systemUniforms.camera.cameraMatrix[2].xyz);
let cosThetaView = max(0.01, dot(viewDir, camForward));
let sceneDistKm = (viewZ / cosThetaView) / 1000.0;

// 3. 가상 행성 충돌 검사
let camPos = vec3<f32>(0.0, r + camH, 0.0);
let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);

// 최종 충돌 거리 결정
var hitDistKm = select(1e6, t_earth, t_earth > 0.0);
if (rawDepth < 1.0) { hitDistKm = min(hitDistKm, sceneDistKm); }

// 4. Sky-View 및 Aerial Perspective 샘플링
var atmosphereColor: vec3<f32>;
var atmosphereTransmittance: f32;

if (rawDepth >= 1.0 && t_earth <= 0.0) {
    // [하늘 영역]
    let skySample = get_sky_view_storage(skyViewTexture, viewDir, camH, r, atmH);
    atmosphereColor = skySample.rgb;
    atmosphereTransmittance = skySample.a;
} else {
    // [메시/지면 영역] 3D Aerial Perspective 적용
    let azimuth = atan2(viewDir.z, viewDir.x);
    let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
    let u = (azimuth / (2.0 * PI)) + 0.5;
    let v = (elevation / PI) + 0.5;
    let w = sqrt(clamp(hitDistKm / 100.0, 0.0, 1.0));
    
    let apSample = get_camera_volume_storage(cameraVolumeTexture, u, v, w);
    atmosphereColor = apSample.rgb;
    atmosphereTransmittance = apSample.a;
}

// 5. 지면 및 메시 합성
var finalHDR: vec3<f32>;
let haze_amount = mix(0.3, 0.1, smoothstep(-0.2, 0.5, sunDir.y));

if (rawDepth >= 1.0 && t_earth > 0.0) {
    // 가상 지면
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let gTrans = get_transmittance_storage(transmittanceTexture, 0.0, cos_sun, atmH);
    
    // 단순 알베도 (노이즈 제외하여 복잡성 감소, 필요시 추가)
    let albedo = uniforms.groundAlbedo / PI;
    let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
    finalHDR = (diffuse * atmosphereTransmittance) + (atmosphereColor * uniforms.sunIntensity);
} else if (rawDepth < 1.0) {
    // 메시 영역 (Aerial Perspective 적용)
    finalHDR = (sceneColor * atmosphereTransmittance) + (atmosphereColor * uniforms.sunIntensity);
} else {
    // 순수 하늘
    finalHDR = atmosphereColor * uniforms.sunIntensity;
    
    // 태양 디스크
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_rad = uniforms.sunSize * (PI / 180.0);
    let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
    let sun_trans = get_transmittance_storage(transmittanceTexture, camH, sunDir.y, atmH);
    finalHDR += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
}

// 공통 지평선 연무 (Haze)
let distFromHorizon = asin(clamp(viewDir.y, -1.0, 1.0)) - (asin(clamp(-sqrt(max(0.0, camH * (2.0 * r + camH))) / (r + camH), -1.0, 1.0)));
let horizon_haze_mask = exp(-abs(distFromHorizon) * (15.0 / (haze_amount + 0.01)));
let skySampleForHaze = get_sky_view_storage(skyViewTexture, viewDir, camH, r, atmH);
finalHDR += (skySampleForHaze.rgb * uniforms.sunIntensity) * uniforms.horizonHaze * horizon_haze_mask * 0.2;

textureStore(outputTexture, id, vec4<f32>(finalHDR * uniforms.exposure, 1.0));
