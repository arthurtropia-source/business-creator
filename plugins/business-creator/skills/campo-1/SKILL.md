---
name: campo-1
description: Conduz o Campo 1 da primeira montanha, depois do Base Camp - detalhar e aprender um workflow da pessoa, passo a passo, e rodá-lo de ponta a ponta com ela, do ponto de partida até a entrega, gravando no cartão do workflow o que o sistema aprendeu. Use quando a pessoa escrever "vamos rodar o primeiro workflow", "Campo 1", "vamos detalhar o workflow X", "rodar o workflow X pela primeira vez", ou quando ela pedir uma tarefa que tem cartão em workflows/ com estado incompleto ou em andamento.
---

# Campo 1: detalhar e aprender o workflow

> Plugin Business Creator 0.2.1 (30/10/2026). O Campo 2 (os passos que se repetem viram skills) e o Campo 3 (chegar sozinho) vêm na 0.3.

Um workflow é o caminho de uma tarefa da pessoa, do ponto de partida até a entrega. Cada frente dela é um conjunto de workflows. O primeiro foi desenhado na etapa 5 do Base Camp, como é hoje, com os passos que ela contou. **O Campo 1 é onde o sistema aprende esse workflow:** cada passo detalhado, com os critérios e as exceções dela, quem passa a fazer cada um, e uma rodada inteira com dado real, do começo à entrega.

## Linha de chegada do Campo 1
1. todos os passos do cartão estão **detalhados** (o que entra, o que se faz, o critério de cada decisão, as exceções, o que sai) e cada um tem **quem faz**: ela, o sistema (com rotina gravada ou modelo) ou "ainda não dá" (com a pendência);
2. o workflow **rodou do começo à entrega** pelo menos uma vez, com dado real, e ela **aprovou a entrega**;
3. as rotinas e os modelos dessa rodada estão gravados na pasta e o cartão aponta para cada um, no passo dele;
4. "O que o sistema aprendeu" e "As rodadas" estão preenchidos, com o tempo da rodada contra o "antes";
5. a tabela "Workflows" da ficha da frente mostra o estado novo.

## Antes de começar
- Leia com a ferramenta de leitura de arquivos, nunca por comando (cada comando pode virar um pedido de permissão na tela dela): o cartão do workflow (o caminho está no `base-camp.md`, na linha **Primeiro workflow**, ou na tabela "Workflows" da ficha da frente), o `contexto/computador.md` e a ficha da frente.
- **Retomada:** se o cartão já tem passos detalhados, diga em uma linha onde vocês pararam ("Já detalhamos os passos 1 a 3. Vamos para o 4?") e siga dali. Nunca refaça o que está no cartão.
- **Abra com o caminho em duas linhas**, com as palavras dela: "Campo 1: o seu workflow <nome>. Ele começa quando <X> e termina com <Y>, <para quem>. Hoje são <n> passos e leva <antes>. Agora eu aprendo cada passo com você e, no fim, a gente roda inteiro, com um caso de verdade." Se o cartão disser algo em "O que pode travar", resolva ou confirme isso primeiro.

## 1. Detalhar, passo a passo (o aprendizado)
Um passo de cada vez, na ordem do cartão. Para cada passo, **uma pergunta por vez**, só o que o cartão ainda não diz:
1. **O que entra:** "Nesse passo, o que você tem na mão? Que arquivo, mensagem ou informação?"
2. **O que você faz e olha:** "Me conte a última vez que você fez esse passo: o que olhou primeiro, o que fez depois?" Peça um caso real e recente; nunca "como você costuma fazer".
3. **A decisão e o critério:** se o passo tem escolha ("este entra, aquele não"; "este valor está estranho"), pergunte como ela decide, com um exemplo. O critério é o que mais vale aprender: vai para "O que o sistema aprendeu".
4. **As exceções:** "O que costuma dar errado aqui? Qual foi a última vez?"
5. **O que sai e onde fica:** o resultado do passo e o lugar (arquivo, pasta, mensagem).

Grave no cartão a cada resposta (uma edição só por resposta): a linha do passo vira "detalhado" e o que ela ensinou vai para "O que o sistema aprendeu", com a data. Se o passo se divide em dois, divida a linha e diga em meia linha.

**Quem faz cada passo** (no fim do detalhamento, você sugere e ela decide; escolha com clique, se tiver a ferramenta de pergunta com opções):
- **fica com ela:** decisão de julgamento, aprovação de outra pessoa, contato com alguém;
- **o sistema faz:** o que é ler, juntar, conferir, calcular, montar ou redigir a partir do que está no computador. Com uma rotina gravada (planilha, arquivo: skill `rotinas-e-computador`) ou com um modelo de texto aprovado (`modelos/`);
- **ainda não dá:** falta um acesso, uma ferramenta ou uma informação. Vai para as Pendências da frente, com de quem depende.
Diga por que sugere cada um, em meia linha. Nunca tire dela uma decisão que ela não quis passar.

## 2. Rodar de ponta a ponta (a primeira rodada)
- **Com um caso de verdade:** a próxima vez que a tarefa acontecer, ou agora, com o último caso (o arquivo mais recente). Pergunte qual.
- Siga o cartão passo a passo. Nos passos do sistema, faça e mostre o resultado em poucas linhas; nos passos dela, diga o que ela faz agora e espere.
- **Cada correção dela é aprendizado:** corrija, mostre o trecho e grave a regra em "O que o sistema aprendeu" (se valer para tudo, também no `memoria.md`). Diga em meia linha que aprendeu.
- **Rotina e modelo se gravam na hora:** pela skill `rotinas-e-computador` (rotina na pasta, conferência dentro, arquivo original intacto); o cartão aponta para cada um, na coluna "Com quê" do passo.
- **A entrega (Y):** confira contra o "Pronto quando" do cartão, item por item, antes de mostrar. Ela aprova ou corrige. Aprovada, grave em `modelos/` o que for texto ou formato que vai se repetir. Nada sai do computador sem o ok dela: o sistema entrega como rascunho.

## 3. Fechar a rodada e o Campo 1
- Grave a linha em "As rodadas": a data, o tempo do começo à entrega, **quantos pedidos dela** foram precisos até a entrega (cada mensagem dela que pediu, corrigiu ou destravou algo) e se a entrega foi aprovada.
- **O estado do workflow:**
  - **completo, em <data>:** rodou do começo à entrega com **um pedido só dela** e ela aprovou a entrega. Na primeira rodada guiada isso quase nunca acontece, e está tudo bem;
  - **em andamento:** rodou, mas com vários pedidos dela, ou falta um passo. Diga qual;
  - **incompleto:** não chegou à entrega. Diga o que falta.
  Atualize o estado no cartão e na tabela "Workflows" da ficha da frente.
- **Conte o resultado em até 5 linhas:** o tempo de hoje contra o "antes"; quantos passos o sistema já faz; o que ele aprendeu (as 2 ou 3 regras mais importantes); o que ficou pendente.
- **O próximo passo** (o começo do Campo 2): "Da próxima vez que essa tarefa chegar, abra uma conversa nesta pasta e peça só: '<o pedido curto, com as palavras dela>'. Se sair pronto com esse pedido e você aprovar, o workflow fica completo." Grave esse pedido no cartão e no `como-usar.md`, em "Pedidos que já funcionam".

## Cuidados
- **Um workflow de cada vez.** Se ela trouxer outra tarefa no meio, ajude em poucas linhas e, se ela se repete, anote na tabela "Workflows" da frente como o próximo.
- **Não pule o detalhamento para chegar à rodada.** O que o sistema não aprendeu no passo vira correção na rodada, e cada correção custa um pedido dela.
- **Sem jargão** (a não ser "workflow", que ela já conhece da montagem). Os critérios ficam com as palavras dela.
- **Sigilo e dados da empresa:** as regras dela, no `AGENTS.md` da raiz, valem aqui. Dado da empresa só com a autorização registrada.
- **Conversa longa:** depois do detalhamento, se a conversa estiver longa, recomende abrir uma conversa nova para a rodada ("vamos rodar o workflow <nome>"): o cartão guarda tudo.
