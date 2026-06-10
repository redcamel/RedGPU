import { View, ViewProps } from '@tweakpane/core';
interface Config {
    viewProps: ViewProps;
}
export declare class FpsView implements View {
    readonly element: HTMLElement;
    readonly graphElement: HTMLElement;
    readonly valueElement: HTMLElement;
    constructor(doc: Document, config: Config);
}
export {};
