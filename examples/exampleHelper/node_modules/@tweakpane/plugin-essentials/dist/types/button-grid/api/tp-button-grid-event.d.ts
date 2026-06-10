import { TpEvent } from '@tweakpane/core';
import { ButtonCellApi } from './button-cell.js';
export declare class TpButtonGridEvent extends TpEvent {
    readonly cell: ButtonCellApi;
    readonly index: [number, number];
    constructor(target: unknown, cell: ButtonCellApi, index: [number, number]);
}
