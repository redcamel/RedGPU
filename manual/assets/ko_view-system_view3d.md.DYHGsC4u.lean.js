import{D as p,o as E,c as g,a2 as l,G as n,w as e,k as s,a}from"./chunks/framework.Dn9yU8Jh.js";const F=JSON.parse('{"title":"View3D","description":"RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.","frontmatter":{"title":"View3D","description":"RedGPU의 렌더링 단위인 View3D의 기술적 명세와 사용법을 다룹니다.","order":2},"headers":[],"relativePath":"ko/view-system/view3d.md","filePath":"ko/view-system/view3d.md","lastUpdated":1769586187000}'),c={name:"ko/view-system/view3d.md"},w=Object.assign(c,{setup(y){const r=`
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
        
        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View mermaid-main;
`,d=`
    Renderer["RedGPU.Renderer"] -->|Executes Loop| View["RedGPU.Display.View3D"]
    View -->|References| Scene["RedGPU.Display.Scene"]
    View -->|References| Camera["RedGPU.Camera"]
    
    %% 커스텀 클래스 적용
    class Renderer mermaid-system;
    class View mermaid-main;
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

        %% 커스텀 클래스 적용
        class Context mermaid-system;
        class View1,View2 mermaid-main;
`;return(C,i)=>{const h=p("MermaidResponsive"),t=p("ClientOnly"),k=p("CodePen");return E(),g("div",null,[i[2]||(i[2]=l("",4)),n(t,null,{default:e(()=>[n(h,{definition:r})]),_:1}),i[3]||(i[3]=l("",7)),n(t,null,{default:e(()=>[n(k,{title:"RedGPU Basics - View3D",slugHash:"view-basic"},{default:e(()=>[...i[0]||(i[0]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(canvas, (redGPUContext) => {
const scene = new RedGPU.Display.Scene();
const camera = new RedGPU.Camera.OrbitController(redGPUContext);`),a(`
`),s("pre",null,[s("code",null,`const view = new RedGPU.Display.View3D(redGPUContext, scene, camera);
view.grid = true; 
view.axis = true;
redGPUContext.addView(view);

const renderer = new RedGPU.Renderer();
renderer.start(redGPUContext);
`)]),a(`
`),s("p",null,"});"),a(`
`)],-1)])]),_:1})]),_:1}),i[4]||(i[4]=l("",11)),n(t,null,{default:e(()=>[n(h,{definition:o})]),_:1}),i[5]||(i[5]=l("",3)),n(t,null,{default:e(()=>[n(k,{title:"RedGPU Basics - Multi View",slugHash:"view-multi"},{default:e(()=>[...i[1]||(i[1]=[s("pre",{"data-lang":"html"},`<canvas id="redgpu-canvas"></canvas>
`,-1),s("pre",{"data-lang":"css"},`body { margin: 0; overflow: hidden; background: #111; }
canvas { display: block; width: 100vw; height: 100vh; }
`,-1),s("pre",{"data-lang":"js"},[a(`import * as RedGPU from "https://redcamel.github.io/RedGPU/dist/index.js";
`),s("p",null,'const canvas = document.getElementById("redgpu-canvas");'),a(`
`),s("p",null,`RedGPU.init(
canvas,
(redGPUContext) => {
const sharedScene = new RedGPU.Display.Scene();`),a(`
`),s("pre",null,[s("code",null,`    // 메인 뷰 설정
    const mainCamera = new RedGPU.Camera.OrbitController(redGPUContext);
    const mainView = new RedGPU.Display.View3D(redGPUContext, sharedScene, mainCamera);
    mainView.setSize('100%', '100%');
    mainView.grid = true;
    redGPUContext.addView(mainView);

    // 미니맵 뷰 설정
    const miniMapSize = 200;
    const miniMapCamera = new RedGPU.Camera.PerspectiveCamera(redGPUContext);
    miniMapCamera.y = 50;
    miniMapCamera.lookAt(0, 0, 0.1);

    const miniMapView = new RedGPU.Display.View3D(redGPUContext, sharedScene, miniMapCamera);
    miniMapView.setSize(miniMapSize, miniMapSize);
    miniMapView.axis = true;
    miniMapView.grid = true;
    redGPUContext.addView(miniMapView);

    const updateLayout = () => {
        const { width } = mainView.screenRectObject;
        miniMapView.setPosition(width - miniMapSize - 10, 10);
    };

    redGPUContext.onResize = updateLayout;
    updateLayout();

    // 씬 오브젝트 배치
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
`),s("p",null,");"),a(`
`)],-1)])]),_:1})]),_:1}),i[6]||(i[6]=s("h2",{id:"_6-렌더링-흐름",tabindex:"-1"},[a("6. 렌더링 흐름 "),s("a",{class:"header-anchor",href:"#_6-렌더링-흐름","aria-label":'Permalink to "6. 렌더링 흐름"'},"​")],-1)),i[7]||(i[7]=s("p",null,[s("strong",null,"Renderer"),a(" 가 매 프레임 컨텍스트에 등록된 뷰 목록을 순회하며 수행하는 작업 흐름입니다.")],-1)),n(t,null,{default:e(()=>[n(h,{definition:d})]),_:1}),i[8]||(i[8]=l("",4))])}}});export{F as __pageData,w as default};
