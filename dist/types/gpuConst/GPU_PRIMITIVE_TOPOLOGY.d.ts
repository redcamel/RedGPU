/**
 * [KO] 정점(Vertex) 스트림을 점, 선, 삼각형 등의 기하학적 기본 도형(Primitive)으로 조립하는 토폴로지 상수입니다.
 * [EN] Primitive topology constants defining how vertex streams are assembled into geometric primitives such as points, lines, or triangles.
 *
 * @category Constants
 */
declare const GPU_PRIMITIVE_TOPOLOGY: {
    /**
     * [KO] 각각의 정점을 독립된 단일 점(Point)으로 렌더링합니다.
     * [EN] Renders each vertex as an independent single point.
     */
    readonly POINT_LIST: "point-list";
    /**
     * [KO] 정점을 2개씩 짝지어 서로 분리된 독립 선분(Line Segment)으로 렌더링합니다.
     * [EN] Pairs every two vertices to render independent, disconnected line segments.
     */
    readonly LINE_LIST: "line-list";
    /**
     * [KO] 연속된 정점들을 순서대로 이어 하나의 연결된 선(Polyline)으로 렌더링합니다.
     * [EN] Connects consecutive vertices in order to render a continuous polyline.
     */
    readonly LINE_STRIP: "line-strip";
    /**
     * [KO] 정점을 3개씩 묶어 서로 분리된 독립 삼각형(Triangle)으로 렌더링합니다.
     * [EN] Groups every three vertices to render independent, disconnected triangles.
     */
    readonly TRIANGLE_LIST: "triangle-list";
    /**
     * [KO] 이전 삼각형의 마지막 두 정점과 새 정점을 공유하여 연속된 삼각형 띠(Triangle Strip)로 렌더링합니다.
     * [EN] Shares the last two vertices of the previous triangle with each new vertex to render a continuous triangle strip.
     */
    readonly TRIANGLE_STRIP: "triangle-strip";
};
export default GPU_PRIMITIVE_TOPOLOGY;
