#redgpu_include systemStruct.SkyAtmosphere
#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var multiScatTexture: texture_2d<f32>;
@group(0) @binding(1) var atmosphereSampler: sampler;
@group(0) @binding(2) var outTexture: texture_storage_2d_array<rgba16float, write>;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;
@group(0) @binding(4) var transmittanceTexture: texture_2d<f32>;
@group(0) @binding(5) var skyViewTexture: texture_2d<f32>;

#redgpu_include math.PI
#redgpu_include math.PI2
#redgpu_include math.INV_PI
#redgpu_include math.tnb.getTBN
#redgpu_include color.getLuminance

// [KO] 대기 휘도 계산 함수 (Reflection Generator의 로직과 동일)
// [EN] Atmosphere radiance calculation function (Same logic as Reflection Generator)
fn getAtmosphereRadiance(viewDir: vec3<f32>) -> vec3<f32> {
    let r = params.bottomRadius;
    let camH = params.cameraHeight;
    let atmH = params.atmosphereHeight;
    let sunDir = normalize(params.sunDirection);

    // [KO] IBL용 태양 성분 감쇄 계수 (안정성 확보를 위해 직접광보다 낮게 설정)
    // [EN] Sun component damping factor for IBL (set lower than direct light for stability)
    const IBL_SUN_DAMP: f32 = 0.5;

    // [KO] 태양의 카메라 도달 투과율을 미리 계산 (가시성 제어용)
    let sunTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, atmH);

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
        let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToEdge, 0.80) * IBL_SUN_DAMP;

        radiance = groundRadiance * viewTransmittance + inScattering + mieGlowAmount;

    } else {
        // 2. 하늘 광휘 (Unit scale)
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        radiance = skySample.rgb;

        // 3. Mie Glow (Unit scale, 감쇄 적용)
        let transToViewEdge = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);
        let mieGlowStable = getMieGlowAmountUnit(viewSunCos, camH, params, transmittanceTexture, atmosphereSampler, transToViewEdge, 0.80) * IBL_SUN_DAMP;
        radiance += mieGlowStable;

        // [KO] 4. 태양 본체(Sun Disk) 복구 (감쇄 적용)
        radiance += getSunDiskRadianceIBL(viewSunCos, params.sunLimbDarkening, sunTrans) * IBL_SUN_DAMP;
    }

    // [KO] IBL 샘플링 안정성을 위해 임계값 대폭 하향 (100.0 -> 50.0)
    let finalLuma = getLuminance(radiance);
    let finalThreshold = 50.0; 
    if (finalLuma > finalThreshold) {
        let softLuma = finalThreshold + (finalLuma - finalThreshold) / (1.0 + (finalLuma - finalThreshold) / finalThreshold);
        radiance = radiance * (softLuma / finalLuma);
    }
    return radiance;
}

fn radicalInverse_VdC(bits_in: u32) -> f32 {
    var bits = bits_in;
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return f32(bits) * 2.3283064365386963e-10;
}

fn hammersley(i: u32, n: u32) -> vec2<f32> {
    return vec2<f32>(f32(i) / f32(n), radicalInverse_VdC(i));
}

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size_u = textureDimensions(outTexture).xy;
    let size = vec2<f32>(size_u);
    
    if (global_id.x >= size_u.x || global_id.y >= size_u.y || global_id.z >= 6u) {
        return;
    }

    let face = global_id.z;
    let uv = (vec2<f32>(global_id.xy) + 0.5) / size;
    
    // [KO] WebGPU 표준 큐브맵 좌표계에 따른 방향 계산 (Normal)
    // [EN] Calculate direction (Normal) according to WebGPU standard cubemap coordinate system
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
    let normal = normalize(dir);

    let up = select(vec3<f32>(0.0, 1.0, 0.0), vec3<f32>(1.0, 0.0, 0.0), abs(normal.y) > 0.999);
    let tbn = getTBN(normal, up);

    var irradiance = vec3<f32>(0.0);
    var totalWeight = 0.0;
    let totalSamples = 1024u;

    for (var i = 0u; i < totalSamples; i = i + 1u) {
        let xi = hammersley(i, totalSamples);

        let phi = PI2 * xi.x;
        let cosTheta = sqrt(1.0 - xi.y);
        let sinTheta = sqrt(xi.y);

        let sampleVec = vec3<f32>(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);
        let worldSample = normalize(tbn * sampleVec);

        // [KO] 텍스처 샘플링 대신 대기 휘도를 직접 계산 (완벽한 독립화)
        // [EN] Directly calculate atmosphere radiance instead of texture sampling (complete independence)
        irradiance += getAtmosphereRadiance(worldSample);
        totalWeight += 1.0;
    }

    // [KO] 적분 결과 (Unit scale)
    irradiance = irradiance / totalWeight;

    textureStore(outTexture, global_id.xy, face, vec4<f32>(irradiance, 1.0));
}
