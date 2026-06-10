import { RadioController } from '../controller/radio.js';
export declare class RadioCellApi {
    private controller_;
    constructor(controller: RadioController);
    get disabled(): boolean;
    set disabled(disabled: boolean);
    get title(): string;
    set title(title: string);
}
