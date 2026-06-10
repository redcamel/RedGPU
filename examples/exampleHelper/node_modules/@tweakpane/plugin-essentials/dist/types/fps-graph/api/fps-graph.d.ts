import { BladeApi, TpEvent } from '@tweakpane/core';
import { FpsGraphBladeController } from '../controller/fps-graph-blade.js';
export interface FpsGraphBladeApiEvents {
    tick: TpEvent<FpsGraphBladeApi>;
}
export declare class FpsGraphBladeApi extends BladeApi<FpsGraphBladeController> {
    get fps(): number | null;
    get max(): number;
    set max(max: number);
    get min(): number;
    set min(min: number);
    begin(): void;
    end(): void;
    on<EventName extends keyof FpsGraphBladeApiEvents>(eventName: EventName, handler: (ev: FpsGraphBladeApiEvents[EventName]) => void): this;
}
