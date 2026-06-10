import { BufferedValue, Controller, Ticker, ViewProps } from '@tweakpane/core';
import { GraphLogProps } from '@tweakpane/core/dist/monitor-binding/number/view/graph-log.js';
import { FpsView } from '../view/fps.js';
interface Config {
    props: GraphLogProps;
    rows: number;
    ticker: Ticker;
    value: BufferedValue<number>;
    viewProps: ViewProps;
}
export declare class FpsGraphController implements Controller<FpsView> {
    readonly props: GraphLogProps;
    readonly ticker: Ticker;
    readonly view: FpsView;
    readonly viewProps: ViewProps;
    private readonly value_;
    private readonly graphC_;
    private readonly stopwatch_;
    constructor(doc: Document, config: Config);
    get fps(): number | null;
    begin(): void;
    end(): void;
    private onTick_;
}
export {};
