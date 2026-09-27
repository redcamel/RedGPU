import ALandscapeTextureDebugger from "../core/ALandscapeTextureDebugger";
import Landscape from "../../Landscape";
import LandscapeTileStreamer from "../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import vbtDebuggerWGSL from "./shader/vbtDebugger.wgsl";

export class LandscapeVBTNormalDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        tileStreamer?: LandscapeTileStreamer | null,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (Normal)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            vbtDebuggerWGSL,
            'LandscapeVBTNormalDebuggerShaderModule',
            (l, ts) => ts?.getAtlasTexture('vbtNormal') ?? null,
            {r: 0.5, g: 0.5, b: 1.0, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVBTNormalDebugger);
export default LandscapeVBTNormalDebugger;
