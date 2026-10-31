# Changelog do plugin Business Creator

Cada versão é aprovada pelo Arthur depois de testada numa pasta limpa, fora do OS (decisão 4 da proposta de 29/10/2026).

## 0.2.8 (31/10/2026)
Da proposta "jornada de zero clique" (Arthur, 31/10, 12:33), o que entra agora, com a regra dele: "trazer o que é um sinal claro para a implementação do sistema", não ruído.
- **O texto para a outra IA** junta o de 6 seções ao do item: 8 seções (quem é; o que toca; as tarefas que se repetem, inclusive o que já pediu mais de uma vez; o que trava; as ferramentas; como gosta de receber; as pessoas, só pelo papel; o que quer), no máximo 5 linhas cada, só o que serve ao sistema, a resposta num único bloco de código (que se copia de volta com um botão) e cada linha com a data [AAAA-MM] ou [?] e a marca [eu disse] ou [deduzido].
- **Sinal, não ruído:** a montagem grava só o que preenche um campo; o resto da resposta da outra IA fica de fora.
- **"Já sei isto / Falta isto":** depois da conferência, duas listas curtas; as etapas perguntam só o que falta.
- **O primeiro workflow já sugerido:** a etapa 5 começa pelas tarefas que já vieram, em vez de pedir a lista do zero (montagem 1.13, roteiro 1.11).
- Ficam para depois: a leitura dos conectores no "olá" (Campo 1, na 0.3), o zip de exportação (Campos 2 e 3) e a contagem de gestos (medida de domingo).

## 0.2.7 (31/10/2026)
- **O painel mostra o andamento da etapa atual, não a lista das próximas** (melhoria 12 do teste do Arthur, 31/10: "ao invés de mostrar o passo a passo das próximas etapas, acho que podemos mostrar o andamento da etapa atual"). Em curso, a subida vira uma linha só (● a etapa atual, ✓ as feitas, ○ as que faltam) e o destaque é o que a etapa já tem. No começo, o painel mostra os 2 pedidos da abertura (o que a outra IA sabe, as palavras dela) e a conferência, cada um com ✓ quando chega. A lista inteira das etapas fica só nas boas-vindas, antes de a montagem começar.

## 0.2.6 (31/10/2026)
O que vem da outra IA pode estar velho (correção 11 do teste do Arthur, 31/10: a fala da pessoa "vai ser mais atual em relação ao momento e às intenções dela"; a outra IA "pode trazer coisas do passado que não se aplicam mais").
- **Regra:** o que a pessoa fala ou escreve hoje vale mais; em conflito, ganha a fala dela, sem perguntar.
- **O texto para a outra IA** pede, em cada item, quando aquilo apareceu pela última vez (mês e ano, ou "sem data"), e separa a resposta em "Atual" (últimos 3 meses) e "Pode estar desatualizado".
- **A conferência (D.2):** depois do "terminei", a montagem leva à pessoa só os itens da outra IA em dúvida (deduzidos, antigos ou sem data, ou que podem ter sido mal entendidos), no máximo 8, com clique: Vale hoje, Não vale mais, Está errado (montagem 1.12, roteiro 1.10).

## 0.2.5 (31/10/2026)
A abertura em 2 pedidos (correção 10 revisada pelo Arthur, 31/10: "vão ser só 2 pedidos"), no lugar das 3 perguntas e das sugestões de LinkedIn e rede social da 0.2.4.
- **Pedido 1:** o texto para a IA que a pessoa mais usa, numa caixa de código com o botão de copiar, para ela colar lá e trazer a resposta. O texto foi reescrito para o resultado que a montagem precisa: um retrato em 6 seções (quem é, o que toca, as tarefas que repete, os programas, como gosta de receber, o que quer), cada item marcado [eu disse] ou [deduzido], sem inventar e sem saúde, finanças pessoais, senhas, família íntima nem dados de cliente ou da empresa. **A revisar pelo Arthur.**
- **Pedido 2:** enquanto a outra IA escreve, a pessoa conta com as palavras dela, escrevendo ou por voz: quem é, o que faz e o que pretende. O que ela conta vale mais que o da outra IA quando os dois falarem da mesma coisa.
- Sem escolha e sem ferramenta externa; quem não usa outra IA manda só o pedido 2 (montagem 1.11, roteiro 1.9).

## 0.2.4 (31/10/2026)
A montagem guiada, sem escolhas (correção 10 do teste do Arthur, 31/10: "o mínimo de decisões possíveis para o usuário e o máximo de orientações objetivas"; "se é um kit de implementação guiada, é para ela ser guiada").
- **A abertura não pergunta mais "conto do meu jeito ou vá perguntando".** Ela pede, de uma vez, 3 coisas: o que a pessoa faz no dia a dia e tudo o que toca; o que quer que o sistema faça por ela, no trabalho ou na vida pessoal; uma tarefa que repete e que toma tempo. E sugere o que acelera, sem escolha: o PDF do LinkedIn, se atualizado; o texto de um perfil público; um currículo ou uma bio. A etapa D vira o começo de sempre (montagem 1.10, roteiro 1.8).
- **Regra geral:** o sistema não pergunta como ela prefere fazer nem se quer seguir; ao fechar uma etapa, já abre a próxima; depois da etapa 3, orienta a conversa nova em vez de oferecer. Ela só escolhe o workflow (5.3) e a primeira tarefa (6.7).
- **Não procura a pessoa na internet:** o que entra é o que ela manda (no teste, o sistema buscou o LinkedIn por conta própria).

## 0.2.3 (31/10/2026)
- **Sai do painel o botão "Ler as perguntas em voz alta"** e a leitura em voz alta das respostas (melhoria 9 do teste do Arthur, 31/10: "retirar esse botão que tem lá no painel de ler as perguntas em voz alta"). Responder por voz, pelo ditado do computador, continua.

## 0.2.2 (31/10/2026)
Correções do teste do Arthur na pasta limpa (31/10, observações 3, 4, 6, 7 e 8 em `laboratorio-os/2026-10-31-implantacao-arthur-observacoes.md`). Publicada com a autorização dele para o ciclo de teste ("pode publicar cada correção do teste sem me perguntar").
- **Plugin não instalado (trava):** o app adicionou o marketplace pela pasta, mas não instalou o plugin. O esqueleto da pasta passa a conferir isso: sem a skill da montagem, o sistema não procura arquivos nem roda comandos; mostra os 3 passos de instalação (o **+**, Plugins, instalar "para o projeto (compartilhado)") e pede uma conversa nova. O README e o guia de instalação ganham o passo antes do "oi".
- **A abertura (atrapalha):** o texto de boas-vindas vai inteiro, escrito, antes da caixa das duas opções; a caixa nunca vem sozinha (montagem 1.9, roteiro 1.7).
- **Nada de nota interna na tela:** tudo o que o sistema escreve é para a pessoa, em português; nada em inglês nem sobre o que ele vai ler.

## 0.2.1 (30/10/2026)
A visão de workflow entra na montagem e no Campo 1 (direção do Arthur em 30/10/2026: "o que a gente faz no campo 1, 2 e 3 da primeira montanha é justamente montar o primeiro workflow de ponta a ponta"; decisões 2 e 3 aprovadas por ele: o termo "workflow" com uma linha de explicação, e o sinal de completo).
- **O vocabulário:** cada frente é um conjunto de workflows; workflow é o caminho de uma tarefa, do ponto de partida até a entrega; os passos são feitos pela pessoa, por rotinas gravadas ou por skills, e toda skill nasce de um passo de workflow. No estilo de resposta, no `AGENTS.md` da raiz e na ficha da frente (tabela "Workflows").
- **A etapa 5 vira "o primeiro workflow"** (montagem 1.8, roteiro 1.6): o começo e a entrega, os passos de hoje com as palavras dela (pergunta nova 5.4a, campo `PROC.passos`) e o "antes". Sai o `primeiro-processo.md`; entra o **cartão do workflow**, em `frentes/<frente>/workflows/<nome>.md` (no leve, `workflows/`), com os passos, quem faz cada um, o que o sistema aprendeu, as rodadas e o estado. O `base-camp.md` ganha a linha **Primeiro workflow** com o caminho do cartão.
- **Skill nova `campo-1`:** detalhar e aprender o workflow passo a passo (o que entra, o que ela faz, o critério de cada decisão, as exceções, o que sai), decidir com ela quem faz cada passo e rodar de ponta a ponta com um caso de verdade, gravando no cartão. Completo é quando o workflow roda do começo à entrega com um pedido só dela e ela aprova a entrega.
- **Painel:** lê o cartão pela linha do `base-camp.md` (e o `primeiro-processo.md` nas pastas de antes); fala em workflow na etapa 5 e no Campo 1.

## 0.2.0 (30/10/2026)
As lições da primeira implantação com pessoa real (avaliação de 30/10/2026, mudanças M1, M2, M3, M5 e M6; decisões 1, 2 e 6 aprovadas pelo Arthur em 30/10). O que travava o uso real depois do Base Camp.
- **Skill nova `rotinas-e-computador`:** antes de rodar algo, o sistema lê a ficha do computador; toda rotina que produz uma entrega fica gravada na pasta, com a conferência dentro; resultado zero, vazio ou fora de escala não sai sem conferência; o arquivo original nunca é editado; regras do Windows (UTF-8 com BOM, acento, vírgula decimal, Excel só fechado, `Get-Date`) e do Mac (Python sem abrir a janela de instalação, iCloud); sem Python numa máquina da empresa, vira pendência para a TI.
- **Montagem 1.7 (roteiro 1.5):** a etapa 6 começa pelo inventário do computador (6.0, sem pergunta) e grava `contexto/computador.md`. O `AGENTS.md` final, gravado na 6.1, leva a seção "Montagem em andamento" até o Fim, para a retomada no meio da etapa 6 funcionar. A primeira tarefa aprovada (6.7) vira arquivo em `modelos/`. A hora pelo `Get-Date` no Windows.
- **Estilo de resposta:** rotina gravada, conferência antes de entregar, o que ela aprova vira arquivo, palavras dela no glossário, nada fica no ar (Pendências).
- **Modelos:** a ficha da frente ganha Palavras minhas, Pendências, Rotinas e Modelos aprovados; o `AGENTS.md` da raiz ganha "O meu computador" e três regras em "Como este sistema cresce"; o guia de bolso e a ajuda ganham Permissões e "tente novamente".
- **Painel:** reconhece a hora no PowerShell e a ficha do computador.
- **Esqueleto da pasta (só para pastas novas):** libera os comandos do inventário e as rotinas de `rotinas/` e `frentes/`, no Bash e no PowerShell; apagar, baixar da internet e mandar para fora continuam pedindo o ok.

## 0.1.1 (29/10/2026)
- A montagem confere, antes de tudo, se o `base-camp.md` está na raiz da pasta aberta; se não estiver, não grava nada e explica como abrir a pasta do computador no app. Correção do atrito 5 do kit (aprovada em 28/10/2026), a primeira que chega pelo plugin, sem zip novo.

## 0.1.0 (29/10/2026)
- Primeira versão: o que já existia no kit de instalação v1.6, empacotado como plugin. A skill da montagem (v1.6), o painel (v0.5.1) e o estilo de resposta.
- O painel passa a ler o roteiro da montagem dentro do plugin (antes, na pasta da pessoa), e a ferramenta do teste da etapa 6 passa a se chamar `mcp__business-creator__teste_do_base_camp`.
- O estilo de resposta entra sozinho quando o plugin está ligado (`force-for-plugin`).
