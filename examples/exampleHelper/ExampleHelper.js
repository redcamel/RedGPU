/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.8 11:31:26
 *
 */

const ExampleHelper = (_ => {
	let testHelperFolder;
	const assetPath = '../../../assets/'
	const checkGUI = _ => {
		if (!testHelperFolder) {
			let containerUI;
			let rootGUI;
			rootGUI = new dat.GUI({autoPlace: false});
			testHelperFolder = rootGUI.addFolder('TestHelper');
			testHelperFolder.open();
			containerUI = document.createElement('div');
			containerUI.style.cssText = `
				position : fixed; top : 0; right : 0;
				white - space : nowrap;
			`;
			document.body.appendChild(containerUI);
			document.body.style.background = `url("${assetPath}bodyBG.png")`
			containerUI.append(rootGUI.domElement);
		}

	}
	const setBottom = _ => {
		let container, t0;
		container = document.createElement('div');
		document.body.appendChild(container);
		container.style.cssText = `position : fixed; left : 20px; bottom : 20px; right:20px;`;
		//
		container.appendChild(t0 = document.createElement('div'))
		t0.style.cssText = `height : 0px; border-bottom: 1px solid #333;`
		//
		container.appendChild(t0 = document.createElement('div'));
		t0.innerHTML = `This project is maintained by <a href="https://github.com/redcamel/">RedCamel</a>`;
		t0.style.cssText = `margin-top:20px; font-size : 10px; color : #b19898; padding-left: 32px`;
		t0.appendChild(setGithubLogo())
	};
	const setGithubLogo = _ => {
		let t0;
		t0 = document.createElement('img');
		t0.src = `${assetPath}github.png`;
		t0.style.cssText = `position: fixed; bottom:15px; left:20px; width:25px; cursor: pointer;`;
		t0.onclick = _ => window.location.href = 'https://github.com/redcamel/RedGPU';
		return t0;
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
	const setTestUI_RedGPUContext = (redGPUContext, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
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

	const setTestUI_View = (view, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('View');
		if (open) rootFolder.open();
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
			"setLocation( -600, -600 )": _ => { view.setLocation(-600, -600); },
			"setLocation( -100, -100 )": _ => { view.setLocation(-100, -100); },
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
	const setTestUI_Scene = (RedGPU, redGPUContext, scene, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder;
		rootFolder = gui.addFolder('Scene');
		if (open) rootFolder.open();
		rootFolder.addColor(scene, 'backgroundColor');
		rootFolder.add(scene, 'backgroundColorAlpha', 0, 1, 0.01);
		setTestUI_SkyBox(RedGPU, redGPUContext, scene, open, rootFolder);
		setTestUI_Grid(RedGPU, redGPUContext, scene, open, rootFolder);
		setTestUI_Axis(RedGPU, redGPUContext, scene, open, rootFolder);

	};
	const setTestUI_SkyBox = (_ => {
		let skyBox;
		return (RedGPU, redGPUContext, scene, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder;
			rootFolder = gui.addFolder('SkyBox');
			if (open) rootFolder.open();
			if (!skyBox) {
				skyBox = new RedGPU.SkyBox(redGPUContext, new RedGPU.BitmapCubeTexture(redGPUContext, [
					`${assetPath}cubemap/SwedishRoyalCastle/px.jpg`,
					`${assetPath}cubemap/SwedishRoyalCastle/nx.jpg`,
					`${assetPath}cubemap/SwedishRoyalCastle/py.jpg`,
					`${assetPath}cubemap/SwedishRoyalCastle/ny.jpg`,
					`${assetPath}cubemap/SwedishRoyalCastle/pz.jpg`,
					`${assetPath}cubemap/SwedishRoyalCastle/nz.jpg`
				]));
			}
			const testData = {useSkyBox: scene.skyBox ? true : false};
			rootFolder.add(testData, 'useSkyBox').onChange(v => scene.skyBox = v ? skyBox : null)
		}
	})();
	const setTestUI_Grid = (_ => {
		let grid;
		return (RedGPU, redGPUContext, scene, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder;
			rootFolder = gui.addFolder('Grid');
			if (open) rootFolder.open();
			if (!grid) grid = new RedGPU.Grid(redGPUContext);
			const testData = {useGrid: scene.grid ? true : false};
			rootFolder.add(testData, 'useGrid').onChange(v => scene.grid = v ? grid : null);
			rootFolder.add(grid, 'divisions', 0, 500);
			rootFolder.add(grid, 'size', 0, 100);
			rootFolder.addColor(grid, 'color');
			rootFolder.addColor(grid, 'centerColor');
		}
	})();
	const setTestUI_Axis = (_ => {
		let axis;
		return (RedGPU, redGPUContext, scene, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder;
			rootFolder = gui.addFolder('Axis');
			if (open) rootFolder.open();
			if (!axis) axis = new RedGPU.Axis(redGPUContext);
			const testData = {useAxis: scene.axis ? true : false};
			rootFolder.add(testData, 'useAxis').onChange(v => scene.axis = v ? axis : null);
		}
	})();
	const setTestUI_Camera = (gui, camera) => {
		let rootFolder;
		rootFolder = gui.addFolder('Camera');
		rootFolder.add(camera, 'fov', 0, 180, 0.01);
		rootFolder.add(camera, 'nearClipping', 0, 10, 0.01);
		rootFolder.add(camera, 'farClipping', 0, 100000, 0.01);
	};
	return {
		setBaseInformation: (title, description) => {
			setBottom();
			setTitle(title, description)
		},
		setTestUI: (_ => {
			return (RedGPU, redGPUContext, view, scene, camera) => {
				checkGUI()
				setTestUI_RedGPUContext(redGPUContext);
				setTestUI_View(view);
				setTestUI_Scene(RedGPU, redGPUContext, scene);
				setTestUI_Camera(testHelperFolder, camera);
				const testData = {useDebugger: false}
				testHelperFolder.add(testData, 'useDebugger').onChange(v => {
					RedGPU.Debugger.visible(v, RedGPU.Debugger.RIGHT_BOTTOM)
				})
			}
		})(),
		setTestUI_RedGPUContext: setTestUI_RedGPUContext,
		setTestUI_Scene: setTestUI_Scene,
		setTestUI_View: setTestUI_View,
	};
})();


