#redgpu_include landscape.struct.GrassInstance;
#redgpu_include landscape.math.rotateVectorByQuat;
#redgpu_include landscape.math.quatMultiply;
#redgpu_include landscape.math.scatterColorPack;
#redgpu_include landscape.math.scatterSpatialPrng;
#redgpu_include landscape.math.sampleNormalizedLayerWeight;
#redgpu_include landscape.math.sampleTerrainHeightAndNormal;

struct GrassBakeUniforms {
    centerCellX: i32,
    centerCellZ: i32,
    totalCells: u32,
    instancesPerCell: u32,
    cellSize: f32,
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

fn writeInvalidInstance(targetIdx: u32, posX: f32, posZ: f32) {
    var inv: GrassInstance;
    inv.posX = posX;
    inv.posY = -999999.0;
    inv.posZ = posZ;
    inv.scaleY = 0.0;
    inv.scaleXZ = 0.0;
    inv.packedBounding = 0u;
    inv.packedQuat = 0u;
    inv.packedGroundColorAndType = 0u;
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

    for (var inst = 0u; inst < uniforms.instancesPerCell; inst = inst + 1u) {
        let currentTargetIdx = baseTargetSlot + inst;

        let gx = cellMinX + splitMix32(&prngState) * uniforms.cellSize;
        let gz = cellMinZ + splitMix32(&prngState) * uniforms.cellSize;

        let u = gx * uniforms.invWorldSizeX + 0.5;
        let v = gz * uniforms.invWorldSizeZ + 0.5;

        if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
            writeInvalidInstance(currentTargetIdx, gx, gz);
            continue;
        }

        if (uniforms.hasWeightMap != 0u) {
            let normW = sampleNormalizedLayerWeight(weightTexture, landscapeSampler, vec2<f32>(u, v), uniforms.weightChannelIndex);

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

        let surface = sampleTerrainHeightAndNormal(
            u, v, texDims, maxCoord, vhtTexture, uniforms.heightScale, texStepX, texStepZ
        );

        if (uniforms.hasSlopeFilter != 0u && (surface.slopeTan2 < uniforms.minSlopeTan2 || surface.slopeTan2 > uniforms.maxSlopeTan2)) {
            writeInvalidInstance(currentTargetIdx, gx, gz);
            continue;
        }

        let terrainN = surface.normal;
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

        var groundColor = vec3<f32>(0.15, 0.35, 0.1);
        let groundTex = textureSampleLevel(vbtTexture, landscapeSampler, vec2<f32>(u, v), 0.0);
        if (groundTex.a > 0.01) {
            groundColor = groundTex.rgb;
        }

        var outInst: GrassInstance;
        outInst.posX = gx;
        outInst.posY = surface.height + uniforms.bottomOffset;
        outInst.posZ = gz;
        outInst.scaleY = hScale;
        outInst.scaleXZ = sScale;
        outInst.packedBounding = pack2x16float(vec2<f32>(centerOffsetY, boundRadius));
        outInst.packedQuat = pack4x8snorm(canonicalQuat);
        outInst.packedGroundColorAndType = packGroundColorAndType(groundColor, uniforms.typeId);

        rawInstances[currentTargetIdx] = outInst;
    }
}
