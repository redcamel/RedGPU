import {calculateTangentsInterleaved} from "../../math/calculateTangents";
import createPrimitiveGeometry from "./createPrimitiveGeometry";
import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
import Primitive from "./Primitive";

/**
 * [KO] 기본 도형(Primitive)의 정점, 인덱스, 법선, 탄젠트 데이터를 생성하는 정적 유틸리티 클래스입니다.
 * [EN] Static utility class that generates vertex, index, normal, and tangent data for primitive geometries.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Core
 */
class PrimitiveUtils {
    static readonly #BASIS_U = {x: 1, y: 0, z: 0};
    static readonly #BASIS_V = {x: 0, y: 0, z: -1};
    static readonly #ZERO_VECTOR = {x: 0, y: 0, z: 0};
    static readonly #AXIS_UP = {x: 0, y: 1, z: 0};
    static readonly #AXIS_DOWN = {x: 0, y: -1, z: 0};

    static readonly #SCRATCH_V1 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V2 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V3 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V4 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V5 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V6 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V7 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V8 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V9 = {x: 0, y: 0, z: 0};
    static readonly #SCRATCH_V10 = {x: 0, y: 0, z: 0};

    static get #STRIDE_FLOATS(): number {
        return Primitive.primitiveInterleaveStruct.arrayStride / 4;
    }

    /**
     * [KO] 인터리브 정점 데이터에 탄젠트를 계산하여 반영한 뒤 `Geometry` 인스턴스를 생성합니다.
     * [EN] Calculates tangents for the interleaved vertex data and creates a `Geometry` instance.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>`)
     * [EN] Index data array (`Array<number>`)
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static finalize(redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry {
        this.calculateTangents(interleaveData, indexData);
        return createPrimitiveGeometry(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 2D UV 그리드를 순회하며 정점 콜백을 실행하고 그리드 인덱스를 생성합니다.
     * [EN] Iterates over a 2D UV grid, executes the vertex callback, and generates grid indices.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>`)
     * [EN] Index data array (`Array<number>`)
     * @param resolutionX -
     * [KO] 가로(X) 방향 분할 수
     * [EN] Horizontal (X) resolution
     * @param resolutionY -
     * [KO] 세로(Y) 방향 분할 수
     * [EN] Vertical (Y) resolution
     * @param vertexCallback -
     * [KO] 각 그리드 정점마다 호출되는 콜백 함수
     * [EN] Callback function invoked for each grid vertex
     * @param skipIndices -
     * [KO] 인덱스 생성 생략 여부 (기본값: `false`)
     * [EN] Whether to skip index generation (default: `false`)
     * @param reverseIndices -
     * [KO] 인덱스 와인딩 순서 반전 여부 (기본값: `false`)
     * [EN] Whether to reverse index winding order (default: `false`)
     */
    static generateGrid(interleaveData: number[], indexData: number[], resolutionX: number, resolutionY: number, vertexCallback: (u: number, v: number, ix: number, iy: number) => void, skipIndices: boolean = false, reverseIndices: boolean = false) {
        const vertexOffset = interleaveData.length / this.#STRIDE_FLOATS;
        for (let iy = 0; iy <= resolutionY; iy++) {
            const v = iy / resolutionY;
            for (let ix = 0; ix <= resolutionX; ix++) {
                vertexCallback(ix / resolutionX, v, ix, iy);
            }
        }
        if (!skipIndices && indexData) this.generateGridIndices(indexData, vertexOffset, resolutionX, resolutionY, resolutionX + 1, reverseIndices);
    }

    /**
     * [KO] 유효하지 않은 치수일 때 사용할 최소 정점의 빈 `Geometry` 인스턴스를 반환합니다.
     * [EN] Returns an empty `Geometry` instance with minimal vertex data for invalid dimensions.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 빈 `Geometry` 인스턴스
     * [EN] Empty `Geometry` instance
     */
    static getEmptyGeometry(redGPUContext: RedGPUContext, uniqueKey: string): Geometry {
        const interleaveData = [];
        this.interleavePacker(interleaveData, 0, 0, 0, 0, 1, 0, 0, 0);
        return createPrimitiveGeometry(redGPUContext, interleaveData, [], uniqueKey);
    }

    /**
     * [KO] 직육면체(Box) 지오메트리 데이터를 생성합니다.
     * [EN] Generates box geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로 길이
     * [EN] Width
     * @param height -
     * [KO] 세로 길이
     * [EN] Height
     * @param depth -
     * [KO] 깊이 길이
     * [EN] Depth
     * @param widthSegments -
     * [KO] 가로 방향 세그먼트 수
     * [EN] Number of width segments
     * @param heightSegments -
     * [KO] 세로 방향 세그먼트 수
     * [EN] Number of height segments
     * @param depthSegments -
     * [KO] 깊이 방향 세그먼트 수
     * [EN] Number of depth segments
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, uniqueKey: string): Geometry {
        return this.generateRoundedBoxData(redGPUContext, width, height, depth, widthSegments, heightSegments, depthSegments, 0, 0, uniqueKey);
    }

    /**
     * [KO] 모서리가 둥근 직육면체(RoundedBox) 지오메트리 데이터를 생성합니다.
     * [EN] Generates rounded box geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로 길이
     * [EN] Width
     * @param height -
     * [KO] 세로 길이
     * [EN] Height
     * @param depth -
     * [KO] 깊이 길이
     * [EN] Depth
     * @param widthSegments -
     * [KO] 가로 방향 세그먼트 수
     * [EN] Number of width segments
     * @param heightSegments -
     * [KO] 세로 방향 세그먼트 수
     * [EN] Number of height segments
     * @param depthSegments -
     * [KO] 깊이 방향 세그먼트 수
     * [EN] Number of depth segments
     * @param radius -
     * [KO] 모서리 곡률 반지름
     * [EN] Corner chamfer radius
     * @param radiusSegments -
     * [KO] 모서리 곡면 분할 세그먼트 수
     * [EN] Number of corner radius segments
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateRoundedBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, radius: number, radiusSegments: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], w2 = width / 2, h2 = height / 2, d2 = depth / 2;
        const r = Math.min(radius, w2, h2, d2);
        const boxDim = r > 0 ? {w: width, h: height, d: depth, r} : null;

        this.generatePlaneData(interleaveData, indexData, depth, height, depthSegments, heightSegments, {
            x: w2,
            y: 0,
            z: 0
        }, {x: 0, y: 0, z: -1}, {x: 0, y: -1, z: 0}, {x: 1, y: 0, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, depth, height, depthSegments, heightSegments, {
            x: -w2,
            y: 0,
            z: 0
        }, {x: 0, y: 0, z: 1}, {x: 0, y: -1, z: 0}, {x: -1, y: 0, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, depth, widthSegments, depthSegments, {
            x: 0,
            y: h2,
            z: 0
        }, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: 1}, {x: 0, y: 1, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, depth, widthSegments, depthSegments, {
            x: 0,
            y: -h2,
            z: 0
        }, {x: 1, y: 0, z: 0}, {x: 0, y: 0, z: -1}, {x: 0, y: -1, z: 0}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {
            x: 0,
            y: 0,
            z: d2
        }, {x: 1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: 1}, r, radiusSegments, boxDim);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, {
            x: 0,
            y: 0,
            z: -d2
        }, {x: -1, y: 0, z: 0}, {x: 0, y: -1, z: 0}, {x: 0, y: 0, z: -1}, r, radiusSegments, boxDim);

        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 기저 벡터와 중심점을 기준으로 평면(또는 둥근 박스 면) 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.
     * [EN] Appends plane (or rounded box face) vertex and index data to the buffer arrays based on basis vectors and center point.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>`)
     * [EN] Index data array (`Array<number>`)
     * @param width -
     * [KO] 평면 너비
     * [EN] Plane width
     * @param height -
     * [KO] 평면 높이
     * [EN] Plane height
     * @param mainSegmentsX -
     * [KO] 가로 방향 기본 세그먼트 수
     * [EN] Main horizontal segments
     * @param mainSegmentsY -
     * [KO] 세로 방향 기본 세그먼트 수
     * [EN] Main vertical segments
     * @param center -
     * [KO] 평면 중심 좌표
     * [EN] Plane center coordinates
     * @param uV -
     * [KO] 가로(U) 방향 기저 벡터
     * [EN] Horizontal (U) basis vector
     * @param vV -
     * [KO] 세로(V) 방향 기저 벡터
     * [EN] Vertical (V) basis vector
     * @param normal -
     * [KO] 평면 법선 벡터
     * [EN] Plane normal vector
     * @param radius -
     * [KO] 모서리 라운딩 반지름 (기본값: 0)
     * [EN] Corner rounding radius (default: 0)
     * @param radiusSegments -
     * [KO] 모서리 라운딩 세그먼트 수 (기본값: 0)
     * [EN] Corner rounding segments (default: 0)
     * @param boxDim -
     * [KO] 둥근 박스 치수 정보 (기본값: `null`)
     * [EN] Rounded box dimension info (default: `null`)
     * @param flipY -
     * [KO] V 텍스처 좌표 반전 여부 (기본값: `false`)
     * [EN] Whether to flip the V texture coordinate (default: `false`)
     */
    static generatePlaneData(
        interleaveData: number[], indexData: number[],
        width: number, height: number,
        mainSegmentsX: number, mainSegmentsY: number,
        center: any, uV: any, vV: any, normal: any,
        radius: number = 0, radiusSegments: number = 0,
        boxDim: any = null, flipY: boolean = false
    ) {
        const startIdx = interleaveData.length / this.#STRIDE_FLOATS;
        const totalResX = mainSegmentsX + radiusSegments * 2;
        const totalResY = mainSegmentsY + radiusSegments * 2;

        const getCoordInfo = (index: number, size: number, r: number, rSeg: number, mSeg: number) => {
            if (r <= 0 || rSeg <= 0) {
                const u = index / mSeg;
                return {pos: (u - 0.5) * size, norm: 0, uv: u};
            }
            const limit = size / 2 - r;
            const arcLength = (Math.PI / 2) * r;
            const totalLength = arcLength * 2 + (limit * 2);
            if (index <= rSeg) {
                const ratio = index / rSeg, angle = (1 - ratio) * Math.PI / 2;
                return {
                    pos: -limit - Math.sin(angle) * r,
                    norm: -Math.sin(angle),
                    uv: (ratio * arcLength) / totalLength
                };
            } else if (index <= rSeg + mSeg) {
                const ratio = (index - rSeg) / mSeg;
                return {
                    pos: -limit + ratio * (limit * 2),
                    norm: 0,
                    uv: (arcLength + ratio * (limit * 2)) / totalLength
                };
            } else {
                const ratio = (index - rSeg - mSeg) / rSeg, angle = ratio * Math.PI / 2;
                return {
                    pos: limit + Math.sin(angle) * r,
                    norm: Math.sin(angle),
                    uv: (arcLength + (limit * 2) + ratio * arcLength) / totalLength
                };
            }
        };

        for (let iy = 0; iy <= totalResY; iy++) {
            const yInfo = getCoordInfo(iy, height, radius, radiusSegments, mainSegmentsY);
            const uvY = flipY ? (1 - yInfo.uv) : yInfo.uv;
            for (let ix = 0; ix <= totalResX; ix++) {
                const xInfo = getCoordInfo(ix, width, radius, radiusSegments, mainSegmentsX);

                let px = center.x + xInfo.pos * uV.x + yInfo.pos * vV.x;
                let py = center.y + xInfo.pos * uV.y + yInfo.pos * vV.y;
                let pz = center.z + xInfo.pos * uV.z + yInfo.pos * vV.z;
                let nx = normal.x, ny = normal.y, nz = normal.z;

                if (boxDim) {
                    const {w, h, d, r} = boxDim;
                    const innerW2 = w / 2 - r, innerH2 = h / 2 - r, innerD2 = d / 2 - r;
                    const cx = Math.max(-innerW2, Math.min(px, innerW2)),
                        cy = Math.max(-innerH2, Math.min(py, innerH2)), cz = Math.max(-innerD2, Math.min(pz, innerD2));
                    const dx = px - cx, dy = py - cy, dz = pz - cz;
                    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
                    nx = dx / dist;
                    ny = dy / dist;
                    nz = dz / dist;
                    px = cx + nx * r;
                    py = cy + ny * r;
                    pz = cz + nz * r;
                }
                this.interleavePacker(interleaveData, px, py, pz, nx, ny, nz, xInfo.uv, uvY);
            }
        }
        this.generateGridIndices(indexData, startIdx, totalResX, totalResY, totalResX + 1);
    }

    /**
     * [KO] 구(Sphere) 지오메트리 데이터를 생성합니다.
     * [EN] Generates sphere geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 구 반지름
     * [EN] Sphere radius
     * @param widthSegments -
     * [KO] 수평 방향 세그먼트 수
     * [EN] Horizontal segments
     * @param heightSegments -
     * [KO] 수직 방향 세그먼트 수
     * [EN] Vertical segments
     * @param phiStart -
     * [KO] 수평 시작 각도 (라디안)
     * [EN] Horizontal starting angle (radians)
     * @param phiLength -
     * [KO] 수평 원호 각도 범위 (라디안)
     * [EN] Horizontal sweep angle (radians)
     * @param thetaStart -
     * [KO] 수직 시작 각도 (라디안)
     * [EN] Vertical starting angle (radians)
     * @param thetaLength -
     * [KO] 수직 원호 각도 범위 (라디안)
     * [EN] Vertical sweep angle (radians)
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateSphereData(redGPUContext: RedGPUContext, radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(phiLength) < 1e-6 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateSphericalData(interleaveData, indexData, radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 원기둥(Cylinder) 지오메트리 데이터를 생성합니다.
     * [EN] Generates cylinder geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radiusTop -
     * [KO] 상단 반지름
     * [EN] Top radius
     * @param radiusBottom -
     * [KO] 하단 반지름
     * [EN] Bottom radius
     * @param height -
     * [KO] 원기둥 높이
     * [EN] Cylinder height
     * @param radialSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param heightSegments -
     * [KO] 높이 방향 세그먼트 수
     * [EN] Number of height segments
     * @param capTop -
     * [KO] 상단 캡 생성 여부
     * [EN] Whether to generate top cap
     * @param capBottom -
     * [KO] 하단 캡 생성 여부
     * [EN] Whether to generate bottom cap
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param isRadialTop -
     * [KO] 상단 캡의 방사형 UV 매핑 여부
     * [EN] Whether top cap uses radial UV mapping
     * @param isRadialBottom -
     * [KO] 하단 캡의 방사형 UV 매핑 여부
     * [EN] Whether bottom cap uses radial UV mapping
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateCylinderData(redGPUContext: RedGPUContext, radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, capTop: boolean, capBottom: boolean, thetaStart: number, thetaLength: number, isRadialTop: boolean, isRadialBottom: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], halfH = height / 2;
        if ((radiusTop <= 0 && radiusBottom <= 0) || height <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateCylinderTorsoData(interleaveData, indexData, radiusTop, radiusBottom, height, radialSegments, heightSegments, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V);
        if (capTop && radiusTop > 0) this.generateRingData(interleaveData, indexData, 0, radiusTop, radialSegments, 1, thetaStart, thetaLength, {
            x: 0,
            y: halfH,
            z: 0
        }, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadialTop);
        if (capBottom && radiusBottom > 0) this.generateRingData(interleaveData, indexData, 0, radiusBottom, radialSegments, 1, thetaStart, thetaLength, {
            x: 0,
            y: -halfH,
            z: 0
        }, this.#BASIS_U, this.#BASIS_V, this.#AXIS_DOWN, false, isRadialBottom);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 원뿔(Cone) 지오메트리 데이터를 생성합니다.
     * [EN] Generates cone geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 하단 밑면 반지름
     * [EN] Base radius
     * @param height -
     * [KO] 원뿔 높이
     * [EN] Cone height
     * @param radialSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param heightSegments -
     * [KO] 높이 방향 세그먼트 수
     * [EN] Number of height segments
     * @param capBottom -
     * [KO] 하단 밑면 캡 생성 여부
     * [EN] Whether to generate bottom cap
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateConeData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capBottom: boolean, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry {
        return this.generateCylinderData(redGPUContext, 0, radius, height, radialSegments, heightSegments, false, capBottom, thetaStart, thetaLength, false, false, uniqueKey);
    }

    /**
     * [KO] XY 평면 기준의 Plane 지오메트리 데이터를 생성합니다.
     * [EN] Generates Plane geometry data on the XY plane.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로 너비
     * [EN] Width
     * @param height -
     * [KO] 세로 높이
     * [EN] Height
     * @param widthSegments -
     * [KO] 가로 방향 세그먼트 수
     * [EN] Number of width segments
     * @param heightSegments -
     * [KO] 세로 방향 세그먼트 수
     * [EN] Number of height segments
     * @param flipY -
     * [KO] V 텍스처 좌표 반전 여부
     * [EN] Whether to flip the V texture coordinate
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generatePlaneEntryData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, this.#ZERO_VECTOR, this.#BASIS_U, {
            x: 0,
            y: -1,
            z: 0
        }, {x: 0, y: 0, z: 1}, 0, 0, null, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] XZ 평면 기준의 Ground 지오메트리 데이터를 생성합니다.
     * [EN] Generates Ground geometry data on the XZ plane.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param width -
     * [KO] 가로(X축) 길이
     * [EN] Width along X-axis
     * @param height -
     * [KO] 세로(Z축) 길이
     * [EN] Depth along Z-axis
     * @param widthSegments -
     * [KO] 가로 방향 세그먼트 수
     * [EN] Number of width segments
     * @param heightSegments -
     * [KO] 세로 방향 세그먼트 수
     * [EN] Number of depth segments
     * @param flipY -
     * [KO] V 텍스처 좌표 반전 여부
     * [EN] Whether to flip the V texture coordinate
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateGroundData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (width <= 0 || height <= 0) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generatePlaneData(interleaveData, indexData, width, height, widthSegments, heightSegments, this.#ZERO_VECTOR, this.#BASIS_U, {
            x: 0,
            y: 0,
            z: 1
        }, this.#AXIS_UP, 0, 0, null, flipY);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 원판(Circle) 지오메트리 데이터를 생성합니다.
     * [EN] Generates Circle geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 원 반지름
     * [EN] Circle radius
     * @param radialSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param isRadial -
     * [KO] 방사형 UV 매핑 여부
     * [EN] Whether to use radial UV mapping
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateCircleEntryData(redGPUContext: RedGPUContext, radius: number, radialSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (radius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateRingData(interleaveData, indexData, 0, radius, radialSegments, 1, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadial);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 고리(Ring) 지오메트리 데이터를 생성합니다.
     * [EN] Generates Ring geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param innerRadius -
     * [KO] 내부 반지름
     * [EN] Inner radius
     * @param outerRadius -
     * [KO] 외부 반지름
     * [EN] Outer radius
     * @param thetaSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of circumferential segments
     * @param phiSegments -
     * [KO] 반지름 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param isRadial -
     * [KO] 방사형 UV 매핑 여부
     * [EN] Whether to use radial UV mapping
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateRingEntryData(redGPUContext: RedGPUContext, innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        if (outerRadius <= 0 || Math.abs(thetaLength) < 1e-6) return this.getEmptyGeometry(redGPUContext, uniqueKey);
        this.generateRingData(interleaveData, indexData, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, isRadial);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 토러스(Torus) 지오메트리 데이터를 생성합니다.
     * [EN] Generates Torus geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 중심 원 반지름
     * [EN] Major radius
     * @param thickness -
     * [KO] 튜브 단면 반지름
     * [EN] Tube thickness radius
     * @param radialSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param tubularSegments -
     * [KO] 튜브 단면 세그먼트 수
     * [EN] Number of tubular segments
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param capStart -
     * [KO] 시작 단면 캡 생성 여부
     * [EN] Whether to generate start cap
     * @param capEnd -
     * [KO] 끝 단면 캡 생성 여부
     * [EN] Whether to generate end cap
     * @param isRadialCapStart -
     * [KO] 시작 단면 캡의 방사형 UV 적용 여부
     * [EN] Whether start cap uses radial UV
     * @param isRadialCapEnd -
     * [KO] 끝 단면 캡의 방사형 UV 적용 여부
     * [EN] Whether end cap uses radial UV
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateTorusData(redGPUContext: RedGPUContext, radius: number, thickness: number, radialSegments: number, tubularSegments: number, thetaStart: number, thetaLength: number, capStart: boolean, capEnd: boolean, isRadialCapStart: boolean, isRadialCapEnd: boolean, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [], isPartial = Math.abs(thetaLength) < Math.PI * 2;
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const theta = thetaStart + u * thetaLength, phi = v * Math.PI * 2;
            const mR = this.#SCRATCH_V1, cT = this.#SCRATCH_V2, uT = this.#SCRATCH_V3, pos = this.#SCRATCH_V4,
                normal = this.#SCRATCH_V5;
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, theta, this.#BASIS_U, this.#BASIS_V, mR);
            this.#set(cT, mR.x * radius, 0, mR.z * radius);
            this.#set(uT, -mR.x, 0, -mR.z);
            this.#calculateRadialPoint(cT, thickness, phi, uT, this.#AXIS_UP, pos);
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, phi, uT, this.#AXIS_UP, normal);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, u, v);
        });
        if (isPartial) {
            const uV = this.#BASIS_U, vV = this.#BASIS_V, up = this.#AXIS_UP;
            const center = this.#SCRATCH_V1, normal = this.#SCRATCH_V2, tangent = this.#SCRATCH_V3;
            if (capStart) {
                this.#calculateRadialPoint(this.#ZERO_VECTOR, radius, thetaStart, uV, vV, center);
                this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, thetaStart, uV, vV, normal);
                this.#set(tangent, Math.cos(thetaStart), 0, -Math.sin(thetaStart));
                this.generateRingData(interleaveData, indexData, 0, thickness, tubularSegments, 1, 0, Math.PI * 2, center, normal, up, tangent, true, isRadialCapStart);
            }
            if (capEnd) {
                const angle = thetaStart + thetaLength;
                this.#calculateRadialPoint(this.#ZERO_VECTOR, radius, angle, uV, vV, center);
                this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, angle, uV, vV, normal);
                this.#set(tangent, -Math.cos(angle), 0, Math.sin(angle));
                this.generateRingData(interleaveData, indexData, 0, thickness, tubularSegments, 1, 0, Math.PI * 2, center, normal, up, tangent, false, isRadialCapEnd);
            }
        }
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 매듭 토러스(TorusKnot) 지오메트리 데이터를 생성합니다.
     * [EN] Generates TorusKnot geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 전체 반지름
     * [EN] Overall radius
     * @param tubeRadius -
     * [KO] 튜브 단면 반지름
     * [EN] Tube cross-section radius
     * @param tubularSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of tubular segments
     * @param radialSegments -
     * [KO] 단면 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param windingsAroundAxis -
     * [KO] 중심축 기준 회전 횟수 p
     * [EN] Windings around the central axis p
     * @param windingsAroundCircle -
     * [KO] 토러스 내부 원 기준 회전 횟수 q
     * [EN] Windings around the interior circle q
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateTorusKnotData(redGPUContext: RedGPUContext, radius: number, tubeRadius: number, tubularSegments: number, radialSegments: number, windingsAroundAxis: number, windingsAroundCircle: number, uniqueKey: string): Geometry {
        const interleaveData = [], indexData = [];
        this.generateGrid(interleaveData, indexData, radialSegments, tubularSegments, (u, v) => {
            const knotU = v * windingsAroundAxis * Math.PI * 2;
            const P1 = this.#SCRATCH_V1, P2 = this.#SCRATCH_V2, T = this.#SCRATCH_V3, N = this.#SCRATCH_V4,
                B = this.#SCRATCH_V5, pos = this.#SCRATCH_V6, normal = this.#SCRATCH_V7, uT = this.#SCRATCH_V8,
                vT = this.#SCRATCH_V9;
            this.#calculateTorusKnotPosition(knotU, windingsAroundAxis, windingsAroundCircle, radius, P1);
            this.#calculateTorusKnotPosition(knotU + 0.01, windingsAroundAxis, windingsAroundCircle, radius, P2);
            this.#set(T, P2.x - P1.x, P2.y - P1.y, P2.z - P1.z);
            this.#set(N, P2.x + P1.x, P2.y + P1.y, P2.z + P1.z);
            this.#cross(T, N, B);
            this.#normalize(B);
            this.#cross(B, T, N);
            this.#normalize(N);
            const radialV = u * Math.PI * 2;
            this.#set(uT, -B.x, -B.y, -B.z);
            this.#set(vT, -N.x, -N.y, -N.z);
            this.#calculateRadialPoint(P1, tubeRadius, radialV, uT, vT, pos);
            this.#calculateRadialPoint(this.#ZERO_VECTOR, 1.0, radialV, uT, vT, normal);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, v, u);
        });
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 고리(Ring) 또는 원판 캡 형태의 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.
     * [EN] Appends ring or disc cap vertex and index data to the buffer arrays.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>`)
     * [EN] Index data array (`Array<number>`)
     * @param innerRadius -
     * [KO] 내부 반지름
     * [EN] Inner radius
     * @param outerRadius -
     * [KO] 외부 반지름
     * [EN] Outer radius
     * @param thetaSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of circumferential segments
     * @param phiSegments -
     * [KO] 반지름 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param center -
     * [KO] 중심 좌표
     * [EN] Center coordinates
     * @param uV -
     * [KO] 가로(U) 기저 벡터
     * [EN] Horizontal (U) basis vector
     * @param vV -
     * [KO] 세로(V) 기저 벡터
     * [EN] Vertical (V) basis vector
     * @param normal -
     * [KO] 법선 벡터
     * [EN] Normal vector
     * @param isFront -
     * [KO] 전면 와인딩 여부 (기본값: `true`)
     * [EN] Whether to use front-facing winding (default: `true`)
     * @param isRadial -
     * [KO] 방사형 UV 매핑 여부 (기본값: `false`)
     * [EN] Whether to use radial UV mapping (default: `false`)
     * @param uvVStart -
     * [KO] V 텍스처 좌표 시작값 (기본값: 0)
     * [EN] V texture coordinate start value (default: 0)
     * @param uvVEnd -
     * [KO] V 텍스처 좌표 종료값 (기본값: 1)
     * [EN] V texture coordinate end value (default: 1)
     */
    static generateRingData(interleaveData: number[], indexData: number[], innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, center: {
        x: number,
        y: number,
        z: number
    }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, normal: {
        x: number,
        y: number,
        z: number
    }, isFront: boolean = true, isRadial: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        if (outerRadius <= 1e-6 || Math.abs(thetaLength) < 1e-6) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, normal.x, normal.y, normal.z, 0.5, 0.5);
            return;
        }
        const pos = this.#SCRATCH_V10;
        this.generateGrid(interleaveData, indexData, thetaSegments, phiSegments, (u, v) => {
            const r = innerRadius + v * (outerRadius - innerRadius), angle = thetaStart + u * thetaLength,
                uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.#calculateRadialPoint(center, r, angle, uV, vV, pos);
            const uvX = isRadial ? u : 0.5 - (r / outerRadius * Math.sin(angle) * 0.5),
                uvY = isRadial ? uvV : 0.5 - (r / outerRadius * Math.cos(angle) * 0.5);
            this.interleavePacker(interleaveData, pos.x, pos.y, pos.z, normal.x, normal.y, normal.z, uvX, uvY);
        }, false, !isFront);
    }

    /**
     * [KO] 구면(Spherical) 좌표계 기반의 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.
     * [EN] Appends spherical coordinate-based vertex and index data to the buffer arrays.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>` 또는 `null`)
     * [EN] Index data array (`Array<number>` or `null`)
     * @param radius -
     * [KO] 구 반지름
     * [EN] Sphere radius
     * @param widthSegments -
     * [KO] 수평 방향 세그먼트 수
     * [EN] Horizontal segments
     * @param heightSegments -
     * [KO] 수직 방향 세그먼트 수
     * [EN] Vertical segments
     * @param phiStart -
     * [KO] 수평 시작 각도 (라디안)
     * [EN] Horizontal starting angle (radians)
     * @param phiLength -
     * [KO] 수평 원호 각도 범위 (라디안)
     * [EN] Horizontal sweep angle (radians)
     * @param thetaStart -
     * [KO] 수직 시작 각도 (라디안)
     * [EN] Vertical starting angle (radians)
     * @param thetaLength -
     * [KO] 수직 원호 각도 범위 (라디안)
     * [EN] Vertical sweep angle (radians)
     * @param yOffset -
     * [KO] Y축 위치 오프셋 (기본값: 0)
     * [EN] Y-axis position offset (default: 0)
     * @param uvVStart -
     * [KO] V 텍스처 좌표 시작값 (기본값: 0)
     * [EN] V texture coordinate start value (default: 0)
     * @param uvVEnd -
     * [KO] V 텍스처 좌표 종료값 (기본값: 1)
     * [EN] V texture coordinate end value (default: 1)
     */
    static generateSphericalData(interleaveData: number[], indexData: number[], radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, yOffset: number = 0, uvVStart: number = 0, uvVEnd: number = 1) {
        this.generateGrid(interleaveData, indexData, widthSegments, heightSegments, (u, v) => {
            const theta = thetaStart + v * thetaLength, phi = phiStart + u * phiLength, sinT = Math.sin(theta),
                cosT = Math.cos(theta), sinP = Math.sin(phi), cosP = Math.cos(phi),
                uvV = uvVStart + v * (uvVEnd - uvVStart);
            const nx = -sinP * sinT, ny = cosT, nz = -cosP * sinT;
            this.interleavePacker(interleaveData, radius * nx, radius * ny + yOffset, radius * nz, nx, ny, nz, u, uvV);
        }, indexData === null);
    }

    /**
     * [KO] 원기둥 옆면(Torso) 정점 및 인덱스 데이터를 버퍼 배열에 추가합니다.
     * [EN] Appends cylinder torso vertex and index data to the buffer arrays.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>`)
     * [EN] Index data array (`Array<number>`)
     * @param radiusTop -
     * [KO] 상단 반지름
     * [EN] Top radius
     * @param radiusBottom -
     * [KO] 하단 반지름
     * [EN] Bottom radius
     * @param height -
     * [KO] 몸통 높이
     * [EN] Torso height
     * @param radialSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param heightSegments -
     * [KO] 높이 방향 세그먼트 수
     * [EN] Number of height segments
     * @param thetaStart -
     * [KO] 시작 각도 (라디안)
     * [EN] Starting angle (radians)
     * @param thetaLength -
     * [KO] 원호 각도 범위 (라디안)
     * [EN] Sweep angle (radians)
     * @param center -
     * [KO] 중심 좌표
     * [EN] Center coordinates
     * @param uV -
     * [KO] 가로(U) 기저 벡터
     * [EN] Horizontal (U) basis vector
     * @param vV -
     * [KO] 세로(V) 기저 벡터
     * [EN] Vertical (V) basis vector
     * @param axisVector -
     * [KO] 높이 중심축 벡터
     * [EN] Height axis vector
     * @param skipIndices -
     * [KO] 인덱스 생성 생략 여부 (기본값: `false`)
     * [EN] Whether to skip index generation (default: `false`)
     * @param uvVStart -
     * [KO] V 텍스처 좌표 시작값 (기본값: 0)
     * [EN] V texture coordinate start value (default: 0)
     * @param uvVEnd -
     * [KO] V 텍스처 좌표 종료값 (기본값: 1)
     * [EN] V texture coordinate end value (default: 1)
     */
    static generateCylinderTorsoData(interleaveData: number[], indexData: number[], radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, thetaStart: number, thetaLength: number, center: {
        x: number,
        y: number,
        z: number
    }, uV: { x: number, y: number, z: number }, vV: { x: number, y: number, z: number }, axisVector: {
        x: number,
        y: number,
        z: number
    } = {x: 0, y: 1, z: 0}, skipIndices: boolean = false, uvVStart: number = 0, uvVEnd: number = 1) {
        const halfH = height / 2, slope = (radiusBottom - radiusTop) / height;
        if (thetaLength === 0 || (radiusTop <= 0 && radiusBottom <= 0)) {
            this.interleavePacker(interleaveData, center.x, center.y, center.z, 0, 1, 0, 0, 0);
            return;
        }
        const ringPos = this.#SCRATCH_V1, normalDir = this.#SCRATCH_V2, normal = this.#SCRATCH_V3;
        this.generateGrid(interleaveData, indexData, radialSegments, heightSegments, (u, v) => {
            const r = v * (radiusBottom - radiusTop) + radiusTop, angle = u * thetaLength + thetaStart,
                hOff = halfH - v * height, uvV = uvVStart + v * (uvVEnd - uvVStart);
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, r, angle, uV, vV, ringPos);
            this.#calculateRadialPoint({x: 0, y: 0, z: 0}, 1.0, angle, uV, vV, normalDir);
            const px = center.x + ringPos.x + hOff * axisVector.x, py = center.y + ringPos.y + hOff * axisVector.y,
                pz = center.z + ringPos.z + hOff * axisVector.z;
            this.#set(normal, normalDir.x + slope * axisVector.x, normalDir.y + slope * axisVector.y, normalDir.z + slope * axisVector.z);
            this.#normalize(normal);
            this.interleavePacker(interleaveData, px, py, pz, normal.x, normal.y, normal.z, u, uvV);
        }, skipIndices);
    }

    /**
     * [KO] 캡슐(Capsule) 지오메트리 데이터를 생성합니다.
     * [EN] Generates Capsule geometry data.
     *
     * @param redGPUContext -
     * [KO] RedGPUContext 인스턴스
     * [EN] RedGPUContext instance
     * @param radius -
     * [KO] 캡슐 반지름
     * [EN] Capsule radius
     * @param height -
     * [KO] 원기둥 몸통 높이
     * [EN] Cylinder torso height
     * @param radialSegments -
     * [KO] 둘레 방향 세그먼트 수
     * [EN] Number of radial segments
     * @param heightSegments -
     * [KO] 몸통 높이 방향 세그먼트 수
     * [EN] Number of torso height segments
     * @param capSegments -
     * [KO] 반구 캡 세그먼트 수
     * [EN] Number of hemisphere cap segments
     * @param uniqueKey -
     * [KO] 캐싱용 고유 키
     * [EN] Unique key for caching
     * @returns
     * [KO] 생성된 `Geometry` 인스턴스
     * [EN] Created `Geometry` instance
     */
    static generateCapsuleData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capSegments: number, uniqueKey: string): Geometry {
        const interleaveData: number[] = [], indexData: number[] = [], gridX1 = radialSegments + 1, halfH = height / 2,
            capArc = (Math.PI / 2) * radius, totalArc = capArc * 2 + height, v1 = capArc / totalArc,
            v2 = (capArc + height) / totalArc;
        this.generateSphericalData(interleaveData, null, radius, radialSegments, capSegments, 0, Math.PI * 2, 0, Math.PI / 2, halfH, 0, v1);
        this.generateCylinderTorsoData(interleaveData, null, radius, radius, height, radialSegments, heightSegments, 0, Math.PI * 2, this.#ZERO_VECTOR, this.#BASIS_U, this.#BASIS_V, this.#AXIS_UP, true, v1, v2);
        this.generateSphericalData(interleaveData, null, radius, radialSegments, capSegments, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2, -halfH, v2, 1);
        this.generateGridIndices(indexData, 0, radialSegments, capSegments * 2 + heightSegments, gridX1);
        return this.finalize(redGPUContext, interleaveData, indexData, uniqueKey);
    }

    /**
     * [KO] 2D 그리드 정점 오프셋과 해상도를 기반으로 삼각형 인덱스 배열을 생성합니다.
     * [EN] Generates triangle indices from a 2D grid vertex offset and resolution.
     *
     * @param indexData -
     * [KO] 인덱스를 추가할 대상 배열 (`Array<number>`)
     * [EN] Target array to append indices to (`Array<number>`)
     * @param vertexOffset -
     * [KO] 시작 정점 인덱스 오프셋
     * [EN] Starting vertex index offset
     * @param gridX -
     * [KO] 가로 셀 개수
     * [EN] Number of horizontal cells
     * @param gridY -
     * [KO] 세로 셀 개수
     * [EN] Number of vertical cells
     * @param gridX1 -
     * [KO] 한 행당 정점 개수 (`gridX + 1`)
     * [EN] Number of vertices per row (`gridX + 1`)
     * @param reverse -
     * [KO] 삼각형 와인딩 순서 반전 여부 (기본값: `false`)
     * [EN] Whether to reverse triangle winding order (default: `false`)
     */
    static generateGridIndices(indexData: number[], vertexOffset: number, gridX: number, gridY: number, gridX1: number, reverse: boolean = false) {
        for (let iy = 0; iy < gridY; iy++) {
            for (let ix = 0; ix < gridX; ix++) {
                const a = vertexOffset + ix + gridX1 * iy, b = vertexOffset + ix + gridX1 * (iy + 1),
                    c = vertexOffset + (ix + 1) + gridX1 * (iy + 1), d = vertexOffset + (ix + 1) + gridX1 * iy;
                if (reverse) indexData.push(a, d, b, d, c, b); else indexData.push(a, b, d, b, c, d);
            }
        }
    }

    /**
     * [KO] 인터리브 정점 배열과 인덱스 배열로부터 정점 탄젠트(`vertexTangent`)를 계산하여 제자리에 기록합니다.
     * [EN] Calculates vertex tangents (`vertexTangent`) from the interleaved vertex and index arrays and writes them in place.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param indexData -
     * [KO] 인덱스 데이터 배열 (`Array<number>`)
     * [EN] Index data array (`Array<number>`)
     */
    static calculateTangents(interleaveData: number[], indexData: number[]) {
        const stride = this.#STRIDE_FLOATS;
        const typedInterleaveData = new Float32Array(interleaveData);
        const typedIndexData = new Uint32Array(indexData);

        const struct = Primitive.primitiveInterleaveStruct;
        const posOffset = struct.getAttributeOffset('vertexPosition');
        const normalOffset = struct.getAttributeOffset('vertexNormal');
        const uvOffset = struct.getAttributeOffset('texcoord');
        const tangentOffset = struct.getAttributeOffset('vertexTangent');

        calculateTangentsInterleaved(
            typedInterleaveData,
            typedIndexData,
            stride,
            posOffset,
            normalOffset,
            uvOffset,
            tangentOffset
        );

        for (let i = 0, len = typedInterleaveData.length; i < len; i++) {
            interleaveData[i] = typedInterleaveData[i];
        }
    }

    /**
     * [KO] 단일 정점의 위치, 법선, UV, 탄젠트 성분을 인터리브 배열에 순서대로 추가합니다.
     * [EN] Appends position, normal, UV, and tangent components of a single vertex to the interleaved array.
     *
     * @param interleaveData -
     * [KO] 인터리브 정점 데이터 배열 (`Array<number>`)
     * [EN] Interleaved vertex data array (`Array<number>`)
     * @param px -
     * [KO] 위치 X
     * [EN] Position X
     * @param py -
     * [KO] 위치 Y
     * [EN] Position Y
     * @param pz -
     * [KO] 위치 Z
     * [EN] Position Z
     * @param nx -
     * [KO] 법선 X
     * [EN] Normal X
     * @param ny -
     * [KO] 법선 Y
     * [EN] Normal Y
     * @param nz -
     * [KO] 법선 Z
     * [EN] Normal Z
     * @param u -
     * [KO] 텍스처 좌표 U
     * [EN] Texture coordinate U
     * @param v -
     * [KO] 텍스처 좌표 V
     * [EN] Texture coordinate V
     * @param tx -
     * [KO] 탄젠트 X (기본값: 0)
     * [EN] Tangent X (default: 0)
     * @param ty -
     * [KO] 탄젠트 Y (기본값: 0)
     * [EN] Tangent Y (default: 0)
     * @param tz -
     * [KO] 탄젠트 Z (기본값: 0)
     * [EN] Tangent Z (default: 0)
     * @param tw -
     * [KO] 탄젠트 W 부호 (기본값: 1)
     * [EN] Tangent W handedness sign (default: 1)
     */
    static interleavePacker(interleaveData: number[], px: number, py: number, pz: number, nx: number, ny: number, nz: number, u: number, v: number, tx: number = 0, ty: number = 0, tz: number = 0, tw: number = 1) {
        interleaveData.push(px, py, pz, nx, ny, nz, u, v, tx, ty, tz, tw);
    }

    static #calculateTorusKnotPosition(u, p, q, radius, out) {
        const cu = Math.cos(u), su = Math.sin(u), quOverP = q / p * u, cs = Math.cos(quOverP);
        out.x = radius * (2 + cs) * 0.5 * cu;
        out.y = radius * (2 + cs) * su * 0.5;
        out.z = radius * Math.sin(quOverP) * 0.5;
    }

    static #calculateRadialPoint(center: any, radius: number, angle: number, u: any, v: any, out: any) {
        const cos = Math.cos(angle), sin = Math.sin(angle);
        out.x = center.x + radius * (cos * v.x - sin * u.x);
        out.y = center.y + radius * (cos * v.y - sin * u.y);
        out.z = center.z + radius * (cos * v.z - sin * u.z);
    }

    static #set(out, x, y, z) {
        out.x = x;
        out.y = y;
        out.z = z;
    }

    static #normalize(v) {
        const len = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z) || 1;
        v.x /= len;
        v.y /= len;
        v.z /= len;
    }

    static #cross(a, b, out) {
        out.x = a.y * b.z - a.z * b.y;
        out.y = a.z * b.x - a.x * b.z;
        out.z = a.x * b.y - a.y * b.x;
    }
}

export default PrimitiveUtils;
