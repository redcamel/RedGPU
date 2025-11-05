import Sampler from "../../resources/sampler/Sampler";
declare function defineSampler(propertyKey: string): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (sampler: Sampler) => void;
};
export default defineSampler;
