// ============================================================================
// RedGPU Landscape Foliage GPU Baking Compute Shader
// - Executes per 100m scatter grid or streaming subcell update
// - 1:1 Exact Mathematical Equivalence with previous CPU subcell scattering:
//   * Exact deterministic computeFoliageGridSeed + XorShift32 PRNG sequence
//   * Exact targetLayer WeightMap (splatmap >= 0.10) evaluation
//   * VHT virtual height bilinear terrain snapping & normal quaternion alignment
//   * VBT ground albedo color sampling
//   * Permanent write to rawInstances VRAM mega-buffer
// ============================================================================

#redgpu_include landscape.struct.FoliageInstance;
#redgpu_include landscape.math.scatterColorPack;

struct FoliageBakeUniforms {
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    halfWorldSizeX: f32,
    halfWorldSizeZ: f32,

    gridSize: f32,                 // FIXED_SCATTER_GRID_SIZE (100.0m)
    targetCountPerHectare: u32,
    maxAttempts: u32,
    nameHash: u32,

    minScaleX: f32,
    minScaleY: f32,
    minScaleZ: f32,
    scaleDiffX: f32,

    scaleDiffY: f32,
    scaleDiffZ: f32,
    bottomOffset: f32,
    minSlopeTan2: f32,

    maxSlopeTan2: f32,
    alignFactor: f32,
    hasSlopeFilter: u32,
    needNormalAlign: u32,

    randomRotationY: u32,
    densityScaleByWeight: u32,
    isUniformXZ: u32,
    typeId: u32,

    hasVBT: u32,
    hasWeightMap: u32,
    weightChannelIndex: u32,
    rawBaseOffset: u32,

    heightScale: f32,
    totalGrids: u32,
    subMinX: f32,
    subMinZ: f32,

    subMaxX: f32,
    subMaxZ: f32,
    strideFloats: u32,
    pad0: u32,
};

struct FoliageGridTask {
    gridX: i32,
    gridZ: i32,
    baseTargetSlot: u32,
    maxSlotsForGrid: u32,
};

@group(0) @binding(0) var<uniform> uniforms: FoliageBakeUniforms;
@group(0) @binding(1) var<storage, read_write> rawInstances: array<FoliageInstance>;
@group(0) @binding(2) var vhtTexture: texture_2d<f32>;
@group(0) @binding(3) var vbtTexture: texture_2d<f32>;
@group(0) @binding(4) var landscapeSampler: sampler;
@group(0) @binding(5) var weightTexture: texture_2d<f32>;
@group(0) @binding(6) var<storage, read> gridTasks: array<FoliageGridTask>;

// [Visual Parity] CPU computeScatterGridSeed 1:1 Exact Match
fn computeFoliageGridSeed(gridX: i32, gridZ: i32, nameHash: u32) -> u32 {
    let seed = ((u32(gridX) * 73856093u) ^ (u32(gridZ) * 19349663u) ^ (nameHash * 83492791u));
    return select(seed, 0x9e3779b9u, seed == 0u);
}

// [Visual Parity] CPU XorShift32 1:1 Exact Match
fn xorShift32(seed: ptr<function, u32>) -> f32 {
    var s: u32 = *seed;
    s ^= s << 13u;
    s ^= s >> 17u;
    s ^= s << 5u;
    *seed = s;
    return f32(s) / 4294967296.0;
}

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let taskIdx = globalId.x;
    if (taskIdx >= uniforms.totalGrids) {
        return;
    }

    let task = gridTasks[taskIdx];
    let gx = task.gridX;
    let gz = task.gridZ;

    let gridMinX = f32(gx) * uniforms.gridSize - uniforms.halfWorldSizeX;
    let gridMinZ = f32(gz) * uniforms.gridSize - uniforms.halfWorldSizeZ;

    var seed = computeFoliageGridSeed(gx, gz, uniforms.nameHash);

    let texDims = vec2<f32>(textureDimensions(vhtTexture, 0));
    let maxCoord = vec2<i32>(texDims) - vec2<i32>(1);
    let texStepX = select(1.0, 1.0 / (uniforms.invWorldSizeX * texDims.x), uniforms.invWorldSizeX > 0.0);
    let texStepZ = select(1.0, 1.0 / (uniforms.invWorldSizeZ * texDims.y), uniforms.invWorldSizeZ > 0.0);

    var generatedInGrid = 0u;
    var writtenCount = 0u;

    // 1:1 Exact Match with CPU Foliage.ts instance generation loop
    for (var i = 0u; i < uniforms.maxAttempts && generatedInGrid < uniforms.targetCountPerHectare; i = i + 1u) {
        let rX = xorShift32(&seed);
        let rZ = xorShift32(&seed);

        let posX = gridMinX + rX * uniforms.gridSize;
        let posZ = gridMinZ + rZ * uniforms.gridSize;

        let u = (posX + uniforms.halfWorldSizeX) * uniforms.invWorldSizeX;
        let v = (posZ + uniforms.halfWorldSizeZ) * uniforms.invWorldSizeZ;

        // Boundary check
        if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
            continue;
        }

        // Splat WeightMap evaluation (1:1 with CPU sampleNormalizedLayerWeight)
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

            let weight = select(rawW, rawW / effectiveTotalW, effectiveTotalW > 0.001);
            if (weight < 0.1) {
                continue;
            }

            if (uniforms.densityScaleByWeight != 0u) {
                let rReject = xorShift32(&seed);
                if (rReject > weight) {
                    continue;
                }
            }
        }

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

        let invLen = 1.0 / sqrt(nx * nx + 1.0 + nz * nz);

        // Slope filtering (1:1 with CPU Math.acos)
        if (uniforms.hasSlopeFilter != 0u) {
            let slopeTan2 = nx * nx + nz * nz;
            if (slopeTan2 < uniforms.minSlopeTan2 || slopeTan2 > uniforms.maxSlopeTan2) {
                continue;
            }
        }

        let rScale = xorShift32(&seed);
        let scaleX = uniforms.minScaleX + rScale * uniforms.scaleDiffX;
        let scaleY = uniforms.minScaleY + rScale * uniforms.scaleDiffY;
        let scaleZ = select(uniforms.minScaleZ + rScale * uniforms.scaleDiffZ, scaleX, uniforms.isUniformXZ != 0u);

        let posY = terrainHeight + uniforms.bottomOffset * scaleY;

        var rotX: f32 = 0.0;
        var rotY: f32 = 0.0;
        var rotZ: f32 = 0.0;
        var rotW: f32 = 1.0;

        if (uniforms.randomRotationY != 0u) {
            let rAngle = xorShift32(&seed);
            let angle = rAngle * 6.283185307179586;
            let halfAngle = angle * 0.5;
            rotY = sin(halfAngle);
            rotW = cos(halfAngle);
        }

        if (uniforms.needNormalAlign != 0u) {
            let normalX = nx * invLen;
            let normalY = invLen;
            let normalZ = nz * invLen;

            let vx = normalZ;
            let vz = -normalX;
            let vw = 1.0 + normalY;
            let tiltLen = sqrt(vx * vx + vz * vz + vw * vw);
            if (tiltLen > 0.0001) {
                let invTilt = 1.0 / tiltLen;
                let tx = (vx * invTilt) * uniforms.alignFactor;
                let tz = (vz * invTilt) * uniforms.alignFactor;
                let tw = (1.0 - uniforms.alignFactor) + (vw * invTilt) * uniforms.alignFactor;
                let alignLen = sqrt(tx * tx + tz * tz + tw * tw);
                let invAlign = 1.0 / select(1.0, alignLen, alignLen > 0.0001);
                let ax = tx * invAlign;
                let az = tz * invAlign;
                let aw = tw * invAlign;

                rotX = ax * rotW - az * rotY;
                rotY = aw * rotY;
                rotZ = az * rotW + ax * rotY;
                rotW = aw * rotW;
            }
        }

        generatedInGrid = generatedInGrid + 1u;

        // SubCell bounding box check
        if (posX >= uniforms.subMinX && posX < uniforms.subMaxX && posZ >= uniforms.subMinZ && posZ < uniforms.subMaxZ) {
            if (writtenCount >= task.maxSlotsForGrid) {
                return;
            }

            let outIdx = uniforms.rawBaseOffset + writtenCount;
            writtenCount = writtenCount + 1u;

            var inst: FoliageInstance;
            inst.posX = posX;
            inst.posY = posY;
            inst.posZ = posZ;
            inst.scaleY = scaleY;

            // Pack rotation quaternion
            let ix = clamp(i32(rotX * 32767.0), -32768, 32767);
            let iy = clamp(i32(rotY * 32767.0), -32768, 32767);
            let iz = clamp(i32(rotZ * 32767.0), -32768, 32767);
            let iw = clamp(i32(rotW * 32767.0), -32768, 32767);

            inst.packedRotXY = (u32(ix & 0xFFFF)) | (u32(iy & 0xFFFF) << 16u);
            inst.packedRotZW = (u32(iz & 0xFFFF)) | (u32(iw & 0xFFFF) << 16u);

            inst.packedScaleXZ = pack2x16float(vec2<f32>(scaleX, scaleZ));

            var groundColor = vec3<f32>(0.2, 0.2, 0.2);
            if (uniforms.hasVBT != 0u) {
                let groundTex = textureSampleLevel(vbtTexture, landscapeSampler, vec2<f32>(u, v), 0.0);
                if (groundTex.a > 0.05) {
                    groundColor = groundTex.rgb;
                }
            }
            inst.packedGroundColorAndType = packGroundColorAndType(groundColor, uniforms.typeId);

            rawInstances[outIdx] = inst;
        }
    }
}
