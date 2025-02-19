#redgpu_include SYSTEM_UNIFORM;
#redgpu_include getBillboardMatrix;
struct VertexUniforms {
      pickingId:u32,
	  modelMatrix:mat4x4<f32>,
	  normalModelMatrix:mat4x4<f32>,
	  useBillboardPerspective:u32,
	  useBillboard:u32,
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

  //
  let input_position = inputData.position;
  let input_vertexNormal = inputData.vertexNormal;
  let input_positionVec4 = vec4<f32>(input_position, 1.0);
  let input_vertexNormalVec4 = vec4<f32>(input_vertexNormal, 1.0);
  let input_uv = inputData.uv;

  var position:vec4<f32>;
  var normalPosition:vec4<f32>;


var scaleMatrix: mat4x4<f32>;
 // 카메라와 오브젝트 간 거리 계산 (월드 공간 기준)
 let cameraPosition = vec3<f32>((u_cameraMatrix * u_modelMatrix)[3].xyz); // 카메라 위치 추출
 let objectPosition = input_position.xyz; // 오브젝트 위치
 let distance = length(cameraPosition - objectPosition); // 거리 계산

 // 거리 기반 스케일링 계산
 let scaleFactor = distance ; // 1 스케일 기준으로 거리 비례
     scaleMatrix = mat4x4<f32>(
         10, 0.0, 0.0, 0.0,
         0.0, 10, 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         0.0, 0.0, 0.0, 1.0
     );
 // 빌보드와 퍼스펙티브 조건 처리
 if (u_useBillboard == 1) {
     // 빌보드 활성화 시 스케일 매트릭스
     if (u_useBillboardPerspective == 1) {
         // 퍼스펙티브 스케일이 활성화된 경우

     } else {
         // 퍼스펙티브 스케일 비활성화 (기본 크기 유지)
         scaleMatrix = mat4x4<f32>(
             scaleFactor, 0.0, 0.0, 0.0,
             0.0, scaleFactor, 0.0, 0.0,
             0.0, 0.0, 1.0, 0.0,
             0.0, 0.0, 0.0, 1.0
         );
     }

     // 빌보드 처리
     position = getBillboardMatrix(u_cameraMatrix, u_modelMatrix) * scaleMatrix * vec4<f32>(objectPosition, 1.0);
     normalPosition = getBillboardMatrix(u_cameraMatrix, u_normalModelMatrix) * scaleMatrix * vec4<f32>(input_vertexNormal.xyz, 1.0);

     // 추가 위치 보정
     var temp = output.position / output.position.w;
     output.position = vec4<f32>(
         temp.xy + objectPosition.xy * vec2<f32>(
             (u_projectionMatrix * u_modelMatrix)[0][0],
             (u_projectionMatrix * u_modelMatrix)[1][1]
         ),
         temp.zw
     );

 } else {
     // 빌보드 비활성화 (일반 처리를 위한 스케일 매트릭스 사용)
     position = u_cameraMatrix * u_modelMatrix * scaleMatrix * vec4<f32>(objectPosition, 1.0);
     normalPosition = u_cameraMatrix * u_normalModelMatrix * scaleMatrix * vec4<f32>(input_vertexNormal.xyz, 1.0);
 }

 // 최종 처리: 투영 변환 적용
 output.position = u_projectionMatrix * position;
  output.vertexPosition = position.xyz;
  output.vertexNormal = normalPosition.xyz;
  output.uv = input_uv;
  output.combinedOpacity = vertexUniforms.combinedOpacity;
  return output;
}
struct OutputShadowData {
    @builtin(position) position : vec4<f32>,
};

@vertex
fn picking(inputData: InputData) -> OutputData {
    var output : OutputData;
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

    //
 let input_position = inputData.position;
   let input_positionVec4 = vec4<f32>(input_position, 1.0);
   let input_uv = inputData.uv;

   var position:vec4<f32>;


 var scaleMatrix: mat4x4<f32>;
 // 카메라와 오브젝트 간 거리 계산 (월드 공간 기준)
 let cameraPosition = vec3<f32>((u_cameraMatrix * u_modelMatrix)[3].xyz); // 카메라 위치 추출
 let objectPosition = input_position.xyz; // 오브젝트 위치
 let distance = length(cameraPosition - objectPosition); // 거리 계산

 // 거리 기반 스케일링 계산
 let scaleFactor = distance ; // 1 스케일 기준으로 거리 비례
     scaleMatrix = mat4x4<f32>(
         10, 0.0, 0.0, 0.0,
         0.0, 10, 0.0, 0.0,
         0.0, 0.0, 1.0, 0.0,
         0.0, 0.0, 0.0, 1.0
     );
 // 빌보드와 퍼스펙티브 조건 처리
 if (u_useBillboard == 1) {
     // 빌보드 활성화 시 스케일 매트릭스
     if (u_useBillboardPerspective == 1) {
         // 퍼스펙티브 스케일이 활성화된 경우

     } else {
         // 퍼스펙티브 스케일 비활성화 (기본 크기 유지)
         scaleMatrix = mat4x4<f32>(
             scaleFactor, 0.0, 0.0, 0.0,
             0.0, scaleFactor, 0.0, 0.0,
             0.0, 0.0, 1.0, 0.0,
             0.0, 0.0, 0.0, 1.0
         );
     }

     // 빌보드 처리
     position = getBillboardMatrix(u_cameraMatrix, u_modelMatrix) * scaleMatrix * vec4<f32>(objectPosition, 1.0);

     // 추가 위치 보정
     var temp = output.position / output.position.w;
     output.position = vec4<f32>(
         temp.xy + objectPosition.xy * vec2<f32>(
             (u_projectionMatrix * u_modelMatrix)[0][0],
             (u_projectionMatrix * u_modelMatrix)[1][1]
         ),
         temp.zw
     );

 } else {
     // 빌보드 비활성화 (일반 처리를 위한 스케일 매트릭스 사용)
     position = u_cameraMatrix * u_modelMatrix * scaleMatrix * vec4<f32>(objectPosition, 1.0);
 }
  output.position = u_projectionMatrix * position;
    output.pickingId = unpack4x8unorm(vertexUniforms.pickingId);
    return output;
}
