/**
 * @category Line
 */
declare const LINE_TYPE: {
    readonly LINEAR: "linear";
    readonly CATMULL_ROM: "catmullRom";
    readonly BEZIER: "bezier";
};
type LINE_TYPE = typeof LINE_TYPE[keyof typeof LINE_TYPE];
export default LINE_TYPE;
