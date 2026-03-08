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

    if (uniforms.useGround < 0.5 || tEarth <= 0.0 || uniforms.showGround < 0.5) {
        // [KO] 수평선 압축(Horizon Squashing) 보정: 고도가 낮을 때 태양이 수직으로 납작해지는 효과
        let sunElevationParam = saturate(sunDir.y * 10.0); 
        let squashFactor = mix(0.85, 1.0, sunElevationParam); 
        
        let verticalDist = viewDir.y - sunDir.y;
        let squashCorrection = (1.0 / (squashFactor * squashFactor) - 1.0) * (verticalDist * verticalDist);
        let viewSunCos = dot(viewDir, sunDir) - squashCorrection;

        // [KO] 하이브리드 Mie Glow: 압축 보정된 방향을 사용하여 태양과 일치시킴
        let skyTrans = getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, viewDir.y, uniforms.atmosphereHeight);
        let mieGlowAmount = getMieGlowAmountUnit(viewSunCos, mappingH, uniforms, bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, skyTrans, 0.0) * uniforms.sunIntensity;
        atmosphereBackground += mieGlowAmount;

        // [KO] 투과율 및 물리적 휘도 적용 (Unit Scale * sunIntensity * solarIntensityMult)
        let sunRadiance = getSunDiskRadianceUnit(viewSunCos, uniforms.sunSize, uniforms.sunLimbDarkening, skyTrans, 0.01);
        atmosphereBackground += sunRadiance * (uniforms.sunIntensity * uniforms.solarIntensityMult);
    } else {
         // [KO] 지면에 가려진 경우에도 일반적인 산란광과 Glow는 존재할 수 있음 (수평선 근처)
         let skyTrans = getTransmittance(bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, mappingH, viewDir.y, uniforms.atmosphereHeight);
         let mieGlowAmount = getMieGlowAmountUnit(dot(viewDir, sunDir), mappingH, uniforms, bg_atmosphereTransmittanceTexture, bg_atmosphereSampler, skyTrans, 0.0) * uniforms.sunIntensity;
         atmosphereBackground += mieGlowAmount;
    }
    
    var output : FragmentOutput;
    output.color = vec4<f32>(atmosphereBackground, 1.0);
    output.normal = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    output.motionVector = vec4<f32>(0.0, 0.0, 0.0, 0.0);
    return output;
}
