/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.16 18:59:49
 *
 */

const ExampleHelper = (_ => {
	let testHelperFolder;
	const assetPath = '../../../assets/';


	const checkGUI = _ => {
		if (!testHelperFolder) {
			let containerUI;
			let rootGUI;
			rootGUI = new dat.GUI();
			testHelperFolder = rootGUI.addFolder('TestHelper');
			testHelperFolder.open();
			containerUI = document.createElement('div');
			containerUI.style.cssText = `
				position : fixed; top : 0; right : 0;
				height:auto;
				overflow-y:auto;
				white - space : nowrap;
			`;
			document.body.appendChild(containerUI);
			document.body.style.background = `url("${assetPath}bodyBG.png")`;
			// containerUI.append(rootGUI.domElement);
		}

	};
	const setBottom = _ => {
		let container, t0;
		container = document.createElement('div');
		document.body.appendChild(container);
		container.style.cssText = `position : fixed; left : 20px; bottom : 20px; right:20px;`;
		//
		container.appendChild(t0 = document.createElement('div'));
		t0.style.cssText = `height : 0px; border-bottom: 1px solid #333;`;
		//
		container.appendChild(t0 = document.createElement('div'));
		t0.innerHTML = `This project is maintained by <a href="https://github.com/redcamel/">RedCamel</a>`;
		t0.style.cssText = `margin-top:20px; font-size : 10px; color : #b19898; padding-left: 32px`;
		t0.appendChild(setGithubLogo())

		// makeSourceView
		t0 = document.createElement('link');
		t0.setAttribute('rel', 'stylesheet');
		t0.setAttribute('href', 'https://redcamel.github.io/Recard/beta/lib/prism.css');
		document.head.appendChild(t0);
		t0 = document.createElement('script');
		t0.setAttribute('src', 'https://redcamel.github.io/Recard/beta/lib/prism.js');
		document.head.appendChild(t0);
		let rootBox;
		let sourceViewBt;
		document.body.appendChild(rootBox = document.createElement('div'));
		document.body.appendChild(sourceViewBt = document.createElement('button'));
		rootBox.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#2b2b2b;z-index:20;display:none;color:#fff;font-size:12px;overflow-y:auto;padding:10px;';
		rootBox.className = 'sourceView'
		sourceViewBt.style.cssText = 'position:fixed;right:10px;bottom:10px;background:#111;color:#fff;z-index:20;border:0;outline:none;cursor:pointer;padding:8px;font-size:11px;border-radius:5px';
		sourceViewBt.innerHTML = 'SOURCE VIEW';
		sourceViewBt.addEventListener('click', function () {
			if (rootBox.style.display == 'block') {
				rootBox.style.display = 'none';
				sourceViewBt.innerHTML = 'SOURCE VIEW';
			} else {
				sourceViewBt.innerHTML = 'CLOSE';
				rootBox.style.display = 'block';
				{
					fetch(location.pathname.replace('html', 'js')).then(response => response.text()).then(v => {
						rootBox.innerHTML = '<code class="language-javascript">' + Prism.highlight(v, Prism.languages.javascript) + '</code>'
					})

				}

			}
		});


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
			skyBox = scene.skyBox;
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
			grid = scene.grid;
			if (!grid) grid = new RedGPU.Grid(redGPUContext);
			const testData = {useGrid: scene.grid ? true : false};
			rootFolder.add(testData, 'useGrid').onChange(v => scene.grid = v ? grid : null);
			rootFolder.add(grid, 'divisions', 0, 500);
			rootFolder.add(grid, 'size', 0, 500);
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
	const setTestUI_Camera = (RedGPU, camera, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder;
		rootFolder = gui.addFolder(camera instanceof RedGPU.ObitController ? 'ObitController' : 'Camera');
		if (open) rootFolder.open();
		rootFolder.add(camera, 'fov', 0, 180, 0.01);
		rootFolder.add(camera, 'nearClipping', 0, 10, 0.01);
		rootFolder.add(camera, 'farClipping', 0, 100000, 0.01);
		if (camera instanceof RedGPU.ObitController) {
			rootFolder.add(camera, 'centerX', -10, 10, 0.01);
			rootFolder.add(camera, 'centerY', -10, 10, 0.01);
			rootFolder.add(camera, 'centerZ', -10, 10, 0.01);
			rootFolder.add(camera, 'distance', 1, 100, 0.01);
			rootFolder.add(camera, 'speedDistance', 0.1, 100, 0.01);
			rootFolder.add(camera, 'delayDistance', 0.1, 1, 0.01);
			rootFolder.add(camera, 'speedRotation', 0.1, 100, 0.01);
			rootFolder.add(camera, 'delayRotation', 0.1, 1, 0.01);
			rootFolder.add(camera, 'minTilt', -90, 90, 0.01);
			rootFolder.add(camera, 'maxTilt', -90, 90, 0.01);
			rootFolder.add(camera, 'pan', 0, 360, 0.01);
			rootFolder.add(camera, 'tilt', -90, 90, 0.01);
		} else {
			rootFolder.add(camera, 'x', -10, 10, 0.01);
			rootFolder.add(camera, 'y', -10, 10, 0.01);
			rootFolder.add(camera, 'z', -10, 10, 0.01);
			const testData = {
				'lookAt(0,0,0)': _ => {
					camera.lookAt(0, 0, 0)
				}
			};
			rootFolder.add(testData, 'lookAt(0,0,0)');
		}
	};
	const setTestUI_PivotPoint = (RedGPU, redGPUContext, targetMesh, childMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Pivot Test');
		if (open) rootFolder.open();

		let pivotPoint1, pivotPoint2;
		pivotPoint1 = new RedGPU.Mesh(redGPUContext, new RedGPU.Sphere(redGPUContext, 0.05), new RedGPU.ColorMaterial(redGPUContext))
		targetMesh.addChild(pivotPoint1);
		pivotPoint2 = new RedGPU.Mesh(redGPUContext, new RedGPU.Sphere(redGPUContext, 0.05), new RedGPU.ColorMaterial(redGPUContext))
		childMesh.addChild(pivotPoint2);
		let HD_point1, HD_point2
		HD_point1 = _ => {
			pivotPoint1.x = targetMesh.pivotX
			pivotPoint1.y = targetMesh.pivotY
			pivotPoint1.z = targetMesh.pivotZ
		}
		HD_point2 = _ => {
			pivotPoint2.x = childMesh.pivotX
			pivotPoint2.y = childMesh.pivotY
			pivotPoint2.z = childMesh.pivotZ
		}
		HD_point1()
		HD_point2()
		folder = rootFolder.addFolder('Parent Test');
		folder.open();
		folder.add(targetMesh, 'x', -1, 1, 0.01).onChange(HD_point1);
		folder.add(targetMesh, 'y', -1, 1, 0.01).onChange(HD_point1);
		folder.add(targetMesh, 'z', -1, 1, 0.01).onChange(HD_point1);
		folder.add(targetMesh, 'pivotX', -1, 1, 0.01).onChange(HD_point1);
		folder.add(targetMesh, 'pivotY', -1, 1, 0.01).onChange(HD_point1);
		folder.add(targetMesh, 'pivotZ', -1, 1, 0.01).onChange(HD_point1);
		folder = rootFolder.addFolder('Child Test');
		folder.open();
		folder.add(childMesh, 'x', -1, 1, 0.01).onChange(HD_point2);
		folder.add(childMesh, 'y', -1, 1, 0.01).onChange(HD_point2);
		folder.add(childMesh, 'z', -1, 1, 0.01).onChange(HD_point2);
		folder.add(childMesh, 'pivotX', -1, 1, 0.01).onChange(HD_point2);
		folder.add(childMesh, 'pivotY', -1, 1, 0.01).onChange(HD_point2);
		folder.add(childMesh, 'pivotZ', -1, 1, 0.01).onChange(HD_point2);

	};
	const setTestUI_Debugger = RedGPU => {
		checkGUI();
		const testData = {useDebugger: false};
		testHelperFolder.add(testData, 'useDebugger').onChange(v => {
			RedGPU.Debugger.visible(v, RedGPU.Debugger.LEFT_TOP)
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
			wSegments: 1, hSegments: 1,
			uvSize: 1
		};
		for (const k in testData) {
			rootFolder.add(testData, k, 0, 10, k.includes('Segments') ? 1 : 0.01).onChange(v => {
				tMesh.geometry = new RedGPU.Plane(redGPUContext, testData.width, testData.height, testData.wSegments, testData.hSegments, testData.uvSize)
			});
		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open();
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
			wSegments: 1, hSegments: 1, dSegments: 1,
			uvSize: 1
		};
		console.log('tMesh', tMesh);
		for (const k in testData) {
			rootFolder.add(testData, k, 0, 10, k.includes('Segments') ? 1 : 0.01).onChange(v => {
				tMesh.geometry = new RedGPU.Box(redGPUContext, testData.width, testData.height, testData.depth, testData.wSegments, testData.hSegments, testData.dSegments, testData.uvSize)
			});
		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open();
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
			thetaLength: Math.PI,
			uvSize: 1
		};
		console.log('tMesh', tMesh);
		for (const k in testData) {
			rootFolder.add(testData, k, 0, k.includes('Segments') ? 32 : Math.PI * 2, k.includes('Segments') ? 1 : 0.01).onChange(v => {
				tMesh.geometry = new RedGPU.Sphere(redGPUContext, testData.radius, testData.widthSegments, testData.heightSegments, testData.phiStart, testData.phiLength, testData.thetaStart, testData.thetaLength, testData.uvSize)
			});
		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open();
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
			thetaLength: Math.PI * 2,
			uvSize: 1
		};
		console.log('tMesh', tMesh);
		for (const k in testData) {
			if (k == 'openEnded') {
				rootFolder.add(testData, k).onChange(v => {
					tMesh.geometry = new RedGPU.Cylinder(redGPUContext, testData.radiusTop, testData.radiusBottom, testData.height, testData.radialSegments, testData.heightSegments, testData.openEnded, testData.thetaStart, testData.thetaLength, testData.uvSize)
				});
			} else {
				rootFolder.add(testData, k, 0, k.includes('Segments') ? 32 : Math.PI * 2, k.includes('Segments') ? 1 : 0.01).onChange(v => {
					tMesh.geometry = new RedGPU.Cylinder(redGPUContext, testData.radiusTop, testData.radiusBottom, testData.height, testData.radialSegments, testData.heightSegments, testData.openEnded, testData.thetaStart, testData.thetaLength, testData.uvSize)
				});
			}

		}
		folder = gui.addFolder('(Mesh instance)');
		folder.open();
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"])
	};
	const setTestUI_Sprite3D = (RedGPU, redGPUContext, tSprite3DList, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Sprite3D');
		if (open) rootFolder.open();
		rootFolder.add(tSprite3DList[0], 'useFixedScale').onChange(v => {
			tSprite3DList.forEach(sprite3D => {
				sprite3D.useFixedScale = v;
			})
		});
		['scaleX', 'scaleY', 'scaleZ'].forEach(key => {
			rootFolder.add(tSprite3DList[0], key, 0, 1, 0.01).onChange(v => {
				tSprite3DList.forEach(sprite3D => {
					sprite3D[key] = v;
				})
			})
		});
	};
	const setTextUI_LINE_BEZIER = (RedGPU, lineList, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Line - Bezier');
		if (open) rootFolder.open();
		rootFolder.add(lineList[0], 'distance', 0, 5, 0.01).onChange(v => {
			lineList.forEach(line => {
				line.distance = v;
			})
		});
		rootFolder.add(lineList[0], 'tolerance', 0, 5, 0.01).onChange(v => {
			lineList.forEach(line => {
				line.tolerance = v;
			})
		});
	};
	const setTextUI_LINE_CATMULLROM = (RedGPU, lineList, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Line - CATMULLROM');
		if (open) rootFolder.open();
		rootFolder.add(lineList[0], 'distance', 0, 5, 0.01).onChange(v => {
			lineList.forEach(line => {
				line.distance = v;
			})
		});
		rootFolder.add(lineList[0], 'tension', 0, 5, 0.01).onChange(v => {
			lineList.forEach(line => {
				line.tension = v;
			})
		});
		rootFolder.add(lineList[0], 'tolerance', 0, 1, 0.01).onChange(v => {
			lineList.forEach(line => {
				line.tolerance = v;
			})
		});
	};
	const setTestUI_Text = (RedGPU, redGPUContext, tText, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;

		rootFolder = gui.addFolder('Text');
		if (open) rootFolder.open();
		makeOpacityProperty(rootFolder, tText)
		folder = rootFolder.addFolder('GPU Property');
		folder.add(tText, 'depthWriteEnabled');
		folder.add(tText, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"]);
		folder.add(tText, 'cullMode', ["none", "back", "front",]);
		folder.add(tText, 'depthCompare', ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"]);
		['blendColorSrc', 'blendColorDst', 'blendAlphaSrc', 'blendAlphaDst'].forEach(key => {
			folder.add(tText, key, ["zero", "one", "src-color", "one-minus-src-color", "src-alpha", "one-minus-src-alpha", "dst-color", "one-minus-dst-color", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "blend-color", "one-minus-blend-color"])
		});
		folder = rootFolder.addFolder('Transform Property');
		['x', 'y', 'z'].forEach(key => {
			folder.add(tText, key, -10, 10, 0.01);
			folder.add(tText, 'rotation' + key.toUpperCase(), 0, 360, 0.01);
			folder.add(tText, 'scale' + key.toUpperCase(), 0, 10, 0.01)
		});

		const testData = {
			background: tText.background,
			color: tText.color
		};
		rootFolder.add(tText, 'width', 2, 1024, 1);
		rootFolder.add(tText, 'height', 2, 1024, 1);
		rootFolder.add(tText, 'padding', 0, 100, 0.1);
		rootFolder.add(tText, 'fontFamily', ['Arial', 'Times New Roman', 'Times', 'serif']);
		rootFolder.add(tText, 'fontSize', 0, 100, 0.1);
		rootFolder.add(tText, 'fontWeight', ['normal', 'bold']);
		rootFolder.add(tText, 'fontStyle', ['normal', 'italic']);
		rootFolder.add(tText, 'lineHeight', 0, 100, 0.1);
		rootFolder.add(tText, 'letterSpacing', 0, 4, 0.01);
		rootFolder.add(tText, 'wordBreak', ['normal', 'break-all', 'break-word', 'keep-all', 'unset']);
		rootFolder.add(tText, 'verticalAlign', ['top', 'middle', 'bottom']);
		rootFolder.add(tText, 'textAlign', ['left', 'center', 'right']);
		rootFolder.addColor(testData, 'background').onChange(function (v) {tText.background = v});
		rootFolder.addColor(testData, 'color').onChange(function (v) {tText.color = v});
		rootFolder.add(tText, 'useFixedScale');
		rootFolder.add(tText, 'useSprite3DMode');

		let t1;
		t1 = document.createElement('div');
		t1.setAttribute('contenteditable', true);
		t1.style.cssText = 'overflow:auto;position:absolute;bottom:130px;left:18px;color:#fff;width:500px;height:160px;padding:10px;font-size:12px;background:1px 1px 0px rgba(255,255,255,0.5);border:1px solid #333;outline:none';
		t1.textContent = tText.text;
		document.body.appendChild(t1);
		t1.addEventListener('input', function () {
			tText['text'] = this.textContent;
		})
	};
	const setTestUI_Mesh = (RedGPU, redGPUContext, tMesh, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('Mesh');
		if (open) rootFolder.open();
		folder = rootFolder.addFolder('GPU Property');
		folder.add(tMesh, 'depthWriteEnabled');
		folder.add(tMesh, 'primitiveTopology', ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"]);
		folder.add(tMesh, 'cullMode', ["none", "back", "front",]);
		folder.add(tMesh, 'depthCompare', ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"]);
		['blendColorSrc', 'blendColorDst', 'blendAlphaSrc', 'blendAlphaDst'].forEach(key => {
			folder.add(tMesh, key, ["zero", "one", "src-color", "one-minus-src-color", "src-alpha", "one-minus-src-alpha", "dst-color", "one-minus-dst-color", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "blend-color", "one-minus-blend-color"])
		});
		['x', 'y', 'z'].forEach(key => {
			rootFolder.add(tMesh, key, -10, 10, 0.01);
			rootFolder.add(tMesh, 'rotation' + key.toUpperCase(), 0, 360, 0.01);
			rootFolder.add(tMesh, 'scale' + key.toUpperCase(), 0, 10, 0.01)
		});
		const testData = {
			geometry: 'Sphere',
			material: 'ColorPhongMaterial'
		};
		rootFolder.add(testData, 'geometry', ['Plane', 'Box', 'Sphere', 'Cylinder']).onChange(v => {
			switch (v) {
				case 'Plane' :
					tMesh.geometry = new RedGPU.Plane(redGPUContext);
					break;
				case 'Box' :
					tMesh.geometry = new RedGPU.Box(redGPUContext);
					break;
				case 'Sphere' :
					tMesh.geometry = new RedGPU.Sphere(redGPUContext, 1, 32, 32, 32);
					break;
				case 'Cylinder' :
					tMesh.geometry = new RedGPU.Cylinder(redGPUContext, 0, 1, 2, 32, 32);
					break
			}

		});
		rootFolder.add(testData, 'material', [
			'ColorMaterial', 'ColorPhongMaterial', 'ColorPhongTextureMaterial',
			'BitmapMaterial', 'StandardMaterial',
			'EnvironmentMaterial', 'RefractionMaterial'
		]).onChange(v => {
			switch (v) {
				case 'ColorMaterial' :
					tMesh.material = new RedGPU.ColorMaterial(redGPUContext);
					break;
				case 'ColorPhongMaterial' :
					tMesh.material = new RedGPU.ColorPhongMaterial(redGPUContext);
					break;
				case 'ColorPhongTextureMaterial' :
					tMesh.material = new RedGPU.ColorPhongTextureMaterial(redGPUContext);
					tMesh.material.normalTexture = new RedGPU.BitmapTexture(redGPUContext, `${assetPath}Brick03_nrm.jpg`);
					break;
				case 'BitmapMaterial' :
					tMesh.material = new RedGPU.BitmapMaterial(redGPUContext, new RedGPU.BitmapTexture(redGPUContext, `${assetPath}Brick03_col.jpg`));
					break;
				case 'StandardMaterial' :
					tMesh.material = new RedGPU.StandardMaterial(
						redGPUContext,
						new RedGPU.BitmapTexture(redGPUContext, `${assetPath}Brick03_col.jpg`),
						new RedGPU.BitmapTexture(redGPUContext, `${assetPath}Brick03_nrm.jpg`)
					);
					tMesh.material.normalPower = 2;
					break;
				case 'EnvironmentMaterial' :
				case 'RefractionMaterial':
					tMesh.material = new RedGPU[v](
						redGPUContext,
						null,
						new RedGPU.BitmapCubeTexture(redGPUContext, [
							`${assetPath}cubemap/SwedishRoyalCastle/px.jpg`,
							`${assetPath}cubemap/SwedishRoyalCastle/nx.jpg`,
							`${assetPath}cubemap/SwedishRoyalCastle/py.jpg`,
							`${assetPath}cubemap/SwedishRoyalCastle/ny.jpg`,
							`${assetPath}cubemap/SwedishRoyalCastle/pz.jpg`,
							`${assetPath}cubemap/SwedishRoyalCastle/nz.jpg`
						])
					);
					break

			}

		})

	};
	// material
	let setTestUI_ColorMaterial, setTestUI_ColorPhongMaterial, setTestUI_ColorPhongTextureMaterial;
	let setTestUI_BitmapMaterial, setTestUI_SpriteSheetMaterial, setTestUI_StandardMaterial,
		setTestUI_EnvironmentMaterial, setTestUI_RefractionMaterial;
	let setTestUI_BitmapTexture;
	let setTestUI_PostEffect, setTestUI_PostEffectBy;
	let makeColorProperty, makeBaseLightProperty, makeOpacityProperty, makeAlphaProperty;
	let makeTextureProperty;
	{

		makeTextureProperty = (targetFolder, RedGPU, redGPUContext, material, propertyName, src) => {
			let testData = {};
			testData[propertyName] = true;
			if (src instanceof Array) {
				targetFolder.add(testData, propertyName).onChange(v => {
					if (v) material[propertyName] = new RedGPU.BitmapCubeTexture(redGPUContext, src);
					else material[propertyName] = null;
				});
			} else {
				targetFolder.add(testData, propertyName).onChange(v => {
					if (v) material[propertyName] = new RedGPU.BitmapTexture(redGPUContext, src);
					else material[propertyName] = null;
				});
			}

			if (propertyName == 'emissiveTexture') {
				targetFolder.add(material, 'emissivePower', 0, 3, 0.01)
			}
			if (propertyName == 'displacementTexture') {
				targetFolder.add(material, 'displacementFlowSpeedX', 0, 1, 0.01);
				targetFolder.add(material, 'displacementFlowSpeedY', 0, 1, 0.01);
				targetFolder.add(material, 'displacementPower', 0, 5, 0.01)
			}

		};
		makeOpacityProperty = (targetFolder, mesh) => {
			targetFolder.add(mesh, 'opacity', 0, 1, 0.01)
		};
		makeAlphaProperty = (targetFolder, material) => {
			targetFolder.add(material, 'alpha', 0, 1, 0.01)
		};
		makeColorProperty = (targetFolder, material) => {
			targetFolder.addColor(material, 'color');
			targetFolder.add(material, 'colorAlpha', 0, 1, 0.01)
			targetFolder.add(material, 'alpha', 0, 1, 0.01)
		};
		makeBaseLightProperty = (targetFolder, material) => {
			targetFolder.add(material, 'normalPower', -5, 5, 0.01);
			targetFolder.add(material, 'shininess', 0, 256, 0.01);
			targetFolder.add(material, 'specularPower', 0, 5, 0.01);
			targetFolder.addColor(material, 'specularColor');
			targetFolder.add(material, 'useFlatMode');
		};

		setTestUI_ColorMaterial = (RedGPU, mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('ColorMaterial');
			if (open) rootFolder.open();
			makeColorProperty(rootFolder, material);
		};
		setTestUI_ColorPhongMaterial = (RedGPU, mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('ColorPhongMaterial');
			if (open) rootFolder.open();
			makeColorProperty(rootFolder, material);
			makeBaseLightProperty(rootFolder, material);
		};
		setTestUI_ColorPhongTextureMaterial = (RedGPU, redGPUContext, mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('ColorPhongTextureMaterial');
			if (open) rootFolder.open();
			makeColorProperty(rootFolder, material);
			makeBaseLightProperty(rootFolder, material);
			folder = rootFolder.addFolder('texture');
			folder.open();
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'normalTexture', `${assetPath}Brick03_nrm.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'specularTexture', `${assetPath}specular.png`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'emissiveTexture', `${assetPath}emissive.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'displacementTexture', `${assetPath}Brick03_disp.jpg`);
		};
		setTestUI_BitmapMaterial = (RedGPU, redGPUContext, mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('BitmapMaterial');
			if (open) rootFolder.open();
			makeAlphaProperty(rootFolder, material)
			makeTextureProperty(rootFolder, RedGPU, redGPUContext, material, 'diffuseTexture', `${assetPath}Brick03_col.jpg`);
		};
		setTestUI_SpriteSheetMaterial = (RedGPU, redGPUContext, mesh,material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('SpriteSheetMaterial');
			if (open) rootFolder.open();
			makeAlphaProperty(rootFolder, material)
			makeTextureProperty(rootFolder, RedGPU, redGPUContext, material, 'diffuseTexture', `${assetPath}sheet/spriteSheet.png`);
			rootFolder.add(material, 'frameRate', 1, 120);
			rootFolder.add(material, 'play');
			rootFolder.add(material, 'stop');
			rootFolder.add(material, 'pause');
			rootFolder.add(material, 'currentIndex', 0, material.totalFrame, 1).listen();
			rootFolder.add(material, 'loop');
			const testData = {
				gotoAndStop: 0,
				gotoAndPlay: 0,
				action: 'walk'
			}
			rootFolder.add(testData, 'gotoAndStop', 0, material.totalFrame, 1).onChange(v => {material.gotoAndStop(v)});
			rootFolder.add(testData, 'gotoAndPlay', 0, material.totalFrame, 1).onChange(v => {material.gotoAndPlay(v)})
			rootFolder.add(testData, 'action', ['walk', 'attack', 'jump']).onChange(v => {material.setAction(v)});

		};
		setTestUI_StandardMaterial = (RedGPU, redGPUContext, mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('StandardMaterial');
			if (open) rootFolder.open();
			makeAlphaProperty(rootFolder, material)
			makeBaseLightProperty(rootFolder, material);
			folder = rootFolder.addFolder('texture');
			folder.open();
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'diffuseTexture', `${assetPath}Brick03_col.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'normalTexture', `${assetPath}Brick03_nrm.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'specularTexture', `${assetPath}specular.png`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'emissiveTexture', `${assetPath}emissive.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'displacementTexture', `${assetPath}Brick03_disp.jpg`);
		};
		setTestUI_EnvironmentMaterial = (RedGPU, redGPUContext,mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('EnvironmentMaterial');
			if (open) rootFolder.open();
			makeAlphaProperty(rootFolder, material)
			makeBaseLightProperty(rootFolder, material);
			folder = rootFolder.addFolder('texture');
			folder.open();
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'diffuseTexture', `${assetPath}Brick03_col.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'environmentTexture', [
				'../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			]);
			folder.add(material, 'environmentPower', 0, 1, 0.01);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'normalTexture', `${assetPath}Brick03_nrm.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'specularTexture', `${assetPath}specular.png`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'emissiveTexture', `${assetPath}emissive.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'displacementTexture', `${assetPath}Brick03_disp.jpg`);
		};
		setTestUI_RefractionMaterial =  (RedGPU, redGPUContext,mesh, material, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('Mesh Property');
			if (open) rootFolder.open();
			makeOpacityProperty(rootFolder, mesh)
			rootFolder = gui.addFolder('StandardMaterial');
			if (open) rootFolder.open();
			makeAlphaProperty(rootFolder, material)
			makeBaseLightProperty(rootFolder, material);
			folder = rootFolder.addFolder('texture');
			folder.open();
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'diffuseTexture', `${assetPath}Brick03_col.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'refractionTexture', [
				'../../../assets/cubemap/SwedishRoyalCastle/px.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nx.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/py.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/ny.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/pz.jpg',
				'../../../assets/cubemap/SwedishRoyalCastle/nz.jpg'
			]);
			folder.add(material, 'refractionRatio', 0, 1, 0.001);
			folder.add(material, 'refractionPower', 0, 1, 0.01);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'normalTexture', `${assetPath}Brick03_nrm.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'specularTexture', `${assetPath}specular.png`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'emissiveTexture', `${assetPath}emissive.jpg`);
			makeTextureProperty(folder, RedGPU, redGPUContext, material, 'displacementTexture', `${assetPath}Brick03_disp.jpg`);
		}
		let initPostEffect = (RedGPU, tName, effect, open, rootFolder) => {
			var tFolder;
			if (tName) tFolder = rootFolder.addFolder(tName);
			switch (tName) {
				case 'PostEffect_Convolution':
					let testData = {
						kernel: 'NORMAL'
					}
					tFolder.add(testData, 'kernel', ['NORMAL', 'SHARPEN', 'BLUR', 'EDGE', 'EMBOSS']).onChange(v => {
						effect.kernel = RedGPU.PostEffect_Convolution[v]
					});
					break;
				case 'PostEffect_BrightnessContrast':
					tFolder.add(effect, 'brightness', -150, 150);
					tFolder.add(effect, 'contrast', -50, 100);
					break;
				case 'PostEffect_HueSaturation':
					tFolder.add(effect, 'hue', -180, 180);
					tFolder.add(effect, 'saturation', -100, 100);
					break;
				case 'PostEffect_Threshold':
					tFolder.add(effect, 'threshold', 1, 255);
					break;
				case 'PostEffect_Vignetting':
					tFolder.add(effect, 'size', 0, 1);
					tFolder.add(effect, 'intensity', 0, 2);
					break;
				case 'PostEffect_BlurX':
					tFolder.add(effect, 'size', 0, 100, 0.01);
					break;
				case 'PostEffect_BlurY':
					tFolder.add(effect, 'size', 0, 100, 0.01);
					break;
				case 'PostEffect_GaussianBlur':
					tFolder.add(effect, 'radius', 0.1, 250, 0.01);
					break;
				case 'PostEffect_ZoomBlur':
					tFolder.add(effect, 'amount', 0, 100, 0.01);
					tFolder.add(effect, 'centerX', -1, 1, 0.01);
					tFolder.add(effect, 'centerY', -1, 1, 0.01);
					break;
				case 'PostEffect_HalfTone':
					tFolder.add(effect, 'centerX', -1, 1, 0.01);
					tFolder.add(effect, 'centerY', -1, 1, 0.01);
					tFolder.add(effect, 'radius', 0, 25, 0.01);
					tFolder.add(effect, 'angle', 0, 360, 0.01);
					tFolder.add(effect, 'grayMode')
					break;
				case 'PostEffect_Pixelize':
					tFolder.add(effect, 'width', 0, 50, 0.01);
					tFolder.add(effect, 'height', 0, 50, 0.01);
					break;
				case 'PostEffect_DoF':
					tFolder.add(effect, 'blur', 0, 100, 0.01);
					tFolder.add(effect, 'focusLength', 0, 100, 0.01);
					break;
				case 'PostEffect_Bloom':
					tFolder.add(effect, 'blur', 0, 100);
					tFolder.add(effect, 'exposure', 0, 5);
					tFolder.add(effect, 'bloomStrength', 0, 5);
					tFolder.add(effect, 'threshold', 1, 255);
					break;
				case 'PostEffect_Film':
					tFolder.add(effect, 'scanlineIntensity', -1, 1, 0.01);
					tFolder.add(effect, 'noiseIntensity', 0, 1, 0.01);
					tFolder.add(effect, 'scanlineCount', 0, 4096);
					tFolder.add(effect, 'grayMode');
					break;
			}
			if (tFolder && open) tFolder.open();
			return tFolder

		}
		setTestUI_PostEffectBy = (RedGPU, tName, tView1, effect, gui) => {
			checkGUI();
			let tFolder = initPostEffect(RedGPU, tName, effect, true, testHelperFolder)
			let testData = {
				use: true
			}
			tFolder.add(testData, 'use').name('use ' + tName).onChange(function (v) {

				if (v) tView1.postEffect.addEffect(effect)
				else tView1.postEffect.removeEffect(effect)
			});
		}
		setTestUI_PostEffect = (RedGPU, redGPUContext, view, open, gui) => {
			checkGUI();
			gui = gui || testHelperFolder;
			let rootFolder, folder;
			rootFolder = gui.addFolder('PostEffect');
			if (open) rootFolder.open();
			let effectList;
			effectList = {
				PostEffect_Bloom: new RedGPU.PostEffect_Bloom(redGPUContext),
				PostEffect_DoF: new RedGPU.PostEffect_DoF(redGPUContext),
				PostEffect_BrightnessContrast: new RedGPU.PostEffect_BrightnessContrast(redGPUContext),
				PostEffect_Gray: new RedGPU.PostEffect_Gray(redGPUContext),
				PostEffect_HueSaturation: new RedGPU.PostEffect_HueSaturation(redGPUContext),
				PostEffect_Invert: new RedGPU.PostEffect_Invert(redGPUContext),
				PostEffect_Threshold: new RedGPU.PostEffect_Threshold(redGPUContext),
				PostEffect_Blur: new RedGPU.PostEffect_Blur(redGPUContext),
				PostEffect_BlurX: new RedGPU.PostEffect_BlurX(redGPUContext),
				PostEffect_BlurY: new RedGPU.PostEffect_BlurY(redGPUContext),
				PostEffect_ZoomBlur: new RedGPU.PostEffect_ZoomBlur(redGPUContext),
				PostEffect_GaussianBlur: new RedGPU.PostEffect_GaussianBlur(redGPUContext),
				PostEffect_Pixelize: new RedGPU.PostEffect_Pixelize(redGPUContext),
				PostEffect_HalfTone: new RedGPU.PostEffect_HalfTone(redGPUContext),
				PostEffect_Convolution: new RedGPU.PostEffect_Convolution(redGPUContext, RedGPU.PostEffect_Convolution['EMBOSS']),
				PostEffect_Vignetting: new RedGPU.PostEffect_Vignetting(redGPUContext),
				PostEffect_Film: new RedGPU.PostEffect_Film(redGPUContext),
			}
			let testData = function () {
				for (let k in effectList) this[k] = false
			}
			testData = new testData()

			for (let k in testData) {
				(function () {
					let tFolder = initPostEffect(RedGPU, k, effectList[k], true, rootFolder);
					document.body.style.background = ''
					console.log(tFolder)
					tFolder.add(testData, k).name('use ' + k.replace('PostEffect_', '')).onChange((function () {
						let tEffect = effectList[k]
						return function (v) {
							if (v) view.postEffect.addEffect(tEffect)
							else view.postEffect.removeEffect(tEffect)
							console.log(view.postEffect.effectList)
						}
					})());
				})();

			}
		}
	}
	setTestUI_BitmapTexture = (RedGPU, redGPUContext, material, open, gui) => {
		checkGUI();
		gui = gui || testHelperFolder;
		let rootFolder, folder;
		rootFolder = gui.addFolder('BitmapTexture');
		if (open) rootFolder.open();
		folder = rootFolder.addFolder('Texture Option');
		folder.open();
		{
			const testData = {
				useMipmap: true
			};
			let testDataSampler = {
				magFilter: "linear",
				minFilter: "linear",
				mipmapFilter: "linear",
				addressModeU: "repeat",
				addressModeV: "repeat"
				// addressModeW: "repeat"
			};
			folder.add(testData, "useMipmap").onChange(v => {
				console.log(v)
				material.diffuseTexture = new RedGPU.BitmapTexture(
					redGPUContext,
					`${assetPath}crate.png`,
					new RedGPU.Sampler(
						redGPUContext,
						{
							magFilter: testDataSampler.magFilter,
							minFilter: testDataSampler.minFilter,
							mipmapFilter: testDataSampler.mipmapFilter,
							addressModeU: testDataSampler.addressModeU,
							addressModeV: testDataSampler.addressModeV
						}
					),
					testData.useMipmap
				);
			});


			folder = rootFolder.addFolder('Sampler Option');
			folder.open();
			for (const k in testDataSampler) {
				folder.add(testDataSampler, k, k.includes('addressMode') ? ['clamp-to-edge', 'repeat', 'mirror-repeat'] : ["nearest", "linear"]).onChange(v => {
					console.log('testDataSampler', testDataSampler)
					material.diffuseTexture = new RedGPU.BitmapTexture(
						redGPUContext,
						`${assetPath}crate.png`,
						new RedGPU.Sampler(
							redGPUContext,
							{
								magFilter: testDataSampler.magFilter,
								minFilter: testDataSampler.minFilter,
								mipmapFilter: testDataSampler.mipmapFilter,
								addressModeU: testDataSampler.addressModeU,
								addressModeV: testDataSampler.addressModeV
							}
						),
						testData.useMipmap
					);
				})
			}
		}
	}
	return {
		setBaseInformation: (title, description) => {
			setBottom();
			setTitle(title, description)
		},
		setTestUI: (_ => {
			return (RedGPU, redGPUContext, view, scene, camera) => {
				checkGUI();
				setTestUI_RedGPUContext(redGPUContext);
				setTestUI_View(view);
				setTestUI_Scene(RedGPU, redGPUContext, scene);
				setTestUI_Camera(RedGPU, camera);
				setTestUI_Debugger(RedGPU)
			}
		})(),
		setTestUI_RedGPUContext: setTestUI_RedGPUContext,
		setTestUI_Scene: setTestUI_Scene,
		setTestUI_View: setTestUI_View,
		setTestUI_Debugger: setTestUI_Debugger,
		setTestUI_Mesh: setTestUI_Mesh,
		setTestUI_Sprite3D: setTestUI_Sprite3D,
		setTestUI_Text: setTestUI_Text,
		setTestUI_Axis: setTestUI_Axis,
		setTestUI_Grid: setTestUI_Grid,
		setTestUI_SkyBox: setTestUI_SkyBox,
		setTextUI_LINE_BEZIER: setTextUI_LINE_BEZIER,
		setTextUI_LINE_CATMULLROM: setTextUI_LINE_CATMULLROM,
		setTestUI_PrimitivePlane: setTestUI_PrimitivePlane,
		setTestUI_PrimitiveBox: setTestUI_PrimitiveBox,
		setTestUI_PrimitiveSphere: setTestUI_PrimitiveSphere,
		setTestUI_PrimitiveCylinder: setTestUI_PrimitiveCylinder,
		setTestUI_Camera: setTestUI_Camera,
		setTestUI_PivotPoint: setTestUI_PivotPoint,
		//
		setTestUI_ColorMaterial: setTestUI_ColorMaterial,
		setTestUI_ColorPhongMaterial: setTestUI_ColorPhongMaterial,
		setTestUI_ColorPhongTextureMaterial: setTestUI_ColorPhongTextureMaterial,
		setTestUI_BitmapMaterial: setTestUI_BitmapMaterial,
		setTestUI_StandardMaterial: setTestUI_StandardMaterial,
		setTestUI_EnvironmentMaterial: setTestUI_EnvironmentMaterial,
		setTestUI_RefractionMaterial: setTestUI_RefractionMaterial,
		setTestUI_SpriteSheetMaterial: setTestUI_SpriteSheetMaterial,
		//
		setTestUI_BitmapTexture: setTestUI_BitmapTexture,
		//
		setTestUI_PostEffect: setTestUI_PostEffect,
		setTestUI_PostEffectBy: setTestUI_PostEffectBy
	};
})();


