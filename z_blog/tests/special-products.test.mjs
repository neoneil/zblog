import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { dirname, normalize } from "node:path";
import ts from "typescript";
const root=new URL("../",import.meta.url),cache=new Map();
function load(file){if(cache.has(file))return cache.get(file);const exports={};cache.set(file,exports);const js=ts.transpileModule(readFileSync(new URL(file,root),"utf8"),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function("exports","require",js)(exports,name=>{if(name.startsWith('.'))return load(normalize(dirname(file)+"/"+name).replaceAll("\\","/")+".ts");throw new Error(name);});return exports;}
const catalog=load("features/services/lib/catalog.ts"),cart=load("features/services/lib/cart.ts"),{lecturesGuide,soulSigilGuide}=load("features/services/lib/special-product-guides.ts");
test("two new products are bilingual, priced AUD78/AUD88 and share the existing cart",()=>{
 const expected=[["mystic-salons",7800],["stellar-soul-sigil",8800]];assert.equal(catalog.products.length,10);
 for(const [id,price] of expected){const product=catalog.getProduct(id);assert.equal(product.priceCents,price);assert.ok(catalog.isProductPurchasable(product));assert.equal(product.category,"special");assert.ok(product.availabilityNote.en&&product.availabilityNote.zh);assert.ok(existsSync(new URL('public'+product.image,root)));assert.ok(product.title.en&&product.title.zh);}
 assert.deepEqual(cart.cartTotals([{productId:"mystic-salons",quantity:1},{productId:"stellar-soul-sigil",quantity:1}]),{count:2,subtotalCents:16600});
 assert.deepEqual(cart.normaliseCart([{productId:"mystic-salons",quantity:1,priceCents:1}]),[{productId:"mystic-salons",quantity:1}]);
 assert.ok(catalog.products.every(p=>/^\d{4}-\d{2}-\d{2}$/.test(p.date)&&!Number.isNaN(Date.parse(p.date))));
});
test("Word content retains joining methods, five themes, four steps and the sigil's cultural qualifications",()=>{
 assert.equal(lecturesGuide.sections.find(s=>s.id==='ways-to-join').lists.length,2);
 assert.equal(lecturesGuide.sections.find(s=>s.id==='event-themes').highlights.length,5);
 assert.equal(lecturesGuide.sections.find(s=>s.id==='event-booking').highlights.length,4);
 const meanings=soulSigilGuide.sections.find(s=>s.id==='sigil-symbolism');assert.equal(meanings.table.columns.length,2);assert.equal(meanings.table.rows.length,5);assert.match(meanings.note.en,/supernatural/);
 assert.equal(soulSigilGuide.sections.find(s=>s.id==='sigil-story').highlights.length,3);
 assert.match(soulSigilGuide.sections.find(s=>s.id==='sigil-arms').note.en,/not.*rule|not.*recognis|not.*univers/i);
 for(const guide of [lecturesGuide,soulSigilGuide]){assert.doesNotMatch(JSON.stringify(guide).match(/"en":"([^"]*)"/g).join(''),/[\u3400-\u9fff]/);}
});
test("event announcement is a bilingual homepage entry without invented event records",()=>{
 const read=file=>readFileSync(new URL(file,root),'utf8');assert.match(read('app/page.tsx'),/<EventAnnouncement \/>/);
 const component=read('features/services/components/event-announcement.tsx');assert.match(component,/待公布/);assert.match(component,/setOpen\(false\)/);assert.match(component,/setOpen\(true\)/);assert.match(component,/lectures-and-mystic-salons#service-monthly-events/);assert.doesNotMatch(component,/fetch\(|\.from\(/);
});
