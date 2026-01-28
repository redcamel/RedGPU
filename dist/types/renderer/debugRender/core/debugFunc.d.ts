import ColorRGBA from "../../../color/ColorRGBA";
declare const createDebugTitle: (title: string) => string;
declare const makeColorDebug: (key: string, color: ColorRGBA) => string;
declare const makeBooleanDebug: (key: string, value: any) => string;
declare const getDebugFormatValue: (value: any) => any;
declare const updateDebugItemValue: (targetDom: any, selector: string, value: any, condition?: boolean, unit?: string) => void;
export { createDebugTitle, makeColorDebug, makeBooleanDebug, getDebugFormatValue, updateDebugItemValue };
