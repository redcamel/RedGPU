const mergerNoiseUniformStruct = (baseStruct, addStruct) => {
    return [baseStruct, addStruct].filter(Boolean).join('\n');
};
const mergerNoiseUniformDefault = (basicOption, addOption) => {
    return {
        ...basicOption,
        ...(addOption || {}),
    };
};
const mergerNoiseHelperFunctions = (baseHelperFunctions, addHelperFunctions) => {
    return [baseHelperFunctions, addHelperFunctions].filter(Boolean).join('\n');
};
export { mergerNoiseUniformStruct, mergerNoiseUniformDefault, mergerNoiseHelperFunctions };
