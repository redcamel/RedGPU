import RedGPUContext from "../../context/RedGPUContext";
import GPU_INDEX_FORMAT from "../../gpuConst/GPU_INDEX_FORMAT";
import GPU_PRIMITIVE_TOPOLOGY from "../../gpuConst/GPU_PRIMITIVE_TOPOLOGY";
import ColorMaterial from "../../material/colorMaterial/ColorMaterial";
import Mesh from "../mesh/Mesh";
import LandscapeSharedGeometry from "./LandscapeSharedGeometry";

/**
 * [KO] 단일 지형 타일 컴포넌트 클래스입니다.
 * [EN] Single terrain tile component class.
 */
export class LandscapeComponent extends Mesh {
    #lodLevel: number = 0;
    #tileX: number = 0;
    #tileZ: number = 0;
    #wireframe: boolean = false;
    #sharedGeometry: LandscapeSharedGeometry;

    /**
     * [KO] LandscapeComponent 인스턴스를 생성합니다.
     * [EN] Creates an instance of LandscapeComponent.
     *
     * @param redGPUContext - [KO] RedGPUContext 인스턴스 [EN] RedGPUContext instance
     * @param sharedGeometry - [KO] 공유 LOD 지오메트리 객체 [EN] Shared LOD geometry manager
     * @param tileX - [KO] 월드 X 위치 [EN] World X position
     * @param tileZ - [KO] 월드 Z 위치 [EN] World Z position
     * @param material - [KO] 머티리얼 (선택) [EN] Material (optional)
     * @param wireframe - [KO] 와이어프레임 적용 여부 [EN] Whether wireframe mode is enabled
     */
    constructor(
        redGPUContext: RedGPUContext,
        sharedGeometry: LandscapeSharedGeometry,
        tileX: number,
        tileZ: number,
        material?: any,
        wireframe: boolean = false
    ) {
        const defaultMaterial = material || new ColorMaterial(redGPUContext, '#338833');
        super(redGPUContext, sharedGeometry.getGeometry(0), defaultMaterial);

        this.#sharedGeometry = sharedGeometry;
        this.#tileX = tileX;
        this.#tileZ = tileZ;
        this.x = tileX;
        this.z = tileZ;
        this.rotationX = -90; // XZ 지형 평면 배치

        this.wireframe = wireframe;
    }

    /**
     * [KO] 와이어프레임 렌더링 모드 설정 (WebGPU 토폴로지 & stripIndexFormat 규격 적용)
     * [EN] Sets wireframe rendering mode (applies WebGPU topology & stripIndexFormat spec)
     */
    public get wireframe(): boolean {
        return this.#wireframe;
    }

    public set wireframe(value: boolean) {
        this.#wireframe = value;
        if (value) {
            // Strip 토폴로지 적용 시에는 stripIndexFormat이 필수
            this.primitiveState.stripIndexFormat = GPU_INDEX_FORMAT.UINT32;
            this.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.LINE_STRIP;
        } else {
            // Non-Strip 토폴로지 적용 시에는 stripIndexFormat이 반드시 undefined이어야 함
            this.primitiveState.stripIndexFormat = undefined;
            this.primitiveState.topology = GPU_PRIMITIVE_TOPOLOGY.TRIANGLE_LIST;
        }
    }

    /**
     * [KO] 타일의 월드 X 위치를 반환합니다.
     * [EN] Returns the tile's world X position.
     */
    public get tileX(): number {
        return this.#tileX;
    }

    /**
     * [KO] 타일의 월드 Z 위치를 반환합니다.
     * [EN] Returns the tile's world Z position.
     */
    public get tileZ(): number {
        return this.#tileZ;
    }

    /**
     * [KO] 현재 타일의 LOD 레벨을 반환합니다.
     * [EN] Returns the tile's current LOD level.
     */
    public get lodLevel(): number {
        return this.#lodLevel;
    }

    /**
     * [KO] 타일의 LOD 레벨을 변경하며 지오메트리를 자동으로 교체 바인딩합니다.
     * [EN] Sets the tile's LOD level and automatically swaps the bound geometry.
     */
    public set lodLevel(value: number) {
        if (this.#lodLevel !== value) {
            this.#lodLevel = value;
            this.geometry = this.#sharedGeometry.getGeometry(value);
        }
    }
}

export default LandscapeComponent;
