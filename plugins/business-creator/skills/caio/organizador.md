# O organizador: para onde vai cada coisa que ela diz
> Lido uma vez por conversa. Vale na conversa do CAIO; nas conversas de tarefa valem as mesmas linhas, pelo estilo de resposta.

| O que chega dela | Para onde vai | O que ela ouve |
|---|---|---|
| um fato sobre ela, a trajetória, o que quer alcançar | `contexto/sobre-mim.md`, na seção do assunto | "anotei" |
| como gosta de receber, o que irrita numa entrega | `contexto/como-trabalhar-comigo.md` | "anotei" |
| um texto dela, uma correção de tom | `contexto/estilo-de-escrita.md` (crie pelo modelo, se não existir) | "anotei" |
| "daqui pra frente faça assim", valendo para tudo | `memoria.md`, no formato `- AAAA-MM-DD: regra` | "virou regra" |
| a mesma correção, mas de uma frente só | a ficha da frente, "Regras desta frente" | "virou regra dessa frente" |
| um fato de uma frente: quem participa (só o papel), que ferramenta, onde ficam os dados | a ficha da frente, "O que é" ou "O que já existe" | "anotei" |
| uma palavra com sentido próprio | "Palavras minhas" da frente | "anotei" |
| um arquivo que ela manda | `frentes/<frente>/recebidos/`, nunca solto na raiz | o caminho, em meia linha |
| um arquivo que a tarefa produz | `frentes/<frente>/entregas/`, com a data no nome | o caminho, em meia linha |
| um texto ou formato que ela aprovou | `frentes/<frente>/modelos/`, e uma linha em "Modelos aprovados" | "guardei como modelo" |
| o passo a passo que produziu uma entrega | `frentes/<frente>/rotinas/`, com a conferência dentro, e uma linha em "Rotinas" | "guardei o passo a passo" |
| algo que ficou sem resposta | Pendências da frente | nada |
| uma escolha que é dela | `dia/fila.md`, com número | a decisão, no fim da resposta |
| cada pedido | `dia/tarefas-AAAA-MM.md`, com `repete: n` quando repete | nada |
| algo que ela fez ou vai fazer fora daqui | `dia/tarefas-AAAA-MM.md`, com `via: fora (<o tipo>)` | nada |
| um assunto que não cabe em nenhuma frente | proposta de frente nova, na fila | a pergunta, uma vez |
| algo que ela não quer guardado | "O que nunca se guarda", no `AGENTS.md` da raiz; o conteúdo não se grava | "não guardei" |
| uma queixa ou ideia sobre o sistema | `dia/pedidos-sobre-o-kit.md`, `- dd/mm · texto` | "anotei para o Arthur" |

## Regras
1. **Só o que ela disse ou fez.** Nada deduzido entra como fato. O que você concluiu sozinho não se grava.
2. **Uma linha por coisa, acrescentada no fim da seção certa, terminando com a data entre parênteses:** `(11/11/2026)`. Nunca reescreva o arquivo inteiro nem reordene o que ela escreveu. No `memoria.md`, a data vai no começo, como o arquivo já pede.
3. **Grave antes de responder.** O que fica só na conversa se perde.
4. **No máximo meia linha de aviso por resposta**, com a palavra da tabela, sem nome de arquivo (a não ser que ela use). Três coisas anotadas numa mensagem: "anotei as três".
5. **Em dúvida entre duas frentes, pergunte em uma linha.** Nunca escolha em silêncio.
6. **O sigilo dela e o da empresa valem aqui:** a função, nunca o nome de colega, chefe ou cliente; sem número longo, e-mail ou telefone; assunto pessoal que ela não pediu para guardar não entra. No modo empresa, dado da empresa fica onde o arquivo de regras manda.
7. **No nível leve** (sem pasta por frente), a ficha da frente é o `AGENTS.md` da raiz, e `recebidos/`, `entregas/`, `modelos/` e `rotinas/` ficam na raiz.
8. **Se a mesma coisa já está gravada,** não repita a linha. Se ela mudou de ideia, a linha nova entra e a antiga ganha "(valia até <data>)" no fim; nada se apaga.
