# page_MC — MC Treinamentos

Site institucional da MC Treinamentos (Engenharia Comportamental). Conjunto de páginas HTML estáticas hospedadas no Vercel, mais uma API serverless mínima.

## Estrutura

- `index.html` — **Portal Grupo MC** (nova home, 3 cards: MC Treinamentos, Consciência Executiva, DesenvolvaIN). Ver `docs/plano-sprints-portal-grupo-mc.md`.
- Páginas públicas: `mc-treinamentos.html` (ex-`index.html`, site de MC Treinamentos, servido em `/mc-treinamentos`), `consciencia-executiva.html` (landing de vendas da assinatura semestral com Madalena Carvalho, método CCR, CTA direto pro Checkout Nubank oficial, servida em `/consciencia-executiva`), `consciencia-executiva-termos.html` (Política de Privacidade e Termos de Contratação do Consciência Executiva, texto integral do PDF v1.0 de 22/10/2026, linkada só a partir do rodapé de `consciencia-executiva.html`), `dispersao-executiva.html`, `lideranca-sob-pressao-landing.html`, `risco-silencioso.html`, `raio-x-posicionamento.html`, `lista-espera-mentorias.html`, `profitmc.html`, `politica-de-privacidade.html`. Sem framework, sem build step — cada página é autocontida (CSS/JS inline).
- `api/` — funções serverless do Vercel (Node.js). Hoje contém só `visita.js` (contador de visitantes).
- `docs/plano-sprints-area-restrita.md` — roadmap da futura área restrita (Administrador + Consultores).
- `docs/plano-sprints-portal-grupo-mc.md` — plano da troca de home para o Portal Grupo MC e promoção do Consciência Executiva a página publicada.
- `docs/plano-sprints-leads-divulgacao.md` — plano de divulgação e geração de leads com tráfego pago (diagnóstico de rastreamento/conversão, sprints 1 a 4 e código do Pixel/GA4). Status: planejado.
- `admin-prototipo.html` e `prototipo-contador-visitantes.html` — protótipos visuais/interativos soltos na raiz, **não são páginas do site publicado**, servem só de referência de design/lógica. Não linkar a partir das páginas reais sem que isso seja pedido explicitamente.
- `PageOlhaAI.html` e `olha-ai-briefing.html` — protótipos da Olha.AI (nova marca do Grupo MC). **Ainda não fazem parte do site publicado**: não linkar nem divulgar a partir das páginas reais até que seja pedido.
- `assets/` — imagens. `consciencia-executiva-logo.png` é o logo oficial (original, fundo cinza); `consciencia-executiva-logo-transparente.png` é a versão web recortada, usada na `consciencia-executiva.html`.

## Deploy

- Hospedagem: Vercel, projeto **pagemc**.
- **Importante**: este repositório local tem dois remotes do GitHub — `origin` (MCVENDAS_HK) e `pagemc` (PageMC). O deploy automático do Vercel está conectado ao repositório **PageMC**. Ao enviar mudanças que precisam ir ao ar, `git push` em **ambos os remotes** (`origin` e `pagemc`), não só no upstream padrão.
- `vercel.json` define `cleanUrls`, `trailingSlash: false` e um `redirects` (301 de `/mc-site-vendas` para `/dispersao-executiva`, mantido após o rename do arquivo) — sem domínio customizado declarado no repo (fica no dashboard do Vercel).

## Contador de visitantes (implementado)

Vercel Function `api/visita.js`, chamada via `fetch('/api/visita', { method: 'POST' })` no `<script>` de `index.html` (Portal Grupo MC) e de `mc-treinamentos.html`. Preenche o `<span id="visitor-count">` do rodapé em cada página.

Lógica: lê o IP do header `x-forwarded-for`, gera `SHA-256(IP + VISIT_HASH_SALT)`, confere no Redis se a chave `visit:<hash>` existe. Se não existir, incrementa `total_visitas` e grava a chave com TTL de 1 ano (`VISIT_TTL_SECONDS`, default `31536000`) — assim o mesmo IP só é recontado depois de um ano sem visitar. Usa o SDK oficial `@upstash/redis` (`Redis.fromEnv()`).

**Variáveis de ambiente necessárias** (já configuradas no Vercel, produção e preview): `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `VISIT_HASH_SALT`. Sem essas variáveis a function retorna erro 500 (ou falha silenciosamente no front-end, que mantém o placeholder `—`).

O rastreamento está embutido em `index.html` e `mc-treinamentos.html`. As demais páginas públicas (incluindo `consciencia-executiva.html`) ainda não chamam `/api/visita` — se quiser contar visitas vindas delas também, replicar o mesmo bloco de script.

## Área restrita (planejada, não implementada)

Ver `docs/plano-sprints-area-restrita.md` para o plano completo. Resumo: Administrador (cadastro de consultores, envio de mensagens, visualização do contador) + futura área de Consultores. Stack decidida: Next.js + Postgres via Supabase + backend em Render.

**Decisão importante:** a área restrita nasce em **repositório e projeto Vercel próprios**, separados do `pagemc` — não é uma migração do site público para Next.js. Motivo: o `pagemc` está em produção com eventos ao vivo e não pode correr risco de instabilidade por causa da área restrita. Os dois só se comunicam por uma única leitura HTTP (`GET /api/visita`, com CORS restrito), implementada por último no roadmap (Sprint 6). Ainda em aberto: estratégia de autenticação (JWT próprio vs. Supabase Auth).
