/**
 * GPU 프리미티브 토폴로지 옵션
 *
 * 정점 데이터를 어떤 형태의 기하 도형으로 해석할지 정의합니다.
 * 드로우 콜 시 정점들이 어떻게 연결되어 렌더링될지 결정합니다.
 *
 * @constant
 */
const GPU_PRIMITIVE_TOPOLOGY = {
    /**
     * 각 정점을 독립적인 점으로 렌더링합니다.
     *
     * 정점 하나당 하나의 점이 그려집니다.
     */
    POINT_LIST: 'point-list',
    /**
     * 두 개의 정점으로 하나의 선분을 구성합니다.
     *
     * 정점 2개마다 독립적인 선분이 그려집니다.
     */
    LINE_LIST: 'line-list',
    /**
     * 연속된 정점들을 선으로 연결합니다.
     *
     * 첫 번째 정점부터 마지막 정점까지 순서대로 연결된 선이 그려집니다.
     */
    LINE_STRIP: 'line-strip',
    /**
     * 세 개의 정점으로 하나의 삼각형을 구성합니다.
     *
     * 정점 3개마다 독립적인 삼각형이 그려집니다. 가장 일반적으로 사용되는 토폴로지입니다.
     */
    TRIANGLE_LIST: 'triangle-list',
    /**
     * 연속된 정점들로 삼각형을 구성합니다.
     *
     * 첫 세 정점으로 첫 삼각형을 만들고, 이후 정점마다 이전 두 정점과 함께 새로운 삼각형을 만듭니다.
     */
    TRIANGLE_STRIP: 'triangle-strip',
} as const
Object.freeze(GPU_PRIMITIVE_TOPOLOGY)
export default GPU_PRIMITIVE_TOPOLOGY
