import RedGPUContext from "../context/RedGPUContext";
import Ground from "../primitive/Ground";
import Mesh from "../display/mesh/Mesh";
import LakeMaterial from "./lakeCore/LakeMaterial";
import RenderViewStateData from "../display/view/core/RenderViewStateData";
/**
 * [KO] 실시간 파동 및 객체 상호작용 물결을 표현하는 호수 수면 메시 클래스입니다.
 * [EN] Lake water surface mesh class representing real-time waves and object interaction ripples.
 *
 * ### Example
 * ```typescript
 * const lake = new RedGPU.Water.Lake(redGPUContext);
 * scene.addWater(lake);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/water/lake/basicLake/" style="width:100%; height:500px;"></iframe>
 *
 * @see [Basic lake example](/RedGPU/examples/3d/water/lake/basicLake/)
 * @see [Lake material example](/RedGPU/examples/3d/water/lake/lakeMaterial/)
 * @see [Multi lake example](/RedGPU/examples/3d/water/lake/multiLake/)
 * @see [Lake interaction example](/RedGPU/examples/3d/water/lake/interaction/)
 * @see [Character walking example](/RedGPU/examples/3d/water/lake/characterWalking/)
 * @see [Lake with landscape example](/RedGPU/examples/3d/water/lake/lakeWithLandscape/)
 * @category Water
 */
declare class Lake extends Mesh {
    #private;
    /**
     * [KO] `Lake` 인스턴스를 생성합니다.
     * [EN] Creates a `Lake` instance.
     *
     * ### Example
     * ```typescript
     * const lake = new RedGPU.Water.Lake(redGPUContext, 100, 100, 64, 64);
     * ```
     *
     * @param redGPUContext -
     * [KO] `RedGPUContext` 인스턴스
     * [EN] `RedGPUContext` instance
     * @param width -
     * [KO] 호수 가로 크기 (기본값: `100`)
     * [EN] Width of the lake (default: `100`)
     * @param height -
     * [KO] 호수 세로 크기 (기본값: `100`)
     * [EN] Height of the lake (default: `100`)
     * @param widthSegments -
     * [KO] 가로 방향 세그먼트 수 (기본값: `64`)
     * [EN] Number of width segments (default: `64`)
     * @param heightSegments -
     * [KO] 세로 방향 세그먼트 수 (기본값: `64`)
     * [EN] Number of height segments (default: `64`)
     */
    constructor(redGPUContext: RedGPUContext, width?: number, height?: number, widthSegments?: number, heightSegments?: number);
    /**
     * [KO] 수면 객체 여부를 반환합니다.
     * [EN] Returns whether this object is a water surface.
     *
     * @returns
     * [KO] 수면 객체 여부 (`true`)
     * [EN] Whether this is a water surface (`true`)
     */
    get isWater(): boolean;
    set waveAmplitude(value: number);
    /**
     * [KO] 정점 파동의 진폭입니다. (최소값: `0`, 기본값: `0.025`)
     * [EN] Vertex wave amplitude. (Min: `0`, default: `0.025`)
     *
     * @returns
     * [KO] 정점 파동 진폭
     * [EN] Vertex wave amplitude
     */
    get waveAmplitude(): number;
    set waveWavelength(value: number);
    /**
     * [KO] 정점 파동의 파장입니다. (최소값: `0.1`, 기본값: `16.0`)
     * [EN] Vertex wave wavelength. (Min: `0.1`, default: `16.0`)
     *
     * @returns
     * [KO] 정점 파동 파장
     * [EN] Vertex wave wavelength
     */
    get waveWavelength(): number;
    set interactionFollowTarget(target: Mesh | null);
    /**
     * [KO] 상호작용 시뮬레이션 중심이 추적할 대상 메시입니다. `null`이면 호수 중심을 기준으로 동작합니다.
     * [EN] Target mesh tracked as the center of the interaction simulation. If `null`, operates around the lake center.
     *
     * @returns
     * [KO] 추적 대상 `Mesh` 또는 `null`
     * [EN] Tracked target `Mesh` or `null`
     */
    get interactionFollowTarget(): Mesh | null;
    set interactionEnabled(value: boolean);
    /**
     * [KO] 수면 상호작용 시뮬레이션 활성화 여부입니다. (기본값: `true`)
     * [EN] Whether water surface interaction simulation is enabled. (Default: `true`)
     *
     * @returns
     * [KO] 상호작용 활성화 여부
     * [EN] Whether interaction is enabled
     */
    get interactionEnabled(): boolean;
    /**
     * [KO] 호수 수면에 적용된 `LakeMaterial` 인스턴스를 반환합니다.
     * [EN] Returns the `LakeMaterial` instance applied to the lake surface.
     *
     * @returns
     * [KO] `LakeMaterial` 인스턴스
     * [EN] `LakeMaterial` instance
     */
    get material(): LakeMaterial;
    /**
     * [KO] 호수 수면의 `Ground` 지오메트리 인스턴스를 반환합니다.
     * [EN] Returns the `Ground` geometry instance of the lake surface.
     *
     * @returns
     * [KO] `Ground` 지오메트리 인스턴스
     * [EN] `Ground` geometry instance
     */
    get geometry(): Ground;
    /**
     * [KO] 상호작용 물결의 전파 속도입니다. (기본값: `0.32`)
     * [EN] Propagation speed of interaction ripples. (Default: `0.32`)
     *
     * @returns
     * [KO] 물결 전파 속도
     * [EN] Ripple propagation speed
     */
    get rippleWaveSpeed(): number;
    set rippleWaveSpeed(value: number);
    /**
     * [KO] 상호작용 물결의 감쇠율입니다. (기본값: `0.012`)
     * [EN] Damping factor of interaction ripples. (Default: `0.012`)
     *
     * @returns
     * [KO] 물결 감쇠율
     * [EN] Ripple damping factor
     */
    get rippleDamping(): number;
    set rippleDamping(value: number);
    /**
     * [KO] 상호작용 물결의 노멀 강도입니다. (기본값: `1.0`)
     * [EN] Normal strength of interaction ripples. (Default: `1.0`)
     *
     * @returns
     * [KO] 물결 노멀 강도
     * [EN] Ripple normal strength
     */
    get rippleNormalStrength(): number;
    set rippleNormalStrength(value: number);
    /**
     * [KO] 호수 수면의 월드 Y 좌표(`this.y`)입니다.
     * [EN] World Y coordinate (`this.y`) of the lake surface.
     *
     * @returns
     * [KO] 수면 높이 Y 좌표
     * [EN] Water surface Y coordinate
     */
    get waterLevel(): number;
    set waterLevel(value: number);
    /**
     * [KO] 수면 상호작용을 갱신하고 호수 메시를 렌더링합니다.
     * [EN] Updates water surface interaction and renders the lake mesh.
     *
     * @param renderViewStateData -
     * [KO] 현재 뷰의 렌더 상태 데이터
     * [EN] Render state data of the current view
     */
    render(renderViewStateData: RenderViewStateData): void;
    /**
     * [KO] 호수 정점 셰이더 모듈을 생성합니다.
     * [EN] Creates the lake vertex shader module.
     *
     * @returns
     * [KO] 생성된 `GPUShaderModule`
     * [EN] Created `GPUShaderModule`
     */
    createCustomMeshVertexShaderModule: () => GPUShaderModule;
    /**
     * [KO] `Lake` 인스턴스와 내부 GPU 리소스를 해제합니다.
     * [EN] Destroys the `Lake` instance and releases internal GPU resources.
     */
    destroy(): void;
}
export default Lake;
