import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

const require=createRequire(import.meta.url);
const requireNext=createRequire(require.resolve("next/package.json"));
const postcss=requireNext("postcss");
const root=new URL("../",import.meta.url);
const read=file=>readFileSync(new URL(file,root),"utf8");
const sheet=postcss.parse(read("app/globals.css")+"\n"+read("app/typography-theme.css"));
function palette(theme){
  const result={};
  sheet.walkRules(rule=>{
    if(rule.selector!==":root"&&rule.selector!==`html[data-theme="${theme}"]`)return;
    rule.nodes.filter(node=>node.type==="decl"&&node.prop.startsWith("--")).forEach(node=>result[node.prop]=node.value);
  });
  const resolve=key=>{const value=result[key];if(!value)throw new Error(key);const variable=/^var\((--[^)]+)\)$/.exec(value);return variable?resolve(variable[1]):value;};
  return resolve;
}
function contrast(a,b){
  const luminance=value=>{const rgb=value.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4);return rgb[0]*0.2126+rgb[1]*0.7152+rgb[2]*0.0722;};
  const x=luminance(a),y=luminance(b);return (Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);
}
test("titles, subtitles and reading text use separate global semantic colors",()=>{
  for(const theme of ["light","dark"]){
    const color=palette(theme);
    assert.equal(color("--archive-heading"),color("--title-ink"));
    assert.equal(color("--heading"),color("--title-ink"));
    assert.equal(color("--archive-text"),color("--reading-ink"));
    assert.notEqual(color("--title-ink"),color("--subtitle-ink"));
    for(const token of ["--title-ink","--subtitle-ink","--reading-ink"]){
      assert.ok(contrast(color(token),color("--bg"))>=4.5,`${theme} ${token}`);
      assert.ok(contrast(color(token),color("--card"))>=4.5,`${theme} card ${token}`);
    }
    assert.equal(color("--primary"),"#c49a2a");
    assert.equal(color("--text-soft"),theme==="dark"?"#ffffff":"#31414e");
    if(theme==="dark"){
      for(const token of ["--reading-ink","--subtitle-ink","--text-faint","--explore-muted","--stella-muted"])assert.equal(color(token),"#ffffff");
    }
    assert.equal(color("--element-fire"),"#ff6b4a");
  }
});
test("shared subtitle surfaces use the subtitle token without recoloring article paragraphs",()=>{
  for(const file of ["features/thoth/components/knowledge-entries.module.css","features/services/components/services.module.css","features/services/components/service-guide-content.module.css","features/stella/components/explore.module.css","features/stella/components/zodiac-pages.module.css","features/community/components/community.module.css","components/tarot/tarot-overview.module.css"]){
    assert.ok(read(file).includes("var(--subtitle-ink)"),file);
  }
  assert.ok(read("features/services/components/service-guide-content.module.css").includes("color: var(--archive-text)"));
});
test("3D brand is STELLARNESTS and remains legible on its always-dark scene",()=>{
  assert.ok(read("features/stella/components/stella-client.tsx").includes('className={styles.brand}>STELLARNESTS</h1>'));
  const css=read("features/stella/components/stella.module.css");
  assert.ok(css.includes("--title-ink: var(--title-ink-dark)"));
  assert.ok(css.includes("--subtitle-ink: var(--subtitle-ink-dark)"));
  assert.match(css,/\.birthPanel\[data-open="false"\][^}]*top: 58px/);
});
