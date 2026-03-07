@group(0) @binding(0) var outputTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(1) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(2) var atmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.DEG_TO_RAD
#redgpu_include math.INV_PI

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outputTexture).xy;
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) { return; }

    let size = vec2<f32>(size_u);
    let face = global_id.z;
    
    let r = params.earthRadius;
    let camH = params.cameraHeight;
    let atmH = params.atmosphereHeight;
    let sunDir = normalize(params.sunDirection);

    var totalRadiance = vec3<f32>(0.0);
    
    // [KO] 2x2 슈퍼샘플링으로 안정적인 태양 및 지평선 렌더링
    let offsets = array<vec2<f32>, 4>(
        vec2<f32>(-0.25, -0.25), vec2<f32>(0.25, -0.25),
        vec2<f32>(-0.25, 0.25), vec2<f32>(0.25, 0.25)
    );

    for (var i = 0u; i < 4u; i = i + 1u) {
        let uv = (vec2<f32>(global_id.xy) + 0.5 + offsets[i]) / size;
        
        let tex = uv * 2.0 - 1.0;
        var dir: vec3<f32>;
        switch (face) {
            case 0u: { dir = vec3<f32>(1.0, -tex.y, -tex.x); } // +X
            case 1u: { dir = vec3<f32>(-1.0, -tex.y, tex.x); } // -X
            case 2u: { dir = vec3<f32>(tex.x, 1.0, tex.y); }  // +Y
            case 3u: { dir = vec3<f32>(tex.x, -1.0, -tex.y); } // -Y
            case 4u: { dir = vec3<f32>(tex.x, -tex.y, 1.0); }  // +Z
            case 5u: { dir = vec3<f32>(-tex.x, -tex.y, -1.0); } // -Z
            default: { dir = vec3<f32>(0.0); }
        }
        let viewDir = normalize(dir);

        // 1. Sky-View LUT 샘플링 (Absolute scale)
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        var radiance = skySample.rgb * params.sunIntensity;

        // [KO] 하이브리드 Mie Glow (IBL 최적화)
        // [KO] 큐브맵의 낮은 해상도(256)를 고려하여 비등방성 g를 0.85로 대폭 낮춰 파이어플라이 현상을 방지합니다.
        // [EN] Hybrid Mie Glow (IBL optimized)
        // [EN] Lower g to 0.85 to prevent fireflies on low-res cubemaps.
        let viewSunCos = clamp(dot(viewDir, sunDir), -1.0, 1.0);
        let skyTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
        let sunTransForGlow = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, params.atmosphereHeight);
        
        let miePhaseStable = phaseMie(viewSunCos, 0.85); 
        let mieGlowStable = (params.sunIntensity * params.skyViewScatMult) * sunTransForGlow * (params.mieScattering / max(0.0001, params.mieExtinction)) 
                            * (miePhaseStable * params.mieGlow) * (1.0 - skyTrans);
        radiance += mieGlowStable;

        // 2. 지면 반사 보정
        if (params.useGround > 0.5 && viewDir.y < -0.001) {
            let tEarth = getRaySphereIntersection(vec3<f32>(0.0, r + camH, 0.0), viewDir, r);
            if (tEarth > 0.0) {
                let hitP = vec3<f32>(0.0, r + camH, 0.0) + viewDir * tEarth;
                let hitNormal = normalize(hitP);
                let cosS = dot(hitNormal, sunDir);
                let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosS, atmH);
                let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(cosS * 0.5 + 0.5, 1.0), 0.0).rgb;
                radiance = (sunT * max(0.0, cosS) + msEnergy * PI + params.groundAmbient) * (params.groundAlbedo * INV_PI) * params.sunIntensity;
            }
        }

        // 3. 태양 본체
        let sunRad = params.sunSize * DEG_TO_RAD;
        let cosSunRad = cos(sunRad);
        // [KO] 해상도 한계 극복을 위한 부드러운 태양 경계 처리 (0.004 범위)
        let sunMask = smoothstep(cosSunRad - 0.004, cosSunRad, viewSunCos);
        if (sunMask > 0.0) {
            let normalizedDist = saturate((1.0 - viewSunCos) / max(0.00001, 1.0 - cosSunRad));
            let limbDarkening = pow(max(0.00001, 1.0 - normalizedDist), params.sunLimbDarkening);
            let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
            radiance += sunMask * limbDarkening * sunTrans * (params.sunIntensity * params.solarIntensityMult);
        }
        
        totalRadiance += radiance;
    }

    // [KO] IBL 소스용 최종 클램핑 (수치적 안정성 확보)
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(min(totalRadiance * 0.25, vec3<f32>(20000.0)), 1.0));
}
