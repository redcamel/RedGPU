import { BaseInputParams, InputBindingPlugin, NumberInputParams } from '@tweakpane/core';
import { Interval, IntervalObject } from './model/interval.js';
interface IntervalInputParams extends NumberInputParams, BaseInputParams {
}
export declare const IntervalInputPlugin: InputBindingPlugin<Interval, IntervalObject, IntervalInputParams>;
export {};
