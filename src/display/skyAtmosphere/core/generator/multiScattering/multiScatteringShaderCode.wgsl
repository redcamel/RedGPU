#redgpu_include skyAtmosphere.skyAtmosphereFn
#redgpu_include math.INV_PI

@group(0) @binding(0) var multiScatLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(2) var skyAtmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

const GOLDEN_SPHERE_STEP: f32 = 10.16640738463052; // (sqrt(5.0) + 1.0) * PI
const INV_MULTI_SCAT_SAMPLES: f32 = 1.0 / 128.0;

// [LDS] 온칩 고속 공유 메모리 (128개 스레드 복사휘도 및 감쇠계수 캐싱)
var<workgroup> s_lum : array<vec3<f32>, 128>;
var<workgroup> s_f1  : array<vec3<f32>, 128>;

@compute @workgroup_size(128, 1, 1)
fn main(
    @builtin(workgroup_id) wg_id: vec3<u32>,
    @builtin(local_invocation_id) local_id: vec3<u32>
) {
    let texelCoord = wg_id.xy;
    let size = textureDimensions(multiScatLUT);
    if (texelCoord.x >= size.x || texelCoord.y >= size.y) { return; }

    let sampleIdx = local_id.x; // 0u ~ 127u

    let uv = (vec2<f32>(texelCoord) + 0.5) / vec2<f32>(size);
    let cosSunTheta = uv.x * 2.0 - 1.0;
    let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let groundRadius = params.groundRadius;
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    let sunDir = vec3<f32>(sqrt(max(0.0, 1.0 - cosSunTheta * cosSunTheta)), cosSunTheta, 0.0);

    // [1단계: 128개 스레드가 각각 자기 담당 샘플 1개만 40스텝 레이마칭 (100% 병렬화)]
    let step = f32(sampleIdx) + 0.5;
    let cosTheta = clamp(1.0 - 2.0 * step * INV_MULTI_SCAT_SAMPLES, -1.0, 1.0);
    let sinTheta = sqrt(max(0.0, 1.0 - cosTheta * cosTheta));
    let phi = GOLDEN_SPHERE_STEP * step;
    let cosPhi = cos(phi);
    let sinPhi = sin(phi);
    let rayDir = vec3<f32>(sinTheta * cosPhi, cosTheta, sinTheta * sinPhi);

    let tMax = getRaySphereIntersection(rayOrigin, rayDir, groundRadius + params.atmosphereHeight);
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
    } else if (tMax > 0.0) {
        integrateMultiScatSegment(rayOrigin, rayDir, 0.0, tMax, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
    }

    // [2단계: 온칩 LDS에 결과 캐싱 및 워크그룹 동기화]
    s_lum[sampleIdx] = L1;
    s_f1[sampleIdx]  = f1;

    workgroupBarrier();

    // [3단계: 온칩 LDS 병렬 트리 축소 (Parallel Reduction - 7사이클 완료)]
    for (var stride = 64u; stride > 0u; stride = stride >> 1u) {
        if (sampleIdx < stride) {
            s_lum[sampleIdx] += s_lum[sampleIdx + stride];
            s_f1[sampleIdx]  += s_f1[sampleIdx + stride];
        }
        workgroupBarrier();
    }

    // [4단계: 0번 스레드가 무한 등비급수 산출 후 텍스처에 단 1회 기록]
    if (sampleIdx == 0u) {
        let lumTotal = s_lum[0];
        let fmsTotal = s_f1[0] * INV_MULTI_SCAT_SAMPLES;
        let output = (lumTotal * INV_MULTI_SCAT_SAMPLES) / (1.0 - min(fmsTotal, vec3<f32>(0.999)));
        textureStore(multiScatLUT, texelCoord, vec4<f32>(output, 1.0));
    }
}

fn integrateMultiScatSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, sunDir: vec3<f32>, L1: ptr<function, vec3<f32>>, f1: ptr<function, vec3<f32>>, TPath: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let groundRadius = params.groundRadius;
    let stepSize = (tMax - tMin) / f32(steps);

    let phaseIsotropic = 0.25 * INV_PI;

    for (var j = 0u; j < steps; j = j + 1u) {
        let t = tMin + (f32(j) + 0.5) * stepSize;
        let p = origin + dir * t;
        let dotP = dot(p, p);
        let invPLen = inverseSqrt(dotP);
        let pLen = dotP * invPLen;
        let h = pLen - groundRadius;
        
        let d = getAtmosphereDensities(h, params);
        
        let up = p * invPLen;
        let localCosSun = dot(up, sunDir);
        let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, h, localCosSun, params.atmosphereHeight);
        let shadowMask = getPlanetShadowMask(p, sunDir, groundRadius, params);

        let scatR = params.rayleighScattering * d.rhoR;
        let scatM = params.mieScattering * d.rhoM;
        let ext = scatR + scatM + params.mieAbsorption * d.rhoM + params.absorptionCoefficient * d.rhoO;

        *L1 += *TPath * sunT * (scatR + scatM) * phaseIsotropic * shadowMask * stepSize;
        
        *f1 += *TPath * (scatR + scatM) * stepSize;
        
        *TPath *= exp(-ext * stepSize);
    }
}