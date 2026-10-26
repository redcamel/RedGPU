import{_ as d}from"./chunks/landscape.BPwPIf1V.js";import{D as a,o,c,a2 as t,G as s,w as i}from"./chunks/framework.n5RLHRfo.js";const P=JSON.parse('{"title":"Landscape & Ecosystem","description":"","frontmatter":{"title":"Landscape & Ecosystem","order":12},"headers":[],"relativePath":"ko/landscape/index.md","filePath":"ko/landscape/index.md","lastUpdated":1792993711000}'),p={name:"ko/landscape/index.md"},G=Object.assign(p,{setup(m){const r=`
    graph TD
        Scene["RedGPU.Display.Scene"] -->|scene.landscape| Landscape["Landscape"]
        Landscape --> Terrain["1. Terrain (Global Heightmap & LOD)"]
        Landscape --> Material["2. Multi-Layer Splatting (LandscapeMaterial)"]
        Landscape --> Streaming["3. Tile Streaming (On-Demand Tiles)"]
        Landscape --> Grass["4. Procedural Grass (GrassManager)"]
        Landscape --> Foliage["5. Foliage & Impostors (FoliageManager)"]

        style Scene fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Landscape fill:#d4d4d8,stroke:#a1a1aa,color:#18181b,stroke-width:2px
        style Terrain fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Material fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Streaming fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Grass fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
        style Foliage fill:#f4f4f5,stroke:#d4d4d8,color:#3f3f46,stroke-width:1px
`;return(g,e)=>{const l=a("MermaidResponsive"),n=a("ClientOnly");return o(),c("div",null,[e[0]||(e[0]=t("",4)),s(n,null,{default:i(()=>[s(l,{definition:r})]),_:1}),e[1]||(e[1]=t("",8))])}}});export{P as __pageData,G as default};
