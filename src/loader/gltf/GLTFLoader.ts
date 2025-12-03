import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import validateRedGPUContext from "../../runtimeChecker/validateFunc/validateRedGPUContext";
import consoleAndThrowError from "../../utils/consoleAndThrowError";
import getFileExtension from "../../utils/file/getFileExtension";
import getFileName from "../../utils/file/getFileName";
import getFilePath from "../../utils/file/getFilePath";
import {GLTF} from "./GLTF";
import {GLTFParsedSingleClip} from "./parsers/animation/parseAnimations";
import parseFileGLB from "./parsers/loadFile/parseFileGLB";
import parseFileGLTF from "./parsers/loadFile/parseFileGLTF";

/**
 * Represents the result of parsing a GLTF file.
 *
 * @typedef {Object} GLTFParsingResult
 * @property {any[]} groups - The groups defined in the GLTF file.
 * @property {any[]} materials - The materials defined in the GLTF file.
 * @property {Object} uris - The URIs defined in the GLTF file.
 * @property {any[]} uris.buffers - The vertexBuffer defined in the GLTF file.
 * @property {Object.<string, any>} textures - The textures defined in the GLTF file.
 * @property {any[]} textureRawList - The list of raw textures defined in the GLTF file.
 * @property {any[]} cameras - The cameras defined in the GLTF file.
 * @property {GLTFParsedSingleClip[]} animations - The parsed animation clips defined in the GLTF file.
 */
type GLTFParsingResult = {
    groups: any[],
    materials: any[],
    uris: {
        buffers: any[]
    },
    textures: Record<string, any>,
    textureRawList: any[],
    cameras: any[],
    animations: GLTFParsedSingleClip[]
}

/**
 * GLTFLoader class for loading and parsing GLTF files.
 */
class GLTFLoader {
    parsingResult: GLTFParsingResult
    resultMesh: Mesh
    parsingOption // TODO - 이거뭔지 알아내야함
    activeAnimations: any[] = []
    readonly #redGPUContext: RedGPUContext
    readonly #filePath: string
    readonly #fileName: string
    readonly #url: string
    readonly #fileExtension: string
    #gltfData: GLTF
    readonly #onLoad
    readonly #onError

    constructor(redGPUContext: RedGPUContext, url: string, onLoad, onError) {
        validateRedGPUContext(redGPUContext)
        this.#redGPUContext = redGPUContext
        this.#url = url
        this.#filePath = getFilePath(url);
        this.#fileName = getFileName(url)
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
        this.resultMesh.gltfLoaderInfo = this
        this.resultMesh.animationInfo.animationsList = this.parsingResult.animations
        this.#loadFile();
    }

    get redGPUContext(): RedGPUContext {
        return this.#redGPUContext;
    }

    get filePath(): string {
        return this.#filePath;
    }

    get gltfData(): GLTF {
        return this.#gltfData;
    }

    set gltfData(value: GLTF) {
        this.#gltfData = value;
    }

    get fileName(): string {
        return this.#fileName;
    }

    get url(): string {
        return this.#url;
    }

    stopAnimation(parsedSingleClip: GLTFParsedSingleClip) {
        const {activeAnimations} = this
        let index = activeAnimations.indexOf(parsedSingleClip);
        if (index > -1) {
            activeAnimations.splice(index, 1);
        }
    };

    stopAllAnimation() {
        this.activeAnimations.length = 0
    }

    playAnimation(parsedSingleClip: GLTFParsedSingleClip) {
        const {activeAnimations} = this
        activeAnimations.push(
            new PlayAnimationInfo(performance.now(), parsedSingleClip)
        );
    };

    async #loadFile() {
        try {
            if (this.#fileExtension === 'glb') {
                parseFileGLB(this, () => this.#onLoad(this))
            } else if (this.#fileExtension === 'gltf') {
                parseFileGLTF(this, () => this.#onLoad(this))
            } else {
                consoleAndThrowError('Unknown file extension: ' + this.#fileExtension);
            }
        } catch (error) {
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
    startTime: number
    targetGLTFParsedSingleClip: GLTFParsedSingleClip

    constructor(startTime: number, targetAniTrackList: GLTFParsedSingleClip) {
        this.startTime = startTime
        this.targetGLTFParsedSingleClip = targetAniTrackList
    }
}
