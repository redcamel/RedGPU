/**
 * [KO] 대상 클래스의 프로토타입에 속성 디스크립터를 동적으로 정의합니다.
 * [EN] Dynamically defines property descriptors on the prototype of the target class.
 *
 * @param target -
 * [KO] 속성을 정의할 대상 클래스 생성자
 * [EN] Target class constructor to define properties on
 * @param keys -
 * [KO] 속성 정의 정보 (단일 키, 설정 객체 또는 배열)
 * [EN] Property definition information (single key, configuration object, or array)
 * @param definer -
 * [KO] 속성 디스크립터를 생성하는 정의 함수
 * [EN] Definer function that creates property descriptors
 * @category DefineProperty
 */
declare const applyProperties: (target: any, keys: any | any[], definer: Function) => void;
export default applyProperties;
