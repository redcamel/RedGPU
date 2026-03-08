import BitmapTexture from "../../resources/texture/BitmapTexture";
declare function defineTexture(propertyKey: string, forFragment?: boolean): {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get: () => any;
    set: (texture: BitmapTexture) => void;
};
export default defineTexture;
