import { BaseBladeParams, BladePlugin } from '@tweakpane/core';
export interface RadioGridBladeParams<T> extends BaseBladeParams {
    cells: (x: number, y: number) => {
        title: string;
        value: T;
    };
    groupName: string;
    size: [number, number];
    value: T;
    view: 'radiogrid';
    label?: string;
}
export declare const RadioGridBladePlugin: BladePlugin<RadioGridBladeParams<unknown>>;
