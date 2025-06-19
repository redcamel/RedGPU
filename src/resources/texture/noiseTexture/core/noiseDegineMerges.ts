const mergerNoiseUniformStruct = (baseStruct: string, addStruct: string): string => {
	return [baseStruct, addStruct].filter(Boolean).join('\n')
}
const mergerNoiseUniformDefault = (basicOption, addOption) => {
	return {
		...basicOption,
		...(addOption || {}),
	}
}
export {
	mergerNoiseUniformStruct,
	mergerNoiseUniformDefault
}
