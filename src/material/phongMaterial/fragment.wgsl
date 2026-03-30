#redgpu_include SYSTEM_UNIFORM;
#redgpu_include color.getTintBlendMode;
#redgpu_include shadow.getDirectionalShadowVisibility;
#redgpu_include math.tnb.getTBNFromCotangent
#redgpu_include math.tnb.getNormalFromNormalMap
#redgpu_include entryPoint.mesh.entryPointPickingFragment;
#redgpu_include systemStruct.OutputFragment;
#redgpu_include math.getMotionVector;
#redgpu_include lighting.getLightDistanceAttenuation;
#redgpu_include lighting.getLightAngleAttenuation;
#redgpu_include lighting.getPhongLight;
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
#redgpu_include math.EPSILON
#redgpu_include math.direction.getViewDirection

@fragment
fn main(inputData:InputData) -> OutputFragment {
    var output: OutputFragment;

    // [KO] 입력 데이터 추출 [EN] Extract input data
    let input_vertexNormal = inputData.vertexNormal.xyz;
    let input_vertexPosition = inputData.vertexPosition.xyz;

    // AmbientLight
    let u_ambientLight = systemUniforms.ambientLight;
    let u_ambientLightColor = u_ambientLight.color;
    let u_ambientLightIntensity = u_ambientLight.intensity;

    // DirectionalLight
    let u_directionalLightCount = systemUniforms.directionalLightCount;
    let u_directionalLights = systemUniforms.directionalLights;
    let u_directionalShadowDepthTextureSize = systemUniforms.shadow.directionalShadowDepthTextureSize;
    let u_directionalShadowBias = systemUniforms.shadow.directionalShadowBias;


    // Camera
    let u_camera = systemUniforms.camera;
    let u_viewMatrix = u_camera.viewMatrix;
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


    //

    // Vertex Normal
    var N = normalize(input_vertexNormal) ;
    #redgpu_if normalTexture
        let normalSamplerColor = textureSample(normalTexture, normalTextureSampler, inputData.uv).rgb;
        let tbn = getTBNFromCotangent(N, input_vertexPosition, inputData.uv);
        N = getNormalFromNormalMap(normalSamplerColor, tbn, -u_normalScale);
    #redgpu_endIf
    //
    var finalColor:vec4<f32>;
    var resultAlpha:f32 = u_opacity * inputData.combinedOpacity;
    var diffuseColor:vec3<f32> = u_color;

    #redgpu_if diffuseTexture
        let diffuseSampleColor = textureSample(diffuseTexture,diffuseTextureSampler, inputData.uv);
        diffuseColor = diffuseSampleColor.rgb;
        resultAlpha = resultAlpha * diffuseSampleColor.a;
    #redgpu_endIf

    var specularSamplerValue:f32 = 1;
    #redgpu_if specularTexture
        specularSamplerValue = textureSample(specularTexture,specularTextureSampler, inputData.uv).r ;
    #redgpu_endIf
    var mixColor:vec3<f32> = vec3<f32>(0.0);

    // [KO] 암비안트 라이트 처리 (에너지 보존을 위해 1/PI 적용)
    // [EN] Ambient light processing (apply 1/PI for energy conservation)
    let ambientContribution = u_ambientLightColor * u_ambientLightIntensity;
    let ambientDiffuse = diffuseColor * ambientContribution * (1.0 / PI);
    mixColor += ambientDiffuse;

    var visibility:f32 = 1.0;
     visibility = getDirectionalShadowVisibility(
                directionalShadowMap,
                directionalShadowMapSampler,
                u_directionalShadowDepthTextureSize,
                u_directionalShadowBias,
                inputData.shadowCoord,

            );

    if(!receiveShadowYn){
       visibility = 1.0;
    }

    // [KO] 방향성 광원 계산
    // [EN] Directional light calculation
    for (var i = 0u; i < u_directionalLightCount; i = i + 1) {
        let u_directionalLightDirection = u_directionalLights[i].direction;
        let u_directionalLightColor = u_directionalLights[i].color;
        let u_directionalLightIntensity = u_directionalLights[i].intensity;

        var lightVisibility = 1.0;
        if (i == 0u) {
            // 첫 번째 광원(태양)에만 그림자 적용
            lightVisibility = visibility;
        }

        if (systemUniforms.useSkyAtmosphere == 1u && i == 0u) {
            // [KO] 대기 산란 모드일 때 첫 번째 광원은 대기 투과율이 반영된 태양광으로 처리
            // [EN] In SkyAtmosphere mode, the first light is treated as sun light with atmospheric transmittance
            mixColor += getAtmosphereSunLightPhong(
                u_directionalLightColor, u_directionalLightIntensity * lightVisibility, -normalize(u_directionalLightDirection),
                N, V, u_shininess, specularSamplerValue,
                diffuseColor, u_specularColor, u_specularStrength,
                input_vertexPosition, u_cameraPosition, systemUniforms.skyAtmosphere,
                atmosphereSampler, transmittanceTexture
            );
        } else {
            // 일반적인 퐁 라이팅 계산
            mixColor += getDirectionalLightPhong(
                u_directionalLightColor, u_directionalLightIntensity * lightVisibility, -normalize(u_directionalLightDirection),
                N, V, u_shininess, specularSamplerValue,
                diffuseColor, u_specularColor, u_specularStrength
            );
        }
    }

    // PointLight / SpotLight Loop
    let clusterIndex = getClusterLightClusterIndex(inputData.position);
    let lightOffset  = clusterLightGrid.cells[clusterIndex].offset;
    let lightCount:u32   = clusterLightGrid.cells[clusterIndex].count;

    for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
         let i = clusterLightGrid.indices[lightOffset + lightIndex];
         let tLight = clusterLightList.lights[i];
         
         let lightDir = tLight.position - input_vertexPosition;
         let lightDistance = length(lightDir);

         // 거리 범위 체크
         if (lightDistance > tLight.radius) {
             continue;
         }

         let L = normalize(lightDir);
         var angleAttenuation = 1.0;

         // 스폿라이트 각도 감쇄 계산 (개별 필드 directionX, Y, Z 참조)
         if (tLight.isSpotLight > 0.0) {
             let lightDirection = normalize(vec3<f32>(tLight.directionX, tLight.directionY, tLight.directionZ));
             angleAttenuation = getLightAngleAttenuation(
                 normalize(-L), 
                 lightDirection, 
                 tLight.innerCutoff, 
                 tLight.outerCutoff
             );
         }

         if (angleAttenuation <= 0.0) { continue; }

         // [KO] 점광원 전용 함수(Lumen 기반) 호출.
         mixColor += getPointLightPhong(
             tLight.color, tLight.intensity * angleAttenuation, lightDistance, tLight.radius, L,
             N, V, u_shininess, specularSamplerValue,
             diffuseColor, u_specularColor, u_specularStrength
         );
    }


    #redgpu_if alphaTexture
        let alphaMapValue:f32 = textureSample(alphaTexture, alphaTextureSampler, inputData.uv).r;
        resultAlpha = alphaMapValue * resultAlpha;
        if(resultAlpha == 0){ discard ; }
    #redgpu_endIf
    //
    var emissiveColor = u_emissiveColor  * u_emissiveStrength;
    #redgpu_if emissiveTexture
        emissiveColor = textureSample(emissiveTexture, emissiveTextureSampler, inputData.uv).rgb  * u_emissiveStrength;
    #redgpu_endIf
    //
    #redgpu_if aoTexture
        mixColor = mixColor * textureSample(aoTexture, aoTextureSampler, inputData.uv).rgb * u_aoStrength;
    #redgpu_endIf
    //
    // [KO] 최종 조명 결과 (Raw HDR * Pre-Exposure 적용)
    // [EN] Final lighting result (Raw HDR * Pre-Exposure applied)
    finalColor = vec4<f32>((mixColor + emissiveColor) * systemUniforms.preExposure, resultAlpha);
    #redgpu_if useTint
        finalColor = getTintBlendMode(finalColor, uniforms.tintBlendMode, uniforms.tint);
    #redgpu_endIf
    // alpha 값이 0일 경우 discard
    if (systemUniforms.isView3D == 1 && finalColor.a == 0.0) {
      discard;
    }
    output.color = finalColor;

    {
        let metallic = uniforms.metallic;
        let roughness = uniforms.roughness;
        let smoothness = 1.0 - roughness;
        let smoothnessCurved = smoothness * smoothness * (3.0 - 2.0 * smoothness);

        let metallicWeight = metallic * metallic;
        let baseReflection = 0.04 + 0.96 * metallicWeight;

        let baseReflectionStrength = smoothnessCurved * baseReflection;
        output.gBufferNormal = vec4<f32>(N * 0.5 + 0.5, baseReflectionStrength);
    }

    output.gBufferMotionVector = vec4<f32>(getMotionVector(inputData.currentClipPos, inputData.prevClipPos),0.0, 1.0 );
    return output;
}
