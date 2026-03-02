declare function defineUintRange(propertyKey: string, initValue?: number, forFragment?: boolean, min?: number, max?: number): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (v: any) => void;
};
export default defineUintRange;
