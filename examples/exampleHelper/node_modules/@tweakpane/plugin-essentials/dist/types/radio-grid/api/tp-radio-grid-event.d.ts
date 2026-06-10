import { TpChangeEvent } from '@tweakpane/core';
import { RadioCellApi } from './radio-cell-api.js';
export declare class TpRadioGridChangeEvent<T> extends TpChangeEvent<T> {
    readonly cell: RadioCellApi;
    readonly index: [number, number];
    constructor(target: unknown, cell: RadioCellApi, index: [number, number], value: T, last?: boolean);
}
