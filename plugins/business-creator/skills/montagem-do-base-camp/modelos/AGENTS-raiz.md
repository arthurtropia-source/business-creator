<!--
MODELO do arquivo-mestre do sistema da pessoa. Escreva no passo 1 (o retrato), na raiz da pasta, substituindo o AGENTS.md da montagem.
Regras: em primeira pessoa (é ela falando com a IA); curto (até ~80 linhas); só o que ela aprovou; nenhuma menção à montagem, ao kit ou a esta pasta de modelos.
Tire estes comentários e as instruções entre <>. Seção sem conteúdo aprovado sai inteira.
No passo 1 (o retrato), grave o arquivo COM a seção "Montagem em andamento" logo abaixo do título (o texto está no fim deste modelo): ela garante que uma conversa nova, aberta no meio do passo 1, retome a montagem. Ao "confirmo" do passo 1, tire só essa seção.
No nível leve (sem pasta por frente), as seções "Palavras minhas" e "Pendências" ficam aqui, com "nenhuma ainda".
-->
# <Nome>: o meu sistema de trabalho

Este é o meu sistema de trabalho com IA. Aqui fica o que vale para tudo; cada frente tem a sua pasta em `frentes/`, com o próprio `AGENTS.md`, que deve ser lido antes de trabalhar nela.

**Tudo o que você deve saber sobre mim está em `contexto/`. Carregue os arquivos relevantes antes de começar qualquer tarefa. Suposições são o inimigo: se a resposta não estiver lá, me pergunte.**

## Quem sou
- <2 a 4 linhas: nome, cidade, o trabalho principal em uma frase, as frentes em uma frase.>
- Mais sobre mim: @contexto/sobre-mim.md
- Como trabalhar comigo: @contexto/como-trabalhar-comigo.md
- <só no completo> Como eu escrevo: @contexto/estilo-de-escrita.md

## Mapa das frentes
| Pasta | O que é | Situação |
|---|---|---|
| `frentes/<nome>/` | <uma linha> | <prioridade agora / anda / parada: o motivo em poucas palavras> |
<No leve não há pasta por frente: na primeira coluna vai só o nome da frente, e a frase sobre ler o AGENTS.md da frente sai (aqui e no parágrafo do topo). As frentes fora da montagem entram com a linha e "fora da montagem por enquanto".>

Antes de trabalhar numa frente, leia o `AGENTS.md` dela.

- **Prioridade agora:** <a frente de FRENTES.prioridade>.
- **A que mais gera ou poupa dinheiro:** <FRENTES.dinheiro>.

<só no leve>
## Palavras minhas
- <palavra que eu uso com sentido próprio, e o que quer dizer. "Nenhuma ainda.">

## Pendências
- <pergunta ou assunto que ficou sem resposta · de quem depende · desde quando. "Nenhuma ainda.">
</só no leve>

<só no modo empresa (`modo-empresa.md`); uma seção por área, se houver mais de uma>
## A empresa onde eu trabalho
- Trabalho na <Empresa>, na área <Área>. A base da área está em `<repositório>/`, que se atualiza sozinha quando abro uma conversa.
- **Dados da empresa:** valem as regras de `<repositório>/contexto/regras-da-empresa.md`: quem autoriza, o que está autorizado, onde fica o trabalho e onde fica o dado bruto. Leia esse arquivo antes de qualquer trabalho com dado da empresa. Elas valem acima das minhas regras nesse assunto.
- **O trabalho da área** segue `<repositório>/AGENTS.md`, que manda nele. Aqui ficam só o caderno do dia, o diário e o que é meu.
</só no modo empresa>

## O meu computador
- Antes de rodar qualquer rotina ou mexer em planilha, leia `contexto/computador.md`.

## Ferramentas que eu uso
| Ferramenta | Para quê | Onde ficam as informações |
|---|---|---|
| <FERRAMENTAS.lista: e-mail, agenda, WhatsApp, planilhas, Drive, Notion; sistema da empresa só pelo tipo> | <para que ela usa, em poucas palavras> | <FERRAMENTAS.dados> |

- Ainda não estão conectadas ao sistema: a conexão de cada uma se combina no uso, uma de cada vez, começando pela leitura.

## Como me responder
- <3 a 5 linhas tiradas de como-trabalhar-comigo.md: o essencial do formato, para valer em toda conversa.>

## Regras
<As regras aprovadas no bloco 4, numeradas, com as palavras que ela aprovou. Sem repetir: a regra do formato vira só "Responder como está em 'Como me responder'"; a regra de nada sair do computador ganha, no fim, "Na dúvida, entregue como rascunho".>

## O que nunca se guarda
- <O que ela disse na 4.2 (REGRAS.sigilo): o que a IA nunca guarda nem repete, em nenhuma frente. Se ela disse "nada", a seção sai.>

## Em uso ou parado
- Muita coisa que existe nas minhas frentes foi teste ou ficou parada. Só o que está marcado **em uso** orienta o trabalho. O que está **a confirmar**, pergunte antes de usar.

## Memória e lições
- A memória fica em @memoria.md. Consulte antes de cada tarefa.
- Quando eu te corrigir ou disser "daqui pra frente faça assim", registre a lição no `memoria.md`, com a data. Se a lição for de uma frente só, registre no `AGENTS.md` daquela frente.

## O meu dia
- **Começo o dia pelo CAIO:** numa conversa nova, escrevo **bom dia** e digo o que preciso fazer, do meu jeito (skill `caio`). Ele sabe quem eu sou, as minhas frentes e o que já está nesta pasta; faz na hora o que é rápido e abre uma conversa para cada tarefa maior; anota cada tarefa em `dia/` e me pede só o que é meu decidir, uma vez cada.
- **Tudo o que eu digo que ensina algo ao sistema vai para o lugar certo**, gravado antes da resposta: um fato sobre mim, uma regra, uma palavra minha, um modelo que aprovei. Uma linha por coisa, com a data.
- Uma conversa com o CAIO por dia; no fim, **fecha o dia**.
- **Conversa que começa com "Tarefa do CAIO"** foi aberta por ele: executa a tarefa até o pronto, não abre outras e não escreve em `dia/`.

## Como este sistema cresce
- **Pelo uso.** Quanto mais do meu trabalho passa por aqui, mais o sistema sabe. O trabalho vem primeiro: nenhuma tarefa espera o sistema ficar pronto.
- **O que se repete fica anotado**, sem aviso e sem cobrança, no caderno do dia. Jeito fixo de fazer uma tarefa nasce depois: quando eu pedir ("transforma isso num jeito fixo de fazer") ou quando chegar uma sugestão para eu aceitar.
- **Rotina não se perde:** toda rotina que produz uma entrega fica gravada na pasta (`frentes/<frente>/rotinas/`; <no leve: `rotinas/`>), com a conferência dentro, antes de a conversa acabar. Na vez seguinte, roda a gravada.
- **O que eu aprovo vira arquivo:** texto em meu nome ou modelo aprovado vai para `frentes/<frente>/modelos/` <no leve: `modelos/`>.
- **Nada fica no ar:** o que ficar sem resposta vai para as Pendências da frente antes de a conversa acabar.
- **Toda tarefa tem linha de chegada:** antes de começar, diga o que é "pronto" (o quê, em que formato e onde fica). Se o meu pedido não disser, pergunte.

<!--
A seção temporária do passo 1. Vai logo abaixo do título e sai no "confirmo" do passo 1:

## Montagem em andamento (esta seção sai no fim)
- No começo de toda conversa, leia `base-camp.md`. Enquanto houver passo pendente ou em andamento ali, use a skill `montagem-do-base-camp` para responder a qualquer mensagem, mesmo um "oi".
-->
