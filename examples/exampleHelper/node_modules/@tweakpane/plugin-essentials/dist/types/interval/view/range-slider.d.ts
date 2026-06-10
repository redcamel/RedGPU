import { SliderProps, Value, View, ViewProps } from '@tweakpane/core';
import { Interval } from '../model/interval.js';
interface Config {
    sliderProps: SliderProps;
    value: Value<Interval>;
    viewProps: ViewProps;
}
export declare class RangeSliderView implements View {
    readonly element: HTMLElement;
    readonly knobElements: [HTMLElement, HTMLElement];
    readonly barElement: HTMLElement;
    readonly trackElement: HTMLElement;
    private readonly sliderProps_;
    private readonly value_;
    constructor(doc: Document, config: Config);
    private valueToX_;
    private update_;
    private onSliderPropsChange_;
    private onValueChange_;
}
export {};
