import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {renderPortfolio} from '../portfolio.mjs';
import {englishCopy} from '../assets/portfolio/english.js';
import {technologyGroups, technologyCount} from '../assets/demo/technologies.js';

const template = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const portuguese = renderPortfolio(template);
const english = renderPortfolio(template, 'en');
const leafTexts = html => [...html.matchAll(/>([^<>]+)</g)].map(([,text]) => text.trim()).filter(Boolean);

test('English covers all authored copy, including accessibility labels', () => {
  const unchanged = new Set([
    ...technologyGroups.flatMap(group => group.items.flatMap(([name,mark]) => [name,mark])),
    'Vitor Vargas', 'ICone Academy', 'Eron Car', 'iC', 'EC', 'ERP SaaS', 'Multi-tenant',
    'Full stack', 'Backend & APIs', 'Frontend & desktop', 'GitHub', 'LinkedIn', 'WhatsApp',
    'PT', 'EN', '3D', '(41) 99739-6800', 'vitorrodriguesvargas@gmail.com'
  ]);
  const missing = leafTexts(portuguese).filter(text => !unchanged.has(text)
    && !/^\d+$/.test(text) && !/^[\p{P}\p{S}\s]+$/u.test(text)
    && !Object.hasOwn(englishCopy,text));
  assert.deepEqual([...new Set(missing)], []);
  for (const [,label] of portuguese.matchAll(/(?:aria-label|alt|title)="([^"]+)"/g)) {
    assert.ok(Object.hasOwn(englishCopy,label), label);
    assert.ok(english.includes(englishCopy[label]), label);
  }
  assert.match(english, /<html lang="en">/);
  assert.match(english, /Hi,<br>I'm Vitor\./);
  assert.match(english, /multi-tenant SaaS platforms that organize business operations/);
  assert.ok(!portuguese.includes('Desenvolvo aplicações web, APIs e soluções desktop com C#/.NET'));
});

test('Both languages preserve navigation, projects, technology names and contact destinations', () => {
  for (const [language,html] of [['pt',portuguese],['en',english]]) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([,id]) => id);
    assert.equal(ids.length,new Set(ids).size);
    for (const [,anchor] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(anchor),anchor);
    assert.match(html,new RegExp(`data-language="${language}"[^>]*aria-current="page"`));
    assert.equal((html.match(/aria-current="page"/g)||[]).length,1);
    assert.equal((html.match(/<details class="project-detail">/g)||[]).length,2);
    assert.equal((html.match(/class="tech-tile"/g)||[]).length,technologyCount);
    assert.ok(!html.includes('/assets/demo/main.js'));
    for (const group of technologyGroups) for (const [name] of group.items) assert.ok(html.includes(`<strong>${name}</strong>`),name);
  }
  const links = html => [...html.matchAll(/<a\b[^>]*href="([^"]+)"/g)].map(([,href])=>href);
  assert.deepEqual(links(english),links(portuguese));
  assert.match(english,/Postgraduate Specialization in Software Architecture/);
  assert.match(english,/OCT 2026 — OCT 2027 \(EXPECTED\)/);
  assert.match(english,/Two years of coursework completed\./);
  assert.match(english,/Download résumé \(PT-BR\)/);
});

const guard = await readFile(new URL('../assets/portfolio/language-preference.js',import.meta.url),'utf8');
function runGuard(language, saved, blocked = false) {
  const storage = new Map([['vitor-portfolio-language',saved]]);
  const redirects = [];
  const context = {
    document:{documentElement:{lang:language}},
    localStorage:{
      getItem:key => { if(blocked)throw new Error('Storage blocked');return storage.get(key); },
      setItem:(key,value) => { if(blocked)throw new Error('Storage blocked');storage.set(key,value); }
    },
    location:{search:'?source=profile',hash:'#projetos',replace:url=>redirects.push(url)}
  };
  vm.runInNewContext(guard,context);
  return {storage,redirects};
}

test('Remembered English opens the English page and keeps the section', () => {
  assert.deepEqual(runGuard('pt-BR','en').redirects,['/en.html?source=profile#projetos']);
});

test('Direct language choices do not loop or override a Portuguese selection', () => {
  const en = runGuard('en','pt');
  assert.deepEqual(en.redirects,[]);
  assert.equal(en.storage.get('vitor-portfolio-language'),'en');
  const pt = runGuard('pt-BR','pt');
  assert.deepEqual(pt.redirects,[]);
  assert.equal(pt.storage.get('vitor-portfolio-language'),'pt');
});

test('Blocked storage leaves both static pages usable', () => {
  assert.deepEqual(runGuard('pt-BR','en',true).redirects,[]);
  assert.deepEqual(runGuard('en','pt',true).redirects,[]);
});
