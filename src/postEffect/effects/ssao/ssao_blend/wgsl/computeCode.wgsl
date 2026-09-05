// [KO] 1. 인덱스 계산 및 화면 크기
// [EN] 1. Index calculation and screen size
let index = vec2<i32>(global_id.xy);
let fullDims = vec2<f32>(postEffectOutputDimensions);
if (f32(index.x) >= fullDims.x || f32(index.y) >= fullDims.y) {
    return;
}

let diffuse = textureLoad(sourceTexture0, index, 0);
let centerDepth = textureLoad(depthTexture, index, 0);

// 배경(깊이 없음) 처리: AO 차폐 없이 원본 그대로 출력
if (centerDepth < 0.001) {
    textureStore(outputTexture, index, diffuse);
    return;
}

// [KO] 2. Half-Res AO 텍스처 좌표 및 4-Tap Bilinear 쿼드 계산
// [EN] 2. Half-Res AO texture coordinates and 4-Tap Bilinear Quad calculation
let centerUV = (vec2<f32>(index) + 0.5) / fullDims;
let aoDims = vec2<f32>(textureDimensions(sourceTexture1));
let fullDepthDims = vec2<f32>(textureDimensions(depthTexture));

let texelPos = centerUV * aoDims - 0.5;
let basePos = floor(texelPos);
let f = fract(texelPos);

let baseCoord = vec2<i32>(basePos);
let maxAoCoord = vec2<i32>(aoDims) - vec2<i32>(1);

// 4개 샘플 좌표 (클램핑)
let c00 = clamp(baseCoord, vec2<i32>(0), maxAoCoord);
let c10 = clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxAoCoord);
let c01 = clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxAoCoord);
let c11 = clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxAoCoord);

// 4개 샘플의 AO 값 로드
let ao00 = textureLoad(sourceTexture1, c00, 0).r;
let ao10 = textureLoad(sourceTexture1, c10, 0).r;
let ao01 = textureLoad(sourceTexture1, c01, 0).r;
let ao11 = textureLoad(sourceTexture1, c11, 0).r;

// 4개 샘플 위치의 Depth 로드 (Full-Res Depth 버퍼에서 해당 위치 샘플링)
let depthCoord00 = clamp(vec2<i32>(((vec2<f32>(c00) + 0.5) / aoDims) * fullDepthDims), vec2<i32>(0), vec2<i32>(fullDepthDims) - vec2<i32>(1));
let depthCoord10 = clamp(vec2<i32>(((vec2<f32>(c10) + 0.5) / aoDims) * fullDepthDims), vec2<i32>(0), vec2<i32>(fullDepthDims) - vec2<i32>(1));
let depthCoord01 = clamp(vec2<i32>(((vec2<f32>(c01) + 0.5) / aoDims) * fullDepthDims), vec2<i32>(0), vec2<i32>(fullDepthDims) - vec2<i32>(1));
let depthCoord11 = clamp(vec2<i32>(((vec2<f32>(c11) + 0.5) / aoDims) * fullDepthDims), vec2<i32>(0), vec2<i32>(fullDepthDims) - vec2<i32>(1));

let d00 = textureLoad(depthTexture, depthCoord00, 0);
let d10 = textureLoad(depthTexture, depthCoord10, 0);
let d01 = textureLoad(depthTexture, depthCoord01, 0);
let d11 = textureLoad(depthTexture, depthCoord11, 0);

// [KO] 3. Bilinear 공간 가중치 및 양방향 깊이(Bilateral Depth) 가중치 계산
// [EN] 3. Bilinear spatial weights and Bilateral Depth weights calculation
let w00_spatial = (1.0 - f.x) * (1.0 - f.y);
let w10_spatial = f.x * (1.0 - f.y);
let w01_spatial = (1.0 - f.x) * f.y;
let w11_spatial = f.x * f.y;

// 깊이 차이에 따른 가중치 (Edge Bleeding 완전 차단)
let dw00 = 1.0 / (abs(centerDepth - d00) * 100.0 + 1.0);
let dw10 = 1.0 / (abs(centerDepth - d10) * 100.0 + 1.0);
let dw01 = 1.0 / (abs(centerDepth - d01) * 100.0 + 1.0);
let dw11 = 1.0 / (abs(centerDepth - d11) * 100.0 + 1.0);

let w00 = w00_spatial * dw00;
let w10 = w10_spatial * dw10;
let w01 = w01_spatial * dw01;
let w11 = w11_spatial * dw11;

let totalWeight = max(0.00001, w00 + w10 + w01 + w11);
let finalAO = (ao00 * w00 + ao10 * w10 + ao01 * w01 + ao11 * w11) / totalWeight;

// [KO] 4. 최종 컬러 합성 (AO 값을 곱하여 음영 적용)
// [EN] 4. Final color composition (Apply shading by multiplying AO value)
let finalColor = vec4<f32>(diffuse.rgb * finalAO, diffuse.a);
textureStore(outputTexture, index, finalColor);
