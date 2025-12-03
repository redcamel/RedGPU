import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * Circle(원) 기본 도형 클래스입니다.
 * 반지름, 세그먼트, 시작 각도, 각도 길이 등 다양한 파라미터로 2D 원형 메시를 생성합니다.
 *
 * @example
 * ```javascript
 * // 반지름 2, 세그먼트 64짜리 원 생성 및 씬에 추가
 * const circle = new RedGPU.Primitive.Circle(redGPUContext, 2, 64);
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/primitive/circle/"></iframe>
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
     * Circle 생성자
     * @param redGPUContext RedGPUContext 인스턴스
     * @param radius 원 반지름 (기본값 1)
     * @param segments 세그먼트 수 (기본값 32, 최소 3)
     * @param thetaStart 시작 각도(라디안, 기본값 0)
     * @param thetaLength 원호 각도(라디안, 기본값 2*PI)
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
