const mergerNoiseUniformStruct = (baseStruct: string, addStruct: string): string => {
    return [baseStruct, addStruct].filter(Boolean).join('\n')
}
const mergerNoiseUniformDefault = (basicOption, addOption) => {
    return {
        ...basicOption,
        ...(addOption || {}),
    }
}
const mergerNoiseHelperFunctions = (baseHelperFunctions: string, addHelperFunctions: string): string => {
    return [baseHelperFunctions, addHelperFunctions].filter(Boolean).join('\n')
}
export {
    mergerNoiseUniformStruct,
    mergerNoiseUniformDefault,
    mergerNoiseHelperFunctions
}
