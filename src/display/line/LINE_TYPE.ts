/**
 * @category Line
 */
const LINE_TYPE = {
    LINEAR: 'linear',
    CATMULL_ROM: 'catmullRom',
    BEZIER: 'bezier'
} as const
type LINE_TYPE = typeof LINE_TYPE[keyof typeof LINE_TYPE];
Object.freeze(LINE_TYPE)
export default LINE_TYPE
