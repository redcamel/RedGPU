import {WgslReflect} from "wgsl_reflect";
import WGSLUniformTypes from "./core/WGSLUniformTypes";
import ShaderVariantGenerator from "./core/ShaderVariantGenerator";
import PassClustersLightHelper from "../../light/clusterLight/core/PassClustersLightHelper";
import ShaderLibrary from "../../systemCodeManager/ShaderLibrary";

// 매크로 및 전처리용 정규식/상수 정의 (순수 함수 영역)
const includePattern = /#redgpu_include\s+([\w.]+)/g;
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

export interface ConditionalBlock {
    uniformName: string;
    ifBlock: string;
    elseBlock?: string;
    fullMatch: string;
    blockIndex: number;
}

export interface PreprocessedWGSLResult {
    cacheKey: string;
    defaultSource: string;
    shaderSourceVariant: ShaderVariantGenerator;
    conditionalBlocks: string[];
    conditionalBlockInfos: ConditionalBlock[];
}

/**
 * [KO] 개별 유니폼 멤버 정보를 생성합니다.
 */
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

/**
 * [KO] 구조체 멤버들을 재귀적으로 처리합니다.
 */
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

/**
 * [KO] 유니폼 정보 배열을 처리하여 맵으로 반환합니다.
 */
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

/**
 * [KO] 스토리지 정보 배열을 처리하여 맵으로 반환합니다.
 */
const processStorages = (storage: any[]) => {
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
        curr.attributes?.forEach((v: any) => prev[curr.name][v.name] = +v.value);
        return prev;
    }, {});
};

/**
 * [KO] 구조체 정보 배열을 처리하여 맵으로 반환합니다.
 */
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

/**
 * [KO] 코드 해시를 생성합니다.
 */
const generateCodeHash = (code: string): string => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
        const char = code.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

/**
 * [KO] 인클루드(#redgpu_include)를 처리합니다.
 */
const processIncludes = (code: string, sourceName: string = 'Unknown Shader', injectLibrary?: Record<string, string>): string => {
    let result = code;
    let iterations = 0;
    const MAX_ITERATIONS = 10;
    const includedPaths = new Set<string>();

    const resolvePath = (path: string, offset: number, currentSource: string): string | null => {
        if (includedPaths.has(path)) {
            return '';
        }

        if (injectLibrary && path in injectLibrary) {
            includedPaths.add(path);
            return injectLibrary[path];
        }

        const parts = path.split('.');
        let current: any = ShaderLibrary;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            } else {
                const lineNumber = currentSource.substring(0, offset).split('\n').length;
                throw new Error(`[preprocessWGSL] Invalid include path in [${sourceName}] at line ${lineNumber}: #redgpu_include ${path}. Path not found in injected library or ShaderLibrary.`);
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

/**
 * [KO] 정의(REDGPU_DEFINE_*)를 처리합니다.
 */
const processDefines = (code: string): string => {
    return code.replace(definePattern, (match) =>
        defineValues[match as keyof typeof defineValues] || match
    );
};

/**
 * [KO] 조건부 블록(#redgpu_if)을 찾아 파싱합니다.
 */
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
 * [KO] WGSL 셰이더 코드 전처리 및 AST 분석 리플렉션 캐시 관리 클래스
 * [EN] WGSL shader code preprocessing and AST analysis reflection cache management class
 */
class WGSLParser {
    #preprocessCache = new Map<string, PreprocessedWGSLResult>();
    #sourceNameRegistry = new Map<string, string>();
    #reflectCache = new Map<string, any>();
    #activeParseResults: any[] = [];

    /**
     * [KO] WGSL 코드를 전처리하고 리플렉션 정보를 반환합니다.
     */
    public parse(sourceName: string, code: string, injectLibrary?: Record<string, string>): {
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
        } = this.#preprocess(sourceName, code, injectLibrary);

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

    /**
     * [KO] 파서 내부 캐시 맵의 모든 자원을 명시적으로 비우고 해제합니다.
     */
    public destroy(): void {
        // 리플렉션 캐시 자원 해소
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

        // 활성 파싱 결과의 참조 고리 끊기
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

        // 전처리 캐시 자원 해소
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
     * [KO] WGSL 코드를 전처리합니다. (인스턴스 캐시 사용)
     */
    #preprocess(sourceName: string, code: string, injectLibrary?: Record<string, string>): PreprocessedWGSLResult {
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

        const withIncludes = processIncludes(code, sourceName, injectLibrary);
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