import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * Class representing a Circle primitive.
 * @extends Primitive
 */
class Circle extends Primitive {
	#makeData = (function () {
		return function (
			uniqueKey: string,
			redGPUContext: RedGPUContext,
			radius: number,
			segments: number,
			thetaStart: number,
			thetaLength: number
		) {
			const interleaveData: number[] = [];
			const indexData: number[] = [];

			// 중심점 추가 (인덱스 0)
			interleaveData.push(
				0, 0, 0,        // 위치: 원점
				0, 0, 1,        // 노멀: Z축 양의 방향
				0.5, 0.5        // UV: 텍스처 중심
			);

			// 원주 정점들 생성
			for (let s = 0; s <= segments; s++) {
				const angle = thetaStart + (s / segments) * thetaLength;
				const x = Math.cos(angle);
				const y = Math.sin(angle);

				// 위치 계산
				const posX = radius * x;
				const posY = radius * y;
				const posZ = 0;

				// UV 좌표 계산 (정규화된 x, y를 0~1 범위로 변환)
				const u = (x + 1) / 2;
				const v = (y + 1) / 2;

				interleaveData.push(
					posX, posY, posZ,  // 위치
					0, 0, 1,           // 노멀 (Z축)
					u, v               // UV 좌표
				);
			}

			// 인덱스 생성 (팬 형태)
			for (let i = 1; i <= segments; i++) {
				// 중심점(0) -> 현재 정점(i) -> 다음 정점(i+1)
				indexData.push(0, i, i + 1);
			}

			return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
		};
	})();

	/**
	 * Creates a new instance of the Circle class.
	 * @param {RedGPUContext} redGPUContext - The RedGPUContext instance.
	 * @param {number} [radius=1] - The radius of the circle.
	 * @param {number} [segments=32] - The number of segments in the circle.
	 * @param {number} [thetaStart=0] - The angle at which the circle starts.
	 * @param {number} [thetaLength=Math.PI * 2] - The length of the arc in radians.
	 */
	constructor(
		redGPUContext: RedGPUContext,
		radius: number = 1,
		segments: number = 32,
		thetaStart: number = 0,
		thetaLength: number = Math.PI * 2
	) {
		super(redGPUContext);

		// 유효성 검사
		if (segments < 3) {
			throw new Error('segments must be 3 or greater');
		}
		if (radius <= 0) {
			throw new Error('radius must be greater than 0');
		}
		if (thetaLength <= 0) {
			throw new Error('thetaLength must be greater than 0');
		}

		const uniqueKey = `PRIMITIVE_CIRCLE_R${radius}_S${segments}_TS${thetaStart}_TL${thetaLength}`;
		const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
		let geometry = cachedBufferState[uniqueKey];
		if (!geometry) {
			geometry = cachedBufferState[uniqueKey] = this.#makeData(
				uniqueKey, redGPUContext, radius, segments, thetaStart, thetaLength
			);
		}
		this._setData(geometry);
	}
}

export default Circle;
