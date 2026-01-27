declare function defineVector(propertyKey: string, initValue: number[], forFragment?: boolean): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (v: any) => void;
};
export default defineVector;
