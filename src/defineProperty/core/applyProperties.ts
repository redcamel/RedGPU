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
