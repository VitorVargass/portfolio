const language = document.documentElement.lang === 'en' ? 'en' : 'pt';
const languageLinks = document.querySelectorAll('[data-language]');
function updateLanguageLinks() {
  for (const link of languageLinks) {
    const route = link.dataset.language === 'en' ? '/en.html' : '/';
    link.setAttribute('href', route + location.search + location.hash);
  }
}

// Keep the heading readable to assistive technology while individual letters
// respond visually. The original text remains the no-JavaScript fallback.
const title = document.querySelector('#hero-title');
if (title) {
  const label = [...title.childNodes].map(node => node.nodeName === 'BR' ? ' ' : node.textContent).join('');
  title.setAttribute('aria-label', label);
  for (const node of [...title.childNodes]) {
    if (node.nodeType !== Node.TEXT_NODE) continue;
    const fragment = document.createDocumentFragment();
    for (const word of node.textContent.split(/(\s+)/)) {
      if (!word.trim()) { fragment.append(document.createTextNode(word)); continue; }
      const wrapper = document.createElement('span');
      wrapper.className = 'hero-word';
      wrapper.setAttribute('aria-hidden', 'true');
      for (const character of word) {
        const letter = document.createElement('span');
        letter.className = 'hero-letter';
        letter.textContent = character;
        wrapper.append(letter);
      }
      fragment.append(wrapper);
    }
    node.replaceWith(fragment);
  }
}

const portrait = document.querySelector('.hero-portrait');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if (portrait) {
  let frame = 0;
  let position = null;
  const properties = ['--portrait-x', '--portrait-y', '--portrait-rx', '--portrait-ry'];
  function resetPortrait() {
    cancelAnimationFrame(frame);
    frame = 0;
    position = null;
    for (const property of properties) portrait.style.removeProperty(property);
  }
  portrait.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || reducedMotion.matches || !finePointer.matches) return;
    const bounds = portrait.getBoundingClientRect();
    position = {
      x: Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1)),
      y: Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1))
    };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!position || reducedMotion.matches) return;
      portrait.style.setProperty('--portrait-x', `${(position.x * 5).toFixed(2)}px`);
      portrait.style.setProperty('--portrait-y', `${(position.y * 4).toFixed(2)}px`);
      portrait.style.setProperty('--portrait-rx', `${(-position.y * 1.7).toFixed(2)}deg`);
      portrait.style.setProperty('--portrait-ry', `${(position.x * 2.2).toFixed(2)}deg`);
    });
  });
  portrait.addEventListener('pointerleave', resetPortrait);
  portrait.addEventListener('pointercancel', resetPortrait);
  window.addEventListener('blur', resetPortrait);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetPortrait(); });
  reducedMotion.addEventListener('change', resetPortrait);
  finePointer.addEventListener('change', resetPortrait);
}
updateLanguageLinks();
window.addEventListener('hashchange', updateLanguageLinks);
for (const link of languageLinks) {
  link.addEventListener('click', () => {
    try { localStorage.setItem('vitor-portfolio-language', link.dataset.language); } catch {}
  });
}

// Filtering is a progressive enhancement: without JS, every group is readable.
const catalog = document.querySelector('#tech-catalog');
const filters = document.querySelector('.tech-filters');
if (catalog && filters) {
  filters.hidden = false;
  filters.addEventListener('click', event => {
    const button = event.target.closest('button[data-tech-filter]');
    if (!button) return;
    const selected = button.dataset.techFilter;
    let count = 0;
    for (const group of catalog.querySelectorAll('[data-tech-group]')) {
      group.hidden = selected !== 'all' && group.dataset.techGroup !== selected;
      if (!group.hidden) count += group.querySelectorAll('.tech-tile').length;
    }
    for (const filter of filters.querySelectorAll('button')) {
      filter.setAttribute('aria-pressed', String(filter === button));
    }
    document.querySelector('#tech-filter-status').textContent = language === 'en'
      ? `${count} technologies and tools shown.`
      : `${count} tecnologias e ferramentas exibidas.`;
  });
}
