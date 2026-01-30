import {vec3} from "gl-matrix";
import RedGPUContext from "../context/RedGPUContext";
import createPrimitiveGeometry from "./core/createPrimitiveGeometry";
import Primitive from "./core/Primitive";

/**
 * [KO] Capsule(캡슐) 기본 도형 클래스입니다.
 * [EN] Capsule primitive geometry class.
 *
 * [KO] 반지름, 실린더 높이 등을 기반으로 캡슐 형태의 정점 및 인덱스 데이터를 생성하여 관리합니다.
 * [EN] Generates and manages vertex and index data for a capsule based on radius, cylinder height, etc.
 *
 * * ### Example
 * ```typescript
 * // 반지름 0.5, 실린더 높이 1, 세그먼트들을 설정하여 캡슐 생성
 * const capsule = new RedGPU.Primitive.Capsule(redGPUContext, 0.5, 1, 32, 1, 12);
 * ```
 * @category Primitive
 */
class Capsule extends Primitive {
    #makeData = (function () {
        return function (
            uniqueKey: string,
            redGPUContext: RedGPUContext,
            radius: number,
            cylinderHeight: number,
            radialSegments: number,
            heightSegments: number,
            capSegments: number
        ) {
            const interleaveData: number[] = [];
            const indexData: number[] = [];
            const grid: number[][] = [];
            let index = 0;

            const totalVerticalSegments = capSegments * 2 + heightSegments;
            const halfCylinderHeight = cylinderHeight / 2;

            const capArcLength = (Math.PI / 2) * radius;
            const totalArcLength = capArcLength * 2 + cylinderHeight;

            for (let iy = 0; iy <= totalVerticalSegments; iy++) {
                const verticesRow: number[] = [];
                let y = 0;
                let currentRadius = 0;
                let currentDistance = 0;

                if (iy < capSegments) {
                    // Top Cap
                    const theta = (iy / capSegments) * (Math.PI / 2);
                    y = halfCylinderHeight + radius * Math.cos(theta);
                    currentRadius = radius * Math.sin(theta);
                    currentDistance = (iy / capSegments) * capArcLength;
                } else if (iy <= capSegments + heightSegments) {
                    // Cylinder Body
                    const t = (iy - capSegments) / heightSegments;
                    y = halfCylinderHeight - t * cylinderHeight;
                    currentRadius = radius;
                    currentDistance = capArcLength + t * cylinderHeight;
                } else {
                    // Bottom Cap
                    const t = (iy - (capSegments + heightSegments)) / capSegments;
                    const theta = (Math.PI / 2) + t * (Math.PI / 2);
                    y = -halfCylinderHeight + radius * Math.cos(theta);
                    currentRadius = radius * Math.sin(theta);
                    currentDistance = capArcLength + cylinderHeight + t * capArcLength;
                }

                const v = currentDistance / totalArcLength;

                for (let ix = 0; ix <= radialSegments; ix++) {
                    const u = ix / radialSegments;
                    const phi = u * Math.PI * 2;

                    const sinPhi = Math.sin(phi);
                    const cosPhi = Math.cos(phi);

                    const x = currentRadius * sinPhi;
                    const z = currentRadius * cosPhi;

                    // Position
                    interleaveData.push(x, y, z);

                    // Normal
                    const normal = vec3.fromValues(x, (iy < capSegments || iy > capSegments + heightSegments) ? (y - (iy < capSegments ? halfCylinderHeight : -halfCylinderHeight)) : 0, z);
                    vec3.normalize(normal, normal);
                    interleaveData.push(normal[0], normal[1], normal[2]);

                    // UV
                    interleaveData.push(u, 1 - v);

                    verticesRow.push(index++);
                }
                grid.push(verticesRow);
            }

            // Indices
            for (let iy = 0; iy < totalVerticalSegments; iy++) {
                for (let ix = 0; ix < radialSegments; ix++) {
                    const a = grid[iy][ix + 1];
                    const b = grid[iy][ix];
                    const c = grid[iy + 1][ix];
                    const d = grid[iy + 1][ix + 1];

                    indexData.push(a, b, d);
                    indexData.push(b, c, d);
                }
            }

            return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
        };
    })();

    /**
     * [KO] Capsule 인스턴스를 생성합니다.
     * [EN] Creates an instance of Capsule.
     * 
     * @param redGPUContext - 
     * [KO] RedGPUContext 인스턴스 
     * [EN] RedGPUContext instance
     * @param radius - 
     * [KO] 반지름 (기본값 0.5)
     * [EN] Radius (default 0.5)
     * @param cylinderHeight - 
     * [KO] 실린더 부분 높이 (기본값 1.0)
     * [EN] Cylinder part height (default 1.0)
     * @param radialSegments - 
     * [KO] 원주 방향 분할 수 (기본값 32)
     * [EN] Radial segments (default 32)
     * @param heightSegments - 
     * [KO] 실린더 부분의 높이 방향 분할 수 (기본값 1)
     * [EN] Height segments for cylinder part (default 1)
     * @param capSegments - 
     * [KO] 상/하단 반구의 세로 분할 수 (기본값 12)
     * [EN] Cap segments for hemispheres (default 12)
     */
    constructor(
        redGPUContext: RedGPUContext,
        radius: number = 0.5,
        cylinderHeight: number = 1.0,
        radialSegments: number = 32,
        heightSegments: number = 1,
        capSegments: number = 12
    ) {
        super(redGPUContext);
        const uniqueKey = `PRIMITIVE_CAPSULE_R${radius}_CH${cylinderHeight}_RS${radialSegments}_HS${heightSegments}_CS${capSegments}`;
        const cachedBufferState = redGPUContext.resourceManager.cachedBufferState;
        let geometry = cachedBufferState[uniqueKey];
        if (!geometry) {
            geometry = cachedBufferState[uniqueKey] = this.#makeData(
                uniqueKey, redGPUContext, radius, cylinderHeight,
                radialSegments, heightSegments, capSegments
            );
        }
        this._setData(geometry);
    }
}

export default Capsule;
