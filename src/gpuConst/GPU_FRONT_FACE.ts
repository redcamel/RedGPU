/**
 * [KO] 폴리곤의 정점 감기 순서(Winding Order)에 따라 어느 방향을 앞면(Front Face)으로 판별할지 정의하는 상수입니다.
 * [EN] Constants defining which polygon side is considered the front face based on vertex winding order.
 *
 * @category Constants
 */
const GPU_FRONT_FACE = {
    /**
     * [KO] 정점이 시계 방향(Clockwise, `'cw'`)으로 감긴 폴리곤 면을 앞면으로 간주합니다.
     * [EN] Considers polygons with clockwise (`'cw'`) vertex winding as the front face.
     */
    CW: 'cw',
    /**
     * [KO] 정점이 반시계 방향(Counter-Clockwise, `'ccw'`)으로 감긴 폴리곤 면을 앞면으로 간주합니다.
     * [EN] Considers polygons with counter-clockwise (`'ccw'`) vertex winding as the front face.
     */
    CCW: 'ccw'
} as const;
Object.freeze(GPU_FRONT_FACE);
export default GPU_FRONT_FACE;