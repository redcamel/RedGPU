import { PlainView, Value, ValueController, ViewProps } from '@tweakpane/core';
import { RadioController } from './radio.js';
interface CellConfig<T> {
    title: string;
    value: T;
}
interface Config<T> {
    groupName: string;
    size: [number, number];
    cellConfig: (x: number, y: number) => CellConfig<T>;
    value: Value<T>;
}
export declare class RadioGridController<T> implements ValueController<T, PlainView> {
    readonly size: [number, number];
    readonly value: Value<T>;
    readonly view: PlainView;
    readonly viewProps: ViewProps;
    private cellCs_;
    private cellValues_;
    constructor(doc: Document, config: Config<T>);
    get cellControllers(): RadioController[];
    findCellByValue(value: T): RadioController | null;
    private onCellInputChange_;
}
export {};
