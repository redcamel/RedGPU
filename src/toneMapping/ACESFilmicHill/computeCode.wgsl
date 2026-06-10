{
    let index = vec2<i32>(global_id.xy);
    let inputColor = textureLoad(sourceTexture, index, 0);

    let toneMappedColor = acesFilmicHillToneMapping(inputColor.rgb);

    let finalSRGB = getFinalSRGB( toneMappedColor, uniforms.contrast, uniforms.brightness );
    textureStore(outputTexture, index, vec4<f32>(finalSRGB, inputColor.a));

}
