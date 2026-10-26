import RedGPUObject from "../../../base/RedGPUObject";
import RedGPUContext from "../../../context/RedGPUContext";
import BitmapTexture from "../../../resources/texture/BitmapTexture";
/**
 * [KO] 스프라이트 시트 애니메이션의 격자 분할 정보와 재생 설정을 정의하는 데이터 클래스입니다.
 * [EN] Data class that defines grid division information and playback settings for sprite sheet animations.
 *
 * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(
 *     redGPUContext,
 *     'path/to/image.png',
 *     5, 3,
 *     15,
 *     0,
 *     true,
 *     60
 * );
 * ```
 *
 * @see [SpriteSheet2D Basic Example](/RedGPU/examples/2d/spriteSheet2D/basic/)
 * @see [SpriteSheet3D Basic Example](/RedGPU/examples/3d/sprite/spriteSheet3D/)
 * @category SpriteSheet
 */
declare class SpriteSheetInfo extends RedGPUObject {
    #private;
    /**
     * [KO] SpriteSheetInfo 인스턴스를 생성합니다.
     * [EN] Creates a SpriteSheetInfo instance.
     *
     * ### Example
     * ```typescript
     * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0, true, 60);
     * ```
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param src -
     * [KO] 스프라이트 시트 이미지 경로 또는 URL
     * [EN] Sprite sheet image path or URL
     * @param segmentW -
     * [KO] 가로 세그먼트 분할 수 (양의 정수)
     * [EN] Number of horizontal segments (positive integer)
     * @param segmentH -
     * [KO] 세로 세그먼트 분할 수 (양의 정수)
     * [EN] Number of vertical segments (positive integer)
     * @param totalFrame -
     * [KO] 전체 프레임 수 (양의 정수)
     * [EN] Total number of frames (positive integer)
     * @param startIndex -
     * [KO] 시작 프레임 인덱스 (0 이상의 정수)
     * [EN] Starting frame index (non-negative integer)
     * @param loop -
     * [KO] 반복 재생 여부 (기본값: `true`)
     * [EN] Whether to loop playback (default: `true`)
     * @param frameRate -
     * [KO] 초당 재생 프레임 수 (기본값: `60`)
     * [EN] Frames per second (default: `60`)
     * @throws
     * [KO] 숫자 매개변수가 유효한 부호 없는 정수 범위를 벗어날 경우 에러 발생
     * [EN] Throws an error if numeric parameters are out of valid unsigned integer range
     */
    constructor(redGPUContext: RedGPUContext, src: string, segmentW: number, segmentH: number, totalFrame: number, startIndex: number, loop?: boolean, frameRate?: number);
    /**
     * [KO] 가로 세그먼트 분할 수를 반환합니다.
     * [EN] Returns the number of horizontal segments.
     *
     * @returns
     * [KO] 가로 세그먼트 수
     * [EN] Number of horizontal segments
     */
    get segmentW(): number;
    /**
     * [KO] 세로 세그먼트 분할 수를 반환합니다.
     * [EN] Returns the number of vertical segments.
     *
     * @returns
     * [KO] 세로 세그먼트 수
     * [EN] Number of vertical segments
     */
    get segmentH(): number;
    /**
     * [KO] 총 애니메이션 프레임 수를 반환합니다.
     * [EN] Returns the total number of animation frames.
     *
     * @returns
     * [KO] 총 프레임 수
     * [EN] Total frame count
     */
    get totalFrame(): number;
    /**
     * [KO] 시작 프레임 인덱스를 반환합니다.
     * [EN] Returns the starting frame index.
     *
     * @returns
     * [KO] 시작 프레임 인덱스 (0부터 시작)
     * [EN] Starting frame index (0-based)
     */
    get startIndex(): number;
    /**
     * [KO] 스프라이트 시트의 비트맵 텍스처를 반환합니다.
     * [EN] Returns the bitmap texture of the sprite sheet.
     *
     * @returns
     * [KO] 비트맵 텍스처 인스턴스
     * [EN] BitmapTexture instance
     */
    get texture(): BitmapTexture;
    /**
     * [KO] 초당 애니메이션 프레임 수(FPS)를 반환합니다.
     * [EN] Returns the animation frame rate (FPS).
     *
     * @returns
     * [KO] 초당 프레임 수
     * [EN] Frames per second
     */
    get frameRate(): number;
    /**
     * [KO] 반복 재생 여부를 반환합니다.
     * [EN] Returns whether playback loops.
     *
     * @returns
     * [KO] 반복 재생 여부
     * [EN] Whether playback loops
     */
    get loop(): boolean;
}
export default SpriteSheetInfo;
