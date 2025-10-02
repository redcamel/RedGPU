export declare const COMPOSITE_MODE: {
    readonly ADDITIVE: "additive";
    readonly SOURCE_OVER: "source-over";
    readonly SOURCE_IN: "source-in";
    readonly SOURCE_OUT: "source-out";
    readonly SOURCE_ATOP: "source-atop";
    readonly DESTINATION_OVER: "destination-over";
    readonly DESTINATION_IN: "destination-in";
    readonly DESTINATION_OUT: "destination-out";
    readonly DESTINATION_ATOP: "destination-atop";
};
export type COMPOSITE_MODE = typeof COMPOSITE_MODE[keyof typeof COMPOSITE_MODE];
export default COMPOSITE_MODE;
