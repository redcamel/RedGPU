import { Blade, BladeController, LabelController, LabelProps, LabelView } from '@tweakpane/core';
import { FpsGraphController } from './fps-graph.js';
interface Config {
    blade: Blade;
    labelProps: LabelProps;
    valueController: FpsGraphController;
}
export declare class FpsGraphBladeController extends BladeController<LabelView> {
    readonly labelController: LabelController<FpsGraphController>;
    readonly valueController: FpsGraphController;
    constructor(doc: Document, config: Config);
}
export {};
