import { Controller, ViewProps } from '@tweakpane/core';
import { RadioProps, RadioView } from '../view/radio.js';
interface Config {
    name: string;
    props: RadioProps;
    viewProps: ViewProps;
}
export declare class RadioController implements Controller<RadioView> {
    readonly props: RadioProps;
    readonly view: RadioView;
    readonly viewProps: ViewProps;
    constructor(doc: Document, config: Config);
}
export {};
