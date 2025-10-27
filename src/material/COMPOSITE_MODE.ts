export const COMPOSITE_MODE = {
    ADDITIVE: "additive",
    SOURCE_OVER: "source-over",
    SOURCE_IN: "source-in",
    SOURCE_OUT: "source-out",
    SOURCE_ATOP: "source-atop",
    DESTINATION_OVER: "destination-over",
    DESTINATION_IN: "destination-in",
    DESTINATION_OUT: "destination-out",
    DESTINATION_ATOP: "destination-atop"
} as const;
export type COMPOSITE_MODE = typeof COMPOSITE_MODE[keyof typeof COMPOSITE_MODE];
export default COMPOSITE_MODE
