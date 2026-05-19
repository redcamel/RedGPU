/**
 * [KO] 클래스 프로토타입에 속성 정의 로직을 일괄 적용하는 내부 헬퍼 함수입니다.
 * [EN] Internal helper function that batch-applies property definition logic to a class prototype.
 *
 * @param target - [KO] 속성을 정의할 클래스 생성자 [EN] Class constructor to define properties on
 * @param keys - [KO] 정의할 속성 키, 키 배열 또는 설정 객체 배열 [EN] Property keys, array of keys, or array of configuration objects
 * @param definer - [KO] 개별 속성의 getter/setter를 생성할 정의 함수 [EN] Definition function to create getter/setter for individual properties
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
