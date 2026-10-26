import{D as h,o,c,a2 as t,G as a,w as n,k as s,a as e}from"./chunks/framework.n5RLHRfo.js";const u=JSON.parse('{"title":"View3D","description":"Technical specification and usage of View3D, the rendering unit in RedGPU.","frontmatter":{"title":"View3D","description":"Technical specification and usage of View3D, the rendering unit in RedGPU.","order":2},"headers":[],"relativePath":"en/view-system/view3d.md","filePath":"en/view-system/view3d.md","lastUpdated":1792993711000}'),g={name:"en/view-system/view3d.md"},C=Object.assign(g,{setup(E){const d=`
    graph TD
        Context["RedGPUContext (Environment)"]
        View["View3D (Render Viewport)"]
        Scene["Scene (3D Spatial Data)"]
        Camera["Camera (Projection)"]
        Controller["Controller (Input Control)"]

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
`,k=`
    graph TD
        Context["RedGPUContext"]
        View1["View3D (Main Viewport)"]
        View2["View3D (Sub Viewport)"]
        SceneA["Scene A (Shared Scene)"]
        CameraX["Camera X (Main View)"]
        CameraY["Camera Y (Sub View)"]

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
`;return(y,i)=>{const p=h("MermaidResponsive"),l=h("ClientOnly"),r=h("CodePen");return o(),c("div",null,[i[2]||(i[2]=t("",4)),a(l,null,{default:n(()=>[a(p,{definition:d})]),_:1}),i[3]||(i[3]=t("",6)),a(l,null,{default:n(()=>[a(r,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:n(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const controller = new RedGPU.Camera.OrbitController (redGPUContext);`),e(`
`),s("pre",null,[s("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, controller);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),e(`
`),s("p",null,"});"),e(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=t("",20)),a(l,null,{default:n(()=>[a(p,{definition:k})]),_:1}),i[5]||(i[5]=t("",2)),a(l,null,{default:n(()=>[a(r,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:n(()=>[...i[1]||(i[1]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[e(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),e(`
`),s("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),e(`
`),s("pre",null,[s("code",null,`    // 1. Main view setup (Full screen)
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // 2. Minimap view setup (Fixed 200x200 at top-right)
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera();
    miniMapCamera.y = 50;
    miniMapCamera.lookAt(0, 0, 0);

    const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
    miniMapView.setSize(miniMapSize, miniMapSize);
    miniMapView.axis = true;
    miniMapView.grid = true;
    redGPUContext.addView(miniMapView);

    // 3. Update minimap position on resize based on mainView's CSS layout size
    const updateLayout = () => {
        const { width } = mainView.screenRectObject;
        miniMapView.setPosition(width - miniMapSize - 10, 10);
    };

    redGPUContext.onResize = updateLayout;
    updateLayout();

    // Populate scene objects
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
`),s("p",null,");"),e(`
`)],-1)])]),_:1})]),_:1}),i[6]||(i[6]=t("",7))])}}});export{u as __pageData,C as default};
