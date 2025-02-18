import {WgslReflect} from "wgsl_reflect";
import UniformType from "../buffer/core/type/UniformType";
import parseIncludeWGSL from "./parseIncludeWGSL";

const createUniformMember = (curr, start, typeName) => {
    const UniformTypeInfo = UniformType[typeName];
    return {
        uniformOffset: curr.offset + start,
        stride: curr.stride,
        isArray: curr.isArray,
        typeInfo: UniformTypeInfo,
        View: UniformTypeInfo?.View
    };
};
const processMembers = (members, start = 0, end = 0) => {
    let startOffset = 0;
    let endOffset = end;
    const newMembers = members?.reduce((prev, curr, index) => {
        const {type, offset, size, stride, count, isArray} = curr;
        const {format} = type;
        const typeName = type.name === 'array' ? `${format.name}${format.format ? `${format.format.name}` : ''}` : `${type.name}${format ? `${format.name}` : ''}`;
        if (index === 0) startOffset = offset;
        endOffset = offset + size;
        prev[curr.name] = createUniformMember(curr, start, typeName);
        if (isArray && format.members) {
            const preset = processMembers(format.members).members;
            prev[curr.name].memberList = Array.from({length: count}, (_, i) => {
                const temp = {};
                for (const k in preset) {
                    const t0 = temp[k] = {...preset[k]};
                    t0.uniformOffset = t0.uniformOffset + offset + stride * i;
                }
                return temp;
            });
        } else if (type.members) {
            prev[curr.name] = processMembers(type.members, offset + start, endOffset);
        }
        return prev;
    }, {});
    return {
        members: newMembers,
        startOffset,
        endOffset
    };
};
const processUniforms = (uniforms) => {
    return uniforms.reduce((prev, curr) => {
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
            stride: curr.stride,
        };
        curr.attributes?.forEach(v => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};
const processStorages = (storage) => {
    return storage.reduce((prev, curr) => {
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
            stride: curr.stride,
            acccess: curr.access,
            type: curr.type
        };
        curr.attributes?.forEach(v => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};
const parseWGSL = (shaderSource: string) => {
    const parsedSource = parseIncludeWGSL(shaderSource);
    const reflect = new WgslReflect(parsedSource);
    // console.log('reflect', reflect)
    // console.log('parsedSource', parsedSource)
    return {
        uniforms: {...processUniforms(reflect.uniforms)},
        storage: {...processStorages(reflect.storage)},
        samplers: reflect.samplers,
        textures: reflect.textures,
        vertexEntries: reflect.entry.vertex.map(v => v.name),
        fragmentEntries: reflect.entry.fragment.map(v => v.name),
        computeEntries: reflect.entry.compute.map(v => v.name),
        shaderSource: parsedSource
    };
};
export default parseWGSL;
