import{_ as d}from"./chunks/landscape.BIYGyu45.js";import{D as a,o,c as i,a2 as t,G as s,w as c}from"./chunks/framework.n5RLHRfo.js";const P=JSON.parse('{"title":"Landscape & Ecosystem","description":"","frontmatter":{"title":"Landscape & Ecosystem","order":12},"headers":[],"relativePath":"en/landscape/index.md","filePath":"en/landscape/index.md","lastUpdated":1792987289000}'),p={name:"en/landscape/index.md"},G=Object.assign(p,{setup(m){const n=`
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
`;return(g,e)=>{const r=a("MermaidResponsive"),l=a("ClientOnly");return o(),i("div",null,[e[0]||(e[0]=t("",4)),s(l,null,{default:c(()=>[s(r,{definition:n})]),_:1}),e[1]||(e[1]=t("",8))])}}});export{P as __pageData,G as default};
