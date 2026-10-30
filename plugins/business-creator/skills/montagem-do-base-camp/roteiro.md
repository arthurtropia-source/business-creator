# Roteiro da Montagem do Base Camp

> Versão 1.6 (30/10/2026), no plugin Business Creator 0.2.1. Cada pergunta diz os campos que alimenta (códigos de `campos.md`). **[leve]** = entra também no nível leve; sem a marca, só no completo. Antes de cada pergunta, confira os campos (regra "uma resposta adianta outras" da `SKILL.md`).
> Para a pessoa, as partes da montagem se chamam **etapas** ("Etapa 2 de 6"); "bloco" é só o nome interno deste roteiro.
> Tempo-alvo por etapa, para a pessoa que responde: entre parênteses. É alvo, não regra: nunca apresse ninguém.

---

## Abertura (mandar assim, palavra por palavra)

> **Boas-vindas ao seu Base Camp.**
> Antes de subir qualquer montanha, a gente monta o acampamento. É aqui que o seu sistema passa a saber quem você é, o que você toca e como você trabalha, para parar de te pedir as mesmas explicações.
>
> São 6 etapas curtas, e você só responde. Eu escrevo os arquivos e te mostro cada um para você aprovar. Pode responder por voz (o ditado do computador: no Mac, a tecla do microfone; no Windows, Windows + H), solto, do jeito que vier, e pular qualquer pergunta. Dá para parar quando quiser: eu guardo onde paramos. No fim, o seu sistema já faz a primeira tarefa para você.
>
> Para começar, você prefere:
> **1.** me contar do seu jeito quem você é e o que você toca hoje (pode colar o seu LinkedIn, um currículo ou o que outra IA sabe sobre você), e eu só pergunto o que faltar; ou
> **2.** que eu vá perguntando, uma coisa de cada vez?

- **Se a pasta tiver o painel** (você sabe pela sua lista de ferramentas: a ferramenta `teste_do_base_camp` vem com ele; não precisa conferir a pasta), acrescente uma linha antes das duas opções: "Ao lado da conversa abriu o painel do Base Camp: ele mostra a sua subida, o que o seu sistema já sabe e o que vem a seguir. Se ele não aparecer, escreva /base-camp."
- **A escolha 1 ou 2 é fechada:** se você tiver a ferramenta de pergunta com opções, use-a (veja "Escolhas com clique" na `SKILL.md`).
- Se ela escolher **1**, faça a etapa D. Se escolher **2**, pule para a etapa 1 e marque a D como "pulado".
- Se ela já começar contando, isso é o "conte do seu jeito": siga a etapa D.

---

## Etapa D: conte do seu jeito (5 a 15 min) [leve]
**Arquivo:** nenhum (só `montagem/respostas.md`). **Fecha quando:** ela disser que terminou.

D.1 [leve] "Pode mandar. Vale tudo: um áudio falando por uns 5 minutos de quem você é e do que toca, o texto do seu LinkedIn, um currículo, uma bio. Quando acabar, escreva 'terminei'."
- Se ela quiser trazer o que outra IA já sabe sobre ela, dê este pedido para ela colar no ChatGPT, no Gemini ou no Claude do navegador, e trazer a resposta:

> "Liste tudo o que você sabe sobre mim a partir das nossas conversas: quem eu sou, o que faço, meus projetos, como eu gosto de trabalhar e de receber respostas, e os programas e aplicativos que eu uso. Separe em duas listas: o que eu disse com todas as letras e o que você deduziu. Coloque a data aproximada de cada item, se souber. Deixe de fora saúde, finanças pessoais e assuntos íntimos de família."

- O que vier da outra IA entra como `[memória de outra IA, a confirmar]` e só vale depois que ela confirmar, nas perguntas das etapas.

**Ao terminar:** distribua tudo pelos campos de `campos.md` e diga, em até 4 linhas, o que já ficou claro e que parte das próximas perguntas vira confirmação rápida. **Não prometa um número de perguntas** (no teste, a promessa de "4 perguntas" virou 7). Não mostre a lista de campos.

---

## Etapa 1: quem é você (15 a 25 min) [leve]
**Arquivo:** `contexto/sobre-mim.md` (modelo `modelos/sobre-mim.md`).
**Abra com:** "Etapa 1 de 6: quem é você. Leva uns 20 minutos, e sai o arquivo que o seu sistema lê sobre você no começo de toda conversa."

1.1 [leve] "Como você gosta de ser chamado? E em que cidade você está hoje?" → `QUEM.nome`, `QUEM.lugar`
1.2 [leve] "Qual é o seu trabalho principal hoje? Me conte como foi a sua última semana nele: o que você fez de fato. Sem nomes nem números da empresa." → `QUEM.trabalho`, `DIA.trabalho`
1.3 [leve] "Quais foram as 3 ou 4 viradas que te trouxeram até aqui? Uma linha para cada." → `QUEM.trajetoria`
1.4 [leve] "Em que assunto as pessoas mais te procuram para pedir ajuda? Lembre de uma vez recente: quem era e o que pediu." → `QUEM.procuram`
1.5 "Como é um dia comum seu, do acordar até desligar? Em que parte vai o tempo que você não queria gastar?" → `DIA.rotina`, `DIA.perde-tempo`, `PROC.candidatas`
1.6 [leve] "Se daqui a um ano tudo tiver dado certo, o que mudou na sua semana?" → `QUEM.direcao`
1.7 "Fora do trabalho, o que te interessa de verdade? (o que você lê, assiste, pratica)" → `QUEM.interesses`

**Feche** como diz a `SKILL.md` (conferir os campos, mostrar o arquivo, aprovação explícita).

---

## Etapa 2: as suas frentes (20 a 40 min) [leve]
**Arquivos:** o mapa das frentes no `AGENTS.md` (modelo `modelos/AGENTS-raiz.md`, seções "Mapa das frentes" e "Ferramentas que eu uso"; escreva agora só essas seções, num rascunho em `montagem/mapa-das-frentes.md`, e monte o `AGENTS.md` completo na etapa 6) e, no completo, `frentes/<nome>/AGENTS.md` de cada frente (modelo `modelos/frente-AGENTS.md`).
**Abra com:** "Etapa 2 de 6: as suas frentes. Frente é tudo o que você toca e que anda em paralelo: o trabalho principal, um negócio, um projeto, um estudo, a casa. Leva uns 30 minutos, e sai o mapa das suas frentes."

2.1 [leve] "Liste tudo o que você toca hoje, mesmo o que está parado. Só o nome e uma linha de cada." → `FRENTES.lista`
- No leve: "Dessas, quais são as 2 que você mais quer que andem agora?" e siga só com essas 2. As outras entram no mapa com uma linha e "fora da montagem por enquanto".
- Para cada frente, um nome curto, sem espaço nem acento, para a pasta (ex.: `consultoria`, `trabalho`, `restaurante`). Sugira e confirme com ela.

2.2 [leve] Para cada frente, uma ficha curta, numerada:
> "Sobre **<frente>**:
> 1. quem mais está nela com você, e qual é o seu papel?
> 2. o que já existe: planilhas, documentos, pastas, apps, conversas salvas com IA, alguma automação? Disso, o que você usa de verdade hoje?
> 3. o que está parado ou atrasado, e o que está segurando?"
→ `FRENTE.<nome>.pessoas`, `FRENTE.<nome>.existe`, `FRENTE.<nome>.parado`
- No leve, só os itens 1 e 2.
- Para cada coisa que existe, marque com ela: **em uso**, **a confirmar** ou **parado**. Não presuma.

2.3 [leve] "Se você só pudesse fazer andar uma delas neste mês, qual seria? E qual delas mais gera ou poupa dinheiro hoje?" → `FRENTES.prioridade`, `FRENTES.dinheiro`
2.4 [leve] "Tem alguma coisa que não pode passar de uma frente para outra? Por exemplo: dados da empresa onde você trabalha, números de um cliente, assuntos da família." → `REGRAS.sigilo`
2.5 [leve] "No dia a dia, que programas e aplicativos você usa para tocar essas frentes? (e-mail, agenda, WhatsApp, planilhas, Drive, Notion, algum sistema da empresa...) E onde ficam as informações mais importantes de cada uma?" → `FERRAMENTAS.lista`, `FERRAMENTAS.dados`
- Se ela já citou várias nas fichas, vira confirmação: "Pelo que você contou, você usa X, Y e Z. Falta alguma?"
- Sistema da empresa entra só pelo tipo ("o sistema de gestão da empresa"), nunca com dados de dentro dele.

**Feche** mostrando o mapa e as ferramentas (e, no completo, cada `frentes/<nome>/AGENTS.md`, inteiro). Antes de mostrar, explique em uma linha: "Cada frente ganhou uma ficha, o arquivo `AGENTS.md` da pasta dela: é o que o sistema lê antes de trabalhar naquela frente."

---

## Etapa 3: como você trabalha (10 a 20 min) [leve]
**Arquivos:** `contexto/como-trabalhar-comigo.md` (modelo `modelos/como-trabalhar-comigo.md`) e, no completo, `contexto/estilo-de-escrita.md` (modelo `modelos/estilo-de-escrita.md`).
**Abra com:** "Etapa 3 de 6: como você trabalha. Leva uns 15 minutos, e sai o que faz o sistema te entregar as coisas do seu jeito."

3.1 [leve] "Conte a última vez que uma entrega de alguém te irritou: um relatório, uma resposta, um trabalho. O que estava errado?" → `JEITO.irrita`, `JEITO.formato`
3.2 [leve] "E a última vez que alguém te entregou exatamente o que você precisava. Como era?" → `JEITO.formato`
3.3 "Quando você tem de decidir algo importante numa das frentes, como faz? Decide sozinho, conversa com alguém, pede opções, dorme em cima?" → `JEITO.decide`
3.4 "Em que horários e de onde você trabalha nas suas frentes? (no computador à noite, no celular no trânsito, no fim de semana...) E o seu computador é Mac ou Windows?" → `JEITO.horarios`, `AMBIENTE.computador`
3.5 "Cole aqui 2 ou 3 textos que você escreveu e que têm a sua cara: uma mensagem, um e-mail, um post. Se preferir, grave um áudio explicando algo do seu trabalho para alguém." → `VOZ.textos`
- Guarde os textos inteiros em `respostas.md`, sem editar. O `estilo-de-escrita.md` descreve o jeito dela a partir deles (frases curtas ou longas, palavras que ela usa, o que ela nunca escreveria), com 1 ou 2 trechos dela como exemplo.

**Feche** mostrando o(s) arquivo(s).

**A troca de conversa (depois da etapa 3 aprovada):** primeiro, **feche tudo o que estiver pendente**: nenhuma pergunta sua pode ficar sem resposta (no teste, uma pergunta feita na mesma mensagem da troca se perdeu). Se ainda assim sobrar alguma, grave-a no `base-camp.md`, em "Em aberto", antes de recomendar. Só então recomende, sem insistir, numa mensagem que não tenha outra pergunta, seguir numa conversa nova. Diga assim:
> "Metade do caminho. Uma dica: para o sistema ficar mais rápido daqui para a frente, abra uma conversa nova **nesta mesma pasta** e escreva **continuar**. Eu sigo da etapa 4, com tudo o que você já respondeu. Se preferir ficar aqui, também dá."
- Se ela trocou, a conversa nova retoma pelo `base-camp.md` e anota a troca (veja "Como começar ou retomar" na `SKILL.md`). Se ela preferir ficar, anote em "Pedidos sobre o kit", no `base-camp.md`: "seguiu na mesma conversa depois da etapa 3".
- Motivo (não diga à pessoa): cada resposta carrega a conversa inteira; numa conversa nova, a segunda metade fica mais leve e mais rápida, e gasta menos do plano dela. Serve também de teste de que a retomada funciona.

---

## Etapa 4: as regras da casa (5 a 10 min) [leve]
**Arquivos:** `memoria.md` (modelo `modelos/memoria.md`) e a seção "Regras" do `AGENTS.md` (vai para o rascunho `montagem/regras.md`).
**Abra com:** "Etapa 4 de 6: as regras da casa. Quase tudo já vem pronto; você só confere. Leva uns 5 minutos."

4.1 [leve] Mostre as regras numeradas e peça para ela marcar o que tira, muda ou acrescenta:
> "Estas são as regras que o seu sistema vai seguir. Quer tirar, mudar ou acrescentar alguma? Pode responder só com os números (ex.: 'tira a 5, muda a 2 para...')."
> 1. Antes de supor qualquer coisa, a IA pergunta.
> 2. Nada sai do computador sem o seu ok: e-mail, mensagem, publicação, compra, dinheiro.
> 3. Toda tarefa começa dizendo o que é "pronto": o que vai ser entregue, em que formato e onde fica.
> 4. Quando você corrige algo, a correção vira uma regra escrita, para não repetir.
> 5. <a regra do formato, tirada da etapa 3; ex.: "Resposta primeiro, detalhe depois, em poucas linhas.">
> 6. Assunto de uma frente não vai para outra sem você pedir. <mais o que ela disse na 2.4>
> 7. Dados da empresa onde você trabalha só entram com autorização da empresa.
→ `REGRAS.lista`
- Monte a regra 5 a partir de `JEITO.formato` e `JEITO.irrita`. Se a etapa 3 foi pulada, use "Resposta primeiro, detalhe depois."
- Se ela não trabalha numa empresa de outra pessoa, tire a 7 e diga por quê.

4.2 "Tem algum assunto que a IA nunca deve guardar nem repetir, em nenhuma frente?" → `REGRAS.sigilo`

**Feche** mostrando o `memoria.md` e as regras. Depois, **confira os arquivos já aprovados contra as regras novas** (a separação entre frentes, os dados da empresa e o que nunca se guarda): se algum deles contrariar uma regra (por exemplo, o nome de um cliente num exemplo), mostre a troca em uma linha e peça o ok.

---

## Etapa 5: o primeiro workflow (15 a 25 min, mais o tempo de fazer a tarefa, se ela cronometrar hoje) [leve]
**Arquivo:** o cartão do workflow, em `frentes/<frente>/workflows/<nome-curto>.md` (no leve: `workflows/<nome-curto>.md`), pelo modelo `modelos/workflow.md`. O nome curto, sem espaço nem acento, você sugere e ela confirma (ex.: `proposta-de-cliente`).
**Abra com:** "Etapa 5 de 6: o primeiro workflow. Workflow é o caminho de uma tarefa sua, do ponto de partida até a entrega. Cada frente sua é um conjunto deles, e o seu sistema cresce aprendendo um de cada vez. Hoje a gente escolhe o primeiro, desenha o caminho como ele é hoje e mede quanto tempo leva. Leva uns 20 minutos."
- É a primeira vez que "workflow" aparece: a linha de explicação acima é obrigatória. Depois, use a palavra normalmente.

5.1 [leve] "Liste até 5 tarefas que você repete toda semana ou todo mês, em qualquer frente. De cada uma: quanto tempo leva, mais ou menos." → `PROC.candidatas`
- Se `DIA.perde-tempo` ou `PROC.candidatas` já têm algo, comece por aí: "Você já citou X e Y. Tem mais alguma?"
5.2 [leve] "Dessas, quais geram ou poupam dinheiro, para você ou para a frente?" → `PROC.dinheiro`
5.3 [leve] **Você sugere 1 ou 2**, dizendo que é sugestão e por quê, pelos critérios abaixo, e ela escolhe (escolha fechada: com a ferramenta de pergunta com opções, se você tiver). → `PROC.escolhido`
   - gera ou poupa dinheiro (obrigatório, se houver alguma que gere);
   - repete pelo menos uma vez por semana ou por mês;
   - as informações de que ela precisa estão no computador ou num lugar que ela acessa (planilha, e-mail, site, documento);
   - o resultado dá para conferir (um relatório, uma lista, um texto, um número);
   - não depende de outra pessoa aprovar para começar;
   - não usa dados da empresa sem autorização.
   Explique em palavras simples: "Eu começaria pela X, porque ela se repete toda semana, você já tem as informações na planilha e dá para conferir se ficou certo."
5.4 [leve] "Agora o começo e o fim desse caminho. O que faz essa tarefa começar, e de onde vêm as informações? E no fim: o que sai, em que formato, e para quem vai?" → `PROC.entrada`, `PROC.saida`, `PROC.para-quem`
5.4a [leve] "Me conte como você faz hoje, passo a passo, do começo até a entrega. Pode ser solto, do jeito que vier; eu organizo." → `PROC.passos`
- Organize em passos numerados, curtos, com as palavras dela (o que se faz, com que programa ou arquivo). Mostre a lista em poucas linhas e pergunte se falta algum passo ou se a ordem está certa.
- Não detalhe cada passo agora (critérios, exceções, quem passa a fazer): isso é o Campo 1. Passo que ela não souber dizer fica "a completar no Campo 1".
5.5 [leve] "Quanto tempo ela levou da última vez que você fez, e quando foi? Se puder, faça uma vez hoje, cronometrando, e me diga o tempo." → `PROC.antes`
- Grave o tempo com a data e a origem: "medido hoje" ou "lembrança dela, da última vez em <data>". Esse é o "antes": o número contra o qual o resultado vai ser medido. Se ela não souber, peça uma estimativa e marque "estimativa".
- Grave também quantas vezes por mês a tarefa acontece e as horas por mês (o tempo vezes as vezes, com a conta à vista). Se a frequência não ficou clara nas respostas, pergunte numa frase.
- Anote se ela tem hora certa (acontece num dia e horário fixos, como toda segunda de manhã) ou se acontece quando aparece (como um orçamento que um cliente pede). Não pergunte se já ficou claro. Isso decide o passo depois do Campo 2: quando tem hora certa, ela pode passar a chegar sozinha.
5.6 "Quando essa tarefa estiver pronta, como você sabe que ficou certa? O que não pode faltar?" → `PROC.pronto`
5.7 [leve] "O que pode travar essa tarefa? Depende de alguém aprovar, de um acesso que você não tem, de uma informação que não está com você?" → `PROC.dependencias`
- É o que mais faz um workflow parar no meio. Se aparecer uma dependência, anote quem ou o quê, e o que fazer antes do Campo 1 (ex.: pedir o acesso).

**Feche** mostrando o cartão do workflow inteiro, com uma linha antes: "Este é o cartão do seu primeiro workflow: o caminho, os passos de hoje e o tempo de partida. No Campo 1 ele ganha os detalhes e o que o sistema aprender." Com a aprovação, grave no `base-camp.md`, logo abaixo da linha **Montagem:**, a linha `- **Primeiro workflow:** \`<caminho do cartão>\`` (é assim que o painel o encontra). No completo, acrescente o workflow na tabela "Workflows" da ficha da frente; no leve, no rascunho do mapa (`montagem/mapa-das-frentes.md`), para entrar no `AGENTS.md` da raiz na 6.1.

---

## Etapa 6: o teste e a primeira tarefa (20 a 35 min) [leve]
**Arquivos:** `AGENTS.md` (final), `CLAUDE.md` (já existe; confira), `resumo-para-o-arthur.md` (modelo `modelos/resumo-para-o-arthur.md`), `como-usar.md` (modelo `modelos/como-usar.md`) e `base-camp.md` (concluído).
**Abra com:** "Etapa 6 de 6: o teste e a primeira tarefa. Eu junto tudo no arquivo principal do seu sistema, a gente confere se ele já sabe quem você é e, no fim, ele faz a primeira tarefa para você. Leva uns 25 minutos."

6.0 [leve] **O computador** (sem pergunta para ela): faça o inventário pela skill `rotinas-e-computador` (seção 5), um comando de cada vez, e grave `contexto/computador.md` no formato de lá. Diga em uma linha o que achou, sem jargão ("O seu Mac tem o Excel e ainda não tem o Python; anotei, para o sistema usar as ferramentas certas quando for mexer nas suas planilhas."). Não pede aprovação: é uma ficha técnica. Se faltar algo que o primeiro workflow vai precisar (ex.: o Python, para um workflow com planilha), anote na ficha, em "Pendências da máquina", e no cartão do workflow, em "O que pode travar".

6.1 [leve] Monte o `AGENTS.md` final pelo modelo, com o mapa e as ferramentas (`montagem/mapa-das-frentes.md`) e as regras (`montagem/regras.md`). **Grave com a seção temporária "Montagem em andamento"** logo abaixo do título (o texto está no fim do modelo): ela só sai no Fim, para que uma conversa nova no meio da etapa 6 retome a montagem. Na hora de mostrar, diga que essa seção é provisória. **Mostre o arquivo inteiro** (não um resumo dele) e peça aprovação. Diga antes: "É o arquivo principal, o mais longo. A maior parte você já aprovou nas etapas; o que é novo são as partes 'Em uso ou parado', 'Memória e lições' e 'Como este sistema cresce'."

6.2 [leve] O teste "quem sou eu":
- **Com a ferramenta `teste_do_base_camp`** (vem com o painel): use-a com a pergunta "quem sou eu e quais são as minhas frentes?". Ela responde só com o que está nos arquivos, como uma conversa nova responderia. **O teste vale pelo que ela vê:** faça os testes (6.2 e 6.3) numa mensagem só para eles, depois da aprovação do `AGENTS.md` e antes de qualquer outra coisa. Comece com "Agora o teste: perguntei a uma IA que só conhece os seus arquivos quem é você. Ela respondeu:", cole a resposta inteira, em citação, e só depois diga em uma linha se passou e por quê. Nunca resuma um teste em "passou" sem mostrar a resposta (no teste 3 do kit, os dois testes rodaram calados e a pessoa só leu "os dois testes passaram").
- **Sem a ferramenta:**
> "Agora o teste. Abra uma conversa nova **nesta mesma pasta** (no app: o botão de nova sessão, escolhendo esta pasta) e escreva lá: **'quem sou eu e quais são as minhas frentes?'**. Copie a resposta e cole aqui."
- Compare com `sobre-mim.md` e o mapa. Passa se acertar o nome, o trabalho principal e todas as frentes do mapa, sem inventar nada. Se errar ou inventar, corrija o arquivo que causou o erro, mostre a correção e repita o teste.
- Sem a ferramenta, se ela não conseguir abrir a conversa nova, veja `ajuda.md` ("conversa nova"). Se mesmo assim não der, marque o teste como "não feito" no `base-camp.md`; não faça o teste você mesmo nesta conversa, porque aqui você já sabe tudo e o teste não provaria nada.

6.3 O teste de separação: com a ferramenta, pergunte "escreva uma mensagem curta apresentando o meu trabalho em <frente A>"; sem ela, peça na conversa nova. Passa se nada de outra frente ou do que ela marcou como sigiloso aparecer. Mostre também esta resposta inteira, em citação, na mesma mensagem do 6.2, com uma linha do que foi conferido (ex.: "nada da outra frente nem dos números que você pediu para guardar apareceu").

6.4 [leve] Revisão final: liste os arquivos criados, com uma linha de cada. Liste também, numa linha, o que ficou "a completar" (perguntas puladas, campos vazios) e pergunte se ela quer completar algum agora ou depois.

6.5 [leve] O resumo para o Arthur: escreva o `resumo-para-o-arthur.md` pelo modelo e mostre. Diga:
> "Este é o resumo do seu Base Camp em uma página. Se você quiser que o Arthur revise e dê mais robustez ao seu sistema, é só mandar para ele. Eu não envio nada: quem manda é você."
- No **leve**, troque por: "Se quiser que o Arthur dê uma olhada no seu Base Camp, este resumo é o que ele precisa. Mande para ele quando quiser."

6.6 [leve] O guia de bolso: escreva o `como-usar.md` pelo modelo, com as frentes e as palavras dela, e mostre. Diga antes: "Este é o seu guia de bolso: como usar o sistema no dia a dia, em uma página."

6.7 [leve] **A primeira tarefa** (o primeiro resultado prático do sistema):
- Proponha **3 primeiras tarefas reais e pequenas** (cabem em 5 minutos), tiradas do que ela contou, de preferência uma por frente principal. Exemplos do tipo: "escreva a mensagem de retorno para o cliente da consultoria, no meu jeito"; "monte a lista do que conferir no fechamento do restaurante"; "resuma o que está parado nas minhas frentes e o próximo passo de cada uma". Nada que mande algo para fora do computador nem que use dados da empresa sem autorização.
- Grave as 3 no `base-camp.md`, na seção "Primeiras tarefas", uma por linha, começando com "- ", cada uma com até 70 caracteres (o painel mostra cada uma como um botão).
- Pergunte qual ela quer agora (escolha fechada: com a ferramenta de pergunta com opções, se você tiver) e **faça na hora**, seguindo as regras dela (o formato, o sigilo, o rascunho em vez do envio). Se a tarefa mexer em arquivo ou planilha do computador, siga a skill `rotinas-e-computador`. **Se ela aprovar o resultado, grave-o** em `frentes/<frente>/modelos/` (no leve, `modelos/`), com uma linha em "Modelos aprovados" da ficha da frente (no leve, no `AGENTS.md` da raiz): aprovado só na conversa se perde. No fim, pergunte se ficou bom e anote no `base-camp.md`, em "Primeiras tarefas", numa linha que começa com **Feita:** (sem traço), qual foi feita e o que ela achou (ex.: "Feita: a mensagem de retorno · achou boa, pediu mais curta").
- Diga numa linha que as outras ficam guardadas para quando ela quiser.
- **O combinado** (é o que faz o sistema virar hábito): pergunte, numa pergunta só, em que momento de amanhã ela vai abrir o sistema de novo e o que vai pedir (ex.: "amanhã, às 8h, antes dos e-mails, a lista do fechamento"). Grave no `base-camp.md`, em "Primeiras tarefas", numa linha que começa com **Combinado:** (sem traço), e no `como-usar.md`, na seção "O seu combinado".

**Fim:** tire do `AGENTS.md` da raiz a seção "Montagem em andamento" (o resto foi aprovado na 6.1; não reescreva), marque tudo como concluído no `base-camp.md` com a soma dos tempos e mande:
> "**Base Camp montado.** O seu sistema já sabe quem você é, o que você toca e como você trabalha, já fez a primeira tarefa para você, e o primeiro workflow está desenhado, do começo à entrega, com o tempo de hoje anotado.
> Combinado: <o combinado dela, com as palavras dela>. O resto está no seu guia de bolso.
> O próximo passo é o Campo 1, na primeira montanha: detalhar o seu primeiro workflow passo a passo e rodá-lo de ponta a ponta com o sistema, numa conversa nova. Quando for a hora, abra uma conversa nesta pasta e escreva: **'vamos rodar o primeiro workflow'**.
> Business Creator powered by SEM IA™. Um sistema, qualquer IA."
