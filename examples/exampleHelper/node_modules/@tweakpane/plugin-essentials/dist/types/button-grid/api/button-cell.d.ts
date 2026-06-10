import { ButtonController, TpEvent } from '@tweakpane/core';
interface ButtonCellApiEvents {
    click: {
        event: TpEvent;
    };
}
export declare class ButtonCellApi {
    private controller_;
    constructor(controller: ButtonController);
    get disabled(): boolean;
    set disabled(disabled: boolean);
    get title(): string;
    set title(title: string);
    on<EventName extends keyof ButtonCellApiEvents>(eventName: EventName, handler: (ev: ButtonCellApiEvents[EventName]['event']) => void): this;
}
export {};
