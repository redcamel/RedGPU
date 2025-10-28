import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
/** 2D 메시 기능이 믹스인된 베이스 스프라이트 시트 클래스 */
declare const BaseSpriteSheet2D: {
    new (...args: any[]): {
        "__#38243@#rotation": number;
        "__#38243@#blendMode": number;
        get blendMode(): string;
        set blendMode(value: import("../../../../material").BLEND_MODE | keyof typeof import("../../../../material").BLEND_MODE);
        rotation: number;
        setScale(x: number, y?: number): void;
        setPosition(x: number, y?: number): void;
        setRotation(value: number): void;
        "__#38243@#setBlendFactor"(mode: number): void;
        rotationZ: number;
    };
} & typeof ASpriteSheet;
/**
 * 2D 스프라이트 시트 애니메이션 클래스
 *
 * SpriteSheet2D는 2D 게임에서 캐릭터나 오브젝트의 애니메이션을 위한 클래스입니다.
 * 하나의 텍스처에 격자 형태로 배열된 여러 프레임을 시간에 따라 순차적으로 표시하여
 * 부드러운 2D 애니메이션을 생성합니다. 텍스처의 세그먼트 크기에 따라 자동으로
 * 렌더링 크기가 조정됩니다.
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * 아래는 SpriteSheet2D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * @see [SpriteSheet2D MouseEvent example](/RedGPU/examples/2d/mouseEvent/spriteSheet2D/)
 *
 * @category SpriteSheet
 */
declare class SpriteSheet2D extends BaseSpriteSheet2D {
    #private;
    /**
     * 새로운 SpriteSheet2D 인스턴스를 생성합니다.
     *
     * @param redGPUContext - RedGPU 렌더링 컨텍스트
     * @param spriteSheetInfo - 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
     */
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo);
    /**
     * 스프라이트 시트 세그먼트의 너비를 반환합니다.
     * 텍스처 전체 너비를 세그먼트 수로 나눈 값입니다.
     * @returns 세그먼트 너비 (픽셀 단위)
     */
    get width(): number;
    /**
     * 스프라이트 시트 세그먼트의 높이를 반환합니다.
     * 텍스처 전체 높이를 세그먼트 수로 나눈 값입니다.
     * @returns 세그먼트 높이 (픽셀 단위)
     */
    get height(): number;
    /**
     * 지오메트리를 반환합니다.
     * @returns 현재 지오메트리 (고정된 Plane)
     */
    get geometry(): Geometry | Primitive;
    /**
     * SpriteSheet2D는 지오메트리를 변경할 수 없습니다
     * @param value - 설정하려는 지오메트리
     * @throws {Error} SpriteSheet2D는 지오메트리를 변경할 수 없습니다
     */
    set geometry(value: Geometry | Primitive);
    /**
     * 머티리얼을 반환합니다.
     * @returns 현재 머티리얼 (BitmapMaterial)
     */
    get material(): any;
    /**
     * SpriteSheet2D는 머티리얼을 변경할 수 없습니다
     * @param value - 설정하려는 머티리얼
     * @throws {Error} SpriteSheet2D는 머티리얼을 변경할 수 없습니다
     */
    set material(value: any);
    /**
     * SpriteSheet2D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     * 2D 스프라이트 시트 렌더링에 최적화된 버텍스 셰이더를 생성하며,
     * UV 좌표 계산과 프레임 인덱싱 로직이 포함되어 있습니다.
     *
     * @returns 생성된 버텍스 셰이더 모듈 정보
     * @protected
     */
    createCustomMeshVertexShaderModule(): GPUShaderModule;
}
export default SpriteSheet2D;
