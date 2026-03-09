#redgpu_include math.PI
#redgpu_include math.DEG_TO_RAD
#redgpu_include SYSTEM_UNIFORM;
#redgpu_include skyAtmosphere.skyAtmosphereFn;

struct VertexOutput {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec4<f32>,
};

struct FragmentOutput {
    @location(0) color : vec4<f32>,
    @location(1) normal : vec4<f32>,
    @location(2) motionVector : vec4<f32>,
};

@group(2) @binding(0) var bg_atmosphereTransmittanceTexture : texture_2d<f32>;
@group(2) @binding(1) var bg_atmosphereSkyViewTexture : texture_2d<f32>;
@group(2) @binding(2) var bg_atmosphereSampler : sampler;

@fragment
fn main(input : VertexOutput) -> FragmentOutput {
    let uniforms = systemUniforms.skyAtmosphere;
    let camH = uniforms.cameraHeight;
    let r = uniforms.earthRadius;
    let atmH = uniforms.atmosphereHeight;
    let viewDir = normalize(input.vertexPosition.xyz);
    let sunDir = normalize(uniforms.sunDirection);

    // [KO] 매핑 안정화를 위한 클램핑 고도 (Sea Level Offset 반영된 camH 기준)
    let mappingH = max(0.0, camH);
    let skyUV = getSkyViewUV(viewDir, camH, r, atmH);
    let skySample = textureSampleLevel(bg_atmosphereSkyViewTexture, bg_atmosphereSampler, skyUV, 0.0);
    var atmosphereBackground = skySample.rgb * uniforms.sunIntensity;

    let camPos = vec3<f32>(0.0, r + camH, 0.0);
    let tEarth = getRaySphereIntersection(camPos, viewDir, r);

    // [KO] 수평선 압축(Horizon Squashing) 보정: 고도가 낮을 때 태양이 수직으로 납작해지는 효과
    // [KO] 천장(Zenith) 부근에서 불필요한 보정이 적용되지 않도록 saturate(sunDir.y) 대신 구체적인 높이 기반 감쇄 적용
    let sunElevationParam = saturate(sunDir.y); 
    let squashFactor = mix(0.85, 1.0, sunElevationParam);
    
    let verticalDist = viewDir.y - sunDir.y;
    // [KO] 천장(Zenith) 부근에서 보정치가 커져서 발생하는 아티팩트 방지를 위해 태양 근처(dot > 0.0) 및 지평선 근처에서만 적용
    // [EN] Apply only near the sun (dot > 0.0) and near the horizon to prevent artifacts near the Zenith
    let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist) 
                           * saturate(dot(viewDir, sunDir) * 10.0) * (1.0 - sunElevationParam * sunElevationParam);
    let viewSunCos = dot(viewDir, sunDir) - squashCorrection;

    // [KO] 지면 차폐 여부 및 투과율 결정
    // [EN] Determine ground occlusion and transmittance
    let isGroundHit = uniforms.useGround > 0.5 && tEarth > 0.0;
    let transToEdge = select(getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, viewDir.y, uniforms.atmosphereHeight), vec3<f32>(skySample.a), isGroundHit);

    // [KO] 하이브리드 Mie Glow: 압축 보정된 방향을 사용하여 태양과 일치시킴
    // [EN] Hybrid Mie Glow: Use corrected direction to match sun
    let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, transToEdge, 0.0) * uniforms.sunIntensity;
    atmosphereBackground += mieGlowAmount;

    if (uniforms.useGround < 0.5 || tEarth <= 0.0 || uniforms.showGround < 0.5) {
        // [KO] 태양 원반(Sun Disk) 물리적 휘도 적용
        // [KO] 지면에 가려지지 않은 경우에만 태양 본체를 렌더링 (tEarth <= 0.0)
        // [EN] Apply physical radiance of sun disk
        // [EN] Render sun only when not obscured by ground (tEarth <= 0.0)
        if (tEarth <= 0.0 || uniforms.useGround < 0.5) {
            // [KO] 태양 원반은 관찰 방향 대기 투과율(transToEdge)에 의해 감쇄됨
            // [EN] Sun disk is attenuated by transmittance in view direction (transToEdge)
            let sunRadiance = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, transToEdge, 0.01);
            atmosphereBackground += sunRadiance * (uniforms.sunIntensity * uniforms.solarIntensityMult);
        }
    }
    
    var output : FragmentOutput;
    output.color = vec4<f32>(atmosphereBackground, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
