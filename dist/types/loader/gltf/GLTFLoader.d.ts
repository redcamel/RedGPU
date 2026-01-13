import RedGPUContext from "../../context/RedGPUContext";
import Mesh from "../../display/mesh/Mesh";
import { GLTF } from "./GLTF";
import { GLTFParsedSingleClip } from "./parsers/animation/parseAnimations";
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
    groups: any[];
    materials: any[];
    uris: {
        buffers: any[];
    };
    textures: Record<string, any>;
    textureRawList: any[];
    cameras: any[];
    animations: GLTFParsedSingleClip[];
};
/**
 * GLTFLoader class for loading and parsing GLTF files.
 */
declare class GLTFLoader {
    #private;
    parsingResult: GLTFParsingResult;
    resultMesh: Mesh;
    parsingOption: any;
    activeAnimations: any[];
    constructor(redGPUContext: RedGPUContext, url: string, onLoad: any, onProgress: any, onError: any);
    get redGPUContext(): RedGPUContext;
    get filePath(): string;
    get gltfData(): GLTF;
    set gltfData(value: GLTF);
    get fileName(): string;
    get url(): string;
    stopAnimation(): void;
    playAnimation(parsedSingleClip: GLTFParsedSingleClip): void;
}
export default GLTFLoader;
/**
 * Represents information required to play an animation.
 * @class
 */
export declare class PlayAnimationInfo {
    startTime: number;
    targetGLTFParsedSingleClip: GLTFParsedSingleClip;
    constructor(startTime: number, targetAniTrackList: GLTFParsedSingleClip);
}
