let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneColor = textureLoad(sourceTexture, id, 0).rgb;

// 1. 시선 방향(viewDir) 재구성 (회전만 적용하여 왜곡 및 흔들림 방지)
let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
let clipPos = vec4<f32>(ndc, 1.0, 1.0); 

// 카메라 공간의 방향 계산
var viewSpacePos = systemUniforms.inverseProjectionMatrix * clipPos;
let viewSpaceDir = normalize(viewSpacePos.xyz / viewSpacePos.w);

// 월드 공간으로 변환 (카메라의 회전만 적용)
// cameraMatrix의 상위 3x3 행렬을 사용하여 위치(Translation) 영향을 제거
let worldDir = mat3x3<f32>(
    systemUniforms.camera.cameraMatrix[0].xyz,
    systemUniforms.camera.cameraMatrix[1].xyz,
    systemUniforms.camera.cameraMatrix[2].xyz
) * viewSpaceDir;

let viewDir = normalize(worldDir);

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

// 최종 충돌 거리 결정 (메시 영역 보호 포함)
if (rawDepth < 1.0) {
    textureStore(outputTexture, id, vec4<f32>(sceneColor, 1.0));
    return;
}

// 4. 합성 로직
var finalHDR: vec3<f32>;
let haze_amount = mix(0.3, 0.1, smoothstep(-0.2, 0.5, sunDir.y));

if (t_earth > 0.0) {
    // 가상 지면 렌더링
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, cos_sun, atmH);
    
    let albedo = uniforms.groundAlbedo / PI;
    let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
    
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    finalHDR = (diffuse * skySample.a) + (skySample.rgb * uniforms.sunIntensity);
} else {
    // 순수 하늘
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    let atmosphereColor = skySample.rgb;
    
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
let skyUVForHaze = get_sky_view_uv(viewDir, camH, r, atmH);
let skySampleForHaze = textureSampleLevel(skyViewTexture, tSampler, skyUVForHaze, 0.0);
finalHDR += (skySampleForHaze.rgb * uniforms.sunIntensity) * uniforms.horizonHaze * horizon_haze_mask * 0.2;

textureStore(outputTexture, id, vec4<f32>(finalHDR * uniforms.exposure, 1.0));
