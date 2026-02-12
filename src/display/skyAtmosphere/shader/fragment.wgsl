#redgpu_include SYSTEM_UNIFORM;

struct OutData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec4<f32>,
};

struct FragmentOutput {
    @location(0) color: vec4<f32>,
    @location(1) normal: vec4<f32>,
    @location(2) motionVector: vec4<f32>,
};

struct Uniforms {
    sunData: vec4<f32>,          // xyz: sunDirection, w: sunSize
    atmosphereParams: vec4<f32>, // x: atmHeight, y: exposure, z: sunIntensity, w: cameraHeight
    earthParams: vec4<f32>,      // x: earthRadius, yzw: padding
};

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var transmittanceTexture: texture_2d<f32>;
@group(2) @binding(2) var multiScatteringTexture: texture_2d<f32>;
@group(2) @binding(3) var skyViewTexture: texture_2d<f32>;
@group(2) @binding(4) var tSampler: sampler;

const PI: f32 = 3.14159265359;

fn get_transmittance_uv(h: f32, cos_theta: f32, atm_h: f32) -> vec2<f32> {
    let v = sqrt(clamp(h / atm_h, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return vec2<f32>(u, v);
}

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;

    let sunDir = normalize(uniforms.sunData.xyz);
    let sunSize = uniforms.sunData.w;
    let atmH = uniforms.atmosphereParams.x;
    let exposure = uniforms.atmosphereParams.y;
    let sunIntensity = uniforms.atmosphereParams.z;
    let camH = uniforms.atmosphereParams.w;
    let earthR = uniforms.earthParams.x;

        let viewDir = normalize(outData.vertexPosition.xyz);
    
        // [곡률 반영] 카메라 높이에 따른 기하학적 지평선 각도 계산
        let r = earthR;
        let h_c = max(0.0001, camH);
        let horizon_sin = -sqrt(max(0.0, h_c * (2.0 * r + h_c))) / (r + h_c);
        let horizon_elevation = asin(clamp(horizon_sin, -1.0, 1.0));
    
        // 1. Sky-View LUT 샘플링
        let azimuth = atan2(viewDir.z, viewDir.x);
        let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
        
        var skyV: f32;
        if (elevation >= horizon_elevation) {
            let v_range = (PI * 0.5) - horizon_elevation;
            skyV = 0.5 * (1.0 - sqrt(max(0.0, (elevation - horizon_elevation) / v_range)));
        } else {
            let v_range = horizon_elevation + (PI * 0.5);
            skyV = 0.5 * (1.0 + sqrt(max(0.0, (horizon_elevation - elevation) / v_range)));
        }
        let skyU = azimuth / (2.0 * PI) + 0.5;
        let skyLuminance = textureSample(skyViewTexture, tSampler, vec2<f32>(skyU, skyV)).rgb;
    
        // 2. 태양 디스크 직접광 (개선: viewDir의 투과율 사용)
        let view_sun_cos = dot(viewDir, sunDir);
        let sun_angular_radius = sunSize * (PI / 180.0);
        let cosSunRadius = cos(sun_angular_radius);
        
        // 태양 위치가 아닌 현재 시선 방향의 투과율을 사용 (지평선에 걸칠 때 자연스러운 감쇄)
        let viewTransUV = get_transmittance_uv(camH, viewDir.y, atmH);
        let sunTransmittance = textureSampleLevel(transmittanceTexture, tSampler, viewTransUV, 0.0).rgb;
        
        let sunRadiance = sunIntensity / max(1e-7, 2.0 * PI * (1.0 - cosSunRadius));
        let sunDiskMask = smoothstep(cosSunRadius - 0.001, cosSunRadius + 0.001, view_sun_cos);
        let sunDiskLuminance = sunRadiance * sunTransmittance * sunDiskMask;
    
        // 3. 지표면 및 하늘 합성
        var finalHDR: vec3<f32>;
        let skyPart = (skyLuminance * sunIntensity) + sunDiskLuminance;
        
        // 지표면 계산
        let albedo = vec3<f32>(0.15); 
        let camPos = vec3<f32>(0.0, r + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - r * r;
        let delta = b * b - c;
        
        var groundRawColor = vec3<f32>(0.0);
        var aerialTransmittance = vec3<f32>(1.0);
        
        if (delta >= 0.0) {
            let t = -b - sqrt(delta);
            let hitPos = camPos + viewDir * t;
            let groundNormal = normalize(hitPos);
            let localCosSun = dot(groundNormal, sunDir);
            let NdotL = max(0.0, localCosSun);
            
            let gTransUV = get_transmittance_uv(0.0, localCosSun, atmH); 
            let gTrans = textureSampleLevel(transmittanceTexture, tSampler, gTransUV, 0.0).rgb;
            let gLightFade = smoothstep(-0.02, 0.02, localCosSun);
            
            let ambUV = vec2<f32>(clamp(localCosSun * 0.5 + 0.5, 0.0, 1.0), 0.0);
            let ambLight = textureSampleLevel(multiScatteringTexture, tSampler, ambUV, 0.0).rgb;
            
            // 지면 반사광 강화
            let V = -viewDir;
            let L = sunDir;
            let H = normalize(V + L);
            let NdotH = max(0.0, dot(groundNormal, H));
            let specular = pow(NdotH, 512.0) * 4.0; 
            
            groundRawColor = albedo * (sunIntensity * gTrans * NdotL * gLightFade + ambLight * sunIntensity * 0.1) 
                           + (sunIntensity * gTrans * specular * gLightFade);
            
            let T_cam = textureSampleLevel(transmittanceTexture, tSampler, get_transmittance_uv(h_c, viewDir.y, atmH), 0.0).rgb;
            let T_ground = textureSampleLevel(transmittanceTexture, tSampler, get_transmittance_uv(0.0, viewDir.y, atmH), 0.0).rgb;
            aerialTransmittance = clamp(T_cam / max(vec3<f32>(1e-4), T_ground), vec3<f32>(0.0), vec3<f32>(1.0));
        }
        
            let groundPart = (groundRawColor * aerialTransmittance) + (skyLuminance * sunIntensity);
        
        
        
            // [핵심] 지평선 부근 부드러운 블렌딩
        
            let horizon_fade = smoothstep(horizon_elevation - 0.002, horizon_elevation + 0.002, elevation);
        
            finalHDR = mix(groundPart, skyPart, horizon_fade);
        
        
        
            // [추가] 절차적 미 산란 후광 (Procedural Mie Halo)
        
            // LUT의 해상도 한계를 넘어 지면 위로 붉은 빛이 번지게 함
        
            let g = 0.985; // 태양 주변에 아주 날카롭게 맺히는 미 산란 계수
        
            let g2 = g * g;
        
            let miePhase = (1.0 - g2) / (4.0 * PI * pow(max(0.01, 1.0 + g2 - 2.0 * g * view_sun_cos), 1.5));
        
            
        
            // 현재 시선 방향의 투과율을 적용하여 노을 시 붉은 색상 유도
        
            let haloColor = sunIntensity * sunTransmittance * miePhase * 0.05;
        
            
        
            // 지평선 아래로 갈수록 아주 약간만 감쇄시켜 지면 위로 빛이 번지게 처리
        
            let halo_ground_fade = smoothstep(horizon_elevation - 0.15, horizon_elevation + 0.05, elevation);
        
            finalHDR += haloColor * max(0.2, halo_ground_fade);
        
            
        
            output.color = vec4<f32>(finalHDR * exposure, 1.0);    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
