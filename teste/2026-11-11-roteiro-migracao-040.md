# Roteiro de teste: quem já usa o plugin passa para a 0.4.0 (a primeira usuária)

> 11/11/2026, v1. Para o Arthur mandar, **um passo por mensagem, só depois de a 0.4.0 ser publicada por ele**. Nada foi mandado. Sem nome e sem dado de empresa: o repositório é público.
> O que este teste prova: a migração sem perder os cartões de workflow, o dia pelo CAIO no modelo novo (o organizador, o que se repete só anotado) e a medida versão 2. Desenho: `propostas/2026-11-11-desenho-0.4.0.md`, seções 5.1 a 5.3.
> Tempo dela para começar: uns 5 minutos. Depois, o dia de trabalho.

## Antes de mandar (o Arthur confere)
- [ ] **A 0.4.0 está publicada** e o pré-teste da migração passou (T4 e T4b do desenho).
- [ ] **Em que estado está a pasta dela** (é o que decide o passo 2):
  - **A.** Já está no plugin, com o CAIO (rodou "atualizar o meu sistema" na 0.3.7 ou depois): vale o passo 2A.
  - **B.** Ainda está no kit em zip, ou no plugin de antes do CAIO: vale o passo 2B.
- [ ] **O modo de permissão do app em Accept edits** na pasta dela.
- [ ] Ela salvou e fechou o Excel.

## Os passos (o texto para ela)
**Passo 1.** Feche o app do Claude e abra de novo, na aba **Code**, com a pasta de sempre. Clique no **+** ao lado da caixa de texto, depois em **Plugins**. No **business-creator**, o número tem de ser **0.4.0** (ou maior). Se for outro, me mande um print e pare aqui.

> Para o Arthur, se vier o print com a versão antiga: o app guarda uma cópia do marketplace e só vê a versão nova depois de atualizá-la. Peça a ela para abrir uma conversa na pasta e escrever: **rode claude plugin marketplace update sem-ia e depois claude plugin update business-creator@sem-ia**; aprovar os oks; fechar e abrir o app.

**Passo 2A** (pasta já com o CAIO). Abra uma conversa nova e escreva **bom dia**. O CAIO vai dizer que chegou uma versão nova e perguntar se atualiza. Responda **pode**. Ele vai dizer quantos workflows seus continuam guardados.

**Passo 2B** (pasta do kit em zip, ou de antes do CAIO). Abra uma conversa nova e escreva **atualizar o meu sistema**. O app vai pedir o seu ok duas ou três vezes; pode aprovar. Quando ele terminar, abra outra conversa nova e escreva **bom dia**.

**Passo 3.** Trabalhe o dia inteiro por ali, como já faz: diga ao CAIO o que precisa fazer, do seu jeito, até tudo de uma vez. Os seus workflows continuam: é só pedir pelo nome que eles já têm.

**Passo 4.** Em algum momento do dia, pergunte ao CAIO: **o que você anota sobre mim?** Me diga se a resposta ficou clara.

**Passo 5.** No fim do dia, escreva **fecha o dia**. Ele vai perguntar se ficou algo do seu dia fora dali: responda em uma frase, se quiser. Me mande a tabela da medida (só números) e uma linha do que você estranhou.

## O que o Arthur confere depois (sem abrir a pasta dela)
- **Os cartões ficaram:** a mensagem do passo 2 disse quantos workflows continuam, e o número bate com o que ela tinha.
- **O dia:** na medida, as tarefas entregues, a espera por aprovação e as falhas em sequência, contra a medida anterior dela.
- **O uso (versão 2 da medida):** as tarefas dos últimos 7 dias; as palavras do método nas respostas (o esperado é perto de zero; "workflow" pode aparecer quando ela pede um dos dela pelo nome); quantas linhas "feito fora".
- **Nada novo criado sozinho:** ela não recebeu aviso de workflow novo nem de habilidade nova. Se uma tarefa se repetiu, o CAIO não comentou.
- **A transparência:** a resposta do passo 4 disse o que é anotado, onde fica, para quê e o que sai (só a medida, quando ela manda).
- **O que estranhou:** a linha livre dela. Palavra do método na boca do CAIO é correção para o plugin.

## O que este teste não prova
- A montagem nova em 2 passos (ela não monta de novo): é o caso de quem começa do zero.
- O registro de uso da empresa: não está nesta versão.
- O painel do dia: se a 0.4.0 sair sem ele, ela continua vendo o painel de trabalho de hoje, com os workflows dela.
