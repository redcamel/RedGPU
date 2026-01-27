/**
 * [KO] 텍스처 샘플링 및 래핑을 위한 주소 모드 옵션을 정의하는 상수군입니다.
 * [EN] Constants defining address mode options for texture sampling and wrapping.
 *
 * [KO] 텍스처 좌표가 [0, 1] 범위를 벗어날 때의 샘플링 방식을 결정합니다.
 * [EN] Determines how textures are sampled when coordinates are outside the [0, 1] range.
 *
 * @category Constants
 */
const GPU_ADDRESS_MODE = {
	/**
	 * [KO] 텍스처 좌표를 [0, 1] 범위 내로 클램핑합니다.
	 * [EN] Clamps texture coordinates to the [0, 1] range.
	 */
	CLAMP_TO_EDGE: 'clamp-to-edge',
	/**
	 * [KO] 텍스처를 타일 형태로 반복합니다.
	 * [EN] Repeats the texture in a tiled fashion.
	 */
	REPEAT: 'repeat',
	/**
	 * [KO] 텍스처를 미러링하며 타일 형태로 반복합니다.
	 * [EN] Repeats the texture in a tiled fashion, mirroring each alternate tile.
	 */
	MIRRORED_REPEAT: 'mirror-repeat'
} as const;
Object.freeze(GPU_ADDRESS_MODE);
export default GPU_ADDRESS_MODE;