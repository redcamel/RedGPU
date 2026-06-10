import { Blade, BladeController, LabelController, LabelProps, LabelView } from '@tweakpane/core';
import { ButtonGridController } from './button-grid.js';
interface Config {
    blade: Blade;
    labelProps: LabelProps;
    valueController: ButtonGridController;
}
export declare class ButtonGridBladeController extends BladeController<LabelView> {
    readonly labelController: LabelController<ButtonGridController>;
    readonly valueController: ButtonGridController;
    constructor(doc: Document, config: Config);
}
export {};
