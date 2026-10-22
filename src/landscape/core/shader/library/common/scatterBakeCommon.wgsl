#redgpu_include landscape.struct.LandscapeSurfaceSample;

const INV_2_POW_32: f32 = 2.3283064365386963e-10;

fn packGroundColorAndType(groundColor: vec3<f32>, typeId: u32) -> u32 {
    let rgbPacked = pack4x8unorm(vec4<f32>(groundColor, 0.0));
    return insertBits(rgbPacked, typeId, 24u, 8u);
}

fn computeScatterGridSeed(gridX: i32, gridZ: i32, seedSalt: u32) -> u32 {
    let seed = ((u32(gridX) * 73856093u) ^ (u32(gridZ) * 19349663u) ^ (seedSalt * 83492791u));
    return select(seed, 0x9e3779b9u, seed == 0u);
}

fn sampleNormalizedLayerWeight(
    weightTexture: texture_2d<f32>,
    landscapeSampler: sampler,
    uv: vec2<f32>,
    channelIndex: u32
) -> f32 {
    let weightSample = textureSampleLevel(weightTexture, landscapeSampler, uv, 0.0);
    let isAlphaFull = weightSample.a >= 0.99;
    let effectiveA = select(weightSample.a, saturate(1.0 - (weightSample.r + weightSample.g + weightSample.b)), isAlphaFull);
    let effectiveTotalW = weightSample.r + weightSample.g + weightSample.b + effectiveA;

    var rawW = 0.0;
    if (channelIndex == 0u) {
        rawW = weightSample.r;
    } else if (channelIndex == 1u) {
        rawW = weightSample.g;
    } else if (channelIndex == 2u) {
        rawW = weightSample.b;
    } else {
        rawW = effectiveA;
    }

    return select(rawW, rawW / effectiveTotalW, effectiveTotalW > 0.001);
}

fn sampleLandscapeHeightAndNormal(
    u: f32,
    v: f32,
    texDims: vec2<f32>,
    maxCoord: vec2<i32>,
    vhtTexture: texture_2d<f32>,
    heightScale: f32,
    invTexStepX: f32,
    invTexStepZ: f32
) -> LandscapeSurfaceSample {
    let fCoordX = clamp(u * texDims.x, 0.0, texDims.x - 1.0001);
    let fCoordZ = clamp(v * texDims.y, 0.0, texDims.y - 1.0001);

    let cX = i32(floor(fCoordX));
    let cZ = i32(floor(fCoordZ));
    let fracX = fCoordX - f32(cX);
    let fracZ = fCoordZ - f32(cZ);

    let c00 = vec2<i32>(cX, cZ);
    let c10 = min(c00 + vec2<i32>(1, 0), maxCoord);
    let c01 = min(c00 + vec2<i32>(0, 1), maxCoord);
    let c11 = min(c00 + vec2<i32>(1, 1), maxCoord);

    let h00 = textureLoad(vhtTexture, c00, 0).r * heightScale;
    let h10 = textureLoad(vhtTexture, c10, 0).r * heightScale;
    let h01 = textureLoad(vhtTexture, c01, 0).r * heightScale;
    let h11 = textureLoad(vhtTexture, c11, 0).r * heightScale;

    var terrainHeight: f32;
    var nx: f32;
    var nz: f32;

    if (fracX + fracZ <= 1.0) {
        terrainHeight = fma(fracZ, h01 - h00, fma(fracX, h10 - h00, h00));
        nx = (h00 - h10) * invTexStepX;
        nz = (h00 - h01) * invTexStepZ;
    } else {
        terrainHeight = fma(1.0 - fracX, h01 - h11, fma(1.0 - fracZ, h10 - h11, h11));
        nx = (h01 - h11) * invTexStepX;
        nz = (h10 - h11) * invTexStepZ;
    }

    let slopeTan2 = nx * nx + nz * nz;
    let invLen = inverseSqrt(slopeTan2 + 1.0);
    let normal = vec3<f32>(nx * invLen, invLen, nz * invLen);

    var result: LandscapeSurfaceSample;
    result.height = terrainHeight;
    result.normal = normal;
    result.slopeTan2 = slopeTan2;
    result.rawNx = nx;
    result.rawNz = nz;
    return result;
}
