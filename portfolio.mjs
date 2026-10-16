import {roomContent} from './assets/demo/profile.js';
import {icon} from './assets/demo/icons.js';
import {translatePortfolioToEnglish} from './assets/portfolio/english.js';

function renderProjectList(html) {
  const cases = [...html.matchAll(/<article class="content-section project-case[^>]*>[\s\S]*?<\/article>/g)];
  if (!cases.length) throw new Error('Nenhum case encontrado para a lista de projetos.');
  const lead = html.slice(0, cases[0].index);
  return lead + cases.map(([article]) => {
    const title = article.match(/<h3>(.*?)<\/h3>/)?.[1];
    if (!title) throw new Error('Projeto sem título.');
    const ribbon = [...article.matchAll(/<div class="project-ribbon">([\s\S]*?)<\/div>/g)]
      .flatMap(([,items]) => [...items.matchAll(/<span>(.*?)<\/span>/g)].map(([,text]) => text));
    const kicker = article.match(/<span class="content-kicker">(.*?)<\/span>/)?.[1] || '';
    const summary = ribbon.length ? ribbon.join(' · ') : kicker.toLocaleLowerCase('pt-BR').replace(/^./,letter => letter.toLocaleUpperCase('pt-BR'));
    return `<details class="project-detail"><summary><span class="project-summary-title">${title}</span><span class="project-summary-description">${summary}</span><span class="project-summary-arrow" aria-hidden="true"></span></summary><div class="project-details">${article}</div></details>`;
  }).join('');
}

// Both entry points read the same professional content. The simple view is
// rendered at build time, so reading the portfolio never requires JavaScript.
export function renderPortfolio(template, language = 'pt') {
  if (!['pt', 'en'].includes(language)) throw new Error(`Idioma desconhecido: ${language}`);
  const html = template
    .replace(/<!-- content:(\w+) -->/g, (_, id) => {
      if (!roomContent[id]) throw new Error(`Conteúdo desconhecido: ${id}`);
      let html = roomContent[id].html.replace(
        /<button class="room-link" type="button" data-room-destination="experience">([\s\S]*?)<\/button>/g,
        '<a class="room-link" href="#experiencia">$1</a>'
      );
      if (id === 'projects') html = renderProjectList(html);
      if (id === 'tech') html = html.replace('class="tech-filters"', 'class="tech-filters" hidden');
      return html;
    })
    .replace(/<!-- icon:(\w+) -->/g, (_, name) => icon(name))
    .replace(/(<a\b[^>]*data-language="(pt|en)"[^>]*)(>)/g,
      (_, tag, locale, end) => tag + (locale === language ? ' aria-current="page"' : '') + end);
  return language === 'en' ? translatePortfolioToEnglish(html) : html;
}
