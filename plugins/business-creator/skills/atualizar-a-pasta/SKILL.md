---
name: atualizar-a-pasta
description: Leva para a versão atual do método uma pasta que já tinha o Base Camp montado numa versão anterior (o kit em zip, ou o plugin antes da 0.2.17), sem apagar nada do que é da pessoa - as permissões que param de pedir ok a cada comando, a ficha do computador, o primeiro processo virando o cartão do primeiro workflow com o pedido dela, e as seções novas da ficha da frente, do AGENTS.md e do guia de bolso. Use quando a pessoa escrever "atualizar o meu sistema", "atualizar a pasta" ou "atualizar para o plugin", ou quando o base-camp.md estiver concluído e a pasta não tiver o contexto/computador.md ou o cartão do primeiro workflow (há um primeiro-processo.md, ou a tabela da montagem tem as etapas 1 a 6).
---

# Atualizar a pasta para a versão atual

> Plugin Business Creator 0.2.18 (03/11/2026). Nasceu da primeira cliente, que montou o Base Camp com o kit em zip (v1.6) e passa para o plugin sem refazer a montagem (decisão do Arthur, 03/11/2026: atualizar a pasta dela sem zerar; os arquivos dela continuam valendo).

A pessoa já tem o sistema montado. Ela não refaz nada: o que ela escreveu e aprovou continua valendo. Esta skill só acrescenta o que as versões novas do método trazem e tira da pasta as cópias antigas do kit, que agora chegam pelo plugin.

## Linha de chegada
A atualização está pronta quando:
1. o `.claude/settings.json` da pasta tem as permissões de `permissoes.json` (desta skill), o marketplace `sem-ia` com a atualização ligada e o plugin ligado, e não tem mais a linha `outputStyle`; o resto do que estava nele continua;
2. as cópias antigas do kit (`.claude/skills/montagem-do-base-camp/`, `.claude/skills/base-camp/`, `.claude/output-styles/`) saíram de `.claude/` e estão em `montagem/kit-anterior/`, com o `LEIA.md`;
3. existe o `contexto/computador.md`;
4. existe o cartão do primeiro workflow, com as linhas **Pedido**, **Combinado** e **Estado**, e o `base-camp.md` aponta para ele na linha **Primeiro workflow**;
5. a ficha da frente, o `AGENTS.md` da raiz e o `como-usar.md` têm as seções novas, com o que já se sabe dela;
6. o `base-camp.md` tem a linha **Atualizada:** e a nota em "Pedidos sobre o kit".
Se a pasta já tem a linha **Atualizada:** no `base-camp.md`, nada disso se faz: diga em uma linha que ela já está na versão nova e responda ao que ela pediu.

## Regras que não se negociam
- **Nada da pessoa se apaga, se move ou se reescreve.** Os arquivos dela (o retrato, as fichas, a memória, as planilhas, os modelos) só ganham seções; o texto dela fica como está. As únicas coisas que mudam de lugar são as 3 cópias do kit, e vão para `montagem/kit-anterior/`, nunca para a lixeira.
- **Dado da empresa fica onde está.** Se houver arquivo da empresa na pasta, não mova, não copie e não abra além do nome. Se não houver regra de quem autoriza o uso, isso vira trava do workflow (passo 5), não decisão sua.
- **O `settings.local.json` não se toca.** É dela e do app.
- **Só as ferramentas de arquivo para ler e gravar.** Os comandos desta skill são: a hora, os do inventário (skill `rotinas-e-computador`, seção 5) e um só para mudar as cópias do kit de lugar. Cada comando sozinho, sem `;`, `&&` ou `|`.
- **Duas permissões, ditas antes:** a mudança do `settings.json` e a mudança de lugar das cópias pedem o ok dela no app. Avise uma vez, no começo, e diga o que cada uma é quando for pedir.
- **Sem jargão** e no formato de mensagem do Base Camp: uma linha do que fez, `---`, o pedido da vez em negrito.

## O passo a passo (uma conversa, uns 10 minutos)

### 1. Conferir e avisar
- Leia o `base-camp.md`. Sem ele na raiz da pasta aberta, pare e diga como abrir a pasta do computador dela no app. Com a montagem por concluir, esta skill não se aplica: siga a `montagem-do-base-camp`.
- Pegue a hora (`Get-Date -Format "dd/MM/yyyy HH:mm"` no Windows; `date "+%d/%m/%Y %H:%M"` no Mac).
- Leia, uma vez, o `AGENTS.md` da raiz, a ficha da frente prioritária, o `como-usar.md`, o `primeiro-processo.md` (se houver) e o `.claude/settings.json`.
- Diga, numa mensagem só, e siga sem esperar resposta:
> "Vou atualizar o seu sistema para a versão nova do método. Nada do que é seu se apaga. O app vai pedir o seu ok duas vezes: uma para mudar as permissões da pasta (é o que faz ele parar de pedir ok a cada passo) e uma para guardar a versão antiga do kit numa pasta de arquivo. Leva uns 10 minutos."

### 2. As permissões (`.claude/settings.json`)
- Leia `permissoes.json`, nesta pasta da skill. Reescreva o `.claude/settings.json` dela juntando: o que já estava nele (idioma, frases de espera, aviso do topo e qualquer outra chave), **trocando** o bloco `permissions` pelo de `permissoes.json`, **acrescentando** `extraKnownMarketplaces` e `enabledPlugins` como estão lá e **tirando** a linha `outputStyle` (o jeito de responder agora vem do plugin). Se o aviso do topo (`companyAnnouncements`) tiver `{{marca}}`, troque por "Business Creator powered by SEM IA™".
- Antes de gravar, uma linha: "Agora o app vai pedir o seu ok para mudar as permissões da pasta. Pode aprovar." Se ela recusar, siga com o resto e anote em "Pedidos sobre o kit": "permissões não atualizadas".

### 3. As cópias antigas do kit
- Veja com a ferramenta de busca de arquivos quais destas existem: `.claude/skills/montagem-do-base-camp/`, `.claude/skills/base-camp/`, `.claude/output-styles/`. Se nenhuma, pule para o passo 4.
- Grave `montagem/kit-anterior/LEIA.md` (a ferramenta de gravar cria a pasta):
```
# A versão anterior do kit
> Guardada em <data> pela atualização para o plugin Business Creator <versão>.
Estas pastas eram a montagem, o painel e o jeito de responder do kit em zip. Agora chegam pelo plugin, que se atualiza sozinho. Ficam aqui só como registro; o sistema não lê esta pasta.
```
- Uma linha antes: "Agora o app vai pedir o seu ok para guardar a versão antiga do kit na pasta de arquivo. Pode aprovar." Então **um comando só**, com as que existem:
  - Windows (PowerShell): `Move-Item -Path .claude\skills\montagem-do-base-camp, .claude\skills\base-camp, .claude\output-styles -Destination montagem\kit-anterior`
  - Mac (Bash): `mv .claude/skills/montagem-do-base-camp .claude/skills/base-camp .claude/output-styles montagem/kit-anterior/`
- Se der erro, não tente de novo em sequência: anote em "Pedidos sobre o kit" o erro em uma linha e siga. As cópias antigas na pasta não estragam nada até a próxima conversa; só duplicam o painel.

### 4. O computador
Se não existir `contexto/computador.md`, faça o inventário pela skill `rotinas-e-computador` (seção 5) e grave. Numa máquina da empresa sem Python, a pendência "pedir à TI o Python com a biblioteca de planilhas" vai para as Pendências da ficha da frente de trabalho.

### 5. O primeiro workflow
- **Se já existe um cartão em `workflows/`** com a linha Pedido, só confira que o `base-camp.md` aponta para ele.
- **Se existe o `primeiro-processo.md`** (o kit em zip): crie o cartão em `frentes/<frente>/workflows/<nome-curto>.md` (no nível leve, `workflows/`) pelo modelo `workflow.md` da skill `montagem-do-base-camp`, levando tudo o que está no `primeiro-processo.md`, com as palavras dela:
  - **Pedido:** as 2 a 5 palavras que ela vai escrever para rodar, tiradas de como ela fala da tarefa (o `como-usar.md`, o combinado, o próprio processo), em minúsculas. É sugestão sua: ela troca na mensagem final;
  - **Combinado:** o de "O seu combinado" do `como-usar.md`, reescrito no formato do modelo, com o pedido;
  - **Os passos:** os de "Como é hoje", "quem faz: ela", "como é hoje"; o que não estiver lá, "a completar nas rodadas";
  - **O antes:** a tabela como está no `primeiro-processo.md`;
  - **As rodadas:** se o `base-camp.md` (seção "Primeiras tarefas") ou o `resumo-para-o-arthur.md` registram que a tarefa já foi feita com o sistema, uma linha com a data e "antes da atualização"; senão, vazia;
  - **Estado:** "incompleto: a primeira rodada pelo plugin está por fazer", ou "em andamento" se já rodou;
  - **O que pode travar:** o que estava no `primeiro-processo.md` e, **se o workflow usa dado da empresa e o `AGENTS.md` da raiz não diz quem autoriza esse uso**, a linha "Dados da empresa: falta registrar quem autoriza o uso neste sistema" (a skill `campo-1` resolve isso com ela antes de rodar). **Se o primeiro passo depende de uma fonte que não está na pasta nem com ela** (um sistema, a planilha de outra pessoa), diga isso aqui com todas as letras; nunca escreva que o dado existe se ele não está ao alcance.
  - No topo do `primeiro-processo.md`, acrescente só uma linha: `> Virou o cartão do workflow em \`<caminho>\`, em <data>.` O resto do arquivo fica.
- **Se não existe nem cartão nem `primeiro-processo.md`:** não invente um. Anote em "Em aberto" do `base-camp.md`: "escolher o primeiro workflow", e na mensagem final peça, em vez do pedido, "me diga qual tarefa você repete e quer ver rodando".
- No `base-camp.md`: a linha `- **Primeiro workflow:** \`<caminho do cartão>\`` logo abaixo da linha **Montagem:**; a seção "O primeiro workflow" (se não existir, depois de "Testes"), com `**Escolhido:** <pedido> · em <data da montagem, se souber; senão, a de hoje>` e `**Combinado:** quando <gatilho>, abra esta pasta e escreva **<pedido>**`. A seção "Primeiras tarefas", se houver, fica como está.

### 6. As seções novas
Acrescente só o que falta, pelo modelo atual da skill `montagem-do-base-camp`, no lugar que o modelo indica, com o que já se sabe dela (o que não se sabe fica "Nenhuma ainda"):
- **Ficha da frente do workflow** (`frentes/<frente>/AGENTS.md`): Workflows (o primeiro, com o cartão; os outros processos que ela citou, como os próximos), Palavras minhas, Pendências (com as da máquina e as perguntas que o `resumo-para-o-arthur.md` deixou abertas), Rotinas (o que já existir em `rotinas/` da frente; senão, "Nenhuma ainda") e Modelos aprovados. Crie as pastas `rotinas/` e `modelos/` da frente só quando houver o que gravar nelas.
- **`AGENTS.md` da raiz:** O meu computador; e, em "Como este sistema cresce", as linhas do modelo que faltam (cada frente é um conjunto de workflows; um workflow por conversa, vários abertos ao mesmo tempo, cada um com o seu cartão, com o caminho do primeiro; se a pasta já tem a linha antiga "um workflow de cada vez", ela é trocada por esta; a primeira montanha; tarefa que se repete sem cartão; rotina não se perde; o que eu aprovo vira arquivo; nada fica no ar; toda tarefa tem linha de chegada). As regras dela ficam como estão; se uma linha nova repete uma dela, fique com a dela.
- **`como-usar.md`:** "O seu primeiro workflow" (no lugar de "O seu combinado" e "O próximo passo: o Campo 1", que viram esta seção só), o pedido em "Pedidos que já funcionam", "Permissões: quando o app pede o seu ok" e, em "Se travar", a linha do **tente novamente**.
- **`resumo-para-o-arthur.md`:** uma seção "Atualização para o plugin (<data>)", em até 5 linhas: de que versão veio, o que entrou, o pedido do primeiro workflow e o que ficou pendente. Sem dado da empresa.

### 7. Fechar
- No `base-camp.md`: `- **Atualizada:** plugin <versão>, em <data hora>` logo abaixo de **Concluída em:**, e em "Pedidos sobre o kit": "veio de <o kit em zip vX.Y | o plugin X.Y>; atualizada em <data>".
- A mensagem, depois de tudo gravado:
> "Atualizei o seu sistema. Nada do que era seu mudou; entrou o que a versão nova traz:
> - a pasta já não pede o seu ok a cada passo (apagar, baixar da internet e mandar algo para fora continuam pedindo);
> - o sistema conhece o seu computador (`contexto/computador.md`);
> - o seu primeiro workflow ganhou um cartão, com o pedido **<pedido>** (se quiser outras palavras, diga);
> - <o que ficou pendente, em uma linha, se houver; ex.: "falta registrar quem autoriza os dados da empresa: o sistema pergunta na primeira rodada">.
> ---
> **Abra uma conversa nova nesta pasta e escreva <pedido>.**"
- A conversa nova é necessária: as permissões, o painel e o jeito de responder novos só valem a partir dela.
