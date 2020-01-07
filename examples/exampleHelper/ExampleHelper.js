/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 22:21:57
 *
 */

const ExampleHelper = (_ => {
	const setBottom = _ => {
		let t0, t1;
		t0 = document.createElement('div');
		document.body.appendChild(t0);
		t0.style.cssText = `
			position : fixed;
			left : 20px; bottom : 20px; right:20px;
		`;
		//
		t0.appendChild(t1 = document.createElement('div'))
		t1.style.cssText = `
			height : 0px;
			border-bottom: 1px solid #333;
		`
		//
		t0.appendChild(t1 = document.createElement('div'));
		t1.innerHTML = `
			This project is maintained by <a href="https://github.com/redcamel/">RedCamel</a>
		`;
		t1.style.cssText = `
			margin-top:20px;
			font-size : 10px;
			color : #b19898;
		`;
		document.body.appendChild(t0);


	};
	const setGithubLogo = _ => {
		let t0;
		document.body.appendChild(t0 = document.createElement('img'));
		t0.src = "../../assets/github.png";
		t0.style.cssText = `
		position: fixed;
		top:20px; right:20px;
		width:30px;
		cursor: pointer;"
	`;
		t0.onclick = _ => window.location.href = 'https://github.com/redcamel/RedGPU';
	};
	const setTitle = (title, description) => {
		let t0, t1;
		document.body.appendChild(t0 = document.createElement('div'));
		t0.innerHTML = title;
		t0.style.cssText = `
		position: fixed;
		bottom:65px; left:18px;
		font-size : 32px;
		color:#fff;
		text-shadow : 1px 1px 1px rgba(0,0,0,1);
		`;
		t0.appendChild(t1 = document.createElement('div'));
		t1.innerHTML = description;
		t1.style.cssText = `
		font-size : 9px;
		padding:3px 0px 0px 1px;
		color:#a4a7cc;
		`;
	};
	return {
		setBaseInformation: (title, description) => {
			setBottom();
			setGithubLogo();
			setTitle(title, description)
		},
		setTestUI: (_ => {
			let setUI_RedGPUContext, setUI_View, setUI_Camera;
			let setUI_Scene, setUI_SkyBox, setUI_Grid, setUI_Axis;
			let containerUI;
			containerUI = document.createElement('div');
			containerUI.style.cssText = `
		position : fixed;
		top : 0;
		left : 0;
		white - space
	:
		nowrap;
	`;
			document.body.appendChild(containerUI);
			setUI_RedGPUContext = (gui, redGPUContext) => {
				let rootFolder, folder;
				rootFolder = gui.addFolder('RedGPUContext');
				const testData = {
					"setSize( 0, 0 )": _ => { redGPUContext.setSize(0, 0); },
					"setSize( 10, 10 )": _ => { redGPUContext.setSize(10, 10); },
					"setSize( 250, 250 )": _ => { redGPUContext.setSize(250, 250); },
					"setSize( 500, 250 )": _ => { redGPUContext.setSize(500, 250); },
					"setSize( 250, 500 )": _ => { redGPUContext.setSize(250, 500); },
					"setSize( '50%', 500 )": _ => { redGPUContext.setSize('50%', 500); },
					"setSize( 500, '50%' )": _ => { redGPUContext.setSize(500, '50%'); },
					"setSize( '50%', '50%' )": _ => { redGPUContext.setSize('50%', '50%'); },
					"setSize( '100%', '100%' )": _ => { redGPUContext.setSize('100%', '100%'); },
					"setSize( '110%', '110%' )": _ => { redGPUContext.setSize('110%', '110%'); },
				};
				folder = rootFolder.addFolder('setSize');
				for (const k in testData) {
					let t0 = folder.add(testData, k);
					t0.__li.querySelector('.property-name').style.width = 'auto';
				}
			};

			setUI_View = (gui, view) => {
				let rootFolder, folder;
				rootFolder = gui.addFolder('View');
				const testData = {
					"setSize( 0, 0 )": _ => { view.setSize(0, 0); },
					"setSize( 10, 10 )": _ => { view.setSize(10, 10); },
					"setSize( 250, 250 )": _ => { view.setSize(250, 250); },
					"setSize( 500, 250 )": _ => { view.setSize(500, 250); },
					"setSize( 250, 500 )": _ => { view.setSize(250, 500); },
					"setSize( '50%', 500 )": _ => { view.setSize('50%', 500); },
					"setSize( 500, '50%' )": _ => { view.setSize(500, '50%'); },
					"setSize( '50%', '50%' )": _ => { view.setSize('50%', '50%'); },
					"setSize( '100%', '100%' )": _ => { view.setSize('100%', '100%'); },
					"setSize( '110%', '110%' )": _ => { view.setSize('110%', '110%'); },
				};
				const testData2 = {
					"setLocation( 0, 0 )": _ => { view.setLocation(0, 0); },
					"setLocation( 10, 10 )": _ => { view.setLocation(10, 10); },
					"setLocation( 250, 250 )": _ => { view.setLocation(250, 250); },
					"setLocation( 500, 250 )": _ => { view.setLocation(500, 250); },
					"setLocation( 250, 500 )": _ => { view.setLocation(250, 500); },
					"setLocation( '50%', 500 )": _ => { view.setLocation('50%', 500); },
					"setLocation( 500, '50%' )": _ => { view.setLocation(500, '50%'); },
					"setLocation( '50%', '50%' )": _ => { view.setLocation('50%', '50%'); },
					"setLocation( '100%', '100%' )": _ => { view.setLocation('100%', '100%'); },
					"setLocation( '110%', '110%' )": _ => { view.setLocation('110%', '110%'); },
				};
				folder = rootFolder.addFolder('setSize');
				for (const k in testData) {
					let t0 = folder.add(testData, k);
					t0.__li.querySelector('.property-name').style.width = 'auto';
				}
				folder = rootFolder.addFolder('setLocation');
				for (const k in testData2) {
					let t0 = folder.add(testData2, k);
					t0.__li.querySelector('.property-name').style.width = 'auto';
				}
			};
			setUI_Scene = (gui, RedGPU, redGPUContext, scene) => {
				let rootFolder;
				rootFolder = gui.addFolder('Scene');
				rootFolder.addColor(scene, 'backgroundColor');
				rootFolder.add(scene, 'backgroundColorAlpha', 0, 1, 0.01);
				setUI_SkyBox(rootFolder, RedGPU, redGPUContext, scene);
				setUI_Grid(rootFolder, RedGPU, redGPUContext, scene);
				setUI_Axis(rootFolder, RedGPU, redGPUContext, scene);
			};
			setUI_SkyBox = (_ => {
				let skyBox;
				return (gui, RedGPU, redGPUContext, scene) => {
					let rootFolder;
					rootFolder = gui.addFolder('SkyBox');
					if (!skyBox) {
						skyBox = new RedGPU.SkyBox(redGPUContext, new RedGPU.BitmapCubeTexture(redGPUContext, [
							'../../assets/cubemap/SwedishRoyalCastle/px.jpg',
							'../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
							'../../assets/cubemap/SwedishRoyalCastle/py.jpg',
							'../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
							'../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
							'../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
						]));
					}
					const testData = {useSkyBox: scene.skyBox ? true : false};
					rootFolder.add(testData, 'useSkyBox').onChange(v => scene.skyBox = v ? skyBox : null)
				}
			})();
			setUI_Grid = (_ => {
				let grid;
				return (gui, RedGPU, redGPUContext, scene) => {
					let rootFolder;
					rootFolder = gui.addFolder('Grid');
					if (!grid) grid = new RedGPU.Grid(redGPUContext);
					const testData = {useGrid: scene.grid ? true : false};
					rootFolder.add(testData, 'useGrid').onChange(v => scene.grid = v ? grid : null);
					rootFolder.add(grid, 'divisions', 0, 500);
					rootFolder.add(grid, 'size', 0, 100);
					rootFolder.addColor(grid, 'color');
					rootFolder.addColor(grid, 'centerColor');
				}
			})();
			setUI_Axis = (_ => {
				let axis;
				return (gui, RedGPU, redGPUContext, scene) => {
					let rootFolder;
					rootFolder = gui.addFolder('Axis');
					if (!axis) axis = new RedGPU.Axis(redGPUContext);
					const testData = {useAxis: scene.axis ? true : false};
					rootFolder.add(testData, 'useAxis').onChange(v => scene.axis = v ? axis : null);
				}
			})();
			setUI_Camera = (gui, camera) => {
				let rootFolder;
				rootFolder = gui.addFolder('Camera');
				rootFolder.add(camera, 'fov', 0, 180, 0.01);
				rootFolder.add(camera, 'nearClipping', 0, 10, 0.01);
				rootFolder.add(camera, 'farClipping', 0, 100000, 0.01);
			};
			return (RedGPU, redGPUContext, view, scene, camera) => {
				let gui, rootFolder;
				gui = new dat.GUI({autoPlace: false});
				containerUI.append(gui.domElement);
				rootFolder = gui.addFolder('TestHelper');
				rootFolder.open();
				setUI_RedGPUContext(rootFolder, redGPUContext);
				setUI_View(rootFolder, view);
				setUI_Scene(rootFolder, RedGPU, redGPUContext, scene);
				setUI_Camera(rootFolder, camera);
				document.body.style.background = 'url("../../assets/bodyBG.png")'

				const testData = {useDebugger: false}
				rootFolder.add(testData, 'useDebugger').onChange(v => {
					RedGPU.Debugger.visible(v, RedGPU.Debugger.RIGHT_BOTTOM)
				})
			}
		})()
	};
})();


