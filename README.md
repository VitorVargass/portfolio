# Vitor Vargas — portfólio e mundo 3D

A entrada principal é um portfólio minimalista, com fundo creme, tipografia preta e o retrato desenhado aprovado pelo usuário. A apresentação ocupa a abertura; ao rolar, aparecem experiência, sobre, formação, projetos, tecnologias e contatos, nessa ordem. O visitante pode escolher explorar o mesmo conteúdo em um pequeno mundo em Three.js, com seis construções originais, personagem controlável e ambientes temáticos.

- `/`: versão simples, responsiva, baseada no protótipo com retrato. Os projetos aparecem em uma lista com detalhes nativos que abrem por clique ou teclado. O conteúdo vem pronto no HTML; JavaScript acrescenta os filtros de tecnologias e salva o idioma. A página não carrega Three.js.
- `/en.html`: versão inglesa completa da página simples, também gerada como HTML estático. O seletor PT / EN fica no topo, mantém a seção atual e salva a preferência no navegador. Ao retornar à entrada principal, a preferência por inglês abre essa versão. Sem JavaScript ou armazenamento, os links continuam levando às duas páginas estáticas.
- `/demo-3d.html`: minigame opcional, com um link no topo para voltar ao portfólio simples.

A abertura apresenta os problemas em que Vitor atua: operações em plataformas SaaS multi-tenant, automação de processos e integração entre serviços. As linguagens e ferramentas permanecem nas seções profissionais e de tecnologias.

O seletor usa bandeiras locais em SVG do Brasil e dos Estados Unidos, com indicação do idioma ativo, rótulos acessíveis e dicas traduzidas. O retrato tem uma animação de entrada de 3,8 segundos e responde ao mouse com deslocamento e inclinação discretos. Letras do título, links, botões e projetos têm reações leves ao passar o mouse. A preferência de reduzir movimentos desliga esses efeitos; o acompanhamento do retrato fica restrito a mouse e ponteiro preciso. Não há biblioteca de animação nem ciclo contínuo de renderização.

## Executar

Requer Node.js. Instale a dependência uma vez com `npm install`.

    npm run dev

Ou execute `node build.mjs` e `node server.mjs`. Abra http://127.0.0.1:4173/. Após editar, refaça o build e atualize a página. A saída estática é dist, com Three.js e sua licença servidos localmente. Não há CDN nem backend.

## Exploração

- A visão inicial acompanha o personagem. O botão superior alterna entre essa câmera e a visão geral da praça.
- Arraste com o botão esquerdo para girar a câmera. Um clique curto em uma casa seleciona o destino.
- WASD/setas movimentam; E entra na casa próxima; Esc sai ou cancela um trajeto.
- No celular, há controle de direção por toque e seleção pelas placas ou pelo menu de destinos.
- O personagem se move a 19 unidades por segundo. Colisões e rotas usam as dimensões das construções e dos jardins.
- Dentro das casas, o cenário tem mais espaço ao lado do conteúdo. Ampliar ambiente permite observar o quarto em tela inteira; Mostrar conteúdo restaura a leitura.
- A qualidade leve reduz a resolução e desliga as sombras. Movimento é interrompido ao perder o foco e a preferência de reduzir movimentos é respeitada.
- Sem WebGL 2 ou JavaScript, a entrada 3D oferece acesso ao portfólio simples e ao currículo.

## Conteúdo

Conteúdo revisado a partir de Vitor_Vargas_Curriculo.pdf, fornecido pelo usuário em 15/10/2026. O arquivo atualizado fica em assets/curriculo-vitor-vargas.pdf e está disponível para download local. O WhatsApp foi solicitado explicitamente pelo usuário. A entrega permanece local; nenhuma publicação foi realizada.

- Projetos: ICone Academy como case principal, identificando a contribuição em equipe, seguida do Eron Car, desenvolvido sob demanda e entregue a um cliente em projeto remunerado.
- Experiência: ICone Academy desde novembro de 2025; BNE de agosto de 2023 a abril de 2024.
- Formação: pós-graduação lato sensu na PUCPR em Arquitetura de Software, Ciência de Dados e Cybersecurity, em andamento, de outubro de 2026 a outubro de 2027 (previsão); ADS concluído na UniBrasil em 2026; dois anos cursados de Engenharia de Software; programa complementar do SENAC.
- Tecnologias: 45 itens da seção de competências do currículo, em seis grupos com filtros; ferramentas e práticas adicionais da trajetória são contextualizadas ao final. A entrada simples usa listas de texto; os ambientes 3D mantêm cores e ícones.
- Contato: WhatsApp, LinkedIn, GitHub e e-mail, com ícones e links diretos.

## Arquivos

index.html é o template da entrada simples. Durante o build, portfolio.mjs preenche seus espaços de conteúdo usando os mesmos dados profissionais do minigame e transforma a navegação entre ambientes em links para as seções da página. Os cases existentes geram a lista de projetos com seus respectivos detalhes. A saída dist/index.html já contém todo o conteúdo para leitura sem JavaScript. Os estilos, o filtro leve e o retrato estão em assets/portfolio/.

assets/portfolio/english.js contém as traduções do texto, metadados e rótulos acessíveis, usadas para gerar dist/en.html. Os testes verificam a cobertura para evitar trechos em português na página inglesa, preservando nomes de tecnologias, empresas e URLs. language-preference.js restaura a preferência antes de carregar os estilos; portfolio.js conecta o seletor e localiza a mensagem dos filtros. O currículo original continua em português e os links ingleses indicam PT-BR. O minigame continua em português.

O retrato aplicado está em assets/portfolio/vitor-retrato-v1.png. Ele é uma cópia íntegra do desenho aprovado em design/retrato-minimalista/vitor-retrato.png; a proposta visual e os prompts de geração continuam na pasta design/retrato-minimalista/. A página usa o retrato como imagem; os textos, links e demais seções são HTML real.

demo-3d.html é a entrada 3D. Os dados visuais das casas estão em assets/demo/content.js; o conteúdo profissional está em profile.js; a lista de tecnologias e o catálogo estão em technologies.js. buildings.js contém as arquiteturas; world.js monta a praça e os interiores; main.js conecta interação, câmera e interface. O layout de leitura dos ambientes está em rooms.css.

As construções têm modelos próprios: oficina, sobrado, observatório, laboratório, biblioteca e casa de comunicação. As geometrias estáticas são agrupadas por material para reduzir chamadas de renderização. A praça mantém fonte, pergolado, canteiros e vegetação nas bordas.

## Validação

`npm test` verifica velocidade em diferentes taxas de atualização, movimento diagonal, limites, colisões, rotas entre todas as construções e distinção entre clique e arraste. Também verifica cobertura da tradução, navegação e conteúdo nas duas línguas, preferência salva, ausência de redirecionamento em ciclo e tolerância ao bloqueio de armazenamento. Quinze testes passaram.

Verificação no navegador do Codex: câmera do personagem e movimento por teclado; entrada nos ambientes; filtros das seis áreas e retorno aos 45 itens; ampliação do quarto e restauração da leitura. A revisão inclui tamanhos de tela simulados, não aparelhos físicos. Desempenho e toque em telefone real ainda precisam de avaliação.

Também conferidos no minigame: pós-graduação e datas, ordem ICone Academy → Eron Car, navegação do case para a experiência, texto Sobre mim, destinos dos quatro contatos e download do PDF (HTTP 200, cópia SHA-256 idêntica ao arquivo fornecido). No viewport de 390 × 844 pixels, o catálogo foi filtrado por integração e restaurado para todos os itens, sem rolagem horizontal na página. Alternância entre as duas câmeras confirmada.

Entrada simples revisada em 1280 × 720, 390 × 844 e 320 × 740 pixels no navegador do Codex: navegação por seções, leitura de projetos, formação e contatos, filtros de tecnologias e ausência de rolagem horizontal na página. O caminho portfólio → minigame → ambiente de projetos → portfólio foi percorrido, sem erros ou avisos da aplicação. A página simples retornou sem canvas 3D.

Verificação HTTP da saída estática: duas entradas e todos os recursos referenciados disponíveis; IDs únicos e âncoras válidas; 45 tecnologias presentes no HTML antes de executar JavaScript; nenhum carregamento de Three.js na entrada simples; PDF servido íntegro. O build e os dez testes existentes passaram após a mudança.

Aplicação do protótipo com retrato: primeira rolagem no computador exibe experiência, antes de sobre, formação e projetos. Conferidos abertura e fechamento dos projetos por teclado e clique, navegação do case para experiência, filtros e links. Retrato servido com o mesmo SHA-256 do arquivo aprovado; currículo íntegro. A validação usa viewports simulados, sem avaliação em telefone físico.

PT / EN conferido no navegador: troca nos dois sentidos, preservação de #projetos, detalhes do Eron Car em inglês, retorno à entrada principal com a preferência inglesa salva, filtro de integrações em inglês e restauração dos 45 itens. Cabeçalho revisado em 1280 × 720, 390 × 844 e 320 × 740 pixels; sem rolagem horizontal na página. A descrição da abertura não lista linguagens nas duas versões.

Bandeiras e movimento: SVGs carregados, indicação do inglês ativo e troca pelos ícones conferidas. Movimento do retrato por mouse e retorno à posição neutra observados; uma letra do título respondeu com elevação e mudança discreta de cor. O título preserva o nome acessível completo em português e inglês. Cabeçalho e abertura de projetos por teclado revisados em telas simuladas de 390 × 844 e 320 × 740, sem rolagem horizontal ou erros da aplicação. As regras de redução de movimento foram revisadas no CSS e JavaScript; a preferência do sistema não foi alterada durante a validação.
