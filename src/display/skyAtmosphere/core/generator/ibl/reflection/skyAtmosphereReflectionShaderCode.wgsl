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

    if (isGround) {
        // 1. 지면 반사광
        let hitP = camPos + viewDir * tEarth;
        let hitNormal = normalize(hitP);
        let cosS = dot(hitNormal, sunDir);
        let sunShadow = smoothstep(-0.01, 0.01, cosS);
        
        var groundRadiance = vec3<f32>(0.0);

        if (sunShadow > 0.0) {
            let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, clamp(cosS, 0.0, 1.0), atmH);
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
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
        let inScattering = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0).rgb;

        radiance = groundRadiance * viewTransmittance + inScattering;

    } else {
        // 2. 하늘 광휘 (Unit scale)
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        radiance = skySample.rgb;

        // 3. Mie Glow (Unit scale)
        // [KO] 공용 함수 getMieGlowAmountUnit을 사용하여 물리적 일치성 및 Soft-Knee 클램핑 확보
        // [EN] Use the common function getMieGlowAmountUnit to ensure physical consistency and soft-knee clamping
        let viewSunCos = clamp(dot(viewDir, sunDir), -1.0, 1.0);
        
        // [KO] 하늘 방향 투과율 참조 (Glow 감쇄용)
        let transToEdge = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
        let mieGlowStable = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToEdge, 0.80);
        radiance += mieGlowStable;

        // [KO] 4. 태양 본체(Sun Disk) 복구: Specular IBL 반사맵에서는 눈부신 태양광(Sun Glint)이 필수적임
        let sunAngularRadius = 0.00465; // 약 0.26도 (태양의 시반경)
        let sunSolidAngle = PI * sunAngularRadius * sunAngularRadius;
        if (acos(viewSunCos) < sunAngularRadius) {
            let sunLuminance = vec3<f32>(1.0); // 태양의 고유 에너지
            let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewSunCos, atmH);
            radiance += sunLuminance * sunT * 1000.0; // 분석적 밝기 부스팅 (IBL 캡처용)
        }
    }

    // [KO] 결과 저장: Unit scale 데이터로 저장 (Intensity는 머티리얼 샘플링 시 적용)
    // [EN] Store results: Store as unit scale data (Intensity is applied during material sampling)
    textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
}
