struct GrassInstance {
    posX: f32,
    posY: f32,
    posZ: f32,
    rotationY: f32,
    scaleXZ: f32,
    scaleY: f32,
    packedNormal: u32,
    packedGroundColor: u32,
};

struct GrassGlobalUniforms {
    cameraPosition: vec4<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    totalInstances: u32,
    typeCount: u32,
    _pad0: u32,
    _pad1: u32,
};

struct GrassTypeParam {
    cullingDistance: f32,
    fadeStartDistance: f32,
    shrinkStartDistance: f32,
    bottomOffset: f32,
    groundBlendStrength: f32,
    meshHeight: f32,
    rawBaseOffset: u32,
    activeCount: u32,
    culledBaseOffset: u32,
    indirectBaseOffset: u32,
    lodCount: u32,
    maxInstancesPerLod: u32,
    lodDistance0: f32,
    lodDistance1: f32,
    lodDistance2: f32,
    lodDistance3: f32,
    minSlopeTan2: f32,
    maxSlopeTan2: f32,
    hasSlopeFilter: u32,
    _pad0: f32,
};

@group(0) @binding(0) var<storage, read> rawInstances: array<GrassInstance>;
@group(0) @binding(1) var<uniform> globalUniforms: GrassGlobalUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<GrassTypeParam>;
@group(0) @binding(3) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(4) var<storage, read_write> indirectArgs: array<atomic<u32>>;

@compute @workgroup_size(64, 1, 1)
fn main(@builtin(global_invocation_id) globalId: vec3<u32>) {
    let index = globalId.x;
    if (index >= globalUniforms.totalInstances) {
        return;
    }

    var typeId = 0u;
    var found = false;
    for (var t = 0u; t < globalUniforms.typeCount; t = t + 1u) {
        let tp = typeParams[t];
        if (index >= tp.rawBaseOffset && index < (tp.rawBaseOffset + tp.activeCount)) {
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

    var targetLod = 0u;
    if (typeInfo.lodCount > 1u) {
        if (distToCam > typeInfo.lodDistance0) { targetLod = 1u; }
        if (typeInfo.lodCount > 2u && distToCam > typeInfo.lodDistance1) { targetLod = 2u; }
        if (typeInfo.lodCount > 3u && distToCam > typeInfo.lodDistance2) { targetLod = 3u; }
    }

    let scaleXZ = instance.scaleXZ;
    let radius = max(0.8, scaleXZ * 1.2);

    let worldPos = vec3<f32>(instance.posX, instance.posY + radius * 0.5, instance.posZ);
    var inside = true;
    for (var p = 0u; p < 6u; p = p + 1u) {
        let plane = globalUniforms.frustumPlanes[p];
        let planeLenSq = dot(plane.xyz, plane.xyz);
        if (planeLenSq > 0.1) {
            let distToPlane = dot(plane.xyz, worldPos) + plane.w;
            if (distToPlane < -radius) {
                inside = false;
                break;
            }
        }
    }
    if (!inside) {
        return;
    }

    let indirectArgIndex = (typeInfo.indirectBaseOffset + targetLod) * 5u + 1u;
    let slot = atomicAdd(&indirectArgs[indirectArgIndex], 1u);
    let culledIndex = typeInfo.culledBaseOffset + (targetLod * typeInfo.maxInstancesPerLod) + slot;

    culledInstances[culledIndex] = instance;
}
