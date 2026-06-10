import { BaseBladeParams, BladePlugin } from '@tweakpane/core';
export interface ButtonGridBladeParams extends BaseBladeParams {
    cells: (x: number, y: number) => {
        title: string;
    };
    size: [number, number];
    view: 'buttongrid';
    label?: string;
}
export declare const ButtonGridBladePlugin: BladePlugin<ButtonGridBladeParams>;
