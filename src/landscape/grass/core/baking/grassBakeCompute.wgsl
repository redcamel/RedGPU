struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    packedScale: u32,
    packedBounding: u32,
    packedQuat: u32,
    packedGroundColor: u32,
};

fn rotateVectorByQuat(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

struct GrassTypeParam {
    cullingDistance: f32,
    bottomOffset: f32,
    meshHeight: f32,
    minSlopeTan2: f32,
    maxSlopeTan2: f32,
    hasSlopeFilter: u32,
    rawBaseOffset: u32,
    activeCount: u32,
    culledBaseOffset: u32,
    indirectBaseOffset: u32,
    lodCount: u32,
    maxInstancesPerLod: u32,
    lodDistance0: f32,
    lodDistance1: f32,
    lodDistance2: f32,
    _pad0: f32,
};

struct BakeUniforms {
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    heightScale: f32,
    totalTasks: u32,
    hasVBT: u32,
    _pad0: f32,
    _pad1: f32,
    _pad2: u32,
};

struct BakeTask {
    instanceIndex: u32,
    typeId: u32,
};

@group(0) @binding(0) var<storage, read_write> rawInstances: array<GrassInstance>;
@group(0) @binding(1) var<uniform> bakeUniforms: BakeUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<GrassTypeParam>;
@group(0) @binding(3) var<storage, read> bakeTasks: array<BakeTask>;
@group(0) @binding(4) var vhtTexture: texture_2d<f32>;
@group(0) @binding(5) var vhtSampler: sampler;
@group(0) @binding(6) var vbtTexture: texture_2d<f32>;
@group(0) @binding(7) var vbtSampler: sampler;

fn quatMultiply(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(
        a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz),
        a.w * b.w - dot(a.xyz, b.xyz)
    );
}

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let taskIdx = globalId.x;
    if (taskIdx >= bakeUniforms.totalTasks) {
        return;
    }

    let task = bakeTasks[taskIdx];
    let instIdx = task.instanceIndex;
    let typeInfo = typeParams[task.typeId];
    let inst = rawInstances[instIdx];

    if (inst.posY < -900000.0) {
        return;
    }

    var scaleXZ: f32;
    var scaleY: f32;

    if (inst.packedQuat == 0u) {
        scaleXZ = bitcast<f32>(inst.packedScale);
        scaleY = bitcast<f32>(inst.packedBounding);
    } else {
        let scales = unpack2x16float(inst.packedScale);
        scaleXZ = scales.x;
        scaleY = scales.y;
    }

    let u = inst.posX * bakeUniforms.invWorldSizeX + 0.5;
    let v = inst.posZ * bakeUniforms.invWorldSizeZ + 0.5;
    if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
        rawInstances[instIdx].posY = -999999.0;
        return;
    }

    let texDims = vec2<f32>(textureDimensions(vhtTexture, 0));
    let maxCoord = vec2<i32>(texDims) - vec2<i32>(1);

    let fCoordX = clamp(u * texDims.x, 0.0, texDims.x - 1.0001);
    let fCoordZ = clamp(v * texDims.y, 0.0, texDims.y - 1.0001);

    let cellX = i32(floor(fCoordX));
    let cellZ = i32(floor(fCoordZ));
    let fracX = fCoordX - f32(cellX);
    let fracZ = fCoordZ - f32(cellZ);

    let c00 = vec2<i32>(cellX, cellZ);
    let c10 = min(c00 + vec2<i32>(1, 0), maxCoord);
    let c01 = min(c00 + vec2<i32>(0, 1), maxCoord);
    let c11 = min(c00 + vec2<i32>(1, 1), maxCoord);

    let h00 = textureLoad(vhtTexture, c00, 0).r * bakeUniforms.heightScale;
    let h10 = textureLoad(vhtTexture, c10, 0).r * bakeUniforms.heightScale;
    let h01 = textureLoad(vhtTexture, c01, 0).r * bakeUniforms.heightScale;
    let h11 = textureLoad(vhtTexture, c11, 0).r * bakeUniforms.heightScale;

    let texStepX = select(1.0, 1.0 / (bakeUniforms.invWorldSizeX * texDims.x), bakeUniforms.invWorldSizeX > 0.0);
    let texStepZ = select(1.0, 1.0 / (bakeUniforms.invWorldSizeZ * texDims.y), bakeUniforms.invWorldSizeZ > 0.0);

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

    let slopeTan2 = rawNx * rawNx + rawNz * rawNz;
    if (typeInfo.hasSlopeFilter != 0u && (slopeTan2 < typeInfo.minSlopeTan2 || slopeTan2 > typeInfo.maxSlopeTan2)) {
        rawInstances[instIdx].posY = -999999.0;
        return;
    }

    let terrainN = normalize(vec3<f32>(rawNx, 1.0, rawNz));
    let blendedN = normalize(mix(vec3<f32>(0.0, 1.0, 0.0), terrainN, 0.25));

    let bakedY = terrainHeight + typeInfo.bottomOffset;
    rawInstances[instIdx].posY = bakedY;

    let halfRotY = inst.rotationY * 0.5;
    let qY = vec4<f32>(0.0, sin(halfRotY), 0.0, cos(halfRotY));

    let rotAxis = vec3<f32>(blendedN.z, 0.0, -blendedN.x);
    let qTerrain = normalize(vec4<f32>(rotAxis.x, rotAxis.y, rotAxis.z, 1.0 + blendedN.y));

    let finalQuat = normalize(quatMultiply(qTerrain, qY));
    let canonicalQuat = select(-finalQuat, finalQuat, finalQuat.w >= 0.0);
    rawInstances[instIdx].packedQuat = pack4x8snorm(canonicalQuat);

    let baseH = max(0.01, typeInfo.meshHeight) * scaleY;
    let halfH = baseH * 0.5;
    let localCenter = rotateVectorByQuat(vec3<f32>(0.0, halfH, 0.0), canonicalQuat);
    let centerOffsetY = max(0.05, localCenter.y);

    let maxXZ = scaleXZ;
    let rawRadius = sqrt(halfH * halfH + maxXZ * maxXZ);
    let boundRadius = rawRadius * 1.25;

    rawInstances[instIdx].packedScale = pack2x16float(vec2<f32>(scaleXZ, scaleY));
    rawInstances[instIdx].packedBounding = pack2x16float(vec2<f32>(centerOffsetY, boundRadius));

    var groundColor = vec3<f32>(0.0);
    if (bakeUniforms.hasVBT != 0u) {
        let groundTex = textureSampleLevel(vbtTexture, vbtSampler, vec2<f32>(u, v), 0.0);
        if (groundTex.a > 0.1) {
            groundColor = groundTex.rgb;
        }
    }

    rawInstances[instIdx].packedGroundColor = pack4x8unorm(vec4<f32>(groundColor, 1.0));
}
