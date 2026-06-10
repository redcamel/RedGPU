import { BladeApi } from '@tweakpane/core';
import { ButtonGridBladeController } from '../controller/button-grid-blade.js';
import { ButtonCellApi } from './button-cell.js';
import { TpButtonGridEvent } from './tp-button-grid-event.js';
interface ButtonGridApiEvents {
    click: {
        event: TpButtonGridEvent;
    };
}
export declare class ButtonGridApi extends BladeApi<ButtonGridBladeController> {
    private emitter_;
    private cellToApiMap_;
    constructor(controller: ButtonGridBladeController);
    cell(x: number, y: number): ButtonCellApi | undefined;
    on<EventName extends keyof ButtonGridApiEvents>(eventName: EventName, handler: (ev: ButtonGridApiEvents[EventName]['event']) => void): this;
}
export {};
