import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * Plane(평면) 기본 도형 클래스입니다.
 * XY 평면에 배치된 메시로, 세그먼트, UV 스케일, Y축 뒤집기 등 다양한 파라미터를 지원합니다.
 *
 * @example
 * ```javascript
 * // 5x5 크기, 8x8 세그먼트, UV 2배, Y축 뒤집기 없이 생성 및 씬에 추가
 * const plane = new RedGPU.Primitive.Plane(redGPUContext, 5, 5, 8, 8, 2, false);

 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/plane/"></iframe>
 *
 * @param redGPUContext RedGPUContext 인스턴스
 * @param width 가로 길이 (기본값 1)
 * @param height 세로 길이 (기본값 1)
 * @param wSegments X축 세그먼트 수 (기본값 1)
 * @param hSegments Y축 세그먼트 수 (기본값 1)
 * @param uvSize UV 스케일 (기본값 1)
 * @param flipY Y축 UV 뒤집기 여부 (기본값 false)
 */
class Plane extends Primitive {
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
			for (let iy = 0; iy < gridY1; iy++) {
				const tY = iy * segment_height - height_half;
				const uvY = flipY ? (1 - iy / gridY) * uvSize : (iy / gridY) * uvSize;
				for (let ix = 0; ix < gridX1; ix++) {
					const tX = ix * segment_width - width_half;
					const texcoord = ix / gridX * uvSize;
					interleaveData.push(
						tX,
						-tY,
						0,
						0,
						0,
						1,
						texcoord,
						uvY
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
			return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey)
		};
	})();

	constructor(redGPUContext: RedGPUContext, width = 1, height = 1, wSegments = 1, hSegments = 1, uvSize = 1, flipY = false) {
		super(redGPUContext);
		const uniqueKey = `PRIMITIVE_PLANE_W${width}_H${height}_WS${wSegments}_HS${hSegments}_UV${uvSize}_FY${flipY}`;
		const cachedBufferState = redGPUContext.resourceManager.cachedBufferState
		let geometry = cachedBufferState[uniqueKey]
		if (!geometry) {
			geometry = cachedBufferState[uniqueKey] = this.#makeData(uniqueKey, redGPUContext, width, height, wSegments, hSegments, uvSize, flipY)
		}
		this._setData(geometry)
	}
}

export default Plane
