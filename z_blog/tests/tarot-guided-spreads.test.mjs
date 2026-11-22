import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, normalize } from 'node:path';
import ts from 'typescript';

const root = new URL('../', import.meta.url);
let completionArgs;
let archiveContext;
let accessCalls = 0;
let allowed = true;
let malformed = false;
const cache = new Map();
class FakeOpenAI {
  chat = { completions: { create: async args => {
    completionArgs = args;
    const fields = Object.keys(args.response_format.json_schema.schema.properties).filter(key => key !== 'advice');
    const text = { zh: '测试解读', en: 'Test interpretation' };
    const result = Object.fromEntries(fields.map(key => [key, text]));
    result.advice = [text, text, text];
    return { choices: [{ finish_reason: "stop", message: { content: JSON.stringify(malformed ? { overview: text } : result) } }] };
  } } };
}
function load(file) {
  if (cache.has(file)) return cache.get(file);
  const exports = {};
  cache.set(file, exports);
  const source = readFileSync(new URL(file, root), 'utf8');
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText;
  new Function('exports', 'require', js)(exports, name => {
    if (name === 'next/server') return { NextResponse: { json: (value, init) => Response.json(value, init) } };
    if (name === 'openai') return { __esModule: true, default: FakeOpenAI };
    if (name === '@/features/billing/lib/reading-billing') return { beginReading: async () => {
      accessCalls++;
      return {
        response: allowed ? undefined : Response.json({ code: 'daily_limit_reached' }, { status: 403 }),
        complete: async (result, context) => {
          archiveContext = context;
          return Response.json(result);
        },
        release: async () => {},
      };
    } };
    if (name.startsWith('@/') && name.endsWith('.json')) return JSON.parse(readFileSync(new URL(name.slice(2), root), 'utf8'));
    if (name.startsWith('@/')) return load(`${name.slice(2)}.ts`);
    if (name.startsWith('.')) return load(`${normalize(`${dirname(file)}/${name}`).replaceAll('\\', '/')}.ts`);
    throw new Error(name);
  });
  return exports;
}
const { tarotModes, tarotModeOrder, isTarotReadingMode } = load('lib/tarot/reading-modes.ts');
const { tarotDeck } = load('lib/tarot/full-deck.ts');
const { buildTarotReadingPrompts } = load('lib/tarot/reading-prompt.ts');
const { getTarotReadingSchema, isTarotReadingResult } = load('lib/tarot/reading-result.ts');
const { POST } = load('app/api/tarot-reading/route.ts');
const guided = ['problem-obstacle-advice','free-flow','love-triangle','career-3','two-choices','celtic-cross'];
const cardsFor = mode => tarotModes[mode].positions.map((position, index) => ({ ...tarotDeck[index], position: position.key, reversed: index % 2 === 1 }));
const request = body => new Request('http://localhost/api/tarot-reading', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } });

test('ten spreads retain the original four followed by six preset spreads', () => {
  assert.deepEqual(tarotModeOrder, ['love','yes-no','one-card','three-cards', ...guided]);
  assert.deepEqual(guided.map(mode => tarotModes[mode].positions.length), [3,5,3,3,6,10]);
  for (const mode of tarotModeOrder) {
    const config = tarotModes[mode];
    assert.equal(isTarotReadingMode(mode), true);
    assert.equal(new Set(config.positions.map(position => position.key)).size, config.positions.length);
    assert.ok(existsSync(new URL(`public${config.image}`, root)));
    assert.ok(config.title.zh && config.title.en);
    if (guided.includes(mode)) {
      assert.ok(config.fixedQuestion.zh && config.fixedQuestion.en);
      assert.ok(config.positions.every(position => position.description.zh && position.description.en));
      assert.equal(config.href, `/tarot-ai/${mode}`);
    } else assert.equal(config.fixedQuestion, undefined);
  }
  assert.equal(tarotDeck.length, 78);
});

test('121 relationship situations have bilingual questions, validated positions and the published layouts', async () => {
  const { situationCatalogs, isSituationMode } = load('lib/tarot/situation-spreads.ts');
  const relationshipSituations = situationCatalogs.relationships.situations;
  assert.equal(relationshipSituations.length, 121);
  assert.equal(new Set(relationshipSituations.map((entry) => entry.id)).size, 121);
  assert.equal(new Set(relationshipSituations.map((entry) => entry.layout)).size, 8);
  assert.deepEqual([...new Set(relationshipSituations.map((entry) => entry.positions.length))].sort((a,b) => a-b), [3,4,5,6,7,11,12]);
  for (const entry of relationshipSituations) {
    const { mode, href } = entry;
    const config = tarotModes[mode];
    assert.equal(isSituationMode(mode), true);
    assert.equal(isTarotReadingMode(mode), true);
    assert.equal(config.href, href);
    assert.ok(/[\u4e00-\u9fff]/.test(config.fixedQuestion.zh));
    assert.ok(config.fixedQuestion.en.endsWith('?'));
    assert.equal(config.positions.length, entry.layout.cards.length);
    assert.equal(new Set(config.positions.map((position) => position.key)).size, config.positions.length);
    assert.ok(config.positions.every(({ label }) => label.zh && label.en));
    assert.ok(entry.layout.cards.every(({ x, y, width, rotation }) =>
      [x,y,width].every((value) => value > 0 && value <= 100) && Number.isFinite(rotation)));
    assert.deepEqual(getTarotReadingSchema(mode).required.slice(1, -2), config.positions.map(({ key }) => key));
  }
  const horizontal = tarotModes['relationship-attraction'].layout.cards;
  assert.equal(new Set(horizontal.map(({ y }) => y)).size, 1);
  const staggered = tarotModes['relationship-his-feelings'].layout.cards;
  assert.equal(staggered.filter(({ y }) => y === staggered[0].y).length, 3);
  assert.equal(staggered.filter(({ y }) => y > staggered[0].y).length, 2);
  const mode = 'relationship-compatibility';
  const response = await POST(request({ mode, cards: cardsFor(mode) }));
  assert.equal(response.status, 200);
  assert.ok(isTarotReadingResult((await response.json()).sections, mode));
  assert.equal(archiveContext.cards.length, 12);
  assert.deepEqual(archiveContext.fixedQuestion, tarotModes[mode].fixedQuestion);
});

test('25 finance situations reuse the verified five-card layouts and archive the bilingual question', async () => {
  const { situationCatalogs, isSituationMode } = load('lib/tarot/situation-spreads.ts');
  const situations = situationCatalogs.finances.situations;
  assert.equal(situations.length, 25);
  assert.equal(new Set(situations.map((entry) => entry.id)).size, 25);
  assert.equal(new Set(situations.map((entry) => entry.layout)).size, 2);
  assert.equal(situations.filter((entry) => new Set(entry.layout.cards.map(({ y }) => y)).size === 2).length, 2);
  for (const entry of situations) {
    const config = tarotModes[entry.mode];
    assert.equal(isSituationMode(entry.mode), true);
    assert.equal(config.href, `/tarot-ai/finances/${entry.id}`);
    assert.equal(config.positions.length, 5);
    assert.ok(config.positions.every(({ label }, index) => label.en && label.zh && config.positions[index].key === `finance-${index + 1}`));
    assert.ok(config.fixedQuestion.zh && config.fixedQuestion.en.endsWith('?'));
  }
  const mode = 'finance-should-i-invest';
  const response = await POST(request({ mode, cards: cardsFor(mode) }));
  assert.equal(response.status, 200);
  assert.ok(isTarotReadingResult((await response.json()).sections, mode));
  assert.deepEqual(archiveContext.fixedQuestion, tarotModes[mode].fixedQuestion);
  assert.match(completionArgs.messages[0].content, /Never predict returns/);
});

test('preset prompt ignores client question and includes each canonical position and real card', () => {
  for (const mode of guided) {
    const cards = cardsFor(mode);
    const prompts = buildTarotReadingPrompts(mode, cards, 'INJECTED_QUESTION');
    assert.ok(!prompts.user.includes('INJECTED_QUESTION'));
    assert.ok(prompts.system.includes(tarotModes[mode].fixedQuestion.zh));
    cards.forEach((card, index) => {
      assert.ok(prompts.user.includes(card.name));
      assert.ok(prompts.user.includes(tarotModes[mode].positions[index].description.en));
    });
    const schema = getTarotReadingSchema(mode);
    assert.deepEqual(schema.required, ['overview', ...cards.map(card => card.position), 'synthesis', 'advice']);
  }
  assert.match(buildTarotReadingPrompts('free-flow', cardsFor('free-flow')).system, /不是固定角色牌阵/);
  assert.match(buildTarotReadingPrompts('two-choices', cardsFor('two-choices')).system, /不得编造选项/);
  assert.match(buildTarotReadingPrompts('love-triangle', cardsFor('love-triangle')).system, /不代表第三者/);
});

test('all six API modes accept no typed question and return a complete bilingual result', async () => {
  for (const mode of guided) {
    const before = accessCalls;
    const response = await POST(request({ mode, cards: cardsFor(mode), question: '' }));
    assert.equal(response.status, 200, mode);
    assert.equal(accessCalls, before + 1, 'one access check per reading');
    const result = await response.json();
    assert.ok(isTarotReadingResult(result.sections, mode), mode);
    assert.deepEqual(archiveContext, {
      kind: 'tarot', mode, question: '', fixedQuestion: tarotModes[mode].fixedQuestion,
      cards: cardsFor(mode).map(({ id, position, reversed }) => ({ id, position, reversed })),
    });
    assert.ok(completionArgs.messages[0].content.includes(tarotModes[mode].fixedQuestion.zh));
    for (const { key } of tarotModes[mode].positions) assert.ok(result.sections[key].zh && result.sections[key].en);
  }
});

test('API rejects wrong counts, duplicate cards, wrong positions and unknown modes before consuming access', async () => {
  const cards = cardsFor('celtic-cross');
  const before = accessCalls;
  for (const body of [
    { mode: 'unknown', cards },
    { mode: 'celtic-cross', cards: cards.slice(0,9) },
    { mode: 'celtic-cross', cards: cards.map((card, i) => i === 1 ? { ...card, id: cards[0].id } : card) },
    { mode: 'celtic-cross', cards: cards.map((card, i) => i === 1 ? { ...card, position: 'past' } : card) },
    { mode: 'yes-no', cards: cardsFor('yes-no'), question: '' },
  ]) assert.equal((await POST(request(body))).status, 400);
  assert.equal(accessCalls, before);
});

test('server reconstructs cards, retains access limits and validates generated results', async () => {
  const mode = 'career-3';
  const response = await POST(request({ mode, question: 'INJECTED_QUESTION', cards: cardsFor(mode).map(card => ({ ...card, name: 'SPOOFED_CARD_NAME', meaningUp: ['SPOOFED_KEYWORDS'] })) }));
  assert.equal(response.status, 200);
  assert.ok(!JSON.stringify(completionArgs.messages).includes('SPOOFED'));
  assert.ok(!JSON.stringify(completionArgs.messages).includes('INJECTED_QUESTION'));
  allowed = false;
  assert.equal((await POST(request({ mode, cards: cardsFor(mode) }))).status, 403);
  allowed = true;
  malformed = true;
  const originalError = console.error;
  console.error = () => {};
  try { assert.equal((await POST(request({ mode, cards: cardsFor(mode) }))).status, 500); }
  finally { malformed = false; console.error = originalError; }
});
