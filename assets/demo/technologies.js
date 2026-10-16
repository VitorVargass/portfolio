import {icon} from './icons.js';

// Transcribed from the updated résumé. No proficiency scores are inferred.
export const technologyGroups=[
  {id:'languages',name:'Linguagens',icon:'code',color:'#7254b5',light:'#f0eafa',description:'As linguagens com que escrevo as aplicações.',items:[
    ['C#','C#','#7651b8'],['Go','Go','#087e94'],['TypeScript','TS','#3178c6'],['JavaScript','JS','#9d7710'],['SQL','SQL','#157e87'],['Python','Py','#416d9c'],['PHP','php','#7175aa']
  ]},
  {id:'backend',name:'Backend & APIs',icon:'server',color:'#4d75ae',light:'#eaf1fb',description:'Regras de negócio, comunicação e processamento.',items:[
    ['ASP.NET Core','ASP','#6552ae'],['.NET','.N','#6552ae'],['Entity Framework Core','EF','#6552ae'],['REST APIs','API','#4b7899'],['Node.js','JS','#41834c'],['Fastify','F','#444957'],['SignalR','S↔','#4d75ae'],['WebSockets','WS','#397d86'],['webhooks','↪','#7b598d']
  ]},
  {id:'frontend',name:'Frontend & desktop',icon:'layout',color:'#218a8b',light:'#e7f5f2',description:'Interfaces web e aplicações para o computador.',items:[
    ['React','⚛','#137e9d'],['Next.js','N','#30343f'],['Tailwind CSS','≈','#168b9d'],['Electron','E','#407f94']
  ]},
  {id:'data',name:'Dados & cloud',icon:'cloud',color:'#b07a36',light:'#faf0df',description:'Persistência, infraestrutura e entrega das aplicações.',items:[
    ['PostgreSQL','PG','#416a94'],['Neon','N','#27886c'],['Redis','R','#b34b4f'],['MySQL','My','#417b96'],['SQL Server','SQL','#ab4e56'],['Azure App Service','Az','#237bb5'],['Vercel','▲','#30343f'],['Cloudflare R2','R2','#b8702c'],['Docker','D','#287cad'],['GitHub Actions','GH','#626d8a']
  ]},
  {id:'quality',name:'Qualidade & segurança',icon:'shield',color:'#a45f77',light:'#f8eaf0',description:'Testes, observabilidade e proteção dos sistemas.',items:[
    ['xUnit','xU','#745b9d'],['Vitest','V','#6d8b3d'],['Playwright','PW','#407e56'],['Sentry','S','#876085'],['Application Insights','AI','#3979a0'],['RBAC','RB','#957246'],['2FA','2F','#957246'],['RLS','RL','#957246'],['OWASP Top 10','OW','#a45f77']
  ]},
  {id:'integrations',name:'Integrações',icon:'plug',color:'#4b8b6d',light:'#ebf4ed',description:'Serviços conectados aos produtos em que atuo.',items:[
    ['OpenAI API','AI','#397565'],['Asaas','A','#326db0'],['Resend','Re','#30343f'],['Telnyx','T','#41895c'],['Melhor Envio','ME','#a86735'],['BrasilAPI','BR','#4e8569']
  ]}
];
export const technologyCount=technologyGroups.reduce((count,g)=>count+g.items.length,0);

function renderGroup(group){
  return `<section class="tech-category" data-tech-group="${group.id}" style="--category-color:${group.color};--category-light:${group.light}"><header><span class="category-symbol">${icon(group.icon)}</span><div><h3>${group.name}</h3><p>${group.description}</p></div><span class="category-count">${group.items.length}</span></header><div class="tech-grid">${group.items.map(([name,mark,color])=>`<div class="tech-tile"><span class="tech-mark" aria-hidden="true" style="--mark-color:${color}">${mark}</span><strong>${name}</strong></div>`).join('')}</div></section>`;
}
export function renderTechnologies(){
  return `<p class="room-lead">Um mapa das linguagens, frameworks e serviços que utilizo nos projetos.</p><div class="tech-summary"><span><strong>${technologyCount}</strong> tecnologias e ferramentas</span><span>${technologyGroups.length} áreas de atuação</span></div><nav class="tech-filters" aria-label="Filtrar tecnologias por área"><button type="button" data-tech-filter="all" aria-pressed="true">Todas <span>${technologyCount}</span></button>${technologyGroups.map(g=>`<button type="button" data-tech-filter="${g.id}" aria-pressed="false" style="--filter-color:${g.color}">${icon(g.icon)}${g.name}</button>`).join('')}</nav><p id="tech-filter-status" class="sr-only" role="status">${technologyCount} tecnologias e ferramentas exibidas.</p><div id="tech-catalog">${technologyGroups.map(renderGroup).join('')}</div><p class="note">Também utilizei ASP.NET MVC, Supabase e Azure VM nas experiências descritas no currículo, além de práticas de CI/CD, Scrum e Kanban e proteção CSRF. A experiência com Go vem de projetos próprios.</p>`;
}
