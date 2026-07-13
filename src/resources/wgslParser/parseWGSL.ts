import {WgslReflect} from "wgsl_reflect";
import ensureVertexIndexBuiltin from "./core/ensureVertexIndexBuiltin";
import preprocessWGSL from "./core/preprocessWGSL";
import WGSLUniformTypes from "./core/WGSLUniformTypes";

/**
 * [KO] 개별 유니폼 멤버 정보를 생성합니다.
 * [EN] Creates individual globalStruct member information.
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
    const newMembers = members?.reduce((prev, curr) => {
        const {type, offset, size, stride, count, isArray} = curr;
        const {format} = type;
        const typeName = type.name === 'array'
            ? `${format.name}${format.format ? `${format.format.name}` : ''}`
            : `${type.name}${format ? `${format.name}` : ''}`;

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
            // delete  prev[curr.name].memberList
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
 * [EN] Processes an array of globalStruct information and returns it as a map.
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

const convertMembersToKeyValue = (typeInfo) => {
    if (!typeInfo) return typeInfo;
    const newType = {...typeInfo};
    if (Array.isArray(newType.members)) {
        const processed = processMembers(newType.members);
        newType.members = processed.members;
    }
    if (newType.format && Array.isArray(newType.format.members)) {
        newType.format = {...newType.format};
        const processed = processMembers(newType.format.members);
        newType.format.members = processed.members;
    }
    return newType;
};

/**
 * [KO] 스토리지 정보 배열을 처리하여 맵으로 반환합니다.
 * [EN] Processes an array of storage information and returns it as a map.
 */
const processStorages = (storage) => {
    return storage.reduce((prev, curr) => {
        const typeInfo = convertMembersToKeyValue(curr.type);
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
            stride: curr.stride,
            acccess: curr.access,
            type: typeInfo,
        };
        curr.attributes?.forEach(v => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};

/**
 * [KO] 구조체 정보 배열을 처리하여 맵으로 반환합니다.
 * [EN] Processes an array of struct information and returns it as a map.
 */
const processStructs = (structs) => {
    return structs.reduce((prev, curr) => {
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
        };
        curr.attributes?.forEach(v => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};

// 캐시 맵 선언 (const 유지 가능)
const reflectCache = new Map<string, any>();

/**
 * [KO] WGSL 리플렉션 캐시를 명시적으로 비우고 자원을 해제합니다.
 * [EN] Explicitly clears the WGSL reflection cache and releases resources.
 * @category WGSL
 */
export const destroyReflectCache = (): void => {
    if (reflectCache) {
        // 캐시 내부의 거대한 인스턴스들이 물고 있는 참조를 먼저 끊어줍니다.
        for (const [key, value] of reflectCache.entries()) {
            if (value.shaderSourceVariant) {
                try {
                    value.shaderSourceVariant.destroy();
                } catch (e) {
                    // 예외 처리
                }
                value.shaderSourceVariant = null;
            }
            value.uniforms = null;
            value.storage = null;
            value.structs = null;
            value.samplers = null;
            value.textures = null;
            value.vertexEntries = null;
            value.computeEntries = null;
            value.fragmentEntries = null;
            // keepLog(key,value)
        }

        reflectCache.clear();
        console.log('✨ Reflect Cache 완벽 해소 완료');
    }
};
/**
 * [KO] WGSL 코드를 파싱하고 리플렉션 정보를 반환합니다.
 * [EN] Parses WGSL code and returns reflection information.
 * @category WGSL
 */
const parseWGSL = (sourceName: string, code: string, injectLibrary?: Record<string, string>): {
    uniforms: any;
    storage: any;
    structs: any;
    samplers: any;
    textures: any;
    vertexEntries: string[];
    fragmentEntries: string[];
    computeEntries: string[];
    defaultSource: string;
    shaderSourceVariant: any;
    conditionalBlocks: string[];
} => {
    if (!sourceName) {
        throw new Error(`[parseWGSL] sourceName is required. (provided: ${sourceName})`);
    }

    code = ensureVertexIndexBuiltin(code);
    const {
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks: uniqueKeys,
        cacheKey
    } = preprocessWGSL(sourceName, code, injectLibrary);

    const cachedReflect = reflectCache.get(cacheKey);
    let reflectResult;

    if (cachedReflect) {
        console.log('🚀 캐시에서 리플렉트 로드:', cacheKey);
        // 캐시 데이터 오염 및 참조 꼬임을 막기 위해 얕은 복사본을 만들어 다룹니다.
        reflectResult = {...cachedReflect};
    } else {
        console.log('🔄 리플렉트 파싱 시작:', cacheKey);
        const reflect = new WgslReflect(defaultSource);

        reflectResult = {
            uniforms: {...processUniforms(reflect.uniforms)},
            storage: {...processStorages(reflect.storage)},
            structs: {...processStructs(reflect.structs)},
            samplers: reflect.samplers,
            textures: reflect.textures,
            vertexEntries: reflect.entry.vertex.map(v => v.name),
            fragmentEntries: reflect.entry.fragment.map(v => v.name),
            computeEntries: reflect.entry.compute.map(v => v.name),
        };

        // [KO] ShaderVariantGenerator에 기본 정보 설정
        shaderSourceVariant.setBaseInfo(reflectResult.textures, reflectResult.samplers);

        // [KO] 각 조건부 키별로 추가되는 텍스처/샘플러 수집
        uniqueKeys.forEach(key => {
            const variantSource = shaderSourceVariant.getVariant(key);
            const variantReflect = new WgslReflect(variantSource);
            const extraTextures = variantReflect.textures.filter(t =>
                !reflectResult.textures.find(bt => bt.name === t.name)
            );
            const extraSamplers = variantReflect.samplers.filter(s =>
                !reflectResult.samplers.find(bs => bs.name === s.name)
            );
            shaderSourceVariant.addConditionalInfo(key, extraTextures, extraSamplers);
        });

        // [KO] 모든 가능한 텍스처/샘플러의 합집합으로 reflectResult 업데이트
        reflectResult.textures = shaderSourceVariant.getUnionTextures();
        reflectResult.samplers = shaderSourceVariant.getUnionSamplers();

        // 캐시 맵에는 독립된 원본 객체 스냅샷 형태로 보관합니다.
        reflectCache.set(cacheKey, {...reflectResult});
    }

    // 최종 반환 시 내부 데이터 참조가 외부 컴포넌트에 단단히 결합하여 무덤까지 따라가는 것을 방지하기 위해
    // 새로운 껍데기 객체로 매핑하여 내보냅니다.
    // keepLog(
    //     sourceName,
    //     {
    //         ...reflectResult,
    //         defaultSource,
    //         shaderSourceVariant,
    //         conditionalBlocks: uniqueKeys
    //     }
    // )
    return {
        ...reflectResult,
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks: uniqueKeys
    };
};

export default parseWGSL;