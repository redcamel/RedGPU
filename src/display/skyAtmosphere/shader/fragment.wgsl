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

    // 1. Sky-View LUT 샘플링 (모든 픽셀에 대해 수행)
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

    // 2. 태양 디스크 직접광 (지평선 위일 때만)
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let cosSunRadius = cos(sun_angular_radius);
    let sunUV = get_transmittance_uv(camH, sunDir.y, atmH);
    let sunTransmittance = textureSample(transmittanceTexture, tSampler, sunUV).rgb;
    let sunRadiance = sunIntensity / max(1e-7, 2.0 * PI * (1.0 - cosSunRadius));
    let sunDiskMask = smoothstep(cosSunRadius - 0.0001, cosSunRadius + 0.0001, view_sun_cos);
    let sun_above_horizon = smoothstep(horizon_elevation - 0.01, horizon_elevation + 0.01, elevation);
    let sunDiskLuminance = sunRadiance * sunTransmittance * sunDiskMask * sun_above_horizon;

    // 3. 최종 합성 (Aerial Perspective 반영)
    var finalHDR: vec3<f32>;
    
    if (elevation >= horizon_elevation) {
        // [하늘 영역] 산란광 + 태양
        finalHDR = (skyLuminance * sunIntensity) + sunDiskLuminance;
    } else {
        // [지표면 영역] 지면색 + 공중 원근법(Fog 효과)
        let albedo = vec3<f32>(0.15); 
        let camPos = vec3<f32>(0.0, r + h_c, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - r * r;
        let delta = b * b - c;
        
        // 지면색 기본 계산
        var groundRawColor = vec3<f32>(0.0);
        var aerialTransmittance = vec3<f32>(1.0);
        
        if (delta >= 0.0) {
            let t = -b - sqrt(delta);
            let hitPos = camPos + viewDir * t;
            let groundNormal = normalize(hitPos);

            // 지면 직사광/간접광 계산
            let NdotL = max(0.0, dot(groundNormal, sunDir));
            let gTransUV = get_transmittance_uv(0.0, sunDir.y, atmH); 
            let gTrans = textureSampleLevel(transmittanceTexture, tSampler, gTransUV, 0.0).rgb;
            let ambUV = vec2<f32>(clamp(sunDir.y * 0.5 + 0.5, 0.0, 1.0), 0.0);
            let ambLight = textureSampleLevel(multiScatteringTexture, tSampler, ambUV, 0.0).rgb;
            
            groundRawColor = albedo * (sunIntensity * gTrans * NdotL + ambLight * sunIntensity * 0.1);
            
            // 공중 원근법을 위한 투과율 계산 (Cam -> Ground)
            // T(Cam->Space) / T(Ground->Space) 로 근사
            let T_cam = textureSampleLevel(transmittanceTexture, tSampler, get_transmittance_uv(h_c, viewDir.y, atmH), 0.0).rgb;
            let T_ground = textureSampleLevel(transmittanceTexture, tSampler, get_transmittance_uv(0.0, viewDir.y, atmH), 0.0).rgb;
            aerialTransmittance = clamp(T_cam / max(vec3<f32>(1e-4), T_ground), vec3<f32>(0.0), vec3<f32>(1.0));
        }
        
        // 지면색에 투과율 적용 후, 해당 경로 사이의 대기 산란광(skyLuminance)을 더함
        finalHDR = (groundRawColor * aerialTransmittance) + (skyLuminance * sunIntensity);
    }
    
    output.color = vec4<f32>(finalHDR * exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
