
fn calcDirectionalLight(
    light:DirectionalLightUniforms,normal:vec3<f32>,
    ///
    shininess:f32,
    specularPower:f32,
    specularColor:vec3<f32>,
) -> vec3<f32> {
    var direction:vec3<f32> = normalize(light.direction);
    var ld:vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var ls:vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    var lightDot:f32 ;
    ld = vec3<f32>(light.color) * light.intensity;
    lightDot = dot(normal,-direction);
    if(lightDot>0.0){
        var specularTextureValue:f32  = 1.0; // TODO
        var specular:f32 = pow( max(dot(reflect(direction, normal), -direction), 0.0), shininess) * specularPower * specularTextureValue;
        ls = specularColor * specular * light.intensity;
    }
    return  vec3<f32>(ld * lightDot) + ls;

};

fn calcPointLight(
    light:PointLight, normal:vec3<f32>,
    vertexPosition:vec3<f32>,
    ///
    shininess:f32,
    specularPower:f32,
    specularColor:vec3<f32>,
)-> vec3<f32>{
    //TODO specular, etc...
    var lightPosition:vec3<f32> = light.position;
    var vertexPosition2:vec3<f32> = vertexPosition.xyz;
    var lightConstant:f32 = 1.0f;
    var lightLinear:f32 = 0.4f;
    var lightQuadratic:f32 = 0.07f;

    var direction:vec3<f32>;
    var lightDot:f32 ;
    var radius:f32 = light.radius ;
    var intensity:f32 = light.intensity ;
    direction = normalize(-lightPosition + vertexPosition2);
    lightDot = ((dot(normal,-direction)));
    //
    var distance:f32 = (length( -lightPosition + vertexPosition2) );
    var lp:vec3<f32> ;
    var ls:vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    if(radius> distance){
        if(lightDot>0.0){
            lp = vec3<f32>(light.color)  ;
            var attenuation:f32 = 1.0 / (lightConstant + lightLinear * distance +
            lightQuadratic * (distance * distance));
            lp *= intensity;
            lp *= lightDot;
            lp *= attenuation;
            var specularTextureValue:f32  = 1.0; // TODO
            var specular:f32 = pow( max(dot(reflect(direction, normal), -direction), 0.0), shininess) * specularPower * specularTextureValue;
            ls = specularColor * specular * light.intensity * attenuation;
        }else{
        }
    }
     return  vec3<f32>(lp) + ls;
}

fn calcLights(
    systemLightUniforms : SystemLightUniforms,
    position : vec4<f32>,
    normal : vec3<f32>,
    vertexPosition : vec3<f32>,
    ///
    shininess:f32,
    specularPower:f32,
    specularColor:vec3<f32>,
    )->vec3<f32>{
        var lightColorSum   = vec3<f32>(0.0,0.0,0.0);
        // directional light
        for (var i = 0u; i<u32(systemLightUniforms.directionalLightCount[0]); i = i + 1u) {
            lightColorSum = lightColorSum + calcDirectionalLight(
                systemLightUniforms.directionalLight[i],
                normal,
                shininess,
                specularPower,
                specularColor
                );
        }
        // point light
        let clusterIndex = getPointLightClusterIndex(position);
        let lightOffset  = pointLight_clusterLightGroup.lights[clusterIndex].offset;
        let lightCount:u32   = pointLight_clusterLightGroup.lights[clusterIndex].count;
        for (var lightIndex = 0u; lightIndex < lightCount; lightIndex = lightIndex + 1u) {
            let i = pointLight_clusterLightGroup.indices[lightOffset + lightIndex];
            lightColorSum = lightColorSum + (calcPointLight(
                pointLightList.lights[i],
                normal,
                vertexPosition,
                shininess,
                specularPower,
                specularColor
            ));
        }
        // ambient light
        var ALIntensity:f32 = systemLightUniforms.ambientLight.a;
        var ALColor:vec3<f32> = (systemLightUniforms.ambientLight.rgb) * ALIntensity;
        lightColorSum = ALColor + lightColorSum;
        return lightColorSum;
    }
