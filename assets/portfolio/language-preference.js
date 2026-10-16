// Run before styles load so returning English readers avoid a Portuguese flash.
(() => {
  try {
    const key = 'vitor-portfolio-language';
    const language = document.documentElement.lang === 'en' ? 'en' : 'pt';
    if (language === 'pt' && localStorage.getItem(key) === 'en') {
      location.replace('/en.html' + location.search + location.hash);
      return;
    }
    localStorage.setItem(key, language);
  } catch {
    // Both static language pages still work when browser storage is blocked.
  }
})();
