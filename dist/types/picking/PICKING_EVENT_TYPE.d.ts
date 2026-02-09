/**
 * [KO] 피킹 이벤트 타입 정의 객체입니다.
 * [EN] Object defining picking event types.
 *
 * ### Example
 * ```typescript
 * const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
 * mesh.addListener(RedGPU.Picking.PICKING_EVENT_TYPE.CLICK, (e) => {
 *     console.log('Clicked!', e);
 * });
 * ```
 * @category Picking
 */
declare const PICKING_EVENT_TYPE: {
    /**
     * [KO] 마우스 이동 (마우스가 객체 위에서 움직일 때)
     * [EN] Mouse move (When the mouse moves over the object)
     */
    readonly MOVE: "move";
    /**
     * [KO] 마우스 다운 (마우스 버튼을 눌렀을 때)
     * [EN] Mouse down (When a mouse button is pressed)
     */
    readonly DOWN: "down";
    /**
     * [KO] 마우스 업 (마우스 버튼을 뗐을 때)
     * [EN] Mouse up (When a mouse button is released)
     */
    readonly UP: "up";
    /**
     * [KO] 마우스 오버 (마우스가 객체 영역 안으로 들어왔을 때)
     * [EN] Mouse over (When the mouse enters the object area)
     */
    readonly OVER: "over";
    /**
     * [KO] 마우스 아웃 (마우스가 객체 영역 밖으로 나갔을 때)
     * [EN] Mouse out (When the mouse leaves the object area)
     */
    readonly OUT: "out";
    /**
     * [KO] 마우스 클릭 (마우스 다운 후 동일 객체에서 업이 발생했을 때)
     * [EN] Mouse click (When a mouse up occurs on the same object after a mouse down)
     */
    readonly CLICK: "click";
};
export default PICKING_EVENT_TYPE;
