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
    
    let r = params.bottomRadius;
    let camH = 0.0; // [KO] IBL은 지표면 기준(0.0)으로 고정하여 카메라 이동에 독립적으로 설정 [EN] Fix IBL to ground level (0.0) to make it independent of camera movement
    let atmH = params.atmosphereHeight;
    let sunDir = normalize(params.sunDirection);

    // [KO] IBL용 태양 성분 감쇄 계수 (안정성 확보를 위해 직접광보다 낮게 설정)
    // [EN] Physical IBL: no extra damping for sun/glow terms.
    // [KO] 태양의 카메라 도달 투과율을 미리 계산 (가시성 제어용)
    let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);

    // [KO] 단일 샘플링 방향 계산 (Roughly draw approach)
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
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
    
    if (abs(viewDir.y) > 0.9999) {
        viewDir = vec3<f32>(0.0, sign(viewDir.y), 0.0);
    }

    let camPos = vec3<f32>(0.0, r + camH, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, r);
    let isGround = params.useGround > 0.5 && tEarth > 0.0 && viewDir.y < -0.0001;

    var radiance = vec3<f32>(0.0);
    let viewSunCos = getSquashedViewSunCos(viewDir, sunDir);

    if (isGround) {
        // 1. 지면 반사광
        let hitP = camPos + viewDir * tEarth;
        let hitNormal = normalize(hitP);
        let cosS = dot(hitNormal, sunDir);
        let sunShadow = smoothstep(-0.01, 0.01, cosS);
        
        var groundRadiance = vec3<f32>(0.0);

        if (sunShadow > 0.0) {
            let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, cosS, atmH);
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
            groundRadiance = (sunT * max(0.0, cosS) + msEnergy * PI) * (params.groundAlbedo * INV_PI) * sunShadow;
        } else {
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
            groundRadiance = (msEnergy * PI) * (params.groundAlbedo * INV_PI);
        }

        let viewZenithCosAngle = dot(hitNormal, -viewDir);
        let viewTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewZenithCosAngle, atmH);
        
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        let inScattering = skySample.rgb;

        // [KO] 지면 위로 번지는 Mie Glow 추가 (감쇄 적용)
        let transToEdge = vec3<f32>(skySample.a);
        let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToEdge, 0.65);

        radiance = groundRadiance * viewTransmittance + inScattering + mieGlowAmount;

    } else {
        // 2. 하늘 광휘 (Unit scale)
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        radiance = skySample.rgb;

        // 3. Mie Glow (Unit scale, 감쇄 적용)
        let transToViewEdge = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
        let mieGlowStable = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToViewEdge, 0.65);
        radiance += mieGlowStable;

        // [KO] 4. 태양 본체(Sun Disk) 복구 (감쇄 적용)
//        let sunRad = params.sunSize * DEG_TO_RAD;
        let sunRad = 0.25 * DEG_TO_RAD;
        let lobeHalfAngle = clamp(sunRad , 0.002, 0.09);
        let cosHalf = cos(lobeHalfAngle);
        let sunLobePower = clamp(log(0.5) / log(max(1e-4, cosHalf)), 2.0, 128.0);
        let sunLobeNorm: f32 = (sunLobePower + 1.0) * (0.5 * INV_PI);
        let viewSun = max(0.0, dot(viewDir, sunDir));
        let sunLobe = sunLobeNorm * pow(viewSun, sunLobePower);
        radiance += sunTrans * sunLobe;

        // Soft-cut: outside the highlight, blend back to sky to hide ring artifacts.
        let cosCore = cos(lobeHalfAngle * 0.9);
        let cosEdge = cos(lobeHalfAngle * 1.2);
        let lobeMask = smoothstep(cosEdge, cosCore, viewSun);
        radiance = mix(skySample.rgb, radiance, lobeMask);
    }

    // [KO] IBL 샘플링 안정성을 위해 임계값 대폭 하향 (100.0 -> 50.0)
    // [EN] Physical IBL: keep radiance unclamped.
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
