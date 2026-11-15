import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read=path=>readFileSync(new URL(path,import.meta.url),"utf8");
function load(path){const exports={};const js=ts.transpileModule(read(path),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;new Function("exports",js)(exports);return exports;}
const order=load("../features/services/lib/email-reading-order.ts");
const valid={name:" Reader ",email:" reader@example.com ",birthDate:"1990-03-27",background:" Context ",questions:[" First question? ","Second question?"]};
test("consultation validation trims fields, preserves one question per reading and rejects invalid inputs",()=>{
 const result=order.normaliseEmailReadingDraft(valid,"2026-11-15");assert.equal(result.name,"Reader");assert.equal(result.email,"reader@example.com");assert.deepEqual(result.questions,["First question?","Second question?"]);
 assert.ok(order.normaliseEmailReadingDraft({...valid,birthDate:""},"2026-11-15"));
 for(const invalid of [null,{}, {...valid,name:" "},{...valid,email:"bad"},{...valid,questions:[]},{...valid,questions:[" "]},{...valid,questions:[1]},{...valid,questions:Array(100).fill("question")},{...valid,questions:["a".repeat(2001)]},{...valid,background:"a".repeat(4001)},{...valid,birthDate:"2030-01-01"},{...valid,birthDate:"2026-02-30"},{...valid,birthDate:"not-a-date"}])assert.equal(order.normaliseEmailReadingDraft(invalid,"2026-11-15"),null);
});
test("personal information stays out of persisted cart and has no submission endpoint",()=>{
 const draft=read("../features/services/components/use-email-reading-draft.ts");assert.doesNotMatch(draft,/localStorage|sessionStorage|fetch\(/);
 const form=read("../features/services/components/email-reading-form.tsx");assert.doesNotMatch(form,/fetch\(|apiKey|OPENAI/);assert.match(form,/normaliseEmailReadingDraft/);assert.match(form,/values.getAll\("questions"\)/);
 assert.match(read("../features/services/components/product-detail.tsx"),/cart.setQuantity\(product.id, draft.questions.length\)/);
 const cart=read("../features/services/components/cart-page.tsx");assert.match(cart,/setEmailReadingDraft\(null\)/);assert.match(cart,/咨询资料尚未填写/);assert.match(cart,/<Button disabled>/);
});
test("new product uses the supplied image and AUD49 per question without enabling STARS payments",()=>{
 const catalog=read("../features/services/lib/catalog.ts");assert.match(catalog,/id: "personal-tarot-email".*priceCents: 4900/);
 const guide=read("../features/services/lib/email-reading-guide.ts");for(const heading of ["WHY CHOOSE EMAIL TAROT READING?","HOW IT WORKS","WHAT CAN YOU ASK?","A PRIVATE MOMENT, JUST FOR YOU"])assert.ok(guide.includes(heading));assert.match(guide,/STARS payments.*not enabled/);
});
