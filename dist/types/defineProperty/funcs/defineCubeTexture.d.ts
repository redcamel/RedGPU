import CubeTexture from "../../resources/texture/CubeTexture";
declare function defineCubeTexture(propertyKey: string, forFragment?: boolean): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (texture: CubeTexture) => void;
};
export default defineCubeTexture;
