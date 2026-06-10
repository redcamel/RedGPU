import { SliderProps, Value, ValueController, ViewProps } from '@tweakpane/core';
import { Interval } from '../model/interval.js';
import { RangeSliderView } from '../view/range-slider.js';
interface Config {
    sliderProps: SliderProps;
    value: Value<Interval>;
    viewProps: ViewProps;
}
export declare class RangeSliderController implements ValueController<Interval, RangeSliderView> {
    readonly sliderProps: SliderProps;
    readonly value: Value<Interval>;
    readonly view: RangeSliderView;
    readonly viewProps: ViewProps;
    private grabbing_;
    private grabOffset_;
    constructor(doc: Document, config: Config);
    private ofs_;
    private valueFromData_;
    private onPointerDown_;
    private applyPointToValue_;
    private onPointerMove_;
    private onPointerUp_;
}
export {};
