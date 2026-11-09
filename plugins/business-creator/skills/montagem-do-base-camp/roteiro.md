# Roteiro da Montagem do Base Camp

> Versão 4.1 (05/11/2026), no plugin Business Creator 0.3.2: a abertura curta (o caminho desenhado no painel), o pedido 1 conferido inteiro, o `(?)` que o "confirmo" em bloco não apaga, o que já roda primeiro no passo 2 e sem a pergunta do "antes". Versão 4.0 (02/11/2026), no plugin 0.2.17: **o Base Camp curto, com um workflow, uma escolha e uma frase** (decisão do Arthur, 02/11/2026, depois do teste dele: a primeira tarefa e o primeiro workflow eram dois objetos, com três frases para um caminho só, e a pessoa se confundia). Em 3 passos: o começo, o retrato confirmado numa resposta só, e **o primeiro workflow, que ela escolhe entre 3 e o sistema roda na hora**. As perguntas da montagem longa são a reserva do uso real: `perguntas-do-uso-real.md`.
> Para a pessoa, as partes são **passos** ("passo 2 de 3"). Os códigos internos: **D** (o começo), **1** (o retrato), **2** (o primeiro workflow). Tempo-alvo total: 20 a 35 minutos, dos quais 5 a 15 são dela no começo.
> **[leve]** = vale também no nível leve. No curto, a diferença entre os níveis é só o mapa das frentes: no leve, até 2 frentes e sem pasta por frente.
> **A frase do workflow é uma só: o pedido** (as 2 a 5 palavras que ela vai escrever toda vez, com as palavras dela: "fechar o dia"). Ele aparece no botão do painel, no cartão, no combinado e no guia de bolso. Nunca invente uma segunda frase para o mesmo caminho.

---

## Abertura (mandar assim, palavra por palavra)

> **Boas-vindas ao seu Base Camp.** São 3 passos, uns 30 minutos, e você só responde. O caminho está no painel ao lado.
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

- **Abertura curta** (decisão do Arthur, 05/11/2026, no teste do Data Room: "muito texto", "mais visual do que textual"; proposta `propostas/2026-11-05-abertura-visual.md`): três linhas e a caixa. A explicação do caminho é o desenho do painel (os 3 passos, os 2 pedidos com o estado, o botão "Copiar o pedido 1"). Não acrescente a metáfora do acampamento, o "dá para parar quando quiser" nem o atalho de voz do sistema: a voz é o microfone do próprio Claude.
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
- o mapa das frentes e as ferramentas (`montagem/mapa-das-frentes.md`, seções do modelo `AGENTS-raiz.md`) e, no completo, `frentes/<nome>/AGENTS.md` de cada frente (modelo `frente-AGENTS.md`), com `CLAUDE.md` de uma linha ao lado; nomes curtos de pasta, sem espaço nem acento; no leve, até 2 frentes, só no mapa. A tabela "Workflows" de cada ficha nasce vazia ("o primeiro se escolhe no fim do Base Camp"): o cartão do workflow só existe depois que ela escolher, no passo 2;
- `memoria.md` (modelo `memoria.md`) e `montagem/regras.md` com as 7 regras da casa padrão, a regra do formato tirada do que ela disse, e o sigilo que ela citou (a regra 7, dos dados da empresa, só se ela trabalha numa empresa de outra pessoa);
- `contexto/computador.md`: o inventário pela skill `rotinas-e-computador` (seção 5), um comando de cada vez, sem pergunta;
- o `AGENTS.md` da raiz, final, pelo modelo `AGENTS-raiz.md`, **com a seção temporária "Montagem em andamento"** (sai no fim do passo 2). Na seção "Como este sistema cresce", a linha do primeiro workflow fica "O primeiro se escolhe no fim do Base Camp" até o passo 2;
- `como-usar.md` (modelo `como-usar.md`) e `resumo-para-o-arthur.md` (modelo `resumo-para-o-arthur.md`), **já aqui, como rascunho**: tudo o que o retrato sabe entra; as seções do workflow e do combinado ficam "se decide no passo 3". No fim do passo 2, só essas seções mudam: segundos, não minutos;
- `montagem/resumo.md`, no formato abaixo, que o painel mostra em cartões.
- **No modo empresa** (o corte de `modo-empresa.md`): a seção "A empresa onde eu trabalho" no `AGENTS.md` da raiz, com a regra 7 apontando para o arquivo de regras; a linha do repositório na ficha da frente de trabalho; as permissões da área e a atualização da base no `.claude/settings.json` (uma edição só, avisada antes com "Agora o app vai pedir o seu ok para ligar a sua pasta à base da <Empresa>. Pode aprovar."); e a conferência da **Máquina** no `contexto/computador.md`, com o que faltar nas Pendências.

**Nada de escolher o workflow aqui.** O retrato é sobre ela; o cartão "O que se repete" lista as candidatas (as tarefas que ela repete, com a frequência e, quando ela disse, o tempo), sem eleger nenhuma. A escolha é dela, no passo 2, entre 3 botões.

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

**Na conversa, uma mensagem só**, depois de tudo gravado:
> "Montei o seu retrato com o que você mandou. Está no painel ao lado, em cartões; os pontos com ? vieram da outra IA e podem ser antigos.
> ---
> **Corrija o que quiser, numa resposta só, escrevendo ou por voz. Se estiver tudo certo, escreva confirmo.**"
- Sem o painel (celular, terminal), mande antes do `---` os cartões em até 10 linhas.
- **Sem caixa de opções e sem pergunta item por item** (decisão do Arthur, 31/10/2026). O que ela não corrigir vale.

**Ao "confirmo" ou às correções:** grave as correções nos arquivos e no `resumo.md` (tire o `(?)` do que ela confirmou; apague o que não vale mais; o que ela corrigiu entra como `[confirmado]`); o que ela não tocou e estava **sem** `(?)` vira `[memória de outra IA, confirmado em <data>]`; **o que tinha `(?)` e ela não tocou continua `(?)` e "a confirmar"**: o "confirmo" em bloco não confirma ponto velho, sem data ou deduzido (decisão do Arthur, 05/11/2026). Esses pontos ficam no `resumo.md` com o `(?)` e saem quando ela falar deles no uso real. Marque o passo 1 "aprovado" e abra o passo 2 na mesma resposta. Se ela aprovar sem ler ("confirmo" em menos de um minuto, ou dizendo que não leu), anote em "Pedidos sobre o kit": "retrato confirmado sem ler".

---

## Passo 2: o primeiro workflow, escolhido por ela e rodado na hora (5 a 10 min) [leve]
**Arquivos:** o cartão do workflow em `frentes/<frente>/workflows/<nome-curto>.md` (no leve, `workflows/`), o resultado da rodada 1 onde ele mora (a entrega dela: um arquivo em `frentes/<frente>/modelos/` ou na frente, ou o texto na conversa), `como-usar.md` e `resumo-para-o-arthur.md` completados, `base-camp.md` concluído.

2.1 [leve] **As 3 opções de workflow, todas de uma vez, com uma recomendada** (regra do Arthur, 02/11/2026: opções vêm todas de uma vez, a recomendada primeiro). Escolha **3 tarefas que se repetem**, tiradas do que ela contou (`PROC.candidatas`, o que ela pediu mais de uma vez à outra IA, onde perde tempo), pelos critérios: gera ou poupa dinheiro, ou devolve tempo; repete pelo menos uma vez por semana ou por mês; **a rodada 1 roda agora, com o que ela tem**: o que está na cabeça dela (o dia de hoje), uma mensagem que ela cola, um arquivo que ela manda, ou o que já está na pasta; o resultado dá para conferir; não depende de outra pessoa aprovar; não usa dados da empresa sem autorização (no modo empresa, a autorização é a do arquivo de regras, e uma tarefa que o repositório da área já roda conta como ao alcance: `modo-empresa.md`). **Critério que não se negocia: a rodada 1 tem de entregar algo de verdade.** Nada de modelo com campos em branco, nada que precise de dado que não está aqui nem com ela (planilha de outra pessoa, sistema, BI), nada que mande algo para fora do computador. Tarefa que depende de sistema ou de dado de terceiro não entra nas 3: fica anotada como "o próximo", dito assim, na tabela "Workflows" da ficha da frente. A recomendada é a que mais mostra o sistema trabalhando do jeito dela, com o menor risco de errar.
- **Primeiro, o que já roda** (decisão do Arthur, 05/11/2026: no teste, o passo 2 propôs do zero uma tarefa que ele já fazia toda semana pelo Gmail): antes de escolher as 3, procure a tarefa que ela já faz e que deixa rastro. (1) A pasta e a mochila, se houver. (2) As ferramentas conectadas que estão na sua lista: num e-mail conectado, **só os enviados dos últimos 30 dias**, lidos pelo assunto, pelo destinatário (só o papel, nunca o endereço no que você grava) e pela frequência, **sem abrir o conteúdo**; num calendário, os compromissos que se repetem. Uma tarefa que se repete ali (o mesmo tipo de e-mail toda semana, o relatório todo mês) e passa nos critérios abaixo entra como a recomendada, com a evidência em uma linha ("você mandou <n> e-mails de <assunto> este mês"). Na mensagem das 3 opções, diga em uma linha o que foi lido ("Olhei os seus e-mails enviados do último mês, só os assuntos."). Sem ferramenta conectada, siga como abaixo. Nada de ler caixa de entrada, abrir anexo ou procurar a pessoa na internet.
- **Confira cada opção contra o retrato antes de gravar** (teste de 02/11: a recomendada dependia de uma fonte que o próprio retrato marcava como lacuna, e a primeira tarefa saiu como modelo vazio): de onde vem cada informação que a rodada 1 usa? Se alguma está em "Falta isto", em "O que pode travar" ou fora da pasta e longe dela, a opção sai das 3 e vai para "o próximo". Uma opção que só entregaria um modelo para preencher não é opção.
- **Cada opção é um pedido e uma entrega.** O **pedido** são as 2 a 5 palavras que ela vai escrever toda vez, com as palavras dela, em minúsculas ("fechar o dia", "monitor de preço de ontem"); a **entrega** é o que ela recebe no fim da rodada 1, em uma linha ("o quadro dos seus projetos atualizado com o que andou hoje e a lista de amanhã").
- **Antes de falar, grave as 3 no `base-camp.md`**, na seção "O primeiro workflow" (numa pasta antiga, a seção se chama "Primeiras tarefas": use essa), uma por linha, começando com "- ", a recomendada primeiro, no formato `- <pedido>: <a entrega, em uma linha>`. O painel mostra cada uma como um botão com o pedido, a primeira em destaque, e a entrega embaixo.
- Na conversa:
> "Para o seu primeiro workflow, três opções do que você me contou, com o que você recebe logo na primeira vez. A que eu recomendo é a primeira: <por quê, em uma linha>.
> ---
> **Clique no painel no workflow que você quer, ou escreva o nome dele.**"
- Sem o painel (celular, terminal), liste as 3 numeradas antes do `---` (o pedido em negrito e a entrega ao lado) e peça o número.

2.2 [leve] **Ao clique ("primeiro workflow: <pedido>") ou ao nome, antes de qualquer resposta, grave a escolha em todos os lugares** (a última escolha dela manda; se ela pedir um workflow fora da lista, é esse):
- o cartão do workflow, pelo modelo `workflow.md`, **com as linhas Pedido e Combinado preenchidas**: o começo, a entrega e os passos como ela contou (quem faz: ela, como é hoje); o "antes" só se ela disse o tempo (marcado "pela fala dela" ou "pela outra IA"); se não disse, "não medido" (decisão do Arthur, 05/11/2026: não perguntar quanto tempo as tarefas levam); o que não veio fica "a completar nas rodadas";
- a linha `- **Primeiro workflow:** \`<caminho do cartão>\`` no `base-camp.md`, logo abaixo da linha **Montagem:** (é assim que o painel e o Campo 1 o encontram), e, na seção "O primeiro workflow", a linha **Escolhido:** (sem traço): `**Escolhido:** <pedido> · em <data hora>`;
- a tabela "Workflows" da ficha da frente (no leve, do `AGENTS.md`): o escolhido como o primeiro, "incompleto: rodada 1 em andamento"; as outras duas opções como os próximos (também em "Os próximos" do cartão, com "O que faz": a entrega da opção, em uma frase);
- no `AGENTS.md` da raiz, a linha do primeiro workflow com o caminho do cartão.

**Em seguida, na mesma resposta, a rodada 1.** O sistema roda o workflow pelo cartão, passo a passo, com o que já está na pasta e na conversa:
- se o primeiro passo precisar de uma coisa que só ela tem (o que andou hoje, a mensagem do cliente, o arquivo), peça **uma coisa só**, em uma linha, com as palavras dela ("Me conte o seu dia: o que andou e o que travou em cada projeto. Solto, por voz se quiser."), e espere. Uma pergunta, não um questionário: nada de "quem coletou, em que formato, onde guardou";
- senão, faça direto, sem perguntar;
- nos passos que são dela (uma decisão de julgamento, a aprovação de outra pessoa, um contato), diga em uma linha o que ela faz agora e siga com o resto;
- siga as regras dela (o formato, o sigilo, o rascunho em vez do envio; se mexer em arquivo, a skill `rotinas-e-computador`); nada sai do computador;
- **conte os pedidos dela**: cada mensagem dela que pediu, respondeu, corrigiu ou destravou algo nesta rodada (o clique conta como o primeiro).

**A entrega e o "Base Camp montado", numa mensagem só.** Antes de falar: grave a linha da rodada 1 em "As rodadas" do cartão (a data, o tempo do clique à entrega, os pedidos dela, "Entrega aprovada?" = "a conferir") e atualize a coluna "Quem faz" com o que aconteceu de fato; grave no `base-camp.md`, na seção "O primeiro workflow", as linhas **Rodada 1:** (sem traço: `**Rodada 1:** <a entrega, em uma linha> · em <data hora>; <n> pedidos até a entrega`) e **Combinado:** (sem traço: `**Combinado:** quando <o gatilho, com as palavras dela>, abra esta pasta e escreva **<pedido>**`); complete em `como-usar.md` as seções do workflow e do combinado e, em "Pedidos que já funcionam", o pedido; complete no `resumo-para-o-arthur.md` as seções do workflow e da rodada 1; tire do `AGENTS.md` da raiz a seção "Montagem em andamento"; marque o passo 2 "aprovado" e a montagem concluída no `base-camp.md`, com o tempo total. Então:
> "<Feito: a entrega, inteira se couber em 15 linhas; senão, o começo e onde ficou>
> **Base Camp montado**, em <n> minutos. O seu sistema já sabe quem você é, o que você toca e como você trabalha, e o seu primeiro workflow, **<pedido>**, acabou de rodar pela primeira vez.
> A partir de amanhã, comece o dia numa conversa nova escrevendo **bom dia**: me diga o que você precisa fazer, do seu jeito, e eu faço ou abro uma conversa para cada tarefa, anoto tudo e só te chamo para decidir. Quando <o gatilho, com as palavras dela>, o **<pedido>** entra por lá também; cada vez que rodar, corrija o que não ficou do seu jeito: o sistema aprende, e quando sair pronto com um pedido só, o workflow está completo.
> Business Creator powered by SEM IA™. Um sistema, qualquer IA.
> ---
> **Confira a entrega: se ficou do seu jeito, escreva aprovado; se não, diga o que mudar.**"
- **Sem "ficou bom" antes do "montado"**: a entrega e o Base Camp pronto vêm juntos. O que ela corrigir depois entra como lição no cartão ("O que o sistema aprendeu") e, se valer para tudo, no `memoria.md`; o resultado é refeito e mostrado de novo. Ao "aprovado" (ou "pode", "ok", "ficou bom"), marque "sim" em "Entrega aprovada?" da rodada 1. **Não pergunte quanto tempo a tarefa levava** (decisão do Arthur, 05/11/2026: "se você conseguir medir sozinho por aqui, ótimo; se não, deixa pra lá"): o sistema mede sozinho o tempo de cada rodada e os pedidos dela. Se ela disser o tempo de antes por conta própria, grave em "O antes" do cartão (com a data e "pela fala dela").
- **O tempo da montagem é sem as pausas** (correção do Arthur, 02/11/2026: a mensagem final dele disse "374 minutos" contando uma pausa de 5 horas). Some os passos pelo relógio da tabela; se num passo a pessoa sumiu por mais de 15 minutos (você vê pela hora das respostas), tire a pausa da conta e diga à parte. Grave no `base-camp.md`: `**Tempo total:** <n> min (com uma pausa de <x> fora da conta)`, e na mensagem: "em <n> minutos (fora uma pausa de <x>)".
- **O painel, depois disso, é o do workflow:** o botão principal passa a ser o pedido dela, e as outras duas opções ficam listadas como os próximos. Não há mais "tarefa" separada do workflow: a rodada 2 é "o próximo passo", pela skill `campo-1`.

---

## O que não está aqui
As perguntas da montagem longa (quem é você, as frentes, como você trabalha, o estilo de escrita, o detalhe do workflow) estão em `perguntas-do-uso-real.md`, com o momento em que cada uma aparece. **Na montagem, não as faça.** No uso real, uma por conversa, só quando a tarefa precisar. O detalhamento do workflow passo a passo (o que entra, o critério, as exceções) também não se pergunta: entra pelas correções dela, rodada a rodada (skill `campo-1`).
