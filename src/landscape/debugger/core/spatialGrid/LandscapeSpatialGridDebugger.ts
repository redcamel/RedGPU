import ALandscapeDebugger, {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import Landscape from "../../../Landscape";
import {LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS} from "../../../LANDSCAPE_DEFAULT_LOD_COLORS";

const UNLOADED_COLOR = 'rgba(255, 255, 255, 0.08)';

/**
 * [KO] 공간 그리드의 각 타일 로딩 여부 및 거리별 LOD 레벨 색상을 2D 캔버스에 실시간으로 시각화하는 디버거 클래스입니다.
 * [EN] Real-time debugger visualizing tile load states and distance-based LOD colors across the spatial grid on a 2D canvas.
 */
export class LandscapeSpatialGridDebugger extends ALandscapeDebugger {
    #ctx: CanvasRenderingContext2D | null;

    /**
     * [KO] LandscapeSpatialGridDebugger 생성자입니다.
     * [EN] Constructor for LandscapeSpatialGridDebugger.
     *
     * @param landscape - [KO] 대상 Landscape 인스턴스 / [EN] Target Landscape instance
     * @param cameraOrOptions - [KO] 카메라 인스턴스 또는 디버거 옵션 / [EN] Camera instance or debugger options
     * @param options - [KO] 디버거 옵션 / [EN] Debugger options
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
     * [KO] 매 프레임 타일별 로딩 상태와 LOD 단계 색상을 캔버스에 그리고 오버레이를 갱신합니다.
     * [EN] Draws tile load states and LOD colors on canvas and updates the 2D overlay each frame.
     */
    update(): void {
        if (!this.visible || !this.#ctx || !this.landscape) return;

        const dpr = this.dpr || 1;
        const w = this.contentWidth;
        const h = this.contentHeight;

        this.#ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.#ctx.save();
        this.#ctx.scale(dpr, dpr);

        const lodColorStrings = LANDSCAPE_DEFAULT_LOD_RGBA_STRINGS;
        const maxColorIndex = lodColorStrings.length - 1;

        const cameraState = this.getCameraState();
        const camX = cameraState?.camX ?? 0;
        const camZ = cameraState?.camZ ?? 0;

        const components = this.landscape.components || [];
        const [tcX, tcZ] = this.landscape.componentCount;
        const cellW = w / tcX;
        const cellH = h / tcZ;

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
                const centerX = comp.worldX;
                const centerZ = comp.worldZ;
                const dx = centerX - camX;
                const dz = centerZ - camZ;
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
     * [KO] 2D 캔버스 컨텍스트 참조를 해제하고 부모 디버거를 파괴합니다.
     * [EN] Releases 2D canvas context reference and destroys parent debugger.
     */
    override destroy(): void {
        super.destroy();
        this.#ctx = null;
    }
}

Object.freeze(LandscapeSpatialGridDebugger);
export default LandscapeSpatialGridDebugger;
