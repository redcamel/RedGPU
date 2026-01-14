import RedGPUContext from "../context/RedGPUContext";
import BitmapTexture from "../resources/texture/BitmapTexture";
import CubeTexture from "../resources/texture/CubeTexture";
import {keepLog} from "../utils";

export class TextureLoaderData {
    src: any;
    texture: null;
    loadEnd: boolean;
    loadSuccess: boolean;
    srcInfo: any;
    idx: number;

    constructor(src: any, srcInfo: any, idx: number) {
        this.src = src;
        this.texture = null;
        this.loadEnd = false;
        this.loadSuccess = false;
        this.srcInfo = srcInfo;
        this.idx = idx;
    }
}

export default class TextureLoader {
    textures = [];
    #loaded = 0;
    readonly #redGPUContext: RedGPUContext;
    readonly #srcInfoList;
    readonly #callback;
    readonly #progressCallback;

    constructor(redGPUContext: RedGPUContext, srcInfoList = [], callback: Function, progressCallback?: Function) {
        this.#redGPUContext = redGPUContext;
        this.#srcInfoList = srcInfoList;
        this.#callback = callback;
        this.#progressCallback = progressCallback;
        keepLog('여기',this.#progressCallback)
        if (this.#srcInfoList.length) {
            this.#srcInfoList.forEach((srcInfo, index: number) => this.#loadTexture(srcInfo, index));
        } else {
            this.#reportCompletion();
        }
    }

    getTextureByIndex(index: number) {
        if (this.textures[index]) return this.textures[index].texture;
    }

    #loadTexture(srcInfo, index: number): void {
        let targetTexture, srcTarget;
        let targetClass: any = BitmapTexture;
        if (srcInfo.hasOwnProperty('src')) {
            srcTarget = srcInfo.src;
        } else {
            srcTarget = srcInfo;
        }
        if (srcTarget instanceof Array) {
            targetClass = CubeTexture;
        }
        // console.log('srcInfo',srcInfo)
        targetTexture = new TextureLoaderData(srcTarget, srcInfo, index);
        const onLoadHandler = () => {
            // console.log('onload', index, this.#srcInfoList);
            targetTexture.loadSuccess = true;
            targetTexture.loadEnd = true;
            this.#checkCompletion();
        };
        const onErrorHandler = () => {
            targetTexture.loadSuccess = false;
            targetTexture.loadEnd = true;
            this.#checkCompletion();
        };
        // console.log('srcInfo',srcInfo)
        if (targetClass === BitmapTexture) {
            targetTexture.texture = new targetClass(this.#redGPUContext, {
                src: srcInfo.src,
                cacheKey: srcInfo.cacheKey
            }, srcInfo.useMipmap, onLoadHandler, onErrorHandler, srcInfo.format, false);
        } else {
            targetTexture.texture = new targetClass(this.#redGPUContext, {
                src: srcInfo.src,
                cacheKey: srcInfo.cacheKey
            }, srcInfo.useMipmap, onLoadHandler, onErrorHandler, srcInfo.format);
        }
        this.textures.push(targetTexture);
        this.#checkProgress();
    }
    #checkProgress() {
        const total = this.#srcInfoList.length;
        const loaded = this.#loaded;
        if (this.#progressCallback) this.#progressCallback.call(this, {
            total,
            loaded,
            percent: Math.min(100, parseFloat(((loaded / total) * 100).toFixed(2)))
        });
    }
    #checkCompletion() {
        this.#loaded++;
        this.#checkProgress();
        if (this.#loaded === this.#srcInfoList.length) {
            this.#reportCompletion();
        }
    }

    #reportCompletion() {
        requestAnimationFrame(() => {
            if (this.#callback) this.#callback.call(this, this);
        });
    }
}
