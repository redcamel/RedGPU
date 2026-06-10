import { ButtonController, Controller, PlainView, ViewProps } from '@tweakpane/core';
interface CellConfig {
    title: string;
}
interface Config {
    size: [number, number];
    cellConfig: (x: number, y: number) => CellConfig;
}
export declare type ButtonGridControllerConfig = Config;
export declare class ButtonGridController implements Controller<PlainView> {
    readonly size: [number, number];
    readonly view: PlainView;
    readonly viewProps: ViewProps;
    private cellCs_;
    constructor(doc: Document, config: Config);
    get cellControllers(): ButtonController[];
}
export {};
