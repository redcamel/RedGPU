import ALandscapeTextureDebugger from "../ALandscapeTextureDebugger";
import Landscape from "../../../Landscape";
import LandscapeTileStreamer from "../../../core/spatial/LandscapeTileStreamer";
import {ALandscapeDebuggerOptions} from "../ALandscapeDebugger";
import vbtDebuggerWGSL from "./shader/vbtDebugger.wgsl";

export class LandscapeVBTORMDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        tileStreamer?: LandscapeTileStreamer | null,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (ORM)',
            ...options
        };
        super(
            landscape,
            tileStreamer,
            cameraOrOptions,
            defaultOptions,
            vbtDebuggerWGSL,
            'LandscapeVBTORMDebuggerShaderModule',
            (_, ts) => ts?.getAtlasTexture('vbtORM') ?? null,
            {r: 1.0, g: 0.8, b: 0.0, a: 1.0}
        );
    }
}

Object.freeze(LandscapeVBTORMDebugger);
export default LandscapeVBTORMDebugger;
