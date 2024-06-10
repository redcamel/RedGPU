#REDGPU_DEFINE_SYSTEM_UNIFORMS
@group(1) @binding(0) var<storage, read_write> pointLight_Clusters : PointLight_Clusters;

fn lineIntersectionToZPlane(a : vec3<f32>, b : vec3<f32>, zDistance : f32) -> vec3<f32> {
    let normal = vec3<f32>(0.0, 0.0, 0.5);
    let ab = b - a;
    let t = (zDistance - dot(normal, a)) / dot(normal, ab);
    return a + t * ab;
}

fn clipToView(clip : vec4<f32>) -> vec4<f32> {
    let view = systemUniforms.inverseProjectionMatrix * clip;
    return view / vec4<f32>(view.w, view.w, view.w, view.w);
}

fn screen2View(screen : vec4<f32>) -> vec4<f32> {
    let texCoord = screen.xy / systemUniforms.resolution.xy;
    let clip = vec4<f32>(vec2<f32>(texCoord.x, 1.0 - texCoord.y) * 2.0 - vec2<f32>(1.0, 1.0), screen.z, screen.w );
    return clipToView(clip);
}

const eyePos = vec3<f32>(0.0);

@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X,REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)

fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    // 전역 호출 ID에 기반한 현재 타일 인덱스를 계산합니다.
    let tileIndex = global_id.x +
                    global_id.y * pointLight_tileCount.x +
                    global_id.z * pointLight_tileCount.x * pointLight_tileCount.y;

    // 타일의 크기를 계산합니다.
    let tileSize = vec2<f32>(
              systemUniforms.resolution.x / f32(pointLight_tileCount.x),
              systemUniforms.resolution.y / f32(pointLight_tileCount.y)
          );

    // 스크린 공간(Screen-Space)의 최대와 최소 좌표를 계산하고 View Space로 변환합니다.
    let global_id_x_pos_one = vec2<f32>(f32(global_id.x + 1u), f32(global_id.y + 1u)) * tileSize;
    let global_id_x_y = vec2<f32>(f32(global_id.x), f32(global_id.y)) * tileSize;

    let maxPoint_sS = vec4<f32>(global_id_x_pos_one, 0.0, 1.0);
    let minPoint_sS = vec4<f32>(global_id_x_y, 0.0, 1.0);

    let maxPoint_vS = screen2View(maxPoint_sS).xyz;
    let minPoint_vS = screen2View(minPoint_sS).xyz;

    // 전역 Z 인덱스에 기반하여 Near 와 Far의 Z 평면을 계산합니다.
    let nearFarX = systemUniforms.nearFar.x;
    let nearFarY = systemUniforms.nearFar.y;

    let tileZ = f32(global_id.z) / f32(pointLight_tileCount.z);
    let tileZ_plus_one = f32(global_id.z + 1u) / f32(pointLight_tileCount.z);

    let tileNear = -nearFarX * pow(nearFarY / nearFarX, tileZ);
    let tileFar = -nearFarX * pow(nearFarY / nearFarX, tileZ_plus_one);

    // View Space의 선들과 Near 와 Far의 Z 평면의 교점을 계산합니다.
    let minPointNear = lineIntersectionToZPlane(eyePos, minPoint_vS, tileNear);
    let minPointFar = lineIntersectionToZPlane(eyePos, minPoint_vS, tileFar);
    let maxPointNear = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileNear);
    let maxPointFar = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileFar);

    // AABB(Axis-Aligned Bounding Box)의 최소 및 최대 좌표를 저장합니다.
    let minAABB = min(min(minPointNear, minPointFar), min(maxPointNear, maxPointFar));
    let maxAABB = max(max(minPointNear, minPointFar), max(maxPointNear, maxPointFar));

    pointLight_Clusters.cubeList[tileIndex].minAABB = vec4<f32>(minAABB, 0.0);
    pointLight_Clusters.cubeList[tileIndex].maxAABB = vec4<f32>(maxAABB, 0.0);
}
