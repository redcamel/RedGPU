/*
 *   RedGPU - MIT License
 *   Copyright (c) 2019 ~ By RedCamel( webseon@gmail.com )
 *   issue : https://github.com/redcamel/RedGPU/issues
 *   Last modification time of this file - 2020.1.7 21:39:14
 *
 */

const ExampleHelper = (_ => {
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
			color : #b19898;
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
	return {
		setBaseInformation: title => {
			setBottom();
			setGithubLogo();
			setTitle(title)
		},
		setTestUI: (_ => {
			let setUI_RedGPUContext, setUI_View, setUI_Scene;
			let setUI_SkyBox, setUI_Grid;
			let containerUI;
			containerUI = document.createElement('div');
			containerUI.style.cssText = `
				position : fixed;
				top : 0; left : 0;
				white-space : nowrap;
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
				setUI_SkyBox(rootFolder, RedGPU, redGPUContext, scene);
				setUI_Grid(rootFolder, RedGPU, redGPUContext, scene);
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
					const testData = {useSkyBox: scene.skyBox ? true : false}
					scene.skyBox = scene
					rootFolder.add(testData, 'useSkyBox').onChange(v => scene.skyBox = v ? skyBox : null)
				}
			})();
			setUI_Grid = (_ => {
				let grid;
				return (gui, RedGPU, redGPUContext, scene) => {
					let rootFolder;
					rootFolder = gui.addFolder('Grid');
					if (!grid) grid = new RedGPU.Grid(redGPUContext)
					const testData = {useGrid: scene.grid ? true : false};
					scene.skyBox = scene
					rootFolder.add(testData, 'useGrid').onChange(v => scene.grid = v ? grid : null);
					rootFolder.add(grid, 'divisions', 0, 500);
					rootFolder.add(grid, 'size', 0, 100);
					rootFolder.addColor(grid, 'color');
					rootFolder.addColor(grid, 'centerColor');


				}
			})();
			return (RedGPU, redGPUContext, view, scene, camera) => {
				let gui, rootFolder;
				gui = new dat.GUI({autoPlace: false});
				containerUI.append(gui.domElement);
				rootFolder = gui.addFolder('TestHelper')
				rootFolder.open()
				setUI_RedGPUContext(rootFolder, redGPUContext)
				setUI_View(rootFolder, view)
				setUI_Scene(rootFolder, RedGPU, redGPUContext, scene)
			}
		})()
	};
})()


