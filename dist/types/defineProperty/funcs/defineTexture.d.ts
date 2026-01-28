declare function defineTexture(propertyKey: string, forFragment?: boolean): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (v: any) => void;
};
export default defineTexture;
