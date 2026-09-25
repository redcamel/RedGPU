import ALandscapeTextureDebugger from "../core/ALandscapeTextureDebugger";
import Landscape from "../../core/Landscape";
import {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import vbtDebuggerWGSL from "./shader/vbtDebugger.wgsl";

export class LandscapeVBTNormalDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (Normal)',
            ...options
        };
        super(
            landscape,
            cameraOrOptions,
            defaultOptions,
            vbtDebuggerWGSL,
            'LandscapeVBTNormalDebuggerShaderModule',
            (l) => l.getInternalAtlasTexture('vbtNormal'),
            {r: 0.5, g: 0.5, b: 1.0, a: 1.0}
        );
    }
}

export default LandscapeVBTNormalDebugger;
