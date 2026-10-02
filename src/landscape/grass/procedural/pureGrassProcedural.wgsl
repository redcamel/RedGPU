// ============================================================================
// Pure GPU Procedural Grass Compute Shader
// - Single-pass procedural generation + terrain snap + culling + indirect draw
// - Deterministic world-space spatial hash (Zero-Jittering on camera motion)
// ============================================================================

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

struct ProceduralUniforms {
    cameraPosition: vec4<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    worldOriginMin: vec2<f32>,     // Virtual grid min (x, z)
    gridDimension: vec2<u32>,      // Grid columns and rows count
    spacing: f32,                  // Grid spacing (meters)
    cullingDistance: f32,          // Max visibility radius
    invWorldSizeX: f32,
    invWorldSizeZ: f32,
    heightScale: f32,
    farDistance: f32,              // Distance for stage 1 (LOD billboard/simplified)
    stageCount: u32,
    subMeshCount: u32,
    typeId: u32,
    minSlopeTan2: f32,
    maxSlopeTan2: f32,
    hasSlopeFilter: u32,
    minScaleS: f32,
    maxScaleS: f32,
    minScaleH: f32,
    maxScaleH: f32,
    densityThreshold: f32,
    hasWeightMap: u32,
    weightChannelIdx: u32,
    maxInstancesPerStage: u32,
};

@group(0) @binding(0) var<uniform> uniforms: ProceduralUniforms;
@group(0) @binding(1) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(2) var<storage, read_write> indirectCommands: array<atomic<u32>>;
@group(0) @binding(3) var vhtTexture: texture_2d<f32>;
@group(0) @binding(4) var vbtTexture: texture_2d<f32>;
@group(0) @binding(5) var vbtSampler: sampler;

// Deterministic 32-bit Integer Hash (Murmur3 / Xorshift hybrid)
fn hash2D(x: i32, z: i32, seed: u32) -> u32 {
    var h = (u32(x) * 73856093u) ^ (u32(z) * 19349663u) ^ (seed * 83492791u);
    h = (h ^ (h >> 16u)) * 0x45d9f3bu;
    h = (h ^ (h >> 16u)) * 0x45d9f3bu;
    h = h ^ (h >> 16u);
    return select(h, 0x9e3779b9u, h == 0u);
}

// Convert 32-bit uint hash to uniform float in range [0.0, 1.0)
fn hashToFloat(h: u32) -> f32 {
    return f32(h & 0x00FFFFFFu) / 16777216.0;
}

fn rotateVectorByQuat(v: vec3<f32>, q: vec4<f32>) -> vec3<f32> {
    return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);
}

fn quatMultiply(a: vec4<f32>, b: vec4<f32>) -> vec4<f32> {
    return vec4<f32>(
        a.w * b.xyz + b.w * a.xyz + cross(a.xyz, b.xyz),
        a.w * b.w - dot(a.xyz, b.xyz)
    );
}

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let index = globalId.x;
    let totalGridCells = uniforms.gridDimension.x * uniforms.gridDimension.y;
    if (index >= totalGridCells) {
        return;
    }

    let gridCol = index % uniforms.gridDimension.x;
    let gridRow = index / uniforms.gridDimension.x;

    let worldBaseX = uniforms.worldOriginMin.x + f32(gridCol) * uniforms.spacing;
    let worldBaseZ = uniforms.worldOriginMin.y + f32(gridRow) * uniforms.spacing;

    // 1. World-Space Deterministic PRNG
    let cellCoordX = i32(floor(worldBaseX / uniforms.spacing));
    let cellCoordZ = i32(floor(worldBaseZ / uniforms.spacing));
    let seed1 = hash2D(cellCoordX, cellCoordZ, uniforms.typeId);
    let seed2 = hash2D(cellCoordX, cellCoordZ, seed1);
    let seed3 = hash2D(cellCoordX, cellCoordZ, seed2);
    let seed4 = hash2D(cellCoordX, cellCoordZ, seed3);

    // Subtle random position jitter within virtual cell
    let offsetX = (hashToFloat(seed1) - 0.5) * uniforms.spacing;
    let offsetZ = (hashToFloat(seed2) - 0.5) * uniforms.spacing;
    let posX = worldBaseX + offsetX;
    let posZ = worldBaseZ + offsetZ;

    // 2. Horizontal Distance & Culling
    let camPos = uniforms.cameraPosition.xyz;
    let dx = posX - camPos.x;
    let dz = posZ - camPos.z;
    let horizontalDistSq = dx * dx + dz * dz;
    let cullDist = uniforms.cullingDistance;
    if (horizontalDistSq >= cullDist * cullDist) {
        return;
    }
    let distToCam = sqrt(horizontalDistSq);

    // 3. Terrain Height & Normal Sampling (GPU Hardware accelerated)
    let u = posX * uniforms.invWorldSizeX + 0.5;
    let v = posZ * uniforms.invWorldSizeZ + 0.5;
    if (u < 0.0 || u > 1.0 || v < 0.0 || v > 1.0) {
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

    let h00 = textureLoad(vhtTexture, c00, 0).r * uniforms.heightScale;
    let h10 = textureLoad(vhtTexture, c10, 0).r * uniforms.heightScale;
    let h01 = textureLoad(vhtTexture, c01, 0).r * uniforms.heightScale;
    let h11 = textureLoad(vhtTexture, c11, 0).r * uniforms.heightScale;

    let texStepX = select(1.0, 1.0 / (uniforms.invWorldSizeX * texDims.x), uniforms.invWorldSizeX > 0.0);
    let texStepZ = select(1.0, 1.0 / (uniforms.invWorldSizeZ * texDims.y), uniforms.invWorldSizeZ > 0.0);

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

    // 4. Slope Filtering
    let slopeTan2 = rawNx * rawNx + rawNz * rawNz;
    if (uniforms.hasSlopeFilter != 0u && (slopeTan2 < uniforms.minSlopeTan2 || slopeTan2 > uniforms.maxSlopeTan2)) {
        return;
    }

    // 5. WeightMap (Density) Filtering
    if (uniforms.hasWeightMap != 0u) {
        let weightSample = textureSampleLevel(vbtTexture, vbtSampler, vec2<f32>(u, v), 0.0);
        var normW = 0.0;
        if (uniforms.weightChannelIdx == 0u) { normW = weightSample.r; }
        else if (uniforms.weightChannelIdx == 1u) { normW = weightSample.g; }
        else if (uniforms.weightChannelIdx == 2u) { normW = weightSample.b; }
        else { normW = weightSample.a; }

        if (normW < uniforms.densityThreshold) {
            return;
        }
        if (hashToFloat(seed4) > normW) {
            return;
        }
    }

    // 6. Scale and Rotation
    let rot = hashToFloat(seed3) * 6.2831853;
    let sScale = uniforms.minScaleS + hashToFloat(seed1) * (uniforms.maxScaleS - uniforms.minScaleS);
    let hScale = uniforms.minScaleH + hashToFloat(seed2) * (uniforms.maxScaleH - uniforms.minScaleH);

    // 7. Surface Normal Alignment Quaternion
    var N = normalize(vec3<f32>(rawNx, 1.0, rawNz));
    let up = vec3<f32>(0.0, 1.0, 0.0);
    var quat = vec4<f32>(0.0, 0.0, 0.0, 1.0);
    let d = dot(up, N);
    if (d < 0.9999) {
        let axis = normalize(cross(up, N));
        let angle = acos(clamp(d, -1.0, 1.0));
        let halfA = angle * 0.5;
        let s = sin(halfA);
        quat = vec4<f32>(axis.x * s, axis.y * s, axis.z * s, cos(halfA));
    }

    // 8. Frustum Culling
    let sphereRadius = max(sScale, hScale) * 1.5;
    let sphereCenter = vec3<f32>(posX, terrainHeight + hScale * 0.5, posZ);
    var inside = true;
    for (var p = 0u; p < 6u; p = p + 1u) {
        let plane = uniforms.frustumPlanes[p];
        let planeLenSq = dot(plane.xyz, plane.xyz);
        if (planeLenSq > 0.1) {
            let distToPlane = dot(plane.xyz, sphereCenter) + plane.w;
            if (distToPlane < -sphereRadius) {
                inside = false;
                break;
            }
        }
    }
    if (!inside) {
        return;
    }

    // 9. Stage (LOD) Selection & Indirect Draw Allocation
    var drawSlot = 0u;
    if (uniforms.stageCount > 1u && distToCam > uniforms.farDistance) {
        drawSlot = 1u;
    }

    let numSubs = max(uniforms.subMeshCount, 1u);
    let firstIndirectArgIndex = (drawSlot * numSubs) * 5u + 1u;
    let slot = atomicAdd(&indirectCommands[firstIndirectArgIndex], 1u);

    for (var s = 1u; s < numSubs; s = s + 1u) {
        let subIndirectArgIndex = ((drawSlot * numSubs) + s) * 5u + 1u;
        atomicAdd(&indirectCommands[subIndirectArgIndex], 1u);
    }

    if (slot >= uniforms.maxInstancesPerStage) {
        return;
    }

    // 10. Store Culled/Baked Instance Directly to Render Buffer
    var outInst: GrassInstance;
    outInst.posX = posX;
    outInst.posY = terrainHeight;
    outInst.posZ = posZ;
    outInst.rotationY = rot;
    outInst.packedScale = pack2x16float(vec2<f32>(sScale, hScale));
    outInst.packedBounding = pack2x16float(vec2<f32>(hScale * 0.5, sphereRadius));
    outInst.packedQuat = pack2x16snorm(quat.xy);
    outInst.packedGroundColor = pack2x16snorm(quat.zw);

    let culledIndex = (drawSlot * uniforms.maxInstancesPerStage) + slot;
    culledInstances[culledIndex] = outInst;
}
