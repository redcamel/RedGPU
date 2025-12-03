/**
 * Represents the possible data types for WebGL components.
 *
 * @type {Object.<number, function>}
 */
const WEBGL_COMPONENT_TYPES = {
    5120: Int8Array,
    5121: Uint8Array,
    5122: Int16Array,
    5123: Uint16Array,
    5125: Uint32Array,
    5126: Float32Array
};
Object.freeze(WEBGL_COMPONENT_TYPES)
export default WEBGL_COMPONENT_TYPES;
