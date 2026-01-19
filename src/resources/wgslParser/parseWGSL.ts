import {WgslReflect} from "wgsl_reflect";
import ensureVertexIndexBuiltin from "./core/ensureVertexIndexBuiltin";
import preprocessWGSL from "./core/preprocessWGSL";
import WGSLUniformTypes from "./core/WGSLUniformTypes";

/**
 * [KO] 개별 유니폼 멤버 정보를 생성합니다.
 * [EN] Creates individual uniform member information.
 */
const createUniformMember = (curr, start, typeName) => {
    const UniformTypeInfo = WGSLUniformTypes[typeName];
    return {
        uniformOffset: curr.offset + start,
        uniformOffsetForData: curr.offset,
        stride: curr.stride,
        isArray: curr.isArray,
        typeInfo: UniformTypeInfo,
        View: UniformTypeInfo?.View
    };
};

/**
 * [KO] 구조체 멤버들을 재귀적으로 처리합니다.
 * [EN] Recursively processes struct members.
 */
const processMembers = (members, start = 0, end = 0) => {
    let startOffset = 0;
    let endOffset = end;
    const newMembers = members?.reduce((prev, curr, index) => {
        const {type, offset, size, stride, count, isArray} = curr;
        const {format} = type;
        const typeName = type.name === 'array' ? `${format.name}${format.format ? `${format.format.name}` : ''}` : `${type.name}${format ? `${format.name}` : ''}`;
        startOffset = start;
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

/**
 * [KO] 유니폼 정보 배열을 처리하여 맵으로 반환합니다.
 * [EN] Processes an array of uniform information and returns it as a map.
 */
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

/**
 * [KO] 스토리지 정보 배열을 처리하여 맵으로 반환합니다.
 * [EN] Processes an array of storage information and returns it as a map.
 */
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

const reflectCache = new Map<string, any>();

/**
 * [KO] WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.
 * [EN] Parses WGSL code and returns reflection information.
 *
 * [KO] 이 함수는 WGSL 소스 코드를 분석하여 유니폼, 스토리지, 샘플러, 텍스처 등의 정보를 추출하고, 조건부 컴파일(variant) 처리를 지원합니다.
 * [EN] This function analyzes WGSL source code to extract information about uniforms, storage, samplers, and textures, and supports conditional compilation (variant) processing.
 *
 * @param code -
 * [KO] 파싱할 WGSL 셰이더 코드 문자열
 * [EN] WGSL shader code string to parse
 * @returns
 * [KO] 리플렉션 정보 및 전처리된 소스 코드를 포함하는 객체
 * [EN] An object containing reflection information and preprocessed source code
 * @category WGSL
 */
const parseWGSL = (code: string) => {
    code = ensureVertexIndexBuiltin(code)
    const {defaultSource, shaderSourceVariant, conditionalBlocks, cacheKey} = preprocessWGSL(code);
    const cachedReflect = reflectCache.get(cacheKey);
    let reflectResult;
    if (cachedReflect) {
        console.log('🚀 캐시에서 리플렉트 로드:', cacheKey);
        reflectResult = cachedReflect
    } else {
        console.log('🔄 리플렉트 파싱 시작:', cacheKey);
        const reflect = new WgslReflect(defaultSource);
        reflectResult = {
            uniforms: {...processUniforms(reflect.uniforms)},
            storage: {...processStorages(reflect.storage)},
            samplers: reflect.samplers,
            textures: reflect.textures,
            vertexEntries: reflect.entry.vertex.map(v => v.name),
            fragmentEntries: reflect.entry.fragment.map(v => v.name),
            computeEntries: reflect.entry.compute.map(v => v.name),
        };
        reflectCache.set(cacheKey, reflectResult);
    }
    return {
        ...reflectResult,
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks
    };
};

export default parseWGSL;