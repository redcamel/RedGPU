import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import Landscape from "../../../Landscape";
import LANDSCAPE_DEFAULT_LOD_COLORS from "../../../LANDSCAPE_DEFAULT_LOD_COLORS";

const UNLOADED_COLOR = 'rgba(255, 255, 255, 0.08)';
const LOD_RGBA_STRINGS: readonly string[] = Object.freeze(
    LANDSCAPE_DEFAULT_LOD_COLORS.map(([r, g, b]) =>
        `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, 0.75)`
    )
);

/**
 * [KO] 지형(Landscape) 타일 컴포넌트의 로드 여부와 카메라 거리에 따른 LOD 단계를 2D 그리드 오버레이로 시각화하는 디버거 클래스입니다.
 * [EN] Debugger class that visualizes the loaded status and distance-based LOD levels of `Landscape` tile components as a 2D grid overlay.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Debugger
 */
class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #ctx: CanvasRenderingContext2D | null;

    /**
     * [KO] `LandscapeSpatialGridDebugger` 인스턴스를 생성합니다.
     * [EN] Creates a `LandscapeSpatialGridDebugger` instance.
     *
     * @param landscape -
     * [KO] 대상 지형 인스턴스
     * [EN] Target `Landscape` instance
     * @param cameraOrOptions -
     * [KO] 추적할 카메라 인스턴스 또는 디버거 설정 옵션
     * [EN] Camera instance to track or debugger configuration options
     * @param options -
     * [KO] 디버거 UI 배치 및 크기 옵션
     * [EN] Debugger UI placement and size options
     */
    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'Spatial Grid (LOD)',
            ...options
        };
        super(landscape, cameraOrOptions, defaultOptions);
        this.#ctx = this.canvas.getContext('2d');
    }

    /**
     * [KO] 지형 타일별 로드 상태 및 LOD 단계를 계산하여 2D 그리드와 카메라 오버레이를 갱신합니다.
     * [EN] Calculates the load state and LOD level for each landscape tile and updates the 2D grid and camera overlay.
     */
    update(): void {
        if (!this.visible || !this.#ctx || !this.landscape) return;

        const dpr = this.dpr || 1;
        const {contentWidth, contentHeight} = this;

        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#ctx.save();
        this.#ctx.scale(dpr, dpr);

        const lodColorStrings = LOD_RGBA_STRINGS;
        const maxColorIndex = lodColorStrings.length - 1;

        const cameraState = this.getCameraState();
        const camX = cameraState?.camX ?? 0;
        const camZ = cameraState?.camZ ?? 0;

        const components = this.landscape.components || [];
        const [tcX, tcZ] = this.landscape.componentCount;
        const cellW = contentWidth / tcX;
        const cellH = contentHeight / tcZ;

        const lodDistancesSq = this.landscape.lodDistancesSq || [];
        const lodDistCount = lodDistancesSq.length;
        const lodMaxLevel = this.landscape.lodMaxLevel ?? 5;

        const activeCount = components.length;
        for (let i = 0; i < activeCount; i++) {
            const comp = components[i];
            const cx = comp.componentX * cellW;
            const cy = comp.componentZ * cellH;

            const isLoaded = this.landscape.isTileLoaded(comp.componentZ, comp.componentX);

            if (isLoaded) {
                const {worldX, worldZ} = comp;
                const dx = worldX - camX;
                const dz = worldZ - camZ;
                const distSq = dx * dx + dz * dz;

                let lod = lodMaxLevel - 1;
                for (let l = 0; l < lodDistCount; l++) {
                    if (distSq <= lodDistancesSq[l]) {
                        lod = l;
                        break;
                    }
                }

                const colorIdx = Math.max(0, Math.min(lod, maxColorIndex));
                this.#ctx.fillStyle = lodColorStrings[colorIdx] ?? lodColorStrings[0];
            } else {
                this.#ctx.fillStyle = UNLOADED_COLOR;
            }

            this.#ctx.fillRect(cx, cy, cellW, cellH);
        }

        this.#ctx.restore();

        this.renderOverlay();
    }

    /**
     * [KO] 디버거 DOM 요소 및 2D 렌더링 컨텍스트 참조를 해제합니다.
     * [EN] Destroys debugger DOM elements and releases the 2D rendering context reference.
     */
    override destroy(): void {
        super.destroy();
        this.#ctx = null;
    }
}

Object.freeze(LandscapeSpatialGridDebugger);
export default LandscapeSpatialGridDebugger;

