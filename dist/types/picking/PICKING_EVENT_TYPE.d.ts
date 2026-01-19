/**
 * [KO] 피킹 이벤트 타입 정의 객체입니다.
 * [EN] Object defining picking event types.
 * * ### Example
 * ```typescript
 * const mesh = new RedGPU.RedMesh(geometry, material);
 * mesh.addListener(RedGPU.PICKING_EVENT_TYPE.CLICK, (e) => {
 *     console.log('Clicked!', e);
 * });
 * ```
 * @category Picking
 */
declare const PICKING_EVENT_TYPE: {
    /**
     * [KO] 마우스 이동
     * [EN] Mouse move
     */
    readonly MOVE: "move";
    /**
     * [KO] 마우스 다운
     * [EN] Mouse down
     */
    readonly DOWN: "down";
    /**
     * [KO] 마우스 업
     * [EN] Mouse up
     */
    readonly UP: "up";
    /**
     * [KO] 마우스 오버
     * [EN] Mouse over
     */
    readonly OVER: "over";
    /**
     * [KO] 마우스 아웃
     * [EN] Mouse out
     */
    readonly OUT: "out";
    /**
     * [KO] 마우스 클릭
     * [EN] Mouse click
     */
    readonly CLICK: "click";
};
export default PICKING_EVENT_TYPE;
