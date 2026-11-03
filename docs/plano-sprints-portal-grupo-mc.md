# Plano de Sprints — Nova Home: Portal Grupo MC

**Projeto:** MC Treinamentos — site institucional (`pagemc`)
**Escopo deste documento:** mudar a página principal (`/`) de "home do MC Treinamentos" para o **Portal Grupo MC** (3 cards), movendo o conteúdo atual de MC Treinamentos para `/mc-treinamentos`, e tirando o `consciencia-executiva.html` do status de protótipo.
**Status:** plano em revisão (03/11/2026) — nada foi alterado no código ainda.

## Contexto / decisões já tomadas

- Decidido em 22/10/2026: ok mover a home do MC Treinamentos de `/` para `/mc-treinamentos`; links antigos pra `/` passam a cair no portal.
- Protótipo visual do portal: https://claude.ai/artifact/5cubZ4NuqXACXbXfeSCnh7
- 03/11/2026: esclarecido que **Lovable foi só a ferramenta usada para montar a página do Consciência Executiva** — o resultado é o próprio `consciencia-executiva.html` deste repositório, que já está homologado. O card do portal não aponta para um link externo pendente; aponta para essa página já existente.
- Logo do Grupo MC: recebido como PNG em fundo branco (22/10); o protótipo usa um SVG redesenhado a partir dessa geometria.

## Pendente (bloqueia só o card 3)

- Link do site da **DesenvolvaIN** — ainda não recebido. O Sprint B pode ir ao ar com esse card em "em breve" e ser atualizado depois, sem travar o resto.

---

## Sprint A — Consciência Executiva sai do status de protótipo

- Remover a badge fixa "Protótipo" (`.proto`) de `consciencia-executiva.html` e `consciencia-executiva-termos.html`.
- Atualizar `CLAUDE.md`: essas duas páginas deixam de estar na lista de "ainda não fazem parte do site publicado".
- URL pública: `/consciencia-executiva` (já funciona via `cleanUrls` do `vercel.json`, sem precisar de redirect novo).
- Decisão a confirmar com o usuário: contador de visitantes também nessa página, ou só no site principal por enquanto?

## Sprint B — Nova página principal: Portal Grupo MC

- Renomear o `index.html` atual → `mc-treinamentos.html` (mesmo conteúdo, só muda de rota para `/mc-treinamentos`).
- Criar o novo `index.html` = Portal Grupo MC (promover o protótipo do artifact para arquivo real), com os 3 cards:
  - **MC Treinamentos** → `/mc-treinamentos`
  - **Consciência Executiva** → `/consciencia-executiva` (real, sem "link a definir")
  - **DesenvolvaIN** → "em breve" até o link chegar
- Atualizar os links internos de "home"/logo em todas as outras páginas do site (`dispersao-executiva.html`, `risco-silencioso.html`, `raio-x-posicionamento.html`, `lista-espera-mentorias.html`, `profitmc.html`, `politica-de-privacidade.html`, `lideranca-sob-pressao-landing.html`) — hoje apontam para `/`, precisam passar a apontar para `/mc-treinamentos`.
- Replicar o script do contador de visitantes em `mc-treinamentos.html` (hoje embutido só no `index.html` original) e decidir se o portal novo também conta visita.

## Regra de ouro

Seguir o fluxo plano → revisão → implementação: nada deste plano é implementado até confirmação explícita, sprint por sprint. `pagemc` está em produção — confirmar antes de qualquer `git push`.
