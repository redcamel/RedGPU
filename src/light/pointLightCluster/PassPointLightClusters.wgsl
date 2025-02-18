#redgpu_include SYSTEM_UNIFORM;
@group(1) @binding(0) var<storage> pointLight_Clusters : PointLight_Clusters;

fn pointLight_testSphereAABB(light:u32,  tile:u32) -> bool {
   // 라이트와 타일의 정보를 한 번만 획득합니다.
   let targetLight = pointLightList.lights[light];
   let targetTile = pointLight_Clusters.cubeList[tile];

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
fn spotLight_testConeAABB(light: u32, tile: u32) -> bool {
    let targetLight = pointLightList.lights[light];
    let targetTile = pointLight_Clusters.cubeList[tile];

    let position: vec3<f32> = (systemUniforms.camera.cameraMatrix *  vec4<f32>(targetLight.position, 1.0)).xyz;
let spotlightDirection: vec3<f32> = normalize(
   (systemUniforms.camera.cameraMatrix * vec4<f32>(targetLight.position + vec3<f32>(0,-1,0), 1.0)).xyz - position
);
    let innerCutoffAngle: f32 = radians(25.0);
    let outerCutoffAngle: f32 = radians(26.0);

    let tileMin: vec3<f32> = targetTile.minAABB.xyz;
    let tileMax: vec3<f32> = targetTile.maxAABB.xyz;

    // Create all corners for the AABB
    let corners: array<vec3<f32>, 8> = array<vec3<f32>, 8>(
        tileMin,
        vec3<f32>(tileMax.x, tileMin.y, tileMin.z),
        vec3<f32>(tileMin.x, tileMax.y, tileMin.z),
        vec3<f32>(tileMax.x, tileMax.y, tileMin.z),
        vec3<f32>(tileMin.x, tileMin.y, tileMax.z),
        vec3<f32>(tileMax.x, tileMin.y, tileMax.z),
        vec3<f32>(tileMin.x, tileMax.y, tileMax.z),
        tileMax
    );

    var isCornerInsideCone = false;
    // check against the outer cut-off angle

    // Add AABB centre to the test
    let tileCenter: vec3<f32> = (tileMin + tileMax) * 0.5;

    for (var i: u32 = 0u; i < 9u; i=i+1) {
        var toCorner: vec3<f32> ;
    if(i<8u){
        toCorner =  corners[i] - position;
    }else{
        toCorner =  tileCenter - position;
    }
        var cosOuterCutoffAngle = cos(outerCutoffAngle);
        var dotProduct = dot(normalize(toCorner), spotlightDirection);
        dotProduct = clamp(dotProduct, -1.0, 1.0);

        if(dotProduct >= cosOuterCutoffAngle) {
            isCornerInsideCone = true;
            break;
        }
    }

    return isCornerInsideCone;
}
@compute @workgroup_size(REDGPU_DEFINE_WORKGROUP_SIZE_X,REDGPU_DEFINE_WORKGROUP_SIZE_Y, REDGPU_DEFINE_WORKGROUP_SIZE_Z)
fn main(@builtin(global_invocation_id) global_id : vec3<u32>) {
    // 현재 타일의 인덱스를 계산합니다.
    let tileIndex = global_id.x +
                    global_id.y * pointLight_tileCount.x +
                    global_id.z * pointLight_tileCount.x * pointLight_tileCount.y;
    // 현재 클러스터의 라이트 수를 0으로 초기화합니다.
    var clusterLightCount = 0u;
    // 현재 클러스터의 라이트 인덱스를 담을 배열을 초기화합니다.
    var clusterPointLightIndices : array<u32, REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu>;

    // 각 라이트에 대해 반복합니다.
    for (var i = 0u; i < u32(pointLightList.count[0]); i = i + 1u) {
        // 현재 라이트가 클러스터 내부에 있는지 검사합니다.
        let lightInCluster = pointLight_testSphereAABB(i,tileIndex);

        // 라이트가 클러스터 안에 있다면
        if (lightInCluster) {
            // 라이트 인덱스를 배열에 추가하고
            clusterPointLightIndices[clusterLightCount] = i;
            // 라이트 수를 증가시킵니다.
            clusterLightCount = clusterLightCount + 1u;
        }

        // 라이트의 수가 클러스터의 최대 용량에 도달하면 루프를 종료합니다.
        if (clusterLightCount == REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTERu) {
            break;
        }
    }

    // 현재 클러스터의 라이트들을 전체 라이트 그룹에 추가합니다.
    var offset = atomicAdd(&pointLight_clusterLightGroup.offset, clusterLightCount);

    // 추가된 각 라이트에 대해
    for(var i = 0u; i < clusterLightCount; i = i + 1u) {
        // 그룹에 인덱스를 추가합니다.
        pointLight_clusterLightGroup.indices[offset + i] = clusterPointLightIndices[i];
    }

    // 현재 클러스터의 라이트 정보를 업데이트합니다.
    pointLight_clusterLightGroup.lights[tileIndex].offset = offset;
    pointLight_clusterLightGroup.lights[tileIndex].count = clusterLightCount;
}
