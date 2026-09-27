import ALandscapeTextureDebugger from "../ALandscapeTextureDebugger";
import Landscape from "../../../Landscape";
import LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import vhtDebuggerWGSL from "./shader/vhtDebugger.wgsl";

export class LandscapeVHTDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        tileStreamer?: LandscapeTileStreamer | null,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VHT (Height)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            vhtDebuggerWGSL,
            'LandscapeVHTDebuggerShaderModule',
            (l, ts) => ts?.getAtlasTexture('vht') ?? null,
            {r: 0.06, g: 0.09, b: 0.16, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVHTDebugger);
export default LandscapeVHTDebugger;
