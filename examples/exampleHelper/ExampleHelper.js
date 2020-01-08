/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.8 15:38:58
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
	const setTestUI_Debugger = RedGPU => {
		checkGUI();
		const testData = {useDebugger: false}
		testHelperFolder.add(testData, 'useDebugger').onChange(v => {
			RedGPU.Debugger.visible(v, RedGPU.Debugger.RIGHT_BOTTOM)
		})
	};
	const setTestUI_PrimitivePlane = (RedGPU, redGPUContext, tMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Primitive - Plane');
		if (open) rootFolder.open();
		const testData = {
			width: 1, height: 1,
			wSegments: 1, hSegments: 1
		}
		for (const k in testData) {
			rootFolder.add(testData, k, 0, 10, k.includes('Segments') ? 1 : 0.01).onChange(v => {
				tMesh.geometry = new RedGPU.Plane(redGPUContext, testData.width, testData.height, testData.wSegments, testData.hSegments)
			});
		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open()
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"])
	};
	const setTestUI_PrimitiveBox = (RedGPU, redGPUContext, tMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Primitive - Box');
		if (open) rootFolder.open();
		const testData = {
			width: 1, height: 1, depth: 1,
			wSegments: 1, hSegments: 1, dSegments: 1
		}
		console.log('tMesh', tMesh)
		for (const k in testData) {
			rootFolder.add(testData, k, 0, 10, k.includes('Segments') ? 1 : 0.01).onChange(v => {
				tMesh.geometry = new RedGPU.Box(redGPUContext, testData.width, testData.height, testData.depth, testData.wSegments, testData.hSegments, testData.dSegments)
			});
		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open()
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"])
	};
	const setTestUI_PrimitiveSphere = (RedGPU, redGPUContext, tMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Primitive - Sphere');
		if (open) rootFolder.open();
		const testData = {
			radius: 1,
			widthSegments: 8,
			heightSegments: 8,
			phiStart: 0,
			phiLength: Math.PI * 2,
			thetaStart: 0,
			thetaLength: Math.PI
		}
		console.log('tMesh', tMesh)
		for (const k in testData) {
			rootFolder.add(testData, k, 0, k.includes('Segments') ? 32 : Math.PI * 2, k.includes('Segments') ? 1 : 0.01).onChange(v => {
				tMesh.geometry = new RedGPU.Sphere(redGPUContext, testData.radius, testData.widthSegments, testData.heightSegments, testData.phiStart, testData.phiLength, testData.thetaStart, testData.thetaLength)
			});
		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open()
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"])
	};
	const setTestUI_PrimitiveCylinder = (RedGPU, redGPUContext, tMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Primitive - Cylinder');
		if (open) rootFolder.open();
		const testData = {
			radiusTop: 1,
			radiusBottom: 1,
			height: 1,
			radialSegments: 8,
			heightSegments: 1,
			openEnded: false,
			thetaStart: 0.0,
			thetaLength: Math.PI * 2
		}
		console.log('tMesh', tMesh)
		for (const k in testData) {
			if (k == 'openEnded') {
				rootFolder.add(testData, k).onChange(v => {
					tMesh.geometry = new RedGPU.Cylinder(redGPUContext, testData.radiusTop, testData.radiusBottom, testData.height, testData.radialSegments, testData.heightSegments, testData.openEnded, testData.thetaStart, testData.thetaLength)
				});
			} else {
				rootFolder.add(testData, k, 0, k.includes('Segments') ? 32 : Math.PI * 2, k.includes('Segments') ? 1 : 0.01).onChange(v => {
					tMesh.geometry = new RedGPU.Cylinder(redGPUContext, testData.radiusTop, testData.radiusBottom, testData.height, testData.radialSegments, testData.heightSegments, testData.openEnded, testData.thetaStart, testData.thetaLength)
				});
			}

		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open()
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"])
	};
	const setTestUI_Mesh = (RedGPU, tMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Mesh');
		if (open) rootFolder.open();
		folder = rootFolder.addFolder('GPU Property');
		folder.add(tMesh, 'depthWriteEnabled')
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"])
		folder.add(tMesh, 'cullMode', ["none", "back", "front",])
		folder.add(tMesh, 'depthCompare', ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"]);
		['blendColorSrc', 'blendColorDst', 'blendAlphaSrc', 'blendAlphaDst'].forEach(key => {
			folder.add(tMesh, key, ["zero", "one", "src-color", "one-minus-src-color", "src-alpha", "one-minus-src-alpha", "dst-color", "one-minus-dst-color", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "blend-color", "one-minus-blend-color"])
		})
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
				setTestUI_Debugger(RedGPU)
			}
		})(),
		setTestUI_RedGPUContext: setTestUI_RedGPUContext,
		setTestUI_Scene: setTestUI_Scene,
		setTestUI_View: setTestUI_View,
		setTestUI_Debugger: setTestUI_Debugger,
		setTestUI_Mesh: setTestUI_Mesh,
		setTestUI_PrimitivePlane: setTestUI_PrimitivePlane,
		setTestUI_PrimitiveBox: setTestUI_PrimitiveBox,
		setTestUI_PrimitiveSphere: setTestUI_PrimitiveSphere,
		setTestUI_PrimitiveCylinder: setTestUI_PrimitiveCylinder
	};
})();


