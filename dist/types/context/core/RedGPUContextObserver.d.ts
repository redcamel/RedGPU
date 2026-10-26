import type RedGPUContext from "../RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] `RedGPUContext`에 연결된 HTML 캔버스의 DOM 부모 변경 및 레이아웃(크기·위치) 변화를 감지하는 관찰자 클래스입니다.
 * [EN] Observer class that detects DOM parent changes and layout (size/position) changes of the HTML canvas attached to `RedGPUContext`.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category Context
 */
export default class RedGPUContextObserver extends RedGPUObject {
    #private;
    /**
     * [KO] RedGPUContextObserver 인스턴스를 생성합니다.
     * [EN] Creates a RedGPUContextObserver instance.
     *
     * @param redGPUContext -
     * [KO] 관찰할 RedGPUContext 인스턴스
     * [EN] RedGPUContext instance to observe
     * @param updateCallback -
     * [KO] 레이아웃 변화 감지 시 호출할 콜백 함수
     * [EN] Callback function invoked when a layout change is detected
     */
    constructor(redGPUContext: RedGPUContext, updateCallback: () => void);
    /**
     * [KO] 등록된 모든 옵저버 연결을 해제하고 윈도우 리사이즈 이벤트 리스너를 제거합니다.
     * [EN] Disconnects all registered observers and removes the window resize event listener.
     */
    destroy(): void;
}
