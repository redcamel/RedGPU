import { PointNdTextController, View } from '@tweakpane/core';
import { Interval } from '../model/interval.js';
import { RangeSliderView } from './range-slider.js';
interface Config {
    sliderView: RangeSliderView;
    textView: PointNdTextController<Interval>['view'];
}
export declare class RangeSliderTextView implements View {
    readonly element: HTMLElement;
    private sliderView_;
    private textView_;
    constructor(doc: Document, config: Config);
}
export {};
