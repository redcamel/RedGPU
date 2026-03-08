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
        var viewDir = normalize(dir);
        
        // [KO] Zenith/Nadir 부근에서의 수치적 안정성 확보 (atan2 NaN 방지)
        if (abs(viewDir.y) > 0.9999) {
            viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
        }

        let camPos = vec3<f32>(0.0, r + camH, 0.0);
        let tEarth = getRaySphereIntersection(camPos, viewDir, r);
        let isGround = params.useGround > 0.5 && tEarth > 0.0 && viewDir.y < -0.0001;

        var radiance = vec3<f32>(0.0);

        if (isGround) {
            // 1. 지면 반사광 (Unit scale)
            let hitP = camPos + viewDir * tEarth;
            let hitNormal = normalize(hitP);
            let cosS = dot(hitNormal, sunDir);
            let sunShadow = smoothstep(-0.01, 0.01, cosS);
            
            if (sunShadow > 0.0) {
                let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, clamp(cosS, 0.0, 1.0), atmH);
                let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
                // [KO] msEnergy * PI: 전역 환경광 조도(Irradiance) 반영
                // [EN] msEnergy * PI: Reflect global environment irradiance
                radiance = (sunT * max(0.0, cosS) + msEnergy * PI) * (params.groundAlbedo * INV_PI) * sunShadow;
            } else {
                // [KO] 그림자 영역에서도 Multi-Scattering에 의한 하늘 환경광은 존재함
                // [EN] Even in shadow areas, sky environment light due to Multi-Scattering exists
                let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(0.5, 1.0), 0.0).rgb; // [KO] 평균 조도 근사 [EN] Average irradiance approximation
                radiance = (msEnergy * PI) * (params.groundAlbedo * INV_PI);
            }
        } else {
            // 2. 하늘 광휘 (Unit scale)
            let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
            let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
            radiance = skySample.rgb;

            // 3. Mie Glow (Unit scale)
            let viewSunCos = clamp(dot(viewDir, sunDir), -1.0, 1.0);
            let sunTransForGlow = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, params.atmosphereHeight);
            
            // [KO] 시선 투과율(skyTrans)을 Zenith 안정화를 위해 별도 정의 (Mie Glow 식에서는 제거하여 고정 원 제거)
            let skyTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);

            let miePhaseStable = phaseMie(viewSunCos, 0.80); 
            let mieGlowStable = sunTransForGlow * (params.mieScattering / max(0.0001, params.mieExtinction)) 
                                * (miePhaseStable * params.mieGlow);
            radiance += mieGlowStable;

            // 4. 태양 본체 (Unit scale)
            let sunRad = params.sunSize * DEG_TO_RAD;
            let cosSunRad = cos(sunRad);
            // [KO] 태양 경계 안티앨리어싱: 실제 크기를 유지하며 미세하게만 부드럽게 처리 (0.001)
            // [EN] Sun edge anti-aliasing: Maintain actual size and slightly soften (0.001)
            let sunMask = smoothstep(cosSunRad - 0.001, cosSunRad, viewSunCos);
            if (sunMask > 0.0) {
                let normalizedDist = saturate((1.0 - viewSunCos) / max(0.00001, 1.0 - cosSunRad));
                let limbDarkening = pow(max(0.00001, 1.0 - normalizedDist), params.sunLimbDarkening);
                // [KO] 태양 본체 계산에는 시선 방향의 투과율(skyTrans) 사용
                radiance += sunMask * limbDarkening * skyTrans * (params.solarIntensityMult * 0.1);
            }
        }
        
        totalRadiance += radiance;
    }

    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(totalRadiance * 0.25, 1.0));
}
