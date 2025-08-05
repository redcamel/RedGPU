import ColorRGBA from "../../../color/ColorRGBA";

const createDebugTitle = (title: string) => {
	return `<div>${title}</div>`
}
const makeColorDebug = (key: string, color: ColorRGBA) => {
	return `
<div class='debug-item'>
<!--	<span class='debug-item-title'>${key}</span>  -->
	<span class='debug-item-title'></span>  
	<div style="border:1px solid rgba(255,255,255,0.2);border-radius:4px;background: rgba(${color.rgba});padding:3px;margin:2px">
		${color.rgba}
	</div>
</div>
`
}
const makeBooleanDebug = (key: string, value) => {
	return `<span class="${value ? 'boolean-true' : 'boolean-false'}">${value ? 'TRUE' : 'FALSE'}</span>`
}
const getDebugFormatValue = (value: any) => {
	return typeof value === 'boolean' ? value.toString() : typeof value === 'number' ? value.toLocaleString() : value;
}
const updateDebugItemValue = (targetDom, selector: string, value: any, condition?: boolean, unit: string = '') => {
	const element: any = targetDom.querySelector(`.${selector}`);
	if (!element) return;
	const formattedValue = `${getDebugFormatValue(value)}${unit}`;
	if (element.innerHTML !== formattedValue) {
		element.innerHTML = formattedValue;
		if (condition) {
			element.style.background = value ? 'green' : 'rgba(255,255,255,0.1)';
		}
	}
}
export {
	createDebugTitle,
	makeColorDebug,
	makeBooleanDebug,
	getDebugFormatValue,
	updateDebugItemValue
}
