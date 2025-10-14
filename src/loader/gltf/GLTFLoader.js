import Mesh from "../../display/mesh/Mesh";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import getFileExtension from "../../utils/file/getFileExtension";
import getFileName from "../../utils/file/getFileName";
import getFilePath from "../../utils/file/getFilePath";
import parseFileGLB from "./parsers/loadFile/parseFileGLB";
import parseFileGLTF from "./parsers/loadFile/parseFileGLTF";
/**
 * GLTFLoader class for loading and parsing GLTF files.
 */
class GLTFLoader {
    parsingResult;
    resultMesh;
    parsingOption; // TODO - 이거뭔지 알아내야함
    activeAnimations = [];
    #redGPUContext;
    #filePath;
    #fileName;
    #url;
    #fileExtension;
    #gltfData;
    #onLoad;
    #onError;
    constructor(redGPUContext, url, onLoad, onError) {
        validateRedGPUContext(redGPUContext);
        this.#redGPUContext = redGPUContext;
        this.#url = url;
        this.#filePath = getFilePath(url);
        this.#fileName = getFileName(url);
        this.#fileExtension = getFileExtension(url);
        this.#onLoad = onLoad;
        this.#onError = onError;
        this.parsingResult = {
            groups: [],
            materials: [],
            uris: {
                buffers: []
            },
            textures: {},
            textureRawList: [],
            cameras: [],
            animations: []
        };
        this.resultMesh = new Mesh(this.#redGPUContext);
        this.resultMesh.gltfLoaderInfo = this;
        this.resultMesh.animationInfo.animationsList = this.parsingResult.animations;
        this.#loadFile();
    }
    get redGPUContext() {
        return this.#redGPUContext;
    }
    get filePath() {
        return this.#filePath;
    }
    get gltfData() {
        return this.#gltfData;
    }
    set gltfData(value) {
        this.#gltfData = value;
    }
    get fileName() {
        return this.#fileName;
    }
    get url() {
        return this.#url;
    }
    stopAnimation(parsedSingleClip) {
        const { activeAnimations } = this;
        let index = activeAnimations.indexOf(parsedSingleClip);
        if (index > -1) {
            activeAnimations.splice(index, 1);
        }
    }
    ;
    stopAllAnimation() {
        this.activeAnimations.length = 0;
    }
    playAnimation(parsedSingleClip) {
        const { activeAnimations } = this;
        activeAnimations.push(new PlayAnimationInfo(performance.now(), parsedSingleClip));
    }
    ;
    async #loadFile() {
        try {
            if (this.#fileExtension === 'glb') {
                parseFileGLB(this, () => this.#onLoad(this));
            }
            else if (this.#fileExtension === 'gltf') {
                parseFileGLTF(this, () => this.#onLoad(this));
            }
            else {
                consoleAndThrowError('Unknown file extension: ' + this.#fileExtension);
            }
        }
        catch (error) {
            this.#onError?.(error);
        }
    }
}
Object.freeze(GLTFLoader);
export default GLTFLoader;
/**
 * Represents information required to play an animation.
 * @class
 */
export class PlayAnimationInfo {
    startTime;
    targetGLTFParsedSingleClip;
    constructor(startTime, targetAniTrackList) {
        this.startTime = startTime;
        this.targetGLTFParsedSingleClip = targetAniTrackList;
    }
}
