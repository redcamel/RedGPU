import{D as a,o as l,c as i,a2 as t,G as n,w as d}from"./chunks/framework.n5RLHRfo.js";const f=JSON.parse('{"title":"View System","description":"","frontmatter":{"title":"View System","order":3},"headers":[],"relativePath":"en/view-system/index.md","filePath":"en/view-system/index.md","lastUpdated":1792993711000}'),c={name:"en/view-system/index.md"},P=Object.assign(c,{setup(m){const s=`
    graph TD
        Context["RedGPUContext"]
        
        subgraph MainView ["View3D (Main View)"]
            View1["View3D Instance"]
            Camera1["Camera (Main Camera)"]
            View1 -->|Owns| Camera1
        end
        
        subgraph MiniView ["View3D (Minimap View)"]
            View2["View3D Instance"]
            Camera2["Camera (Top-Down Camera)"]
            View2 -->|Owns| Camera2
        end
        
        Scene["Scene (3D Stage)"]
        Meshes["Mesh / Light / Environment"]
        Controller1["Controller"]
        Controller2["Controller"]
        
        Context -->|Registers & Renders| View1
        Context -->|Registers & Renders| View2
        
        View1 -->|References| Scene
        View2 -->|Shared Reference| Scene
        
        Controller1 -->|Controls Viewpoint| Camera1
        Controller2 -->|Controls Viewpoint| Camera2
        
        Scene -->|Contains| Meshes

        %% Grayscale styles applied
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
`;return(p,e)=>{const o=a("MermaidResponsive"),r=a("ClientOnly");return l(),i("div",null,[e[0]||(e[0]=t("",5)),n(r,null,{default:d(()=>[n(o,{definition:s})]),_:1}),e[1]||(e[1]=t("",17))])}}});export{f as __pageData,P as default};
