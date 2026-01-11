{
    let index = vec2<i32>(global_id.xy);
    let inputColor = textureLoad(sourceTexture, index);

    let toneMappedColor = linearToneMapping(inputColor.rgb, uniforms.exposure);

    let finalSRGB = getFinalSRGB( toneMappedColor, uniforms.contrast, uniforms.brightness );
    textureStore(outputTexture, index, vec4<f32>(finalSRGB, inputColor.a));

}