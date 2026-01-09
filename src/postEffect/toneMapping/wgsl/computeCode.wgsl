{
    let index = vec2<i32>(global_id.xy);
    let dimensions: vec2<u32> = textureDimensions(sourceTexture);
    let dimW = f32(dimensions.x);
    let dimH = f32(dimensions.y);

   let inputColor = textureLoad(sourceTexture, index);

   // 1. 노출 조절 (Linear 공간에서 수행)
   let exposure_value = uniforms.exposure;

   // 2. 톤매핑 적용
   let toneMapped = toneMappingAcesHill(inputColor.rgb,exposure_value);

   // 3. 감마 보정 (정확한 sRGB 커브 적용)
   let gammaCorrected = vec3<f32>(
       linearToSRGB(toneMapped.r),
       linearToSRGB(toneMapped.g),
       linearToSRGB(toneMapped.b)
   );

   // 4. 명암 및 밝기 (이미 감마 보정이 끝난 0~1 사이 값에서 수행)
   let contrastRGB = (gammaCorrected - 0.5) * uniforms.contrast + 0.5;
   let finalRGB = clamp(contrastRGB + uniforms.brightness, vec3<f32>(0.0), vec3<f32>(1.0));

   let outputColor = vec4<f32>(finalRGB, inputColor.a);
   textureStore(outputTexture, index, outputColor);
}