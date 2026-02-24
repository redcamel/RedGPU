#redgpu_include SYSTEM_UNIFORM;

@group(1) @binding(0) var<storage, read_write> clusterLight_Clusters : ClusterLight_Clusters;

/**
 * [KO] 선과 Z 평면의 교점을 계산합니다.
 * [EN] Calculates the intersection of a line and a Z-plane.
 */
fn lineIntersectionToZPlane(a : vec3<f32>, b : vec3<f32>, zDistance : f32) -> vec3<f32> {
    let normal = vec3<f32>(0.0, 0.0, 0.5);
    let ab = b - a;
    let t = (zDistance - dot(normal, a)) / dot(normal, ab);
    return a + t * ab;
}

/**
 * [KO] 클립 공간 좌표를 뷰 공간으로 변환합니다.
 * [EN] Converts clip space coordinates to view space.
 */
fn clipToView(clip : vec4<f32>) -> vec4<f32> {
    let view = systemUniforms.projection.inverseProjectionMatrix * clip;
    return view / vec4<f32>(view.w, view.w, view.w, view.w);
}

/**
 * [KO] 스크린 공간 좌표를 뷰 공간으로 변환합니다.
 * [EN] Converts screen space coordinates to view space.
 */
fn screen2View(screen : vec4<f32>) -> vec4<f32> {
    let texCoord = screen.xy / systemUniforms.resolution.xy;
    let clip = vec4<f32>(vec2<f32>(texCoord.x, 1.0 - texCoord.y) * 2.0 - vec2<f32>(1.0, 1.0), screen.z, screen.w );
    return clipToView(clip);
}

const eyePos = vec3<f32>(0.0);

@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X, REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)
/**
 * [KO] 클러스터 라이트 바운드(AABB) 계산을 위한 메인 엔트리 포인트입니다.
 * [EN] Main entry point for calculating cluster light bounds (AABB).
 */
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    // [KO] 전역 호출 ID를 기반으로 현재 타일 인덱스를 계산합니다.
    // [EN] Calculates the current tile index based on the global invocation ID.
    let tileIndex = global_id.x +
                    global_id.y * clusterLight_tileCount.x +
                    global_id.z * clusterLight_tileCount.x * clusterLight_tileCount.y;

    // [KO] 타일의 크기를 계산합니다.
    // [EN] Calculates the size of the tile.
    let tileSize = vec2<f32>(
              systemUniforms.resolution.x / f32(clusterLight_tileCount.x),
              systemUniforms.resolution.y / f32(clusterLight_tileCount.y)
          );

    // [KO] 스크린 공간(Screen-Space)의 최댓값 및 최솟값 좌표를 계산하고 뷰 공간(View Space)으로 변환합니다.
    // [EN] Calculates min/max coordinates in screen-space and converts them to view space.
    let global_id_x_pos_one = vec2<f32>(f32(global_id.x + 1u), f32(global_id.y + 1u)) * tileSize;
    let global_id_x_y = vec2<f32>(f32(global_id.x), f32(global_id.y)) * tileSize;

    let maxPoint_sS = vec4<f32>(global_id_x_pos_one, 0.0, 1.0);
    let minPoint_sS = vec4<f32>(global_id_x_y, 0.0, 1.0);

    let maxPoint_vS = screen2View(maxPoint_sS).xyz;
    let minPoint_vS = screen2View(minPoint_sS).xyz;

    // [KO] 타일의 Z 인덱스에 기반하여 Near와 Far의 Z 평면을 계산합니다.
    // [EN] Calculates the Near and Far Z-planes based on the tile's Z-index.
    let nearFarX = systemUniforms.camera.nearClipping;
    let nearFarY = systemUniforms.camera.farClipping;

    let tileZ = f32(global_id.z) / f32(clusterLight_tileCount.z);
    let tileZ_plus_one = f32(global_id.z + 1u) / f32(clusterLight_tileCount.z);

    let tileNear = -nearFarX * pow(nearFarY / nearFarX, tileZ);
    let tileFar = -nearFarX * pow(nearFarY / nearFarX, tileZ_plus_one);

    // [KO] 뷰 공간(View Space) 광선들과 Near/Far Z 평면의 교점을 계산합니다.
    // [EN] Calculates the intersection points of view space rays with Near/Far Z-planes.
    let minPointNear = lineIntersectionToZPlane(eyePos, minPoint_vS, tileNear);
    let minPointFar = lineIntersectionToZPlane(eyePos, minPoint_vS, tileFar);
    let maxPointNear = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileNear);
    let maxPointFar = lineIntersectionToZPlane(eyePos, maxPoint_vS, tileFar);

    // [KO] AABB(Axis-Aligned Bounding Box)의 최솟값 및 최댓값 좌표를 설정합니다.
    // [EN] Sets the min and max coordinates of the AABB (Axis-Aligned Bounding Box).
    let minAABB = min(min(minPointNear, minPointFar), min(maxPointNear, maxPointFar));
    let maxAABB = max(max(minPointNear, minPointFar), max(maxPointNear, maxPointFar));

    clusterLight_Clusters.cubeList[tileIndex].minAABB = vec4<f32>(minAABB, 0.0);
    clusterLight_Clusters.cubeList[tileIndex].maxAABB = vec4<f32>(maxAABB, 0.0);
}
