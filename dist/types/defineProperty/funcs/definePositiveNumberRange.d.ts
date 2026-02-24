declare function definePositiveNumberRange(propertyKey: string, initValue?: number, forFragment?: boolean, min?: number, max?: number): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (newValue: number) => void;
};
export default definePositiveNumberRange;
