import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
const SITE = path.resolve("_site");
async function walk(d){const o=[];for(const e of await readdir(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())o.push(...await walk(p));else if(p.endsWith(".html"))o.push(p);}return o;}
const files = await walk(SITE);

// Strip the chrome that is *supposed* to repeat (header, footer, nav, secnav).
function bodyText(html){
  let h = html;
  h = h.replace(/<header[\s\S]*?<\/header>/gi," ");
  h = h.replace(/<footer[\s\S]*?<\/footer>/gi," ");
  h = h.replace(/<nav[\s\S]*?<\/nav>/gi," ");
  h = h.replace(/<script[\s\S]*?<\/script>/gi," ");
  h = h.replace(/<style[\s\S]*?<\/style>/gi," ");
  h = h.replace(/<[^>]+>/g," ");
  return h.replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&nbsp;/g," ").replace(/\s+/g," ");
}
const map = new Map();
for (const f of files){
  const url = "/" + path.relative(SITE,f).replace(/\\/g,"/").replace(/index\.html$/,"");
  const t = bodyText(await readFile(f,"utf8"));
  for (let s of t.split(/(?<=[.!?])\s+/)){
    s = s.trim();
    if (s.length < 45) continue;                 // ignore short labels
    if (!map.has(s)) map.set(s, new Set());
    map.get(s).add(url);
  }
}
const dupes = [...map.entries()].filter(([,u])=>u.size>1).sort((a,b)=>b[1].size-a[1].size);
console.log("Sentences (45+ chars) appearing on more than one page: " + dupes.length + "\n");
for (const [s,u] of dupes){
  console.log("[" + u.size + " pages] " + s.slice(0,110) + (s.length>110?"...":""));
  console.log("          " + [...u].join("  "));
}
