import { NumberTextProps, PickerLayout, Value, ValueController, ViewProps } from '@tweakpane/core';
import { CubicBezier } from '../model/cubic-bezier.js';
import { CubicBezierView } from '../view/cubic-bezier.js';
interface Axis {
    textProps: NumberTextProps;
}
interface Config {
    axis: Axis;
    expanded: boolean;
    pickerLayout: PickerLayout;
    value: Value<CubicBezier>;
    viewProps: ViewProps;
}
export declare class CubicBezierController implements ValueController<CubicBezier, CubicBezierView> {
    readonly value: Value<CubicBezier>;
    readonly view: CubicBezierView;
    readonly viewProps: ViewProps;
    private readonly tc_;
    private readonly popC_;
    private readonly pickerC_;
    private readonly foldable_;
    constructor(doc: Document, config: Config);
    private onButtonBlur_;
    private onButtonClick_;
    private onPopupChildBlur_;
    private onPopupChildKeydown_;
}
export {};
