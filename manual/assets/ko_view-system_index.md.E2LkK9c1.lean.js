import{D as a,o as n,c as d,a2 as t,G as s,w as i}from"./chunks/framework.n5RLHRfo.js";const P=JSON.parse('{"title":"View System","description":"","frontmatter":{"title":"View System","order":3},"headers":[],"relativePath":"ko/view-system/index.md","filePath":"ko/view-system/index.md","lastUpdated":1792987289000}'),c={name:"ko/view-system/index.md"},f=Object.assign(c,{setup(m){const l=`
    graph TD
        Context["RedGPUContext"]
        
        subgraph MainView ["View3D (메인 뷰)"]
            View1["View3D 인스턴스"]
            Camera1["Camera (메인 카메라)"]
            View1 -->|소유| Camera1
        end
        
        subgraph MiniView ["View3D (미니맵 뷰)"]
            View2["View3D 인스턴스"]
            Camera2["Camera (탑다운 카메라)"]
            View2 -->|소유| Camera2
        end
        
        Scene["Scene (3D 무대)"]
        Meshes["Mesh / Light / 환경"]
        Controller1["Controller"]
        Controller2["Controller"]
        
        Context -->|등록 및 렌더링| View1
        Context -->|등록 및 렌더링| View2
        
        View1 -->|참조| Scene
        View2 -->|공유 참조| Scene
        
        Controller1 -->|시점 제어| Camera1
        Controller2 -->|시점 제어| Camera2
        
        Scene -->|포함| Meshes

        %% 회색조 스타일 적용
        style Context fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style MainView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style MiniView fill:#f4f4f5,stroke:#d4d4d8,color:#27272a,stroke-width:1px
        style View1 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style View2 fill:#fafafa,stroke:#d4d4d8,color:#18181b,stroke-width:1px
        style Camera1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Camera2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller1 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Controller2 fill:#fafafa,stroke:#e4e4e7,color:#71717a,stroke-width:1px
        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Meshes fill:#fafafa,stroke:#e4e4e7,color:#3f3f46,stroke-width:1px
`;return(p,e)=>{const o=a("MermaidResponsive"),r=a("ClientOnly");return n(),d("div",null,[e[0]||(e[0]=t("",5)),s(r,null,{default:i(()=>[s(o,{definition:l})]),_:1}),e[1]||(e[1]=t("",17))])}}});export{P as __pageData,f as default};
