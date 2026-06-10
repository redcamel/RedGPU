import { Controller, NumberTextProps, Value, ViewProps } from '@tweakpane/core';
import { CubicBezier } from '../model/cubic-bezier.js';
import { CubicBezierPickerView } from '../view/cubic-bezier-picker.js';
interface Axis {
    textProps: NumberTextProps;
}
interface Config {
    axis: Axis;
    value: Value<CubicBezier>;
    viewProps: ViewProps;
}
export declare class CubicBezierPickerController implements Controller<CubicBezierPickerView> {
    readonly value: Value<CubicBezier>;
    readonly view: CubicBezierPickerView;
    readonly viewProps: ViewProps;
    private gc_;
    private tc_;
    constructor(doc: Document, config: Config);
    get allFocusableElements(): HTMLElement[];
    refresh(): void;
}
export {};
