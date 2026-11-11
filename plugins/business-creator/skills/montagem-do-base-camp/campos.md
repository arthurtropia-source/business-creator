# Mapa de campos

> O que cada arquivo final precisa saber. Cada campo tem um código, o arquivo onde entra e o que conta como "preenchido". **Desde o Base Camp curto (01/11/2026), todos os campos são preenchidos no passo 1 (o retrato) a partir dos 2 pedidos do começo; a coluna "Vem de" diz de que pergunta da montagem longa o campo vinha, e hoje aponta para `perguntas-do-uso-real.md`**, onde essas perguntas moram, para o uso real. O que o retrato não conseguir preencher fica fora do arquivo e entra em "Falta isto" do `montagem/resumo.md`.
> Em `montagem/respostas.md`, cada campo é uma seção com o código no título (`## QUEM.trabalho`), e embaixo as respostas com a origem.
> **[leve]** = o campo também entra no nível leve.

## contexto/sobre-mim.md
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| `QUEM.nome` [leve] | como quer ser chamada | há um nome | D, 1.1 |
| `QUEM.lugar` [leve] | cidade onde está | há uma cidade | D, 1.1 |
| `QUEM.trabalho` [leve] | trabalho principal: o que faz de fato, sem dados da empresa | há o papel e pelo menos 2 atividades reais | D, 1.2 |
| `QUEM.trajetoria` [leve] | 3 ou 4 viradas da vida profissional | há pelo menos 2 viradas | D (LinkedIn, currículo), 1.3 |
| `QUEM.procuram` [leve] | em que as pessoas a procuram, com um exemplo | há um assunto e um caso | D, 1.4 |
| `QUEM.direcao` [leve] | o que muda na semana dela se der certo em um ano | há uma mudança concreta | D, 1.6 |
| `QUEM.interesses` | o que a interessa fora do trabalho | há pelo menos 1 | D, 1.7 |
| `DIA.rotina` | um dia comum | há a sequência do dia | 1.5 |
| `DIA.trabalho` | o que fez na última semana do trabalho principal | há atividades concretas | 1.2 |
| `DIA.perde-tempo` | onde vai o tempo que ela não queria gastar | há pelo menos 1 tarefa | 1.5 |

## AGENTS.md (mapa das frentes e ferramentas) e frentes/<nome>/AGENTS.md
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| `FRENTES.lista` [leve] | todas as frentes, com nome curto e uma linha | há a lista e ela confirmou | D, 2.1 |
| `FRENTE.<nome>.pessoas` [leve] | quem mais está e o papel dela | há o papel dela | D, 2.2 |
| `FRENTE.<nome>.existe` [leve] | o que já existe (planilhas, documentos, apps, IA, automações), cada item marcado em uso, a confirmar ou parado | há a lista com a marca | 2.2 |
| `FRENTE.<nome>.parado` | o que está parado e o que segura | há pelo menos 1 item ou "nada parado" | 2.2 |
| `FRENTES.prioridade` [leve] | a frente que mais quer que ande agora | há uma | 2.3, 1.6 |
| `FRENTES.dinheiro` [leve] | a frente que mais gera ou poupa dinheiro | há uma | 2.3, 3.2 |
| `FERRAMENTAS.lista` [leve] | os programas e aplicativos que ela usa no dia a dia (e-mail, agenda, WhatsApp, planilhas, Drive, Notion, sistema da empresa só pelo tipo) | há pelo menos 2 | D, 2.2, 2.5 |
| `FERRAMENTAS.dados` [leve] | onde ficam as informações mais importantes de cada frente | há o lugar de pelo menos a frente prioritária | 2.2, 2.5 |

## contexto/como-trabalhar-comigo.md e contexto/estilo-de-escrita.md
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| `JEITO.irrita` [leve] | o que estraga uma entrega para ela | há um caso | 4.1 |
| `JEITO.formato` [leve] | como ela quer receber (tamanho, ordem, opções) | há pelo menos 2 traços | 4.1, 4.2 |
| `JEITO.decide` | como ela decide | há um jeito descrito | 4.3 |
| `JEITO.horarios` | quando e de onde trabalha nas frentes | há horários ou lugares | 4.4, 1.5 |
| `AMBIENTE.computador` | Mac ou Windows e o resto: o sistema confere sozinho no inventário da 5.0 e grava em `contexto/computador.md` (não se pergunta) | a ficha existe | 5.0 |
| `VOZ.textos` | 2 ou 3 textos dela, inteiros (pedidos no uso real, quando o sistema for escrever em nome dela; fora da montagem) | há pelo menos 1 texto | uso real, D |

## memoria.md e as regras do AGENTS.md
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| `REGRAS.lista` [leve] | as regras aprovadas, com o que ela tirou, mudou ou acrescentou | ela respondeu à 5.1 | 5.1 |
| `REGRAS.sigilo` [leve] | o que não passa de uma frente para outra e o que nunca se guarda | há resposta (pode ser "nada") | 2.4, 5.1 |

## montagem/resumo.md (o cartão "O que se repete")
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| `PROC.candidatas` [leve] | até 5 tarefas repetidas, com o tempo de cada | há pelo menos 2 | 1.5, 3.1 |

## base-camp.md (Para começar) e como-usar.md
| Código | O que é | Preenchido quando | Vem de |
|---|---|---|---|
| `PRIMEIRA.pedidos` [leve] | até 3 pedidos que saem prontos com o que ela já contou | há de 0 a 3 linhas em "Para começar" do `base-camp.md` | passo 1 |

## Lista de arquivos por nível
| Arquivo | Leve | Completo |
|---|---|---|
| `CLAUDE.md` (já vem na pasta) | sim | sim |
| `AGENTS.md` (final no passo 1, com a seção temporária até o fim) | sim | sim |
| `contexto/sobre-mim.md` | sim | sim |
| `contexto/como-trabalhar-comigo.md` | sim, curto | sim |
| `contexto/estilo-de-escrita.md` | não (no uso real, quando o sistema for escrever em nome dela) | idem |
| `frentes/<nome>/AGENTS.md` | não (só o mapa no `AGENTS.md`) | sim, uma por frente |
| `contexto/computador.md` (o inventário da 5.0) | sim | sim |
| `memoria.md` | sim | sim |
| `resumo-para-o-arthur.md` | sim | sim |
| `como-usar.md` (o guia de bolso) | sim | sim |
| `base-camp.md` (o estado) | sim | sim |
| `montagem/respostas.md` (as respostas) | sim | sim |
