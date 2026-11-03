# Plano de Sprints — Divulgação e Geração de Leads (tráfego pago)

**Projeto:** MC Treinamentos — site institucional (`pagemc`)
**Escopo deste documento:** preparar o site para receber tráfego pago e medir leads. Hoje o site funciona como vitrine; este plano o transforma em captura mensurável de leads, começando pela página do Consciência Executiva.
**Status:** 📋 planejado (auditoria feita em 03/11/2026). Nenhuma sprint abaixo foi implementada ainda, exceto o que está em "Já feito".

## Contexto

- Objetivo: divulgar os serviços com tráfego pago (Meta, Google pesquisa, LinkedIn). Campanhas anteriores feitas com ferramentas de IA não deram retorno.
- Princípio: tráfego pago amplifica o que já existe. Precisa de oferta clara, nicho específico, página de conversão com uma única ação, resposta rápida ao lead e rastreamento com tempo de teste (3 a 7 dias por ciclo).
- Página candidata a receber os anúncios: `consciencia-executiva.html` (CTA único no WhatsApp com mensagem pronta, FAQ, oferta de R$ 882,00 em 6 meses). **Não mandar tráfego pago para `index.html`** (portal) nem para `mc-treinamentos.html` (home antiga, 1,8 MB).

## Já feito (03/11/2026)

- FAQ "Como funciona o agendamento?" da `consciencia-executiva.html` atualizada para o novo fluxo: conversa no WhatsApp, link de pagamento enviado diretamente, depois horário combinado (commit `3a5abcf`).
- Removido do card de oferta o item "Instruções de agendamento enviadas após a confirmação do pagamento", que contradizia o novo fluxo (commit `1e07e1b`).

## Diagnóstico (estado em 03/11/2026)

| Página | Rastreamento | SEO/OG | Conversão |
|---|---|---|---|
| `index.html` (Portal Grupo MC) | Só contador | Sem description/OG | Não captura lead, só direciona |
| `mc-treinamentos.html` | Só contador | Sem description/OG | WhatsApp genérico, 1,8 MB |
| `consciencia-executiva.html` | Nenhum | Sem description/OG | 2 CTAs de WhatsApp com mensagem pronta |
| `lideranca-sob-pressao-landing.html` | Nenhum | Sem description/OG | Formulário (evento encerrado) |
| `lista-espera-mentorias.html` | Nenhum | Sem description/OG | Formulário oculto ("pausada") |
| `risco-silencioso`, `dispersao-executiva`, `raio-x-posicionamento`, `profitmc` | Nenhum | Sem description/OG | WhatsApp, sem captura |

Também não existem `robots.txt` nem `sitemap.xml`.

### Problemas, impacto e ação

**P1. Sem rastreamento (crítico).** Nenhuma página tem Pixel da Meta, GA4, Clarity ou Google Tag. Sem isso não se sabe quantos cliques viraram conversa nem se otimiza campanha. Provável causa do retorno nulo das campanhas anteriores. *Ação:* Pixel + GA4 + eventos de WhatsApp e formulário em todas as páginas.

**P2. Becos sem saída na home antiga (`mc-treinamentos.html`).** A barra do topo anuncia o evento de 26/09 com "Inscrições encerradas", e o botão "Entrar na Lista de Espera" leva a uma página "Lista de Espera pausada". *Ação:* trocar a barra pela oferta atual (Consciência Executiva) e o botão por CTA de WhatsApp (ou reativar o formulário).

**P3. A página de venda não mede nada.** `consciencia-executiva.html` não tem rastreamento, contador, meta tags nem prova social. *Ação:* instalar rastreamento e contador, adicionar SEO e depoimentos.

**P4. WhatsApp sem atribuição.** Todas as conversas chegam iguais; não dá para separar anúncio, Instagram e orgânico. *Ação:* etiqueta de origem na mensagem pronta (`[site-ce]`, `[ads-meta]`).

**P5. Peso da home antiga (1,8 MB).** São 7 PNGs em base64 sem `loading="lazy"`. *Ação:* converter para WebP em `assets/` e usar lazy loading. Só se a `mc-treinamentos` receber tráfego pago.

**P6. Leads só por e-mail (EmailJS).** Sem banco nem planilha, o lead se perde se o e-mail falhar ou cair no spam. *Ação:* gravar no Supabase além do e-mail, mantendo o e-mail como aviso.

**P7. Sem SEO e sem preview.** Faltam description, OG, canonical, `robots.txt` e `sitemap.xml`; o link colado no WhatsApp ou Instagram sai sem imagem e título. *Ação:* adicionar as tags e os dois arquivos.

**P8. CPF no formulário de inscrição** (`lideranca-sob-pressao-landing.html`). Aumenta atrito e risco LGPD. *Ação:* pedir CPF só no checkout, na próxima edição.

**P9. LGPD do rastreamento.** Pixel e GA4 coletam dados de navegação e não há aviso de cookies. *Ação:* banner de consentimento simples, com Pixel e GA4 carregando só após o aceite, e atualização da política de privacidade.

**P10. Atendimento (fora do site, decide o resultado).** Lead de anúncio esfria em minutos, e o novo fluxo (conversa antes do pagamento) faz a velocidade de resposta virar o gargalo da venda. *Ação:* WhatsApp Business com saudação, respostas rápidas e etiquetas (novo, em conversa, link enviado, pago). Meta: responder em até 5 minutos em horário comercial.

## Sprint 1 — Rastreamento e correções rápidas (maior impacto)

Depende de: ID do Pixel da Meta e ID do GA4.

- Pixel da Meta + GA4 em todas as páginas públicas.
- Evento `Lead` em todo clique de WhatsApp e no sucesso dos formulários.
- Etiqueta de origem na mensagem pronta do WhatsApp.
- Barra do topo e botão da lista de espera da `mc-treinamentos.html` corrigidos (P2).
- SEO básico da `consciencia-executiva.html` (P7).
- Contador de visitantes na `consciencia-executiva.html` (fecha a decisão em aberto do plano do portal).

Itens que não dependem dos IDs (barra, botão, etiqueta, SEO, contador) podem ir antes; Pixel e GA4 ficam prontos com os IDs a preencher.

## Sprint 2 — Landing de campanha

Depende de: depoimentos/cases.

- Usar `consciencia-executiva.html` como base: promessa única, prova social, FAQ, CTA único.
- Banner de consentimento LGPD (P9) e atualização da política de privacidade.
- Imagens da `mc-treinamentos.html` em WebP com lazy loading (P5), se for receber tráfego.

## Sprint 3 — Dados e SEO

Depende de: tabela `leads` no Supabase.

- Gravar leads dos formulários no Supabase, mantendo o e-mail como aviso (P6).
- `sitemap.xml` e `robots.txt` (P7).
- Tirar o CPF do formulário de inscrição na próxima edição (P8).

## Sprint 4 — Campanhas

Depende de: Sprints 1 e 2 prontos.

- Meta (geração de demanda, vídeo curto e depoimento) e Google pesquisa (quem já procura), com remarketing.
- Teste de 3 a 7 dias por ciclo antes de mexer; 3 a 5 variações de criativo.
- Orçamento inicial de teste: R$ 30 a R$ 100 por dia por campanha.
- Acompanhar CPL, CAC, CTR, taxa de conversão da página, ROAS e LTV.

## Código do Sprint 1

**Pixel + GA4** (no `<head>` de todas as páginas, trocando os IDs):

```html
<script>
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','SEU_PIXEL_ID');
fbq('track','PageView');
</script>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}
gtag('js',new Date());gtag('config','G-XXXXXXXXXX');
</script>
```

**Evento de lead em todo clique de WhatsApp** (antes do `</body>`). Um clique não garante que a conversa começou; o número real de conversas se confere no WhatsApp Business.

```html
<script>
document.addEventListener('click', function (e) {
  var a = e.target.closest('a[href*="wa.me"], a[href*="api.whatsapp.com"]');
  if (!a) return;
  var pagina = location.pathname;
  if (window.fbq) fbq('track', 'Lead', { content_name: pagina });
  if (window.gtag) gtag('event', 'generate_lead', { method: 'whatsapp', page_path: pagina });
});
</script>
```

**Evento de formulário** (no sucesso do envio, em `lista-espera-mentorias.html` e `lideranca-sob-pressao-landing.html`):

```js
if (window.fbq) fbq('track', 'Lead', { content_name: 'formulario' });
if (window.gtag) gtag('event', 'generate_lead', { method: 'formulario' });
```

**Etiqueta de origem no WhatsApp** (na `consciencia-executiva.html`; para anúncio, usar `%5Bads-meta%5D` no lugar de `%5Bsite-ce%5D`):

```
https://wa.me/5511994176450?text=Vim%20pela%20p%C3%A1gina%20da%20Consci%C3%AAncia%20Executiva%20e%20quero%20entender%20se%20faz%20sentido%20pra%20mim%20%5Bsite-ce%5D
```

**SEO da `consciencia-executiva.html`** (no `<head>`; trocar `SEU-DOMINIO` pelo domínio final):

```html
<meta name="description" content="Acompanhamento individual de 6 meses com Madalena Carvalho pelo Método CCR. 6 encontros de 60 minutos, atendimento personalizado.">
<link rel="canonical" href="https://SEU-DOMINIO/consciencia-executiva">
<meta property="og:type" content="website">
<meta property="og:title" content="Consciência Executiva | Madalena Carvalho">
<meta property="og:description" content="Acompanhamento individual de 6 meses pelo Método CCR.">
<meta property="og:image" content="https://SEU-DOMINIO/assets/consciencia-executiva-logo-transparente.png">
<meta property="og:url" content="https://SEU-DOMINIO/consciencia-executiva">
```

**Contador de visitas na `consciencia-executiva.html`:**

```js
fetch('/api/visita', { method: 'POST' }).catch(function () {});
```

## Quanto pode custar um lead (exemplo ilustrativo)

Com o ticket de R$ 882,00 do Consciência Executiva: se 1 a cada 10 conversas virar venda, o empate é um custo de até R$ 88 por conversa; se 1 a cada 5, até cerca de R$ 176. São contas de referência, não promessa. Depois dos primeiros 7 dias de dados, trocar as taxas pelas reais.

## Pendências / insumos necessários

1. ID do Pixel da Meta e ID do GA4 (se não existirem, criar).
2. Domínio final, para canonical e OG.
3. Decidir se o botão da lista de espera vira WhatsApp ou se o formulário volta a ficar ativo.
4. Depoimentos ou cases para a prova social (Sprint 2).
5. Imagem OG definitiva da `consciencia-executiva.html` (hoje sugerido o logo transparente).

## Regra de ouro

Seguir o fluxo plano → revisão → implementação. `pagemc` está em produção — confirmar antes de qualquer `git push` de código do site. **Só investir em anúncio depois do Sprint 1.**
