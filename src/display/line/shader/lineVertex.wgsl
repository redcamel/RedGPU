#redgpu_include SYSTEM_UNIFORM;

 struct VertexUniforms {
     pickingId: u32,
     modelMatrix: mat4x4<f32>,
     normalModelMatrix: mat4x4<f32>,
 };

 @group(1) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

 struct InputData {
     @location(0) position: vec3<f32>,
     @location(1) vertexColor: vec4<f32>,
 };

 struct OutputData {
     @builtin(position) position: vec4<f32>,
     @location(0) vertexPosition: vec3<f32>,
     @location(1) vertexColor: vec4<f32>,
     @location(15) pickingId: vec4<f32>,
 };

 struct OutputShadowData {
     @builtin(position) position: vec4<f32>,
 };

 @vertex
 fn main(inputData: InputData) -> OutputData {
     var output: OutputData;

     let u_projectionMatrix = systemUniforms.projectionMatrix;
     let u_resolution = systemUniforms.resolution;
     let u_camera = systemUniforms.camera;
     let u_cameraMatrix = u_camera.cameraMatrix;
     let u_cameraPosition = u_camera.cameraPosition;

     let u_modelMatrix = vertexUniforms.modelMatrix;

     let input_position = inputData.position;
     let input_vertexColor = inputData.vertexColor;

     var position: vec4<f32>;
     position = u_modelMatrix * vec4<f32>(input_position, 1.0);
     output.position = u_projectionMatrix * u_cameraMatrix * position;
     output.vertexPosition = position.xyz;
     output.vertexColor = input_vertexColor;

     return output;
 }

 @vertex
 fn picking(inputData: InputData) -> OutputData {
 //TODO 일단 두꺠지원을 안하니 나중에 개선
     var output: OutputData;
     return output;
 }
