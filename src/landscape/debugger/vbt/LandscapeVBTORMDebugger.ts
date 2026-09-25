import ALandscapeTextureDebugger from "../core/ALandscapeTextureDebugger";
import Landscape from "../../core/Landscape";
import {ALandscapeDebuggerOptions} from "../core/ALandscapeDebugger";
import vbtDebuggerWGSL from "./shader/vbtDebugger.wgsl";

export class LandscapeVBTORMDebugger extends ALandscapeTextureDebugger {
    constructor(
        landscape: Landscape,
        cameraOrOptions?: any,
        options?: ALandscapeDebuggerOptions
    ) {
        const defaultOptions: ALandscapeDebuggerOptions = {
            title: 'VBT (ORM)',
            ...options
        };
        super(
            landscape,
            cameraOrOptions,
            defaultOptions,
            vbtDebuggerWGSL,
            'LandscapeVBTORMDebuggerShaderModule',
            (l) => l.getInternalAtlasTexture('vbtORM'),
            {r: 1.0, g: 0.8, b: 0.0, a: 1.0}
        );
    }
}

export default LandscapeVBTORMDebugger;
