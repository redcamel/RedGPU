// [KO] UE5 표준 Multi-Scattering LUT 생성
#redgpu_include skyAtmosphere.skyAtmosphereFn
#redgpu_include math.INV_PI

@group(0) @binding(0) var multiScatLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatLUT);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let cosSunTheta = uv.x * 2.0 - 1.0;
    let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let bottomRadius = params.bottomRadius;
    let rayOrigin = vec3<f32>(0.0, viewHeight + bottomRadius, 0.0);
    let sunDir = vec3<f32>(sqrt(max(0.0, 1.0 - cosSunTheta * cosSunTheta)), cosSunTheta, 0.0);

    var lumTotal = vec3<f32>(0.0);
    var fmsTotal = vec3<f32>(0.0);

    for (var i = 0u; i < MULTI_SCAT_SAMPLES; i = i + 1u) {
        let step = f32(i) + 0.5;
        let theta = acos(clamp(1.0 - 2.0 * step / f32(MULTI_SCAT_SAMPLES), -1.0, 1.0));
        let phi = (sqrt(5.0) + 1.0) * PI * step;
        let rayDir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let tMax = getRaySphereIntersection(rayOrigin, rayDir, bottomRadius + params.atmosphereHeight);
        let intersect = getPlanetIntersection(rayOrigin, rayDir, bottomRadius);

        var L1 = vec3<f32>(0.0);
        var f1 = vec3<f32>(0.0);
        var TPath = vec3<f32>(1.0);

        if (params.bottomRadius > 0.0 && intersect.x > 0.0) {
            integrateMultiScatSegment(rayOrigin, rayDir, 0.0, intersect.x, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
            let hitP = rayOrigin + rayDir * intersect.x;
            let sunTGround = getPhysicalTransmittance(hitP, sunDir, bottomRadius, params.atmosphereHeight, params);
            L1 += TPath * sunTGround * max(0.0, dot(normalize(hitP), sunDir)) * params.groundAlbedo * INV_PI;
            f1 += TPath * params.groundAlbedo;
        } else {
            if (params.bottomRadius <= 0.0 && intersect.x > 0.0) {
                integrateMultiScatSegment(rayOrigin, rayDir, 0.0, intersect.x, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
                if (intersect.y > 0.0 && tMax > intersect.y) {
                    integrateMultiScatSegment(rayOrigin, rayDir, intersect.y, tMax, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
                }
            } else if (tMax > 0.0) {
                integrateMultiScatSegment(rayOrigin, rayDir, 0.0, tMax, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
            }
        }
        lumTotal += L1;
        fmsTotal += f1 / f32(MULTI_SCAT_SAMPLES);
    }

    let output = (lumTotal / f32(MULTI_SCAT_SAMPLES)) / (1.0 - min(fmsTotal, vec3<f32>(0.99)));
    textureStore(multiScatLUT, global_id.xy, vec4<f32>(output, 1.0));
}

fn integrateMultiScatSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, sunDir: vec3<f32>, L1: ptr<function, vec3<f32>>, f1: ptr<function, vec3<f32>>, TPath: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let bottomRadius = params.bottomRadius;
    let stepSize = (tMax - tMin) / f32(steps);

    let viewSunCos = dot(dir, sunDir);
    let phaseR = phaseRayleigh(viewSunCos);
    let phaseM = phaseMie(viewSunCos, params.mieAnisotropy);

    for (var j = 0u; j < steps; j = j + 1u) {
        let t = tMin + (f32(j) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pLen = length(p);
        let viewHeight = pLen - bottomRadius;
        
        let d = getAtmosphereDensities(viewHeight, params);
        let sunT = getPhysicalTransmittance(p, sunDir, bottomRadius, params.atmosphereHeight, params);
        let shadowMask = getPlanetShadowMask(p, sunDir, bottomRadius, params);

        let scatR = params.rayleighScattering * d.rhoR;
        let scatM = params.mieScattering * d.rhoM;
        
        let scatTotal = scatR + vec3<f32>(scatM);
        let stepScat = (scatR * phaseR + vec3<f32>(scatM * phaseM));

        let extTotal = scatR + vec3<f32>((params.mieScattering + params.mieAbsorption) * d.rhoM) + params.absorptionCoefficient * d.rhoO;

        *L1 += *TPath * sunT * stepScat * shadowMask * stepSize;
        *f1 += *TPath * scatTotal * stepSize;
        *TPath *= exp(-extTotal * stepSize);
    }
}
