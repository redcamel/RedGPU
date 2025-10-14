import ColorRGBA from "../../color/ColorRGBA";
import LightManager from "../../light/LightManager";
import ShadowManager from "../../shadow/ShadowManager";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import InstanceIdGenerator from "../../utils/uuid/InstanceIdGenerator";
import Object3DContainer from "../mesh/core/Object3DContainer";
/**
 * Scene 클래스는 View에서 렌더링할 장면을 구성하는 공간입니다.
 *
 * 조명, 그림자, 배경색 등의 설정을 포함하며,
 * 모든 시각적 객체의 루트 컨테이너로 작동합니다.
 *
 * View3D 또는 View2D와 연결되어 화면에 출력되는 대상이며,
 * 시각적 콘텐츠를 배치하는 무대 역할을 합니다.
 *
 * ```javascript
 * const scene = new RedGPU.Display.Scene();
 * ```
 *
 * <iframe src="/RedGPU/examples/3d/scene/" ></iframe>
 *
 * @category Scene
 * @extends Object3DContainer
 */
class Scene extends Object3DContainer {
    #instanceId;
    #name;
    #backgroundColor = new ColorRGBA();
    #useBackgroundColor = false;
    #lightManager = new LightManager();
    #shadowManager = new ShadowManager();
    /**
     * Scene 생성자입니다.
     * 고유 인스턴스 ID를 생성하고 이름을 설정합니다.
     * @param name - Scene의 이름
     */
    constructor(name) {
        super();
        this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        this.#name = name;
    }
    /**
     * Scene에 포함된 LightManager입니다.
     * 조명 설정 및 관리 기능을 제공합니다.
     */
    get lightManager() {
        return this.#lightManager;
    }
    /**
     * Scene에 포함된 ShadowManager입니다.
     * 그림자 설정 및 관리 기능을 제공합니다.
     */
    get shadowManager() {
        return this.#shadowManager;
    }
    /**
     * Scene의 이름을 반환합니다.
     * 이름이 설정되지 않은 경우 인스턴스 ID 기반으로 자동 생성됩니다.
     */
    get name() {
        if (!this.#instanceId)
            this.#instanceId = InstanceIdGenerator.getNextId(this.constructor);
        return this.#name || `${this.constructor.name} Instance ${this.#instanceId}`;
    }
    /**
     * Scene의 이름을 설정합니다.
     * @param value - 설정할 이름 문자열
     */
    set name(value) {
        this.#name = value;
    }
    /**
     * Scene의 배경색입니다.
     * 렌더링 시 사용될 ColorRGBA 객체입니다.
     */
    get backgroundColor() {
        return this.#backgroundColor;
    }
    /**
     * Scene의 배경색을 설정합니다.
     * ColorRGBA 인스턴스가 아닌 경우 예외를 발생시킵니다.
     * @param value - ColorRGBA 인스턴스
     */
    set backgroundColor(value) {
        if (!(value instanceof ColorRGBA))
            consoleAndThrowError('allow only ColorRGBA instance');
        this.#backgroundColor = value;
    }
    /**
     * 배경색 사용 여부를 반환합니다.
     * true면 설정된 배경색이 렌더링에 적용됩니다.
     */
    get useBackgroundColor() {
        return this.#useBackgroundColor;
    }
    /**
     * 배경색 사용 여부를 설정합니다.
     * @param value - true면 배경색 사용, false면 미사용
     */
    set useBackgroundColor(value) {
        this.#useBackgroundColor = value;
    }
}
export default Scene;
