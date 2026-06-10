import { BladeApi, LabeledValueBladeController, TpChangeEvent } from '@tweakpane/core';
import { CubicBezierController } from '../controller/cubic-bezier.js';
import { CubicBezier } from '../model/cubic-bezier.js';
export interface CubicBezierApiEvents {
    change: {
        event: TpChangeEvent<CubicBezier>;
    };
}
export declare class CubicBezierApi extends BladeApi<LabeledValueBladeController<CubicBezier, CubicBezierController>> {
    get label(): string | null | undefined;
    set label(label: string | null | undefined);
    get value(): CubicBezier;
    set value(value: CubicBezier);
    on<EventName extends keyof CubicBezierApiEvents>(eventName: EventName, handler: (ev: CubicBezierApiEvents[EventName]['event']) => void): this;
}
