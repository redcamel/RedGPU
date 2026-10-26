#redgpu_include skyAtmosphere.skyAtmosphereFn

@group(0) @binding(0) var multiScatLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(2) var skyAtmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

const GOLDEN_SPHERE_STEP: f32 = 10.16640738463052;
const INV_MULTI_SCAT_SAMPLES: f32 = 1.0 / 128.0;

// [KO] 워크그룹 내 128개 구면 방향 샘플의 산란 휘도(s_lum)와 다중 산란 전달 계수(s_f1)를 집계하는 공유 메모리입니다.
// [EN] Workgroup shared memory aggregating scattered luminance (s_lum) and transfer factors (s_f1) across 128 spherical samples.
var<workgroup> s_lum : array<vec3<f32>, 128>;
var<workgroup> s_f1  : array<vec3<f32>, 128>;

/**
 * [KO] 구면 피보나치 샘플링과 병렬 트리 리덕션을 통해 등방성 다중 산란(Multi-Scattering) 2D LUT를 계산합니다.
 * [EN] Computes the isotropic Multi-Scattering 2D LUT using spherical Fibonacci sampling and parallel tree reduction.
 */
@compute @workgroup_size(128, 1, 1)
fn main(
    @builtin(workgroup_id) wg_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>
) {
    let texelCoord = wg_id.xy;
    let size = textureDimensions(multiScatLUT);
    if (texelCoord.x >= size.x || texelCoord.y >= size.y) { return; }

    let sampleIdx = local_id.x;

    let uv = (vec2<f32>(texelCoord) + 0.5) / vec2<f32>(size);
    let cosSunTheta = uv.x * 2.0 - 1.0;
    let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let groundRadius = params.groundRadius;
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    let sunDir = vec3<f32>(sqrt(max(0.0, 1.0 - cosSunTheta * cosSunTheta)), cosSunTheta, 0.0);

    // [KO] 1. 스레드별 구면 방향 샘플 생성 및 광선 적분 수행
    // [EN] 1. Generate per-thread spherical direction sample and perform ray integration
    let step = f32(sampleIdx) + 0.5;
    let cosTheta = clamp(1.0 - 2.0 * step * INV_MULTI_SCAT_SAMPLES, -1.0, 1.0);
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
    let phi = GOLDEN_SPHERE_STEP * step;
    let cosPhi = cos(phi);
    let sinPhi = sin(phi);
    let rayDir = vec3<f32>(sinTheta * cosPhi, cosTheta, sinTheta * sinPhi);

    let tEarth = getRaySphereIntersection(rayOrigin, rayDir, groundRadius);

    var L1 = vec3<f32>(0.0);
    var f1 = vec3<f32>(0.0);
    var TPath = vec3<f32>(1.0);

    if (groundRadius > 0.0 && tEarth > 0.0) {
        integrateMultiScatSegment(rayOrigin, rayDir, 0.0, tEarth, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);

        let hitP = rayOrigin + rayDir * tEarth;
        let dotHitP = dot(hitP, hitP);
        let up = hitP * inverseSqrt(dotHitP);
        let localCosSun = dot(up, sunDir);
        let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, localCosSun, params.atmosphereHeight);

        L1 += TPath * sunT * max(0.0, localCosSun) * params.groundAlbedo * INV_PI;
        f1 += TPath * params.groundAlbedo;
    } else {
        let tMax = getRaySphereIntersection(rayOrigin, rayDir, groundRadius + params.atmosphereHeight);
        if (tMax > 0.0) {
            integrateMultiScatSegment(rayOrigin, rayDir, 0.0, tMax, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
        }
    }

    // [KO] 2. 워크그룹 공유 메모리에 스레드별 적분 결과 기록
    // [EN] 2. Store per-thread integration results into workgroup shared memory
    s_lum[sampleIdx] = L1;
    s_f1[sampleIdx]  = f1;

    workgroupBarrier();

    // [KO] 3. 공유 메모리 병렬 리덕션으로 128개 샘플 합산
    // [EN] 3. Sum all 128 samples via parallel reduction in shared memory
    for (var stride = 64u; stride > 0u; stride = stride >> 1u) {
        if (sampleIdx < stride) {
            s_lum[sampleIdx] += s_lum[sampleIdx + stride];
            s_f1[sampleIdx]  += s_f1[sampleIdx + stride];
        }
        workgroupBarrier();
    }

    // [KO] 4. 무한 등비급수 근사를 통해 고차 다중 산란 에너지를 산출하고 LUT에 저장
    // [EN] 4. Compute higher-order multi-scattering energy via geometric series approximation and store to LUT
    if (sampleIdx == 0u) {
        let lumTotal = s_lum[0];
        let fmsTotal = s_f1[0] * INV_MULTI_SCAT_SAMPLES;
        let output = (lumTotal * INV_MULTI_SCAT_SAMPLES) / (1.0 - min(fmsTotal, vec3<f32>(0.999)));
        textureStore(multiScatLUT, texelCoord, vec4<f32>(output, 1.0));
    }
}

/**
 * [KO] 단일 구면 방향 광선에 대해 1차 등방성 산란 휘도(L1)와 산란 전달 계수(f1)를 적분합니다.
 * [EN] Integrates first-order isotropic scattered luminance (L1) and scattering transfer factor (f1) along a single spherical ray.
 */
fn integrateMultiScatSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, sunDir: vec3<f32>, L1: ptr<function, vec3<f32>>, f1: ptr<function, vec3<f32>>, TPath: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let groundRadius = params.groundRadius;
    let stepSize = (tMax - tMin) / f32(steps);

    let phaseIsotropic = 0.25 * INV_PI;
    let mieExt = params.mieScattering + params.mieAbsorption;

    for (var j = 0u; j < steps; j = j + 1u) {
        let t = tMin + (f32(j) + 0.5) * stepSize;
        let p = origin + dir * t;
        let dotP = dot(p, p);
        let invPLen = inverseSqrt(dotP);
        let pLen = dotP * invPLen;
        let h = max(0.0, pLen - groundRadius);
        
        let d = getAtmosphereDensities(h, params);

        let scatR = params.rayleighScattering * d.rhoR;
        let scatM = params.mieScattering * d.rhoM;
        let scatStep = (*TPath) * (scatR + scatM) * stepSize;
        let ext = scatR + mieExt * d.rhoM + params.absorptionCoefficient * d.rhoO;

        if (getPlanetShadowMask(p, sunDir, groundRadius) > 0.0) {
            let localCosSun = dot(p * invPLen, sunDir);
            let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, h, localCosSun, params.atmosphereHeight);
            *L1 += scatStep * sunT * phaseIsotropic;
        }
        
        *f1 += scatStep;
        
        *TPath *= exp(-ext * stepSize);
    }
}
