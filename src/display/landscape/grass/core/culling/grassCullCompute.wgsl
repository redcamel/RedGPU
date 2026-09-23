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

struct GrassGlobalUniforms {
    cameraPosition: vec4<f32>,
    frustumPlanes: array<vec4<f32>, 6>,
    viewProjectionMatrix: mat4x4<f32>,
    totalInstances: u32,
    typeCount: u32,
    hzbEnabled: u32,
    depthBias: f32,
    hzbWidth: f32,
    hzbHeight: f32,
    _pad0: f32,
    _pad1: f32,
};

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

@group(0) @binding(0) var<storage, read> rawInstances: array<GrassInstance>;
@group(0) @binding(1) var<uniform> globalUniforms: GrassGlobalUniforms;
@group(0) @binding(2) var<storage, read> typeParams: array<GrassTypeParam>;
@group(0) @binding(3) var<storage, read_write> culledInstances: array<GrassInstance>;
@group(0) @binding(4) var<storage, read_write> indirectArgs: array<atomic<u32>>;
@group(0) @binding(5) var hzbTexture: texture_2d<f32>;

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

    // [KO] 베이킹된 사전 계산 바운딩 구 (중심 Y 오프셋 및 반지름) 언패킹
    // [EN] Unpack precomputed bounding sphere (center Y offset & radius) from bake pass
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

    // 🌿 [Hierarchical Z-Buffer] 지형 차폐 오클루전 컬링 (Conservative Occlusion Culling)
    if (globalUniforms.hzbEnabled != 0u) {
        let clipPos = globalUniforms.viewProjectionMatrix * vec4<f32>(sphereCenter, 1.0);
        let clipW = clipPos.w;

        if (clipW > 0.1) {
            let invW = 1.0 / clipW;
            let ndc = clipPos.xyz * invW;
            let screenUV = vec2<f32>(ndc.x * 0.5 + 0.5, 1.0 - (ndc.y * 0.5 + 0.5));

            if (screenUV.x >= 0.0 && screenUV.x <= 1.0 && screenUV.y >= 0.0 && screenUV.y <= 1.0) {
                let projRadiusX = (radius * invW) * abs(globalUniforms.viewProjectionMatrix[0][0]);
                let projRadiusY = (radius * invW) * abs(globalUniforms.viewProjectionMatrix[1][1]);
                let maxPixelSize = max(projRadiusX * globalUniforms.hzbWidth, projRadiusY * globalUniforms.hzbHeight) * 2.0;

                // 텍셀 커버리지를 안전하게 포괄하도록 Mip Level 계산 (+1u 보수적 확장으로 아티팩트 방지)
                let mipLevel = clamp(u32(ceil(log2(max(1.0, maxPixelSize)))) + 1u, 0u, 7u);
                let mipWidth = max(1, i32(globalUniforms.hzbWidth) >> mipLevel);
                let mipHeight = max(1, i32(globalUniforms.hzbHeight) >> mipLevel);

                let coord = clamp(
                    vec2<i32>(i32(screenUV.x * f32(mipWidth)), i32(screenUV.y * f32(mipHeight))),
                    vec2<i32>(0, 0),
                    vec2<i32>(mipWidth - 1, mipHeight - 1)
                );

                let hzbDepth = textureLoad(hzbTexture, coord, i32(mipLevel)).r;
                let sphereNearDepth = ndc.z - (radius * invW);

                if (sphereNearDepth > (hzbDepth + globalUniforms.depthBias)) {
                    return;
                }
            }
        }
    }

    let indirectArgIndex = (typeInfo.indirectBaseOffset + targetLod) * 5u + 1u;
    let slot = atomicAdd(&indirectArgs[indirectArgIndex], 1u);
    let culledIndex = typeInfo.culledBaseOffset + (targetLod * typeInfo.maxInstancesPerLod) + slot;

    culledInstances[culledIndex] = instance;
}
