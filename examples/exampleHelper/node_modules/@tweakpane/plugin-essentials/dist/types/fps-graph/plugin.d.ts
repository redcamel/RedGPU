import { BaseBladeParams, BladePlugin } from '@tweakpane/core';
export interface FpsGraphBladeParams extends BaseBladeParams {
    view: 'fpsgraph';
    interval?: number;
    label?: string;
    max?: number;
    min?: number;
    rows?: number;
}
export declare const FpsGraphBladePlugin: BladePlugin<FpsGraphBladeParams>;
