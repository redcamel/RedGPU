import { BaseInputParams, InputBindingPlugin } from '@tweakpane/core';
interface RadioGridInputParams<T> extends BaseInputParams {
    cells: (x: number, y: number) => {
        title: string;
        value: T;
    };
    groupName: string;
    size: [number, number];
    view: 'radiogrid';
}
export declare const RadioGruidNumberInputPlugin: InputBindingPlugin<number, number, RadioGridInputParams<number>>;
export declare const RadioGruidStringInputPlugin: InputBindingPlugin<string, string, RadioGridInputParams<string>>;
export declare const RadioGruidBooleanInputPlugin: InputBindingPlugin<boolean, boolean, RadioGridInputParams<boolean>>;
export {};
