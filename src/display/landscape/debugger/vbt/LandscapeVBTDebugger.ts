import ALandscapeTextureDebugger from "../core/ALandscapeTextureDebugger";
import Landscape from "../../core/Landscape";
import {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import vbtDebuggerWGSL from "./shader/vbtDebugger.wgsl";

export class LandscapeVBTDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (BaseColor)',
            ...options
        };
        super(
            landscape,
            cameraOrOptions,
            defaultOptions,
            vbtDebuggerWGSL,
            'LandscapeVBTDebuggerShaderModule',
            (l) => l.vbtBaseColorAtlas,
            {r: 0.08, g: 0.08, b: 0.08, a: 1.0}
        );
    }
}

export default LandscapeVBTDebugger;
