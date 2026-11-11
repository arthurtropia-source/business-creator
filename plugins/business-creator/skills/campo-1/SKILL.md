---
name: campo-1
description: Roda um workflow que já tem cartão na pasta (frentes/*/workflows/*.md ou workflows/*.md), rodada a rodada, corrigindo, e grava no cartão o que o sistema aprendeu. Use só quando existir o cartão e a pessoa escrever o pedido ou o nome dele, "rodar o workflow X", "abrir o workflow X numa conversa nova", "aprovado" ou "quero corrigir" logo depois de uma rodada, "descartar o workflow X" ou "corrija a Situação dos passos do X". Sem cartão, esta skill não se aplica: é uma tarefa comum, do CAIO.
---

# Campo 1: rodar até sair com um pedido só

> Plugin Business Creator 0.4.0 (11/11/2026), versão 5 desta skill, **dormente**: só roda um cartão que já existe e nunca cria cartão; saem o recibo dos marcos, o "Descartar" de "A começar" e a anotação de tarefa nova em "Os próximos". O modelo do cartão mudou para `modelo-workflow.md`, nesta pasta.
> Antes: versão 4 (0.3.0, 04/11/2026), cada workflow na sua conversa e a recusa do segundo na mesma conversa; versão 3 (0.2.19), um workflow por conversa, vários abertos; versão 2 (0.2.17), rodadas com correção, sem questionário.

Um workflow é o caminho de uma tarefa da pessoa, do ponto de partida até a entrega. Os cartões vêm de uma versão anterior do método (o primeiro foi escolhido no fim do Base Camp) ou chegaram de fora. **O Campo 1 é rodar de novo, cada vez que a tarefa chegar, corrigindo:** ela escreve o pedido, o sistema roda o cartão passo a passo, entrega, ela aprova ou corrige, e cada correção vira regra. Está pronto quando sair do começo à entrega com um pedido só dela, e ela aprovar.

## O corte
**O cartão existe?** Procure com a ferramenta de busca de arquivos em `frentes/*/workflows/` e `workflows/`.
- **Não:** pare. Não crie cartão, não pergunte os passos, não fale de workflow. Faça o pedido como uma tarefa comum (se a conversa foi aberta pelo CAIO, até o "Pronto:").
- **Sim:** siga abaixo.
Esta skill nunca cria cartão. Cartão novo só chega de fora: uma sugestão aceita por ela ou um pacote.

## Antes de tudo: um workflow por conversa
**Antes de responder a qualquer pedido, olhe esta conversa.** Se ela já rodou um workflow (houve aqui uma rodada de outro cartão, aprovada ou ainda esperando o "aprovado") e o pedido de agora é de **outro** workflow (a linha Pedido de outro cartão, ou o nome dele): **não rode, não pergunte nada sobre ele e não peça material.** Responda em uma linha: "<nome> roda numa conversa só dele." e siga "Abrir numa conversa nova", abaixo. Se a rodada daqui ainda espera o "aprovado", lembre disso na mesma resposta, em uma linha. Só o mesmo workflow roda de novo nesta conversa.

## Linha de chegada do Campo 1
1. o workflow **rodou do começo à entrega com um pedido só dela**, e ela **aprovou a entrega**: o Estado do cartão vira "completo, em <data>", e a tabela "Workflows" da ficha da frente mostra o mesmo;
2. cada passo do cartão tem **quem faz** de fato (ela, o sistema ou "ainda não dá", com a pendência), tirado do que aconteceu nas rodadas, não de uma entrevista;
3. as rotinas e os modelos que as rodadas criaram estão gravados na pasta, e o cartão aponta para cada um, no passo dele;
4. "O que o sistema aprendeu" tem as regras das correções dela, com a data; "As rodadas" tem uma linha por rodada, com o tempo contra o "antes".

## Abrir numa conversa nova (o botão do painel)
Quando chegar "abrir o workflow <nome> numa conversa nova" (o clique de "Rodar em conversa nova" no painel), ou quando ela pedir outro workflow numa conversa que já rodou um:
1. **Ache o pedido do workflow:** a linha Pedido do cartão; cartão sem a linha Pedido, use "rodar o workflow <nome>". Sem cartão, vale "O corte", acima.
2. **Abra a conversa nova pela ferramenta do app**, sempre primeiro: procure a ferramenta de abrir sessão (`start_session`; se ela aparecer só pelo nome, carregue-a antes de chamar). Chame com `initiation: "offer"`, o título "Workflow: <nome>" e, como mensagem inicial, o pedido do workflow. O app mostra a ela o cartão "Nova sessão / Fazer aqui". Responda em uma linha: "Abri o pedido numa conversa nova: é só aprovar no cartão."
3. **Só se a ferramenta não existir nesta sessão, ou a chamada der erro,** responda exatamente: "Não consegui abrir a conversa nova. Copiei o pedido: abra uma conversa nova e cole. O pedido: **<o pedido do workflow>**." O painel reconhece essa frase e copia o pedido em negrito. Nunca use esta saída sem ter tentado o passo 2.
4. **Não rode nada nesta conversa.** "Fazer aqui" só vale numa conversa que ainda não rodou nenhum workflow; se ela escolher "Fazer aqui" numa conversa que já rodou um, diga em uma linha que este workflow precisa de uma conversa só dele e ofereça de novo.

## Descartar
Vale só para um cartão que existe, quando ela escreve "descartar o workflow <nome>". Não rode nada e não pergunte:
- **Um cartão que nunca rodou** (sem linha em "As rodadas"): mova o arquivo para a pasta `descartados/` dentro da mesma pasta `workflows/` e tire a linha dele da tabela "Workflows" da ficha da frente.
- **Um cartão que já rodou:** confirme em uma linha antes.
- Responda em uma linha: "Tirei <nome> da fila. Se mudar de ideia, é só pedir **rodar o workflow <nome>**."

## Antes de rodar
- **Um workflow por conversa, com recusa.** Se esta conversa já rodou um workflow e chegar o pedido de outro, não rode: siga "Abrir numa conversa nova" acima.
- **Workflow sem pedido** (o cartão não tem a linha Pedido): comece combinando o pedido, em uma pergunta ("Que frase você vai escrever quando essa tarefa chegar?"), grave a linha Pedido no cartão e siga.
- **Cartão que não se lê** (no painel, "precisa de ajuste": sem o título, sem o pedido e sem passos): reescreva-o pelo modelo `modelo-workflow.md`, nesta pasta, guardando o que estava lá em "O que o sistema aprendeu" ou nos passos, diga em uma linha o que mudou e só então rode.
- **Ache o cartão pelo pedido.** O pedido que ela escreveu é a linha **Pedido** de um cartão em `workflows/` (na frente, ou na raiz no nível leve). Se ela escreveu "vamos rodar o primeiro workflow" ou "Campo 1", o cartão é o da linha **Primeiro workflow** do `base-camp.md`, e só ele. Se ela nomear outro ("vamos rodar o de projetos", ou "rodar o workflow <nome>"), é esse. Se o cartão não existir, vale o corte, acima. Em dúvida entre dois, pergunte em uma linha; nunca escolha por ela.
- Leia com a ferramenta de leitura de arquivos, nunca por comando: o cartão, o `contexto/computador.md` e a ficha da frente. Nada mais.
- **Trava "falta registrar quem autoriza os dados da empresa":** antes de perguntar a ela, procure `*/contexto/regras-da-empresa.md`; se existir, a resposta está lá (Cuidados, "Sigilo e dados da empresa").
- **Cartão de antes da 0.2.17** (sem as linhas Pedido e Combinado em "Do começo à entrega"): acrescente as duas, tiradas de "Começa quando" e do `como-usar.md`, numa edição só, antes de rodar. É por elas que o painel mostra o botão.
- **Abra em uma linha, nas palavras dela**, e já peça o que a rodada precisa, se precisar: "Rodada <n> de <o nome do workflow, como no cartão>. Me conte o seu dia: o que andou e o que travou." Nada de método na mensagem: sem "Campo 1", "cartão", "de ponta a ponta", "a Mera", "detalhar". Se o cartão disser algo em "O que pode travar" que impede a rodada, diga em uma linha e resolva primeiro. **Se um passo depende de uma fonte que não está ao alcance**, não entregue um modelo com campos em branco no lugar do resultado: faça o que dá com o que existe, diga em uma linha o que faltou e de quem depende, e grave em Pendências.

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
> **Confira: se ficou do seu jeito, escreva aprovado; se não, diga o que mudar.**"
- **Antes de falar, grave no cartão:** a linha da rodada em "As rodadas" (a data, o tempo do pedido à entrega, os pedidos dela, "Entrega aprovada?" = "a conferir", uma observação curta); a coluna "Quem faz" e "Situação" dos passos com o que aconteceu de fato; o que aprendeu.
  - **A Situação se reescreve a cada rodada, em todos os passos**, não só nos que mudaram, e **só com um destes valores:** `o sistema fez`, `ficou com ela` ou `ainda não dá: <por quê>` (`como é hoje` só antes da primeira rodada). Nada fora da lista, nem "primeira vez feita junto" ou "feito com ela": se o sistema fez o passo, mesmo com ela ao lado, é `o sistema fez`; a data e o detalhe vão em "As rodadas" ou em "O que o sistema aprendeu". O painel conta só esses valores; o resto aparece com "?" e um aviso no cartão.
  - **Pedido "corrija a Situação dos passos do <workflow>"** (o aviso do painel): leia "As rodadas" e o que ela disser, troque cada Situação fora da lista pelo valor certo, mostre a tabela dos passos antes e depois, e grave com o ok dela.
- **Ao "aprovado"** (ou "pode", "ok", "ficou bom"): marque "sim" em "Entrega aprovada?". Grave em `modelos/` o que for texto ou formato que vai se repetir. **Se ela corrigir**, refaça, mostre de novo e só então peça a aprovação; a correção conta como pedido.
- **O estado do workflow**, no cartão e na tabela "Workflows" da ficha da frente:
  - **completo, em <data>:** rodou do começo à entrega com **um pedido só dela** e ela aprovou. Diga: "O workflow <nome> está completo: sai pronto com um pedido seu." Grave o pedido em `como-usar.md`, em "Pedidos que já funcionam", se ainda não estiver;
  - **em andamento:** rodou, mas com mais de um pedido dela. **Passo que fica com ela não impede o completo** (decisão do Arthur, 04/11/2026): o completo é o pedido só e a aprovação; os passos dela são o que os Campos 2 e 3 trabalham. Diga em uma linha o que faltou para sair com um pedido só ("hoje foram 3 pedidos: o dia, a correção da data e o ok");
  - **incompleto:** não chegou à entrega. Diga o que faltou.
- **O resultado, em até 3 linhas**, no fim: o tempo de hoje e, só se o cartão tiver o "antes", contra ele (não pergunte quanto tempo levava antes: decisão do Arthur, 05/11/2026; se ela disser por conta própria, grave em "O antes" com a data e "pela fala dela"); quantos passos o sistema já faz; a regra mais importante que aprendeu. Sem resumo do método.
- **O próximo passo é sempre o mesmo pedido:** "Na próxima vez, só escreva **<pedido>**." Nunca invente uma segunda frase.

## Perguntas das rodadas
Uma por vez, e só quando a rodada precisa:
- Só quando a entrega não dá para conferir: "O que não pode faltar para você dar por pronto?" → o "Pronto quando" do cartão (de preferência, o sistema escreve o "Pronto quando" pelo que a rodada mostrou, e ela corrige).
- Só quando um passo não dá para fazer: a pergunta daquele passo, uma ("Cola aqui a mensagem dele?", "Qual dos dois fornecedores?"), na hora → "O que pode travar" do cartão, se for uma trava que se repete.
- O detalhamento de um passo (o que entra, o critério, as exceções, o que sai) **não se pergunta**: entra pelas correções dela, rodada a rodada. A exceção é o plano B (seção 1): o passo que falhou duas vezes, com até 3 perguntas, uma por vez.

## Cuidados
- **Um workflow por conversa; vários abertos ao mesmo tempo, cada um com o seu cartão.** Ela pode abrir outro workflow, até de outra frente, antes de este ficar completo: o cartão de cada um guarda onde ele parou. Nesta conversa, roda-se um só; o segundo vai para uma conversa nova (acima). Se ela trouxer outra tarefa no meio, ajude em poucas linhas. **Pasta de antes da 0.3.0:** se o `AGENTS.md` da raiz ainda diz "um workflow de cada vez" ou não fala da conversa nova, vale a regra nova; diga em uma linha que a regra mudou e, com o ok dela, troque a linha pela do modelo `AGENTS-raiz.md` (a pasta é dela: sem o ok, não mexa).
- **Sem jargão** (a não ser "workflow", que ela já conhece do cartão). Os critérios ficam com as palavras dela.
- **Sigilo e dados da empresa:** as regras dela, no `AGENTS.md` da raiz, valem aqui. Dado da empresa só com a autorização registrada. **No modo empresa** (existe `*/contexto/regras-da-empresa.md`), a autorização é a desse arquivo, e o passo que é trabalho da área roda pelo `AGENTS.md` do repositório. Se o arquivo existe e o `AGENTS.md` da raiz ainda não tem a seção "A empresa onde eu trabalho", antes de rodar aplique o passo 5b da skill `atualizar-a-pasta` (é o que troca a trava "falta registrar quem autoriza" pela regra da empresa) e diga em uma linha.
- **Uma conversa por rodada**, de preferência: o pedido abre a conversa, a entrega fecha. O cartão guarda tudo; a conversa seguinte não precisa da anterior.
- **O painel lê o cartão:** o nome (o título), "O quê", as linhas Pedido, Combinado e Estado, a tabela dos passos (o nome de cada passo e a Situação, que ela vê em "ver os passos") e a tabela "As rodadas". Mantenha o formato do modelo `modelo-workflow.md`, nesta pasta; sem isso, o cartão aparece no painel como "precisa de ajuste".
- **Aberta pelo CAIO** (a primeira mensagem traz a linha "(Tarefa do CAIO, <data>.)" embaixo do pedido): rode igual; o que vem entre o pedido e essa linha é o que ela já disse, use. Na mensagem da entrega, a primeira linha é "Esperando você: confira <a entrega> em <onde ficou> e escreva aprovado" (ou "Travou: <o motivo> · depende de <quem>"), para o CAIO anotar; depois do "aprovado", uma linha "Pronto: <a entrega> aprovada"; o resto das mensagens segue como acima. Não escreva em `dia/`: quem anota é o CAIO.
- **O diário é do painel:** o painel anota sozinho cada conversa de trabalho em `frentes/<frente>/diario/AAAA-MM.md`. Não escreva nele nem o leia para rodar; ele existe para achar o que se repete.
