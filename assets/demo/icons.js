const paths={
  code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/>',
  server:'<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"/>',
  layout:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M3 9h18M9 9v12M6 6h.01M9 6h.01"/>',
  cloud:'<path d="M6 18a4 4 0 0 1-.5-8A6.5 6.5 0 0 1 18 8a5 5 0 0 1 0 10Zm6-6v8m-3-3 3 3 3-3"/>',
  database:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  shield:'<path d="M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6Z"/><path d="m8 12 3 3 5-6"/>',
  plug:'<path d="m8 3 4 4m4-2-5 5m8-2-5 5M9 8l7 7-3 3a5 5 0 0 1-7-7Zm-3 9-4 4"/>',
  layers:'<path d="m12 2 10 6-10 6L2 8Zm-9 11 9 5 9-5m-18 5 9 5 9-5"/>',
  graduation:'<path d="m2 8 10-5 10 5-10 5Zm4 3v6c4 3 8 3 12 0v-6m4-3v9"/>',
  arrow:'<path d="M5 19 19 5M5 5h14v14"/>',
  expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M3 3l6 6m12-6-6 6M3 21l6-6m12 6-6-6"/>',
  person:'<circle cx="12" cy="6" r="3"/><path d="M6 21v-5a6 6 0 0 1 12 0v5m-6-6v6M3 11l3 3m15-3-3 3"/>',
  map:'<path d="m3 5 6-3 6 3 6-3v17l-6 3-6-3-6 3Zm6-3v17m6-14v17"/>',
  book:'<path d="M12 5c-3-2-6-2-10-1v16c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v16"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/>',
  whatsapp:'<path d="M21 11.5a9 9 0 0 1-13.4 7.9L3 21l1.6-4.6A9 9 0 1 1 21 11.5Z"/><path d="M8 7c-2 3 3 8 6 8l2-2-3-1-1 1-2-2 1-1-1-3Z"/>',
  linkedin:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 10v7m0-10v.01M11 17v-7m0 3c0-4 6-4 6 0v4"/>',
  github:'<path d="M9 19c-4 1-4-2-6-2m12 5v-3.8c0-1 .1-1.5-.5-2 3-.3 6-1.4 6-6.2 0-1.4-.5-2.7-1.4-3.6.2-1 .2-2.1-.3-3.1 0 0-1.1-.3-3.7 1.4a13 13 0 0 0-6.7 0C5.8 3 4.7 3.3 4.7 3.3c-.5 1-.5 2.1-.3 3.1C3.5 7.3 3 8.6 3 10c0 4.8 3 5.9 6 6.2-.6.5-.5 1-.5 2V22"/>',
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>'
};
export function icon(name,extraClass=''){
  return `<svg class="ui-icon ${extraClass}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.layers}</svg>`;
}
