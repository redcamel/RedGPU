fn calcPrePathBackground(
    u_useKHR_materials_volume:bool, thicknessParameter:f32, u_KHR_dispersion:f32, u_KHR_attenuationDistance:f32, u_KHR_attenuationColor:vec3<f32>,
    ior:f32, roughnessParameter:f32, albedo:vec3<f32>,
    projectionCameraMatrix:mat4x4<f32>, input_vertexPosition:vec3<f32>, input_ndcPosition:vec3<f32>,
    V:vec3<f32>, N:vec3<f32>,
    renderPath1ResultTexture:texture_2d<f32>, renderPath1ResultTextureSampler:sampler
) -> vec3<f32> {
    var prePathBackground = vec3<f32>(0.0);
    let transmissionMipLevel: f32 = roughnessParameter * f32(textureNumLevels(renderPath1ResultTexture) - 1);
//    let transmissionMipLevel: f32 = pow(roughnessParameter,0.4) * f32(textureNumLevels(renderPath1ResultTexture) - 1);
    if(u_useKHR_materials_volume){
        var iorR: f32 = ior;
        var iorG: f32 = ior;
        var iorB: f32 = ior;
        if(u_KHR_dispersion>0.0){
            let halfSpread: f32 = (ior - 1.0) * 0.025 * u_KHR_dispersion;
            iorR = ior + halfSpread;
            iorG = ior;
            iorB = ior - halfSpread;
        }
        let refractedVecR: vec3<f32> = refract(-V, N, 1.0 / iorR);
        let refractedVecG: vec3<f32> = refract(-V, N, 1.0 / iorG);
        let refractedVecB: vec3<f32> = refract(-V, N, 1.0 / iorB);

        // 각각의 굴절 벡터로 세계 좌표의 굴절 위치 계산 후 UV 좌표 계산
        let worldPosR: vec3<f32> = input_vertexPosition + refractedVecR * thicknessParameter;
        let worldPosG: vec3<f32> = input_vertexPosition + refractedVecG * thicknessParameter;
        let worldPosB: vec3<f32> = input_vertexPosition + refractedVecB * thicknessParameter;

        // 월드→뷰→프로젝션 변환 적용하여 최종 UV 좌표 계산
        let clipPosR: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosR, 1.0);
        let clipPosG: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosG, 1.0);
        let clipPosB: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPosB, 1.0);

        let ndcR: vec2<f32> = clipPosR.xy / clipPosR.w * 0.5 + 0.5;
        let ndcG: vec2<f32> = clipPosG.xy / clipPosG.w * 0.5 + 0.5;
        let ndcB: vec2<f32> = clipPosB.xy / clipPosB.w * 0.5 + 0.5;

        // Y축 좌표 변환 적용
        let finalUV_R: vec2<f32> = vec2<f32>(ndcR.x, 1.0 - ndcR.y);
        let finalUV_G: vec2<f32> = vec2<f32>(ndcG.x, 1.0 - ndcG.y);
        let finalUV_B: vec2<f32> = vec2<f32>(ndcB.x, 1.0 - ndcB.y);

        // RGB 픽셀 샘플링
        prePathBackground.r = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_R, transmissionMipLevel).r;
        prePathBackground.g = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_G, transmissionMipLevel).g;
        prePathBackground.b = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV_B, transmissionMipLevel).b;

    } else {
        let refractedVec: vec3<f32> = refract(-V, N, 1.0 / ior);
        let worldPos: vec3<f32> = input_vertexPosition + refractedVec * thicknessParameter;
        let clipPos: vec4<f32> = projectionCameraMatrix * vec4<f32>(worldPos, 1.0);
        let ndc: vec2<f32> = clipPos.xy / clipPos.w * 0.5 + 0.5;
        let finalUV: vec2<f32> = vec2<f32>(ndc.x, 1.0 - ndc.y);
        prePathBackground = textureSampleLevel(renderPath1ResultTexture, renderPath1ResultTextureSampler, finalUV, transmissionMipLevel).rgb;
    }
    // 투과 색상에 알베도 적용
    prePathBackground *= albedo ;
    return prePathBackground;
}
