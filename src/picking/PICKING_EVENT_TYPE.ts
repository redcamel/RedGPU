/**
 * [KO] 피킹 이벤트 타입 정의 객체입니다.
 * [EN] Object defining picking event types.
 * * ### Example
 * ```typescript
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
 *     console.log('Clicked!', e);
 * });
 * ```
 * @category Picking
 */
const PICKING_EVENT_TYPE = {
    /**
     * [KO] 마우스 이동
     * [EN] Mouse move
     */
    MOVE: 'move',
    /**
     * [KO] 마우스 다운
     * [EN] Mouse down
     */
    DOWN: 'down',
    /**
     * [KO] 마우스 업
     * [EN] Mouse up
     */
    UP: 'up',
    /**
     * [KO] 마우스 오버
     * [EN] Mouse over
     */
    OVER: 'over',
    /**
     * [KO] 마우스 아웃
     * [EN] Mouse out
     */
    OUT: 'out',
    /**
     * [KO] 마우스 클릭
     * [EN] Mouse click
     */
    CLICK: 'click',
} as const
export default PICKING_EVENT_TYPE
