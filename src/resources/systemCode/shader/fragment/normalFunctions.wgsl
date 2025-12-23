
fn cotangent_frame( N:vec3<f32>,  p:vec3<f32>,  uv:vec2<f32>) -> mat3x3<f32>{
   let dp1:vec3<f32> = dpdx( p );
   let dp2:vec3<f32> = dpdy( p );
   let duv1:vec2<f32> = dpdx( uv );
   let duv2:vec2<f32> = dpdy( uv );

   let dp2perp:vec3<f32> = cross( dp2, N );
   let dp1perp:vec3<f32> = cross( N, dp1 );
   let T:vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
   let B:vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;

   // T와 B를 각각 정규화합니다.
   return mat3x3<f32>( normalize(T), normalize(B), N );
}
fn perturb_normal(  N:vec3<f32>,  position:vec3<f32>,  texcoord:vec2<f32>,  normalColor:vec3<f32>, normalPower:f32 ) -> vec3<f32> {
   var map:vec3<f32> = normalColor;
    map = normalColor * 2.0 - 1.0;
   map = vec3<f32>(map.xy * -normalPower, map.z);
   let TBN:mat3x3<f32> = cotangent_frame(N, position, texcoord);
   return normalize(TBN * map);
}
