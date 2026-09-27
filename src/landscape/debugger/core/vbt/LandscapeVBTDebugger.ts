import ALandscapeTextureDebugger from "../ALandscapeTextureDebugger";
import Landscape from "../../../Landscape";
import LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import vbtDebuggerWGSL from "./shader/vbtDebugger.wgsl";

export class LandscapeVBTDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        tileStreamer?: LandscapeTileStreamer | null,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (BaseColor)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            vbtDebuggerWGSL,
            'LandscapeVBTDebuggerShaderModule',
            (l, ts) => ts?.getAtlasTexture('vbtBaseColor') ?? null,
            {r: 0.08, g: 0.08, b: 0.08, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVBTDebugger);
export default LandscapeVBTDebugger;
