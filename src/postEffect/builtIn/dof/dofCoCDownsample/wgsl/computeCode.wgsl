let index = global_id.xy;
let halfDims = vec2<f32>(postEffectOutputDimensions);
let fullDims = vec2<i32>(textureDimensions(sourceTexture));
let invFullDims = 1.0 / vec2<f32>(fullDims);
let maxCoord = max(fullDims - vec2<i32>(1), vec2<i32>(0));
let baseCoord = vec2<i32>(index) * 2;

let c00 = clamp(baseCoord + vec2<i32>(0, 0), vec2<i32>(0), maxCoord);
let c10 = clamp(baseCoord + vec2<i32>(1, 0), vec2<i32>(0), maxCoord);
let c01 = clamp(baseCoord + vec2<i32>(0, 1), vec2<i32>(0), maxCoord);
let c11 = clamp(baseCoord + vec2<i32>(1, 1), vec2<i32>(0), maxCoord);

let invProj = systemUniforms.projection.inverseProjectionMatrix;
let dpr = min(systemUniforms.devicePixelRatio, 2.0);
let maxHalfCoC = 0.5 * uniforms.maxCoC * dpr;

let d00 = reconstructViewDepth(c00, invFullDims, invProj);
let d10 = reconstructViewDepth(c10, invFullDims, invProj);
let d01 = reconstructViewDepth(c01, invFullDims, invProj);
let d11 = reconstructViewDepth(c11, invFullDims, invProj);

let coc00 = calculatePhysicalHalfCoC(d00, halfDims.y, maxHalfCoC);
let coc10 = calculatePhysicalHalfCoC(d10, halfDims.y, maxHalfCoC);
let coc01 = calculatePhysicalHalfCoC(d01, halfDims.y, maxHalfCoC);
let coc11 = calculatePhysicalHalfCoC(d11, halfDims.y, maxHalfCoC);

// [KO] 연속적인 표면에서는 2x2 평균 CoC를 사용하고, 깊이 단절(실루엣 경계)에서는 가장 가까운 전면 표면의 CoC(minSignedCoC)를 채택하여 허공의 가짜 중간 CoC 및 배경 색 번짐을 원천 차단
// [EN] Use 2x2 average CoC on continuous surfaces and adopt the closest front-surface CoC (minSignedCoC) across depth discontinuities (silhouette edges) to prevent phantom mid-air CoC and background color leaking
let minSignedCoC = min(min(coc00, coc10), min(coc01, coc11));
let maxSignedCoC = max(max(coc00, coc10), max(coc01, coc11));
let avgCoC = (coc00 + coc10 + coc01 + coc11) * 0.25;
let edgeDiscontinuity = clamp(maxSignedCoC - minSignedCoC - 0.5, 0.0, 1.0);
let tileCoC = mix(avgCoC, minSignedCoC, edgeDiscontinuity);

let col00 = textureLoad(sourceTexture, c00, 0).rgb;
let col10 = textureLoad(sourceTexture, c10, 0).rgb;
let col01 = textureLoad(sourceTexture, c01, 0).rgb;
let col11 = textureLoad(sourceTexture, c11, 0).rgb;

// [KO] CoC 반경 차이(단위: 텍셀)에 기반한 양방향(Bilateral) 가중 평균으로 깊이 경계 컬러 리크(Halo) 차단
// [EN] Prevent depth-edge color leaking (Halo) via bilateral weighted average based on CoC radius difference (in texels)
let w00 = 1.0 / (0.25 + abs(coc00 - tileCoC) * 4.0);
let w10 = 1.0 / (0.25 + abs(coc10 - tileCoC) * 4.0);
let w01 = 1.0 / (0.25 + abs(coc01 - tileCoC) * 4.0);
let w11 = 1.0 / (0.25 + abs(coc11 - tileCoC) * 4.0);
let wSum = w00 + w10 + w01 + w11;

let downsampledColor = (col00 * w00 + col10 * w10 + col01 * w01 + col11 * w11) / wSum;

textureStore(outputTexture, index, vec4<f32>(downsampledColor, tileCoC));
