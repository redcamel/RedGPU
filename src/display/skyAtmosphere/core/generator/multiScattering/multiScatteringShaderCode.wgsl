#redgpu_include skyAtmosphere.skyAtmosphereFn
#redgpu_include math.INV_PI

@group(0) @binding(0) var multiScatLUT: texture_storage_2d<rgba16float, write>;
@group(0) @binding(1) var transmittanceLUT: texture_2d<f32>;
@group(0) @binding(2) var skyAtmosphereSampler: sampler;
@group(0) @binding(3) var<uniform> params: SkyAtmosphere;

@compute @workgroup_size(8, 8)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let size = textureDimensions(multiScatLUT);
    if (global_id.x >= size.x || global_id.y >= size.y) { return; }

    let uv = (vec2<f32>(global_id.xy) + 0.5) / vec2<f32>(size);
    let cosSunTheta = uv.x * 2.0 - 1.0;
    let viewHeight = clamp((1.0 - uv.y) * params.atmosphereHeight, 0.0, params.atmosphereHeight);

    let groundRadius = params.groundRadius;
    let rayOrigin = vec3<f32>(0.0, viewHeight + groundRadius, 0.0);
    let sunDir = vec3<f32>(sqrt(max(0.0, 1.0 - cosSunTheta * cosSunTheta)), cosSunTheta, 0.0);

    var lumTotal = vec3<f32>(0.0);
    var fmsTotal = vec3<f32>(0.0);

    for (var i = 0u; i < MULTI_SCAT_SAMPLES; i = i + 1u) {
        let step = f32(i) + 0.5;
        let theta = acos(clamp(1.0 - 2.0 * step / f32(MULTI_SCAT_SAMPLES), -1.0, 1.0));
        let phi = (sqrt(5.0) + 1.0) * PI * step;
        let rayDir = vec3<f32>(sin(theta) * cos(phi), cos(theta), sin(theta) * sin(phi));

        let tMax = getRaySphereIntersection(rayOrigin, rayDir, groundRadius + params.atmosphereHeight);
        let tEarth = getRaySphereIntersection(rayOrigin, rayDir, groundRadius);

        var L1 = vec3<f32>(0.0);
        var f1 = vec3<f32>(0.0);
        var TPath = vec3<f32>(1.0);

        if (groundRadius > 0.0 && tEarth > 0.0) {
            integrateMultiScatSegment(rayOrigin, rayDir, 0.0, tEarth, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
            
            let hitP = rayOrigin + rayDir * tEarth;
            let up = normalize(hitP);
            let localCosSun = dot(up, sunDir);
            let sunT = getTransmittance(transmittanceLUT, skyAtmosphereSampler, 0.0, localCosSun, params.atmosphereHeight);
            
            L1 += TPath * sunT * max(0.0, localCosSun) * params.groundAlbedo * INV_PI;
            f1 += TPath * params.groundAlbedo;
        } else if (tMax > 0.0) {
            integrateMultiScatSegment(rayOrigin, rayDir, 0.0, tMax, MULTI_SCAT_STEPS, sunDir, &L1, &f1, &TPath);
        }

        lumTotal += L1;
        fmsTotal += f1 / f32(MULTI_SCAT_SAMPLES);
    }

    let output = (lumTotal / f32(MULTI_SCAT_SAMPLES)) / (1.0 - min(fmsTotal, vec3<f32>(0.999)));
    textureStore(multiScatLUT, global_id.xy, vec4<f32>(output, 1.0));
}

fn integrateMultiScatSegment(origin: vec3<f32>, dir: vec3<f32>, tMin: f32, tMax: f32, steps: u32, sunDir: vec3<f32>, L1: ptr<function, vec3<f32>>, f1: ptr<function, vec3<f32>>, TPath: ptr<function, vec3<f32>>) {
    if (tMax <= tMin) { return; }
    let groundRadius = params.groundRadius;
    let stepSize = (tMax - tMin) / f32(steps);

    let phaseIsotropic = 1.0 / (4.0 * PI);

    for (var j = 0u; j < steps; j = j + 1u) {
        let t = tMin + (f32(j) + 0.5) * stepSize;
        let p = origin + dir * t;
        let pLen = length(p);
        let h = pLen - groundRadius;
        
        let d = getAtmosphereDensities(h, params);
        
        let up = p / pLen;
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