import consoleAndThrowError from "../../utils/consoleAndThrowError";

const defineProperty = (
	classObject,
	key: string,
	definer: Function,
	value?: any,
	...options
) => {
	Object.defineProperty(
		classObject.prototype,
		key,
		definer(key, value, ...options)
	);
};
const defineProperties = (definer: Function) => (
	classObject: Object,
	keyList: Array<any>
) => {
	keyList.forEach(keys => {
		if (Array.isArray(keys)) {
			const [key, value, ...options] = keys; // 추가 옵션 포함
			defineProperty(classObject, key, definer, value, ...options);
		} else {
			defineProperty(classObject, keys, definer);
		}
	});
};
const definePropertyForKey = (definer: Function) => (
	defineList: string[]
) =>
	defineList.reduce(
		(obj, key) => ({...obj, [key]: definer}),
		{}
	);
const defineByPreset = (
	classObject: Object,
	keyList,
	propertyDefinitions: Record<string, Function>
) => {
	keyList.forEach(keys => {
		if (Array.isArray(keys)) {
			const [key, value, ...options] = keys; // 추가 옵션 포함
			const definer = propertyDefinitions[key];
			if (!definer) {
				consoleAndThrowError(
					key,
					"is a key not defined in Define Preset."
				);
			}
			defineProperty(classObject, key, definer, value, ...options);
		} else {
			const definer = propertyDefinitions[keys];
			if (!definer) {
				consoleAndThrowError(
					keys,
					"is a key not defined in Define Preset."
				);
			}
			defineProperty(classObject, keys, definer);
		}
	});
};
const createDefineByPreset = (list) => {
	const propertyDefinitions: Record<string, Function> = {};
	Object.keys(list).forEach(key => {
		const [definer, preset] = list[key];
		Object.assign(
			propertyDefinitions,
			definePropertyForKey(definer)(Object.values(preset))
		);
	});
	return {
		defineByPreset: (classObject: Object, keyList) =>
			defineByPreset(classObject, keyList, propertyDefinitions),
	};
};
export {
	defineProperties,
	definePropertyForKey,
	createDefineByPreset,
};
