import ALandscapeTextureDebugger from "../core/ALandscapeTextureDebugger";
import Landscape from "../../core/Landscape";
import {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import vntDebuggerWGSL from "./shader/vntDebugger.wgsl";

export class LandscapeVNTDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VNT (Normal)',
            ...options
        };
        super(
            landscape,
            cameraOrOptions,
            defaultOptions,
            vntDebuggerWGSL,
            'LandscapeVNTDebuggerShaderModule',
            (l) => l.getInternalAtlasTexture('vnt'),
            {r: 0.1, g: 0.1, b: 0.1, a: 1.0}
        );
    }
}

export default LandscapeVNTDebugger;
