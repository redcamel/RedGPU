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

// [표준] 16바이트 정렬을 준수하는 유니폼 구조체
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

// [표준] UE4/UE5 Transmittance LUT 역함수 매핑
fn get_transmittance_uv(h: f32, cos_theta: f32, atm_h: f32) -> vec2<f32> {
    let v = sqrt(clamp(h / atm_h, 0.0, 1.0));
    let u = clamp(cos_theta * 0.5 + 0.5, 0.0, 1.0);
    return vec2<f32>(u, v);
}

@fragment
fn main(outData: OutData) -> FragmentOutput {
    var output: FragmentOutput;

    // 1. 데이터 언패킹
    let sunDir = normalize(uniforms.sunData.xyz);
    let sunSize = uniforms.sunData.w;
    let atmH = uniforms.atmosphereParams.x;
    let exposure = uniforms.atmosphereParams.y;
    let sunIntensity = uniforms.atmosphereParams.z;
    let camH = uniforms.atmosphereParams.w;
    let earthR = uniforms.earthParams.x;

    let viewDir = normalize(outData.vertexPosition.xyz);

    // 2. Sky-View LUT 샘플링 (UE 표준 비선형 Elevation 매핑)
    let azimuth = atan2(viewDir.z, viewDir.x);
    let elevation = asin(clamp(viewDir.y, -1.0, 1.0));
    
    var skyV: f32;
    if (elevation >= 0.0) {
        // [표준] Up -> v=0
        skyV = 0.5 * (1.0 - sqrt(elevation / (PI * 0.5)));
    } else {
        // [표준] Down -> v=1
        skyV = 0.5 * (1.0 + sqrt(-elevation / (PI * 0.5)));
    }
    let skyU = azimuth / (2.0 * PI) + 0.5;
    
    let skyLuminance = textureSample(skyViewTexture, tSampler, vec2<f32>(skyU, skyV)).rgb;

    // 3. 태양 디스크 직접광 (Sun Disk)
    let view_sun_cos = dot(viewDir, sunDir);
    let sun_angular_radius = sunSize * (PI / 180.0);
    let sun_cos_radius = cos(sun_angular_radius);
    
    // 지상에서 태양까지의 투과율 (UE 표준 매핑 사용)
    let sunUV = get_transmittance_uv(camH, sunDir.y, atmH);
    let sunTransmittance = textureSample(transmittanceTexture, tSampler, sunUV).rgb;
    
    // [수정] 태양 Radiance (물리적 강도 분산) - 수치 안정성 확보
    let sunSolidAngle = 2.0 * PI * (1.0 - sun_cos_radius);
    let sunRadiance = sunIntensity / max(1e-7, sunSolidAngle);
    
    // [수정] 태양 가장자리 부드럽게 (안티앨리어싱)
    let sunDiskMask = smoothstep(sun_cos_radius - 0.0001, sun_cos_radius + 0.0001, view_sun_cos);
    
    // 지평선 및 행성 그림자 감쇠
    let sunVisibility = smoothstep(-0.02, 0.02, sunDir.y);
    let viewAboveHorizon = smoothstep(-0.01, 0.01, viewDir.y);
    let sunDiskLuminance = sunRadiance * sunTransmittance * sunDiskMask * viewAboveHorizon * sunVisibility;

    // 4. 물리적 지표면 렌더링 (Spherical Ground)
    var groundColor = vec3<f32>(0.0);
    if (viewDir.y < -0.01) {
        let albedo = vec3<f32>(0.15); // 지구 평균 알베도 근사
        
        // 카메라 위치 (0, R+h, 0)에서 구형 지표면 교차점 찾기
        let camPos = vec3<f32>(0.0, earthR + camH, 0.0);
        let b = dot(camPos, viewDir);
        let c = dot(camPos, camPos) - earthR * earthR;
        let delta = b * b - c;
        
        if (delta >= 0.0) {
            let t = -b - sqrt(delta);
            let hitPos = camPos + viewDir * t;
            let groundNormal = normalize(hitPos); // 구 중심(0,0,0) 기준 법선

            // 직사광 (Lambertian)
            let NdotL = max(0.0, dot(groundNormal, sunDir));
            let gTransUV = get_transmittance_uv(0.0, sunDir.y, atmH); // 지표면(h=0) 투과율
            let gTrans = textureSampleLevel(transmittanceTexture, tSampler, gTransUV, 0.0).rgb;
            let directLight = sunIntensity * gTrans * NdotL;

            // 간접광 (Ambient from Multi-Scattering LUT)
            // h=0에서의 다중 산란 에너지를 환경광으로 사용
            let ambUV = vec2<f32>(clamp(sunDir.y * 0.5 + 0.5, 0.0, 1.0), 0.0);
            let ambLight = textureSampleLevel(multiScatteringTexture, tSampler, ambUV, 0.0).rgb * sunIntensity * 0.5;
            
            groundColor = albedo * (directLight + ambLight);
        }
    }

    // 5. 최종 합성 및 노출 적용
    let finalHDR = (skyLuminance * sunIntensity) + sunDiskLuminance + groundColor;
    
    output.color = vec4<f32>(finalHDR * exposure, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    return output;
}
