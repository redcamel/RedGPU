fn packGroundColorAndType(groundColor: vec3<f32>, typeId: u32) -> u32 {
    let rgbPacked = pack4x8unorm(vec4<f32>(groundColor, 0.0));
    return insertBits(rgbPacked, typeId, 24u, 8u);
}

fn unpackTypeId(packedGroundColorAndType: u32) -> u32 {
    return extractBits(packedGroundColorAndType, 24u, 8u);
}

fn replacePackedAlpha(packedGroundColorAndType: u32, alphaByte: u32) -> u32 {
    return insertBits(packedGroundColorAndType, alphaByte, 24u, 8u);
}

