const mergerNoiseUniformStruct = (baseCode: string, addCode: string): string => {
	return [baseCode, addCode].filter(Boolean).join('\n')
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
