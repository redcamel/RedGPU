#redgpu_include SYSTEM_UNIFORM;
@group(1) @binding(0) var<storage> clusterLight_Clusters : ClusterLight_Clusters;

fn pointLight_testSphereAABB(light:u32,  tile:u32) -> bool {
   // 라이트와 타일의 정보를 한 번만 획득합니다.
   let targetLight = clusterLightList.lights[light];
   let targetTile = clusterLight_Clusters.cubeList[tile];

   // 라이트의 반지름과 위치를 획득하고, 위치는 World Space에서 View3D Space로 변환합니다.
   let radius:f32 = targetLight.radius;
   let position:vec3<f32> = targetLight.position;
   let center:vec3<f32> = (systemUniforms.camera.cameraMatrix *  vec4<f32>(position, 1.0)).xyz;

   // AABB와 라이트 사이의 제곱 거리를 계산합니다.
   let squaredDistance:f32 = pointLight_sqDistPointAABB(center, tile, targetTile.minAABB.xyz, targetTile.maxAABB.xyz);

   return squaredDistance <= (radius * radius);
}

fn pointLight_sqDistPointAABB(targetPoint:vec3<f32>, tile:u32, minAABB:vec3<f32>, maxAABB:vec3<f32>) -> f32 {
    var sqDist = 0.0;
    for(var i = 0u; i < 3u; i = i + 1u) {
      // 해당 축에 대한 좌표를 하나씩 확인합니다.
      let v = targetPoint[i];
      let _minAABB = minAABB[i];
      let _maxAABB = maxAABB[i];

      if(v < _minAABB){
        sqDist +=  (_minAABB - v) * (_minAABB - v);
      }
      if(v > _maxAABB){
        sqDist += (v - _maxAABB) * (v - _maxAABB);
      }
    }

    return sqDist;
}
// 스폿라이트용 구체-AABB 거리 체크 (포인트라이트와 동일)
fn spotLight_testSphereAABB(light: u32, tile: u32) -> bool {
    let targetLight = clusterLightList.lights[light];
    let targetTile = clusterLight_Clusters.cubeList[tile];

    let radius: f32 = targetLight.radius;
    let position: vec3<f32> = targetLight.position;
    let center: vec3<f32> = (systemUniforms.camera.cameraMatrix * vec4<f32>(position, 1.0)).xyz;

    // 포인트라이트와 똑같은 거리 계산
    let squaredDistance: f32 = pointLight_sqDistPointAABB(center, tile, targetTile.minAABB.xyz, targetTile.maxAABB.xyz);

    return squaredDistance <= (radius * radius);
}


@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X,REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    let tileIndex = global_id.x +
                    global_id.y * clusterLight_tileCount.x +
                    global_id.z * clusterLight_tileCount.x * clusterLight_tileCount.y;

    var clusterLightCount = 0u;
    var clusterLightIndices : array<u32, REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu>;

    // 포인트 라이트 처리
    for (var i = 0u; i < u32(clusterLightList.count[0]); i = i + 1u) {
        let lightInCluster = pointLight_testSphereAABB(i, tileIndex);

        if (lightInCluster) {
            clusterLightIndices[clusterLightCount] = i;
            clusterLightCount = clusterLightCount + 1u;
        }

        if (clusterLightCount == REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu) {
            break;
        }
    }

    // 스폿 라이트 처리
    let spotLightStartIndex = u32(clusterLightList.count[0]);
    for (var i = 0u; i < u32(clusterLightList.count[1]); i = i + 1u) {
        let actualLightIndex = spotLightStartIndex + i;

        // 포인트라이트와 동일한 방식
        let sphereTest = spotLight_testSphereAABB(actualLightIndex, tileIndex);

        if (sphereTest) {
            clusterLightIndices[clusterLightCount] = actualLightIndex;
            clusterLightCount = clusterLightCount + 1u;
        }

        if (clusterLightCount == REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu) {
            break;
        }
    }

    var offset = atomicAdd(&clusterLightGroup.offset, clusterLightCount);

    for(var i = 0u; i < clusterLightCount; i = i + 1u) {
        clusterLightGroup.indices[offset + i] = clusterLightIndices[i];
    }

    clusterLightGroup.lights[tileIndex].offset = offset;
    clusterLightGroup.lights[tileIndex].count = clusterLightCount;
}
