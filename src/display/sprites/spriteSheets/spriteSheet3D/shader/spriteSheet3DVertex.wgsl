#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct VertexUniforms {
    pickingId:u32,
    modelMatrix:mat4x4<f32>,
    normalModelMatrix:mat4x4<f32>,
    useBillboardPerspective:u32,
    useBillboard:u32,
    segmentW:f32,
    segmentH:f32,
    totalFrame:f32,
    currentIndex:f32,
    billboardFixedScale:f32,
    _renderRatioX:f32,
    _renderRatioY:f32,
    combinedOpacity:f32,
};


@group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

struct InputData {
    @location(0) position : vec3<f32>,
    @location(1) vertexNormal : vec3<f32>,
    @location(2) uv : vec2<f32>,
};
struct OutputData {
    @builtin(position) position : vec4<f32>,
    @location(0) vertexPosition: vec3<f32>,
    @location(1) vertexNormal: vec3<f32>,
    @location(2) uv: vec2<f32>,
    @location(12) combinedOpacity: f32,
    @location(13) shadowPos: vec3<f32>,
    @location(15) pickingId: vec4<f32>,
};


@vertex
fn main( inputData:InputData ) -> OutputData {
  var output : OutputData;

  //
  let u_resolution = systemUniforms.resolution;
  let u_projectionMatrix = systemUniforms.projectionMatrix;
  let u_camera = systemUniforms.camera;
  let u_cameraMatrix = u_camera.cameraMatrix;
  let u_cameraPosition = u_camera.cameraPosition;
  //
  let u_modelMatrix = vertexUniforms.modelMatrix;
  let u_normalModelMatrix = vertexUniforms.normalModelMatrix;
//
  let u_useBillboardPerspective = vertexUniforms.useBillboardPerspective;
  let u_useBillboard = vertexUniforms.useBillboard;
  let u_billboardFixedScale = vertexUniforms.billboardFixedScale;
  let u_renderRatioX = vertexUniforms._renderRatioX;
  let u_renderRatioY = vertexUniforms._renderRatioY;
  var ratioScaleMatrix:mat4x4<f32> = mat4x4<f32>(
    u_renderRatioX, 0, 0, 0,
    0, u_renderRatioY, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );


  //
  let input_position = inputData.position;
  let input_vertexNormal = inputData.vertexNormal;
  let input_uv = inputData.uv;

  var position:vec4<f32>;
  var normalPosition:vec4<f32>;

    // Perspective Scaling과 Billboard 처리
    if (u_useBillboard == 1) {
        // 기본 position과 normalPosition 계산
        if(u_useBillboardPerspective == 1){
            position = getBillboardMatrix(u_cameraMatrix , u_modelMatrix) * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
            normalPosition = getBillboardMatrix(u_cameraMatrix , u_normalModelMatrix) * ratioScaleMatrix *vec4<f32>(input_vertexNormal, 1.0);
        }else{
            position = getBillboardMatrix(u_cameraMatrix , u_modelMatrix) * ratioScaleMatrix *vec4<f32>(input_position, 1.0);
            normalPosition = getBillboardMatrix(u_cameraMatrix , u_normalModelMatrix) * ratioScaleMatrix * vec4<f32>(input_vertexNormal, 1.0);
        }

        // View3D-Projection Matrix 곱
        output.position = u_projectionMatrix * position;

        if (u_useBillboardPerspective != 1) {
            // NDC 좌표로 변환
            var temp = output.position / output.position.w;

            // 화면 비율 및 스케일 보정
            let aspectRatio = u_resolution.x / u_resolution.y;
            let scaleX = clamp((u_projectionMatrix)[1][1], -1.0, 1.0) / aspectRatio * u_renderRatioX;
            let scaleY = clamp((u_projectionMatrix)[1][1], -1.0, 1.0) * u_renderRatioY;

            // 위치 조정
            output.position = vec4<f32>(
                temp.xy + input_position.xy * vec2<f32>(scaleX * u_billboardFixedScale, scaleY * u_billboardFixedScale),
                temp.zw
            );
        }
    } else {
        // 일반적인 변환 계산
        position = u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
        normalPosition = u_cameraMatrix * u_normalModelMatrix * ratioScaleMatrix * vec4<f32>(input_vertexNormal, 1.0);

        // View3D-Projection Matrix 곱
        output.position = u_projectionMatrix * position;
    }


  output.vertexPosition = position.xyz;
  output.vertexNormal = normalPosition.xyz;
  output.combinedOpacity = vertexUniforms.combinedOpacity;


  let uv = vec2<f32>(
      input_uv.x * 1 / vertexUniforms.segmentW + ((vertexUniforms.currentIndex % vertexUniforms.segmentW) / vertexUniforms.segmentW),
      input_uv.y * 1 / vertexUniforms.segmentH - (floor(vertexUniforms.currentIndex / vertexUniforms.segmentH) / vertexUniforms.segmentH)
  );

  output.uv = uv;
  return output;
}
struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn drawDirectionalShadowDepth( inputData:InputData ) -> OutputShadowData {
  var output : OutputShadowData;
  //
  let u_directionalLightProjectionViewMatrix = systemUniforms.directionalLightProjectionViewMatrix;
  let u_directionalLightProjectionMatrix = systemUniforms.directionalLightProjectionMatrix;
  let u_directionalLightViewMatrix = systemUniforms.directionalLightViewMatrix;
  //
  let u_modelMatrix = vertexUniforms.modelMatrix;
  let u_camera = systemUniforms.camera;
  let u_cameraMatrix = u_camera.cameraMatrix;
  let u_cameraPosition = u_camera.cameraPosition;
  let u_useBillboardPerspective = vertexUniforms.useBillboardPerspective;
  let u_useBillboard = vertexUniforms.useBillboard;
  let input_position = inputData.position;
  var position:vec4<f32>;

  return output;
}

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output: OutputData;

    // 시스템 및 버텍스 유니폼 매트릭스
    let u_projectionMatrix = systemUniforms.projectionMatrix;
    let u_cameraMatrix = systemUniforms.camera.cameraMatrix;
    let u_modelMatrix = vertexUniforms.modelMatrix;

    // 빌보드와 기타 처리 플래그
    let u_useBillboardPerspective = vertexUniforms.useBillboardPerspective;
    let u_useBillboard = vertexUniforms.useBillboard;
    let u_billboardFixedScale = vertexUniforms.billboardFixedScale;
    let u_renderRatioX = vertexUniforms._renderRatioX;
    let u_renderRatioY = vertexUniforms._renderRatioY;
    var ratioScaleMatrix:mat4x4<f32> = mat4x4<f32>(
        u_renderRatioX, 0, 0, 0,
        0, u_renderRatioY, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    );

    // 입력 데이터
    let input_position = inputData.position;

    // 해상도
    let u_resolution = systemUniforms.resolution;

    // 변환된 위치
    var position: vec4<f32>;

     if (u_useBillboard == 1) {
         // 기본 position과 normalPosition 계산
         if(u_useBillboardPerspective == 1){
             position = getBillboardMatrix(u_cameraMatrix , u_modelMatrix) * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
         }else{
             position = getBillboardMatrix(u_cameraMatrix , u_modelMatrix) * ratioScaleMatrix *vec4<f32>(input_position, 1.0);
         }

         // View3D-Projection Matrix 곱
         output.position = u_projectionMatrix * position;

         if (u_useBillboardPerspective != 1) {
             // NDC 좌표로 변환
             var temp = output.position / output.position.w;

             // 화면 비율 및 스케일 보정
             let aspectRatio = u_resolution.x / u_resolution.y;
             let scaleX = clamp((u_projectionMatrix)[1][1], -1.0, 1.0) / aspectRatio * u_renderRatioX;
             let scaleY = clamp((u_projectionMatrix)[1][1], -1.0, 1.0) * u_renderRatioY;

             // 위치 조정
             output.position = vec4<f32>(
                 temp.xy + input_position.xy * vec2<f32>(scaleX * u_billboardFixedScale, scaleY * u_billboardFixedScale),
                 temp.zw
             );
         }
     } else {
         // 일반적인 변환 계산
         position = u_cameraMatrix * u_modelMatrix * ratioScaleMatrix * vec4<f32>(input_position, 1.0);
         // View3D-Projection Matrix 곱
         output.position = u_projectionMatrix * position;
     }

    // 추가 출력 데이터 설정
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);

    return output;
}
