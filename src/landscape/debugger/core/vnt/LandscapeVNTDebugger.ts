import ALandscapeTextureDebugger from "../ALandscapeTextureDebugger";
import Landscape from "../../../Landscape";
import LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import vntDebuggerWGSL from "./shader/vntDebugger.wgsl";

export class LandscapeVNTDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        tileStreamer?: LandscapeTileStreamer | null,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VNT (Normal)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            vntDebuggerWGSL,
            'Landscape_Debugger_VNT_ShaderModule',
            (_, ts) => ts?.getAtlasTexture('vnt') ?? null,
            {r: 0.1, g: 0.1, b: 0.1, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVNTDebugger);
export default LandscapeVNTDebugger;
