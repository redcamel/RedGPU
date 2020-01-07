/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 18:49:16
 *
 */
const setBottom = _ => {
	let t0;
	t0 = document.createElement('div');
	t0.innerHTML = `
			This project is maintained by <a href="https://github.com/redcamel/">RedCamel</a>
		`;
	t0.style.cssText = `
			position : fixed;
			left : 20px; bottom : 20px;
			font-size : 10px;
		`;
	document.body.appendChild(t0);
};
const setGithubLogo = _ => {
	let t0;
	document.body.appendChild(t0 = document.createElement('img'));
	t0.src = "https://redcamel.github.io/RedGL2/asset/github.png";
	t0.style.cssText = `
		position: fixed;
		top:20px; right:20px;
		width:30px;
		cursor: pointer;"
	`
	t0.onclick = _ => window.location.href = 'https://github.com/redcamel/RedGL2';
};
const setTitle = title => {
	let t0;
	document.body.appendChild(t0 = document.createElement('div'));
	t0.innerHTML = title;
	t0.style.cssText = `
		position: fixed;
		bottom:37px; left:18px;
		font-size : 30px;
		color:#fff;
	`
};
const ExampleHelper = {
	setBaseInformation: title => {
		setBottom();
		setGithubLogo();
		setTitle(title)

	}
};


