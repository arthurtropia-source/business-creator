# Business Creator powered by SEM IA™

O método do Business Creator como plugin do Claude: a **Montagem do Base Camp**, a entrevista guiada que monta o seu sistema de IA pessoal, com o painel ao lado da conversa e um jeito de responder feito para quem não é técnico.

O plugin leva só o método. Tudo o que é seu (quem você é, as suas frentes, as suas regras, as suas skills) fica na sua pasta, no seu computador, e nunca vem para cá. Cada melhoria do método chega sozinha, como versão nova do plugin, sem mexer no que você escreveu.

## Como instalar
Você recebe do Arthur a sua pasta (`meu-os`), que já sabe onde buscar o plugin e já liga a atualização. É só:
1. Ter o app do Claude no computador (claude.ai/download), numa conta paga.
2. Abrir a pasta na aba **Code** e confirmar que confia nela.
3. Instalar o plugin nesta pasta: clique no **+** ao lado da caixa de texto, **Plugins**, e em **business-creator** escolha instalar **para o projeto (compartilhado)** (liga o plugin só nesta pasta; "para mim" o ligaria em todas).
4. Abrir uma conversa nova na pasta e escrever **oi**.

**Modelo sugerido:** o Opus 5.5, no esforço padrão (médio). Escolha no seletor de modelo, embaixo da caixa de texto do app. É só uma sugestão: você pode mudar quando quiser.

**No trabalho, numa empresa com a base da área no GitHub** (0.3.1): clone o repositório da área dentro da sua pasta antes do passo 4. Se ele tiver o arquivo `contexto/regras-da-empresa.md`, escrito pelo dono da empresa, a montagem liga a sua pasta à base sozinha, e as regras da empresa para os dados passam a vir de lá, sempre atualizadas.

Sem a pasta, no app: clique no **+** ao lado da caixa de texto, **Plugins**, **Add marketplace** com `arthurtropia-source/business-creator`, depois **Add plugin** e escolha `business-creator`. Num terminal: `claude plugin install business-creator --marketplace arthurtropia-source/business-creator`.

## O que vem nele
- `business-creator:montagem-do-base-camp`: a montagem em 2 passos (o começo e o retrato). Com o retrato confirmado, o seu sistema existe.
- `business-creator:caio`: o CAIO. Você começa o dia escrevendo **bom dia** e diz o que precisa fazer; ele faz o que é rápido, abre uma conversa para cada tarefa maior, anota tudo num caderno do dia (`dia/`), guarda no lugar certo o que você ensina e só te chama para decidir. No fim, **fecha o dia**.
- O painel do Base Camp (`/base-camp`): mostra a montagem em 2 passos. Depois do Base Camp montado, fica só a linha "Comece o dia numa conversa nova: escreva bom dia.", o resumo da montagem recolhido e o rodapé. Quem já tem cartão de workflow de uma versão anterior continua com o painel de trabalho de antes.
- `business-creator:atualizar-a-pasta`: para quem montou o Base Camp numa versão anterior (o kit em zip, por exemplo): escreva **atualizar o meu sistema** e a pasta recebe o que a versão nova traz, sem apagar nada seu.
- `business-creator:rotinas-e-computador`: as regras para o trabalho de verdade no computador, depois do Base Camp (rotina gravada, conferência, Windows e Mac).
- O estilo de resposta `base-camp`, que entra sozinho quando o plugin está ligado.
- `business-creator:campo-1`: só para quem já tem cartão de workflow de uma versão anterior.

Por Arthur Tropia. Mudanças em `CHANGELOG.md`.
