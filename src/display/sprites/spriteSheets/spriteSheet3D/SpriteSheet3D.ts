import RedGPUContext from "../../../../context/RedGPUContext";
import DefineForVertex from "../../../../defineProperty/DefineForVertex";
import Geometry from "../../../../geometry/Geometry";
import Primitive from "../../../../primitive/core/Primitive";
import Plane from "../../../../primitive/Plane";
import BitmapTexture from "../../../../resources/texture/BitmapTexture";
import parseWGSL from "../../../../resources/wgslParser/parseWGSL";
import consoleAndThrowError from "../../../../utils/consoleAndThrowError";
import ASpriteSheet from "../core/ASpriteSheet";
import SpriteSheetInfo from "../SpriteSheetInfo";
import RenderViewStateData from "../../../view/core/RenderViewStateData";
import vertexModuleSource from "./shader/spriteSheet3DVertex.wgsl";
import {keepLog} from "../../../../utils";

/** SpriteSheet3D 전용 버텍스 셰이더 모듈 이름 */
const VERTEX_SHADER_MODULE_NAME = 'VERTEX_MODULE_SPRITE_SHEET_3D'
/** 파싱된 WGSL 셰이더 정보 */
const SHADER_INFO = parseWGSL(vertexModuleSource);
/** 버텍스 유니폼 구조체 정보 */
const UNIFORM_STRUCT = SHADER_INFO.uniforms.vertexUniforms;

/**
 * 3D 스프라이트 시트의 빌보드 및 렌더링 속성을 정의하는 인터페이스
 */
interface SpriteSheet3D extends ASpriteSheet {
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
class SpriteSheet3D extends ASpriteSheet {
    /**
     * [KO] 렌더링될 텍스처 세그먼트의 실제 너비
     * [EN] Actual width of the texture segment to be rendered
     */
    #nativeWidth: number = 1
    /**
     * [KO] 렌더링될 텍스처 세그먼트의 실제 높이
     * [EN] Actual height of the texture segment to be rendered
     */
    #nativeHeight: number = 1
    #worldSize: number = 1
    #pixelSize: number = 0
    #usePixelSize: boolean = false

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
    constructor(redGPUContext: RedGPUContext, spriteSheetInfo: SpriteSheetInfo,) {
        super(redGPUContext, spriteSheetInfo, (diffuseTexture: BitmapTexture, segmentW: number, segmentH: number) => {
            if (diffuseTexture) {
                const {gpuTexture} = diffuseTexture;
                if (gpuTexture) {
                    const tW = gpuTexture.width / segmentW
                    const tH = gpuTexture.height / segmentH
                    if (tW !== this.#nativeWidth || tH !== this.#nativeHeight) {
                        this.#nativeWidth = tW
                        this.#nativeHeight = tH

                        const prevPixelSize = this.pixelSize;
                        // [KO] 원본 세그먼트 해상도를 pixelSize(CSS 단위) 기본값으로 설정
                        // [EN] Sync physical segment resolution to default pixelSize (CSS unit)
                        this.pixelSize = this.#pixelSize ? this.#pixelSize : (tH );
                        this.#updateRatios();
                        keepLog('오냐 ',this.pixelSize)
                        this.dirtyTransform = true
                    }
                }
            } else {
                this.#nativeWidth = 1
                this.#nativeHeight = 1
            }
        });
        this._geometry = new Plane(redGPUContext);
    }

    /**
     * [KO] 월드 공간에서의 세로 크기(높이)를 반환합니다.
     * [EN] Returns the vertical size (height) in world space.
     */
    get worldSize(): number {
        return this.#worldSize;
    }

    /**
     * [KO] 월드 공간에서의 세로 크기(높이)를 설정합니다.
     * [EN] Sets the vertical size (height) in world space.
     * @param value - [KO] 월드 크기 (Unit) [EN] World size (Unit)
     */
    set worldSize(value: number) {
        if (this.#worldSize === value) return;
        this.#worldSize = value;
        this.#updateRatios();
    }


    get pixelSize(): number {
        return this.#pixelSize;
    }

    set pixelSize(value: number) {
        if(this.gpuRenderInfo){
            const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                vertexUniformInfo.members.pixelSize.uniformOffset,
                new Float32Array([value * window.devicePixelRatio]) 
            )
        }
        this.#pixelSize = value;
    }

    /**
     * [KO] 고정 크기 사용 여부를 설정합니다.
     * [EN] Sets whether to use fixed pixel size.
     */
    get usePixelSize(): boolean {
        return this.#usePixelSize;
    }

    set usePixelSize(value: boolean) {
        if(this.gpuRenderInfo){
            const {vertexUniformBuffer, vertexUniformInfo} = this.gpuRenderInfo
            this.redGPUContext.gpuDevice.queue.writeBuffer(
                vertexUniformBuffer.gpuBuffer,
                vertexUniformInfo.members.usePixelSize.uniformOffset,
                new Uint32Array([value ? 1 : 0])
            )
        }
        if (this.#usePixelSize === value) return;
        this.#usePixelSize = value;
        this.#updateRatios();
    }

    #updateRatios() {
        if (this.#nativeHeight) {
            const prevX = this._renderRatioX;
            const prevY = this._renderRatioY;

            if (this.usePixelSize) {
                // [KO] pixelSize 모드일 때는 worldSize를 무시하고 종횡비만 유지
                // [EN] In pixelSize mode, ignore worldSize and maintain only the aspect ratio
                this._renderRatioY = 1;
                this._renderRatioX = this.#nativeWidth / this.#nativeHeight;
            } else {
                // [KO] worldSize가 반영된 최종 렌더링 비율 계산
                // [EN] Calculate final rendering ratios reflecting worldSize
                this._renderRatioY = this.#worldSize;
                this._renderRatioX = (this.#nativeWidth / this.#nativeHeight) * this.#worldSize;
            }

            if (prevX !== this._renderRatioX || prevY !== this._renderRatioY) {
                this.dirtyTransform = true;
            }
        }
    }

    render(renderViewStateData: RenderViewStateData) {
        super.render(renderViewStateData);
    }

    /**
     * 지오메트리를 반환합니다.
     * @returns 현재 지오메트리 (고정된 Plane)
     */
    get geometry(): Geometry | Primitive {
        return this._geometry;
    }

    /**
     * SpriteSheet3D는 지오메트리를 변경할 수 없습니다
     * @param value - 설정하려는 지오메트리
     * @throws {Error} SpriteSheet3D는 지오메트리를 변경할 수 없습니다
     */
    set geometry(value: Geometry | Primitive) {
        consoleAndThrowError('SpriteSheet3D can not change geometry')
    }

    /**
     * 머티리얼을 반환합니다.
     * @returns 현재 머티리얼 (BitmapMaterial)
     */
    get material() {
        return this._material;
    }

    /**
     * SpriteSheet3D는 머티리얼을 변경할 수 없습니다
     * @param value - 설정하려는 머티리얼
     * @throws {Error} SpriteSheet3D는 머티리얼을 변경할 수 없습니다
     */
    set material(value) {
        consoleAndThrowError('SpriteSheet3D can not change material')
    }

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
    createCustomMeshVertexShaderModule = (): GPUShaderModule => {
        return this.createMeshVertexShaderModuleBASIC(VERTEX_SHADER_MODULE_NAME, SHADER_INFO, UNIFORM_STRUCT, vertexModuleSource)
    }
}

/**
 * SpriteSheet3D 클래스에 렌더링 비율 속성들을 정의합니다.
 */
DefineForVertex.definePositiveNumber(SpriteSheet3D, [
    ['_renderRatioX', 1],
    ['_renderRatioY', 1],
])
/**
 * SpriteSheet3D 클래스에 빌보드 관련 속성들을 정의합니다.
 */
DefineForVertex.defineByPreset(SpriteSheet3D, [
    [DefineForVertex.PRESET_BOOLEAN.USE_BILLBOARD, true],
])
/**
 * SpriteSheet3D 클래스를 동결하여 런타임에서의 수정을 방지합니다.
 * @readonly
 */
Object.freeze(SpriteSheet3D)
export default SpriteSheet3D