# As perguntas do uso real (a reserva da montagem longa)

> Versão 1.0 (01/11/2026), no plugin Business Creator 0.2.12. Eram as 32 perguntas das etapas 1 a 5 do roteiro 2.0; desde o Base Camp curto, **não se fazem na montagem**. O sistema pergunta no momento em que precisa, **uma pergunta por conversa**, no fim da resposta, depois de entregar o que ela pediu, e grava a resposta em `montagem/respostas.md` (o código de `campos.md`) e no arquivo certo. Tudo o que o retrato já respondeu, não se pergunta de novo.
> A lista do que falta fica em "Falta isto" do `montagem/resumo.md`, que o painel mostra como "o que o sistema ainda vai aprender com você". Ao responder, tire da lista.

## A regra
1. **Só quando a tarefa precisar.** Nada de perguntar para completar ficha: a pergunta nasce de uma entrega que ficaria melhor com a resposta.
2. **Uma por conversa, no fim**, depois da entrega, em uma linha: "Para a próxima vez: <a pergunta>." Se ela não responder, não insista; volta noutra conversa.
3. **Peça fatos**, uma vez recente, um exemplo; nunca autoavaliação.
4. **A resposta vira arquivo na hora** (o `sobre-mim.md`, a ficha da frente, o cartão do workflow, o `como-trabalhar-comigo.md`) e, quando é regra, o `memoria.md`.

## Quando o sistema for escrever em nome dela
- "Me manda 2 ou 3 textos seus que têm a sua cara: uma mensagem, um e-mail, um post. Com eles eu escrevo do seu jeito." → `VOZ.textos`; escreva `contexto/estilo-de-escrita.md` (modelo `modelos/estilo-de-escrita.md`) e aponte do `AGENTS.md` da raiz.

## Quando uma tarefa tocar uma frente pela primeira vez
- "Nessa frente, o que já existe: planilhas, documentos, pastas, apps, conversas salvas com IA? Disso, o que você usa de verdade?" → `FRENTE.<nome>.existe` (marcar em uso, a confirmar ou parado), `FERRAMENTAS.dados`.
- "Onde ficam as informações mais importantes dela?" → `FERRAMENTAS.dados`.
- "O que está parado ou atrasado nela, e o que está segurando?" → `FRENTE.<nome>.parado`.
- "Quem mais está nela com você, e qual é o seu papel?" (só o papel, sem nomes de colegas ou clientes) → `FRENTE.<nome>.pessoas`.

## No Campo 1, o primeiro workflow (a skill `campo-1` faz estas)
- "Quando essa tarefa estiver pronta, como você sabe que ficou certa? O que não pode faltar?" → `PROC.pronto`.
- "O que pode travar: depende de alguém aprovar, de um acesso, de uma informação que não está com você?" → `PROC.dependencias`.
- "Quanto tempo levou da última vez, e quando foi? Se puder, cronometre a próxima." → `PROC.antes` (medido, no lugar da estimativa).
- Cada passo detalhado: o que entra, o que ela olha, o critério, as exceções, o que sai (na skill `campo-1`).

## Quando o sistema for decidir algo por ela, ou propor opções
- "Quando você decide algo importante, como faz? Sozinho, conversa com alguém, pede opções, dorme em cima?" → `JEITO.decide`.

## Quando uma entrega dela sair errada, ou ela corrigir o formato
- "Me conta a última vez que uma entrega de alguém te irritou: o que estava errado?" → `JEITO.irrita`, `JEITO.formato`.
- "E a última vez que alguém te entregou exatamente o que você precisava: como era?" → `JEITO.formato`.

## Quando aparecer um assunto delicado
- "Tem algum assunto que eu nunca devo guardar nem repetir, em nenhuma frente?" → `REGRAS.sigilo`; vai para "O que nunca se guarda" do `AGENTS.md` e para o `memoria.md`.

## Com o tempo, uma por conversa, quando a conversa der abertura
- "Quais foram as 3 ou 4 viradas que te trouxeram até aqui?" → `QUEM.trajetoria`.
- "Em que assunto as pessoas mais te procuram? Lembra de uma vez recente?" → `QUEM.procuram`.
- "Como é um dia comum seu, do acordar até desligar? Onde vai o tempo que você não queria gastar?" → `DIA.rotina`, `DIA.perde-tempo`, `PROC.candidatas`.
- "Em que horários e de onde você trabalha nas suas frentes?" → `JEITO.horarios`.
- "Se daqui a um ano tudo tiver dado certo, o que mudou na sua semana?" → `QUEM.direcao`.
- "Fora do trabalho, o que te interessa de verdade?" → `QUEM.interesses`.
- "Se você só pudesse fazer andar uma frente neste mês, qual seria? E qual mais gera ou poupa dinheiro?" → `FRENTES.prioridade`, `FRENTES.dinheiro` (se o retrato não deixou claro).

## Quando ela trocar de conversa no meio de algo longo
- Nada a perguntar: as regras de retomada estão na `SKILL.md` ("Como começar ou retomar") e no `base-camp.md`, em "Em aberto".
