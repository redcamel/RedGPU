import { Foldable, PickerLayout, View, ViewProps } from '@tweakpane/core';
interface Config {
    foldable: Foldable;
    pickerLayout: PickerLayout;
    viewProps: ViewProps;
}
export declare class CubicBezierView implements View {
    readonly element: HTMLElement;
    readonly buttonElement: HTMLButtonElement;
    readonly textElement: HTMLElement;
    readonly pickerElement: HTMLElement | null;
    constructor(doc: Document, config: Config);
}
export {};
