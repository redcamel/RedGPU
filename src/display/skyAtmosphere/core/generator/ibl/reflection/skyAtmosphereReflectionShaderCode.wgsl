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
        
        if (sunShadow > 0.0) {
            let sunT = getTransmittance(transmittanceTexture, atmosphereSampler, 0.0, clamp(cosS, 0.0, 1.0), atmH);
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(clamp(cosS * 0.5 + 0.5, 0.0, 1.0), 1.0), 0.0).rgb;
            radiance = (sunT * max(0.0, cosS) + msEnergy * PI) * (params.groundAlbedo * INV_PI) * sunShadow;
        } else {
            let msEnergy = textureSampleLevel(multiScatTexture, atmosphereSampler, vec2<f32>(0.5, 1.0), 0.0).rgb;
            radiance = (msEnergy * PI) * (params.groundAlbedo * INV_PI);
        }
    } else {
        // 2. 하늘 광휘
        let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
        let skySample = textureSampleLevel(skyViewTexture, atmosphereSampler, skyUV, 0.0);
        radiance = skySample.rgb;

        // 3. Mie Glow (안정적인 모델)
        let viewSunCos = dot(viewDir, sunDir);
        let sunTransForGlow = getTransmittance(transmittanceTexture, atmosphereSampler, camH, sunDir.y, params.atmosphereHeight);
        let skyTrans = getTransmittance(transmittanceTexture, atmosphereSampler, camH, viewDir.y, atmH);

        let miePhaseStable = phaseMie(viewSunCos, 0.80); 
        let mieGlowStable = sunTransForGlow * (params.mieScattering / max(0.0001, params.mieExtinction)) 
                            * (miePhaseStable * params.mieGlow);
        radiance += mieGlowStable;

        // [KO] 4. 태양 본체 제거: PBR 직접광과의 중복 및 샘플링 노이즈 방지를 위해 본체는 그리지 않습니다.
        // [EN] 4. Remove Sun Disk: To prevent duplication with PBR direct light and sampling noise, the disk is not rendered.
        }

        textureStore(outputTexture, global_id.xy, global_id.z, vec4<f32>(radiance, 1.0));
        }
