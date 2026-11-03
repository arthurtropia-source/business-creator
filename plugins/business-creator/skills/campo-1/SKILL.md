---
name: campo-1
description: Conduz o Campo 1 da primeira montanha, depois do Base Camp - rodar o primeiro workflow da pessoa, rodada a rodada, corrigindo até ele sair pronto com um pedido só dela, e gravar no cartão do workflow o que o sistema aprendeu. Use quando a pessoa escrever o pedido de um workflow que tem cartão em workflows/ com estado incompleto ou em andamento (o pedido está na linha Pedido do cartão: "fechar o dia", "monitor de preço de ontem"), ou "vamos rodar o primeiro workflow", "Campo 1", "rodar o workflow X", "aprovado" ou "quero corrigir" logo depois de uma rodada.
---

# Campo 1: rodar até sair com um pedido só

> Plugin Business Creator 0.2.17 (02/11/2026), versão 2 desta skill: **rodadas com correção, sem questionário** (decisão do Arthur, 02/11/2026: no teste dele o Campo 1 abriu com perguntas que o Base Camp tinha prometido não fazer, e ele preferiu aprender rodando). O Campo 2 (os passos que se repetem viram skills) e o Campo 3 (chegar sozinho) vêm na 0.3.

Um workflow é o caminho de uma tarefa da pessoa, do ponto de partida até a entrega. Cada frente dela é um conjunto de workflows. O primeiro foi escolhido por ela no fim do Base Camp e já rodou uma vez (a rodada 1). **O Campo 1 é rodar de novo, cada vez que a tarefa chegar, corrigindo:** ela escreve o pedido, o sistema roda o cartão passo a passo, entrega, ela aprova ou corrige, e cada correção vira regra. Está pronto quando sair do começo à entrega com um pedido só dela, e ela aprovar.

## Linha de chegada do Campo 1
1. o workflow **rodou do começo à entrega com um pedido só dela**, e ela **aprovou a entrega**: o Estado do cartão vira "completo, em <data>", e a tabela "Workflows" da ficha da frente mostra o mesmo;
2. cada passo do cartão tem **quem faz** de fato (ela, o sistema ou "ainda não dá", com a pendência), tirado do que aconteceu nas rodadas, não de uma entrevista;
3. as rotinas e os modelos que as rodadas criaram estão gravados na pasta, e o cartão aponta para cada um, no passo dele;
4. "O que o sistema aprendeu" tem as regras das correções dela, com a data; "As rodadas" tem uma linha por rodada, com o tempo contra o "antes".

## Antes de rodar
- **Ache o cartão pelo pedido.** O pedido que ela escreveu é a linha **Pedido** de um cartão em `workflows/` (na frente, ou na raiz no nível leve). Se ela escreveu "vamos rodar o primeiro workflow" ou "Campo 1", o cartão é o da linha **Primeiro workflow** do `base-camp.md`, e só ele. Se ela nomear outro ("vamos rodar o de projetos"), é esse; se o cartão não existir, crie pelo modelo `workflow.md` da montagem antes de rodar. Em dúvida entre dois, pergunte em uma linha; nunca escolha por ela.
- Leia com a ferramenta de leitura de arquivos, nunca por comando: o cartão, o `contexto/computador.md` e a ficha da frente. Nada mais.
- **Cartão de antes da 0.2.17** (sem as linhas Pedido e Combinado em "Do começo à entrega"): acrescente as duas, tiradas de "Começa quando" e do `como-usar.md`, numa edição só, antes de rodar. É por elas que o painel mostra o botão.
- **Abra em uma linha, nas palavras dela**, e já peça o que a rodada precisa, se precisar: "Rodada <n> de <o nome do workflow, como no cartão>. Me conte o seu dia: o que andou e o que travou." Nada de método na mensagem: sem "Campo 1", "cartão", "de ponta a ponta", "a Mera", "detalhar". O mapa fica na trilha do painel. Se o cartão disser algo em "O que pode travar" que impede a rodada, diga em uma linha e resolva primeiro. **Se um passo depende de uma fonte que não está ao alcance**, não entregue um modelo com campos em branco no lugar do resultado: faça o que dá com o que existe, diga em uma linha o que faltou e de quem depende, e grave em Pendências.

## 1. Rodar (cada rodada)
- Siga o cartão passo a passo, na ordem. **Nos passos do sistema**, faça e mostre o resultado em poucas linhas. **Nos passos dela** (decisão de julgamento, aprovação de outra pessoa, contato com alguém), diga em uma linha o que ela faz agora e siga com o resto.
- **Pergunte só quando um passo não dá para fazer**, e uma coisa só, na hora, com as palavras dela ("Qual dos dois fornecedores?", "Cola aqui a mensagem dele?"). Nunca uma pergunta sobre como ela costuma fazer, nem "a última vez que você fez": o jeito dela entra pela correção.
- **Cada correção dela é aprendizado:** corrija, mostre o trecho e grave a regra em "O que o sistema aprendeu", com a data (se valer para tudo, também no `memoria.md`). Diga em meia linha que aprendeu. Se a correção muda um passo (a ordem, o que entra, o que sai), mude a linha do passo no cartão.
- **Rotina e modelo se gravam na hora:** pela skill `rotinas-e-computador` (rotina na pasta, conferência dentro, arquivo original intacto); o cartão aponta para cada um, na coluna "Com quê" do passo.
- **A entrega:** confira contra o "Pronto quando" do cartão, item por item, antes de mostrar (se o "Pronto quando" estiver "a completar", escreva-o pelo que a entrega precisa ter, e ela corrige). Nada sai do computador sem o ok dela: o sistema entrega como rascunho.
- **Conte os pedidos dela:** cada mensagem dela que pediu, respondeu, corrigiu ou destravou algo, do pedido à entrega aprovada. O pedido inicial conta como o primeiro.
- **Plano B, um passo que falhou duas vezes:** se ela corrigiu o mesmo passo em duas rodadas, detalhe só esse passo, com até 3 perguntas, uma por vez (o que entra, como ela decide, o que costuma dar errado), e grave as respostas no cartão. É a exceção, não o caminho.

## 2. Entregar e fechar a rodada
A mensagem da entrega:
> "<a entrega, inteira se couber em 15 linhas; senão, o começo e onde ficou>
> ---
> **Confira: se ficou do seu jeito, clique em Aprovar a entrega (ou escreva aprovado); se não, diga o que mudar.**"
- **Antes de falar, grave no cartão:** a linha da rodada em "As rodadas" (a data, o tempo do pedido à entrega, os pedidos dela, "Entrega aprovada?" = "a conferir", uma observação curta); a coluna "Quem faz" e "Situação" dos passos com o que aconteceu de fato (o sistema fez / ficou com ela / ainda não dá); o que aprendeu.
- **Ao "aprovado"** (ou "pode", "ok", "ficou bom", o clique em Aprovar a entrega): marque "sim" em "Entrega aprovada?". Grave em `modelos/` o que for texto ou formato que vai se repetir. **Se ela corrigir**, refaça, mostre de novo e só então peça a aprovação; a correção conta como pedido.
- **O estado do workflow**, no cartão e na tabela "Workflows" da ficha da frente:
  - **completo, em <data>:** rodou do começo à entrega com **um pedido só dela** e ela aprovou. Diga: "O workflow <nome> está completo: sai pronto com um pedido seu. O próximo da fila é <o próximo da tabela>; abre quando você quiser." Grave o pedido em `como-usar.md`, em "Pedidos que já funcionam", se ainda não estiver;
  - **em andamento:** rodou, mas com mais de um pedido dela, ou um passo ficou com ela. Diga em uma linha o que faltou para sair com um pedido só ("hoje foram 3 pedidos: o dia, a correção da data e o ok");
  - **incompleto:** não chegou à entrega. Diga o que faltou.
- **O resultado, em até 3 linhas**, no fim: o tempo de hoje contra o "antes" (se o "antes" estiver "a medir", pergunte uma vez: "quanto tempo isso te tomava antes?", e grave com a data e "pela fala dela"); quantos passos o sistema já faz; a regra mais importante que aprendeu. Sem resumo do método.
- **O próximo passo é sempre o mesmo pedido:** "Na próxima vez, só escreva **<pedido>**." Nunca invente uma segunda frase.

## Cuidados
- **Um workflow de cada vez.** Se ela trouxer outra tarefa no meio, ajude em poucas linhas e, se ela se repete, anote na tabela "Workflows" da frente como o próximo.
- **Sem jargão** (a não ser "workflow", que ela já conhece da montagem). Os critérios ficam com as palavras dela.
- **Sigilo e dados da empresa:** as regras dela, no `AGENTS.md` da raiz, valem aqui. Dado da empresa só com a autorização registrada.
- **Uma conversa por rodada**, de preferência: o pedido abre a conversa, a entrega fecha. O cartão guarda tudo; a conversa seguinte não precisa da anterior.
- **O painel lê o cartão:** o nome (o título), "O quê", as linhas Pedido, Combinado e Estado, a tabela dos passos e a tabela "As rodadas". Mantenha o formato do modelo `workflow.md`; sem isso, o botão do painel some.
