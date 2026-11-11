<!--
MODELO do cartão de um workflow: frentes/<frente>/workflows/<nome-curto>.md (no nível leve, sem pasta por frente: workflows/<nome-curto>.md).
Formato interno. Nenhuma skill cria cartão sozinha; ele serve a quem já tem cartão e ao que chegar pelo ASW ou por um pacote. Cada rodada e cada lição entram nele (skill campo-1). É o arquivo que diz, sem a pessoa precisar lembrar, onde o workflow está, e é dele que o painel lê o nome, o pedido, o estado e as rodadas.
Regras: com as palavras dela; o "antes" sempre com o número, a data e a origem (medido hoje, lembrança ou estimativa), mais as vezes por mês e as horas por mês (a conta à vista); a sugestão da IA marcada como sugestão; até ~60 linhas.
As linhas Pedido, Combinado e Estado, o título, a tabela dos passos e a tabela "As rodadas" são lidos pelo painel: mantenha o formato.
Os passos começam como ela faz hoje (quem faz: ela). As rodadas vão mudando "Quem faz" e "Situação" com o que aconteceu de fato.
Tire estes comentários e as instruções entre <>.
-->
# Workflow: <nome em palavras dela>

> Um workflow é o caminho de uma tarefa, do ponto de partida até a entrega. Desde <data>. Este cartão guarda os passos, quem faz cada um, o que o sistema já aprendeu e cada vez que ele rodou.

## Do começo à entrega
- **O quê:** <a tarefa, em uma frase.>
- **Frente:** <qual.>
- **Pedido:** <as 2 a 5 palavras que ela escreve para rodar, em minúsculas: "fechar o dia". É a única frase deste workflow: a mesma do botão do painel, do combinado e do guia de bolso.>
- **Combinado:** quando <o gatilho, com as palavras dela>, abra esta pasta e escreva **<pedido>**
- **Começa quando (o ponto de partida):** <o que dispara e o que chega: "chega o relatório da semana", "um cliente pede um orçamento".>
- **Termina com (a entrega):** <o que sai, em que formato e para quem.>
- **Pronto quando:** <o que não pode faltar na entrega. Se ela não disse, o que a rodada 1 mostrou que precisa ter; ela corrige.>
- **Tipo:** <cíclico (se repete: toda segunda, todo mês, a cada pedido) ou pontual (serve a um projeto com fim).> **Tem hora certa?** <sim, quando / não, acontece quando aparece.>
- **Gera ou poupa dinheiro:** <como, com as palavras dela; ou o tempo que devolve.>
- **Estado:** <incompleto: rodada 1 em andamento | em andamento | completo, em <data>.>

## Os passos
| # | Passo | Quem faz | Com quê | Situação |
|---|---|---|---|---|
| 1 | <o que se faz, em palavras dela> | <ela / o sistema / outra pessoa (a função)> | <a planilha, o e-mail, a rotina `rotinas/<nome>`, a skill <nome>> | <como é hoje / o sistema fez / ficou com ela / ainda não dá: <por quê>> |
<No começo: os passos como ela contou, todos com "ela" e "como é hoje". Passo que ela não soube dizer: "a completar nas rodadas". A cada rodada, as colunas Quem faz e Situação de todos os passos são reescritas com o que aconteceu de fato, só com os valores da lista (o painel não conta outro valor).>

## O que pode travar
- <o que depende de outra pessoa, de um sistema ou de um dado de terceiro. "Nada, por enquanto" se for o caso.>

## O que o sistema aprendeu
<Vazio no começo. A cada rodada: cada critério, exceção ou correção dela que vale para as próximas rodadas, com a data. Ex.: "pedido sem número entra separado, nunca na soma (02/11)".>

## As rodadas
| Data | Do começo à entrega em | Pedidos dela até a entrega | Entrega aprovada? | Observação |
|---|---|---|---|---|
<Uma linha por vez que o workflow rodou: a data; o tempo do pedido à entrega; quantas mensagens dela foram precisas (o pedido conta como a primeira); "sim", "não" ou "a conferir"; uma observação curta. Completo = rodou do começo à entrega com um pedido só dela, e ela aprovou a entrega; quando isso acontecer, mude o Estado para "completo, em <data>".>

## O antes (o número de partida)
| Quanto tempo leva hoje | Vezes por mês | Horas por mês | Quando | Como foi medido |
|---|---|---|---|---|
| <o tempo que a tarefa leva hoje, ou "não medido"> | <quantas> | <o tempo vezes as vezes> | <data> | medido hoje / lembrança da última vez / estimativa, pela fala dela / pela outra IA |

## Os próximos (para depois deste)
| Workflow | Pedido | O que faz | O que trava |
|---|---|---|---|
| <outros workflows da mesma frente, e o que ficou na fila por depender de sistema ou de dado de terceiro> | <as 2 a 5 palavras> | <a proposta em uma frase: o que entrega, para quem e quando; ex.: "Todo dia, um e-mail com o preço da sua loja cruzado com o das lojas da concorrência."> | <vazio, ou o que impede de rodar hoje: "depende do BI"> |
