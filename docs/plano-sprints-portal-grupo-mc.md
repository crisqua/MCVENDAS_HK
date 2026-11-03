# Plano de Sprints — Nova Home: Portal Grupo MC

**Projeto:** MC Treinamentos — site institucional (`pagemc`)
**Escopo deste documento:** mudar a página principal (`/`) de "home do MC Treinamentos" para o **Portal Grupo MC** (3 cards), movendo o conteúdo atual de MC Treinamentos para `/mc-treinamentos`, e tirando o `consciencia-executiva.html` do status de protótipo.
**Status:** ✅ Sprints A e B concluídas e em produção (03/11/2026).

## Contexto / decisões já tomadas

- Decidido em 22/10/2026: ok mover a home do MC Treinamentos de `/` para `/mc-treinamentos`; links antigos pra `/` passam a cair no portal.
- Protótipo visual do portal: https://claude.ai/artifact/5cubZ4NuqXACXbXfeSCnh7
- 03/11/2026: esclarecido que **Lovable foi só a ferramenta usada para montar a página do Consciência Executiva** — o resultado é o próprio `consciencia-executiva.html` deste repositório, que já está homologado. O card do portal não aponta para um link externo pendente; aponta para essa página já existente.
- Logo do Grupo MC: recebido como PNG em fundo branco (22/10); o protótipo usa um SVG redesenhado a partir dessa geometria.

## Pendente (bloqueia só o card 3)

- Link do site da **DesenvolvaIN** — ainda não recebido. O Sprint B pode ir ao ar com esse card em "em breve" e ser atualizado depois, sem travar o resto.

---

## Sprint A — Consciência Executiva sai do status de protótipo ✅ concluído (03/11/2026)

- Badge fixa "Protótipo" (`.proto`) removida de `consciencia-executiva.html` e `consciencia-executiva-termos.html`.
- `CLAUDE.md` atualizado: essas duas páginas saem da lista de "ainda não fazem parte do site publicado".
- URL pública no ar: `/consciencia-executiva`.
- Decisão em aberto (não bloqueante): contador de visitantes também nessa página, ou só no site principal por enquanto?

## Sprint B — Nova página principal: Portal Grupo MC ✅ concluído (03/11/2026)

- `index.html` renomeado para `mc-treinamentos.html`, servido em `/mc-treinamentos`.
- Novo `index.html` no ar = Portal Grupo MC, com os 3 cards na ordem final (ajustada a pedido do usuário):
  - **Consciência Executiva** → `/consciencia-executiva`
  - **MC Treinamentos** → `/mc-treinamentos`
  - **DesenvolvaIN** → card desativado, "Em breve" (sem link clicável)
- Links internos de "home"/logo atualizados em todas as outras páginas (`dispersao-executiva.html`, `risco-silencioso.html`, `raio-x-posicionamento.html`, `lista-espera-mentorias.html`, `profitmc.html`, `politica-de-privacidade.html`, `lideranca-sob-pressao-landing.html`) — agora apontam para `/mc-treinamentos`.
- Contador de visitantes replicado no `index.html` novo, além de `mc-treinamentos.html`.
- Publicado em produção: commits `bb224b8` (mudança principal) e `de4ff94` (reordenação dos cards), enviados pra `origin` e `pagemc`.

## Pendências que seguem em aberto

- Link do site da **DesenvolvaIN** — card 3 continua em "Em breve" até chegar.
- Se `consciencia-executiva.html` também deve ganhar o contador de visitantes.

## Regra de ouro

Seguir o fluxo plano → revisão → implementação. `pagemc` está em produção — confirmar antes de qualquer `git push`.
