import RedGPUContext from "../../../context/RedGPUContext";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
/**
 * 스프라이트 시트 애니메이션을 위한 정보를 담는 클래스
 *
 * SpriteSheetInfo는 하나의 텍스처에 격자 형태로 배열된 애니메이션 프레임들의
 * 구조와 재생 설정을 정의합니다. 스프라이트 시트 인스턴스들이 공유하는
 * 애니메이션 메타데이터를 관리합니다.
 *
 * @category SpriteSheet
 */
declare class SpriteSheetInfo {
    #private;
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
    constructor(redGPUContext: RedGPUContext, src: string, segmentW: number, segmentH: number, totalFrame: number, startIndex: number, loop?: boolean, frameRate?: number);
    /**
     * 가로 세그먼트 수를 반환합니다.
     * @returns 텍스처를 가로로 나누는 세그먼트 수
     */
    get segmentW(): number;
    /**
     * 세로 세그먼트 수를 반환합니다.
     * @returns 텍스처를 세로로 나누는 세그먼트 수
     */
    get segmentH(): number;
    /**
     * 총 애니메이션 프레임 수를 반환합니다.
     * @returns 애니메이션에 사용할 총 프레임 수
     */
    get totalFrame(): number;
    /**
     * 시작 프레임 인덱스를 반환합니다.
     * @returns 애니메이션이 시작될 프레임의 인덱스 (0부터 시작)
     */
    get startIndex(): number;
    /**
     * 스프라이트 시트 텍스처를 반환합니다.
     * @returns 애니메이션에 사용되는 비트맵 텍스처
     */
    get texture(): BitmapTexture;
    /**
     * 애니메이션 프레임 레이트를 반환합니다.
     * @returns 초당 프레임 수 (FPS)
     */
    get frameRate(): number;
    /**
     * 반복 재생 여부를 반환합니다.
     * @returns true인 경우 애니메이션이 무한 반복, false인 경우 한 번만 재생
     */
    get loop(): boolean;
}
export default SpriteSheetInfo;
