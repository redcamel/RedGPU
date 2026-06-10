import { View, ViewProps } from '@tweakpane/core';
interface Config {
    viewProps: ViewProps;
}
export declare class CubicBezierPickerView implements View {
    readonly element: HTMLElement;
    readonly graphElement: HTMLElement;
    readonly textElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
