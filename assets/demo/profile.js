import {icon} from './icons.js';
import {renderTechnologies} from './technologies.js';

const contactCard=(kind,name,detail,href,label)=>`<a class="contact-card contact-${kind}" href="${href}" ${kind==='mail'?'':'target="_blank" rel="noreferrer"'} aria-label="${label}"><span class="contact-icon">${icon(kind)}</span><span class="contact-card-copy"><strong>${name}</strong><small>${detail}</small></span>${icon('arrow','contact-arrow')}</a>`;

export const roomContent={
  projects:{
    description:'ICone Academy em destaque, seguida do projeto Eron Car.',
    eyebrow:'01 / A OFICINA DE IDEIAS',title:'Produtos, código e contexto.',
    html:`<p class="room-lead">Do desenvolvimento de um SaaS em equipe à entrega de um aplicativo sob demanda. Conheça os produtos em que atuo e a minha contribuição em cada um.</p>
      <article class="content-section project-case featured-case"><div class="case-heading"><span class="case-monogram icone-monogram">iC</span><div><span class="content-kicker">CASE PRINCIPAL · DESENVOLVIMENTO EM EQUIPE</span><h3>ICone Academy</h3></div></div><div class="project-ribbon"><span>ERP SaaS</span><span>Multi-tenant</span><span>Em produção</span></div>
      <p>Uma plataforma de gestão para negócios de gelato artesanal e industrial. Contribuo para a evolução do produto como desenvolvedor full stack, em colaboração com a equipe.</p>
      <h4>Minha contribuição</h4><ul class="room-list"><li>Funcionalidades no backend e na interface com .NET, ASP.NET Core, Entity Framework Core, PostgreSQL, React, Next.js e TypeScript.</li><li>Autenticação, autorização, RBAC, 2FA, RLS, proteção CSRF, webhooks e processos em segundo plano.</li><li>Integrações com OpenAI, Asaas, Resend, Telnyx, Melhor Envio, BrasilAPI e armazenamento no Cloudflare R2.</li><li>Colaboração nas migrações de Supabase para Neon e de Azure VM para Azure App Service, além de testes, CI/CD e observabilidade.</li></ul>
      <button class="room-link" type="button" data-room-destination="experience">Conhecer minha atuação na empresa ${icon('arrow')}</button></article>
      <article class="content-section project-case"><div class="case-heading"><span class="case-monogram eron-monogram">EC</span><div><span class="content-kicker">PROJETO SOB DEMANDA · DESKTOP</span><h3>Eron Car</h3></div></div><p>Aplicação de gestão para oficina mecânica, desenvolvida sob demanda e entregue a um cliente em um projeto remunerado.</p><h4>Da necessidade à entrega</h4><p>Cuidei do levantamento de requisitos, do desenvolvimento da interface e do backend e do empacotamento da aplicação desktop.</p><dl class="stack-explainer"><div><dt>React</dt><dd>Interface da aplicação.</dd></div><div><dt>Node.js</dt><dd>Regras e comunicação com os dados.</dd></div><div><dt>Electron</dt><dd>Entrega como aplicativo desktop.</dd></div></dl><a class="room-link secondary" href="https://github.com/VitorVargass/eron-desktop" target="_blank" rel="noreferrer">Explorar o código do Eron Car ${icon('github')}</a></article>`
  },
  experience:{
    description:'Minha atuação profissional na ICone Academy e no BNE.',
    eyebrow:'02 / A CASA DA TRAJETÓRIA',title:'Experiência construída em equipe.',
    html:`<p class="room-lead">Duas experiências que conectam desenvolvimento de software, operação de produtos e infraestrutura de TI.</p>
      <article class="content-section"><span class="content-kicker">ICONE ACADEMY · NOV 2025 — ATUAL · REMOTO</span><h3>Desenvolvedor de Software Full Stack</h3><p>Atuo em um ERP SaaS multi-tenant em produção para o segmento de gelato artesanal e industrial, com foco em backend, segurança, integrações e infraestrutura em nuvem.</p><h4>Na prática</h4><ul class="room-list"><li>Desenvolvimento full stack com .NET, ASP.NET Core, Entity Framework Core, PostgreSQL/Neon, Redis, Next.js, React, TypeScript e SignalR.</li><li>Autenticação e autorização com RBAC, 2FA, RLS e proteção CSRF.</li><li>Integrações, webhooks, processamento em segundo plano e armazenamento de arquivos.</li><li>Infraestrutura, testes, CI/CD e observabilidade com Azure, Vercel, GitHub Actions, Sentry e Application Insights.</li></ul></article>
      <article class="content-section"><span class="content-kicker">BNE · AGO 2023 — ABR 2024 · COLOMBO, PR</span><h3>Aprendiz de TI e Desenvolvimento de Software</h3><p>Desenvolvi um sistema interno de recursos humanos com C#/.NET e ASP.NET MVC. Também trabalhei com bancos de dados no Azure, apoiei a infraestrutura de TI e utilizei Scrum e Kanban no acompanhamento das entregas.</p></article><a class="room-link secondary" href="https://www.linkedin.com/in/vitorrvargas/" target="_blank" rel="noreferrer">Meu perfil profissional ${icon('linkedin')}</a>`
  },
  about:{
    description:'Meu jeito de desenvolver e minha trajetória em software.',
    eyebrow:'03 / O OBSERVATÓRIO DO VITOR',title:'Um pouco de quem está por trás do código.',
    html:`<p class="room-lead">Sou Vitor Vargas, desenvolvedor de software full stack de Curitiba. Gosto de entender o contexto de um problema e transformar essa visão em aplicações úteis, da interface às regras que sustentam o produto.</p>
      <div class="profile-facts"><span>${icon('code')}<strong>Full stack</strong><small>Web, APIs e desktop</small></span><span>${icon('graduation')}<strong>Pós na PUCPR</strong><small>Arquitetura, dados e segurança</small></span></div>
      <article class="content-section"><h3>Construindo software de verdade</h3><p>Hoje contribuo para a evolução de uma plataforma SaaS em produção na ICone Academy. Trabalho com C#/.NET, React e TypeScript, com atenção a backend, segurança, integrações e infraestrutura em nuvem.</p><p>Também tenho experiência com projetos sob demanda, como o Eron Car, e exploro Go em projetos próprios. Gosto dessa troca entre construir em equipe e assumir a responsabilidade pelas etapas de uma entrega.</p></article>
      <div class="language-strip"><span>Português <strong>Nativo</strong></span><span>Inglês <strong>Avançado · B2</strong></span><span>Espanhol <strong>Básico</strong></span></div><a class="room-link" href="/assets/curriculo-vitor-vargas.pdf" download>Baixar meu currículo ${icon('book')}</a>`
  },
  tech:{
    description:'Todas as tecnologias do currículo, organizadas em seis áreas.',
    eyebrow:'04 / O LABORATÓRIO',title:'Minha caixa de ferramentas.',html:renderTechnologies()
  },
  education:{
    description:'Pós-graduação na PUCPR e minha formação em software.',
    eyebrow:'05 / A BIBLIOTECA',title:'A próxima etapa já começou.',
    html:`<p class="room-lead">Minha formação acompanha a evolução do que construo: desenvolvimento de sistemas, arquitetura de software, dados e segurança.</p>
      <div class="education-timeline"><article class="education-item is-current"><span class="education-marker">${icon('graduation')}</span><span class="education-status">EM ANDAMENTO</span><span class="content-kicker">PUCPR · OUT 2026 — OUT 2027 (PREVISÃO)</span><h3>Pós-graduação em Arquitetura de Software, Ciência de Dados e Cybersecurity</h3><p>Pós-graduação lato sensu em andamento, com conclusão prevista para outubro de 2027.</p></article>
      <article class="education-item"><span class="education-marker">${icon('book')}</span><span class="content-kicker">UNIBRASIL · CONCLUÍDO EM 2026</span><h3>Tecnologia em Análise e Desenvolvimento de Sistemas</h3><p>Graduação concluída na área de desenvolvimento de sistemas.</p></article>
      <article class="education-item"><span class="education-marker">${icon('code')}</span><span class="content-kicker">UNIBRASIL · MAR 2023 — DEZ 2025</span><h3>Bacharelado em Engenharia de Software</h3><p>Dois anos cursados.</p></article>
      <article class="education-item"><span class="education-marker">${icon('layers')}</span><span class="content-kicker">SENAC · AGO 2023 — ABR 2024</span><h3>Programa de Desenvolvimento de Software</h3><p>Formação complementar durante a trajetória de aprendizagem em TI.</p></article></div><a class="room-link secondary" href="/assets/curriculo-vitor-vargas.pdf" download>Baixar currículo completo ${icon('book')}</a>`
  },
  contact:{
    description:'WhatsApp, e-mail, LinkedIn e GitHub para falar comigo.',
    eyebrow:'06 / A CASA DAS CONEXÕES',title:'Vamos conversar?',
    html:`<p class="room-lead">Uma oportunidade, uma ideia de projeto ou uma conversa sobre tecnologia. Me encontre no canal que fizer mais sentido para você.</p><div class="contact-grid">
      ${contactCard('whatsapp','WhatsApp','(41) 99739-6800','https://wa.me/5541997396800','Conversar com Vitor no WhatsApp')}
      ${contactCard('linkedin','LinkedIn','Minha trajetória e conexões profissionais','https://www.linkedin.com/in/vitorrvargas/','Abrir LinkedIn de Vitor Vargas')}
      ${contactCard('github','GitHub','Projetos, repositórios e código','https://github.com/VitorVargass','Abrir GitHub de Vitor Vargas')}
      ${contactCard('mail','E-mail','vitorrodriguesvargas@gmail.com','mailto:vitorrodriguesvargas@gmail.com','Enviar e-mail para Vitor Vargas')}
      </div><p class="contact-footnote">Curitiba, Paraná · Brasil</p>`
  }
};
