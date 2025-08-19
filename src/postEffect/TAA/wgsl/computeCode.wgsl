let index = vec2<u32>(global_id.xy);
let dimensions: vec2<u32> = textureDimensions(sourceTexture);

if (index.x >= dimensions.x || index.y >= dimensions.y) {
	return;
}

let uv = vec2<f32>(f32(index.x) + 0.5, f32(index.y) + 0.5) / vec2<f32>(dimensions);

// 현재 프레임 색상 가져오기 (storage texture)
var currentColor = textureLoad(sourceTexture, index);

// 이전 프레임 텍스처 존재 여부 확인
let previousFrameExists = textureDimensions(previousFrame).x > 1u;

if (!previousFrameExists) {
	// 이전 프레임이 없으면 현재 프레임 그대로 출력
	textureStore(outputTexture, index, currentColor);
	return;
}

// 이전 프레임 색상 가져오기 (storage texture - 밉맵 레벨 불필요)
var previousColor = textureLoad(previousFrame, index);

// 간단한 테스트: 현재 프레임과 이전 프레임을 좌우로 분할하여 출력
if (uv.x < 0.5) {
	// 화면 왼쪽 절반: 현재 프레임
	textureStore(outputTexture, index, currentColor);
} else {
	// 화면 오른쪽 절반: 이전 프레임
	textureStore(outputTexture, index, previousColor);
}
