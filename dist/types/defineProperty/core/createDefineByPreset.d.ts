declare const defineProperties: (definer: Function) => (classObject: Object, keyList: Array<any>) => void;
declare const definePropertyForKey: (definer: Function) => (defineList: string[]) => {};
declare const createDefineByPreset: (list: any) => {
    defineByPreset: (classObject: Object, keyList: any) => void;
};
export { defineProperties, definePropertyForKey, createDefineByPreset, };
