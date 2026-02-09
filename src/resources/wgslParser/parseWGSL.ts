import {WgslReflect} from "wgsl_reflect";
import ensureVertexIndexBuiltin from "./core/ensureVertexIndexBuiltin";
import preprocessWGSL from "./core/preprocessWGSL";
import WGSLUniformTypes from "./core/WGSLUniformTypes";

/**
 * [KO] 개별 유니폼 멤버 정보를 생성합니다.
 * [EN] Creates individual uniform member information.
 * @param curr -
 * [KO] 현재 멤버 정보
 * [EN] Current member information
 * @param start -
 * [KO] 시작 오프셋
 * [EN] Start offset
 * @param typeName -
 * [KO] 타입 이름
 * [EN] Type name
 * @returns
 * [KO] 가공된 유니폼 멤버 정보
 * [EN] Processed uniform member information
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
 * @param members -
 * [KO] 구조체 멤버 배열
 * [EN] Struct members array
 * @param start -
 * [KO] 시작 오프셋 (기본값: 0)
 * [EN] Start offset (default: 0)
 * @param end -
 * [KO] 종료 오프셋 (기본값: 0)
 * [EN] End offset (default: 0)
 * @returns
 * [KO] 처리된 멤버 맵과 오프셋 정보
 * [EN] Processed members map and offset information
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
 * @param uniforms -
 * [KO] 유니폼 배열
 * [EN] Uniforms array
 * @returns
 * [KO] 가공된 유니폼 정보 맵
 * [EN] Processed uniform information map
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
 * @param storage -
 * [KO] 스토리지 배열
 * [EN] Storage array
 * @returns
 * [KO] 가공된 스토리지 정보 맵
 * [EN] Processed storage information map
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
    const {
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks: uniqueKeys,
        cacheKey
    } = preprocessWGSL(code);
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

        // [KO] ShaderVariantGenerator에 기본 정보 설정
        // [EN] Set base information in ShaderVariantGenerator
        shaderSourceVariant.setBaseInfo(reflectResult.textures, reflectResult.samplers);

        // [KO] 각 조건부 키별로 추가되는 텍스처/샘플러 수집
        // [EN] Collect textures/samplers added for each conditional key
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

        // [KO] 모든 가능한 텍스처/샘플러의 합집합으로 reflectResult 업데이트 (바인드 그룹 레이아웃용)
        // [EN] Update reflectResult with the union of all possible textures/samplers (for bind group layout)
        reflectResult.textures = shaderSourceVariant.getUnionTextures();
        reflectResult.samplers = shaderSourceVariant.getUnionSamplers();

        reflectCache.set(cacheKey, reflectResult);
    }
    return {
        ...reflectResult,
        defaultSource,
        shaderSourceVariant,
        conditionalBlocks: uniqueKeys
    };
};

export default parseWGSL;