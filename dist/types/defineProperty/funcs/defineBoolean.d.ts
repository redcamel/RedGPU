declare function defineBoolean(propertyKey: string, initValue?: boolean, forFragment?: boolean): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (newValue: boolean) => void;
};
export default defineBoolean;
