import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import ts from "typescript";

const read=path=>readFileSync(new URL(path,import.meta.url),"utf8");
function load(path,imports={}){const exports={};const js=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function("exports","require",js)(exports,name=>{if(name in imports)return imports[name];throw new Error(name);});return exports;}
const raw=load("../features/contact/aboutus-copy.ts");
const {aboutUsContent:copy}=load("../features/contact/aboutus-content.ts",{"./aboutus-copy":raw});
test("founder content preserves every supplied Chinese paragraph and supplies English for all copy",()=>{
 assert.equal(raw.aboutUsCopy.length,58);
 const rendered=JSON.stringify(copy);
 for(const row of raw.aboutUsCopy)assert.ok(rendered.includes(row.zh),`paragraph ${row.id}`);
 function walk(value){if(!value||typeof value!=="object")return;if("zh" in value||"en" in value){assert.ok(value.zh&&value.en);assert.doesNotMatch(value.en,/[\u3400-\u9fff]/);}Object.values(value).forEach(child=>{if(child&&typeof child==='object')walk(child);});}
 walk(copy);
 assert.equal(copy.title.en,"TWO SIDES OF ME, ONE UNIVERSE.");
 assert.equal(copy.letter.signature.en,"The Founder of STELLARNESTS");
 assert.deepEqual(copy.purpose.experiences.map(item=>item.href),["/parentinglab/asktarotmom","/stella","/services/personal-tarot-reading-by-email","/tarot-novel","/services/mystic-fragrances","/services/lectures-and-mystic-salons"]);
});
test("About Us replaces only the requested page and has one H1 and three narrative modules",()=>{
 const route=read("../app/aboutus/page.tsx");assert.match(route,/about-us-page/);assert.doesNotMatch(route,/AboutContact|ContactSection|NewsletterPlaceholder/);
 const page=read("../features/contact/components/about-us-page.tsx");assert.equal((page.match(/<h1\b/g)||[]).length,1);assert.equal((page.match(/data-about-section/g)||[]).length,4); // Three modules plus the observer selector.
 assert.doesNotMatch(page,/<form|fetch\(|dangerouslySetInnerHTML/);
 assert.match(read("../app/contact/page.tsx"),/<ContactSection \/>/);
  assert.doesNotMatch(read("../features/services/components/product-detail.tsx"), /\/aboutus#contact-title/);
 assert.match(read("../app/page.tsx"),/<AboutSection embedded \/>/);
 assert.match(page,/prefers-reduced-motion/);
});
test("the supplied original hero exists and full theme tokens drive the new page",()=>{
 const path=new URL("../public/about/two-sides-one-universe.png",import.meta.url);assert.ok(existsSync(path));const image=readFileSync(path);assert.equal(image.subarray(1,4).toString(),"PNG");assert.ok(image.readUInt32BE(16)>1200&&image.readUInt32BE(20)>700);
 const css=read("../features/contact/components/about-us-page.module.css");assert.match(css,/var\(--reading-ink\)/);assert.match(css,/var\(--title-ink-dark\)/);assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b/i);
});
