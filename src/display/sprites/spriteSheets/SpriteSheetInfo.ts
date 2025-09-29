import RedGPUContext from "../../../context/RedGPUContext";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
import validateRedGPUContext from "../../../runtimeChecker/validateFunc/validateRedGPUContext";
import validateUintRange from "../../../runtimeChecker/validateFunc/validateUintRange";

/**
 * 스프라이트 시트 애니메이션을 위한 정보를 담는 클래스
 *
 * SpriteSheetInfo는 하나의 텍스처에 격자 형태로 배열된 애니메이션 프레임들의
 * 구조와 재생 설정을 정의합니다. 스프라이트 시트 인스턴스들이 공유하는
 * 애니메이션 메타데이터를 관리합니다.
 *
 * @category SpriteSheet
 */
class SpriteSheetInfo {
	/**
	 * 가로 세그먼트 수 (텍스처를 가로로 몇 개로 나눌지)
	 * @private
	 */
	#segmentW: number = 0

	/**
	 * 세로 세그먼트 수 (텍스처를 세로로 몇 개로 나눌지)
	 * @private
	 */
	#segmentH: number = 0

	/**
	 * 총 애니메이션 프레임 수
	 * @private
	 */
	#totalFrame: number = 0

	/**
	 * 시작 프레임 인덱스
	 * @private
	 */
	#startIndex: number = 0

	/**
	 * 애니메이션 프레임 레이트 (FPS)
	 * @private
	 */
	#frameRate: number = 0

	/**
	 * 반복 재생 여부
	 * @private
	 */
	#loop: boolean = true

	/**
	 * 스프라이트 시트 텍스처
	 * @private
	 */
	#texture: BitmapTexture

	/**
	 * 새로운 SpriteSheetInfo 인스턴스를 생성합니다.
	 *
	 * @param redGPUContext - RedGPU 렌더링 컨텍스트
	 * @param src - 스프라이트 시트 이미지 파일 경로 또는 URL
	 * @param segmentW - 가로 세그먼트 수 (양의 정수)
	 * @param segmentH - 세로 세그먼트 수 (양의 정수)
	 * @param totalFrame - 총 애니메이션 프레임 수 (양의 정수)
	 * @param startIndex - 시작 프레임 인덱스 (0 이상의 정수)
	 * @param loop - 반복 재생 여부 (기본값: true)
	 * @param frameRate - 애니메이션 프레임 레이트 (기본값: 60 FPS)
	 *
	 * @throws {Error} redGPUContext가 유효하지 않은 경우
	 * @throws {Error} 수치 매개변수가 유효한 범위를 벗어나는 경우
	 */
	constructor(
		redGPUContext: RedGPUContext,
		src: string,
		segmentW: number, segmentH: number, totalFrame: number, startIndex: number,
		loop: boolean = true,
		frameRate: number = 60
	) {
		validateRedGPUContext(redGPUContext)
		validateUintRange(segmentW)
		validateUintRange(segmentH)
		validateUintRange(totalFrame)
		validateUintRange(startIndex)
		validateUintRange(frameRate)
		this.#segmentW = segmentW
		this.#segmentH = segmentH
		this.#totalFrame = totalFrame
		this.#startIndex = startIndex
		this.#texture = new BitmapTexture(redGPUContext, src)
		this.#loop = loop
		this.#frameRate = frameRate
	}

	/**
	 * 가로 세그먼트 수를 반환합니다.
	 * @returns 텍스처를 가로로 나누는 세그먼트 수
	 */
	get segmentW(): number {
		return this.#segmentW;
	}

	/**
	 * 세로 세그먼트 수를 반환합니다.
	 * @returns 텍스처를 세로로 나누는 세그먼트 수
	 */
	get segmentH(): number {
		return this.#segmentH;
	}

	/**
	 * 총 애니메이션 프레임 수를 반환합니다.
	 * @returns 애니메이션에 사용할 총 프레임 수
	 */
	get totalFrame(): number {
		return this.#totalFrame;
	}

	/**
	 * 시작 프레임 인덱스를 반환합니다.
	 * @returns 애니메이션이 시작될 프레임의 인덱스 (0부터 시작)
	 */
	get startIndex(): number {
		return this.#startIndex;
	}

	/**
	 * 스프라이트 시트 텍스처를 반환합니다.
	 * @returns 애니메이션에 사용되는 비트맵 텍스처
	 */
	get texture(): BitmapTexture {
		return this.#texture;
	}

	/**
	 * 애니메이션 프레임 레이트를 반환합니다.
	 * @returns 초당 프레임 수 (FPS)
	 */
	get frameRate(): number {
		return this.#frameRate;
	}

	/**
	 * 반복 재생 여부를 반환합니다.
	 * @returns true인 경우 애니메이션이 무한 반복, false인 경우 한 번만 재생
	 */
	get loop(): boolean {
		return this.#loop;
	}
}

/**
 * SpriteSheetInfo 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(SpriteSheetInfo)

export default SpriteSheetInfo
