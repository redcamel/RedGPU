/**
 * [KO] 정점 데이터를 기하학적 도형으로 해석하는 방식을 정의하는 상수군입니다.
 * [EN] Constants defining how to interpret vertex data as geometric shapes.
 *
 * [KO] 정점들이 어떤 규칙으로 연결되어 그려질지 결정합니다.
 * [EN] Determines the rules by which vertices are connected and drawn.
 *
 * @category Constants
 */
declare const GPU_PRIMITIVE_TOPOLOGY: {
    /**
     * [KO] 각 정점을 독립적인 점으로 렌더링합니다.
     * [EN] Renders each vertex as an independent point.
     */
    readonly POINT_LIST: "point-list";
    /**
     * [KO] 두 정점을 연결하여 독립적인 선분을 만듭니다.
     * [EN] Connects two vertices to form an independent line segment.
     */
    readonly LINE_LIST: "line-list";
    /**
     * [KO] 연속된 정점들을 하나의 선으로 연결합니다.
     * [EN] Connects consecutive vertices into a single continuous line.
     */
    readonly LINE_STRIP: "line-strip";
    /**
     * [KO] 세 정점을 연결하여 독립적인 삼각형을 만듭니다.
     * [EN] Connects three vertices to form an independent triangle.
     */
    readonly TRIANGLE_LIST: "triangle-list";
    /**
     * [KO] 연속된 정점들을 연결하여 삼각형 띠를 만듭니다.
     * [EN] Connects consecutive vertices to form a triangle strip.
     */
    readonly TRIANGLE_STRIP: "triangle-strip";
};
export default GPU_PRIMITIVE_TOPOLOGY;
