/**
 * [KO] 대상 클래스의 프로토타입에 정의할 속성 목록을 순회하며 동적으로 속성을 바인딩하는 유틸리티 함수입니다.
 * [EN] A utility function that iterates through a list of properties and dynamically binds them to the prototype of the target class.
 *
 * @param target - [KO] 속성을 정의할 대상 클래스 생성자 [EN] Target class constructor to define properties on
 * @param keys - [KO] 속성 정의 정보(단일 키, 설정 객체 또는 이들의 배열) [EN] Property definition information (single key, config object, or their array)
 * @param definer - [KO] 각 속성의 디스크립터를 생성하는 정의 함수 [EN] Definer function that creates property descriptors
 */
const applyProperties = (target: any, keys: any | any[], definer: Function) => {
    const keyList = Array.isArray(keys) ? keys : [keys];
    keyList.forEach(keyInfo => {
        if (Array.isArray(keyInfo)) {
            const [key, ...args] = keyInfo;
            Object.defineProperty(target.prototype, key, definer(key, ...args));
        } else if (typeof keyInfo === 'object' && keyInfo !== null && 'key' in keyInfo) {
            Object.defineProperty(target.prototype, keyInfo.key, definer(keyInfo));
        } else {
            Object.defineProperty(target.prototype, keyInfo, definer(keyInfo));
        }
    });
};

export default applyProperties;
