# page_MC — MC Treinamentos

Site institucional da MC Treinamentos (Engenharia Comportamental). Conjunto de páginas HTML estáticas hospedadas no Vercel, mais uma API serverless mínima.

## Estrutura

- Páginas públicas: arquivos `.html` soltos na raiz (`index.html`, `mc-site-vendas.html`, `lideranca-sob-pressao-landing.html`, `risco-silencioso.html`, `raio-x-posicionamento.html`, `lista-espera-mentorias.html`, `profitmc.html`, `politica-de-privacidade.html`). Sem framework, sem build step — cada página é autocontida (CSS/JS inline).
- `api/` — funções serverless do Vercel (Node.js). Hoje contém só `visita.js` (contador de visitantes).
- `docs/plano-sprints-area-restrita.md` — roadmap da futura área restrita (Administrador + Consultores).
- `admin-prototipo.html` e `prototipo-contador-visitantes.html` — protótipos visuais/interativos soltos na raiz, **não são páginas do site publicado**, servem só de referência de design/lógica. Não linkar a partir das páginas reais sem que isso seja pedido explicitamente.

## Deploy

- Hospedagem: Vercel, projeto **pagemc**.
- **Importante**: este repositório local tem dois remotes do GitHub — `origin` (MCVENDAS_HK) e `pagemc` (PageMC). O deploy automático do Vercel está conectado ao repositório **PageMC**. Ao enviar mudanças que precisam ir ao ar, `git push` em **ambos os remotes** (`origin` e `pagemc`), não só no upstream padrão.
- `vercel.json` só define `cleanUrls` e `trailingSlash: false` — sem domínio customizado declarado no repo (fica no dashboard do Vercel).

## Contador de visitantes (implementado)

Vercel Function `api/visita.js`, chamada via `fetch('/api/visita', { method: 'POST' })` no `<script>` de `index.html`. Preenche o `<span id="visitor-count">` do rodapé.

Lógica: lê o IP do header `x-forwarded-for`, gera `SHA-256(IP + VISIT_HASH_SALT)`, confere no Redis se a chave `visit:<hash>` existe. Se não existir, incrementa `total_visitas` e grava a chave com TTL de 1 ano (`VISIT_TTL_SECONDS`, default `31536000`) — assim o mesmo IP só é recontado depois de um ano sem visitar. Usa o SDK oficial `@upstash/redis` (`Redis.fromEnv()`).

**Variáveis de ambiente necessárias** (já configuradas no Vercel, produção e preview): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `VISIT_HASH_SALT`. Sem essas variáveis a function retorna erro 500 (ou falha silenciosamente no front-end, que mantém o placeholder `—`).

O rastreamento hoje só está embutido em `index.html`. As demais páginas públicas ainda não chamam `/api/visita` — se quiser contar visitas vindas delas também, replicar o mesmo bloco de script.

## Área restrita (planejada, não implementada)

Ver `docs/plano-sprints-area-restrita.md` para o plano completo. Resumo: Administrador (cadastro de consultores, envio de mensagens, visualização do contador) + futura área de Consultores. Stack decidida: Next.js + Postgres via Supabase + backend em Render.

**Decisão importante:** a área restrita nasce em **repositório e projeto Vercel próprios**, separados do `pagemc` — não é uma migração do site público para Next.js. Motivo: o `pagemc` está em produção com eventos ao vivo e não pode correr risco de instabilidade por causa da área restrita. Os dois só se comunicam por uma única leitura HTTP (`GET /api/visita`, com CORS restrito), implementada por último no roadmap (Sprint 6). Ainda em aberto: estratégia de autenticação (JWT próprio vs. Supabase Auth).
