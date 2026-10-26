import RedGPUContext from "../../context/RedGPUContext";
import Geometry from "../../geometry/Geometry";
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
declare class PrimitiveUtils {
    #private;
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
    static finalize(redGPUContext: RedGPUContext, interleaveData: number[], indexData: number[], uniqueKey: string): Geometry;
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
    static generateGrid(interleaveData: number[], indexData: number[], resolutionX: number, resolutionY: number, vertexCallback: (u: number, v: number, ix: number, iy: number) => void, skipIndices?: boolean, reverseIndices?: boolean): void;
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
    static getEmptyGeometry(redGPUContext: RedGPUContext, uniqueKey: string): Geometry;
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
    static generateBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, uniqueKey: string): Geometry;
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
    static generateRoundedBoxData(redGPUContext: RedGPUContext, width: number, height: number, depth: number, widthSegments: number, heightSegments: number, depthSegments: number, radius: number, radiusSegments: number, uniqueKey: string): Geometry;
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
    static generatePlaneData(interleaveData: number[], indexData: number[], width: number, height: number, mainSegmentsX: number, mainSegmentsY: number, center: any, uV: any, vV: any, normal: any, radius?: number, radiusSegments?: number, boxDim?: any, flipY?: boolean): void;
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
    static generateSphereData(redGPUContext: RedGPUContext, radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry;
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
    static generateCylinderData(redGPUContext: RedGPUContext, radiusTop: number, radiusBottom: number, height: number, radialSegments: number, heightSegments: number, capTop: boolean, capBottom: boolean, thetaStart: number, thetaLength: number, isRadialTop: boolean, isRadialBottom: boolean, uniqueKey: string): Geometry;
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
    static generateConeData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capBottom: boolean, thetaStart: number, thetaLength: number, uniqueKey: string): Geometry;
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
    static generatePlaneEntryData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry;
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
    static generateGroundData(redGPUContext: RedGPUContext, width: number, height: number, widthSegments: number, heightSegments: number, flipY: boolean, uniqueKey: string): Geometry;
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
    static generateCircleEntryData(redGPUContext: RedGPUContext, radius: number, radialSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry;
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
    static generateRingEntryData(redGPUContext: RedGPUContext, innerRadius: number, outerRadius: number, thetaSegments: number, phiSegments: number, thetaStart: number, thetaLength: number, isRadial: boolean, uniqueKey: string): Geometry;
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
    static generateTorusData(redGPUContext: RedGPUContext, radius: number, thickness: number, radialSegments: number, tubularSegments: number, thetaStart: number, thetaLength: number, capStart: boolean, capEnd: boolean, isRadialCapStart: boolean, isRadialCapEnd: boolean, uniqueKey: string): Geometry;
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
    static generateTorusKnotData(redGPUContext: RedGPUContext, radius: number, tubeRadius: number, tubularSegments: number, radialSegments: number, windingsAroundAxis: number, windingsAroundCircle: number, uniqueKey: string): Geometry;
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
        x: number;
        y: number;
        z: number;
    }, uV: {
        x: number;
        y: number;
        z: number;
    }, vV: {
        x: number;
        y: number;
        z: number;
    }, normal: {
        x: number;
        y: number;
        z: number;
    }, isFront?: boolean, isRadial?: boolean, uvVStart?: number, uvVEnd?: number): void;
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
    static generateSphericalData(interleaveData: number[], indexData: number[], radius: number, widthSegments: number, heightSegments: number, phiStart: number, phiLength: number, thetaStart: number, thetaLength: number, yOffset?: number, uvVStart?: number, uvVEnd?: number): void;
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
        x: number;
        y: number;
        z: number;
    }, uV: {
        x: number;
        y: number;
        z: number;
    }, vV: {
        x: number;
        y: number;
        z: number;
    }, axisVector?: {
        x: number;
        y: number;
        z: number;
    }, skipIndices?: boolean, uvVStart?: number, uvVEnd?: number): void;
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
    static generateCapsuleData(redGPUContext: RedGPUContext, radius: number, height: number, radialSegments: number, heightSegments: number, capSegments: number, uniqueKey: string): Geometry;
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
    static generateGridIndices(indexData: number[], vertexOffset: number, gridX: number, gridY: number, gridX1: number, reverse?: boolean): void;
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
    static calculateTangents(interleaveData: number[], indexData: number[]): void;
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
    static interleavePacker(interleaveData: number[], px: number, py: number, pz: number, nx: number, ny: number, nz: number, u: number, v: number, tx?: number, ty?: number, tz?: number, tw?: number): void;
}
export default PrimitiveUtils;
