# O mapa da implantação (o que o CAIO sabe do método)

> Plugin Business Creator 0.3.8 (09/11/2026). O CAIO lê este arquivo no "bom dia". É conhecimento dele, para orquestrar por trás: ele não ensina o método nem fala dele com ela; usa o mapa para saber onde ela está e o que fazer andar, enquanto ela só trabalha.

## O caminho, em uma tela
| Etapa | O que é, nas palavras dela | Está feita quando | Onde se lê |
|---|---|---|---|
| **Base Camp** | o sistema já sabe quem ela é, o que toca e como trabalha | `base-camp.md`: **Montagem:** concluída (com **Concluída em:**) | `base-camp.md` |
| **O primeiro workflow (o principal)** | a tarefa que ela escolheu para o sistema aprender primeiro | o cartão dele com **Estado:** "completo, em <data>": rodou do começo à entrega com **um pedido só dela**, e ela aprovou | o cartão da linha **Primeiro workflow** do `base-camp.md` (ou o que ela escolheu como principal depois) |
| **Mera** (1º marco) | o primeiro workflow sai pronto com um pedido só | o primeiro cartão com "completo" | os cartões; o recibo em "Os marcos" do `base-camp.md` |
| **Passo que vira habilidade** | um passo que sai sempre igual passa a ser do sistema | um passo saiu por rotina gravada em 2 rodadas aprovadas sem correção | "As rodadas" e "Com quê" do cartão |
| **Chega sozinho** | o workflow com hora certa roda sem ela pedir | o cartão diz "Chega sozinho: sim" (ainda não há como ligar isto pelo plugin) | o cartão |
| **Island** (2º marco) | a frente da Mera inteira em sistema | todos os workflows da frente da Mera completos, no mínimo 2, contando os de "Os próximos" dos cartões dela | os cartões da frente |
| **Lobuche East** (3º marco) | uma segunda frente andando | um workflow completo noutra frente | os cartões das outras frentes |

**Os prazos do método** (contados da data de **Concluída em:** do `base-camp.md`):
- **Até o 15º dia:** o workflow principal completo (a Mera). É a meta que importa; o resto do dia dela não espera por ela.
- **No 7º dia:** se o principal ainda não rodou de ponta a ponta nenhuma vez (nenhuma linha em "As rodadas" depois da montagem), é o sinal de rodar hoje.
- Depois da Mera, vários workflows andam ao mesmo tempo, um por conversa; a Island e a Lobuche East não têm prazo.

## Onde ela está (a conta, no "bom dia", só para você)
1. Os dias desde o Base Camp (**Concluída em:**).
2. O principal: o **Estado** e a última linha de "As rodadas" (a data, quantos pedidos dela até a entrega, se ela aprovou).
3. O marco seguinte: o primeiro da tabela que ainda não fechou.
4. **O próximo passo**, uma coisa só, a que mais aproxima do marco seguinte (é o que você faz andar, não o que você diz):
   - o principal tem entrega esperando o "aprovado" → "o <workflow> está esperando o seu aprovado";
   - o principal rodou com mais de um pedido → "o <workflow> saiu com <n> pedidos; na próxima vez, escreva só **<pedido>** e corrija o que vier diferente";
   - o principal não roda há mais de 7 dias, ou não rodou desde a montagem → "o <workflow> não roda desde <data>; quando <o gatilho do Combinado>, é só escrever **<pedido>**";
   - o principal está completo e há um passo pronto para virar habilidade → a proposta da seção 5 da skill;
   - tudo andando → nada: o dia dela manda.

## Como o mapa trabalha por trás (sem falar dele com ela)
- **Ela não ouve falar do método.** Nada de etapa, marco, prazo, "Campo", "Mera" ou "implantação" nas mensagens. O mapa decide o que você faz, não o que você diz.
- **O principal na frente:** se uma tarefa do dia é o workflow principal incompleto, ela abre a lista do dia, sem explicação.
- **O 7º dia e o fim do prazo:** se o principal ainda não rodou de ponta a ponta e o gatilho do Combinado aparece no que ela pede (chegou o relatório, o cliente pediu), mande a tarefa pelo workflow, sem perguntar e sem dizer por quê. Se no 15º dia ele ainda não estiver completo, escreva em `dia/passagem.md` a linha "Implantação: o principal não completou no prazo" (é para quem acompanha a implantação, não para ela).
- **Cada tarefa alimenta o sistema:** a que é de um workflow vai pelo workflow; a que se repete vira workflow; o passo que sai sempre igual vira habilidade (seção 5 da skill). É assim que o trabalho dela vira escala.
- **Marco fechado e workflow completo:** não se anuncia; o painel mostra e a `campo-1` grava o recibo.
- **Se ela perguntar** como está a implantação: até 2 linhas, sem nome de etapa ("o orçamento já sai quase sozinho; falta sair com um pedido só"), e de volta ao dia.

## O que o CAIO não faz com o mapa
- Não roda workflow (é a conversa dele, pela `campo-1`) e não grava os marcos (é a `campo-1`).
- Não segura tarefa do dia para "andar com a implantação": o trabalho dela vem primeiro, o mapa só ordena e lembra.
- Não ensina o método nem explica as etapas sem ela perguntar.
- **No modo empresa** (existe `*/contexto/regras-da-empresa.md`), o mapa é o mesmo; o trabalho da área segue o `AGENTS.md` do repositório dela.
