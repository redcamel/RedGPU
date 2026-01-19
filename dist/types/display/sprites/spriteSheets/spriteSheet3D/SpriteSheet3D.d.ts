import RedGPUContext from "../../../../context/RedGPUContext";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
/**
 * 3D 스프라이트 시트의 빌보드 및 렌더링 속성을 정의하는 인터페이스
 */
interface SpriteSheet3D extends ASpriteSheet {
    /** 빌보드 원근감 적용 여부 */
    useBillboardPerspective: boolean;
    /** 빌보드 모드 사용 여부 */
    useBillboard: boolean;
    /** X축 렌더링 비율 */
    _renderRatioX: number;
    /** Y축 렌더링 비율 */
    _renderRatioY: number;
}
/**
 * [KO] 3D 공간에서의 스프라이트 시트 애니메이션 클래스입니다.
 * [EN] 3D sprite sheet animation class.
 *
 * [KO] 3D 공간에서 빌보드 효과를 가진 스프라이트 시트 애니메이션을 제공합니다. 캐릭터나 파티클과 같은 2D 스프라이트를 3D 공간에 배치하면서도 항상 카메라를 향하도록 하여 자연스러운 시각 효과를 만듭니다. 텍스처의 종횡비에 따라 자동으로 렌더링 비율이 조정됩니다.
 * [EN] Provides sprite sheet animation with billboard effects in 3D space. Creates natural visual effects by placing 2D sprites like characters or particles in 3D space while always facing the camera. Rendering ratios are automatically adjusted according to the texture's aspect ratio.
 *
 * * ### Example
 * ```typescript
 * const info = new RedGPU.Display.SpriteSheetInfo(redGPUContext, 'sheet.png', 5, 3, 15, 0);
 * const spriteSheet = new RedGPU.Display.SpriteSheet3D(redGPUContext, info);
 * scene.addChild(spriteSheet);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/sprite/spriteSheet3D/"></iframe>
 *
 * [KO] 아래는 SpriteSheet3D의 구조와 동작을 이해하는 데 도움이 되는 추가 샘플 예제 목록입니다.
 * [EN] Below is a list of additional sample examples to help understand the structure and operation of SpriteSheet3D.
 * @see [SpriteSheet3D MouseEvent example](/RedGPU/examples/3d/mouseEvent/spriteSheet3D/)
 * @category SpriteSheet
 */
declare class SpriteSheet3D extends ASpriteSheet {
    #private;
    /**
     * [KO] 새로운 SpriteSheet3D 인스턴스를 생성합니다.
     * [EN] Creates a new SpriteSheet3D instance.
     *
     * @param redGPUContext -
     * [KO] RedGPU 렌더링 컨텍스트
     * [EN] RedGPU rendering context
     * @param spriteSheetInfo -
     * [KO] 스프라이트 시트 정보 객체 (텍스처, 세그먼트 정보, 애니메이션 설정 포함)
     * [EN] Sprite sheet info object (including texture, segment info, and animation settings)
     */
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo);
    /**
     * 지오메트리를 반환합니다.
     * @returns 현재 지오메트리 (고정된 Plane)
     */
    get geometry(): Geometry | Primitive;
    /**
     * SpriteSheet3D는 지오메트리를 변경할 수 없습니다
     * @param value - 설정하려는 지오메트리
     * @throws {Error} SpriteSheet3D는 지오메트리를 변경할 수 없습니다
     */
    set geometry(value: Geometry | Primitive);
    /**
     * 머티리얼을 반환합니다.
     * @returns 현재 머티리얼 (BitmapMaterial)
     */
    get material(): any;
    /**
     * SpriteSheet3D는 머티리얼을 변경할 수 없습니다
     * @param value - 설정하려는 머티리얼
     * @throws {Error} SpriteSheet3D는 머티리얼을 변경할 수 없습니다
     */
    set material(value: any);
    /**
     * SpriteSheet3D 전용 커스텀 버텍스 셰이더 모듈을 생성합니다.
     *
     * 3D 공간에서의 빌보드 효과와 스프라이트 시트 렌더링에 최적화된
     * 버텍스 셰이더를 생성합니다. 카메라 방향에 따른 동적 정점 계산과
     * UV 좌표 프레임 인덱싱 로직이 포함되어 있습니다.
     *
     * @returns 생성된 버텍스 셰이더 모듈 정보
     * @protected
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
}
export default SpriteSheet3D;
