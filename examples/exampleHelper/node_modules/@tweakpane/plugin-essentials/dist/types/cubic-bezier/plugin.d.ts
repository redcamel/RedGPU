import { BladePlugin, PickerLayout } from '@tweakpane/core';
import { BaseBladeParams } from 'tweakpane';
export interface CubicBezierBladeParams extends BaseBladeParams {
    value: [number, number, number, number];
    view: 'cubicbezier';
    expanded?: boolean;
    label?: string;
    picker?: PickerLayout;
}
export declare const CubicBezierBladePlugin: BladePlugin<CubicBezierBladeParams>;
