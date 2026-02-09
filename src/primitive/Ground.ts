import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * [KO] Ground(그라운드) 기본 도형 클래스입니다.
 * [EN] Ground primitive geometry class.
 *
 * [KO] XZ 평면에 배치된 평면 데이터를 생성하여 관리합니다. 주로 바닥이나 지형의 기반으로 사용됩니다.
 * [EN] Generates and manages planar data placed on the XZ plane. Primarily used as a base for floors or terrain.
 *
 * ### Example
 * ```typescript
 * // 10x10 크기의 그라운드 생성
 * const ground = new RedGPU.Ground(redGPUContext, 10, 10);
 * ```
 * <iframe src="/RedGPU/examples/3d/primitive/ground/" style="width:100%; height:500px;"></iframe>
 * @category Primitive
 */
class Ground extends Primitive {
    #makeData = (function () {
        const interleaveData = [];
        const indexData = [];
        return function (uniqueKey, redGPUContext, width, height, wSegments, hSegments, uvSize, flipY) {
            const width_half = width / 2;
            const height_half = height / 2;
            const gridX = Math.floor(wSegments) || 1;
            const gridY = Math.floor(hSegments) || 1;
            const gridX1 = gridX + 1;
            const gridY1 = gridY + 1;
            const segment_width = width / gridX;
            const segment_height = height / gridY;
            interleaveData.length = 0;
            indexData.length = 0;
            // Ground는 XZ 평면에 배치 (Y=0이 땅 높이)
            for (let iy = 0; iy < gridY1; iy++) {
                const tZ = iy * segment_height - height_half;
                const uvY = flipY ? (1 - iy / gridY) * uvSize : (iy / gridY) * uvSize;
                for (let ix = 0; ix < gridX1; ix++) {
                    const tX = ix * segment_width - width_half;
                    const uvX = ix / gridX * uvSize;
                    interleaveData.push(
                        tX,    // x
                        0,     // y (땅 높이)
                        tZ,    // z (기존 Plane의 -tY와 같은 패턴)
                        0,     // normal x
                        1,     // normal y (위쪽)
                        0,     // normal z
                        uvX,   // u
                        uvY    // v
                    );
                    if (iy < gridY && ix < gridX) {
                        const a = ix + gridX1 * iy;
                        const b = ix + gridX1 * (iy + 1);
                        const c = (ix + 1) + gridX1 * (iy + 1);
                        const d = (ix + 1) + gridX1 * iy;
                        indexData.push(a, b, d);
                        indexData.push(b, c, d);
                    }
                }
            }
            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
        };
    })();

    /**
     * [KO] Ground 인스턴스를 생성합니다.
     * [EN] Creates an instance of Ground.
     * 
     * ### Example
     * ```typescript
     * const ground = new RedGPU.Ground(redGPUContext, 10, 10, 1, 1, 1, false);
     * ```
     *
     * @param redGPUContext - 
     * [KO] RedGPUContext 인스턴스 
     * [EN] RedGPUContext instance
     * @param width - 
     * [KO] 가로 길이 (기본값 1) 
     * [EN] Width (default 1)
     * @param height - 
     * [KO] 세로 길이 (기본값 1) 
     * [EN] Height (default 1)
     * @param wSegments - 
     * [KO] 가로(X축) 세그먼트 수 (기본값 1) 
     * [EN] Width (X-axis) segments (default 1)
     * @param hSegments - 
     * [KO] 세로(Z축) 세그먼트 수 (기본값 1) 
     * [EN] Height (Z-axis) segments (default 1)
     * @param uvSize - 
     * [KO] UV 스케일 (기본값 1) 
     * [EN] UV scale (default 1)
     * @param flipY - 
     * [KO] Y축 UV 뒤집기 여부 (기본값 false) 
     * [EN] Whether to flip UV on the Y-axis (default false)
     */
    constructor(redGPUContext: RedGPUContext, width = 1, height = 1, wSegments = 1, hSegments = 1, uvSize = 1, flipY = false) {
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_GROUND_W${width}_H${height}_WS${wSegments}_HS${hSegments}_UV${uvSize}_FY${flipY}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
        let geometry = cachedBufferState[uniqueKey];
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, width, height, wSegments, hSegments, uvSize, flipY);
        }
        this._setData(geometry);
    }
}

export default Ground;
