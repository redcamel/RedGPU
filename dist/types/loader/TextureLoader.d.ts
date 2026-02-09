import RedGPUContext from "../context/RedGPUContext";
export declare class TextureLoaderData {
    src: any;
    texture: null;
    loadEnd: boolean;
    loadSuccess: boolean;
    srcInfo: any;
    idx: number;
    constructor(src: any, srcInfo: any, idx: number);
}
export default class TextureLoader {
    #private;
    textures: any[];
    constructor(redGPUContext: RedGPUContext, srcInfoList: any[], callback: Function, progressCallback?: Function);
    getTextureByIndex(index: number): any;
}
