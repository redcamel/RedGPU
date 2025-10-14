import defineProperty_SETTING from "./defineProperty_SETTING";
function defineSampler(propertyKey) {
    const symbol = Symbol(propertyKey);
    return {
        get: function () {
            return this[symbol];
        },
        set: function (sampler) {
            const prevSampler = this[symbol];
            this[symbol] = sampler;
            this.updateSampler(prevSampler, sampler);
        },
        ...defineProperty_SETTING
    };
}
Object.freeze(defineSampler);
export default defineSampler;
