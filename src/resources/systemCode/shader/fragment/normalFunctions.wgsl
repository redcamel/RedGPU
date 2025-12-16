
fn cotangent_frame( N:vec3<f32>,  position:vec3<f32>,  uv:vec2<f32>) -> mat3x3<f32>{
   let dp1:vec3<f32> = dpdx( position );
   let dp2:vec3<f32> = dpdy( position );
   let duv1:vec2<f32> = dpdx( uv );
   let duv2:vec2<f32> = dpdy( uv );

   let dp2perp:vec3<f32> = cross( dp2, N );
   let dp1perp:vec3<f32> = cross( N, dp1 );
   let T:vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
   let B:vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;

   // T와 B를 개별적으로 정규화
   return mat3x3<f32>( normalize(T), normalize(B), N );
}

// 2. 입력 변수명, 노멀 디코딩 및 강도 조절 수정
fn perturb_normal(  N:vec3<f32>,  position:vec3<f32>,  texcoord:vec2<f32>,  normalColor:vec3<f32>, normalPower:f32 ) -> vec3<f32> {
   var map:vec3<f32> = normalColor;

   // 표준 노멀 디코딩 [0,1] -> [-1, 1]
   map =  map * 2.0 - 1.0;

   // 노멀 강도 적용 및 (필요하다면) 축 반전
   // (X, Y 축 반전이 의도된 것이 아니라면 - 부호를 제거해야 합니다)
   map = vec3<f32>(map.x * -normalPower,map.y * normalPower, map.z);

   // V 대신 position 사용
   let TBN:mat3x3<f32> = cotangent_frame(N, position, texcoord);

   return normalize(TBN * map);
}
