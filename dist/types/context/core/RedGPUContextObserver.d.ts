import type RedGPUContext from "../RedGPUContext";
import RedGPUObject from "../../base/RedGPUObject";
/**
 * [KO] RedGPUContext의 캔버스 환경 변화(부모 변경, 크기/위치 변화)를 감지하는 클래스입니다.
 * [EN] Class that detects changes in the RedGPUContext's canvas environment (parent changes, size/position changes).
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 */
export default class RedGPUContextObserver extends RedGPUObject {
    #private;
    /**
     * [KO] RedGPUContextObserver 생성자
     * [EN] RedGPUContextObserver constructor
     * @param redGPUContext -
     * [KO] 관찰할 RedGPUContext 인스턴스
     * [EN] RedGPUContext instance to observe
     * @param updateCallback -
     * [KO] 레이아웃 변화 시 호출할 콜백
     * [EN] Callback to call when layout changes
     */
    constructor(redGPUContext: RedGPUContext, updateCallback: () => void);
    /**
     * [KO] 모든 옵저버 중지
     * [EN] Stop all observers
     */
    stop(): void;
}
