declare function defineBoolean(propertyKey: string, initValue?: boolean, forFragment?: boolean): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (v: any) => void;
};
export default defineBoolean;
