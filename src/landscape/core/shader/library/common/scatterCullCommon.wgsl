#redgpu_include landscape.struct.DrawIndexedIndirectArgs;

fn unpackTypeId(packedGroundColorAndType: u32) -> u32 {
    return extractBits(packedGroundColorAndType, 24u, 8u);
}
