// ============================================================================
// RedGPU Landscape Grass GPU Baking Compute Shader
// - Executes ONCE per grass registration / tile load / streaming region update
// - 1:1 Exact Mathematical Equivalence with previous SubCell scattering:
//   * 1 GPU Thread per 16m SubCell
//   * Exact deterministic computeScatterGridSeed + SplitMix32 PRNG sequence
//   * Exact targetLayer WeightMap (splatmap >= 0.20) masking
//   * VHT virtual height bilinear snapping & 25% blended normal quaternion
//   * VBT ground albedo color sampling
//   * Permanent write to rawInstances VRAM mega-buffer
// ============================================================================

#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.math.rotateVectorByQuat;


struct GrassBakeUniforms {
    centerCellX: i32,              // Center cell grid coordinate X
    centerCellZ: i32,              // Center cell grid coordinate Z
    totalCells: u32,               // Total active circular cells to bake
    instancesPerCell: u32,         // Instances per 16m cell (e.g. 192~512)
    cellSize: f32,                 // SubCell size (16.0 meters)
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    heightScale: f32,
    bottomOffset: f32,
    meshHeight: f32,
    minSlopeTan2: f32,
    maxSlopeTan2: f32,
    hasSlopeFilter: u32,
    minScaleS: f32,
    minScaleH: f32,
    deltaScaleS: f32,
    deltaScaleH: f32,
    typeId: u32,
    rawBaseOffset: u32,
    hasWeightMap: u32,
    weightChannelIndex: u32,
    densityScaleByWeight: u32,
};

@group(0) @binding(0) var<uniform> uniforms: GrassBakeUniforms;
@group(0) @binding(1) var<storage, read_write> rawInstances: array<GrassInstance>;
@group(0) @binding(2) var vhtTexture: texture_2d<f32>;
@group(0) @binding(3) var vbtTexture: texture_2d<f32>;
@group(0) @binding(4) var landscapeSampler: sampler;
@group(0) @binding(5) var weightTexture: texture_2d<f32>;
@group(0) @binding(6) var<storage, read> cellOffsets: array<vec2<i32>>;

// Deterministic 32-bit PRNG seed (1:1 with computeScatterGridSeed in ScatterSpatialUtils.ts)
fn computeScatterGridSeed(gridX: i32, gridZ: i32, typeId: u32) -> u32 {
    let seed = ((u32(gridX) * 73856093u) ^ (u32(gridZ) * 19349663u) ^ (typeId * 83492791u));
    return select(seed, 0x9e3779b9u, seed == 0u);
}

// SplitMix32 PRNG (1:1 with JavaScript nextPrng implementation)
fn splitMix32(state: ptr<function, u32>) -> f32 {
    *state = (*state + 0x6D2B79F5u);
    var t = (*state ^ (*state >> 15u)) * (1u | *state);
    t = (t + ((t ^ (t >> 7u)) * (61u | t))) ^ t;
    return f32((t ^ (t >> 14u)) & 0xFFFFFFFFu) / 4294967296.0;
}


fn quatMultiply(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(
        a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz),
        a.w * b.w - dot(a.xyz, b.xyz)
    );
}

fn writeInvalidInstance(targetIdx: u32, posX: f32, posZ: f32) {
    var inv: GrassInstance;
    inv.posX = posX;
    inv.posY = -999999.0;
    inv.posZ = posZ;
    inv.scaleY = 0.0;
    inv.scaleXZ = 0.0;
    inv.packedBounding = 0u;
    inv.packedQuat = 0u;
    inv.packedGroundColor = 0u;
    rawInstances[targetIdx] = inv;
}

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let cellIdx = globalId.x;
    if (cellIdx >= uniforms.totalCells) {
        return;
    }

    let offset = cellOffsets[cellIdx];
    let cellCoordX = uniforms.centerCellX + offset.x;
    let cellCoordZ = uniforms.centerCellZ + offset.y;

    let cellMinX = f32(cellCoordX) * uniforms.cellSize;
    let cellMinZ = f32(cellCoordZ) * uniforms.cellSize;

    var prngState = computeScatterGridSeed(cellCoordX, cellCoordZ, uniforms.typeId);
    let texDims = vec2<f32>(textureDimensions(vhtTexture, 0));
    let maxCoord = vec2<i32>(texDims) - vec2<i32>(1);
    let texStepX = select(1.0, 1.0 / (uniforms.invWorldSizeX * texDims.x), uniforms.invWorldSizeX > 0.0);
    let texStepZ = select(1.0, 1.0 / (uniforms.invWorldSizeZ * texDims.y), uniforms.invWorldSizeZ > 0.0);

    let baseTargetSlot = uniforms.rawBaseOffset + cellIdx * uniforms.instancesPerCell;

    // Execute exact instance loop matching the CPU subcell scattering
    for (var inst = 0u; inst < uniforms.instancesPerCell; inst = inst + 1u) {
        let currentTargetIdx = baseTargetSlot + inst;

        let gx = cellMinX + splitMix32(&prngState) * uniforms.cellSize;
        let gz = cellMinZ + splitMix32(&prngState) * uniforms.cellSize;

        let u = gx * uniforms.invWorldSizeX + 0.5;
        let v = gz * uniforms.invWorldSizeZ + 0.5;

        // Terrain boundary check
        if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
            writeInvalidInstance(currentTargetIdx, gx, gz);
            continue;
        }

        // WeightMap (SplatMap) evaluation: 1:1 match with landscapeFragment.wgsl
        if (uniforms.hasWeightMap != 0u) {
            let weightSample = textureSampleLevel(weightTexture, landscapeSampler, vec2<f32>(u, v), 0.0);
            let isAlphaFull = weightSample.a >= 0.99;
            let effectiveA = select(weightSample.a, clamp(1.0 - (weightSample.r + weightSample.g + weightSample.b), 0.0, 1.0), isAlphaFull);
            let effectiveTotalW = weightSample.r + weightSample.g + weightSample.b + effectiveA;

            var rawW = 0.0;
            if (uniforms.weightChannelIndex == 0u) {
                rawW = weightSample.r;
            } else if (uniforms.weightChannelIndex == 1u) {
                rawW = weightSample.g;
            } else if (uniforms.weightChannelIndex == 2u) {
                rawW = weightSample.b;
            } else {
                rawW = effectiveA;
            }

            let normW = select(rawW, rawW / effectiveTotalW, effectiveTotalW > 0.001);

            // Exclude non-grass layers (rock, road, gravel < 0.20)
            if (normW < 0.20) {
                writeInvalidInstance(currentTargetIdx, gx, gz);
                continue;
            }

            if (uniforms.densityScaleByWeight != 0u && splitMix32(&prngState) > normW) {
                writeInvalidInstance(currentTargetIdx, gx, gz);
                continue;
            }
        }

        let rot = splitMix32(&prngState) * 6.2831853;
        let sScale = uniforms.minScaleS + splitMix32(&prngState) * uniforms.deltaScaleS;
        let hScale = uniforms.minScaleH + splitMix32(&prngState) * uniforms.deltaScaleH;

        // Bilinear terrain height & normal evaluation
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

        let h00 = textureLoad(vhtTexture, c00, 0).r * uniforms.heightScale;
        let h10 = textureLoad(vhtTexture, c10, 0).r * uniforms.heightScale;
        let h01 = textureLoad(vhtTexture, c01, 0).r * uniforms.heightScale;
        let h11 = textureLoad(vhtTexture, c11, 0).r * uniforms.heightScale;

        var terrainHeight: f32;
        var rawNx: f32;
        var rawNz: f32;

        if (fracX + fracZ <= 1.0) {
            terrainHeight = h00 + fracX * (h10 - h00) + fracZ * (h01 - h00);
            rawNx = (h00 - h10) / texStepX;
            rawNz = (h00 - h01) / texStepZ;
        } else {
            terrainHeight = h11 + (1.0 - fracZ) * (h10 - h11) + (1.0 - fracX) * (h01 - h11);
            rawNx = (h01 - h11) / texStepX;
            rawNz = (h10 - h11) / texStepZ;
        }

        // Slope filtering
        let slopeTan2 = rawNx * rawNx + rawNz * rawNz;
        if (uniforms.hasSlopeFilter != 0u && (slopeTan2 < uniforms.minSlopeTan2 || slopeTan2 > uniforms.maxSlopeTan2)) {
            writeInvalidInstance(currentTargetIdx, gx, gz);
            continue;
        }

        // Surface normal alignment quaternion (blended 25% with Up vector)
        let terrainN = normalize(vec3<f32>(rawNx, 1.0, rawNz));
        let blendedN = normalize(mix(vec3<f32>(0.0, 1.0, 0.0), terrainN, 0.25));

        let halfRotY = rot * 0.5;
        let qY = vec4<f32>(0.0, sin(halfRotY), 0.0, cos(halfRotY));

        let rotAxis = vec3<f32>(blendedN.z, 0.0, -blendedN.x);
        let qTerrain = normalize(vec4<f32>(rotAxis.x, rotAxis.y, rotAxis.z, 1.0 + blendedN.y));

        let finalQuat = normalize(quatMultiply(qTerrain, qY));
        let canonicalQuat = select(-finalQuat, finalQuat, finalQuat.w >= 0.0);

        let baseH = max(0.01, uniforms.meshHeight) * hScale;
        let halfH = baseH * 0.5;
        let localCenter = rotateVectorByQuat(vec3<f32>(0.0, halfH, 0.0), canonicalQuat);
        let centerOffsetY = max(0.05, localCenter.y);
        let maxXZ = sScale;
        let boundRadius = sqrt(halfH * halfH + maxXZ * maxXZ) * 1.5;

        // Ground color sampling from VBT
        var groundColor = vec3<f32>(0.15, 0.35, 0.1);
        let groundTex = textureSampleLevel(vbtTexture, landscapeSampler, vec2<f32>(u, v), 0.0);
        if (groundTex.a > 0.01) {
            groundColor = groundTex.rgb;
        }

        // Write valid baked grass instance
        var outInst: GrassInstance;
        outInst.posX = gx;
        outInst.posY = terrainHeight + uniforms.bottomOffset;
        outInst.posZ = gz;
        outInst.scaleY = hScale;
        outInst.scaleXZ = sScale;
        outInst.packedBounding = pack2x16float(vec2<f32>(centerOffsetY, boundRadius));
        outInst.packedQuat = pack4x8snorm(canonicalQuat);
        let colorPacked = pack4x8unorm(vec4<f32>(groundColor, 0.0)) & 0x00FFFFFFu;
        outInst.packedGroundColor = colorPacked | (uniforms.typeId << 24u);

        rawInstances[currentTargetIdx] = outInst;
    }
}
