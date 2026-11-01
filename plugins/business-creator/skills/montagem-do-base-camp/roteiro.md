# Roteiro da Montagem do Base Camp

> Versão 3.0 (01/11/2026), no plugin Business Creator 0.2.12: **o Base Camp curto**, em 3 passos e um "confirmo" (decisão do Arthur, 01/11/2026, pela regra padrão do onboarding: curto, com o valor na próxima coisa que a pessoa já ia fazer). As perguntas da montagem longa viraram a reserva do uso real: `perguntas-do-uso-real.md`.
> Para a pessoa, as partes são **passos** ("passo 2 de 3"). Os códigos internos: **D** (o começo), **1** (o retrato), **2** (a primeira tarefa). Tempo-alvo total: 20 a 35 minutos, dos quais 5 a 15 são dela no começo.
> **[leve]** = vale também no nível leve. No curto, a diferença entre os níveis é só o mapa das frentes: no leve, até 2 frentes e sem pasta por frente.

---

## Abertura (mandar assim, palavra por palavra)

> **Boas-vindas ao seu Base Camp.**
> Antes de subir qualquer montanha, a gente monta o acampamento. É aqui que o seu sistema passa a saber quem você é, o que você toca e como você trabalha, para parar de te pedir as mesmas explicações.
>
> São 3 passos, uns 30 minutos, e você só responde. Eu monto o seu sistema, te mostro para você confirmar e, no fim, ele já faz a primeira tarefa para você. Pode responder por voz (o ditado do computador: no Mac, a tecla do microfone; no Windows, Windows + H), solto, do jeito que vier. Dá para parar quando quiser: eu guardo onde paramos.
>
> **Para começar, são só 2 pedidos.**
>
> **1. O que a IA que você mais usa já sabe sobre você.** Copie o texto abaixo (o botão de copiar fica no canto da caixa), cole no ChatGPT, no Gemini ou no Claude do navegador, e traga a resposta para cá:
>
> ```text
> Estou montando um sistema de trabalho com IA e quero que ele me conheça tão bem quanto você. Conte a minha história como se estivesse me apresentando a um assistente novo que vai trabalhar comigo todos os dias: com contexto, exemplos reais das nossas conversas, detalhes, o porquê das coisas e como elas funcionam na prática. Use tudo o que está na sua memória e nas nossas conversas. Quanto mais detalhe útil, melhor; deixe de fora só o que não ajuda a trabalhar comigo.
>
> Escreva em parágrafos, nestas seções:
> 1. Quem eu sou: a minha trajetória, o que eu faço hoje, o meu papel e o que me move.
> 2. Cada coisa que eu toco (trabalho, negócios, projetos, estudos, casa): o que é, como funciona, quem está envolvido (só o papel, sem nomes), em que pé está, o que anda, o que travou e por quê.
> 3. Como são o meu dia e a minha semana: as rotinas, as tarefas que se repetem, quanto tempo elas tomam e onde eu perco tempo.
> 4. O que eu já te pedi mais de uma vez: os pedidos que se repetem, com exemplos de como eu pedi e do que eu esperava receber.
> 5. Como eu trabalho e decido: os meus critérios, os padrões que eu exijo, o que me irrita numa entrega e o que me agrada, com exemplos.
> 6. Como eu escrevo e como gosto de receber respostas: as regras que eu já te dei, com as minhas palavras.
> 7. As ferramentas e os dados que eu uso: programas, sistemas, planilhas, e onde ficam as informações de cada coisa.
> 8. O que eu quero alcançar: metas, prazos e o que eu disse sobre o futuro.
>
> Depois de cada fato, ponha entre parênteses quando ele apareceu pela última vez (mês e ano, ou "sem data"), e marque "(deduzido)" no que você concluiu sem eu ter dito. Coisas mudam: se algo pode ter ficado para trás, diga. Não invente. Deixe de fora saúde, finanças pessoais, senhas, documentos, números de conta, assuntos íntimos de família e dados de clientes ou da empresa onde eu trabalho (números, nomes de colegas e de clientes).
>
> Entregue tudo num único bloco de código, para eu copiar com um clique.
> ```
>
> **2. Enquanto a outra IA escreve, me conte com as suas palavras**, escrevendo ou por voz, uns 5 minutos: quem você é e o que você faz; tudo o que você toca hoje; a tarefa que você repete e que toma o seu tempo; e como você gosta de receber as coisas.
>
> Quando tiver as duas coisas, mande aqui e escreva **terminei**. Se você não usa nenhuma outra IA, mande só o pedido 2.

- **Se a pasta tiver o painel** (você sabe pela sua lista de ferramentas: a ferramenta `teste_do_base_camp` vem com ele; não precisa conferir a pasta), acrescente uma linha antes de "Para começar": "Ao lado da conversa abriu o painel do Base Camp: ele mostra onde você está, o que o seu sistema já sabe e o que vem a seguir. Se ele não aparecer, escreva /base-camp."
- **Nada antes da abertura:** ela é a primeira coisa que a pessoa lê; sem frase sua antes dela ("Estou abrindo...", "Segue o texto...").
- **O texto do pedido 1 vai sempre numa caixa de código** (entre três crases, com `text`), sozinho, como acima: é ela que mostra o botão de copiar no app. Nada dentro da caixa além do texto a copiar. A abertura vai como texto normal, sem as marcas de citação (`>`) que ela tem neste roteiro.
- **Sem escolha na abertura** (decisão do Arthur, 31/10/2026: "o mínimo de decisões possíveis para o usuário e o máximo de orientações objetivas"). Nada de caixa de opções nem de "você prefere". Registre o início do passo D na mesma resposta da abertura.

---

## Passo D: o começo (5 a 15 min, dela) [leve]
**Arquivo:** nenhum (só `montagem/respostas.md`). **Fecha quando:** ela escrever "terminei" ou disser que acabou.

- Enquanto ela manda, **não pergunte nada**: grave em `respostas.md` e responda só "Anotado. Pode seguir; quando acabar, escreva terminei."
- **O que ela fala ou escreve hoje vale mais que a memória da outra IA** (regra do Arthur, 31/10/2026). O que ela contar entra como `[despejo]`. O que vier da outra IA entra como `[memória de outra IA, a confirmar]`, com a marca [eu disse] ou [deduzido] e a data que a outra IA deu. **Em conflito, ganha a fala dela**, sem perguntar: o item da outra IA sai.
- **Detalhe útil fica, ruído sai:** grave em `respostas.md`, no campo certo de `campos.md`, cada detalhe que ajuda a trabalhar com ela (exemplos, critérios, o porquê, como funciona, números de tempo e frequência), com as palavras do texto. Fica de fora o que não serve ao sistema: assunto pontual, traço genérico, o que é sigilo.
- Se ela mandar só um dos dois, siga com o que veio: não peça o outro.
- **Não procure a pessoa na internet** (LinkedIn, Google) nem use ferramenta que ela não tenha pedido: o que entra é o que ela manda.

**Ao "terminei":** feche o passo D e abra o passo 1 na mesma resposta.

---

## Passo 1: o retrato, montado de uma vez (3 a 5 min do sistema, 1 resposta dela) [leve]
**Arquivos:** todos os do sistema dela, escritos de uma vez a partir de `respostas.md`, pelos modelos de `modelos/`:
- `contexto/sobre-mim.md` (modelo `sobre-mim.md`): só o que veio; o que não veio fica fora, sem "a completar" na cara dela;
- `contexto/como-trabalhar-comigo.md` (modelo `como-trabalhar-comigo.md`): o formato inferido do que ela escreveu, de como ela escreveu e do que a outra IA registrou;
- o mapa das frentes e as ferramentas (`montagem/mapa-das-frentes.md`, seções do modelo `AGENTS-raiz.md`) e, no completo, `frentes/<nome>/AGENTS.md` de cada frente (modelo `frente-AGENTS.md`), com `CLAUDE.md` de uma linha ao lado; nomes curtos de pasta, sem espaço nem acento; no leve, até 2 frentes, só no mapa;
- `memoria.md` (modelo `memoria.md`) e `montagem/regras.md` com as 7 regras da casa padrão, a regra do formato tirada do que ela disse, e o sigilo que ela citou (a regra 7, dos dados da empresa, só se ela trabalha numa empresa de outra pessoa);
- `contexto/computador.md`: o inventário pela skill `rotinas-e-computador` (seção 5), um comando de cada vez, sem pergunta;
- **o cartão do primeiro workflow**, em `frentes/<frente>/workflows/<nome-curto>.md` (no leve, `workflows/`), modelo `workflow.md`: **você escolhe** a tarefa entre as que se repetem (`PROC.candidatas`, o que ela pediu mais de uma vez à outra IA, onde perde tempo), pelos critérios: gera ou poupa dinheiro; repete pelo menos uma vez por semana ou por mês; as informações estão no computador ou num lugar que ela acessa; o resultado dá para conferir; não depende de outra pessoa aprovar; não usa dados da empresa sem autorização. O começo, a entrega e os passos como ela contou; o "antes" estimado (marcado "estimativa, pela outra IA" ou "pela fala dela"); o que não veio fica "a completar no Campo 1";
- o `AGENTS.md` da raiz, final, pelo modelo `AGENTS-raiz.md`, **com a seção temporária "Montagem em andamento"** (sai no fim do passo 2);
- `montagem/resumo.md`, no formato abaixo, que o painel mostra em cartões.
Grave no `base-camp.md`, logo abaixo da linha **Montagem:**, a linha `- **Primeiro workflow:** \`<caminho do cartão>\`` (é assim que o painel o encontra).

**O teste "quem sou eu", sozinho:** com a ferramenta `teste_do_base_camp`, pergunte "quem sou eu e quais são as minhas frentes?" e, no completo, "escreva uma mensagem curta apresentando o meu trabalho em <a frente prioritária>". Passa se acertar o nome, o trabalho principal e as frentes, sem inventar, e se nada de outra frente ou do sigilo aparecer. Marque no `base-camp.md`, em Testes, "passou" ou "não passou: <o motivo>"; se não passou, corrija o arquivo que causou e repita, antes de mostrar o retrato. Sem a ferramenta, marque "não feito" e siga.

**O `resumo.md`**, neste formato exato (os cartões seguem os assuntos dela; até 3 linhas por cartão; em dúvida, `(?)` no começo da linha):
```
# O que o sistema já sabe

## Já sei isto
### Quem você é
- <frase completa, com os detalhes que importam>
- (?) <ponto da outra IA em dúvida> · da outra IA, de <mês/ano ou sem data>
### O que você toca
### O que se repete
### Como você trabalha e gosta de receber
### As regras da casa
- <as 7 regras numa linha: "as 7 regras padrão; nada sai do computador sem o seu ok; <o sigilo que ela citou>">
### O primeiro workflow (sugerido)
- <o nome; do começo à entrega em uma linha; por que este>
- <"hoje leva <antes>, <vezes> por mês (estimativa)">
### Aonde quer chegar

## Falta isto
- <até 6 linhas: o que o sistema ainda vai aprender com ela no uso real, em palavras simples; tirado de perguntas-do-uso-real.md>
```
Os pontos em dúvida são os deduzidos pela outra IA, os com mais de 3 meses ou sem data, e os que podem ter sido mal entendidos. **Nenhum ponto da outra IA some sem ela ver**, a não ser o que a fala dela contradisse.

**Na conversa, uma mensagem só**, depois de tudo gravado:
> "Montei o seu retrato com o que você mandou. Está no painel ao lado, em cartões; os pontos com ? vieram da outra IA e podem ser antigos. O primeiro workflow que eu sugiro é <o nome>: <por quê, em uma linha, com os números dela>.
> ---
> **Corrija o que quiser, numa resposta só, escrevendo ou por voz. Se estiver tudo certo, escreva confirmo.**"
- Sem o painel (celular, terminal), mande antes do `---` os cartões em até 10 linhas.
- **Sem caixa de opções e sem pergunta item por item** (decisão do Arthur, 31/10/2026). O que ela não corrigir vale.

**Ao "confirmo" ou às correções:** grave as correções nos arquivos e no `resumo.md` (tire o `(?)` do que ela confirmou; apague o que não vale mais; o que ela corrigiu entra como `[confirmado]`); o que ela não tocou vira `[memória de outra IA, confirmado em <data>]`. Marque o passo 1 "aprovado" e abra o passo 2 na mesma resposta. Se ela aprovar sem ler ("confirmo" em menos de um minuto, ou dizendo que não leu), anote em "Pedidos sobre o kit": "retrato confirmado sem ler".

---

## Passo 2: a primeira tarefa feita, e o combinado (5 a 10 min) [leve]
**Arquivos:** o resultado da tarefa em `frentes/<frente>/modelos/` (no leve, `modelos/`), `como-usar.md` (modelo `como-usar.md`), `resumo-para-o-arthur.md` (modelo `resumo-para-o-arthur.md`), `base-camp.md` concluído.

2.1 [leve] **Uma tarefa, proposta por você, e já feita** (decisão do Arthur, 01/11/2026: "o sistema propõe uma e já faz"). Escolha a menor tarefa real que cabe em 5 minutos e mostra o sistema trabalhando do jeito dela: de preferência um passo do primeiro workflow com um caso real que ela citou, ou o que ela mais pediu à outra IA. Nada que mande algo para fora do computador nem que use dados da empresa sem autorização. Faça, seguindo as regras dela (o formato, o sigilo, o rascunho em vez do envio; se mexer em arquivo ou planilha, a skill `rotinas-e-computador`). Na conversa:
> "Fiz a sua primeira tarefa: <o quê, em uma linha>, do seu jeito.
> <o resultado, inteiro se couber em 15 linhas; senão, o começo e onde ficou>
> Guardei como modelo. **Combinado:** quando <o começo do workflow> chegar, abra esta pasta e escreva **<o pedido curto>**.
> ---
> **Ficou bom? Se preferir outra tarefa, diga qual.**"
- Grave a tarefa e o combinado no `base-camp.md`, em "Primeiras tarefas": a linha "- <a tarefa>", a linha **Feita:** (sem traço) e a linha **Combinado:** (sem traço). O combinado é proposto por você, preso ao gatilho do workflow (quando a tarefa chegar), com o pedido curto que ela vai escrever; ela só corrige se quiser.
- Se ela pedir outra tarefa, faça a outra e troque a linha. Se ela corrigir o resultado, corrija, mostre o trecho e grave a correção como regra no `memoria.md` e no cartão do workflow, em "O que o sistema aprendeu".

2.2 [leve] **Sem perguntar, na mesma resposta do "ficou bom":** escreva `como-usar.md` (com o combinado e o pedido curto em "Pedidos que já funcionam") e `resumo-para-o-arthur.md`; tire do `AGENTS.md` da raiz a seção "Montagem em andamento"; marque tudo como concluído no `base-camp.md`, com a soma dos tempos; e mande:
> "**Base Camp montado**, em <n> minutos. O seu sistema já sabe quem você é, o que você toca e como você trabalha, e já fez a primeira tarefa para você. O guia de bolso e o resumo para o Arthur estão no painel.
> O próximo passo é o Campo 1: detalhar o seu primeiro workflow passo a passo e rodá-lo de ponta a ponta comigo. É só clicar em **Rodar o meu primeiro workflow** no painel, ou escrever **vamos rodar o primeiro workflow**.
> Business Creator powered by SEM IA™. Um sistema, qualquer IA."

---

## O que não está aqui
As perguntas da montagem longa (quem é você, as frentes, como você trabalha, o estilo de escrita, o detalhe do workflow) estão em `perguntas-do-uso-real.md`, com o momento em que cada uma aparece. **Na montagem, não as faça.** No uso real, uma por conversa, só quando a tarefa precisar.
