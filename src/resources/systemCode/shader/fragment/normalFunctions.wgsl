// Function to perturb the normal using a normal map
fn cotangent_frame( N:vec3<f32>,  p:vec3<f32>,  uv:vec2<f32>) -> mat3x3<f32>{
   let dp1:vec3<f32> = dpdx( p );
   let dp2:vec3<f32> = dpdy( p );
   let duv1:vec2<f32> = dpdx( uv );
   let duv2:vec2<f32> = dpdy( uv );

   let dp2perp:vec3<f32> = cross( dp2, N );
   let dp1perp:vec3<f32> = cross( N, dp1 );
   let T:vec3<f32> = dp2perp * duv1.x + dp1perp * duv2.x;
   let B:vec3<f32> = dp2perp * duv1.y + dp1perp * duv2.y;
   let invmax:f32 = inverseSqrt( max( dot(T,T), dot(B,B) ) );
   return mat3x3<f32>( T * invmax, B * invmax, N );
}
fn perturb_normal(  N:vec3<f32>,  V:vec3<f32>,  texcoord:vec2<f32>,  normalColor:vec3<f32>, normalPower:f32 ) -> vec3<f32> {
   var map:vec3<f32> = normalColor;
   map =  map * 255./127. - 128./127.;
   map = vec3<f32>(map.xy * -normalPower, map.z);
   let TBN:mat3x3<f32> = cotangent_frame(N, V, texcoord);
   return normalize(TBN * map);
}
