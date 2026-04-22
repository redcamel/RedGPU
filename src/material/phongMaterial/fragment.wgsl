#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include math.tnb.getTBNFromVertexTangent
#redgpu_include math.tnb.getNormalFromNormalMap
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include lighting.getLightDistanceAttenuation;
#redgpu_include lighting.getLightAngleAttenuation;


#redgpu_include skyAtmosphere.skyAtmosphereFn

struct Uniforms {
    color: vec3<f32>,
    //
    emissiveColor: vec3<f32>,
    emissiveStrength:f32,
    //
    specularColor:vec3<f32>,
    specularStrength:f32,
    shininess: f32,
    //
    aoStrength:f32,
    //
    normalScale:f32,
    //
    opacity: f32,
    useTint:u32,
    tint:vec4<f32>,
    tintBlendMode:u32,
    //
    useSSR:u32,
    metallic:f32,
    roughness:f32,
    //
};

struct InputData {
    // Built-in attributes
    @builtin(position) position : vec4<f32>,

    // Vertex attributes
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,

    @location(3) vertexTangent: vec4<f32>,

    @location(7) currentClipPos: vec4<f32>,
    @location(8) prevClipPos: vec4<f32>,

    @location(11) combinedOpacity: f32,
    //
    @location(12) motionVector: vec3<f32>,
    @location(13) shadowCoord: vec3<f32>,
    @location(14) @interpolate(flat) receiveShadow: f32,
    @location(15) @interpolate(flat) pickingId: vec4<f32>,
}

@group(2) @binding(0) var<uniform> uniforms: Uniforms;
@group(2) @binding(1) var diffuseTextureSampler: sampler;
@group(2) @binding(2) var diffuseTexture: texture_2d<f32>;
@group(2) @binding(3) var alphaTextureSampler: sampler;
@group(2) @binding(4) var alphaTexture: texture_2d<f32>;
@group(2) @binding(5) var specularTextureSampler: sampler;
@group(2) @binding(6) var specularTexture: texture_2d<f32>;
@group(2) @binding(7) var emissiveTextureSampler: sampler;
@group(2) @binding(8) var emissiveTexture: texture_2d<f32>;
@group(2) @binding(9) var aoTextureSampler: sampler;
@group(2) @binding(10) var aoTexture: texture_2d<f32>;
@group(2) @binding(11) var normalTextureSampler: sampler;
@group(2) @binding(12) var normalTexture: texture_2d<f32>;


#redgpu_include math.PI
#redgpu_include math.INV_PI
#redgpu_include math.EPSILON
#redgpu_include math.direction.getViewDirection

fn getDiffuseBRDFDisney(NdotL: f32, NdotV: f32, LdotH: f32, roughness: f32, albedo: vec3<f32>) -> vec3<f32> {
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }

    // Disney diffuse term
    let energyBias = mix(0.0, 0.5, roughness);
    let energyFactor = mix(1.0, 1.0 / 1.51, roughness);
    let fd90 = energyBias + 2.0 * LdotH * LdotH * roughness;
    let f0 = 1.0;
    let lightScatter = f0 + (fd90 - f0) * pow(1.0 - NdotL, 5.0);
    let viewScatter = f0 + (fd90 - f0) * pow(1.0 - NdotV, 5.0);

    return albedo * NdotL * lightScatter * viewScatter * energyFactor * INV_PI;
}

fn getFresnelSchlick(cosTheta: f32, F0: vec3<f32>) -> vec3<f32> {
    return F0 + (vec3<f32>(1.0) - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
}

fn getDistributionGGX(NdotH: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;
    let NdotH2 = NdotH * NdotH;

    let nom = alpha2;
    let denom = (NdotH2 * (alpha2 - 1.0) + 1.0);
    let denomSquared = denom * denom;

    return nom / max(EPSILON, denomSquared * PI);
}

fn getSpecularVisibility(NdotV: f32, NdotL: f32, roughness: f32) -> f32 {
    let alpha = roughness * roughness;
    let alpha2 = alpha * alpha;

    // [KO] grazing angle에서의 수치적 발산을 방지하기 위해 최소값 제한
    let safeNdotV = max(NdotV, 1e-4);
    let safeNdotL = max(NdotL, 1e-4);

    let GGXV = safeNdotL * sqrt(safeNdotV * safeNdotV * (1.0 - alpha2) + alpha2);
    let GGXL = safeNdotV * sqrt(safeNdotL * safeNdotL * (1.0 - alpha2) + alpha2);

    return 0.5 / max(GGXV + GGXL, EPSILON);
}

fn getSpecularBRDF(
    F0: vec3<f32>,
    roughness: f32,
    NdotH: f32,
    NdotV: f32,
    NdotL: f32,
    LdotH: f32
) -> vec3<f32> {
    // 1. Distribution (D)
    let D = getDistributionGGX(NdotH, roughness);

    // 2. Visibility (V) - Includes Geometry term and 1/(4*NoL*NoV)
    let V = getSpecularVisibility(NdotV, NdotL, roughness);

    // 3. Fresnel (F)
    let F = getFresnelSchlick(LdotH, F0);

    return D * V * F;
}

@fragment
fn main(inputData:InputData) -> OutputFragment {
    var output: OutputFragment;

    // [KO] 입력 데이터 추출 [EN] Extract input data
    let input_vertexNormal = inputData.vertexNormal.xyz;
    let input_vertexPosition = inputData.vertexPosition.xyz;

    // AmbientLight
    let u_ambientLight = systemUniforms.ambientLight;

    // DirectionalLight
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalShadowDepthTextureSize = systemUniforms.shadow.directionalShadowDepthTextureSize;
    let u_directionalShadowBias = systemUniforms.shadow.directionalShadowBias;

    // Camera
    let u_camera = systemUniforms.camera;
    let u_cameraPosition = u_camera.cameraPosition;

    // Uniforms
    let u_color = uniforms.color;
    let u_aoStrength = uniforms.aoStrength;
    let u_emissiveColor = uniforms.emissiveColor;
    let u_emissiveStrength = uniforms.emissiveStrength;
    let u_normalScale = uniforms.normalScale;
    let u_specularColor = uniforms.specularColor;
    let u_specularStrength = uniforms.specularStrength;
    let u_shininess = uniforms.shininess;
    let u_opacity = uniforms.opacity;
    let V = getViewDirection(input_vertexPosition, u_cameraPosition);

    // Shadow
    let receiveShadowYn = inputData.receiveShadow != .0;

    // Vertex Normal
    var N = normalize(input_vertexNormal) ;
    #redgpu_if normalTexture
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, inputData.uv).rgb;
        let tbn = getTBNFromVertexTangent(N, inputData.vertexTangent);
        N = getNormalFromNormalMap(normalSamplerColor, tbn, u_normalScale);
    #redgpu_endIf
    N = normalize(N);

    let NdotV = max(dot(N, V), 1e-6);

    // Alpha Map
    var resultAlpha:f32 = u_opacity * inputData.combinedOpacity;
    #redgpu_if alphaTexture
        let alphaMapValue:f32 = textureSample(alphaTexture, alphaTextureSampler, inputData.uv).r;
        resultAlpha = alphaMapValue * resultAlpha;
        if(resultAlpha == 0.0){ discard ; }
    #redgpu_endIf

    // Base Color (Albedo)
    var baseColor:vec3<f32> = u_color;
    #redgpu_if diffuseTexture
        let diffuseSampleColor = textureSample(diffuseTexture,diffuseTextureSampler, inputData.uv);
        baseColor = diffuseSampleColor.rgb;
        resultAlpha = resultAlpha * diffuseSampleColor.a;
    #redgpu_endIf

    // [KO] PBR 파라미터 매핑 [EN] Mapping PBR parameters
    let metallicParameter = uniforms.metallic;
    
    // [KO] shininess로부터 roughness 유도 (또는 직접 설정값 사용)
    // [EN] Derive roughness from shininess (or use explicitly set value)
    var roughnessParameter = select(sqrt(2.0 / (u_shininess + 2.0)), uniforms.roughness, uniforms.roughness > 0.0);
    roughnessParameter = clamp(roughnessParameter, 0.045, 1.0);

    var specularSamplerValue:f32 = 1.0;
    #redgpu_if specularTexture
        specularSamplerValue = textureSample(specularTexture, specularTextureSampler, inputData.uv).r;
    #redgpu_endIf

    // [KO] 기본 F0 계산: specularColor와 strength를 반영하여 dielectric F0 결정
    // [EN] Base F0 calculation: determine dielectric F0 by reflecting specularColor and strength
    let F0_dielectric = vec3<f32>(0.04) * u_specularColor * u_specularStrength * specularSamplerValue;
    let F0 = mix(F0_dielectric, baseColor, metallicParameter);
    let albedo = baseColor * (1.0 - metallicParameter);

    // Shadow Visibility
    var visibility:f32 = 1.0;
    visibility = getDirectionalShadowVisibility(
        directionalShadowMap,
        directionalShadowMapSampler,
        u_directionalShadowDepthTextureSize,
        u_directionalShadowBias,
        inputData.shadowCoord
    );
    if(!receiveShadowYn){ visibility = 1.0; }

    var totalDirectLighting = vec3<f32>(0.0);

    // [KO] 직접 조명 계산 루프 (PBR) [EN] Direct lighting calculation loop (PBR)
    for (var i = 0u; i < u_directionalLightCount; i = i + 1) {
        let L = -normalize(u_directionalLights[i].direction);
        let lightIntensity = u_directionalLights[i].intensity;
        var finalLightColor = u_directionalLights[i].color * lightIntensity * visibility;

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            let u_atmo = systemUniforms.skyAtmosphere;
            let surfaceHeightKm = max(0.0, input_vertexPosition.y / 1000.0);
            let atmosphereTransmittance = getTransmittance(transmittanceTexture, atmosphereSampler, surfaceHeightKm, L.y, u_atmo.atmosphereHeight);
            finalLightColor *= atmosphereTransmittance;
        }

        totalDirectLighting += calcPbrLight(finalLightColor, N, V, L, NdotV, roughnessParameter, metallicParameter, albedo, F0);
    }

    // PointLight / SpotLight Loop (Clustered)
    let clusterIndex = getClusterLightClusterIndex(inputData.position);
    let cell = clusterLightGrid.cells[clusterIndex];
    for (var lightIndex = 0u; lightIndex < cell.count; lightIndex = lightIndex + 1u) {
         let i = clusterLightGrid.indices[cell.offset + lightIndex];
         let tLight = clusterLightList.lights[i];
         let lightDir = tLight.position - input_vertexPosition;
         let lightDistance = length(lightDir);
         if (lightDistance > tLight.radius) { continue; }

         let L = normalize(lightDir);
         var attenuation = getLightDistanceAttenuation(lightDistance, tLight.radius);
         if (tLight.isSpotLight > 0.0) {
             let spotDir = normalize(vec3<f32>(tLight.directionX, tLight.directionY, tLight.directionZ));
             attenuation *= getLightAngleAttenuation(normalize(-L), spotDir, tLight.innerCutoff, tLight.outerCutoff);
         }
         if (attenuation <= 0.0) { continue; }

         let finalLightColor = tLight.color * tLight.intensity * attenuation;
         totalDirectLighting += calcPbrLight(finalLightColor, N, V, L, NdotV, roughnessParameter, metallicParameter, albedo, F0);
    }

    // [KO] 간접 조명 (Ambient) [EN] Indirect lighting (Ambient)
    let ambientContribution = albedo * u_ambientLight.color * u_ambientLight.intensity * INV_PI;
    
    // [KO] 조명 합산 [EN] Lighting summation
    var mixColor = totalDirectLighting + ambientContribution;

    // [KO] AO 및 오클루전 처리 [EN] AO and Occlusion processing
    #redgpu_if aoTexture
        mixColor *= textureSample(aoTexture, aoTextureSampler, inputData.uv).rgb * u_aoStrength;
    #redgpu_endIf

    // [KO] 에미시브 처리 [EN] Emissive processing
    var emissiveColor = u_emissiveColor * u_emissiveStrength * systemUniforms.emissiveIntensity;
    #redgpu_if emissiveTexture
        emissiveColor = textureSample(emissiveTexture, emissiveTextureSampler, inputData.uv).rgb * u_emissiveStrength * systemUniforms.emissiveIntensity;
    #redgpu_endIf
    emissiveColor *= systemUniforms.preExposure;

    // [KO] 최종 색상 (Pre-Exposure 적용)
    let finalColor = vec4<f32>((mixColor * systemUniforms.preExposure) + emissiveColor, resultAlpha);
    
    #redgpu_if useTint
        output.color = getTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_else
        output.color = finalColor;
    #redgpu_endIf

    if (systemUniforms.isView3D == 1 && output.color.a == 0.0) { discard; }

    // G-Buffer
    let smoothness = 1.0 - roughnessParameter;
    let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);
    output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, smoothnessCurved * (0.04 + 0.96 * metallicParameter * metallicParameter));
    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos), 0.0, 1.0);
    
    return output;
}

// [KO] 물리 기반 조명 계산 함수 (Simplified PBR)
// [EN] Physically-based lighting calculation function (Simplified PBR)
fn calcPbrLight(lightColor: vec3<f32>, N: vec3<f32>, V: vec3<f32>, L: vec3<f32>, NdotV: f32, roughness: f32, metallic: f32, albedo: vec3<f32>, F0: vec3<f32>) -> vec3<f32> {
    let NdotL = max(dot(N, L), 0.0);
    if (NdotL <= 0.0) { return vec3<f32>(0.0); }

    let H = normalize(L + V);
    let NdotH = max(dot(N, H), 0.0);
    let LdotH = max(dot(L, H), 0.0);
    let VdotH = max(dot(V, H), 0.0);

    // Specular BRDF (GGX)
    let F = getFresnelSchlick(VdotH, F0);
    let D = getDistributionGGX(NdotH, roughness);
    let Vis = getSpecularVisibility(NdotV, NdotL, roughness);
    let spec = D * Vis * F;

    // Diffuse BRDF (Disney)
    let diff = getDiffuseBRDFDisney(NdotL, NdotV, LdotH, roughness, albedo);

    // Energy Conservation
    let kS = F;
    let kD = (vec3<f32>(1.0) - kS) * (1.0 - metallic);

    return (kD * diff + spec) * lightColor * NdotL;
}
