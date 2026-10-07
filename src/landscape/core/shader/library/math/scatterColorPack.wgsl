fn packGroundColorAndType(groundColor: vec3<f32>, typeId: u32) -> u32 {
    let r = u32(clamp(groundColor.r, 0.0, 1.0) * 255.0);
    let g = u32(clamp(groundColor.g, 0.0, 1.0) * 255.0);
    let b = u32(clamp(groundColor.b, 0.0, 1.0) * 255.0);
    let tid = typeId & 0xFFu;
    return (tid << 24u) | (b << 16u) | (g << 8u) | r;
}

fn unpackTypeId(packedGroundColorAndType: u32) -> u32 {
    return (packedGroundColorAndType >> 24u) & 0xFFu;
}

fn unpackGroundColor(packedGroundColorAndType: u32) -> vec3<f32> {
    let r = f32(packedGroundColorAndType & 0xFFu) / 255.0;
    let g = f32((packedGroundColorAndType >> 8u) & 0xFFu) / 255.0;
    let b = f32((packedGroundColorAndType >> 16u) & 0xFFu) / 255.0;
    return vec3<f32>(r, g, b);
}

fn replacePackedAlpha(packedGroundColorAndType: u32, alphaByte: u32) -> u32 {
    let groundRGB = packedGroundColorAndType & 0x00FFFFFFu;
    return ((alphaByte & 0xFFu) << 24u) | groundRGB;
}
