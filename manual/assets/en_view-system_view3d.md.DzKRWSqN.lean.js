import{D as p,o as g,c as E,a2 as l,G as e,w as n,k as i,a}from"./chunks/framework.DpNgdNqH.js";const C=JSON.parse(`{"title":"View3D","description":"Covers technical specifications and usage of View3D, RedGPU's rendering unit.","frontmatter":{"title":"View3D","description":"Covers technical specifications and usage of View3D, RedGPU's rendering unit.","order":2},"headers":[],"relativePath":"en/view-system/view3d.md","filePath":"en/view-system/view3d.md","lastUpdated":1770634323000}`),c={name:"en/view-system/view3d.md"},w=Object.assign(c,{setup(y){const k=`
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Pass)"]
        Scene["Scene (Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input)"]

        Context -->|Manages| View
        View -->|References| Scene
        View -->|References| Camera
        Controller -->|Updates| Camera
        View -.->|Holds| Controller
`,d=`
    Renderer["RedGPU.Renderer"] -->|Executes Loop| View["RedGPU.Display.View3D"]
    View -->|References| Scene["RedGPU.Display.Scene"]
    View -->|References| Camera["RedGPU.Camera"]
`,o=`
    graph TD
        Context["RedGPUContext"]
        View1["View3D (Main Viewport)"]
        View2["View3D (Sub Viewport)"]
        SceneA["Scene A"]
        CameraX["Camera X"]
        CameraY["Camera Y"]

        Context --> View1
        Context --> View2
        
        View1 --> SceneA
        View1 --> CameraX
        
        View2 -->|Shared Reference| SceneA
        View2 --> CameraY
`;return(m,s)=>{const h=p("MermaidResponsive"),t=p("ClientOnly"),r=p("CodePen");return g(),E("div",null,[s[2]||(s[2]=l("",4)),e(t,null,{default:n(()=>[e(h,{definition:k})]),_:1}),s[3]||(s[3]=l("",7)),e(t,null,{default:n(()=>[e(r,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:n(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.OrbitController(redGPUContext);`),a(`
`),i("pre",null,[i("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),i("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),s[4]||(s[4]=l("",15)),e(t,null,{default:n(()=>[e(h,{definition:o})]),_:1}),s[5]||(s[5]=l("",3)),e(t,null,{default:n(()=>[e(r,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:n(()=>[...s[1]||(s[1]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),i("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),a(`
`),i("pre",null,[i("code",null,`    // Main view setup
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // Minimap view setup
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    miniMapCamera.y = 50;
    miniMapCamera.lookAt(0, 0, 0.1);

    const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
    miniMapView.setSize(miniMapSize, miniMapSize);
    miniMapView.axis = true;
    miniMapView.grid = true;
    redGPUContext.addView(miniMapView);

    const updateLayout = (event) => {
        const { width } = mainView.screenRectObject;
        miniMapView.setPosition(width - miniMapSize - 10, 10);
    };

    redGPUContext.onResize = updateLayout;
    updateLayout();

    // Place scene objects
    const geometry = new RedGPU.Primitive.Box(redGPUContext);
    const material = new RedGPU.Material.ColorMaterial(redGPUContext, "#00CC99");
    for (let i = 0; i < 30; i++) {
        const mesh = new RedGPU.Display.Mesh(redGPUContext, geometry, material);
        mesh.x = Math.random() * 40 - 20;
        mesh.z = Math.random() * 40 - 20;
        sharedScene.addChild(mesh);
    }

    const renderer = new RedGPU.Renderer();
    renderer.start(redGPUContext);
},
(error) => console.error(error)
`)]),a(`
`),i("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),s[6]||(s[6]=i("h2",{id:"_6-rendering-flow",tabindex:"-1"},[a("6. Rendering Flow "),i("a",{class:"header-anchor",href:"#_6-rendering-flow","aria-label":'Permalink to "6. Rendering Flow"'},"​")],-1)),s[7]||(s[7]=i("p",null,[a("Work flow performed by "),i("strong",null,"Renderer"),a(" as it iterates through the list of views registered in the context every frame.")],-1)),e(t,null,{default:n(()=>[e(h,{definition:d})]),_:1}),s[8]||(s[8]=l("",4))])}}});export{C as __pageData,w as default};
