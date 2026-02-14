let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneColor = textureLoad(sourceTexture, id, 0).rgb;

// 1. 역행렬을 이용한 월드 공간 시선 방향(viewDir) 재구성
let ndc = vec2<f32>(uv.x * 2.0 - 1.0, (1.0 - uv.y) * 2.0 - 1.0);
let clipPos = vec4<f32>(ndc, 0.0, 1.0); 
var viewDirPos = systemUniforms.inverseProjectionCameraMatrix * clipPos;
viewDirPos /= viewDirPos.w;
let viewDir = normalize(viewDirPos.xyz - systemUniforms.camera.cameraPosition);

let sunDir = normalize(uniforms.sunDirection);
let camH = max(0.0001, uniforms.cameraHeight);
let r = uniforms.earthRadius;
let atmH = uniforms.atmosphereHeight;

// 2. 깊이 정보를 통한 거리 계산
let rawDepth = fetchDepth(id);

// [중요] 메시 영역이면 원본 fragment.wgsl의 discard와 동일하게 처리 (합성 생략)
if (rawDepth < 1.0) {
    textureStore(outputTexture, id, vec4<f32>(sceneColor, 1.0));
    return;
}

// 3. 가상 행성 충돌 검사
let camPos = vec3<f32>(0.0, r + camH, 0.0);
let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);

// 4. 합성 로직 (원본 fragment.wgsl 1:1 이식)
var finalHDR: vec3<f32>;
let haze_amount = mix(0.3, 0.1, smoothstep(-0.2, 0.5, sunDir.y));

if (t_earth > 0.0) {
    // 가상 지면 렌더링 (원본과 동일한 노이즈 및 라이팅 연산)
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let gTrans = get_transmittance(transmittanceTexture, tSampler, 0.0, cos_sun, atmH);
    
    let noiseVal = get_ground_noise_pe(hitPos * 0.1) * 0.5 + get_ground_noise_pe(hitPos * 2.0) * 0.25;
    let albedo = mix(uniforms.groundAlbedo * 0.7, uniforms.groundAlbedo * 1.3, noiseVal) / PI;
    
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, tSampler, skyUV, 0.0);
    let atmosphereColor = skySample.rgb;
    let atmosphereTransmittance = skySample.a;
    
    let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
    finalHDR = (diffuse * atmosphereTransmittance) + (atmosphereColor * uniforms.sunIntensity);
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
