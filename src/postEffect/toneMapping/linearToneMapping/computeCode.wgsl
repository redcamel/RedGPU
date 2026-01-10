{
    let index = vec2<i32>(global_id.xy);
    let inputColor = textureLoad(sourceTexture, index);

    let toneMapped = linearToneMapping(inputColor.rgb, uniforms.exposure);

    let contrastRGB = applyContrast(toneMapped, uniforms.contrast);
    let finalLinearRGB = applyBrightness(contrastRGB, uniforms.brightness);

    let finalSRGB = clamp(linearToSRGB(finalLinearRGB), vec3<f32>(0.0), vec3<f32>(1.0));

    let outputColor = vec4<f32>(finalSRGB, inputColor.a);
    textureStore(outputTexture, index, outputColor);

}