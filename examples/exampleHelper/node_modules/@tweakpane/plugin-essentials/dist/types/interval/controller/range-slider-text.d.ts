import { Constraint, NumberTextProps, Parser, PointNdTextController, SliderProps, Value, ValueController, ViewProps } from '@tweakpane/core';
import { Interval } from '../model/interval.js';
import { RangeSliderTextView } from '../view/range-slider-text.js';
interface Config {
    constraint: Constraint<number> | undefined;
    parser: Parser<number>;
    sliderProps: SliderProps;
    textProps: NumberTextProps;
    value: Value<Interval>;
    viewProps: ViewProps;
}
export declare class RangeSliderTextController implements ValueController<Interval, RangeSliderTextView> {
    readonly value: Value<Interval>;
    readonly view: RangeSliderTextView;
    readonly viewProps: ViewProps;
    private readonly sc_;
    private readonly tc_;
    constructor(doc: Document, config: Config);
    get textController(): PointNdTextController<Interval>;
}
export {};
