import { BladeApi, LabeledValueBladeController, Value } from '@tweakpane/core';
import { RadioGridController } from '../controller/radio-grid.js';
import { RadioCellApi } from './radio-cell-api.js';
import { TpRadioGridChangeEvent } from './tp-radio-grid-event.js';
interface RadioGridApiEvents<T> {
    change: {
        event: TpRadioGridChangeEvent<T>;
    };
}
export declare class RadioGridApi<T> extends BladeApi<LabeledValueBladeController<T, RadioGridController<T>>> {
    private cellToApiMap_;
    constructor(controller: LabeledValueBladeController<T, RadioGridController<T>>);
    get value(): Value<T>;
    cell(x: number, y: number): RadioCellApi | undefined;
    on<EventName extends keyof RadioGridApiEvents<T>>(eventName: EventName, handler: (ev: RadioGridApiEvents<T>[EventName]['event']) => void): void;
}
export {};
