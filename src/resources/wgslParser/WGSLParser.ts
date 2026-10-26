import {WgslReflect} from "wgsl_reflect";
import WGSLUniformTypes from "./core/WGSLUniformTypes";
import ShaderVariantGenerator from "./core/ShaderVariantGenerator";
import PassClustersLightHelper from "../../light/core/clusterLight/core/PassClustersLightHelper";
import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";

const includePattern = /#redgpu_include\s+([\w.]+)\s*;?/g;
const extensionLibraries: Map<string, any> = new Map();
const definePattern = /REDGPU_DEFINE_(?:TILE_COUNT_[XYZ]|TOTAL_TILES|WORKGROUP_SIZE_[XYZ]|MAX_LIGHTS_PER_CLUSTER)/g;
const defineValues = {
    REDGPU_DEFINE_TILE_COUNT_X: PassClustersLightHelper.TILE_COUNT_X.toString(),
    REDGPU_DEFINE_TILE_COUNT_Y: PassClustersLightHelper.TILE_COUNT_Y.toString(),
    REDGPU_DEFINE_TILE_COUNT_Z: PassClustersLightHelper.TILE_COUNT_Z.toString(),
    REDGPU_DEFINE_TOTAL_TILES: PassClustersLightHelper.getTotalTileSize().toString(),
    REDGPU_DEFINE_WORKGROUP_SIZE_X: PassClustersLightHelper.WORKGROUP_SIZE_X.toString(),
    REDGPU_DEFINE_WORKGROUP_SIZE_Y: PassClustersLightHelper.WORKGROUP_SIZE_Y.toString(),
    REDGPU_DEFINE_WORKGROUP_SIZE_Z: PassClustersLightHelper.WORKGROUP_SIZE_Z.toString(),
    REDGPU_DEFINE_MAX_LIGHTS_PER_CLUSTER: PassClustersLightHelper.MAX_LIGHTS_PER_CLUSTER.toString(),
} as const;

/**
 * [KO] WGSL 셰이더의 조건부 블록(`#redgpu_if`) 파싱 정보를 담는 인터페이스입니다.
 * [EN] Interface representing parsed conditional block (`#redgpu_if`) information in a WGSL shader.
 *
 * @category WGSL
 */
export interface ConditionalBlock {
    /**
     * [KO] 조건부 활성화 기준 유니폼 이름
     * [EN] Uniform name used as the conditional activation key
     */
    uniformName: string;
    /**
     * [KO] 조건이 참일 때 포함될 코드 블록
     * [EN] Code block included when the condition is true
     */
    ifBlock: string;
    /**
     * [KO] 조건이 거짓일 때 포함될 코드 블록
     * [EN] Code block included when the condition is false
     */
    elseBlock?: string;
    /**
     * [KO] 원본 코드에서 매칭된 전체 조건부 구문 문자열
     * [EN] Full matched conditional statement string from the original code
     */
    fullMatch: string;
    /**
     * [KO] 조건부 블록의 순번 인덱스
     * [EN] Sequential index of the conditional block
     */
    blockIndex: number;
}

/**
 * [KO] WGSL 전처리 결과 데이터를 담는 인터페이스입니다.
 * [EN] Interface representing preprocessed WGSL result data.
 *
 * @category WGSL
 */
export interface PreprocessedWGSLResult {
    /**
     * [KO] 전처리 캐시 식별 키
     * [EN] Preprocessing cache identification key
     */
    cacheKey: string;
    /**
     * [KO] 기본 조건('none')으로 생성된 WGSL 셰이더 소스 코드
     * [EN] WGSL shader source code generated with the default condition ('none')
     */
    defaultSource: string;
    /**
     * [KO] 셰이더 변형(Variant) 생성기 인스턴스
     * [EN] Shader variant generator instance
     */
    shaderSourceVariant: ShaderVariantGenerator;
    /**
     * [KO] 추출된 고유 조건부 키 배열
     * [EN] Array of extracted unique conditional keys
     */
    conditionalBlocks: string[];
    /**
     * [KO] 파싱된 조건부 블록 상세 정보 배열
     * [EN] Array of parsed conditional block details
     */
    conditionalBlockInfos: ConditionalBlock[];
}

const createUniformMember = (curr: any, start: number, typeName: string) => {
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

const processMembers = (members: any[], start: number = 0, end: number = 0): any => {
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
                const temp: any = {};
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

const processUniforms = (uniforms: any[]) => {
    return uniforms.reduce((prev, curr) => {
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
            stride: curr.stride,
        };
        curr.attributes?.forEach((v: any) => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};

const convertMembersToKeyValue = (typeInfo: any) => {
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

const processStorages = (storage: any[]) => {
    return storage.reduce((prev, curr) => {
        const typeInfo = convertMembersToKeyValue(curr.type);
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
            stride: curr.stride,
            access: curr.access,
            acccess: curr.access,
            type: typeInfo,
        };
        curr.attributes?.forEach((v: any) => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};

const processStructs = (structs: any[]) => {
    return structs.reduce((prev, curr) => {
        prev[curr.name] = {
            name: curr.name,
            ...processMembers(curr.members),
            arrayBufferByteLength: curr.size,
        };
        curr.attributes?.forEach((v: any) => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};

const generateCodeHash = (code: string): string => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

const processIncludes = (code: string, sourceName: string = 'Unknown Shader'): string => {
    let result = code;
    let iterations = 0;
    const MAX_ITERATIONS = 10;
    const includedPaths = new Set<string>();

    const resolvePath = (path: string, offset: number, currentSource: string): string | null => {
        if (includedPaths.has(path)) {
            return '';
        }

        const parts = path.split('.');
        let current: any = ShaderLibrary;
        if (parts.length > 0 && extensionLibraries.has(parts[0])) {
            current = extensionLibraries.get(parts[0]);
            parts.shift();
        }
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                const lineNumber = currentSource.substring(0, offset).split('\n').length;
                throw new Error(`[preprocessWGSL] Invalid include path in [${sourceName}] at line ${lineNumber}: #redgpu_include ${path}. Path not found in extension libraries or ShaderLibrary.`);
            }
        }

        if (typeof current === 'string') {
            includedPaths.add(path);
            return current;
        } else {
            const lineNumber = currentSource.substring(0, offset).split('\n').length;
            throw new Error(`[preprocessWGSL] Invalid include target in [${sourceName}] at line ${lineNumber}: #redgpu_include ${path}. Target is not a WGSL string.`);
        }
    };

    while (iterations < MAX_ITERATIONS) {
        const previousResult = result;
        result = result.replace(includePattern, (match, path, offset) => {
            const resolved = resolvePath(path, offset, result);
            return resolved !== null ? resolved : match;
        });
        if (result === previousResult) break;
        iterations++;
    }
    return result;
};

const processDefines = (code: string): string => {
    return code.replace(definePattern, (match) =>
        defineValues[match as keyof typeof defineValues] || match
    );
};

const findConditionalBlocks = (code: string): ConditionalBlock[] => {
    const conditionalBlocks: ConditionalBlock[] = [];
    const tokenRegex = /#redgpu_if\s+(\w+)\b|#redgpu_else|#redgpu_endIf/g;

    const stack: {
        uniformName: string;
        startIndex: number;
        headerLength: number;
        elseIndex?: number;
    }[] = [];

    let match;
    let blockIndex = 0;
    while ((match = tokenRegex.exec(code)) !== null) {
        const token = match[0];
        if (token.startsWith('#redgpu_if')) {
            stack.push({
                uniformName: match[1],
                startIndex: match.index,
                headerLength: token.length
            });
        } else if (token === '#redgpu_else') {
            const top = stack[stack.length - 1];
            if (top) {
                if (top.elseIndex === undefined) {
                    top.elseIndex = match.index;
                }
            } else {
                throw new Error(`[preprocessWGSL] Mismatched #redgpu_else at index ${match.index}`);
            }
        } else if (token === '#redgpu_endIf') {
            const top = stack.pop();
            if (top) {
                const fullMatch = code.substring(top.startIndex, match.index + token.length);
                let ifBlock: string;
                let elseBlock: string | undefined;

                if (top.elseIndex !== undefined) {
                    ifBlock = code.substring(top.startIndex + top.headerLength, top.elseIndex);
                    elseBlock = code.substring(top.elseIndex + '#redgpu_else'.length, match.index);
                } else {
                    ifBlock = code.substring(top.startIndex + top.headerLength, match.index);
                }

                conditionalBlocks.push({
                    uniformName: top.uniformName,
                    ifBlock: ifBlock.trim(),
                    elseBlock: elseBlock?.trim(),
                    fullMatch,
                    blockIndex: blockIndex++
                });
            } else {
                throw new Error(`[preprocessWGSL] Mismatched #redgpu_endIf at index ${match.index}`);
            }
        }
    }

    if (stack.length > 0) {
        throw new Error(`[preprocessWGSL] Unclosed #redgpu_if for: ${stack.map(s => s.uniformName).join(', ')}`);
    }

    return conditionalBlocks;
};

/**
 * [KO] WGSL 셰이더 코드를 전처리하고 리플렉션 데이터를 파싱 및 캐싱하는 클래스입니다.
 * [EN] Class that preprocesses WGSL shader code and parses and caches reflection data.
 *
 * ::: warning
 * [KO] 이 클래스는 시스템에 의해 자동으로 생성됩니다.<br/>'new' 키워드를 사용하여 직접 인스턴스를 생성하지 마십시오.
 * [EN] This class is automatically created by the system.<br/>Do not create an instance directly using the 'new' keyword.
 * :::
 *
 * @category WGSL
 */
class WGSLParser {
    #preprocessCache = new Map<string, PreprocessedWGSLResult>();
    #sourceNameRegistry = new Map<string, string>();
    #reflectCache = new Map<string, any>();
    #activeParseResults: any[] = [];

    /**
     * [KO] 특정 네임스페이스에 서브시스템 또는 확장 WGSL 셰이더 라이브러리를 등록합니다.
     * [EN] Registers a subsystem or extension WGSL shader library under a specific namespace.
     *
     * @param namespace -
     * [KO] 네임스페이스 키 (예: 'landscape')
     * [EN] Namespace key (e.g., 'landscape')
     * @param library -
     * [KO] WGSL 셰이더 조각 컬렉션 객체
     * [EN] WGSL shader snippet collection object
     */
    static registerLibrary(namespace: string, library: any): void {
        if (!namespace || !library) return;
        extensionLibraries.set(namespace, library);
    }

    /**
     * [KO] 파서 내부 캐시 맵의 모든 자원을 명시적으로 해제합니다.
     * [EN] Explicitly releases all resources in the parser's internal cache maps.
     */
    public destroy(): void {
        for (const [key, value] of this.#reflectCache.entries()) {
            if (value.shaderSourceVariant) {
                try {
                    value.shaderSourceVariant.destroy();
                } catch (e) {
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
        }
        this.#reflectCache.clear();

        for (const result of this.#activeParseResults) {
            result.uniforms = null;
            result.storage = null;
            result.structs = null;
            result.samplers = null;
            result.textures = null;
            result.vertexEntries = null;
            result.computeEntries = null;
            result.fragmentEntries = null;
            result.defaultSource = null;
            if (result.shaderSourceVariant) {
                try {
                    result.shaderSourceVariant.destroy();
                } catch (e) {
                }
                result.shaderSourceVariant = null;
            }
            result.conditionalBlocks = null;
        }
        this.#activeParseResults.length = 0;

        for (const [key, value] of this.#preprocessCache.entries()) {
            if (value.shaderSourceVariant) {
                try {
                    value.shaderSourceVariant.destroy();
                } catch (e) {
                }
            }
            value.cacheKey = null;
            value.conditionalBlockInfos = null;
            value.conditionalBlocks = null;
            value.defaultSource = null;
            value.shaderSourceVariant = null;
        }
        this.#preprocessCache.clear();
        this.#sourceNameRegistry.clear();

        console.log('✨ WGSLParser 격리 캐시 메모리 완벽 해소 완료');
    }

    /**
     * [KO] WGSL 코드를 전처리하고 유니폼, 스토리지, 구조체, 텍스처 및 엔트리 포인트 리플렉션 정보를 반환합니다.
     * [EN] Preprocesses WGSL code and returns reflection information for uniforms, storages, structs, textures, and entry points.
     *
     * @param sourceName -
     * [KO] 셰이더 소스 식별 이름
     * [EN] Shader source identification name
     * @param code -
     * [KO] 원본 WGSL 셰이더 코드 문자열
     * [EN] Raw WGSL shader code string
     * @returns
     * [KO] 파싱된 리플렉션 데이터 및 변형 생성기 객체
     * [EN] Parsed reflection data and variant generator object
     * @throws
     * [KO] `sourceName`이 누락되었거나 전처리 구문이 잘못된 경우 Error 발생
     * [EN] Throws Error if `sourceName` is missing or preprocessing syntax is invalid
     */
    public parse(sourceName: string, code: string): {
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
    } {
        if (!sourceName) {
            throw new Error(`[WGSLParser] sourceName is required. (provided: ${sourceName})`);
        }

        const {
            defaultSource,
            shaderSourceVariant,
            conditionalBlocks: uniqueKeys,
            cacheKey
        } = this.#preprocess(sourceName, code);

        const cachedReflect = this.#reflectCache.get(cacheKey);
        let reflectResult;

        if (cachedReflect) {
            console.log('🚀 캐시에서 리플렉트 로드:', cacheKey);
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

            shaderSourceVariant.setBaseInfo(reflectResult.textures, reflectResult.samplers);

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

            reflectResult.textures = shaderSourceVariant.getUnionTextures();
            reflectResult.samplers = shaderSourceVariant.getUnionSamplers();

            this.#reflectCache.set(cacheKey, {...reflectResult});
        }

        const finalResult = {
            ...reflectResult,
            defaultSource,
            shaderSourceVariant,
            conditionalBlocks: uniqueKeys
        };
        this.#activeParseResults.push(finalResult);
        return finalResult;
    }

    #preprocess(sourceName: string, code: string): PreprocessedWGSLResult {
        const codeHash = generateCodeHash(code);
        const existingHash = this.#sourceNameRegistry.get(sourceName);
        if (existingHash && existingHash !== codeHash) {
            console.warn(
                `[WGSLParser] Warning: Shader name "${sourceName}" is already registered with different code.\n` +
                `[KO] 경고: 셰이더 이름 "${sourceName}"이(가) 이미 다른 코드에 대해 등록되어 있습니다.`
            );
        } else {
            this.#sourceNameRegistry.set(sourceName, codeHash);
        }

        const cacheKey = `${codeHash}_${code.length}`;
        const cachedResult = this.#preprocessCache.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }

        const withIncludes = processIncludes(code, sourceName);
        const defines = processDefines(withIncludes);
        const conditionalBlocks = findConditionalBlocks(defines);

        const uniqueKeys = [...new Set(conditionalBlocks.map(b => b.uniformName))];
        const shaderSourceVariant = new ShaderVariantGenerator(defines, conditionalBlocks);
        const defaultSource = shaderSourceVariant.getVariant('none');

        const result: PreprocessedWGSLResult = {
            cacheKey,
            defaultSource,
            shaderSourceVariant,
            conditionalBlocks: uniqueKeys,
            conditionalBlockInfos: conditionalBlocks,
        };

        const totalCombinations = Math.pow(2, uniqueKeys.length);
        this.#preprocessCache.set(cacheKey, result);

        if (totalCombinations > 1) {
            console.log(`레이지 바리안트 생성기 초기화 (캐시 저장):`, totalCombinations, cacheKey);
            console.log('고유 키들:', uniqueKeys);
        }
        return result;
    }
}

Object.freeze(WGSLParser)
export default WGSLParser