import getConstructorName from "../getConstructorName";

const hexadecimalToRgb = (hexadecimal: number | string, returnArrayYn: boolean = false): any => {
	// console.log(hexadecimal, typeof hexadecimal)
	if (typeof hexadecimal === 'number') {
		hexadecimal = Math.floor(+hexadecimal)
		if (returnArrayYn) {
			return [
				(hexadecimal >> 16 & 255) / 255,
				(hexadecimal >> 8 & 255) / 255,
				(hexadecimal & 255) / 255,
				1
			]
		} else {
			return {
				r: (hexadecimal >> 16 & 255) / 255,
				g: (hexadecimal >> 8 & 255) / 255,
				b: (hexadecimal & 255) / 255,
				a: 1,
			}
		}
	} else if (typeof hexadecimal === 'string' && (
		/^#([A-Fa-f0-9]{3}){1,2}$/.test(hexadecimal)
		|| /^(0x)([A-Fa-f0-9]{3}){1,2}$/.test(hexadecimal)
	)
	) {
		const result = [];
		let temp: string[] = (hexadecimal.substring(0, 2) === '0x' ? hexadecimal.substring(2) : hexadecimal.substring(1)).split('');
		if (temp.length === 3) temp = [temp[0], temp[0], temp[1], temp[1], temp[2], temp[2]];
		const temp2: any = '0x' + temp.join('');
		result[0] = ((temp2 >> 16) & 255) / 255;
		result[1] = ((temp2 >> 8) & 255) / 255;
		result[2] = (temp2 & 255) / 255;
		if (returnArrayYn) {
			return [
				...result,
				1
			]
		} else {
			return {
				r: result[0],
				g: result[1],
				b: result[2],
				a: 1,
			}
		}
	} else {
		throw Error(`from ${getConstructorName(hexadecimalToRgb)} : input value - ${hexadecimal} / Only hexadecimal number or hex string allowed`)
	}
}
export default hexadecimalToRgb
