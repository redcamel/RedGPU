/**
 * [KO] 앞면(Front Face)을 판단하는 정점의 순서를 정의하는 상수군입니다.
 * [EN] Constants defining the vertex winding order used to determine the front face.
 *
 * [KO] 정점이 배치된 순서에 따라 어느 쪽이 앞면인지 결정합니다.
 * [EN] Determines which side is the front face based on the order in which vertices are arranged.
 *
 * @category Constants
 */
declare const GPU_FRONT_FACE: {
    /**
     * [KO] 시계 방향(Clockwise)으로 배치된 면을 앞면으로 간주합니다.
     * [EN] Considers faces with clockwise winding as the front face.
     */
    readonly CW: "cw";
    /**
     * [KO] 반시계 방향(Counter-Clockwise)으로 배치된 면을 앞면으로 간주합니다.
     * [EN] Considers faces with counter-clockwise winding as the front face.
     */
    readonly CCW: "ccw";
};
export default GPU_FRONT_FACE;
