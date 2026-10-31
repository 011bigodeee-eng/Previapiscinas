# Piscinas de Vinil

Experiência demonstrativa em Next.js App Router, React e TypeScript. Direção de arte aquática com imagens locais geradas por IA, fontes locais, animações GSAP/ScrollTrigger e layouts específicos para celular.

## Executar

Requer Node.js 20.9+ (validado com 24) e npm.

```sh
npm ci
npm run dev
```

Para produção:

```sh
npm run build
npm run start
```

Use o checkout existente em `/workspace/Previapiscinas`; as tarefas de nuvem já são isoladas e não precisam de worktree adicional.

## Configuração real do cliente

Copie `.env.example` para `.env.local` e preencha os dados disponíveis. Variáveis `NEXT_PUBLIC_*` são públicas e incorporadas durante o build; reinicie o desenvolvimento ou refaça o build após alterações.

- `NEXT_PUBLIC_WHATSAPP_NUMBER`: número internacional com DDI e DDD. O contato oficial padrão é `5514998809231` (+55 14 99880-9231); a variável permite alterá-lo. Todos os CTAs e o formulário usam esse contato.
- `NEXT_PUBLIC_INSTAGRAM_URL`: perfil oficial (opcional).
- `NEXT_PUBLIC_ADDRESS`: endereço real a exibir (opcional).
- `NEXT_PUBLIC_SITE_URL`: domínio público canônico, incluindo `https://`, para sitemap e Open Graph.
- `NEXT_PUBLIC_POOL_VIDEO_URL`: MP4 próprio ou licenciado (opcional). A seção expansiva mantém imagem local de fallback sem essa URL.
- Confirmar escopo e disponibilidade dos serviços demonstrativos antes de publicar como oferta real.

Não há backend de envio ou armazenamento de dados pessoais. O formulário valida os campos e monta a mensagem no dispositivo; o usuário confirma o envio no WhatsApp. Sem contato configurado, a mensagem pode ser copiada. Nenhum preço, dimensão, obra executada ou histórico empresarial foi inventado.

## Experiência

- Abertura silenciosa de 3,6 segundos por sessão, sem controles, presente desde o HTML inicial para evitar mostrar o site antes dela. Movimento reduzido pula a abertura. As animações do hero começam após a abertura.
- Hero com parallax e reflexo interativo discreto, sem WebGL ou scroll hijacking.
- Doze conceitos, seis filtros, detalhes com referências complementares e lightbox com navegação.
- Simulador conceitual: formato/estilo selecionam inspirações; revestimentos alteram o tratamento visual; extras entram no resumo e na mensagem. Não é modelo técnico nem renderização exata de todas as combinações.
- Composição diagonal, mídia expansiva, etapas, serviços e FAQ.
- Menu mobile e modais com Escape, contenção/restauração de foco e bloqueio de scroll.
- Imagens WebP com otimização e lazy loading do Next; hero prioritário. Fontes empacotadas localmente.
- Vídeo opcional, silencioso e com poster. Sem vídeo fornecido, o fallback é identificado como imagem.

## Arquivos

- `src/app/page.tsx`: composição da experiência e estados interativos.
- `src/components/visuals.tsx`: marca e imagens reutilizáveis.
- `src/lib/models.ts`: conceitos e categorias.
- `src/lib/content.ts`: conteúdo editorial, serviços e perguntas.
- `src/lib/config.ts`: contatos e montagem do WhatsApp.
- `src/app/globals.css`: direção visual, responsividade e movimento reduzido.
- `public/images`: hero e catálogo ilustrativo gerados por IA; não são portfólio de obras reais. Cada imagem do catálogo é uma cena individual de 1536 × 1024 pixels, servida com qualidade 90 e tamanhos responsivos que consideram os recortes. Os arquivos `-hq.webp` substituem os antigos recortes de baixa resolução e evitam reutilização de cache antigo.

## Validação

```sh
npm run build
npm run typecheck
# Com servidor na porta 3000:
npx playwright test
```

Os testes usam Chromium instalado em `/usr/bin/chromium` neste ambiente; ajuste `executablePath` em `playwright.config.ts` em outra máquina. Cobrem catálogo, filtros, modal/foco, simulador, formulário, galeria, FAQ, menu mobile, overflow, imagens, erros de execução, abertura por sessão e codificação de links do WhatsApp. O caso de menu mobile é pulado no perfil desktop por não se aplicar.

Sitemap vazio até configurar domínio real. Nenhum domínio de produção ou contato fictício é publicado.

## Deploy na Vercel

O arquivo `vercel.json` declara explicitamente o framework Next.js, instalação com `npm ci`, build com `npm run build` e saída `.next`. Isso evita publicar o projeto como site estático sem suas rotas Next.js.

No painel do projeto, o **Root Directory** deve ser a raiz do repositório (`.` ou campo vazio), onde está `package.json`, e a **Production Branch** deve ser `main`. O caminho `/workspace/Previapiscinas` é apenas da máquina de desenvolvimento e não deve ser usado na Vercel. Após mudanças de configuração, faça novo deploy da versão mais recente. Não configure `public` como diretório de saída.
