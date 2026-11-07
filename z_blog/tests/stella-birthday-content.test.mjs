import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const read = (file) => readFileSync(new URL(file, import.meta.url), 'utf8');
const load = (file) => {
  const exports = {};
  new Function('exports', ts.transpileModule(read(`../features/stella/lib/${file}.ts`), {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  }).outputText)(exports);
  return exports;
};
const { decanReflections, birthdaySoulPractices } = load('birthday-content');
const { zodiacProfiles } = load('zodiac-profiles');
const { birthdaySlugs, parseBirthday, stellaTools } = load('explore-config');

test('all 366 birthdays retain valid routes and twelve complete bilingual sign profiles', () => {
  assert.equal(birthdaySlugs.length, 366);
  for (const slug of birthdaySlugs) assert.ok(parseBirthday(slug));
  assert.equal(zodiacProfiles.length, 12);
  assert.equal(decanReflections.length, 3);
  assert.equal(birthdaySoulPractices.length, 12);
  for (const [index, profile] of zodiacProfiles.entries()) {
    assert.ok(profile.dates.en && profile.dates.zh);
    assert.ok(profile.about.length >= 4);
    assert.equal(profile.bestMatches.length, 4);
    assert.equal(new Set(profile.bestMatches).size, 4);
    for (const copy of [...profile.about, profile.sun, profile.purpose, profile.lesson, birthdaySoulPractices[index]]) assert.ok(copy.en && copy.zh);
  }
  for (const copy of decanReflections) assert.ok(copy.en.split(/\s+/).length > 50 && copy.zh.length > 80);
  assert.equal(stellaTools.find((tool) => tool.slug === 'birthday').zh, '生日密码');
});

test('birthday details expose separate growth, compatibility and purpose sections with centered CTA', () => {
  const component = read('../features/stella/components/birthday-explorer.tsx');
  for (const text of ['Strengths & Challenges', 'Best Matches', 'Also Compatible', 'Soul Purpose', 'subtitle=', 'zodiac.dates.en', 'birthdayStyles.ctaRow']) assert.ok(component.includes(text));
  const css = read('../features/stella/components/birthday.module.css');
  assert.match(css, /justify-content: center/);
  assert.match(css, /repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /composes: glow/);
});
