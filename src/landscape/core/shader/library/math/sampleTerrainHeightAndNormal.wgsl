/**
 * [KO] 지형 높이맵(VHT)으로부터 4점 텍셀을 읽어 대각선 평면 분할 바이리니어 보간 높이 및 편미분 표면 법선(Normal)을 정밀 계산하는 공통 구조체입니다.
 * [EN] Common structure for bilinearly interpolated height and partial-derivative surface normal sampled from terrain heightmap (VHT).
 */
struct TerrainSurfaceSample {
    height: f32,
    normal: vec3<f32>,
    slopeTan2: f32,
    rawNx: f32,
    rawNz: f32,
};

/**
 * [KO] 정규화 UV 좌표로부터 지형 높이맵을 4점 바이리니어 샘플링하고, 표면 정밀 고도, 편미분 기울기, 정규화 법선 벡터 및 탄젠트 경사 제곱값을 계산합니다.
 * [EN] Bilinearly samples terrain heightmap from normalized UV, computing precise elevation, partial-derivative slopes, normalized surface normal, and slopeTan2.
 *
 * ```wgsl
 * #redgpu_include landscape.math.sampleTerrainHeightAndNormal;
 * let surface = sampleTerrainHeightAndNormal(u, v, texDims, maxCoord, vhtTexture, uniforms.heightScale, texStepX, texStepZ);
 * ```
 */
fn sampleTerrainHeightAndNormal(
    u: f32,
    v: f32,
    texDims: vec2<f32>,
    maxCoord: vec2<i32>,
    vhtTexture: texture_2d<f32>,
    heightScale: f32,
    texStepX: f32,
    texStepZ: f32
) -> TerrainSurfaceSample {
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
        terrainHeight = h00 + fracX * (h10 - h00) + fracZ * (h01 - h00);
        nx = (h00 - h10) / texStepX;
        nz = (h00 - h01) / texStepZ;
    } else {
        terrainHeight = h11 + (1.0 - fracZ) * (h10 - h11) + (1.0 - fracX) * (h01 - h11);
        nx = (h01 - h11) / texStepX;
        nz = (h10 - h11) / texStepZ;
    }

    let slopeTan2 = nx * nx + nz * nz;
    let invLen = 1.0 / sqrt(slopeTan2 + 1.0);
    let normal = vec3<f32>(nx * invLen, invLen, nz * invLen);

    var result: TerrainSurfaceSample;
    result.height = terrainHeight;
    result.normal = normal;
    result.slopeTan2 = slopeTan2;
    result.rawNx = nx;
    result.rawNz = nz;
    return result;
}
