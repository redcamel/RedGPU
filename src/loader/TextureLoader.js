import BitmapTexture from "../resources/texture/BitmapTexture";
import CubeTexture from "../resources/texture/CubeTexture";
export class TextureLoaderData {
    src;
    texture;
    loadEnd;
    loadSuccess;
    srcInfo;
    idx;
    constructor(src, srcInfo, idx) {
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
    #redGPUContext;
    #srcInfoList;
    #callback;
    #progressCallback;
    constructor(redGPUContext, srcInfoList = [], callback, progressCallback) {
        this.#redGPUContext = redGPUContext;
        this.#srcInfoList = srcInfoList;
        this.#callback = callback;
        this.#progressCallback = progressCallback;
        if (this.#srcInfoList.length) {
            this.#srcInfoList.forEach((srcInfo, index) => this.#loadTexture(srcInfo, index));
        }
        else {
            this.#reportCompletion();
        }
    }
    getTextureByIndex(index) {
        if (this.textures[index])
            return this.textures[index].texture;
    }
    #loadTexture(srcInfo, index) {
        let targetTexture, srcTarget;
        let targetClass = BitmapTexture;
        if (srcInfo.hasOwnProperty('src')) {
            srcTarget = srcInfo.src;
        }
        else {
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
        }
        else {
            targetTexture.texture = new targetClass(this.#redGPUContext, {
                src: srcInfo.src,
                cacheKey: srcInfo.cacheKey
            }, srcInfo.useMipmap, onLoadHandler, onErrorHandler, srcInfo.format);
        }
        this.textures.push(targetTexture);
    }
    #checkCompletion() {
        this.#loaded++;
        if (this.#progressCallback)
            this.#progressCallback.call(this, {
                totalNum: this.#srcInfoList.length,
                loaded: this.#loaded
            });
        if (this.#loaded === this.#srcInfoList.length) {
            this.#reportCompletion();
        }
    }
    #reportCompletion() {
        requestAnimationFrame(() => {
            if (this.#callback)
                this.#callback.call(this, this);
        });
    }
}
