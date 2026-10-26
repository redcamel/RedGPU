/**
 * [KO] 마우스 피킹 이벤트 타입 상수를 정의한 객체입니다.
 * [EN] Object defining mouse picking event type constants.
 *
 * ### Example
 * ```typescript
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * // [KO] 클릭 피킹 이벤트 리스너 등록
 * // [EN] Register a click picking event listener
 * mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
 *     console.log('Clicked!', e);
 * });
 * ```
 *
 * @see [MouseEvent (Mesh) example](/RedGPU/examples/3d/interaction/mouseEvent/mesh/)
 * @see [MouseEvent (Raycasting) example](/RedGPU/examples/3d/interaction/mouseEvent/raycasting/)
 * @see [MouseEvent (Sprite2D) example](/RedGPU/examples/2d/interaction/mouseEvent/sprite2D/)
 * @category Picking
 */
const PICKING_EVENT_TYPE = {
    /**
     * [KO] 마우스가 객체 위에서 이동할 때 발생하는 이벤트 타입 (`'move'`)
     * [EN] Event type triggered when the mouse moves over the object (`'move'`)
     */
    MOVE: 'move',
    /**
     * [KO] 객체 위에서 마우스 버튼을 눌렀을 때 발생하는 이벤트 타입 (`'down'`)
     * [EN] Event type triggered when a mouse button is pressed over the object (`'down'`)
     */
    DOWN: 'down',
    /**
     * [KO] 객체 위에서 마우스 버튼을 뗐을 때 발생하는 이벤트 타입 (`'up'`)
     * [EN] Event type triggered when a mouse button is released over the object (`'up'`)
     */
    UP: 'up',
    /**
     * [KO] 마우스가 객체 영역 안으로 진입했을 때 발생하는 이벤트 타입 (`'over'`)
     * [EN] Event type triggered when the mouse enters the object area (`'over'`)
     */
    OVER: 'over',
    /**
     * [KO] 마우스가 객체 영역 밖으로 벗어났을 때 발생하는 이벤트 타입 (`'out'`)
     * [EN] Event type triggered when the mouse leaves the object area (`'out'`)
     */
    OUT: 'out',
    /**
     * [KO] 객체 위에서 마우스 다운 후 동일 객체에서 업이 발생했을 때의 이벤트 타입 (`'click'`)
     * [EN] Event type triggered when a mouse up occurs on the same object after a mouse down (`'click'`)
     */
    CLICK: 'click',
} as const;
Object.freeze(PICKING_EVENT_TYPE);
export default PICKING_EVENT_TYPE;
