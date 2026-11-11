# Roteiro da Montagem do Base Camp

> Versão 5.0 (11/11/2026), no plugin Business Creator 0.4.0: **o Base Camp em 2 passos**. O começo e o retrato confirmado numa resposta só. Com o "confirmo", o Base Camp está montado; a primeira tarefa é do CAIO, numa conversa nova. Antes: 4.1 (05/11/2026, plugin 0.3.2) e 4.0 (02/11/2026, plugin 0.2.17), o Base Camp curto em 3 passos; as perguntas da montagem longa são a reserva do uso real: `perguntas-do-uso-real.md`.
> Para a pessoa, as partes são **passos** ("passo 2 de 2"). Os códigos internos: **D** (o começo) e **1** (o retrato). Tempo-alvo total: 8 a 20 minutos, dos quais 5 a 15 são dela no começo.
> **[leve]** = vale também no nível leve. No curto, a diferença entre os níveis é só o mapa das frentes: no leve, até 2 frentes e sem pasta por frente.

---

## Abertura (mandar assim, palavra por palavra)

> **Boas-vindas ao seu Base Camp.** São 2 passos, uns 20 minutos, e você só responde. O caminho está no painel ao lado.
>
> **Pedido 1.** Copie o texto abaixo, cole na IA que você mais usa (ChatGPT, Gemini ou Claude do navegador) e traga a resposta para cá.
>
> ```text
> Estou montando um sistema de trabalho com IA e quero que ele me conheça tão bem quanto você. Conte a minha história como se estivesse me apresentando a um assistente novo que vai trabalhar comigo todos os dias: com contexto, exemplos reais das nossas conversas, detalhes, o porquê das coisas e como elas funcionam na prática. Use tudo o que está na sua memória e nas nossas conversas. Quanto mais detalhe útil, melhor; deixe de fora só o que não ajuda a trabalhar comigo.
>
> Escreva em parágrafos, nestas seções:
> 1. Quem eu sou: a minha trajetória, o que eu faço hoje, o meu papel e o que me move.
> 2. Cada coisa que eu toco (trabalho, negócios, projetos, estudos, casa): o que é, como funciona, quem está envolvido (só o papel, sem nomes), em que pé está, o que anda, o que travou e por quê.
> 3. Como são o meu dia e a minha semana: as rotinas, as tarefas que se repetem, quanto tempo elas tomam e onde eu perco tempo.
> 4. O que eu já te pedi mais de uma vez: os pedidos que se repetem, com exemplos de como eu pedi e do que eu esperava receber.
> 5. Como eu trabalho e decido: os meus critérios, os padrões que eu exijo, o que me irrita numa entrega e o que me agrada, com exemplos.
> 6. Como eu escrevo e como gosto de receber respostas: as regras que eu já te dei, com as minhas palavras.
> 7. As ferramentas e os dados que eu uso: programas, sistemas, planilhas, e onde ficam as informações de cada coisa.
> 8. O que eu quero alcançar: metas, prazos e o que eu disse sobre o futuro.
>
> Depois de cada fato, ponha entre parênteses quando ele apareceu pela última vez (mês e ano, ou "sem data"), e marque "(deduzido)" no que você concluiu sem eu ter dito. Coisas mudam: se algo pode ter ficado para trás, diga. Não invente. Deixe de fora saúde, finanças pessoais, senhas, documentos, números de conta, assuntos íntimos de família e dados de clientes ou da empresa onde eu trabalho (números, nomes de colegas e de clientes).
>
> Entregue tudo num único bloco de código, para eu copiar com um clique, e termine com a linha FIM DO RETRATO. Se não couber numa resposta, pare no fim de uma seção e continue quando eu pedir.
> ```
>
> **Pedido 2.** Enquanto ela escreve, me conte por voz (o microfone na caixa de mensagem do Claude) quem você é, o que você toca e a tarefa que mais se repete.

- **Abertura curta** (decisão do Arthur, 05/11/2026, no teste do Data Room: "muito texto", "mais visual do que textual"; proposta `propostas/2026-11-05-abertura-visual.md`): três linhas e a caixa. A explicação do caminho é o desenho do painel (os 2 passos, os 2 pedidos com o estado, o botão "Copiar o pedido 1"). Não acrescente a metáfora do acampamento, o "dá para parar quando quiser" nem o atalho de voz do sistema: a voz é o microfone do próprio Claude.
- **Sem o painel** (a ferramenta `teste_do_base_camp` não está na sua lista: celular, terminal, pasta sem o plugin), troque "O caminho está no painel ao lado." por "Se o painel não aparecer ao lado, escreva /base-camp." e, no fim, acrescente: "Quando tiver as duas coisas, mande aqui e escreva **terminei**. Se você não usa outra IA, mande só o pedido 2."
- **Nada antes da abertura:** ela é a primeira coisa que a pessoa lê; sem frase sua antes dela ("Estou abrindo...", "Segue o texto...").
- **O texto do pedido 1 vai sempre numa caixa de código** (entre três crases, com `text`), sozinho, como acima: é ela que mostra o botão de copiar no app. Nada dentro da caixa além do texto a copiar. A abertura vai como texto normal, sem as marcas de citação (`>`) que ela tem neste roteiro.
- **Sem escolha na abertura** (decisão do Arthur, 31/10/2026: "o mínimo de decisões possíveis para o usuário e o máximo de orientações objetivas"). Nada de caixa de opções nem de "você prefere". Registre o início do passo D na mesma resposta da abertura.

---

## Passo D: o começo (5 a 15 min, dela) [leve]
**Arquivo:** nenhum (só `montagem/respostas.md`). **Fecha quando:** ela escrever "terminei" ou disser que acabou.

- **A versão do plugin** (teste de 05/11/2026: a montagem começou na 0.3.0 e terminou na 0.3.1): ao abrir o passo D, leia o `version` de `.claude-plugin/plugin.json` do plugin (duas pastas acima desta skill) e grave no `base-camp.md`, logo abaixo da linha **Montagem:**, `- **Plugin:** <versão>`. Ao concluir a montagem, leia de novo; se mudou, a linha vira `- **Plugin:** <versão do início> → <versão do fim>`.
- Enquanto ela manda, **não pergunte nada**: grave em `respostas.md` e responda só "Anotado. Pode seguir; quando acabar, escreva terminei."
- **O que ela fala ou escreve hoje vale mais que a memória da outra IA** (regra do Arthur, 31/10/2026). O que ela contar entra como `[despejo]`. O que vier da outra IA entra como `[memória de outra IA, a confirmar]`, com a marca [eu disse] ou [deduzido] e a data que a outra IA deu. **Em conflito, ganha a fala dela**, sem perguntar: o item da outra IA sai.
- **Detalhe útil fica, ruído sai:** grave em `respostas.md`, no campo certo de `campos.md`, cada detalhe que ajuda a trabalhar com ela (exemplos, critérios, o porquê, como funciona, números de tempo e frequência), com as palavras do texto. Fica de fora o que não serve ao sistema: assunto pontual, traço genérico, o que é sigilo.
- Se ela mandar só um dos dois, siga com o que veio: não peça o outro.
- **Confira se o pedido 1 chegou inteiro** (teste de 05/11/2026: veio cortado na primeira colagem): o texto da outra IA tem as 8 seções e termina com "FIM DO RETRATO"? Se faltar, responda só: "Chegou até a seção <n>. Cole o resto, ou peça à outra IA: continue de onde parou." Grave o que chegou e junte o resto quando vier. Sem a linha FIM, mas com as 8 seções, vale.
- **"não uso outra IA"** (o botão do painel manda essa frase): responda "Sem problema: só o pedido 2. Pode falar." e siga sem o pedido 1. Não volte a pedir.
- **Não procure a pessoa na internet** (LinkedIn, Google) nem use ferramenta que ela não tenha pedido: o que entra é o que ela manda.

**Ao "terminei"** (ou ao "continuar" do botão "Montar o meu retrato", que o painel mostra quando o pedido 2 chega): feche o passo D e abra o passo 1 na mesma resposta.

---

## Passo 1: o retrato, montado de uma vez (3 a 5 min do sistema, 1 resposta dela) [leve]
**Arquivos:** todos os do sistema dela, escritos de uma vez a partir de `respostas.md`, pelos modelos de `modelos/`:
- `contexto/sobre-mim.md` (modelo `sobre-mim.md`): só o que veio; o que não veio fica fora, sem "a completar" na cara dela;
- `contexto/como-trabalhar-comigo.md` (modelo `como-trabalhar-comigo.md`): o formato inferido do que ela escreveu, de como ela escreveu e do que a outra IA registrou;
- o mapa das frentes e as ferramentas (`montagem/mapa-das-frentes.md`, seções do modelo `AGENTS-raiz.md`) e, no completo, `frentes/<nome>/AGENTS.md` de cada frente (modelo `frente-AGENTS.md`), com `CLAUDE.md` de uma linha ao lado; nomes curtos de pasta, sem espaço nem acento; no leve, até 2 frentes, só no mapa;
- `memoria.md` (modelo `memoria.md`) e `montagem/regras.md` com as 7 regras da casa padrão, a regra do formato tirada do que ela disse, e o sigilo que ela citou (a regra 7, dos dados da empresa, só se ela trabalha numa empresa de outra pessoa);
- `contexto/computador.md`: o inventário pela skill `rotinas-e-computador` (seção 5), um comando de cada vez, sem pergunta;
- o `AGENTS.md` da raiz, final, pelo modelo `AGENTS-raiz.md`, **com a seção temporária "Montagem em andamento"** (sai no "confirmo" do passo 1);
- `como-usar.md` (modelo `como-usar.md`) e `resumo-para-o-arthur.md` (modelo `resumo-para-o-arthur.md`), prontos: tudo o que o retrato sabe entra, e os pedidos de "Para começar" (abaixo);
- `montagem/resumo.md`, no formato abaixo, que o painel mostra em cartões.
- **No modo empresa** (o corte de `modo-empresa.md`): a seção "A empresa onde eu trabalho" no `AGENTS.md` da raiz, com a regra 7 apontando para o arquivo de regras; a linha do repositório na ficha da frente de trabalho; as permissões da área e a atualização da base no `.claude/settings.json` (uma edição só, avisada antes com "Agora o app vai pedir o seu ok para ligar a sua pasta à base da <Empresa>. Pode aprovar."); e a conferência da **Máquina** no `contexto/computador.md`, com o que faltar nas Pendências.

O retrato é sobre ela; o cartão "O que se repete" lista as candidatas (as tarefas que ela repete, com a frequência e, quando ela disse, o tempo), sem eleger nenhuma.

**O teste "quem sou eu", sozinho:** com a ferramenta `teste_do_base_camp`, pergunte "quem sou eu e quais são as minhas frentes?" e, no completo, "escreva uma mensagem curta apresentando o meu trabalho em <a frente prioritária>". Passa se acertar o nome, o trabalho principal e as frentes, sem inventar, e se nada de outra frente ou do sigilo aparecer. Marque no `base-camp.md`, em Testes, "passou" ou "não passou: <o motivo>"; se não passou, corrija o arquivo que causou e repita, antes de mostrar o retrato. Sem a ferramenta, marque "não feito" e siga.

**O `resumo.md`**, neste formato exato (os cartões seguem os assuntos dela; até 3 linhas por cartão; em dúvida, `(?)` no começo da linha):
```
# O que o sistema já sabe

## Já sei isto
### Quem você é
- <o primeiro nome dela, vírgula, e a frase completa com os detalhes que importam: o painel tira o nome daqui>
- (?) <ponto da outra IA em dúvida> · da outra IA, de <mês/ano ou sem data>
### O que você toca
### O que se repete
- <cada tarefa que se repete, em uma linha: o que é, quantas vezes por semana ou por mês e, se ela disse, quanto tempo leva>
### Como você trabalha e gosta de receber
### As regras da casa
- <as 7 regras numa linha: "as 7 regras padrão; nada sai do computador sem o seu ok; <o sigilo que ela citou>">
### Aonde quer chegar

## Falta isto
- <até 6 linhas: o que o sistema ainda vai aprender com ela no uso real, em palavras simples; tirado de perguntas-do-uso-real.md>
```
**Os pontos em dúvida levam `(?)`, sem exceção:** todo ponto da outra IA marcado "(deduzido)", com mais de 3 meses ou sem data, e o que pode ter sido mal entendido. Antes de mostrar, conte: se a outra IA mandou pontos assim e o `resumo.md` tem zero `(?)`, você esqueceu de marcar (teste de 05/11/2026: 0 linhas com `(?)` numa memória com pontos sem data). **Nenhum ponto da outra IA some sem ela ver**, a não ser o que a fala dela contradisse.

**Os pedidos para começar.** Escolha até 3 coisas que ela pode pedir hoje e que saem prontas com o que ela já contou:
- tiradas de "O que se repete", do que ela pediu mais de uma vez à outra IA ou de onde ela perde tempo;
- cada uma sai na própria resposta ou num arquivo só, sem depender de nada que esteja em "Falta isto", de um sistema, de outra pessoa ou de um arquivo que não está na pasta;
- nada de modelo com campos em branco; nada que saia do computador;
- de frentes diferentes, se houver mais de uma.
Grave no `base-camp.md`, na seção "Para começar", uma por linha: `- <o pedido, como ela escreveria, em até 10 palavras>: <o que ela recebe, em meia linha>`. Se menos de 3 passarem nos critérios, grave as que passaram, mesmo que nenhuma: nunca complete com sugestão genérica. **Não mostre os pedidos na mensagem do retrato:** eles aparecem no primeiro dia, só se ela pedir.

**Na conversa, uma mensagem só**, depois de tudo gravado:
> "Montei o seu retrato com o que você mandou. Está no painel ao lado, em cartões; os pontos com ? vieram da outra IA e podem ser antigos.
> ---
> **Corrija o que quiser, numa resposta só, escrevendo ou por voz. Se estiver tudo certo, escreva confirmo.**"
- Sem o painel (celular, terminal), mande antes do `---` os cartões em até 10 linhas.
- **Sem caixa de opções e sem pergunta item por item** (decisão do Arthur, 31/10/2026). O que ela não corrigir vale.

**Ao "confirmo" ou às correções:** grave as correções nos arquivos e no `resumo.md` (tire o `(?)` do que ela confirmou; apague o que não vale mais; o que ela corrigiu entra como `[confirmado]`); o que ela não tocou e estava **sem** `(?)` vira `[memória de outra IA, confirmado em <data>]`; **o que tinha `(?)` e ela não tocou continua `(?)` e "a confirmar"**: o "confirmo" em bloco não confirma ponto velho, sem data ou deduzido (decisão do Arthur, 05/11/2026). Esses pontos ficam no `resumo.md` com o `(?)` e saem quando ela falar deles no uso real. Se ela aprovar sem ler ("confirmo" em menos de um minuto, ou dizendo que não leu), anote em "Pedidos sobre o kit": "retrato confirmado sem ler".

Marque o passo 1 "aprovado"; tire do `AGENTS.md` da raiz a seção "Montagem em andamento"; marque **Montagem:** concluída, com **Concluída em:** e **Tempo total:** (sem as pausas). Então, numa mensagem só:
> "**Base Camp montado**, em <n> minutos. O seu sistema já sabe quem você é, o que você toca e como você trabalha.
> Daqui em diante, o seu trabalho passa por uma conversa só, com o CAIO: você diz o que precisa fazer, do seu jeito, e ele faz ou abre uma conversa para cada tarefa, anota tudo e só te chama para decidir.
> Business Creator powered by SEM IA™. Um sistema, qualquer IA.
> ---
> **Abra uma conversa nova nesta pasta e escreva bom dia.**"
A conversa nova é necessária: é nela que o sistema lê o arquivo principal que acabou de ser escrito.
- **O tempo da montagem é sem as pausas** (correção do Arthur, 02/11/2026: a mensagem final dele disse "374 minutos" contando uma pausa de 5 horas). Some os passos pelo relógio da tabela; se num passo a pessoa sumiu por mais de 15 minutos (você vê pela hora das respostas), tire a pausa da conta e diga à parte. Grave no `base-camp.md`: `**Tempo total:** <n> min (com uma pausa de <x> fora da conta)`, e na mensagem: "em <n> minutos (fora uma pausa de <x>)".

---

## O que não está aqui
As perguntas da montagem longa estão em `perguntas-do-uso-real.md`. Na montagem, não as faça. Escolher uma tarefa para o sistema aprender primeiro também não é da montagem: o sistema aprende com todas, no uso.
