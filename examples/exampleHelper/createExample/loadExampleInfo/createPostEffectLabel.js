const createPostEffectLabel = (title, isMobile, normalTitle = 'Normal') => {

	const exampleContainer = document.querySelector('#example-container')
	const normalLabel = document.createElement('label');
	const effectLabel = document.createElement('label');

	normalLabel.innerHTML = normalTitle
	effectLabel.innerHTML = title;

	const baseStyle = 'position:absolute;bottom:0;display:flex;align-items:center:justify-content:center;padding:12px;background:#5b52aa'
	const fontStyle = 'color:#fff;font-size:14px;font-weight:600'
	if (isMobile) {
		effectLabel.style.cssText = `${baseStyle};${fontStyle};bottom:none;`
		normalLabel.style.cssText = `${baseStyle};${fontStyle};bottom:50%;`
	} else {
		normalLabel.style.cssText = `${baseStyle};${fontStyle};left:50%;transform:translateX(calc(-100% - 1px))`
		effectLabel.style.cssText = `${baseStyle};${fontStyle};left:50%;`
	}

	exampleContainer.appendChild(normalLabel);
	exampleContainer.appendChild(effectLabel);

}

export {
	createPostEffectLabel
}
