let id = global_id.xy;
let size = textureDimensions(outputTexture);
if (id.x >= size.x || id.y >= size.y) { return; }

let uv = (vec2<f32>(id) + 0.5) / vec2<f32>(size);
let sceneSample = textureLoad(sourceTexture, id, 0);
var sceneColor = sceneSample.rgb;
let sceneAlpha = sceneSample.a;

// 1. ?œì„  ë°©í–¥(viewDir) ?¬êµ¬??(?ˆì •??ê°•í™”)
// [KO] ?¬ì˜ ?‰ë ¬ ?±ë¶„??ì§ì ‘ ?¬ìš©?˜ì—¬ ?”ë©´ ê²½ê³„?ì„œ??ì§€ê¸€ê±°ë¦¼??ë°©ì??©ë‹ˆ??
// [EN] Use projection matrix components directly to prevent shimmering at screen edges.
let invP = systemUniforms.projection.inverseProjectionMatrix;
let viewSpaceDir = vec3<f32>(
    (uv.x * 2.0 - 1.0) * invP[0][0],
    ((1.0 - uv.y) * 2.0 - 1.0) * invP[1][1],
    -1.0
);

let worldRotation = mat3x3<f32>(
    systemUniforms.camera.inverseViewMatrix[0].xyz,
    systemUniforms.camera.inverseViewMatrix[1].xyz,
    systemUniforms.camera.inverseViewMatrix[2].xyz
);
// [KO] ?•ê·œ?”ëŠ” ëª¨ë“  ë³€?˜ì´ ?ë‚œ ????ë²ˆë§Œ ?˜í–‰?˜ì—¬ ?˜ì¹˜???ˆì •?±ì„ ?’ì…?ˆë‹¤.
// [EN] Normalize once after all transforms to improve numerical stability.
let viewDir = normalize(worldRotation * viewSpaceDir);

let sunDir = normalize(uniforms.sunDirection);
let camH = max(0.0001, uniforms.cameraHeight);
let r = uniforms.earthRadius;
let atmH = uniforms.atmosphereHeight;

// 3. ê³µì¤‘ ?¬ì‹œ(Aerial Perspective) ?ìš©
let rawDepth = fetchDepth(id);
let depthKm = getLinearizeDepth(
    rawDepth, 
    systemUniforms.camera.nearClipping, 
    systemUniforms.camera.farClipping
) / 1000.0;

let max_ap_dist = 100.0; 
let ap_dist = clamp(depthKm, 0.0, max_ap_dist);

// 3D LUT UVW ê³„ì‚° (CameraVolumeGenerator??ë§¤í•‘ê³??¼ì¹˜)
let azimuth = atan2(viewDir.z, viewDir.x);
let elevation = asin(clamp(viewDir.y, -1.0, 1.0));

// [KO] ap_u(Azimuth)??repeat ?˜í”Œ?¬ë? ?¬ìš©?˜ì—¬ 360??ê²½ê³„?ì„œ ë¶€?œëŸ½ê²??´ì–´ì§€?„ë¡ ?©ë‹ˆ??
// [EN] ap_u (Azimuth) uses a repeat sampler to smoothly wrap around the 360-degree boundary.
let ap_u = (azimuth / PI2) + 0.5;
let ap_v = clamp((elevation * INV_PI) + 0.5, 0.001, 0.999);
let ap_w = clamp(sqrt(ap_dist / max_ap_dist), 0.0, 0.999);
let ap_sample = textureSampleLevel(cameraVolumeTexture, atmosphereSampler, vec3<f32>(ap_u, ap_v, ap_w), 0.0);

// ë¶ˆíˆ¬ëª?ê°ì²´(depth < 0.999999)???€ê¸??¨ê³¼ ?ìš©
if (rawDepth < 0.999999) {
    sceneColor = (sceneColor * ap_sample.a) + (ap_sample.rgb * uniforms.sunIntensity);
}

// 3. ?€ê¸?ë°°ê²½ ?°ì‚° (?˜ëŠ˜ ?ì—­)
var atmosphereBackground: vec3<f32>;
let camPos = vec3<f32>(0.0, r + camH, 0.0);
let t_earth = get_ray_sphere_intersection(camPos, viewDir, r);

if (t_earth > 0.0) {
    // ê°€??ì§€ë©??ì—­
    let hitPos = camPos + viewDir * t_earth;
    let up = normalize(hitPos);
    let cos_sun = dot(up, sunDir);
    let gTrans = get_transmittance(transmittanceTexture, atmosphereSampler, 0.0, cos_sun, atmH);
    let albedo = uniforms.groundAlbedo * INV_PI;
    let diffuse = albedo * gTrans * max(0.0, cos_sun) * uniforms.sunIntensity;
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
    atmosphereBackground = (diffuse * skySample.a) + (skySample.rgb * uniforms.sunIntensity);
} else {
    // ?œìˆ˜ ?˜ëŠ˜ ?ì—­
    let skyUV = get_sky_view_uv(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
    atmosphereBackground = skySample.rgb * uniforms.sunIntensity;
    
    // ?œì–‘ ?”ìŠ¤???©ì„±
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_rad = uniforms.sunSize * DEG_TO_RAD;
    let sun_mask = smoothstep(cos(sun_rad) - 0.001, cos(sun_rad), view_sun_cos);
    let sun_trans = get_transmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);
    atmosphereBackground += sun_mask * sun_trans * (uniforms.sunIntensity * 100.0);
}

// [KO] ì§€?‰ì„  ?°ë¬´(Haze)??Sky-View LUT?€ Aerial Perspective LUT???´ë? ë¬¼ë¦¬?ìœ¼ë¡??µí•©?˜ì–´ ?ˆìŠµ?ˆë‹¤.
// [EN] Horizon Haze is already physically integrated into Sky-View and Aerial Perspective LUTs.

// 4. ìµœì¢… ?©ì„± ë°??¨ì¼ ?¸ì¶œ ?ìš©
// [KO] sceneAlphaê°€ 1.0??ë¶ˆíˆ¬ëª??ì—­?€ atmosphereBackgroundê°€ ?ì´ì§€ ?ŠìŠµ?ˆë‹¤.
// [EN] Opaque areas (sceneAlpha = 1.0) do not mix with atmosphereBackground.
let finalColor = mix(atmosphereBackground, sceneColor, sceneAlpha);
textureStore(outputTexture, id, vec4<f32>(finalColor * uniforms.exposure, 1.0));

