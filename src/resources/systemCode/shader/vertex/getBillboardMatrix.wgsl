fn getBillboardMatrix( cameraMatrix:mat4x4<f32>,  modelMatrix:mat4x4<f32>)-> mat4x4<f32>{
   let cacheScale = mat4x4<f32>(
      modelMatrix[0][0] , 0.0, 0.0, 0.0,
       0.0, modelMatrix[1][1], 0.0, 0.0,
      0.0, 0.0, modelMatrix[2][2] , 0.0 ,
      0.0, 0.0, 0.0, 1.0,
   );

   var resultMatrix = cameraMatrix * modelMatrix;
   resultMatrix[0][0] = 1.0; resultMatrix[0][1] = 0.0; resultMatrix[0][2] = 0.0;
   resultMatrix[1][0] = 0.0; resultMatrix[1][1] = 1.0; resultMatrix[1][2] = 0.0;
   resultMatrix[2][0] = 0.0; resultMatrix[2][1] = 0.0; resultMatrix[2][2] = 1.0;
   return resultMatrix * cacheScale;
}
fn getBillboardMatrixNoScaleRatio( cameraMatrix:mat4x4<f32>,  modelMatrix:mat4x4<f32>)-> mat4x4<f32>{
   var resultMatrix = cameraMatrix * modelMatrix;
   resultMatrix[0][0] = modelMatrix[0][0]; resultMatrix[0][1] = 0.0; resultMatrix[0][2] = 0.0;
   resultMatrix[1][0] = 0.0; resultMatrix[1][1] = modelMatrix[1][1]; resultMatrix[1][2] = 0.0;
   resultMatrix[2][0] = 0.0; resultMatrix[2][1] = 0.0; resultMatrix[2][2] = modelMatrix[2][2];

   return resultMatrix;
}
