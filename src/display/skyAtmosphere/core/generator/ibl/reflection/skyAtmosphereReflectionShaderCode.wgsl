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
    let camH = params.cameraHeight;
    let atmH = params.atmosphereHeight;
    let sunDir = normalize(params.sunDirection);

    // [KO] 태양의 카메라 도달 투과율을 미리 계산 (가시성 제어용)
    // [EN] Pre-calculate sun transmittance reaching camera (for visibility control)
    let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);

    // [KO] 단일 샘플링 방향 계산 (Roughly draw approach)
    // [EN] Single sampling direction calculation (Roughly draw approach)
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
    
    // [KO] Zenith/Nadir 부근에서의 수치적 안정성 확보
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
            // [KO] 지면 반사광 합성 (단위 휘도)
            groundRadiance = (sunT * max(0.0, cosS) + msEnergy * PI) * (params.groundAlbedo * INV_PI) * sunShadow;
        } else {
            // [KO] 그림자 영역에서도 태양 고도(cosS)를 반영한 동적 환경광 샘플링 적용
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
            groundRadiance = (msEnergy * PI) * (params.groundAlbedo * INV_PI);
        }

        // [KO] 대기 원근감(Aerial Perspective) 계산
        // [KO] 지면에서 반사된 빛은 투과율(Transmittance)만큼 감쇠되고, 그 사이에 하늘색(In-Scattering)이 더해져야 합니다.
        let viewZenithCosAngle = dot(hitNormal, -viewDir);
        let viewTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewZenithCosAngle, atmH);
        
        // 지평선에 가까울수록 시야의 하늘 산란(SkyView) 에너지를 샘플링하여 더해줌
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        let inScattering = skySample.rgb;

        // [KO] 지면 위로 번지는 Mie Glow 추가 (배경 렌더링과 일치)
        let transToEdge = vec3<f32>(skySample.a);
        let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToEdge, 0.80);

        radiance = groundRadiance * viewTransmittance + inScattering + mieGlowAmount;

    } else {
        // 2. 하늘 광휘 (Unit scale)
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        radiance = skySample.rgb;

        // 3. Mie Glow (Unit scale)
        // [KO] 하늘 방향 투과율 참조 (Glow 감쇄용)
        let transToViewEdge = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
        let mieGlowStable = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToViewEdge, 0.80);
        radiance += mieGlowStable;

        // [KO] 4. 태양 본체(Sun Disk) 복구
        // [KO] sunTrans를 사용하여 지평선 아래 태양 빛 누출 방지
        radiance += getSunDiskRadianceIBL(viewSunCos, params.sunLimbDarkening, sunTrans);
    }

    // [KO] 점 아티팩트(Fireflies) 방지를 위한 최종 안전 클램핑
    // [EN] Final safe clamping to prevent dot artifacts (Fireflies)
    let finalLuma = dot(radiance, vec3<f32>(0.299, 0.587, 0.114));
    let finalThreshold = 100.0; // IBL 샘플링 안정성을 위해 임계값 대폭 하향 (1000.0 -> 100.0)
    if (finalLuma > finalThreshold) {
        let softLuma = finalThreshold + (finalLuma - finalThreshold) / (1.0 + (finalLuma - finalThreshold) / finalThreshold);
        radiance = radiance * (softLuma / finalLuma);
    }

    // [KO] 결과 저장: Unit scale 데이터로 저장 (Intensity는 머티리얼 샘플링 시 적용)
    // [EN] Store results: Store as unit scale data (Intensity is applied during material sampling)
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
