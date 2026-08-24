import ALandscapeTextureDebugger from "../core/ALandscapeTextureDebugger";
import Landscape from "../../core/Landscape";
import {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import vhtDebuggerWGSL from "./shader/vhtDebugger.wgsl";

export class LandscapeVHTDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VHT (Height)',
            ...options
        };
        super(
            landscape,
            cameraOrOptions,
            defaultOptions,
            vhtDebuggerWGSL,
            'LandscapeVHTDebuggerShaderModule',
            (l) => l.vhtAtlasTexture,
            {r: 0.06, g: 0.09, b: 0.16, a: 1.0}
        );
    }
}

export default LandscapeVHTDebugger;
