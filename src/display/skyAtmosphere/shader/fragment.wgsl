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

    // 1. Sky-View LUT 샘플링
    let azimuth = atan2(viewDir.z, viewDir.x);
    let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
    
    var skyV: f32;
    if (elevation >= 0.0) {
        skyV = 0.5 * (1.0 - sqrt(elevation / (PI * 0.5)));
    } else {
        skyV = 0.5 * (1.0 + sqrt(-elevation / (PI * 0.5)));
    }
    let skyU = azimuth / (2.0 * PI) + 0.5;
    let skyLuminance = textureSample(skyViewTexture, tSampler, vec2<f32>(skyU, skyV)).rgb;

    // 2. 태양 디스크 직접광
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let cosSunRadius = cos(sun_angular_radius);
    let sunUV = get_transmittance_uv(camH, sunDir.y, atmH);
    let sunTransmittance = textureSample(transmittanceTexture, tSampler, sunUV).rgb;
    let sunRadiance = sunIntensity / max(1e-7, 2.0 * PI * (1.0 - cosSunRadius));
    let sunDiskMask = smoothstep(cosSunRadius - 0.0001, cosSunRadius + 0.0001, view_sun_cos);
    let sunDiskLuminance = sunRadiance * sunTransmittance * sunDiskMask * smoothstep(-0.01, 0.01, viewDir.y);

    // 3. 물리적 지표면 렌더링
    var groundColor = vec3<f32>(0.0);
    if (viewDir.y < 0.0) {
        let albedo = vec3<f32>(0.12); 
        let camPos = vec3<f32>(0.0, earthR + camH, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - earthR * earthR;
        let delta = b * b - c;
        
        if (delta >= 0.0) {
            let t = -b - sqrt(delta);
            let hitPos = camPos + viewDir * t;
            let groundNormal = normalize(hitPos);

            let NdotL = max(0.0, dot(groundNormal, sunDir));
            let gTransUV = get_transmittance_uv(0.0, sunDir.y, atmH); 
            let gTrans = textureSampleLevel(transmittanceTexture, tSampler, gTransUV, 0.0).rgb;
            
            let ambUV = vec2<f32>(clamp(sunDir.y * 0.5 + 0.5, 0.0, 1.0), 0.0);
            let ambLight = textureSampleLevel(multiScatteringTexture, tSampler, ambUV, 0.0).rgb;
            
            groundColor = albedo * (sunIntensity * gTrans * NdotL + ambLight * sunIntensity * 0.1);
        }
    }

    // 4. 최종 합성
    // 지평선 아래는 skyLuminance(대기 산란광)를 groundColor(지면 색상)로 완전히 대체
    var finalHDR: vec3<f32>;
    if (viewDir.y >= 0.0) {
        finalHDR = (skyLuminance * sunIntensity) + sunDiskLuminance;
    } else {
        // 지평선 아래에서 대기 산란광은 지면 앞에 아주 살짝만 묻어나도록 처리 (보통 제거)
        finalHDR = groundColor; 
    }
    
    output.color = vec4<f32>(finalHDR * exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
