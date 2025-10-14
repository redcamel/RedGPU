/**
 * GPU 앞면 정의 옵션
 *
 * 삼각형의 정점 와인딩 순서(winding order)를 기준으로 앞면을 판단하는 방식을 정의합니다.
 * 컬링 모드와 함께 사용되어 어떤 면을 렌더링할지 결정합니다.
 *
 * @constant
 */
const GPU_FRONT_FACE = {
    /**
     * 시계 방향(Clockwise) 와인딩을 앞면으로 정의합니다.
     *
     * 정점이 시계 방향으로 배치된 삼각형을 앞면으로 간주합니다.
     */
    CW: 'cw',
    /**
     * 반시계 방향(Counter-Clockwise) 와인딩을 앞면으로 정의합니다.
     *
     * 정점이 반시계 방향으로 배치된 삼각형을 앞면으로 간주합니다. 일반적으로 기본값으로 사용됩니다.
     */
    CCW: 'ccw'
};
Object.freeze(GPU_FRONT_FACE);
export default GPU_FRONT_FACE;
