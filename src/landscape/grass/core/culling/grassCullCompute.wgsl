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

struct GrassCullingUniforms {
    cameraPosition: vec4<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    totalInstanceCount: u32,
    typeCount: u32,
    pad0: u32,
    pad1: u32,
};

struct GrassTypeParam {
    cullingDistance: f32,
    bottomOffset: f32,
    meshHeight: f32,
    minSlopeTan2: f32,
    maxSlopeTan2: f32,
    hasSlopeFilter: u32,
    rawBaseOffset: u32,
    instanceCount: u32,
    culledBaseOffset: u32,
    indirectBaseOffset: u32,
    stageCount: u32,
    maxInstancesPerStage: u32,
    farDistance: f32,
    stageDistance1: f32,
    stageDistance2: f32,
    subMeshCount: u32,
};

@group(0) @binding(0) var<storage, read> rawInstances: array<GrassInstance>;
@group(0) @binding(1) var<uniform> globalUniforms: GrassCullingUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<GrassTypeParam>;
@group(0) @binding(3) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(4) var<storage, read_write> indirectCommands: array<atomic<u32>>;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let index = globalId.x;
    if (index >= globalUniforms.totalInstanceCount) {
        return;
    }

    var typeId = 0u;
    var found = false;
    for (var t = 0u; t < globalUniforms.typeCount; t = t + 1u) {
        let tp = typeParams[t];
        if (index >= tp.rawBaseOffset && index < (tp.rawBaseOffset + tp.instanceCount)) {
            typeId = t;
            found = true;
            break;
        }
    }
    if (!found) {
        return;
    }

    let typeInfo = typeParams[typeId];
    let instance = rawInstances[index];

    if (instance.posY < -900000.0) {
        return;
    }

    let camPos = globalUniforms.cameraPosition.xyz;
    let dx = instance.posX - camPos.x;
    let dz = instance.posZ - camPos.z;
    let horizontalDistSq = dx * dx + dz * dz;

    let cullDist = typeInfo.cullingDistance;
    if (horizontalDistSq >= cullDist * cullDist) {
        return;
    }

    let distToCam = sqrt(horizontalDistSq);

    var drawSlot = 0u;
    if (typeInfo.stageCount > 1u && distToCam > typeInfo.farDistance) {
        drawSlot = 1u;
    }

    let bounds = unpack2x16float(instance.packedBounding);
    let centerOffsetY = bounds.x;
    let radius = bounds.y;

    let sphereCenter = vec3<f32>(instance.posX, instance.posY + centerOffsetY, instance.posZ);
    var inside = true;
    for (var p = 0u; p < 6u; p = p + 1u) {
        let plane = globalUniforms.frustumPlanes[p];
        let planeLenSq = dot(plane.xyz, plane.xyz);
        if (planeLenSq > 0.1) {
            let distToPlane = dot(plane.xyz, sphereCenter) + plane.w;
            if (distToPlane < -radius) {
                inside = false;
                break;
            }
        }
    }
    if (!inside) {
        return;
    }

    let numSubs = max(typeInfo.subMeshCount, 1u);
    let stageIndirectStart = typeInfo.indirectBaseOffset + (drawSlot * numSubs);

    let firstIndirectArgIndex = stageIndirectStart * 5u + 1u;
    let slot = atomicAdd(&indirectCommands[firstIndirectArgIndex], 1u);

    for (var s = 1u; s < numSubs; s = s + 1u) {
        let subIndirectArgIndex = (stageIndirectStart + s) * 5u + 1u;
        atomicAdd(&indirectCommands[subIndirectArgIndex], 1u);
    }

    let culledIndex = typeInfo.culledBaseOffset + (drawSlot * typeInfo.maxInstancesPerStage) + slot;
    culledInstances[culledIndex] = instance;
}
