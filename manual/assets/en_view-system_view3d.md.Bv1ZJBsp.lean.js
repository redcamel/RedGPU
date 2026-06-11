import{$ as h,Q as k,j as c,m as t,o as a,ax as n,g as i,n as e}from"./chunks/framework.D5MFXpji.js";const m=JSON.parse(`{"title":"View3D","description":"Covers technical specifications and usage of View3D, RedGPU's rendering unit.","frontmatter":{"title":"View3D","description":"Covers technical specifications and usage of View3D, RedGPU's rendering unit.","order":2},"headers":[],"relativePath":"en/view-system/view3d.md","filePath":"en/view-system/view3d.md","lastUpdated":1781144716000}`),g={name:"en/view-system/view3d.md"},C=Object.assign(g,{setup(E){const o=`
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

        %% Grayscale styles applied
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Scene fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Camera fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`,d=`
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

        %% Grayscale styles applied
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style View1 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style View2 fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style SceneA fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style CameraX fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style CameraY fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
`;return(y,s)=>{const r=h("MermaidResponsive"),l=h("ClientOnly"),p=h("CodePen");return k(),c("div",null,[s[2]||(s[2]=t("",4)),a(l,null,{default:n(()=>[a(r,{definition:o})]),_:1}),s[3]||(s[3]=t("",7)),a(l,null,{default:n(()=>[a(p,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:n(()=>[...s[0]||(s[0]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),i("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.OrbitController(redGPUContext);`),e(`
`),i("pre",null,[i("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),e(`
`),i("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),s[4]||(s[4]=t("",17)),a(l,null,{default:n(()=>[a(r,{definition:d})]),_:1}),s[5]||(s[5]=t("",3)),a(l,null,{default:n(()=>[a(p,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:n(()=>[...s[1]||(s[1]=[i("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),i("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),i("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),i("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),i("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),e(`
`),i("pre",null,[i("code",null,`    // Main view setup
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // Minimap view setup
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
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
`)]),e(`
`),i("p",null,");"),e(`
`)],-1)])]),_:1})]),_:1}),s[6]||(s[6]=t("",15))])}}});export{m as __pageData,C as default};
